import { randomUUID } from "crypto";
import { pool } from "../db";
import { storage } from "../storage";
import type { InsertCmsPage, InsertCmsMenu, MenuItem, StandardMenuLocation } from "@shared/schema";

const SITE_URL = process.env.APP_URL || "https://ecpaintingcharlotte.com";
const BRAND_NAME = "593 EC Painting";
const LEGAL_NAME = "593 EC Painting LLC";
const PHONE_DISPLAY = "(774) 329-7109";
const PHONE_TEL = "tel:7743297109";
const EMAIL = "ecpainting_593@outlook.com";
const ADDRESS = "7007 Berolina Ln, Charlotte, NC 28226";
const LAUNCH_DATE = "June 14, 2026";
const GOOGLE_BUSINESS_URL = "https://share.google/ZmFgBXQSoPCB2biBq";
const FACEBOOK_URL = "https://www.facebook.com/ec.painting.3/";
const INSTAGRAM_URL = "https://www.instagram.com/593ecpainting/";
const LOGO_URL = "/img/593-ec-painting-logo-full-color.png";
const OG_IMAGE_URL = "/img/593-ec-painting-og.jpg";
const FAVICON_URL = "/favicon.ico";
const SERVICE_AREA =
  "Charlotte • Matthews • Mint Hill • Monroe • Pineville • Huntersville • Cornelius • Davidson • Concord • Tega Cay • Waxhaw • Indian Trail • Stallings • Fort Mill • Indian Land • Rock Hill — and surrounding areas";

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
    openInNewTab: url.startsWith("http") || url.startsWith("tel:") || url.startsWith("sms:"),
    children,
  };
}

function p(text: string) {
  return `<p>${text}</p>`;
}

function ul(items: string[]) {
  return `<ul>${items.map((text) => `<li>${text}</li>`).join("")}</ul>`;
}

function strong(label: string, body: string) {
  return `<strong>${label}</strong> ${body}`;
}

function rich(title: string, paragraphs: string[] | string, extra: Record<string, unknown> = {}) {
  const content = Array.isArray(paragraphs)
    ? paragraphs
        .map((paragraph) => (paragraph.trim().startsWith("<") ? paragraph : p(paragraph)))
        .join("")
    : paragraphs;
  return block("rich-text", { title, content, alignment: "left", ...extra });
}

function featureList(
  title: string,
  subtitle: string,
  features: Array<{ title: string; description: string; icon?: string }>,
  extra: Record<string, unknown> = {},
) {
  return block("feature-list", {
    title,
    subtitle,
    columns: "3",
    features: features.map((feature) => ({ icon: feature.icon || "CheckCircle", ...feature })),
    ...extra,
  });
}

function cards(
  title: string,
  subtitle: string,
  cardItems: Array<{ title: string; description: string; icon?: string; link?: string }>,
  extra: Record<string, unknown> = {},
) {
  return block("cards-grid", {
    title,
    subtitle,
    columns: "3",
    cards: cardItems.map((card) => ({ icon: card.icon || "PaintBucket", ...card })),
    ...extra,
  });
}

function processBlock(
  title: string,
  subtitle: string,
  steps: Array<{ title: string; description: string }>,
) {
  return block("delivery-setup", {
    title,
    subtitle,
    steps: steps.map((step, index) => ({ step: String(index + 1), ...step })),
  });
}

function cta(
  heading: string,
  subheading: string,
  primaryText = "Get a Free Quote",
  secondary = true,
  primaryLink?: string,
  secondaryText?: string,
  secondaryLink?: string,
) {
  const isCall = primaryText.toLowerCase().includes("call");
  const resolvedSecondaryLink = secondaryLink ?? PHONE_TEL;
  return block("cta", {
    heading,
    subheading,
    primaryText,
    primaryAction: isCall ? "external-link" : "internal-link",
    primaryLink: primaryLink ?? (isCall ? PHONE_TEL : "/contact/"),
    secondaryText: secondary ? (secondaryText ?? `Call ${PHONE_DISPLAY}`) : "",
    secondaryAction: resolvedSecondaryLink.startsWith("/") ? "internal-link" : "external-link",
    secondaryLink: resolvedSecondaryLink,
    variant: "dark",
  });
}

function hero({
  headline,
  subheadline,
  image,
  secondary = true,
  primaryText = "Get a Free Quote",
  primaryLink = "/contact/",
}: {
  headline: string;
  subheadline: string;
  image?: string;
  secondary?: boolean;
  primaryText?: string;
  primaryLink?: string;
}) {
  return block("hero", {
    heading: headline,
    subheading: `<p>${subheadline}</p>`,
    ctaText: primaryText,
    ctaAction: "internal-link",
    ctaLink: primaryLink,
    ctaSecondaryText: secondary ? `Call ${PHONE_DISPLAY}` : "",
    ctaSecondaryAction: "external-link",
    ctaSecondaryLink: PHONE_TEL,
    backgroundImageUrl: image || "/img/gallery/exterior-home.webp",
    overlayColor: "#000000",
    overlayOpacity: 42,
    layout: "stacked",
    minHeight: "580",
  });
}

function faq(items: Array<{ question: string; answer: string }>) {
  return block("faq", { title: "Frequently Asked Questions", items });
}

function galleryBlock(title: string, subtitle: string, limit = 6) {
  return block("image-grid", {
    title,
    subtitle,
    columns: "3",
    gap: "md",
    images: galleryImages.slice(0, limit),
  });
}

const serviceCards = [
  {
    title: "Interior Painting",
    description: "Walls, ceilings, trim, doors, and full home repaints.",
    icon: "PaintBucket",
    link: "/interior-painting/",
  },
  {
    title: "Exterior Painting",
    description: "Siding, brick, stucco, trim, and full exterior repaints.",
    icon: "Home",
    link: "/exterior-painting/",
  },
  {
    title: "Cabinet Painting",
    description: "Kitchen and bathroom cabinet refinishing without the cost of replacement.",
    icon: "Layers",
    link: "/cabinet-painting/",
  },
  {
    title: "Deck Staining & Painting",
    description: "Cleaning, staining, sealing, and restoring outdoor wood.",
    icon: "Sun",
    link: "/deck-staining/",
  },
  {
    title: "Fence Staining & Painting",
    description: "Protect and refresh wood fences for years of curb appeal.",
    icon: "Fence",
    link: "/fence-staining/",
  },
];

const services = [
  {
    title: "Interior Painting",
    navTitle: "Interior Painting",
    slug: "interior-painting",
    path: "/interior-painting/",
    icon: "PaintBucket",
    image: "/img/services/interior.webp",
    metaTitle: "Interior House Painters in Charlotte, NC | 593 EC Painting",
    metaDescription:
      "Family-owned interior painters serving Charlotte, NC. Walls, ceilings, trim, popcorn ceiling removal, wallpaper removal, and drywall repair. Free quotes, 3-year warranty.",
    heroTitle: "Interior House Painters in Charlotte, NC",
    heroSubtitle:
      "Walls, ceilings, trim, and everything in between. Backed by a 3-year warranty and painted by people who actually care about the result.",
    introTitle: "Interior Painting Done Right",
    intro: [
      "A great interior paint job isn't just about the color you pick. It's about clean lines, even coverage, properly prepped walls, smooth ceilings, and trim that looks crisp instead of sloppy. It's about a crew that protects your floors, covers your furniture, and cleans up at the end of every day.",
      "That's what we do. 593 EC Painting has been painting interiors across Charlotte for 5 years, and we treat every home we walk into the way we'd want a painter to treat ours — with care, communication, and craftsmanship from the first wall to the final touch-up.",
    ],
    featuresTitle: "What We Paint Inside Your Home",
    featuresSubtitle:
      "From a single room to your whole house, we handle every surface inside your home.",
    features: [
      "Walls",
      "Ceilings",
      "Trim & Baseboards",
      "Doors & Door Frames",
      "Window Trim",
      "Staircases & Railings",
      "Built-Ins & Bookshelves",
    ],
    featureDetails: [
      {
        title: "Walls",
        description:
          "Single rooms, whole-house repaints, accent walls, color changes, and refreshes.",
      },
      {
        title: "Ceilings",
        description:
          "Standard flat ceilings, vaulted ceilings, popcorn-textured ceilings (and removal).",
      },
      {
        title: "Trim & Baseboards",
        description: "Crown molding, baseboards, chair rails, wainscoting, and decorative trim.",
      },
      {
        title: "Doors & Door Frames",
        description: "Interior doors, closet doors, and frames painted to match your style.",
      },
      { title: "Window Trim", description: "Interior window casings and sills." },
      {
        title: "Staircases & Railings",
        description: "Painted balusters, handrails, and stringer work.",
      },
      {
        title: "Built-Ins & Bookshelves",
        description: "Custom built-in cabinetry and shelving painted to look new.",
      },
    ],
    processTitle: "Our Interior Painting Process",
    processSubtitle: "Here's exactly what to expect from quote to walkthrough.",
    steps: [
      [
        "Free On-Site Quote",
        "We come out, measure, talk through colors and finishes, and write you a clear estimate.",
      ],
      [
        "Prep & Protect",
        "We move or cover furniture, mask trim, cover floors, and patch holes and cracks before paint touches a wall.",
      ],
      [
        "Prime & Repair",
        "We prime stains, water marks, and patches so the finish coat lays evenly.",
      ],
      ["Paint", "Two coats of premium paint applied with care. We don't cut corners on coverage."],
      [
        "Walkthrough",
        "We walk every room with you, touch up anything you spot, and don't leave until you're happy.",
      ],
    ],
    extras: [
      [
        "Popcorn Ceiling Removal",
        [
          "Popcorn ceilings make a house feel dated faster than almost anything else. They collect dust, they're hard to clean, and they instantly age a room. Removing them is one of the highest-impact upgrades you can make — and we handle the whole process: containment, scraping, skim coating, sanding, priming, and painting the smooth ceiling underneath.",
          "If your home was built before 1980, we'll test for asbestos before any work begins, because that's the safe and responsible thing to do. From there, we contain the work area, remove the texture, fix the drywall underneath, and leave you with a smooth, modern ceiling that makes the whole room feel taller and brighter.",
          "Most popcorn removal projects are bundled with a full interior repaint — it's the perfect time to do both at once.",
        ],
      ],
      [
        "Wallpaper Removal",
        [
          "Old wallpaper is one of those projects every homeowner wants done and nobody wants to do themselves. We get it — it's messy, it's tedious, and if it's not done right, you end up with a worse wall than you started with.",
          "We remove wallpaper the right way: steam, scrape, and clean the adhesive residue, then repair any damage to the drywall underneath, prime, and paint. By the time we're done, you'd never know wallpaper was ever there. Whether it's one accent wall or every wall in the house, we handle it cleanly.",
        ],
      ],
      [
        "Drywall Repair",
        [
          "Cracks, holes, water stains, dents, doorknob damage, settling cracks at the corners of windows and doors — we fix all of it before we paint. Some painters skip the repairs and just paint over them. We won't. A fresh coat of paint over unrepaired drywall is just a fresh coat of paint over a problem.",
          "We patch, tape, mud, sand, prime, and texture-match so repairs blend invisibly into the surrounding wall. For larger sections of damage, we can replace full pieces of drywall and finish them to match the rest of the room. Whatever shape your walls are in, we leave them smooth before paint goes on.",
        ],
      ],
    ],
    whyTitle: "Why Choose 593 EC Painting for Your Interior",
    whyItems: [
      {
        title: "You talk to the owner",
        description: "Esau and Sandra answer the phone, write the quote, and oversee the work.",
      },
      {
        title: "Real prep, every time",
        description: "We don't skip steps to save time.",
      },
      {
        title: "Premium paint, included",
        description:
          "Sherwin-Williams and Benjamin Moore on every project as a standard, not an upcharge.",
      },
      {
        title: "Daily photo updates",
        description: "Know what's happening even when you're at work.",
      },
      { title: "3-year warranty", description: "Written into your contract." },
      {
        title: "We come back for touch-ups",
        description: "Months or years later. That's how we keep customers for life.",
      },
    ],
    galleryTitle: "Recent Interior Projects",
    gallerySubtitle: "A look at recent interior painting work across Charlotte.",
    ctaHeading: "Ready to Refresh Your Interior?",
    ctaBody:
      "Get a free quote for your interior painting project. Most quotes scheduled within 48 hours.",
    faq: [
      [
        "How long does interior painting take?",
        "It depends on the size of the home and the scope of work, but most single rooms take 1–2 days and most full-house interiors take 4–7 days. We'll give you a clear timeline in your written quote.",
      ],
      [
        "Do I need to move my furniture?",
        "No. We move and cover all furniture for you as part of the job. You don't need to lift a thing.",
      ],
      [
        "What paint brands do you use?",
        "We use Sherwin-Williams and Benjamin Moore on most interior projects. Both are premium paints designed for durability and coverage, and we include them as standard, not as an upcharge.",
      ],
      [
        "Can you help me pick colors?",
        "Absolutely. We'll walk through your home with you, look at lighting and existing finishes, and help you choose colors that work. If you want a deeper color consultation, we can also recommend trusted local designers.",
      ],
      [
        "Do you paint ceilings and trim, or just walls?",
        "Everything. Walls, ceilings, trim, baseboards, doors, crown molding, window casings, and built-ins. Quote it once, paint it all.",
      ],
      [
        "What if I notice a missed spot after you leave?",
        "Call or text us and we'll come back and fix it. Our 3-year warranty covers workmanship issues, and we genuinely want you to be happy with the result.",
      ],
      [
        "Is the paint smell strong?",
        "Modern interior paints are very low-VOC, so the smell is minimal and usually gone within a few hours of finishing. We can also use zero-VOC paints on request — just let us know.",
      ],
      [
        "Can you remove popcorn ceilings and paint in the same project?",
        "Yes — and it's actually the most efficient way to do it. We handle the popcorn removal, repair, smooth the ceiling, and then paint everything as part of one project.",
      ],
    ],
  },
  {
    title: "Exterior Painting",
    navTitle: "Exterior Painting",
    slug: "exterior-painting",
    path: "/exterior-painting/",
    icon: "Home",
    image: "/img/services/exterior.webp",
    metaTitle: "Exterior House Painters in Charlotte, NC | 593 EC Painting",
    metaDescription:
      "Family-owned exterior painters serving Charlotte, NC. Siding, brick, stucco, trim, and pressure washing. Built for Carolina weather. Free quotes, 3-year warranty.",
    heroTitle: "Exterior House Painters in Charlotte, NC",
    heroSubtitle:
      "Siding, brick, stucco, and trim — painted to stand up to Carolina sun, humidity, and storms. Backed by a 3-year warranty.",
    introTitle: "Exterior Painting Built for the Carolinas",
    intro: [
      "Charlotte weather is hard on a paint job. Long humid summers, intense UV, sudden thunderstorms, and the occasional freeze cycle in winter — they all attack exterior paint, and they're the reason most homes around here need to be repainted every 7–10 years.",
      "The difference between a good exterior paint job and a bad one shows up in years 3, 4, and 5. Cheap paint, skipped prep, or rushed work will start peeling, fading, or chalking long before it should.",
      "We do exterior painting the way it's supposed to be done — careful prep, premium paint, and a warranty that backs it up.",
    ],
    featuresTitle: "Exterior Surfaces We Paint",
    featuresSubtitle:
      "From siding to shutters, we handle every painted surface on the outside of your home.",
    features: [
      "Hardie Plank & Fiber Cement Siding",
      "Vinyl Siding",
      "Wood Siding & Lap Siding",
      "Brick & Masonry",
      "Stucco",
      "Trim, Soffits & Fascia",
      "Front Doors & Shutters",
      "Garage Doors",
      "Decks & Porches",
    ],
    featureDetails: [
      {
        title: "Hardie Plank & Fiber Cement Siding",
        description:
          "The most common siding on newer Charlotte homes. Needs repainting every 7–15 years.",
      },
      {
        title: "Vinyl Siding",
        description:
          "Yes, vinyl can be painted, and we know how to prep it so the paint holds and the color is appropriate for the material.",
      },
      {
        title: "Wood Siding & Lap Siding",
        description:
          "Cedar, pine, and other wood sidings on older homes, with careful scraping, priming, and repair before painting.",
      },
      {
        title: "Brick & Masonry",
        description:
          "Full brick paint or limewash-style finishes. Permanent color change for your brick home.",
      },
      {
        title: "Stucco",
        description: "Patching, prep, and painting for traditional and synthetic stucco surfaces.",
      },
      {
        title: "Trim, Soffits & Fascia",
        description: "The detail work that frames your home's exterior and often shows wear first.",
      },
      {
        title: "Front Doors & Shutters",
        description: "High-impact upgrades that can transform your curb appeal quickly.",
      },
      {
        title: "Garage Doors",
        description: "Painted to match or refresh your exterior color scheme.",
      },
      {
        title: "Decks & Porches",
        description:
          "Exterior wood and porch surfaces, with deeper deck restoration available on the deck staining page.",
      },
    ],
    processTitle: "Our Exterior Painting Process",
    processSubtitle: "Five steps from quote to clean job site.",
    steps: [
      [
        "Free On-Site Quote",
        "We measure the home, inspect the siding and trim, talk through colors, and write a detailed estimate.",
      ],
      [
        "Pressure Wash",
        "Every exterior paint job starts with a thorough pressure wash to remove dirt, mildew, and chalking.",
      ],
      [
        "Repair & Prep",
        "Caulk gaps, fix wood rot, scrape loose paint, prime bare spots. The prep work that makes paint last.",
      ],
      [
        "Paint",
        "Two coats of premium exterior paint, applied in the right weather conditions for proper adhesion and cure.",
      ],
      [
        "Final Walkthrough",
        "We walk the entire exterior with you, touch up anything that needs it, and leave the job site clean.",
      ],
    ],
    extras: [
      [
        "Pressure Washing",
        [
          "Pressure washing is included with every exterior paint job — but we also do it as a standalone service. Charlotte's humidity grows mildew on north-facing walls, dirt builds up on siding over time, and oxidation leaves chalky residue that prevents paint from sticking properly.",
          "We pressure wash siding, brick, stucco, concrete driveways, sidewalks, porches, and patios. For exterior painting projects, the pressure wash is the foundation of a paint job that lasts — skipping it is one of the most common reasons paint fails early.",
          "If you just want your home cleaned up for a listing photo, for a family event, or because it's starting to look dingy, we're happy to handle pressure washing on its own.",
        ],
      ],
      [
        "Built for Carolina Weather",
        [
          "Painting in the Charlotte area is different from painting in other parts of the country, and a painter who doesn't account for that ends up with a paint job that fails early.",
          "Heat and humidity affect how paint cures. UV exposure fades cheap paints faster than the warranty claims. Pollen season makes timing matter. Sudden afternoon thunderstorms can ruin a fresh coat if the painter didn't watch the radar.",
          "We've been painting Carolina homes for 5 years and we know the rhythms — when to paint and when to wait, which paints hold up to the UV here, and how to prep siding so the paint doesn't peel in year three. Hire someone who knows the local weather, and your exterior paint job will last as long as it's supposed to.",
        ],
      ],
    ],
    whyTitle: "Why Choose 593 EC Painting for Your Exterior",
    whyItems: [
      {
        title: "Family-owned, local",
        description: "Esau and Sandra run every project personally.",
      },
      {
        title: "Premium paints",
        description:
          "Sherwin-Williams Duration, Emerald, and Benjamin Moore Aura exteriors as standard.",
      },
      {
        title: "Real prep, every time",
        description: "Wash, scrape, repair, caulk, prime. No shortcuts.",
      },
      {
        title: "Wood rot repair",
        description: "We catch and fix rotted trim and siding before painting.",
      },
      {
        title: "Weather-smart scheduling",
        description: "We watch the forecast and paint when conditions are right.",
      },
      { title: "3-year warranty", description: "Written into your contract." },
    ],
    galleryTitle: "Recent Exterior Projects",
    gallerySubtitle: "A look at recent exterior painting projects across the Carolinas.",
    ctaHeading: "Ready to Refresh Your Exterior?",
    ctaBody:
      "Get a free on-site quote for your exterior painting project. We'll measure, inspect, and write you a clear estimate.",
    faq: [
      [
        "How often should I repaint my home's exterior in Charlotte?",
        "Most Charlotte homes need exterior repainting every 7-10 years, depending on the siding material, sun exposure, and the quality of the previous paint job. Hardie plank tends to last longer than wood siding. We can tell you what to expect when we come out for the quote.",
      ],
      [
        "What is the best time of year to paint a house exterior in Charlotte?",
        "Spring through fall is ideal — we look for stretches of dry weather with daytime highs between 50°F and 90°F and overnight lows that stay above 50°F. April–June and September–October are the sweet spots in the Carolinas. We can paint year-round when conditions allow.",
      ],
      [
        "Do I need to be home while you paint the exterior?",
        "Not at all. We just need access to outdoor faucets, a power source, and any gates. Many of our customers go to work as normal while we paint.",
      ],
      [
        "Do you repair wood rot before painting?",
        "Yes. We inspect trim, soffits, fascia, and siding for rot during the quote, and we include repair work in the estimate. Painting over rotted wood is a waste of paint and money.",
      ],
      [
        "Can you paint brick or stucco?",
        "Absolutely. We paint brick exteriors with breathable masonry paints designed to let moisture escape, and we patch and paint stucco with products built for that surface. Both surfaces require different prep and paint than siding does, and we have experience with both.",
      ],
      [
        "What paint brands do you use for exteriors?",
        "Sherwin-Williams Duration and Emerald exterior, and Benjamin Moore Aura exterior. Both are top-tier exterior paints designed for southern climates. Premium paint isn't an upcharge — it's the standard on every exterior job we do.",
      ],
      [
        "Is pressure washing included?",
        "Yes, every exterior paint job includes a thorough pressure wash. It is the foundation of a paint job that lasts.",
      ],
      [
        "What does the 3-year warranty cover?",
        "Our written 3-year workmanship warranty covers peeling, blistering, and adhesion failures caused by our application or prep. We come back and fix it at no charge. The warranty doesn't cover damage from things outside our control like storms, impact, or settling.",
      ],
    ],
  },
  {
    title: "Cabinet Painting",
    navTitle: "Cabinet Painting",
    slug: "cabinet-painting",
    path: "/cabinet-painting/",
    icon: "Layers",
    image: "/img/services/cabinets.webp",
    metaTitle: "Cabinet Painters in Charlotte, NC | 593 EC Painting",
    metaDescription:
      "Kitchen and bathroom cabinet painting in Charlotte, NC. Save 50-70% versus replacement with a factory-quality finish. Family-owned, 3-year warranty, free quotes.",
    heroTitle: "Cabinet Painters in Charlotte, NC",
    heroSubtitle:
      "Get the look of a new kitchen for a fraction of the cost. Family-owned cabinet refinishing with a factory-quality finish.",
    introTitle: "A New Kitchen Without the Cost of a New Kitchen",
    intro: [
      "Kitchen cabinets are the single biggest visual element in your kitchen — and replacing them is one of the most expensive projects in any home renovation. New cabinets typically run $15,000 to $40,000 for a Charlotte-area kitchen, plus weeks of disruption while your kitchen is unusable.",
      "Cabinet painting gives you 90% of the visual impact for 20–30% of the cost. Done right, painted cabinets look factory-finished — smooth, durable, and modern. Done wrong, they look like a DIY weekend that didn't work out.",
      "We do it right. Spray-applied finishes, professional prep, premium cabinet-grade products, and a 3-year warranty. Most kitchens are finished in about a week.",
    ],
    featuresTitle: "Cabinet Painting vs Cabinet Replacement",
    featuresSubtitle: "Here is how they compare on what matters.",
    features: ["Cost", "Timeline", "Kitchen downtime", "Mess & disruption", "Result"],
    featureDetails: [
      {
        title: "Cost",
        description:
          "Cabinet painting: roughly 20–30% of the cost of replacement. Big savings without giving up the visual upgrade.",
      },
      {
        title: "Timeline",
        description:
          "Cabinet painting: about a week. Replacement: 6–12 weeks including demo, custom builds, and install.",
      },
      {
        title: "Kitchen downtime",
        description:
          "Cabinet painting: a few days you can't access cabinets. Replacement: weeks without a functioning kitchen.",
      },
      {
        title: "Mess & disruption",
        description:
          "Cabinet painting: contained, sprayed off-site or in a controlled area. Replacement: demo dust, drywall work, electrical, plumbing.",
      },
      {
        title: "Result",
        description:
          "Both can look great. Cabinet painting works best when cabinet boxes are solid and you want a new color or finish.",
      },
    ],
    processTitle: "How We Paint Cabinets",
    processSubtitle:
      "The process that separates a factory-quality finish from a DIY-looking finish.",
    steps: [
      [
        "Free In-Home Quote",
        "We look at your cabinets, count doors and drawers, talk through colors and finishes, and give you a clear written quote.",
      ],
      [
        "Remove Doors & Hardware",
        "Every door and drawer face comes off, gets labeled, and is moved to a controlled spray environment.",
      ],
      [
        "Clean & Degrease",
        "Kitchen cabinets accumulate years of cooking grease. We clean thoroughly so the new finish actually sticks.",
      ],
      [
        "Sand & Prep",
        "We scuff-sand the existing finish, fill any dings or scratches, and prep every surface to accept primer.",
      ],
      [
        "Prime",
        "Bonding primer designed for cabinets goes on first to give the topcoat something to grip.",
      ],
      [
        "Spray Topcoats",
        "Two or three coats of cabinet-grade enamel, sprayed for a smooth, brush-mark-free finish.",
      ],
      [
        "Reinstall",
        "Doors and drawers come back, hardware goes back on (or new hardware if you've upgraded), and we walk through the finished kitchen with you.",
      ],
    ],
    extras: [
      [
        "Finish Options",
        [
          "Cabinet painting opens up color and style choices you wouldn't get from a stained finish.",
          strong(
            "Solid Color",
            "Classic whites, soft greens, navy blues, charcoals — anything from the Sherwin-Williams or Benjamin Moore palette.",
          ),
          strong(
            "Two-Tone",
            "Different colors on uppers and lowers, or a contrasting color on the island. Designer-favorite look.",
          ),
          strong(
            "Cabinet + Trim Match",
            "Match your cabinets to your trim color for a clean, intentional look.",
          ),
          strong(
            "Hardware Upgrade",
            "While the doors are off, swapping out dated hardware for modern pulls is the easiest upgrade you'll ever make. We can do it as part of the project.",
          ),
        ],
      ],
      [
        "Built to Hold Up to Daily Life",
        [
          "Kitchen cabinets take more abuse than any other painted surface in your home. They get bumped, opened thousands of times, splashed with grease, wiped down with cleaners, and exposed to heat and steam. The wrong paint on cabinets will chip, peel, and look worn within a year.",
          "We use cabinet-grade enamels designed specifically for this kind of use — products like Sherwin-Williams Emerald Urethane Trim Enamel and Benjamin Moore Advance. They cure to a hard, factory-like finish that resists chips, scratches, and the daily wear of a working kitchen.",
          "Cure time matters too. We let the finish properly cure before reinstalling doors and recommend gentle use for the first two weeks while the paint fully hardens.",
        ],
      ],
      [
        "What to Expect During Your Cabinet Project",
        [
          p(
            "A typical kitchen cabinet project takes 5–7 working days from start to finish. Here's roughly what each day looks like:",
          ) +
            ul([
              "Day 1: Remove doors, drawers, and hardware. Begin cleaning and prep.",
              "Days 2–3: Sand, fill, prep all surfaces. Set up controlled spray area.",
              "Days 3–5: Prime and spray topcoats on doors, drawers, and cabinet boxes.",
              "Day 6: Cure time and final touch-ups.",
              "Day 7: Reinstall doors, drawers, and hardware. Walkthrough with you.",
            ]),
          "You'll have limited use of the cabinets for most of the week, but the kitchen itself remains usable — you can still cook, use the sink, and access the inside of cabinets when needed.",
        ],
      ],
    ],
    whyTitle: "Why Choose 593 EC Painting for Your Cabinets",
    whySubtitle: "",
    whyItems: [
      {
        title: "Family-owned attention",
        description: "Esau personally oversees every cabinet project.",
      },
      {
        title: "Spray-applied, not brushed",
        description: "Smooth, factory-quality finish without brush marks.",
      },
      {
        title: "Cabinet-grade products",
        description: "Built for daily kitchen use, not ordinary wall paint.",
      },
      { title: "3-year warranty", description: "Written into your contract." },
      {
        title: "Honest timeline",
        description: "Most kitchens done in a week, not sometime next month.",
      },
      {
        title: "Clean, contained work",
        description: "Doors are sprayed off-site or in a sealed area. No overspray on appliances.",
      },
    ],
    galleryTitle: "Recent Cabinet Projects",
    gallerySubtitle: "Before-and-after photos from Charlotte-area kitchens we have refinished.",
    ctaHeading: "Ready to Transform Your Kitchen?",
    ctaBody:
      "Get a free in-home quote and find out what cabinet painting could do for your kitchen.",
    faq: [
      [
        "How long does cabinet painting take?",
        "Most kitchen cabinet projects take 5–7 working days from start to finish. Bathroom vanities are usually 2–3 days. We'll give you a specific timeline in your written quote.",
      ],
      [
        "Can I still use my kitchen during the project?",
        "Yes, mostly. The cabinets themselves will be inaccessible for parts of the week, but the kitchen stays functional — sink, appliances, and counter space are all usable. We work in stages so you're never completely cut off.",
      ],
      [
        "Will painted cabinets really hold up to daily use?",
        "Yes, if they are painted correctly. We use cabinet-grade enamels designed for high-traffic surfaces, and we follow proper cure times. Done right, painted cabinets hold up just as well as factory-finished cabinets.",
      ],
      [
        "What if my cabinets are damaged or have wood rot?",
        "We'll spot any damage during the quote and tell you honestly. Small dings and scratches we can fill and paint. Significant damage or structural issues might mean replacement makes more sense than refinishing — and we'll tell you that if it's the case.",
      ],
      [
        "Can you change the cabinet color completely?",
        "Absolutely. Going from dark oak to bright white, from natural wood to navy blue, from honey maple to charcoal — we do dramatic color changes every week. Two-tone kitchens (different uppers and lowers) are also popular right now.",
      ],
      [
        "Do you remove the doors and spray them, or paint them in place?",
        "Doors and drawer faces come off and are sprayed in a controlled environment. Cabinet boxes stay in place and are sprayed where they live, with thorough masking and containment to prevent overspray.",
      ],
      [
        "Can you swap out my cabinet hardware too?",
        "Yes, and it is the easiest upgrade you will ever make. While the doors are off, replacing dated hardware with modern pulls or knobs is quick and dramatic. We can pick up hardware for you or use what you have already chosen.",
      ],
      [
        "How much does cabinet painting cost in Charlotte?",
        "Cabinet painting is heavily project-specific — kitchen size, number of doors and drawers, current finish, and color choice all affect price. We do free in-home quotes so you get an accurate number, not a wild guess. Expect cabinet painting to cost 20–30% of the price of new cabinets.",
      ],
      [
        "Is there a warranty?",
        "Yes. Every cabinet project is backed by our written 3-year workmanship warranty.",
      ],
    ],
  },
  {
    title: "Deck Staining & Painting",
    navTitle: "Deck Staining & Painting",
    slug: "deck-staining",
    path: "/deck-staining/",
    icon: "Sun",
    image: "/img/services/deck.webp",
    metaTitle: "Deck Staining & Painting in Charlotte, NC | 593 EC Painting",
    metaDescription:
      "Professional deck staining, sealing, and painting in Charlotte, NC. Protect your outdoor wood from Carolina sun and rain. Family-owned, free quotes, 3-year warranty.",
    heroTitle: "Deck Staining & Painting in Charlotte, NC",
    heroSubtitle:
      "Clean, stain, seal, and restore your outdoor wood. Built to protect against Carolina sun, humidity, and rain.",
    introTitle: "Bring Your Deck Back to Life",
    intro: [
      "A deck is one of the most-used spaces in any Charlotte home — and one of the most weather-beaten. Carolina sun, summer humidity, pollen season, and winter freeze-thaw cycles all take their toll on outdoor wood. Without regular staining and sealing, even a beautifully built deck will gray, warp, splinter, and rot within a few years.",
      "We restore decks across the Charlotte area — cleaning, repairing, staining, and sealing them to look great and hold up to the weather. Whether your deck just needs a refresh or it's been neglected for years, we can bring it back.",
    ],
    featuresTitle: "What's Included in a Deck Project",
    featuresSubtitle: "A full deck restoration covers everything your wood needs.",
    features: ["Deck Cleaning", "Repairs", "Sanding", "Staining", "Sealing", "Painting"],
    featureDetails: [
      {
        title: "Deck Cleaning",
        description:
          "Pressure washing or chemical cleaning to remove dirt, mildew, mold, and old failing finish.",
      },
      {
        title: "Repairs",
        description:
          "Replace rotted or loose boards, secure railings, and fix wobbly stair treads.",
      },
      {
        title: "Sanding",
        description: "Smooth raised grain and rough spots so the stain absorbs evenly.",
      },
      {
        title: "Staining",
        description: "Transparent, semi-transparent, or solid stain in your color of choice.",
      },
      { title: "Sealing", description: "Protective sealer that resists water, UV, and mildew." },
      {
        title: "Painting",
        description:
          "When stain isn't the right answer, we paint decks with products designed for foot-traffic durability.",
      },
    ],
    processTitle: "Our Deck Staining Process",
    processSubtitle: "",
    steps: [
      [
        "Free On-Site Quote",
        "We measure the deck, inspect the wood, talk through colors, and write you a clear estimate.",
      ],
      [
        "Clean & Prep",
        "Pressure wash or chemical clean, depending on what the deck needs. Strip old failing finish if necessary.",
      ],
      [
        "Repair",
        "Replace damaged boards, secure loose railings, and fix any structural issues we find.",
      ],
      ["Sand", "Smooth raised grain and rough patches so stain absorbs evenly."],
      ["Stain & Seal", "Apply stain in your chosen color and finish, then a protective sealer."],
      ["Final Walkthrough", "Walk the deck with you and make sure everything looks right."],
    ],
    extras: [
      [
        "Stain Options",
        [
          strong(
            "Transparent Stain",
            "Shows off the natural wood grain. Best for decks in great shape with beautiful wood. Less UV protection, needs reapplication every 1–2 years.",
          ),
          strong(
            "Semi-Transparent Stain",
            "Adds color while still letting the grain show through. The most popular choice. Lasts 2–3 years in Carolina weather.",
          ),
          strong(
            "Solid Stain",
            "Acts like paint — full color, hides the grain, maximum UV protection. Best for older decks where you want to hide imperfections. Lasts 3–5 years.",
          ),
          strong(
            "Deck Paint",
            "For decks that have already been painted, or where you want a specific color match to the house. Built for foot traffic.",
          ),
        ],
      ],
      [
        "Signs Your Deck Needs Staining",
        [
          p("Not sure if your deck is due? Look for these signs:") +
            ul([
              "Water no longer beads on the surface. The seal has worn off.",
              "Boards look gray or weathered. UV has broken down the previous finish.",
              "Splinters or rough patches. The wood is drying out.",
              "Color is fading or peeling. The old stain or paint is failing.",
              "Mildew or dark spots. The wood is staying damp and needs cleaning and resealing.",
            ]),
          "In Charlotte's climate, most decks need restaining every 2–4 years depending on the previous product, sun exposure, and how much foot traffic they get. South- and west-facing decks fade faster than shaded ones.",
        ],
      ],
    ],
    whyTitle: "Why Choose 593 EC Painting for Your Deck",
    whySubtitle: "",
    whyItems: [
      {
        title: "Family-owned, local",
        description: "We've been staining Carolina decks for 5 years.",
      },
      {
        title: "Real prep work",
        description: "Cleaning, sanding, and repairs done before stain goes on.",
      },
      { title: "Premium stains and sealers", description: "Products chosen for southern weather." },
      {
        title: "Honest assessments",
        description: "If your deck needs replacement instead of restaining, we'll tell you.",
      },
      { title: "3-year warranty", description: "On workmanship." },
      { title: "Clean job site", description: "Plants and patio furniture protected." },
    ],
    galleryTitle: "Recent Deck Projects",
    gallerySubtitle: "Before and after photos from Charlotte-area decks we have restored.",
    ctaHeading: "Ready to Restore Your Deck?",
    ctaBody:
      "Get a free on-site quote for your deck staining or painting project. We'll inspect the wood, talk through options, and write you a clear estimate.",
    faq: [
      [
        "How often should I restain my deck in Charlotte?",
        "Every 2–4 years for most decks in the Carolinas, depending on sun exposure, foot traffic, and the previous stain. Transparent stains need reapplication every 1–2 years; solid stains can last 4–5 years.",
      ],
      [
        "What is the best time of year to stain a deck?",
        "Spring and fall are ideal — moderate temperatures, low humidity, and dry weather. We need 2–3 dry days for a deck project, including 24 hours before and 24 hours after staining.",
      ],
      [
        "Should I stain my deck or paint it?",
        "Stain is usually the better choice for natural wood — it penetrates instead of sitting on top, and it doesn't peel. Paint makes sense for older decks that need to hide imperfections or decks that have been previously painted.",
      ],
      [
        "Can you repair loose boards or railings before staining?",
        "Yes. We inspect the entire deck during the quote and include needed repairs in the estimate. Staining a deck with loose boards is a waste of stain.",
      ],
      [
        "How long until I can walk on my deck after staining?",
        "Usually 24 hours for foot traffic, 48 hours before putting furniture back. We'll give you specific timing based on the stain we use.",
      ],
      ["Do you stain fences too?", "Yes — see our fence staining page for details."],
    ],
  },
  {
    title: "Fence Staining & Painting",
    navTitle: "Fence Staining & Painting",
    slug: "fence-staining",
    path: "/fence-staining/",
    icon: "Fence",
    image: "/img/services/fence.webp",
    metaTitle: "Fence Staining & Painting in Charlotte, NC | 593 EC Painting",
    metaDescription:
      "Professional fence staining and painting in Charlotte, NC. Wood fence restoration, sealing, and color refresh. Family-owned, free quotes, 3-year warranty.",
    heroTitle: "Fence Staining & Painting in Charlotte, NC",
    heroSubtitle:
      "Restore your wood fence and protect it from Carolina weather for years to come. Cleaning, repair, staining, and sealing — done right.",
    introTitle: "Wood Fences That Look Like New Again",
    intro: [
      "A wood fence is one of those things you don't notice until it starts looking bad — and then you can't stop noticing it. Gray, splintered, leaning fences age a whole property. The good news is that most fences don't need replacing; they need cleaning, repairing, and properly staining.",
      "We restore wood fences across the Charlotte area — pressure washing or chemical-cleaning the wood, replacing damaged boards, and staining or painting in a color that complements your home. Done right, a fence restoration adds curb appeal and protects your investment for years.",
    ],
    featuresTitle: "What's Included in a Fence Project",
    featuresSubtitle: "",
    features: [
      "Pressure Washing",
      "Board Replacement",
      "Post & Hardware Check",
      "Sanding",
      "Staining or Painting",
      "Sealing",
    ],
    featureDetails: [
      {
        title: "Pressure Washing",
        description: "Removes years of dirt, mildew, and graying from the wood surface.",
      },
      {
        title: "Board Replacement",
        description: "Swap out broken, rotted, or warped boards before staining.",
      },
      {
        title: "Post & Hardware Check",
        description: "Tighten loose hardware and secure leaning posts where possible.",
      },
      {
        title: "Sanding",
        description: "Smooth rough spots and splinters so the stain absorbs evenly.",
      },
      {
        title: "Staining or Painting",
        description:
          "Apply transparent, semi-transparent, solid stain, or paint in your chosen color.",
      },
      { title: "Sealing", description: "Protective sealer to fight UV, water, and mildew." },
    ],
    processTitle: "Our Fence Staining Process",
    processSubtitle: "",
    steps: [
      [
        "Free On-Site Quote",
        "We measure the fence, inspect the wood, and write you a clear estimate.",
      ],
      ["Pressure Wash & Clean", "Strip dirt, mildew, and graying from the wood."],
      ["Repair", "Replace damaged boards and secure loose hardware."],
      ["Stain or Paint", "Apply your chosen finish, paying attention to coverage and consistency."],
      ["Walkthrough", "Walk the fence line with you to make sure everything looks right."],
    ],
    extras: [
      [
        "Stain or Paint Your Fence?",
        [
          strong(
            "Stain (Recommended for Most Fences)",
            "Penetrates the wood instead of sitting on top. Doesn't peel. Shows or enhances the wood grain. Easier to refresh when the time comes.",
          ),
          strong(
            "Solid Stain",
            "Provides full color coverage like paint, but still penetrates the wood. Best for older fences where you want to hide weathering.",
          ),
          strong(
            "Paint",
            "Best for fences that have already been painted, or where you want a specific color (white picket, bold accent color). Requires more maintenance than stain.",
          ),
        ],
      ],
      [
        "Signs Your Fence Needs Attention",
        [
          p("Most Charlotte-area fences need restaining every 3–5 years. Look for these signs:") +
            ul([
              "Boards turning gray or silver",
              "Stain looking faded or patchy",
              "Mildew or dark spots, especially on shaded sides",
              "Loose, warped, or rotted boards",
              "Visible splintering or rough spots",
            ]),
          "If your fence is more than 10 years old and many boards are rotting or breaking, we'll be honest — sometimes replacement makes more sense than restoration. We'll tell you straight during the quote.",
        ],
      ],
    ],
    whyTitle: "Why Choose 593 EC Painting for Your Fence",
    whySubtitle: "",
    whyItems: [
      {
        title: "Family-owned, local",
        description: "We've stained miles of Carolina fence line.",
      },
      {
        title: "Honest assessments",
        description: "We'll tell you if your fence is worth restoring or not.",
      },
      { title: "Real prep work", description: "Cleaning, sanding, and repairs done right." },
      { title: "Premium stains", description: "Products selected for Carolina weather." },
      { title: "3-year warranty", description: "On workmanship." },
      { title: "Clean job site", description: "Landscaping protected and debris cleaned up." },
    ],
    galleryTitle: "Recent Fence Projects",
    gallerySubtitle: "Charlotte-area fences we have restored.",
    ctaHeading: "Ready to Restore Your Fence?",
    ctaBody: "Get a free on-site quote for your fence staining or painting project.",
    faq: [
      [
        "How often should I restain my fence?",
        "Every 3–5 years for most fences in the Charlotte area, depending on sun exposure, the previous stain, and the wood type.",
      ],
      [
        "Can you stain a brand-new fence?",
        "Yes — but we usually recommend waiting 30–60 days after installation so the wood has time to dry out and weather slightly. Fresh-cut wood doesn't absorb stain evenly.",
      ],
      [
        "What if some of my fence boards are rotted?",
        "We replace damaged boards as part of the project. We'll spot what needs replacing during the quote and include it in the estimate.",
      ],
      [
        "Stain or paint: which is better for a fence?",
        "Stain, for most fences. It penetrates the wood instead of sitting on top, doesn't peel, and looks better as it ages. Paint makes sense if the fence has already been painted or if you want a very specific color.",
      ],
      [
        "Do you do both sides of the fence?",
        "Yes, both sides — assuming both sides are accessible. If a neighbor's fence is on the other side, we'll discuss what's reasonable during the quote.",
      ],
      [
        "How long does a fence project take?",
        "Most residential fences take 1–3 days depending on size and condition. We'll give you a specific timeline in your quote.",
      ],
    ],
  },
];

const galleryImages = [
  {
    url: "/img/gallery/kitchen-cabinets.webp",
    alt: "Cabinet painting in Charlotte NC kitchen",
    caption: "Cabinet Painting",
  },
  {
    url: "/img/gallery/exterior-home.webp",
    alt: "Exterior house painting in Charlotte NC",
    caption: "Exterior Painting",
  },
  {
    url: "/img/gallery/living-room.webp",
    alt: "Interior wall painting in Charlotte NC living room",
    caption: "Interior Painting",
  },
  {
    url: "/img/gallery/front-door.webp",
    alt: "Front door painting in Charlotte NC",
    caption: "Door and Trim Painting",
  },
  {
    url: "/img/gallery/painted-kitchen.webp",
    alt: "Painted kitchen cabinets in Charlotte NC",
    caption: "Cabinet Refinish",
  },
  {
    url: "/img/gallery/covered-porch.webp",
    alt: "Deck staining in Charlotte NC covered porch",
    caption: "Deck Staining",
  },
  {
    url: "/img/gallery/stained-fence.webp",
    alt: "Fence staining in Charlotte NC backyard",
    caption: "Fence Staining",
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
      "We hired 593 EC Painting for exterior painting and deck staining. The house looks refreshed and the process was easy.",
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
];

function serviceAreaBlock() {
  return rich("Proudly Serving Charlotte and the Surrounding Carolinas", [
    "We work throughout the greater Charlotte metro and into the South Carolina border communities. If you're within about 30 miles of Charlotte, we can paint your home.",
    `<strong>Cities we serve:</strong> ${SERVICE_AREA}.`,
  ]);
}

function homeContent() {
  return {
    blocks: [
      hero({
        headline: "Charlotte's Family-Owned House Painters",
        subheadline:
          "Honest pricing, fast communication, and work that lasts. Serving Charlotte and the surrounding Carolinas for 5 years.",
        image: "/img/gallery/exterior-home.webp",
      }),
      block("trust-bar", {
        items: [
          { icon: "Star", label: "5-Star Google Rated" },
          { icon: "Users", label: "Family-Owned & Operated" },
          { icon: "ShieldCheck", label: "3-Year Workmanship Warranty" },
          { icon: "ClipboardCheck", label: "Free On-Site Quotes" },
          { icon: "BadgeCheck", label: "Licensed & Insured" },
          { icon: "MapPin", label: "Serving Charlotte for 5 Years" },
        ],
      }),
      rich("Painting Done Right by People Who Care", [
        "593 EC Painting is run by Esau and Sandra, a husband-and-wife team that has been painting homes across Charlotte and the surrounding Carolinas for 5 years. We started this business because we believed homeowners deserved better — a painter who shows up when they say they will, communicates throughout the project, treats your home with respect, and stands behind every job long after the last brushstroke.",
        "That's still how we work today. When you call 593 EC Painting, you reach Esau or Sandra directly. When we paint your home, we treat it the way we'd treat our own. And if something isn't right, we come back and make it right. That's the difference between hiring a painting crew and hiring a family who paints.",
      ]),
      cards(
        "What We Paint",
        "From a single accent wall to your entire home inside and out, we handle every part of the project — prep, repair, paint, and cleanup.",
        serviceCards,
      ),
      featureList(
        "Why Charlotte Homeowners Choose 593 EC Painting",
        "We're not a national franchise or a faceless crew. We're a local family-owned painting business — and that changes everything about how we work with you.",
        [
          {
            title: "You Talk to the Owner",
            description:
              "Every call, every quote, every project. No call centers, no project managers, no middlemen.",
          },
          {
            title: "Honest, Up-Front Pricing",
            description:
              "Free on-site quotes with no pressure and no surprise add-ons after work begins.",
          },
          {
            title: "Daily Communication",
            description:
              "Text or email updates and photos throughout your project so you always know what's happening.",
          },
          {
            title: "Real Prep Work",
            description:
              "Patching, sanding, caulking, and priming done before paint touches the wall. Skipping prep is why paint fails.",
          },
          {
            title: "3-Year Warranty",
            description:
              "Every interior and exterior paint job is backed by our written 3-year workmanship warranty.",
          },
          {
            title: "Clean Job Site",
            description:
              "Furniture protected, floors covered, daily cleanup. You shouldn't have to clean up after your painter.",
          },
        ],
      ),
      processBlock(
        "How We Work",
        "A simple, transparent process from your first call to the final walkthrough.",
        [
          {
            title: "Free On-Site Quote",
            description:
              "We come out, measure, listen to what you want, and write up a clear, itemized estimate. No pressure.",
          },
          {
            title: "Schedule & Prep",
            description:
              "We agree on a start date and walk through the prep work together — colors, surfaces, repairs, and timing.",
          },
          {
            title: "Paint Day",
            description:
              "Our team arrives on time, protects your home, and paints with care. We text photo updates throughout.",
          },
          {
            title: "Walkthrough & Warranty",
            description:
              "We walk the finished project with you. If anything needs a touch-up, we handle it before we leave.",
          },
        ],
      ),
      galleryBlock(
        "Recent Work in the Charlotte Area",
        "A look at some of the homes we've painted recently across Charlotte and the surrounding communities.",
      ),
      block("testimonials", {
        title: "What Our Customers Say",
        subtitle: "Real reviews from homeowners across Charlotte and the surrounding areas.",
        items: reviews,
        sectionBackgroundColor: "#f4f8fb",
      }),
      serviceAreaBlock(),
      cta(
        "Ready for a Fresh Coat?",
        "Get a free, no-pressure quote from Charlotte's family-owned painters. Most quotes scheduled within 48 hours.",
      ),
    ],
  };
}

function aboutContent() {
  return {
    blocks: [
      hero({
        headline: "Meet the Family Behind 593 EC Painting",
        subheadline:
          "A husband-and-wife team painting Charlotte homes the right way for 5 years and counting.",
        image: "/img/gallery/living-room.webp",
      }),
      rich("Built on Honesty, Care, and Reliability", [
        "593 EC Painting started the way a lot of small businesses start — with one person, a few brushes, and a belief that there was a better way to do things. Esau had spent years learning the craft of painting, and over time he kept hearing the same complaints from homeowners about other painters: crews that didn't show up, quotes that mysteriously grew, work that looked good on day one and started peeling by year two.",
        "So Esau and Sandra decided to build a painting business that solved those problems. One where homeowners could call the owner directly. One where the prep work got done before the paint went on. One where the family who painted your home actually cared whether you'd recommend them to your neighbor.",
        "Five years later, that's still how we run 593 EC Painting. We've painted hundreds of homes across Charlotte and the surrounding Carolinas, and we've built a business almost entirely on referrals and repeat customers — because the work speaks for itself.",
      ]),
      featureList(
        "What You Get When You Hire 593 EC Painting",
        "The differences are small but they add up to a completely different experience than hiring a faceless crew.",
        [
          {
            title: "A real owner-operator relationship",
            description:
              "When you call, you reach Esau or Sandra. No phone trees, no project coordinators, no being handed off.",
          },
          {
            title: "Honest quotes",
            description:
              "We measure carefully, write everything down, and the price we quote is the price you pay. No surprises.",
          },
          {
            title: "Daily updates",
            description:
              "We text photos as we go so you always know what's happening, even if you're at work.",
          },
          {
            title: "Real prep work",
            description:
              "Patching, sanding, caulking, priming. The boring stuff that makes a paint job last.",
          },
          {
            title: "3-year warranty",
            description:
              "Written, in your contract. If the paint fails because of our workmanship, we come back and fix it.",
          },
          {
            title: "We come back for touch-ups",
            description:
              "Months later, even years later. Several of our customers have hired us for second and third projects because of this.",
          },
        ],
      ),
      featureList("593 EC Painting by the Numbers", "", [
        { title: "5 Years", description: "painting Charlotte homes" },
        { title: "Hundreds", description: "of homes painted across the Carolinas" },
        { title: "5-Star", description: "Google rating" },
        { title: "3-Year", description: "workmanship warranty on every job" },
        { title: "100%", description: "family-owned, no franchise, no investors" },
      ]),
      rich("Where We Work", [
        "We serve homeowners across the greater Charlotte metro and into the South Carolina border communities — anywhere within about 30 miles of Charlotte. Whether you're in a 1920s bungalow in Dilworth, a brick colonial in Myers Park, or a new build in Waxhaw, we've painted homes like yours and we'd love to paint yours next.",
        `<strong>Cities we serve:</strong> ${SERVICE_AREA}.`,
      ]),
      cta(
        "Let's Talk About Your Project",
        "Give us a call or request a free quote online. We'll come out, listen to what you have in mind, and write you a clear, honest estimate.",
        "Request a Free Quote",
      ),
    ],
  };
}

function contactContent() {
  return {
    blocks: [
      hero({
        headline: "Get a Free Painting Quote",
        subheadline:
          "Tell us about your project and we'll get back to you within 24 hours — usually faster.",
        image: "/img/gallery/front-door.webp",
        secondary: false,
        primaryText: "",
        primaryLink: "",
      }),
      rich("Request Your Free Quote", [
        "No pressure, no obligation. Most quotes are scheduled within 48 hours.",
      ]),
      block("contact-form", {}),
      block("contact-info", {
        title: "Prefer to Call or Text?",
        items: [
          { icon: "Phone", label: "Phone / Text", value: PHONE_DISPLAY },
          { icon: "Mail", label: "Email", value: EMAIL },
          { icon: "MapPin", label: "Address", value: ADDRESS },
          { icon: "Clock", label: "Hours", value: "Monday–Saturday, 8:00 AM – 6:00 PM" },
        ],
      }),
      rich("Where We Work", [
        "We serve Charlotte and the surrounding Carolinas within about a 30-mile radius. If you're in or near any of these communities, we'd love to quote your project:",
        SERVICE_AREA + ".",
        "Not sure if we cover your area? Just call — if we can't help, we'll point you toward someone who can.",
      ]),
      processBlock(
        "What to Expect After You Reach Out",
        "Here is exactly what happens once you submit a quote request.",
        [
          {
            title: "We respond within 24 hours",
            description: "Usually within a few hours during business days.",
          },
          {
            title: "We schedule a free on-site visit",
            description: "We come out, measure, look at the surfaces, and answer your questions.",
          },
          {
            title: "You get a written quote",
            description: "Itemized, clear, no surprises. The price we quote is the price you pay.",
          },
          {
            title: "You decide on your own timeline",
            description: "No high-pressure sales tactics. Take the time you need.",
          },
        ],
      ),
    ],
  };
}

function galleryContent() {
  return {
    blocks: [
      hero({
        headline: "Recent Painting Projects in the Charlotte Area",
        subheadline: "Real homes. Real before-and-afters. Photographed by our team on the job.",
        image: "/img/gallery/kitchen-cabinets.webp",
      }),
      rich("", [
        "Every photo on this page is a real 593 EC Painting project — no stock images, no Pinterest screenshots. We update this gallery regularly as we complete new work across Charlotte and the surrounding Carolinas. Browse by category or scroll through to see the full range of what we do.",
      ]),
      galleryBlock(
        "Browse Our Work",
        "Filter categories: All • Interior • Exterior • Cabinets • Decks & Fences",
        7,
      ),
      cta(
        "Want Your Home in This Gallery?",
        "Get a free quote and let us add your project to the next batch of before-and-afters.",
      ),
    ],
  };
}

function reviewsContent() {
  return {
    blocks: [
      hero({
        headline: "What Charlotte Homeowners Say About 593 EC Painting",
        subheadline:
          "Real reviews from real customers. We've built this business on word of mouth — here's the word.",
        image: "/img/gallery/living-room.webp",
      }),
      block("stats-bar", {
        items: [
          { icon: "Star", value: "5.0", label: "Google Rating" },
          { icon: "MessageSquare", value: "[REVIEW PLACEHOLDER]", label: "Total Google Reviews" },
          { icon: "ThumbsUp", value: "100%", label: "Would Recommend" },
          { icon: "Calendar", value: "5 Years", label: "Serving Charlotte" },
        ],
      }),
      block("testimonials", {
        title: "Reviews from Our Customers",
        subtitle:
          "Below are real reviews from homeowners across Charlotte and the surrounding Carolinas, pulled directly from our Google Business Profile. We don't curate or filter them — they're the unedited word from people we've painted for.",
        items: reviews,
      }),
      rich("Word of Mouth Built This Business", [
        "We don't spend much on advertising. We've never had to. From the day we started 593 EC Painting, our customers have referred us to their friends, their family, and their neighbors — and that's how we've grown.",
        "If you've worked with us, leaving a Google review is the single most helpful thing you can do to support our family business. It helps us keep our prices fair, our team employed, and our doors open to more Charlotte homeowners who need an honest painter.",
      ]),
      cta(
        "Ready to Join Them?",
        "Get a free quote from Charlotte's most-reviewed family-owned painters.",
      ),
    ],
  };
}

function servicesContent() {
  return {
    blocks: [
      hero({
        headline: "Professional Painting Services",
        subheadline:
          "Interior, exterior, cabinet, deck, and fence painting services built around careful prep and clean results.",
        image: "/img/gallery/exterior-home.webp",
      }),
      cards("", "", [
        {
          title: "Interior Painting",
          description:
            "Flawless finishes for walls, ceilings, trim, and lived-in rooms that need a clean refresh.",
          icon: "PaintBucket",
          link: "/interior-painting/",
        },
        {
          title: "Exterior Painting",
          description:
            "Weather-ready exterior painting that improves curb appeal and protects your home.",
          icon: "Home",
          link: "/exterior-painting/",
        },
        {
          title: "Cabinet Painting",
          description:
            "A smooth cabinet finish that modernizes your kitchen without the cost of replacement.",
          icon: "Layers",
          link: "/cabinet-painting/",
        },
        {
          title: "Deck Staining & Painting",
          description:
            "Restore your deck with stain or paint that helps defend outdoor wood from weather.",
          icon: "Sun",
          link: "/deck-staining/",
        },
        {
          title: "Fence Staining & Painting",
          description:
            "Protect and refresh fences with even stain or paint coverage on exposed wood.",
          icon: "Fence",
          link: "/fence-staining/",
        },
        {
          title: "Get a Quote",
          description:
            "Not sure which service fits? Tell us what you need painted and we will point you in the right direction.",
          link: "/contact/",
          icon: "ClipboardCheck",
        },
      ]),
      featureList(
        "Why Homeowners Across Charlotte Choose 593 EC Painting",
        "A family-owned painting business serving Charlotte and the surrounding Carolinas for 5 years. Same approach to every project, every customer, every time.",
        [
          {
            title: "You Talk to the Owner",
            description:
              "Every call, every quote, every project. No call centers, no project coordinators.",
          },
          {
            title: "Real Prep Work",
            description:
              "Patching, sanding, caulking, priming. The boring steps that make paint actually last.",
          },
          {
            title: "Premium Paints Included",
            description: "Sherwin-Williams and Benjamin Moore as standard, not an upcharge.",
          },
          { title: "3-Year Warranty", description: "Written into your contract on every project." },
          {
            title: "Daily Photo Updates",
            description: "Know what's happening even when you're at work.",
          },
          {
            title: "We Come Back for Touch-Ups",
            description: "Months or years later. That's how we keep customers for life.",
          },
        ],
      ),
      rich("Where We Work", [
        "We serve homeowners across the greater Charlotte metro and into the South Carolina border communities within about 30 miles of Charlotte.",
        `<strong>Cities we serve:</strong> ${SERVICE_AREA}.`,
      ]),
      cta(
        "Ready to Get Started?",
        "Get a free, no-pressure quote from Charlotte's family-owned painters. Most quotes scheduled within 48 hours.",
      ),
    ],
  };
}

function serviceDetailContent(service: (typeof services)[number]) {
  const serviceData = service as (typeof services)[number] & {
    featureDetails?: Array<{ title: string; description: string; icon?: string }>;
    featuresSubtitle?: string;
    processSubtitle?: string;
    whyTitle?: string;
    whySubtitle?: string;
    whyItems?: Array<{ title: string; description: string; icon?: string }>;
    galleryTitle?: string;
    gallerySubtitle?: string;
    ctaHeading?: string;
    ctaBody?: string;
  };
  return {
    blocks: [
      hero({
        headline: service.heroTitle,
        subheadline: service.heroSubtitle,
        image: service.image,
      }),
      rich(service.introTitle, service.intro),
      featureList(
        service.featuresTitle,
        serviceData.featuresSubtitle ??
          "From focused repairs to full project prep, we handle every surface with care.",
        serviceData.featureDetails ??
          service.features.map((title) => ({
            title,
            description: "Included in the project scope when needed.",
          })),
      ),
      processBlock(
        service.processTitle,
        serviceData.processSubtitle ?? "Here is exactly what to expect from quote to walkthrough.",
        service.steps.map(([title, description]) => ({ title, description })),
      ),
      ...service.extras.map((entry) => {
        const title = String(entry[0]);
        const body = entry[1];
        return rich(title, Array.isArray(body) ? body : [String(body)]);
      }),
      featureList(
        serviceData.whyTitle ?? `Why Choose 593 EC Painting for Your ${service.navTitle}`,
        serviceData.whySubtitle ?? "A family-owned painting business with a different approach.",
        serviceData.whyItems ?? [
          {
            title: "You talk to the owner",
            description: "Esau and Sandra answer the phone, write the quote, and oversee the work.",
          },
          { title: "Real prep, every time", description: "We do not skip steps to save time." },
          {
            title: "Premium products",
            description: "Sherwin-Williams and Benjamin Moore are standard.",
          },
          {
            title: "Daily photo updates",
            description: "Know what's happening even when you're at work.",
          },
          { title: "3-year warranty", description: "Written into your contract." },
          { title: "Clean job site", description: "Your home and landscaping are protected." },
        ],
      ),
      galleryBlock(
        serviceData.galleryTitle ?? `Recent ${service.navTitle} Projects`,
        serviceData.gallerySubtitle ??
          "A look at recent work across Charlotte and the surrounding Carolinas.",
      ),
      cta(
        serviceData.ctaHeading ?? `Ready for ${service.navTitle}?`,
        serviceData.ctaBody ??
          "Get a free quote for your project. Most quotes scheduled within 48 hours.",
      ),
      faq(service.faq.map(([question, answer]) => ({ question, answer }))),
    ],
  };
}

function legalContent(title: string, sections: Array<[string, string | string[]]>) {
  return {
    blocks: [
      block("section-header", {
        eyebrow: "",
        title,
        subtitle: `Last updated: ${LAUNCH_DATE}`,
        alignment: "center",
        headingLevel: "h1",
      }),
      ...sections.map(([heading, body]) => rich(heading, Array.isArray(body) ? body : [body])),
    ],
  };
}

function privacyContent() {
  return legalContent("Privacy Policy", [
    [
      "Introduction",
      [
        `${LEGAL_NAME} ("593 EC Painting," "we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect when you visit 593ecpaintingllc.com or request a painting quote, how we use it, who we share it with, and the choices you have.`,
        "By using this website or submitting a quote request, you agree to the practices described in this policy. If you do not agree, please do not use the website or submit information through it.",
      ],
    ],
    [
      "Information We Collect",
      [
        "We collect two general types of information: information you provide to us directly, and information collected automatically when you visit our website.",
        `<strong>Information you provide:</strong><br />When you fill out a quote request form, contact form, or otherwise reach out to us, you may provide:${ul(["Your name", "Phone number", "Email address", "Service address or ZIP code", "Details about your painting project", "Photos you choose to upload", "Consent preferences (for example, whether we may text you)"])}`,
        `<strong>Information collected automatically:</strong><br />When you visit our website, we and our service providers may automatically collect:${ul(["IP address and approximate location", "Browser type and version", "Device type and operating system", "Pages you visit, time spent on the site, and how you arrived (referring URL)", "Cookies and similar tracking technologies (see Cookies section below)"])}`,
        "We do not knowingly collect information from children under 13. If you believe a child has submitted information through our website, please contact us and we will delete it.",
      ],
    ],
    [
      "How We Use Your Information",
      [
        `We use the information we collect to:${ul(["Respond to your quote request or inquiry", "Schedule on-site estimates and project work", "Communicate with you about your project (calls, texts, emails)", "Send you follow-up information or, with your consent, occasional updates", "Improve our website and the services we offer", "Comply with our legal obligations"])}`,
        "We do not sell your personal information to third parties. We do not share your information with marketers for their own promotional use.",
      ],
    ],
    [
      "Who We Share Information With",
      [
        "We share information only as necessary to operate our business and serve you:",
        ul([
          "<strong>Service providers</strong> who help us run the website and business (for example, web hosting providers, form processors, analytics services, scheduling tools, and review platforms)",
          "<strong>Legal and regulatory authorities</strong> when required by law, court order, or to protect our rights",
          "<strong>Successors</strong> in the event of a business sale, merger, or transfer of assets",
        ]),
        "Any third party we share information with is required to protect that information consistent with this policy.",
      ],
    ],
    [
      "Cookies and Tracking Technologies",
      [
        "Our website uses cookies and similar technologies to remember your preferences, understand how visitors use the site, and improve performance.",
        `We use:${ul(["<strong>Essential cookies</strong> — required for the website to function properly", "<strong>Analytics cookies</strong> — Google Analytics, which helps us understand how visitors use the site (this data is anonymized and aggregated)", "<strong>Reviews widget cookies</strong> — our Google Reviews widget may set cookies to display live reviews"])}`,
        "You can control or disable cookies through your browser settings. Disabling certain cookies may affect how parts of the website work for you.",
      ],
    ],
    [
      "SMS / Text Messaging",
      "If you opt in to receive text messages from us (by checking the consent box on a form or by texting us directly), we may send you texts related to your project — quote follow-ups, scheduling updates, and photo updates during the work. Message and data rates may apply. Message frequency varies based on your project. You can opt out of text messages at any time by replying STOP. For help, reply HELP. We will never share your phone number with third parties for marketing purposes.",
    ],
    [
      "Data Security",
      [
        "We take reasonable steps to protect the information you share with us, including secure form submission, encrypted website connections (HTTPS), and limiting access to personal information to the people who need it to run our business.",
        "No method of transmitting or storing information over the internet is 100% secure. While we work to protect your information, we cannot guarantee absolute security.",
      ],
    ],
    [
      "Your Choices and Rights",
      [
        `You have the right to:${ul(["Request a copy of the personal information we hold about you", "Ask us to correct inaccurate information", "Ask us to delete your information (subject to any legal requirements we must follow)", "Opt out of marketing communications at any time", "Opt out of text messages by replying STOP"])}`,
        "To exercise any of these rights, contact us at the information below. We will respond within a reasonable time, typically within 30 days.",
      ],
    ],
    [
      "Third-Party Links",
      "Our website may contain links to third-party websites such as Google Maps, social media pages, or paint manufacturer websites. We are not responsible for the privacy practices of those websites.",
    ],
    [
      "Changes to This Policy",
      'We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of the page. For significant changes, we may also notify you on the website or by email. We encourage you to review this policy occasionally.',
    ],
    [
      "Contact Us",
      `${LEGAL_NAME}<br />${ADDRESS}<br />Phone: ${PHONE_DISPLAY}<br />Email: ${EMAIL}`,
    ],
  ]);
}

function termsContent() {
  return legalContent("Terms of Service", [
    [
      "Agreement to Terms",
      [
        `These Terms of Service ("Terms") govern your use of the 593ecpaintingllc.com website (the "Website") operated by ${LEGAL_NAME} ("593 EC Painting," "we," "us," or "our"), and any quotes, estimates, or painting services you request through this Website or directly from us.`,
        "By using this Website or requesting a quote, you agree to be bound by these Terms. If you do not agree, please do not use the Website.",
      ],
    ],
    [
      "Painting Services",
      [
        "593 EC Painting provides residential painting and related services in Charlotte, NC and the surrounding Carolinas. Specific services include interior painting, exterior painting, cabinet painting, deck and fence staining and painting, pressure washing, popcorn ceiling removal, wallpaper removal, and drywall repair.",
        "All painting services are subject to a separate written estimate and service agreement signed between you and 593 EC Painting before work begins. The terms of that signed agreement — not this Website's content — govern the actual scope, price, timeline, and warranty of your project. If anything on the Website conflicts with your signed agreement, your signed agreement controls.",
      ],
    ],
    [
      "Quotes and Estimates",
      [
        "Quote requests submitted through our Website do not create a contract. A quote is only binding after we have conducted an on-site visit, provided you with a written estimate, and both parties have signed an agreement.",
        "All estimates are valid for 30 days from the date issued unless otherwise stated. Prices may change if the scope of work changes, if hidden conditions are discovered (such as wood rot or extensive prep work), or if material costs change significantly.",
      ],
    ],
    [
      "Workmanship Warranty",
      [
        "593 EC Painting provides a 3-year workmanship warranty on our painting services, subject to the terms of your signed service agreement.",
        `The warranty covers:${ul(["Peeling, blistering, or adhesion failures caused by our application or prep work", "Workmanship defects in our painting"])}`,
        `The warranty does not cover:${ul(["Damage from storms, impact, settling, structural movement, or other causes outside our control", "Normal wear and tear", "Surfaces or substrates that fail due to underlying conditions we identified and disclosed at the time of the estimate", "Color fading from UV exposure (a normal characteristic of paint, not a defect)", "Work performed by other contractors or by the homeowner after our project is complete"])}`,
        "To make a warranty claim, contact us at (774) 329-7109 or via the contact form. We will inspect the issue and, if covered, repair it at no charge.",
      ],
    ],
    [
      "Payment",
      [
        "Payment terms for painting services are set in your signed service agreement. We typically require a deposit before work begins and final payment on completion. We accept cash, check, and standard electronic payment methods.",
        "Past-due balances may be subject to reasonable late fees and collection costs as permitted by North Carolina law.",
      ],
    ],
    [
      "Website Use",
      [
        "You may use the Website for personal, non-commercial purposes related to learning about or hiring 593 EC Painting.",
        `You agree not to:${ul(["Use the Website for any unlawful purpose", "Attempt to gain unauthorized access to any part of the Website or its underlying systems", "Submit false, misleading, or fraudulent information through any form", "Scrape, copy, or reproduce Website content for commercial use without our written permission", "Upload content that infringes anyone else's rights or violates the law"])}`,
        "We reserve the right to refuse service, terminate accounts, or remove content at our discretion.",
      ],
    ],
    [
      "Intellectual Property",
      "All website content, including text, photos, graphics, logos, and design, is owned by 593 EC Painting LLC or used with permission and is protected by copyright and trademark law. Project photos are used with homeowner permission where available. If you are a homeowner featured in our gallery and want a photo removed, contact us and we will remove it promptly.",
    ],
    [
      "Limitation of Liability",
      [
        'The Website is provided "as is" without warranties of any kind, express or implied. We make reasonable efforts to keep Website content accurate and up to date, but we do not guarantee accuracy, completeness, or availability.',
        "To the maximum extent permitted by law, 593 EC Painting and its owners, employees, and contractors are not liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Website or our services. Our total liability for any claim related to the Website is limited to $100.",
        "This limitation does not apply to our painting services, which are governed by your signed service agreement and the workmanship warranty described above.",
      ],
    ],
    [
      "Third-Party Links and Services",
      "The website may contain links to third-party websites or include third-party services such as Google Maps, Google Reviews widgets, or social media links. We are not responsible for those third parties' content, policies, or practices.",
    ],
    [
      "Governing Law and Disputes",
      [
        "These Terms are governed by the laws of the State of North Carolina, without regard to its conflict-of-laws principles. Any dispute arising from these Terms or your use of the Website will be resolved in the state or federal courts located in Mecklenburg County, North Carolina, and you consent to the personal jurisdiction of those courts.",
        "We encourage you to contact us first to try to resolve any concerns before filing a formal dispute. Most issues can be resolved with a phone call.",
      ],
    ],
    [
      "Changes to These Terms",
      "We may update these Terms from time to time. Continued use of the website after changes are posted means you accept the updated Terms.",
    ],
    [
      "Contact Us",
      `${LEGAL_NAME}<br />${ADDRESS}<br />Phone: ${PHONE_DISPLAY}<br />Email: ${EMAIL}`,
    ],
  ]);
}

function disclaimerContent() {
  return legalContent("Disclaimer", [
    [
      "General Disclaimer",
      [
        'The information provided on 593ecpaintingllc.com (the "Website") is for general informational purposes only. While we make every effort to keep information accurate and up to date, 593 EC Painting LLC makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the Website or its content.',
        "Any reliance you place on Website information is strictly at your own risk.",
      ],
    ],
    [
      "Not Professional Advice",
      [
        "The content on this Website — including service descriptions, blog posts, FAQs, and process explanations — is not intended as professional advice for your specific project. Every home, every surface, and every project is different.",
        "For an accurate assessment of your specific painting needs, please request a free on-site quote. Our on-site evaluation considers the actual condition of your surfaces, your project goals, and your timeline — none of which can be fully evaluated through general Website content.",
      ],
    ],
    [
      "Pricing and Estimates",
      [
        "Any general pricing information or cost ranges referenced on this Website are illustrative only and do not constitute a quote, estimate, or offer. Actual project costs depend on many factors including the size of the project, the condition of the surfaces, the paint and materials selected, prep work required, and accessibility.",
        "A binding price for your project is provided only after we conduct an on-site visit and provide you with a written estimate.",
      ],
    ],
    [
      "Photos and Project Examples",
      [
        "Photos shown on this Website represent actual completed projects by 593 EC Painting, used with the homeowner's permission. Results in your home may vary depending on the original condition of the surfaces, the materials selected, lighting conditions, and other factors specific to your project.",
        "Before-and-after photos are intended to give you a sense of the type of work we do — not to guarantee identical results in every home.",
      ],
    ],
    [
      "Reviews and Testimonials",
      "Reviews displayed on this Website are pulled directly from our verified Google Business Profile and reflect the genuine opinions of past customers. Your experience may differ. Reviews are presented as written by the customer; we do not edit or filter their content.",
    ],
    [
      "Third-Party Content and Links",
      "This website may reference or link to third-party content, products, or services such as Sherwin-Williams, Benjamin Moore, Google, or social platforms. These references are informational and do not create an endorsement, partnership, or warranty of those third parties.",
    ],
    [
      "Color Accuracy",
      "Paint colors shown on this website may not appear exactly as they will on your walls. Color appearance varies by screen settings, lighting, surface, and sheen. Before committing to a color, test a sample on your actual surface and view it in different lighting conditions.",
    ],
    [
      "Warranty and Service Information",
      "General information about our 3-year workmanship warranty is provided on this Website for informational purposes. The specific terms, coverage, exclusions, and limitations of the warranty for your project are set in your signed service agreement and the warranty document provided to you at the start of your project. If anything on this Website conflicts with your signed agreement or warranty document, your signed documents control.",
    ],
    [
      "Service Area",
      "593 EC Painting primarily serves Charlotte, NC and surrounding communities within approximately a 30-mile radius. Cities listed on this Website as part of our service area are typical — we may decline projects outside this area or at our discretion, and inclusion of a city does not guarantee availability for every project. If you are unsure whether we serve your area, please contact us before requesting a quote.",
    ],
    [
      "Changes to This Disclaimer",
      "We may update this Disclaimer from time to time. Continued use of the website after changes are posted means you accept the updated Disclaimer.",
    ],
    [
      "Contact Us",
      `${LEGAL_NAME}<br />${ADDRESS}<br />Phone: ${PHONE_DISPLAY}<br />Email: ${EMAIL}`,
    ],
  ]);
}

function thankYouContent() {
  return {
    blocks: [
      block("section-header", {
        eyebrow: "",
        title: "Thanks — We Got Your Request",
        subtitle:
          "A real human (probably Esau or Sandra) will be in touch within 24 hours — usually sooner.",
        alignment: "center",
        headingLevel: "h1",
      }),
      block("callout-box", {
        title: "Your quote request has been received.",
        content: p(
          "We'll review the details and reach out within 24 hours — most often the same business day. If you submitted on a weekend or holiday, we'll be in touch first thing the next business day.",
        ),
        variant: "success",
      }),
      processBlock("What Happens Next", "Here is exactly what you can expect from here.", [
        {
          title: "We review your request",
          description:
            "Esau and Sandra personally review every quote request that comes in. We look at the service you're interested in, the photos you uploaded (if any), and the details you shared.",
        },
        {
          title: "We reach out to schedule a visit",
          description:
            "A quick call or text to confirm your information and pick a time that works for an on-site visit. Most quotes are scheduled within 48 hours.",
        },
        {
          title: "We visit and write your quote",
          description:
            "We come out, measure, look at the surfaces, talk through colors and finishes, and write you a clear written estimate.",
        },
        {
          title: "You decide on your own timeline",
          description: "No high-pressure sales tactics. Take the time you need to think it over.",
        },
      ]),
      cards("While You Wait", "A few ways to get to know us a little better before we connect.", [
        {
          title: "See Our Recent Work",
          description: "Browse before-and-after photos from real Charlotte projects.",
          link: "/gallery/",
          icon: "Image",
        },
        {
          title: "Read Our Reviews",
          description: "Real reviews from Charlotte homeowners we've painted for.",
          link: "/reviews/",
          icon: "Star",
        },
        {
          title: "Meet the Family",
          description: "Learn more about Esau, Sandra, and the way we run 593 EC Painting.",
          link: "/about/",
          icon: "Users",
        },
        {
          title: "Explore Our Services",
          description: "See everything we do — interior, exterior, cabinets, decks, and fences.",
          link: "/services/",
          icon: "PaintBucket",
        },
      ]),
      cta(
        "Need to Reach Us Sooner?",
        "If your project is time-sensitive or you'd rather just talk, we're happy to pick up the phone.",
        `Call ${PHONE_DISPLAY}`,
        true,
        PHONE_TEL,
        "Text Us",
        "sms:7743297109",
      ),
    ],
  };
}

function notFoundContent() {
  return {
    blocks: [
      block("section-header", {
        eyebrow: "",
        title: "This Page Took a Coffee Break",
        subtitle:
          "The page you're looking for can't be found — but we're still here, and we'd love to help you find what you need.",
        alignment: "center",
        headingLevel: "h1",
      }),
      cards("Maybe You Were Looking For…", "A quick list of the most-visited pages on our site.", [
        {
          title: "Our Painting Services",
          description: "See everything we paint.",
          link: "/services/",
          icon: "PaintBucket",
        },
        {
          title: "Recent Project Gallery",
          description: "Real before-and-after photos.",
          link: "/gallery/",
          icon: "Image",
        },
        {
          title: "Customer Reviews",
          description: "What Charlotte homeowners say about us.",
          link: "/reviews/",
          icon: "Star",
        },
        {
          title: "About 593 EC Painting",
          description: "Meet the family behind the business.",
          link: "/about/",
          icon: "Users",
        },
        {
          title: "Get a Free Quote",
          description: "Tell us about your project.",
          link: "/contact/",
          icon: "ClipboardCheck",
        },
        { title: "Call or Text Us", description: PHONE_DISPLAY, link: PHONE_TEL, icon: "Phone" },
      ]),
      cta(
        "Still Can't Find What You're Looking For?",
        "Just give us a call. We answer most calls the same day, and we're happy to point you in the right direction.",
        `Call ${PHONE_DISPLAY}`,
        true,
        PHONE_TEL,
        "Get a Free Quote",
        "/contact/",
      ),
    ],
  };
}

function sitemapContent() {
  return {
    blocks: [
      block("section-header", {
        eyebrow: "",
        title: "Sitemap",
        subtitle: "A complete index of every page on 593ecpaintingllc.com.",
        alignment: "center",
        headingLevel: "h1",
      }),
      rich("", [
        "This sitemap is a complete list of every page on our website, organized by section. If you're looking for something specific or just want to browse, this is the fastest way to find it.",
      ]),
      cards("Main Pages", "", [
        { title: "Home", description: "Welcome to 593 EC Painting.", link: "/", icon: "Home" },
        {
          title: "About",
          description: "Meet Esau, Sandra, and the family behind the business.",
          link: "/about/",
          icon: "Users",
        },
        {
          title: "Contact",
          description: "Request a free quote or get in touch.",
          link: "/contact/",
          icon: "Phone",
        },
        {
          title: "Gallery",
          description: "Before-and-after photos of recent projects.",
          link: "/gallery/",
          icon: "Image",
        },
        {
          title: "Reviews",
          description: "Real reviews from Charlotte homeowners.",
          link: "/reviews/",
          icon: "Star",
        },
      ]),
      cards("Painting Services", "", [
        {
          title: "All Services",
          description: "Overview of every painting service we offer.",
          link: "/services/",
          icon: "PaintBucket",
        },
        {
          title: "Interior Painting",
          description: "Walls, ceilings, trim, popcorn removal, wallpaper, drywall repair.",
          link: "/interior-painting/",
          icon: "PaintBucket",
        },
        {
          title: "Exterior Painting",
          description: "Siding, brick, stucco, trim, pressure washing.",
          link: "/exterior-painting/",
          icon: "Home",
        },
        {
          title: "Cabinet Painting",
          description: "Kitchen and bathroom cabinet refinishing.",
          link: "/cabinet-painting/",
          icon: "Layers",
        },
        {
          title: "Deck Staining & Painting",
          description: "Deck restoration, cleaning, staining, sealing.",
          link: "/deck-staining/",
          icon: "Sun",
        },
        {
          title: "Fence Staining & Painting",
          description: "Wood fence cleaning, staining, and painting.",
          link: "/fence-staining/",
          icon: "Fence",
        },
      ]),
      cards("Legal", "", [
        {
          title: "Privacy Policy",
          description: "How we handle your information.",
          link: "/privacy-policy/",
          icon: "ShieldCheck",
        },
        {
          title: "Terms of Service",
          description: "Terms governing use of our website and services.",
          link: "/terms-of-service/",
          icon: "FileText",
        },
        {
          title: "Disclaimer",
          description: "Important disclaimers about website content.",
          link: "/disclaimer/",
          icon: "AlertCircle",
        },
      ]),
      rich("Contact Information", [
        `${LEGAL_NAME}<br />${ADDRESS}<br />Phone: ${PHONE_DISPLAY}<br />Hours: Monday–Saturday, 8:00 AM – 6:00 PM`,
      ]),
      rich("Service Area", [
        "We serve homeowners within approximately a 30-mile radius of Charlotte. Cities we serve include:",
        SERVICE_AREA + ".",
      ]),
      cta(
        "Ready to Get Started?",
        "Get a free, no-pressure quote from Charlotte's family-owned painters.",
      ),
    ],
  };
}

type PageSpec = {
  title: string;
  slug: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  content: Record<string, unknown>;
  noindex?: boolean;
};

function allPageSpecs(): PageSpec[] {
  return [
    {
      title: "Home",
      slug: "home",
      path: "/",
      metaTitle: "593 EC Painting | Charlotte's Family-Owned House Painters",
      metaDescription:
        "Family-owned house painters serving Charlotte, NC and surrounding areas. Interior, exterior, cabinets, decks, and fences. Honest pricing, free quotes, work guaranteed.",
      content: homeContent(),
    },
    {
      title: "About",
      slug: "about",
      path: "/about/",
      metaTitle: "About 593 EC Painting | Family-Owned Charlotte Painters",
      metaDescription:
        "Meet Esau and Sandra, the husband-and-wife team behind 593 EC Painting. 5 years of painting homes across Charlotte, NC and the surrounding Carolinas.",
      content: aboutContent(),
    },
    {
      title: "Contact",
      slug: "contact",
      path: "/contact/",
      metaTitle: "Contact 593 EC Painting | Free Quotes in Charlotte, NC",
      metaDescription:
        "Request a free painting quote from 593 EC Painting. Family-owned house painters serving Charlotte, NC and surrounding areas. Call (774) 329-7109 or request online.",
      content: contactContent(),
    },
    {
      title: "Gallery",
      slug: "gallery",
      path: "/gallery/",
      metaTitle: "Painting Gallery | 593 EC Painting Charlotte, NC",
      metaDescription:
        "Before and after photos of recent painting projects across Charlotte, NC. Interior, exterior, cabinets, decks, and fences by 593 EC Painting.",
      content: galleryContent(),
    },
    {
      title: "Reviews",
      slug: "reviews",
      path: "/reviews/",
      metaTitle: "Reviews | 593 EC Painting Charlotte, NC",
      metaDescription:
        "See what Charlotte homeowners say about 593 EC Painting. Read real Google reviews from interior, exterior, and cabinet painting customers across the Carolinas.",
      content: reviewsContent(),
    },
    {
      title: "Services",
      slug: "services",
      path: "/services/",
      metaTitle: "Painting Services in Charlotte, NC | 593 EC Painting",
      metaDescription:
        "Interior, exterior, cabinet, deck, and fence painting services across Charlotte, NC and the surrounding Carolinas. Family-owned, free quotes, 3-year warranty.",
      content: servicesContent(),
    },
    ...services.map((service) => ({
      title: service.title,
      slug: service.slug,
      path: service.path,
      metaTitle: service.metaTitle,
      metaDescription: service.metaDescription,
      content: serviceDetailContent(service),
    })),
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      path: "/privacy-policy/",
      metaTitle: "Privacy Policy | 593 EC Painting",
      metaDescription:
        "How 593 EC Painting collects, uses, and protects your information when you visit our website or request a painting quote.",
      content: privacyContent(),
    },
    {
      title: "Terms of Service",
      slug: "terms-of-service",
      path: "/terms-of-service/",
      metaTitle: "Terms of Service | 593 EC Painting",
      metaDescription:
        "Terms of service for 593 EC Painting LLC, governing use of our website and painting services in Charlotte, NC and the surrounding Carolinas.",
      content: termsContent(),
    },
    {
      title: "Disclaimer",
      slug: "disclaimer",
      path: "/disclaimer/",
      metaTitle: "Disclaimer | 593 EC Painting",
      metaDescription:
        "Important disclaimers regarding the information, photos, pricing guidance, and content on the 593 EC Painting website.",
      content: disclaimerContent(),
    },
    {
      title: "Thank You",
      slug: "thank-you",
      path: "/thank-you/",
      metaTitle: "Thank You | 593 EC Painting",
      metaDescription:
        "Thank you for requesting a painting quote from 593 EC Painting. We'll be in touch within 24 hours.",
      content: thankYouContent(),
      noindex: true,
    },
    {
      title: "404 Page Not Found",
      slug: "404",
      path: "/404/",
      metaTitle: "Page Not Found | 593 EC Painting",
      metaDescription:
        "The page you're looking for can't be found. Let's get you back on track — explore our painting services or get a free quote.",
      content: notFoundContent(),
      noindex: true,
    },
    {
      title: "Sitemap",
      slug: "sitemap",
      path: "/sitemap/",
      metaTitle: "Sitemap | 593 EC Painting",
      metaDescription:
        "Complete sitemap of the 593 EC Painting website. Browse every page including services, gallery, reviews, and contact information.",
      content: sitemapContent(),
    },
  ];
}

async function upsertPage(data: InsertCmsPage) {
  const existing = await storage.cmsPages.getPageBySlug(data.slug);
  if (existing) {
    await storage.cmsPages.updatePage(existing.id, data);
    return;
  }
  await storage.cmsPages.createPage(data);
}

function page(spec: PageSpec): InsertCmsPage {
  return {
    title: spec.title,
    slug: spec.slug,
    pageType: "custom",
    template: "full-width",
    status: "published",
    content: spec.content,
    seoTitle: spec.metaTitle,
    seoDescription: spec.metaDescription,
    seoKeywords: "",
    ogImageUrl: OG_IMAGE_URL,
    canonicalUrl: `${SITE_URL}${spec.path === "/" ? "" : spec.path}`,
    noindex: spec.noindex ?? false,
    publishedAt: new Date(),
    scheduledAt: null,
    createdBy: null,
    updatedBy: null,
    sidebarId: null,
  };
}

async function seedPages() {
  for (const spec of allPageSpecs()) {
    await upsertPage(page(spec));
  }
  const obsoleteSlugs = [
    "commercial-painting",
    "kitchen-cabinet-painting",
    "join",
    "events",
    "recordings",
    "insights",
    "directory",
  ];
  for (const slug of obsoleteSlugs) {
    const obsoletePage = await storage.cmsPages.getPageBySlug(slug);
    if (obsoletePage) await storage.cmsPages.deletePage(obsoletePage.id);
  }
}

async function upsertMenu(data: InsertCmsMenu & { location: StandardMenuLocation }) {
  const existing = await storage.cmsMenus.getByLocation(data.location);
  if (existing) {
    await storage.cmsMenus.update(existing.id, data);
    return;
  }
  await storage.cmsMenus.create(data);
}

async function seedMenus() {
  const serviceItems = services.map((service) => item(service.navTitle, service.path));
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
  await upsertMenu({ name: "Services", location: "footer_platform", items: serviceItems });
  await upsertMenu({
    name: "Company",
    location: "footer_professionals",
    items: [
      item("About", "/about"),
      item("Gallery", "/gallery"),
      item("Reviews", "/reviews"),
      item("Contact", "/contact"),
    ],
  });
  await upsertMenu({
    name: "Service Area",
    location: "footer_resources",
    items: [
      item("Charlotte", "/contact"),
      item("Matthews", "/contact"),
      item("Mint Hill", "/contact"),
      item("Fort Mill", "/contact"),
      item("Rock Hill", "/contact"),
    ],
  });
  await upsertMenu({
    name: "Connect",
    location: "footer_company",
    items: [
      item("Facebook", FACEBOOK_URL),
      item("Instagram", INSTAGRAM_URL),
      item("Google Reviews", GOOGLE_BUSINESS_URL),
    ],
  });
  await upsertMenu({
    name: "Legal",
    location: "footer_legal",
    items: [
      item("Privacy Policy", "/privacy-policy"),
      item("Terms of Service", "/terms-of-service"),
      item("Disclaimer", "/disclaimer"),
      item("Sitemap", "/sitemap"),
    ],
  });
}

async function seedSettings() {
  await storage.seoSettings.upsert({
    siteName: BRAND_NAME,
    titleSuffix: ` | ${BRAND_NAME}`,
    defaultMetaDescription:
      "Family-owned house painters serving Charlotte, NC and surrounding areas. Interior, exterior, cabinets, decks, and fences.",
    siteUrl: SITE_URL,
    defaultOgImageUrl: OG_IMAGE_URL,
    organizationName: BRAND_NAME,
    organizationLogoUrl: LOGO_URL,
    facebookUrl: FACEBOOK_URL,
    instagramUrl: INSTAGRAM_URL,
    defaultRobotsNoindex: false,
    customRobotsTxt: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  });

  const branding: Array<[string, string]> = [
    ["company_name", BRAND_NAME],
    ["company_address", ADDRESS],
    ["company_phone_numbers", PHONE_DISPLAY],
    ["company_google_business_url", GOOGLE_BUSINESS_URL],
    ["frontend_logo_url", LOGO_URL],
    ["favicon_url", FAVICON_URL],
    ["frontend_body_font", "open-sans"],
    ["frontend_heading_font", "montserrat"],
    ["brand_primary_color", "#0A83A5"],
    ["brand_secondary_color", "#F3F7FA"],
    ["brand_tertiary_color", "#0F5F7A"],
    ["brand_quaternary_color", "#021824"],
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
  for (const [key, value] of branding)
    await storage.settings.upsertSetting(key, value, "branding", false);

  const features: Array<[string, string]> = [
    ["enable_directory", "false"],
    ["enable_blog", "false"],
    ["enable_events", "false"],
    ["enable_crm", "true"],
  ];
  for (const [key, value] of features)
    await storage.settings.upsertSetting(key, value, "system_configuration", false);
}

async function main() {
  await seedPages();
  await seedMenus();
  await seedSettings();
  console.log("Seeded 593 EC Painting public CMS pages, menus, branding, and SEO settings.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
