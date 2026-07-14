import { pool } from "../db";
import { storage } from "../storage";

const REPLACEMENTS = [
  ["+17743297109", "+17042771972"],
  ["(774) 329-7109", "(704) 277-1972"],
  ["7743297109", "7042771972"],
] as const;

function replacePhoneNumbers(value: unknown): { value: unknown; replacements: number } {
  if (typeof value === "string") {
    let replacements = 0;
    let nextValue = value;

    for (const [oldNumber, newNumber] of REPLACEMENTS) {
      const matches = nextValue.split(oldNumber).length - 1;
      if (matches > 0) {
        nextValue = nextValue.replaceAll(oldNumber, newNumber);
        replacements += matches;
      }
    }

    return { value: nextValue, replacements };
  }

  if (Array.isArray(value)) {
    let replacements = 0;
    const nextValue = value.map((item) => {
      const result = replacePhoneNumbers(item);
      replacements += result.replacements;
      return result.value;
    });
    return { value: nextValue, replacements };
  }

  if (value && typeof value === "object" && !(value instanceof Date)) {
    let replacements = 0;
    const nextValue = Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        const result = replacePhoneNumbers(item);
        replacements += result.replacements;
        return [key, result.value];
      }),
    );
    return { value: nextValue, replacements };
  }

  return { value, replacements: 0 };
}

async function main() {
  let replacements = 0;
  let pagesUpdated = 0;
  let menusUpdated = 0;
  let settingsUpdated = 0;
  let seoUpdated = false;

  for (const page of await storage.cmsPages.getAllPages()) {
    const result = replacePhoneNumbers({
      title: page.title,
      content: page.content,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      seoKeywords: page.seoKeywords,
      ogImageUrl: page.ogImageUrl,
      canonicalUrl: page.canonicalUrl,
    });

    if (result.replacements > 0) {
      await storage.cmsPages.updatePage(page.id, result.value as Record<string, unknown>);
      pagesUpdated += 1;
      replacements += result.replacements;
    }
  }

  for (const menu of await storage.cmsMenus.getAll()) {
    const result = replacePhoneNumbers({ name: menu.name, items: menu.items });
    if (result.replacements > 0) {
      await storage.cmsMenus.update(menu.id, result.value as Record<string, unknown>);
      menusUpdated += 1;
      replacements += result.replacements;
    }
  }

  for (const setting of await storage.settings.getAllSettings()) {
    if (setting.isSecret) continue;

    const result = replacePhoneNumbers(setting.value);
    if (result.replacements > 0) {
      await storage.settings.upsertSetting(
        setting.key,
        result.value as string,
        setting.category,
        false,
      );
      settingsUpdated += 1;
      replacements += result.replacements;
    }
  }

  const seo = await storage.seoSettings.get();
  if (seo) {
    const result = replacePhoneNumbers({
      siteName: seo.siteName,
      titleSuffix: seo.titleSuffix,
      defaultMetaDescription: seo.defaultMetaDescription,
      siteUrl: seo.siteUrl,
      defaultOgImageUrl: seo.defaultOgImageUrl,
      organizationName: seo.organizationName,
      organizationLogoUrl: seo.organizationLogoUrl,
      facebookUrl: seo.facebookUrl,
      twitterHandle: seo.twitterHandle,
      linkedinUrl: seo.linkedinUrl,
      instagramUrl: seo.instagramUrl,
      customRobotsTxt: seo.customRobotsTxt,
    });

    if (result.replacements > 0) {
      await storage.seoSettings.upsert(result.value as Record<string, unknown>);
      seoUpdated = true;
      replacements += result.replacements;
    }
  }

  console.log(JSON.stringify({ replacements, pagesUpdated, menusUpdated, settingsUpdated, seoUpdated }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
