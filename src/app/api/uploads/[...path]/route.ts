import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";
import { MIME_BY_EXT, UPLOADS_ROOT } from "@/lib/uploads";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Reject any segment that could escape UPLOADS_ROOT (path traversal).
  if (segments.some((s) => s === ".." || s.includes("/") || s.includes("\\"))) {
    return NextResponse.json({ code: "NOT_FOUND" }, { status: 404 });
  }

  const ext = segments.at(-1)?.split(".").pop()?.toLowerCase();
  const mime = ext ? MIME_BY_EXT[ext] : undefined;
  if (!mime) {
    return NextResponse.json({ code: "NOT_FOUND" }, { status: 404 });
  }

  const filePath = path.join(UPLOADS_ROOT, ...segments);

  try {
    await stat(filePath);
    const bytes = await readFile(filePath);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ code: "NOT_FOUND" }, { status: 404 });
  }
}
