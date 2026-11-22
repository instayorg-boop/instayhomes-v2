// One availability line used on search cards and the listing page, so "when can I move in"
// always reads the same: green for now, brand orange for a future date, grey when booked out.
export function Availability({
  available,
  left,
  leftLabel = (count) => `${count} rooms`,
  className = "",
}: {
  available: string;
  left: number;
  leftLabel?: (count: number) => string;
  className?: string;
}) {
  if (left === 0) {
    return <p className={`text-sm font-medium text-muted-foreground ${className}`}>Fully booked</p>;
  }
  const now = available === "Available now";
  return (
    <p className={`flex items-center gap-1.5 text-sm font-semibold ${now ? "text-emerald-600" : "text-primary"} ${className}`}>
      <span className="size-2 shrink-0 rounded-full bg-current" aria-hidden />
      {available}
      {left > 1 && <span className="font-normal text-muted-foreground">· {leftLabel(left)}</span>}
    </p>
  );
}
