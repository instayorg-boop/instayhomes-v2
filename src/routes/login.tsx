import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Loader2, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { GoogleIcon } from "@/components/google-icon";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { findAccount, safeReturnPath, saveAccount, setPlusUser, type PlusUser } from "@/lib/plus";
import { universities } from "@/lib/universities";
import { heroImage, rooms } from "./listing";

// One page for logging in and signing up, with no passwords: Google, or email + 6-digit code.
// New students give their name (university optional); returning students go straight back to the
// page they came from. DEMO: no email is sent and any 6 digits work; real accounts need the
// auth backend (e.g. Supabase email OTP + Google), switched on in Lovable.
type LoginSearch = { from?: string | undefined; room?: string | undefined };
const str = (value: unknown) => (typeof value === "string" ? value : undefined);

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    from: str(search["from"]),
    room: str(search["room"]),
  }),
  head: () => ({
    meta: [
      { title: "Log in or sign up | Instayhomes" },
      { name: "description", content: "Log in or sign up to Instayhomes with Google or your email. No password needed." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

type Step = "start" | "code" | "name" | "welcome";
const press = "transition-[scale,background-color,border-color,opacity] duration-150 ease-out active:scale-[0.98]";
const shortUnis = ["UNZA", "CBU", "UNILUS", "MU", "CUZ", "ZCAS"];
const RESEND_SECONDS = 30;

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const returnTo = safeReturnPath(search.from);
  const room = rooms.find((r) => r.id === search.room) ?? null;

  const [step, setStep] = useState<Step>("start");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<PlusUser | null>(null);

  const finish = (signedIn: PlusUser) => {
    saveAccount(signedIn);
    setPlusUser(signedIn);
    setUser(signedIn);
    setStep("welcome");
  };

  // After the welcome, go back to where they were.
  useEffect(() => {
    if (step !== "welcome") return;
    const timer = window.setTimeout(() => void navigate({ to: returnTo, replace: true }), 1400);
    return () => window.clearTimeout(timer);
  }, [step, navigate, returnTo]);

  const backTo: Record<Step, Step | null> = { start: null, code: "start", name: "code", welcome: null };
  const titles: Record<Step, string> = { start: "Log in or sign up", code: "Confirm your email", name: "Finish signing up", welcome: "Instayhomes" };

  return (
    <div className="grid min-h-svh bg-background text-foreground lg:grid-cols-2">
      {/* Desktop: room photo with the promise; phones go straight to the form. */}
      <aside className="relative hidden overflow-hidden lg:block">
        <img src={room?.images[0]?.src ?? heroImage} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-black/75" aria-hidden />
        <Link to="/" className="absolute left-8 top-7 font-display text-2xl tracking-wide text-white">
          INSTAYHOMES
        </Link>
        <div className="absolute inset-x-8 bottom-8 text-white">
          <p className="font-display text-5xl leading-[0.95]">
            YOUR NEXT HOME
            <br />
            IS ONE CHAT AWAY
          </p>
          <p className="mt-3 max-w-md text-base opacity-90">Verified landlords, real photos, and Tenant Protection on every plan.</p>
        </div>
      </aside>

      <main className="flex flex-col">
        <header className="relative flex h-14 items-center justify-center border-b px-4 text-sm font-semibold lg:border-0">
          {backTo[step] ? (
            <button type="button" onClick={() => setStep(backTo[step]!)} aria-label="Back" className={`absolute left-2 rounded-full p-2 hover:bg-muted ${press}`}>
              <ArrowLeft className="size-5" />
            </button>
          ) : (
            <Link to={returnTo} aria-label="Close" className={`absolute left-2 rounded-full p-2 hover:bg-muted ${press}`}>
              <X className="size-5" />
            </Link>
          )}
          <span className="lg:hidden">{titles[step]}</span>
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 lg:justify-center lg:pt-0">
          <div key={step} className="flex flex-1 flex-col animate-in fade-in slide-in-from-right-2 duration-200 ease-out lg:flex-none">
            {step === "start" && (
              <StartStep
                room={room}
                onEmail={(value) => {
                  setEmail(value);
                  setStep("code");
                }}
                onGoogle={finish}
              />
            )}
            {step === "code" && (
              <CodeStep
                email={email}
                onChangeEmail={() => setStep("start")}
                onVerified={() => {
                  const existing = findAccount(email);
                  if (existing) finish(existing);
                  else setStep("name");
                }}
              />
            )}
            {step === "name" && <NameStep email={email} onDone={finish} />}
            {step === "welcome" && user && <WelcomeStep user={user} room={room} returnTo={returnTo} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function StartStep({ room, onEmail, onGoogle }: { room: Room | null; onEmail: (email: string) => void; onGoogle: (user: PlusUser) => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<"google" | "email" | null>(null);

  // DEMO "Continue with Google": the real one redirects to Google and back to this page.
  const google = () => {
    setBusy("google");
    window.setTimeout(() => onGoogle(findAccount("mwila.banda@example.com") ?? { name: "Mwila Banda", email: "mwila.banda@example.com" }), 900);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy("email");
    window.setTimeout(() => onEmail(email.trim()), 600);
  };

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
        <span className="lg:hidden">Welcome to Instayhomes</span>
        <span className="hidden lg:inline">Log in or sign up</span>
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">No password needed.</p>

      {room && (
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-muted p-3">
          {room.images[0] && <img src={room.images[0].src} alt="" className="size-11 shrink-0 rounded-lg object-cover" />}
          <div className="min-w-0 text-sm">
            <p className="text-xs text-muted-foreground">Log in to message the landlord of</p>
            <p className="truncate font-semibold">{room.shortName} · K{room.price.toLocaleString("en")}/month</p>
          </div>
        </div>
      )}

      <button type="button" onClick={google} disabled={busy !== null} className={`mt-6 inline-flex w-full items-center justify-center gap-3 rounded-lg border-2 border-foreground px-5 py-3.5 text-base font-semibold hover:bg-muted disabled:opacity-60 ${press}`}>
        {busy === "google" ? <Loader2 className="size-5 animate-spin" /> : <GoogleIcon />}
        {busy === "google" ? "Signing in…" : "Continue with Google"}
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">or</div>

      <form onSubmit={submit} className="space-y-4">
        <label className="block rounded-lg border-2 px-4 pb-2.5 pt-2 focus-within:border-foreground">
          <span className="block text-xs font-semibold text-muted-foreground">Email</span>
          <input
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent text-base outline-none"
          />
        </label>
        <button type="submit" disabled={busy !== null} className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 ${press}`}>
          {busy === "email" && <Loader2 className="size-5 animate-spin" />} Continue
        </button>
      </form>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        We'll email you a 6-digit code to log in. By continuing you agree to our{" "}
        <Link to="/terms" className="font-medium text-foreground underline underline-offset-2">Terms</Link> and{" "}
        <Link to="/privacy" className="font-medium text-foreground underline underline-offset-2">Privacy Policy</Link>.
      </p>

      <div className="mt-auto pt-10 lg:mt-10 lg:pt-0">
        <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          Are you a landlord?
        </div>
        <Link to="/landlords" className={`flex w-full justify-center rounded-lg border-2 px-5 py-3 text-sm font-semibold hover:bg-muted ${press}`}>
          List your property
        </Link>
      </div>
    </>
  );
}

function CodeStep({ email, onChangeEmail, onVerified }: { email: string; onChangeEmail: () => void; onVerified: () => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  // Logs in by itself once the 6th digit is in.
  const verify = (value: string) => {
    if (value.length !== 6 || busy) return;
    setBusy(true);
    window.setTimeout(onVerified, 700);
  };

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Enter your code</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>.
      </p>

      <div className="mt-6">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) => {
            const digits = value.replace(/\D/g, "");
            setCode(digits);
            verify(digits);
          }}
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          containerClassName="w-full"
          aria-label="6-digit code"
        >
          <InputOTPGroup className="grid w-full grid-cols-6 gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <InputOTPSlot key={i} index={i} className="aspect-[4/5] h-auto w-full rounded-lg border-2 text-xl font-bold first:rounded-lg last:rounded-lg" />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{busy ? "Checking…" : "Didn't get it? Check spam."}</span>
        {wait > 0 ? (
          <span className="text-muted-foreground tabular-nums">Resend in 0:{String(wait).padStart(2, "0")}</span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setWait(RESEND_SECONDS);
              setResent(true);
            }}
            className="font-semibold underline underline-offset-4"
          >
            {resent ? "Send again" : "Resend code"}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => verify(code)}
        disabled={code.length !== 6 || busy}
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3.5 text-base font-semibold text-background disabled:opacity-30 ${press}`}
      >
        {busy && <Loader2 className="size-5 animate-spin" />} Continue
      </button>
      <button type="button" onClick={onChangeEmail} className="mt-4 text-center text-sm font-medium underline underline-offset-4">
        Use a different email
      </button>
    </>
  );
}

function NameStep({ email, onDone }: { email: string; onDone: (user: PlusUser) => void }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [uni, setUni] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const university = universities.find((u) => u.short === uni)?.name ?? (uni === "Other" ? "Other" : undefined);
    window.setTimeout(() => onDone({ name: `${first.trim()} ${last.trim()}`.trim(), email, university }), 500);
  };

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col lg:flex-none">
      <p className="flex w-fit items-center gap-2 rounded-lg bg-emerald-600/10 px-3 py-2 text-sm font-medium text-emerald-700">
        <Check className="size-4" /> Email confirmed
      </p>
      <h1 className="mt-5 text-2xl font-bold tracking-tight lg:text-3xl">What should we call you?</h1>

      <div className="mt-5 space-y-3">
        <Field label="First name">
          <input required autoFocus autoComplete="given-name" value={first} onChange={(e) => setFirst(e.target.value)} className="w-full bg-transparent text-base outline-none" />
        </Field>
        <Field label="Last name">
          <input required autoComplete="family-name" value={last} onChange={(e) => setLast(e.target.value)} className="w-full bg-transparent text-base outline-none" />
        </Field>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">
          Where do you study? <span className="font-normal text-muted-foreground">(optional)</span>
        </legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {[...shortUnis, "Other"].map((short) => {
            const on = uni === short;
            return (
              <button
                key={short}
                type="button"
                aria-pressed={on}
                onClick={() => setUni(on ? undefined : short)}
                className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-medium ${press} ${on ? "border-foreground bg-foreground text-background" : "hover:border-foreground/40"}`}
              >
                {short}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-auto pt-8 lg:mt-8 lg:pt-0">
        <button type="submit" disabled={busy} className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 ${press}`}>
          {busy && <Loader2 className="size-5 animate-spin" />} Create my account
        </button>
        <p className="mt-2 text-center text-xs text-muted-foreground">Your name is shared with landlords you message.</p>
      </div>
    </form>
  );
}

function WelcomeStep({ user, room, returnTo }: { user: PlusUser; room: Room | null; returnTo: string }) {
  const firstName = user.name.trim().split(/\s+/)[0] || "there";
  const destination = room ? room.shortName : returnTo === "/" ? "the home page" : "where you were";
  return (
    <div className="flex flex-col items-center pt-10 text-center animate-in fade-in zoom-in-95 duration-300 ease-out lg:pt-0" aria-live="polite">
      <span className="flex size-16 items-center justify-center rounded-full bg-foreground text-2xl font-bold text-background">
        {firstName.charAt(0).toUpperCase()}
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight lg:text-3xl">Welcome, {firstName}</h1>
      <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Taking you back to {destination}…
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block rounded-lg border-2 px-4 pb-2.5 pt-2 focus-within:border-foreground">
      <span className="block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

type Room = (typeof rooms)[number];
