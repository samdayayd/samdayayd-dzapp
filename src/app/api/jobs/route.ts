import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/requireSeller";
import { isValidPositiveInt } from "@/lib/validateNumber";

const JOB_TYPES = new Set(["CDI", "CDD", "STAGE", "FREELANCE", "INTERIM"]);
const COUNTRIES = new Set(["FRANCE", "ALGERIE"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const { sellerId, error } = await requireSeller();
  if (error) return error;

  const body = await req.json();
  const {
    title,
    description,
    company,
    country,
    city,
    jobType,
    remote,
    salaryMin,
    salaryMax,
    currency,
    contactName,
    contactEmail,
    contactPhone,
  } = body ?? {};

  if (
    !title ||
    !description ||
    !company ||
    !country ||
    !city ||
    !contactName ||
    !contactEmail ||
    !contactPhone
  ) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }
  if (!COUNTRIES.has(country)) {
    return NextResponse.json({ code: "INVALID_COUNTRY" }, { status: 400 });
  }
  if (!JOB_TYPES.has(jobType)) {
    return NextResponse.json({ code: "INVALID_JOB_TYPE" }, { status: 400 });
  }
  if (salaryMin != null && !isValidPositiveInt(salaryMin)) {
    return NextResponse.json({ code: "INVALID_PRICE" }, { status: 400 });
  }
  if (salaryMax != null && !isValidPositiveInt(salaryMax)) {
    return NextResponse.json({ code: "INVALID_PRICE" }, { status: 400 });
  }
  if (typeof contactEmail !== "string" || !EMAIL_RE.test(contactEmail)) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      title,
      description,
      company,
      country,
      city,
      jobType,
      remote: Boolean(remote),
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      currency: currency ?? (country === "ALGERIE" ? "DZD" : "EUR"),
      contactName,
      contactEmail,
      contactPhone,
      sellerId,
    },
  });

  return NextResponse.json({ id: job.id });
}
