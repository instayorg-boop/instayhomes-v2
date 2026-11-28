import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, MessageCircle, UsersRound } from "lucide-react";
import ctaPhoto from "@/assets/hero-house.webp";
import { whatsappLink } from "@/components/contact-landlord";
import {
  PageHero,
  PhotoBand,
  PhotoCta,
  pillButton,
  sectionTitle,
  TickList,
} from "@/components/page-bits";
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
          "List your hostel, boarding house or student apartment on Instayhomes and students near the university message you directly on WhatsApp.",
      },
    ],
  }),
  component: LandlordsPage,
});

const photo =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80";
const chatLink = whatsappLink({
  phone: teamWhatsApp,
  message: "Hi Instayhomes, I'd like to list my property.",
});

const steps = [
  { title: "Message our team", text: "Tell us about your property on WhatsApp." },
  {
    title: "We check it's yours",
    text: "We confirm you own or manage the home. You get a verified badge.",
  },
  { title: "We put up your listing", text: "Photos, rooms, prices and move-in dates." },
  { title: "Students message you", text: "On WhatsApp, ready to book a viewing." },
];

const reasons = [
  {
    icon: BadgeCheck,
    title: "A verified badge students trust",
    text: "Verified landlords stand out in search.",
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
  "Your NRC",
  "Proof you own or manage the property",
  <>
    Photos of each room <span className="text-muted-foreground">(we can help you take good ones)</span>
  </>,
];

function TalkButton() {
  return (
    <a
      href={chatLink}
      target="_blank"
      rel="noreferrer"
      className={`${pillButton} bg-[#128C4A] text-white hover:bg-[#0F7A40]`}
    >
      <WhatsAppIcon className="size-5" /> Talk to our team
    </a>
  );
}

function LandlordsPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main>
        <PageHero
          title="Rent to students"
          accent="ready to move in."
          sub="List your hostel, boarding house or student apartment. Students near the university message you directly on WhatsApp."
        >
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:mt-9">
            <TalkButton />
            <a href="#how-it-works" className={`${pillButton} border border-foreground hover:bg-muted`}>
              How it works
            </a>
          </div>
        </PageHero>

        <PhotoBand photo={photo} alt="A bright student apartment living room" />

        <section id="how-it-works" className="mx-auto mt-14 max-w-6xl scroll-mt-24 px-5 sm:px-12 md:mt-24">
          <h2 className={sectionTitle}>How it works</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 md:mt-10 md:gap-5 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-2xl bg-muted p-5 md:p-6">
                <span className="text-[13px] font-bold text-primary">0{i + 1}</span>
                <p className="mt-2 text-lg font-bold leading-snug tracking-[-0.02em] md:mt-8 md:text-xl">
                  {step.title}
                </p>
                <p className="mt-1 text-[15px] text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto mt-14 grid max-w-6xl gap-12 px-5 sm:px-12 md:mt-24 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className={sectionTitle}>Why list with us</h2>
            <ul className="mt-6 flex flex-col gap-5 md:mt-10">
              {reasons.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-bold tracking-[-0.01em] md:text-lg">{title}</span>
                    <span className="block text-[15px] text-muted-foreground">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={sectionTitle}>What you'll need</h2>
            <TickList className="mt-6 md:mt-10" items={needs} />
          </div>
        </section>

        <PhotoCta
          photo={ctaPhoto}
          alt="A student boarding house in Zambia"
          title={
            <>
              Ready to list
              <br />
              your property?
            </>
          }
          sub={`Our team replies on WhatsApp ${teamReplyTime}.`}
        >
          <TalkButton />
        </PhotoCta>
      </main>
      <SiteFooter />
    </div>
  );
}
