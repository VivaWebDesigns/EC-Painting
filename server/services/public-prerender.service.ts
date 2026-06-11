import sanitizeHtml from "sanitize-html";
import type { BlogPost, CmsPage, Event, SeoSettings } from "@shared/schema";
import { getEventPath } from "@shared/event-url";
import { storage } from "../storage";

interface PublicHtmlSnapshot {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImageUrl?: string | null;
  robots?: string | null;
  bodyHtml: string;
  jsonLd?: Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = "593 EC Painting - Charlotte House Painters";
const DEFAULT_DESCRIPTION =
  "593 EC Painting provides residential interior painting, exterior painting, cabinet painting, deck staining, and fence staining in Charlotte, NC.";

const FALLBACK_STATIC_PAGES: Record<
  string,
  { title: string; description: string; body: string; noindex?: boolean }
> = {
  "/": {
    title: "593 EC Painting | Charlotte's Family-Owned House Painters",
    description:
      "Family-owned house painters serving Charlotte, NC and surrounding areas. Interior, exterior, cabinets, decks, and fences. Honest pricing, free quotes, work guaranteed.",
    body:
      "593 EC Painting is a family-owned residential painting business serving Charlotte and the surrounding Carolinas with interior, exterior, cabinet, deck, and fence painting.",
  },
  "/about": {
    title: "About 593 EC Painting",
    description:
      "Meet Esau and Sandra, the husband-and-wife team behind 593 EC Painting.",
    body:
      "593 EC Painting is run by Esau and Sandra, a husband-and-wife team painting Charlotte homes with honest pricing, careful prep, and clear communication.",
  },
  "/contact": {
    title: "Contact 593 EC Painting",
    description:
      "Request a free painting quote from 593 EC Painting in Charlotte, NC.",
    body:
      "Call or text (774) 329-7109, or request a free quote for your next interior, exterior, cabinet, deck, or fence project.",
  },
  "/gallery": {
    title: "Painting Gallery",
    description:
      "Before and after photos of recent painting projects across Charlotte, NC.",
    body:
      "Browse recent interior, exterior, cabinet, deck, and fence painting work from 593 EC Painting.",
  },
  "/reviews": {
    title: "Reviews",
    description:
      "See what Charlotte homeowners say about 593 EC Painting.",
    body:
      "Read reviews from Charlotte-area homeowners who hired 593 EC Painting for residential painting projects.",
  },
  "/services": {
    title: "Painting Services in Charlotte, NC",
    description:
      "Interior, exterior, cabinet, deck, and fence painting services across Charlotte, NC and the surrounding Carolinas.",
    body:
      "Explore residential painting services from 593 EC Painting, including interior painting, exterior painting, cabinet painting, deck staining, and fence staining.",
  },
  "/interior-painting": {
    title: "Interior House Painters in Charlotte, NC",
    description:
      "Family-owned interior painters serving Charlotte, NC. Walls, ceilings, trim, popcorn ceiling removal, wallpaper removal, and drywall repair.",
    body:
      "593 EC Painting paints walls, ceilings, trim, doors, built-ins, and full home interiors with careful prep and clean daily communication.",
  },
  "/exterior-painting": {
    title: "Exterior House Painters in Charlotte, NC",
    description:
      "Family-owned exterior painters serving Charlotte, NC. Siding, brick, stucco, trim, and pressure washing.",
    body:
      "593 EC Painting paints siding, brick, stucco, trim, doors, shutters, and full exteriors with prep built for Carolina weather.",
  },
  "/cabinet-painting": {
    title: "Cabinet Painters in Charlotte, NC",
    description:
      "Kitchen and bathroom cabinet painting in Charlotte, NC with a smooth, durable finish.",
    body:
      "593 EC Painting refinishes kitchen and bathroom cabinets with cabinet-grade products, spray-applied finishes, and a 3-year workmanship warranty.",
  },
  "/deck-staining": {
    title: "Deck Staining & Painting in Charlotte, NC",
    description:
      "Professional deck staining, sealing, and painting in Charlotte, NC.",
    body:
      "593 EC Painting cleans, repairs, stains, seals, and paints residential decks across the Charlotte area.",
  },
  "/fence-staining": {
    title: "Fence Staining & Painting in Charlotte, NC",
    description:
      "Professional fence staining and painting in Charlotte, NC.",
    body:
      "593 EC Painting restores wood fences with cleaning, repairs, staining, painting, and sealing.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "How 593 EC Painting collects, uses, and protects your information when you visit our website or request a painting quote.",
    body:
      "Review how 593 EC Painting collects, uses, stores, and protects information across the website and related services.",
  },
  "/terms-of-service": {
    title: "Terms of Service",
    description:
      "Terms of service for 593 EC Painting LLC, governing use of our website and painting services.",
    body:
      "Review the terms governing use of the 593 EC Painting website and residential painting services.",
  },
  "/disclaimer": {
    title: "Disclaimer",
    description:
      "Important disclaimers regarding information, photos, pricing guidance, and content on the 593 EC Painting website.",
    body:
      "Review important disclaimers about project information, photos, pricing guidance, reviews, color accuracy, and warranty references.",
  },
  "/thank-you": {
    title: "Thank You",
    description:
      "Thank you for requesting a painting quote from 593 EC Painting.",
    body:
      "Your quote request has been received. Esau or Sandra will be in touch within 24 hours, usually sooner.",
    noindex: true,
  },
  "/sitemap": {
    title: "Sitemap",
    description:
      "Complete sitemap of the 593 EC Painting website.",
    body:
      "Browse every page on the 593 EC Painting website, including services, gallery, reviews, contact information, and legal pages.",
  },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(value: string, length = 240) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}...`;
}

function collectTextFragments(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === "string") {
    const normalized = stripHtml(value);
    return normalized ? [normalized] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectTextFragments(entry));
  }
  if (typeof value === "object") {
    const textKeys = Object.entries(value as Record<string, unknown>).filter(([key]) => {
      const normalized = key.toLowerCase();
      return ![
        "id",
        "type",
        "isactive",
        "slug",
        "layout",
        "ctalink",
        "ctaaction",
        "ctasecondarylink",
        "ctasecondaryaction",
        "ctaformslug",
        "minheight",
        "videobackgroundurl",
        "backgroundimageurl",
        "imageurl",
        "sectionbackgroundcolor",
        "overlaycolor",
      ].includes(normalized);
    });
    return textKeys.flatMap(([, entry]) =>
      collectTextFragments(entry),
    );
  }
  return [];
}

function uniqueFragments(fragments: string[]) {
  const seen = new Set<string>();
  return fragments.filter((fragment) => {
    const normalized = fragment.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function sanitizeRichHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "h2",
      "h3",
      "h4",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  });
}

function absoluteUrl(path: string | null | undefined, siteUrl: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

function buildHeadTitle(rawTitle: string, seo?: SeoSettings | null) {
  const suffix = seo?.titleSuffix ?? " | 593 EC Painting";
  const siteName = seo?.siteName || seo?.organizationName || "";
  return siteName && rawTitle.includes(siteName) ? rawTitle : `${rawTitle}${suffix}`;
}

function buildOrganizationSchema(seo: SeoSettings | null, siteUrl: string) {
  if (!seo?.organizationName && !seo?.siteName) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: seo?.organizationName || seo?.siteName || "593 EC Painting",
    url: siteUrl,
    logo: seo?.organizationLogoUrl
      ? {
          "@type": "ImageObject",
          url: absoluteUrl(seo.organizationLogoUrl, siteUrl),
        }
      : undefined,
  };
}

function getCmsMetadata(page: CmsPage) {
  const content = page.content;
  if (!content || typeof content !== "object") return {};
  const metadata = (content as { metadata?: unknown }).metadata;
  return metadata && typeof metadata === "object" ? (metadata as Record<string, unknown>) : {};
}

function buildServiceSchema(
  page: CmsPage,
  metadata: Record<string, unknown>,
  canonicalUrl: string,
  description: string,
  siteUrl: string,
) {
  const serviceSchema = metadata.serviceSchema;
  if (!serviceSchema || typeof serviceSchema !== "object") return null;
  const schema = serviceSchema as { serviceType?: unknown; areaServed?: unknown };
  if (typeof schema.serviceType !== "string") return null;
  const areaServed = Array.isArray(schema.areaServed)
    ? schema.areaServed.filter((city): city is string => typeof city === "string")
    : [];

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: schema.serviceType,
    name: page.title,
    description,
    url: canonicalUrl,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: areaServed.map((name) => ({ "@type": "City", name })),
  };
}

export async function getPublicHeadAdditions(): Promise<string | null> {
  const headHtml = await storage.settings.getSetting("public_head_html");
  const normalized = normalizeHeadMarkup(headHtml);
  return normalized ? normalized : null;
}

function normalizeHeadMarkup(value?: string | null) {
  if (!value) return null;

  return value
    .trim()
    // Repair a common paste mistake where </script is missing its closing angle bracket.
    .replace(/<\/script(?!>)(?=(\s*<)|\s*$)/gi, "</script>");
}

function buildWebsiteSchema(seo: SeoSettings | null, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seo?.siteName || "593 EC Painting",
    url: siteUrl,
  };
}

function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
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

function extractFaqItems(pageContent: unknown): Array<{ question: string; answer: string }> {
  if (!pageContent || typeof pageContent !== "object") return [];
  const blocks = (pageContent as { blocks?: unknown }).blocks;
  if (!Array.isArray(blocks)) return [];

  const items: Array<{ question: string; answer: string }> = [];
  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;
    const typedBlock = block as { type?: unknown; props?: { items?: unknown } };
    if (typedBlock.type !== "faq" || !Array.isArray(typedBlock.props?.items)) continue;

    for (const item of typedBlock.props.items) {
      if (!item || typeof item !== "object") continue;
      const faqItem = item as { question?: unknown; answer?: unknown };
      if (typeof faqItem.question !== "string" || typeof faqItem.answer !== "string") continue;
      const question = stripHtml(faqItem.question);
      const answer = stripHtml(faqItem.answer);
      if (question && answer) items.push({ question, answer });
    }
  }
  return items;
}

function buildFaqPageSchema(pageContent: unknown) {
  const faqItems = extractFaqItems(pageContent);
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

function buildSimplePageBody(title: string, description: string, fragments: string[] = []) {
  const paragraphs = uniqueFragments([description, ...fragments])
    .filter((fragment) => fragment && fragment.toLowerCase() !== title.trim().toLowerCase())
    .slice(0, 8);

  return [
    `<main class="seo-prerender-content">`,
    `<article>`,
    `<h1>${escapeHtml(title)}</h1>`,
    ...paragraphs.map((paragraph) => `<p>${escapeHtml(truncate(paragraph, 340))}</p>`),
    `</article>`,
    `</main>`,
  ].join("");
}

function buildCmsSnapshot(page: CmsPage, seo: SeoSettings | null, siteUrl: string): PublicHtmlSnapshot {
  const title = page.seoTitle || page.title || "Page";
  const description =
    page.seoDescription ||
    truncate(uniqueFragments(collectTextFragments(page.content)).join(" "), 180) ||
    DEFAULT_DESCRIPTION;
  const canonicalUrl =
    page.canonicalUrl || (page.slug === "home" ? siteUrl : `${siteUrl}/${page.slug}`);
  const metadata = getCmsMetadata(page);
  const bodyHtml = buildSimplePageBody(
    page.title,
    description,
    uniqueFragments(collectTextFragments(page.content)),
  );

  const breadcrumbParent =
    metadata.breadcrumbParent && typeof metadata.breadcrumbParent === "object"
      ? (metadata.breadcrumbParent as { name?: unknown; url?: unknown })
      : null;
  const breadcrumbs =
    page.slug === "home"
      ? null
      : buildBreadcrumbSchema(
          breadcrumbParent &&
            typeof breadcrumbParent.name === "string" &&
            typeof breadcrumbParent.url === "string"
            ? [
                { name: "Home", url: siteUrl },
                { name: breadcrumbParent.name, url: breadcrumbParent.url },
                { name: page.title, url: canonicalUrl },
              ]
            : [
                { name: "Home", url: siteUrl },
                { name: page.title, url: canonicalUrl },
              ],
        );

  return {
    title: buildHeadTitle(title, seo),
    description,
    canonicalUrl,
    ogImageUrl: page.ogImageUrl || seo?.defaultOgImageUrl || null,
    robots: page.noindex
      ? "noindex,nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    bodyHtml,
    jsonLd: [
      buildOrganizationSchema(seo, siteUrl),
      buildWebsiteSchema(seo, siteUrl),
      breadcrumbs,
      buildServiceSchema(page, metadata, canonicalUrl, description, siteUrl),
      buildFaqPageSchema(page.content),
    ].filter(Boolean) as Array<Record<string, unknown>>,
  };
}

function buildPostSnapshot(post: BlogPost, seo: SeoSettings | null, siteUrl: string): PublicHtmlSnapshot {
  const canonicalUrl = `${siteUrl}/insights/${post.slug}`;
  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription || post.excerpt || truncate(stripHtml(post.content), 180) || DEFAULT_DESCRIPTION;
  const bodyHtml = [
    `<main class="seo-prerender-content">`,
    `<article>`,
    `<h1>${escapeHtml(post.title)}</h1>`,
    post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : "",
    sanitizeRichHtml(post.content),
    `</article>`,
    `</main>`,
  ].join("");

  return {
    title: buildHeadTitle(title, seo),
    description,
    canonicalUrl,
    ogImageUrl: post.ogImageUrl || post.coverImageUrl || seo?.defaultOgImageUrl || null,
    robots: post.noindex ? "noindex,nofollow" : null,
    bodyHtml,
    jsonLd: [
      buildOrganizationSchema(seo, siteUrl),
      buildWebsiteSchema(seo, siteUrl),
      buildBreadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Insights", url: `${siteUrl}/insights` },
        { name: post.title, url: canonicalUrl },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.seoTitle || post.title,
        description,
        url: canonicalUrl,
        image: absoluteUrl(post.ogImageUrl || post.coverImageUrl, siteUrl) || undefined,
        datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
        dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
        author: post.authorName
          ? {
              "@type": "Person",
              name: post.authorName,
            }
          : undefined,
      },
    ].filter(Boolean) as Array<Record<string, unknown>>,
  };
}

function buildEventSnapshot(event: Event, seo: SeoSettings | null, siteUrl: string): PublicHtmlSnapshot {
  const canonicalUrl = `${siteUrl}${getEventPath(event)}`;
  const title = event.title;
  const description = truncate(stripHtml(event.description || ""), 180) || DEFAULT_DESCRIPTION;
  const detailLines = [
    event.description ? sanitizeRichHtml(event.description) : "",
    event.speakerName ? `<p><strong>Speaker:</strong> ${escapeHtml(event.speakerName)}</p>` : "",
    event.locationName || event.location
      ? `<p><strong>Location:</strong> ${escapeHtml(event.locationName || event.location || "")}</p>`
      : "",
    event.date
      ? `<p><strong>Date:</strong> ${escapeHtml(new Date(event.date).toUTCString())}</p>`
      : "",
  ].filter(Boolean);

  return {
    title: buildHeadTitle(title, seo),
    description,
    canonicalUrl,
    ogImageUrl: event.imageUrl || seo?.defaultOgImageUrl || null,
    bodyHtml: [
      `<main class="seo-prerender-content">`,
      `<article>`,
      `<h1>${escapeHtml(event.title)}</h1>`,
      ...detailLines,
      `</article>`,
      `</main>`,
    ].join(""),
    jsonLd: [
      buildOrganizationSchema(seo, siteUrl),
      buildWebsiteSchema(seo, siteUrl),
      buildBreadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Events", url: `${siteUrl}/events` },
        { name: event.title, url: canonicalUrl },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.description || undefined,
        url: canonicalUrl,
        image: absoluteUrl(event.imageUrl, siteUrl) || undefined,
        startDate: event.date ? new Date(event.date).toISOString() : undefined,
        endDate: event.endDate ? new Date(event.endDate).toISOString() : undefined,
        location:
          event.locationName || event.location || event.locationAddress
            ? {
                "@type": "Place",
                name: event.locationName || event.location || undefined,
                address: event.locationAddress || event.location || undefined,
              }
            : undefined,
      },
    ].filter(Boolean) as Array<Record<string, unknown>>,
  };
}

async function buildTherapistSnapshot(
  id: string,
  seo: SeoSettings | null,
  siteUrl: string,
): Promise<PublicHtmlSnapshot | null> {
  const profile = await storage.therapists.getProfileWithUser(id);
  if (!profile || !profile.isApproved || !profile.isActive) return null;

  const displayName =
    [profile.user?.firstName, profile.user?.lastName].filter(Boolean).join(" ") ||
    "Mental Health Professional";
  const canonicalUrl = `${siteUrl}/directory/${profile.id}`;
  const description =
    truncate(
      stripHtml(profile.bio || profile.title || "View this professional profile."),
      180,
    ) || "View this professional profile.";

  return {
    title: buildHeadTitle(displayName, seo),
    description,
    canonicalUrl,
    ogImageUrl: profile.user?.profileImageUrl || seo?.defaultOgImageUrl || null,
    bodyHtml: [
      `<main class="seo-prerender-content">`,
      `<article>`,
      `<h1>${escapeHtml(displayName)}</h1>`,
      profile.title ? `<p>${escapeHtml(profile.title)}</p>` : "",
      profile.bio ? sanitizeRichHtml(profile.bio) : "",
      profile.city || profile.country
        ? `<p>${escapeHtml([profile.city, profile.country].filter(Boolean).join(", "))}</p>`
        : "",
      `</article>`,
      `</main>`,
    ].join(""),
    jsonLd: [
      buildOrganizationSchema(seo, siteUrl),
      buildWebsiteSchema(seo, siteUrl),
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: displayName,
        description,
        url: canonicalUrl,
      },
    ].filter(Boolean) as Array<Record<string, unknown>>,
  };
}

function buildSearchSnapshot(query: string, seo: SeoSettings | null, siteUrl: string): PublicHtmlSnapshot {
  const term = query.trim();
  const title = term ? `Search Results for "${term}"` : "Site Search";
  const description = term
    ? `Search results for ${term} across pages on 593 EC Painting.`
    : "Search pages on 593 EC Painting.";

  return {
    title: buildHeadTitle(title, seo),
    description,
    canonicalUrl: term ? `${siteUrl}/search?query=${encodeURIComponent(term)}` : `${siteUrl}/search`,
    robots: "noindex,follow",
    bodyHtml: buildSimplePageBody(title, description, [
      "Search the site for pages, articles, and events.",
      term ? `Current search query: ${term}` : "",
    ]),
    jsonLd: [buildOrganizationSchema(seo, siteUrl), buildWebsiteSchema(seo, siteUrl)].filter(
      Boolean,
    ) as Array<Record<string, unknown>>,
  };
}

function buildFallbackSnapshot(
  pathname: string,
  seo: SeoSettings | null,
  siteUrl: string,
): PublicHtmlSnapshot | null {
  const fallback = FALLBACK_STATIC_PAGES[pathname];
  if (!fallback) return null;

  return {
    title: buildHeadTitle(fallback.title, seo),
    description: fallback.description,
    canonicalUrl: pathname === "/" ? siteUrl : `${siteUrl}${pathname}`,
    ogImageUrl: seo?.defaultOgImageUrl || null,
    robots: fallback.noindex ? "noindex,nofollow" : null,
    bodyHtml: buildSimplePageBody(fallback.title, fallback.body),
    jsonLd: [buildOrganizationSchema(seo, siteUrl), buildWebsiteSchema(seo, siteUrl)].filter(
      Boolean,
    ) as Array<Record<string, unknown>>,
  };
}

function resolveCmsSlugForPathname(pathname: string) {
  if (pathname === "/") return "home";
  const normalized = pathname.replace(/^\/+|\/+$/g, "");
  if (!normalized) return "";
  const serviceMatch = normalized.match(/^services\/([^/]+)$/);
  if (serviceMatch) return serviceMatch[1];
  return normalized.includes("/") ? "" : normalized;
}

export async function getPublicHtmlSnapshot(
  pathname: string,
  search = "",
): Promise<PublicHtmlSnapshot | null> {
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/therapist") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/preview") ||
    pathname.startsWith("/uploads")
  ) {
    return null;
  }

  const seo = (await storage.seoSettings.get()) ?? null;
  const siteUrl = (seo?.siteUrl || "").replace(/\/$/, "") || "https://ec-painting-production.up.railway.app";

  if (pathname === "/search") {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    return buildSearchSnapshot(params.get("query") || "", seo, siteUrl);
  }

  const blogMatch = pathname.match(/^\/insights\/([^/]+)$/);
  if (blogMatch) {
    const post = await storage.blog.getPostBySlug(decodeURIComponent(blogMatch[1]));
    if (!post || !post.isPublished) return null;
    return buildPostSnapshot(post, seo, siteUrl);
  }

  const eventMatch = pathname.match(/^\/events\/([^/]+)$/);
  if (eventMatch) {
    const event = await storage.events.getEventByIdentifier(decodeURIComponent(eventMatch[1]));
    if (!event || event.status !== "published" || event.visibility !== "public") return null;
    return buildEventSnapshot(event, seo, siteUrl);
  }

  const therapistMatch = pathname.match(/^\/directory\/([^/]+)$/);
  if (therapistMatch) {
    return buildTherapistSnapshot(decodeURIComponent(therapistMatch[1]), seo, siteUrl);
  }

  const slug = resolveCmsSlugForPathname(pathname);
  if (slug) {
    const page = await storage.cmsPages.getPageBySlug(slug);
    if (page?.status === "published") {
      return buildCmsSnapshot(page, seo, siteUrl);
    }
  }

  return buildFallbackSnapshot(pathname, seo, siteUrl);
}

export function injectPublicHtmlSnapshot(
  template: string,
  snapshot: PublicHtmlSnapshot | null,
  customHeadHtml?: string | null,
) {
  const normalizedTemplate = template
    .replace(/\s*<meta name="description"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta property="og:title"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta property="og:description"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta property="og:image"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta property="og:url"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="twitter:card"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="twitter:title"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="twitter:description"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="robots"[^>]*>\s*/i, "\n")
    .replace(/\s*<link rel="canonical"[^>]*>\s*/i, "\n");

  if (!snapshot) {
    return normalizedTemplate
      .replace("<!--APP_DYNAMIC_HEAD-->", customHeadHtml || "")
      .replace("<!--APP_PRERENDER_CONTENT-->", "");
  }

  const headParts = [
    `<meta name="description" content="${escapeHtml(snapshot.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(snapshot.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(snapshot.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(snapshot.canonicalUrl)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(snapshot.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(snapshot.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(snapshot.canonicalUrl)}" />`,
    snapshot.robots ? `<meta name="robots" content="${escapeHtml(snapshot.robots)}" />` : "",
    snapshot.ogImageUrl
      ? `<meta property="og:image" content="${escapeHtml(snapshot.ogImageUrl)}" />`
      : "",
    customHeadHtml || "",
    ...(snapshot.jsonLd ?? []).map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`,
    ),
  ].filter(Boolean);

  return normalizedTemplate
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(snapshot.title)}</title>`)
    .replace("<!--APP_DYNAMIC_HEAD-->", headParts.join("\n"))
    .replace(
      "<!--APP_PRERENDER_CONTENT-->",
      snapshot.bodyHtml ? `<div id="seo-prerender">${snapshot.bodyHtml}</div>` : "",
    );
}
