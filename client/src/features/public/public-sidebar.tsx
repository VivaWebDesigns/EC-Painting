import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowRight } from "lucide-react";
import { PublicFormRenderer } from "@/components/forms/public-form-renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CmsSidebar, SidebarWidget } from "@shared/schema";

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function WidgetCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <Card className="shadow-sm" data-testid="public-sidebar-widget">
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? "pt-0" : "pt-5"}>{children}</CardContent>
    </Card>
  );
}

function FormWidget({ widget }: { widget: SidebarWidget }) {
  const heading = widget.title || "Form";
  const formSlug = text(widget.settings.formSlug, "contact-form");
  const description = text(widget.settings.description);
  const buttonText = text(widget.settings.buttonText);

  return (
    <WidgetCard title={heading}>
      <PublicFormRenderer
        slug={formSlug}
        showHeader={false}
        descriptionOverride={description || undefined}
        buttonTextOverride={buttonText || undefined}
        compact
        className="space-y-3"
      />
    </WidgetCard>
  );
}

function CalloutWidget({ widget }: { widget: SidebarWidget }) {
  const body = text(widget.settings.body, "Add a short message, promotion, or supporting note here.");
  const buttonText = text(widget.settings.buttonText);
  const buttonUrl = text(widget.settings.buttonUrl, "#");

  return (
    <WidgetCard title={widget.title || "Helpful Resource"}>
      <div className="space-y-4">
        <p className="text-sm public-body-text leading-relaxed">{body}</p>
        {buttonText && (
          <Button asChild variant="outline" className="w-full">
            <Link href={buttonUrl}>
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </WidgetCard>
  );
}

function SearchWidget({ widget }: { widget: SidebarWidget }) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");

  return (
    <WidgetCard title={widget.title || "Search"}>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(query.trim() ? `/search?query=${encodeURIComponent(query.trim())}` : "/search");
        }}
        data-testid="sidebar-search-form"
      >
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search site content..." />
        <Button type="submit" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </WidgetCard>
  );
}

function HtmlWidget({ widget }: { widget: SidebarWidget }) {
  return (
    <WidgetCard title={widget.title}>
      <div
        className="prose prose-sm prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: text(widget.settings.html, "") }}
      />
    </WidgetCard>
  );
}

function SidebarWidgetRenderer({ widget }: { widget: SidebarWidget }) {
  if (widget.type === "form") return <FormWidget widget={widget} />;
  if (widget.type === "callout") return <CalloutWidget widget={widget} />;
  if (widget.type === "search") return <SearchWidget widget={widget} />;
  if (widget.type === "custom-html") return <HtmlWidget widget={widget} />;
  return null;
}

export function PublicSidebar({
  sidebarId,
  useDefault = false,
}: {
  sidebarId?: string | null;
  useDefault?: boolean;
}) {
  const shouldFetch = Boolean(sidebarId || useDefault);
  const endpoint = sidebarId ? `/api/cms/sidebars/${sidebarId}` : "/api/cms/sidebars/default";
  const { data: sidebar } = useQuery<CmsSidebar>({
    queryKey: ["/api/cms/sidebars", sidebarId || "default"],
    queryFn: async () => {
      const response = await fetch(endpoint, { credentials: "include" });
      if (!response.ok) throw new Error("Sidebar not found");
      return response.json();
    },
    enabled: shouldFetch,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const widgets = Array.isArray(sidebar?.widgets) ? (sidebar.widgets as SidebarWidget[]) : [];
  if (!shouldFetch || !sidebar || widgets.length === 0) return null;

  return (
    <aside className="space-y-5 lg:sticky lg:top-24" data-testid="public-sidebar">
      {widgets.map((widget) => (
        <SidebarWidgetRenderer key={widget.id} widget={widget} />
      ))}
    </aside>
  );
}
