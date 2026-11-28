import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Copy, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminHead, PageHeader, StatusPill, td, th } from "@/components/admin-ui";
import { formatMoney, planName, promos as samplePromos, promoStats, type Promo } from "@/lib/admin-sample";
import { plans, type PlanId } from "@/lib/plus";

export const Route = createFileRoute("/admin/promos/")({
  head: () => adminHead("Promo codes", "Create promo codes and see who subscribes with them."),
  component: Promos,
});

const discount = (p: Promo) => (p.type === "percent" ? `${p.value}% off` : `K${p.value} off`);
const status = (p: Promo) => (p.active && p.ends >= "2026-11-26" ? "active" : "ended");
const copy = (code: string) => { void navigator.clipboard?.writeText(code); toast.success(`${code} copied`); };

function NewPromo({ onCreate }: { onCreate: (p: Promo) => void }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<Promo["type"]>("percent");
  const [value, setValue] = useState(10);
  const [picked, setPicked] = useState<PlanId[]>(["self-service"]);
  const [limit, setLimit] = useState("");
  const [starts, setStarts] = useState("2026-11-26");
  const [ends, setEnds] = useState("2026-12-31");
  const [partner, setPartner] = useState("");
  const gen = () => setCode(Math.random().toString(36).slice(2, 8).toUpperCase());
  const submit = () => {
    if (!code) {
      toast.error("Give the code a name");
      return;
    }
    onCreate({ code, type, value, plans: picked, limit: limit ? Number(limit) : null, starts, ends, partner: partner || null, active: true, uses: [] });
    toast.success(`${code} is ready to share`);
    setOpen(false); setCode("");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus /> New promo code</Button></DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>New promo code</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Code</Label>
            <div className="flex gap-2"><Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="e.g. UNZA25" className="font-mono" /><Button variant="outline" onClick={gen}><Shuffle /> Generate</Button></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Discount type</Label>
              <div className="flex gap-1 rounded-lg border p-1">
                {(["percent", "fixed"] as const).map((t) => <button key={t} onClick={() => setType(t)} className={`flex-1 rounded-md py-1.5 text-sm ${type === t ? "bg-foreground text-background" : "text-muted-foreground"}`}>{t === "percent" ? "%" : "Kwacha"}</button>)}
              </div>
            </div>
            <div className="space-y-1.5"><Label>{type === "percent" ? "Percent off" : "Amount off (K)"}</Label><Input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></div>
          </div>
          <div className="space-y-2"><Label>Works on</Label>
            {plans.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox checked={picked.includes(p.id)} onCheckedChange={(c) => setPicked((x) => (c ? [...x, p.id] : x.filter((i) => i !== p.id)))} /> {p.name} ({p.price})
              </label>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5"><Label>Max uses</Label><Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="No limit" /></div>
            <div className="space-y-1.5"><Label>Starts</Label><Input type="date" value={starts} onChange={(e) => setStarts(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Ends</Label><Input type="date" value={ends} onChange={(e) => setEnds(e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label>Belongs to (optional)</Label><Input value={partner} onChange={(e) => setPartner(e.target.value)} placeholder="Partner, influencer or campus rep" /></div>
        </div>
        <DialogFooter><Button onClick={submit}>Create code</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Promos() {
  const [rows, setRows] = useState(samplePromos);
  return (
    <>
      <PageHeader title="Promo codes" sub="Share a code, then see who subscribed with it." action={<NewPromo onCreate={(p) => setRows((r) => [p, ...r])} />} />
      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <table className="w-full">
          <thead className="border-b bg-muted/50"><tr><th className={th}>Code</th><th className={th}>Discount</th><th className={th}>Plans</th><th className={th}>Used</th><th className={th}>Subscribers</th><th className={th}>Revenue</th><th className={th}>Ends</th><th className={th}>Status</th><th className={th} /></tr></thead>
          <tbody className="divide-y">
            {rows.map((p) => {
              const s = promoStats(p);
              return (
                <tr key={p.code} className="hover:bg-muted/40">
                  <td className={td}><Link to="/admin/promos/$code" params={{ code: p.code }} className="font-mono font-semibold hover:text-primary">{p.code}</Link><span className="block text-xs text-muted-foreground">{p.partner ?? "—"}</span></td>
                  <td className={td}>{discount(p)}</td>
                  <td className={td}><span className="text-xs">{p.plans.map(planName).join(", ")}</span></td>
                  <td className={td}>{p.uses.length}{p.limit ? ` / ${p.limit}` : ""}</td>
                  <td className={td}>{s.subscribers}</td>
                  <td className={td}>{formatMoney(s.revenueZMW, "ZMW")}{s.revenueUSD ? ` + ${formatMoney(s.revenueUSD, "USD")}` : ""}</td>
                  <td className={td}>{p.ends}</td>
                  <td className={td}><StatusPill status={status(p)} /></td>
                  <td className={td}><Button size="icon" variant="ghost" onClick={() => copy(p.code)} aria-label={`Copy ${p.code}`}><Copy /></Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="space-y-3 md:hidden">
        {rows.map((p) => (
          <li key={p.code} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between">
              <Link to="/admin/promos/$code" params={{ code: p.code }}><span className="font-mono text-lg font-semibold text-foreground">{p.code}</span><span className="block text-xs text-muted-foreground">{discount(p)} · {p.partner ?? "No partner"}</span></Link>
              <StatusPill status={status(p)} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm"><span className="text-foreground">{promoStats(p).subscribers} subscribers</span><Button size="sm" variant="outline" onClick={() => copy(p.code)}><Copy /> Copy code</Button></div>
          </li>
        ))}
      </ul>
    </>
  );
}
