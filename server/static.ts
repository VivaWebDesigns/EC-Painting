import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import {
  getPublicHeadAdditions,
  getPublicHtmlSnapshot,
  injectPublicHtmlSnapshot,
} from "./services/public-prerender.service";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexPath = path.resolve(distPath, "index.html");
  let cachedIndexTemplate: string | null = null;

  async function getIndexTemplate() {
    if (cachedIndexTemplate) return cachedIndexTemplate;
    cachedIndexTemplate = await fs.promises.readFile(indexPath, "utf-8");
    return cachedIndexTemplate;
  }

  app.use(express.static(distPath, {
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
        return;
      }

      if (/\.(js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|webp|avif|ico)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", async (req, res) => {
    const template = await getIndexTemplate();
    const publicUrl = new URL(req.originalUrl, "http://localhost");
    const snapshot = await getPublicHtmlSnapshot(publicUrl.pathname, publicUrl.search);
    const shouldInjectPublicHead =
      !publicUrl.pathname.startsWith("/admin") &&
      !publicUrl.pathname.startsWith("/auth") &&
      !publicUrl.pathname.startsWith("/therapist") &&
      !publicUrl.pathname.startsWith("/setup") &&
      !publicUrl.pathname.startsWith("/preview") &&
      !publicUrl.pathname.startsWith("/uploads") &&
      !publicUrl.pathname.startsWith("/api");
    const customHeadHtml = shouldInjectPublicHead ? await getPublicHeadAdditions() : null;

    res.setHeader(
      "Cache-Control",
      publicUrl.pathname.startsWith("/admin") || publicUrl.pathname.startsWith("/auth") || publicUrl.pathname.startsWith("/therapist")
        ? "private, no-store, max-age=0"
        : "no-cache",
    );
    res.type("html").send(injectPublicHtmlSnapshot(template, snapshot, customHeadHtml));
  });
}
