// "How it works" on the home page: three steps, each with a small picture of that moment in the
// product. On phones and tablets the steps sit in a swipeable row where the next card peeks in;
// a timer bar under the row moves to the next step on its own, so nobody has to swipe to see
// them all. On desktop all three fit side by side, so the timer is not needed.
import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AirtelLogo, MtnLogo } from "@/components/payment-logos";
import { VerifiedIcon } from "@/components/verified-badge";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const STEP_MS = 6000;
const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=360&h=270&q=70`;

const steps: { title: string; text: string; picture: ReactNode; tint: string }[] = [
  {
    title: "Find a verified room near campus",
    text: "Every landlord is checked by our team before their home goes live. Browse for free.",
    picture: <SearchPicture />,
    tint: "bg-muted",
  },
  {
    title: "One payment unlocks every landlord",
    text: "Get Instayhomes Plus with MTN MoMo or Airtel Money, from K199, and chat with every verified landlord for 30 days.",
    picture: <PlusPicture />,
    tint: "bg-muted",
  },
  {
    title: "Chat and view on WhatsApp",
    text: "Message the landlord directly, book a viewing, and only pay rent once you've seen it.",
    picture: <ChatPicture />,
    tint: "bg-muted",
  },
];

export function HowItWorks({ titleClassName }: { titleClassName: string }) {
  const row = useRef<HTMLOListElement>(null);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const timer = useRef<Animation | null>(null);
  const [active, setActive] = useState(0);
  // Auto-advance only where the steps are a swipeable row and motion is welcome.
  const [carousel, setCarousel] = useState(false);
  const [playing, setPlaying] = useState(true);
  const holding = useRef(false); // a finger or pointer is on the row
  const onScreen = useRef(false);
  const ourScroll = useRef(0); // when we last scrolled the row ourselves

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1023px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCarousel(narrow.matches && !calm.matches);
    update();
    narrow.addEventListener("change", update);
    calm.addEventListener("change", update);
    return () => {
      narrow.removeEventListener("change", update);
      calm.removeEventListener("change", update);
    };
  }, []);

  const syncTimer = useCallback(() => {
    const t = timer.current;
    if (!t) return;
    if (playing && !holding.current && onScreen.current) t.play();
    else t.pause();
  }, [playing]);

  const scrollToStep = useCallback((index: number) => {
    const el = row.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!el || !card) return;
    ourScroll.current = Date.now();
    const padding = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({ left: card.offsetLeft - padding, behavior: "smooth" });
  }, []);

  // Only run the timer while the section is on screen.
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry?.isIntersecting ?? false;
        syncTimer();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [syncTimer]);

  // The timer: fill the active bar, then move to the next step.
  useEffect(() => {
    const fill = fills.current[active];
    if (!carousel || !fill) return;
    const t = fill.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
      duration: STEP_MS,
      easing: "linear",
      fill: "forwards",
    });
    timer.current = t;
    t.onfinish = () => {
      const next = (active + 1) % steps.length;
      setActive(next);
      scrollToStep(next);
    };
    syncTimer();
    return () => {
      t.onfinish = null;
      t.cancel();
      timer.current = null;
    };
  }, [active, carousel, scrollToStep, syncTimer]);

  // When someone swipes, follow them: the card they stop on becomes the active step.
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        if (Date.now() - ourScroll.current < 900) return;
        const padding = parseFloat(getComputedStyle(el).paddingLeft) || 0;
        let nearest = 0;
        let best = Infinity;
        Array.from(el.children).forEach((child, i) => {
          const distance = Math.abs((child as HTMLElement).offsetLeft - padding - el.scrollLeft);
          if (distance < best) {
            best = distance;
            nearest = i;
          }
        });
        setActive(nearest);
      }, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(settle);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const hold = (on: boolean) => {
    holding.current = on;
    syncTimer();
  };

  return (
    <section aria-labelledby="how-h">
      <h2 id="how-h" className={titleClassName}>
        How it works
      </h2>
      <p className="mt-1.5 text-[15px] text-muted-foreground md:text-[17px]">From search to keys in three steps.</p>

      <ol
        ref={row}
        onPointerDown={() => hold(true)}
        onPointerUp={() => hold(false)}
        onPointerCancel={() => hold(false)}
        onFocus={() => hold(true)}
        onBlur={() => hold(false)}
        className="relative -mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-3 sm:gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-12 sm:scroll-px-12 sm:px-12 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:mt-8 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {steps.map((step, i) => (
          <li key={step.title} className="w-[88%] shrink-0 snap-start sm:w-[58%] lg:w-auto">
            <div
              aria-hidden
              className={`flex h-[340px] items-center justify-center overflow-hidden rounded-3xl px-4 py-6 sm:h-[360px] sm:p-6 ${step.tint}`}
            >
              {step.picture}
            </div>
            <div className="px-1 pt-4 md:pt-5">
              <p className="text-[13px] font-bold text-primary md:text-sm">Step {i + 1}</p>
              <h3 className="mt-1 text-lg font-extrabold md:text-[22px] leading-tight tracking-[-0.035em]">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground md:mt-1.5 md:text-[17px]">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* The timer bars double as step buttons. Hidden on desktop, where all steps are visible. */}
      <div className="mt-5 flex items-center gap-2 lg:hidden">
        {steps.map((step, i) => (
          <button
            key={step.title}
            type="button"
            aria-label={`Show step ${i + 1}: ${step.title}`}
            aria-current={i === active ? "step" : undefined}
            onClick={() => {
              setActive(i);
              scrollToStep(i);
            }}
            className="flex h-11 flex-1 items-center"
          >
            <span className="h-1 w-full overflow-hidden rounded-full bg-foreground/15">
              <span
                ref={(el) => {
                  fills.current[i] = el;
                }}
                className="block h-full origin-left rounded-full bg-primary"
                style={{
                  transform: `scaleX(${i < active || (i === active && !carousel) ? 1 : 0})`,
                }}
              />
            </span>
          </button>
        ))}
        {carousel && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause the steps" : "Play the steps"}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-[scale,color] duration-150 ease-out hover:text-foreground active:scale-90"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
        )}
      </div>
    </section>
  );
}

/** Step 1: a university search with two verified rooms. */
function SearchPicture() {
  const rooms = [
    ["photo-1493809842364-78817add7ffb", "Ensuite near UNZA", "K2,400"],
    ["photo-1522708323590-d24dbb6b0267", "Twin room", "K1,350"],
  ] as const;
  return (
    <div className="w-full max-w-[280px] space-y-2.5">
      <div className="flex h-11 items-center gap-2 rounded-xl bg-background pl-3.5 pr-2 text-sm shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
        <span className="flex-1">University of Zambia</span>
        <span className="flex h-[30px] items-center rounded-lg bg-primary px-3 text-xs font-bold text-primary-foreground">
          Search
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {rooms.map(([id, name, price]) => (
          <div
            key={id}
            className="rounded-xl bg-background p-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
          >
            <div className="relative">
              <img
                src={photo(id)}
                alt=""
                loading="lazy"
                className="aspect-[4/3] w-full rounded-lg object-cover"
              />
              <span className="absolute left-1.5 top-1.5 flex items-center gap-[3px] rounded-full bg-background py-0.5 pl-1 pr-1.5 text-[9.5px] font-bold shadow-sm">
                <VerifiedIcon className="size-[11px]" /> Verified
              </span>
            </div>
            <p className="mx-0.5 mt-1.5 text-xs font-bold">{name}</p>
            <p className="mx-0.5 mb-0.5 text-xs text-muted-foreground">{price} / month</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Step 2: the Plus pass, paid with mobile money, unlocking every landlord. */
function PlusPicture() {
  const landlords = [
    ["JK", "Joseph K.", "Kalingalinga · 3 homes"],
    ["GN", "Grace N.", "Riverside · 2 homes"],
    ["CM", "Chileshe M.", "Jesmondine · 1 home"],
  ] as const;
  return (
    <div className="w-full max-w-[270px] overflow-hidden rounded-2xl border bg-background shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <p className="flex justify-between bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
        <span>Instayhomes Plus</span>
        <span>30 days</span>
      </p>
      <div className="px-3.5 pb-1 pt-3">
        <div className="flex items-end justify-between gap-2">
          <span>
            <span className="block text-[13px] font-medium">Assisted</span>
            <span className="block text-[26px] font-bold leading-tight tracking-tight text-primary">
              K399
              <span className="ml-1 align-middle text-[9.5px] font-semibold text-muted-foreground">
                ZMW
              </span>
            </span>
          </span>
          <span className="flex flex-col items-end gap-1">
            <span className="text-[9.5px] text-muted-foreground">Pay with</span>
            <span className="flex gap-1">
              <MtnLogo className="h-[22px] w-[34px]" />
              <AirtelLogo className="h-[22px] w-[34px]" />
            </span>
          </span>
        </div>
        <p className="mb-1 mt-3 flex items-center gap-1.5 text-xs font-bold text-[#0F6B3A]">
          <svg
            viewBox="0 0 24 24"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
          Every landlord unlocked
        </p>
        {landlords.map(([initials, name, area], i) => (
          <div
            key={name}
            className={`flex items-center gap-2 border-t py-[7px] ${i === landlords.length - 1 ? "opacity-45" : ""}`}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground/80">
              {initials}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="flex items-center gap-[3px] text-xs font-bold">
                {name} <VerifiedIcon className="size-3" />
              </span>
              <span className="block text-[10.5px] text-muted-foreground">{area}</span>
            </span>
            <span className="flex h-6 items-center gap-1 rounded-full bg-[#128C4A] px-2.5 text-[10.5px] font-bold text-white">
              <WhatsAppIcon className="size-[11px]" /> Chat
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Step 3: the WhatsApp chat with the landlord, as the top of a phone screen. */
function ChatPicture() {
  const ticks = (
    <svg
      viewBox="0 0 18 11"
      className="ml-0.5 inline h-[9px] w-[15px] align-[-1px]"
      fill="none"
      stroke="#53BDEB"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 6l3 3 6-7.5" />
      <path d="M7.5 9l1 .5 6.5-8" />
    </svg>
  );
  const bubble = "max-w-[84%] px-2 pb-1 pl-[9px] pt-1.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]";
  const time = "mt-px block text-right text-[10px] text-[#667781]";
  return (
    <div className="-mb-6 flex h-[calc(100%+24px)] w-full max-w-[270px] flex-col self-end overflow-hidden rounded-t-[26px] border-[6px] border-b-0 border-[#1F1F1F] bg-[#EFE7DD] shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-2 border-b border-[#E9E9E9] bg-white px-2.5 py-2.5 text-[#111B21]">
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#DFE5E7] text-[11px] font-bold text-[#54656F]">
          JK
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="flex items-center gap-[3px] text-[13px] font-semibold">
            Joseph K. <VerifiedIcon className="size-[13px]" />
          </span>
          <span className="block text-[10.5px] text-[#667781]">Landlord · online</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="size-[15px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-2.5 pb-2 pt-2.5 text-[12.5px] leading-[1.35] text-[#111B21]">
        <span className="self-center rounded-[7px] bg-white px-2 py-0.5 text-[10.5px] text-[#54656F] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
          Today
        </span>
        <span className={`${bubble} self-end rounded-[9px] rounded-tr-none bg-[#D9FDD3]`}>
          Hi Joseph, I found your boarding house near UNZA on Instayhomes. Is there a room free for
          January?
          <span className={time}>09:41 {ticks}</span>
        </span>
        <span className={`${bubble} self-start rounded-[9px] rounded-tl-none bg-white`}>
          Yes, one room is free. Come and see it on Saturday at 10?
          <span className={time}>09:44</span>
        </span>
        <span className={`${bubble} self-end rounded-[9px] rounded-tr-none bg-[#D9FDD3]`}>
          Perfect, see you Saturday!
          <span className={time}>09:45 {ticks}</span>
        </span>
      </div>
      <div className="flex items-center gap-1.5 px-2 pb-2.5">
        <span className="flex h-[34px] flex-1 items-center rounded-full bg-white px-3 text-xs text-[#8696A0] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
          Message
        </span>
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#1DAA61]">
          <svg
            viewBox="0 0 24 24"
            className="size-[15px]"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </span>
      </div>
    </div>
  );
}
