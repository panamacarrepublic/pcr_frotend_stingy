import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import { updateListing } from "@/modules/listings/api/listingsApi";
import { uploadListingPhotos } from "@/modules/listings/lib/uploadListingPhotos";

import { useUpdateListing } from "../useUpdateListing";

jest.mock("@/modules/listings/api/listingsApi", () => ({ updateListing: jest.fn() }));
jest.mock("@/modules/listings/lib/uploadListingPhotos", () => ({
  uploadListingPhotos: jest.fn(),
}));

const mockUpdate = updateListing as jest.Mock;
const mockUpload = uploadListingPhotos as jest.Mock;

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  mockUpdate.mockReset();
  mockUpload.mockReset();
});

// The seller adds a photo through the same PhotoUploader the wizard uses, so it
// arrives as a `blob:` URL that only resolves in the current tab. The backend
// stores photos[].url verbatim, so it has to be hosted before the PATCH.
test("uploads the gallery before the PATCH when the patch replaces photos", async () => {
  const hosted = [{ url: "https://cdn.test/user-1/new.png", sort_order: 1 }];
  mockUpload.mockResolvedValueOnce(hosted);
  mockUpdate.mockResolvedValueOnce({ id: "listing-1" });

  const { result } = renderHook(() => useUpdateListing(), { wrapper });
  await result.current.mutateAsync({
    listingId: "listing-1",
    patch: { photos: [{ url: "blob:http://localhost/abc", sort_order: 1 }] },
  });

  await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
  expect(mockUpload).toHaveBeenCalledWith([{ url: "blob:http://localhost/abc", sort_order: 1 }]);
  expect(mockUpdate).toHaveBeenCalledWith("listing-1", { photos: hosted });
});

// A patch that leaves photos alone must not touch Storage — and must not grow a
// photos key, which would replace the whole gallery server-side.
test("does not touch storage when the patch has no photos", async () => {
  mockUpdate.mockResolvedValueOnce({ id: "listing-1" });

  const { result } = renderHook(() => useUpdateListing(), { wrapper });
  await result.current.mutateAsync({
    listingId: "listing-1",
    patch: { title: "Toyota Hilux 2020 4x4" },
  });

  await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
  expect(mockUpload).not.toHaveBeenCalled();
  expect(mockUpdate).toHaveBeenCalledWith("listing-1", { title: "Toyota Hilux 2020 4x4" });
});

test("a failed upload aborts the PATCH", async () => {
  mockUpload.mockRejectedValueOnce(new Error("No se pudo leer una de las imágenes."));

  const { result } = renderHook(() => useUpdateListing(), { wrapper });
  await expect(
    result.current.mutateAsync({
      listingId: "listing-1",
      patch: { photos: [{ url: "blob:http://localhost/abc", sort_order: 1 }] },
    }),
  ).rejects.toThrow("No se pudo leer una de las imágenes.");

  expect(mockUpdate).not.toHaveBeenCalled();
});
