import { createFileRoute, Link, useBlocker, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronDown, Loader2, Lock, Mail, ShieldCheck, Smartphone, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { VerifiedIcon } from "@/components/verified-badge";
import { TenantProtectionLink } from "@/components/tenant-protection";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { whatsappButton, whatsappLink } from "@/components/contact-landlord";
import {
  planById,
  plans,
  plusPromise,
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
import { contactMessage, heroImage, landlordWhatsApp, rooms, type Room } from "./listing";

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
      { title: "Instayhomes Plus | Chat with landlords on WhatsApp" },
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
type NotPaid = "failed" | "declined" | "cancelled";
// The payment's answer decides the page: success, or a page saying why it didn't happen.
type Result = { kind: "paid"; receipt: Receipt } | { kind: NotPaid; plan: Plan; phone: string };

function PlansPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/plans" });
  const user = usePlusUser();
  const currentPlan = usePlus();
  const returnTo = safeReturnPath(search.from);
  const room = rooms.find((item) => item.id === search.room) ?? null;
  const plan = planById(search.plan) ?? planById(DEFAULT_PLAN)!;
  const contact: Contact = { phone: landlordWhatsApp, message: contactMessage(room) };
  const [result, setResult] = useState<Result | null>(null);

  const setView = (next: { plan?: string; view?: "plans" | undefined }) =>
    void navigate({ search: (prev) => ({ ...prev, plan: next.plan ?? prev.plan, view: next.view }) });

  if (result?.kind === "paid") {
    return (
      <Shell returnTo={returnTo} user={user}>
        <Paid receipt={result.receipt} contact={contact} returnTo={returnTo} />
      </Shell>
    );
  }

  if (result) {
    return (
      <Shell returnTo={returnTo} user={user}>
        <NotCompleted result={result} returnTo={returnTo} onTryAgain={() => setResult(null)} />
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
    <Shell returnTo={returnTo} user={user} photoFirst={search.view !== "plans"}>
      {search.view === "plans" ? (
        <ComparePlans current={plan} onChoose={(id) => setView({ plan: id, view: undefined })} onClose={() => setView({ view: undefined })} />
      ) : (
        <PayScreen plan={plan} room={room} user={user} returnTo={returnTo} onChangePlan={() => setView({ view: "plans" })} onResult={setResult} />
      )}
    </Shell>
  );
}

/* ───────────── the one screen ───────────── */


function PayScreen({
  plan,
  room,
  user,
  returnTo,
  onChangePlan,
  onResult,
}: {
  returnTo: string;
  plan: Plan;
  room: Room | null;
  user: PlusUser | null;
  onChangePlan: () => void;
  onResult: (result: Result) => void;
}) {
  const [phone, setPhone] = useState("");
  const [remembered, setRemembered] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState(user?.email ?? "");
  const [signingIn, setSigningIn] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [showIncluded, setShowIncluded] = useState(false);
  const resultRef = useRef(onResult);
  resultRef.current = onResult;

  // While the phone prompt is open, keep them on this page: in-app links and the back button
  // do nothing, and closing or reloading the tab asks first.
  useBlocker({ shouldBlockFn: () => pending, enableBeforeUnload: () => pending });

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

  // DEMO payment: the real provider sends a prompt to the phone and reports success, failure
  // or a decline once the customer responds. Swap this timer for that callback.
  // To try the other outcomes: a number ending 0000 fails, one ending 1111 is declined.
  useEffect(() => {
    if (!pending || !user) return;
    const digits = phone.replace(/\D/g, "");
    const timer = window.setTimeout(() => {
      setPending(false);
      if (digits.endsWith("0000")) return resultRef.current({ kind: "failed", plan, phone });
      if (digits.endsWith("1111")) return resultRef.current({ kind: "declined", plan, phone });
      setPlus(plan.id);
      resultRef.current({
        kind: "paid",
        receipt: {
          reference: `IH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          plan,
          email: email || user.email,
          phone,
        },
      });
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [pending, attempt, plan, user, email, phone]);

  const pay = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || pending) return;
    if (email && email !== user.email) setPlusUser({ ...user, email });
    rememberMomoNumber(phone);
    setPending(true);
  };

  return (
    <form onSubmit={pay} className="mx-auto max-w-md animate-in fade-in duration-200 ease-out">
      {/* What they're unlocking stays in view, so paying reads as the last step of contacting. */}
      {/* The room's photo (or the property's main photo for the whole home), darkened towards the
          bottom with the name over it. Edge to edge on phones, a rounded card on wider screens. */}
      <div className="relative -mx-4 h-60 overflow-hidden sm:mx-0 sm:h-52 sm:rounded-2xl">
        <img src={room?.images[0]?.src ?? heroImage} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/80 sm:from-black/15 sm:via-black/35" aria-hidden />
        {/* Phones have no top bar here, so back, logo and account sit on the photo. */}
        <div className="absolute inset-x-4 top-[max(0.75rem,env(safe-area-inset-top))] flex items-center justify-between sm:hidden">
          <Link to={returnTo} aria-label="Back" className={`flex size-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow ${press}`}>
            <ArrowLeft className="size-5" />
          </Link>
          <span className="font-display text-xl tracking-wide text-white drop-shadow">INSTAYHOMES</span>
          <span className="flex size-9 items-center justify-center">
            {user && (
              <span title={user.email} className="flex size-9 items-center justify-center rounded-full bg-white/90 text-sm font-semibold text-foreground shadow">
                {user.name.trim().charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-7 text-white sm:inset-x-5 sm:bottom-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">Unlock chat with the landlord of</p>
          <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-2xl font-bold tracking-tight">
            <span className="truncate">{room ? room.shortName : "Sunny shared apartment"}</span>
            <VerifiedIcon className="size-6 shrink-0" />
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold">
            {room && (
              <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-0.5 backdrop-blur-md">
                €{room.price.toLocaleString("en")}/month
              </span>
            )}
            <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-0.5 backdrop-blur-md">Kreuzberg, Berlin</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 py-0.5 pl-1.5 pr-2.5 backdrop-blur-md">
              <VerifiedIcon className="size-3.5" /> Tenant verified
            </span>
          </div>
        </div>
      </div>
      {/* On phones the page slides over the photo's bottom edge as a rounded sheet. */}
      <div className="relative -mx-4 -mt-4 rounded-t-[1.25rem] bg-background px-4 pt-6 sm:mx-0 sm:mt-0 sm:rounded-none sm:px-0">
      <h1 className="text-3xl font-bold tracking-tight">Get Instayhomes Plus</h1>
      <p className="mt-1 text-base text-muted-foreground">{plusPromise}</p>
      <TenantProtectionLink className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-dotted underline-offset-4 hover:decoration-solid">
        <ShieldCheck className="size-4 text-emerald-600" /> Covered by Tenant Protection
      </TenantProtectionLink>

      <fieldset disabled={pending} className="contents">
        <div className="mt-6 rounded-xl border-2">
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Your plan</p>
              <p className="font-semibold">{plan.name} · {plan.price}</p>
            </div>
            <button type="button" onClick={onChangePlan} className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold underline underline-offset-4 hover:bg-muted disabled:opacity-40 ${press}`}>
              Change
            </button>
          </div>
          <button
            type="button"
            aria-expanded={showIncluded}
            aria-controls="plan-included"
            onClick={() => setShowIncluded((open) => !open)}
            className="flex w-full items-center justify-between border-t px-4 py-3 text-sm font-medium hover:bg-muted/60"
          >
            What's included
            <ChevronDown className={`size-4 transition-transform duration-200 ease-out ${showIncluded ? "rotate-180" : ""}`} />
          </button>
          {/* Animates height with grid rows (0fr → 1fr), so no measuring is needed. */}
          <div
            id="plan-included"
            className="grid transition-[grid-template-rows] duration-300 ease-out"
            style={{ gridTemplateRows: showIncluded ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <ul className="space-y-2.5 px-4 pb-4 pt-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {!user ? (
          <div className="mt-6">
            <button type="button" onClick={signIn} disabled={signingIn} className={`inline-flex w-full items-center justify-center gap-3 rounded-md border-2 bg-background px-5 py-3.5 text-base font-semibold hover:bg-muted disabled:opacity-60 ${press}`}>
              {signingIn ? <Loader2 className="size-5 animate-spin" /> : <GoogleIcon />}
              {signingIn ? "Signing in…" : "Continue with Google"}
            </button>
            <button type="button" onClick={() => setEmailOpen(true)} disabled={signingIn} className={`mt-2 inline-flex w-full items-center justify-center gap-3 rounded-md border-2 bg-background px-5 py-3.5 text-base font-semibold hover:bg-muted disabled:opacity-60 ${press}`}>
              <Mail className="size-5" /> Continue with email
            </button>
            <EmailSignIn open={emailOpen} onOpenChange={setEmailOpen} />
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
                  className="h-full min-w-0 flex-1 bg-transparent px-4 text-lg font-normal tracking-wide outline-none disabled:opacity-60"
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
                  <button type="button" onClick={() => setEditingEmail(true)} className="font-semibold text-foreground underline underline-offset-4 disabled:opacity-40">
                    Change
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </fieldset>

      {user && (
        <>
          <div className="sticky bottom-0 -mx-4 mt-6 border-t bg-background/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
            {/* The button is the waiting state: no separate "check your phone" page. */}
            <button
              type="submit"
              aria-busy={pending}
              className={`relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-md px-5 py-3.5 text-base font-semibold text-primary-foreground ${press} ${
                pending ? "cursor-progress bg-primary/85" : "bg-primary hover:bg-primary/90"
              }`}
            >
              {pending && <span className="absolute inset-y-0 left-0 w-1/3 animate-[pay-sweep_1.4s_ease-in-out_infinite] bg-white/15" aria-hidden />}
              <span key={pending ? "pending" : "idle"} className="relative inline-flex items-center gap-2 animate-in fade-in duration-200">
                {pending ? <Smartphone className="size-5 animate-pulse" /> : <Lock className="size-4" />}
                {pending ? `Check your phone to approve ${plan.price}` : `Pay ${plan.price}`}
              </span>
            </button>
            <p aria-live="polite" className="mt-2 text-center text-xs text-muted-foreground">
              {pending ? (
                <>
                  Stay on this page until you've approved.{" "}
                  <button type="button" onClick={() => setAttempt((count) => count + 1)} className="font-semibold text-foreground underline underline-offset-2">
                    Send prompt again
                  </button>
                  {" · "}
                  <button type="button" onClick={() => { setPending(false); onResult({ kind: "cancelled", plan, phone }); }} className="font-semibold text-foreground underline underline-offset-2">
                    Cancel
                  </button>
                </>
              ) : (
                // PLACEHOLDER legal wording: confirm with a lawyer that this can replace a checkbox.
                "By paying you agree to the Instayhomes Plus terms. No other fees."
              )}
            </p>
          </div>

          <p className="mt-5 flex gap-2 text-sm leading-6 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            You approve the payment on your own phone. Instayhomes never sees or asks for your PIN.
          </p>
        </>
      )}
      </div>
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
      <p className="mt-3 max-w-xl text-base text-muted-foreground">{plusPromise}</p>
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

/* ───────────── didn't go through → say why, and offer the way back ───────────── */

const notPaidCopy: Record<NotPaid, { title: string; body: string }> = {
  failed: {
    title: "Payment didn't go through",
    body: "Your mobile money provider didn't complete the payment. This usually means the balance was too low or the network timed out.",
  },
  declined: {
    title: "Payment declined",
    body: "The request was declined on your phone, so nothing was paid.",
  },
  cancelled: {
    title: "Payment cancelled",
    body: "You cancelled before approving, so nothing was paid.",
  },
};

function NotCompleted({ result, returnTo, onTryAgain }: { result: Extract<Result, { kind: NotPaid }>; returnTo: string; onTryAgain: () => void }) {
  const copy = notPaidCopy[result.kind];
  return (
    <div className="mx-auto max-w-md pt-6 text-center animate-in fade-in zoom-in-95 duration-300 ease-out" aria-live="polite">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <X className="size-8" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{copy.title}</h1>
      <p className="mt-2 text-base text-muted-foreground">{copy.body}</p>

      <dl className="mt-8 divide-y rounded-2xl border-2 px-5 text-left text-sm">
        <div className="flex justify-between gap-4 py-3.5"><dt className="text-muted-foreground">Amount</dt><dd className="font-semibold">{result.plan.price}</dd></div>
        <div className="flex justify-between gap-4 py-3.5"><dt className="text-muted-foreground">From</dt><dd className="font-medium">+260 {result.phone}</dd></div>
        <div className="flex justify-between gap-4 py-3.5"><dt className="text-muted-foreground">Charged</dt><dd className="font-semibold text-emerald-700">Nothing</dd></div>
      </dl>

      <button type="button" onClick={onTryAgain} className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 ${press}`}>
        Try again
      </button>
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

function Shell({
  returnTo,
  user,
  children,
  photoFirst = false,
}: {
  returnTo: string;
  user: PlusUser | null;
  children: ReactNode;
  /** Phones: no top bar; the page's photo runs to the top with back and logo on it. */
  photoFirst?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className={`border-b ${photoFirst ? "max-sm:hidden" : ""}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-12">
          <Link to={returnTo} className={`-ml-2 flex w-24 items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-muted ${press}`}>
            <ArrowLeft className="size-5" /> <span className="hidden sm:inline">Back</span>
          </Link>
          <span className="font-display text-2xl tracking-wide text-primary">INSTAYHOMES</span>
          <span className="flex w-24 justify-end">
            {user && (
              <span title={user.email} className="flex size-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                {user.name.trim().charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </span>
        </div>
      </header>
      <main className={`mx-auto max-w-7xl px-4 pb-16 sm:px-12 sm:pt-10 ${photoFirst ? "pt-0" : "pt-6"}`}>{children}</main>
    </div>
  );
}

// Google's "G" logo, from Google's own sign-in button artwork
// (gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg). Used as Google's branding
// guidelines intend: on a "Continue with Google" button.
function GoogleIcon() {
  return (
    <svg viewBox="0 0 120 120" className="size-5" aria-hidden="true">
      <path fill="#4285F4" d="M117.6 61.36c0-4.25-.38-8.34-1.09-12.27H60V72.3h32.29c-1.39 7.5-5.62 13.85-11.97 18.11v15.05h19.39c11.35-10.44 17.89-25.83 17.89-44.1Z" />
      <path fill="#34A853" d="M60 120c16.2 0 29.78-5.37 39.71-14.54L80.32 90.41c-5.37 3.6-12.25 5.73-20.32 5.73-15.63 0-28.85-10.56-33.57-24.74H6.38v15.55C16.25 106.55 36.55 120 60 120Z" />
      <path fill="#FBBC05" d="M26.43 71.4c-1.2-3.6-1.88-7.45-1.88-11.4s.68-7.8 1.88-11.4V33.05H6.38A59.9 59.9 0 0 0 0 60c0 9.68 2.32 18.85 6.38 26.95L26.43 71.4Z" />
      <path fill="#EA4335" d="M60 23.86c8.81 0 16.72 3.03 22.94 8.98l17.2-17.21C89.76 5.95 76.17 0 60 0 36.55 0 16.25 13.45 6.38 33.05L26.43 48.6C31.15 34.42 44.37 23.86 60 23.86Z" />
    </svg>
  );
}

/* ───────────── email sign-in: a drawer (phones) or small window (desktop), never a new page ───────────── */

/** "mwila.banda@…" → "Mwila Banda", so the account has a name without asking for one. */
const nameFromEmail = (email: string) =>
  email
    .split("@")[0]!
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || email;

// DEMO: any 6-digit code signs in. The real one sends a one-time code (e.g. Supabase email OTP)
// and checks it; nothing else here changes.
function EmailSignIn({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (open) return;
    const reset = window.setTimeout(() => {
      setStep("email");
      setCode("");
      setBusy(false);
      setResent(false);
    }, 300);
    return () => window.clearTimeout(reset);
  }, [open]);

  const sendCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setStep("code");
    }, 700);
  };

  const verify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    window.setTimeout(() => {
      setPlusUser({ name: nameFromEmail(email.trim()), email: email.trim() });
      onOpenChange(false);
    }, 600);
  };

  const field = "h-12 w-full rounded-md border-2 bg-background px-4 text-base outline-none focus:border-foreground";
  const primary = `inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-5 py-3.5 text-base font-semibold text-background hover:bg-foreground/90 disabled:opacity-60 ${press}`;

  const title = step === "email" ? "Continue with email" : "Check your email";
  const description =
    step === "email" ? "We'll send you a 6-digit code. No password needed." : `Enter the 6-digit code we sent to ${email}.`;

  const body =
    step === "email" ? (
      <form onSubmit={sendCode} className="space-y-4">
        <label className="block text-sm font-semibold">
          Email
          <input
            required
            type="email"
            autoComplete="email"
            inputMode="email"
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={`mt-2 font-normal ${field}`}
          />
        </label>
        <button type="submit" disabled={busy} className={primary}>
          {busy && <Loader2 className="size-5 animate-spin" />} {busy ? "Sending code…" : "Send code"}
        </button>
      </form>
    ) : (
      <form onSubmit={verify} className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200 ease-out">
        <label className="block text-sm font-semibold">
          6-digit code
          <input
            required
            autoFocus
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
            className={`mt-2 text-center font-normal tracking-[0.5em] ${field}`}
          />
        </label>
        <button type="submit" disabled={busy || code.length !== 6} className={primary}>
          {busy && <Loader2 className="size-5 animate-spin" />} {busy ? "Signing in…" : "Continue"}
        </button>
        <div className="flex justify-between text-sm">
          <button type="button" onClick={() => setStep("email")} className="font-semibold underline underline-offset-4">
            Use a different email
          </button>
          <button type="button" onClick={() => setResent(true)} disabled={resent} className="font-semibold underline underline-offset-4 disabled:no-underline disabled:opacity-60">
            {resent ? "Code sent again" : "Resend code"}
          </button>
        </div>
      </form>
    );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
        <DrawerContent>
          <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <DrawerTitle className="text-lg font-bold">{title}</DrawerTitle>
            <DrawerDescription className="mb-5 mt-1 text-sm text-muted-foreground">{description}</DrawerDescription>
            {body}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <div>
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">{description}</DialogDescription>
        </div>
        {body}
      </DialogContent>
    </Dialog>
  );
}
