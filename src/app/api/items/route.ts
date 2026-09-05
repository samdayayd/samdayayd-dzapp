import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/requireSeller";
import { isValidPositiveInt } from "@/lib/validateNumber";

const ITEM_CATEGORIES = new Set([
  "ELECTRONIQUE",
  "MEUBLE",
  "VETEMENTS",
  "LOISIRS",
  "MAISON",
  "AUTRE",
]);
const CONDITIONS = new Set(["NEUF", "OCCASION"]);
const COUNTRIES = new Set(["FRANCE", "ALGERIE"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const { sellerId, error } = await requireSeller();
  if (error) return error;

  const body = await req.json();
  const {
    title,
    description,
    price,
    currency,
    country,
    city,
    itemCategory,
    condition,
    contactName,
    contactEmail,
    contactPhone,
    imageUrls,
  } = body ?? {};

  if (
    !title ||
    !description ||
    !price ||
    !country ||
    !city ||
    !itemCategory ||
    !contactName ||
    !contactEmail ||
    !contactPhone
  ) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }
  if (!isValidPositiveInt(price)) {
    return NextResponse.json({ code: "INVALID_PRICE" }, { status: 400 });
  }
  if (!COUNTRIES.has(country)) {
    return NextResponse.json({ code: "INVALID_COUNTRY" }, { status: 400 });
  }
  if (!ITEM_CATEGORIES.has(itemCategory)) {
    return NextResponse.json({ code: "INVALID_ITEM_CATEGORY" }, { status: 400 });
  }
  const resolvedCondition = CONDITIONS.has(condition) ? condition : "OCCASION";
  if (typeof contactEmail !== "string" || !EMAIL_RE.test(contactEmail)) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }

  const item = await prisma.item.create({
    data: {
      title,
      description,
      price: Number(price),
      currency: currency ?? (country === "ALGERIE" ? "DZD" : "EUR"),
      country,
      city,
      itemCategory,
      condition: resolvedCondition,
      contactName,
      contactEmail,
      contactPhone,
      sellerId,
      images: {
        create: ((imageUrls as string[]) ?? []).map((url, position) => ({
          url,
          position,
        })),
      },
    },
  });

  return NextResponse.json({ id: item.id });
}
