export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { createServiceRoleClient } from "@/lib/supabaseServer";

const BASE_URL = "https://shengjinstay.com";
const LOCALES = ["en", "sq"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServiceRoleClient();
  const { data: apartments } = await supabase
    .from("apartments")
    .select("slug, created_at")
    .eq("is_published", true);

  const staticPages = ["/", "/apartments", "/contact"];

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page === "/" ? "" : page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "/" ? 1 : 0.8,
    }))
  );

  const apartmentEntries: MetadataRoute.Sitemap = (apartments ?? []).flatMap((apt) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/apartments/${apt.slug}`,
      lastModified: new Date(apt.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))
  );

  return [...staticEntries, ...apartmentEntries];
}
