import { describe, expect, it } from "vitest";
import { getCanonicalHostRedirectUrl } from "./canonical-host";

describe("getCanonicalHostRedirectUrl", () => {
  it("redirects www ecpaintingcharlotte.com to the canonical apex host", () => {
    expect(getCanonicalHostRedirectUrl("www.ecpaintingcharlotte.com", "/contact?source=google")).toBe(
      "https://ecpaintingcharlotte.com/contact?source=google",
    );
  });

  it("ignores the port when matching the host", () => {
    expect(getCanonicalHostRedirectUrl("www.ecpaintingcharlotte.com:443", "/")).toBe(
      "https://ecpaintingcharlotte.com/",
    );
  });

  it("does not redirect the canonical host or local development hosts", () => {
    expect(getCanonicalHostRedirectUrl("ecpaintingcharlotte.com", "/")).toBeNull();
    expect(getCanonicalHostRedirectUrl("localhost:5000", "/")).toBeNull();
  });
});
