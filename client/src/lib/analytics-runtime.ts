import { loadScriptWithConsent } from "@/lib/consented-script-loader";

export interface AnalyticsRuntimeConfig {
  ga4MeasurementId: string | null;
}

let analyticsRuntimeConfigPromise: Promise<AnalyticsRuntimeConfig> | null = null;
let loadedGa4MeasurementId: string | null = null;

export async function getAnalyticsRuntimeConfig(): Promise<AnalyticsRuntimeConfig> {
  if (!analyticsRuntimeConfigPromise) {
    analyticsRuntimeConfigPromise = fetch("/api/runtime-integrations", {
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Analytics runtime config failed: ${response.status}`);
        }
        return response.json() as Promise<AnalyticsRuntimeConfig>;
      })
      .catch(() => ({ ga4MeasurementId: null }));
  }

  return analyticsRuntimeConfigPromise;
}

export async function loadGa4IfConsented() {
  const config = await getAnalyticsRuntimeConfig();
  if (!config.ga4MeasurementId || typeof window === "undefined") {
    return null;
  }

  const script = await loadScriptWithConsent({
    id: "ga4-gtag-js",
    src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`,
    category: "analytics",
  });
  if (!script) return null;

  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag = window.gtag || gtag;

  if (loadedGa4MeasurementId !== config.ga4MeasurementId) {
    window.gtag("js", new Date());
    loadedGa4MeasurementId = config.ga4MeasurementId;
  }

  return config;
}

export async function trackGa4PageView(pagePath: string, pageTitle?: string) {
  const config = await loadGa4IfConsented();
  if (!config?.ga4MeasurementId || typeof window === "undefined" || !window.gtag) {
    return false;
  }

  window.gtag("config", config.ga4MeasurementId, {
    page_path: pagePath,
    page_title: pageTitle ?? document.title,
  });
  return true;
}

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}
