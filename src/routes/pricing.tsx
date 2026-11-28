import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import bandPhoto from "@/assets/protection-student.webp";
import ctaPhoto from "@/assets/hero-house.webp";
import { AirtelLogo, MtnLogo } from "@/components/payment-logos";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { accessPeriod, intlBilling, plans, recommendedPlanId } from "@/lib/plus";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing | Instayhomes Plus" },
      {
        name: "description",
        content:
          "Browse student accommodation for free. One mobile money payment, from K199, unlocks every verified landlord on WhatsApp for 30 days. Nothing renews.",
      },
    ],
  }),
  component: PricingPage,
});

const sectionTitle =
  "text-[26px] font-extrabold leading-tight tracking-[-0.045em] md:text-[44px] md:leading-none";

const free = [
  "Searching student accommodation near campus",
  "Photos, prices and move-in dates",
  "Saving the homes you like",
  "Guides on renting safely",
];
const withPlus = [
  "Chat with every verified landlord on WhatsApp",
  "Book viewings directly with landlords",
  "Covered by Tenant Protection",
];

const questions = [
  [
    "How do I pay?",
    "With MTN MoMo or Airtel Money. You get a prompt on your phone, enter your PIN, and Plus starts straight away. International students are invoiced in US dollars once they've chosen a home.",
  ],
  [
    "Does it renew?",
    "No. Plus lasts 30 days from the moment you pay, then simply ends. We never charge you again unless you choose to buy another 30 days.",
  ],
  [
    "What's the difference between Self-service and Assisted?",
    "Both unlock every landlord. With Assisted, an Instayhomes agent also helps you shortlist rooms and arrange viewings.",
  ],
  [
    "What if a listing is fake or not as shown?",
    "Tell us within your 30 days. Under Tenant Protection you're eligible for a full refund or free unlock credit, whichever you prefer.",
  ],
  [
    "Do I pay rent through Instayhomes?",
    "No. Rent and deposit are agreed between you and the landlord. Always view the room before you pay anything.",
  ],
] as const;

function PricingPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-3xl px-5 pb-10 pt-12 text-center md:pb-16 md:pt-20">
          <h1 className="text-[34px] font-extrabold uppercase leading-[0.95] tracking-[-0.06em] sm:text-6xl md:text-[80px]">
            One payment.
            <br />
            <span className="text-primary">No subscription.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground md:mt-6 md:text-lg">
            Browse for free. Pay once with mobile money to chat with every verified landlord for 30
            days. Nothing renews.
          </p>
        </section>

        <section aria-label="Plans" className="mx-auto max-w-6xl px-5 sm:px-12">
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {plans.map((plan) => {
              const recommended = plan.id === recommendedPlanId;
              const intl = plan.id === "international";
              return (
                <article
                  key={plan.id}
                  className={`flex flex-col rounded-3xl p-6 md:p-8 ${
                    recommended
                      ? "border-2 border-primary bg-primary/[0.04] md:p-[31px]"
                      : "border"
                  }`}
                >
                  <p
                    className={`text-xs font-bold uppercase tracking-[0.08em] ${
                      recommended ? "text-primary" : intl ? "text-blue-700" : "text-muted-foreground"
                    }`}
                  >
                    {recommended ? "Recommended" : intl ? "Moving from abroad" : "Do it yourself"}
                  </p>
                  <h2 className="mt-4 text-lg font-semibold">{plan.name}</h2>
                  <p
                    className={`mt-1 text-[56px] font-extrabold leading-none tracking-[-0.05em] tabular-nums md:text-[64px] ${
                      recommended ? "text-primary" : ""
                    }`}
                  >
                    {plan.price}
                    <span className="ml-1.5 align-middle text-xs font-semibold tracking-normal text-muted-foreground">
                      {plan.currency}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {intl ? intlBilling : accessPeriod}
                  </p>
                  <Link
                    to="/plans"
                    search={{ plan: plan.id, from: "/pricing" }}
                    className={`mt-6 inline-flex items-center justify-center rounded-full px-5 py-3.5 text-[15px] font-bold transition-[scale,background-color] duration-150 ease-out active:scale-[0.97] ${
                      recommended
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : intl
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border border-foreground hover:bg-muted"
                    }`}
                  >
                    {intl ? "Talk to our team" : `Choose ${plan.name}`}
                  </Link>
                  <div className="my-6 h-px bg-border" />
                  <ul className="flex flex-col gap-3.5">
                    {[...plan.features, "Covered by Tenant Protection"].map((feature) => (
                      <li key={feature} className="flex gap-3 text-[15px] leading-snug">
                        <Check className="mt-0.5 size-[18px] shrink-0 text-primary" strokeWidth={2.4} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span>Pay with</span>
            <MtnLogo className="h-[26px] w-[40px]" />
            <AirtelLogo className="h-[26px] w-[40px]" />
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Prices in Zambian kwacha. International in US dollars.
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-7xl sm:px-12 md:mt-28">
          <div className="relative flex min-h-[420px] items-end overflow-hidden text-white md:min-h-[520px] md:rounded-[28px]">
            <img
              src={bandPhoto}
              alt="A student smiling while chatting at a table"
              loading="lazy"
              className="absolute inset-0 size-full object-cover object-[center_35%]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.78)_100%)]"
            />
            <div className="relative flex w-full flex-wrap items-end justify-between gap-4 p-6 md:gap-8 md:p-14">
              <p className="max-w-2xl text-[30px] font-extrabold leading-[1.02] tracking-[-0.05em] md:text-[56px]">
                You only pay when you're ready to talk to a landlord.
              </p>
              <p className="max-w-sm text-[15px] font-medium text-white/90 md:text-lg">
                Searching, browsing and saving homes are always free. Plus only unlocks the chat.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-5xl px-5 sm:px-12 md:mt-28">
          <h2 className={`text-center ${sectionTitle}`}>What you pay for</h2>
          <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-2 md:gap-16">
            <PayList heading="Always free" items={free} value="Free" valueClass="text-[#0F6B3A]" />
            <PayList
              heading="With Instayhomes Plus"
              items={withPlus}
              value="Plus"
              valueClass="text-primary"
            />
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-3xl px-5 sm:px-12 md:mt-28">
          <h2 className={sectionTitle}>Questions about pricing</h2>
          <div className="mt-6 border-t md:mt-10">
            {questions.map(([q, a], i) => (
              <div key={q} className="border-b">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold md:py-6 md:text-xl"
                >
                  {q}
                  <Plus
                    className={`size-5 shrink-0 transition-transform duration-200 ease-out ${open === i ? "rotate-45" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="answer"
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <p className="max-w-2xl pb-5 text-[15px] text-muted-foreground md:pb-6 md:text-[17px]">
                        {a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mt-14 flex min-h-[420px] items-center justify-center overflow-hidden text-center text-white md:mt-28 md:min-h-[620px]">
          <img
            src={ctaPhoto}
            alt="A student boarding house in Zambia"
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.45)_70%,rgba(0,0,0,0.3)_100%)]"
          />
          <div className="relative px-5">
            <p className="text-[40px] font-extrabold uppercase leading-[0.95] tracking-[-0.06em] md:text-[88px]">
              Ready when
              <br />
              you are.
            </p>
            <Link
              to="/search"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground transition-[scale,background-color] duration-150 ease-out hover:bg-primary/90 active:scale-[0.97] md:mt-10 md:px-9 md:py-4 md:text-lg"
            >
              Find a room <ArrowRight className="size-[18px]" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function PayList({
  heading,
  items,
  value,
  valueClass,
}: {
  heading: string;
  items: string[];
  value: string;
  valueClass: string;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {heading}
      </p>
      <ul className="border-b">
        {items.map((item) => (
          <li
            key={item}
            className="flex justify-between gap-6 border-t py-4 text-[15px] md:py-[18px] md:text-[17px]"
          >
            <span>{item}</span>
            <span className={`shrink-0 font-semibold ${valueClass}`}>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
