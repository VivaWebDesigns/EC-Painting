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
const SERVICE_AREA = "Charlotte, Matthews, Mint Hill, Monroe, Pineville, Huntersville, Cornelius, Davidson, Concord, Tega Cay, Waxhaw, Indian Trail, Stallings, Fort Mill, Indian Land, Rock Hill, and surrounding areas";

function id() {
  return randomUUID();
}

function block(type: string, props: Record<string, unknown>) {
  return { id: id(), type, props: { isActive: true, ...props } };
}

function item(label: string, url: string, children: MenuItem[] = []): MenuItem {
  return { id: id(), label, url, openInNewTab: url.startsWith("http") || url.startsWith("tel:") || url.startsWith("sms:"), children };
}

function p(text: string) {
  return `<p>${text}</p>`;
}

function rich(title: string, paragraphs: string[] | string, extra: Record<string, unknown> = {}) {
  const content = Array.isArray(paragraphs) ? paragraphs.map(p).join("") : paragraphs;
  return block("rich-text", { title, content, alignment: "left", ...extra });
}

function featureList(title: string, subtitle: string, features: Array<{ title: string; description: string; icon?: string }>, extra: Record<string, unknown> = {}) {
  return block("feature-list", { title, subtitle, columns: "3", features: features.map((feature) => ({ icon: feature.icon || "CheckCircle", ...feature })), ...extra });
}

function cards(title: string, subtitle: string, cardItems: Array<{ title: string; description: string; icon?: string; link?: string }>, extra: Record<string, unknown> = {}) {
  return block("cards-grid", { title, subtitle, columns: "3", cards: cardItems.map((card) => ({ icon: card.icon || "PaintBucket", ...card })), ...extra });
}

function processBlock(title: string, subtitle: string, steps: Array<{ title: string; description: string }>) {
  return block("delivery-setup", { title, subtitle, steps: steps.map((step, index) => ({ step: String(index + 1), ...step })) });
}

function cta(heading: string, subheading: string, primaryText = "Get a Free Quote", secondary = true) {
  const isCall = primaryText.toLowerCase().includes("call");
  return block("cta", {
    heading,
    subheading,
    primaryText,
    primaryAction: isCall ? "external-link" : "internal-link",
    primaryLink: isCall ? PHONE_TEL : "/contact",
    secondaryText: secondary ? `Call ${PHONE_DISPLAY}` : "",
    secondaryAction: "external-link",
    secondaryLink: PHONE_TEL,
    variant: "dark",
  });
}

function hero({ headline, subheadline, image, secondary = true }: { headline: string; subheadline: string; image?: string; secondary?: boolean }) {
  return block("hero", {
    heading: headline,
    subheading: `<p>${subheadline}</p>`,
    ctaText: "Get a Free Quote",
    ctaAction: "internal-link",
    ctaLink: "/contact",
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
  return block("image-grid", { title, subtitle, columns: "3", gap: "md", images: galleryImages.slice(0, limit) });
}

const serviceCards = [
  { title: "Interior Painting", description: "Walls, ceilings, trim, doors, and full home repaints.", icon: "PaintBucket", link: "/interior-painting" },
  { title: "Exterior Painting", description: "Siding, brick, stucco, trim, and full exterior repaints.", icon: "Home", link: "/exterior-painting" },
  { title: "Cabinet Painting", description: "Kitchen and bathroom cabinet refinishing without the cost of replacement.", icon: "Layers", link: "/cabinet-painting" },
  { title: "Deck Staining & Painting", description: "Cleaning, staining, sealing, and restoring outdoor wood.", icon: "Sun", link: "/deck-staining" },
  { title: "Fence Staining & Painting", description: "Protect and refresh wood fences for years of curb appeal.", icon: "Fence", link: "/fence-staining" },
];

const services = [
  {
    title: "Interior Painting",
    navTitle: "Interior Painting",
    slug: "interior-painting",
    path: "/interior-painting",
    icon: "PaintBucket",
    image: "/img/services/interior.webp",
    metaTitle: "Interior House Painters in Charlotte, NC | 593 EC Painting",
    metaDescription: "Family-owned interior painters serving Charlotte, NC. Walls, ceilings, trim, popcorn ceiling removal, wallpaper removal, and drywall repair. Free quotes, 3-year warranty.",
    heroTitle: "Interior House Painters in Charlotte, NC",
    heroSubtitle: "Walls, ceilings, trim, and everything in between. Backed by a 3-year warranty and painted by people who actually care about the result.",
    introTitle: "Interior Painting Done Right",
    intro: [
      "A great interior paint job is not just about the color you pick. It is about clean lines, even coverage, properly prepped walls, smooth ceilings, and trim that looks crisp instead of sloppy.",
      "593 EC Painting has been painting interiors across Charlotte for 5 years, and we treat every home we walk into the way we would want a painter to treat ours: with care, communication, and craftsmanship from the first wall to the final touch-up.",
    ],
    featuresTitle: "What We Paint Inside Your Home",
    features: ["Walls", "Ceilings", "Trim & Baseboards", "Doors & Door Frames", "Window Trim", "Staircases & Railings", "Built-Ins & Bookshelves"],
    processTitle: "Our Interior Painting Process",
    steps: [
      ["Free On-Site Quote", "We measure, talk through colors and finishes, and write a clear estimate."],
      ["Prep & Protect", "We move or cover furniture, mask trim, cover floors, and patch holes and cracks."],
      ["Prime & Repair", "We prime stains, water marks, and patches so the finish coat lays evenly."],
      ["Paint", "Two coats of premium paint applied with care. We do not cut corners on coverage."],
      ["Walkthrough", "We walk every room with you, touch up anything you spot, and leave only when you are happy."],
    ],
    extras: [
      ["Popcorn Ceiling Removal", "Popcorn ceilings make a house feel dated quickly. We handle containment, scraping, skim coating, sanding, priming, and painting the smooth ceiling underneath. If your home was built before 1980, we recommend asbestos testing before work begins."],
      ["Wallpaper Removal", "We remove wallpaper the right way: steam, scrape, clean adhesive residue, repair drywall damage, prime, and paint so you would never know wallpaper was there."],
      ["Drywall Repair", "Cracks, holes, water stains, dents, doorknob damage, and settling cracks get fixed before we paint. We patch, tape, mud, sand, prime, and texture-match so repairs blend into the surrounding wall."],
    ],
    faq: [
      ["How long does interior painting take?", "Most single rooms take 1-2 days and most full-house interiors take 4-7 days depending on scope. We give you a clear timeline in your written quote."],
      ["Do I need to move my furniture?", "No. We move and cover furniture as part of the job."],
      ["What paint brands do you use?", "We use Sherwin-Williams and Benjamin Moore on most interior projects and include premium paints as standard."],
      ["Can you help me pick colors?", "Yes. We can walk through your home, look at lighting and finishes, and help you choose colors that work."],
      ["Do you paint ceilings and trim?", "Yes. We paint walls, ceilings, trim, baseboards, doors, crown molding, window casings, and built-ins."],
      ["What if I notice a missed spot after you leave?", "Call or text us and we will come back. Our 3-year workmanship warranty covers workmanship issues."],
      ["Is the paint smell strong?", "Modern low-VOC paints have minimal odor and the smell usually fades within a few hours."],
      ["Can you remove popcorn ceilings and paint in the same project?", "Yes. Bundling popcorn removal with painting is often the most efficient way to update a room."],
    ],
  },
  {
    title: "Exterior Painting",
    navTitle: "Exterior Painting",
    slug: "exterior-painting",
    path: "/exterior-painting",
    icon: "Home",
    image: "/img/services/exterior.webp",
    metaTitle: "Exterior House Painters in Charlotte, NC | 593 EC Painting",
    metaDescription: "Family-owned exterior painters serving Charlotte, NC. Siding, brick, stucco, trim, and pressure washing. Built for Carolina weather. Free quotes, 3-year warranty.",
    heroTitle: "Exterior House Painters in Charlotte, NC",
    heroSubtitle: "Siding, brick, stucco, and trim, painted to stand up to Carolina sun, humidity, and storms. Backed by a 3-year warranty.",
    introTitle: "Exterior Painting Built for the Carolinas",
    intro: ["Charlotte weather is hard on a paint job. Long humid summers, intense UV, sudden thunderstorms, and winter freeze cycles all attack exterior paint.", "We do exterior painting the way it is supposed to be done: careful prep, premium paint, weather-smart scheduling, and a written warranty that backs it up."],
    featuresTitle: "Exterior Surfaces We Paint",
    features: ["Hardie Plank & Fiber Cement Siding", "Vinyl Siding", "Wood Siding & Lap Siding", "Brick & Masonry", "Stucco", "Trim, Soffits & Fascia", "Front Doors & Shutters", "Garage Doors", "Decks & Porches"],
    processTitle: "Our Exterior Painting Process",
    steps: [["Free On-Site Quote", "We measure the home, inspect siding and trim, talk through colors, and write a detailed estimate."], ["Pressure Wash", "Every exterior paint job starts with a thorough wash to remove dirt, mildew, and chalking."], ["Repair & Prep", "We caulk gaps, fix wood rot, scrape loose paint, and prime bare spots."], ["Paint", "Two coats of premium exterior paint are applied in the right weather conditions."], ["Final Walkthrough", "We inspect the exterior with you, touch up anything that needs it, and leave the job site clean."]],
    extras: [["Pressure Washing", "Pressure washing is included with every exterior paint job, and we also offer it as a standalone service for siding, brick, stucco, driveways, sidewalks, porches, and patios."], ["Built for Carolina Weather", "Heat, humidity, UV, pollen, and sudden storms all affect exterior painting. We know when to paint, when to wait, and which coatings hold up in the Charlotte area."]],
    faq: [["How often should I repaint my home's exterior in Charlotte?", "Most Charlotte homes need repainting every 7-10 years depending on siding, sun exposure, and the quality of the previous paint job."], ["What is the best time of year to paint outside?", "Spring through fall is ideal, especially dry stretches with daytime highs between 50 and 90 degrees."], ["Do I need to be home while you paint?", "No. We need access to outdoor faucets, power, and gates, but many customers go to work as normal."], ["Do you repair wood rot before painting?", "Yes. We inspect trim, soffits, fascia, and siding and include repair work in the estimate when needed."], ["Can you paint brick or stucco?", "Yes. We use masonry and stucco products designed for those surfaces."], ["What exterior paint brands do you use?", "We use premium exterior products from Sherwin-Williams and Benjamin Moore."], ["Is pressure washing included?", "Yes. Every exterior paint job includes pressure washing."], ["What does the 3-year warranty cover?", "It covers peeling, blistering, and adhesion failures caused by our application or prep, subject to the written warranty terms."]],
  },
  {
    title: "Cabinet Painting",
    navTitle: "Cabinet Painting",
    slug: "cabinet-painting",
    path: "/cabinet-painting",
    icon: "Layers",
    image: "/img/services/cabinets.webp",
    metaTitle: "Cabinet Painters in Charlotte, NC | 593 EC Painting",
    metaDescription: "Kitchen and bathroom cabinet painting in Charlotte, NC. Save 50-70% versus replacement with a factory-quality finish. Family-owned, 3-year warranty, free quotes.",
    heroTitle: "Cabinet Painters in Charlotte, NC",
    heroSubtitle: "Get the look of a new kitchen for a fraction of the cost. Family-owned cabinet refinishing with a factory-quality finish.",
    introTitle: "A New Kitchen Without the Cost of a New Kitchen",
    intro: ["Kitchen cabinets are the biggest visual element in your kitchen, and replacing them is one of the most expensive projects in any home renovation.", "Cabinet painting gives you most of the visual impact for a fraction of the cost. We use spray-applied finishes, professional prep, premium cabinet-grade products, and a 3-year warranty."],
    featuresTitle: "Cabinet Painting vs Cabinet Replacement",
    features: ["Cost", "Timeline", "Kitchen downtime", "Mess & disruption", "Result"],
    processTitle: "How We Paint Cabinets",
    steps: [["Free In-Home Quote", "We count doors and drawers, talk through colors and finishes, and provide a written quote."], ["Remove Doors & Hardware", "Doors and drawer faces come off, get labeled, and move to a controlled spray area."], ["Clean & Degrease", "We remove cooking residue so the finish can bond."], ["Sand & Prep", "We scuff-sand, fill dings, and prep every surface."], ["Prime", "Bonding primer gives the topcoat a durable foundation."], ["Spray Topcoats", "Cabinet-grade enamel is sprayed for a smooth finish."], ["Reinstall", "Doors, drawers, and hardware go back on before the final walkthrough."]],
    extras: [["Finish Options", "Choose classic solid colors, two-tone uppers and lowers, island accents, cabinet-and-trim matching, or a hardware upgrade while the doors are off."], ["Built to Hold Up to Daily Life", "We use cabinet-grade enamels such as Sherwin-Williams Emerald Urethane Trim Enamel and Benjamin Moore Advance so the finish resists normal kitchen wear."], ["What to Expect", "Most kitchens take 5-7 working days. You will have limited cabinet access, but the kitchen itself remains usable."]],
    faq: [["How long does cabinet painting take?", "Most kitchen cabinet projects take 5-7 working days. Bathroom vanities are usually 2-3 days."], ["Can I still use my kitchen during the project?", "Mostly. Cabinets are inaccessible for parts of the week, but the sink, appliances, and counters remain usable."], ["Will painted cabinets hold up?", "Yes, when painted correctly with cabinet-grade products and proper cure time."], ["What if my cabinets are damaged?", "Small dings and scratches can be filled. If replacement makes more sense, we will tell you honestly."], ["Can you change the cabinet color completely?", "Yes. Dramatic color changes and two-tone kitchens are common cabinet projects."], ["Do you spray cabinet doors?", "Yes. Doors and drawer faces are removed and sprayed in a controlled environment."], ["Can you replace hardware too?", "Yes. Swapping hardware while doors are off is a simple upgrade."], ["How much does cabinet painting cost?", "It depends on kitchen size, number of doors and drawers, current finish, and color choice. We provide free in-home quotes."], ["Is there a warranty?", "Yes. Cabinet projects are backed by our written 3-year workmanship warranty."]],
  },
  {
    title: "Deck Staining & Painting",
    navTitle: "Deck Staining & Painting",
    slug: "deck-staining",
    path: "/deck-staining",
    icon: "Sun",
    image: "/img/services/deck.webp",
    metaTitle: "Deck Staining & Painting in Charlotte, NC | 593 EC Painting",
    metaDescription: "Professional deck staining, sealing, and painting in Charlotte, NC. Protect your outdoor wood from Carolina sun and rain. Family-owned, free quotes, 3-year warranty.",
    heroTitle: "Deck Staining & Painting in Charlotte, NC",
    heroSubtitle: "Clean, stain, seal, and restore your outdoor wood. Built to protect against Carolina sun, humidity, and rain.",
    introTitle: "Bring Your Deck Back to Life",
    intro: ["A deck is one of the most-used spaces in any Charlotte home, and one of the most weather-beaten. Carolina sun, humidity, pollen, and freeze-thaw cycles all take their toll.", "We restore decks across the Charlotte area by cleaning, repairing, staining, and sealing them so they look better and hold up to the weather."],
    featuresTitle: "What's Included in a Deck Project",
    features: ["Deck Cleaning", "Repairs", "Sanding", "Staining", "Sealing", "Painting"],
    processTitle: "Our Deck Staining Process",
    steps: [["Free On-Site Quote", "We measure the deck, inspect the wood, talk through colors, and write a clear estimate."], ["Clean & Prep", "We pressure wash or chemically clean, depending on what the deck needs."], ["Repair", "We replace damaged boards and secure loose railings where needed."], ["Sand", "We smooth raised grain and rough patches so stain absorbs evenly."], ["Stain & Seal", "We apply your chosen finish and a protective sealer."], ["Final Walkthrough", "We walk the deck with you and make sure everything looks right."]],
    extras: [["Stain Options", "Transparent stain shows the grain, semi-transparent adds color while preserving texture, solid stain hides imperfections, and deck paint works when a painted surface is the right answer."], ["Signs Your Deck Needs Staining", "If water no longer beads, boards look gray, the surface splinters, color is fading, or mildew appears, your deck is probably due for cleaning and new protection."]],
    faq: [["How often should I restain my deck in Charlotte?", "Most decks need restaining every 2-4 years depending on sun exposure, traffic, and previous stain."], ["What is the best time of year to stain a deck?", "Spring and fall are ideal. We need a dry stretch before and after staining."], ["Should I stain or paint my deck?", "Stain is usually better for natural wood. Paint can make sense for older or previously painted decks."], ["Can you repair loose boards or railings?", "Yes. We inspect and include needed repairs in the estimate."], ["How long until I can walk on my deck?", "Usually 24 hours for foot traffic and 48 hours before replacing furniture."], ["Do you stain fences too?", "Yes. See our fence staining page for details."]],
  },
  {
    title: "Fence Staining & Painting",
    navTitle: "Fence Staining & Painting",
    slug: "fence-staining",
    path: "/fence-staining",
    icon: "Fence",
    image: "/img/services/fence.webp",
    metaTitle: "Fence Staining & Painting in Charlotte, NC | 593 EC Painting",
    metaDescription: "Professional fence staining and painting in Charlotte, NC. Wood fence restoration, sealing, and color refresh. Family-owned, free quotes, 3-year warranty.",
    heroTitle: "Fence Staining & Painting in Charlotte, NC",
    heroSubtitle: "Restore your wood fence and protect it from Carolina weather for years to come. Cleaning, repair, staining, and sealing, done right.",
    introTitle: "Wood Fences That Look Like New Again",
    intro: ["A wood fence is one of those things you do not notice until it starts looking bad. Gray, splintered, leaning fences age a whole property.", "We restore wood fences across the Charlotte area with cleaning, repair, staining, painting, and sealing in colors that complement your home."],
    featuresTitle: "What's Included in a Fence Project",
    features: ["Pressure Washing", "Board Replacement", "Post & Hardware Check", "Sanding", "Staining or Painting", "Sealing"],
    processTitle: "Our Fence Staining Process",
    steps: [["Free On-Site Quote", "We measure the fence, inspect the wood, and write a clear estimate."], ["Pressure Wash & Clean", "We remove dirt, mildew, and graying from the wood."], ["Repair", "We replace damaged boards and secure loose hardware."], ["Stain or Paint", "We apply your chosen finish with attention to coverage and consistency."], ["Walkthrough", "We walk the fence line with you to make sure everything looks right."]],
    extras: [["Stain or Paint Your Fence?", "Stain is recommended for most fences because it penetrates the wood and does not peel. Solid stain hides more weathering. Paint is best for fences that have already been painted or need a specific color."], ["Signs Your Fence Needs Attention", "Look for gray boards, faded stain, mildew, loose or rotted boards, splintering, and rough spots. Most Charlotte-area fences need restaining every 3-5 years."]],
    faq: [["How often should I restain my fence?", "Every 3-5 years for most fences in the Charlotte area."], ["Can you stain a brand-new fence?", "Yes, but we usually recommend waiting 30-60 days after installation so the wood can dry and weather slightly."], ["What if some fence boards are rotted?", "We replace damaged boards as part of the project when needed."], ["Stain or paint, which is better?", "Stain is better for most fences because it penetrates and ages more naturally."], ["Do you do both sides of the fence?", "Yes, assuming both sides are accessible."], ["How long does a fence project take?", "Most residential fences take 1-3 days depending on size and condition."]],
  },
];

const galleryImages = [
  { url: "/img/gallery/kitchen-cabinets.webp", alt: "Cabinet painting in Charlotte NC kitchen", caption: "Cabinet Painting" },
  { url: "/img/gallery/exterior-home.webp", alt: "Exterior house painting in Charlotte NC", caption: "Exterior Painting" },
  { url: "/img/gallery/living-room.webp", alt: "Interior wall painting in Charlotte NC living room", caption: "Interior Painting" },
  { url: "/img/gallery/front-door.webp", alt: "Front door painting in Charlotte NC", caption: "Door and Trim Painting" },
  { url: "/img/gallery/painted-kitchen.webp", alt: "Painted kitchen cabinets in Charlotte NC", caption: "Cabinet Refinish" },
  { url: "/img/gallery/covered-porch.webp", alt: "Deck staining in Charlotte NC covered porch", caption: "Deck Staining" },
  { url: "/img/gallery/stained-fence.webp", alt: "Fence staining in Charlotte NC backyard", caption: "Fence Staining" },
];

const reviews = [
  { quote: "The team painted our downstairs quickly and left everything spotless. The lines are clean and the rooms feel brand new.", name: "Sarah Jenkins", role: "Residential Client", location: "Charlotte" },
  { quote: "We hired 593 EC Painting for exterior painting and deck staining. The house looks refreshed and the process was easy.", name: "Mike and Linda Ross", role: "Homeowners", location: "Matthews" },
  { quote: "The cabinet finish made our kitchen feel completely updated. They helped us choose a color and the final result looks polished.", name: "Elena Rodriguez", role: "Cabinet Painting Client", location: "Ballantyne" },
];

function serviceAreaBlock() {
  return rich("Proudly Serving Charlotte and the Surrounding Carolinas", [
    "We work throughout the greater Charlotte metro and into the South Carolina border communities. If you are within about 30 miles of Charlotte, we can paint your home.",
    `Cities we serve: ${SERVICE_AREA}.`,
  ]);
}

function homeContent() {
  return { blocks: [
    hero({ headline: "Charlotte's Family-Owned House Painters", subheadline: "Honest pricing, fast communication, and work that lasts. Serving Charlotte and the surrounding Carolinas for 5 years.", image: "/img/gallery/exterior-home.webp" }),
    block("trust-bar", { items: [
      { icon: "Star", label: "5-Star Google Rated" }, { icon: "Users", label: "Family-Owned & Operated" }, { icon: "ShieldCheck", label: "3-Year Workmanship Warranty" }, { icon: "ClipboardCheck", label: "Free On-Site Quotes" }, { icon: "BadgeCheck", label: "Licensed & Insured" }, { icon: "MapPin", label: "Serving Charlotte for 5 Years" },
    ]}),
    rich("Painting Done Right by People Who Care", ["593 EC Painting is run by Esau and Sandra, a husband-and-wife team that has been painting homes across Charlotte and the surrounding Carolinas for 5 years. We started this business because we believed homeowners deserved better: a painter who shows up, communicates, respects your home, and stands behind every job.", "When you call 593 EC Painting, you reach Esau or Sandra directly. When we paint your home, we treat it the way we would treat our own. And if something is not right, we come back and make it right."]),
    cards("What We Paint", "From a single accent wall to your entire home inside and out, we handle prep, repair, paint, and cleanup.", serviceCards),
    featureList("Why Charlotte Homeowners Choose 593 EC Painting", "We are a local family-owned painting business, and that changes everything about how we work with you.", [
      { title: "You Talk to the Owner", description: "Every call, every quote, every project. No call centers and no middlemen." },
      { title: "Honest, Up-Front Pricing", description: "Free on-site quotes with no pressure and no surprise add-ons." },
      { title: "Daily Communication", description: "Text or email updates and photos throughout your project." },
      { title: "Real Prep Work", description: "Patching, sanding, caulking, and priming before paint touches the wall." },
      { title: "3-Year Warranty", description: "Every interior and exterior paint job is backed by a written workmanship warranty." },
      { title: "Clean Job Site", description: "Furniture protected, floors covered, and daily cleanup." },
    ]),
    processBlock("How We Work", "A simple, transparent process from your first call to the final walkthrough.", [
      { title: "Free On-Site Quote", description: "We come out, measure, listen, and write a clear itemized estimate." },
      { title: "Schedule & Prep", description: "We agree on timing and walk through colors, surfaces, repairs, and prep." },
      { title: "Paint Day", description: "Our team arrives on time, protects your home, and texts photo updates." },
      { title: "Walkthrough & Warranty", description: "We walk the finished project with you and handle touch-ups before we leave." },
    ]),
    galleryBlock("Recent Work in the Charlotte Area", "A look at homes we have painted recently across Charlotte and surrounding communities."),
    block("testimonials", { title: "What Our Customers Say", subtitle: "Real reviews from homeowners across Charlotte and the surrounding areas.", items: reviews, sectionBackgroundColor: "#f4f8fb" }),
    serviceAreaBlock(),
    cta("Ready for a Fresh Coat?", "Get a free, no-pressure quote from Charlotte's family-owned painters. Most quotes scheduled within 48 hours."),
  ] };
}

function aboutContent() {
  return { blocks: [
    hero({ headline: "Meet the Family Behind 593 EC Painting", subheadline: "A husband-and-wife team painting Charlotte homes the right way for 5 years and counting.", image: "/img/gallery/living-room.webp" }),
    rich("Built on Honesty, Care, and Reliability", ["593 EC Painting started the way a lot of small businesses start: with one person, a few brushes, and a belief that there was a better way to do things.", "Esau and Sandra built a painting business where homeowners can call the owner directly, where prep work gets done before paint goes on, and where the family who painted your home actually cares whether you would recommend them to your neighbor.", "Five years later, we have painted hundreds of homes across Charlotte and the surrounding Carolinas, and we have built a business almost entirely on referrals and repeat customers."]),
    featureList("What You Get When You Hire 593 EC Painting", "The small differences add up to a completely different experience.", [
      { title: "A real owner-operator relationship", description: "When you call, you reach Esau or Sandra." }, { title: "Honest quotes", description: "We measure carefully, write everything down, and avoid surprises." }, { title: "Daily updates", description: "We text photos as we go so you know what is happening." }, { title: "Real prep work", description: "Patching, sanding, caulking, and priming make the paint last." }, { title: "3-year warranty", description: "Written in your contract." }, { title: "We come back for touch-ups", description: "That is how we keep customers for life." },
    ]),
    block("stats-bar", { items: [{ icon: "Calendar", value: "5 Years", label: "Painting Charlotte homes" }, { icon: "Home", value: "Hundreds", label: "Of homes painted" }, { icon: "Star", value: "5-Star", label: "Google rating" }, { icon: "ShieldCheck", value: "3-Year", label: "Workmanship warranty" }]}),
    serviceAreaBlock(),
    cta("Let's Talk About Your Project", "Give us a call or request a free quote online. We will listen, inspect, and write a clear estimate."),
  ] };
}

function contactContent() {
  return { blocks: [
    hero({ headline: "Get a Free Painting Quote", subheadline: "Tell us about your project and we will get back to you within 24 hours, usually faster.", image: "/img/gallery/front-door.webp", secondary: false }),
    rich("Request Your Free Quote", ["No pressure, no obligation. Most quotes are scheduled within 48 hours. Use the form below and tell us what you want painted." ]),
    block("contact-form", {}),
    block("contact-info", { title: "Prefer to Call or Text?", items: [{ icon: "Phone", label: "Phone / Text", value: PHONE_DISPLAY }, { icon: "Mail", label: "Email", value: EMAIL }, { icon: "MapPin", label: "Address", value: ADDRESS }, { icon: "Clock", label: "Hours", value: "Monday-Saturday, 8:00 AM - 6:00 PM" }]}),
    serviceAreaBlock(),
    processBlock("What to Expect After You Reach Out", "Here is exactly what happens once you submit a quote request.", [{ title: "We respond within 24 hours", description: "Usually within a few hours during business days." }, { title: "We schedule a free on-site visit", description: "We come out, measure, look at surfaces, and answer questions." }, { title: "You get a written quote", description: "Itemized, clear, and no surprises." }, { title: "You decide on your own timeline", description: "No high-pressure sales tactics." }]),
  ] };
}

function galleryContent() {
  return { blocks: [hero({ headline: "Recent Painting Projects in the Charlotte Area", subheadline: "Real homes. Real before-and-afters. Photographed by our team on the job.", image: "/img/gallery/kitchen-cabinets.webp" }), rich("", ["Every photo on this page is a real 593 EC Painting project or a placeholder from the current Domina asset set until more project photos are added. Browse by category to see the range of what we do." ]), galleryBlock("Browse Our Work", "Interior, exterior, cabinets, decks, and fences."), cta("Want Your Home in This Gallery?", "Get a free quote and let us add your project to the next batch of before-and-afters.")] };
}

function reviewsContent() {
  return { blocks: [hero({ headline: "What Charlotte Homeowners Say About 593 EC Painting", subheadline: "Real reviews from real customers. We have built this business on word of mouth.", image: "/img/gallery/living-room.webp" }), block("stats-bar", { items: [{ icon: "Star", value: "5.0", label: "Google Rating" }, { icon: "MessageSquare", value: "Live", label: "Google reviews widget pending" }, { icon: "ThumbsUp", value: "100%", label: "Family-owned care" }, { icon: "Calendar", value: "5 Years", label: "Serving Charlotte" }]}), block("testimonials", { title: "Reviews from Our Customers", subtitle: "Live Google reviews should be embedded here once the widget provider is connected. These placeholders keep the page layout ready.", items: reviews }), rich("Word of Mouth Built This Business", ["We do not spend much on advertising. From the day we started 593 EC Painting, our customers have referred us to friends, family, and neighbors, and that is how we have grown." ]), cta("Ready to Join Them?", "Get a free quote from Charlotte's family-owned painters.")] };
}

function servicesContent() {
  return { blocks: [hero({ headline: "Professional Painting Services", subheadline: "Interior, exterior, cabinet, deck, and fence painting services built around careful prep and clean results.", image: "/img/gallery/exterior-home.webp" }), cards("", "", serviceCards), featureList("Why Homeowners Across Charlotte Choose 593 EC Painting", "A family-owned painting business serving Charlotte and the surrounding Carolinas for 5 years.", [{ title: "You Talk to the Owner", description: "Every call, every quote, every project." }, { title: "Real Prep Work", description: "The steps that make paint actually last." }, { title: "Premium Paints Included", description: "Sherwin-Williams and Benjamin Moore as standard." }, { title: "3-Year Warranty", description: "Written into your contract." }, { title: "Daily Photo Updates", description: "Know what is happening even when you are at work." }, { title: "We Come Back for Touch-Ups", description: "That is how we keep customers for life." }]), serviceAreaBlock(), cta("Ready to Get Started?", "Get a free, no-pressure quote from Charlotte's family-owned painters. Most quotes scheduled within 48 hours.")] };
}

function serviceDetailContent(service: (typeof services)[number]) {
  return { blocks: [hero({ headline: service.heroTitle, subheadline: service.heroSubtitle, image: service.image }), rich(service.introTitle, service.intro), featureList(service.featuresTitle, "From focused repairs to full project prep, we handle every surface with care.", service.features.map((title) => ({ title, description: "Included in the project scope when needed." }))), processBlock(service.processTitle, "Here is exactly what to expect from quote to walkthrough.", service.steps.map(([title, description]) => ({ title, description }))), ...service.extras.map(([title, body]) => rich(title, [body])), featureList(`Why Choose 593 EC Painting for Your ${service.navTitle.replace(" Painting", "")}`, "A family-owned painting business with a different approach.", [{ title: "You talk to the owner", description: "Esau and Sandra answer the phone, write the quote, and oversee the work." }, { title: "Real prep, every time", description: "We do not skip steps to save time." }, { title: "Premium products", description: "Sherwin-Williams and Benjamin Moore are standard." }, { title: "Daily photo updates", description: "Know what is happening even when you are at work." }, { title: "3-year warranty", description: "Written into your contract." }, { title: "Clean job site", description: "Your home and landscaping are protected." }]), galleryBlock(`Recent ${service.navTitle} Projects`, "A look at recent work across Charlotte and the surrounding Carolinas."), cta(`Ready for ${service.navTitle}?`, "Get a free quote for your project. Most quotes scheduled within 48 hours."), faq(service.faq.map(([question, answer]) => ({ question, answer })))] };
}

function legalContent(title: string, sections: Array<[string, string | string[]]>) {
  return { blocks: [block("section-header", { eyebrow: "Legal", title, subtitle: `Last updated: ${LAUNCH_DATE}`, alignment: "center", headingLevel: "h1" }), ...sections.map(([heading, body]) => rich(heading, Array.isArray(body) ? body : [body]))] };
}

function privacyContent() {
  return legalContent("Privacy Policy", [["Introduction", `${LEGAL_NAME} respects your privacy and is committed to protecting the personal information you share with us.`], ["Information We Collect", "We collect information you provide directly, including your name, phone number, email address, service address or ZIP code, project details, uploaded photos, and text-message consent preferences. We may also collect basic website analytics."], ["How We Use Your Information", "We use your information to respond to quote requests, schedule estimates, communicate about projects, improve the website, and comply with legal obligations. We do not sell your personal information."], ["Who We Share Information With", "We share information only as needed with service providers, legal authorities when required, or successors if the business is transferred."], ["Cookies and Tracking Technologies", "Our website may use essential cookies, analytics cookies, and review-widget cookies. You can control cookies through your browser settings."], ["SMS / Text Messaging", "If you opt in to text messages, we may text you about quotes, scheduling, and project updates. Reply STOP to opt out."], ["Data Security", "We take reasonable steps to protect submitted information, including HTTPS and limiting access to people who need it to run the business."], ["Your Choices and Rights", "You may request a copy, correction, or deletion of your personal information, subject to legal requirements."], ["Contact Us", `${LEGAL_NAME}<br />${ADDRESS}<br />Phone: ${PHONE_DISPLAY}<br />Email: ${EMAIL}`]]);
}

function termsContent() {
  return legalContent("Terms of Service", [["Agreement to Terms", `These Terms govern your use of the ${SITE_URL} website and any quotes or painting services requested through it.`], ["Painting Services", "593 EC Painting provides residential painting and related services in Charlotte, NC and surrounding communities. Actual project scope, price, timeline, and warranty are governed by your signed written estimate and service agreement."], ["Quotes and Estimates", "Quote requests submitted through the website do not create a contract. Estimates are binding only after an on-site visit, written estimate, and signed agreement."], ["Workmanship Warranty", "593 EC Painting provides a 3-year workmanship warranty subject to the signed service agreement. It covers workmanship-related peeling, blistering, or adhesion failures and excludes damage outside our control."], ["Payment", "Payment terms are set in your signed service agreement. We typically require a deposit before work begins and final payment on completion."], ["Website Use", "You may use this website for personal, non-commercial purposes related to learning about or hiring 593 EC Painting."], ["Intellectual Property", "Website text, photos, graphics, logos, and design are owned by 593 EC Painting LLC or used with permission."], ["Governing Law", "These Terms are governed by the laws of North Carolina, and disputes are handled in Mecklenburg County, North Carolina."], ["Contact Us", `${LEGAL_NAME}<br />${ADDRESS}<br />Phone: ${PHONE_DISPLAY}<br />Email: ${EMAIL}`]]);
}

function disclaimerContent() {
  return legalContent("Disclaimer", [["General Disclaimer", "Website information is provided for general informational purposes only. Every project is different and website content should not replace an on-site quote."], ["Not Professional Advice", "Service descriptions, FAQs, and process explanations are general guidance."], ["Pricing and Estimates", "Any pricing guidance is illustrative only. A binding project price is provided only after an on-site visit and written estimate."], ["Photos and Project Examples", "Photos represent actual 593 EC Painting work or temporary project placeholders used during the rebuild. Results vary by project."], ["Reviews and Testimonials", "Reviews displayed on this website reflect genuine customer opinions when connected to the live Google reviews widget."], ["Color Accuracy", "Paint colors may appear differently on screens than they do on walls."], ["Warranty and Service Information", "Specific warranty terms are set in your signed service agreement and warranty document."], ["Service Area", "593 EC Painting primarily serves Charlotte and surrounding communities within approximately a 30-mile radius."], ["Contact Us", `${LEGAL_NAME}<br />${ADDRESS}<br />Phone: ${PHONE_DISPLAY}<br />Email: ${EMAIL}`]]);
}

function thankYouContent() {
  return { blocks: [block("section-header", { eyebrow: "Quote Request", title: "Thanks - We Got Your Request", subtitle: "A real human, probably Esau or Sandra, will be in touch within 24 hours, usually sooner.", alignment: "center", headingLevel: "h1" }), block("callout-box", { title: "Your quote request has been received.", content: p("We will review the details and reach out within 24 hours, most often the same business day."), variant: "success" }), processBlock("What Happens Next", "Here is exactly what you can expect from here.", [{ title: "We review your request", description: "Esau and Sandra personally review every quote request." }, { title: "We reach out to schedule a visit", description: "A quick call or text to confirm your information and choose a time." }, { title: "We visit and write your quote", description: "We measure, inspect, discuss finishes, and write a clear estimate." }, { title: "You decide on your timeline", description: "No high-pressure sales tactics." }]), cards("While You Wait", "A few ways to get to know us before we connect.", [{ title: "See Our Recent Work", description: "Browse before-and-after photos.", link: "/gallery", icon: "Image" }, { title: "Read Our Reviews", description: "Real reviews from Charlotte homeowners.", link: "/reviews", icon: "Star" }, { title: "Meet the Family", description: "Learn about Esau, Sandra, and the way we work.", link: "/about", icon: "Users" }, { title: "Explore Our Services", description: "Interior, exterior, cabinets, decks, and fences.", link: "/services", icon: "PaintBucket" }]), cta("Need to Reach Us Sooner?", "If your project is time-sensitive or you would rather talk, we are happy to pick up the phone.", `Call ${PHONE_DISPLAY}`, false)] };
}

function notFoundContent() {
  return { blocks: [block("section-header", { eyebrow: "404", title: "This Page Took a Coffee Break", subtitle: "The page you are looking for cannot be found, but we would love to help you find what you need.", alignment: "center", headingLevel: "h1" }), cards("Maybe You Were Looking For...", "A quick list of the most-visited pages on our site.", [{ title: "Our Painting Services", description: "See everything we paint.", link: "/services", icon: "PaintBucket" }, { title: "Recent Project Gallery", description: "Real before-and-after photos.", link: "/gallery", icon: "Image" }, { title: "Customer Reviews", description: "What Charlotte homeowners say.", link: "/reviews", icon: "Star" }, { title: "About 593 EC Painting", description: "Meet the family behind the business.", link: "/about", icon: "Users" }, { title: "Get a Free Quote", description: "Tell us about your project.", link: "/contact", icon: "ClipboardCheck" }, { title: "Call or Text Us", description: PHONE_DISPLAY, link: PHONE_TEL, icon: "Phone" }]), cta("Still Can't Find What You're Looking For?", "Just give us a call. We answer most calls the same day and are happy to point you in the right direction.", `Call ${PHONE_DISPLAY}`)] };
}

function sitemapContent() {
  return { blocks: [block("section-header", { eyebrow: "Sitemap", title: "Sitemap", subtitle: "A complete index of every page on ecpaintingcharlotte.com.", alignment: "center", headingLevel: "h1" }), rich("", ["This sitemap is a complete list of every page on our website, organized by section." ]), cards("Main Pages", "", [{ title: "Home", description: "Welcome to 593 EC Painting.", link: "/", icon: "Home" }, { title: "About", description: "Meet Esau, Sandra, and the family behind the business.", link: "/about", icon: "Users" }, { title: "Contact", description: "Request a free quote or get in touch.", link: "/contact", icon: "Phone" }, { title: "Gallery", description: "Before-and-after photos of recent projects.", link: "/gallery", icon: "Image" }, { title: "Reviews", description: "Real reviews from Charlotte homeowners.", link: "/reviews", icon: "Star" }]), cards("Painting Services", "", [{ title: "All Services", description: "Overview of every painting service we offer.", link: "/services", icon: "PaintBucket" }, ...serviceCards]), cards("Legal", "", [{ title: "Privacy Policy", description: "How we handle your information.", link: "/privacy-policy", icon: "ShieldCheck" }, { title: "Terms of Service", description: "Terms governing use of our website and services.", link: "/terms-of-service", icon: "FileText" }, { title: "Disclaimer", description: "Important disclaimers about website content.", link: "/disclaimer", icon: "AlertCircle" }]), rich("Contact Information", [`${LEGAL_NAME}<br />${ADDRESS}<br />Phone: ${PHONE_DISPLAY}<br />Hours: Monday-Saturday, 8:00 AM - 6:00 PM`]), serviceAreaBlock(), cta("Ready to Get Started?", "Get a free, no-pressure quote from Charlotte's family-owned painters.")] };
}

type PageSpec = { title: string; slug: string; path: string; metaTitle: string; metaDescription: string; content: Record<string, unknown>; noindex?: boolean };

function allPageSpecs(): PageSpec[] {
  return [
    { title: "Home", slug: "home", path: "/", metaTitle: "593 EC Painting | Charlotte's Family-Owned House Painters", metaDescription: "Family-owned house painters serving Charlotte, NC and surrounding areas. Interior, exterior, cabinets, decks, and fences. Honest pricing, free quotes, work guaranteed.", content: homeContent() },
    { title: "About", slug: "about", path: "/about", metaTitle: "About 593 EC Painting | Family-Owned Charlotte Painters", metaDescription: "Meet Esau and Sandra, the husband-and-wife team behind 593 EC Painting. 5 years of painting homes across Charlotte, NC and the surrounding Carolinas.", content: aboutContent() },
    { title: "Contact", slug: "contact", path: "/contact", metaTitle: "Contact 593 EC Painting | Free Quotes in Charlotte, NC", metaDescription: "Request a free painting quote from 593 EC Painting. Family-owned house painters serving Charlotte, NC and surrounding areas. Call (774) 329-7109 or request online.", content: contactContent() },
    { title: "Gallery", slug: "gallery", path: "/gallery", metaTitle: "Painting Gallery | 593 EC Painting Charlotte, NC", metaDescription: "Before and after photos of recent painting projects across Charlotte, NC. Interior, exterior, cabinets, decks, and fences by 593 EC Painting.", content: galleryContent() },
    { title: "Reviews", slug: "reviews", path: "/reviews", metaTitle: "Reviews | 593 EC Painting Charlotte, NC", metaDescription: "See what Charlotte homeowners say about 593 EC Painting. Read real Google reviews from interior, exterior, and cabinet painting customers across the Carolinas.", content: reviewsContent() },
    { title: "Services", slug: "services", path: "/services", metaTitle: "Painting Services in Charlotte, NC | 593 EC Painting", metaDescription: "Interior, exterior, cabinet, deck, and fence painting services across Charlotte, NC and the surrounding Carolinas. Family-owned, free quotes, 3-year warranty.", content: servicesContent() },
    ...services.map((service) => ({ title: service.title, slug: service.slug, path: service.path, metaTitle: service.metaTitle, metaDescription: service.metaDescription, content: serviceDetailContent(service) })),
    { title: "Privacy Policy", slug: "privacy-policy", path: "/privacy-policy", metaTitle: "Privacy Policy | 593 EC Painting", metaDescription: "How 593 EC Painting collects, uses, and protects your information when you visit our website or request a painting quote.", content: privacyContent() },
    { title: "Terms of Service", slug: "terms-of-service", path: "/terms-of-service", metaTitle: "Terms of Service | 593 EC Painting", metaDescription: "Terms of service for 593 EC Painting LLC, governing use of our website and painting services in Charlotte, NC and the surrounding Carolinas.", content: termsContent() },
    { title: "Disclaimer", slug: "disclaimer", path: "/disclaimer", metaTitle: "Disclaimer | 593 EC Painting", metaDescription: "Important disclaimers regarding the information, photos, pricing guidance, and content on the 593 EC Painting website.", content: disclaimerContent() },
    { title: "Thank You", slug: "thank-you", path: "/thank-you", metaTitle: "Thank You | 593 EC Painting", metaDescription: "Thank you for requesting a painting quote from 593 EC Painting. We will be in touch within 24 hours.", content: thankYouContent(), noindex: true },
    { title: "404 Page Not Found", slug: "404", path: "/404", metaTitle: "Page Not Found | 593 EC Painting", metaDescription: "The page you are looking for cannot be found. Explore our painting services or get a free quote.", content: notFoundContent(), noindex: true },
    { title: "Sitemap", slug: "sitemap", path: "/sitemap", metaTitle: "Sitemap | 593 EC Painting", metaDescription: "Complete sitemap of the 593 EC Painting website. Browse every page including services, gallery, reviews, and contact information.", content: sitemapContent() },
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
  return { title: spec.title, slug: spec.slug, pageType: "custom", template: "full-width", status: "published", content: spec.content, seoTitle: spec.metaTitle, seoDescription: spec.metaDescription, seoKeywords: "", ogImageUrl: OG_IMAGE_URL, canonicalUrl: `${SITE_URL}${spec.path === "/" ? "" : spec.path}`, noindex: spec.noindex ?? false, publishedAt: new Date(), scheduledAt: null, createdBy: null, updatedBy: null, sidebarId: null };
}

async function seedPages() {
  for (const spec of allPageSpecs()) {
    await upsertPage(page(spec));
  }
  const obsoleteSlugs = ["commercial-painting", "kitchen-cabinet-painting", "join", "events", "recordings", "insights", "directory"];
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
  await upsertMenu({ name: "Main Navigation", location: "main_navigation", items: [item("Home", "/"), item("Services", "/services", [item("All Services", "/services"), ...serviceItems]), item("About", "/about"), item("Gallery", "/gallery"), item("Reviews", "/reviews"), item("Contact", "/contact")] });
  await upsertMenu({ name: "Services", location: "footer_platform", items: serviceItems });
  await upsertMenu({ name: "Company", location: "footer_professionals", items: [item("About", "/about"), item("Gallery", "/gallery"), item("Reviews", "/reviews"), item("Contact", "/contact")] });
  await upsertMenu({ name: "Service Area", location: "footer_resources", items: [item("Charlotte", "/contact"), item("Matthews", "/contact"), item("Mint Hill", "/contact"), item("Fort Mill", "/contact"), item("Rock Hill", "/contact")] });
  await upsertMenu({ name: "Connect", location: "footer_company", items: [item("Facebook", FACEBOOK_URL), item("Instagram", INSTAGRAM_URL), item("Google Reviews", GOOGLE_BUSINESS_URL)] });
  await upsertMenu({ name: "Legal", location: "footer_legal", items: [item("Privacy Policy", "/privacy-policy"), item("Terms of Service", "/terms-of-service"), item("Disclaimer", "/disclaimer"), item("Sitemap", "/sitemap")] });
}

async function seedSettings() {
  await storage.seoSettings.upsert({ siteName: BRAND_NAME, titleSuffix: ` | ${BRAND_NAME}`, defaultMetaDescription: "Family-owned house painters serving Charlotte, NC and surrounding areas. Interior, exterior, cabinets, decks, and fences.", siteUrl: SITE_URL, defaultOgImageUrl: OG_IMAGE_URL, organizationName: BRAND_NAME, organizationLogoUrl: LOGO_URL, facebookUrl: FACEBOOK_URL, instagramUrl: INSTAGRAM_URL, defaultRobotsNoindex: false, customRobotsTxt: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n` });

  const branding: Array<[string, string]> = [["company_name", BRAND_NAME], ["company_address", ADDRESS], ["company_phone_numbers", PHONE_DISPLAY], ["company_google_business_url", GOOGLE_BUSINESS_URL], ["frontend_logo_url", LOGO_URL], ["favicon_url", FAVICON_URL], ["frontend_body_font", "open-sans"], ["frontend_heading_font", "montserrat"], ["brand_primary_color", "#0A83A5"], ["brand_secondary_color", "#F3F7FA"], ["brand_tertiary_color", "#0F5F7A"], ["brand_quaternary_color", "#021824"], ["text_h1_color", "#0F172A"], ["text_h2_color", "#0F172A"], ["text_h3_h6_color", "#0F172A"], ["text_body_color", "#334155"], ["text_muted_color", "#64748B"], ["text_inverse_color", "#FFFFFF"], ["text_primary_foreground_color", "#FFFFFF"], ["text_secondary_foreground_color", "#0F172A"], ["text_tertiary_foreground_color", "#FFFFFF"]];
  for (const [key, value] of branding) await storage.settings.upsertSetting(key, value, "branding", false);

  const features: Array<[string, string]> = [["enable_directory", "false"], ["enable_blog", "false"], ["enable_events", "false"], ["enable_crm", "true"]];
  for (const [key, value] of features) await storage.settings.upsertSetting(key, value, "system_configuration", false);
}

async function main() {
  await seedPages();
  await seedMenus();
  await seedSettings();
  console.log("Seeded 593 EC Painting public CMS pages, menus, branding, and SEO settings.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => { await pool.end(); });
