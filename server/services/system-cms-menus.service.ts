import { randomUUID } from "crypto";
import { storage } from "../storage";
import type { InsertCmsMenu, MenuItem, StandardMenuLocation } from "@shared/schema";

function id() {
  return randomUUID();
}

function item(label: string, url: string, children: MenuItem[] = [], openInNewTab = false): MenuItem {
  return {
    id: id(),
    label,
    url,
    openInNewTab,
    children,
  };
}

function pageUrl(path: string) {
  if (path === "/") return "/";
  return path.replace(/\/$/, "") + "/";
}

const obsoleteLegacyPlatformMenuUrls = new Set(["/directory", "/events", "/insights", "/recordings", "/join"]);
const obsoleteLegacyPlatformMenuLabels = new Set([
  "browse specializations",
  "events",
  "events & workshops",
  "find a mental health professional",
  "insights & articles",
  "join the network",
  "applications open in june",
  "membership plans",
  "mental health professional login",
  "upcoming events",
  "video archives",
]);

function pruneObsoleteLegacyPlatformItems(items: MenuItem[]): { items: MenuItem[]; changed: boolean } {
  let changed = false;

  const nextItems = items.flatMap((entry) => {
    const nextChildren = entry.children?.length
      ? pruneObsoleteLegacyPlatformItems(entry.children)
      : { items: entry.children ?? [], changed: false };
    const normalizedLabel = entry.label.trim().toLowerCase();
    const shouldRemove =
      obsoleteLegacyPlatformMenuUrls.has(entry.url) ||
      obsoleteLegacyPlatformMenuLabels.has(normalizedLabel) ||
      (entry.url === "#" && normalizedLabel === "resources" && nextChildren.items.length === 0);

    if (nextChildren.changed || shouldRemove) {
      changed = true;
    }

    if (shouldRemove) {
      return [];
    }

    return [{ ...entry, children: nextChildren.items }];
  });

  return { items: nextItems, changed };
}

function patchLegalItemUrls(items: MenuItem[]): { items: MenuItem[]; changed: boolean } {
  let changed = false;

  const nextItems = items.map((entry) => {
    const nextChildren = entry.children?.length
      ? patchLegalItemUrls(entry.children)
      : { items: entry.children ?? [], changed: false };

    const normalizedLabel = entry.label.trim().toLowerCase();
    let nextUrl = entry.url;

    if (
      normalizedLabel === "privacy policy" &&
      (entry.url === "/contact" || entry.url === "" || entry.url === "#")
    ) {
      nextUrl = pageUrl("/privacy-policy");
      changed = true;
    }

    if (
      normalizedLabel === "terms of service" &&
      (entry.url === "/contact" || entry.url === "" || entry.url === "#")
    ) {
      nextUrl = pageUrl("/terms-of-service");
      changed = true;
    }

    if (
      normalizedLabel === "disclaimer" &&
      (entry.url === "/contact" || entry.url === "" || entry.url === "#")
    ) {
      nextUrl = pageUrl("/disclaimer");
      changed = true;
    }

    if (nextChildren.changed) {
      changed = true;
    }

    return {
      ...entry,
      url: nextUrl,
      children: nextChildren.items,
    };
  });

  const hasDisclaimer = nextItems.some((entry) => entry.label.trim().toLowerCase() === "disclaimer");
  if (!hasDisclaimer) {
    nextItems.push(item("Disclaimer", pageUrl("/disclaimer")));
    changed = true;
  }

  return { items: nextItems, changed };
}

const defaultMenus: Array<InsertCmsMenu & { location: StandardMenuLocation }> = [
  {
    name: "Main Navigation",
    location: "main_navigation",
    items: [
      item("Services", pageUrl("/services")),
      item("Gallery", pageUrl("/gallery")),
      item("About", pageUrl("/about")),
      item("Reviews", pageUrl("/reviews")),
      item("Contact", pageUrl("/contact")),
    ],
  },
  {
    name: "Services",
    location: "footer_platform",
    items: [
      item("Interior Painting", pageUrl("/interior-painting")),
      item("Exterior Painting", pageUrl("/exterior-painting")),
      item("Cabinet Painting", pageUrl("/cabinet-painting")),
      item("Deck Staining", pageUrl("/deck-staining")),
      item("Fence Staining", pageUrl("/fence-staining")),
    ],
  },
  {
    name: "Specialty Services",
    location: "footer_professionals",
    items: [
      item("Popcorn Ceiling Removal", pageUrl("/popcorn-ceiling-removal")),
      item("Drywall Repair", pageUrl("/drywall-repair")),
      item("Wallpaper Removal", pageUrl("/wallpaper-removal")),
      item("Pressure Washing", pageUrl("/pressure-washing")),
      item("Hardie Plank Painting", pageUrl("/hardie-plank-painting")),
    ],
  },
  {
    name: "Resources",
    location: "footer_resources",
    items: [
      item("Gallery", pageUrl("/gallery")),
      item("Reviews", pageUrl("/reviews")),
      item("Sitemap", pageUrl("/sitemap")),
    ],
  },
  {
    name: "Company",
    location: "footer_company",
    items: [
      item("About Us", pageUrl("/about")),
      item("Contact", pageUrl("/contact")),
      item("Support", pageUrl("/contact")),
    ],
  },
  {
    name: "Legal",
    location: "footer_legal",
    items: [
      item("Privacy Policy", pageUrl("/privacy-policy")),
      item("Terms of Service", pageUrl("/terms-of-service")),
      item("Disclaimer", pageUrl("/disclaimer")),
    ],
  },
];

export async function ensureSystemCmsMenus() {
  const menus = await storage.cmsMenus.getAll();
  const assignedLocations = new Set(menus.map((menu) => menu.location));

  const hasAnyHeaderMenu =
    assignedLocations.has("main_navigation") || assignedLocations.has("header");
  const hasAnyThemeMenu = menus.some((menu) => menu.location !== "unassigned");
  if (!hasAnyHeaderMenu && !hasAnyThemeMenu) {
    const mainNavigation = defaultMenus.find((menu) => menu.location === "main_navigation");
    if (mainNavigation) {
      await storage.cmsMenus.create(mainNavigation);
    }
  }

  const hasAnyFooterMenus =
    assignedLocations.has("footer") ||
    defaultMenus
      .filter((entry) => entry.location !== "main_navigation")
      .some((entry) => assignedLocations.has(entry.location));
  if (!hasAnyFooterMenus) {
    for (const menu of defaultMenus.filter((entry) => entry.location !== "main_navigation")) {
      await storage.cmsMenus.create(menu);
    }
  }

  const legalMenu = await storage.cmsMenus.getByLocation("footer_legal");
  if (legalMenu?.items) {
    const patched = patchLegalItemUrls((legalMenu.items as MenuItem[]) || []);
    if (patched.changed) {
      await storage.cmsMenus.update(legalMenu.id, {
        items: patched.items,
      });
    }
  }

  for (const menu of await storage.cmsMenus.getAll()) {
    const pruned = pruneObsoleteLegacyPlatformItems((menu.items as MenuItem[]) || []);
    if (pruned.changed) {
      await storage.cmsMenus.update(menu.id, {
        items: pruned.items,
      });
    }
  }
}
