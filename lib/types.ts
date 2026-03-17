export interface Apartment {
  id: string;
  name: string;
  slug: string;
  description_en: string | null;
  description_al: string | null;
  area_m2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  distance_to_sea: number | null;
  amenities: string[];
  photos: string[];
  is_published: boolean;
  created_at: string;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export type Locale = "en" | "sq";
