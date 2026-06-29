export type PropType =
  | "text"
  | "textarea"
  | "richtext"
  | "image-url"
  | "url"
  | "page-select"
  | "select"
  | "form-select"
  | "boolean"
  | "number"
  | "color"
  | "array-items";

export interface PropDef {
  key: string;
  label: string;
  type: PropType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  itemSchema?: Omit<PropDef, "itemSchema">[];
}

export type BlockCategory = "layout" | "hero" | "content" | "media" | "social-proof" | "conversion" | "data" | "dynamic";

export interface BlockDef {
  type: string;
  label: string;
  iconName: string;
  description: string;
  category: BlockCategory;
  defaultProps: Record<string, unknown>;
  propDefs: PropDef[];
  isDynamic?: boolean;
}

export interface BlockInstance {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export interface BuilderContent {
  blocks: BlockInstance[];
}

const LEGACY_BLOCK_TYPE_ALIASES: Record<string, string> = {
  "call-to-action": "cta",
  "cta-banner": "cta",
  "blog-feed": "blog-post-feed",
  "blog-archive": "blog-post-feed",
  "featured-articles": "blog-preview",
  "articles-preview": "blog-preview",
  "events-feed": "events-preview",
  "upcoming-events": "events-preview",
};

const ALIGN_OPTIONS = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

const IMAGE_POSITION_OPTIONS = [
  { label: "Image Right", value: "right" },
  { label: "Image Left", value: "left" },
];

const CTA_VARIANT_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Accent", value: "accent" },
];

const COLUMNS_OPTIONS = [
  { label: "2 columns", value: "2" },
  { label: "3 columns", value: "3" },
  { label: "4 columns", value: "4" },
];

const FEATURE_LIST_COLUMNS_OPTIONS = [
  { label: "1 column", value: "1" },
  { label: "2 columns", value: "2" },
  { label: "3 columns", value: "3" },
];

const SPACING_OPTIONS = [
  { label: "Extra Small (16px)", value: "xs" },
  { label: "Small (32px)", value: "sm" },
  { label: "Medium (64px)", value: "md" },
  { label: "Large (96px)", value: "lg" },
  { label: "Extra Large (128px)", value: "xl" },
];

const BUTTON_VARIANT_OPTIONS = [
  { label: "Primary", value: "default" },
  { label: "Outline", value: "outline" },
  { label: "Ghost", value: "ghost" },
  { label: "Secondary", value: "secondary" },
];

const BUTTON_ACTION_OPTIONS = [
  { label: "Internal Link", value: "internal-link" },
  { label: "Custom Link", value: "custom-link" },
  { label: "Modal Form", value: "form-modal" },
];

const VIDEO_ASPECT_OPTIONS = [
  { label: "16:9 (Widescreen)", value: "16/9" },
  { label: "4:3 (Classic)", value: "4/3" },
  { label: "1:1 (Square)", value: "1/1" },
];

const IMAGE_WIDTH_OPTIONS = [
  { label: "Full width", value: "full" },
  { label: "Contained (max-w-4xl)", value: "contained" },
  { label: "Narrow (max-w-2xl)", value: "narrow" },
];

const MOBILE_IMAGE_FIT_OPTIONS = [
  { label: "Cover", value: "cover" },
  { label: "Contain", value: "contain" },
];

const MOBILE_IMAGE_HEIGHT_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "Short (240px)", value: "sm" },
  { label: "Medium (320px)", value: "md" },
  { label: "Tall (420px)", value: "lg" },
  { label: "Extra Tall (520px)", value: "xl" },
];

const DIVIDER_STYLE_OPTIONS = [
  { label: "Horizontal line", value: "line" },
  { label: "Spacer (invisible)", value: "spacer" },
  { label: "Dots", value: "dots" },
];

const HERO_LAYOUT_OPTIONS = [
  { label: "Stacked (centered)", value: "stacked" },
  { label: "Split (text left, image right)", value: "split" },
];

const HERO_MIN_HEIGHT_OPTIONS = [
  { label: "Small (320px)", value: "320" },
  { label: "Medium (420px)", value: "420" },
  { label: "Large (560px)", value: "560" },
  { label: "Extra Large (700px)", value: "700" },
  { label: "Full Screen", value: "100vh" },
];

const LINK_LIST_COLUMNS_OPTIONS = [
  { label: "1 column", value: "1" },
  { label: "2 columns", value: "2" },
];

const CALLOUT_VARIANT_OPTIONS = [
  { label: "Accent", value: "accent" },
  { label: "Neutral", value: "neutral" },
  { label: "Outline", value: "outline" },
];

const COLUMNS_EXTENDED_OPTIONS = [
  { label: "2 columns", value: "2" },
  { label: "3 columns", value: "3" },
  { label: "4 columns", value: "4" },
  { label: "5 columns", value: "5" },
];

const BENEFIT_LAYOUT_OPTIONS = [
  { label: "Stack", value: "stack" },
  { label: "Timeline", value: "timeline" },
];

const EXPERIENCE_LEVEL_OPTIONS = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const HEADING_LEVEL_OPTIONS = [
  { label: "H2 (Section Heading)", value: "h2" },
  { label: "H1 (Main Page Heading)", value: "h1" },
];

const RADIAL_GRADIENT_POSITION_OPTIONS = [
  { label: "Top of Section", value: "top" },
  { label: "Bottom of Section", value: "bottom" },
];

const SECTION_PADDING_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Extra Small", value: "xs" },
  { label: "Small", value: "sm" },
  { label: "Default", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Extra Large", value: "xl" },
];

const SHARED_SECTION_STYLE_DEFAULTS = {
  sectionBackgroundColor: "#ffffff",
  sectionBackgroundImageUrl: "",
  sectionBackgroundPositionX: 50,
  sectionBackgroundPositionY: 50,
  sectionBackgroundOverlayColor: "#000000",
  sectionBackgroundOverlayOpacity: 0,
  sectionShowRadialGradient: false,
  sectionRadialGradientColor: "#89cda1",
  sectionRadialGradientPosition: "top",
  sectionBorderTopWidth: 0,
  sectionBorderTopColor: "#d9e2dc",
  sectionBorderBottomWidth: 0,
  sectionBorderBottomColor: "#d9e2dc",
  sectionPaddingTop: "md",
  sectionPaddingBottom: "md",
};

const SHARED_SECTION_STYLE_PROP_DEFS: PropDef[] = [
  { key: "sectionBackgroundColor", label: "Background Color", type: "color", placeholder: "#ffffff" },
  { key: "sectionBackgroundImageUrl", label: "Background Image", type: "image-url", placeholder: "Upload or select image" },
  { key: "sectionBackgroundPositionX", label: "Image Position X (%)", type: "number", min: 0, max: 100 },
  { key: "sectionBackgroundPositionY", label: "Image Position Y (%)", type: "number", min: 0, max: 100 },
  { key: "sectionBackgroundOverlayColor", label: "Background Image Overlay Color", type: "color", placeholder: "#000000" },
  { key: "sectionBackgroundOverlayOpacity", label: "Background Image Overlay Opacity (%)", type: "number", min: 0, max: 100 },
  { key: "sectionShowRadialGradient", label: "Show Radial Gradient Overlay", type: "boolean" },
  { key: "sectionRadialGradientColor", label: "Radial Gradient Color", type: "color", placeholder: "#89cda1" },
  { key: "sectionRadialGradientPosition", label: "Radial Gradient Position", type: "select", options: RADIAL_GRADIENT_POSITION_OPTIONS },
  { key: "sectionBorderTopWidth", label: "Top Border Thickness (px)", type: "number", min: 0, max: 24 },
  { key: "sectionBorderTopColor", label: "Top Border Color", type: "color", placeholder: "#d9e2dc" },
  { key: "sectionBorderBottomWidth", label: "Bottom Border Thickness (px)", type: "number", min: 0, max: 24 },
  { key: "sectionBorderBottomColor", label: "Bottom Border Color", type: "color", placeholder: "#d9e2dc" },
];

const SHARED_SECTION_ACCENT_PROP_DEFS: PropDef[] = [
  { key: "sectionBackgroundColor", label: "Background Color", type: "color", placeholder: "#ffffff" },
  { key: "sectionShowRadialGradient", label: "Show Radial Gradient Overlay", type: "boolean" },
  { key: "sectionRadialGradientColor", label: "Radial Gradient Color", type: "color", placeholder: "#89cda1" },
  { key: "sectionRadialGradientPosition", label: "Radial Gradient Position", type: "select", options: RADIAL_GRADIENT_POSITION_OPTIONS },
  { key: "sectionBorderTopWidth", label: "Top Border Thickness (px)", type: "number", min: 0, max: 24 },
  { key: "sectionBorderTopColor", label: "Top Border Color", type: "color", placeholder: "#d9e2dc" },
  { key: "sectionBorderBottomWidth", label: "Bottom Border Thickness (px)", type: "number", min: 0, max: 24 },
  { key: "sectionBorderBottomColor", label: "Bottom Border Color", type: "color", placeholder: "#d9e2dc" },
];

const SHARED_SECTION_PADDING_PROP_DEFS: PropDef[] = [
  { key: "sectionPaddingTop", label: "Top Padding", type: "select", options: SECTION_PADDING_OPTIONS },
  { key: "sectionPaddingBottom", label: "Bottom Padding", type: "select", options: SECTION_PADDING_OPTIONS },
];

const SHARED_SECTION_HEADING_DEFAULTS = {
  sectionEyebrow: "",
  sectionHeadingLevel: "h2",
  sectionHeadingAlignment: "center",
};

const SHARED_SECTION_HEADING_PROP_DEFS: PropDef[] = [
  { key: "sectionEyebrow", label: "Eyebrow Label", type: "text", placeholder: "Small label above title" },
  { key: "sectionHeadingLevel", label: "Heading Level", type: "select", options: HEADING_LEVEL_OPTIONS },
  { key: "sectionHeadingAlignment", label: "Heading Alignment", type: "select", options: ALIGN_OPTIONS },
];

const SHARED_VISIBILITY_DEFAULTS = {
  isActive: true,
};

const SHARED_VISIBILITY_PROP_DEFS: PropDef[] = [
  { key: "isActive", label: "Active on Public Site", type: "boolean" },
];

const SHARED_MOBILE_IMAGE_DEFAULTS = {
  mobileImageFit: "cover",
  mobileImageHeight: "auto",
  mobileImagePositionX: 50,
  mobileImagePositionY: 50,
};

const SHARED_MOBILE_IMAGE_PROP_DEFS: PropDef[] = [
  { key: "mobileImageFit", label: "Mobile Image Fit", type: "select", options: MOBILE_IMAGE_FIT_OPTIONS },
  { key: "mobileImageHeight", label: "Mobile Image Height", type: "select", options: MOBILE_IMAGE_HEIGHT_OPTIONS },
  { key: "mobileImagePositionX", label: "Mobile Image Position X (%)", type: "number", min: 0, max: 100 },
  { key: "mobileImagePositionY", label: "Mobile Image Position Y (%)", type: "number", min: 0, max: 100 },
];

const OPTIONAL_SECTION_HEADING_PROP_DEFS: PropDef[] = [
  { key: "title", label: "Section Title", type: "text", placeholder: "Optional section heading" },
  { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Optional supporting description" },
];

const OPTIONAL_SECTION_HEADING_BLOCKS = new Set([
  "rich-text",
  "button-group",
  "image-block",
  "trust-bar",
  "stats-bar",
]);

function mergePropDefs(existing: PropDef[], additions: PropDef[]) {
  const seen = new Set(existing.map((prop) => prop.key));
  return [...existing, ...additions.filter((prop) => !seen.has(prop.key))];
}

function withSharedSectionStyles(
  block: BlockDef,
  options?: { includeImageControls?: boolean; includePaddingControls?: boolean }
): BlockDef {
  const includeImageControls = options?.includeImageControls ?? true;
  const includePaddingControls = options?.includePaddingControls ?? true;
  const sharedPropDefs = includeImageControls ? SHARED_SECTION_STYLE_PROP_DEFS : SHARED_SECTION_ACCENT_PROP_DEFS;
  const sharedDefaults = includeImageControls
    ? SHARED_SECTION_STYLE_DEFAULTS
    : {
        sectionBackgroundColor: SHARED_SECTION_STYLE_DEFAULTS.sectionBackgroundColor,
        sectionShowRadialGradient: SHARED_SECTION_STYLE_DEFAULTS.sectionShowRadialGradient,
        sectionRadialGradientColor: SHARED_SECTION_STYLE_DEFAULTS.sectionRadialGradientColor,
        sectionRadialGradientPosition: SHARED_SECTION_STYLE_DEFAULTS.sectionRadialGradientPosition,
      };

  const paddingDefaults = includePaddingControls
    ? {
        sectionPaddingTop: SHARED_SECTION_STYLE_DEFAULTS.sectionPaddingTop,
        sectionPaddingBottom: SHARED_SECTION_STYLE_DEFAULTS.sectionPaddingBottom,
      }
    : {};

  return {
    ...block,
    defaultProps: {
      ...sharedDefaults,
      ...paddingDefaults,
      ...block.defaultProps,
    },
    propDefs: mergePropDefs(
      block.propDefs,
      includePaddingControls ? [...sharedPropDefs, ...SHARED_SECTION_PADDING_PROP_DEFS] : sharedPropDefs
    ),
  };
}

function withSharedSectionHeading(block: BlockDef): BlockDef {
  const hasTitle = block.propDefs.some((prop) => prop.key === "title");
  const shouldAddHeading = hasTitle || OPTIONAL_SECTION_HEADING_BLOCKS.has(block.type);
  if (!shouldAddHeading || block.type === "section-header") return block;

  return {
    ...block,
    defaultProps: {
      ...SHARED_SECTION_HEADING_DEFAULTS,
      title: "",
      subtitle: "",
      ...block.defaultProps,
    },
    propDefs: mergePropDefs(block.propDefs, [
      ...OPTIONAL_SECTION_HEADING_PROP_DEFS,
      ...SHARED_SECTION_HEADING_PROP_DEFS,
    ]),
  };
}

function withSharedVisibility(block: BlockDef): BlockDef {
  return {
    ...block,
    defaultProps: {
      ...SHARED_VISIBILITY_DEFAULTS,
      ...block.defaultProps,
    },
    propDefs: mergePropDefs(block.propDefs, SHARED_VISIBILITY_PROP_DEFS),
  };
}

const BASE_BLOCK_REGISTRY: BlockDef[] = [
  {
    type: "hero",
    label: "Hero",
    iconName: "Sparkles",
    description: "Full-width hero with heading, subheading, and CTA buttons",
    category: "hero",
    defaultProps: {
      heading: "Charlotte House Painters You Can Trust",
      accentHeading: "",
      headingColor: "",
      accentHeadingColor: "",
      subheading: "Interior, exterior, cabinet, deck, and fence painting from a family-owned Charlotte team.",
      subheadingColor: "",
      ctaText: "Get a Free Quote",
      ctaLink: "/contact",
      ctaAction: "internal-link",
      ctaOpenInNewTab: false,
      ctaFormSlug: "contact-form",
      ctaModalTitle: "",
      ctaModalDescription: "",
      ctaSecondaryText: "Learn More",
      ctaSecondaryLink: "/about",
      ctaSecondaryAction: "internal-link",
      ctaSecondaryOpenInNewTab: false,
      ctaSecondaryFormSlug: "contact-form",
      ctaSecondaryModalTitle: "",
      ctaSecondaryModalDescription: "",
      backgroundImageUrl: "",
      backgroundPositionX: 50,
      backgroundPositionY: 50,
      overlayColor: "#000000",
      overlayOpacity: 50,
      badge: "",
      layout: "stacked",
      videoBackgroundUrl: "",
      minHeight: "420",
    },
    propDefs: [
      { key: "badge", label: "Badge Text", type: "text", placeholder: "e.g. New, Coming Soon" },
      { key: "heading", label: "Heading", type: "text", placeholder: "Main heading" },
      { key: "accentHeading", label: "Accent Heading", type: "text", placeholder: "Optional highlighted heading text" },
      { key: "headingColor", label: "Heading Color", type: "color", placeholder: "#ffffff" },
      { key: "accentHeadingColor", label: "Accent Heading Color", type: "color", placeholder: "#89cda1" },
      { key: "subheading", label: "Subheading", type: "textarea", placeholder: "Supporting text beneath the heading" },
      { key: "subheadingColor", label: "Subheading Color", type: "color", placeholder: "#ffffff" },
      { key: "ctaText", label: "Primary Button Text", type: "text", placeholder: "e.g. Get a Free Quote" },
      { key: "ctaAction", label: "Primary Button Action", type: "select", options: BUTTON_ACTION_OPTIONS },
      { key: "ctaLink", label: "Primary Button Link", type: "url", placeholder: "/contact" },
      { key: "ctaOpenInNewTab", label: "Primary Open In New Tab", type: "boolean" },
      { key: "ctaFormSlug", label: "Primary Button Form", type: "form-select" },
      { key: "ctaModalTitle", label: "Primary Modal Title", type: "text", placeholder: "Optional modal title override" },
      { key: "ctaModalDescription", label: "Primary Modal Description", type: "textarea", placeholder: "Optional modal description" },
      { key: "ctaSecondaryText", label: "Secondary Button Text", type: "text", placeholder: "e.g. Learn More" },
      { key: "ctaSecondaryAction", label: "Secondary Button Action", type: "select", options: BUTTON_ACTION_OPTIONS },
      { key: "ctaSecondaryLink", label: "Secondary Button Link", type: "url", placeholder: "/about" },
      { key: "ctaSecondaryOpenInNewTab", label: "Secondary Open In New Tab", type: "boolean" },
      { key: "ctaSecondaryFormSlug", label: "Secondary Button Form", type: "form-select" },
      { key: "ctaSecondaryModalTitle", label: "Secondary Modal Title", type: "text", placeholder: "Optional modal title override" },
      { key: "ctaSecondaryModalDescription", label: "Secondary Modal Description", type: "textarea", placeholder: "Optional modal description" },
      { key: "backgroundImageUrl", label: "Background Image", type: "image-url", placeholder: "Upload or select image" },
      { key: "backgroundPositionX", label: "Image Position X (%)", type: "number", min: 0, max: 100 },
      { key: "backgroundPositionY", label: "Image Position Y (%)", type: "number", min: 0, max: 100 },
      { key: "videoBackgroundUrl", label: "Video Background URL", type: "url", placeholder: "https://example.com/video.mp4" },
      { key: "overlayColor", label: "Overlay Color", type: "color", placeholder: "#000000" },
      { key: "overlayOpacity", label: "Overlay Opacity (%)", type: "number", min: 0, max: 100 },
      { key: "layout", label: "Layout", type: "select", options: HERO_LAYOUT_OPTIONS },
      { key: "minHeight", label: "Min Height (px)", type: "select", options: HERO_MIN_HEIGHT_OPTIONS },
    ],
  },
  {
    type: "section-header",
    label: "Section Header",
    iconName: "Heading",
    description: "Title, optional eyebrow label, and subtitle",
    category: "layout",
    defaultProps: {
      eyebrow: "Our Approach",
      title: "Painting Done Right",
      subtitle: "Careful prep, clean lines, premium paint, and clear communication from quote to walkthrough.",
      alignment: "center",
      headingLevel: "h2",
    },
    propDefs: [
      { key: "eyebrow", label: "Eyebrow Label", type: "text", placeholder: "Small label above title" },
      { key: "title", label: "Title", type: "text", placeholder: "Section title" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Supporting description" },
      { key: "alignment", label: "Alignment", type: "select", options: ALIGN_OPTIONS },
      { key: "headingLevel", label: "Heading Level", type: "select", options: HEADING_LEVEL_OPTIONS },
    ],
  },
  {
    type: "rich-text",
    label: "Rich Text",
    iconName: "FileText",
    description: "Free-form text content with alignment control",
    category: "content",
    defaultProps: {
      content: "<p>Enter your content here.</p>",
      alignment: "left",
    },
    propDefs: [
      { key: "content", label: "Content", type: "richtext", placeholder: "Enter content..." },
      { key: "alignment", label: "Alignment", type: "select", options: ALIGN_OPTIONS },
    ],
  },
  {
    type: "text-image",
    label: "Text + Image",
    iconName: "LayoutTemplate",
    description: "Side-by-side text and image with configurable position",
    category: "content",
    defaultProps: {
      eyebrow: "Our Story",
      heading: "About Our Work",
      subtitle: "Use this supporting introduction to frame the section before the main body copy begins.",
      body: "<p>Share details about your painting process, preparation standards, materials, and customer experience.</p>",
      alignment: "left",
      headingLevel: "h2",
      imageUrl: "",
      imageAlt: "About 593 EC Painting",
      imageCaption: "",
      imagePosition: "right",
      ...SHARED_MOBILE_IMAGE_DEFAULTS,
    },
    propDefs: [
      { key: "eyebrow", label: "Eyebrow Label", type: "text", placeholder: "Small label above title" },
      { key: "heading", label: "Section Title", type: "text", placeholder: "Section heading" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Supporting description" },
      { key: "alignment", label: "Alignment", type: "select", options: ALIGN_OPTIONS },
      { key: "headingLevel", label: "Heading Level", type: "select", options: HEADING_LEVEL_OPTIONS },
      { key: "body", label: "Body Text", type: "richtext", placeholder: "Main text content" },
      { key: "imageUrl", label: "Image", type: "image-url", placeholder: "Upload or select image" },
      { key: "imageAlt", label: "Image Alt Text", type: "text", placeholder: "Descriptive alt text" },
      { key: "imageCaption", label: "Image Caption", type: "text", placeholder: "Optional caption" },
      { key: "imagePosition", label: "Image Position", type: "select", options: IMAGE_POSITION_OPTIONS },
      ...SHARED_MOBILE_IMAGE_PROP_DEFS,
    ],
  },
  {
    type: "two-column-text",
    label: "Two Column Text",
    iconName: "LayoutTemplate",
    description: "Two side-by-side content columns with optional bullet lists",
    category: "content",
    defaultProps: {
      title: "Compare Your Options",
      subtitle: "",
      leftHeading: "Column One",
      leftBody: "<p>Use this space for supporting copy before the list.</p>",
      leftItems: [
        { text: "Bullet point one" },
        { text: "Bullet point two" },
      ],
      rightHeading: "Column Two",
      rightBody: "<p>Use this column for a second list or additional detail.</p>",
      rightItems: [
        { text: "Bullet point one" },
        { text: "Bullet point two" },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Optional section heading" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Optional supporting description" },
      { key: "leftHeading", label: "Left Column Heading", type: "text", placeholder: "Left column title" },
      { key: "leftBody", label: "Left Column Body", type: "richtext", placeholder: "Optional supporting text" },
      {
        key: "leftItems",
        label: "Left Column Items",
        type: "array-items",
        itemSchema: [{ key: "text", label: "Item Text", type: "text", placeholder: "Bullet point" }],
      },
      { key: "rightHeading", label: "Right Column Heading", type: "text", placeholder: "Right column title" },
      { key: "rightBody", label: "Right Column Body", type: "richtext", placeholder: "Optional supporting text" },
      {
        key: "rightItems",
        label: "Right Column Items",
        type: "array-items",
        itemSchema: [{ key: "text", label: "Item Text", type: "text", placeholder: "Bullet point" }],
      },
    ],
  },
  {
    type: "callout-box",
    label: "Callout Box",
    iconName: "Quote",
    description: "Highlighted callout content with optional button",
    category: "content",
    defaultProps: {
      title: "Important Takeaway",
      subtitle: "",
      content: "<p>Use this callout to highlight a key message, important note, or short supporting explanation.</p>",
      variant: "accent",
      ctaText: "",
      ctaLink: "",
      ctaAction: "internal-link",
      ctaOpenInNewTab: false,
      ctaFormSlug: "contact-form",
      ctaModalTitle: "",
      ctaModalDescription: "",
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Optional section heading" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Optional supporting description" },
      { key: "content", label: "Content", type: "richtext", placeholder: "Add highlighted content..." },
      { key: "variant", label: "Style Variant", type: "select", options: CALLOUT_VARIANT_OPTIONS },
      { key: "ctaText", label: "Button Text", type: "text", placeholder: "Optional button label" },
      { key: "ctaAction", label: "Button Action", type: "select", options: BUTTON_ACTION_OPTIONS },
      { key: "ctaLink", label: "Button Link", type: "url", placeholder: "/page or https://..." },
      { key: "ctaOpenInNewTab", label: "Open In New Tab", type: "boolean" },
      { key: "ctaFormSlug", label: "Assigned Form", type: "form-select" },
      { key: "ctaModalTitle", label: "Modal Title", type: "text", placeholder: "Optional modal title override" },
      { key: "ctaModalDescription", label: "Modal Description", type: "textarea", placeholder: "Optional modal description" },
    ],
  },
  {
    type: "link-list",
    label: "Link List",
    iconName: "List",
    description: "Editorial list of resource links with optional descriptions",
    category: "content",
    defaultProps: {
      title: "Helpful Resources",
      subtitle: "",
      columns: "1",
      links: [
        { label: "Resource title", description: "Short supporting description", url: "#" },
        { label: "Another resource", description: "Optional summary text", url: "#" },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Optional section heading" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Optional supporting description" },
      { key: "columns", label: "Columns", type: "select", options: LINK_LIST_COLUMNS_OPTIONS },
      {
        key: "links",
        label: "Links",
        type: "array-items",
        itemSchema: [
          { key: "label", label: "Label", type: "text", placeholder: "Link title" },
          { key: "description", label: "Description", type: "textarea", placeholder: "Optional supporting text" },
          { key: "url", label: "URL", type: "url", placeholder: "/page or https://..." },
        ],
      },
    ],
  },
  {
    type: "cta",
    label: "Call to Action",
    iconName: "Megaphone",
    description: "Bold call-to-action section with one or two buttons",
    category: "conversion",
    defaultProps: {
      heading: "Ready to Get Started?",
      subheading: "Request a free quote and we will follow up soon.",
      primaryText: "Get a Free Quote",
      primaryLink: "/contact",
      primaryAction: "internal-link",
      primaryOpenInNewTab: false,
      primaryFormSlug: "contact-form",
      primaryModalTitle: "",
      primaryModalDescription: "",
      secondaryText: "",
      secondaryLink: "",
      secondaryAction: "internal-link",
      secondaryOpenInNewTab: false,
      secondaryFormSlug: "contact-form",
      secondaryModalTitle: "",
      secondaryModalDescription: "",
      variant: "dark",
    },
    propDefs: [
      { key: "heading", label: "Heading", type: "text", placeholder: "CTA heading" },
      { key: "subheading", label: "Subheading", type: "textarea", placeholder: "Supporting text" },
      { key: "primaryText", label: "Primary Button", type: "text", placeholder: "Button label" },
      { key: "primaryAction", label: "Primary Button Action", type: "select", options: BUTTON_ACTION_OPTIONS },
      { key: "primaryLink", label: "Primary Button Link", type: "url", placeholder: "/contact" },
      { key: "primaryOpenInNewTab", label: "Primary Open In New Tab", type: "boolean" },
      { key: "primaryFormSlug", label: "Primary Button Form", type: "form-select" },
      { key: "primaryModalTitle", label: "Primary Modal Title", type: "text", placeholder: "Optional modal title override" },
      { key: "primaryModalDescription", label: "Primary Modal Description", type: "textarea", placeholder: "Optional modal description" },
      { key: "secondaryText", label: "Secondary Button", type: "text", placeholder: "Optional secondary button" },
      { key: "secondaryAction", label: "Secondary Button Action", type: "select", options: BUTTON_ACTION_OPTIONS },
      { key: "secondaryLink", label: "Secondary Button Link", type: "url", placeholder: "/about" },
      { key: "secondaryOpenInNewTab", label: "Secondary Open In New Tab", type: "boolean" },
      { key: "secondaryFormSlug", label: "Secondary Button Form", type: "form-select" },
      { key: "secondaryModalTitle", label: "Secondary Modal Title", type: "text", placeholder: "Optional modal title override" },
      { key: "secondaryModalDescription", label: "Secondary Modal Description", type: "textarea", placeholder: "Optional modal description" },
      { key: "variant", label: "Style Variant", type: "select", options: CTA_VARIANT_OPTIONS },
    ],
  },
  {
    type: "cards-grid",
    label: "Cards Grid",
    iconName: "LayoutGrid",
    description: "A configurable grid of icon + text cards",
    category: "content",
    defaultProps: {
      title: "Why Choose 593 EC Painting",
      subtitle: "",
      columns: "3",
      cards: [
        { title: "Family-Owned", description: "You work directly with Esau and Sandra from quote to walkthrough.", icon: "Home" },
        { title: "Real Prep", description: "Clean, repair, mask, prime, and paint with care.", icon: "CheckCircle" },
        { title: "Work Guaranteed", description: "Projects are backed by a written workmanship warranty.", icon: "ShieldCheck" },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Grid section title" },
      { key: "subtitle", label: "Section Subtitle", type: "text", placeholder: "Optional subtitle" },
      { key: "columns", label: "Columns", type: "select", options: COLUMNS_OPTIONS },
      {
        key: "cards",
        label: "Cards",
        type: "array-items",
        itemSchema: [
          { key: "title", label: "Card Title", type: "text", placeholder: "Card title" },
          { key: "description", label: "Description", type: "textarea", placeholder: "Card description" },
          { key: "icon", label: "Icon Name (Lucide)", type: "text", placeholder: "e.g. Globe, Heart, Users" },
        ],
      },
    ],
  },
  {
    type: "faq",
    label: "FAQ",
    iconName: "HelpCircle",
    description: "Collapsible frequently asked questions accordion",
    category: "content",
    defaultProps: {
      title: "Frequently Asked Questions",
      items: [
        { question: "How do I request a quote?", answer: "Use the contact form or call us and we will schedule a free on-site estimate." },
        { question: "What paint brands do you use?", answer: "We use premium products from trusted brands such as Sherwin-Williams and Benjamin Moore." },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "FAQ section heading" },
      {
        key: "items",
        label: "Questions",
        type: "array-items",
        itemSchema: [
          { key: "question", label: "Question", type: "text", placeholder: "FAQ question" },
          { key: "answer", label: "Answer", type: "textarea", placeholder: "FAQ answer" },
        ],
      },
    ],
  },
  {
    type: "testimonials",
    label: "Testimonials",
    iconName: "Quote",
    description: "Quote cards from clients or community members",
    category: "social-proof",
    defaultProps: {
      title: "What Customers Say",
      items: [
        { quote: "The crew was careful, communicative, and the finish looks great.", name: "Customer", role: "Homeowner", location: "Charlotte, NC" },
        { quote: "They protected the house, cleaned up every day, and did exactly what they promised.", name: "Customer", role: "Homeowner", location: "Charlotte, NC" },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Testimonials heading" },
      {
        key: "items",
        label: "Testimonials",
        type: "array-items",
        itemSchema: [
          { key: "quote", label: "Quote", type: "textarea", placeholder: "Testimonial text" },
          { key: "name", label: "Name", type: "text", placeholder: "Person's name" },
          { key: "role", label: "Role", type: "text", placeholder: "e.g. Homeowner" },
          { key: "location", label: "Location", type: "text", placeholder: "e.g. Charlotte, NC" },
        ],
      },
    ],
  },
  {
    type: "button-group",
    label: "Button Group",
    iconName: "MousePointerClick",
    description: "One or more buttons in a row",
    category: "conversion",
    defaultProps: {
      alignment: "center",
      buttons: [
        { text: "Request a Quote", action: "url", link: "/contact", formSlug: "contact-form", modalTitle: "", modalDescription: "", variant: "default" },
        { text: "Learn More", action: "url", link: "/about", formSlug: "contact-form", modalTitle: "", modalDescription: "", variant: "outline" },
      ],
    },
    propDefs: [
      { key: "alignment", label: "Alignment", type: "select", options: ALIGN_OPTIONS },
      {
        key: "buttons",
        label: "Buttons",
        type: "array-items",
        itemSchema: [
          { key: "text", label: "Button Text", type: "text", placeholder: "Button label" },
          { key: "action", label: "Action", type: "select", options: BUTTON_ACTION_OPTIONS },
          { key: "link", label: "Link", type: "url", placeholder: "/page or https://..." },
          { key: "openInNewTab", label: "Open In New Tab", type: "boolean" },
          { key: "formSlug", label: "Assigned Form", type: "form-select" },
          { key: "modalTitle", label: "Modal Title", type: "text", placeholder: "Optional modal title override" },
          { key: "modalDescription", label: "Modal Description", type: "textarea", placeholder: "Optional modal description" },
          { key: "variant", label: "Style", type: "select", options: BUTTON_VARIANT_OPTIONS },
        ],
      },
    ],
  },
  {
    type: "image-block",
    label: "Image Block",
    iconName: "Image",
    description: "A standalone image with optional caption",
    category: "media",
    defaultProps: {
      imageUrl: "",
      alt: "",
      caption: "",
      width: "contained",
      ...SHARED_MOBILE_IMAGE_DEFAULTS,
    },
    propDefs: [
      { key: "imageUrl", label: "Image", type: "image-url", placeholder: "Upload or select image" },
      { key: "alt", label: "Alt Text", type: "text", placeholder: "Descriptive alt text for accessibility" },
      { key: "caption", label: "Caption", type: "text", placeholder: "Optional image caption" },
      { key: "width", label: "Image Width", type: "select", options: IMAGE_WIDTH_OPTIONS },
      ...SHARED_MOBILE_IMAGE_PROP_DEFS,
    ],
  },
  {
    type: "video-embed",
    label: "Video Embed",
    iconName: "Play",
    description: "Embed a YouTube or Vimeo video",
    category: "media",
    defaultProps: {
      url: "",
      title: "",
      aspectRatio: "16/9",
    },
    propDefs: [
      { key: "url", label: "Video URL (YouTube or Vimeo)", type: "url", placeholder: "https://youtube.com/..." },
      { key: "title", label: "Title (optional)", type: "text", placeholder: "Video title" },
      { key: "aspectRatio", label: "Aspect Ratio", type: "select", options: VIDEO_ASPECT_OPTIONS },
    ],
  },
  {
    type: "raw-html",
    label: "Raw HTML / Embed",
    iconName: "FileText",
    description: "Trusted raw HTML, scripts, iframes, or 3rd-party embed code",
    category: "media",
    defaultProps: {
      title: "",
      subtitle: "",
      html: "<div class=\"rounded-xl border p-6 text-center text-sm text-muted-foreground\">Paste trusted embed code here.</div>",
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Optional section heading" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Optional supporting description" },
      { key: "html", label: "HTML / Embed Code", type: "textarea", placeholder: "<iframe ...></iframe>" },
    ],
  },
  {
    type: "contact-info",
    label: "Contact Info",
    iconName: "Phone",
    description: "A list of contact details with icons",
    category: "content",
    defaultProps: {
      title: "Get in Touch",
      items: [
        { icon: "MapPin", label: "Service Area", value: "Charlotte, NC and surrounding areas" },
        { icon: "Phone", label: "Phone", value: "(774) 329-7109" },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Contact section heading" },
      {
        key: "items",
        label: "Contact Items",
        type: "array-items",
        itemSchema: [
          { key: "icon", label: "Icon (Lucide name)", type: "text", placeholder: "e.g. MapPin, Mail, Phone" },
          { key: "label", label: "Label", type: "text", placeholder: "e.g. Email, Phone" },
          { key: "value", label: "Value", type: "text", placeholder: "Contact detail" },
          { key: "href", label: "Link URL", type: "text", placeholder: "Optional tel:, mailto:, or maps URL" },
        ],
      },
    ],
  },
  {
    type: "divider",
    label: "Divider / Spacer",
    iconName: "Minus",
    description: "Visual divider or empty spacing between sections",
    category: "layout",
    defaultProps: {
      style: "spacer",
      spacing: "md",
    },
    propDefs: [
      { key: "style", label: "Style", type: "select", options: DIVIDER_STYLE_OPTIONS },
      { key: "spacing", label: "Spacing", type: "select", options: SPACING_OPTIONS },
    ],
  },
  {
    type: "feature-list",
    label: "Feature List",
    iconName: "List",
    description: "Icon + title + description features in a configurable column layout",
    category: "content",
    defaultProps: {
      title: "Key Features",
      subtitle: "",
      columns: "3",
      features: [
        { icon: "CheckCircle", title: "Careful Prep", description: "Surfaces are cleaned, repaired, sanded, caulked, and protected before paint." },
        { icon: "Paintbrush", title: "Premium Materials", description: "Professional-grade paints and stains selected for each surface." },
        { icon: "ShieldCheck", title: "Work Guaranteed", description: "Projects are backed by a 3-year workmanship warranty." },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Section heading" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Optional subtitle" },
      { key: "columns", label: "Columns", type: "select", options: FEATURE_LIST_COLUMNS_OPTIONS },
      {
        key: "features",
        label: "Features",
        type: "array-items",
        itemSchema: [
          { key: "icon", label: "Icon (Lucide)", type: "text", placeholder: "e.g. CheckCircle, Globe" },
          { key: "title", label: "Title", type: "text", placeholder: "Feature title" },
          { key: "description", label: "Description", type: "textarea", placeholder: "Feature description" },
        ],
      },
    ],
  },
  {
    type: "objection-busters",
    label: "Objection Busters",
    iconName: "ShieldCheck",
    description: "Address common concerns with reassuring responses",
    category: "conversion",
    defaultProps: {
      title: "Common Questions & Concerns",
      subtitle: "",
      items: [
        { concern: "Will the estimate be clear?", response: "Each estimate outlines the recommended scope, surface preparation, materials, and next steps before work begins." },
        { concern: "How will my home be protected?", response: "Floors, fixtures, landscaping, and nearby surfaces are covered before painting starts." },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Section heading" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Optional subtitle" },
      {
        key: "items",
        label: "Objections",
        type: "array-items",
        itemSchema: [
          { key: "concern", label: "Concern", type: "text", placeholder: "What they worry about" },
          { key: "response", label: "Response", type: "textarea", placeholder: "Reassuring answer" },
        ],
      },
    ],
  },
  {
    type: "before-after",
    label: "Before & After",
    iconName: "ArrowRight",
    description: "Timeline-style milestones showing transformation or progress",
    category: "social-proof",
    defaultProps: {
      title: "Your Journey",
      subtitle: "",
      items: [
        { before: "Peeling, faded, or dated surfaces", after: "A clear project plan and color direction", milestone: "Estimate" },
        { before: "Repairs and prep work unfinished", after: "Clean, protected, paint-ready surfaces", milestone: "Prep" },
        { before: "A tired finish", after: "A refreshed space with crisp lines and durable coverage", milestone: "Completion" },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Section heading" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Optional subtitle" },
      {
        key: "items",
        label: "Milestones",
        type: "array-items",
        itemSchema: [
          { key: "milestone", label: "Milestone Label", type: "text", placeholder: "e.g. Week 1, Step 1" },
          { key: "before", label: "Before", type: "text", placeholder: "Starting point" },
          { key: "after", label: "After", type: "text", placeholder: "Outcome" },
        ],
      },
    ],
  },
  {
    type: "trust-bar",
    label: "Trust Bar",
    iconName: "Shield",
    description: "Row of trust signals with icons and labels",
    category: "social-proof",
    defaultProps: {
      items: [
        { icon: "ShieldCheck", label: "3-Year Warranty" },
        { icon: "PaintBucket", label: "Premium Paint Included" },
        { icon: "Home", label: "Family-Owned" },
        { icon: "CheckCircle", label: "Free Quotes" },
      ],
    },
    propDefs: [
      {
        key: "items",
        label: "Trust Signals",
        type: "array-items",
        itemSchema: [
          { key: "icon", label: "Icon (Lucide)", type: "text", placeholder: "e.g. ShieldCheck, Lock" },
          { key: "label", label: "Label", type: "text", placeholder: "Trust signal text" },
        ],
      },
    ],
  },
  {
    type: "press-mentions",
    label: "Press Mentions",
    iconName: "Newspaper",
    description: "Display media logos with optional links",
    category: "social-proof",
    defaultProps: {
      title: "As Seen In",
      items: [
        { name: "Publication Name", logoUrl: "", link: "" },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "e.g. As Seen In, Featured By" },
      {
        key: "items",
        label: "Press Items",
        type: "array-items",
        itemSchema: [
          { key: "name", label: "Publication Name", type: "text", placeholder: "e.g. CNN, Forbes" },
          { key: "logoUrl", label: "Logo Image", type: "image-url", placeholder: "Upload logo" },
          { key: "link", label: "Link (optional)", type: "url", placeholder: "https://..." },
        ],
      },
    ],
  },
  {
    type: "social-proof-stats",
    label: "Social Proof Stats",
    iconName: "TrendingUp",
    description: "Key statistics with values, labels, and optional disclaimer",
    category: "social-proof",
    defaultProps: {
      title: "",
      stats: [
        { value: "5+", label: "Years Painting Charlotte Homes" },
        { value: "3", label: "Year Workmanship Warranty" },
        { value: "100%", label: "Free On-Site Quotes" },
      ],
      disclaimer: "",
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Optional heading" },
      {
        key: "stats",
        label: "Statistics",
        type: "array-items",
        itemSchema: [
          { key: "value", label: "Value", type: "text", placeholder: "e.g. 500+, 98%" },
          { key: "label", label: "Label", type: "text", placeholder: "What the stat represents" },
        ],
      },
      { key: "disclaimer", label: "Disclaimer", type: "text", placeholder: "Optional disclaimer text" },
    ],
  },
  {
    type: "image-grid",
    label: "Image Grid",
    iconName: "Grid3X3",
    description: "Multi-image grid with configurable columns",
    category: "media",
    defaultProps: {
      title: "",
      columns: "3",
      gap: "md",
      images: [],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Optional heading" },
      { key: "columns", label: "Columns", type: "select", options: COLUMNS_OPTIONS },
      { key: "gap", label: "Gap Size", type: "select", options: SPACING_OPTIONS },
      {
        key: "images",
        label: "Images",
        type: "array-items",
        itemSchema: [
          { key: "url", label: "Image", type: "image-url", placeholder: "Upload image" },
          { key: "alt", label: "Alt Text", type: "text", placeholder: "Image description" },
          { key: "caption", label: "Caption", type: "text", placeholder: "Optional caption" },
        ],
      },
    ],
  },
  {
    type: "slider",
    label: "Content Slider",
    iconName: "GalleryHorizontal",
    description: "Image or content slider with navigation controls",
    category: "media",
    defaultProps: {
      title: "",
      slides: [
        { imageUrl: "", heading: "Slide 1", description: "First slide description" },
        { imageUrl: "", heading: "Slide 2", description: "Second slide description" },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Optional heading" },
      {
        key: "slides",
        label: "Slides",
        type: "array-items",
        itemSchema: [
          { key: "imageUrl", label: "Image", type: "image-url", placeholder: "Upload slide image" },
          { key: "heading", label: "Heading", type: "text", placeholder: "Slide heading" },
          { key: "description", label: "Description", type: "textarea", placeholder: "Slide description" },
        ],
      },
    ],
  },
  {
    type: "stats-bar",
    label: "Stats Bar",
    iconName: "BarChart3",
    description: "Horizontal row of stats with icons, values, and labels",
    category: "data",
    defaultProps: {
      items: [
        { icon: "Users", value: "1,000+", label: "Active Members" },
        { icon: "Globe", value: "45+", label: "Countries" },
        { icon: "Star", value: "4.9", label: "Average Rating" },
      ],
    },
    propDefs: [
      {
        key: "items",
        label: "Stats",
        type: "array-items",
        itemSchema: [
          { key: "icon", label: "Icon (Lucide)", type: "text", placeholder: "e.g. Users, Globe" },
          { key: "value", label: "Value", type: "text", placeholder: "e.g. 1,000+" },
          { key: "label", label: "Label", type: "text", placeholder: "Stat description" },
        ],
      },
    ],
  },
  {
    type: "icon-grid",
    label: "Icon Grid",
    iconName: "Grid2X2",
    description: "Icon + title cards in a configurable grid",
    category: "content",
    defaultProps: {
      title: "",
      subtitle: "",
      columns: "4",
      items: [
        { icon: "Globe", title: "International" },
        { icon: "Heart", title: "Compassionate" },
        { icon: "Users", title: "Community" },
        { icon: "ShieldCheck", title: "Trusted" },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Optional heading" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Optional subtitle" },
      { key: "columns", label: "Columns", type: "select", options: COLUMNS_EXTENDED_OPTIONS },
      {
        key: "items",
        label: "Items",
        type: "array-items",
        itemSchema: [
          { key: "icon", label: "Icon (Lucide)", type: "text", placeholder: "e.g. Globe, Heart" },
          { key: "title", label: "Title", type: "text", placeholder: "Item title" },
        ],
      },
    ],
  },
  {
    type: "benefit-stack",
    label: "Benefit Stack",
    iconName: "ListChecks",
    description: "Benefits list in a stack or timeline layout",
    category: "content",
    defaultProps: {
      title: "Benefits",
      subtitle: "",
      layout: "stack",
      items: [
        { icon: "CheckCircle", title: "Detailed Preparation", description: "Surfaces are repaired, cleaned, sanded, and protected before paint goes on." },
        { icon: "Paintbrush", title: "Professional Finish", description: "Interior and exterior coatings are selected for the surface, sheen, and expected wear." },
        { icon: "ShieldCheck", title: "Warranty Support", description: "Completed work is backed by clear warranty expectations and responsive follow-up." },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Section heading" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Optional subtitle" },
      { key: "layout", label: "Layout", type: "select", options: BENEFIT_LAYOUT_OPTIONS },
      {
        key: "items",
        label: "Benefits",
        type: "array-items",
        itemSchema: [
          { key: "icon", label: "Icon (Lucide)", type: "text", placeholder: "e.g. CheckCircle" },
          { key: "title", label: "Title", type: "text", placeholder: "Benefit title" },
          { key: "description", label: "Description", type: "textarea", placeholder: "Benefit description" },
        ],
      },
    ],
  },
  {
    type: "science-explainer",
    label: "Science Explainer",
    iconName: "FlaskConical",
    description: "Evidence-based content with citations and sources",
    category: "content",
    defaultProps: {
      title: "The Research Behind Our Approach",
      body: "",
      citations: [
        { text: "Paint manufacturer product data sheet", url: "" },
      ],
    },
    propDefs: [
      { key: "title", label: "Title", type: "text", placeholder: "Section heading" },
      { key: "body", label: "Content", type: "richtext", placeholder: "Explain the evidence..." },
      {
        key: "citations",
        label: "Citations",
        type: "array-items",
        itemSchema: [
          { key: "text", label: "Citation Text", type: "text", placeholder: "Author, Year, Title" },
          { key: "url", label: "Link (optional)", type: "url", placeholder: "https://..." },
        ],
      },
    ],
  },
  {
    type: "safety-checklist",
    label: "Safety Checklist",
    iconName: "ClipboardCheck",
    description: "Required and optional items with disclaimer",
    category: "content",
    defaultProps: {
      title: "Safety & Quality Standards",
      disclaimer: "",
      items: [
        { text: "Protect floors, furniture, landscaping, and adjacent surfaces", required: true },
        { text: "Repair and prepare surfaces before applying finish coats", required: true },
        { text: "Keep a clean work area during the project", required: true },
        { text: "Complete a final walkthrough with the homeowner", required: false },
      ],
    },
    propDefs: [
      { key: "title", label: "Title", type: "text", placeholder: "Section heading" },
      { key: "disclaimer", label: "Disclaimer", type: "textarea", placeholder: "Optional legal disclaimer" },
      {
        key: "items",
        label: "Checklist Items",
        type: "array-items",
        itemSchema: [
          { key: "text", label: "Item Text", type: "text", placeholder: "Checklist item" },
          { key: "required", label: "Required?", type: "boolean" },
        ],
      },
    ],
  },
  {
    type: "guarantee-warranty",
    label: "Guarantee & Assurance",
    iconName: "BadgeCheck",
    description: "Guarantee points with a support CTA",
    category: "conversion",
    defaultProps: {
      title: "Our Commitment to You",
      subtitle: "",
      items: [
        { text: "Clear communication from quote to final walkthrough" },
        { text: "Careful protection of your home and belongings" },
        { text: "3-year workmanship warranty on completed painting projects" },
      ],
      ctaText: "Request a Quote",
      ctaLink: "/contact",
      ctaAction: "internal-link",
      ctaOpenInNewTab: false,
      ctaFormSlug: "contact-form",
      ctaModalTitle: "",
      ctaModalDescription: "",
    },
    propDefs: [
      { key: "title", label: "Title", type: "text", placeholder: "Section heading" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Optional subtitle" },
      {
        key: "items",
        label: "Guarantee Points",
        type: "array-items",
        itemSchema: [
          { key: "text", label: "Point", type: "text", placeholder: "Guarantee bullet point" },
        ],
      },
      { key: "ctaText", label: "CTA Button Text", type: "text", placeholder: "Button label" },
      { key: "ctaAction", label: "CTA Button Action", type: "select", options: BUTTON_ACTION_OPTIONS },
      { key: "ctaLink", label: "CTA Link", type: "url", placeholder: "/contact" },
      { key: "ctaOpenInNewTab", label: "Open In New Tab", type: "boolean" },
      { key: "ctaFormSlug", label: "Assigned Form", type: "form-select" },
      { key: "ctaModalTitle", label: "Modal Title", type: "text", placeholder: "Optional modal title override" },
      { key: "ctaModalDescription", label: "Modal Description", type: "textarea", placeholder: "Optional modal description" },
    ],
  },
  {
    type: "delivery-setup",
    label: "Process Steps",
    iconName: "Workflow",
    description: "Step-by-step process with optional included items list",
    category: "content",
    defaultProps: {
      title: "How It Works",
      subtitle: "",
      steps: [
        { step: "1", title: "Request a Quote", description: "Share the rooms, surfaces, or exterior areas you want painted." },
        { step: "2", title: "Review the Scope", description: "Confirm preparation, products, schedule, and pricing before work begins." },
        { step: "3", title: "Paint and Walk Through", description: "The crew completes the work, cleans up, and reviews the finished project with you." },
      ],
      includedItems: [],
    },
    propDefs: [
      { key: "title", label: "Title", type: "text", placeholder: "Section heading" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Optional subtitle" },
      {
        key: "steps",
        label: "Steps",
        type: "array-items",
        itemSchema: [
          { key: "step", label: "Step Number/Label", type: "text", placeholder: "e.g. 1, Step A" },
          { key: "title", label: "Title", type: "text", placeholder: "Step title" },
          { key: "description", label: "Description", type: "textarea", placeholder: "Step details" },
        ],
      },
      {
        key: "includedItems",
        label: "What's Included (optional)",
        type: "array-items",
        itemSchema: [
          { key: "text", label: "Item", type: "text", placeholder: "Included item" },
        ],
      },
    ],
  },
  {
    type: "recovery-use-cases",
    label: "Use Cases",
    iconName: "Users",
    description: "Persona-based messaging showing who this is for",
    category: "content",
    defaultProps: {
      title: "Who We Help",
      subtitle: "",
      personas: [
        { title: "Homeowners", description: "People refreshing interiors, exteriors, cabinets, decks, and fences.", icon: "Home" },
        { title: "Sellers", description: "Homeowners preparing a property for listing with fresh, clean paint.", icon: "BadgeDollarSign" },
        { title: "Property Managers", description: "Managers who need reliable residential repainting and repair support.", icon: "Building2" },
      ],
    },
    propDefs: [
      { key: "title", label: "Section Title", type: "text", placeholder: "Section heading" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Optional subtitle" },
      {
        key: "personas",
        label: "Personas",
        type: "array-items",
        itemSchema: [
          { key: "icon", label: "Icon (Lucide)", type: "text", placeholder: "e.g. User, Users" },
          { key: "title", label: "Persona Title", type: "text", placeholder: "e.g. Homeowners" },
          { key: "description", label: "Description", type: "textarea", placeholder: "Who they are and what they need" },
        ],
      },
    ],
  },
  {
    type: "protocol-builder",
    label: "Protocol Builder",
    iconName: "ListOrdered",
    description: "Step-by-step protocols organized by experience level",
    category: "content",
    defaultProps: {
      title: "Getting Started Guide",
      subtitle: "",
      level: "beginner",
      steps: [
        { title: "Request an Estimate", description: "Share the project details, photos, and preferred contact information." },
        { title: "Review the Scope", description: "Confirm surfaces, prep needs, materials, colors, timing, and warranty details." },
        { title: "Schedule the Work", description: "Choose a project window and prepare the space for painting day." },
      ],
    },
    propDefs: [
      { key: "title", label: "Title", type: "text", placeholder: "Protocol title" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Optional subtitle" },
      { key: "level", label: "Experience Level", type: "select", options: EXPERIENCE_LEVEL_OPTIONS },
      {
        key: "steps",
        label: "Steps",
        type: "array-items",
        itemSchema: [
          { key: "title", label: "Step Title", type: "text", placeholder: "Step title" },
          { key: "description", label: "Description", type: "textarea", placeholder: "Step details" },
        ],
      },
    ],
  },
];

const FULL_WIDTH_BLOCK_TYPES = new Set([
  "hero",
  "cta",
  "trust-bar",
  "divider",
  "slider",
  "stats-bar",
]);

export const BLOCK_REGISTRY: BlockDef[] = BASE_BLOCK_REGISTRY.map((block) => {
  const blockWithHeading = withSharedSectionHeading(block);
  if (block.type === "hero") {
    return withSharedVisibility(blockWithHeading);
  }
  return withSharedVisibility(withSharedSectionStyles(blockWithHeading, {
    includeImageControls: true,
    includePaddingControls: !FULL_WIDTH_BLOCK_TYPES.has(block.type),
  }));
});

const BASE_DYNAMIC_BLOCK_TYPES: BlockDef[] = [
  {
    type: "contact-form",
    label: "Contact Form (Live)",
    iconName: "Mail",
    description: "Contact form with validation and submission — managed automatically",
    isDynamic: true,
    category: "dynamic",
    defaultProps: {},
    propDefs: [],
  },
  {
    type: "form-embed",
    label: "Form Embed",
    iconName: "FileText",
    description: "Reusable form selected from the Forms library, embeddable in pages and widgets",
    isDynamic: true,
    category: "dynamic",
    defaultProps: {
      formSlug: "contact-form",
    },
    propDefs: [
      { key: "formSlug", label: "Assigned Form", type: "form-select" },
    ],
  },
];

export const DYNAMIC_BLOCK_TYPES: BlockDef[] = BASE_DYNAMIC_BLOCK_TYPES.map((block) =>
  withSharedVisibility(withSharedSectionStyles(withSharedSectionHeading(block), {
    includePaddingControls: !FULL_WIDTH_BLOCK_TYPES.has(block.type),
  }))
);

export const ALL_BLOCKS: BlockDef[] = [...BLOCK_REGISTRY, ...DYNAMIC_BLOCK_TYPES];

export function normalizeBlockType(type: string): string {
  return LEGACY_BLOCK_TYPE_ALIASES[type] ?? type;
}

export function getBlockDef(type: string): BlockDef | undefined {
  const normalizedType = normalizeBlockType(type);
  return ALL_BLOCKS.find((b) => b.type === normalizedType);
}

export function isDynamicBlock(type: string): boolean {
  const def = getBlockDef(type);
  return def?.isDynamic === true;
}

export function createBlock(type: string): BlockInstance {
  const def = getBlockDef(type);
  if (!def) throw new Error(`Unknown block type: ${type}`);
  return {
    id: crypto.randomUUID(),
    type,
    props: { ...def.defaultProps },
  };
}
