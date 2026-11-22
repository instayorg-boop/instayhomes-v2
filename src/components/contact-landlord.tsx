// Contact flow: browsing is free; chatting with a landlord on WhatsApp needs Nestaway Plus.
//   subscribed  → open WhatsApp with a ready-to-send message (one tap)
//   not yet     → upgrade sheet → after paying, continue straight to the same chat
import { Check, Lock, MessageCircle } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

const press = "transition-[scale,background-color,border-color,color] duration-150 ease-out active:scale-[0.97]";

/** WhatsApp-green action, darker than the logo green so white text stays readable. */
export const whatsappButton = `inline-flex items-center justify-center gap-2 rounded-md bg-[#128C4A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F7A40] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground ${press}`;

// PLACEHOLDER pricing: replace with the real plans before launch.
const plans = [
  { id: "month", label: "1 month", price: 19, note: "" },
  { id: "quarter", label: "3 months", price: 39, note: "Best value" },
] as const;

const benefits = ["Chat with landlords directly on WhatsApp", "Contact as many homes as you like", "Every home is tenant verified"];

export type ContactTarget = { message: string; phone: string };

export function whatsappLink({ message, phone }: ContactTarget) {
  const digits = phone.replace(/\D/g, "");
  // With no number on file, wa.me without a number lets the user pick the chat themselves.
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(target: ContactTarget) {
  window.open(whatsappLink(target), "_blank", "noopener,noreferrer");
}

// DEMO subscription state, in memory (resets on reload). Replace with the real
// subscription check from your auth/billing backend.
const PlusContext = createContext<{ plus: boolean; setPlus: (value: boolean) => void } | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [plus, setPlus] = useState(false);
  const [pending, setPending] = useState<ContactTarget | null>(null);
  return (
    <PlusContext.Provider value={{ plus, setPlus }}>
      <PendingContext.Provider value={setPending}>
        {children}
        <UpgradeSheet target={pending} onClose={() => setPending(null)} onSubscribed={() => setPlus(true)} />
      </PendingContext.Provider>
    </PlusContext.Provider>
  );
}

const PendingContext = createContext<((target: ContactTarget) => void) | null>(null);

export function useContactLandlord() {
  const plusState = useContext(PlusContext);
  const showUpgrade = useContext(PendingContext);
  if (!plusState || !showUpgrade) throw new Error("useContactLandlord needs <ContactProvider>");
  return {
    plus: plusState.plus,
    contact: (target: ContactTarget) => (plusState.plus ? openWhatsApp(target) : showUpgrade(target)),
  };
}

/** Under the main button: says up front that contact is a Plus feature, so the sheet is never a surprise. */
export function PlusHint({ className = "", short = false }: { className?: string; short?: boolean }) {
  const { plus } = useContactLandlord();
  if (plus) return <p className={`text-xs text-muted-foreground ${className}`}>{short ? "Opens WhatsApp" : "Opens WhatsApp with your message ready."}</p>;
  return (
    <p className={`flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground ${className}`}>
      <Lock className="size-3 shrink-0" /> {short ? "With Nestaway Plus" : "Included with Nestaway Plus"}
    </p>
  );
}

function UpgradeSheet({
  target,
  onClose,
  onSubscribed,
}: {
  target: ContactTarget | null;
  onClose: () => void;
  onSubscribed: () => void;
}) {
  const isMobile = useIsMobile();
  const [plan, setPlan] = useState<(typeof plans)[number]["id"]>("quarter");
  const [done, setDone] = useState(false);
  const open = target !== null;
  const chosen = plans.find((p) => p.id === plan)!;

  const close = () => {
    onClose();
    window.setTimeout(() => setDone(false), 300);
  };

  // DEMO checkout: marks the user as subscribed. Hook the real payment here.
  const subscribe = () => {
    onSubscribed();
    setDone(true);
  };

  const title = done ? "You're in" : "Chat with the landlord";
  const description = done
    ? "Your message is ready. Send it on WhatsApp and the landlord will reply there."
    : "Get Nestaway Plus to message landlords directly on WhatsApp.";

  const body = done ? (
    <div className="animate-in fade-in zoom-in-95 duration-300 ease-out">
      {target && (
        <p className="rounded-lg bg-muted p-3 text-sm leading-6">“{target.message}”</p>
      )}
      <a
        href={target ? whatsappLink(target) : "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={close}
        className={`mt-4 w-full ${whatsappButton}`}
      >
        <MessageCircle className="size-4" /> Open WhatsApp
      </a>
    </div>
  ) : (
    <div>
      <ul className="space-y-2.5">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" /> {benefit}
          </li>
        ))}
      </ul>
      <div role="radiogroup" aria-label="Choose a plan" className="mt-5 grid grid-cols-2 gap-2">
        {plans.map((option) => {
          const active = option.id === plan;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setPlan(option.id)}
              className={`relative rounded-xl border-2 p-3 text-left ${press} ${active ? "border-foreground" : "border-border hover:border-foreground/30"}`}
            >
              {option.note && (
                <span className="absolute -top-2.5 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  {option.note}
                </span>
              )}
              <span className="block text-sm font-medium">{option.label}</span>
              <span className="mt-0.5 block text-lg font-bold tabular-nums">€{option.price}</span>
            </button>
          );
        })}
      </div>
      <button type="button" onClick={subscribe} className={`mt-5 w-full rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 ${press}`}>
        Get Plus · €{chosen.price}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">Then you'll go straight to the chat.</p>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(next) => !next && close()} shouldScaleBackground={false}>
        <DrawerContent className="max-h-[92dvh]">
          <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <DrawerTitle className="text-lg font-bold">{title}</DrawerTitle>
            <DrawerDescription className="mb-5 mt-1 text-sm text-muted-foreground">{description}</DrawerDescription>
            {body}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent className="max-w-md">
        <div>
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">{description}</DialogDescription>
        </div>
        {body}
      </DialogContent>
    </Dialog>
  );
}
