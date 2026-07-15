import type { NextRequest } from "next/server";

/**
 * Resolve the public site origin behind reverse proxies (Easypanel/nginx).
 * Next often sees `http://localhost:80` internally — never expose that to Swagger.
 */
export function getPublicOrigin(req: NextRequest): string {
  const envUrl = process.env.APP_URL?.trim().replace(/\/$/, "");
  if (envUrl && /^https?:\/\//i.test(envUrl) && !isInternalHost(envUrl)) {
    return envUrl;
  }

  const forwardedHost = (
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    ""
  )
    .split(",")[0]
    ?.trim();

  const forwardedProto = (
    req.headers.get("x-forwarded-proto") ||
    req.nextUrl.protocol.replace(":", "") ||
    "https"
  )
    .split(",")[0]
    ?.trim();

  if (forwardedHost && !isInternalHostname(forwardedHost)) {
    const proto = forwardedProto === "http" ? "http" : "https";
    return `${proto}://${forwardedHost}`.replace(/\/$/, "");
  }

  const origin = req.nextUrl.origin;
  if (!isInternalHost(origin)) {
    return origin.replace(/\/$/, "");
  }

  // Last resort for local dev
  return "http://localhost:3000";
}

function isInternalHostname(host: string) {
  const hostname = host.replace(/:\d+$/, "").toLowerCase();
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".internal")
  );
}

function isInternalHost(urlOrHost: string) {
  try {
    if (/^https?:\/\//i.test(urlOrHost)) {
      return isInternalHostname(new URL(urlOrHost).host);
    }
    return isInternalHostname(urlOrHost);
  } catch {
    return true;
  }
}
