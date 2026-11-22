// The standard blue "verified" tick: Material Symbols "verified" (Apache-2.0), with a white
// circle behind the cut-out so the tick stays white on any background.
export function VerifiedIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 -960 960 960" className={className} aria-hidden="true">
      <circle cx="480" cy="-480" r="260" fill="#fff" />
      <path
        fill="#1D9BF0"
        d="m437-433-73-76q-9-10-22-10t-23 9q-10 10-10 23t10 23l97 96q9 9 21 9t21-9l183-182q9-9 9-22t-10-22q-9-8-21.5-7.5T598-593L437-433ZM332-84l-62-106-124-25q-11-2-18.5-12t-5.5-21l14-120-79-92q-8-8-8-20t8-20l79-91-14-120q-2-11 5.5-21t18.5-12l124-25 62-107q6-10 17-14t22 1l109 51 109-51q11-5 22-1.5t17 13.5l63 108 123 25q11 2 18.5 12t5.5 21l-14 120 79 91q8 8 8 20t-8 20l-79 92 14 120q2 11-5.5 21T814-215l-123 25-63 107q-6 10-17 13.5T589-71l-109-51-109 51q-11 5-22 1t-17-14Z"
      />
    </svg>
  );
}

/** "Tenant verified" as plain text with the blue tick: no background, no padding. */
export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${className}`}>
      <VerifiedIcon className="size-[1.15em] shrink-0" /> Tenant verified
    </span>
  );
}
