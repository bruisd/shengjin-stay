import Image from "next/image";
import { Link } from "@/lib/navigation";
import type { Apartment } from "@/lib/types";

interface ApartmentCardProps {
  apartment: Apartment;
  locale: string;
  featured?: boolean;
}

export default function ApartmentCard({ apartment, locale, featured = false }: ApartmentCardProps) {
  const photo = apartment.photos?.[0] ?? "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200";

  return (
    <Link href={`/apartments/${apartment.slug}`} className="group cursor-pointer flex flex-col no-underline">
      {/* Image */}
      <div
        className={`relative overflow-hidden border border-slate-200 mb-4 ${
          featured ? "aspect-video" : "aspect-square"
        }`}
      >
        <Image
          src={photo}
          alt={apartment.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <h3 className="font-display text-xl lg:text-2xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
          {apartment.name}
        </h3>
        <p className="font-body text-slate-500 text-sm">
          {apartment.bedrooms ?? "—"} Bedroom{apartment.bedrooms !== 1 ? "s" : ""}
          {apartment.distance_to_sea != null ? ` · ${apartment.distance_to_sea}m to Beach` : ""}
          {apartment.area_m2 != null ? ` · ${apartment.area_m2}m²` : ""}
        </p>
      </div>
    </Link>
  );
}
