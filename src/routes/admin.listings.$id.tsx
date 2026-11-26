import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ImagePlus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminHead, PageHeader, Panel } from "@/components/admin-ui";
import { adminListings, type AdminListing, type AdminRoom } from "@/lib/admin-sample";

export const Route = createFileRoute("/admin/listings/$id")({
  head: () => adminHead("Edit listing", "Edit a home, its rooms, prices and availability."),
  component: EditListing,
});

const blank: AdminListing = { id: "new", title: "", city: "Lusaka", area: "", university: "", distanceKm: 0, gender: "Mixed", status: "draft", image: "", landlord: "", amenities: [], rules: [], rooms: [] };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function Chips({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [v, setV] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <button key={i} onClick={() => onChange(items.filter((x) => x !== i))} className="rounded-full border bg-muted px-3 py-1 text-sm text-foreground" title="Remove">{i} ×</button>
        ))}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (v.trim()) { onChange([...items, v.trim()]); setV(""); } }}>
        <Input value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} />
        <Button type="submit" variant="outline">Add</Button>
      </form>
    </div>
  );
}

function EditListing() {
  const { id } = Route.useParams();
  const [l, setL] = useState<AdminListing>(() => adminListings.find((x) => x.id === id) ?? blank);
  const set = <K extends keyof AdminListing>(k: K, v: AdminListing[K]) => setL((p) => ({ ...p, [k]: v }));
  const setRoom = (rid: string, patch: Partial<AdminRoom>) => set("rooms", l.rooms.map((r) => (r.id === rid ? { ...r, ...patch } : r)));
  const total = l.rooms.reduce((t, r) => t + r.available, 0);
  return (
    <>
      <Link to="/admin/listings" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All listings</Link>
      <PageHeader title={l.title || "New listing"} sub={id === "new" ? "Fill in the basics, then add rooms." : `${l.area}, ${l.city}`}
        action={<div className="flex gap-2"><Button variant="outline" onClick={() => toast("Saved as draft (demo)")}>Save draft</Button><Button onClick={() => toast.success("Listing published (demo)")}>Publish</Button></div>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Listing name"><Input value={l.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Kabulonga shared house" /></Field>
              <Field label="Landlord"><Input value={l.landlord} onChange={(e) => set("landlord", e.target.value)} /></Field>
              <Field label="Who can live here">
                <div className="flex gap-1 rounded-lg border p-1">
                  {(["Male", "Female", "Mixed"] as const).map((g) => (
                    <button key={g} onClick={() => set("gender", g)} className={`flex-1 rounded-md py-1.5 text-sm ${l.gender === g ? "bg-foreground text-background" : "text-muted-foreground"}`}>{g}</button>
                  ))}
                </div>
              </Field>
              <div className="sm:col-span-2"><Field label="Description"><Textarea rows={4} placeholder="What's it like to live here?" /></Field></div>
            </div>
          </Panel>
          <Panel title="Location and university">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City"><Input value={l.city} onChange={(e) => set("city", e.target.value)} /></Field>
              <Field label="Area"><Input value={l.area} onChange={(e) => set("area", e.target.value)} /></Field>
              <Field label="Nearest university"><Input value={l.university} onChange={(e) => set("university", e.target.value)} /></Field>
              <Field label="Distance (km)"><Input type="number" step="0.1" value={l.distanceKm} onChange={(e) => set("distanceKm", Number(e.target.value))} /></Field>
            </div>
          </Panel>
          <Panel title="Rooms" action={<Button size="sm" variant="outline" onClick={() => set("rooms", [...l.rooms, { id: crypto.randomUUID(), name: "New room", price: 0, available: 1, availableFrom: "Now", photos: 0 }])}><Plus /> Add room type</Button>}>
            {l.rooms.length === 0 && <p className="text-sm text-muted-foreground">No rooms yet. Add the first room type.</p>}
            <div className="space-y-4">
              {l.rooms.map((r) => (
                <div key={r.id} className="rounded-lg border p-4">
                  <div className="grid gap-3 sm:grid-cols-4">
                    <Field label="Room name"><Input value={r.name} onChange={(e) => setRoom(r.id, { name: e.target.value })} /></Field>
                    <Field label="Price per month (K)"><Input type="number" value={r.price} onChange={(e) => setRoom(r.id, { price: Number(e.target.value) })} /></Field>
                    <Field label="Rooms available"><Input type="number" min={0} value={r.available} onChange={(e) => setRoom(r.id, { available: Number(e.target.value) })} /></Field>
                    <Field label="Available from"><Input value={r.availableFrom} onChange={(e) => setRoom(r.id, { availableFrom: e.target.value })} /></Field>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Button size="sm" variant="ghost" onClick={() => setRoom(r.id, { photos: r.photos + 1 })}><ImagePlus /> Room photos ({r.photos})</Button>
                    <Button size="sm" variant="ghost" onClick={() => set("rooms", l.rooms.filter((x) => x.id !== r.id))}><Trash2 /> Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Amenities"><Chips items={l.amenities} onChange={(v) => set("amenities", v)} placeholder="e.g. Backup power" /></Panel>
          <Panel title="House rules"><Chips items={l.rules} onChange={(v) => set("rules", v)} placeholder="e.g. Quiet after 22:00" /></Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Availability">
            <p className="text-4xl font-bold text-foreground">{total}</p>
            <p className="text-sm text-muted-foreground">rooms free across {l.rooms.length} room types</p>
            <ul className="mt-4 space-y-2 text-sm">
              {l.rooms.map((r) => <li key={r.id} className="flex justify-between"><span className="text-foreground">{r.name}</span><span className="text-muted-foreground">{r.available} free · K{r.price}</span></li>)}
            </ul>
          </Panel>
          <Panel title="General photos">
            {l.image ? <img src={l.image} alt="" className="aspect-video w-full rounded-lg object-cover" /> : null}
            <button className="mt-3 flex w-full flex-col items-center gap-1 rounded-lg border border-dashed py-6 text-sm text-muted-foreground hover:bg-muted" onClick={() => toast("Photo upload comes with Lovable Cloud")}>
              <ImagePlus className="size-5" /> Add outside, kitchen and shared spaces
            </button>
          </Panel>
        </div>
      </div>
    </>
  );
}
