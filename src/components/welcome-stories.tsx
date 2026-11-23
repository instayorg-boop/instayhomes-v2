// First-visit "how it works" stories. Fades in shortly after the page loads, once per browser,
// and can only be closed with the last slide's button (tapping outside does nothing), so nobody
// misses that contacting landlords needs a plan. "How it works" links reopen it.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouterState } from "@tanstack/react-router";
import { BadgeHelp, MessageCircle, ShieldCheck, UserCheck } from "lucide-react";
import { VerifiedIcon } from "@/components/verified-badge";

const SEEN_KEY = "instayhomes-welcome-seen";
const OPEN_EVENT = "instayhomes:how-it-works";
const SHOW_DELAY_MS = 700;

/** Opens the stories from anywhere (e.g. a "How it works" link). */
export function openHowItWorks() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function seen() {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage blocked: it may show again next visit, which is harmless.
  }
}

const slideImage = "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=75";

// PLACEHOLDER: refunds are described as "eligible"; link the refund policy here once it exists.
const slides = [
  {
    bg: "bg-[radial-gradient(120%_70%_at_85%_5%,#ff7a92_0,transparent_60%),linear-gradient(170deg,#ff385c,#c8103d)]",
    kicker: "Welcome to Instayhomes",
    title: ["EVERY HOME", "HERE IS REAL"],
    lead: 'No fake listings, no agents asking for "viewing fees". We check every landlord before their home goes live.',
  },
  {
    bg: "bg-[radial-gradient(120%_70%_at_15%_0%,#4a4a58_0,transparent_60%),linear-gradient(170deg,#26262e,#121216)]",
    kicker: "How you contact landlords",
    title: ["PAY ONCE.", "TALK TO ALL OF THEM."],
    lead: "Pick a plan when you find a place you like. For 30 days you can WhatsApp or call any landlord, as often as you want.",
  },
  {
    bg: "bg-[radial-gradient(120%_70%_at_85%_5%,#5fb4ff_0,transparent_60%),linear-gradient(170deg,#1d7fe0,#0b4a8f)]",
    kicker: "Tenant Protection, on every plan",
    title: ["WENT WRONG?", "GET A REFUND."],
    lead: "You're not paying and hoping for the best.",
  },
  {
    bg: "bg-[radial-gradient(120%_70%_at_15%_0%,#3ad08f_0,transparent_60%),linear-gradient(170deg,#0f9d63,#07603c)]",
    kicker: "That's it",
    title: ["FIND IT.", "CHAT. MOVE IN."],
    lead: "Rent and move-in dates are agreed directly with your landlord on WhatsApp. You only ever pay Instayhomes for your plan.",
  },
] as const;

function Ticks({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full bg-white/25 text-[10px] font-bold">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function SlideVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="w-48 -rotate-[5deg] overflow-hidden rounded-2xl bg-white text-foreground shadow-2xl">
        <div className="relative h-28 bg-cover bg-center" style={{ backgroundImage: `url(${slideImage})` }}>
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold">
            <VerifiedIcon className="size-3" /> Tenant verified
          </span>
        </div>
        <div className="px-2.5 py-2 text-xs">
          <p className="font-semibold">Linden · near UNZA</p>
          <p>K2,800 / month</p>
          <p className="font-semibold text-emerald-600">● Available now</p>
        </div>
      </div>
    );
  }
  if (index === 1) {
    const plans = [
      { name: "Self-service", price: "K199", note: "Contact every landlord yourself" },
      { name: "Assisted", price: "K399", note: "We shortlist rooms and set up viewings for you", recommended: true },
      { name: "International", price: "$50", note: "Moving from abroad? We help one-on-one, you pay after choosing" },
    ];
    return (
      <div className="w-full space-y-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`grid grid-cols-[1fr_auto] items-center gap-x-3 rounded-2xl px-3.5 py-2.5 ${
              plan.recommended ? "bg-white text-foreground shadow-xl" : "border border-white/15 bg-white/10"
            }`}
          >
            <p className="font-semibold">
              {plan.name}
              {plan.recommended && (
                <span className="ml-1.5 rounded-full bg-primary px-2 py-0.5 align-[2px] text-[10px] font-bold text-primary-foreground">Recommended</span>
              )}
            </p>
            <p className={`font-display text-2xl leading-none ${plan.recommended ? "text-primary" : ""}`}>{plan.price}</p>
            <p className="col-span-2 text-xs opacity-80">{plan.note}</p>
          </div>
        ))}
        <p className="text-center text-xs opacity-75">Each plan gives you 30 days</p>
      </div>
    );
  }
  if (index === 2) {
    const rows = [
      { icon: ShieldCheck, title: "Not as shown, or no longer available?", body: "Tell us and you're eligible for a refund." },
      { icon: UserCheck, title: "Bad experience with a landlord?", body: "Report it. We step in, and you're eligible for a refund." },
      { icon: MessageCircle, title: "Real people, fast", body: "Our team is on WhatsApp whenever you need us." },
    ];
    return (
      <div className="w-full space-y-2">
        {rows.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-3 rounded-2xl bg-white/10 px-3.5 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1d7fe0]">
              <Icon className="size-[18px]" />
            </span>
            <div className="text-sm">
              <p className="font-semibold">{title}</p>
              <p className="text-xs opacity-85">{body}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid w-full gap-2 text-xs text-[#111]">
      <p className="max-w-[80%] justify-self-end rounded-[14px_14px_3px_14px] bg-[#d9fdd3] px-3 py-2 shadow">Hi! Is Linden still available from February?</p>
      <p className="max-w-[80%] justify-self-start rounded-[14px_14px_14px_3px] bg-white px-3 py-2 shadow">Yes it is 🙂 Want to view it on Saturday?</p>
      <p className="max-w-[80%] justify-self-end rounded-[14px_14px_3px_14px] bg-[#d9fdd3] px-3 py-2 shadow">Perfect, see you then!</p>
    </div>
  );
}

export function WelcomeStories() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const show = () => {
    setIndex(0);
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  // First visit: fade in a moment after the page appears. Not on the payment page.
  useEffect(() => {
    if (seen() || pathname.startsWith("/plans")) return;
    const timer = window.setTimeout(show, SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  // Keep the page behind still, and keyboard users inside the stories.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((i) => Math.min(i + 1, slides.length - 1));
      if (event.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open && index === slides.length - 1) buttonRef.current?.focus();
  }, [open, index]);

  const close = () => {
    markSeen();
    setVisible(false);
    window.setTimeout(() => setOpen(false), 400);
  };

  if (!open) return null;
  const slide = slides[index]!;
  const last = index === slides.length - 1;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="How Instayhomes works"
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-black/60 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Full screen on phones; a phone-shaped card on larger screens. */}
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden text-white transition-transform duration-500 ease-out motion-reduce:transition-none sm:h-[min(760px,92dvh)] sm:max-w-[400px] sm:rounded-[28px] sm:shadow-2xl ${
          slide.bg
        } ${visible ? "scale-100" : "scale-[0.98]"}`}
      >
        <div className="absolute inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex gap-1" aria-hidden>
          {slides.map((_, k) => (
            <span key={k} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              <span className={`block h-full bg-white transition-[width] duration-300 ${k <= index ? "w-full" : "w-0"}`} />
            </span>
          ))}
        </div>

        {/* Tap left to go back, right to go on (like Instagram stories). */}
        {!last && (
          <div className="absolute inset-x-0 bottom-28 top-16 z-[5] grid grid-cols-[1fr_2fr]">
            <button type="button" aria-label="Previous" onClick={() => setIndex((i) => Math.max(i - 1, 0))} className="cursor-w-resize" />
            <button type="button" aria-label="Next" onClick={() => setIndex((i) => i + 1)} className="cursor-e-resize" />
          </div>
        )}

        <div key={index} className="flex flex-1 flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(max(1rem,env(safe-area-inset-top))+2.5rem)] animate-in fade-in slide-in-from-right-3 duration-300 ease-out">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">{slide.kicker}</p>
          <h2 className="mt-2 font-display text-[2.6rem] leading-[0.95]">
            {slide.title[0]}
            <br />
            {slide.title[1]}
          </h2>
          <p className="mt-3 text-sm opacity-90">{slide.lead}</p>

          <div className="flex min-h-0 flex-1 items-center justify-center py-5">
            <SlideVisual index={index} />
          </div>

          {index === 0 && (
            <Ticks
              items={[
                "What you see is what's there: real photos, real prices",
                "Availability kept up to date by the landlord",
                "Browse every home for free, no account needed",
              ]}
            />
          )}
          {index === 1 && (
            <p className="text-xs opacity-80">
              Your plan gets you in touch with landlords. The room is yours once you and the landlord agree, usually after a viewing.
            </p>
          )}

          {last ? (
            <button
              ref={buttonRef}
              type="button"
              onClick={close}
              className="relative z-10 mt-4 rounded-xl bg-white px-5 py-3.5 text-base font-semibold text-[#1b1b1f] transition-[scale] duration-150 ease-out active:scale-[0.98]"
            >
              Got it, show me homes
            </button>
          ) : (
            <p className="mt-4 flex items-center gap-1.5 text-xs opacity-75">
              <BadgeHelp className="size-3.5" /> Tap to {index === 0 ? "see how it works" : "continue"} →
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
