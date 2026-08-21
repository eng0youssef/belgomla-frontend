export const VILLAGES = [
  "المعصرة",
  "بلقاس",
  "شربين",
  "طلخا",
  "ميت غمر",
  "دكرنس",
  "المنصورة"
];

export const MOCK_PRODUCT = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "طقم كاسات تركي أورجينال",
  wholesalePrice: 450,
  standardPrice: 450,
  retailPrice: 750,
  minDiscountPrice: 350,
  cartonCapacity: 10,
  maxReferrals: 3,
  referralDiscountPerReferral: 33.33,
  isActive: true,
};

// ─── Payment & Support Contact ────────────────────────────────────────────────
// Set these in .env.local / .env.production to avoid hardcoding in source code.
// NEXT_PUBLIC_ prefix is required for browser access.

export const PAYMENT_PHONE =
  process.env.NEXT_PUBLIC_PAYMENT_PHONE ?? "0100 000 0000";

export const PAYMENT_LABEL =
  process.env.NEXT_PUBLIC_PAYMENT_LABEL ?? "فودافون كاش / إنستاباي";

export const SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "201055090171";
