// Tenant Protection: the wording lives here once. The home page shows it as a section; every other
// page opens it in a red sheet (phones) or window (desktop) so nobody has to leave what they're doing.
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export const protectionPerks = [
  ["Covered if plans fall through", "If your landlord cancels late or delays your move-in, we help you find a new place or cover a short hotel stay."],
  ["Help when you need it", "Something wrong with your rental? Our support team steps in quickly."],
  ["Move in worry-free", "Your payment is held until you move in. If the home isn't as described, you get your money back."],
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

  const body = (
    <>
      <ProtectionPerks />
      <img
        src={protectionImage}
        alt="Happy tenants at home"
        className="mt-6 aspect-[16/9] w-full rounded-lg object-cover md:aspect-[4/3]"
      />
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        className="mt-6 w-full rounded-md bg-primary-foreground px-5 py-3.5 text-base font-semibold text-primary transition-[scale,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
      >
        Got it
      </button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
        <DrawerContent className="max-h-[90dvh] border-primary bg-primary text-primary-foreground [&>div:first-child]:bg-primary-foreground/40">
          <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
            <DrawerTitle className="font-display text-5xl font-normal leading-none">
              TENANT
              <br />
              PROTECTION
            </DrawerTitle>
            <DrawerDescription className="sr-only">{description}</DrawerDescription>
            <div className="mt-7">{body}</div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto border-primary bg-primary p-8 text-primary-foreground [&>button:last-child]:text-primary-foreground [&>button:last-child]:opacity-80">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div>
            <DialogTitle className="font-display text-6xl font-normal leading-none">
              TENANT
              <br />
              PROTECTION
            </DialogTitle>
            <DialogDescription className="sr-only">{description}</DialogDescription>
            <div className="mt-8">
              <ProtectionPerks />
            </div>
          </div>
          <div>
            <img src={protectionImage} alt="Happy tenants at home" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-6 w-full rounded-md bg-primary-foreground px-5 py-3.5 text-base font-semibold text-primary transition-[scale,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
            >
              Got it
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

