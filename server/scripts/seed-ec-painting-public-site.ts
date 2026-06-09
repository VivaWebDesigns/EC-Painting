import { randomUUID } from "crypto";
import { pool } from "../db";
import { storage } from "../storage";
import type { InsertCmsPage, InsertCmsMenu, MenuItem, StandardMenuLocation } from "@shared/schema";

const SITE_URL = process.env.APP_URL || "https://ec-painting-production.up.railway.app";
const BRAND_NAME = "EC Painting";
const LOGO_URL = "/img/ec-painting-logo.png";

function id() {
  return randomUUID();
}

function block(type: string, props: Record<string, unknown>) {
  return { id: id(), type, props: { isActive: true, ...props } };
}

function item(label: string, url: string, children: MenuItem[] = []): MenuItem {
  return {
    id: id(),
    label,
    url,
    openInNewTab: false,
    children,
  };
}

const services = [
  {
    title: "Interior Painting",
    slug: "interior-painting",
    icon: "PaintBucket",
    short:
      "Flawless finishes for walls, ceilings, trim, and lived-in rooms that need a clean refresh.",
    bullets: ["Walls, ceilings, and accent features", "Trim, molding, and baseboards", "Drywall patching and surface repair"],
    body:
      "A fresh coat of paint is one of the fastest ways to transform any room. EC Painting protects your furniture, floors, and fixtures, handles prep carefully, and applies premium low-VOC paints for a clean, durable finish.",
    process:
      "We cover and protect the work area, fill holes and imperfections, sand and prime as needed, then apply your chosen color with sharp lines and full cleanup.",
  },
  {
    title: "Exterior Painting",
    slug: "exterior-painting",
    icon: "Home",
    short:
      "Weather-ready exterior painting that improves curb appeal and protects your home.",
    bullets: ["Siding, brick, stucco, and wood", "Shutters, fascia, soffit, and trim", "Pressure washing and surface prep"],
    body:
      "Your exterior takes on sun, humidity, rain, and seasonal wear. EC Painting restores curb appeal with careful prep and exterior coatings selected for long-lasting color and protection.",
    process:
      "Every exterior job starts with cleaning, scraping, sanding, and priming trouble spots before premium exterior paint is applied evenly across the planned surfaces.",
  },
  {
    title: "Kitchen Cabinet Painting",
    slug: "kitchen-cabinet-painting",
    icon: "Layers",
    short:
      "A smooth cabinet finish that modernizes your kitchen without the cost of replacement.",
    bullets: ["Factory-style finish", "Doors and hardware removed", "Color consulting and multi-coat application"],
    body:
      "Professional cabinet painting can completely change the feel of a kitchen. EC Painting focuses on proper degreasing, sanding, priming, and cabinet-grade coatings so the finish looks polished and wears well.",
    process:
      "Doors, drawers, and hardware are removed, every surface is cleaned and prepared, bonding primer is applied, and durable cabinet paint is built up in smooth coats.",
  },
  {
    title: "Deck Staining & Painting",
    slug: "deck-staining",
    icon: "Sun",
    short:
      "Restore your deck with stain or paint that helps defend outdoor wood from weather.",
    bullets: ["Deep cleaning and sanding", "Transparent stain or solid paint", "Weatherproof sealing"],
    body:
      "Outdoor wood needs protection from sun, moisture, and seasonal wear. EC Painting cleans, repairs, and finishes decks so the space looks better and lasts longer.",
    process:
      "We power wash and let the wood dry, repair loose or damaged boards where needed, sand the surface, and apply the right stain or paint for your goals.",
  },
  {
    title: "Fence Staining & Painting",
    slug: "fence-staining",
    icon: "Fence",
    short:
      "Protect and refresh fences with even stain or paint coverage on exposed wood.",
    bullets: ["Full fence prep", "Even coverage on visible surfaces", "Moisture and UV protection"],
    body:
      "A worn fence can make a property feel neglected. EC Painting restores color and protection with proper cleaning, prep, and finish application.",
    process:
      "We clean the fence, repair loose pickets or problem spots where needed, then apply stain or paint evenly for a finished look that holds up.",
  },
  {
    title: "Commercial Painting",
    slug: "commercial-painting",
    icon: "Building2",
    short:
      "Clean, professional painting for offices, retail spaces, restaurants, and commercial properties.",
    bullets: ["Interior and exterior commercial painting", "Flexible scheduling", "Low-odor paint options"],
    body:
      "First impressions matter for your business. EC Painting works around your schedule to deliver clean, professional commercial painting with minimal disruption.",
    process:
      "We begin with a walkthrough to understand scope, budget, timeline, and access needs, then phase the work so your business can keep moving.",
  },
];

const reviews = [
  {
    quote:
      "The team painted our downstairs quickly and left everything spotless. The lines are clean and the rooms feel brand new.",
    name: "Sarah Jenkins",
    role: "Residential Client",
    location: "Charlotte",
  },
  {
    quote:
      "We hired EC Painting for exterior painting and deck staining. The house looks refreshed and the process was easy.",
    name: "Mike and Linda Ross",
    role: "Homeowners",
    location: "Matthews",
  },
  {
    quote:
      "The cabinet finish made our kitchen feel completely updated. They helped us choose a color and the final result looks polished.",
    name: "Elena Rodriguez",
    role: "Cabinet Painting Client",
    location: "Ballantyne",
  },
  {
    quote:
      "Professional, punctual, and careful around our home. We have already recommended them to neighbors.",
    name: "James Wilson",
    role: "Residential Client",
    location: "Myers Park",
  },
];

const galleryImages = [
  {
    url: "/img/gallery/kitchen-cabinets.webp",
    alt: "Kitchen with painted cabinets and blue island",
    caption: "Kitchen Cabinet Painting",
  },
  {
    url: "/img/gallery/exterior-home.webp",
    alt: "Freshly painted home exterior",
    caption: "Exterior Painting",
  },
  {
    url: "/img/gallery/living-room.webp",
    alt: "Interior living room with freshly painted walls",
    caption: "Interior Painting",
  },
  {
    url: "/img/gallery/front-door.webp",
    alt: "Painted blue front door",
    caption: "Door and Trim Painting",
  },
  {
    url: "/img/gallery/painted-kitchen.webp",
    alt: "Kitchen with bright painted cabinetry",
    caption: "Cabinet Refinish",
  },
  {
    url: "/img/gallery/covered-porch.webp",
    alt: "Covered porch with stained deck boards",
    caption: "Deck Staining",
  },
  {
    url: "/img/gallery/stained-fence.webp",
    alt: "Stained wooden privacy fence",
    caption: "Fence Staining",
  },
];

function serviceCards() {
  return services.map((service) => ({
    title: service.title,
    description: service.short,
    icon: service.icon,
  }));
}

function homeContent() {
  return {
    blocks: [
      block("hero", {
        heading: "We've got your painting needs covered.",
        subheading:
          "<p>Transforming homes and commercial spaces with careful prep, clean lines, and durable finishes.</p>",
        ctaText: "Get a Free Estimate",
        ctaAction: "form-modal",
        ctaFormSlug: "contact-form",
        ctaModalTitle: "Request a Free Estimate",
        ctaModalDescription: "Tell us about your painting project and we will follow up.",
        ctaSecondaryText: "View Our Services",
        ctaSecondaryAction: "internal-link",
        ctaSecondaryLink: "/services",
        videoBackgroundUrl: "/videos/hero-painting-optimized.mp4",
        overlayColor: "#000000",
        overlayOpacity: 62,
        layout: "split",
        minHeight: "700",
      }),
      block("trust-bar", {
        items: [
          { icon: "ShieldCheck", label: "Fully Insured" },
          { icon: "Clock", label: "On-Time Scheduling" },
          { icon: "CheckCircle", label: "Clean Work" },
          { icon: "Star", label: "Free Estimates" },
        ],
      }),
      block("cards-grid", {
        sectionEyebrow: "Our Expertise",
        title: "Quality Painting Services",
        subtitle:
          "From refreshing a single room to transforming your entire exterior, we handle every detail with care.",
        columns: "3",
        cards: serviceCards(),
      }),
      block("feature-list", {
        sectionEyebrow: "Why Choose Us",
        title: "Quality you can count on",
        subtitle:
          "Every project starts with a conversation. We listen to your goals and deliver work that makes your space feel finished.",
        columns: "3",
        features: [
          {
            icon: "ShieldCheck",
            title: "Fully Insured",
            description: "Your home or business is protected on every project.",
          },
          {
            icon: "Clock",
            title: "On-Time Guarantee",
            description: "We show up when we say we will and keep the schedule clear.",
          },
          {
            icon: "CheckCircle",
            title: "Clean Work",
            description: "We protect surfaces, clean up daily, and respect the property.",
          },
        ],
      }),
      block("testimonials", {
        sectionEyebrow: "Reviews",
        title: "What our clients say",
        items: reviews,
        sectionBackgroundColor: "#f4f8fb",
      }),
      block("cta", {
        heading: "Ready to transform your space?",
        subheading: "Request a free, no-obligation painting estimate.",
        primaryText: "Get a Free Estimate",
        primaryAction: "form-modal",
        primaryFormSlug: "contact-form",
        primaryModalTitle: "Request a Free Estimate",
        secondaryText: "See Services",
        secondaryAction: "internal-link",
        secondaryLink: "/services",
        variant: "dark",
      }),
    ],
  };
}

function servicesContent() {
  return {
    blocks: [
      block("section-header", {
        eyebrow: "What We Do",
        title: "Professional Painting Services",
        subtitle:
          "Interior, exterior, cabinet, deck, fence, and commercial painting services built around careful prep and clean results.",
        alignment: "center",
        headingLevel: "h1",
      }),
      block("cards-grid", {
        title: "",
        columns: "3",
        cards: serviceCards(),
      }),
      block("delivery-setup", {
        title: "How It Works",
        subtitle: "A straightforward process from walkthrough to final cleanup.",
        steps: [
          {
            step: "1",
            title: "Request an Estimate",
            description: "Tell us about the rooms, exterior surfaces, cabinets, deck, fence, or commercial space.",
          },
          {
            step: "2",
            title: "Review Scope",
            description: "We confirm prep needs, surfaces, colors, schedule, and project expectations.",
          },
          {
            step: "3",
            title: "Paint and Clean Up",
            description: "We protect the property, complete the work, and leave the area clean.",
          },
        ],
        includedItems: [
          { text: "Surface preparation" },
          { text: "Premium paint and stain options" },
          { text: "Final walkthrough" },
        ],
      }),
      block("cta", {
        heading: "Need help choosing the right service?",
        subheading: "Send a few details and we will point you in the right direction.",
        primaryText: "Get a Free Estimate",
        primaryAction: "form-modal",
        primaryFormSlug: "contact-form",
        variant: "dark",
      }),
    ],
  };
}

function serviceDetailContent(service: (typeof services)[number]) {
  return {
    blocks: [
      block("hero", {
        heading: service.title,
        subheading: `<p>${service.short}</p>`,
        ctaText: "Get a Free Estimate",
        ctaAction: "form-modal",
        ctaFormSlug: "contact-form",
        ctaModalTitle: `Request a ${service.title} Estimate`,
        ctaSecondaryText: "All Services",
        ctaSecondaryAction: "internal-link",
        ctaSecondaryLink: "/services",
        overlayColor: "#021824",
        overlayOpacity: 88,
        layout: "stacked",
        minHeight: "420",
      }),
      block("rich-text", {
        title: `${service.title} by EC Painting`,
        content: `<p>${service.body}</p>`,
        alignment: "left",
      }),
      block("feature-list", {
        title: "What's Included",
        columns: "3",
        features: service.bullets.map((text) => ({
          icon: "CheckCircle",
          title: text,
          description: "",
        })),
        sectionBackgroundColor: "#f4f8fb",
      }),
      block("callout-box", {
        title: "Our Process",
        content: `<p>${service.process}</p>`,
        variant: "outline",
      }),
      block("faq", {
        title: `${service.title} FAQs`,
        items: [
          {
            question: "Can I get a free estimate?",
            answer: "Yes. Send your project details through the contact form and we will follow up with next steps.",
          },
          {
            question: "Do you help with paint colors?",
            answer: "Yes. We can discuss finish, color direction, durability needs, and the look you want before work begins.",
          },
          {
            question: "Will surfaces be protected?",
            answer: "Yes. Protecting floors, furniture, fixtures, landscaping, and nearby surfaces is part of the project plan.",
          },
        ],
      }),
      block("cta", {
        heading: `Ready for ${service.title.toLowerCase()}?`,
        subheading: "Request a free estimate and tell us what you want painted.",
        primaryText: "Get a Free Estimate",
        primaryAction: "form-modal",
        primaryFormSlug: "contact-form",
        variant: "dark",
      }),
    ],
  };
}

function galleryContent() {
  return {
    blocks: [
      block("section-header", {
        eyebrow: "Our Work",
        title: "Project Gallery",
        subtitle:
          "A look at painting, staining, and cabinet refreshes inspired by the EC Painting service lineup.",
        alignment: "center",
        headingLevel: "h1",
      }),
      block("image-grid", {
        title: "",
        columns: "3",
        gap: "md",
        images: galleryImages,
      }),
      block("cta", {
        heading: "Like what you see?",
        subheading: "Tell us about your next painting project and request a free estimate.",
        primaryText: "Get a Free Estimate",
        primaryAction: "form-modal",
        primaryFormSlug: "contact-form",
        variant: "dark",
      }),
    ],
  };
}

function aboutContent() {
  return {
    blocks: [
      block("section-header", {
        eyebrow: "About Us",
        title: "Careful painting, clean work, and clear communication.",
        subtitle:
          "EC Painting helps homeowners and businesses refresh their spaces with professional painting and staining services.",
        alignment: "center",
        headingLevel: "h1",
      }),
      block("text-image", {
        eyebrow: "Our Approach",
        heading: "Painting work should feel organized from start to finish.",
        subtitle:
          "We focus on the details that make a project feel smooth: preparation, protection, communication, and cleanup.",
        body:
          "<p>Whether you are refreshing a room, repainting an exterior, updating cabinets, or finishing outdoor wood, EC Painting keeps the process straightforward and the results clean.</p><p>Every project is scoped carefully so you know what is included, how the work will be handled, and what to expect before painting begins.</p>",
        imageUrl: "",
        imageAlt: "EC Painting project preparation",
        imagePosition: "right",
      }),
      block("stats-bar", {
        items: [
          { icon: "ShieldCheck", value: "Insured", label: "Project Protection" },
          { icon: "Clock", value: "On Time", label: "Clear Scheduling" },
          { icon: "CheckCircle", value: "Clean", label: "Respectful Work" },
          { icon: "Star", value: "Free", label: "Estimates" },
        ],
      }),
      block("cta", {
        heading: "Let's talk about your painting project.",
        subheading: "Tell us what you need and we will follow up with a free estimate.",
        primaryText: "Contact Us",
        primaryAction: "internal-link",
        primaryLink: "/contact",
        variant: "dark",
      }),
    ],
  };
}

function reviewsContent() {
  return {
    blocks: [
      block("section-header", {
        eyebrow: "Reviews",
        title: "What our clients say",
        subtitle: "A few notes from homeowners who trusted EC Painting with their space.",
        alignment: "center",
        headingLevel: "h1",
      }),
      block("testimonials", {
        title: "",
        items: reviews,
      }),
      block("cta", {
        heading: "Ready for your own refresh?",
        subheading: "Request a free estimate for your next painting project.",
        primaryText: "Get a Free Estimate",
        primaryAction: "form-modal",
        primaryFormSlug: "contact-form",
        variant: "dark",
      }),
    ],
  };
}

function contactContent() {
  return {
    blocks: [
      block("section-header", {
        eyebrow: "Get In Touch",
        title: "Let us know how we can help.",
        subtitle:
          "Request a free estimate for interior painting, exterior painting, cabinets, decks, fences, or commercial painting.",
        alignment: "center",
        headingLevel: "h1",
      }),
      block("contact-info", {
        title: "Contact Details",
        items: [
          { icon: "MapPin", label: "Service Area", value: "Charlotte and surrounding communities" },
          { icon: "Phone", label: "Phone", value: "Add your phone number in Admin > Design > Branding" },
          { icon: "Mail", label: "Email", value: "Use the estimate form below" },
        ],
      }),
      block("contact-form", {}),
    ],
  };
}

async function upsertPage(data: InsertCmsPage) {
  const existing = await storage.cmsPages.getPageBySlug(data.slug);
  if (existing) {
    await storage.cmsPages.updatePage(existing.id, data);
    return;
  }
  await storage.cmsPages.createPage(data);
}

function page({
  title,
  slug,
  content,
  description,
  path,
}: {
  title: string;
  slug: string;
  content: Record<string, unknown>;
  description: string;
  path?: string;
}): InsertCmsPage {
  const canonicalPath = path ?? (slug === "home" ? "/" : `/${slug}`);
  return {
    title,
    slug,
    pageType: "custom",
    template: "full-width",
    status: "published",
    content,
    seoTitle: `${title} | ${BRAND_NAME}`,
    seoDescription: description,
    seoKeywords: "",
    ogImageUrl: "",
    canonicalUrl: `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`,
    noindex: false,
    publishedAt: new Date(),
    scheduledAt: null,
    createdBy: null,
    updatedBy: null,
    sidebarId: null,
  };
}

async function upsertMenu(data: InsertCmsMenu & { location: StandardMenuLocation }) {
  const existing = await storage.cmsMenus.getByLocation(data.location);
  if (existing) {
    await storage.cmsMenus.update(existing.id, data);
    return;
  }
  await storage.cmsMenus.create(data);
}

async function seedPages() {
  await upsertPage(
    page({
      title: "Home",
      slug: "home",
      content: homeContent(),
      description:
        "EC Painting provides interior, exterior, cabinet, deck, fence, and commercial painting services.",
    }),
  );
  await upsertPage(
    page({
      title: "Services",
      slug: "services",
      content: servicesContent(),
      description:
        "Explore EC Painting services for homes and commercial spaces.",
    }),
  );
  await upsertPage(
    page({
      title: "About EC Painting",
      slug: "about",
      content: aboutContent(),
      description: "Learn about EC Painting and our clean, careful approach to painting projects.",
    }),
  );
  await upsertPage(
    page({
      title: "Project Gallery",
      slug: "gallery",
      content: galleryContent(),
      description: "View EC Painting project gallery examples for interiors, exteriors, cabinets, decks, and fences.",
    }),
  );
  await upsertPage(
    page({
      title: "Reviews",
      slug: "reviews",
      content: reviewsContent(),
      description: "Read client reviews for EC Painting projects.",
    }),
  );
  await upsertPage(
    page({
      title: "Contact EC Painting",
      slug: "contact",
      content: contactContent(),
      description: "Contact EC Painting to request a free painting estimate.",
    }),
  );

  for (const service of services) {
    await upsertPage(
      page({
        title: service.title,
        slug: service.slug,
        path: `/services/${service.slug}`,
        content: serviceDetailContent(service),
        description: `${service.title} services from EC Painting. Request a free estimate.`,
      }),
    );
  }
}

async function seedMenus() {
  const serviceItems = services.map((service) =>
    item(service.title.replace("Kitchen ", ""), `/services/${service.slug}`),
  );

  await upsertMenu({
    name: "Main Navigation",
    location: "main_navigation",
    items: [
      item("Home", "/"),
      item("Services", "/services", [item("All Services", "/services"), ...serviceItems]),
      item("About", "/about"),
      item("Gallery", "/gallery"),
      item("Reviews", "/reviews"),
      item("Contact", "/contact"),
    ],
  });

  await upsertMenu({
    name: "Company",
    location: "footer_platform",
    items: [item("Home", "/"), item("Services", "/services"), item("About", "/about"), item("Gallery", "/gallery"), item("Contact", "/contact")],
  });
  await upsertMenu({
    name: "Services",
    location: "footer_professionals",
    items: serviceItems.slice(0, 3),
  });
  await upsertMenu({
    name: "More Services",
    location: "footer_resources",
    items: serviceItems.slice(3),
  });
  await upsertMenu({
    name: "Reviews",
    location: "footer_company",
    items: [item("Project Gallery", "/gallery"), item("Client Reviews", "/reviews"), item("Request Estimate", "/contact")],
  });
  await upsertMenu({
    name: "Legal",
    location: "footer_legal",
    items: [item("Privacy Policy", "/privacy-policy"), item("Terms of Service", "/terms-of-service")],
  });
}

async function seedSettings() {
  await storage.seoSettings.upsert({
    siteName: BRAND_NAME,
    titleSuffix: ` | ${BRAND_NAME}`,
    defaultMetaDescription:
      "EC Painting provides interior painting, exterior painting, cabinet painting, deck staining, fence staining, and commercial painting.",
    siteUrl: SITE_URL,
    defaultOgImageUrl: LOGO_URL,
    organizationName: BRAND_NAME,
    organizationLogoUrl: LOGO_URL,
    defaultRobotsNoindex: false,
  });

  const branding: Array<[string, string]> = [
    ["company_name", BRAND_NAME],
    ["company_address", "Charlotte, NC"],
    ["company_phone_numbers", ""],
    ["company_google_business_url", ""],
    ["frontend_logo_url", LOGO_URL],
    ["favicon_url", LOGO_URL],
    ["frontend_body_font", "open-sans"],
    ["frontend_heading_font", "montserrat"],
    ["brand_primary_color", "#0A83A5"],
    ["brand_secondary_color", "#F3F7FA"],
    ["brand_tertiary_color", "#0F5F7A"],
    ["brand_quaternary_color", "#1E293B"],
    ["text_h1_color", "#0F172A"],
    ["text_h2_color", "#0F172A"],
    ["text_h3_h6_color", "#0F172A"],
    ["text_body_color", "#334155"],
    ["text_muted_color", "#64748B"],
    ["text_inverse_color", "#FFFFFF"],
    ["text_primary_foreground_color", "#FFFFFF"],
    ["text_secondary_foreground_color", "#0F172A"],
    ["text_tertiary_foreground_color", "#FFFFFF"],
  ];

  for (const [key, value] of branding) {
    await storage.settings.upsertSetting(key, value, "branding", false);
  }

  const features: Array<[string, string]> = [
    ["enable_directory", "false"],
    ["enable_blog", "false"],
    ["enable_events", "false"],
    ["enable_crm", "true"],
  ];

  for (const [key, value] of features) {
    await storage.settings.upsertSetting(key, value, "system_configuration", false);
  }
}

async function main() {
  await seedPages();
  await seedMenus();
  await seedSettings();
  console.log("Seeded EC Painting public CMS pages, menus, branding, and SEO settings.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
