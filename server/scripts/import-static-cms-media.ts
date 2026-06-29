import { stat, readdir } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db, pool } from "../db";
import { cmsMedia } from "@shared/schema";

const PUBLIC_DIR = path.resolve(process.cwd(), "client", "public");
const STATIC_MEDIA_ROOTS = ["img", "images"];
const IMAGE_MIME_BY_EXTENSION: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function publicUrlForFile(filePath: string) {
  return `/${path.relative(PUBLIC_DIR, filePath).split(path.sep).join("/")}`;
}

function titleFromFilename(filename: string) {
  const name = path.basename(filename, path.extname(filename));
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function collectImages(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectImages(entryPath);
      if (!entry.isFile()) return [];

      const extension = path.extname(entry.name).toLowerCase();
      return IMAGE_MIME_BY_EXTENSION[extension] ? [entryPath] : [];
    }),
  );

  return files.flat();
}

async function main() {
  const rootFiles = await Promise.all(
    STATIC_MEDIA_ROOTS.map(async (root) => {
      const directory = path.join(PUBLIC_DIR, root);
      try {
        return await collectImages(directory);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
        throw error;
      }
    }),
  );

  const imageFiles = rootFiles.flat().sort((a, b) => a.localeCompare(b));
  let inserted = 0;
  let existing = 0;

  for (const filePath of imageFiles) {
    const url = publicUrlForFile(filePath);
    const [current] = await db.select({ id: cmsMedia.id }).from(cmsMedia).where(eq(cmsMedia.url, url));
    if (current) {
      existing += 1;
      continue;
    }

    const extension = path.extname(filePath).toLowerCase();
    const fileStats = await stat(filePath);
    const filename = path.basename(filePath);

    await db.insert(cmsMedia).values({
      filename,
      originalName: filename,
      title: titleFromFilename(filename),
      url,
      mimeType: IMAGE_MIME_BY_EXTENSION[extension],
      fileSize: fileStats.size,
      r2Key: null,
      alt: titleFromFilename(filename),
      uploadedBy: null,
    });
    inserted += 1;
  }

  console.log(
    JSON.stringify(
      {
        scanned: imageFiles.length,
        inserted,
        existing,
        roots: STATIC_MEDIA_ROOTS.map((root) => `/${root}`),
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
