import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronRight,
  CreditCard,
  Flag,
  KeyRound,
  Mail,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState, type ComponentType } from "react";
import { whatsappLink } from "@/components/contact-landlord";
import { FaqList, sectionTitle } from "@/components/page-bits";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { teamReplyTime, teamWhatsApp } from "@/lib/plus";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & contact | Instayhomes" },
      {
        name: "description",
        content:
          "Answers about contacting landlords, plans, payments and Tenant Protection, or chat with the Instayhomes team on WhatsApp.",
      },
    ],
  }),
  component: HelpPage,
});

// PLACEHOLDER: replace with the real support email and opening hours.
const supportEmail = "hello@instayhomes.com";
const openingHours = "Monday to Saturday, 8am to 8pm";

type TopicId = "landlords" | "payments" | "protection" | "account" | "safety" | "listing";

const topics: {
  id: TopicId;
  title: string;
  text: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  {
    id: "landlords",
    title: "Contacting landlords",
    text: "WhatsApp, viewings, move-in",
    icon: WhatsAppIcon,
  },
  {
    id: "payments",
    title: "Plans and payments",
    text: "Mobile money, receipts, promo codes",
    icon: CreditCard,
  },
  {
    id: "protection",
    title: "Tenant Protection and refunds",
    text: "What's covered and how to claim",
    icon: ShieldCheck,
  },
  { id: "account", title: "Your account", text: "Logging in, email, your plan", icon: UserRound },
  {
    id: "safety",
    title: "Safety and reporting",
    text: "Scams, wrong listings, bad experiences",
    icon: Flag,
  },
  {
    id: "listing",
    title: "For landlords",
    text: "Listing a property, getting verified",
    icon: KeyRound,
  },
];

type Faq = {
  id: string;
  topic: TopicId;
  q: string;
  a: string;
  popular?: boolean;
  offerChat?: boolean;
};

const faqs: Faq[] = [
  {
    id: "contact-landlord",
    topic: "landlords",
    q: "How do I contact a landlord?",
    a: 'Open a listing and tap "Chat with landlord". With Instayhomes Plus, WhatsApp opens with a message ready to send, so you can book a viewing straight away.',
    popular: true,
  },
  {
    id: "viewing",
    topic: "landlords",
    q: "Can I see a home before I pay rent?",
    a: "Yes, and you always should. Visit in person or ask for a live video walk-through before you pay any rent or deposit. On the Assisted plan, an agent helps you arrange viewings.",
  },
  {
    id: "refund",
    topic: "protection",
    q: "Can I get a refund?",
    a: "Yes. If a listing is fake, already taken, or not as advertised, Tenant Protection makes you eligible for a full refund of your plan or free unlock credit, whichever you prefer. Tell us within your 30 days of access.",
    popular: true,
    offerChat: true,
  },
  {
    id: "protection-cover",
    topic: "protection",
    q: "What does Tenant Protection cover?",
    a: "Homes that aren't as shown or are no longer available, and bad experiences with a landlord. Report it and our team steps in. It comes with every plan.",
  },
  {
    id: "payment-failed",
    topic: "payments",
    q: "My payment didn't go through. What now?",
    a: "Check that you approved the prompt on your phone and had enough balance. If a payment fails, no money is taken, so you can try again. If money left your account but you don't have access, message us with the number you paid from.",
    popular: true,
    offerChat: true,
  },
  {
    id: "plans",
    topic: "payments",
    q: "What's the difference between the plans?",
    a: "Self-service (K199) lets you message every landlord for 30 days. Assisted (K399) adds an Instayhomes agent who helps you shortlist rooms and arrange viewings. International ($50) is for students moving from abroad: talk to our team first, and you're invoiced once you've chosen a home.",
    popular: true,
  },
  {
    id: "pay-how",
    topic: "payments",
    q: "How do I pay?",
    a: "With Airtel Money, MTN MoMo or Zamtel Kwacha. Enter your number on the payment page and approve the prompt on your phone.",
  },
  {
    id: "promo",
    topic: "payments",
    q: "Can I use a promo code?",
    a: 'Yes. Tap "Have a promo code?" on the payment page. The discount shows before you pay.',
  },
  {
    id: "password",
    topic: "account",
    q: "Do I need a password?",
    a: "No. Log in with Google, or with your email and a 6-digit code we send you.",
  },
  {
    id: "plan-length",
    topic: "account",
    q: "How long does my plan last?",
    a: "30 days from when you pay. You can message as many landlords as you like in that time.",
  },
  {
    id: "report",
    topic: "safety",
    q: "How do I report a listing?",
    a: "Message our team on WhatsApp with the name of the listing and what's wrong. We review every report and take listings down when they break our rules.",
    offerChat: true,
  },
  {
    id: "checks",
    topic: "safety",
    q: "How do you check landlords?",
    a: "Our team confirms who owns the home before the listing goes up. Checked landlords have a blue tick.",
  },
  {
    id: "list-property",
    topic: "listing",
    q: "How do I list my property?",
    a: "Message our team on WhatsApp. We'll confirm you own the home, then help you put up your listing with photos, price and move-in dates.",
    offerChat: true,
  },
];

const suggestions = [
  { label: "Get a refund", query: "refund" },
  { label: "Payment didn't go through", query: "payment" },
  { label: "Report a listing", query: "report" },
  { label: "Change my plan", query: "plans" },
];

const teamChatLink = (message: string) => whatsappLink({ phone: teamWhatsApp, message });

function HelpPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicId | null>(null);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length > 0)
      return faqs.filter((faq) =>
        words.every((w) => `${faq.q} ${faq.a}`.toLowerCase().includes(w)),
      );
    if (topic) return faqs.filter((faq) => faq.topic === topic);
    return faqs.filter((faq) => faq.popular);
  }, [query, topic]);

  const heading = query.trim()
    ? `Results for "${query.trim()}"`
    : topic
      ? topics.find((t) => t.id === topic)?.title
      : "Popular questions";

  const chooseTopic = (id: TopicId) => {
    setQuery("");
    setTopic((current) => (current === id ? null : id));
    document.getElementById("answers")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-12">
        <div className="pt-12 text-center md:pt-20">
          <h1 className="text-[34px] font-extrabold uppercase leading-[0.95] tracking-[-0.06em] sm:text-6xl md:text-[80px]">
            How can we <span className="text-primary">help?</span>
          </h1>
          <p className="mt-4 text-[15px] text-muted-foreground md:mt-6 md:text-lg">
            Find an answer, or chat with our team.
          </p>

          <label className="mx-auto mt-6 flex max-w-xl items-center gap-3 rounded-full bg-muted px-5 py-3.5 text-left focus-within:ring-2 focus-within:ring-foreground md:mt-8">
            <Search className="size-5 shrink-0" />
            <span className="sr-only">Search for an answer</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for an answer"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="rounded-full p-1 hover:bg-background"
              >
                <X className="size-4" />
              </button>
            )}
          </label>

          <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:justify-center lg:mx-0 lg:px-0">
            {suggestions.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => {
                  setTopic(null);
                  setQuery(s.query);
                }}
                className="shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-14 md:mt-24">
          <h2 className={sectionTitle}>Topics</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:mt-10 lg:grid-cols-3 lg:gap-4">
            {topics.map(({ id, title, text, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={topic === id}
                onClick={() => chooseTopic(id)}
                className={`flex flex-col items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors md:gap-5 md:p-6 ${
                  topic === id ? "border-primary bg-primary/[0.04]" : "border-transparent bg-muted hover:border-foreground/20"
                }`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold leading-snug tracking-[-0.01em] md:text-lg">{title}</span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground md:text-sm">{text}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-14 md:mt-24 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          <section id="answers" className="scroll-mt-24">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className={sectionTitle}>{heading}</h2>
              {(topic || query) && (
                <button
                  type="button"
                  onClick={() => {
                    setTopic(null);
                    setQuery("");
                  }}
                  className="text-sm font-semibold underline underline-offset-4"
                >
                  Show popular
                </button>
              )}
            </div>
            {results.length > 0 ? (
              <FaqList
                key={`${topic}-${query}`}
                className="mt-6 md:mt-10"
                items={results.map((faq) => ({
                  id: faq.id,
                  q: faq.q,
                  a: (
                    <>
                      <p>{faq.a}</p>
                      {faq.offerChat && (
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <a
                            href={teamChatLink(`Hi Instayhomes, I have a question: ${faq.q}`)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#128C4A] px-4 py-2.5 text-sm font-bold text-white transition-[scale,background-color] duration-150 ease-out hover:bg-[#0F7A40] active:scale-[0.97]"
                          >
                            <WhatsAppIcon /> Chat with us
                          </a>
                          <span className="text-sm">Usually replies {teamReplyTime}</span>
                        </div>
                      )}
                    </>
                  ),
                }))}
              />
            ) : (
              <p className="mt-4 text-base text-muted-foreground">
                No answers match "{query.trim()}". Try another word, or chat with our team.
              </p>
            )}
          </section>

          <section>
            <h2 className={sectionTitle}>Still need help?</h2>
            <div className="mt-6 rounded-2xl border px-4 md:mt-10">
              <a
                href={teamChatLink("Hi Instayhomes, I need some help.")}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 border-b py-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#128C4A]/10 text-[#128C4A]">
                  <WhatsAppIcon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">Chat on WhatsApp</span>
                  <span className="block text-sm text-muted-foreground">
                    {teamWhatsApp} · replies {teamReplyTime}
                  </span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href={`mailto:${supportEmail}`} className="group flex items-center gap-4 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Mail className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">Email us</span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {supportEmail} · within a day
                  </span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{openingHours}</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
