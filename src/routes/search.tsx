import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Heart,
  Home,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/site-header";
import { rememberSearch } from "@/lib/recent";
import { universityById, type University } from "@/lib/universities";
import { searchStory } from "@/lib/guides";
import { Availability } from "@/components/availability";
import { VerifiedIcon } from "@/components/verified-badge";
import { NoResultsIllustration } from "@/components/no-results-illustration";
import { DataToggle, pickDataset, useDataMode, worstCaseCity } from "./-search-worst-case";

type SearchParams = { university?: string | undefined };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    university: typeof search["university"] === "string" ? search["university"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Rooms and apartments in Munich | Instayhomes" },
      {
        name: "description",
        content: "Browse furnished rooms, studios and apartments for mid-term stays in Munich with Instayhomes Tenant Protection.",
      },
      { property: "og:title", content: "Find your next home in Munich | Instayhomes" },
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
type Sort = "recommended" | "price-asc" | "price-desc";

function SearchPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [favourites, setFavourites] = useState<number[]>([]);
  const [sort, setSort] = useState<Sort>("recommended");
  const [query, setQuery] = useState("Munich");
  const [searchedCity, setSearchedCity] = useState("Munich");
  const dataMode = useDataMode();
  const dataset = pickDataset(dataMode, listings);
  const city = dataMode === "worst" ? worstCaseCity : searchedCity;
  const university = universityById(Route.useSearch().university);

  // Arriving here for a university (from the home page search or its tiles) is a search worth
  // offering again as "Continue your search".
  useEffect(() => {
    if (university) rememberSearch({ label: university.name, universityId: university.id });
  }, [university]);

  const visibleListings = useMemo(
    () => {
      const matches = dataset.filter((listing) => activeFilter === "All" || listing.type === activeFilter);
      if (sort === "price-asc") return [...matches].sort((x, y) => x.price - y.price);
      if (sort === "price-desc") return [...matches].sort((x, y) => y.price - x.price);
      return matches;
    },
    [activeFilter, dataset, sort],
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
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-12">
          <form onSubmit={submitSearch} className="flex items-center gap-2 rounded-full border bg-background p-1.5 pl-4 shadow-sm">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <label className="min-w-0 flex-1">
              <span className="sr-only">City or neighbourhood</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="City or neighbourhood"
                enterKeyHint="search"
                className="h-9 w-full bg-transparent text-base outline-none md:text-sm"
              />
            </label>
            <button type="submit" className="h-9 shrink-0 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-[scale,background-color,color,border-color] duration-150 ease-out active:scale-[0.97]">
              Search
            </button>
          </form>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-[scale,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
                  activeFilter === filter ? "border-foreground bg-foreground text-background" : "bg-background hover:bg-muted"
                }`}
              >
                {filter === "All" ? "All homes" : `${filter}s`}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-12 sm:py-8">
        <h1 className="text-2xl font-bold tracking-tight">{university ? `Homes near ${university.name}` : `Accommodation in ${city}`}</h1>
        <div className="mt-1 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {visibleListings.length} furnished {visibleListings.length === 1 ? "home" : "homes"} ·{" "}
            <Link to="/" hash="tenant-protection" className="underline decoration-dotted underline-offset-4 hover:text-foreground">
              Covered by Tenant Protection
            </Link>
          </p>
          {visibleListings.length > 1 && (
            <label className="flex items-center gap-1 text-sm">
              <span className="sr-only">Sort homes</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="cursor-pointer rounded-md bg-transparent py-1 text-base font-medium outline-none hover:text-primary md:text-sm"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Lowest price</option>
                <option value="price-desc">Highest price</option>
              </select>
            </label>
          )}
        </div>

        {visibleListings.length === 0 ? (
          <div className="mt-8 flex flex-col items-center px-6 py-10 text-center">
            <NoResultsIllustration className="w-56 sm:w-64" />
            <h2 className="mt-6 text-lg font-semibold">No homes match this search</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try another home type or a nearby neighbourhood.</p>
            {activeFilter !== "All" && (
              <button type="button" onClick={() => setActiveFilter("All")} className="mt-5 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted transition-[scale,background-color,color,border-color] duration-150 ease-out active:scale-[0.97]">
                Show all homes
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                favourite={favourites.includes(listing.id)}
                onToggleFavourite={() => toggleFavourite(listing.id)}
              />
            ))}
          </div>
        )}

        <SearchStorySection university={university} />
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
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-xl bg-muted">
        <Link to="/listing" aria-label={`View ${listing.title}`} className="block aspect-[4/3]">
          {imageFailed ? (
            <span className="flex size-full items-center justify-center">
              <Home className="size-8 text-muted-foreground/60" />
            </span>
          ) : (
            <img
              src={image(listing.image)}
              alt={listing.title}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            />
          )}
        </Link>
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-semibold shadow-sm">
          <VerifiedIcon className="size-3.5" /> Tenant verified
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
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-sm font-semibold leading-5 group-hover:underline" title={listing.title}>{listing.title}</h2>
          {listing.rating && <span className="shrink-0 text-sm">★ {listing.rating}</span>}
        </div>
        <p className="mt-0.5 truncate text-sm text-muted-foreground" title={listing.area}>
          {listing.area.replace(/, Munich$/, "")} · {listing.size}
        </p>
        <p className="mt-2 text-base">
          <span className="font-bold">€{listing.price.toLocaleString("en")}</span>
          <span className="text-sm text-muted-foreground"> / month</span>
        </p>
        <Availability available={listing.available} left={listing.availableRooms} className="mt-1.5" />
      </Link>
    </article>
  );
}


/** The text and links under the results, written for the university being searched. */
function SearchStorySection({ university }: { university: University | null }) {
  const story = searchStory(university);
  const linkClass = "block text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-foreground";
  return (
    <section className="mt-14 border-t pt-10">
      <h2 className="text-xl font-bold">{story.heading}</h2>
      <div className="mt-4 max-w-3xl space-y-4 text-sm leading-6 text-muted-foreground">
        {story.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {story.columns.map((column) => (
          <div key={column.heading}>
            <h3 className="text-sm font-semibold">{column.heading}</h3>
            <div className="mt-3 space-y-2.5">
              {column.links.map((link) =>
                link.kind === "guide" ? (
                  <Link key={link.slug} to="/blog/$slug" params={{ slug: link.slug }} className={linkClass}>
                    {link.label}
                  </Link>
                ) : (
                  <Link key={link.universityId} to="/search" search={{ university: link.universityId }} className={linkClass}>
                    Homes near {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
