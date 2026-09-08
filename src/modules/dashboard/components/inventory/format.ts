/**
 * Formatters shared by the inventory table and the listing detail panel, which
 * show the same values in two places and must not drift apart.
 */

const priceFormat = new Intl.NumberFormat("es-PA", {
  style: "currency",
  currency: "USD",
});

/** Figma shows MM/DD/YYYY. `created_at` is ISO 8601 with an offset. */
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
});

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dateFormat.format(date);
}

/**
 * `price` is a decimal-as-string over the wire (Pydantic serializes Decimal that
 * way to keep precision). A malformed one must not render as "NaN".
 */
export function formatPrice(price: string): string {
  const value = Number(price);
  return Number.isFinite(value) ? priceFormat.format(value) : "—";
}

/**
 * The design's "ID de Producto" column shows a `PRD-2024-007629` style code.
 * No such field exists on the API — listings carry only a UUID — so we surface a
 * readable prefix of the real id rather than invent a code.
 */
export function shortId(id: string): string {
  return id.replace(/-/g, "").slice(0, 8);
}
