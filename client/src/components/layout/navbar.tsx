import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  ChevronDown,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBranding } from "@/components/shared/branding-provider";
import { versionBrandAssetUrl } from "@/lib/branding";
import type { CmsMenu, MenuItem, PublicMenuLocation } from "@shared/schema";

const defaultServiceLinks = [
  { label: "All Services", href: "/services" },
  { label: "Interior Painting", href: "/interior-painting" },
  { label: "Exterior Painting", href: "/exterior-painting" },
  { label: "Cabinet Painting", href: "/cabinet-painting" },
  { label: "Deck Staining", href: "/deck-staining" },
  { label: "Fence Staining", href: "/fence-staining" },
];

const defaultCompanyLinks = [
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

function makeMenuItem(id: string, label: string, url: string, children: MenuItem[] = []): MenuItem {
  return {
    id,
    label,
    url,
    openInNewTab: false,
    children,
  };
}

const defaultNavItems: MenuItem[] = [
  makeMenuItem("default-home", "Home", "/"),
  makeMenuItem(
    "default-services",
    "Services",
    "/services",
    defaultServiceLinks.map((link) =>
      makeMenuItem(
        `default-service-${link.href.replace(/[^a-z0-9]+/g, "-")}`,
        link.label,
        link.href,
      ),
    ),
  ),
  makeMenuItem("default-about", "About", "/about"),
  makeMenuItem("default-gallery", "Gallery", "/gallery"),
  makeMenuItem("default-reviews", "Reviews", "/reviews"),
  makeMenuItem("default-contact", "Contact", "/contact"),
];

const navButtonClass =
  "h-auto rounded-none bg-transparent px-0 py-1 text-sm font-semibold text-foreground/65 shadow-none hover:bg-transparent hover:text-foreground";
const activeNavLinkClass = "text-primary hover:text-primary";
const activeNavButtonClass = `${navButtonClass} ${activeNavLinkClass}`;

function flattenItems(items: MenuItem[], depth = 0): { item: MenuItem; depth: number }[] {
  const result: { item: MenuItem; depth: number }[] = [];
  for (const item of items) {
    result.push({ item, depth });
    if (item.children?.length > 0) {
      result.push(...flattenItems(item.children, depth + 1));
    }
  }
  return result;
}

function collectInternalUrls(items: MenuItem[], urls = new Set<string>()) {
  for (const item of items) {
    if (!item.openInNewTab && item.url.startsWith("/")) {
      urls.add(item.url);
    }
    if (item.children?.length > 0) {
      collectInternalUrls(item.children, urls);
    }
  }
  return urls;
}

function isLegalMenuItem(item: MenuItem) {
  return (
    item.id.toLowerCase().includes("legal") ||
    item.label.trim().toLowerCase() === "legal" ||
    ["/privacy-policy", "/privacy-policy/", "/terms-of-service", "/terms-of-service/", "/disclaimer", "/disclaimer/"].includes(item.url)
  );
}

function removeLegalMenuItems(items: MenuItem[]): MenuItem[] {
  return items.flatMap((item) => {
    if (isLegalMenuItem(item)) return [];

    return [
      {
        ...item,
        children: item.children ? removeLegalMenuItems(item.children) : [],
      },
    ];
  });
}

function missingFooterMenuLinks(menu: CmsMenu | undefined, existingUrls: Set<string>) {
  if (!menu?.items) return [];

  const links: MenuItem[] = [];
  for (const item of flattenItems((menu.items as MenuItem[]) || []).map(({ item }) => item)) {
    if (item.openInNewTab || !item.url.startsWith("/") || existingUrls.has(item.url)) continue;
    existingUrls.add(item.url);
    links.push({ ...item, children: [] });
  }

  return links;
}

function missingDefaultMenuLinks(
  id: string,
  label: string,
  links: { label: string; href: string }[],
  existingUrls: Set<string>,
) {
  const children = links.flatMap((link) => {
    if (existingUrls.has(link.href)) return [];
    existingUrls.add(link.href);
    return [makeMenuItem(`${id}-${link.href.replace(/[^a-z0-9]+/g, "-")}`, link.label, link.href)];
  });

  return children.length > 0 ? makeMenuItem(id, label, children[0].url, children) : null;
}

function isActiveRecursive(items: MenuItem[], currentPath: string): boolean {
  for (const item of items) {
    if (currentPath === item.url) return true;
    if (item.children?.length > 0 && isActiveRecursive(item.children, currentPath)) return true;
  }
  return false;
}

function DynamicDropdown({ item, location: currentPath }: { item: MenuItem; location: string }) {
  const isActive = isActiveRecursive(item.children || [], currentPath);
  const flatChildren = flattenItems(item.children || []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={isActive ? activeNavButtonClass : navButtonClass}
          data-testid={`link-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        >
          {item.label}
          <ChevronDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="z-[1000] w-64 rounded-md border-border bg-white p-2 shadow-lg"
      >
        {flatChildren.map(({ item: child, depth }) => (
          <DropdownMenuItem
            key={child.id}
            asChild
            className={depth > 0 ? `pl-${4 + depth * 4}` : ""}
          >
            {child.openInNewTab ? (
              <a
                href={child.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-nav-child-${child.id}`}
                style={depth > 0 ? { paddingLeft: `${12 + depth * 16}px` } : undefined}
              >
                {child.label}
              </a>
            ) : (
              <Link
                href={child.url}
                data-testid={`link-nav-child-${child.id}`}
                style={depth > 0 ? { paddingLeft: `${12 + depth * 16}px` } : undefined}
              >
                {child.label}
              </Link>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const { frontendLogoUrl, companyName } = useBranding();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: publicMenus } = useQuery<Partial<Record<PublicMenuLocation, CmsMenu>>>({
    queryKey: ["/api/cms/menus"],
    queryFn: async () => {
      const res = await fetch("/api/cms/menus");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60000,
  });

  const dynamicItems = useMemo(() => {
    const headerMenu = publicMenus?.main_navigation ?? publicMenus?.header;
    if (!headerMenu?.items) return defaultNavItems;
    const items = removeLegalMenuItems(headerMenu.items as MenuItem[]);
    if (items.length === 0) return defaultNavItems;

    const existingUrls = collectInternalUrls(items);
    const footerMenus = [
      publicMenus?.footer_platform,
      publicMenus?.footer_professionals,
      publicMenus?.footer_resources,
      publicMenus?.footer_company,
    ];
    const supplementalGroups = footerMenus
      .map((menu) => {
        const links = missingFooterMenuLinks(menu, existingUrls);
        if (!menu || links.length === 0) return null;
        return makeMenuItem(`header-supplement-${menu.location}`, menu.name, links[0].url, links);
      })
      .filter((item): item is MenuItem => Boolean(item));
    const fallbackSupplementalGroups = [
      publicMenus?.footer_platform
        ? null
        : missingDefaultMenuLinks(
            "header-supplement-services",
            "Services",
            defaultServiceLinks,
            existingUrls,
          ),
      publicMenus?.footer_professionals
        ? null
        : missingDefaultMenuLinks(
            "header-supplement-company",
            "Company",
            defaultCompanyLinks,
            existingUrls,
          ),
    ].filter((item): item is MenuItem => Boolean(item));

    const supplements = [...supplementalGroups, ...fallbackSupplementalGroups];
    return supplements.length > 0 ? [...items, ...supplements] : items;
  }, [publicMenus]);

  const brandName = companyName?.trim() || "593 EC Painting";
  const brandLogo = versionBrandAssetUrl(
    frontendLogoUrl || "/img/593-ec-painting-logo-full-color.png",
  );

  return (
    <nav
      className="sticky top-0 z-[999] border-b border-border bg-white shadow-sm"
      data-testid="navbar"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" data-testid="link-brand">
          <img src={brandLogo} alt={brandName} className="h-10 w-auto md:h-12" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {dynamicItems.map((item) =>
            item.children && item.children.length > 0 ? (
              <DynamicDropdown key={item.id} item={item} location={location} />
            ) : item.openInNewTab ? (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  className={navButtonClass}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  {item.label}
                </Button>
              </a>
            ) : (
              <Link key={item.id} href={item.url}>
                <Button
                  variant="ghost"
                  className={location === item.url ? activeNavButtonClass : navButtonClass}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  aria-current={location === item.url ? "page" : undefined}
                >
                  {item.label}
                </Button>
              </Link>
            ),
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white">
              <SheetHeader>
                <SheetTitle>
                  <img src={brandLogo} alt={brandName} className="h-8 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 mt-6">
                {flattenItems(dynamicItems).map(({ item, depth }) =>
                  item.children && item.children.length > 0 ? (
                    <p
                      key={item.id}
                      className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      style={depth > 0 ? { paddingLeft: `${16 + depth * 16}px` } : undefined}
                      data-testid={`text-mobile-group-${item.id}`}
                    >
                      {item.label}
                    </p>
                  ) : item.openInNewTab ? (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        style={depth > 0 ? { paddingLeft: `${16 + depth * 16}px` } : undefined}
                        data-testid={`link-mobile-${item.id}`}
                      >
                        {item.label}
                      </Button>
                    </a>
                  ) : (
                    <Link key={item.id} href={item.url} onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${location === item.url ? "toggle-elevate toggle-elevated" : ""}`}
                        style={depth > 0 ? { paddingLeft: `${16 + depth * 16}px` } : undefined}
                        data-testid={`link-mobile-${item.id}`}
                        aria-current={location === item.url ? "page" : undefined}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ),
                )}

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
