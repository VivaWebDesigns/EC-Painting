import { beforeEach, describe, expect, it, vi } from "vitest";

const mockStorage = vi.hoisted(() => ({
  cmsPages: {
    getPageBySlug: vi.fn(),
    createPage: vi.fn(),
    updatePage: vi.fn(),
    deletePage: vi.fn(),
  },
  cmsMenus: {
    getByLocation: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  seoSettings: {
    get: vi.fn(),
    upsert: vi.fn(),
  },
  settings: {
    getSetting: vi.fn(),
    upsertSetting: vi.fn(),
  },
}));

vi.mock("../storage", () => ({
  storage: mockStorage,
}));

vi.mock("../db", () => ({
  pool: {
    end: vi.fn(),
  },
}));

function adminEditedHomePage() {
  return {
    id: "page-home",
    title: "Admin Home Title",
    slug: "home",
    pageType: "custom",
    template: "full-width",
    status: "draft",
    content: {
      blocks: [
        {
          id: "admin-hero",
          type: "hero",
          props: {
            heading: "Admin edited headline",
            backgroundImageUrl: "/uploads/cms/admin-hero.webp",
            backgroundPositionX: 17,
            backgroundPositionY: 63,
            imageAlt: "Admin hero alt",
            imageCaption: "Admin hero caption",
            mobileImageUrl: "/uploads/cms/admin-mobile.webp",
          },
        },
      ],
    },
    seoTitle: "Admin SEO Title",
    seoDescription: "Admin SEO Description",
    seoKeywords: "admin, keywords",
    ogImageUrl: "/uploads/cms/admin-og.webp",
    canonicalUrl: "https://example.com/custom-home/",
    noindex: true,
    publishedAt: null,
    scheduledAt: null,
    createdBy: "admin",
    updatedBy: "admin",
    sidebarId: "admin-sidebar",
  };
}

describe("seed-ec-painting-public-site", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockStorage.cmsPages.getPageBySlug.mockResolvedValue(undefined);
    mockStorage.cmsPages.createPage.mockImplementation(async (page) => ({ id: `created-${page.slug}`, ...page }));
    mockStorage.cmsPages.updatePage.mockImplementation(async (id, page) => ({ id, ...page }));
    mockStorage.cmsPages.deletePage.mockResolvedValue(true);

    mockStorage.cmsMenus.getByLocation.mockResolvedValue(undefined);
    mockStorage.cmsMenus.create.mockImplementation(async (menu) => ({ id: `created-${menu.location}`, ...menu }));
    mockStorage.cmsMenus.update.mockImplementation(async (id, menu) => ({ id, ...menu }));
    mockStorage.cmsMenus.delete.mockResolvedValue(true);

    mockStorage.seoSettings.get.mockResolvedValue(undefined);
    mockStorage.seoSettings.upsert.mockImplementation(async (settings) => ({ id: "global", ...settings }));

    mockStorage.settings.getSetting.mockResolvedValue(null);
    mockStorage.settings.upsertSetting.mockImplementation(async (key, value, category, isSecret) => ({
      key,
      value,
      category,
      isSecret,
    }));
  });

  it("does not reset admin-edited public pages, menus, SEO, or branding on a normal rerun", async () => {
    const { seedEcPaintingPublicSite } = await import("../scripts/seed-ec-painting-public-site");
    const existingHome = adminEditedHomePage();

    mockStorage.cmsPages.getPageBySlug.mockImplementation(async (slug: string) => {
      if (slug === "home") return existingHome;
      return undefined;
    });
    mockStorage.cmsMenus.getByLocation.mockImplementation(async (location: string) => ({
      id: `menu-${location}`,
      name: `Admin ${location}`,
      location,
      items: [{ id: "custom", label: "Custom Admin Item", url: "/custom/", children: [] }],
    }));
    mockStorage.seoSettings.get.mockResolvedValue({
      id: "global",
      siteName: "Admin Site Name",
      defaultOgImageUrl: "/uploads/cms/admin-og.webp",
      customRobotsTxt: "User-agent: *\nDisallow: /private/\n",
    });
    mockStorage.settings.getSetting.mockResolvedValue("admin-custom-branding-value");

    const summary = await seedEcPaintingPublicSite();

    expect(mockStorage.cmsPages.updatePage).not.toHaveBeenCalled();
    expect(mockStorage.cmsMenus.update).not.toHaveBeenCalled();
    expect(mockStorage.cmsMenus.delete).not.toHaveBeenCalled();
    expect(mockStorage.seoSettings.upsert).not.toHaveBeenCalled();
    expect(mockStorage.settings.upsertSetting).not.toHaveBeenCalled();
    expect(summary.pages.skipped).toBe(1);
    expect(summary.menus.skipped).toBe(4);
    expect(summary.seo.skipped).toBe(1);
    expect(summary.branding.skipped).toBeGreaterThan(0);
  });

  it("preserves protected CMS image and SEO fields when page updates are explicitly enabled", async () => {
    const { seedOptions, seedPages } = await import("../scripts/seed-ec-painting-public-site");
    const existingHome = adminEditedHomePage();

    mockStorage.cmsPages.getPageBySlug.mockImplementation(async (slug: string) => {
      if (slug === "home") return existingHome;
      return undefined;
    });

    await seedPages(seedOptions({ updatePages: true }));

    expect(mockStorage.cmsPages.updatePage).toHaveBeenCalledTimes(1);
    const [, updatedHome] = mockStorage.cmsPages.updatePage.mock.calls[0];
    const heroBlock = updatedHome.content.blocks[0];

    expect(updatedHome.seoTitle).toBe("Admin SEO Title");
    expect(updatedHome.seoDescription).toBe("Admin SEO Description");
    expect(updatedHome.ogImageUrl).toBe("/uploads/cms/admin-og.webp");
    expect(updatedHome.status).toBe("draft");
    expect(updatedHome.canonicalUrl).toBe("https://example.com/custom-home/");
    expect(updatedHome.noindex).toBe(true);
    expect(heroBlock.props.backgroundImageUrl).toBe("/uploads/cms/admin-hero.webp");
    expect(heroBlock.props.backgroundPositionX).toBe(17);
    expect(heroBlock.props.backgroundPositionY).toBe(63);
    expect(heroBlock.props.imageAlt).toBe("Admin hero alt");
    expect(heroBlock.props.imageCaption).toBe("Admin hero caption");
    expect(heroBlock.props.mobileImageUrl).toBe("/uploads/cms/admin-mobile.webp");
  });
});
