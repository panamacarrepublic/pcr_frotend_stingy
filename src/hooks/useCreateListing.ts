"use client";

import { useMutation } from "@tanstack/react-query";

import type { ListingCreatePayload } from "@/modules/listings/lib/toListingCreatePayload";

interface CreateListingResult {
  id: string;
}

/**
 * Creates a listing. STUB (M4 wires the real path): upload `payload.photos` to
 * Supabase Storage, then `apiClient.post('/api/v1/listings', payload)`. Kept as a
 * TanStack mutation so call sites don't change when the backend endpoint lands.
 */
export function useCreateListing() {
  return useMutation<CreateListingResult, Error, ListingCreatePayload>({
    mutationFn: async (payload) => {
      // eslint-disable-next-line no-console
      console.info("[useCreateListing] payload", payload);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { id: crypto.randomUUID() };
    },
  });
}
