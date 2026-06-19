import { logger } from "../utils/logger";
import { ensureSystemCmsPages } from "./system-cms-pages.service";
import { ensureSystemCmsMenus } from "./system-cms-menus.service";
import { ensureSystemCmsSections } from "./system-cms-sections.service";
import { ensureSystemDocs } from "./system-docs.service";
import { ensureSystemEmailTemplates } from "./system-email-templates.service";
import { ensureSystemForms } from "./system-forms.service";
import { storage } from "../storage";

const OBSOLETE_FEATURE_SETTING_KEYS = ["enable_directory", "enable_blog", "enable_events"];

async function removeObsoleteFeatureSettings() {
  for (const key of OBSOLETE_FEATURE_SETTING_KEYS) {
    await storage.settings.deleteSetting(key);
  }
}

export async function runSystemBootstrap() {
  logger.app.info("Running system bootstrap");

  await removeObsoleteFeatureSettings();
  await ensureSystemCmsPages();
  await ensureSystemCmsMenus();
  await ensureSystemCmsSections();
  await ensureSystemForms();
  await ensureSystemDocs({ refreshExisting: false });
  await ensureSystemEmailTemplates(false);

  logger.app.info("System bootstrap complete");
}
