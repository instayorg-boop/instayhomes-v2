import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { adminHead, PageHeader, StatusPill, td, th } from "@/components/admin-ui";
import { daysLeft, formatMoney, planName, promos, subscribers } from "@/lib/admin-sample";
import { plans } from "@/lib/plus";

export const Route = createFileRoute("/admin/subscribers")({
  head: () => adminHead("Subscribers", "Everyone with Instayhomes Plus, by plan and promo code."),
  component: Subscribers,
});

const sel = "h-9 rounded-md border bg-background px-3 text-sm text-foreground";

function Subscribers() {
  const [plan, setPlan] = useState("all");
  const [promo, setPromo] = useState("all");
  const rows = subscribers.filter((s) => (plan === "all" || s.plan === plan) && (promo === "all" || (promo === "none" ? !s.promo : s.promo === promo)));
  return (
    <>
      <PageHeader title="Subscribers" sub={`${rows.length} people · Plus lasts 30 days`} />
      <div className="mb-4 flex flex-wrap gap-3">
        <select className={sel} value={plan} onChange={(e) => setPlan(e.target.value)} aria-label="Plan">
          <option value="all">All plans</option>{plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className={sel} value={promo} onChange={(e) => setPromo(e.target.value)} aria-label="Promo code">
          <option value="all">Any promo code</option><option value="none">No promo code</option>{promos.map((p) => <option key={p.code} value={p.code}>{p.code}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full min-w-[640px]">
          <thead className="border-b bg-muted/50"><tr><th className={th}>Name</th><th className={th}>Plan</th><th className={th}>Promo</th><th className={th}>Started</th><th className={th}>Days left</th><th className={th}>Paid</th><th className={th}>Status</th></tr></thead>
          <tbody className="divide-y">
            {rows.map((s) => {
              const left = daysLeft(s.date);
              return (
                <tr key={s.email + s.date}>
                  <td className={td}>{s.name}<span className="block text-xs text-muted-foreground">{s.email}</span></td>
                  <td className={td}>{planName(s.plan)}</td>
                  <td className={td}>{s.promo ? <span className="font-mono">{s.promo}</span> : "—"}</td>
                  <td className={td}>{s.date}</td>
                  <td className={td}>{left}</td>
                  <td className={td}>{formatMoney(s.amount, s.currency)}</td>
                  <td className={td}><StatusPill status={left > 0 ? "active" : "ended"} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
