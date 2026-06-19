import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CmsPage } from "@shared/schema";

const mockGetAllPages = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    cmsPages: {
      getAllPages: mockGetAllPages,
    },
  },
}));

const samplePage: CmsPage = {
  id: "page-1",
  title: "Painting Process",
  slug: "painting-process",
  status: "published",
  pageType: "custom",
  template: "full-width",
  sidebarId: null,
  content: [{ title: "The Painting Process", body: "Learn how prep, paint, cleanup, and walkthroughs work." }],
  seoTitle: null,
  seoDescription: "A guide to the 593 EC Painting process.",
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

const draftPage: CmsPage = {
  ...samplePage,
  id: "page-2",
  title: "Draft Only",
  slug: "draft-only",
  status: "draft",
};

const joinCmsPage: CmsPage = {
  ...samplePage,
  id: "page-join",
  title: "Join the Network",
  slug: "join",
  seoDescription: null,
  content: [{ title: "Membership", body: "Grow your practice with Core Platform." }],
};

describe("public-search.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllPages.mockResolvedValue([samplePage, draftPage]);
  });

  it("returns current public page results for matching content", async () => {
    const { searchPublicSite } = await import("../services/public-search.service");
    const results = await searchPublicSite("painting process");

    expect(results.map((result) => result.type)).toEqual(expect.arrayContaining(["page"]));
    expect(results.map((result) => result.url)).toContain("/painting-process");
    expect(results.map((result) => result.url)).not.toContain("/insights/understanding-application-process");
    expect(results.map((result) => result.url)).not.toContain("/events/application-process-webinar");
  });

  it("does not return non-public or draft content", async () => {
    const { searchPublicSite } = await import("../services/public-search.service");
    const results = await searchPublicSite("draft");

    expect(results).toHaveLength(0);
  });

  it("prefers title matches over body-only matches", async () => {
    const { searchPublicSite } = await import("../services/public-search.service");
    const results = await searchPublicSite("painting process");

    expect(results[0]?.title).toBe("Painting Process");
  });

  it("includes current fallback public pages when no published CMS page exists for that route", async () => {
    mockGetAllPages.mockResolvedValue([]);

    const { searchPublicSite } = await import("../services/public-search.service");
    const results = await searchPublicSite("free painting quote");

    expect(results.some((result) => result.url === "/contact")).toBe(true);
    expect(results.find((result) => result.url === "/contact")?.excerpt).toContain("Request a free painting quote");
  });

  it("excludes retired inherited CMS slugs from public search", async () => {
    mockGetAllPages.mockResolvedValue([joinCmsPage]);

    const { searchPublicSite } = await import("../services/public-search.service");
    const results = await searchPublicSite("join network");

    expect(results.some((result) => result.url === "/join")).toBe(false);
  });
});
