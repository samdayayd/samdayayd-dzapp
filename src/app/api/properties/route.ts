import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/requireSeller";

const PROPERTY_TYPES = new Set(["APPARTEMENT", "MAISON", "TERRAIN", "LOCAL"]);
const COUNTRIES = new Set(["FRANCE", "ALGERIE"]);
const SALE_TYPES = new Set(["VENTE", "LOCATION"]);
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
    saleType,
    propertyType,
    rooms,
    surfaceM2,
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
    !propertyType ||
    rooms === undefined ||
    !surfaceM2 ||
    !contactName ||
    !contactEmail ||
    !contactPhone
  ) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }
  if (!COUNTRIES.has(country)) {
    return NextResponse.json({ code: "INVALID_COUNTRY" }, { status: 400 });
  }
  if (!PROPERTY_TYPES.has(propertyType)) {
    return NextResponse.json({ code: "INVALID_PROPERTY_TYPE" }, { status: 400 });
  }
  const resolvedSaleType = SALE_TYPES.has(saleType) ? saleType : "VENTE";
  if (typeof contactEmail !== "string" || !EMAIL_RE.test(contactEmail)) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }

  const property = await prisma.property.create({
    data: {
      title,
      description,
      price: Number(price),
      currency: currency ?? (country === "ALGERIE" ? "DZD" : "EUR"),
      country,
      city,
      saleType: resolvedSaleType,
      propertyType,
      rooms: Number(rooms),
      surfaceM2: Number(surfaceM2),
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

  return NextResponse.json({ id: property.id });
}
