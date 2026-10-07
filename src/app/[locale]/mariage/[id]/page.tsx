import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronRight, Heart, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ExpressInterestButton } from "@/components/ExpressInterestButton";

export const dynamic = "force-dynamic";

export default async function MarriageProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("mariage");

  // No contact fields here — this is the same select every visitor gets,
  // match or no match. Contact info is only ever fetched below, and only
  // once a mutual match is actually confirmed server-side.
  const profile = await prisma.marriageProfile.findUnique({
    where: { id },
    select: {
      id: true,
      displayName: true,
      age: true,
      gender: true,
      city: true,
      country: true,
      religiousPractice: true,
      maritalStatus: true,
      wantsChildren: true,
      bio: true,
      photoUrl: true,
      userId: true,
      user: { select: { verified: true } },
    },
  });

  if (!profile) notFound();

  const session = await auth();
  const isOwnProfile = session?.user?.id === profile.userId;

  let interestState: "none" | "sent" | "matched" = "none";
  let initialContact: { email: string; phone: string } | undefined;

  if (session?.user && !isOwnProfile) {
    const myProfile = await prisma.marriageProfile.findUnique({ where: { userId: session.user.id } });
    if (myProfile) {
      const [sent, received] = await Promise.all([
        prisma.marriageInterest.findUnique({
          where: { fromProfileId_toProfileId: { fromProfileId: myProfile.id, toProfileId: profile.id } },
        }),
        prisma.marriageInterest.findUnique({
          where: { fromProfileId_toProfileId: { fromProfileId: profile.id, toProfileId: myProfile.id } },
        }),
      ]);
      if (sent && received) {
        interestState = "matched";
        const full = await prisma.marriageProfile.findUnique({
          where: { id: profile.id },
          select: { contactEmail: true, contactPhone: true },
        });
        initialContact = { email: full!.contactEmail, phone: full!.contactPhone };
      } else if (sent) {
        interestState = "sent";
      }
    }
  }

  const specs = [
    { label: t("detail.age"), value: String(profile.age) },
    { label: t("detail.maritalStatus"), value: t(`maritalStatus.${profile.maritalStatus}` as "maritalStatus.CELIBATAIRE") },
    { label: t("detail.religiousPractice"), value: t(`religiousPractice.${profile.religiousPractice}` as "religiousPractice.PRATIQUANT") },
    { label: t("detail.wantsChildren"), value: t(`wantsChildren.${profile.wantsChildren}` as "wantsChildren.OUI") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <nav className="mb-5 flex items-center gap-1 text-sm text-neutral-500">
        <Link href="/mariage" className="hover:text-brand-700">
          {t("category")}
        </Link>
        <ChevronRight size={14} className="rtl:rotate-180" />
        <span className="truncate text-neutral-700">{profile.displayName}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400">
            <Heart size={56} strokeWidth={1.5} />
          </div>

          <div className="mt-6 flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {profile.displayName}, {profile.age}
            </h1>
            {profile.user.verified && (
              <span className="badge-brand !py-0.5">
                <ShieldCheck size={12} />
                {t("detail.verified")}
              </span>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1 text-neutral-500">
            <MapPin size={14} /> {profile.city}, {t(`country.${profile.country}` as "country.FRANCE")}
          </p>

          <div className="card mt-6 p-5">
            <h2 className="font-semibold text-neutral-900">{t("detail.specsTitle")}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              {specs.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-neutral-500">{label}</dt>
                  <dd className="text-sm font-medium text-neutral-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-neutral-900">{t("detail.bioTitle")}</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-neutral-700">{profile.bio}</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="sticky top-20">
            {isOwnProfile ? (
              <div className="card p-5">
                <p className="text-sm text-neutral-600">{t("detail.ownProfile")}</p>
                <Link href="/mariage/nouvelle" className="btn-secondary mt-3 w-full">
                  {t("detail.editProfile")}
                </Link>
              </div>
            ) : (
              <ExpressInterestButton
                profileId={profile.id}
                initialState={interestState}
                initialContact={initialContact}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
