// Nestaway Plus: the paid plans that unlock direct WhatsApp contact with landlords.
import { useSyncExternalStore } from "react";

export const plans = [
  {
    id: "self-service",
    name: "Self-service",
    price: "K199",
    currency: "ZMW",
    // PLACEHOLDER copy: replace with what each plan includes.
    summary: "Contact landlords yourself on WhatsApp.",
  },
  {
    id: "assisted",
    name: "Assisted",
    price: "K399",
    currency: "ZMW",
    summary: "Contact landlords, with our team helping you along the way.",
  },
  {
    id: "international",
    name: "International",
    price: "$50",
    currency: "USD",
    summary: "For tenants paying from outside Zambia.",
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
