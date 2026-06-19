import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CmsPage, SeoSettings } from "@shared/schema";

const mockGetSeo = vi.fn();
const mockGetSetting = vi.fn();
const mockGetPageBySlug = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    seoSettings: {
      get: mockGetSeo,
    },
    settings: {
      getSetting: mockGetSetting,
    },
    cmsPages: {
      getPageBySlug: mockGetPageBySlug,
    },
  },
}));

const seoSettings: SeoSettings = {
  id: "seo-1",
  siteName: "Core Platform",
  siteUrl: "https://coreplatform.com",
  titleSuffix: " | Core Platform",
  defaultMetaDescription: "Default description",
  defaultOgImageUrl: "https://coreplatform.com/og.jpg",
  defaultRobotsNoindex: false,
  organizationName: "Core Platform",
  organizationLogoUrl: null,
  facebookUrl: null,
  instagramUrl: null,
  linkedinUrl: null,
  twitterHandle: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const cmsPage: CmsPage = {
  id: "page-1",
  title: "Painting Process",
  slug: "painting-process",
  status: "published",
  pageType: "system",
  template: "full-width",
  sidebarId: null,
  content: {
    blocks: [
      { id: "b1", type: "hero", props: { title: "Our Painting Process", subtitle: "Prep, paint, cleanup, and walkthrough." } },
    ],
  },
  seoTitle: null,
  seoDescription: "Learn about the 593 EC Painting process.",
  seoKeywords: null,
  ogImageUrl: null,
  canonicalUrl: null,
  noindex: false,
  createdBy: null,
  updatedBy: null,
  scheduledAt: null,
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("public-prerender.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSeo.mockResolvedValue(seoSettings);
    mockGetSetting.mockResolvedValue(null);
    mockGetPageBySlug.mockResolvedValue(undefined);
  });

  it("returns a prerender snapshot for published CMS pages", async () => {
    mockGetPageBySlug.mockResolvedValue(cmsPage);
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/painting-process");

    expect(snapshot?.title).toContain("Painting Process");
    expect(snapshot?.bodyHtml).toContain("Our Painting Process");
    expect(snapshot?.canonicalUrl).toBe("https://coreplatform.com/painting-process");
  });

  it("does not prerender retired inherited public surfaces", async () => {
    mockGetPageBySlug.mockResolvedValue({ ...cmsPage, slug: "join" });
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    await expect(getPublicHtmlSnapshot("/join")).resolves.toBeNull();
    await expect(getPublicHtmlSnapshot("/insights/old-post")).resolves.toBeNull();
    await expect(getPublicHtmlSnapshot("/events/old-event")).resolves.toBeNull();
    await expect(getPublicHtmlSnapshot("/recordings")).resolves.toBeNull();
    await expect(getPublicHtmlSnapshot("/directory/old-profile")).resolves.toBeNull();
  });

  it("marks search result pages as noindex in the injected head", async () => {
    const { getPublicHtmlSnapshot, injectPublicHtmlSnapshot } = await import("../services/public-prerender.service");
    const template = "<html><head><title>Default</title><!--APP_DYNAMIC_HEAD--></head><body><!--APP_PRERENDER_CONTENT--><div id=\"root\"></div></body></html>";

    const snapshot = await getPublicHtmlSnapshot("/search", "?query=application+process");
    const html = injectPublicHtmlSnapshot(template, snapshot);

    expect(html).toContain('meta name="robots" content="noindex,follow"');
    expect(html).toContain("Search Results for &quot;application process&quot;");
  });

  it("retrieves and injects custom public head additions", async () => {
    mockGetSetting.mockResolvedValue('<meta name="custom-test" content="enabled" />');
    const { getPublicHeadAdditions, injectPublicHtmlSnapshot } = await import(
      "../services/public-prerender.service"
    );
    const template =
      "<html><head><title>Default</title><!--APP_DYNAMIC_HEAD--></head><body><!--APP_PRERENDER_CONTENT--><div id=\"root\"></div></body></html>";

    const headHtml = await getPublicHeadAdditions();
    const html = injectPublicHtmlSnapshot(template, null, headHtml);

    expect(headHtml).toBe('<meta name="custom-test" content="enabled" />');
    expect(html).toContain('<meta name="custom-test" content="enabled" />');
  });

  it("repairs malformed closing script tags in custom head additions", async () => {
    mockGetSetting.mockResolvedValue(
      [
        '<script async src="https://www.googletagmanager.com/gtag/js?id=G-TEST"></script',
        '<script>window.dataLayer = window.dataLayer || [];</script',
      ].join("\n"),
    );
    const { getPublicHeadAdditions } = await import("../services/public-prerender.service");

    const headHtml = await getPublicHeadAdditions();

    expect(headHtml).toContain('</script>');
    expect(headHtml).not.toContain('</script\n');
    expect(headHtml).not.toContain('</script<');
  });
});
