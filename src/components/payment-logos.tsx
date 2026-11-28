// Mobile money marks for "Pay with" rows.
// PLACEHOLDER: MtnLogo is a drawn stand-in. Swap in the official MTN MoMo artwork when MTN
// supplies it. AirtelLogo is the Airtel mark from Simple Icons (CC0-1.0).

export function MtnLogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[5px] bg-[#FFCC00] ${className}`}
    >
      <svg viewBox="0 0 64 36" className="h-[68%] w-auto" role="img" aria-label="MTN MoMo">
        <ellipse cx="32" cy="18" rx="29" ry="15" fill="none" stroke="#000" strokeWidth="3.4" />
        <text
          x="32"
          y="23.5"
          textAnchor="middle"
          fontFamily="Arial Black, Arial, sans-serif"
          fontWeight="900"
          fontSize="15"
          fill="#000"
        >
          MTN
        </text>
      </svg>
    </span>
  );
}

export function AirtelLogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[5px] border bg-white ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[64%] w-auto" role="img" aria-label="Airtel Money">
        <path
          fill="#E40000"
          d="M7.137 23.862c.79 0 1.708-.19 2.751-.554 1.55-.538 2.784-1.281 3.986-2.009l.316-.205a29.733 29.733 0 0 0 3.764-2.72 16.574 16.574 0 0 0 5.457-7.529c.395-1.138.949-3.384.268-5.487a7.117 7.117 0 0 0-2.862-3.749c-.158-.126-1.898-1.47-5.203-1.47-3.005 0-6.31 1.107-9.806 3.32l-.11.08-.317.205a20.133 20.133 0 0 0-2.309 1.693C1.585 6.813-.091 9.106.004 11.067c.031.79.427 1.534 1.075 2.008a3.472 3.472 0 0 0 2.214.68c1.803 0 3.765-.948 5.109-1.74l.253-.157.696-.443.237-.158c1.898-1.234 3.875-2.515 6.105-3.258a5.255 5.255 0 0 1 1.55-.285 3.163 3.163 0 0 1 .664.08 2.112 2.112 0 0 1 1.47 1.106c.523 1.012.396 2.61-.316 4.08a17.871 17.871 0 0 1-4.887 5.836 19.488 19.488 0 0 1-3.194 2.215l-.095.031a9.634 9.634 0 0 1-1.471.696l-.08.032-.41.158c-2.23.57-.87-1.329-.87-1.329.474-.537.98-1.028 1.518-1.502.316-.269.633-.554.933-.854l.064-.063c.395-.38.933-.902.901-1.645-.047-.98-1.075-1.582-2.056-1.613h-.063c-.95 0-1.819.522-2.404.98a7.27 7.27 0 0 0-1.598 1.74c-.6.901-1.85 3.226-.632 5.077.49.743 1.313 1.123 2.42 1.123z"
        />
      </svg>
    </span>
  );
}
