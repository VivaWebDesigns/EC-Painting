import { pool } from "../db";
import { storage } from "../storage";

const ORGANIZATION_LOGO_URL = "/favicon-512x512.png";

async function main() {
  const existing = await storage.seoSettings.get();
  if (!existing) {
    throw new Error("Global SEO settings do not exist.");
  }

  if (existing.organizationLogoUrl === ORGANIZATION_LOGO_URL) {
    console.log(JSON.stringify({ updated: false, organizationLogoUrl: ORGANIZATION_LOGO_URL }, null, 2));
    return;
  }

  await storage.seoSettings.upsert({ organizationLogoUrl: ORGANIZATION_LOGO_URL });
  console.log(JSON.stringify({ updated: true, organizationLogoUrl: ORGANIZATION_LOGO_URL }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
