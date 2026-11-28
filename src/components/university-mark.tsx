import { useEffect, useRef, useState } from "react";
import type { University } from "@/lib/universities";

const fallbackColors = ["bg-primary text-primary-foreground", "bg-foreground text-background", "bg-stat text-foreground"];

/** A university's logo from its own site, or its short name when there's no logo or it fails to load. */
export function UniversityMark({
  university,
  size,
  index = 0,
}: {
  university: University;
  size: "tile" | "chip";
  index?: number;
}) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const showLogo = university.logo && !failed;

  // A logo can fail before the page becomes interactive, when onError isn't listening yet.
  // Check once on mount so those still fall back to the short name.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (size === "chip") {
    return showLogo ? (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-white p-1">
        <img ref={img} src={university.logo!} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="max-h-full max-w-full object-contain" />
      </span>
    ) : (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-bold text-primary">{university.short}</span>
    );
  }

  return showLogo ? (
    <span className="flex aspect-[5/3] w-full items-center justify-center rounded-lg border bg-white p-4 transition-[scale,border-color] duration-200 ease-out group-hover:border-foreground/30 group-active:scale-[0.98]">
      <img
        ref={img}
        src={university.logo!}
        alt={`${university.name} logo`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-[76px] w-auto max-w-full object-contain"
      />
    </span>
  ) : (
    <span
      className={`flex aspect-[5/3] w-full items-center justify-center rounded-lg font-display text-3xl tracking-wide transition-[scale,opacity] duration-200 ease-out group-hover:opacity-90 group-active:scale-[0.98] ${fallbackColors[index % fallbackColors.length]}`}
    >
      {university.short}
    </span>
  );
}
