import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/requireSeller";

/** Expresses interest in a profile. A match is just "both directions of
    MarriageInterest exist" — checked here after inserting, not stored as
    a separate row, so there's one source of truth. Idempotent: liking
    someone twice is a no-op, not an error. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { sellerId, error } = await requireSeller();
  if (error) return error;

  const { id: toProfileId } = await params;

  const myProfile = await prisma.marriageProfile.findUnique({ where: { userId: sellerId } });
  if (!myProfile) {
    return NextResponse.json({ code: "PROFILE_REQUIRED" }, { status: 403 });
  }
  if (myProfile.id === toProfileId) {
    return NextResponse.json({ code: "CANNOT_LIKE_SELF" }, { status: 400 });
  }

  const target = await prisma.marriageProfile.findUnique({ where: { id: toProfileId } });
  if (!target || target.status !== "ACTIVE") {
    return NextResponse.json({ code: "NOT_FOUND" }, { status: 404 });
  }

  await prisma.marriageInterest.upsert({
    where: { fromProfileId_toProfileId: { fromProfileId: myProfile.id, toProfileId } },
    create: { fromProfileId: myProfile.id, toProfileId },
    update: {},
  });

  const reverse = await prisma.marriageInterest.findUnique({
    where: { fromProfileId_toProfileId: { fromProfileId: toProfileId, toProfileId: myProfile.id } },
  });

  // Contact info only ever leaves the server in this one response, and
  // only once mutual interest is actually confirmed in this request —
  // never rendered into any page's HTML before a match is real.
  if (reverse) {
    return NextResponse.json({
      matched: true,
      contactEmail: target.contactEmail,
      contactPhone: target.contactPhone,
    });
  }
  return NextResponse.json({ matched: false });
}
