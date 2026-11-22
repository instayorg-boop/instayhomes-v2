// Contact flow: browsing is free; chatting with a landlord on WhatsApp needs Instayhomes Plus.
//   has a plan → open WhatsApp with a ready-to-send message (one tap)
//   no plan    → /plans, remembering the page and room they came from, then straight on to the chat
import { useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { usePlus } from "@/lib/plus";

const press = "transition-[scale,background-color,border-color,color] duration-150 ease-out active:scale-[0.97]";

/** WhatsApp-green action, darker than the logo green so white text stays readable. */
export const whatsappButton = `inline-flex items-center justify-center gap-2 rounded-md bg-[#128C4A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F7A40] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground ${press}`;

export type ContactTarget = { message: string; phone: string; roomId?: string | undefined };

export function whatsappLink({ message, phone }: ContactTarget) {
  const digits = phone.replace(/\D/g, "");
  // With no number on file, wa.me without a number lets the user pick the chat themselves.
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function useContactLandlord() {
  const plan = usePlus();
  const navigate = useNavigate();
  return {
    plan,
    contact: (target: ContactTarget) => {
      if (plan) {
        window.open(whatsappLink(target), "_blank", "noopener,noreferrer");
        return;
      }
      void navigate({
        to: "/plans",
        search: { from: window.location.pathname + window.location.search, room: target.roomId },
      });
    },
  };
}

/** Under the main button: says up front that contact is a Plus feature, so the payment step is no surprise. */
export function PlusHint({ className = "", short = false }: { className?: string; short?: boolean }) {
  const plan = usePlus();
  if (plan) return <p className={`text-xs text-muted-foreground ${className}`}>{short ? "Opens WhatsApp" : "Opens WhatsApp with your message ready."}</p>;
  return (
    <p className={`flex items-center gap-1 text-xs text-muted-foreground ${short ? "whitespace-nowrap" : ""} ${className}`}>
      <Lock className="size-3 shrink-0" /> {short ? "With Instayhomes Plus" : "One Plus payment unlocks every landlord"}
    </p>
  );
}
