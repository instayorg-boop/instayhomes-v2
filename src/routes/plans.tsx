import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Home, Loader2, Lock, ShieldCheck, Smartphone } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { whatsappButton, whatsappLink } from "@/components/contact-landlord";
import {
  planById,
  plans,
  rememberMomoNumber,
  rememberedMomoNumber,
  safeReturnPath,
  setPlus,
  setPlusUser,
  usePlus,
  usePlusUser,
  type Plan,
  type PlusUser,
} from "@/lib/plus";
import { contactMessage, landlordWhatsApp, rooms, type Room } from "./listing";

// One screen: what you're unlocking, the plan (Self-service unless changed), sign-in the first
// time, the mobile money number, Pay. Everything lives in the URL, so returning from Google
// sign-in or reloading lands on the same screen with the same plan.
type PlansSearch = {
  from?: string | undefined;
  room?: string | undefined;
  plan?: string | undefined;
  view?: "plans" | undefined;
};

const str = (value: unknown) => (typeof value === "string" ? value : undefined);

export const Route = createFileRoute("/plans")({
  validateSearch: (search: Record<string, unknown>): PlansSearch => ({
    from: str(search["from"]),
    room: str(search["room"]),
    plan: str(search["plan"]),
    view: search["view"] === "plans" ? "plans" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Nestaway Plus | Chat with landlords on WhatsApp" },
      { name: "description", content: "Pay with mobile money to contact landlords directly on WhatsApp." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PlansPage,
});

const press = "transition-[scale,background-color,border-color,color,opacity] duration-150 ease-out active:scale-[0.97]";
const darkButton = `inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-5 py-3.5 text-base font-semibold text-background hover:bg-foreground/90 ${press}`;
const DEFAULT_PLAN = "self-service";

type Contact = { phone: string; message: string };
type Receipt = { reference: string; plan: Plan; email: string; phone: string };

function PlansPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/plans" });
  const user = usePlusUser();
  const currentPlan = usePlus();
  const returnTo = safeReturnPath(search.from);
  const room = rooms.find((item) => item.id === search.room) ?? null;
  const plan = planById(search.plan) ?? planById(DEFAULT_PLAN)!;
  const contact: Contact = { phone: landlordWhatsApp, message: contactMessage(room) };
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const setView = (next: { plan?: string; view?: "plans" | undefined }) =>
    void navigate({ search: (prev) => ({ ...prev, plan: next.plan ?? prev.plan, view: next.view }) });

  if (receipt) {
    return (
      <Shell returnTo={returnTo} user={user}>
        <Paid receipt={receipt} contact={contact} returnTo={returnTo} />
      </Shell>
    );
  }

  if (currentPlan) {
    return (
      <Shell returnTo={returnTo} user={user}>
        <AlreadySubscribed plan={currentPlan} contact={contact} returnTo={returnTo} />
      </Shell>
    );
  }

  return (
    <Shell returnTo={returnTo} user={user}>
      {search.view === "plans" ? (
        <ComparePlans current={plan} onChoose={(id) => setView({ plan: id, view: undefined })} onClose={() => setView({ view: undefined })} />
      ) : (
        <PayScreen plan={plan} room={room} user={user} onChangePlan={() => setView({ view: "plans" })} onPaid={setReceipt} />
      )}
    </Shell>
  );
}

/* ───────────── the one screen ───────────── */

function PayScreen({
  plan,
  room,
  user,
  onChangePlan,
  onPaid,
}: {
  plan: Plan;
  room: Room | null;
  user: PlusUser | null;
  onChangePlan: () => void;
  onPaid: (receipt: Receipt) => void;
}) {
  const [phone, setPhone] = useState("");
  const [remembered, setRemembered] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState(user?.email ?? "");
  const [signingIn, setSigningIn] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const paidRef = useRef(onPaid);
  paidRef.current = onPaid;

  // Fill in what we already know: the last number they paid with, and their account email.
  useEffect(() => {
    const saved = rememberedMomoNumber();
    if (saved) {
      setPhone(saved);
      setRemembered(true);
    }
  }, []);
  useEffect(() => {
    if (user) setEmail((current) => current || user.email);
  }, [user]);

  // DEMO "Continue with Google": the real one redirects to Google and back to this exact URL.
  const signIn = () => {
    setSigningIn(true);
    window.setTimeout(() => setPlusUser({ name: "Mwila Banda", email: "mwila.banda@example.com" }), 900);
  };

  // DEMO payment: the real provider sends a prompt to the phone and reports back once the PIN
  // is entered. Swap this timer for that callback.
  useEffect(() => {
    if (!waiting || !user) return;
    const timer = window.setTimeout(() => {
      setPlus(plan.id);
      paidRef.current({
        reference: `NW-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        plan,
        email: email || user.email,
        phone,
      });
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [waiting, attempt, plan, user, email, phone]);

  const pay = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (email && email !== user.email) setPlusUser({ ...user, email });
    rememberMomoNumber(phone);
    setWaiting(true);
  };

  if (waiting) {
    return (
      <div className="mx-auto max-w-md pt-6 text-center animate-in fade-in duration-300 ease-out" aria-live="polite">
        <span className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/10 [animation-duration:1.6s]" />
          <Smartphone className="size-7" />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Check your phone</h1>
        <p className="mt-2 text-base text-muted-foreground">
          We sent a request for <strong className="text-foreground">{plan.price}</strong> to{" "}
          <strong className="text-foreground">+260 {phone}</strong>. Enter your mobile money PIN to approve it. WhatsApp opens as soon as it's done.
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
    );
  }

  return (
    <form onSubmit={pay} className="mx-auto max-w-md animate-in fade-in duration-200 ease-out">
      {/* What they're unlocking stays in view, so paying reads as the last step of contacting. */}
      <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
        {room?.images[0] ? (
          <img src={room.images[0].src} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-background"><Home className="size-6 text-muted-foreground" /></span>
        )}
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Unlock chat with the landlord of</p>
          <p className="truncate font-semibold">
            {room ? `${room.shortName} · €${room.price.toLocaleString("en")}/month` : "Sunny shared apartment"}
          </p>
          <p className="text-xs text-muted-foreground">Kreuzberg, Berlin</p>
        </div>
      </div>

      <h1 className="mt-7 text-3xl font-bold tracking-tight">Get Nestaway Plus</h1>
      <p className="mt-1 text-base text-muted-foreground">Chat with landlords directly on WhatsApp.</p>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border-2 p-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Your plan</p>
          <p className="font-semibold">{plan.name} · {plan.price}</p>
        </div>
        <button type="button" onClick={onChangePlan} className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold underline underline-offset-4 hover:bg-muted ${press}`}>
          Change
        </button>
      </div>

      {!user ? (
        <div className="mt-6">
          <button type="button" onClick={signIn} disabled={signingIn} className={`inline-flex w-full items-center justify-center gap-3 rounded-md border-2 bg-background px-5 py-3.5 text-base font-semibold hover:bg-muted disabled:opacity-60 ${press}`}>
            {signingIn ? <Loader2 className="size-5 animate-spin" /> : <GoogleIcon />}
            {signingIn ? "Signing in…" : "Continue with Google"}
          </button>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Your plan is saved to your account. You'll come straight back here to pay.
          </p>
        </div>
      ) : (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out">
          <label className="block text-sm font-semibold">
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
                onChange={(event) => {
                  setPhone(event.target.value);
                  setRemembered(false);
                }}
                placeholder="97 123 4567"
                className="h-full min-w-0 flex-1 bg-transparent px-4 text-lg font-normal tracking-wide outline-none"
              />
            </span>
          </label>
          <p className="mt-2 text-sm text-muted-foreground">
            {remembered ? <span className="font-medium text-emerald-700">✓ The number you used last time</span> : "Airtel, MTN or Zamtel."}
          </p>

          <div className="mt-4 text-sm text-muted-foreground">
            {editingEmail ? (
              <label className="block font-semibold text-foreground">
                Email for your receipt
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-12 w-full rounded-md border-2 bg-background px-4 text-base font-normal outline-none focus:border-foreground"
                />
              </label>
            ) : (
              <p>
                Receipt goes to <span className="font-medium text-foreground">{email}</span>{" "}
                <button type="button" onClick={() => setEditingEmail(true)} className="font-semibold text-foreground underline underline-offset-4">
                  Change
                </button>
              </p>
            )}
          </div>

          <div className="sticky bottom-0 -mx-4 mt-6 border-t bg-background/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
            <button type="submit" className={`inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 ${press}`}>
              <Lock className="size-4" /> Pay {plan.price}
            </button>
            {/* PLACEHOLDER legal wording: confirm with a lawyer that this can replace a checkbox. */}
            <p className="mt-2 text-center text-xs text-muted-foreground">By paying you agree to the Nestaway Plus terms. No other fees.</p>
          </div>

          <p className="mt-5 flex gap-2 text-sm leading-6 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            You approve the payment on your own phone. Nestaway never sees or asks for your PIN.
          </p>
        </div>
      )}
    </form>
  );
}

/* ───────────── "Change" → compare plans ───────────── */

function ComparePlans({ current, onChoose, onClose }: { current: Plan; onChoose: (id: Plan["id"]) => void; onClose: () => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      <button type="button" onClick={onClose} className={`-ml-2 flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-muted ${press}`}>
        <ArrowLeft className="size-4" /> Back to payment
      </button>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Choose your plan</h1>
      <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
        {plans.map((option) => {
          const selected = option.id === current.id;
          return (
            <article key={option.id} className={`flex flex-col rounded-2xl border-2 bg-card p-6 sm:p-8 ${selected ? "border-foreground" : ""}`}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">{option.name}</h2>
                {selected && <span className="rounded-full bg-foreground px-2.5 py-0.5 text-xs font-semibold text-background">Selected</span>}
              </div>
              <p className="mt-3 text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">{option.price}</p>
              <ul className="mt-6 flex-1 space-y-3 border-t pt-6">
                {option.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" /> {feature}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => onChoose(option.id)} className={`mt-8 ${darkButton}`}>
                {selected ? `Keep ${option.name}` : `Choose ${option.name}`}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── paid → straight into WhatsApp ───────────── */

function Paid({ receipt, contact, returnTo }: { receipt: Receipt; contact: Contact; returnTo: string }) {
  const link = whatsappLink(contact);

  // Open the chat in this tab (not a pop-up, so the browser allows it). The listing replaces
  // this page in history, so "back" from WhatsApp returns to the room, not to the payment.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.history.replaceState(null, "", returnTo);
      window.location.assign(link);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [link, returnTo]);

  return (
    <div className="mx-auto max-w-md pt-6 text-center animate-in fade-in zoom-in-95 duration-300 ease-out" aria-live="polite">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
        <Check className="size-8" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Payment received</h1>
      <p className="mt-2 flex items-center justify-center gap-2 text-base text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Opening WhatsApp…
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        {receipt.plan.price} from +260 {receipt.phone} · Ref {receipt.reference}
        <br />
        Receipt sent to {receipt.email}
      </p>
      <a href={link} className={`mt-8 w-full py-3.5 text-base ${whatsappButton}`}>
        <WhatsAppIcon className="size-5" /> Open WhatsApp
      </a>
      <Link to={returnTo} className={`mt-2 flex w-full justify-center rounded-md border-2 px-5 py-3 text-sm font-semibold hover:bg-muted ${press}`}>
        Back to the listing
      </Link>
    </div>
  );
}

function AlreadySubscribed({ plan, contact, returnTo }: { plan: Plan; contact: Contact; returnTo: string }) {
  return (
    <div className="mx-auto max-w-md pt-6 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
        <Check className="size-8" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">You already have Plus</h1>
      <p className="mt-2 text-muted-foreground">{plan.name} plan · {plan.price}</p>
      <a href={whatsappLink(contact)} className={`mt-8 w-full py-3.5 text-base ${whatsappButton}`}>
        <WhatsAppIcon className="size-5" /> Open WhatsApp
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

function Shell({ returnTo, user, children }: { returnTo: string; user: PlusUser | null; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to={returnTo} className={`-ml-2 flex w-24 items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-muted ${press}`}>
            <ArrowLeft className="size-5" /> <span className="hidden sm:inline">Back</span>
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
