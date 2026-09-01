"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createListing } from "@/modules/listings/api/listingsApi";
import { listingKeys } from "@/modules/listings/api/queryKeys";
import type { ListingResponse } from "@/modules/listings/api/types";
import type { ListingCreatePayload } from "@/modules/listings/lib/toListingCreatePayload";
import { uploadListingPhotos } from "@/modules/listings/lib/uploadListingPhotos";

/**
 * Publishes a listing: uploads the photos to Supabase Storage, then
 * `POST /api/v1/listings` with the resulting public URLs.
 *
 * The upload has to happen first because the backend has no upload endpoint —
 * it persists `photos[].url` as given, and the wizard's values are `blob:` URLs
 * that only resolve inside the current tab.
 *
 * On success the whole listings cache is invalidated: the new listing belongs in
 * the public feed and in "my listings", and the seller's counts change too.
 */
export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation<ListingResponse, Error, ListingCreatePayload>({
    mutationFn: async (payload) => {
      const photos = await uploadListingPhotos(payload.photos);
      return createListing({ ...payload, photos });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}
