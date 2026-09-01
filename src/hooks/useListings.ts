"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchListings } from "@/modules/listings/api/listingsApi";
import { listingKeys } from "@/modules/listings/api/queryKeys";
import type { ListingFilters, ListingPage } from "@/modules/listings/api/types";

/**
 * Public feed of active listings, newest first. No session required.
 *
 * Cursor-paginated: the first call sends no cursor, each subsequent call echoes
 * the previous `next_cursor` back verbatim, and `null` ends the list. The cursor
 * is opaque — decoding or rebuilding it will break the day the feed changes its
 * sort order.
 *
 * The backend offers no text search and no sort parameter; `filters` covers
 * everything it can narrow by.
 */
export function useListings(filters: ListingFilters = {}) {
  return useInfiniteQuery<ListingPage>({
    queryKey: listingKeys.feed(filters),
    queryFn: ({ pageParam }) =>
      fetchListings({ ...filters, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
  });
}
