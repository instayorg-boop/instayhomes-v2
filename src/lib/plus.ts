// Nestaway Plus: the paid plans that unlock direct WhatsApp contact with landlords.
import { useSyncExternalStore } from "react";

// Prices are real; `features` are PLACEHOLDER copy until each plan's contents are confirmed.
export const plans = [
  {
    id: "self-service",
    name: "Self-service",
    price: "K199",
    amount: 199,
    currency: "ZMW",
    features: ["Chat with landlords on WhatsApp", "Ask about any room on Nestaway", "Messages written for you, ready to send"],
  },
  {
    id: "assisted",
    name: "Assisted",
    price: "K399",
    amount: 399,
    currency: "ZMW",
    features: ["Everything in Self-service", "A Nestaway agent helps you shortlist rooms", "Help arranging viewings with landlords"],
  },
  {
    id: "international",
    name: "International",
    price: "$50",
    amount: 50,
    currency: "USD",
    features: ["Everything in Self-service", "For tenants moving from abroad", "Priced in US dollars"],
  },
] as const;

export type Plan = (typeof plans)[number];
export type PlanId = Plan["id"];

export const planById = (id: string | null | undefined) => plans.find((plan) => plan.id === id) ?? null;

// DEMO subscription store: remembers the plan in this browser only. Replace with the real
// subscription from your auth/billing backend (the rest of the app only calls usePlus/setPlus).
const KEY = "nestaway-plus-demo";
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
const USER_KEY = "nestaway-user-demo";

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
