import { createFileRoute } from "@tanstack/react-router";
import { Search, ShieldCheck, Video, CreditCard, MapPin, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nestaway Stays — Mid-term rentals for students & professionals" },
      { name: "description", content: "Find verified rooms, studios and apartments for 1 to 12 months in cities worldwide. Book online, move in safely." },
      { property: "og:title", content: "Nestaway Stays — Mid-term rentals" },
      { property: "og:description", content: "Verified rooms and apartments for 1–12 months, booked online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;
const cities = [
  { name: "Amsterdam", count: "4,210", src: img("photo-1534351590666-13e3e96b5017") },
  { name: "Berlin", count: "6,830", src: img("photo-1560969184-10fe8719e047") },
  { name: "Madrid", count: "5,140", src: img("photo-1539037116277-4db20889f2d4") },
  { name: "Paris", count: "3,920", src: img("photo-1502602898657-3e91760cbb34") },
  { name: "Lisbon", count: "2,670", src: img("photo-1585208798174-6cedd86e019a") },
  { name: "Milan", count: "2,310", src: img("photo-1513581166391-887a96ddeafd") },
];
const features = [
  { icon: ShieldCheck, title: "Verified landlords", text: "Every listing is checked so you can book with confidence." },
  { icon: Video, title: "Book without viewing", text: "Photos, videos and floor plans help you decide from anywhere." },
  { icon: CreditCard, title: "Secure payments", text: "Your first rent is held safely until 48 hours after move-in." },
];
const reviews = [
  { name: "Sofia, Rome → Berlin", text: "I found my studio a month before my internship started. Moving in was totally stress-free." },
  { name: "Daniel, Toronto → Madrid", text: "Booking from abroad felt safe thanks to the payment protection. Highly recommend." },
  { name: "Aiko, Osaka → Amsterdam", text: "Great choice of rooms and the support team answered within hours." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <span className="font-display text-2xl font-bold text-primary">nestaway</span>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="#cities" className="hover:text-primary">Cities</a>
            <a href="#how" className="hover:text-primary">How it works</a>
            <a href="#landlords" className="hover:text-primary">For landlords</a>
          </nav>
          <div className="flex gap-2">
            <button className="hidden rounded-full px-4 py-2 text-sm font-medium hover:bg-muted sm:block">Log in</button>
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Sign up</button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              Your next home abroad, <span className="text-primary">booked online.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Rooms, studios and apartments for 1 to 12 months. Verified, secure and ready when you are.
            </p>
            <form className="mt-8 flex flex-col gap-2 rounded-2xl bg-card p-2 shadow-soft sm:flex-row">
              <label className="flex flex-1 items-center gap-2 px-3">
                <MapPin className="size-5 text-muted-foreground" />
                <input placeholder="Where are you going?" className="h-12 w-full bg-transparent outline-none" />
              </label>
              <input type="month" className="h-12 rounded-xl bg-muted px-3 text-sm outline-none" />
              <button type="button" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground">
                <Search className="size-4" /> Search
              </button>
            </form>
            <p className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="size-4 fill-accent text-accent" /> 4.6/5 from 20,000+ tenants
            </p>
          </div>
          <img src={img("photo-1522708323590-d24dbb6b0267")} alt="Bright furnished apartment" className="h-[420px] w-full rounded-3xl object-cover shadow-soft" />
        </div>
      </section>

      <section id="cities" className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="font-display text-3xl font-bold">Popular cities</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {cities.map((c) => (
            <a key={c.name} href="#" className="group relative h-56 overflow-hidden rounded-2xl">
              <img src={c.src} alt={c.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-background">
                <p className="text-xl font-bold">{c.name}</p>
                <p className="text-sm opacity-90">{c.count} places</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="how" className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-3xl font-bold">Rent with peace of mind</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-card p-6 shadow-soft">
                <f.icon className="size-10 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="font-display text-3xl font-bold">What tenants say</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-2xl border p-6">
              <div className="flex gap-0.5">{[0,1,2,3,4].map((i) => <Star key={i} className="size-4 fill-accent text-accent" />)}</div>
              <blockquote className="mt-3">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-muted-foreground">{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="landlords" className="mx-auto max-w-7xl px-4 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary p-10 text-primary-foreground md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold">Have a place to rent out?</h2>
            <p className="mt-2 opacity-90">Reach thousands of verified international tenants. Listing is free.</p>
          </div>
          <button className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">List your property</button>
        </div>
      </section>

      <footer className="border-t py-10 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 md:flex-row">
          <span className="font-display text-lg font-bold text-primary">nestaway</span>
          <div className="flex gap-6"><a href="#">About</a><a href="#">Help</a><a href="#">Terms</a><a href="#">Privacy</a></div>
          <span>© 2026 Nestaway Stays</span>
        </div>
      </footer>
    </div>
  );
}
