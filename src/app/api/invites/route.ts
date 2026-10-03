import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/requireSeller";
import { generateInviteCode } from "@/lib/inviteCode";

// Collision odds against the 32-character alphabet are negligible (see
// inviteCode.ts), but the DB's unique constraint is the real backstop —
// this bounds how many times a freak collision gets retried before giving
// up loudly instead of looping forever.
const MAX_CODE_GENERATION_ATTEMPTS = 5;

export async function POST() {
  const { sellerId, error } = await requireSeller();
  if (error) return error;

  let code: string | null = null;
  for (let i = 0; i < MAX_CODE_GENERATION_ATTEMPTS; i++) {
    const candidate = generateInviteCode();
    const existing = await prisma.inviteCode.findUnique({ where: { code: candidate } });
    if (!existing) {
      code = candidate;
      break;
    }
  }
  if (!code) {
    return NextResponse.json({ code: "GENERIC" }, { status: 500 });
  }

  const invite = await prisma.inviteCode.create({
    data: { code, createdById: sellerId },
  });

  return NextResponse.json({
    code: invite.code,
    createdAt: invite.createdAt,
    usedAt: null,
    usedByEmail: null,
  });
}

export async function GET() {
  const { sellerId, error } = await requireSeller();
  if (error) return error;

  const invites = await prisma.inviteCode.findMany({
    where: { createdById: sellerId },
    orderBy: { createdAt: "desc" },
    include: { usedBy: { select: { email: true } } },
  });

  return NextResponse.json(
    invites.map((invite) => ({
      code: invite.code,
      createdAt: invite.createdAt,
      usedAt: invite.usedAt,
      usedByEmail: invite.usedBy?.email ?? null,
    }))
  );
}
