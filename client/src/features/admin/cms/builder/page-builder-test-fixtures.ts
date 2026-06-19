import type { BuilderContent } from "./block-registry";

export const mixedBuilderFixture: BuilderContent = {
  blocks: [
    {
      id: "hero-block",
      type: "hero",
      props: {
        heading: "Charlotte House Painters",
        subheading: "<p>Interior, exterior, cabinet, deck, and fence painting.</p>",
        layout: "stacked",
      },
    },
    {
      id: "cta-legacy-block",
      type: "call-to-action",
      props: {
        heading: "Request a Free Quote",
        body: "<p>Tell us about your next painting project.</p>",
        ctaText: "Contact Us",
      },
    },
    {
      id: "cards-block",
      type: "cards-grid",
      props: {
        heading: "Popular Services",
        cards: [
          { title: "Interior Painting", description: "Walls, ceilings, trim, and doors." },
          { title: "Exterior Painting", description: "Siding, brick, stucco, and trim." },
        ],
      },
    },
    {
      id: "faq-block",
      type: "faq",
      props: {
        heading: "Common Questions",
        items: [
          { question: "Do you offer free quotes?", answer: "<p>Yes, quotes are free.</p>" },
        ],
      },
    },
    {
      id: "contact-info-block",
      type: "contact-info",
      props: {
        heading: "Contact 593 EC Painting",
      },
    },
  ],
};

export const fixtureWithBrokenPreview: BuilderContent = {
  blocks: [
    ...mixedBuilderFixture.blocks,
    {
      id: "broken-preview-block",
      type: "cards-grid",
      props: {
        heading: "Featured Services",
      },
    },
  ],
};
