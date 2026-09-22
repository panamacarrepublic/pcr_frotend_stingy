"use client";

import { useQuery } from "@tanstack/react-query";

import apiClient from "@/lib/api-client";
import type { ReferenceOption } from "@/types/reference";

/** Vehicle models for a given make. Disabled until a make is selected. */
export function useModels(makeId?: string) {
  return useQuery({
    queryKey: ["reference", "models", makeId],
    queryFn: async () =>
      (
        await apiClient.get<ReferenceOption[]>(
          `/api/v1/reference/models?make_id=${makeId}`,
        )
      ).data,
    enabled: Boolean(makeId),
    staleTime: 1000 * 60 * 60,
  });
}
