import { z } from "zod";

import { PANAMA_PROVINCES } from "@/lib/panama";

/**
 * The home search bar's contract.
 *
 * Every field is optional except the vertical, which always has a selection —
 * that mirrors how the listings feed reads its filters: an absent param means
 * "no filter", not "invalid".
 */
export const searchCriteriaSchema = z.object({
  /** Canonical backend category value. See `VerticalId` in `lib/content.ts`. */
  vertical: z.enum(["cars", "parts", "collectibles"]),
  query: z.string().trim().max(120),
  location: z.string(),
  priceRange: z.string(),
  year: z.string(),
});

export type SearchCriteria = z.infer<typeof searchCriteriaSchema>;

export const defaultSearchCriteria: SearchCriteria = {
  vertical: "cars",
  query: "",
  location: "",
  priceRange: "",
  year: "",
};

export type SelectOption = { value: string; label: string };

/** Ubicación — reuses the shared province list rather than duplicating it. */
export const LOCATION_OPTIONS: readonly SelectOption[] = PANAMA_PROVINCES.map((province) => ({
  value: province,
  label: province,
}));

/**
 * Precio — buckets in whole USD, encoded as `min-max` (open-ended when max is
 * absent) so they translate straight into query params.
 */
export const PRICE_OPTIONS: readonly SelectOption[] = [
  { value: "0-5000", label: "Hasta $5,000" },
  { value: "5000-15000", label: "$5,000 – $15,000" },
  { value: "15000-30000", label: "$15,000 – $30,000" },
  { value: "30000-60000", label: "$30,000 – $60,000" },
  { value: "60000-", label: "Más de $60,000" },
];

/**
 * Año — a fixed range rather than `new Date()`, which would risk a
 * server/client hydration mismatch at a year boundary.
 * TODO: replace with the backend's year facet once the search endpoint exists.
 */
const YEAR_RANGE = { from: 1990, to: 2026 } as const;

export const YEAR_OPTIONS: readonly SelectOption[] = Array.from(
  { length: YEAR_RANGE.to - YEAR_RANGE.from + 1 },
  (_, i) => {
    const year = String(YEAR_RANGE.to - i);
    return { value: year, label: year };
  },
);
