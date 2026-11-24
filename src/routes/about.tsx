import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, ChevronRight, CreditCard, MessageCircle, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TenantProtectionLink } from "@/components/tenant-protection";
import { teamReplyTime } from "@/lib/plus";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About us | Instayhomes" },
      {
        name: "description",
        content:
          "Instayhomes helps students in Zambia find real rooms near campus, with checked landlords and real people on WhatsApp.",
      },
    ],
  }),
  component: AboutPage,
});

const heroPhoto =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";

const promises = [
  {
    icon: BadgeCheck,
    title: "Checked landlords",
    text: "We confirm who owns the home before it goes up.",
  },
  {
    icon: CreditCard,
    title: "One payment, every landlord",
    text: "From K199 for 30 days of messages.",
  },
  {
    icon: ShieldCheck,
    title: "Tenant Protection",
    text: "Not as shown? You're eligible for a refund.",
  },
  {
    icon: MessageCircle,
    title: "Real people, fast",
    text: `Our team replies on WhatsApp ${teamReplyTime}.`,
  },
];

const rowClass = "flex items-center gap-4 border-b py-4 text-left last:border-b-0";

function AboutPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-12">
        <div className="grid gap-10 pt-10 lg:grid-cols-2 lg:gap-16 lg:pt-14">
          {/* Who we are: centred on phones, a sticky column on desktop. */}
          <div className="text-center lg:sticky lg:top-24 lg:self-start lg:text-left">
            <h1 className="font-display text-5xl leading-none tracking-wide text-primary lg:text-7xl">
              INSTAYHOMES
              <span className="sr-only"> | About us</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-lg text-foreground/80 lg:mx-0">
              Real homes near campus. Real people on WhatsApp.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Made in Lusaka, Zambia</p>
            <img
              src={heroPhoto}
              alt="Students working together at a table"
              className="mt-7 aspect-[16/10] w-full rounded-2xl object-cover lg:aspect-[4/3]"
            />
          </div>

          <div className="space-y-10 lg:pt-2">
            <Section label="Our story">
              {/* PLACEHOLDER: replace with the founders' real story. */}
              <div className="space-y-3 text-base leading-relaxed text-foreground/85">
                <p>
                  Most students find a room through WhatsApp groups and Facebook posts: blurry
                  photos, prices that change when you call, and deposits paid to people who don't
                  own the room.
                </p>
                <p>
                  We started Instayhomes so the search begins with homes that are real. Our team
                  checks every landlord, and every listing shows its price and move-in date.
                </p>
              </div>
            </Section>

            <Section label="What you get">
              <ul>
                {promises.map(({ icon: Icon, title, text }) => (
                  <li key={title} className={rowClass}>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{title}</span>
                      <span className="block text-sm text-muted-foreground">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section label="More">
              <div>
                <Link to="/help" className={`${rowClass} group`}>
                  <span className="flex-1 font-semibold">Help &amp; contact</span>
                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link to="/blog" className={`${rowClass} group`}>
                  <span className="flex-1 font-semibold">Student guides</span>
                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
                <TenantProtectionLink className={`${rowClass} group w-full`}>
                  <span className="flex-1 font-semibold">Tenant Protection</span>
                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </TenantProtectionLink>
              </div>
            </Section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </h2>
      {children}
    </section>
  );
}
