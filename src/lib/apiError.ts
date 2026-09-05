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
  "SESSION_STALE",
]);

export async function readErrorCode(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  const code = body?.code;
  return typeof code === "string" && KNOWN_CODES.has(code) ? code : "GENERIC";
}

/** Carries the raw error code alongside the translated message, so a
    catch block can act on specific codes (e.g. SESSION_STALE) instead of
    just displaying text. */
export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}
