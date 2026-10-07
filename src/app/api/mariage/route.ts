import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/requireSeller";

const GENDERS = new Set(["HOMME", "FEMME"]);
const RELIGIOUS_PRACTICE = new Set(["PRATIQUANT", "MODEREMENT_PRATIQUANT", "NON_PRATIQUANT"]);
const MARITAL_STATUS = new Set(["CELIBATAIRE", "DIVORCE", "VEUF"]);
const WANTS_CHILDREN = new Set(["OUI", "NON", "PEUT_ETRE"]);
const COUNTRIES = new Set(["FRANCE", "ALGERIE"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_AGE = 18;
const MAX_AGE = 100;

/** One profile per user — this is an upsert, not a create: posting again
    edits the existing profile instead of making a second one, since the
    schema enforces a single MarriageProfile per userId anyway. */
export async function POST(req: Request) {
  const { sellerId, error } = await requireSeller();
  if (error) return error;

  const body = await req.json();
  const {
    displayName,
    age,
    gender,
    lookingForGender,
    country,
    city,
    religiousPractice,
    maritalStatus,
    wantsChildren,
    bio,
    photoUrl,
    contactEmail,
    contactPhone,
  } = body ?? {};

  if (!displayName || !country || !city || !bio || !contactEmail || !contactPhone) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }
  if (!Number.isInteger(Number(age)) || Number(age) < MIN_AGE || Number(age) > MAX_AGE) {
    return NextResponse.json({ code: "INVALID_AGE" }, { status: 400 });
  }
  if (!GENDERS.has(gender) || !GENDERS.has(lookingForGender)) {
    return NextResponse.json({ code: "INVALID_GENDER" }, { status: 400 });
  }
  if (!COUNTRIES.has(country)) {
    return NextResponse.json({ code: "INVALID_COUNTRY" }, { status: 400 });
  }
  if (!RELIGIOUS_PRACTICE.has(religiousPractice)) {
    return NextResponse.json({ code: "INVALID_RELIGIOUS_PRACTICE" }, { status: 400 });
  }
  if (!MARITAL_STATUS.has(maritalStatus)) {
    return NextResponse.json({ code: "INVALID_MARITAL_STATUS" }, { status: 400 });
  }
  if (!WANTS_CHILDREN.has(wantsChildren)) {
    return NextResponse.json({ code: "INVALID_WANTS_CHILDREN" }, { status: 400 });
  }
  if (typeof contactEmail !== "string" || !EMAIL_RE.test(contactEmail)) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }

  const data = {
    displayName,
    age: Number(age),
    gender,
    lookingForGender,
    country,
    city,
    religiousPractice,
    maritalStatus,
    wantsChildren,
    bio,
    photoUrl: photoUrl || null,
    contactEmail,
    contactPhone,
  };

  const profile = await prisma.marriageProfile.upsert({
    where: { userId: sellerId },
    create: { ...data, userId: sellerId },
    update: data,
  });

  return NextResponse.json({ id: profile.id });
}
