export const DEFAULT_COMPANY_PHONE_NUMBERS = "(704) 277-1972";

export function splitCompanyPhoneNumbers(value: string | null | undefined): string[] {
  return (value || "")
    .split(/[\n,]+/)
    .map((phone) => phone.trim())
    .filter(Boolean);
}

export function getPrimaryCompanyPhone(value: string | null | undefined): string {
  return splitCompanyPhoneNumbers(value)[0] || DEFAULT_COMPANY_PHONE_NUMBERS;
}

export function companyPhoneDigits(value: string | null | undefined): string {
  return getPrimaryCompanyPhone(value).replace(/\D/g, "");
}

export function companyPhoneHref(value: string | null | undefined): string {
  const digits = companyPhoneDigits(value);
  if (!digits) return "";
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
}

export function companyPhoneSmsHref(value: string | null | undefined): string {
  const digits = companyPhoneDigits(value);
  if (!digits) return "";
  return `sms:+${digits.length === 10 ? `1${digits}` : digits}`;
}

export function companyPhoneE164(value: string | null | undefined): string {
  return companyPhoneHref(value).replace(/^tel:/, "");
}

export function isValidCompanyPhoneNumbers(value: string): boolean {
  const phoneNumbers = splitCompanyPhoneNumbers(value);
  return (
    phoneNumbers.length > 0 &&
    phoneNumbers.every((phone) => {
      const digits = phone.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    })
  );
}
