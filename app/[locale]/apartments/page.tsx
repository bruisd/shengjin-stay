export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import ApartmentGrid from "@/components/apartments/ApartmentGrid";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ogLocale = locale === "sq" ? "sq_AL" : "en_US";
  const title = `All Apartments | ${SITE_NAME}`;
  const description =
    "Browse our curated collection of coastal apartments in Shëngjin, Albania. Filter by bedrooms and distance to sea.";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: `${SITE_URL}/en/apartments`,
        sq: `${SITE_URL}/sq/apartments`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/apartments`,
      siteName: SITE_NAME,
      locale: ogLocale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ApartmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("listing");

  const supabase = await createServerSupabaseClient();
  const { data: apartments, error } = await supabase
    .from("apartments")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error.message);
  }

  const list = apartments ?? [];

  return (
    <div className="flex flex-col min-h-screen font-body px-6 lg:px-12 py-8 pt-24">
      <h1 className="font-display text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none mb-12">
        {t("title")}
      </h1>
      <ApartmentGrid apartments={list} locale={locale} />
    </div>
  );
}
