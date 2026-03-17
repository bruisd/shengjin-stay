"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface PhotoGalleryProps {
  photos: string[];
  apartmentName: string;
}

export default function PhotoGallery({ photos, apartmentName }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safePhotos = photos?.length > 0
    ? photos
    : ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200"];

  const prev = useCallback(() => {
    setSelectedIndex((i) => (i === 0 ? safePhotos.length - 1 : i - 1));
  }, [safePhotos.length]);

  const next = useCallback(() => {
    setSelectedIndex((i) => (i === safePhotos.length - 1 ? 0 : i + 1));
  }, [safePhotos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, prev, next]);

  return (
    <>
      {/* ── Main image ─────────────────────────────────────────────────── */}
      <div
        className="w-full h-[60vh] md:h-[70vh] relative cursor-zoom-in"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={safePhotos[selectedIndex]}
          alt={`${apartmentName} — photo ${selectedIndex + 1}`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Counter badge */}
        <span className="absolute bottom-4 right-4 bg-black/50 text-white text-xs font-bold px-3 py-1 backdrop-blur-sm">
          {selectedIndex + 1} / {safePhotos.length}
        </span>
      </div>

      {/* ── Thumbnail strip ────────────────────────────────────────────── */}
      {safePhotos.length > 1 && (
        <div className="w-full bg-white p-2 border-b border-border-light">
          <div className="max-w-7xl mx-auto flex overflow-x-auto gap-2 snap-x pb-2">
            {safePhotos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`relative h-24 md:h-32 flex-shrink-0 w-36 md:w-48 snap-start overflow-hidden transition-opacity ${
                  i === selectedIndex
                    ? "border-2 border-primary opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`View photo ${i + 1}`}
              >
                <Image
                  src={photo}
                  alt={`${apartmentName} thumbnail ${i + 1}`}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Lightbox ───────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>

          {/* Prev */}
          {safePhotos.length > 1 && (
            <button
              className="absolute left-4 text-white/80 hover:text-white p-2 z-10"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-5xl h-[80vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={safePhotos[selectedIndex]}
              alt={`${apartmentName} — photo ${selectedIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {/* Next */}
          {safePhotos.length > 1 && (
            <button
              className="absolute right-4 text-white/80 hover:text-white p-2 z-10"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
