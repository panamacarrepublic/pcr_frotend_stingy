/**
 * Relative publish dates, as the edit modal shows them ("Publicado hace 3
 * días"). The inventory table renders the same instant absolutely — that
 * formatter lives with the table, this one with the listing.
 */
const relativeFormat = new Intl.RelativeTimeFormat("es-PA", { numeric: "auto" });

/**
 * "Publicado hace 3 días", as the edit modal shows it. The inventory table
 * shows the same instant as an absolute date, so both live here together.
 *
 * `now` is injectable so the unit tests do not depend on the wall clock.
 */
export function formatRelativeDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const days = Math.round((date.getTime() - now.getTime()) / 86_400_000);
  if (Math.abs(days) < 30) return relativeFormat.format(days, "day");

  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return relativeFormat.format(months, "month");

  return relativeFormat.format(Math.round(months / 12), "year");
}
