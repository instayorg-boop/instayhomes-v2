import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const adminHead = (title: string, description: string) => ({
  meta: [
    { title: `${title} · Instayhomes admin` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · Instayhomes admin` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ],
});

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const tones: Record<string, string> = {
  live: "bg-primary/10 text-primary", published: "bg-primary/10 text-primary", active: "bg-primary/10 text-primary",
  hidden: "bg-muted text-muted-foreground", draft: "bg-secondary text-foreground border", ended: "bg-muted text-muted-foreground",
};
export function StatusPill({ status }: { status: string }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", tones[status])}>{status}</span>;
}

export function Panel({ title, children, action, className }: { title?: string; children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border bg-card p-5", className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-semibold text-foreground">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export const th = "px-4 py-3 text-left text-xs font-semibold text-muted-foreground";
export const td = "px-4 py-3 text-sm text-foreground";
