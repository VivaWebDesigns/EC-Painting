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
  siteName: "593 EC Painting",
  siteUrl: "https://ecpaintingcharlotte.com",
  titleSuffix: " | 593 EC Painting",
  defaultMetaDescription: "Default description",
  defaultOgImageUrl: "https://ecpaintingcharlotte.com/og.jpg",
  defaultRobotsNoindex: false,
  organizationName: "593 EC Painting",
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
    expect(snapshot?.canonicalUrl).toBe("https://ecpaintingcharlotte.com/painting-process/");
  });

  it("uses short breadcrumb labels and a trailing slash for the homepage item", async () => {
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      title: "Services",
      slug: "services",
      seoTitle: "Painting Services in Charlotte, NC | 593 EC Painting",
      canonicalUrl: "https://ecpaintingcharlotte.com/services/",
      content: {
        blocks: [
          {
            id: "hero-services",
            type: "hero",
            props: { heading: "Painting Services in Charlotte, NC", isActive: true },
          },
        ],
      },
    });
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/services/");
    const breadcrumb = snapshot?.jsonLd?.find((schema) => schema["@type"] === "BreadcrumbList");

    expect(snapshot?.bodyHtml).toContain("<h1>Painting Services in Charlotte, NC</h1>");
    expect(breadcrumb).toMatchObject({
      itemListElement: [
        { name: "Home", item: "https://ecpaintingcharlotte.com/" },
        { name: "Services", item: "https://ecpaintingcharlotte.com/services/" },
      ],
    });
    expect(snapshot?.title).toBe("Painting Services in Charlotte, NC | 593 EC Painting");
  });

  it("removes tag-stripping spaces before punctuation in FAQ schema answers", async () => {
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      title: "Exterior Painting",
      slug: "exterior-painting",
      canonicalUrl: "https://ecpaintingcharlotte.com/exterior-painting/",
      content: {
        blocks: [
          {
            id: "faq-exterior",
            type: "faq",
            props: {
              items: [
                {
                  question: "Do you pressure wash first?",
                  answer:
                    'Yes. See our dedicated <a href="/pressure-washing/">pressure washing page</a>.',
                },
              ],
            },
          },
        ],
      },
    });
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/exterior-painting/");
    const faqSchema = snapshot?.jsonLd?.find((schema) => schema["@type"] === "FAQPage") as
      | { mainEntity?: Array<{ acceptedAnswer?: { text?: string } }> }
      | undefined;

    expect(faqSchema?.mainEntity?.[0]?.acceptedAnswer?.text).toBe(
      "Yes. See our dedicated pressure washing page.",
    );
  });

  it("normalizes homepage SEO head data for live crawlers", async () => {
    mockGetSeo.mockResolvedValue({
      ...seoSettings,
      defaultOgImageUrl: "/img/593-ec-painting-og.jpg",
      organizationLogoUrl: "/img/593-ec-painting-logo-full-color.png",
    });
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      title: "Home",
      slug: "home",
      seoTitle: "House Painters in Charlotte, NC | 593 EC Painting",
      canonicalUrl: "https://ecpaintingcharlotte.com",
      ogImageUrl: null,
    });
    const { getPublicHtmlSnapshot, injectPublicHtmlSnapshot } = await import(
      "../services/public-prerender.service"
    );

    const snapshot = await getPublicHtmlSnapshot("/");
    const html = injectPublicHtmlSnapshot(
      "<html><head><title>Default</title><!--APP_DYNAMIC_HEAD--></head><body><!--APP_PRERENDER_CONTENT--><div id=\"root\"></div></body></html>",
      snapshot,
    );

    expect(snapshot?.canonicalUrl).toBe("https://ecpaintingcharlotte.com/");
    expect(html).toContain('<link rel="canonical" href="https://ecpaintingcharlotte.com/" />');
    expect(html).toContain('<meta property="og:image" content="https://ecpaintingcharlotte.com/img/593-ec-painting-og.jpg" />');
    expect(html).toContain('"HousePainter"');
    expect(html).toContain('"priceRange":"$$"');
    expect(html).toContain('"ratingValue":"5.0"');
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

  it("does not prerender the retired public search page", async () => {
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    await expect(getPublicHtmlSnapshot("/search", "?query=application+process")).resolves.toBeNull();
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
        '<script async src="https://example.com/vendor.js"></script',
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
