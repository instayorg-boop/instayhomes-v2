import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { adminHead, PageHeader, StatusPill, td, th } from "@/components/admin-ui";
import { adminListings, totalRooms, type ListingStatus } from "@/lib/admin-sample";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/listings/")({
  head: () => adminHead("Listings", "Every home on Instayhomes, with rooms and availability."),
  component: Listings,
});

const filters = ["all", "live", "hidden", "draft"] as const;

function Listings() {
  const [rows, setRows] = useState(adminListings);
  const [q, setQ] = useState("");
  const [f, setF] = useState<(typeof filters)[number]>("all");
  const shown = rows.filter((l) => (f === "all" || l.status === f) && `${l.title} ${l.city} ${l.university}`.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id: string) => setRows((r) => r.map((l) => (l.id === id ? { ...l, status: (l.status === "live" ? "hidden" : "live") as ListingStatus } : l)));
  return (
    <>
      <PageHeader title="Listings" sub={`${rows.length} homes`} action={<Button asChild><Link to="/admin/listings/$id" params={{ id: "new" }}><Plus /> Add listing</Link></Button>} />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, city or university" className="bg-background pl-9" />
        </div>
        <div className="flex gap-1 rounded-lg border bg-background p-1">
          {filters.map((x) => (
            <button key={x} onClick={() => setF(x)} className={cn("rounded-md px-3 py-1.5 text-sm capitalize", f === x ? "bg-foreground text-background" : "text-muted-foreground")}>{x}</button>
          ))}
        </div>
      </div>
      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <table className="w-full">
          <thead className="border-b bg-muted/50"><tr><th className={th}>Home</th><th className={th}>Nearest university</th><th className={th}>Gender</th><th className={th}>Rooms free</th><th className={th}>Status</th><th className={th}>Show on site</th></tr></thead>
          <tbody className="divide-y">
            {shown.map((l) => (
              <tr key={l.id} className="hover:bg-muted/40">
                <td className={td}>
                  <Link to="/admin/listings/$id" params={{ id: l.id }} className="flex items-center gap-3">
                    <img src={l.image} alt="" className="size-12 rounded-lg object-cover" />
                    <span><span className="font-semibold">{l.title}</span><span className="block text-xs text-muted-foreground">{l.area}, {l.city}</span></span>
                  </Link>
                </td>
                <td className={td}>{l.university}<span className="block text-xs text-muted-foreground">{l.distanceKm} km away</span></td>
                <td className={td}>{l.gender}</td>
                <td className={td}>{totalRooms(l)} <span className="text-xs text-muted-foreground">in {l.rooms.length} room types</span></td>
                <td className={td}><StatusPill status={l.status} /></td>
                <td className={td}><Switch checked={l.status === "live"} disabled={l.status === "draft"} onCheckedChange={() => toggle(l.id)} aria-label={`Show ${l.title}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-3 md:hidden">
        {shown.map((l) => (
          <li key={l.id} className="rounded-xl border bg-card p-3">
            <Link to="/admin/listings/$id" params={{ id: l.id }} className="flex gap-3">
              <img src={l.image} alt="" className="size-16 rounded-lg object-cover" />
              <span className="min-w-0 flex-1"><span className="block font-semibold text-foreground">{l.title}</span><span className="block text-xs text-muted-foreground">{l.university} · {l.gender}</span><span className="mt-1 block text-xs text-foreground">{totalRooms(l)} rooms free</span></span>
            </Link>
            <div className="mt-3 flex items-center justify-between border-t pt-3"><StatusPill status={l.status} /><Switch checked={l.status === "live"} disabled={l.status === "draft"} onCheckedChange={() => toggle(l.id)} aria-label={`Show ${l.title}`} /></div>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No homes match that.</p>}
    </>
  );
}
