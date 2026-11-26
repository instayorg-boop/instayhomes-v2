import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminHead, PageHeader, StatusPill } from "@/components/admin-ui";
import { adminPosts } from "@/lib/admin-sample";
import { formatGuideDate } from "@/lib/guides-content";

export const Route = createFileRoute("/admin/blog/")({
  head: () => adminHead("Blog posts", "Write and publish guides for tenants."),
  component: Posts,
});

function Posts() {
  return (
    <>
      <PageHeader title="Blog posts" sub={`${adminPosts.length} posts`} action={<Button asChild><Link to="/admin/blog/$slug" params={{ slug: "new" }}><Plus /> New post</Link></Button>} />
      <ul className="divide-y overflow-hidden rounded-xl border bg-card">
        {adminPosts.map((p) => (
          <li key={p.slug}>
            <Link to="/admin/blog/$slug" params={{ slug: p.slug }} className="flex items-center gap-4 p-4 hover:bg-muted/40">
              <img src={p.image} alt="" className="hidden h-14 w-20 rounded-lg object-cover sm:block" />
              <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-foreground">{p.title}</span><span className="block text-xs text-muted-foreground">{p.category} · {formatGuideDate(p.published)}</span></span>
              <StatusPill status={p.status} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
