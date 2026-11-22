import { createFileRoute, Link, useBlocker, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Check, ChevronDown, CreditCard, Globe, Loader2, Lock, Mail, MessageSquareText, Plus, ShieldCheck, Smartphone, Users, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { universities } from "@/lib/universities";
import { VerifiedIcon } from "@/components/verified-badge";
import { TenantProtectionLink } from "@/components/tenant-protection";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { whatsappButton, whatsappLink } from "@/components/contact-landlord";
import {
  discountedPrice,
  accessPeriod,
  intlBilling,
  intlPromise,
  teamReplyTime,
  teamWhatsApp,
  planById,
  plans,
  promoPercent,
  recommendedPlanId,
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
  promo?: string | undefined;
};

const str = (value: unknown) => (typeof value === "string" ? value : undefined);

export const Route = createFileRoute("/plans")({
  validateSearch: (search: Record<string, unknown>): PlansSearch => ({
    from: str(search["from"]),
    room: str(search["room"]),
    plan: str(search["plan"]),
    view: search["view"] === "plans" ? "plans" : undefined,
    promo: str(search["promo"]),
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
const DEFAULT_PLAN = "assisted";

type Contact = { phone: string; message: string };
type Receipt = { reference: string; plan: Plan; email: string; phone: string };
type NotPaid = "failed" | "declined" | "cancelled";
// The payment's answer decides the page: success, or a page saying why it didn't happen.
type Result = { kind: "paid"; receipt: Receipt } | { kind: NotPaid; plan: Plan; phone: string };
type IntlRequest = { reference: string; whatsapp: string; university: string; arriving: string; budget: string; roomName: string | null };

function PlansPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/plans" });
  const user = usePlusUser();
  const currentPlan = usePlus();
  const returnTo = safeReturnPath(search.from);
  const room = rooms.find((item) => item.id === search.room) ?? null;
  const basePlan = planById(search.plan) ?? planById(DEFAULT_PLAN)!;
  // An applied promo code lowers the price everywhere on the payment screen.
  const promo = promoPercent(search.promo);
  const plan = { ...basePlan, price: discountedPrice(basePlan, basePlan.id === "international" ? null : promo) } as Plan;
  const contact: Contact = { phone: landlordWhatsApp, message: contactMessage(room) };
  const [result, setResult] = useState<Result | null>(null);
  const [intlRequest, setIntlRequest] = useState<IntlRequest | null>(null);

  const setView = (next: { plan?: string; view?: "plans" | undefined; promo?: string | undefined }) =>
    void navigate({
      search: (prev) => ({ ...prev, plan: next.plan ?? prev.plan, view: next.view, promo: "promo" in next ? next.promo : prev.promo }),
    });

  if (intlRequest) {
    return (
      <Shell returnTo={returnTo} user={user}>
        <IntlRequestReceived request={intlRequest} user={user} returnTo={returnTo} />
      </Shell>
    );
  }

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
        <ComparePlans
          current={basePlan}
          promo={search.promo}
          onChoose={(id, code) => setView({ plan: id, view: undefined, promo: code })}
          onClose={() => setView({ view: undefined })}
        />
      ) : (
        <PayScreen
          plan={plan}
          room={room}
          user={user}
          returnTo={returnTo}
          promo={promo ? search.promo?.toUpperCase() : undefined}
          onPromo={(code) => setView({ promo: code })}
          onChangePlan={() => setView({ view: "plans" })}
          onSwitchPlan={(id) => setView({ plan: id })}
          onIntlRequest={setIntlRequest}
          onResult={setResult}
        />
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
  promo,
  onPromo,
  onChangePlan,
  onSwitchPlan,
  onIntlRequest,
  onResult,
}: {
  onSwitchPlan: (id: Plan["id"]) => void;
  onIntlRequest: (request: IntlRequest) => void;
  returnTo: string;
  plan: Plan;
  room: Room | null;
  user: PlusUser | null;
  promo: string | undefined;
  onPromo: (code: string | undefined) => void;
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

  const isIntl = plan.id === "international";

  const pay = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // International never pays here (and Enter in its fields must not start a payment).
    if (isIntl) return;
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">{isIntl ? "You're asking about" : "Unlock chat with the landlord of"}</p>
          <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-2xl font-bold tracking-tight">
            <span className="truncate">{room ? room.shortName : "Sunny shared apartment"}</span>
            <VerifiedIcon className="size-6 shrink-0" />
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold">
            {room && (
              <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-0.5 backdrop-blur-md">
                K{room.price.toLocaleString("en")}/month
              </span>
            )}
            <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-0.5 backdrop-blur-md">Kreuzberg, Berlin</span>
          </div>
        </div>
      </div>
      {/* On phones the page slides over the photo's bottom edge as a rounded sheet. */}
      <div className="relative -mx-4 -mt-4 rounded-t-[1.25rem] bg-background px-4 pt-6 sm:mx-0 sm:mt-0 sm:rounded-none sm:px-0">
      <h1 className="text-2xl font-bold tracking-tight">{isIntl ? "Talk to our team" : "Get Instayhomes Plus"}</h1>
      <p className="mt-1 text-base text-muted-foreground">{isIntl ? intlPromise : plusPromise}</p>
      <TenantProtectionLink className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-dotted underline-offset-4 hover:decoration-solid">
        <ShieldCheck className="size-4 text-emerald-600" /> Covered by Tenant Protection
      </TenantProtectionLink>

      <fieldset disabled={pending} className="contents">
        <div className="mt-6 rounded-xl border-2">
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Your plan</p>
              <p className="font-semibold">{plan.name} · {plan.price}</p>
              <p className="text-xs text-muted-foreground">{isIntl ? intlBilling : accessPeriod}</p>
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

        {!isIntl && <PayPromo applied={promo} onApply={onPromo} />}

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
        ) : isIntl ? (
          <IntlRequestForm
            room={room}
            user={user}
            onSwitchToLocal={() => onSwitchPlan(recommendedPlanId)}
            onSent={onIntlRequest}
          />
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
              <NetworkHint phone={phone} remembered={remembered} />
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

      {user && !isIntl && (
        <>
          <div className="mt-6">
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

          <p className="mt-4 flex gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm leading-6 text-muted-foreground">
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

function featureIcon(feature: string) {
  const f = feature.toLowerCase();
  if (f.includes("contact") || f.includes("whatsapp")) return <WhatsAppIcon className="size-4 text-[#128C4A]" />;
  if (f.includes("agent")) return <Users className="size-4 text-muted-foreground" />;
  if (f.includes("viewing")) return <CalendarDays className="size-4 text-muted-foreground" />;
  if (f.includes("abroad")) return <Globe className="size-4 text-muted-foreground" />;
  if (f.includes("dollar")) return <CreditCard className="size-4 text-muted-foreground" />;
  return <MessageSquareText className="size-4 text-muted-foreground" />;
}

/** The page behind "Change": the plans stacked on phones, side by side on desktop. */
function ComparePlans({
  current,
  promo,
  onChoose,
  onClose,
}: {
  current: Plan;
  promo: string | undefined;
  onChoose: (id: Plan["id"], promo: string | undefined) => void;
  onClose: () => void;
}) {
  // One promo code for the page: applying it on any card applies to all plans.
  const [applied, setApplied] = useState<string | undefined>(promoPercent(promo) ? promo?.toUpperCase() : undefined);
  const percent = promoPercent(applied);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      <button type="button" onClick={onClose} className={`-ml-2 flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-muted ${press}`}>
        <ArrowLeft className="size-4" /> Back to payment
      </button>
      <h1 className="mt-4 text-center text-3xl font-medium tracking-tight sm:text-4xl">A plan for you</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-base text-muted-foreground">{plusPromise}</p>
      {percent && (
        <p className="mx-auto mt-4 w-fit rounded-full bg-emerald-600/10 px-3 py-1 text-sm font-medium text-emerald-700 animate-in fade-in duration-200">
          {applied} applied: {percent}% off every plan
        </p>
      )}

      <div className="mx-auto mt-8 grid max-w-md gap-5 lg:max-w-none lg:grid-cols-3 lg:items-stretch">
        {plans.map((option) => {
          const recommended = option.id === recommendedPlanId;
          const intl = option.id === "international";
          const selected = option.id === current.id;
          const price = discountedPrice(option, intl ? null : percent);
          return (
            <article
              key={option.id}
              className={`flex flex-col overflow-hidden rounded-2xl bg-card text-center ${
                recommended ? "border-2 border-primary" : intl ? "border-2 border-blue-600" : selected ? "border-2 border-foreground" : "border"
              }`}
            >
              {recommended ? (
                <p className="bg-primary/10 py-1.5 text-xs font-semibold text-primary">Recommended</p>
              ) : intl ? (
                <p className="bg-blue-50 py-1.5 text-xs font-semibold text-blue-700">For students moving from abroad</p>
              ) : (
                // Same height as the band, so names and prices line up across the row on desktop.
                <p className="invisible hidden py-1.5 text-xs lg:block" aria-hidden>
                  Recommended
                </p>
              )}
              <div className="flex flex-1 flex-col px-6 pb-2 pt-6">
                <h2 className="text-xl font-medium">{option.name}</h2>
                <p className={`mt-3 text-4xl font-bold tracking-tight tabular-nums ${recommended ? "text-primary" : ""}`}>
                  {price}
                  {percent && !intl && <s className="ml-2 align-middle text-base font-medium text-muted-foreground">{option.price}</s>}
                  <span className="ml-1 align-middle text-xs font-semibold text-muted-foreground">{option.currency}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{intl ? intlBilling : accessPeriod}</p>
                <button
                  type="button"
                  onClick={() => onChoose(option.id, applied)}
                  className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${press} ${
                    recommended ? "bg-primary text-primary-foreground hover:bg-primary/90" : intl ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  {intl ? "Talk to our team" : selected ? `Keep ${option.name}` : `Choose ${option.name}`}
                </button>
                <ul className="mt-6 flex-1 space-y-3 text-left">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 shrink-0">{featureIcon(feature)}</span> {feature}
                    </li>
                  ))}
                  <li className="flex items-start gap-3 text-sm">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" /> Covered by Tenant Protection
                  </li>
                </ul>
              </div>
              {intl ? <div className="mt-4 border-t px-6 py-3.5 text-sm text-muted-foreground">No payment until you choose</div> : <PromoCode applied={applied} onApply={setApplied} />}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function PromoCode({ applied, onApply }: { applied: string | undefined; onApply: (code: string | undefined) => void }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  if (applied) {
    return (
      <div className="mt-4 flex items-center justify-center gap-2 border-t px-6 py-3.5 text-sm">
        <Check className="size-4 text-emerald-600" /> <span className="font-medium">{applied}</span>
        <button type="button" onClick={() => onApply(undefined)} className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Remove
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-4 flex w-full items-center justify-center gap-1.5 border-t px-6 py-3.5 text-sm font-semibold hover:bg-muted/60">
        <Plus className="size-4" /> Add promo code
      </button>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (promoPercent(code)) {
          onApply(code.trim().toUpperCase());
          setError(false);
        } else {
          setError(true);
        }
      }}
      className="mt-4 border-t px-4 py-3 text-left animate-in fade-in duration-200"
    >
      <div className="flex gap-2">
        <input
          autoFocus
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError(false);
          }}
          aria-label="Promo code"
          aria-invalid={error}
          placeholder="Promo code"
          autoCapitalize="characters"
          className="h-10 min-w-0 flex-1 rounded-md border-2 bg-background px-3 text-base uppercase outline-none focus:border-foreground md:text-sm"
        />
        <button type="submit" className={`shrink-0 rounded-md bg-foreground px-4 text-sm font-semibold text-background ${press}`}>
          Apply
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">That code isn't valid. Check the spelling and try again.</p>}
    </form>
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
    <div className="min-h-svh bg-background text-foreground">
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

/** Zambian mobile money networks by the number's first two digits (after 0 or +260). */
function networkFor(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^260/, "").replace(/^0/, "");
  if (digits.length < 2) return null;
  const prefix = digits.slice(0, 2);
  if (prefix === "97" || prefix === "77") return "Airtel Money";
  if (prefix === "96" || prefix === "76") return "MTN MoMo";
  if (prefix === "95" || prefix === "75") return "Zamtel Kwacha";
  return "unknown";
}

function NetworkHint({ phone, remembered }: { phone: string; remembered: boolean }) {
  const network = networkFor(phone);
  if (network === "unknown") {
    return <span className="text-destructive">This doesn't look like an Airtel, MTN or Zamtel number.</span>;
  }
  if (network) {
    return (
      <span className="font-medium text-emerald-700">
        ✓ {network}
        {remembered && <span className="font-normal text-muted-foreground"> · the number you used last time</span>}
      </span>
    );
  }
  return <>Airtel, MTN or Zamtel.</>;
}

/** "Have a promo code?" right on the payment screen. */
function PayPromo({ applied, onApply }: { applied: string | undefined; onApply: (code: string | undefined) => void }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  if (applied) {
    return (
      <p className="mt-3 flex items-center gap-2 text-sm">
        <Check className="size-4 text-emerald-600" />
        <span>
          <span className="font-semibold">{applied}</span> applied: {promoPercent(applied)}% off
        </span>
        <button type="button" onClick={() => onApply(undefined)} className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Remove
        </button>
      </p>
    );
  }
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-3 text-sm font-medium underline underline-offset-4">
        Have a promo code?
      </button>
    );
  }
  const apply = () => {
    if (promoPercent(code)) onApply(code.trim().toUpperCase());
    else setError(true);
  };
  return (
    <div className="mt-3 animate-in fade-in duration-200">
      <div className="flex gap-2">
        <input
          autoFocus
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError(false);
          }}
          onKeyDown={(event) => {
            // Enter applies the code instead of submitting the payment form.
            if (event.key === "Enter") {
              event.preventDefault();
              apply();
            }
          }}
          aria-label="Promo code"
          aria-invalid={error}
          placeholder="Promo code"
          autoCapitalize="characters"
          className="h-11 min-w-0 flex-1 rounded-md border-2 bg-background px-3 text-base uppercase outline-none focus:border-foreground md:text-sm"
        />
        <button type="button" onClick={apply} className={`shrink-0 rounded-md bg-foreground px-4 text-sm font-semibold text-background ${press}`}>
          Apply
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">That code isn't valid. Check the spelling and try again.</p>}
    </div>
  );
}

/* ───────────── International: talk to our team, invoiced later ───────────── */

const countryCodes = [
  { code: "+260", name: "Zambia", flag: "🇿🇲" },
  { code: "+263", name: "Zimbabwe", flag: "🇿🇼" },
  { code: "+265", name: "Malawi", flag: "🇲🇼" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+267", name: "Botswana", flag: "🇧🇼" },
  { code: "+243", name: "DR Congo", flag: "🇨🇩" },
  { code: "+255", name: "Tanzania", flag: "🇹🇿" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
] as const;

const budgets = ["Under K1,500", "K1,500 – K2,500", "K2,500 – K4,000", "Over K4,000"];

/** The next 12 months, e.g. "Jan 2027", plus "I'm already here". */
function arrivalOptions() {
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(now.getFullYear(), now.getMonth() + i, 1).toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
  );
  return ["I'm already here", ...months];
}

// DEMO: requests are kept in this browser only. They belong in a database table for the team.
function saveIntlRequest(request: IntlRequest) {
  try {
    const key = "instayhomes-intl-requests";
    const list = JSON.parse(window.localStorage.getItem(key) ?? "[]") as IntlRequest[];
    window.localStorage.setItem(key, JSON.stringify([...list, request]));
  } catch {
    // Storage blocked: the WhatsApp message still carries everything the team needs.
  }
}

/** One question at a time: each answer reveals the next, so the form never feels long. */
function IntlRequestForm({
  room,
  user,
  onSwitchToLocal,
  onSent,
}: {
  room: Room | null;
  user: PlusUser;
  onSwitchToLocal: () => void;
  onSent: (request: IntlRequest) => void;
}) {
  const [country, setCountry] = useState<string>("");
  const [number, setNumber] = useState("");
  const [university, setUniversity] = useState("");
  const [arriving, setArriving] = useState("");
  const [budget, setBudget] = useState("");
  const [sending, setSending] = useState(false);

  const numberDone = country !== "" && number.replace(/\D/g, "").length >= 7;
  const local = country === "+260";
  const step = !numberDone ? 1 : !university ? 2 : !arriving ? 3 : !budget ? 4 : 5;

  const send = () => {
    setSending(true);
    const request: IntlRequest = {
      reference: `IH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      whatsapp: `${country} ${number.trim()}`,
      university,
      arriving,
      budget,
      roomName: room?.shortName ?? null,
    };
    saveIntlRequest(request);
    window.setTimeout(() => onSent(request), 500);
  };

  const row = "px-4 py-3";
  const rowLabel = "block text-xs font-semibold";
  const trigger = "mt-1 h-auto border-0 p-0 text-base shadow-none focus:ring-0 focus:ring-offset-0 [&>span]:truncate";

  return (
    <div className="mt-6">
      {/* Airbnb-style grouped fields: one bordered block, rows separated by lines. */}
      <div className="overflow-hidden rounded-xl border-2 divide-y">
        <div className={row}>
          <span className={rowLabel}>WhatsApp number</span>
          <div className="mt-1 flex items-center gap-2">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger aria-label="Country code" className="h-auto w-auto shrink-0 gap-1 border-0 p-0 text-base shadow-none focus:ring-0 focus:ring-offset-0 [&_[data-name]]:hidden">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="flex items-center gap-2">
                      {c.flag} {c.code} <span className="text-muted-foreground" data-name>{c.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="h-5 w-px bg-border" aria-hidden />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={number}
              onChange={(event) => setNumber(event.target.value)}
              placeholder="Your number"
              aria-label="WhatsApp number"
              className="min-w-0 flex-1 bg-transparent text-base outline-none"
            />
          </div>
        </div>

        {step >= 2 && (
          <div className={`${row} animate-in fade-in slide-in-from-top-1 duration-200 ease-out`}>
            <span className={rowLabel}>University</span>
            <Select value={university} onValueChange={setUniversity}>
              <SelectTrigger aria-label="University" className={trigger}>
                <SelectValue placeholder="Where will you study?" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((u) => (
                  <SelectItem key={u.id} value={u.name}>
                    {u.name}
                  </SelectItem>
                ))}
                <SelectItem value="Other">Another university</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {step >= 3 && (
          <div className={`${row} animate-in fade-in slide-in-from-top-1 duration-200 ease-out`}>
            <span className={rowLabel}>Arriving</span>
            <Select value={arriving} onValueChange={setArriving}>
              <SelectTrigger aria-label="Arriving" className={trigger}>
                <SelectValue placeholder="When do you arrive?" />
              </SelectTrigger>
              <SelectContent>
                {arrivalOptions().map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {step >= 4 && (
          <div className={`${row} animate-in fade-in slide-in-from-top-1 duration-200 ease-out`}>
            <span className={rowLabel}>Monthly budget</span>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger aria-label="Monthly budget" className={trigger}>
                <SelectValue placeholder="How much can you spend on rent?" />
              </SelectTrigger>
              <SelectContent>
                {budgets.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Already in Zambia: self-service with mobile money is quicker for them and for the team. */}
      {local && (
        <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 animate-in fade-in duration-200">
          <p>
            <span className="font-semibold">Already in Zambia?</span> Assisted gives you instant access to every landlord, paid with mobile
            money. No waiting for our team.
          </p>
          <button
            type="button"
            onClick={onSwitchToLocal}
            className={`mt-2.5 w-full rounded-md border border-amber-300 bg-white px-4 py-2.5 font-semibold text-foreground ${press}`}
          >
            Switch to Assisted · K399
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="mt-5 animate-in fade-in slide-in-from-bottom-1 duration-200 ease-out">
          <button
            type="button"
            onClick={send}
            disabled={sending}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3.5 text-base font-semibold ${press} ${
              local ? "border-2 bg-background hover:bg-muted" : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {sending && <Loader2 className="size-5 animate-spin" />} Send to our team
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">No payment now. Details also go to {user.email}.</p>
        </div>
      )}
    </div>
  );
}

function IntlRequestReceived({ request, user, returnTo }: { request: IntlRequest; user: PlusUser | null; returnTo: string }) {
  const firstName = user?.name.trim().split(/\s+/)[0] ?? "";
  const message = [
    `Hi Instayhomes! I'd like help finding a home. Ref ${request.reference}.`,
    request.roomName ? `I'm interested in ${request.roomName}.` : null,
    `University: ${request.university}. Arriving: ${request.arriving}. Budget: ${request.budget}.`,
  ]
    .filter(Boolean)
    .join(" ");
  const link = whatsappLink({ phone: teamWhatsApp, message });
  const summary = [request.roomName, request.university, request.arriving].filter(Boolean).join(" · ");

  return (
    <div className="mx-auto max-w-md pt-6 text-center animate-in fade-in zoom-in-95 duration-300 ease-out">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
        <Check className="size-8" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{firstName ? `Thanks, ${firstName}` : "Request sent"}</h1>
      <p className="mt-2 text-base text-muted-foreground">Message us on WhatsApp to get started. We reply {teamReplyTime}.</p>
      <p className="mt-3 inline-block rounded-md bg-muted px-2.5 py-1 font-mono text-sm tracking-wide">{request.reference}</p>

      <a href={link} target="_blank" rel="noopener noreferrer" className={`mt-6 w-full py-3.5 text-base ${whatsappButton}`}>
        <WhatsAppIcon className="size-5" /> Message us now
      </a>

      <ol className="mt-8 space-y-4 text-left">
        <li className="flex gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check className="size-3.5" />
          </span>
          <p className="text-sm">
            <span className="block font-semibold">You told us about your move</span>
            <span className="text-muted-foreground">{summary}</span>
          </p>
        </li>
        <li className="flex gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold">2</span>
          <p className="text-sm">
            <span className="block font-semibold">We help you choose</span>
            <span className="text-muted-foreground">Shortlist, viewings and questions for landlords</span>
          </p>
        </li>
        <li className="flex gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold">3</span>
          <p className="text-sm font-semibold">You pick a home, we send the invoice</p>
        </li>
      </ol>

      <Link to={returnTo} className={`mt-8 flex w-full justify-center rounded-md border-2 px-5 py-3 text-sm font-semibold hover:bg-muted ${press}`}>
        Back to the listing
      </Link>
    </div>
  );
}
