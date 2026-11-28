import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

/** Section heading used on the home page and every marketing page. */
export const sectionTitle =
  "text-[26px] font-extrabold leading-tight tracking-[-0.045em] md:text-[44px] md:leading-none";

/** Big all-caps page headline, centred, with an optional red second line. */
export function PageHero({
  title,
  accent,
  sub,
  children,
}: {
  title: ReactNode;
  accent?: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-4xl px-5 pb-10 pt-12 text-center md:pb-14 md:pt-20">
      <h1 className="text-[34px] font-extrabold uppercase leading-[0.95] tracking-[-0.06em] sm:text-6xl md:text-[80px]">
        {title}
        {accent && (
          <>
            <br />
            <span className="text-primary">{accent}</span>
          </>
        )}
      </h1>
      {sub && (
        <p className="mx-auto mt-4 max-w-xl text-[15px] text-muted-foreground md:mt-6 md:text-lg">
          {sub}
        </p>
      )}
      {children}
    </section>
  );
}

/** Full-bleed photo with a centred all-caps line and a button, the last thing before the footer. */
export function PhotoCta({
  photo,
  alt,
  title,
  sub,
  children,
}: {
  photo: string;
  alt: string;
  title: ReactNode;
  sub?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="relative mt-14 flex min-h-[420px] items-center justify-center overflow-hidden text-center text-white md:mt-28 md:min-h-[600px]">
      <img src={photo} alt={alt} loading="lazy" className="absolute inset-0 size-full object-cover" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.45)_70%,rgba(0,0,0,0.3)_100%)]"
      />
      <div className="relative px-5">
        <p className="text-[40px] font-extrabold uppercase leading-[0.95] tracking-[-0.06em] md:text-[88px]">
          {title}
        </p>
        {sub && <p className="mx-auto mt-4 max-w-md text-[15px] font-semibold md:text-lg">{sub}</p>}
        <div className="mt-7 flex flex-wrap justify-center gap-3 md:mt-10">{children}</div>
      </div>
    </section>
  );
}

/** Photo band: edge to edge on phones, rounded inside the page on larger screens. */
export function PhotoBand({
  photo,
  alt,
  className = "",
  children,
}: {
  photo: string;
  alt: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto mt-14 max-w-7xl sm:px-12 md:mt-24">
      <div
        className={`relative flex min-h-[340px] items-end overflow-hidden text-white md:min-h-[480px] md:rounded-[28px] ${className}`}
      >
        <img src={photo} alt={alt} loading="lazy" className="absolute inset-0 size-full object-cover" />
        {children && (
          <>
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.78)_100%)]"
            />
            <div className="relative w-full p-6 md:p-14">{children}</div>
          </>
        )}
      </div>
    </section>
  );
}

/** Light-red tick list, as in Tenant Protection. */
export function TickList({ items, className = "" }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={`flex flex-col gap-3.5 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-snug md:text-[17px]">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Check className="size-3" strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export type FaqItem = { id: string; q: string; a: ReactNode };

/** Questions that open smoothly, one at a time. */
export function FaqList({
  items,
  defaultOpen = items[0]?.id ?? null,
  className = "",
}: {
  items: FaqItem[];
  defaultOpen?: string | null;
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen);
  return (
    <div className={`border-t ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="border-b">
          <button
            type="button"
            onClick={() => setOpen(open === item.id ? null : item.id)}
            aria-expanded={open === item.id}
            className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold md:py-5 md:text-lg"
          >
            {item.q}
            <Plus
              className={`size-5 shrink-0 transition-transform duration-200 ease-out ${open === item.id ? "rotate-45" : ""}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {open === item.id && (
              <motion.div
                key="answer"
                className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="max-w-2xl pb-5 text-[15px] text-muted-foreground md:text-[17px]">
                  {item.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export const pillButton =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold transition-[scale,background-color] duration-150 ease-out active:scale-[0.97] md:px-8 md:py-4 md:text-lg";

/** The red "Find a room" button. */
export function FindRoomButton({ label = "Find a room" }: { label?: string }) {
  return (
    <Link to="/search" className={`${pillButton} bg-primary text-primary-foreground hover:bg-primary/90`}>
      {label} <ArrowRight className="size-[18px]" />
    </Link>
  );
}
