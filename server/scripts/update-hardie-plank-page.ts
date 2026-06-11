import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { pool } from "../db";
import { storage } from "../storage";
import { allPageSpecs, page } from "./seed-ec-painting-public-site";

const HARDIE_SLUG = "hardie-plank-painting";

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function main() {
  const spec = allPageSpecs().find((candidate) => candidate.slug === HARDIE_SLUG);
  if (!spec) {
    throw new Error(`Could not find ${HARDIE_SLUG} in the EC Painting seed content.`);
  }

  const existing = await storage.cmsPages.getPageBySlug(HARDIE_SLUG);
  const backupPath =
    process.env.HARDIE_BACKUP_PATH ||
    path.join("/tmp", `ec-painting-${HARDIE_SLUG}-${timestamp()}.json`);

  await mkdir(path.dirname(backupPath), { recursive: true });
  await writeFile(
    backupPath,
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        slug: HARDIE_SLUG,
        page: existing ?? null,
      },
      null,
      2,
    ),
  );

  const nextPage = page(spec);
  if (existing) {
    await storage.cmsPages.updatePage(existing.id, nextPage);
  } else {
    await storage.cmsPages.createPage(nextPage);
  }

  console.log(
    JSON.stringify(
      {
        updated: true,
        slug: HARDIE_SLUG,
        action: existing ? "updated" : "created",
        backupPath,
        title: spec.title,
        markers: [
          "Hardie Plank Repaints Need More Than a Fresh Color",
          "A Repaint Should Protect the Siding, Not Just Cover It",
          "Our Hardie Plank Painting Process",
        ],
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
