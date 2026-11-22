// Empty-state illustration: an outlined "missing" home with a magnifying glass that sweeps
// across it twice, then rests. Plays once per empty state (rare screen, so a little delight is
// fine) and is stilled by the global prefers-reduced-motion rule in styles.css.
export function NoResultsIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-label="Magnifying glass searching an empty home" className={className}>
      <style>{`
        .nr-enter { animation: nr-enter 600ms cubic-bezier(0.23, 1, 0.32, 1) both; }
        .nr-sweep { transform-box: fill-box; transform-origin: center; animation: nr-sweep 1400ms cubic-bezier(0.77, 0, 0.175, 1) 450ms 2 alternate both; }
        .nr-float { animation: nr-float 900ms cubic-bezier(0.23, 1, 0.32, 1) both; }
        .nr-float-2 { animation-delay: 150ms; }
        @keyframes nr-enter { from { opacity: 0; transform: translateY(8px) scale(0.96); } }
        @keyframes nr-sweep { from { transform: translateX(-56px) rotate(-8deg); } to { transform: translateX(0) rotate(0); } }
        @keyframes nr-float { from { opacity: 0; transform: translateY(6px); } }
      `}</style>

      <ellipse cx="120" cy="158" rx="86" ry="9" className="fill-muted" />

      <g className="nr-float">
        <path d="M30 52c0-7 6-12 13-12 3-6 9-9 15-9 9 0 16 6 17 14 5 1 8 4 8 8H30Z" className="fill-muted" />
      </g>
      <g className="nr-float nr-float-2">
        <path d="M168 36c0-5 4-9 9-9 2-4 6-6 11-6 6 0 11 4 12 10 4 0 6 3 6 6h-38Z" className="fill-muted" />
      </g>

      <g className="nr-enter" style={{ transformOrigin: "120px 120px" }}>
        <path
          d="M64 88 120 44l56 44"
          className="fill-none stroke-muted-foreground/40"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 8"
        />
        <rect
          x="76"
          y="82"
          width="88"
          height="72"
          rx="6"
          className="fill-background stroke-muted-foreground/40"
          strokeWidth="4"
          strokeDasharray="8 8"
        />
        <rect x="108" y="116" width="24" height="38" rx="3" className="fill-muted" />
        <rect x="88" y="96" width="16" height="14" rx="2" className="fill-muted" />
        <rect x="136" y="96" width="16" height="14" rx="2" className="fill-muted" />
      </g>

      <g className="nr-sweep">
        <circle cx="160" cy="104" r="24" className="fill-background/70 stroke-primary" strokeWidth="6" />
        <path d="M177 121 196 140" className="stroke-primary" strokeWidth="9" strokeLinecap="round" />
        <path d="M150 96a12 12 0 0 1 12-8" className="fill-none stroke-primary/40" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
