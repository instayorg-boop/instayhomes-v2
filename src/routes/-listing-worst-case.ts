// Dev-only stress-test data for /listing (the leading "-" keeps this file out of the route tree).
// /listing?data=worst | empty (everything booked out) | one (a single room type).
import type { DataMode } from "./-search-worst-case";
import type { Room } from "./listing";

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

const worstRooms: Room[] = [
  {
    id: "sonnenblume",
    name: "Room 1 · Sonnenblume am Görlitzer Park",
    shortName: "Sonnenblume am Görlitzer Park",
    price: 4200,
    size: "24 m²",
    bed: "King bed",
    floor: "Ground floor, garden side",
    available: "Available now",
    availableRooms: 1,
    description: "",
    features: [],
    images: [
      { src: image("photo-1505693416388-ac5ce068fe85"), alt: "Sonnenblume bedroom" },
      { src: image("photo-0000000000000-doesnotexist"), alt: "Broken photo" },
    ],
  },
  {
    id: "linden",
    name: "Room 2 · Linden",
    shortName: "Linden",
    price: 2800,
    size: "20 m²",
    bed: "Queen bed",
    floor: "3rd floor",
    available: "Available from 1 Feb",
    availableRooms: 0,
    description: "",
    features: [],
    images: [{ src: image("photo-1616594039964-ae9021a400a0"), alt: "Linden bedroom" }],
  },
  {
    id: "o",
    name: "Room 3 · Ö",
    shortName: "Ö",
    price: 45000,
    size: "9 m²",
    bed: "Single bed",
    floor: "5th floor (no lift)",
    available: "Available from 15 Jan",
    availableRooms: 12,
    description: "",
    features: [],
    images: [],
  },
];

export function pickListing(mode: DataMode, demo: { title: string; rooms: Room[] }) {
  if (mode === "worst") {
    return {
      title: "Bright and spacious shared apartment with balcony, garden access and home office near Görlitzer Park",
      rooms: worstRooms,
    };
  }
  if (mode === "empty") return { ...demo, rooms: demo.rooms.map((room) => ({ ...room, availableRooms: 0 })) };
  if (mode === "one") return { ...demo, rooms: demo.rooms.slice(0, 1) };
  return demo;
}
