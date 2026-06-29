import { describe, expect, it } from "vitest";
import { getTrailingSlashRedirectUrl } from "./trailing-slash";

describe("getTrailingSlashRedirectUrl", () => {
  it("redirects extensionless public page paths to trailing-slash URLs", () => {
    expect(getTrailingSlashRedirectUrl("GET", "/interior-painting?source=gsc", "/interior-painting")).toBe(
      "/interior-painting/?source=gsc",
    );
    expect(getTrailingSlashRedirectUrl("HEAD", "/services", "/services")).toBe("/services/");
  });

  it("does not redirect root, already-slashed paths, APIs, assets, or files", () => {
    expect(getTrailingSlashRedirectUrl("GET", "/", "/")).toBeNull();
    expect(getTrailingSlashRedirectUrl("GET", "/services/", "/services/")).toBeNull();
    expect(getTrailingSlashRedirectUrl("GET", "/api/cms/pages/by-slug/home", "/api/cms/pages/by-slug/home")).toBeNull();
    expect(getTrailingSlashRedirectUrl("GET", "/assets/index.js", "/assets/index.js")).toBeNull();
    expect(getTrailingSlashRedirectUrl("GET", "/sitemap.xml", "/sitemap.xml")).toBeNull();
  });

  it("does not redirect non-idempotent requests", () => {
    expect(getTrailingSlashRedirectUrl("POST", "/contact", "/contact")).toBeNull();
  });
});
