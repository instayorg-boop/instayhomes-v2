// Instayhomes Plus: the paid plans that unlock direct WhatsApp contact with landlords.
import { useSyncExternalStore } from "react";

// Prices are real. One payment unlocks contact with every landlord. The rest of `features`
// is PLACEHOLDER copy until each plan's contents are confirmed.
export const plusPromise = "One payment gives you 30 days to contact every landlord on Instayhomes, as often as you like.";
export const accessPeriod = "30 days of access";
export const plans = [
  {
    id: "self-service",
    name: "Self-service",
    price: "K199",
    amount: 199,
    currency: "ZMW",
    features: ["Contact every landlord on Instayhomes", "Message as many as you like, whenever you like", "Chat directly on WhatsApp, with your first message written for you"],
  },
  {
    id: "assisted",
    name: "Assisted",
    price: "K399",
    amount: 399,
    currency: "ZMW",
    features: ["Contact every landlord on Instayhomes, as often as you like", "An Instayhomes agent helps you shortlist rooms", "Help arranging viewings with landlords"],
  },
  {
    id: "international",
    name: "International",
    price: "$50",
    amount: 50,
    currency: "USD",
    features: ["Contact every landlord on Instayhomes, as often as you like", "For tenants moving from abroad", "Priced in US dollars"],
  },
] as const;

export type Plan = (typeof plans)[number];
export type PlanId = Plan["id"];

export const planById = (id: string | null | undefined) => plans.find((plan) => plan.id === id) ?? null;

// DEMO subscription store: remembers the plan in this browser only. Replace with the real
// subscription from your auth/billing backend (the rest of the app only calls usePlus/setPlus).
const KEY = "instayhomes-plus-demo";
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** The current plan, or null when the visitor hasn't paid. */
export function usePlus(): Plan | null {
  const id = useSyncExternalStore(subscribe, read, () => null);
  return planById(id);
}

export function setPlus(id: PlanId | null) {
  try {
    if (id) window.localStorage.setItem(KEY, id);
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked (private mode): the payment still "succeeds" for this page view.
  }
  listeners.forEach((listener) => listener());
}

/** Only allow returning to a path on this site (never an outside URL). */
export function safeReturnPath(from: unknown) {
  return typeof from === "string" && from.startsWith("/") && !from.startsWith("//") ? from : "/";
}

// DEMO sign-in (stands in for "Continue with Google"). Replace with real auth; the payment
// flow only needs usePlusUser() and to be sent back to the same /plans URL after sign-in.
export type PlusUser = { name: string; email: string };
const USER_KEY = "instayhomes-user-demo";

function readUser(): string | null {
  try {
    return window.localStorage.getItem(USER_KEY);
  } catch {
    return null;
  }
}

export function usePlusUser(): PlusUser | null {
  const raw = useSyncExternalStore(subscribe, readUser, () => null);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlusUser;
  } catch {
    return null;
  }
}

export function setPlusUser(user: PlusUser | null) {
  try {
    if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(USER_KEY);
  } catch {
    // Storage blocked: sign-in lasts for this page view only.
  }
  listeners.forEach((listener) => listener());
}

// Remembered mobile money number, so renewing is one tap. DEMO: per browser.
const MOMO_KEY = "instayhomes-momo-demo";

export function rememberedMomoNumber(): string {
  try {
    return window.localStorage.getItem(MOMO_KEY) ?? "";
  } catch {
    return "";
  }
}

export function rememberMomoNumber(phone: string) {
  try {
    window.localStorage.setItem(MOMO_KEY, phone);
  } catch {
    // Storage blocked: they type it next time.
  }
}

// Promo codes. PLACEHOLDER: real codes and their discounts belong in the database and must be
// checked on the server when the payment is created; this list only drives the demo.
const promoCodes: Record<string, number> = { STUDENT10: 10 };
export const recommendedPlanId: PlanId = "assisted";

/** The discount (percent) for a code, or null if it isn't valid. */
export function promoPercent(code: string | null | undefined) {
  if (!code) return null;
  return promoCodes[code.trim().toUpperCase()] ?? null;
}

/** "K399" with 10% off → "K359". Keeps the currency sign, rounds to a whole amount. */
export function discountedPrice(plan: Plan, percent: number | null) {
  if (!percent) return plan.price;
  const symbol = plan.price.replace(/[0-9.,]/g, "");
  return `${symbol}${Math.round(plan.amount * (1 - percent / 100))}`;
}
