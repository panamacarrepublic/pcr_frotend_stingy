"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteListing } from "@/modules/listings/api/listingsApi";
import { listingKeys } from "@/modules/listings/api/queryKeys";

/**
 * Deletes a listing via `DELETE /api/v1/listings/{id}` → 204, no body.
 *
 * Always a soft delete server-side. One consequence worth surfacing in the UI
 * before the user confirms: deleting does **not** release the VIN, so the same
 * vehicle cannot be republished afterwards — it comes back as a 409 "VIN
 * duplicado". That's known, accepted backend debt, not a bug to report.
 *
 * The detail entry is dropped rather than invalidated: refetching it would just
 * 404 now that the listing is gone.
 */
export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (listingId) => deleteListing(listingId),
    onSuccess: (_result, listingId) => {
      queryClient.removeQueries({ queryKey: listingKeys.detail(listingId) });
      queryClient.invalidateQueries({ queryKey: listingKeys.feeds() });
      queryClient.invalidateQueries({ queryKey: listingKeys.mine() });
    },
  });
}
