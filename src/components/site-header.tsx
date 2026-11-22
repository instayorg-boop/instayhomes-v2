import { Link } from "@tanstack/react-router";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = ["How it works", "Pricing", "Help", "Log in", "Sign up"];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <>
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-12">
          <Link to="/" aria-label="Instayhomes home" className="font-display text-2xl tracking-wide text-primary">
            INSTAYHOMES
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-1 text-sm font-medium">
            {navItems.map((item) => (
              <a key={item} href="#" className="hidden rounded-md px-3 py-2 hover:bg-muted lg:block">
                {item}
              </a>
            ))}
            <a href="#" className="hidden rounded-md border border-foreground/30 px-3 py-2 sm:block">
              I&apos;m a landlord
            </a>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="ml-1 rounded-md p-2 transition-[scale,background-color] duration-150 ease-out hover:bg-muted active:scale-95"
            >
              <Menu className="size-5" />
            </button>
          </nav>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-foreground/40 animate-in fade-in duration-300 ease-out"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-background p-6 shadow-soft animate-in slide-in-from-right duration-300 ease-drawer">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-primary">INSTAYHOMES</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="rounded-md p-2 hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Menu navigation" className="mt-8 flex flex-col gap-1 font-medium">
              {[...navItems, "I'm a landlord"].map((item) => (
                <a key={item} href="#" className="rounded-md px-3 py-3 hover:bg-muted">
                  {item}
                </a>
              ))}
            </nav>
            <div className="mt-auto border-t pt-4">
              <button
                type="button"
                onClick={() => setLanguage((current) => (current === "English" ? "Deutsch" : "English"))}
                className="flex w-full items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-muted"
              >
                <Globe className="size-5" /> Language: {language}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
