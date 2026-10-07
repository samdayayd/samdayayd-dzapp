import { Heart, LogIn } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileCard } from "@/components/ProfileCard";

export const dynamic = "force-dynamic";

export default async function MarriageMatchesPage() {
  const t = await getTranslations("mariage");
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <LogIn size={26} />
        </div>
        <p className="mt-4 text-lg font-medium text-neutral-900">{t("create.loginRequiredTitle")}</p>
        <p className="mt-1 text-sm text-neutral-500">{t("create.loginRequiredBody")}</p>
        <Link href="/login" className="btn-primary mt-6">
          {t("create.loginCta")}
        </Link>
      </div>
    );
  }

  const myProfile = await prisma.marriageProfile.findUnique({ where: { userId: session.user.id } });

  if (!myProfile) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <Heart size={26} />
        </div>
        <p className="mt-4 text-lg font-medium text-neutral-900">{t("matches.noProfileTitle")}</p>
        <p className="mt-1 text-sm text-neutral-500">{t("matches.noProfileBody")}</p>
        <Link href="/mariage/nouvelle" className="btn-primary mt-6">
          {t("matches.createProfile")}
        </Link>
      </div>
    );
  }

  const sent = await prisma.marriageInterest.findMany({
    where: { fromProfileId: myProfile.id },
    select: { toProfileId: true },
  });
  const sentIds = sent.map((s) => s.toProfileId);

  const matches =
    sentIds.length === 0
      ? []
      : await prisma.marriageInterest.findMany({
          where: { fromProfileId: { in: sentIds }, toProfileId: myProfile.id },
          select: {
            fromProfile: {
              select: {
                id: true,
                displayName: true,
                age: true,
                city: true,
                country: true,
                religiousPractice: true,
                bio: true,
                photoUrl: true,
              },
            },
          },
        });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2 text-brand-700">
        <Heart size={20} strokeWidth={2.25} />
        <span className="text-sm font-semibold uppercase tracking-wide">{t("category")}</span>
      </div>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
        {t("matches.title")}
      </h1>
      <p className="mt-1 text-neutral-500">{t("matches.subtitle")}</p>

      {matches.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center gap-3 px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
            <Heart size={26} />
          </div>
          <p className="font-medium text-neutral-700">{t("matches.emptyTitle")}</p>
          <p className="text-sm text-neutral-500">{t("matches.emptyBody")}</p>
          <Link href="/mariage" className="btn-primary mt-2">
            {t("matches.browse")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map(({ fromProfile: profile }) => (
            <ProfileCard
              key={profile.id}
              href={`/mariage/${profile.id}`}
              photoUrl={profile.photoUrl}
              displayName={profile.displayName}
              age={profile.age}
              city={profile.city}
              country={t(`country.${profile.country}` as "country.FRANCE")}
              practiceBadge={t(`religiousPractice.${profile.religiousPractice}` as "religiousPractice.PRATIQUANT")}
              bioExcerpt={profile.bio}
            />
          ))}
        </div>
      )}
    </div>
  );
}
