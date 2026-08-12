import { getEnv } from "@/server/config/env";
import { ApiError } from "@/server/utils/http";
import { phoneForWhatsAppNode } from "@/server/otp/phone";

type NodeSendResult = {
  ok: boolean;
  channel?: string;
  expires_in?: number;
  error?: string;
};

function resolveClientId() {
  const env = getEnv();
  return (
    env.WHATSAPP_NODE_CLIENT_ID?.trim() ||
    env.OTP_DEFAULT_CLIENT_ID?.trim() ||
    ""
  );
}

function friendlyNodeError(status: number, raw?: string | null) {
  const text = (raw || "").toLowerCase();
  if (
    status === 503 ||
    text.includes("no connected whatsapp client") ||
    text.includes("client available")
  ) {
    return "WhatsApp is temporarily unavailable. Open the WhatsApp Node dashboard, connect a client (scan QR), and set WHATSAPP_NODE_CLIENT_ID to that client id.";
  }
  if (status === 401 || status === 403) {
    return "WhatsApp Node authentication failed. Check WHATSAPP_NODE_TOKEN.";
  }
  return raw || "Could not send WhatsApp verification code";
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

  const body: Record<string, string> = {
    phone: phoneForWhatsAppNode(input.phoneE164),
    code: input.code,
    message,
  };
  // Only send clientId when set — Node can fall back to OTP_DEFAULT_CLIENT_ID / any connected client.
  if (clientId) {
    body.clientId = clientId;
  }

  try {
    const response = await fetch(`${url}/api/otp/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    let data: NodeSendResult | null = null;
    try {
      data = (await response.json()) as NodeSendResult;
    } catch {
      data = null;
    }

    if (!response.ok || !data?.ok) {
      throw new ApiError(
        friendlyNodeError(response.status, data?.error),
        response.status >= 400 ? response.status : 502,
        {
          code: "whatsapp_send_failed",
          nodeError: data?.error ?? null,
        },
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
