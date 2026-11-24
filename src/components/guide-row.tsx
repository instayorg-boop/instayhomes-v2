import { Link } from "@tanstack/react-router";
import type { Guide } from "@/lib/guides-content";

/** A guide as a list row: text on the left, a small photo on the right. */
export function GuideRow({ guide }: { guide: Guide }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: guide.slug }}
      className="group flex items-start gap-4 border-b py-4"
    >
      <div className="min-w-0 flex-1">
        <span className="text-xs font-bold text-primary">{guide.category}</span>
        <h3 className="mt-0.5 font-semibold leading-snug group-hover:underline">{guide.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{guide.minutes} min read</p>
      </div>
      <img
        src={guide.image.replace("w=1400", "w=300")}
        alt=""
        className="size-20 shrink-0 rounded-xl object-cover"
      />
    </Link>
  );
}
