import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { adminHead, PageHeader, Panel, Stat, td, th } from "@/components/admin-ui";
import { formatMoney, planName, promoByCode, promoStats } from "@/lib/admin-sample";
import { plans } from "@/lib/plus";

export const Route = createFileRoute("/admin/promos/$code")({
  head: ({ params }) => adminHead(`Promo ${params.code}`, "Who used this promo code and what it earned."),
  component: PromoDetail,
});

function PromoDetail() {
  const { code } = Route.useParams();
  const p = promoByCode(code);
  if (!p) return <p className="text-muted-foreground">This code doesn't exist (new codes aren't saved in the demo). <Link to="/admin/promos" className="text-primary">Back to codes</Link></p>;
  const s = promoStats(p);
  const split = plans.map((pl) => ({ name: pl.name, n: p.uses.filter((u) => u.plan === pl.id).length })).filter((x) => p.plans.includes(plans.find((pl) => pl.name === x.name)!.id));
  return (
    <>
      <Link to="/admin/promos" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All promo codes</Link>
      <PageHeader title={p.code} sub={`${p.type === "percent" ? `${p.value}%` : `K${p.value}`} off · ${p.starts} to ${p.ends}${p.partner ? ` · ${p.partner}` : ""}`} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Times used" value={p.uses.length} hint={p.limit ? `of ${p.limit} allowed` : "No limit"} />
        <Stat label="People subscribed" value={s.subscribers} />
        <Stat label="Revenue (Kwacha)" value={formatMoney(s.revenueZMW, "ZMW")} />
        <Stat label="Revenue (Dollars)" value={formatMoney(s.revenueUSD, "USD")} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Which plan they chose">
          <ul className="space-y-3">
            {split.map((x) => (
              <li key={x.name}>
                <div className="flex justify-between text-sm"><span className="text-foreground">{x.name}</span><span className="font-semibold text-foreground">{x.n}</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${p.uses.length ? (x.n / p.uses.length) * 100 : 0}%` }} /></div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Who used this code" className="lg:col-span-2">
          {p.uses.length === 0 ? <p className="text-sm text-muted-foreground">Nobody yet.</p> : (
            <div className="-mx-5 overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead className="border-b"><tr><th className={th}>Name</th><th className={th}>Plan</th><th className={th}>Date</th><th className={th}>Paid</th></tr></thead>
                <tbody className="divide-y">
                  {p.uses.map((u) => (
                    <tr key={u.email + u.date}><td className={td}>{u.name}<span className="block text-xs text-muted-foreground">{u.email}</span></td><td className={td}>{planName(u.plan)}</td><td className={td}>{u.date}</td><td className={td}>{formatMoney(u.amount, u.currency)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
