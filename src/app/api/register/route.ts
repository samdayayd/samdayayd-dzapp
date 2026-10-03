import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/** Constant-time string compare — used for the bootstrap code so a wrong
    guess can't be narrowed down by response timing. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  const { email, password, name, inviteCode } = await req.json();

  if (!email || !password || !name || !inviteCode) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ code: "PASSWORD_TOO_SHORT" }, { status: 400 });
  }

  const trimmedCode = String(inviteCode).trim();

  // There's no seeded owner account here (unlike a single-owner tool) —
  // registration used to be fully open, so the very first user always
  // just signed up directly. Gating it on invite codes alone would mean
  // a database with zero users (true on first deploy, and true again
  // after any reset — this app's SQLite is still ephemeral on Render's
  // free tier) has no possible way for anyone, ever, to create the first
  // account that could then invite others. BOOTSTRAP_INVITE_CODE is an
  // env-set escape hatch that isn't tied to the database at all, so it
  // survives resets — see README's "Invite-only signup" section.
  const bootstrapCode = process.env.BOOTSTRAP_INVITE_CODE;
  const isBootstrap = Boolean(bootstrapCode) && safeEqual(trimmedCode, bootstrapCode!);

  let invite: { id: string } | null = null;
  if (!isBootstrap) {
    const found = await prisma.inviteCode.findUnique({ where: { code: trimmedCode } });
    if (!found) {
      return NextResponse.json({ code: "INVALID_INVITE_CODE" }, { status: 400 });
    }
    if (found.usedAt !== null) {
      return NextResponse.json({ code: "INVITE_CODE_USED" }, { status: 400 });
    }
    invite = found;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ code: "EMAIL_TAKEN" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, passwordHash },
  });

  if (invite) {
    // Claim the invite atomically on the DB itself (not the read above) so
    // two signups racing on the same code can't both succeed — whichever
    // commits this updateMany first wins the usedAt: null guard, the
    // second gets count 0 and is rejected instead of overwriting the
    // first's claim.
    const claim = await prisma.inviteCode.updateMany({
      where: { id: invite.id, usedAt: null },
      data: { usedById: user.id, usedAt: new Date() },
    });
    if (claim.count === 0) {
      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json({ code: "INVITE_CODE_USED" }, { status: 400 });
    }
  }

  return NextResponse.json({ id: user.id, email: user.email, name: user.name });
}
