import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Globe, History, Menu, Plus, Search, ShieldCheck, X } from "lucide-react";
import ctaPhoto from "@/assets/cta-students.webp";
import heroPhoto from "@/assets/hero-house.webp";
import protectionPhoto from "@/assets/protection-student.webp";
import { Availability } from "@/components/availability";
import { openHowItWorks } from "@/components/welcome-stories";
import { FooterLink } from "@/components/site-footer";
import { HowItWorks } from "@/components/how-it-works";
import { protectionPerks } from "@/components/tenant-protection";
import { UniversityMark } from "@/components/university-mark";
import { rememberSearch, useRecentListing, useRecentSearch } from "@/lib/recent";
import { listingCount, matchUniversities, universities, type University } from "@/lib/universities";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student accommodation near universities in Zambia | Instayhomes" },
      {
        name: "description",
        content:
          "Student accommodation near universities in Zambia: hostels, boarding houses and student apartments from verified landlords. Unlock and chat with them on WhatsApp.",
      },
      { property: "og:title", content: "Student accommodation near your university | Instayhomes" },
      {
        property: "og:description",
        content: "Hostels, boarding houses and student apartments near universities in Zambia, from verified landlords you chat with on WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});


const faqs = [
  ["Is Instayhomes a rental agency?", "No. We list homes near universities from landlords we've checked, and connect you with them directly on WhatsApp."],
  ["How does it work?", "Search near your university and browse for free. When you find a room you like, get Instayhomes Plus to message the landlord and book a viewing."],
  ["What is Instayhomes Plus?", "A one-time payment by mobile money, from K199, that lets you message landlords for 30 days. It doesn't renew automatically."],
  ["Do I pay rent through Instayhomes?", "No. Rent and deposit are agreed between you and the landlord. Always view the room before you pay anything."],
  ["What if the listing is fake or not as shown?", "Tell us within your 30 days of access. Under Tenant Protection you're eligible for a full refund or free unlock credit, whichever you prefer."],
] as const;

const sectionTitle = "text-[26px] font-extrabold leading-tight tracking-[-0.045em] md:text-[38px]";

function Index() {
  const [open, setOpen] = useState<number | null>(0);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const homeNav = (e: React.MouseEvent, item: string) => {
    if (item === "How it works") {
      e.preventDefault();
      openHowItWorks();
    } else if (item === "Log in" || item === "Sign up") {
      e.preventDefault();
      void navigate({ to: "/login", search: { from: "/" } });
    } else if (item === "Help" || item === "Guides") {
      e.preventDefault();
      void navigate({ to: item === "Help" ? "/help" : "/blog" });
    } else if (item === "I'm a landlord") {
      e.preventDefault();
      void navigate({ to: "/landlords" });
    } else if (item === "Pricing") {
      e.preventDefault();
      void navigate({ to: "/pricing" });
    }
  };
  return (
    <div className="min-h-svh bg-background text-foreground">
      <AnimatePresence>
      {menu && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMenu(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-background p-6 shadow-soft"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-primary">INSTAYHOMES</span>
              <button aria-label="Close menu" onClick={() => setMenu(false)} className="rounded-md p-2 hover:bg-muted"><X className="size-5" /></button>
            </div>
            <nav className="mt-8 flex flex-col gap-1 font-medium">
              {["How it works", "Pricing", "Guides", "Help", "Log in", "Sign up", "I'm a landlord"].map((l) => (
                <a key={l} href="#" onClick={(e) => { setMenu(false); homeNav(e, l); }} className="rounded-md px-3 py-3 hover:bg-muted">{l}</a>
              ))}
            </nav>
            <div className="mt-auto border-t pt-4">
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-muted">
                <Globe className="size-5" /> Language: English
              </button>
            </div>
          </motion.aside>
        </div>
      )}
      </AnimatePresence>

      <section aria-label="Find a room" className="relative flex min-h-[460px] flex-col text-white md:min-h-[540px] lg:min-h-[560px]">
        <img src={heroPhoto} alt="" className="absolute inset-0 size-full object-cover object-[center_55%]" fetchPriority="high" />
        {/* A light fade at the top and bottom only, so the white text stays readable. */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_22%,rgba(0,0,0,0.05)_32%,rgba(0,0,0,0.62)_100%)]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.2)_45%,rgba(0,0,0,0)_70%)]" />

        <header className="relative mx-auto flex h-16 w-full md:h-20 max-w-7xl items-center justify-between px-5 sm:px-12">
          <span className="font-display text-[22px] tracking-wide md:text-[26px]">INSTAYHOMES</span>
          <nav className="flex items-center gap-1 text-[15px] font-medium">
            {["How it works", "Pricing", "Guides", "Help", "Log in"].map((l) => (
              <a key={l} href="#" onClick={(e) => { homeNav(e, l); }} className="hidden rounded-full px-3 py-2 hover:bg-white/15 md:block">{l}</a>
            ))}
            <Link to="/landlords" className="ml-1.5 hidden rounded-full bg-white px-4 py-2.5 font-semibold text-foreground transition-[scale] duration-150 ease-out active:scale-[0.97] sm:block">I'm a landlord</Link>
            <button aria-label="Open menu" onClick={() => setMenu(true)} className="ml-1.5 flex size-10 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm transition-[scale] duration-150 ease-out active:scale-95 md:hidden">
              <Menu className="size-5" />
            </button>
          </nav>
        </header>

        <div className="relative mx-auto mt-auto flex w-full max-w-7xl flex-col gap-3 px-5 pb-6 pt-10 sm:px-12 md:gap-4 md:pb-12">
          <h1 className="max-w-5xl text-balance text-[clamp(22px,6.4vw,26px)] font-extrabold uppercase leading-[0.95] tracking-[-0.06em] [text-shadow:0_2px_24px_rgba(0,0,0,0.25)] sm:text-5xl lg:text-[60px]">
            Student accommodation near your university
          </h1>
          <p className="max-w-xl text-pretty text-sm font-semibold leading-snug [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] md:text-lg">
            Hostels, boarding houses and student apartments from verified landlords. Unlock and chat with them on WhatsApp.
          </p>
          <UniversitySearch />
          <ContinueSearch />
          <a href="#tenant-protection" onClick={scrollToProtection} className="inline-flex items-center gap-1.5 self-start text-[13px] font-semibold underline-offset-4 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)] hover:underline md:text-[15px]">
            <ShieldCheck className="size-4" /> Covered by Tenant Protection
          </a>
        </div>
      </section>

      <RecentlyViewed />

      <main className="mx-auto flex max-w-7xl flex-col gap-14 px-5 pt-10 sm:px-12 md:gap-24 md:pt-16">
        <section aria-labelledby="uni-h">
          <h2 id="uni-h" className={sectionTitle}>Search by university</h2>
          <p className="mt-1.5 text-[15px] md:text-[17px] text-muted-foreground">Homes close to {universities.length} universities across Zambia.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:mt-7 lg:grid-cols-5">
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

        <HowItWorks titleClassName={sectionTitle} />

        <section id="tenant-protection" aria-labelledby="tp-h" className="-mx-5 grid scroll-mt-6 items-center bg-muted sm:-mx-12 md:mx-0 md:grid-cols-2 md:gap-16 md:rounded-[28px] md:p-8">
          <img src={protectionPhoto} alt="A student smiling while chatting at a table" loading="lazy" className="aspect-[4/3] w-full object-cover object-[center_35%] md:aspect-[5/4] md:rounded-[20px]" />
          <div className="px-5 pb-8 pt-6 sm:px-12 md:p-0">
            <h2 id="tp-h" className={`text-primary ${sectionTitle}`}>Tenant Protection</h2>
            <ul className="mt-4 space-y-4 md:mt-6 md:space-y-5">
              {protectionPerks.map(([title, body]) => (
                <li key={title} className="flex gap-3.5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary md:size-7">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold md:text-[17px]">{title}</span>
                    <span className="block text-sm text-muted-foreground md:text-base">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="faq-h" className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-16">
          <div>
            <h2 id="faq-h" className={sectionTitle}>Your questions, answered</h2>
            <p className="mt-2 text-[15px] md:text-[17px] text-muted-foreground">
              Can't find what you need?{" "}
              <Link to="/help" className="font-semibold text-foreground underline underline-offset-4">Visit the Help Center</Link>
            </p>
          </div>
          <div className="border-t">
            {faqs.map(([q, a], i) => (
              <div key={q} className="border-b">
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold md:py-5 md:text-lg">
                  {q}
                  <Plus className={`size-5 shrink-0 transition-transform duration-200 ease-out ${open === i ? "rotate-45" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="answer"
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <p className="max-w-2xl pb-4 text-[15px] text-muted-foreground md:pb-5 md:text-[17px]">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="cta-h" className="relative -mx-5 flex min-h-[360px] items-end overflow-hidden text-white sm:-mx-12 md:mx-0 md:min-h-[420px] md:items-center md:rounded-[28px]">
          <img src={ctaPhoto} alt="Four friends laughing at something on a phone" loading="lazy" className="absolute inset-0 size-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.2)_55%,rgba(0,0,0,0)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.3)_45%,rgba(0,0,0,0)_75%)]" />
          <div className="relative max-w-lg px-5 pb-8 pt-7 sm:px-12 md:p-16">
            <h2 id="cta-h" className="text-[28px] font-extrabold leading-[1.03] tracking-[-0.05em] md:text-[48px]">The endless hunt is over</h2>
            <p className="mt-2 text-[15px] font-semibold md:mt-4 md:text-lg">Rooms near your campus. Landlords one message away.</p>
            <Link to="/search" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[15px] font-bold md:mt-6 md:px-6 md:py-3.5 md:text-base text-primary-foreground transition-[scale,background-color] duration-150 ease-out hover:bg-primary/90 active:scale-[0.97]">
              Find a room <ArrowRight className="size-[18px]" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="mt-14 border-t md:mt-24">
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-10 sm:px-12 md:pt-12">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-5 md:gap-10">
            <div className="col-span-2">
              <span className="font-display text-2xl tracking-wide text-primary">INSTAYHOMES</span>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground md:text-[15px]">Student accommodation near universities in Zambia: hostels, boarding houses and apartments.</p>
            </div>
            {[
              ["Instayhomes", ["About", "Blog", "Terms", "Privacy"]],
              ["Students", ["How it works", "Pricing", "Help", "Contact us"]],
              ["Landlords", ["List your property", "Rental guides"]],
            ].map(([h, l]) => (
              <div key={h as string}>
                <p className="text-sm font-bold md:text-[15px]">{h}</p>
                {(l as string[]).map((x) => <FooterLink key={x} label={x} className="mt-2 block text-sm text-muted-foreground hover:text-foreground hover:underline md:mt-2.5 md:text-[15px]" />)}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-between gap-3 border-t pt-5 text-[13px] text-muted-foreground md:mt-10 md:pt-6 md:text-sm">
            <span>© {new Date().getFullYear()} Instayhomes · Made in Lusaka</span>
            <span className="inline-flex items-center gap-1.5"><Globe className="size-4" /> English</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Glides down to the Tenant Protection section with Motion (instantly for reduced-motion
 *  users). Any wheel, touch or key input hands control straight back to the user. */
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
  // Longer trips take a little longer, within 0.6-1.1s, with a soft ease-in-out.
  const duration = Math.min(1.1, Math.max(0.6, Math.abs(end - start) / 1800));
  const glide = animate(start, end, {
    duration,
    ease: [0.65, 0, 0.35, 1],
    onUpdate: (y) => window.scrollTo(0, y),
  });
  const events = ["wheel", "touchstart", "keydown"] as const;
  const cancel = () => {
    glide.stop();
    events.forEach((name) => window.removeEventListener(name, cancel));
  };
  events.forEach((name) => window.addEventListener(name, cancel, { once: true, passive: true }));
  void glide.then(() => events.forEach((name) => window.removeEventListener(name, cancel)));
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
    <form ref={boxRef} onSubmit={submit} role="search" className="relative mt-1 flex w-full max-w-2xl gap-2 rounded-xl bg-background p-1.5 text-left text-foreground md:p-2">
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
          className="h-10 w-full min-w-0 bg-transparent text-base outline-none md:h-11 md:text-sm"
        />
      </label>
      <button type="submit" className="flex h-10 shrink-0 items-center gap-2 rounded-md bg-primary px-4 md:h-11 md:px-5 text-sm font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out hover:bg-primary/90 active:scale-[0.97] md:px-10">
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
    <p className="-mt-2 text-left text-sm font-semibold [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
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
    <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-12 md:pt-12">
      <h2 className="flex items-center gap-2 text-base font-semibold md:text-lg">
        <History className="size-[18px] text-muted-foreground md:size-5" /> Continue where you left off
      </h2>
      {/* Same card as the search results, so a home looks the same wherever it appears. */}
      <div className="mt-3 grid gap-x-5 sm:grid-cols-2 md:mt-4 lg:grid-cols-4">
        <Link to={recent.href} className="group block w-[64%] max-w-[260px] sm:w-auto sm:max-w-none">
          <span className="block aspect-[4/3] overflow-hidden rounded-xl bg-muted">
            <img src={recent.image} alt={recent.title} loading="lazy" className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" />
          </span>
          <span className="mt-3 line-clamp-2 block text-sm font-semibold leading-5 group-hover:underline" title={recent.title}>{recent.title}</span>
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">{recent.area}</span>
          <span className="mt-2 block text-base">
            <span className="font-bold">From {recent.fromPrice}</span>
            <span className="text-sm text-muted-foreground"> / month</span>
          </span>
          <Availability available={recent.available} left={1} className="mt-1.5" />
        </Link>
      </div>
    </section>
  );
}
