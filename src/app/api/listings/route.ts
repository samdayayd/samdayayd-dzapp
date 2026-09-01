import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const FUEL_TYPES = new Set(["ESSENCE", "DIESEL", "ELECTRIQUE", "HYBRIDE", "GPL"]);
const COUNTRIES = new Set(["FRANCE", "ALGERIE"]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    description,
    price,
    currency,
    country,
    city,
    make,
    model,
    year,
    mileageKm,
    fuelType,
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
    !fuelType
  ) {
    return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
  }
  if (!COUNTRIES.has(country)) {
    return NextResponse.json({ code: "INVALID_COUNTRY" }, { status: 400 });
  }
  if (!FUEL_TYPES.has(fuelType)) {
    return NextResponse.json({ code: "INVALID_FUEL_TYPE" }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      price: Number(price),
      currency: currency ?? (country === "ALGERIE" ? "DZD" : "EUR"),
      country,
      city,
      make,
      model,
      year: Number(year),
      mileageKm: Number(mileageKm),
      fuelType,
      sellerId: session.user.id,
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
