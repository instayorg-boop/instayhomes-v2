import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GuideRow } from "@/components/guide-row";
import { guideCategories, guides, type GuideCategory } from "@/lib/guides-content";

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

const label = "text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground";

function GuidesPage() {
  const [category, setCategory] = useState<GuideCategory | null>(null);

  const shown = category ? guides.filter((g) => g.category === category) : guides;
  const [featured, ...rest] = shown;
  // With no filter, renting-safely guides get their own row and the rest are "Latest".
  const row = category ? [] : rest.filter((g) => g.category === "Renting safely");
  const latest = rest.filter((g) => !row.includes(g));

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-12">
        <div className="pt-8 lg:pt-14">
          <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">Guides</h1>
          <p className="mt-2 text-base text-muted-foreground lg:text-lg">
            Finding, renting and living near campus in Zambia.
          </p>
          <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            {[null, ...guideCategories].map((c) => (
              <button
                key={c ?? "all"}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  category === c
                    ? "border-foreground bg-foreground text-background"
                    : "hover:border-foreground"
                }`}
              >
                {c ?? "All"}
              </button>
            ))}
          </div>
        </div>

        {featured && (
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="group mt-7 grid items-center gap-4 lg:mt-10 lg:grid-cols-[1.3fr_1fr] lg:gap-10"
          >
            <img
              src={featured.image}
              alt={featured.imageAlt}
              className="aspect-[4/3] w-full rounded-2xl object-cover lg:aspect-[16/11]"
            />
            <div>
              <span className="text-xs font-bold text-primary">{featured.category}</span>
              <h2 className="mt-1 text-2xl font-bold leading-tight tracking-tight group-hover:underline lg:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-2 text-base text-muted-foreground">{featured.dek}</p>
              <p className="mt-2 text-sm text-muted-foreground">{featured.minutes} min read</p>
            </div>
          </Link>
        )}

        {latest.length > 0 && (
          <section className="mt-10">
            <h2 className={label}>{category ? "More guides" : "Latest"}</h2>
            <div className="grid lg:grid-cols-2 lg:gap-x-12">
              {latest.map((g) => (
                <GuideRow key={g.slug} guide={g} />
              ))}
            </div>
          </section>
        )}

        {row.length > 0 && (
          <section className="mt-10">
            <h2 className={label}>Renting safely</h2>
            <div className="-mx-4 mt-3 flex gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
              {row.map((g) => (
                <Link
                  key={g.slug}
                  to="/blog/$slug"
                  params={{ slug: g.slug }}
                  className="group w-56 shrink-0 sm:w-auto"
                >
                  <img
                    src={g.image}
                    alt={g.imageAlt}
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                  <h3 className="mt-2 font-semibold leading-snug group-hover:underline">
                    {g.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{g.minutes} min read</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
