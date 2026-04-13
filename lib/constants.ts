export const WHATSAPP_NUMBER = "355693776830";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_DEFAULT_MESSAGE = "Hi! I'm interested in an apartment at Shëngjin Stay.";
export const CONTACT_EMAIL = "shengjinstay@gmail.com";
export const CONTACT_PHONE = "+355 69 37 76 830";
export const SITE_NAME = "Shëngjin Stay";
export const SITE_URL = "https://shengjinstay.com";

export const AMENITY_OPTIONS = [
  { key: "ocean_view", icon: "🌊" },
  { key: "balcony", icon: "🏗️" },
  { key: "terrace", icon: "☀️" },
  { key: "wifi", icon: "📶" },
  { key: "kitchen", icon: "🍳" },
  { key: "kitchenette", icon: "🍽️" },
  { key: "ac", icon: "❄️" },
  { key: "heating", icon: "🔥" },
  { key: "smart_tv", icon: "📺" },
  { key: "washer", icon: "👕" },
  { key: "dryer", icon: "🧺" },
  { key: "parking", icon: "🅿️" },
  { key: "beach_access", icon: "🏖️" },
  { key: "pool", icon: "🏊" },
  { key: "gym", icon: "💪" },
  { key: "elevator", icon: "🛗" },
  { key: "pet_friendly", icon: "🐕" },
  { key: "dishwasher", icon: "🍽️" },
  { key: "iron", icon: "👔" },
  { key: "hair_dryer", icon: "💇" },
  { key: "safe", icon: "🔒" },
  { key: "bbq", icon: "🔥" },
] as const;

export type AmenityKey = typeof AMENITY_OPTIONS[number]["key"];

export const AMENITY_LABELS_EN: Record<string, string> = {
  ocean_view: "Ocean View",
  balcony: "Balcony",
  terrace: "Terrace",
  wifi: "High-Speed Wi-Fi",
  kitchen: "Fully Equipped Kitchen",
  kitchenette: "Kitchenette",
  ac: "Air Conditioning",
  heating: "Heating",
  smart_tv: "Smart TV",
  washer: "Washing Machine",
  dryer: "Dryer",
  parking: "Free Parking",
  beach_access: "Beach Access",
  pool: "Swimming Pool",
  gym: "Gym",
  elevator: "Elevator",
  pet_friendly: "Pet Friendly",
  dishwasher: "Dishwasher",
  iron: "Iron",
  hair_dryer: "Hair Dryer",
  safe: "Safe",
  bbq: "BBQ Area",
};

export const DISTANCE_FILTERS = [
  { label: "All", value: null },
  { label: "Beachfront (0–50m)", value: 50, labelKey: "filters.beachfront" },
  { label: "Near Beach (50–150m)", value: 150, labelKey: "filters.nearBeach" },
  { label: "Short Walk (150m+)", value: 999, labelKey: "filters.shortWalk" },
] as const;

export const BEDROOM_FILTERS = [
  { label: "All", value: null },
  { label: "1 Bed", value: 1 },
  { label: "2 Beds", value: 2 },
  { label: "3+ Beds", value: 3 },
] as const;
