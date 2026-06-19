import { Suspense, lazy, useEffect, useRef } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrandingProvider } from "@/components/shared/branding-provider";
import { CookieConsentBanner } from "@/components/shared/cookie-consent-banner";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
import { DEFAULT_SITE_FEATURES, type SiteFeatures } from "@shared/site-features";

const AboutPage = lazy(() => import("@/features/public/about-page"));
const ContactPage = lazy(() => import("@/features/public/contact-page"));
const CmsHybridPage = lazy(() =>
  import("@/features/public/cms-hybrid-page").then((module) => ({
    default: module.CmsHybridPage,
  }))
);
const CmsPreviewPage = lazy(() => import("@/features/public/cms-preview-page"));

const LoginPage = lazy(() => import("@/features/auth/login-page"));
const ForgotPasswordPage = lazy(() => import("@/features/auth/forgot-password-page"));
const ResetPasswordPage = lazy(() => import("@/features/auth/reset-password-page"));
const AdminSetupPage = lazy(() => import("@/features/auth/admin-setup-page"));

const StandaloneFormPage = lazy(() => import("@/features/public/standalone-form-page"));
const AdminDashboardPage = lazy(() => import("@/features/admin/dashboard-page"));
const AdminUsersPage = lazy(() => import("@/features/admin/users-page"));
const AdminFormsPage = lazy(() => import("@/features/admin/forms-page"));
const AdminCrmPage = lazy(() => import("@/features/admin/crm-page"));
const AdminCrmClientsPage = lazy(() => import("@/features/admin/crm-clients-page"));
const DocsPage = lazy(() => import("@/features/admin/docs-page"));
const AdminSettingsPage = lazy(() => import("@/features/admin/settings-page"));
const AdminDesignPage = lazy(() => import("@/features/admin/design-page"));
const CmsOverviewPage = lazy(() => import("@/features/admin/cms/cms-overview-page"));
const CmsPagesPage = lazy(() => import("@/features/admin/cms/cms-pages-page"));
const CmsPageEditorPage = lazy(() => import("@/features/admin/cms/cms-page-editor-page"));
const CmsMediaPage = lazy(() => import("@/features/admin/cms/cms-media-page"));
const CmsSeoPage = lazy(() => import("@/features/admin/cms/cms-seo-page"));
const CmsSectionsPage = lazy(() => import("@/features/admin/cms/cms-sections-page"));
const CmsSectionEditorPage = lazy(() => import("@/features/admin/cms/cms-section-editor-page"));
const CmsMenusPage = lazy(() => import("@/features/admin/cms/cms-menus-page"));
const CmsSidebarsPage = lazy(() => import("@/features/admin/cms/cms-sidebars-page"));
const SystemBackupsPage = lazy(() => import("@/features/admin/system-backups-page"));

const SearchResultsPage = lazy(() => import("@/features/public/search-results-page"));
const LegalFallbackPage = lazy(() => import("@/features/public/legal-fallback-page"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]" data-testid="page-loader">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function AdminIndexRoute() {
  const { user, hasAdminPermission } = useAuth();

  if (!user) {
    return <Redirect to="/auth/login" replace />;
  }

  if (user.role === "admin") {
    return <AdminDashboardPage />;
  }

  if (user.role === "editor") {
    if (hasAdminPermission("content")) {
      return <Redirect to="/admin/cms" replace />;
    }
    if (hasAdminPermission("crm")) {
      return <Redirect to="/admin/crm" replace />;
    }
    if (hasAdminPermission("design")) {
      return <Redirect to="/admin/design/branding" replace />;
    }
  }

  return <NotFound />;
}

function Router() {
  const { data: siteFeaturesData } = useQuery<SiteFeatures>({
    queryKey: ["/api/site-config"],
    staleTime: 60_000,
  });
  const siteFeatures = siteFeaturesData ?? DEFAULT_SITE_FEATURES;

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={() => <CmsHybridPage slug="home" fallback={<NotFound />} />} />
        <Route path="/about" component={() => <CmsHybridPage slug="about" fallback={<AboutPage />} />} />
        <Route path="/gallery" component={() => <CmsHybridPage slug="gallery" fallback={<NotFound />} />} />
        <Route path="/reviews" component={() => <CmsHybridPage slug="reviews" fallback={<NotFound />} />} />
        <Route path="/contact" component={() => <CmsHybridPage slug="contact" fallback={<ContactPage />} />} />
        <Route path="/services" component={() => <CmsHybridPage slug="services" fallback={<NotFound />} />} />
        <Route path="/interior-painting" component={() => <CmsHybridPage slug="interior-painting" fallback={<NotFound />} />} />
        <Route path="/exterior-painting" component={() => <CmsHybridPage slug="exterior-painting" fallback={<NotFound />} />} />
        <Route path="/cabinet-painting" component={() => <CmsHybridPage slug="cabinet-painting" fallback={<NotFound />} />} />
        <Route path="/deck-staining" component={() => <CmsHybridPage slug="deck-staining" fallback={<NotFound />} />} />
        <Route path="/fence-staining" component={() => <CmsHybridPage slug="fence-staining" fallback={<NotFound />} />} />
        <Route path="/popcorn-ceiling-removal" component={() => <CmsHybridPage slug="popcorn-ceiling-removal" fallback={<NotFound />} />} />
        <Route path="/drywall-repair" component={() => <CmsHybridPage slug="drywall-repair" fallback={<NotFound />} />} />
        <Route path="/wallpaper-removal" component={() => <CmsHybridPage slug="wallpaper-removal" fallback={<NotFound />} />} />
        <Route path="/pressure-washing" component={() => <CmsHybridPage slug="pressure-washing" fallback={<NotFound />} />} />
        <Route path="/hardie-plank-painting" component={() => <CmsHybridPage slug="hardie-plank-painting" fallback={<NotFound />} />} />
        <Route path="/services/interior-painting"><Redirect to="/interior-painting" replace /></Route>
        <Route path="/services/exterior-painting"><Redirect to="/exterior-painting" replace /></Route>
        <Route path="/services/kitchen-cabinet-painting"><Redirect to="/cabinet-painting" replace /></Route>
        <Route path="/services/deck-staining"><Redirect to="/deck-staining" replace /></Route>
        <Route path="/services/fence-staining"><Redirect to="/fence-staining" replace /></Route>
        <Route path="/thank-you" component={() => <CmsHybridPage slug="thank-you" fallback={<NotFound />} />} />
        <Route path="/sitemap" component={() => <CmsHybridPage slug="sitemap" fallback={<NotFound />} />} />
        <Route path="/404" component={() => <CmsHybridPage slug="404" fallback={<NotFound />} />} />
        <Route path="/preview/cms/:id" component={CmsPreviewPage} />
        <Route path="/join" component={NotFound} />
        <Route path="/events" component={NotFound} />
        <Route path="/events/:id" component={NotFound} />
        <Route path="/recordings" component={NotFound} />
        <Route path="/search" component={SearchResultsPage} />
        <Route path="/insights" component={NotFound} />
        <Route path="/insights/:slug" component={NotFound} />
        <Route path="/directory" component={NotFound} />
        <Route path="/privacy-policy" component={() => <CmsHybridPage slug="privacy-policy" fallback={<LegalFallbackPage title="Privacy Policy" subtitle="Review how 593 EC Painting collects, uses, stores, and protects information across the website and related services." />} />} />
        <Route path="/terms-of-service" component={() => <CmsHybridPage slug="terms-of-service" fallback={<LegalFallbackPage title="Terms of Service" subtitle="Review the terms governing use of the 593 EC Painting website and related services." />} />} />
        <Route path="/disclaimer" component={() => <CmsHybridPage slug="disclaimer" fallback={<LegalFallbackPage title="Disclaimer" subtitle="Review important information about using the 593 EC Painting website and related services." />} />} />
        <Route path="/directory/:id" component={NotFound} />
        <Route path="/reference/:token" component={NotFound} />
        <Route path="/forms/:slug" component={StandaloneFormPage} />
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/register"><Redirect to="/auth/login" replace /></Route>
        <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
        <Route path="/auth/reset-password" component={ResetPasswordPage} />
        <Route path="/setup" component={AdminSetupPage} />

        <Route path="/therapist">
          <NotFound />
        </Route>
        <Route path="/therapist/profile">
          <NotFound />
        </Route>
        <Route path="/therapist/subscription">
          <NotFound />
        </Route>
        <Route path="/therapist/apply">
          <NotFound />
        </Route>
        <Route path="/therapist/application/status">
          <NotFound />
        </Route>

        <Route path="/admin">
          <ProtectedRoute roles={["admin", "editor"]}>
            <AdminIndexRoute />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/therapists">
          <NotFound />
        </Route>
        <Route path="/admin/directory/settings">
          <NotFound />
        </Route>
        <Route path="/admin/users">
          <ProtectedRoute roles={["admin"]}>
            <AdminUsersPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/membership-tiers">
          <NotFound />
        </Route>
        <Route path="/admin/events">
          <NotFound />
        </Route>
        <Route path="/admin/forms">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <AdminFormsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/crm/clients">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["crm"]}>
            {siteFeatures.crmEnabled ? <AdminCrmClientsPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/admin/crm">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["crm"]}>
            {siteFeatures.crmEnabled ? <AdminCrmPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/admin/blog">
          <NotFound />
        </Route>
        <Route path="/admin/docs">
          <ProtectedRoute roles={["admin"]}>
            <DocsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/settings">
          <ProtectedRoute roles={["admin"]}>
            <AdminSettingsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/design/branding">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["design"]}>
            <AdminDesignPage initialSubview="branding" />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/design">
          <Redirect to="/admin/design/branding" />
        </Route>
        <Route path="/admin/design/colors">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["design"]}>
            <AdminDesignPage initialSubview="colors" />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/design/typography">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["design"]}>
            <AdminDesignPage initialSubview="typography" />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/therapists/specializations">
          <NotFound />
        </Route>
        <Route path="/admin/system/backups">
          <ProtectedRoute roles={["admin"]}>
            <SystemBackupsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/applications/:id">
          <NotFound />
        </Route>
        <Route path="/admin/applications">
          <NotFound />
        </Route>
        <Route path="/admin/cms">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsOverviewPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/pages/new">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsPageEditorPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/pages/:id">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsPageEditorPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/pages">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsPagesPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/media">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsMediaPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/blog/new">
          <NotFound />
        </Route>
        <Route path="/admin/cms/blog/settings">
          <NotFound />
        </Route>
        <Route path="/admin/cms/blog/comments">
          <NotFound />
        </Route>
        <Route path="/admin/cms/blog/:id">
          <NotFound />
        </Route>
        <Route path="/admin/cms/blog">
          <NotFound />
        </Route>
        <Route path="/admin/cms/sections/new">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content", "design"]}>
            <CmsSectionEditorPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/sections/:id">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content", "design"]}>
            <CmsSectionEditorPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/sections">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content", "design"]}>
            <CmsSectionsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/seo">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsSeoPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/menus">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["design"]}>
            <CmsMenusPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/sidebars">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["design"]}>
            <CmsSidebarsPage />
          </ProtectedRoute>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function SetupGuard({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: setupStatus, isLoading, isError } = useQuery<{ needsSetup: boolean }>({
    queryKey: ["/api/setup/status"],
    staleTime: 60_000,
    retry: 2,
  });

  const needsSetup = setupStatus?.needsSetup === true || (isError && !setupStatus);

  useEffect(() => {
    if (needsSetup && location !== "/setup") {
      setLocation("/setup");
    }
  }, [needsSetup, location, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="setup-guard-loading">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}

function RouteScrollManager() {
  const [location] = useLocation();
  const lastPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("scrollRestoration" in window.history)) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pathname = location.split(/[?#]/)[0] || "/";
    const lastPathname = lastPathnameRef.current;
    lastPathnameRef.current = pathname;

    if (lastPathname === null || lastPathname === pathname) return;

    const scrollToTarget = () => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.scrollIntoView({ block: "start" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToTarget);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location]);

  return null;
}

function RouteAdminModeManager() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const pathname = location.split(/[?#]/)[0] || "/";
    const isAdminRoute = pathname.startsWith("/admin");
    const root = document.documentElement;

    root.classList.toggle("admin-mode", isAdminRoute);

    return () => {
      root.classList.remove("admin-mode");
    };
  }, [location]);

  return null;
}

function RouteTitleManager() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const pathname = location.split(/[?#]/)[0] || "/";
    if (pathname.startsWith("/admin")) {
      document.title = "593 EC Painting Admin";
    } else if (document.title === "593 EC Painting Admin") {
      document.title = "593 EC Painting";
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrandingProvider>
        <TooltipProvider>
          <Toaster />
          <SetupGuard>
            <RouteAdminModeManager />
            <RouteTitleManager />
            <RouteScrollManager />
            <Router />
            <CookieConsentBanner />
          </SetupGuard>
        </TooltipProvider>
      </BrandingProvider>
    </QueryClientProvider>
  );
}

export default App;
