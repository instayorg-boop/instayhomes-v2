import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminHead, PageHeader, Panel } from "@/components/admin-ui";
import { adminPosts } from "@/lib/admin-sample";
import { guideCategories } from "@/lib/guides-content";

export const Route = createFileRoute("/admin/blog/$slug")({
  head: () => adminHead("Edit post", "Write or edit a blog post."),
  component: EditPost,
});

function EditPost() {
  const { slug } = Route.useParams();
  const post = adminPosts.find((p) => p.slug === slug);
  const [title, setTitle] = useState(post?.title ?? "");
  const [dek, setDek] = useState(post?.dek ?? "");
  const [category, setCategory] = useState<string>(post?.category ?? guideCategories[0]!);
  const [body, setBody] = useState(post ? post.body.map((b) => ("text" in b ? (b.type === "h2" ? `## ${b.text}` : b.text) : b.items.map((i) => `- ${typeof i === "string" ? i : `${i.lead} ${i.text}`}`).join("\n"))).join("\n\n") : "");
  return (
    <>
      <Link to="/admin/blog" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All posts</Link>
      <PageHeader title={post ? "Edit post" : "New post"} action={<div className="flex gap-2"><Button variant="outline" onClick={() => toast("Saved as draft (demo)")}>Save draft</Button><Button onClick={() => toast.success("Post published (demo)")}>Publish</Button></div>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="space-y-4 lg:col-span-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="h-12 text-xl font-bold" />
          <Textarea value={dek} onChange={(e) => setDek(e.target.value)} rows={2} placeholder="One line on what the reader gets from this" />
          <div className="space-y-1.5"><Label>Body</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={18} placeholder="Write here. Start a line with ## for a heading, - for a list." className="font-mono text-sm" /></div>
        </Panel>
        <div className="space-y-6">
          <Panel title="Cover image">
            {post && <img src={post.image} alt="" className="aspect-video w-full rounded-lg object-cover" />}
            <button onClick={() => toast("Image upload comes with Lovable Cloud")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-4 text-sm text-muted-foreground hover:bg-muted"><ImagePlus className="size-4" /> {post ? "Change image" : "Add image"}</button>
          </Panel>
          <Panel title="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 w-full rounded-md border bg-background px-3 text-sm text-foreground" aria-label="Category">
              {guideCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Panel>
        </div>
      </div>
    </>
  );
}
