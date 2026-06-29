import type { Request, Response, NextFunction } from "express";

const CANONICAL_HOST_REDIRECTS: Record<string, string> = {
  "www.ecpaintingcharlotte.com": "ecpaintingcharlotte.com",
};

function stripPort(host: string) {
  return host.split(":")[0]?.toLowerCase() ?? "";
}

export function getCanonicalHostRedirectUrl(host: string | undefined, originalUrl: string) {
  if (!host) return null;

  const hostname = stripPort(host);
  const canonicalHost = CANONICAL_HOST_REDIRECTS[hostname];
  if (!canonicalHost) return null;

  const path = originalUrl.startsWith("/") ? originalUrl : `/${originalUrl}`;
  return `https://${canonicalHost}${path}`;
}

export function canonicalHostRedirect(req: Request, res: Response, next: NextFunction) {
  const redirectUrl = getCanonicalHostRedirectUrl(req.get("host"), req.originalUrl);
  if (!redirectUrl) {
    return next();
  }

  return res.redirect(301, redirectUrl);
}
