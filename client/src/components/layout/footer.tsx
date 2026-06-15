import { useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useBranding } from "@/components/shared/branding-provider";
import { versionBrandAssetUrl } from "@/lib/branding";
import type { CmsMenu, MenuItem, PublicMenuLocation } from "@shared/schema";

const defaultPlatformLinks = [
  { href: "/services", label: "All Services", testId: "link-footer-services" },
  { href: "/about", label: "About", testId: "link-footer-about" },
  { href: "/contact", label: "Contact", testId: "link-footer-contact" },
];

const defaultTherapistLinks = [
  { href: "/interior-painting", label: "Interior Painting", testId: "link-footer-interior" },
  { href: "/exterior-painting", label: "Exterior Painting", testId: "link-footer-exterior" },
  { href: "/cabinet-painting", label: "Cabinet Painting", testId: "link-footer-cabinets" },
];

const defaultResourceLinks = [
  { href: "/deck-staining", label: "Deck Staining", testId: "link-footer-deck" },
  { href: "/fence-staining", label: "Fence Staining", testId: "link-footer-fence" },
];

const defaultCompanyLinks = [
  { href: "/about", label: "About Us", testId: "link-footer-about" },
  { href: "/gallery", label: "Gallery", testId: "link-footer-gallery" },
  { href: "/reviews", label: "Reviews", testId: "link-footer-reviews" },
  { href: "/contact", label: "Contact", testId: "link-footer-contact" },
];

const defaultLegalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy", testId: "link-footer-privacy" },
  { href: "/terms-of-service", label: "Terms of Service", testId: "link-footer-terms" },
  { href: "/disclaimer", label: "Disclaimer", testId: "link-footer-disclaimer" },
  { href: "/sitemap", label: "Sitemap", testId: "link-footer-sitemap" },
];

const footerLinkClass =
  "text-slate-300/75 transition-colors hover:text-white focus-visible:text-white active:text-white";
const legalFooterLinkClass =
  "text-slate-300/75 transition-colors hover:text-white focus-visible:text-white active:text-white";

type FooterLegalLink = {
  href: string;
  label: string;
  testId: string;
  openInNewTab?: boolean;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; testId: string }[];
}) {
  return (
    <div>
      <h4 className="font-heading font-semibold text-sm mb-3 sm:mb-4 text-white">{title}</h4>
      <ul className="space-y-2.5 sm:space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.testId}>
            <Link href={link.href} className={footerLinkClass} data-testid={link.testId}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function flattenFooterItems(items: MenuItem[], depth = 0): { item: MenuItem; depth: number }[] {
  const result: { item: MenuItem; depth: number }[] = [];
  for (const item of items) {
    result.push({ item, depth });
    if (item.children?.length > 0) {
      result.push(...flattenFooterItems(item.children, depth + 1));
    }
  }
  return result;
}

function DynamicFooterColumn({ item }: { item: MenuItem }) {
  const allLinks = flattenFooterItems(item.children || []);
  return (
    <div>
      <h4 className="font-heading font-semibold text-sm mb-3 sm:mb-4 text-white">{item.label}</h4>
      <ul className="space-y-2.5 sm:space-y-3 text-sm">
        {allLinks.map(({ item: child, depth }) => (
          <li key={child.id} style={depth > 0 ? { paddingLeft: `${depth * 12}px` } : undefined}>
            {child.openInNewTab ? (
              <a
                href={child.url}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLinkClass}
                data-testid={`link-footer-${child.id}`}
              >
                {child.label}
              </a>
            ) : (
              <Link
                href={child.url}
                className={footerLinkClass}
                data-testid={`link-footer-${child.id}`}
              >
                {child.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function flattenMenuLinks(items: MenuItem[]): MenuItem[] {
  return flattenFooterItems(items).map(({ item }) => item);
}

function isServiceAreaMenu(menu: CmsMenu) {
  return menu.location === "footer_resources" || menu.name.trim().toLowerCase() === "service area";
}

function StandardFooterColumn({ menu }: { menu: CmsMenu }) {
  const links = flattenMenuLinks((menu.items as MenuItem[]) || []);
  if (links.length === 0) return null;

  return (
    <div>
      <h4 className="font-heading font-semibold text-sm mb-3 sm:mb-4 text-white">{menu.name}</h4>
      <ul className="space-y-2.5 sm:space-y-3 text-sm">
        {links.map((item) => (
          <li key={item.id}>
            {item.openInNewTab ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLinkClass}
                data-testid={`link-footer-${item.id}`}
              >
                {item.label}
              </a>
            ) : (
              <Link
                href={item.url}
                className={footerLinkClass}
                data-testid={`link-footer-${item.id}`}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { companyName } = useBranding();
  const { data: publicMenus } = useQuery<Partial<Record<PublicMenuLocation, CmsMenu>>>({
    queryKey: ["/api/cms/menus"],
    queryFn: async () => {
      const res = await fetch("/api/cms/menus");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60000,
  });

  const legacyFooterItems = useMemo(() => {
    const footerMenu = publicMenus?.footer;
    if (!footerMenu?.items) return null;
    const items = footerMenu.items as MenuItem[];
    return items.length > 0 ? items : null;
  }, [publicMenus]);

  const standardFooterMenus = useMemo(
    () =>
      [
        publicMenus?.footer_platform,
        publicMenus?.footer_professionals,
        publicMenus?.footer_resources,
        publicMenus?.footer_company,
      ].filter((menu): menu is CmsMenu =>
        Boolean(
          menu && !isServiceAreaMenu(menu) && Array.isArray(menu.items) && menu.items.length > 0,
        ),
      ),
    [publicMenus],
  );

  const legalLinks = useMemo(() => {
    const legalMenu = publicMenus?.footer_legal;
    if (!legalMenu?.items) return defaultLegalLinks;

    const items = flattenMenuLinks((legalMenu.items as MenuItem[]) || []);
    if (items.length === 0) return defaultLegalLinks;

    return items.map((item) => ({
      href: item.url,
      label: item.label,
      openInNewTab: item.openInNewTab,
      testId: `link-footer-${item.id}`,
    }));
  }, [publicMenus]) as FooterLegalLink[];

  const useStandardFooterMenus = standardFooterMenus.length > 0;
  const brandName = companyName?.trim() || "593 EC Painting";
  const footerLogo = versionBrandAssetUrl("/img/593-ec-painting-logo-footer.png");

  return (
    <footer
      className="relative overflow-hidden border-t border-slate-800 bg-[#021824] text-white"
      data-testid="footer"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-primary/60" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14">
        <div
          className={`grid grid-cols-2 sm:grid-cols-2 ${useStandardFooterMenus ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-8 sm:gap-10 lg:gap-12`}
        >
          <div className="col-span-2">
            <img
              src={footerLogo}
              alt={brandName}
              className="h-10 sm:h-12 w-auto mb-4 object-contain"
            />
            <p className="text-sm text-slate-300/75 leading-relaxed max-w-xs">
              Professional painting for interiors, exteriors, cabinets, decks, and fences.
            </p>
          </div>

          {useStandardFooterMenus ? (
            standardFooterMenus.map((menu) => <StandardFooterColumn key={menu.id} menu={menu} />)
          ) : legacyFooterItems ? (
            legacyFooterItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <DynamicFooterColumn key={item.id} item={item} />
              ) : (
                <div key={item.id}>
                  <ul className="space-y-2.5 sm:space-y-3 text-sm">
                    <li>
                      {item.openInNewTab ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${footerLinkClass} font-semibold`}
                          data-testid={`link-footer-${item.id}`}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.url}
                          className={`${footerLinkClass} font-semibold`}
                          data-testid={`link-footer-${item.id}`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              ),
            )
          ) : (
            <>
              <FooterColumn title="Company" links={defaultPlatformLinks} />
              <FooterColumn title="Services" links={defaultTherapistLinks} />
              <div className="col-span-2 sm:col-span-1">
                <FooterColumn title="More Services" links={defaultResourceLinks} />
                <div className="mt-6 sm:mt-8">
                  <FooterColumn title="Contact" links={defaultCompanyLinks} />
                </div>
              </div>
            </>
          )}
        </div>

        <div
          className="mt-8 sm:mt-10 pt-6 border-t border-slate-700/70 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-sm text-slate-300/75"
          data-testid="text-copyright"
        >
          <span className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </span>
          <div className="flex items-center gap-4 sm:gap-6">
            {legalLinks.map((link) =>
              link.openInNewTab ? (
                <a
                  key={link.testId}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={legalFooterLinkClass}
                  data-testid={link.testId}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.testId}
                  href={link.href}
                  className={legalFooterLinkClass}
                  data-testid={link.testId}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
