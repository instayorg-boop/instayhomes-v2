import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  formatGuideDate,
  guideCategories,
  guides,
  type Guide,
  type GuideCategory,
} from "@/lib/guides-content";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Student guides | Instayhomes" },
      {
        name: "description",
        content: "Practical guides to finding, renting and living near campus in Zambia.",
      },
    ],
  }),
  component: GuidesPage,
});

// Layout: categories down the left on desktop (chips on phones), a featured guide in a tinted
// panel, a "Latest" row of three cards, then every guide as a list.
function GuidesPage() {
  const [category, setCategory] = useState<GuideCategory | null>(null);

  const shown = category ? guides.filter((g) => g.category === category) : guides;
  const [featured, ...rest] = shown;
  const latest = category ? [] : rest.slice(0, 3);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-12 lg:pb-24 lg:pt-14">
        <div className="lg:flex lg:items-start lg:gap-16">
          <aside className="lg:sticky lg:top-8 lg:w-[200px] lg:shrink-0">
            <h1 className="text-[28px] font-extrabold leading-none tracking-[-0.045em] lg:text-[44px]">
              Guides
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground lg:hidden">
              Finding, renting and living near campus in Zambia.
            </p>
            <nav
              aria-label="Guide topics"
              className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-12 sm:px-12 lg:mx-0 lg:mt-7 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {[null, ...guideCategories].map((c) => {
                const on = category === c;
                return (
                  <button
                    key={c ?? "all"}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setCategory(c)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors lg:rounded-lg lg:border-0 lg:px-3 lg:py-2.5 lg:text-left lg:text-[15px] ${
                      on
                        ? "border-foreground bg-foreground text-background lg:bg-primary/10 lg:font-semibold lg:text-primary"
                        : "text-muted-foreground hover:border-foreground hover:text-foreground lg:hover:bg-muted"
                    }`}
                  >
                    {c ?? "All guides"}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 flex-1 pt-6 lg:pt-0">
            {featured && <FeaturedGuide guide={featured} />}

            {latest.length > 0 && (
              <section aria-labelledby="latest-h" className="mt-14 lg:mt-20">
                <h2
                  id="latest-h"
                  className="text-[22px] font-extrabold tracking-[-0.04em] lg:text-[30px]"
                >
                  Latest
                </h2>
                <div className="mt-5 grid gap-8 sm:grid-cols-2 lg:mt-7 lg:grid-cols-3 lg:gap-7">
                  {latest.map((g) => (
                    <Link
                      key={g.slug}
                      to="/blog/$slug"
                      params={{ slug: g.slug }}
                      className="group block"
                    >
                      <img
                        src={g.image}
                        alt={g.imageAlt}
                        loading="lazy"
                        className="aspect-[3/2] w-full rounded-xl object-cover"
                      />
                      <p className="mt-4 text-lg font-bold leading-snug tracking-[-0.02em] group-hover:underline lg:text-xl">
                        {g.title}
                      </p>
                      <p className="mt-1.5 line-clamp-3 text-[15px] text-muted-foreground">
                        {g.dek}
                      </p>
                      <Byline guide={g} className="mt-3" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section aria-labelledby="all-h" className="mt-14 lg:mt-24">
                <h2
                  id="all-h"
                  className="text-[22px] font-extrabold tracking-[-0.04em] lg:text-[30px]"
                >
                  {category ? `More on ${category.toLowerCase()}` : "All guides"}
                </h2>
                <div className="mt-5 flex flex-col gap-7 lg:mt-8 lg:gap-10">
                  {(category ? rest : shown).map((g) => (
                    <Link
                      key={g.slug}
                      to="/blog/$slug"
                      params={{ slug: g.slug }}
                      className="group flex items-start gap-4 lg:gap-7"
                    >
                      <img
                        src={g.image}
                        alt=""
                        loading="lazy"
                        className="aspect-[3/2] w-28 shrink-0 rounded-lg object-cover sm:w-40 lg:w-[190px] lg:rounded-xl"
                      />
                      <span className="min-w-0">
                        <span className="block text-base font-bold leading-snug tracking-[-0.02em] group-hover:underline lg:text-[22px]">
                          {g.title}
                        </span>
                        <span className="mt-1 line-clamp-2 hidden text-[15px] text-muted-foreground sm:block">
                          {g.dek}
                        </span>
                        <Byline guide={g} className="mt-2" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/** The newest guide, in a tinted panel with its "In short" points as a little checklist. */
function FeaturedGuide({ guide }: { guide: Guide }) {
  return (
    <Link to="/blog/$slug" params={{ slug: guide.slug }} className="group block">
      <div className="flex flex-col gap-6 rounded-2xl bg-primary/10 p-6 sm:p-9 lg:flex-row lg:items-center lg:gap-10 lg:p-12">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-primary">{guide.category}</p>
          <h2 className="mt-2 text-[28px] font-extrabold leading-[1.05] tracking-[-0.045em] text-foreground group-hover:underline sm:text-4xl lg:text-[48px]">
            {guide.title}
          </h2>
        </div>
        <ul className="flex flex-col gap-1 rounded-2xl bg-background/80 p-2.5 lg:w-[340px] lg:shrink-0">
          {guide.inShort.slice(0, 3).map((point, i) => (
            <li
              key={point}
              className={`flex items-start gap-3 rounded-xl px-3.5 py-3 text-[15px] leading-snug ${i === 0 ? "bg-background shadow-sm" : ""}`}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-5 max-w-3xl text-base text-muted-foreground lg:mt-6 lg:text-lg">
        {guide.dek}
      </p>
      <Byline guide={guide} className="mt-3" />
    </Link>
  );
}

function Byline({ guide, className = "" }: { guide: Guide; className?: string }) {
  return (
    <span
      className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-muted-foreground ${className}`}
    >
      <span
        aria-hidden
        className="flex size-[22px] items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary"
      >
        IH
      </span>
      Instayhomes
      <span aria-hidden>·</span>
      {formatGuideDate(guide.published)}
      <span aria-hidden>·</span>
      {guide.minutes} min read
    </span>
  );
}
