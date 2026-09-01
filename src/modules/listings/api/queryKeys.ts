/**
 * Query keys for the listings resource, in one place so invalidation after a
 * create/update/delete can't miss a cache entry through a typo.
 *
 * Hierarchy: `["listings"]` is the root, so invalidating it sweeps the feed,
 * "my listings" and every detail entry at once.
 */
import type { ListingFilters } from "./types";

export const listingKeys = {
  all: ["listings"] as const,
  /** Every public-feed query, regardless of filters. */
  feeds: () => [...listingKeys.all, "feed"] as const,
  feed: (filters: ListingFilters = {}) => [...listingKeys.feeds(), filters] as const,
  /** The authenticated user's own listings. */
  mine: () => [...listingKeys.all, "mine"] as const,
  /** Every listing-detail query. */
  details: () => [...listingKeys.all, "detail"] as const,
  detail: (listingId: string) => [...listingKeys.details(), listingId] as const,
};
