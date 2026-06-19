import { createBlock, type BlockInstance } from "./block-registry";

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "starter" | "marketing" | "content";
  blockCount: number;
  blocks: () => BlockInstance[];
}

function block(type: string, overrides?: Record<string, unknown>): BlockInstance {
  const b = createBlock(type);
  if (overrides) {
    b.props = { ...b.props, ...overrides };
  }
  return b;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "blank",
    name: "Blank Page",
    description: "Start from scratch with an empty canvas",
    icon: "FileText",
    category: "starter",
    blockCount: 0,
    blocks: () => [],
  },
  {
    id: "painting-page-basic",
    name: "Painting Page",
    description: "Simple painting-service layout with hero, content, FAQ, and quote CTA",
    icon: "Paintbrush",
    category: "starter",
    blockCount: 4,
    blocks: () => [
      block("hero", {
        heading: "Painting Services in Charlotte, NC",
        subheading: "Describe the service, service area, and main customer promise.",
        ctaText: "Get a Free Quote",
        ctaLink: "/contact",
        ctaSecondaryText: "",
        ctaSecondaryLink: "",
        minHeight: "420",
      }),
      block("rich-text", {
        title: "Overview",
        content: "<p>Add the core details for this service or page.</p>",
        alignment: "left",
      }),
      block("faq", {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "What should customers know?",
            answer: "Replace this with a short, specific answer.",
          },
        ],
      }),
      block("cta", {
        heading: "Ready to Get Started?",
        subheading: "Request a free quote and we will follow up soon.",
        primaryText: "Get a Free Quote",
        primaryLink: "/contact",
        secondaryText: "",
        secondaryLink: "",
        variant: "dark",
      }),
    ],
  },
];
