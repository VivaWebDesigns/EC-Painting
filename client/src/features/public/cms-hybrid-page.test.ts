import { describe, expect, it } from "vitest";
import { buildCmsDocumentTitle } from "./cms-hybrid-page";
import type { SeoSettings } from "@shared/schema";

const seoSettings = {
  siteName: "593 EC Painting",
  titleSuffix: " | 593 EC Painting",
} as SeoSettings;

describe("buildCmsDocumentTitle", () => {
  it("does not duplicate the brand when the SEO title already includes it", () => {
    expect(buildCmsDocumentTitle("House Painters in Charlotte, NC | 593 EC Painting", seoSettings)).toBe(
      "House Painters in Charlotte, NC | 593 EC Painting",
    );
  });

  it("appends the title suffix when the title does not include the site name", () => {
    expect(buildCmsDocumentTitle("Contact", seoSettings)).toBe("Contact | 593 EC Painting");
  });
});
