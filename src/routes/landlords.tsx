import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, MessageCircle, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import { whatsappLink } from "@/components/contact-landlord";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { teamReplyTime, teamWhatsApp } from "@/lib/plus";

export const Route = createFileRoute("/landlords")({
  head: () => ({
    meta: [
      { title: "List your property | Instayhomes" },
      {
        name: "description",
        content:
          "List your rooms on Instayhomes and students near the university message you directly on WhatsApp.",
      },
    ],
  }),
  component: LandlordsPage,
});

const photo =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80";
const chatLink = whatsappLink({
  phone: teamWhatsApp,
  message: "Hi Instayhomes, I'd like to list my property.",
});

const steps = [
  { title: "Message our team", text: "Tell us about your property on WhatsApp." },
  {
    title: "We check it's yours",
    text: "We confirm you own or manage the home. You get a blue tick.",
  },
  { title: "We put up your listing", text: "Photos, rooms, prices and move-in dates." },
  { title: "Students message you", text: "On WhatsApp, ready to book a viewing." },
];

const reasons = [
  {
    icon: BadgeCheck,
    title: "A blue tick students trust",
    text: "Checked landlords stand out in search.",
  },
  {
    icon: UsersRound,
    title: "Students near your area",
    text: "They search by university, close to you.",
  },
  {
    icon: MessageCircle,
    title: "Direct on WhatsApp",
    text: "No middle-man between you and your tenant.",
  },
];

const needs = [
  { title: "Your NRC" },
  { title: "Proof you own or manage the property" },
  { title: "Photos of each room", text: "We can help you take good ones." },
];

const label = "mb-2 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground";

function TalkButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={chatLink}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#128C4A] px-5 py-3.5 font-semibold text-white transition-[scale,background-color] duration-150 ease-out hover:bg-[#0F7A40] active:scale-[0.97] ${className}`}
    >
      <WhatsAppIcon className="size-5" /> Talk to our team
    </a>
  );
}

function LandlordsPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-12">
        <div className="grid items-center gap-6 pt-8 lg:grid-cols-2 lg:gap-14 lg:pt-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-primary">
              For landlords
            </p>
            <h1 className="mt-2 text-balance text-3xl font-bold leading-tight tracking-tight lg:text-5xl">
              Rent your rooms to students who are ready to move in
            </h1>
            <p className="mt-3 max-w-xl text-base text-muted-foreground lg:text-lg">
              List your property on Instayhomes and students near the university message you
              directly on WhatsApp.
            </p>
            <div className="mt-6 grid gap-3 sm:flex">
              <TalkButton />
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border border-foreground px-5 py-3.5 font-semibold hover:bg-muted"
              >
                How it works
              </a>
            </div>
          </div>
          <img
            src={photo}
            alt="A bright living room"
            className="aspect-[4/3] w-full rounded-2xl object-cover lg:aspect-[5/4]"
          />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Section id="how-it-works" title="How it works">
            <ol>
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4 border-b py-4 last:border-b-0">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-semibold">{step.title}</span>
                    <span className="block text-sm text-muted-foreground">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Section>

          <div className="space-y-10">
            <Section title="Why list with us">
              <ul>
                {reasons.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-center gap-4 border-b py-4 last:border-b-0">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block font-semibold">{title}</span>
                      <span className="block text-sm text-muted-foreground">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="What you'll need">
              <ul>
                {needs.map((need) => (
                  <li key={need.title} className="border-b py-3 last:border-b-0">
                    <span className="block font-semibold">{need.title}</span>
                    {need.text && (
                      <span className="block text-sm text-muted-foreground">{need.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>

        <div className="mt-12 grid items-center gap-4 rounded-2xl bg-muted p-6 sm:grid-cols-[1fr_auto] lg:p-9">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Ready to list your property?</h2>
            <p className="mt-1 text-muted-foreground">
              Our team replies on WhatsApp {teamReplyTime}.
            </p>
          </div>
          <TalkButton />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className={label}>{title}</h2>
      {children}
    </section>
  );
}
