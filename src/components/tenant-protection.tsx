// Tenant Protection: the wording lives here once. The home page shows it as a section; every other
// page opens it in a red sheet (phones) or window (desktop) so nobody has to leave what they're doing.
import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export const protectionPerks = [
  // The Terms (src/lib/legal.ts), Help and home page answers promise the same: within 30 days of
  // access, the student chooses a full refund or free unlock credit; landlords honour the listed
  // rent, deposit and move-in date; dishonest landlords are banned.
  [
    "Guaranteed access-fee refund",
    "If a listing is fake, already taken, or not as advertised, you're eligible for a full refund or free unlock credit. No stress.",
  ],
  [
    "Verified landlords and real places",
    "We vet every landlord and check property photos before a listing goes live.",
  ],
  [
    "No hidden price hikes",
    "Landlords must honour the rent, deposit and move-in date shown on the listing.",
  ],
  [
    "Support when things go wrong",
    "We keep a record of the landlords you contact, flag unfair lease terms, and ban dishonest landlords.",
  ],
] as const;

export const protectionImage =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=70";

export function ProtectionPerks() {
  return (
    <ul className="space-y-5">
      {protectionPerks.map(([title, body]) => (
        <li key={title} className="flex gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm opacity-90">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A "Covered by Tenant Protection" link that opens the red sheet in place. */
export function TenantProtectionLink({ className = "", children }: { className?: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children ?? (
          <>
            <ShieldCheck className="size-4" /> Covered by Tenant Protection
          </>
        )}
      </button>
      <TenantProtectionSheet open={open} onOpenChange={setOpen} />
    </>
  );
}

export function TenantProtectionSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const isMobile = useIsMobile();
  const description = "What Instayhomes does for you if something goes wrong with your rental.";

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
        <DrawerContent className="max-h-[90dvh] overflow-hidden border-primary bg-primary text-primary-foreground [&>div:first-child]:bg-primary-foreground/40">
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-primary-foreground/80 transition-[scale,color] duration-150 ease-out hover:text-primary-foreground active:scale-90"
          >
            <X className="size-5" />
          </button>
          <div className="overflow-y-auto overscroll-contain">
            <div className="px-5 pt-5">
              <DrawerTitle className="text-[44px] font-extrabold uppercase leading-[0.92] tracking-[-0.06em]">
                TENANT
                <br />
                PROTECTION
              </DrawerTitle>
              <DrawerDescription className="sr-only">{description}</DrawerDescription>
              <div className="mt-7">
                <ProtectionPerks />
              </div>
            </div>
            {/* Photo at the bottom, edge to edge, fading up into the red. */}
            <div className="relative mt-4 h-64">
              <img src={protectionImage} alt="Happy tenants at home" className="absolute inset-0 size-full object-cover object-[center_25%]" />
              {/* Short fade: only the top edge melts into the red, so the people stay clear. */}
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-primary to-transparent" aria-hidden />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-3xl gap-0 overflow-hidden border-primary bg-primary p-0 text-primary-foreground sm:rounded-xl [&>button:last-child]:z-10 [&>button:last-child]:rounded-full [&>button:last-child]:bg-black/30 [&>button:last-child]:p-1.5 [&>button:last-child]:text-white [&>button:last-child]:opacity-100 [&>button:last-child]:backdrop-blur-sm">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:py-10">
            <DialogTitle className="text-[60px] font-extrabold uppercase leading-[0.92] tracking-[-0.06em]">
              TENANT
              <br />
              PROTECTION
            </DialogTitle>
            <DialogDescription className="sr-only">{description}</DialogDescription>
            <div className="mt-8">
              <ProtectionPerks />
            </div>
          </div>
          {/* Photo fills the right half top to bottom, fading into the red from the left. */}
          <div className="relative min-h-64">
            <img src={protectionImage} alt="Happy tenants at home" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/30 to-transparent" aria-hidden />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
