import { describe, expect, it } from "vitest";
import type { SeoSettings } from "@shared/schema";
import { buildOrganizationLd } from "./structured-data";

describe("buildOrganizationLd", () => {
  it("uses the persisted branding phone in E.164 format", () => {
    const schema = buildOrganizationLd(
      {
        organizationName: "593 EC Painting",
        siteName: "593 EC Painting",
        siteUrl: "https://ecpaintingcharlotte.com",
      } as SeoSettings,
      "(980) 555-0100",
    );

    expect(schema?.telephone).toBe("+19805550100");
  });
});
