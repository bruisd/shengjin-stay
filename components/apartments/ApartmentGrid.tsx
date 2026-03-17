"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ApartmentCard from "./ApartmentCard";
import ApartmentFilters from "./ApartmentFilters";
import type { Apartment } from "@/lib/types";

interface Filters {
  bedrooms: number | null;
  maxDistance: number | null;
}

interface ApartmentGridProps {
  apartments: Apartment[];
  locale: string;
}

function applyFilters(apartments: Apartment[], filters: Filters): Apartment[] {
  return apartments.filter((apt) => {
    // Bedrooms: if filter is 3, match >= 3; otherwise exact match
    if (filters.bedrooms !== null) {
      const beds = apt.bedrooms ?? 0;
      if (filters.bedrooms === 3) {
        if (beds < 3) return false;
      } else {
        if (beds !== filters.bedrooms) return false;
      }
    }

    // Distance
    if (filters.maxDistance !== null) {
      const dist = apt.distance_to_sea ?? 999;
      if (filters.maxDistance === 50 && dist > 50) return false;
      if (filters.maxDistance === 150 && (dist <= 50 || dist > 150)) return false;
      if (filters.maxDistance === 999 && dist <= 150) return false;
    }

    return true;
  });
}

// Alternate bento pattern: wide (8 cols), narrow (4 cols), narrow (4 cols), wide (8 cols), ...
function colSpanClass(index: number): string {
  const pattern = index % 4;
  if (pattern === 0 || pattern === 3) return "md:col-span-8";
  return "md:col-span-4";
}

function isFeaturedCard(index: number): boolean {
  const pattern = index % 4;
  return pattern === 0 || pattern === 3;
}

export default function ApartmentGrid({ apartments, locale }: ApartmentGridProps) {
  const t = useTranslations("listing");
  const [filters, setFilters] = useState<Filters>({ bedrooms: null, maxDistance: null });

  const filtered = applyFilters(apartments, filters);

  return (
    <div>
      <ApartmentFilters onFilterChange={setFilters} />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="font-display text-2xl font-bold text-slate-400 mb-6">{t("noResults")}</p>
          <button
            onClick={() => setFilters({ bedrooms: null, maxDistance: null })}
            className="font-display text-sm font-bold uppercase tracking-widest px-8 h-12 bg-primary text-white hover:bg-primary/90 transition-colors rounded-none"
          >
            {t("clearFilters")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {filtered.map((apartment, index) => (
            <div key={apartment.id} className={`col-span-1 ${colSpanClass(index)}`}>
              <ApartmentCard
                apartment={apartment}
                locale={locale}
                featured={isFeaturedCard(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
