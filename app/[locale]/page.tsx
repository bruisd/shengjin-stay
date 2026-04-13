export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import StructuredData from "@/components/ui/StructuredData";
import type { Apartment } from "@/lib/types";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ogLocale = locale === "sq" ? "sq_AL" : "en_US";
  const title = `${SITE_NAME} | Premium Coastal Apartments in Albania`;
  const description =
    "Discover premium apartments with breathtaking Adriatic sea views in Shëngjin, Albania. Modern coastal living at its finest.";

  return {
    title,
    description,
    alternates: {
      languages: { en: `${SITE_URL}/en`, sq: `${SITE_URL}/sq` },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      locale: ogLocale,
      images: [
        { url: HERO_IMAGE, width: 1200, height: 630, alt: "Shëngjin beach" },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [HERO_IMAGE],
    },
  };
}

const BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: SITE_NAME,
  description: "Premium coastal apartments in Shëngjin, Albania",
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Shëngjin",
    addressCountry: "AL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "41.8131",
    longitude: "19.5936",
  },
  image: HERO_IMAGE,
  telephone: "+355693776830",
};

function bedroomBadge(bedrooms: number | null) {
  if (!bedrooms) return "Studio";
  if (bedrooms >= 3) return "Penthouse";
  return `${bedrooms} Bed`;
}

interface BentoCardProps {
  apartment: Apartment;
}

function BentoCard({ apartment }: BentoCardProps) {
  const photo =
    apartment.photos?.[0] ??
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200";

  return (
    <Link
      href={`/apartments/${apartment.slug}`}
      className="group relative overflow-hidden bg-white border border-border-light flex flex-col no-underline aspect-[4/3]">
      {/* Background image */}
      <Image
        src={photo}
        alt={apartment.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative mt-auto p-6 lg:p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 bg-primary text-xs font-bold tracking-wider uppercase">
            {bedroomBadge(apartment.bedrooms)}
          </span>
          {apartment.area_m2 && (
            <span className="text-sm font-medium text-slate-200">
              {apartment.area_m2}m²
            </span>
          )}
        </div>
        <h3 className="font-display text-xl lg:text-3xl font-bold mb-2">
          {apartment.name}
        </h3>
        {apartment.description_en && (
          <p className="text-slate-200 text-sm line-clamp-2 max-w-sm">
            {apartment.description_en}
          </p>
        )}
      </div>
    </Link>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, tf, ta, ts] = await Promise.all([
    getTranslations("hero"),
    getTranslations("featured"),
    getTranslations("about"),
    getTranslations("stats"),
  ]);

  const supabase = await createServerSupabaseClient();
  const { data: apartments } = await supabase
    .from("apartments")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  const featured: Apartment[] = apartments ?? [];

  return (
    <>
      <StructuredData data={BUSINESS_SCHEMA} />
      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[100vh] w-full flex flex-col lg:flex-row pt-[72px] lg:pt-0">
        {/* Left: full-bleed image — 55% on desktop, 50vh on mobile */}
        <div className="h-[50vh] lg:h-full lg:w-[55%] relative">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC15r-aoSBTGRFazGfnB-JqgxY3Q8qGn7puZAmby14__34oKGEKz_HOFEpIgZOOO-L1VvTfVI4YW0NWy2zK__f24G1nzycjO6xzqRIMqjiIqj4cqH0WMc_UzN05ia-JsVoNx1JfxtOwgIFOZPFans7_uChD-ydd28CZhNoPyzp0vbgDEJjimFV9N9Oe2B2NQLiZYDm6oiniWA7_pY21K5MQZUgwbY1WCww9hI6b0pwRwFFeCm7wmApw_yWbs7RRonZvdvSExiF7wB-"
            alt="Shëngjin beach"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Right: content panel — 45% on desktop, 50vh on mobile */}
        <div className="h-[50vh] lg:h-full lg:w-[45%] bg-white flex items-center px-6 lg:px-16 xl:px-24 relative z-10">
          <div className="flex flex-col max-w-xl">
            {/* Heading — overflows left onto the image on desktop */}
            <h1 className="font-display text-text-main text-6xl lg:text-[100px] xl:text-[120px] font-black leading-[0.85] tracking-tighter mb-6 lg:absolute lg:left-[-30%] lg:top-[30%] lg:-translate-y-1/2 drop-shadow-sm lg:drop-shadow-none">
              SHËNGJIN
            </h1>

            {/* Subtitle + CTA — pushed below the absolute heading on desktop */}
            <div className="lg:mt-[120px]">
              <p className="text-slate-700 text-lg lg:text-xl font-normal leading-relaxed mb-10 max-w-md">
                {t("subtitle")}
              </p>
              <Link
                href="/apartments"
                className="inline-flex items-center justify-center h-14 px-8 bg-primary hover:bg-primary/90 transition-colors text-white text-base font-bold tracking-widest uppercase rounded-none group">
                {t("cta")}
                <svg
                  className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ABOUT ────────────────────────────────────────────────────────── */}
      <section
        id="about"
        className="py-24 px-6 lg:px-20 border-t border-border-light">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Left */}
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight uppercase">
              {ta("title")}
            </h2>
            <div className="h-1 w-12 bg-primary mt-6" />
          </div>

          {/* Right */}
          <div className="lg:col-span-8 space-y-6">
            <p className="lg:text-lg text-slate-700 leading-relaxed">
              {ta("p1")}
            </p>
            <p className="lg:text-lg text-slate-700 leading-relaxed">
              {ta("p2")}
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED APARTMENTS ──────────────────────────────────────────── */}
      <section
        id="apartments"
        className="py-24 bg-slate-50 border-t border-border-light">
        <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="font-display text-3xl lg:text-5xl font-black tracking-tight uppercase mb-3">
                {tf("title")}
              </h2>
              <p className="text-slate-500 text-lg">{tf("subtitle")}</p>
            </div>
            <Link
              href="/apartments"
              className="hidden lg:inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm hover:opacity-80 transition-opacity no-underline group">
              {tf("viewAll")}
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {/* Featured grid */}
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((apt) => (
                <BentoCard key={apt.id} apartment={apt} />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-20">
              No apartments available yet.
            </p>
          )}

          {/* Mobile: view all link */}
          <div className="mt-10 text-center lg:hidden">
            <Link
              href="/apartments"
              className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm hover:opacity-80 transition-opacity no-underline">
              {tf("viewAll")}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. TRUST SIGNALS ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-20 border-t border-border-light">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 max-w-[1400px] mx-auto">
          {[
            { value: "15+", label: ts("units") },
            { value: "50m", label: ts("beach") },
            { value: "4.9", label: ts("rating") },
            { value: "24/7", label: ts("concierge") },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-5xl lg:text-6xl font-black text-primary mb-2">
                {value}
              </p>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
