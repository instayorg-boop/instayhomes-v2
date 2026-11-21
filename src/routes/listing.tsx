import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  BedDouble,
  Check,
  ChevronRight,
  CookingPot,
  Expand,
  Heart,
  Home,
  KeyRound,
  Maximize2,
  Share2,
  ShieldCheck,
  Sofa,
  Sparkles,
  Users,
  WashingMachine,
  Wifi,
  X,
} from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/listing")({
  head: () => ({
    meta: [
      { title: "Sunny shared apartment in Kreuzberg, Berlin | Nestaway Stays" },
      {
        name: "description",
        content: "Explore three furnished private rooms in a bright shared apartment in Kreuzberg, Berlin, with bills included and Tenant Protection.",
      },
      { property: "og:title", content: "Sunny shared apartment in Kreuzberg | Nestaway Stays" },
      {
        property: "og:description",
        content: "Choose your furnished private room in this bright, fully equipped Berlin apartment.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: ListingPage,
});

const image = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

const heroImage = image("photo-1522708323590-d24dbb6b0267", 1600);

const gallery = [
  { src: heroImage, alt: "Open-plan living room and kitchen" },
  { src: image("photo-1560448204-e02f11c3d0e2"), alt: "Dining area beside the kitchen" },
  { src: image("photo-1560185008-b033106af5c3"), alt: "Bright shared lounge" },
  { src: image("photo-1560185127-6ed189bf02f4"), alt: "Modern fitted kitchen" },
  { src: image("photo-1560185893-a55cbc8c57e8"), alt: "Furnished double bedroom" },
];

export const rooms = [
  {
    id: "aurora",
    name: "Room 1 · Aurora",
    shortName: "Aurora",
    price: 790,
    size: "18 m²",
    bed: "Double bed",
    floor: "3rd floor",
    available: "Available now",
    description: "A calm, sunlit room with space to work and plenty of storage. Ideal for a longer stay in the city.",
    features: ["Work desk", "Wardrobe", "Blackout blinds", "Bed linen included"],
    images: [
      image("photo-1505693416388-ac5ce068fe85"),
      image("photo-1560185893-a55cbc8c57e8"),
    ],
  },
  {
    id: "linden",
    name: "Room 2 · Linden",
    shortName: "Linden",
    price: 850,
    size: "20 m²",
    bed: "Queen bed",
    floor: "3rd floor",
    available: "Available from 1 Feb",
    description: "The largest room in the apartment, with a comfortable reading corner and views over the quiet inner courtyard.",
    features: ["Reading chair", "Large wardrobe", "Work desk", "Courtyard view"],
    images: [
      image("photo-1616594039964-ae9021a400a0"),
      image("photo-1590490360182-c33d57733427"),
    ],
  },
  {
    id: "willow",
    name: "Room 3 · Willow",
    shortName: "Willow",
    price: 720,
    size: "15 m²",
    bed: "Double bed",
    floor: "3rd floor",
    available: "Available from 15 Jan",
    description: "A cosy and practical room with everything you need, including a compact workspace and generous shelving.",
    features: ["Compact desk", "Open shelving", "Wardrobe", "Bed linen included"],
    images: [
      image("photo-1617104678098-de229db51175"),
      image("photo-1595526114035-0d45ed16cfbf"),
    ],
  },
];

const amenities = [
  { icon: Wifi, label: "Fast Wi-Fi" },
  { icon: CookingPot, label: "Fully equipped kitchen" },
  { icon: WashingMachine, label: "Washing machine" },
  { icon: BedDouble, label: "Bed linen and towels" },
  { icon: Sofa, label: "Furnished living room" },
  { icon: KeyRound, label: "Secure building entry" },
  { icon: Sparkles, label: "Weekly shared-area cleaning" },
  { icon: Home, label: "Bills included" },
];

function ListingPage() {
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]!.id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) ?? rooms[0]!;

  const chooseRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setSelectedImage(0);
  };

  const shareListing = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      setShared(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/search" className="flex items-center gap-1 hover:text-foreground hover:underline">
            <ArrowLeft className="size-3.5" /> Search
          </Link>
          <ChevronRight className="size-3" />
          <Link to="/search" className="hover:text-foreground hover:underline">Berlin</Link>
          <ChevronRight className="size-3" />
          <span className="truncate text-foreground">Kreuzberg apartment</span>
        </nav>

        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="max-w-3xl text-2xl font-bold leading-tight sm:text-3xl">Sunny shared apartment in Kreuzberg</h1>
            <p className="mt-2 text-sm text-muted-foreground">Berlin, Germany · 3 private rooms · 2 shared bathrooms</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={shareListing} className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold underline underline-offset-4 hover:bg-muted">
              <Share2 className="size-4" /> {shared ? "Link copied" : "Share"}
            </button>
            <button
              type="button"
              aria-pressed={saved}
              onClick={() => setSaved((current) => !current)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold underline underline-offset-4 hover:bg-muted"
            >
              <Heart className={`size-4 ${saved ? "fill-primary text-primary" : ""}`} /> {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        <section aria-label="Property photos" className="relative mt-5 grid h-[300px] grid-cols-2 gap-2 overflow-hidden rounded-xl sm:h-[430px] sm:grid-cols-4 sm:grid-rows-2">
          <button type="button" onClick={() => setGalleryOpen(true)} className="col-span-2 row-span-2 h-full w-full overflow-hidden sm:col-span-2">
            <img src={gallery[0]!.src} alt={gallery[0]!.alt} className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]" />
          </button>
          {gallery.slice(1).map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setGalleryOpen(true)}
              className={`h-full w-full overflow-hidden ${index > 1 ? "hidden sm:block" : ""}`}
            >
              <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs font-semibold shadow-sm hover:bg-muted"
          >
            <Expand className="size-4" /> Show all photos
          </button>
        </section>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <section className="border-b pb-7">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <h2 className="text-xl font-bold">Entire shared apartment hosted by Daniel</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Up to 3 tenants · Shared kitchen and living room</p>
                </div>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground">D</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div><p className="text-sm font-semibold">Verified place</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">The property details and landlord identity have been checked.</p></div>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div><p className="text-sm font-semibold">Tenant Protection included</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">Secure payments and support from booking to move-in.</p></div>
                </div>
                <div className="flex gap-3">
                  <Users className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div><p className="text-sm font-semibold">Made for mid-term stays</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">A furnished home for students, professionals and newcomers.</p></div>
                </div>
              </div>
            </section>

            <section className="border-b py-7">
              <h2 className="text-lg font-bold">About this home</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Set on a quiet street in Kreuzberg, this bright apartment pairs original wooden floors with simple, modern furnishings. Prepare dinner in the shared kitchen, catch up in the living room, or retreat to your own private room. Shops, cafés and public transport are all within easy walking distance.
              </p>
            </section>

            <section aria-labelledby="room-heading" className="border-b py-8">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Room types</p>
                  <h2 id="room-heading" className="mt-1 text-xl font-bold">Choose your room</h2>
                </div>
                <p className="text-xs text-muted-foreground">Select a room to see inside</p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-label="Available room types">
                {rooms.map((room) => {
                  const active = room.id === selectedRoom.id;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => chooseRoom(room.id)}
                      className={`rounded-xl border-2 p-2 text-left transition sm:p-3 ${active ? "border-primary bg-primary/5" : "hover:border-foreground/40"}`}
                    >
                      <img src={room.images[0]} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
                      <span className="mt-2 block text-xs font-bold sm:text-sm">{room.shortName}</span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground sm:text-xs">{room.size} · €{room.price}/mo</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border bg-card">
                <div className="relative">
                  <img
                    key={selectedRoom.images[selectedImage]}
                    src={selectedRoom.images[selectedImage]}
                    alt={`${selectedRoom.shortName} bedroom, view ${selectedImage + 1}`}
                    className="aspect-[16/9] w-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    {selectedRoom.images.map((roomImage, index) => (
                      <button
                        key={roomImage}
                        type="button"
                        aria-label={`Show ${selectedRoom.shortName} photo ${index + 1}`}
                        aria-pressed={selectedImage === index}
                        onClick={() => setSelectedImage(index)}
                        className={`size-2.5 rounded-full border border-background ${selectedImage === index ? "bg-background" : "bg-background/40"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="text-lg font-bold">{selectedRoom.name}</h3>
                      <p className="mt-1 text-xs font-medium text-primary">{selectedRoom.available}</p>
                    </div>
                    <p className="text-xl font-bold">€{selectedRoom.price}<span className="text-xs font-normal text-muted-foreground"> / month</span></p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Maximize2 className="size-4" /> {selectedRoom.size}</span>
                    <span className="flex items-center gap-1.5"><BedDouble className="size-4" /> {selectedRoom.bed}</span>
                    <span className="flex items-center gap-1.5"><Home className="size-4" /> {selectedRoom.floor}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{selectedRoom.description}</p>
                  <ul className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    {selectedRoom.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2"><Check className="size-3.5 text-primary" /> {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="border-b py-8">
              <h2 className="text-xl font-bold">What this place offers</h2>
              <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {amenities.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm"><Icon className="size-5 text-muted-foreground" /> {label}</li>
                ))}
              </ul>
            </section>

            <section className="py-8">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-full bg-primary font-display text-2xl text-primary-foreground">D</span>
                <div><h2 className="text-lg font-bold">Hosted by Daniel</h2><p className="mt-0.5 text-xs text-muted-foreground">Nestaway landlord since 2022 · Usually replies within a day</p></div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">Daniel looks after this home locally and is happy to help with practical questions about the apartment and your arrival.</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium"><BadgeCheck className="size-4 text-primary" /> Identity verified</span>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border bg-card p-6 shadow-soft">
              <p className="text-xs font-medium text-muted-foreground">Selected room</p>
              <h2 className="mt-1 text-lg font-bold">{selectedRoom.shortName}</h2>
              <p className="mt-4 text-2xl font-bold">€{selectedRoom.price}<span className="text-sm font-normal text-muted-foreground"> / month</span></p>
              <p className="mt-1 text-xs text-muted-foreground">Utilities and internet included</p>
              <div className="mt-5 space-y-3 border-y py-4 text-xs">
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">One-time service fee</span><span className="font-medium">€120</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Refundable deposit</span><span className="font-medium">€{selectedRoom.price}</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Minimum stay</span><span className="font-medium">3 months</span></div>
              </div>
              <button type="button" className="mt-5 w-full rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                Request {selectedRoom.shortName}
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">You won&apos;t be charged yet</p>
              <div className="mt-5 flex gap-3 rounded-lg bg-primary/10 p-3">
                <ShieldCheck className="size-5 shrink-0 text-primary" />
                <p className="text-[11px] leading-5"><span className="font-semibold">Tenant Protection</span><br /><span className="text-muted-foreground">Your payment is protected until you move in.</span></p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {galleryOpen && (
        <div role="dialog" aria-modal="true" aria-label="All property photos" className="fixed inset-0 z-50 overflow-y-auto bg-background">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-3 sm:px-6">
            <div><p className="text-sm font-bold">Kreuzberg apartment</p><p className="text-xs text-muted-foreground">5 photos</p></div>
            <button type="button" aria-label="Close photo gallery" onClick={() => setGalleryOpen(false)} className="rounded-full border p-2 hover:bg-muted"><X className="size-5" /></button>
          </div>
          <div className="mx-auto grid max-w-5xl gap-3 p-4 sm:grid-cols-2 sm:p-6">
            {gallery.map((photo, index) => (
              <img key={photo.src} src={photo.src} alt={photo.alt} className={`w-full rounded-xl object-cover ${index === 0 ? "sm:col-span-2" : "aspect-[4/3]"}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
