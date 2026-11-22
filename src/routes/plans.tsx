import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, CreditCard, Home, Loader2, Lock, Smartphone } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { whatsappButton, whatsappLink } from "@/components/contact-landlord";
import { plans, planById, safeReturnPath, setPlus, usePlus, type PlanId } from "@/lib/plus";
import { contactMessage, landlordWhatsApp, rooms } from "./listing";

type PlansSearch = { from?: string | undefined; room?: string | undefined };

export const Route = createFileRoute("/plans")({
  validateSearch: (search: Record<string, unknown>): PlansSearch => ({
    from: typeof search["from"] === "string" ? search["from"] : undefined,
    room: typeof search["room"] === "string" ? search["room"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Nestaway Plus | Chat with landlords on WhatsApp" },
      { name: "description", content: "Choose a Nestaway Plus plan to contact landlords directly on WhatsApp." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PlansPage,
});

const press = "transition-[scale,background-color,border-color,color] duration-150 ease-out active:scale-[0.97]";

const benefits = [
  "Chat with landlords directly on WhatsApp",
  "Ask about any room on Nestaway",
  "Agree move-in, viewing and stay with the landlord",
];

type Method = "mobile" | "card";
type Status = "idle" | "processing" | "paid";

function PlansPage() {
  const { from, room: roomId } = Route.useSearch();
  const navigate = useNavigate();
  const currentPlan = usePlus();
  const returnTo = safeReturnPath(from);
  const room = rooms.find((item) => item.id === roomId) ?? null;

  const [planId, setPlanId] = useState<PlanId>("self-service");
  const [method, setMethod] = useState<Method>("mobile");
  const [status, setStatus] = useState<Status>("idle");
  const plan = planById(planId)!;
  const international = plan.currency === "USD";
  const payWith: Method = international ? "card" : method;

  const contact = { phone: landlordWhatsApp, message: contactMessage(room) };

  // DEMO payment: waits like a real provider would, then records the plan.
  // Hook the real checkout (mobile money / card provider) in here.
  const pay = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("processing");
    window.setTimeout(() => {
      setPlus(plan.id);
      setStatus("paid");
    }, payWith === "mobile" ? 2200 : 1200);
  };

  // Continue what they came to do: open the chat, and put them back on the page they left.
  const continueToChat = () => {
    window.open(whatsappLink(contact), "_blank", "noopener,noreferrer");
    void navigate({ to: returnTo });
  };

  if (status === "paid" || (currentPlan && status === "idle")) {
    const active = status === "paid" ? plan : currentPlan!;
    return (
      <Shell returnTo={returnTo}>
        <div className="flex flex-col items-center pt-6 text-center animate-in fade-in zoom-in-95 duration-300 ease-out">
          <span className="flex size-14 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
            <Check className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">
            {status === "paid" ? "Payment successful" : "You already have Plus"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {active.name} plan · {active.price}
          </p>
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium">Your message to the landlord</p>
          <p className="mt-2 rounded-lg bg-muted p-4 text-sm leading-6">“{contact.message}”</p>
          <button type="button" onClick={continueToChat} className={`mt-4 w-full ${whatsappButton}`}>
            <WhatsAppIcon /> Continue to WhatsApp
          </button>
          <Link to={returnTo} className={`mt-2 flex w-full justify-center rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted ${press}`}>
            Back to the listing
          </Link>
        </div>
        {import.meta.env.DEV && (
          <button type="button" onClick={() => { setPlus(null); setStatus("idle"); }} className="mt-10 w-full text-center text-xs text-muted-foreground underline">
            Reset demo subscription (dev only)
          </button>
        )}
      </Shell>
    );
  }

  const processing = status === "processing";

  return (
    <Shell returnTo={returnTo}>
      {/* What they were doing, so paying feels like a step in that, not a detour. */}
      <div className="flex items-center gap-3 rounded-xl border p-3">
        {room?.images[0] ? (
          <img src={room.images[0].src} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted"><Home className="size-6 text-muted-foreground" /></span>
        )}
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">You're contacting the landlord of</p>
          <p className="truncate text-sm font-semibold">
            {room ? `${room.shortName} · €${room.price.toLocaleString("en")}/month` : "Sunny shared apartment"}
          </p>
          <p className="text-xs text-muted-foreground">Kreuzberg, Berlin</p>
        </div>
      </div>

      <h1 className="mt-8 text-2xl font-bold tracking-tight">Get Nestaway Plus</h1>
      <p className="mt-1 text-sm text-muted-foreground">One payment to chat with landlords directly.</p>
      <ul className="mt-4 space-y-2">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" /> {benefit}
          </li>
        ))}
      </ul>

      <form onSubmit={pay} className="mt-8">
        <fieldset disabled={processing}>
          <legend className="text-sm font-semibold">1. Choose your plan</legend>
          <div role="radiogroup" className="mt-3 space-y-2">
            {plans.map((option) => {
              const active = option.id === planId;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPlanId(option.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left ${press} ${active ? "border-foreground" : "border-border hover:border-foreground/30"}`}
                >
                  <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-foreground" : "border-border"}`}>
                    {active && <span className="size-2.5 rounded-full bg-foreground" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{option.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{option.summary}</span>
                  </span>
                  <span className="shrink-0 text-lg font-bold tabular-nums">{option.price}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-sm font-semibold">2. Pay with</p>
          {international ? (
            <p className="mt-3 flex items-center gap-2 rounded-xl border-2 border-foreground p-4 text-sm font-medium">
              <CreditCard className="size-5" /> Card <span className="text-muted-foreground">· charged in US dollars</span>
            </p>
          ) : (
            <div role="radiogroup" className="mt-3 grid grid-cols-2 gap-2">
              {([
                ["mobile", "Mobile money", Smartphone],
                ["card", "Card", CreditCard],
              ] as const).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={method === value}
                  onClick={() => setMethod(value)}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-medium ${press} ${method === value ? "border-foreground" : "border-border hover:border-foreground/30"}`}
                >
                  <Icon className="size-4" /> {label}
                </button>
              ))}
            </div>
          )}

          <div key={payWith} className="mt-4 space-y-3 animate-in fade-in duration-200 ease-out">
            {payWith === "mobile" ? (
              <label className="block text-sm font-medium">
                MTN or Airtel number
                <span className="mt-1 flex h-12 items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
                  <span className="border-r px-3 text-base text-muted-foreground md:text-sm">+260</span>
                  <input required type="tel" inputMode="tel" autoComplete="tel-national" placeholder="97 123 4567" className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none md:text-sm" />
                </span>
              </label>
            ) : (
              <>
                <label className="block text-sm font-medium">
                  Card number
                  <input required inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" className="mt-1 h-12 w-full rounded-md border bg-background px-3 text-base md:text-sm" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-medium">
                    Expiry
                    <input required inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" className="mt-1 h-12 w-full rounded-md border bg-background px-3 text-base md:text-sm" />
                  </label>
                  <label className="block text-sm font-medium">
                    CVC
                    <input required inputMode="numeric" autoComplete="cc-csc" placeholder="123" className="mt-1 h-12 w-full rounded-md border bg-background px-3 text-base md:text-sm" />
                  </label>
                </div>
              </>
            )}
          </div>
        </fieldset>

        {/* Pinned to the bottom on phones so the price and the action are always in reach. */}
        <div className="sticky bottom-0 -mx-4 mt-8 border-t bg-background/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          <button type="submit" disabled={processing} className={`flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-80 ${press}`}>
            {processing ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                {payWith === "mobile" ? "Approve on your phone…" : "Processing…"}
              </>
            ) : (
              <>Pay {plan.price}</>
            )}
          </button>
          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Lock className="size-3" /> Secure payment · {plan.name} plan
          </p>
        </div>
      </form>
    </Shell>
  );
}

function Shell({ returnTo, children }: { returnTo: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
          <Link to={returnTo} aria-label="Back" className={`-ml-2 rounded-full p-2 hover:bg-muted ${press}`}>
            <ArrowLeft className="size-5" />
          </Link>
          <span className="font-display text-xl tracking-wide text-primary">NESTAWAY</span>
          <span className="text-sm font-semibold">Plus</span>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 pb-10 pt-6">{children}</main>
    </div>
  );
}
