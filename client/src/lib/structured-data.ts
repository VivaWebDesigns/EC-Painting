import type { SeoSettings } from "@shared/schema";
import { stripHtml } from "@/lib/html";

export type JsonLdObject = Record<string, unknown>;

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
  const siteUrl = globalSeo.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");

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
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name,
    url: siteUrl || undefined,
    logo: globalSeo.organizationLogoUrl
      ? {
          "@type": "ImageObject",
          url: absoluteUrl(globalSeo.organizationLogoUrl, siteUrl),
        }
      : undefined,
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
    url: siteUrl,
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
