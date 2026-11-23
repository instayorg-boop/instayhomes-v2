import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  CigaretteOff,
  CookingPot,
  Expand,
  Heart,
  Home,
  KeyRound,
  Phone,
  Lock,
  LogIn,
  LogOut,
  MapPin,
  PawPrint,
  Share2,
  Sofa,
  Sparkles,
  Users,
  Volume2,
  WashingMachine,
  Wifi,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { VerifiedIcon } from "@/components/verified-badge";
import { TenantProtectionLink } from "@/components/tenant-protection";
import { SiteHeader } from "@/components/site-header";
import { Availability } from "@/components/availability";
import { PlusHint, useContactLandlord, whatsappButton } from "@/components/contact-landlord";
import { cn } from "@/lib/utils";
import { pickListing } from "./-listing-worst-case";
import { DataToggle, useDataMode } from "./-search-worst-case";
import { rememberListing } from "@/lib/recent";

export const Route = createFileRoute("/listing")({
  head: () => ({
    meta: [
      { title: "Sunny shared apartment in Kreuzberg, Berlin | Instayhomes" },
      {
        name: "description",
        content: "Explore three furnished private rooms in a bright shared apartment in Kreuzberg, Berlin, with bills included and Tenant Protection.",
      },
      { property: "og:title", content: "Sunny shared apartment in Kreuzberg | Instayhomes" },
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

export const heroImage = image("photo-1522708323590-d24dbb6b0267", 1600);

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
    price: 2500,
    size: "18 m²",
    bed: "Double bed",
    floor: "3rd floor",
    available: "Available now",
    availableRooms: 3,
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
    price: 2800,
    size: "20 m²",
    bed: "Queen bed",
    floor: "3rd floor",
    available: "Available from 1 Feb",
    availableRooms: 2,
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
    price: 2200,
    size: "15 m²",
    bed: "Double bed",
    floor: "3rd floor",
    available: "Available from 15 Jan",
    availableRooms: 1,
    description: "A cosy and practical room with everything you need, including a compact workspace and generous shelving.",
    features: ["Compact desk", "Open shelving", "Wardrobe", "Bed linen included"],
    images: [
      { src: image("photo-1617104678098-de229db51175"), alt: "Willow double bedroom" },
      { src: image("photo-1595526114035-0d45ed16cfbf"), alt: "Willow bedroom and compact desk" },
      { src: image("photo-1591088398332-8a7791972843"), alt: "Willow bedroom and shelving" },
    ],
  },
];

export type Room = (typeof rooms)[number];

export const totalAvailableRooms = rooms.reduce((total, room) => total + room.availableRooms, 0);

const listingTitle = "Sunny shared apartment in Kreuzberg";

// Who the home is for. PLACEHOLDER: set per listing once listings come from the database.
type Gender = "mixed" | "male" | "female";
const listingGender: Gender = "mixed";
const genderLabel: Record<Gender, string> = {
  mixed: "Male & female spaces",
  male: "Male spaces only",
  female: "Female spaces only",
};

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

const houseRules = [
  { icon: LogIn, label: "Check-in from 14:00" },
  { icon: LogOut, label: "Check-out before 11:00" },
  { icon: CigaretteOff, label: "No smoking inside" },
  { icon: Volume2, label: "Quiet hours: 22:00–07:00" },
  { icon: PawPrint, label: "No pets" },
  { icon: Users, label: "Overnight guests by agreement" },
];

type LightboxState = {
  title: string;
  photos: Photo[];
  index: number;
};

// Landlord's WhatsApp number in international format. PLACEHOLDER: comes from the listing data.
export const landlordWhatsApp = "";

// PLACEHOLDER landlord profile: comes from the landlord's account once profiles exist.
// `whatsappDisplay` is an example number for the layout; the chat link uses landlordWhatsApp.
const landlord = {
  firstName: "Chanda",
  photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&h=160&q=80",
  yearsOnInstayhomes: 2,
  whatsappDisplay: "+260 97 123 4545",
};

/** "+260 97 123 4545" → "+260 97 ••• ••45": enough to look real, not enough to use. */
const maskNumber = (number: string) => {
  const [country, prefix, ...rest] = number.split(" ");
  const tail = rest.join("");
  return `${country} ${prefix} ••• ••${tail.slice(-2)}`;
};

/** The message is written for them: they only have to press send in WhatsApp. */
export function contactMessage(room: Room | null) {
  return room
    ? `Hi! I found ${room.shortName} (K${room.price.toLocaleString("en")}/month) in your Kreuzberg apartment on Instayhomes. Is it still available?`
    : `Hi! I found your apartment in Kreuzberg on Instayhomes. Which rooms are still available?`;
}

// Press feedback shared by every button on the page (emil-design-eng: buttons must feel heard).
const press = "transition-[scale,background-color,border-color,color] duration-150 ease-out active:scale-[0.97]";

function ListingPage() {
  const dataMode = useDataMode();
  const listing = pickListing(dataMode, { title: listingTitle, rooms });
  const listingRooms = listing.rooms;
  const openRooms = listingRooms.filter((room) => room.availableRooms > 0);
  const roomsLeft = openRooms.reduce((total, room) => total + room.availableRooms, 0);
  const soonest = openRooms.find((room) => room.available === "Available now") ?? openRooms[0] ?? null;
  const fromPrice = Math.min(...(openRooms.length ? openRooms : listingRooms).map((room) => room.price));

  const { contact, plan } = useContactLandlord();
  const router = useRouter();

  // Remember this home for "Continue where you left off" on the home page.
  useEffect(() => {
    if (dataMode !== "demo") return;
    rememberListing({
      href: "/listing",
      title: listingTitle,
      area: "Kreuzberg, Berlin",
      image: generalPhotos[0]!.src,
      fromPrice: `K${fromPrice.toLocaleString("en")}`,
      available: soonest?.available ?? "Fully booked",
    });
  }, [dataMode, fromPrice, soonest?.available]);

  // Load the payment page's code in the background, so "Ask" opens it instantly.
  useEffect(() => {
    void router.preloadRoute({ to: "/plans" }).catch(() => undefined);
  }, [router]);
  const [roomGalleryId, setRoomGalleryId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const roomGallery = listingRooms.find((room) => room.id === roomGalleryId);
  const fullScreenOpen = galleryOpen || Boolean(roomGallery) || Boolean(lightbox);

  const gallerySections: PhotoSection[] = [
    { id: "general", title: "General photos", photos: generalPhotos },
    ...listingRooms
      .filter((room) => room.images.length > 0)
      .map((room) => ({ id: room.id, title: room.name, photos: room.images })),
  ];

  const contactAbout = (room: Room | null) => {
    setRoomGalleryId(null);
    contact({ phone: landlordWhatsApp, message: contactMessage(room), roomId: room?.id });
  };

  useEffect(() => {
    if (!fullScreenOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (lightbox) setLightbox(null);
      else if (roomGalleryId) setRoomGalleryId(null);
      else setGalleryOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullScreenOpen, lightbox, roomGalleryId]);

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
    <div className="min-h-svh bg-background pb-24 text-foreground lg:pb-0">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-0 sm:px-12 sm:pt-5">
        {/* Above the photos on desktop: only where you are, and share / save. */}
        <div className="hidden items-center justify-between gap-4 sm:flex">
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <Link to="/search" className="flex items-center gap-1 hover:text-foreground hover:underline">
              <ArrowLeft className="size-3.5" /> Search
            </Link>
            <ChevronRight className="size-3" />
            <Link to="/search" className="hover:text-foreground hover:underline">Berlin</Link>
            <ChevronRight className="size-3" />
            <span className="truncate text-foreground">Kreuzberg apartment</span>
          </nav>
          <div className="flex shrink-0 gap-1">
            <button type="button" onClick={shareListing} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${press}`}>
              <Share2 className="size-4" /> {shared ? "Link copied" : "Share"}
            </button>
            <button
              type="button"
              aria-pressed={saved}
              onClick={() => setSaved((current) => !current)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${press}`}
            >
              <Heart className={`size-4 ${saved ? "fill-primary text-primary" : ""}`} /> {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <section aria-label="Property photos" className="relative -mx-4 sm:mx-0 sm:mt-4">
            <div className="flex h-72 snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:hidden">
              {generalPhotos.slice(0, 5).map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  aria-label={`Open photo ${index + 1} of ${generalPhotos.length}`}
                  onClick={() => setLightbox({ title: "General photos", photos: generalPhotos, index })}
                  className="h-full w-[88%] shrink-0 snap-center overflow-hidden"
                >
                  <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="absolute left-4 top-4 z-10 sm:hidden">
              <Link to="/search" aria-label="Back to search" className={`flex size-10 items-center justify-center rounded-full bg-background shadow-md ${press}`}>
                <ArrowLeft className="size-5" />
              </Link>
            </div>
            <div className="absolute right-4 top-4 z-10 flex gap-2 sm:hidden">
              <button type="button" aria-label={shared ? "Link copied" : "Share this home"} onClick={shareListing} className={`flex size-10 items-center justify-center rounded-full bg-background shadow-md ${press}`}>
                {shared ? <Check className="size-4 text-emerald-600" /> : <Share2 className="size-4" />}
              </button>
              <button type="button" aria-label={saved ? "Remove this home from saved homes" : "Save this home"} aria-pressed={saved} onClick={() => setSaved((current) => !current)} className={`flex size-10 items-center justify-center rounded-full bg-background shadow-md ${press}`}>
                <Heart className={`size-4 ${saved ? "fill-primary text-primary" : ""}`} />
              </button>
            </div>

            <div className="hidden h-[340px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl sm:grid">
              <button type="button" onClick={() => setGalleryOpen(true)} className="col-span-2 row-span-2 h-full w-full overflow-hidden">
                <img src={generalPhotos[0]!.src} alt={generalPhotos[0]!.alt} className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.02]" />
              </button>
              {generalPhotos.slice(1, 5).map((photo) => (
                <button key={photo.src} type="button" onClick={() => setGalleryOpen(true)} className="h-full w-full overflow-hidden">
                  <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.02]" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs font-semibold shadow-sm hover:bg-muted ${press}`}
            >
              <Expand className="size-4" /> All {gallerySections.reduce((total, section) => total + section.photos.length, 0)} photos
            </button>
          </section>
        </div>

        <div className="mt-5 grid gap-10 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
          <div className="min-w-0 pb-8">
            {/* Clean stack: what it is, where, when you can move in, what it's like, why trust it. */}
            <h1 className="max-w-3xl text-balance text-center text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-left">{listing.title}</h1>
            {/* Phones and tablets: centred, location and gender side by side, availability below.
                Desktop: location, availability and gender on one left-aligned line. */}
            <div className="mt-2 flex flex-col items-center gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-5 lg:gap-y-2">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:contents">
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground lg:order-1">
                  <MapPin className="size-4 shrink-0" /> Kreuzberg, Berlin
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm lg:order-3">
                  <Users className="size-3.5 text-muted-foreground" /> {genderLabel[listingGender]}
                </span>
              </div>
              <div className="lg:order-2">
                {soonest ? (
                  <Availability
                    available={soonest.available}
                    left={roomsLeft}
                    leftLabel={(count) => `${count} rooms left`}
                    className="text-base lg:text-sm"
                  />
                ) : (
                  <p className="text-base font-medium text-muted-foreground lg:text-sm">Fully booked right now</p>
                )}
              </div>
            </div>
            <TenantProtectionLink className={`mx-auto mt-5 flex max-w-sm items-center gap-3 rounded-xl border p-3 hover:border-foreground/30 lg:hidden ${press} w-full text-left`}>
              <VerifiedIcon className="size-7 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">Tenant verified</span>
                <span className="block text-xs text-muted-foreground">Covered by Tenant Protection</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </TenantProtectionLink>
          </div>

            <LandlordRow hasPlus={Boolean(plan)} onMessage={() => contactAbout(null)} />

            <section aria-labelledby="room-heading" className="pb-8">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="room-heading" className="text-xl font-bold">Rooms</h2>
                <p className="shrink-0 text-sm text-muted-foreground">
                  {listingRooms.length} {listingRooms.length === 1 ? "room type" : "room types"}
                </p>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:gap-3 xl:grid-cols-3">
                {listingRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onAsk={() => contactAbout(room)}
                    onOpenPhotos={() => setRoomGalleryId(room.id)}
                  />
                ))}
              </div>
            </section>

            <section className="border-b py-8">
              <h2 className="text-xl font-bold">About this home</h2>
              <p className="mt-3 max-w-prose text-sm leading-7 text-muted-foreground">
                Set on a quiet street in Kreuzberg, this bright apartment pairs original wooden floors with simple, modern furnishings. Prepare dinner in the shared kitchen, catch up in the living room, or retreat to your own private room. Shops, cafés and public transport are all within easy walking distance.
              </p>
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
              <h2 id="universities-heading" className="text-xl font-bold">Nearby universities</h2>
              <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {universities.map((university) => (
                  <li key={university.name} className="flex items-center justify-between gap-4 text-sm">
                    <span className="min-w-0">{university.name}</span>
                    <span className="shrink-0 font-medium tabular-nums">{university.distance}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="py-8">
              <h2 className="text-xl font-bold">House rules</h2>
              <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {houseRules.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm"><Icon className="size-5 shrink-0 text-muted-foreground" /> {label}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
            <div className="rounded-xl border bg-card p-6 shadow-soft">
              <p className="text-2xl font-bold tabular-nums">
                <span className="text-sm font-normal text-muted-foreground">From </span>K{fromPrice.toLocaleString("en")}
                <span className="text-sm font-normal text-muted-foreground"> / month</span>
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">Bills included</p>
              {soonest ? (
                <Availability available={soonest.available} left={roomsLeft} leftLabel={(count) => `${count} rooms left`} className="mt-3" />
              ) : (
                <p className="mt-3 text-sm font-medium text-muted-foreground">Fully booked right now</p>
              )}
              <dl className="mt-5 space-y-2.5 border-y py-4 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Deposit</dt><dd className="font-medium">1 month's rent</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Minimum stay</dt><dd className="font-medium">3 months</dd></div>
              </dl>
              <button type="button" onClick={() => contactAbout(null)} className={`mt-5 w-full ${whatsappButton}`}>
                <WhatsAppIcon /> Chat with landlord
              </button>
              <PlusHint className="mt-2 justify-center text-center" />
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Move-in date, length of stay and viewing are agreed with the landlord in the chat.
              </p>
              <TenantProtectionLink className={`group mt-5 flex w-full items-center gap-3 border-t pt-4 text-left ${press}`}>
                <VerifiedIcon className="size-6 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">Tenant verified</span>
                  <span className="block text-xs text-muted-foreground">Covered by Tenant Protection</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </TenantProtectionLink>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t bg-muted py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-12 lg:grid-cols-4">
          <div>
            <Link to="/" className="font-display text-2xl text-primary">INSTAYHOMES</Link>
            <p className="mt-3 max-w-xs text-xs leading-5 text-muted-foreground">A simpler way to find a furnished home for the next chapter of your life.</p>
          </div>
          {[
            ["Instayhomes", ["About us", "Careers", "Partners", "Blog"]],
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

      {/* Phone bar: starting price and the one action. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="whitespace-nowrap text-lg font-bold tabular-nums">
              <span className="text-xs font-normal text-muted-foreground">From </span>K{fromPrice.toLocaleString("en")}
              <span className="text-xs font-normal text-muted-foreground"> / month</span>
            </p>
            <PlusHint short />
          </div>
          <button type="button" onClick={() => contactAbout(null)} className={cn("shrink-0", whatsappButton, "rounded-lg py-4")}>
            <WhatsAppIcon /> Chat with landlord
          </button>
        </div>
      </div>

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
          footer={
            roomGallery.availableRooms > 0 ? (
              <button type="button" onClick={() => contactAbout(roomGallery)} className={`w-full ${whatsappButton}`}>
                <WhatsAppIcon /> Ask about {roomGallery.shortName} · K{roomGallery.price.toLocaleString("en")} / month
              </button>
            ) : null
          }
        />
      )}

      {lightbox && <Lightbox state={lightbox} onClose={() => setLightbox(null)} />}

      <DataToggle mode={dataMode} />
    </div>
  );
}

function RoomPhoto({ room, className = "" }: { room: Room; className?: string }) {
  const [failed, setFailed] = useState(false);
  const first = room.images[0];
  if (!first || failed) {
    return (
      <span className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}>
        <Home className="size-6 opacity-60" />
      </span>
    );
  }
  return <img src={first.src} alt={first.alt} onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

function RoomCard({ room, onAsk, onOpenPhotos }: { room: Room; onAsk: () => void; onOpenPhotos: () => void }) {
  const bookedOut = room.availableRooms === 0;
  const photoCount = room.images.length;
  return (
    <article className={`flex min-w-0 flex-col overflow-hidden rounded-xl border ${bookedOut ? "opacity-60" : ""}`}>
      <button
        type="button"
        disabled={photoCount === 0}
        aria-label={photoCount ? `View ${photoCount} photos of ${room.shortName}` : `${room.shortName} has no photos yet`}
        onClick={onOpenPhotos}
        className="group relative block w-full overflow-hidden text-left"
      >
        <RoomPhoto room={room} className="aspect-[16/10] w-full transition-transform duration-300 ease-out group-hover:scale-[1.02] sm:aspect-[4/3] lg:aspect-[16/10]" />
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-background/95 px-2.5 py-1.5 text-xs font-semibold shadow-sm">
          <Expand className="size-3.5" /> {photoCount === 0 ? "Photos soon" : photoCount === 1 ? "1 photo" : `${photoCount} photos`}
        </span>
      </button>
      <div className="flex flex-1 flex-col p-4 lg:p-3">
        <h3 className="line-clamp-2 font-bold" title={room.name}>{room.shortName}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{room.bed} · {room.size} · {room.floor}</p>
        <p className="mt-3 text-xl font-bold tabular-nums lg:mt-2 lg:text-lg">
          K{room.price.toLocaleString("en")}
          <span className="text-xs font-normal text-muted-foreground"> / month</span>
        </p>
        <Availability available={room.available} left={room.availableRooms} leftLabel={(count) => `${count} left`} className="mb-4 mt-1 lg:mb-3" />
        <button
          type="button"
          disabled={bookedOut}
          onClick={onAsk}
          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 lg:py-2 text-sm font-semibold text-[#128C4A] hover:bg-[#128C4A]/5 disabled:cursor-not-allowed disabled:text-muted-foreground ${press}`}
        >
          {bookedOut ? "Fully booked" : <><WhatsAppIcon /> Ask about this room</>}
        </button>
      </div>
    </article>
  );
}

// Full-screen viewer built on native scroll-snap: swipe on touch, arrows and keys on desktop.
// The browser's own scroll physics beat a hand-rolled gesture (mobile-native §9).
function Lightbox({ state, onClose }: { state: LightboxState; onClose: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(state.index);
  const count = state.photos.length;

  useEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: state.index * track.clientWidth, behavior: "instant" });
  }, [state.index]);

  const go = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = (index + direction + count) % count;
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div role="dialog" aria-modal="true" aria-label={`${state.title} image viewer`} className="fixed inset-0 z-[70] flex flex-col bg-neutral-950 text-white animate-in fade-in duration-200 ease-out">
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{state.title}</p>
          <p className="mt-0.5 text-xs tabular-nums text-white/70">{index + 1} / {count}</p>
        </div>
        <button autoFocus type="button" aria-label="Close image viewer" onClick={onClose} className={`shrink-0 rounded-full border border-white/30 p-2 hover:bg-white/10 ${press}`}>
          <X className="size-5" />
        </button>
      </div>
      <div className="relative min-h-0 flex-1">
        <div
          ref={trackRef}
          onScroll={(event) => {
            const track = event.currentTarget;
            setIndex(Math.round(track.scrollLeft / track.clientWidth));
          }}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none]"
        >
          {state.photos.map((photo) => (
            <div key={photo.src} className="flex h-full w-full shrink-0 snap-center items-center justify-center px-2 pb-6 sm:px-20">
              <img src={photo.src} alt={photo.alt} draggable={false} className="max-h-full max-w-full select-none object-contain" />
            </div>
          ))}
        </div>
        {count > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={`absolute left-6 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/30 p-2.5 hover:bg-white/10 sm:block ${press}`}>
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => go(1)} className={`absolute right-6 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/30 p-2.5 hover:bg-white/10 sm:block ${press}`}>
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>
      <p className="px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-xs text-white/70">{state.photos[index]?.alt}</p>
    </div>
  );
}

function PhotoGalleryDialog({
  title,
  sections,
  onClose,
  onOpenPhoto,
  footer,
}: {
  title: string;
  sections: PhotoSection[];
  onClose: () => void;
  onOpenPhoto: (section: PhotoSection, index: number) => void;
  footer?: ReactNode;
}) {
  const photoCount = sections.reduce((total, section) => total + section.photos.length, 0);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${title} photo gallery`} className="fixed inset-0 z-50 flex flex-col bg-background animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{photoCount} photos</p>
        </div>
        <button autoFocus type="button" aria-label="Close photo gallery" onClick={onClose} className={`shrink-0 rounded-full border p-2 hover:bg-muted ${press}`}><X className="size-5" /></button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
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
                      className={`w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.02] ${index === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}`}
                    />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {footer && (
        <div className="border-t bg-background px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
          <div className="mx-auto max-w-4xl">{footer}</div>
        </div>
      )}
    </div>
  );
}

/** Who you'd be talking to, above the rooms. The number stays partly hidden until you have Plus. */
function LandlordRow({ hasPlus, onMessage }: { hasPlus: boolean; onMessage: () => void }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const years = landlord.yearsOnInstayhomes;
  return (
    <section aria-labelledby="landlord-heading" className="pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="relative size-14 shrink-0">
            {photoFailed ? (
              <span className="flex size-14 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                {landlord.firstName.charAt(0)}
              </span>
            ) : (
              <img
                src={landlord.photo}
                alt={`${landlord.firstName}, the landlord`}
                onError={() => setPhotoFailed(true)}
                className="size-14 rounded-full object-cover"
              />
            )}
            <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-background">
              <VerifiedIcon className="size-5" />
            </span>
          </span>
          <div className="min-w-0">
            <h2 id="landlord-heading" className="text-lg font-bold">Listed by {landlord.firstName}</h2>
            <p className="text-sm text-muted-foreground">
              Verified landlord · {years} {years === 1 ? "year" : "years"} on Instayhomes
            </p>
            {/* One number for WhatsApp and calls. With Plus it's tappable to call. */}
            <p className="mt-1 flex items-center gap-1.5 text-sm">
              <WhatsAppIcon className="size-3.5 text-[#128C4A]" />
              <Phone className="size-3.5 text-muted-foreground" aria-hidden />
              <span className="sr-only">WhatsApp or call:</span>
              {hasPlus ? (
                <a href={`tel:${landlord.whatsappDisplay.replace(/\s/g, "")}`} className="font-medium tabular-nums underline-offset-4 hover:underline">
                  {landlord.whatsappDisplay}
                </a>
              ) : (
                <>
                  <span className="font-medium tabular-nums">{maskNumber(landlord.whatsappDisplay)}</span>
                  <Lock className="size-3.5 text-muted-foreground" aria-label="Unlocks with Plus" />
                </>
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onMessage}
          className={
            hasPlus
              ? `shrink-0 sm:w-auto lg:hidden ${whatsappButton}`
              : `inline-flex shrink-0 items-center lg:hidden justify-center gap-2 rounded-md border-2 px-5 py-3 text-sm font-semibold text-[#128C4A] hover:bg-[#128C4A]/5 ${press}`
          }
        >
          <WhatsAppIcon /> Message landlord
        </button>
      </div>
    </section>
  );
}
