// Dev-only stress-test data for /search (the leading "-" keeps this file out of the route tree).
// Open /search?data=worst | empty | one to see each state. Never rendered in production.
import { useEffect, useState } from "react";
import type { Listing } from "./search";

export type DataMode = "demo" | "worst" | "empty" | "one";

const modes: DataMode[] = ["demo", "worst", "empty", "one"];
const labels: Record<DataMode, string> = { demo: "Demo data", worst: "Worst case", empty: "Empty", one: "One" };

const worstCase: Listing[] = [
  {
    id: 101,
    title: "Bright two-room apartment with balcony near Englischer Garten and U-Bahn Giselastraße",
    area: "Schwabing-Freimann, Munich",
    type: "Apartment",
    price: 45000,
    size: "54 m²",
    capacity: "3 tenants",
    available: "Available from 1 Feb",
    availableRooms: 1,
    rating: "4.8",
    image: "photo-1522708323590-d24dbb6b0267",
  },
  {
    id: 102,
    title: "Room",
    area: "Au-Haidhausen, Munich",
    type: "Private room",
    price: 2000,
    size: "9 m²",
    capacity: "1 tenant",
    available: "Available now",
    availableRooms: 0,
    rating: "4.9",
    image: "photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 103,
    title: "Möbliertes WG-Zimmer in Thalkirchen-Obersendling-Forstenried-Fürstenried-Solln",
    area: "Thalkirchen-Obersendling-Forstenried-Fürstenried-Solln, Munich",
    type: "Private room",
    price: 2600,
    size: "17 m²",
    capacity: "1 tenant",
    available: "Available from 15 Jan",
    availableRooms: 1,
    rating: "",
    image: "photo-0000000000000-doesnotexist",
  },
  {
    id: 104,
    title: "Studio near Olympiapark",
    area: "Milbertshofen-Am Hart, Munich",
    type: "Studio",
    price: 3800,
    size: "32 m²",
    capacity: "2 tenants",
    available: "Available from 1 Feb",
    availableRooms: 24,
    rating: "4.7",
    image: "photo-1560448204-e02f11c3d0e2",
  },
];

export const worstCaseCity = "Garmisch-Partenkirchen";

export function pickDataset(mode: DataMode, demo: Listing[]): Listing[] {
  if (mode === "worst") return worstCase;
  if (mode === "empty") return [];
  if (mode === "one") return demo.slice(0, 1);
  return demo;
}

/** Reads ?data= after mount (so server and client render the same first frame). Dev only. */
export function useDataMode(): DataMode {
  const [mode, setMode] = useState<DataMode>("demo");
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const value = new URLSearchParams(window.location.search).get("data") as DataMode | null;
    if (value && modes.includes(value)) setMode(value);
  }, []);
  return mode;
}

export function DataToggle({ mode }: { mode: DataMode }) {
  if (!import.meta.env.DEV) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-0.5 rounded-full bg-neutral-200 p-1 font-[system-ui] text-xs shadow">
      {modes.map((m) => (
        <a
          key={m}
          href={m === "demo" ? "?" : `?data=${m}`}
          className={`rounded-full px-3 py-1.5 ${m === mode ? "bg-white text-black shadow-sm" : "text-neutral-600"}`}
        >
          {labels[m]}
        </a>
      ))}
    </div>
  );
}
