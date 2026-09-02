import path from "path";

// Deliberately OUTSIDE `public/` — Next.js's production server (`next
// start`) pre-builds a manifest of `public/` at build time and never
// re-checks the filesystem, so files written there at runtime 404
// forever until the next rebuild. Serving through a route handler
// (src/app/api/uploads/[...path]/route.ts) reads the file fresh on
// every request instead.
export const UPLOADS_ROOT = path.join(process.cwd(), "uploads");

export const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};
