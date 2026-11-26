// DEMO admin data: sample rows only, nothing is saved. Replace with real data when Cloud is enabled.
import { plans, type PlanId } from "@/lib/plus";
import { guides } from "@/lib/guides-content";

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;

export type ListingStatus = "live" | "hidden" | "draft";
export type AdminRoom = { id: string; name: string; price: number; available: number; availableFrom: string; photos: number };
export type AdminListing = {
  id: string; title: string; city: string; area: string; university: string; distanceKm: number;
  gender: "Male" | "Female" | "Mixed"; status: ListingStatus; image: string; landlord: string;
  amenities: string[]; rules: string[]; rooms: AdminRoom[];
};

export const totalRooms = (l: Pick<AdminListing, "rooms">) => l.rooms.reduce((t, r) => t + r.available, 0);

export const adminListings: AdminListing[] = [
  { id: "kabulonga-house", title: "Kabulonga shared house", city: "Lusaka", area: "Kabulonga", university: "University of Zambia", distanceKm: 2.4, gender: "Mixed", status: "live", image: img("photo-1522708323590-d24dbb6b0267"), landlord: "Daniel Mwale",
    amenities: ["Wi-Fi", "Washing machine", "Backup power", "Security guard"], rules: ["No smoking", "Quiet after 22:00", "Guests until 20:00"],
    rooms: [
      { id: "aurora", name: "Aurora", price: 2500, available: 3, availableFrom: "Now", photos: 3 },
      { id: "linden", name: "Linden", price: 2800, available: 2, availableFrom: "1 Feb", photos: 3 },
      { id: "willow", name: "Willow", price: 2200, available: 1, availableFrom: "15 Jan", photos: 3 },
    ] },
  { id: "rhodes-park-flat", title: "Rhodes Park ladies' flat", city: "Lusaka", area: "Rhodes Park", university: "University of Lusaka", distanceKm: 1.1, gender: "Female", status: "live", image: img("photo-1560448204-e02f11c3d0e2"), landlord: "Grace Banda",
    amenities: ["Wi-Fi", "Study room", "Borehole water"], rules: ["Women only", "No pets"],
    rooms: [{ id: "a", name: "Single room", price: 1900, available: 2, availableFrom: "Now", photos: 4 }, { id: "b", name: "Shared room", price: 1400, available: 4, availableFrom: "Now", photos: 2 }] },
  { id: "riverside-rooms", title: "Riverside student rooms", city: "Kitwe", area: "Riverside", university: "Copperbelt University", distanceKm: 3.0, gender: "Male", status: "hidden", image: img("photo-1560185893-a55cbc8c57e8"), landlord: "Peter Chanda",
    amenities: ["Wi-Fi", "Parking"], rules: ["Men only", "No parties"],
    rooms: [{ id: "a", name: "Ensuite", price: 2100, available: 1, availableFrom: "1 Mar", photos: 3 }] },
  { id: "chalala-annex", title: "Chalala garden annex", city: "Lusaka", area: "Chalala", university: "Cavendish University", distanceKm: 4.6, gender: "Mixed", status: "draft", image: img("photo-1600607687939-ce8a6c25118c"), landlord: "Ruth Phiri",
    amenities: ["Garden", "Backup power"], rules: ["No smoking"],
    rooms: [{ id: "a", name: "Garden room", price: 2300, available: 0, availableFrom: "1 Apr", photos: 0 }] },
];

export type PromoUse = { name: string; email: string; plan: PlanId; date: string; amount: number; currency: "ZMW" | "USD" };
export type Promo = {
  code: string; type: "percent" | "fixed"; value: number; plans: PlanId[]; limit: number | null;
  starts: string; ends: string; partner: string | null; active: boolean; uses: PromoUse[];
};

const use = (name: string, plan: PlanId, date: string, discount: number): PromoUse => {
  const p = plans.find((x) => x.id === plan)!;
  return { name, email: `${name.split(" ")[0]!.toLowerCase()}@mail.com`, plan, date, amount: Math.round(p.amount * (1 - discount)), currency: p.currency };
};

export const promos: Promo[] = [
  { code: "UNZA25", type: "percent", value: 25, plans: ["self-service", "assisted"], limit: 200, starts: "2026-10-01", ends: "2026-12-31", partner: "UNZA Students' Union", active: true,
    uses: [use("Chipo Mulenga", "self-service", "2026-11-02", 0.25), use("Bwalya Tembo", "assisted", "2026-11-05", 0.25), use("Mutale Zulu", "self-service", "2026-11-09", 0.25), use("Natasha Lungu", "self-service", "2026-11-16", 0.25), use("Kondwani Sakala", "assisted", "2026-11-21", 0.25)] },
  { code: "MWILA10", type: "percent", value: 10, plans: ["self-service"], limit: null, starts: "2026-11-01", ends: "2027-01-31", partner: "Mwila (TikTok)", active: true,
    uses: [use("Thandiwe Daka", "self-service", "2026-11-12", 0.1), use("Joseph Kapata", "self-service", "2026-11-18", 0.1), use("Esther Moyo", "self-service", "2026-11-24", 0.1)] },
  { code: "ABROAD15", type: "percent", value: 15, plans: ["international"], limit: 50, starts: "2026-09-01", ends: "2026-11-30", partner: null, active: true,
    uses: [use("Amara Okafor", "international", "2026-10-14", 0.15)] },
  { code: "WELCOME", type: "fixed", value: 50, plans: ["self-service", "assisted"], limit: 100, starts: "2026-06-01", ends: "2026-09-30", partner: null, active: false,
    uses: [use("Lisa Mumba", "assisted", "2026-08-03", 50 / 399)] },
];

export const promoStats = (p: Promo) => ({
  subscribers: new Set(p.uses.map((u) => u.email)).size,
  revenueZMW: p.uses.filter((u) => u.currency === "ZMW").reduce((t, u) => t + u.amount, 0),
  revenueUSD: p.uses.filter((u) => u.currency === "USD").reduce((t, u) => t + u.amount, 0),
});

export const promoByCode = (code: string) => promos.find((p) => p.code === code) ?? null;

export const subscribers = [
  ...promos.flatMap((p) => p.uses.map((u) => ({ ...u, promo: p.code as string | null }))),
  { ...use("Mercy Njobvu", "self-service", "2026-11-20", 0), promo: null },
  { ...use("David Simukonda", "assisted", "2026-11-11", 0), promo: null },
  { ...use("Priya Shah", "international", "2026-11-03", 0), promo: null },
].sort((a, b) => b.date.localeCompare(a.date));

export const daysLeft = (start: string, today = "2026-11-26") =>
  Math.max(0, 30 - Math.round((Date.parse(today) - Date.parse(start)) / 86400000));

export const weeklySubscribers = [
  { week: "27 Oct", count: 4 }, { week: "3 Nov", count: 7 }, { week: "10 Nov", count: 6 }, { week: "17 Nov", count: 9 }, { week: "24 Nov", count: 5 },
];

export const adminPosts = guides.map((g, i) => ({ ...g, status: (i === 1 ? "draft" : "published") as "draft" | "published" }));

export const formatMoney = (amount: number, currency: "ZMW" | "USD") => (currency === "ZMW" ? `K${amount.toLocaleString()}` : `$${amount}`);
export const planName = (id: PlanId) => plans.find((p) => p.id === id)?.name ?? id;
