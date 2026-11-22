import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Search, ShieldCheck, CheckCircle2, ChevronDown, Globe, History, Menu, X } from "lucide-react";
import homesImg from "@/assets/stat-homes.png";
import partnersImg from "@/assets/stat-partners.png";
import tenantsImg from "@/assets/stat-tenants.png";
import citiesImg from "@/assets/stat-cities.png";
import { Availability } from "@/components/availability";
import { UniversityMark } from "@/components/university-mark";
import { rememberSearch, useRecentListing, useRecentSearch } from "@/lib/recent";
import { listingCount, matchUniversities, universities, type University } from "@/lib/universities";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Instayhomes — Find your next home for months" },
      { name: "description", content: "Rent rooms, studios and apartments for months in cities across Europe. Book online with tenant protection." },
      { property: "og:title", content: "Instayhomes — Find your next home" },
      { property: "og:description", content: "Mid-term rentals across Europe, booked online with tenant protection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const img = (id: string, w = 500) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
const stats = [["110,000+", "Homes listed", homesImg], ["400+", "University partners", partnersImg], ["180,000+", "Happy tenants", tenantsImg], ["175+", "Cities", citiesImg]] as const;
const perks = [
  ["Covered if plans fall through", "If your landlord cancels late or delays your move-in, we help you find a new place or cover a short hotel stay."],
  ["Help when you need it", "Something wrong with your rental? Our support team steps in quickly."],
  ["Move in worry-free", "Your payment is held until you move in. If the home isn't as described, you get your money back."],
];
const faqs = [
  ["Is Instayhomes a rental agency?", "No. We're an online platform that connects tenants with verified landlords and agencies, and keeps your payment safe."],
  ["How does Instayhomes work?", "Search a city, pick a home, send a booking request and pay your first rent online once the landlord accepts."],
  ["My request was accepted. What now?", "You'll get a confirmation with your contract details and the landlord's contact info to plan your move-in."],
  ["Can I cancel my stay?", "Yes, depending on the landlord's cancellation policy, which is shown on every listing."],
  ["Can I see the place before renting?", "Most listings have photos, videos and floor plans. Some landlords also offer video viewings."],
];

function Index() {
  const [open, setOpen] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <span className="font-display text-2xl tracking-wide text-primary">INSTAYHOMES</span>
          <nav className="flex items-center gap-1 text-sm font-medium">
            {["How it works", "Pricing", "Help", "Log in", "Sign up"].map((l) => (
              <a key={l} href="#" className="hidden rounded-md px-3 py-2 hover:bg-muted md:block">{l}</a>
            ))}
            <a href="#" className="rounded-md border border-foreground/30 px-3 py-2">I'm a landlord</a>
            <button aria-label="Open menu" onClick={() => setMenu(true)} className="ml-1 rounded-md p-2 hover:bg-muted"><Menu className="size-5" /></button>
          </nav>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMenu(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-background p-6 shadow-soft animate-in slide-in-from-right">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-primary">INSTAYHOMES</span>
              <button aria-label="Close menu" onClick={() => setMenu(false)} className="rounded-md p-2 hover:bg-muted"><X className="size-5" /></button>
            </div>
            <nav className="mt-8 flex flex-col gap-1 font-medium">
              {["How it works", "Pricing", "Help", "Log in", "Sign up", "I'm a landlord"].map((l) => (
                <a key={l} href="#" className="rounded-md px-3 py-3 hover:bg-muted">{l}</a>
              ))}
            </nav>
            <div className="mt-auto border-t pt-4">
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-muted">
                <Globe className="size-5" /> Language: English
              </button>
            </div>
          </aside>
        </div>
      )}

      <section className="relative bg-primary px-4 pb-32 pt-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-5xl md:text-7xl">FIND YOUR NEXT HOME</h1>
          <p className="mt-3 text-xl font-semibold md:text-2xl">Rent a place, stay for months.</p>
          <a href="#tenant-protection" onClick={scrollToProtection} className="mt-4 inline-flex items-center gap-2 rounded-md text-sm underline decoration-dotted underline-offset-4 hover:decoration-solid">
            <ShieldCheck className="size-4" /> Covered by Tenant Protection
          </a>
          <UniversitySearch />
          <ContinueSearch />
        </div>
        <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full fill-background md:h-20">
          <path d="M0 80 Q720 -40 1440 80 Z" />
        </svg>
      </section>

      <RecentlyViewed />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-center text-2xl font-semibold">Search by university</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {universities.map((uni, index) => (
            <Link key={uni.id} to="/search" search={{ university: uni.id }} className="group rounded-lg">
              <UniversityMark university={uni} size="tile" index={index} />
              <p className="mt-2 text-sm font-semibold leading-5 group-hover:underline">{uni.name}</p>
              <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                {uni.city}
                <span className="size-1 rounded-full bg-current" aria-hidden />
                <span className={uni.listings > 0 ? "font-medium text-foreground" : ""}>{listingCount(uni.listings)}</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row lg:items-center">
          <h2 className="text-2xl font-semibold lg:w-72">Why Instayhomes?</h2>
          <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map(([v, l, src]) => (
              <div key={l} className="relative flex h-28 overflow-hidden rounded-xl bg-stat p-4">
                <div className="relative z-10">
                  <p className="text-lg font-bold">{v}</p><p className="max-w-[7rem] text-sm text-muted-foreground">{l}</p>
                </div>
                <img src={src} alt="" loading="lazy" className="absolute -bottom-1 -right-1 h-28 w-28 object-contain object-right-bottom" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tenant-protection" className="scroll-mt-4 bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-12">
          <div>
            <h2 className="font-display text-5xl leading-none md:text-6xl">TENANT<br />PROTECTION</h2>
            <ul className="mt-8 space-y-5">
              {perks.map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  <div><p className="font-semibold">{t}</p><p className="mt-1 text-sm opacity-90">{d}</p></div>
                </li>
              ))}
            </ul>
            <a href="#" className="mt-6 inline-block pl-8 text-sm font-semibold underline">Learn about Tenant Protection</a>
          </div>
          <img src={img("photo-1522071820081-009f0129c71c", 900)} alt="Happy tenants at home" className="aspect-[4/3] w-full rounded-lg object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-center font-display text-5xl leading-none md:text-6xl">YOUR QUESTIONS, ANSWERED</h2>
        <div className="mt-8">
          {faqs.map(([q, a], i) => (
            <div key={q} className="border-t">
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold">
                {q}<ChevronDown className={`size-5 shrink-0 transition-transform duration-200 ease-out ${open === i ? "rotate-180" : ""}`} />
              </button>
              <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
                <p className="overflow-hidden pb-0 text-sm text-muted-foreground">
                  <span className="block pb-4">{a}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <a href="#" className="mt-6 inline-block text-sm font-semibold underline">Visit our Help Center</a>
      </section>

      <section className="px-4 pb-20 pt-8 text-center">
        <h2 className="font-display text-4xl md:text-6xl">THE ENDLESS HUNT IS OVER</h2>
        <Link to="/search" className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Find your next home</Link>
      </section>

      <footer className="bg-muted py-14 text-sm">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <span className="font-display text-2xl text-primary">INSTAYHOMES</span>
            <p className="mt-4 text-xs">🌐 English</p>
            <div className="mt-6 max-w-xs rounded-lg border bg-card p-4">
              <p className="font-semibold">Get the app</p>
              <p className="mt-1 text-xs text-muted-foreground">Search faster and get instant alerts.</p>
            </div>
          </div>
          {[
            ["Instayhomes", ["About", "Careers", "Press", "Partners", "Terms", "Privacy", "Blog"]],
            ["Tenants", ["How it works", "Pricing", "Pay rent online", "Help", "Contact us"]],
            ["Landlords", ["How it works", "Pricing", "Become a landlord", "Rent guarantee", "Guides"]],
          ].map(([h, l]) => (
            <div key={h as string}>
              <p className="font-semibold">{h}</p>
              {(l as string[]).map((x) => <a key={x} href="#" className="mt-2 block text-xs text-muted-foreground hover:underline">{x}</a>)}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}


/** Smoothly brings the Tenant Protection section into view (instantly for reduced-motion users).
 *  Animated by hand rather than with `scroll-behavior: smooth`, which some browsers skip. */
function scrollToProtection(event: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById("tenant-protection");
  if (!target) return;
  event.preventDefault();
  window.history.replaceState(null, "", "#tenant-protection");
  const start = window.scrollY;
  const end = start + target.getBoundingClientRect().top - 16;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, end);
    return;
  }
  // Longer trips take a little longer, within 450–900ms; strong ease-in-out for on-screen movement.
  const duration = Math.min(900, Math.max(450, Math.abs(end - start) * 0.4));
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const began = performance.now();
  // Any wheel, touch or key input hands control back to the user immediately.
  let cancelled = false;
  const cancel = () => (cancelled = true);
  const events = ["wheel", "touchstart", "keydown"] as const;
  events.forEach((name) => window.addEventListener(name, cancel, { once: true, passive: true }));
  const step = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - began) / duration);
    window.scrollTo(0, start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(step);
    else events.forEach((name) => window.removeEventListener(name, cancel));
  };
  requestAnimationFrame(step);
}

/** One search box: type a university (or its short name or city) and pick from the suggestions. */
function UniversitySearch() {
  const navigate = useNavigate();
  const listId = useId();
  const boxRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const matches = matchUniversities(query).slice(0, 6);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const go = (uni: University) => {
    rememberSearch({ label: uni.name, universityId: uni.id });
    setOpen(false);
    void navigate({ to: "/search", search: { university: uni.id } });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pick = matches[active] ?? matches[0];
    if (pick) go(pick);
    else void navigate({ to: "/search" });
  };

  return (
    <form ref={boxRef} onSubmit={submit} role="search" className="relative mt-8 flex gap-2 rounded-xl bg-background p-2 text-left text-foreground">
      <label className="flex min-w-0 flex-1 items-center rounded-md px-3">
        <span className="sr-only">Search for your university</span>
        <input
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && matches[active] ? `${listId}-${matches[active].id}` : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActive((index) => Math.min(index + 1, matches.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((index) => Math.max(index - 1, 0));
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Search for your university"
          autoComplete="off"
          enterKeyHint="search"
          className="h-11 w-full min-w-0 bg-transparent text-base outline-none md:text-sm"
        />
      </label>
      <button type="submit" className="flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out hover:bg-primary/90 active:scale-[0.97] md:px-10">
        <Search className="size-4 md:hidden" /> <span className="max-md:sr-only">Search</span>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Universities"
          className="absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border bg-background p-1.5 text-foreground shadow-soft origin-top animate-in fade-in zoom-in-95 duration-150 ease-out"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-3 text-sm text-muted-foreground">No university matches “{query}”. Try its short name, like UNZA or CBU.</li>
          ) : (
            matches.map((uni, index) => (
              <li
                key={uni.id}
                id={`${listId}-${uni.id}`}
                role="option"
                aria-selected={index === active}
                onPointerEnter={() => setActive(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => go(uni)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${index === active ? "bg-muted" : ""}`}
              >
                <UniversityMark university={uni} size="chip" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{uni.name}</span>
                  <span className="block text-xs text-muted-foreground">{uni.city} · {listingCount(uni.listings)}</span>
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </form>
  );
}

/** Under the search box: a link back to the last university they searched. Hidden until there is one. */
function ContinueSearch() {
  const recent = useRecentSearch();
  if (!recent) return null;
  return (
    <p className="mt-3 text-left text-xs font-medium">
      Continue your search:{" "}
      <Link to="/search" search={{ university: recent.universityId }} className="underline underline-offset-2">
        {recent.label}
      </Link>
    </p>
  );
}

/** The last listing they opened, so they can pick up where they left off. Hidden until there is one. */
function RecentlyViewed() {
  const recent = useRecentListing();
  if (!recent) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <History className="size-5 text-muted-foreground" /> Continue where you left off
      </h2>
      <Link
        to={recent.href}
        className="group mt-4 flex max-w-xl items-center gap-4 rounded-xl border p-3 transition-[scale,border-color] duration-150 ease-out hover:border-foreground/30 active:scale-[0.99]"
      >
        <img src={recent.image} alt="" className="size-20 shrink-0 rounded-lg object-cover sm:size-24" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold group-hover:underline">{recent.title}</span>
          <span className="block text-sm text-muted-foreground">{recent.area}</span>
          <span className="mt-1 block text-sm"><span className="font-bold">From {recent.fromPrice}</span> <span className="text-muted-foreground">/ month</span></span>
          <Availability available={recent.available} left={1} className="mt-0.5 text-xs" />
        </span>
        <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}
