import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, CalendarDays, ShieldCheck, CheckCircle2, ChevronDown, Globe, Menu, X } from "lucide-react";
import homesImg from "@/assets/stat-homes.jpg";
import partnersImg from "@/assets/stat-partners.jpg";
import tenantsImg from "@/assets/stat-tenants.jpg";
import citiesImg from "@/assets/stat-cities.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nestaway Stays — Find your next home for months" },
      { name: "description", content: "Rent rooms, studios and apartments for months in cities across Europe. Book online with tenant protection." },
      { property: "og:title", content: "Nestaway Stays — Find your next home" },
      { property: "og:description", content: "Mid-term rentals across Europe, booked online with tenant protection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const img = (id: string, w = 500) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
const cities = [
  ["Berlin", "3,267", "photo-1560969184-10fe8719e047"],
  ["Barcelona", "4,733", "photo-1583422409516-2895a77efded"],
  ["Munich", "810", "photo-1595867818082-083862f3d630"],
  ["Vienna", "2,441", "photo-1516550893923-42d28e5677af"],
  ["Brussels", "2,138", "photo-1559113202-c916b8e44373"],
  ["Madrid", "9,340", "photo-1539037116277-4db20889f2d4"],
  ["Amsterdam", "1,200", "photo-1534351590666-13e3e96b5017"],
  ["Milan", "5,941", "photo-1513581166391-887a96ddeafd"],
  ["Helsinki", "398", "photo-1538332576228-eb5b4c4de6f5"],
  ["Paris", "1,916", "photo-1502602898657-3e91760cbb34"],
] as const;
const stats = [["110,000+", "Homes listed", homesImg], ["400+", "University partners", partnersImg], ["180,000+", "Happy tenants", tenantsImg], ["175+", "Cities", citiesImg]] as const;
const perks = [
  ["Covered if plans fall through", "If your landlord cancels late or delays your move-in, we help you find a new place or cover a short hotel stay."],
  ["Help when you need it", "Something wrong with your rental? Our support team steps in quickly."],
  ["Move in worry-free", "Your payment is held until you move in. If the home isn't as described, you get your money back."],
];
const tabs = ["All", "Apartments", "Private rooms", "Shared rooms", "Studios", "Budget stays", "Student housing", "Long stays"];
const countries: [string, string[]][] = [
  ["Austria", ["Vienna"]], ["Germany", ["Berlin", "Cologne", "Düsseldorf", "Frankfurt", "Hamburg", "Munich", "Stuttgart"]],
  ["Hungary", ["Budapest"]], ["Netherlands", ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"]], ["Spain", ["Barcelona", "Madrid", "Málaga", "Seville", "Valencia"]],
  ["Belgium", ["Brussels"]], ["Italy", ["Bologna", "Florence", "Milan", "Padua", "Rome", "Turin"]], ["Portugal", ["Lisbon", "Porto"]],
  ["Czech Republic", ["Prague"]], ["Greece", ["Athens"]], ["France", ["Bordeaux", "Lyon", "Paris", "Strasbourg"]],
];
const faqs = [
  ["Is Nestaway a rental agency?", "No. We're an online platform that connects tenants with verified landlords and agencies, and keeps your payment safe."],
  ["How does Nestaway work?", "Search a city, pick a home, send a booking request and pay your first rent online once the landlord accepts."],
  ["My request was accepted. What now?", "You'll get a confirmation with your contract details and the landlord's contact info to plan your move-in."],
  ["Can I cancel my stay?", "Yes, depending on the landlord's cancellation policy, which is shown on every listing."],
  ["Can I see the place before renting?", "Most listings have photos, videos and floor plans. Some landlords also offer video viewings."],
];

function Index() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Shared rooms");
  const [open, setOpen] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <span className="font-display text-2xl tracking-wide text-primary">NESTAWAY</span>
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
              <span className="font-display text-2xl text-primary">NESTAWAY</span>
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
          <p className="mt-4 inline-flex items-center gap-2 text-sm underline decoration-dotted underline-offset-4">
            <ShieldCheck className="size-4" /> Covered by Tenant Protection
          </p>
          <form onSubmit={(event) => { event.preventDefault(); void navigate({ to: "/search" }); }} className="mt-8 flex flex-col gap-2 rounded-xl bg-background p-2 text-foreground md:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-md border px-3">
              <Search className="size-4" />
              <input placeholder="Where will you go?" className="h-11 w-full bg-transparent text-sm outline-none" />
            </label>
            <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-md border px-6 text-sm font-medium md:w-64">
              <CalendarDays className="size-4" /> Move-in – Move-out
            </button>
            <button type="submit" className="h-11 rounded-md bg-primary px-10 text-sm font-semibold text-primary-foreground">Search</button>
          </form>
          <p className="mt-3 text-left text-xs font-medium">Continue your search: <a href="#" className="underline">Berlin</a></p>
        </div>
        <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full fill-background md:h-20">
          <path d="M0 80 Q720 -40 1440 80 Z" />
        </svg>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-center text-2xl font-semibold">Explore popular cities</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {cities.map(([n, c, id]) => (
            <Link key={n} to="/search" className="group">
              <img src={img(id)} alt={n} loading="lazy" className="aspect-[5/3] w-full rounded-lg object-cover transition group-hover:opacity-90" />
              <p className="mt-2 text-sm font-semibold group-hover:underline">{n}</p>
              <p className="text-xs text-muted-foreground">{c} listings</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row lg:items-center">
          <h2 className="text-2xl font-semibold lg:w-72">Why Nestaway?</h2>
          <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map(([v, l, src]) => (
              <div key={l} className="relative flex h-28 overflow-hidden rounded-xl bg-stat p-4">
                <div className="relative z-10">
                  <p className="text-lg font-bold">{v}</p><p className="max-w-[7rem] text-sm text-muted-foreground">{l}</p>
                </div>
                <img src={src} alt="" loading="lazy" className="absolute -bottom-2 -right-2 h-32 w-32 object-cover mix-blend-multiply" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
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

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-2xl font-semibold">Find your ideal accommodation</h2>
        <div className="mt-6 flex gap-4 overflow-x-auto border-b text-xs">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap pb-2 ${tab === t ? "border-b-2 border-foreground font-semibold" : "text-muted-foreground"}`}>{t}</button>
          ))}
        </div>
        <div className="mt-8 columns-2 gap-8 text-sm md:columns-5">
          {countries.map(([c, list]) => (
            <div key={c} className="mb-6 break-inside-avoid">
              <p className="font-semibold">{c}</p>
              {list.map((x) => <a key={x} href="#" className="mt-1.5 block text-xs text-muted-foreground hover:underline">{x}</a>)}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-3xl font-bold md:text-4xl">Your questions, answered</h2>
        <div className="mt-8">
          {faqs.map(([q, a], i) => (
            <div key={q} className="border-t">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between py-4 text-left font-semibold">
                {q}<ChevronDown className={`size-5 transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="pb-4 text-sm text-muted-foreground">{a}</p>}
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
            <span className="font-display text-2xl text-primary">NESTAWAY</span>
            <p className="mt-4 text-xs">🌐 English</p>
            <div className="mt-6 max-w-xs rounded-lg border bg-card p-4">
              <p className="font-semibold">Get the app</p>
              <p className="mt-1 text-xs text-muted-foreground">Search faster and get instant alerts.</p>
            </div>
          </div>
          {[
            ["Nestaway", ["About", "Careers", "Press", "Partners", "Terms", "Privacy", "Blog"]],
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
