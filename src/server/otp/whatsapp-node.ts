import { getEnv } from "@/server/config/env";
import { ApiError } from "@/server/utils/http";
import { phoneForWhatsAppNode } from "@/server/otp/phone";

type NodeSendResult = {
  ok: boolean;
  channel?: string;
  expires_in?: number;
  error?: string;
  messageId?: string | null;
  clientId?: string;
  message?: string;
};

function resolveClientId() {
  const env = getEnv();
  return (
    env.WHATSAPP_NODE_CLIENT_ID?.trim() ||
    env.OTP_DEFAULT_CLIENT_ID?.trim() ||
    ""
  );
}

function isNoClientError(status: number, raw?: string | null) {
  const text = (raw || "").toLowerCase();
  return (
    status === 503 ||
    text.includes("no connected whatsapp client") ||
    text.includes("no whatsapp client") ||
    text.includes("client available") ||
    text.includes("not connected")
  );
}

function friendlyNodeError(status: number, raw?: string | null) {
  const text = (raw || "").toLowerCase();
  if (isNoClientError(status, raw)) {
    return "WhatsApp is temporarily unavailable. Open the WhatsApp Node dashboard, connect a client (scan QR), and set WHATSAPP_NODE_CLIENT_ID to that client's id.";
  }
  if (text.includes("no lid for user") || text.includes("lid for user")) {
    return "WhatsApp could not find this number (No LID). Confirm the number is on WhatsApp, use country code + national digits only (e.g. 96170657961), reconnect the WhatsApp client, then retry.";
  }
  if (
    text.includes("not registered") ||
    text.includes("not a whatsapp") ||
    text.includes("no whatsapp user")
  ) {
    return "This phone number is not registered on WhatsApp.";
  }
  if (status === 401 || status === 403) {
    return "WhatsApp Node authentication failed. Check WHATSAPP_NODE_TOKEN.";
  }
  // Never show Node stack traces to the client
  const firstLine = (raw || "").split("\n")[0]?.trim();
  return firstLine || "Could not send WhatsApp verification code";
}

async function postOtpSend(input: {
  url: string;
  token: string;
  body: Record<string, string>;
  signal: AbortSignal;
}) {
  const response = await fetch(`${input.url}/api/otp/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input.body),
    signal: input.signal,
  });

  let data: NodeSendResult | null = null;
  try {
    data = (await response.json()) as NodeSendResult;
  } catch {
    data = null;
  }

  return { response, data };
}

export async function sendWhatsAppNodeOtp(input: {
  phoneE164: string;
  code: string;
}) {
  const env = getEnv();

  if (!env.OTP_WHATSAPP_NODE_ENABLED) {
    throw new ApiError("WhatsApp OTP is not enabled", 503, {
      code: "whatsapp_disabled",
    });
  }

  const url = env.WHATSAPP_NODE_URL?.replace(/\/$/, "");
  const token = env.WHATSAPP_NODE_TOKEN?.trim();
  const clientId = resolveClientId();

  if (!url || !token) {
    throw new ApiError("WhatsApp Node is not configured", 503, {
      code: "node_not_configured",
    });
  }

  const brand = env.APP_NAME || "Solv";
  const ttlMin = Math.max(1, Math.round(env.OTP_TTL_SECONDS / 60));
  const message = `Your verification code for ${brand} is ${input.code}. Valid for ${ttlMin} minutes. Do not share this code.`;

  const controller = new AbortController();
  const timeoutMs = env.WHATSAPP_NODE_TIMEOUT * 1000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const baseBody: Record<string, string> = {
    phone: phoneForWhatsAppNode(input.phoneE164),
    code: input.code,
    message,
  };

  try {
    const firstBody = { ...baseBody };
    if (clientId) firstBody.clientId = clientId;

    let { response, data } = await postOtpSend({
      url,
      token,
      body: firstBody,
      signal: controller.signal,
    });

    // Wrong/offline clientId → retry once and let Node pick any connected session.
    if (
      clientId &&
      (!response.ok || !data?.ok) &&
      isNoClientError(response.status, data?.error)
    ) {
      console.warn(
        "[whatsapp-node] No connected client for",
        clientId,
        "— retrying without clientId. Node error:",
        data?.error ?? response.status,
      );
      ({ response, data } = await postOtpSend({
        url,
        token,
        body: baseBody,
        signal: controller.signal,
      }));
    }

    if (!response.ok || !data?.ok) {
      console.error("[whatsapp-node] send failed", {
        status: response.status,
        error: data?.error ?? null,
        clientIdTried: clientId || null,
        nodeClientId: data?.clientId ?? null,
      });
      throw new ApiError(
        friendlyNodeError(response.status, data?.error),
        response.status >= 400 ? response.status : 502,
        {
          code: "whatsapp_send_failed",
          nodeError: data?.error ?? null,
        },
      );
    }

    if (data.clientId && clientId && data.clientId !== clientId) {
      console.warn(
        "[whatsapp-node] Node used a different clientId than configured. configured=",
        clientId,
        "node=",
        data.clientId,
        "— set WHATSAPP_NODE_CLIENT_ID to the client id Node returns.",
      );
    }

    if (data.messageId == null) {
      console.warn(
        "[whatsapp-node] Node returned ok without messageId; clientId=",
        data.clientId ?? null,
      );
    } else {
      console.info(
        "[whatsapp-node] Message delivered messageId=",
        data.messageId,
        "clientId=",
        data.clientId ?? null,
      );
    }

    return {
      channel: "whatsapp_node" as const,
      expiresIn: data.expires_in ?? env.OTP_TTL_SECONDS,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("WhatsApp Node request failed", 502, {
      code: "whatsapp_unreachable",
    });
  } finally {
    clearTimeout(timer);
  }
}
