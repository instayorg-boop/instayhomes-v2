import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { guideTitle } from "@/lib/guides";

// Placeholder for blog articles linked from search results. Replace with the real blog.
export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${guideTitle(params.slug) ?? "Guide"} | Instayhomes` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GuideComingSoon,
});

function GuideComingSoon() {
  const { slug } = Route.useParams();
  const router = useRouter();
  const title = guideTitle(slug) ?? "This guide";

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-12 sm:py-24">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
          <BookOpen className="size-6 text-muted-foreground" />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Student guide</p>
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
          <Link to="/" className="rounded-md px-5 py-3 text-sm font-semibold underline underline-offset-4">
            Go to the home page
          </Link>
        </div>
      </main>
    </div>
  );
}
