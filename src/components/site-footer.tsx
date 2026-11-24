import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { TenantProtectionLink } from "@/components/tenant-protection";
import { openHowItWorks } from "@/components/welcome-stories";

/** Footer labels that have a page. Everything else is still a placeholder link. */
const pages: Record<string, "/about" | "/help" | "/blog" | "/terms" | "/privacy" | "/landlords"> = {
  About: "/about",
  "About us": "/about",
  Help: "/help",
  "Help centre": "/help",
  "Help Center": "/help",
  "Contact us": "/help",
  Blog: "/blog",
  Guides: "/blog",
  "Rental guides": "/blog",
  Terms: "/terms",
  "Terms of use": "/terms",
  Privacy: "/privacy",
  "Privacy policy": "/privacy",
  "List your property": "/landlords",
  "I'm a landlord": "/landlords",
};

/** A footer link by its label: a real page when there is one, otherwise "#". */
export function FooterLink({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  const text = children ?? label;
  if (label === "Pricing") {
    return (
      <Link to="/plans" search={{ view: "plans" }} className={className}>
        {text}
      </Link>
    );
  }
  if (label === "Tenant Protection") {
    return <TenantProtectionLink className={className ?? ""}>{text}</TenantProtectionLink>;
  }
  if (label === "How it works") {
    return (
      <a
        href="#"
        onClick={(event) => {
          event.preventDefault();
          openHowItWorks();
        }}
        className={className}
      >
        {text}
      </a>
    );
  }
  const to = pages[label];
  if (to) {
    return (
      <Link to={to} className={className}>
        {text}
      </Link>
    );
  }
  return (
    <a href="#" className={className}>
      {text}
    </a>
  );
}

/** The short footer used on the About, Help and Guides pages. */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 text-sm text-muted-foreground sm:px-12">
        <span>© {new Date().getFullYear()} Instayhomes</span>
        {["About", "Help", "Guides", "Terms", "Privacy"].map((label) => (
          <FooterLink key={label} label={label} className="hover:text-foreground hover:underline" />
        ))}
      </div>
    </footer>
  );
}
