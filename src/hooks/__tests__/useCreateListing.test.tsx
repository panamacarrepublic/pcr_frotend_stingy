import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import { createListing } from "@/modules/listings/api/listingsApi";
import type { ListingCreatePayload } from "@/modules/listings/lib/toListingCreatePayload";
import { uploadListingPhotos } from "@/modules/listings/lib/uploadListingPhotos";

import { useCreateListing } from "../useCreateListing";

jest.mock("@/modules/listings/api/listingsApi", () => ({ createListing: jest.fn() }));
jest.mock("@/modules/listings/lib/uploadListingPhotos", () => ({
  uploadListingPhotos: jest.fn(),
}));

const mockCreate = createListing as jest.Mock;
const mockUpload = uploadListingPhotos as jest.Mock;

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const payload: ListingCreatePayload = {
  title: "Toyota Corolla 2020 automático full",
  description: undefined,
  professional_photos: false,
  price: 18500,
  condition: "used",
  province: "Panamá",
  district: "Betania",
  photos: [{ url: "blob:http://localhost/abc", sort_order: 1 }],
  data: {
    category: "cars",
    vin_number: undefined,
    make_id: "11111111-1111-1111-1111-111111111111",
    model_id: "22222222-2222-2222-2222-222222222222",
    model_text: null,
    mileage: 45000,
    year: 2020,
    vehicle_type: "sedan",
    fuel_type: "gasoline",
    transmission_type: "automatic",
  },
};

beforeEach(() => {
  mockCreate.mockReset();
  mockUpload.mockReset();
});

test("photos are uploaded before the POST, and the POST carries the hosted URLs", async () => {
  const hosted = [{ url: "https://cdn.test/user-1/a.png", sort_order: 1 }];
  mockUpload.mockResolvedValueOnce(hosted);
  mockCreate.mockResolvedValueOnce({ id: "listing-1" });

  const { result } = renderHook(() => useCreateListing(), { wrapper });
  await result.current.mutateAsync(payload);

  expect(mockUpload).toHaveBeenCalledWith(payload.photos);
  // The blob: URL must never reach the API — the backend stores it verbatim.
  expect(mockCreate).toHaveBeenCalledWith({ ...payload, photos: hosted });
});

test("the created listing is returned to the caller", async () => {
  mockUpload.mockResolvedValueOnce(payload.photos);
  mockCreate.mockResolvedValueOnce({ id: "listing-1", status: "active" });

  const { result } = renderHook(() => useCreateListing(), { wrapper });

  await expect(result.current.mutateAsync(payload)).resolves.toMatchObject({ id: "listing-1" });
});

test("a failed upload short-circuits: nothing is posted", async () => {
  mockUpload.mockRejectedValueOnce(new Error("storage denied"));

  const { result } = renderHook(() => useCreateListing(), { wrapper });
  await expect(result.current.mutateAsync(payload)).rejects.toThrow("storage denied");

  expect(mockCreate).not.toHaveBeenCalled();
});

test("a failed POST surfaces as mutation error state", async () => {
  mockUpload.mockResolvedValueOnce(payload.photos);
  mockCreate.mockRejectedValueOnce(new Error("La suscripción no permite publicar más anuncios."));

  const { result } = renderHook(() => useCreateListing(), { wrapper });
  result.current.mutate(payload);

  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result.current.error?.message).toMatch(/suscripción/);
});
