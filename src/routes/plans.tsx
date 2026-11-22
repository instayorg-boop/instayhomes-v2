import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Home, Loader2, Lock, Mail, ShieldCheck, Smartphone } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { whatsappButton, whatsappLink } from "@/components/contact-landlord";
import {
  planById,
  plans,
  safeReturnPath,
  setPlus,
  setPlusUser,
  usePlus,
  usePlusUser,
  type Plan,
  type PlusUser,
} from "@/lib/plus";
import { contactMessage, landlordWhatsApp, rooms, type Room } from "./listing";

// Every choice lives in the URL, so signing in (which leaves the page) or a reload
// brings the visitor back to the same step with the same plan.
const steps = ["plan", "details", "pay", "done"] as const;
type Step = (typeof steps)[number];
type PlansSearch = { from?: string | undefined; room?: string | undefined; plan?: string | undefined; step?: Step | undefined };

const str = (value: unknown) => (typeof value === "string" ? value : undefined);

export const Route = createFileRoute("/plans")({
  validateSearch: (search: Record<string, unknown>): PlansSearch => {
    const step = str(search["step"]);
    return {
      from: str(search["from"]),
      room: str(search["room"]),
      plan: str(search["plan"]),
      step: steps.includes(step as Step) ? (step as Step) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Nestaway Plus | Chat with landlords on WhatsApp" },
      { name: "description", content: "Choose a Nestaway Plus plan and pay with mobile money to contact landlords directly on WhatsApp." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PlansPage,
});

const press = "transition-[scale,background-color,border-color,color,opacity] duration-150 ease-out active:scale-[0.97]";
const darkButton = `inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-5 py-3.5 text-base font-semibold text-background hover:bg-foreground/90 disabled:opacity-40 ${press}`;
const primaryButton = `inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 ${press}`;

function PlansPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/plans" });
  const user = usePlusUser();
  const currentPlan = usePlus();
  const returnTo = safeReturnPath(search.from);
  const room = rooms.find((item) => item.id === search.room) ?? null;
  const plan = planById(search.plan);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  // Never land on a step whose inputs are missing.
  let step: Step = search.step ?? "plan";
  if (step !== "plan" && !plan) step = "plan";
  if (step === "pay" && !user) step = "details";
  if (step === "done" && !receipt) step = plan ? "pay" : "plan";

  const goTo = (next: Step, planId?: string) =>
    void navigate({ search: (prev) => ({ ...prev, step: next, plan: planId ?? prev.plan }) });

  const contact = { phone: landlordWhatsApp, message: contactMessage(room) };

  if (currentPlan && step !== "done") {
    return (
      <Shell returnTo={returnTo} user={user}>
        <AlreadySubscribed plan={currentPlan} contact={contact} returnTo={returnTo} />
      </Shell>
    );
  }

  return (
    <Shell returnTo={returnTo} user={user}>
      <Stepper current={step} onBack={(target) => goTo(target)} />
      <div key={step} className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
        {step === "plan" && <PlanStep room={room} onChoose={(id) => goTo("details", id)} />}
        {step === "details" && plan && (
          <DetailsStep plan={plan} room={room} user={user} onContinue={() => goTo("pay")} />
        )}
        {step === "pay" && plan && user && (
          <PayStep
            plan={plan}
            room={room}
            user={user}
            onPaid={(paid) => {
              setReceipt(paid);
              goTo("done");
            }}
          />
        )}
        {step === "done" && receipt && <DoneStep receipt={receipt} contact={contact} returnTo={returnTo} />}
      </div>
    </Shell>
  );
}

/* ───────────── Step 1: plan ───────────── */

function PlanStep({ room, onChoose }: { room: Room | null; onChoose: (id: Plan["id"]) => void }) {
  return (
    <>
      <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-5xl">Choose your plan</h1>
      <p className="mt-3 max-w-xl text-base text-muted-foreground">
        {room
          ? `Get Nestaway Plus to message the landlord of ${room.shortName} (€${room.price.toLocaleString("en")}/month) directly on WhatsApp.`
          : "Get Nestaway Plus to message landlords directly on WhatsApp."}
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
        {plans.map((option) => (
          <article key={option.id} className="flex flex-col rounded-2xl border-2 bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold">{option.name}</h2>
            <p className="mt-3 text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">{option.price}</p>
            <ul className="mt-6 flex-1 space-y-3 border-t pt-6">
              {option.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" /> {feature}
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => onChoose(option.id)} className={`mt-8 ${darkButton}`}>
              Choose {option.name}
            </button>
          </article>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Smartphone className="size-4 shrink-0" /> Pay with Airtel, MTN or Zamtel mobile money. No card needed.
      </p>
    </>
  );
}

/* ───────────── Step 2: details ───────────── */

function DetailsStep({
  plan,
  room,
  user,
  onContinue,
}: {
  plan: Plan;
  room: Room | null;
  user: PlusUser | null;
  onContinue: () => void;
}) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [signingIn, setSigningIn] = useState(false);

  // When sign-in finishes, fill the form from the account (they can still edit it).
  useEffect(() => {
    if (!user) return;
    setName((current) => current || user.name);
    setEmail((current) => current || user.email);
  }, [user]);

  // DEMO "Continue with Google": the real one redirects to Google and back to this exact URL.
  const signIn = () => {
    setSigningIn(true);
    window.setTimeout(() => setPlusUser({ name: "Mwila Banda", email: "mwila.banda@example.com" }), 900);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPlusUser({ name: name.trim(), email: email.trim() });
    onContinue();
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your details</h1>
        {!user ? (
          <div className="mt-6 rounded-2xl border-2 p-6">
            <h2 className="text-lg font-semibold">Sign in to continue</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your plan is saved to your account, so it works on any phone. You'll come straight back to this step.
            </p>
            <button type="button" onClick={signIn} disabled={signingIn} className={`mt-5 inline-flex w-full items-center justify-center gap-3 rounded-md border-2 bg-background px-5 py-3.5 text-base font-semibold hover:bg-muted disabled:opacity-60 ${press}`}>
              {signingIn ? <Loader2 className="size-5 animate-spin" /> : <GoogleIcon />}
              {signingIn ? "Signing in…" : "Continue with Google"}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-2">
            <p className="text-base text-muted-foreground">We email your receipt to the address you give here.</p>
            <label className="mt-6 block text-sm font-semibold">
              Your name
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="mt-2 h-12 w-full rounded-md border-2 bg-background px-4 text-base font-normal outline-none focus:border-foreground"
              />
            </label>
            <label className="mt-5 block text-sm font-semibold">
              Email for your receipt
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="mt-2 h-12 w-full rounded-md border-2 bg-background px-4 text-base font-normal outline-none focus:border-foreground"
              />
            </label>
            <button type="submit" className={`mt-8 ${darkButton}`}>
              Continue to payment <span aria-hidden>→</span>
            </button>
          </form>
        )}
      </div>

      <div className="lg:order-2">
        <OrderSummary plan={plan} room={room} />
      </div>
    </div>
  );
}

/* ───────────── Step 3: pay ───────────── */

type Receipt = { reference: string; plan: Plan; email: string; phone: string; paidAt: Date };

function PayStep({
  plan,
  room,
  user,
  onPaid,
}: {
  plan: Plan;
  room: Room | null;
  user: PlusUser;
  onPaid: (receipt: Receipt) => void;
}) {
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Latest callback without restarting the payment timer on every re-render.
  const paidRef = useRef(onPaid);
  paidRef.current = onPaid;

  // DEMO payment: the real provider sends a prompt to the phone and reports back when the
  // customer enters their PIN. Swap this timer for that callback.
  useEffect(() => {
    if (!waiting) return;
    const timer = window.setTimeout(() => {
      setPlus(plan.id);
      paidRef.current({
        reference: `NW-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        plan,
        email: user.email,
        phone,
        paidAt: new Date(),
      });
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [waiting, attempt, plan, user.email, phone]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWaiting(true);
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div className="min-w-0">
        {waiting ? (
          <div className="rounded-2xl border-2 p-6 text-center sm:p-10" aria-live="polite">
            <span className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/10 [animation-duration:1.6s]" />
              <Smartphone className="size-7" />
            </span>
            <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">Check your phone</h1>
            <p className="mx-auto mt-2 max-w-sm text-base text-muted-foreground">
              We sent a payment request for <strong className="text-foreground">{plan.price}</strong> to{" "}
              <strong className="text-foreground">+260 {phone}</strong>. Enter your mobile money PIN on your phone to approve it.
            </p>
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Waiting for your approval…
            </p>
            <div className="mt-8 border-t pt-6 text-sm">
              <p className="font-medium">No prompt on your phone?</p>
              <div className="mt-3 flex justify-center gap-3">
                <button type="button" onClick={() => setAttempt((count) => count + 1)} className={`rounded-md border-2 px-4 py-2 font-semibold hover:bg-muted ${press}`}>
                  Send it again
                </button>
                <button type="button" onClick={() => setWaiting(false)} className={`rounded-md px-4 py-2 font-semibold underline underline-offset-4 ${press}`}>
                  Change number
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Pay with mobile money</h1>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              We'll send a payment request to your phone. Approve it with your mobile money PIN, and you'll come straight back here.
            </p>

            <label className="mt-8 block text-sm font-semibold">
              Mobile money number
              <span className="mt-2 flex h-14 items-center rounded-md border-2 bg-background focus-within:border-foreground">
                <span className="border-r-2 px-4 text-base font-normal text-muted-foreground">+260</span>
                <input
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  pattern="0?[0-9 ]{9,11}"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="97 123 4567"
                  className="h-full min-w-0 flex-1 bg-transparent px-4 text-lg font-normal tracking-wide outline-none"
                />
              </span>
            </label>
            <p className="mt-2 text-sm text-muted-foreground">Airtel, MTN or Zamtel.</p>

            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" required checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 size-5 shrink-0 accent-foreground" />
              <span>I agree to the Nestaway Plus terms.</span>
            </label>

            <div className="sticky bottom-0 -mx-4 mt-8 border-t bg-background/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
              <button type="submit" className={primaryButton}>
                <Lock className="size-4" /> Pay {plan.price}
              </button>
            </div>

            <p className="mt-5 flex gap-2 text-sm leading-6 text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              You approve the payment on your own phone. Nestaway never sees or asks for your PIN.
            </p>
          </form>
        )}
      </div>

      <div className="lg:order-2">
        <OrderSummary plan={plan} room={room} email={user.email} />
      </div>
    </div>
  );
}

/* ───────────── Step 4: done ───────────── */

function DoneStep({
  receipt,
  contact,
  returnTo,
}: {
  receipt: Receipt;
  contact: { phone: string; message: string };
  returnTo: string;
}) {
  const navigate = useNavigate();
  const continueToChat = () => {
    window.open(whatsappLink(contact), "_blank", "noopener,noreferrer");
    void navigate({ to: returnTo });
  };

  return (
    <div className="mx-auto mt-10 max-w-xl">
      <div className="text-center animate-in fade-in zoom-in-95 duration-300 ease-out">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
          <Check className="size-8" />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Payment received</h1>
        <p className="mt-2 text-base text-muted-foreground">
          You're on Nestaway Plus {receipt.plan.name}.
        </p>
      </div>

      <dl className="mt-8 divide-y rounded-2xl border-2 px-6 text-sm">
        <Row label="Amount paid" value={receipt.plan.price} strong />
        <Row label="Paid from" value={`Mobile money · +260 ${receipt.phone}`} />
        <Row label="Reference" value={receipt.reference} />
        <Row label="Date" value={receipt.paidAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} />
      </dl>
      <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Mail className="size-4 shrink-0" /> Receipt sent to {receipt.email}
      </p>

      <div className="mt-10">
        <p className="text-sm font-semibold">Your message to the landlord</p>
        <p className="mt-2 rounded-lg bg-muted p-4 text-sm leading-6">“{contact.message}”</p>
        <button type="button" onClick={continueToChat} className={`mt-4 w-full py-3.5 text-base ${whatsappButton}`}>
          <WhatsAppIcon className="size-5" /> Continue to WhatsApp
        </button>
        <Link to={returnTo} className={`mt-2 flex w-full justify-center rounded-md border-2 px-5 py-3 text-sm font-semibold hover:bg-muted ${press}`}>
          Back to the listing
        </Link>
      </div>
    </div>
  );
}

function AlreadySubscribed({ plan, contact, returnTo }: { plan: Plan; contact: { phone: string; message: string }; returnTo: string }) {
  return (
    <div className="mx-auto mt-10 max-w-xl text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
        <Check className="size-8" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">You already have Plus</h1>
      <p className="mt-2 text-muted-foreground">{plan.name} plan · {plan.price}</p>
      <a href={whatsappLink(contact)} target="_blank" rel="noopener noreferrer" className={`mt-8 w-full py-3.5 text-base ${whatsappButton}`}>
        <WhatsAppIcon className="size-5" /> Continue to WhatsApp
      </a>
      <Link to={returnTo} className={`mt-2 flex w-full justify-center rounded-md border-2 px-5 py-3 text-sm font-semibold hover:bg-muted ${press}`}>
        Back to the listing
      </Link>
      {import.meta.env.DEV && (
        <button type="button" onClick={() => { setPlus(null); setPlusUser(null); }} className="mt-10 text-xs text-muted-foreground underline">
          Reset demo (sign out and remove plan, dev only)
        </button>
      )}
    </div>
  );
}

/* ───────────── shared pieces ───────────── */

function OrderSummary({ plan, room, email }: { plan: Plan; room: Room | null; email?: string }) {
  return (
    <aside className="rounded-2xl bg-foreground p-6 text-background sm:p-8 lg:sticky lg:top-6">
      <p className="text-sm font-semibold text-background/70">Your order</p>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-lg font-semibold">Nestaway Plus {plan.name}</p>
        <p className="font-semibold tabular-nums">{plan.price}</p>
      </div>
      {room && (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-background/10 p-3">
          {room.images[0] ? (
            <img src={room.images[0].src} alt="" className="size-11 shrink-0 rounded-md object-cover" />
          ) : (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-background/10"><Home className="size-5" /></span>
          )}
          <p className="min-w-0 text-sm leading-5">
            <span className="text-background/70">Then chat about</span>
            <br />
            <span className="font-medium">{room.shortName} · Kreuzberg</span>
          </p>
        </div>
      )}
      {email && <p className="mt-4 text-sm text-background/70">Receipt goes to {email}</p>}
      <div className="mt-6 flex items-baseline justify-between border-t border-background/20 pt-6">
        <p className="font-semibold">Total</p>
        <p className="text-4xl font-bold tracking-tight tabular-nums">{plan.price}</p>
      </div>
      <p className="mt-2 text-right text-xs text-background/60">No other fees</p>
    </aside>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-3.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-right ${strong ? "font-bold" : "font-medium"}`}>{value}</dd>
    </div>
  );
}

const stepLabels: Record<Step, string> = { plan: "Plan", details: "Details", pay: "Pay", done: "Done" };

function Stepper({ current, onBack }: { current: Step; onBack: (step: Step) => void }) {
  const currentIndex = steps.indexOf(current);
  return (
    <ol className="flex items-center gap-2 text-sm sm:gap-3">
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const canGoBack = done && current !== "done";
        const active = index === currentIndex;
        const content = (
          <>
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors duration-200 ${
                active ? "border-foreground bg-foreground text-background" : done ? "border-foreground" : "border-border text-muted-foreground"
              }`}
            >
              {done ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span className={`${active ? "font-semibold" : "text-muted-foreground"} ${active ? "" : "hidden sm:inline"}`}>{stepLabels[step]}</span>
          </>
        );
        return (
          <li key={step} className="flex items-center gap-2 sm:gap-3">
            {canGoBack ? (
              <button type="button" onClick={() => onBack(step)} className={`flex items-center gap-2 rounded-md ${press}`} aria-label={`Back to ${stepLabels[step]}`}>
                {content}
              </button>
            ) : (
              <span className="flex items-center gap-2" aria-current={active ? "step" : undefined}>{content}</span>
            )}
            {index < steps.length - 1 && <span className="h-px w-4 bg-border sm:w-10" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function Shell({ returnTo, user, children }: { returnTo: string; user: PlusUser | null; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to={returnTo} className={`-ml-2 flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-muted ${press}`}>
            <ArrowLeft className="size-5" /> <span className="hidden sm:inline">Back to listing</span>
          </Link>
          <span className="font-display text-2xl tracking-wide text-primary">NESTAWAY</span>
          <span className="flex w-24 justify-end">
            {user && (
              <span title={user.email} className="flex size-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                {user.name.trim().charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">{children}</main>
    </div>
  );
}

// Google "G" from Simple Icons v13.21.0 (CC0-1.0).
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}
