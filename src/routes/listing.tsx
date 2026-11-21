import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  Expand,
  GraduationCap,
  Heart,
  Home,
  KeyRound,
  MapPin,
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
import { useEffect, useState } from "react";
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

type Photo = {
  src: string;
  alt: string;
};

type PhotoSection = {
  id: string;
  title: string;
  photos: Photo[];
};

const generalPhotos: Photo[] = [
  { src: heroImage, alt: "Open-plan living room and kitchen" },
  { src: image("photo-1560448204-e02f11c3d0e2"), alt: "Dining area beside the kitchen" },
  { src: image("photo-1560185008-b033106af5c3"), alt: "Bright shared lounge" },
  { src: image("photo-1560185127-6ed189bf02f4"), alt: "Modern fitted kitchen" },
  { src: image("photo-1600607687939-ce8a6c25118c"), alt: "Comfortable shared sitting area" },
  { src: image("photo-1600566753086-00f18fb6b3ea"), alt: "Kitchen with generous counter space" },
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
      { src: image("photo-1505693416388-ac5ce068fe85"), alt: "Aurora double bed and bedside tables" },
      { src: image("photo-1560185893-a55cbc8c57e8"), alt: "Aurora furnished sleeping area" },
      { src: image("photo-1522771739844-6a9f6d5f14af"), alt: "Aurora bedroom and workspace" },
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
      { src: image("photo-1616594039964-ae9021a400a0"), alt: "Linden queen bed and reading corner" },
      { src: image("photo-1590490360182-c33d57733427"), alt: "Linden bedroom with courtyard view" },
      { src: image("photo-1618773928121-c32242e63f39"), alt: "Linden bedroom and storage" },
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
      { src: image("photo-1617104678098-de229db51175"), alt: "Willow double bedroom" },
      { src: image("photo-1595526114035-0d45ed16cfbf"), alt: "Willow bedroom and compact desk" },
      { src: image("photo-1591088398332-8a7791972843"), alt: "Willow bedroom and shelving" },
    ],
  },
];

const gallerySections: PhotoSection[] = [
  { id: "general", title: "General photos", photos: generalPhotos },
  ...rooms.map((room) => ({ id: room.id, title: room.name, photos: room.images })),
];

const universities = [
  { name: "Humboldt-Universität zu Berlin", distance: "3.2 km" },
  { name: "Technische Universität Berlin", distance: "4.8 km" },
  { name: "Freie Universität Berlin", distance: "6.4 km" },
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

type LightboxState = {
  title: string;
  photos: Photo[];
  index: number;
};

function ListingPage() {
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]!.id);
  const [roomGalleryId, setRoomGalleryId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) ?? rooms[0]!;
  const roomGallery = rooms.find((room) => room.id === roomGalleryId);
  const anyOverlayOpen = galleryOpen || Boolean(roomGallery) || Boolean(lightbox);

  useEffect(() => {
    if (!anyOverlayOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightbox) setLightbox(null);
        else if (roomGalleryId) setRoomGalleryId(null);
        else setGalleryOpen(false);
      }

      if (lightbox && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        const direction = event.key === "ArrowRight" ? 1 : -1;
        setLightbox((current) => current ? {
          ...current,
          index: (current.index + direction + current.photos.length) % current.photos.length,
        } : null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [anyOverlayOpen, lightbox, roomGalleryId]);

  const openRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setRoomGalleryId(roomId);
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

      <main className="mx-auto max-w-7xl px-8 pb-16 pt-5 sm:px-12">
        <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <Link to="/search" className="flex items-center gap-1 hover:text-foreground hover:underline">
            <ArrowLeft className="size-3.5" /> Search
          </Link>
          <ChevronRight className="size-3" />
          <Link to="/search" className="hover:text-foreground hover:underline">Berlin</Link>
          <ChevronRight className="size-3" />
          <span className="truncate text-foreground">Kreuzberg apartment</span>
        </nav>

        <div className="flex flex-col">
          <div className="order-2 mt-5 flex flex-col justify-between gap-4 sm:order-1 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <h1 className="max-w-3xl text-2xl font-bold leading-tight sm:text-3xl">Sunny shared apartment in Kreuzberg</h1>
              <p className="mt-2 text-sm text-muted-foreground">Berlin, Germany · 3 private rooms · 2 shared bathrooms</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium">
                <span className="flex items-center gap-1.5"><Users className="size-4 text-primary" /> Mixed gender</span>
                <span className="flex items-center gap-1.5"><MapPin className="size-4 text-primary" /> Kreuzberg, Berlin</span>
              </div>
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

          <section aria-label="Property photos" className="relative order-1 -mx-8 mt-1 sm:order-2 sm:mx-0 sm:mt-5">
            <div className="flex h-60 snap-x snap-mandatory gap-2 overflow-x-auto sm:hidden">
              {generalPhotos.slice(0, 5).map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  aria-label={`Open photo gallery at image ${index + 1}`}
                  onClick={() => setLightbox({ title: "General photos", photos: generalPhotos, index })}
                  className="h-full w-[86%] shrink-0 snap-center overflow-hidden first:ml-8 last:mr-8"
                >
                  <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="hidden h-[340px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl sm:grid">
              <button type="button" onClick={() => setGalleryOpen(true)} className="col-span-2 row-span-2 h-full w-full overflow-hidden">
                <img src={generalPhotos[0]!.src} alt={generalPhotos[0]!.alt} className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]" />
              </button>
              {generalPhotos.slice(1, 5).map((photo) => (
                <button key={photo.src} type="button" onClick={() => setGalleryOpen(true)} className="h-full w-full overflow-hidden">
                  <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className="absolute bottom-4 right-12 flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs font-semibold shadow-sm hover:bg-muted sm:right-4"
            >
              <Expand className="size-4" /> Show all photos
            </button>
          </section>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <section className="border-b pb-7">
              <div className="flex items-center justify-between gap-5">
                <div className="min-w-0">
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
                  <h2 id="room-heading" className="mt-1 text-xl font-bold">Where you&apos;ll sleep</h2>
                </div>
                <p className="text-xs text-muted-foreground">Tap a room to see its photos</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5" role="group" aria-label="Available room types">
                {rooms.map((room) => {
                  const active = room.id === selectedRoom.id;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      aria-label={`View ${room.name} photos`}
                      aria-pressed={active}
                      onClick={() => openRoom(room.id)}
                      className="group min-w-0 text-left"
                    >
                      <span className={`block overflow-hidden rounded-lg border-2 transition ${active ? "border-primary" : "border-transparent group-hover:border-foreground/30"}`}>
                        <img src={room.images[0]!.src} alt={`${room.shortName} bedroom`} className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                      </span>
                      <span className="mt-2.5 block truncate text-sm font-semibold">{room.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">1 {room.bed.toLowerCase()} · {room.size}</span>
                      <span className="mt-1 block text-xs font-semibold">€{room.price}<span className="font-normal text-muted-foreground"> / month</span></span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="border-b py-8">
              <h2 className="text-xl font-bold">What this place offers</h2>
              <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {amenities.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm"><Icon className="size-5 shrink-0 text-muted-foreground" /> {label}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="universities-heading" className="border-b py-8">
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-1 size-6 shrink-0 text-primary" />
                <div>
                  <h2 id="universities-heading" className="text-xl font-bold">Nearby universities</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Approximate distances from the apartment</p>
                </div>
              </div>
              <ul className="mt-5 divide-y rounded-xl border bg-card px-5">
                {universities.map((university) => (
                  <li key={university.name} className="flex items-center justify-between gap-5 py-4 text-sm">
                    <span className="min-w-0 font-medium">{university.name}</span>
                    <span className="shrink-0 font-semibold text-primary">{university.distance}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="py-8">
              <div className="flex items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary font-display text-2xl text-primary-foreground">D</span>
                <div className="min-w-0"><h2 className="text-lg font-bold">Hosted by Daniel</h2><p className="mt-0.5 text-xs text-muted-foreground">Nestaway landlord since 2022 · Usually replies within a day</p></div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">Daniel looks after this home locally and is happy to help with practical questions about the apartment and your arrival.</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium"><BadgeCheck className="size-4 text-primary" /> Identity verified</span>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border bg-card p-6 shadow-soft">
              <p className="text-xs font-medium text-muted-foreground">Selected room</p>
              <h2 className="mt-1 text-lg font-bold">{selectedRoom.name}</h2>
              <p className="mt-4 text-2xl font-bold">€{selectedRoom.price}<span className="text-sm font-normal text-muted-foreground"> / month</span></p>
              <p className="mt-1 text-xs text-muted-foreground">Utilities and internet included</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Maximize2 className="size-4" /> {selectedRoom.size}</span>
                <span className="flex items-center gap-1.5"><BedDouble className="size-4" /> {selectedRoom.bed}</span>
              </div>
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

      <footer className="border-t bg-muted py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-8 sm:grid-cols-2 sm:px-12 lg:grid-cols-4">
          <div>
            <Link to="/" className="font-display text-2xl text-primary">NESTAWAY</Link>
            <p className="mt-3 max-w-xs text-xs leading-5 text-muted-foreground">A simpler way to find a furnished home for the next chapter of your life.</p>
          </div>
          {[
            ["Nestaway", ["About us", "Careers", "Partners", "Blog"]],
            ["Tenants", ["How it works", "Tenant Protection", "Help centre", "Contact us"]],
            ["Landlords", ["List your property", "Landlord pricing", "Rental guides", "Terms and privacy"]],
          ].map(([heading, links]) => (
            <div key={heading as string}>
              <h2 className="text-sm font-semibold">{heading}</h2>
              <div className="mt-3 space-y-2">
                {(links as string[]).map((link) => (
                  <a key={link} href="#" className="block text-xs text-muted-foreground hover:underline">{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>

      {galleryOpen && (
        <PhotoGalleryDialog
          title="Kreuzberg apartment"
          sections={gallerySections}
          onClose={() => setGalleryOpen(false)}
          onOpenPhoto={(section, index) => setLightbox({ title: section.title, photos: section.photos, index })}
        />
      )}

      {roomGallery && (
        <PhotoGalleryDialog
          title={roomGallery.name}
          sections={[{ id: roomGallery.id, title: `${roomGallery.shortName} photos`, photos: roomGallery.images }]}
          onClose={() => setRoomGalleryId(null)}
          onOpenPhoto={(section, index) => setLightbox({ title: section.title, photos: section.photos, index })}
        />
      )}

      {lightbox && (
        <div role="dialog" aria-modal="true" aria-label={`${lightbox.title} image viewer`} className="fixed inset-0 z-[70] flex flex-col bg-foreground/95 text-background">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{lightbox.title}</p>
              <p className="mt-0.5 text-xs text-background/70">{lightbox.index + 1} / {lightbox.photos.length}</p>
            </div>
            <button autoFocus type="button" aria-label="Close image viewer" onClick={() => setLightbox(null)} className="shrink-0 rounded-full border border-background/30 p-2 hover:bg-background/10">
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-8 sm:px-20">
            <img
              src={lightbox.photos[lightbox.index]!.src}
              alt={lightbox.photos[lightbox.index]!.alt}
              className="max-h-full max-w-full object-contain"
            />
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setLightbox((current) => current ? { ...current, index: (current.index - 1 + current.photos.length) % current.photos.length } : null)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-background/30 bg-foreground/30 p-2.5 hover:bg-background/10 sm:left-6"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setLightbox((current) => current ? { ...current, index: (current.index + 1) % current.photos.length } : null)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-background/30 bg-foreground/30 p-2.5 hover:bg-background/10 sm:right-6"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
          <p className="px-6 pb-5 text-center text-xs text-background/70">{lightbox.photos[lightbox.index]!.alt}</p>
        </div>
      )}
    </div>
  );
}

function PhotoGalleryDialog({
  title,
  sections,
  onClose,
  onOpenPhoto,
}: {
  title: string;
  sections: PhotoSection[];
  onClose: () => void;
  onOpenPhoto: (section: PhotoSection, index: number) => void;
}) {
  const photoCount = sections.reduce((total, section) => total + section.photos.length, 0);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${title} photo gallery`} className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-background px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{photoCount} photos</p>
        </div>
        <button autoFocus type="button" aria-label="Close photo gallery" onClick={onClose} className="shrink-0 rounded-full border p-2 hover:bg-muted"><X className="size-5" /></button>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 sm:py-10">
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`gallery-${section.id}`} className="mb-10 last:mb-0">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 id={`gallery-${section.id}`} className="text-lg font-bold">{section.title}</h2>
              <p className="shrink-0 text-xs text-muted-foreground">{section.photos.length} photos</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {section.photos.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  aria-label={`Enlarge ${photo.alt}`}
                  onClick={() => onOpenPhoto(section, index)}
                  className={`overflow-hidden bg-muted ${index === 0 ? "col-span-2" : "col-span-1"}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className={`w-full object-cover transition duration-300 hover:scale-[1.02] ${index === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}`}
                  />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
