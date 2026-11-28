import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { TickList } from "@/components/page-bits";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { legalIsDraft, legalUpdated, type LegalDoc } from "@/lib/legal";

const SHORT_ID = "short-version";

/** Terms and Privacy share this page: tabs, the short version, then the sections. */
export function LegalPage({ doc, current }: { doc: LegalDoc; current: "terms" | "privacy" }) {
  const toc = [{ id: SHORT_ID, title: "The short version" }, ...doc.sections];
  const active = useActiveSection(toc.map((s) => s.id));

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-12">
        <div className="grid gap-12 pt-8 lg:grid-cols-[220px_minmax(0,680px)] lg:justify-center lg:gap-16 lg:pt-12">
          <nav
            aria-label="On this page"
            className="sticky top-8 hidden self-start text-sm lg:block"
          >
            <p className="mb-3 font-bold">On this page</p>
            {toc.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`block border-l-2 py-1.5 pl-3 transition-colors ${
                  active === s.id
                    ? "border-foreground font-semibold text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.title}
              </a>
            ))}
          </nav>

          <div className="min-w-0">
            <h1 className="text-[34px] font-extrabold uppercase leading-[0.95] tracking-[-0.06em] lg:text-[64px]">Legal</h1>
            <div className="mt-5 flex gap-6 border-b" role="tablist">
              {(["terms", "privacy"] as const).map((tab) => (
                <Link
                  key={tab}
                  to={tab === "terms" ? "/terms" : "/privacy"}
                  role="tab"
                  aria-selected={current === tab}
                  className={`-mb-px border-b-2 py-3 font-semibold transition-colors ${
                    current === tab
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "terms" ? "Terms of use" : "Privacy policy"}
                </Link>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Last updated {legalUpdated}</p>

            {legalIsDraft && (
              <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <FileText className="mt-0.5 size-4 shrink-0" />
                Draft wording for review. This page isn't final yet.
              </p>
            )}

            <section id={SHORT_ID} className="mt-6 scroll-mt-24 rounded-2xl bg-primary/10 p-5 md:p-7">
              <h2 className="text-lg font-extrabold tracking-[-0.03em] md:text-xl">The short version</h2>
              <TickList className="mt-4" items={doc.shortVersion} />
            </section>

            {/* Phones: the section list sits above the text instead of beside it. */}
            <nav aria-label="Sections" className="mt-6 rounded-2xl border px-4 lg:hidden">
              {doc.sections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center justify-between border-b py-3 text-[15px] last:border-b-0"
                >
                  <span>
                    {i + 1}. {s.title}
                  </span>
                  <span aria-hidden className="text-muted-foreground">
                    ↓
                  </span>
                </a>
              ))}
            </nav>

            <div className="text-base leading-relaxed text-foreground/85">
              {doc.sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="mt-10 text-xl font-extrabold tracking-[-0.03em] text-foreground md:text-2xl">
                    {i + 1}. {s.title}
                  </h2>
                  {s.paragraphs?.map((p) => (
                    <p key={p} className="mt-3">
                      {p}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5">
                      {s.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/** The section nearest the top of the screen, for the "On this page" list. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(",");
  useEffect(() => {
    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}
