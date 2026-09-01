"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchListing } from "@/modules/listings/api/listingsApi";
import { listingKeys } from "@/modules/listings/api/queryKeys";
import type { ListingResponse } from "@/modules/listings/api/types";
import { toListingApiError } from "@/modules/listings/api/errors";

/**
 * A single listing's full detail. Works signed-out (active listings only); the
 * owner additionally sees their own paused/sold ones.
 *
 * A listing that isn't visible to the caller is a 404, so there's nothing to
 * retry — the default retry is disabled for that case to avoid three pointless
 * round trips before the "not found" state renders.
 */
export function useListing(listingId?: string) {
  return useQuery<ListingResponse>({
    queryKey: listingKeys.detail(listingId ?? ""),
    queryFn: () => fetchListing(listingId as string),
    enabled: Boolean(listingId),
    retry: (failureCount, error) => {
      const { status } = toListingApiError(error);
      if (status === 404 || status === 401) return false;
      return failureCount < 1;
    },
  });
}
