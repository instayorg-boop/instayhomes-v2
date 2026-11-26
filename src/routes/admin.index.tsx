import { createFileRoute, Link } from "@tanstack/react-router";
import { adminHead, PageHeader, Panel, Stat } from "@/components/admin-ui";
import { adminListings, formatMoney, planName, promos, promoStats, subscribers, totalRooms, weeklySubscribers } from "@/lib/admin-sample";

export const Route = createFileRoute("/admin/")({
  head: () => adminHead("Overview", "How Instayhomes is doing this month."),
  component: Overview,
});

function Overview() {
  const live = adminListings.filter((l) => l.status === "live");
  const month = subscribers.filter((s) => s.date.startsWith("2026-11"));
  const kwacha = month.filter((s) => s.currency === "ZMW").reduce((t, s) => t + s.amount, 0);
  const usd = month.filter((s) => s.currency === "USD").reduce((t, s) => t + s.amount, 0);
  const max = Math.max(...weeklySubscribers.map((w) => w.count));
  const top = [...promos].sort((a, b) => promoStats(b).subscribers - promoStats(a).subscribers).slice(0, 3);
  return (
    <>
      <PageHeader title="Good evening" sub="Here's November so far." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Live listings" value={live.length} hint={`${adminListings.length} in total`} />
        <Stat label="Rooms available" value={live.reduce((t, l) => t + totalRooms(l), 0)} />
        <Stat label="New subscribers" value={month.length} hint="This month" />
        <Stat label="Revenue" value={formatMoney(kwacha, "ZMW")} hint={`plus ${formatMoney(usd, "USD")}`} />
        <Stat label="Landlord contacts" value={142} hint="WhatsApp chats started" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="New subscribers per week" className="lg:col-span-2">
          <div className="flex h-48 items-end gap-4">
            {weeklySubscribers.map((w) => (
              <div key={w.week} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-foreground">{w.count}</span>
                <div className="w-full rounded-t-md bg-primary" style={{ height: `${(w.count / max) * 140}px` }} />
                <span className="text-xs text-muted-foreground">{w.week}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Best promo codes" action={<Link to="/admin/promos" className="text-sm font-medium text-primary">All codes</Link>}>
          <ul className="space-y-3">
            {top.map((p) => (
              <li key={p.code}>
                <Link to="/admin/promos/$code" params={{ code: p.code }} className="flex items-center justify-between rounded-lg p-2 hover:bg-muted">
                  <span><span className="font-mono font-semibold text-foreground">{p.code}</span><span className="block text-xs text-muted-foreground">{p.partner ?? "No partner"}</span></span>
                  <span className="text-sm font-semibold text-foreground">{promoStats(p).subscribers} people</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel title="Latest sign-ups" className="mt-6" action={<Link to="/admin/subscribers" className="text-sm font-medium text-primary">See everyone</Link>}>
        <ul className="divide-y">
          {subscribers.slice(0, 5).map((s) => (
            <li key={s.email + s.date} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span><span className="font-medium text-foreground">{s.name}</span><span className="block text-xs text-muted-foreground">{planName(s.plan)}{s.promo ? ` · used ${s.promo}` : ""}</span></span>
              <span className="text-right font-semibold text-foreground">{formatMoney(s.amount, s.currency)}<span className="block text-xs font-normal text-muted-foreground">{s.date}</span></span>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
