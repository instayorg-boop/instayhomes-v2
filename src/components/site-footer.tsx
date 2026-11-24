import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Footer labels that have a page. Everything else is still a placeholder link. */
const pages: Record<string, "/about" | "/help" | "/blog"> = {
  About: "/about",
  "About us": "/about",
  Help: "/help",
  "Help centre": "/help",
  "Help Center": "/help",
  "Contact us": "/help",
  Blog: "/blog",
  Guides: "/blog",
  "Rental guides": "/blog",
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
  const to = pages[label];
  if (to) {
    return (
      <Link to={to} className={className}>
        {children ?? label}
      </Link>
    );
  }
  return (
    <a href="#" className={className}>
      {children ?? label}
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
