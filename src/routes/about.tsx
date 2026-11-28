import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CreditCard, MessageCircle, ShieldCheck } from "lucide-react";
import bandPhoto from "@/assets/cta-students.webp";
import ctaPhoto from "@/assets/hero-house.webp";
import { FindRoomButton, PageHero, PhotoBand, PhotoCta, sectionTitle } from "@/components/page-bits";
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
          "Instayhomes helps students in Zambia find student accommodation near campus, from verified landlords, with real people on WhatsApp.",
      },
    ],
  }),
  component: AboutPage,
});

const promises = [
  {
    icon: BadgeCheck,
    title: "Verified landlords",
    text: "We confirm who owns the home before it goes up.",
  },
  {
    icon: CreditCard,
    title: "One payment, every landlord",
    text: "From K199 for 30 days of WhatsApp chats.",
  },
  {
    icon: ShieldCheck,
    title: "Tenant Protection",
    text: "Fake, taken or not as shown? Full refund or free unlock credit.",
  },
  {
    icon: MessageCircle,
    title: "Real people, fast",
    text: `Our team replies on WhatsApp ${teamReplyTime}.`,
  },
];

const linkCard =
  "group flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left font-semibold transition-colors hover:border-foreground";

function AboutPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main>
        <PageHero
          title="Real homes near campus."
          accent="Real people on WhatsApp."
          sub="Instayhomes helps students in Zambia find hostels, boarding houses and student apartments from verified landlords. Made in Lusaka."
        />

        <PhotoBand photo={bandPhoto} alt="Four friends laughing at something on a phone" />

        <section className="mx-auto mt-14 grid max-w-6xl gap-5 px-5 sm:px-12 md:mt-24 md:grid-cols-[1fr_1.3fr] md:gap-16">
          <h2 className={sectionTitle}>Why we started</h2>
          {/* PLACEHOLDER: replace with the founders' real story. */}
          <div className="space-y-4 text-base leading-relaxed text-foreground/85 md:text-lg">
            <p>
              Most students find a room through WhatsApp groups and Facebook posts: blurry photos,
              prices that change when you call, and deposits paid to people who don't own the room.
            </p>
            <p>
              We started Instayhomes so the search begins with homes that are real. Our team checks
              every landlord, and every listing shows its price and move-in date.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl px-5 sm:px-12 md:mt-24">
          <h2 className={sectionTitle}>What you get</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4 md:gap-5">
            {promises.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl bg-muted p-4 md:p-6">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary md:size-11">
                  <Icon className="size-5" />
                </span>
                <p className="mt-4 text-[15px] font-bold leading-snug tracking-[-0.02em] md:mt-6 md:text-lg">
                  {title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground md:text-[15px]">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-14 max-w-6xl px-5 sm:px-12 md:mt-24">
          <h2 className={sectionTitle}>More from us</h2>
          <div className="mt-6 grid gap-3 md:mt-10 md:grid-cols-3">
            <Link to="/help" className={linkCard}>
              Help &amp; contact
              <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/blog" className={linkCard}>
              Student guides
              <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
            <TenantProtectionLink className={`${linkCard} w-full`}>
              Tenant Protection
              <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </TenantProtectionLink>
          </div>
        </section>

        <PhotoCta
          photo={ctaPhoto}
          alt="A student boarding house in Zambia"
          title={
            <>
              Your room is
              <br />
              out there.
            </>
          }
        >
          <FindRoomButton />
        </PhotoCta>
      </main>
      <SiteFooter />
    </div>
  );
}
