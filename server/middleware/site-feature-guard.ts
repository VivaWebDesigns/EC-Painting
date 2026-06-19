import type { NextFunction, Request, Response } from "express";
import { DEFAULT_SITE_FEATURES, normalizeBooleanSetting, type SiteFeatures } from "@shared/site-features";
import { storage } from "../storage";
import { logger } from "../utils/logger";

export async function getSiteFeatures(): Promise<SiteFeatures> {
  const settings = await storage.settings.getDecryptedCategory("system_configuration");
  return {
    crmEnabled: normalizeBooleanSetting(
      settings.enable_crm,
      DEFAULT_SITE_FEATURES.crmEnabled,
    ),
  };
}

export function requireSiteFeature(feature: keyof SiteFeatures) {
  return async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const enabled = (await getSiteFeatures())[feature];

      if (!enabled) {
        return res.status(404).json({ message: "Not found" });
      }

      next();
    } catch (err) {
      logger.app.warn("Failed to resolve site feature flag", {
        feature,
        error: err instanceof Error ? err.message : String(err),
      });
      if (!DEFAULT_SITE_FEATURES[feature]) {
        return res.status(404).json({ message: "Not found" });
      }
      next();
    }
  };
}
