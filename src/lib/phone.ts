export const QATAR_COUNTRY_CODE = "974";
export const QATAR_PHONE_MAX_DIGITS = 15;

/** Keeps digits only and limits length for the local phone input. */
export function sanitizeLocalPhoneDigits(value: string, maxDigits = QATAR_PHONE_MAX_DIGITS) {
  return value.replace(/\D/g, "").slice(0, maxDigits);
}

/** Strips +974 / 974 prefix for display in the local input field. */
export function stripQatarCountryCode(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith(QATAR_COUNTRY_CODE)) {
    return digits.slice(QATAR_COUNTRY_CODE.length);
  }
  return digits;
}

/** Sends phone to backend as country code + local digits, e.g. 97433123456. */
export function formatQatarPhoneForBackend(localDigits: string) {
  const local = sanitizeLocalPhoneDigits(localDigits);
  return local ? `${QATAR_COUNTRY_CODE}${local}` : "";
}

export function isValidQatarLocalPhone(localDigits: string) {
  const local = sanitizeLocalPhoneDigits(localDigits);
  return local.length >= 8 && local.length <= QATAR_PHONE_MAX_DIGITS;
}
