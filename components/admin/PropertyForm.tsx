"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import type { Apartment } from "@/lib/types";

interface PropertyFormProps {
  apartment?: Apartment;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const INPUT = "w-full px-4 py-3 border border-slate-200 rounded-admin focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none text-sm transition-colors";
const LABEL = "block text-sm font-semibold text-slate-700 mb-2";

export default function PropertyForm({ apartment }: PropertyFormProps) {
  const router = useRouter();
  const isEdit = !!apartment;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: apartment?.name ?? "",
    slug: apartment?.slug ?? "",
    description_en: apartment?.description_en ?? "",
    description_al: apartment?.description_al ?? "",
    area_m2: apartment?.area_m2?.toString() ?? "",
    bedrooms: apartment?.bedrooms?.toString() ?? "",
    bathrooms: apartment?.bathrooms?.toString() ?? "",
    distance_to_sea: apartment?.distance_to_sea?.toString() ?? "",
    amenities: apartment?.amenities?.join(", ") ?? "",
    is_published: apartment?.is_published ?? false,
  });

  const [photos, setPhotos] = useState<string[]>(apartment?.photos ?? []);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleNameChange(value: string) {
    setForm((f) => ({
      ...f,
      name: value,
      slug: slugManuallyEdited ? f.slug : generateSlug(value),
    }));
  }

  async function handlePhotoUpload(files: FileList) {
    if (!files.length) return;
    setUploading(true);
    setUploadError("");

    const supabase = createClient();
    // Use apartment ID if editing, else a stable folder ID for this session
    const folderId = apartment?.id ?? crypto.randomUUID();
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `${folderId}/${filename}`;

      const { error } = await supabase.storage
        .from("apartments")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (error) {
        setUploadError(`Failed to upload ${file.name}: ${error.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("apartments")
        .getPublicUrl(path);

      newUrls.push(publicUrl);
    }

    setPhotos((prev) => [...prev, ...newUrls]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handlePhotoDelete(url: string) {
    const supabase = createClient();
    const match = url.match(/\/storage\/v1\/object\/public\/apartments\/(.*)/);
    if (match) {
      await supabase.storage.from("apartments").remove([decodeURIComponent(match[1])]);
    }
    setPhotos((prev) => prev.filter((p) => p !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const supabase = createClient();

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description_en: form.description_en.trim() || null,
      description_al: form.description_al.trim() || null,
      area_m2: form.area_m2 ? parseInt(form.area_m2) : null,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      distance_to_sea: form.distance_to_sea ? parseInt(form.distance_to_sea) : null,
      amenities: form.amenities
        ? form.amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
      photos,
      is_published: form.is_published,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("apartments").update(payload).eq("id", apartment.id));
    } else {
      ({ error } = await supabase.from("apartments").insert(payload));
    }

    if (error) {
      setSubmitError(error.message);
      setSubmitting(false);
      return;
    }

    router.push("/admin/properties");
    router.refresh();
  }

  const numericFields = [
    { key: "area_m2", label: "Area (m²)", placeholder: "120" },
    { key: "bedrooms", label: "Bedrooms", placeholder: "3" },
    { key: "bathrooms", label: "Bathrooms", placeholder: "2" },
    { key: "distance_to_sea", label: "Distance to Sea (m)", placeholder: "50" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-3xl">

      {/* Name + Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={LABEL}>Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="The Horizon Suite"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>
            Slug *
            <span className="ml-1 text-xs text-slate-400 font-normal">(auto-generated)</span>
          </label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => {
              setSlugManuallyEdited(true);
              setForm((f) => ({ ...f, slug: e.target.value }));
            }}
            placeholder="the-horizon-suite"
            className={INPUT}
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={LABEL}>Description (English)</label>
          <textarea
            rows={5}
            value={form.description_en}
            onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))}
            placeholder="Apartment description in English…"
            className={`${INPUT} resize-none`}
          />
        </div>
        <div>
          <label className={LABEL}>Description (Albanian)</label>
          <textarea
            rows={5}
            value={form.description_al}
            onChange={(e) => setForm((f) => ({ ...f, description_al: e.target.value }))}
            placeholder="Apartment description in Albanian…"
            className={`${INPUT} resize-none`}
          />
        </div>
      </div>

      {/* Numeric fields */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {numericFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className={LABEL}>{label}</label>
            <input
              type="number"
              min="0"
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className={INPUT}
            />
          </div>
        ))}
      </div>

      {/* Amenities */}
      <div>
        <label className={LABEL}>Amenities</label>
        <input
          type="text"
          value={form.amenities}
          onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))}
          placeholder="Wi-Fi, Air Conditioning, Ocean View, Free Parking"
          className={INPUT}
        />
        <p className="text-xs text-slate-400 mt-1.5">Separate each amenity with a comma.</p>
      </div>

      {/* Photos */}
      <div>
        <label className={LABEL}>Photos</label>

        {/* Existing photo thumbnails */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {photos.map((url, i) => (
              <div
                key={url}
                className="relative group rounded-admin overflow-hidden aspect-square border border-slate-200 bg-slate-50"
              >
                <Image
                  src={url}
                  alt={`Photo ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handlePhotoDelete(url)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs leading-none"
                  title="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload drop zone */}
        <div
          className="border-2 border-dashed border-slate-200 rounded-admin-lg p-8 text-center cursor-pointer hover:border-admin-primary/40 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-admin-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-500">Uploading…</p>
            </div>
          ) : (
            <>
              <svg className="mx-auto mb-3 text-slate-300" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-sm font-medium text-slate-500">Click to upload photos</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP · Multiple files supported</p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
        />
        {uploadError && (
          <p className="text-sm text-red-500 mt-2">{uploadError}</p>
        )}
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
            className="sr-only peer"
          />
          {/* Track */}
          <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-admin-primary transition-colors" />
          {/* Thumb */}
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
        </label>
        <span className="text-sm font-semibold text-slate-700">
          {form.is_published ? "Published" : "Draft"}
        </span>
      </div>

      {submitError && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-admin">{submitError}</p>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-admin-primary hover:bg-admin-primary/90 disabled:opacity-60 text-white px-8 py-3 rounded-admin font-bold text-sm transition-colors inline-flex items-center gap-2"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Property"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
