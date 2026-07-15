import { describe, expect, it } from "vitest";
import {
  companyPhoneE164,
  companyPhoneHref,
  getPrimaryCompanyPhone,
  isValidCompanyPhoneNumbers,
  splitCompanyPhoneNumbers,
} from "./company-phone";

describe("company phone helpers", () => {
  it("uses the first configured phone number across newline and comma formats", () => {
    expect(splitCompanyPhoneNumbers("(774) 329-7109\n(980) 555-0100")).toEqual([
      "(774) 329-7109",
      "(980) 555-0100",
    ]);
    expect(getPrimaryCompanyPhone("(774) 329-7109, (980) 555-0100")).toBe("(774) 329-7109");
  });

  it("normalizes the configured number for links and structured data", () => {
    expect(companyPhoneHref("(774) 329-7109")).toBe("tel:+17743297109");
    expect(companyPhoneE164("(774) 329-7109")).toBe("+17743297109");
  });

  it("validates one or more configured phone numbers", () => {
    expect(isValidCompanyPhoneNumbers("(774) 329-7109\n+1 (980) 555-0100")).toBe(true);
    expect(isValidCompanyPhoneNumbers("704-12")).toBe(false);
    expect(isValidCompanyPhoneNumbers("")).toBe(false);
  });
});
