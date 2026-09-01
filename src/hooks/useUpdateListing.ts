"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateListing } from "@/modules/listings/api/listingsApi";
import { listingKeys } from "@/modules/listings/api/queryKeys";
import type {
  ListingResponse,
  ListingStatusUpdate,
  ListingUpdate,
} from "@/modules/listings/api/types";

export interface UpdateListingVariables {
  listingId: string;
  patch: ListingUpdate;
}

/**
 * Edits a listing via `PATCH /api/v1/listings/{id}`.
 *
 * Partial by omission: only the keys you send are touched. Note that `photos` is
 * a total replacement — sending it deletes every existing photo and re-inserts
 * the array you provide, so there's no way to append a single photo.
 *
 * The response is written straight into the detail cache (it's the full
 * `ListingResponse`), and the lists are invalidated because title, price, cover
 * photo and status all appear on the feed cards.
 */
export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation<ListingResponse, Error, UpdateListingVariables>({
    mutationFn: ({ listingId, patch }) => updateListing(listingId, patch),
    onSuccess: (listing) => {
      queryClient.setQueryData(listingKeys.detail(listing.id), listing);
      queryClient.invalidateQueries({ queryKey: listingKeys.feeds() });
      queryClient.invalidateQueries({ queryKey: listingKeys.mine() });
    },
  });
}

/**
 * Convenience wrapper for the pause / reactivate / mark-as-sold actions, which
 * are a `status` field on the same PATCH rather than dedicated URL verbs.
 *
 * Allowed transitions: `active ⇄ paused`, either into `sold`. `sold` is terminal
 * and anything else is a 409.
 */
export function useSetListingStatus() {
  const update = useUpdateListing();

  return {
    ...update,
    setStatus: (listingId: string, status: ListingStatusUpdate) =>
      update.mutateAsync({ listingId, patch: { status } }),
  };
}
