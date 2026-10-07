import { Heart, LogIn } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MarriageProfileForm } from "@/components/MarriageProfileForm";

export const dynamic = "force-dynamic";

export default async function NewMarriageProfilePage() {
  const t = await getTranslations("mariage.create");
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <LogIn size={26} />
        </div>
        <p className="mt-4 text-lg font-medium text-neutral-900">{t("loginRequiredTitle")}</p>
        <p className="mt-1 text-sm text-neutral-500">{t("loginRequiredBody")}</p>
        <Link href="/login" className="btn-primary mt-6">
          {t("loginCta")}
        </Link>
      </div>
    );
  }

  const existing = await prisma.marriageProfile.findUnique({ where: { userId: session.user.id } });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Heart size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            {existing ? t("editTitle") : t("title")}
          </h1>
          <p className="text-sm text-neutral-500">{t("subtitle")}</p>
        </div>
      </div>

      <MarriageProfileForm initialProfile={existing} />
    </div>
  );
}
