import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Confirms the signed-in session's user still exists in the database.
    On Render's free tier the SQLite file resets on every redeploy while
    browser session cookies (signed with the same stable AUTH_SECRET)
    survive — so a visitor can stay "logged in" as a user id that no
    longer exists, and any create-listing insert then crashes on the
    seller foreign key. Catch that here with a clear error instead. */
export async function requireSeller() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 }) };
  }

  const seller = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });
  if (!seller) {
    return { error: NextResponse.json({ code: "SESSION_STALE" }, { status: 401 }) };
  }

  return { sellerId: seller.id };
}
