import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/requireSeller";

const FUEL_TYPES = new Set(["ESSENCE", "DIESEL", "ELECTRIQUE", "HYBRIDE", "GPL"]);
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
    make,
    model,
    year,
    mileageKm,
    fuelType,
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
    !make ||
    !model ||
    !year ||
    mileageKm === undefined ||
    !fuelType ||
    !contactName ||
    !contactEmail ||
    !contactPhone
  ) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }
  if (!COUNTRIES.has(country)) {
    return NextResponse.json({ code: "INVALID_COUNTRY" }, { status: 400 });
  }
  if (!FUEL_TYPES.has(fuelType)) {
    return NextResponse.json({ code: "INVALID_FUEL_TYPE" }, { status: 400 });
  }
  const resolvedSaleType = SALE_TYPES.has(saleType) ? saleType : "VENTE";
  if (typeof contactEmail !== "string" || !EMAIL_RE.test(contactEmail)) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      price: Number(price),
      currency: currency ?? (country === "ALGERIE" ? "DZD" : "EUR"),
      country,
      city,
      saleType: resolvedSaleType,
      make,
      model,
      year: Number(year),
      mileageKm: Number(mileageKm),
      fuelType,
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

  return NextResponse.json({ id: listing.id });
}
