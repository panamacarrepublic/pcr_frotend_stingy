"use client";

import { useQuery } from "@tanstack/react-query";

import type { ReferenceOption } from "@pcr/types";

import apiClient from "@/lib/api-client";

/** Vehicle makes for the wizard dropdown (served from our own DB via FastAPI). */
export function useMakes() {
  return useQuery({
    queryKey: ["reference", "makes"],
    queryFn: async () =>
      (await apiClient.get<ReferenceOption[]>("/api/v1/reference/makes")).data,
    staleTime: 1000 * 60 * 60, // reference data changes rarely
  });
}
