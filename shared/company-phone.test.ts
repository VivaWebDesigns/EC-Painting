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
    expect(splitCompanyPhoneNumbers("(704) 277-1972\n(980) 555-0100")).toEqual([
      "(704) 277-1972",
      "(980) 555-0100",
    ]);
    expect(getPrimaryCompanyPhone("(704) 277-1972, (980) 555-0100")).toBe("(704) 277-1972");
  });

  it("normalizes the configured number for links and structured data", () => {
    expect(companyPhoneHref("(704) 277-1972")).toBe("tel:+17042771972");
    expect(companyPhoneE164("(704) 277-1972")).toBe("+17042771972");
  });

  it("validates one or more configured phone numbers", () => {
    expect(isValidCompanyPhoneNumbers("(704) 277-1972\n+1 (980) 555-0100")).toBe(true);
    expect(isValidCompanyPhoneNumbers("704-12")).toBe(false);
    expect(isValidCompanyPhoneNumbers("")).toBe(false);
  });
});
