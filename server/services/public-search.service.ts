import type { CmsPage } from "@shared/schema";
import type { PublicSearchResult } from "@shared/types/public-search";
import { storage } from "../storage";

interface SearchDocument {
  type: PublicSearchResult["type"];
  id: string;
  title: string;
  url: string;
  metadata?: string | null;
  searchableText: string;
  excerptSource: string;
}

interface FallbackPageDocument extends Omit<SearchDocument, "id"> {
  slug: string;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength = 180): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function collectContentText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return stripHtml(value);
  if (Array.isArray(value)) return value.map(collectContentText).filter(Boolean).join(" ");
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).map(collectContentText).filter(Boolean).join(" ");
  }
  return "";
}

function normalizeQuery(query: string) {
  const trimmed = query.trim().toLowerCase();
  return {
    raw: trimmed,
    terms: trimmed.split(/\s+/).filter(Boolean),
  };
}

function scoreSearchMatch(query: string, terms: string[], title: string, body: string, path = "") {
  if (!query) return 0;
  const lowerTitle = title.toLowerCase();
  const lowerBody = body.toLowerCase();
  const lowerPath = path.toLowerCase();

  let score = 0;

  if (lowerTitle === query) score += 180;
  if (lowerTitle.includes(query)) score += 120;
  if (lowerPath.includes(query)) score += 45;
  if (lowerBody.includes(query)) score += 55;

  const matchedTitleTerms = terms.filter((term) => lowerTitle.includes(term)).length;
  const matchedBodyTerms = terms.filter((term) => lowerBody.includes(term)).length;
  const matchedPathTerms = terms.filter((term) => lowerPath.includes(term)).length;

  if (matchedTitleTerms === terms.length) score += 70;
  else score += matchedTitleTerms * 18;

  if (matchedBodyTerms === terms.length) score += 35;
  else score += matchedBodyTerms * 8;

  score += matchedPathTerms * 8;

  return score;
}

function pageUrlForSlug(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

function buildExcerpt(source: string, query: string, terms: string[], maxLength = 180) {
  const plainText = stripHtml(source);
  if (!plainText) return "";

  const lower = plainText.toLowerCase();
  const matchIndex = [query, ...terms]
    .filter(Boolean)
    .map((term) => lower.indexOf(term.toLowerCase()))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (matchIndex === undefined) {
    return truncate(plainText, maxLength);
  }

  const start = Math.max(0, matchIndex - 60);
  const end = Math.min(plainText.length, matchIndex + maxLength - 20);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < plainText.length ? "..." : "";
  return `${prefix}${plainText.slice(start, end).trim()}${suffix}`;
}

function joinFragments(values: Array<string | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const FALLBACK_PAGE_DOCUMENTS: FallbackPageDocument[] = [
  {
    slug: "home",
    type: "page",
    title: "593 EC Painting",
    url: "/",
    metadata: "Page",
    searchableText: [
      "593 EC Painting",
      "Charlotte family-owned house painters",
      "interior painting",
      "exterior painting",
      "cabinet painting",
      "deck staining",
      "fence staining",
      "free quote",
    ].join(" "),
    excerptSource: "Family-owned house painters serving Charlotte and the surrounding Carolinas.",
  },
  {
    slug: "about",
    type: "page",
    title: "About 593 EC Painting",
    url: "/about",
    metadata: "Page",
    searchableText: [
      "Esau",
      "Sandra",
      "family-owned",
      "Charlotte painters",
      "3-year workmanship warranty",
      "owner operated",
    ].join(" "),
    excerptSource: "Meet Esau and Sandra, the husband-and-wife team behind 593 EC Painting.",
  },
  {
    slug: "contact",
    type: "page",
    title: "Contact 593 EC Painting",
    url: "/contact",
    metadata: "Page",
    searchableText: [
      "Contact",
      "free painting quote",
      "(774) 329-7109",
      "Charlotte NC",
      "request estimate",
    ].join(" "),
    excerptSource: "Request a free painting quote from 593 EC Painting.",
  },
  {
    slug: "gallery",
    type: "page",
    title: "Painting Gallery",
    url: "/gallery",
    metadata: "Page",
    searchableText: [
      "gallery",
      "before and after",
      "recent painting projects",
      "interior",
      "exterior",
      "cabinets",
      "decks",
      "fences",
    ].join(" "),
    excerptSource: "Browse recent interior, exterior, cabinet, deck, and fence painting projects.",
  },
  {
    slug: "reviews",
    type: "page",
    title: "Reviews",
    url: "/reviews",
    metadata: "Page",
    searchableText: [
      "reviews",
      "Google reviews",
      "5-star",
      "Charlotte homeowners",
      "testimonials",
    ].join(" "),
    excerptSource: "See what Charlotte homeowners say about 593 EC Painting.",
  },
  {
    slug: "services",
    type: "page",
    title: "Painting Services",
    url: "/services",
    metadata: "Page",
    searchableText: [
      "services",
      "all services",
      "interior painting",
      "exterior painting",
      "cabinet painting",
      "deck staining",
      "fence staining",
      "residential painters",
    ].join(" "),
    excerptSource: "Explore residential painting services from 593 EC Painting.",
  },
  {
    slug: "interior-painting",
    type: "page",
    title: "Interior Painting",
    url: "/interior-painting",
    metadata: "Service",
    searchableText: "interior painting walls ceilings trim doors full home repaints Charlotte NC",
    excerptSource: "Interior house painters serving Charlotte, NC.",
  },
  {
    slug: "exterior-painting",
    type: "page",
    title: "Exterior Painting",
    url: "/exterior-painting",
    metadata: "Service",
    searchableText: "exterior painting siding brick stucco trim shutters wood rot repair Charlotte NC",
    excerptSource: "Exterior house painters serving Charlotte, NC.",
  },
  {
    slug: "popcorn-ceiling-removal",
    type: "page",
    title: "Popcorn Ceiling Removal",
    url: "/popcorn-ceiling-removal",
    metadata: "Service",
    searchableText: "popcorn ceiling removal acoustic ceiling scraping smooth ceiling drywall repair ceiling painting Charlotte NC",
    excerptSource: "Professional popcorn ceiling removal in Charlotte, NC.",
  },
  {
    slug: "drywall-repair",
    type: "page",
    title: "Drywall Repair",
    url: "/drywall-repair",
    metadata: "Service",
    searchableText: "drywall repair holes patches water damage settling cracks texture matching Charlotte NC",
    excerptSource: "Professional drywall repair in Charlotte, NC.",
  },
  {
    slug: "wallpaper-removal",
    type: "page",
    title: "Wallpaper Removal",
    url: "/wallpaper-removal",
    metadata: "Service",
    searchableText: "wallpaper removal steam scrape adhesive drywall repair fresh paint Charlotte NC",
    excerptSource: "Professional wallpaper removal in Charlotte, NC.",
  },
  {
    slug: "pressure-washing",
    type: "page",
    title: "Pressure Washing",
    url: "/pressure-washing",
    metadata: "Service",
    searchableText: "pressure washing soft wash siding brick concrete decks patios Charlotte NC",
    excerptSource: "Professional pressure washing for homes in Charlotte, NC.",
  },
  {
    slug: "hardie-plank-painting",
    type: "page",
    title: "Hardie Plank Painting",
    url: "/hardie-plank-painting",
    metadata: "Service",
    searchableText: "Hardie plank painting fiber cement siding ColorPlus caulking exterior paint Charlotte NC",
    excerptSource: "Professional Hardie plank and fiber cement siding painting in Charlotte, NC.",
  },
  {
    slug: "cabinet-painting",
    type: "page",
    title: "Cabinet Painting",
    url: "/cabinet-painting",
    metadata: "Service",
    searchableText: "cabinet painting kitchen cabinets bathroom cabinets refinishing cabinet color change Charlotte NC",
    excerptSource: "Kitchen and bathroom cabinet painting in Charlotte, NC.",
  },
  {
    slug: "deck-staining",
    type: "page",
    title: "Deck Staining",
    url: "/deck-staining",
    metadata: "Service",
    searchableText: "deck staining deck painting deck sealing deck cleaning deck repair Charlotte NC",
    excerptSource: "Deck staining, sealing, and painting in Charlotte, NC.",
  },
  {
    slug: "fence-staining",
    type: "page",
    title: "Fence Staining",
    url: "/fence-staining",
    metadata: "Service",
    searchableText: "fence staining fence painting fence cleaning fence board replacement Charlotte NC",
    excerptSource: "Fence staining and painting in Charlotte, NC.",
  },
  {
    slug: "privacy-policy",
    type: "page",
    title: "Privacy Policy",
    url: "/privacy-policy",
    metadata: "Page",
    searchableText: [
      "Privacy Policy",
      "how 593 EC Painting collects uses stores and protects information",
    ].join(" "),
    excerptSource: "Review how 593 EC Painting collects, uses, stores, and protects information.",
  },
  {
    slug: "terms-of-service",
    type: "page",
    title: "Terms of Service",
    url: "/terms-of-service",
    metadata: "Page",
    searchableText: [
      "Terms of Service",
      "terms governing use of the 593 EC Painting website and painting services",
    ].join(" "),
    excerptSource: "Review the terms governing use of the 593 EC Painting website and services.",
  },
  {
    slug: "disclaimer",
    type: "page",
    title: "Disclaimer",
    url: "/disclaimer",
    metadata: "Page",
    searchableText: [
      "Disclaimer",
      "pricing estimates",
      "photos project examples",
      "reviews testimonials",
      "color accuracy",
      "warranty service information",
    ].join(" "),
    excerptSource: "Review important disclaimers about pricing, photos, reviews, color accuracy, and warranty information.",
  },
];

const FALLBACK_PAGE_DOCUMENTS_BY_SLUG = new Map(
  FALLBACK_PAGE_DOCUMENTS.map((document) => [document.slug, document] as const),
);

const RETIRED_PUBLIC_SEARCH_SLUGS = new Set([
  "join",
  "insights",
  "events",
  "recordings",
  "directory",
]);

function buildPageText(page: CmsPage) {
  const fallbackDocument = FALLBACK_PAGE_DOCUMENTS_BY_SLUG.get(page.slug);
  return [
    page.title,
    page.slug,
    page.seoTitle,
    page.seoDescription,
    page.seoKeywords,
    collectContentText(page.content),
    fallbackDocument?.searchableText,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildFallbackPageDocuments(publishedPageSlugs: Set<string>): SearchDocument[] {
  return FALLBACK_PAGE_DOCUMENTS
    .filter((doc) => !publishedPageSlugs.has(doc.slug))
    .map((doc) => ({
      id: `fallback:${doc.slug}`,
      type: doc.type,
      title: doc.title,
      url: doc.url,
      metadata: doc.metadata,
      searchableText: doc.searchableText,
      excerptSource: doc.excerptSource,
    }));
}

export async function searchPublicSite(query: string): Promise<PublicSearchResult[]> {
  const normalized = normalizeQuery(query);
  if (!normalized.raw) return [];

  const pages = await storage.cmsPages.getAllPages();

  const publishedPages = pages.filter(
    (page) =>
      page.status === "published" &&
      !page.noindex &&
      !RETIRED_PUBLIC_SEARCH_SLUGS.has(page.slug),
  );
  const publishedPageSlugs = new Set(publishedPages.map((page) => page.slug));

  const documents: SearchDocument[] = [
    ...publishedPages.map((page) => ({
      type: "page" as const,
      id: page.id,
      title: page.title,
      url: pageUrlForSlug(page.slug),
      metadata: "Page",
      searchableText: buildPageText(page),
      excerptSource: joinFragments([
        page.seoDescription,
        collectContentText(page.content),
        FALLBACK_PAGE_DOCUMENTS_BY_SLUG.get(page.slug)?.excerptSource,
      ]),
    })),
    ...buildFallbackPageDocuments(publishedPageSlugs),
  ];

  return documents
    .map((document) => {
      const score = scoreSearchMatch(
        normalized.raw,
        normalized.terms,
        document.title,
        document.searchableText,
        document.url,
      );

      return score > 0
        ? {
            score,
            result: {
              type: document.type,
              id: document.id,
              title: document.title,
              url: document.url,
              excerpt: buildExcerpt(document.excerptSource || document.searchableText, normalized.raw, normalized.terms),
              metadata: document.metadata,
            } satisfies PublicSearchResult,
          }
        : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .map((entry) => entry.result);
}
