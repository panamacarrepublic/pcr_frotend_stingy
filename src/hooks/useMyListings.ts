"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchMyListings } from "@/modules/listings/api/listingsApi";
import { listingKeys } from "@/modules/listings/api/queryKeys";
import type { ListingPage } from "@/modules/listings/api/types";

/**
 * The signed-in user's own listings, in every status (paused, sold, expired —
 * not just active) and including anything published under their business.
 * Requires a session; without one the request is a 401.
 *
 * Unlike the public feed this endpoint takes no filters, only cursor/limit.
 */
export function useMyListings({ enabled = true }: { enabled?: boolean } = {}) {
  return useInfiniteQuery<ListingPage>({
    queryKey: listingKeys.mine(),
    queryFn: ({ pageParam }) => fetchMyListings({ cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    enabled,
  });
}
