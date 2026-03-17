"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { Apartment } from "@/lib/types";

interface PropertyTableProps {
  apartments: Apartment[];
}

export default function PropertyTable({ apartments }: PropertyTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function togglePublished(apt: Apartment) {
    setLoadingId(apt.id);
    const supabase = createClient();
    await supabase
      .from("apartments")
      .update({ is_published: !apt.is_published })
      .eq("id", apt.id);
    setLoadingId(null);
    router.refresh();
  }

  async function deleteApartment(apt: Apartment) {
    if (!window.confirm(`Delete "${apt.name}"? This cannot be undone.`)) return;
    setLoadingId(apt.id);
    const supabase = createClient();

    // Remove photos from storage
    if (apt.photos?.length > 0) {
      const paths = apt.photos
        .map((url) => {
          const match = url.match(/\/storage\/v1\/object\/public\/apartments\/(.*)/);
          return match ? decodeURIComponent(match[1]) : null;
        })
        .filter((p): p is string => p !== null);

      if (paths.length > 0) {
        await supabase.storage.from("apartments").remove(paths);
      }
    }

    await supabase.from("apartments").delete().eq("id", apt.id);
    setLoadingId(null);
    router.refresh();
  }

  return (
    <div className="rounded-admin-lg border border-slate-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[40%]">Property</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[20%]">Distance to Sea</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[15%]">Bedrooms</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[15%]">Status</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[10%]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {apartments.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-sm">
                No properties yet.{" "}
                <Link href="/admin/properties/new" className="text-admin-primary font-semibold hover:underline">
                  Add your first property →
                </Link>
              </td>
            </tr>
          )}

          {apartments.map((apt) => (
            <tr key={apt.id} className="hover:bg-slate-50 group">
              {/* Property */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-admin bg-slate-100 overflow-hidden flex-shrink-0">
                    {apt.photos?.[0] ? (
                      <Image
                        src={apt.photos[0]}
                        alt={apt.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="m21 15-5-5L5 21" />
                          <circle cx="9" cy="9" r="2" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{apt.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {apt.bedrooms != null ? `${apt.bedrooms} beds` : "—"}
                      {apt.area_m2 != null ? ` · ${apt.area_m2}m²` : ""}
                    </p>
                  </div>
                </div>
              </td>

              {/* Distance */}
              <td className="px-6 py-4 text-sm text-slate-600">
                {apt.distance_to_sea != null ? `${apt.distance_to_sea}m` : "—"}
              </td>

              {/* Bedrooms */}
              <td className="px-6 py-4 text-sm text-slate-600">
                {apt.bedrooms ?? "—"}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <button
                  onClick={() => togglePublished(apt)}
                  disabled={loadingId === apt.id}
                  title="Click to toggle status"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-admin-full text-xs font-bold transition-opacity disabled:opacity-50 cursor-pointer ${
                    apt.is_published
                      ? "bg-admin-primary/10 text-admin-primary"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      apt.is_published ? "bg-admin-primary" : "bg-orange-500"
                    }`}
                  />
                  {apt.is_published ? "Published" : "Draft"}
                </button>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/admin/properties/${apt.id}/edit`}
                    className="p-1.5 text-slate-400 hover:text-admin-primary transition-colors rounded"
                    title="Edit"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => deleteApartment(apt)}
                    disabled={loadingId === apt.id}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded disabled:opacity-50"
                    title="Delete"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
