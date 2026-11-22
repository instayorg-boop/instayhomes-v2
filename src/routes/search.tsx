import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/site-header";
import { DataToggle, pickDataset, useDataMode, worstCaseCity } from "./-search-worst-case";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Rooms and apartments in Munich | Nestaway Stays" },
      {
        name: "description",
        content: "Browse furnished rooms, studios and apartments for mid-term stays in Munich with Nestaway Tenant Protection.",
      },
      { property: "og:title", content: "Find your next home in Munich | Nestaway Stays" },
      {
        property: "og:description",
        content: "Compare furnished mid-term rentals and choose a place that fits your stay in Munich.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

const image = (id: string, width = 700) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

const listings = [
  {
    id: 1,
    title: "Private room in Roonstraße",
    area: "Schwabing-West, Munich",
    type: "Private room",
    price: 790,
    size: "18 m²",
    capacity: "1 tenant",
    available: "Available now",
    availableRooms: 6,
    rating: "4.8",
    image: "photo-1522708323590-d24dbb6b0267",
  },
  {
    id: 2,
    title: "Bright room in Maxvorstadt",
    area: "Maxvorstadt, Munich",
    type: "Private room",
    price: 850,
    size: "20 m²",
    capacity: "1 tenant",
    available: "Available now",
    availableRooms: 2,
    rating: "4.9",
    image: "photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 3,
    title: "Studio near Olympiapark",
    area: "Milbertshofen, Munich",
    type: "Studio",
    price: 1190,
    size: "32 m²",
    capacity: "2 tenants",
    available: "Available from 1 Feb",
    availableRooms: 1,
    rating: "4.7",
    image: "photo-1560448204-e02f11c3d0e2",
  },
  {
    id: 4,
    title: "Furnished room in Glockenbach",
    area: "Glockenbachviertel, Munich",
    type: "Private room",
    price: 760,
    size: "16 m²",
    capacity: "1 tenant",
    available: "Available now",
    availableRooms: 3,
    rating: "4.8",
    image: "photo-1560185008-b033106af5c3",
  },
  {
    id: 5,
    title: "Modern studio in Sendling",
    area: "Sendling, Munich",
    type: "Studio",
    price: 1240,
    size: "35 m²",
    capacity: "2 tenants",
    available: "Available from 15 Jan",
    availableRooms: 2,
    rating: "4.9",
    image: "photo-1560185127-6ed189bf02f4",
  },
  {
    id: 6,
    title: "Two-room apartment in Haidhausen",
    area: "Haidhausen, Munich",
    type: "Apartment",
    price: 1690,
    size: "54 m²",
    capacity: "3 tenants",
    available: "Available from 1 Mar",
    availableRooms: 4,
    rating: "4.8",
    image: "photo-1560184897-ae75f418493e",
  },
  {
    id: 7,
    title: "Quiet room near Luitpoldpark",
    area: "Schwabing-West, Munich",
    type: "Private room",
    price: 720,
    size: "15 m²",
    capacity: "1 tenant",
    available: "Available now",
    availableRooms: 1,
    rating: "4.6",
    image: "photo-1560185893-a55cbc8c57e8",
  },
  {
    id: 8,
    title: "City apartment in Lehel",
    area: "Lehel, Munich",
    type: "Apartment",
    price: 1850,
    size: "61 m²",
    capacity: "3 tenants",
    available: "Available from 1 Feb",
    availableRooms: 2,
    rating: "4.9",
    image: "photo-1560185009-5bf9f2849488",
  },
  {
    id: 9,
    title: "Compact studio in Giesing",
    area: "Obergiesing, Munich",
    type: "Studio",
    price: 990,
    size: "28 m²",
    capacity: "1 tenant",
    available: "Available now",
    availableRooms: 1,
    rating: "4.7",
    image: "photo-1560185007-cde436f6a4d0",
  },
];

const filters = ["All", "Private room", "Studio", "Apartment"] as const;

type Filter = (typeof filters)[number];

function SearchPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [favourites, setFavourites] = useState<number[]>([]);
  const [moreFilters, setMoreFilters] = useState(false);
  const [query, setQuery] = useState("Munich");
  const [searchedCity, setSearchedCity] = useState("Munich");
  const dataMode = useDataMode();
  const dataset = pickDataset(dataMode, listings);
  const city = dataMode === "worst" ? worstCaseCity : searchedCity;

  const visibleListings = useMemo(
    () => dataset.filter((listing) => activeFilter === "All" || listing.type === activeFilter),
    [activeFilter, dataset],
  );

  const toggleFavourite = (id: number) => {
    setFavourites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchedCity(query.trim() || "Munich");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <form onSubmit={submitSearch} className="flex flex-col gap-2 rounded-xl border bg-background p-2 shadow-sm md:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-md px-3">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <span className="sr-only">City or neighbourhood</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="City or neighbourhood"
                className="h-10 w-full bg-transparent text-base outline-none md:text-sm"
              />
            </label>
            <button type="button" className="flex h-10 items-center justify-center gap-2 rounded-md border px-5 text-sm hover:bg-muted md:w-60 transition-[scale,background-color,color,border-color] duration-150 ease-out active:scale-[0.97]">
              <CalendarDays className="size-4" /> Move-in – Move-out
            </button>
            <button type="submit" className="h-10 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-[scale,background-color,color,border-color] duration-150 ease-out active:scale-[0.97]">
              Search
            </button>
          </form>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-[scale,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
                  activeFilter === filter ? "border-foreground bg-foreground text-background" : "bg-background hover:bg-muted"
                }`}
              >
                {filter === "All" ? "All homes" : `${filter}s`}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setMoreFilters((current) => !current)}
              aria-expanded={moreFilters}
              className="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium hover:bg-muted transition-[scale,background-color,color,border-color] duration-150 ease-out active:scale-[0.97]"
            >
              <SlidersHorizontal className="size-3.5" /> More filters
              <ChevronDown className={`size-3.5 transition-transform duration-200 ease-out ${moreFilters ? "rotate-180" : ""}`} />
            </button>
          </div>
          {moreFilters && (
            <div className="mt-3 flex flex-wrap gap-4 rounded-lg bg-muted p-4 text-xs font-medium animate-in fade-in slide-in-from-top-1 duration-200 ease-out">
              <span className="flex items-center gap-2"><Check className="size-4 text-primary" /> Furnished</span>
              <span className="flex items-center gap-2"><Check className="size-4 text-primary" /> Bills included</span>
              <span className="flex items-center gap-2"><Check className="size-4 text-primary" /> Verified landlord</span>
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Mid-term rentals</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Accommodation in {city}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{visibleListings.length} furnished places available for your next stay</p>
          </div>
          <button type="button" className="flex items-center gap-2 self-start rounded-md border px-3 py-2 text-xs font-medium hover:bg-muted sm:self-auto transition-[scale,background-color,color,border-color] duration-150 ease-out active:scale-[0.97]">
            Recommended <ChevronDown className="size-3.5" />
          </button>
        </div>

        <div className="mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleListings.slice(0, 5).map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              favourite={favourites.includes(listing.id)}
              onToggleFavourite={() => toggleFavourite(listing.id)}
            />
          ))}

          {activeFilter === "All" && <ProtectionCard />}

          {visibleListings.slice(5).map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              favourite={favourites.includes(listing.id)}
              onToggleFavourite={() => toggleFavourite(listing.id)}
            />
          ))}
        </div>

        <nav aria-label="Search result pages" className="mt-10 flex items-center justify-center gap-2 text-sm">
          <span className="rounded-md bg-foreground px-3 py-2 text-background">1</span>
          {[2, 3, 4].map((page) => (
            <button key={page} type="button" className="rounded-md border px-3 py-2 hover:bg-muted transition-[scale,background-color,color,border-color] duration-150 ease-out active:scale-[0.97]">{page}</button>
          ))}
          <span className="px-1 text-muted-foreground">…</span>
          <button type="button" className="rounded-md border px-3 py-2 hover:bg-muted transition-[scale,background-color,color,border-color] duration-150 ease-out active:scale-[0.97]">Next</button>
        </nav>

        <section className="mt-14 border-t pt-10">
          <h2 className="text-xl font-bold">Accommodation in Munich, Germany</h2>
          <div className="mt-4 max-w-4xl space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              Munich combines a lively cultural scene with green parks, reliable public transport and neighbourhoods that feel like small villages. Choose a furnished room to share city life with others, or enjoy the privacy of your own studio or apartment.
            </p>
            <p>
              Nestaway makes it easier to arrange your home before you arrive. Browse verified places, compare what is included and send a booking request online.
            </p>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Popular neighbourhoods", ["Rooms in Schwabing", "Studios in Maxvorstadt", "Apartments in Haidhausen", "Homes in Glockenbachviertel"]],
              ["Find your space", ["Private rooms in Munich", "Shared rooms in Munich", "Studios in Munich", "Apartments in Munich"]],
              ["Plan your stay", ["Student accommodation", "Monthly rentals", "Furnished homes", "Pet-friendly rentals"]],
              ["Nearby cities", ["Accommodation in Augsburg", "Accommodation in Nuremberg", "Accommodation in Stuttgart", "Accommodation in Salzburg"]],
            ].map(([heading, links]) => (
              <div key={heading as string}>
                <h3 className="text-sm font-semibold">{heading}</h3>
                <div className="mt-3 space-y-2">
                  {(links as string[]).map((link) => (
                    <Link key={link} to="/search" className="block text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground">
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
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
      <DataToggle mode={dataMode} />
    </div>
  );
}

export type Listing = (typeof listings)[number];

function ListingCard({
  listing,
  favourite,
  onToggleFavourite,
}: {
  listing: Listing;
  favourite: boolean;
  onToggleFavourite: () => void;
}) {
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-xl bg-muted">
        <Link to="/listing" aria-label={`View ${listing.title}`}>
          <img
            src={image(listing.image)}
            alt={listing.title}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
        </Link>
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold shadow-sm">
          <BadgeCheck className="size-3.5 text-primary" /> Tenant verified
        </span>
        <button
          type="button"
          aria-label={favourite ? `Remove ${listing.title} from saved homes` : `Save ${listing.title}`}
          aria-pressed={favourite}
          onClick={onToggleFavourite}
          className="absolute right-3 top-3 rounded-full bg-background/95 p-2 shadow-sm transition-transform duration-150 ease-out hover:scale-105 active:scale-95"
        >
          <Heart className={`size-4 ${favourite ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>
      <Link to="/listing" className="mt-3 block">
        <h2 className="text-sm font-semibold leading-5 group-hover:underline">{listing.title}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{listing.area}</p>
        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">{listing.size} · {listing.capacity}</span>
          <span className="font-medium">★ {listing.rating}</span>
        </div>
        <p className="mt-2 text-sm font-bold">€{listing.price.toLocaleString("en")} <span className="text-xs font-normal text-muted-foreground">/ month</span></p>
        <p className="mt-1 text-[11px] font-medium text-primary">{listing.availableRooms} {listing.availableRooms === 1 ? "room" : "rooms"} available · {listing.available}</p>
      </Link>
    </article>
  );
}

function ProtectionCard() {
  return (
    <aside className="flex min-h-72 flex-col justify-center rounded-xl border border-primary/20 bg-primary/10 p-7">
      <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <ShieldCheck className="size-6" />
      </span>
      <p className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
        <Sparkles className="size-4" /> Worry-free renting
      </p>
      <h2 className="mt-2 font-display text-3xl leading-tight">YOUR NEXT HOME, PROTECTED.</h2>
      <ul className="mt-4 space-y-2 text-xs">
        {["Secure online payments", "Support throughout your stay", "Help if your plans change"].map((item) => (
          <li key={item} className="flex items-center gap-2"><Check className="size-4 text-primary" /> {item}</li>
        ))}
      </ul>
      <Link to="/listing" className="mt-5 inline-flex items-center gap-2 self-start rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-[scale,background-color,color,border-color] duration-150 ease-out active:scale-[0.97]">
        <MapPin className="size-3.5" /> Explore protected homes
      </Link>
    </aside>
  );
}
