const KNOWN_CODES = new Set([
  "MISSING_FIELDS",
  "PASSWORD_TOO_SHORT",
  "EMAIL_TAKEN",
  "INVALID_COUNTRY",
  "INVALID_FUEL_TYPE",
  "INVALID_PROPERTY_TYPE",
  "INVALID_ITEM_CATEGORY",
  "UNAUTHORIZED",
  "FILE_MISSING",
  "INVALID_FILE_TYPE",
  "FILE_TOO_LARGE",
  "TOKEN_INVALID",
]);

export async function readErrorCode(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  const code = body?.code;
  return typeof code === "string" && KNOWN_CODES.has(code) ? code : "GENERIC";
}
