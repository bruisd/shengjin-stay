"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface Filters {
  bedrooms: number | null;
  maxDistance: number | null;
}

interface ApartmentFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

const BEDROOM_OPTIONS = [
  { labelKey: "filters.all", value: null },
  { labelKey: "filters.beds1", value: 1 },
  { labelKey: "filters.beds2", value: 2 },
  { labelKey: "filters.beds3", value: 3 },
] as const;

const DISTANCE_OPTIONS = [
  { labelKey: "filters.all", value: null },
  { labelKey: "filters.beachfront", value: 50 },
  { labelKey: "filters.nearBeach", value: 150 },
  { labelKey: "filters.shortWalk", value: 999 },
] as const;

type DropdownKey = "bedrooms" | "distance" | null;

export default function ApartmentFilters({ onFilterChange }: ApartmentFiltersProps) {
  const t = useTranslations();
  const [filters, setFilters] = useState<Filters>({ bedrooms: null, maxDistance: null });
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
    setOpenDropdown(null);
  }

  const bedroomActive = filters.bedrooms !== null;
  const distanceActive = filters.maxDistance !== null;

  return (
    <div ref={containerRef} className="flex flex-wrap items-center gap-6 md:gap-8 border-b border-slate-200 pb-4 mb-10">
      {/* Label */}
      <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        {t("listing.filterBy")}
      </span>

      {/* Bedrooms filter */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === "bedrooms" ? null : "bedrooms")}
          className="flex items-center gap-2"
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              bedroomActive ? "bg-coral-blush" : "bg-transparent border border-slate-300"
            }`}
          />
          <span
            className={`font-display text-sm font-bold uppercase tracking-[0.1em] transition-colors ${
              bedroomActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {t("listing.bedrooms")}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`text-slate-400 transition-transform ${openDropdown === "bedrooms" ? "rotate-180" : ""}`}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {openDropdown === "bedrooms" && (
          <div className="absolute top-full left-0 mt-2 z-20 bg-white border border-slate-200 shadow-lg min-w-[160px]">
            {BEDROOM_OPTIONS.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setFilter("bedrooms", opt.value as number | null)}
                className={`w-full text-left px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-colors ${
                  filters.bedrooms === opt.value
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Distance filter */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === "distance" ? null : "distance")}
          className="flex items-center gap-2"
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              distanceActive ? "bg-coral-blush" : "bg-transparent border border-slate-300"
            }`}
          />
          <span
            className={`font-display text-sm font-bold uppercase tracking-[0.1em] transition-colors ${
              distanceActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {t("listing.distance")}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`text-slate-400 transition-transform ${openDropdown === "distance" ? "rotate-180" : ""}`}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {openDropdown === "distance" && (
          <div className="absolute top-full left-0 mt-2 z-20 bg-white border border-slate-200 shadow-lg min-w-[200px]">
            {DISTANCE_OPTIONS.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setFilter("maxDistance", opt.value as number | null)}
                className={`w-full text-left px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-colors ${
                  filters.maxDistance === opt.value
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear button — shown when any filter is active */}
      {(bedroomActive || distanceActive) && (
        <button
          onClick={() => {
            const reset = { bedrooms: null, maxDistance: null };
            setFilters(reset);
            onFilterChange(reset);
          }}
          className="ml-auto font-display text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-2"
        >
          {t("listing.clearFilters")}
        </button>
      )}
    </div>
  );
}
