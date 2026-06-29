import type { SeoSettings } from "@shared/schema";
import { stripHtml } from "@/lib/html";

export type JsonLdObject = Record<string, unknown>;

const BUSINESS_PHONE = "+17743297109";
const BUSINESS_EMAIL = "ecpainting_593@outlook.com";
const BUSINESS_DESCRIPTION =
  "Family-owned house painters serving Charlotte, NC with interior painting, exterior painting, cabinet painting, deck staining, fence staining, drywall repair, pressure washing, and related residential painting services.";
const BUSINESS_SERVICE_AREAS = [
  ["Charlotte", "NC"],
  ["Matthews", "NC"],
  ["Mint Hill", "NC"],
  ["Monroe", "NC"],
  ["Pineville", "NC"],
  ["Huntersville", "NC"],
  ["Cornelius", "NC"],
  ["Davidson", "NC"],
  ["Concord", "NC"],
  ["Waxhaw", "NC"],
  ["Indian Trail", "NC"],
  ["Stallings", "NC"],
  ["Fort Mill", "SC"],
  ["Indian Land", "SC"],
  ["Rock Hill", "SC"],
];
const BUSINESS_SERVICES = [
  "Interior Painting",
  "Exterior Painting",
  "Cabinet Painting",
  "Deck Staining",
  "Fence Staining",
  "Drywall Repair",
  "Pressure Washing",
  "Popcorn Ceiling Removal",
  "Wallpaper Removal",
];

function compactObject(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
}

function absoluteUrl(path: string, base?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = base || (typeof window !== "undefined" ? window.location.origin : "");
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function buildOrganizationLd(globalSeo: SeoSettings): JsonLdObject | null {
  if (!globalSeo.organizationName && !globalSeo.siteName) return null;

  const name = globalSeo.organizationName || globalSeo.siteName || "593 EC Painting";
  const siteUrl = (globalSeo.siteUrl || (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/$/, "");
  const logoUrl = absoluteUrl(globalSeo.organizationLogoUrl || "/img/593-ec-painting-logo-full-color.png", siteUrl);
  const imageUrl = absoluteUrl(globalSeo.defaultOgImageUrl || "/img/593-ec-painting-og.jpg", siteUrl);

  const sameAs: string[] = [
    globalSeo.facebookUrl,
    globalSeo.linkedinUrl,
    globalSeo.instagramUrl,
    globalSeo.twitterHandle
      ? `https://x.com/${globalSeo.twitterHandle.replace(/^@/, "")}`
      : null,
  ].filter((url): url is string => !!url);

  return compactObject({
    "@context": "https://schema.org",
    "@type": ["HousePainter", "LocalBusiness"],
    "@id": `${siteUrl}/#business`,
    name,
    legalName: "593 EC Painting LLC",
    description: BUSINESS_DESCRIPTION,
    url: siteUrl ? `${siteUrl}/` : undefined,
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    priceRange: "$$",
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
    },
    image: imageUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: "7007 Berolina Ln",
      addressLocality: "Charlotte",
      addressRegion: "NC",
      postalCode: "28226",
      addressCountry: "US",
    },
    areaServed: BUSINESS_SERVICE_AREAS.map(([name, region]) => ({
      "@type": "City",
      name,
      addressRegion: region,
      addressCountry: "US",
    })),
    openingHoursSpecification: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((dayOfWeek) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek,
      opens: "08:00",
      closes: "17:00",
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Residential painting services",
      itemListElement: BUSINESS_SERVICES.map((serviceName) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: serviceName,
          provider: { "@id": `${siteUrl}/#business` },
        },
      })),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "21",
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  });
}

export function buildWebSiteLd(globalSeo: SeoSettings): JsonLdObject | null {
  const siteUrl = globalSeo.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
  if (!siteUrl) return null;

  return compactObject({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: globalSeo.siteName || "593 EC Painting",
    url: `${siteUrl.replace(/\/$/, "")}/`,
  });
}

export function buildBreadcrumbLd(
  items: Array<{ name: string; url: string }>
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildServiceLd({
  name,
  description,
  url,
  serviceType,
  providerId,
  areaServed,
}: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  providerId: string;
  areaServed: string[];
}): JsonLdObject | null {
  if (!name || !description || !url || !serviceType) return null;

  return compactObject({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType,
    name,
    description,
    url,
    provider: { "@id": providerId },
    areaServed: areaServed.map((name) => ({
      "@type": "City",
      name,
    })),
  });
}

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqBlock {
  type: string;
  props: {
    items?: FaqItem[];
    title?: string;
  };
}

interface BuilderContent {
  blocks?: FaqBlock[];
}

export function extractFaqItems(pageContent: unknown): FaqItem[] {
  if (!pageContent || typeof pageContent !== "object") return [];
  const content = pageContent as BuilderContent;
  if (!Array.isArray(content.blocks)) return [];

  const items: FaqItem[] = [];
  for (const block of content.blocks) {
    if (block.type === "faq" && Array.isArray(block.props?.items)) {
      for (const item of block.props.items) {
        if (item.question && item.answer) {
          items.push({ question: stripHtml(item.question), answer: stripHtml(item.answer) });
        }
      }
    }
  }
  return items;
}

export function buildFaqPageLd(faqItems: FaqItem[]): JsonLdObject | null {
  if (faqItems.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
