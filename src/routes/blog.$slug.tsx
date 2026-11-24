import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Check, ChevronLeft, Share, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { GuideRow } from "@/components/guide-row";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { guideTitle } from "@/lib/guides";
import {
  formatGuideDate,
  guideBySlug,
  relatedGuides,
  type Guide,
  type GuideBlock,
} from "@/lib/guides-content";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const guide = guideBySlug(params.slug);
    return {
      meta: guide
        ? [
            { title: `${guide.title} | Instayhomes` },
            { name: "description", content: guide.dek },
            { property: "og:image", content: guide.image },
          ]
        : [
            { title: `${guideTitle(params.slug) ?? "Guide"} | Instayhomes` },
            { name: "robots", content: "noindex" },
          ],
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { slug } = Route.useParams();
  const guide = guideBySlug(slug);
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      {guide ? <Article guide={guide} /> : <GuideComingSoon slug={slug} />}
      <SiteFooter />
    </div>
  );
}

function Article({ guide }: { guide: Guide }) {
  const [shared, setShared] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: guide.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      // Cancelled share sheet or blocked clipboard: nothing to do.
    }
  };

  return (
    <main>
      <div className="mx-auto max-w-[700px] px-4 pt-4 sm:px-0 lg:pt-10">
        <div className="flex items-center justify-between">
          <Link
            to="/blog"
            className="-ml-2 flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-semibold hover:bg-muted"
          >
            <ChevronLeft className="size-4" /> Guides
          </Link>
          <button
            type="button"
            onClick={share}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted"
          >
            {shared ? <Check className="size-4" /> : <Share className="size-4" />}
            <span className={shared ? "" : "sr-only"}>{shared ? "Link copied" : "Share"}</span>
          </button>
        </div>
        <p className="mt-5 text-xs font-bold text-primary">{guide.category}</p>
        <h1 className="mt-2 text-balance text-3xl font-bold leading-[1.12] tracking-tight lg:text-5xl">
          {guide.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{guide.dek}</p>
        <div className="mt-5 flex items-center gap-3 text-sm">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            IH
          </span>
          <div>
            <p className="font-semibold">Instayhomes team</p>
            <p className="text-muted-foreground">
              {formatGuideDate(guide.published)} · {guide.minutes} min read
            </p>
          </div>
        </div>
      </div>

      <img
        src={guide.image}
        alt={guide.imageAlt}
        className="mt-6 aspect-[3/2] w-full object-cover sm:mx-auto sm:mt-8 sm:max-w-[1000px] sm:rounded-2xl sm:px-0 lg:aspect-[2/1]"
      />

      <div className="mx-auto max-w-[700px] px-4 sm:px-0">
        <div className="mt-7 rounded-2xl bg-muted p-5">
          <p className="font-semibold">In short</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base">
            {guide.inShort.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="mt-2 text-lg leading-[1.7] text-foreground/90">
          {guide.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <WasThisHelpful slug={guide.slug} />

        <div className="mt-7 flex items-center gap-4 rounded-2xl bg-muted p-4">
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Every landlord on Instayhomes is checked</p>
            <p className="text-sm text-muted-foreground">
              Browse rooms near your university for free.
            </p>
          </div>
          <Link
            to="/search"
            className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out hover:bg-primary/90 active:scale-[0.97]"
          >
            Find a room
          </Link>
        </div>

        <section className="mt-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
            Keep reading
          </h2>
          {relatedGuides(guide).map((g) => (
            <GuideRow key={g.slug} guide={g} />
          ))}
        </section>
      </div>
    </main>
  );
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "p":
      return <p className="mt-4">{block.text}</p>;
    case "h2":
      return (
        <h2 className="mt-9 text-[22px] font-bold leading-snug tracking-tight text-foreground">
          {block.text}
        </h2>
      );
    case "steps":
      return (
        <ol className="mt-4 list-decimal space-y-3 pl-6">
          {block.items.map((item) => (
            <li key={item.lead}>
              <strong className="font-semibold text-foreground">{item.lead}</strong> {item.text}
            </li>
          ))}
        </ol>
      );
    case "checklist":
      return (
        <ul className="mt-4 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#128C4A]/10 text-[#128C4A]">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <p className="mt-7 border-l-[3px] border-primary pl-5 text-xl font-semibold leading-snug tracking-tight text-foreground">
          {block.text}
        </p>
      );
  }
}

const FEEDBACK_KEY = "instayhomes-guide-feedback";

function WasThisHelpful({ slug }: { slug: string }) {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FEEDBACK_KEY) ?? "{}") as Record<
        string,
        "yes" | "no"
      >;
      return saved[slug] ?? null;
    } catch {
      return null;
    }
  });

  const choose = (value: "yes" | "no") => {
    setAnswer(value);
    try {
      const saved = JSON.parse(localStorage.getItem(FEEDBACK_KEY) ?? "{}") as Record<
        string,
        string
      >;
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify({ ...saved, [slug]: value }));
    } catch {
      // Storage blocked: the thank-you still shows for this visit.
    }
  };

  return (
    <div className="mt-10 flex min-h-16 flex-wrap items-center justify-between gap-3 border-y py-4">
      {answer ? (
        <p className="font-semibold animate-in fade-in duration-200">Thanks for telling us.</p>
      ) : (
        <>
          <p className="font-semibold">Was this helpful?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => choose("yes")}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:border-foreground"
            >
              <ThumbsUp className="size-4" /> Yes
            </button>
            <button
              type="button"
              onClick={() => choose("no")}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:border-foreground"
            >
              <ThumbsDown className="size-4" /> No
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/** For guide titles we link to but haven't written yet. */
function GuideComingSoon({ slug }: { slug: string }) {
  const router = useRouter();
  const title = guideTitle(slug) ?? "This guide";

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-12 sm:py-24">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
        <BookOpen className="size-6 text-muted-foreground" />
      </span>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Student guide
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">
        We're writing this guide now. In the meantime, you can keep looking for a place.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => router.history.back()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out hover:bg-primary/90 active:scale-[0.97]"
        >
          <ArrowLeft className="size-4" /> Back to your search
        </button>
        <Link
          to="/blog"
          className="rounded-md px-5 py-3 text-sm font-semibold underline underline-offset-4"
        >
          Read our other guides
        </Link>
      </div>
    </main>
  );
}
