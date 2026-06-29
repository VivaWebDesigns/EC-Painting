import type { Request, Response, NextFunction } from "express";

const EXCLUDED_PREFIXES = [
  "/api",
  "/admin",
  "/assets",
  "/auth",
  "/forms",
  "/preview",
  "/r2",
  "/setup",
  "/uploads",
];

const EXCLUDED_PATHS = new Set([
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

function hasFileExtension(pathname: string) {
  return /\/[^/]+\.[^/]+$/.test(pathname);
}

export function getTrailingSlashRedirectUrl(
  method: string,
  originalUrl: string,
  pathname: string,
) {
  if (method !== "GET" && method !== "HEAD") return null;
  if (pathname === "/" || pathname.endsWith("/")) return null;
  if (EXCLUDED_PATHS.has(pathname)) return null;
  if (EXCLUDED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return null;
  }
  if (hasFileExtension(pathname)) return null;

  const queryIndex = originalUrl.indexOf("?");
  const query = queryIndex >= 0 ? originalUrl.slice(queryIndex) : "";
  return `${pathname}/${query}`;
}

export function trailingSlashRedirect(req: Request, res: Response, next: NextFunction) {
  const redirectUrl = getTrailingSlashRedirectUrl(req.method, req.originalUrl, req.path);
  if (!redirectUrl) {
    return next();
  }

  return res.redirect(301, redirectUrl);
}
