import { storage } from "../storage";
import type {
  CmsMediaAsset,
  CmsMediaLibraryAsset,
  CmsMediaUsageReference,
  CmsPage,
  SeoSettings,
} from "@shared/schema";

function isImageMimeType(mimeType: string) {
  return mimeType.startsWith("image/");
}

function assetKind(asset: CmsMediaAsset): "image" | "document" {
  return isImageMimeType(asset.mimeType) ? "image" : "document";
}

function buildAssetNeedles(asset: CmsMediaAsset): string[] {
  const needles = new Set<string>();
  if (asset.url) {
    needles.add(asset.url);
    try {
      const parsed = new URL(asset.url);
      needles.add(parsed.toString());
      if (parsed.pathname.startsWith("/cms/media/") || parsed.pathname.startsWith("/uploads/")) {
        needles.add(parsed.pathname);
      }
    } catch {
      // Relative URLs are fine as-is.
    }
  }
  return Array.from(needles).filter(Boolean);
}

function textReferencesAsset(text: string, asset: CmsMediaAsset): boolean {
  return buildAssetNeedles(asset).some((needle) => text.includes(needle));
}

function valueReferencesAsset(value: unknown, asset: CmsMediaAsset): boolean {
  if (!value) return false;
  if (typeof value === "string") {
    return textReferencesAsset(value, asset);
  }
  if (Array.isArray(value)) {
    return value.some((entry) => valueReferencesAsset(entry, asset));
  }
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((entry) => valueReferencesAsset(entry, asset));
  }
  return false;
}

function addUsageReference(
  usageMap: Map<string, CmsMediaUsageReference[]>,
  dedupe: Set<string>,
  assetId: string,
  reference: CmsMediaUsageReference
) {
  const dedupeKey = `${assetId}:${reference.entityType}:${reference.entityId}:${reference.field}`;
  if (dedupe.has(dedupeKey)) {
    return;
  }
  dedupe.add(dedupeKey);
  const existing = usageMap.get(assetId) ?? [];
  existing.push(reference);
  usageMap.set(assetId, existing);
}

function addDirectFieldUsage<T extends { id: string }>(
  assets: CmsMediaAsset[],
  usageMap: Map<string, CmsMediaUsageReference[]>,
  dedupe: Set<string>,
  entity: T,
  entityType: CmsMediaUsageReference["entityType"],
  entityName: string,
  path: string | undefined,
  field: string,
  fieldValue: string | null | undefined,
  isLive: boolean,
  statusLabel: string
) {
  if (!fieldValue) return;
  for (const asset of assets) {
    if (!textReferencesAsset(fieldValue, asset)) continue;
    addUsageReference(usageMap, dedupe, asset.id, {
      entityType,
      entityId: entity.id,
      entityName,
      field,
      path,
      isLive,
      statusLabel,
    });
  }
}

function addContentUsage<T extends { id: string }>(
  assets: CmsMediaAsset[],
  usageMap: Map<string, CmsMediaUsageReference[]>,
  dedupe: Set<string>,
  entity: T,
  entityType: CmsMediaUsageReference["entityType"],
  entityName: string,
  path: string | undefined,
  content: unknown,
  isLive: boolean,
  statusLabel: string
) {
  for (const asset of assets) {
    if (!valueReferencesAsset(content, asset)) continue;
    addUsageReference(usageMap, dedupe, asset.id, {
      entityType,
      entityId: entity.id,
      entityName,
      field: "content",
      path,
      isLive,
      statusLabel,
    });
  }
}

function pageStatusLabel(page: CmsPage) {
  return page.status === "published" ? "Published page" : `${page.status[0].toUpperCase()}${page.status.slice(1)} page`;
}

export async function buildCmsMediaLibraryAssets(
  assets: CmsMediaAsset[]
): Promise<CmsMediaLibraryAsset[]> {
  const [pages, seoSettings] = await Promise.all([
    storage.cmsPages.getAllPages(),
    storage.seoSettings.get(),
  ]);

  const usageMap = new Map<string, CmsMediaUsageReference[]>();
  const dedupe = new Set<string>();

  for (const page of pages) {
    const isLive = page.status === "published";
    const path = page.slug ? `/${page.slug}` : undefined;
    addDirectFieldUsage(assets, usageMap, dedupe, page, "page", page.title, path, "ogImageUrl", page.ogImageUrl, isLive, pageStatusLabel(page));
    addContentUsage(assets, usageMap, dedupe, page, "page", page.title, path, page.content, isLive, pageStatusLabel(page));
  }

  if (seoSettings) {
    const globalSeo = seoSettings as SeoSettings;
    const seoEntity = { id: globalSeo.id };
    addDirectFieldUsage(
      assets,
      usageMap,
      dedupe,
      seoEntity,
      "global_seo",
      "Global SEO",
      undefined,
      "defaultOgImageUrl",
      globalSeo.defaultOgImageUrl,
      true,
      "Global setting"
    );
    addDirectFieldUsage(
      assets,
      usageMap,
      dedupe,
      seoEntity,
      "global_seo",
      "Global SEO",
      undefined,
      "organizationLogoUrl",
      globalSeo.organizationLogoUrl,
      true,
      "Global setting"
    );
  }

  return assets.map((asset) => {
    const usageRefs = (usageMap.get(asset.id) ?? []).sort((a, b) => {
      if (a.isLive !== b.isLive) {
        return a.isLive ? -1 : 1;
      }
      return a.entityName.localeCompare(b.entityName);
    });
    const liveUsageCount = usageRefs.filter((ref) => ref.isLive).length;

    return {
      ...asset,
      assetKind: assetKind(asset),
      usageRefs,
      usageCount: usageRefs.length,
      liveUsageCount,
      isInUse: liveUsageCount > 0,
    };
  });
}
