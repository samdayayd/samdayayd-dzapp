import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import {
  Briefcase,
  Building2,
  ChevronRight,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { formatSalaryRange } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations("emploi");

  const job = await prisma.job.findUnique({
    where: { id },
    include: { seller: { select: { name: true, verified: true, createdAt: true } } },
  });

  if (!job) notFound();

  const specs = [
    { icon: Briefcase, label: t("detail.jobType"), value: t(`jobType.${job.jobType}` as "jobType.CDI") },
    { icon: Building2, label: t("detail.company"), value: job.company },
    { icon: MapPin, label: t("detail.location"), value: `${job.city}, ${t(`country.${job.country}` as "country.FRANCE")}` },
    { icon: Globe, label: t("detail.remote"), value: job.remote ? t("detail.remoteYes") : t("detail.remoteNo") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <nav className="mb-5 flex items-center gap-1 text-sm text-neutral-500">
        <Link href="/emploi" className="hover:text-brand-700">
          {t("category")}
        </Link>
        <ChevronRight size={14} className="rtl:rotate-180" />
        <span className="truncate text-neutral-700">{job.title}</span>
      </nav>

      <h1 className="mb-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{job.title}</h1>
      <p className="mb-6 text-lg text-neutral-500">{job.company}</p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="flex aspect-[4/2] items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400">
            <Briefcase size={48} strokeWidth={1.5} />
          </div>

          <div className="card mt-6 p-5">
            <h2 className="font-semibold text-neutral-900">{t("detail.specsTitle")}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon size={15} />
                  </div>
                  <div>
                    <dt className="text-xs text-neutral-500">{label}</dt>
                    <dd className="text-sm font-medium text-neutral-900">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-neutral-900">{t("detail.descriptionTitle")}</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-neutral-700">{job.description}</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="sticky top-20 space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-neutral-500">{t("detail.salary")}</p>
                {job.remote && <span className="badge bg-accent-500 text-white shrink-0">{t("detail.remoteYes")}</span>}
              </div>
              <p className="mt-1 text-2xl font-extrabold text-brand-700">
                {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency, locale, t("salaryNotSpecified"))}
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">
                  {job.contactName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="flex items-center gap-1.5 font-medium text-neutral-900">
                    {job.contactName}
                    {job.seller.verified && (
                      <span className="badge-brand !py-0.5">
                        <ShieldCheck size={12} />
                        {t("detail.verified")}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500">{t("detail.sellerDefault")}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <a href={`tel:${job.contactPhone}`} className="btn-primary w-full">
                  <Phone size={16} />
                  {t("detail.call")}
                </a>
                <a href={`mailto:${job.contactEmail}`} className="btn-secondary w-full">
                  <Mail size={16} />
                  {t("detail.email")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
