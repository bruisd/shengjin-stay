export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import PhotoGallery from "@/components/apartments/PhotoGallery";
import ContactBar from "@/components/apartments/ContactBar";
import StructuredData from "@/components/ui/StructuredData";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: apt } = await supabase
    .from("apartments")
    .select("name, slug, description_en, description_al, photos")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!apt) return {};

  const rawDesc =
    locale === "sq" && apt.description_al ? apt.description_al : (apt.description_en ?? "");
  const description = rawDesc.slice(0, 160);
  const title = `${apt.name} | ${SITE_NAME}`;
  const image = apt.photos?.[0];
  const ogLocale = locale === "sq" ? "sq_AL" : "en_US";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: `${SITE_URL}/en/apartments/${slug}`,
        sq: `${SITE_URL}/sq/apartments/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/apartments/${slug}`,
      siteName: SITE_NAME,
      locale: ogLocale,
      type: "website",
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: apt.name }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function BedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
    </svg>
  );
}

function ShowerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 4 2.5 2.5"/><path d="M13.5 6.5a4.95 4.95 0 0 0-7 7"/><path d="M15 5 5 15"/>
      <path d="M14 17v.01"/><path d="M10 16v.01"/><path d="M13 13v.01"/><path d="M16 10v.01"/>
      <path d="M11 20v.01"/><path d="M17 14v.01"/><path d="M20 11v.01"/>
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/>
      <path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>
    </svg>
  );
}

function WavesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("detail");

  const supabase = await createServerSupabaseClient();
  const { data: apartment } = await supabase
    .from("apartments")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!apartment) notFound();

  const description =
    locale === "sq" && apartment.description_al
      ? apartment.description_al
      : apartment.description_en ?? "";

  const specs = [
    {
      icon: <BedIcon />,
      value: apartment.bedrooms != null ? `${apartment.bedrooms}` : "—",
      label: t("bedrooms"),
    },
    {
      icon: <ShowerIcon />,
      value: apartment.bathrooms != null ? `${apartment.bathrooms}` : "—",
      label: t("bathrooms"),
    },
    {
      icon: <RulerIcon />,
      value: apartment.area_m2 != null ? `${apartment.area_m2}m²` : "—",
      label: t("area"),
    },
    {
      icon: <WavesIcon />,
      value: apartment.distance_to_sea != null ? `${apartment.distance_to_sea}m` : "—",
      label: t("toSea"),
    },
  ];

  const apartmentSchema = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: apartment.name,
    description,
    numberOfRooms: apartment.bedrooms,
    numberOfBathroomsTotal: apartment.bathrooms,
    ...(apartment.area_m2 && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: apartment.area_m2,
        unitCode: "MTK",
      },
    }),
    image: apartment.photos,
    url: `${SITE_URL}/${locale}/apartments/${apartment.slug}`,
    containedInPlace: {
      "@type": "LodgingBusiness",
      name: SITE_NAME,
    },
  };

  return (
    <div className="pb-24">
      <StructuredData data={apartmentSchema} />
      {/* Gallery — full bleed */}
      <PhotoGallery photos={apartment.photos ?? []} apartmentName={apartment.name} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 flex flex-col lg:flex-row gap-16">
        {/* ── Left column ──────────────────────────────────────────────── */}
        <div className="w-full lg:w-3/5 flex flex-col gap-8">
          {/* Name + location */}
          <div>
            <h1 className="font-display font-black text-4xl md:text-5xl leading-tight mb-3 text-slate-900">
              {apartment.name}
            </h1>
            <div className="flex items-center gap-2 text-text-secondary">
              <span className="text-primary"><PinIcon /></span>
              <span className="text-sm uppercase tracking-wide font-medium">Shëngjin, Albania</span>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="flex flex-col gap-4">
              {description.split("\n\n").map((para: string, i: number) => (
                <p key={i} className="text-xl leading-relaxed text-slate-700">
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* Amenities */}
          {apartment.amenities?.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-2xl mb-6 pb-4 border-b border-border-light">
                {t("amenities")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {apartment.amenities.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-3">
                    <span className="text-primary flex-shrink-0"><CheckIcon /></span>
                    <span className="text-slate-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white border border-border-light p-8 sticky top-24">
            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {specs.map((spec) => (
                <div key={spec.label} className="flex flex-col gap-2">
                  <span className="text-slate-400">{spec.icon}</span>
                  <span className="font-display font-bold text-lg text-slate-900">{spec.value}</span>
                  <span className="text-sm text-slate-500">{spec.label}</span>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <a
              href="/contact"
              className="block w-full mt-4 bg-primary text-white py-4 font-display font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors rounded-none text-center text-sm"
            >
              {t("contactUs")}
            </a>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <ContactBar apartmentName={apartment.name} />
    </div>
  );
}
