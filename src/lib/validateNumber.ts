// SQLite's Prisma `Int` columns are 32-bit signed integers (max
// 2,147,483,647). A larger value crashes the insert with a cryptic
// Prisma "Inconsistent column data" error, so every Int field coming
// from user input is capped here rather than only at the database.
// Rounded down for a clean, easy-to-communicate limit rather than the
// exact Int32 ceiling.
export const MAX_INT = 2_000_000_000;

/** For fields that must be strictly positive (price, surface area). */
export function isValidPositiveInt(value: unknown): boolean {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n <= MAX_INT;
}

/** For fields that may legitimately be zero (mileage, room count). */
export function isValidNonNegativeInt(value: unknown): boolean {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= MAX_INT;
}
