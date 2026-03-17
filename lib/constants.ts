export const WHATSAPP_NUMBER = "355691234567";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_DEFAULT_MESSAGE = "Hi! I'm interested in an apartment at Shëngjin Stay.";
export const CONTACT_EMAIL = "hello@shengjinstay.com";
export const CONTACT_PHONE = "+355 69 123 4567";
export const SITE_NAME = "Shëngjin Stay";
export const SITE_URL = "https://shengjinstay.com";

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
