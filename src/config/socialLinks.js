// ============================================================
// Social Media Links Configuration
// ============================================================
// Edit the values below to update your social media contacts.
// To disable a platform, set its value to an empty string "".
// ============================================================

export const socialLinks = {
  telegram:  "https://t.me/Farhan_ilyas",
  whatsapp:  "https://wa.link/slzjyt",
  facebook:  "https://www.facebook.com/",   // ← update with your Facebook page URL
  instagram: "https://www.instagram.com/farahan_ilyas_ahmed",
  phone:     "tel:+251977923572",            // used internally; not shown as social card
};

// Returns true only if a given URL is non-empty and non-whitespace
export function isConfigured(url) {
  return typeof url === "string" && url.trim().length > 0;
}
