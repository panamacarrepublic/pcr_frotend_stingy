import apiClient from "@/lib/api-client";

import {
  createListing,
  deleteListing,
  fetchListing,
  fetchListings,
  fetchMyListings,
  updateListing,
} from "../listingsApi";
import type { ListingCreatePayload } from "../../lib/toListingCreatePayload";

jest.mock("@/lib/api-client", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;
const mockDelete = apiClient.delete as jest.Mock;

const payload: ListingCreatePayload = {
  title: "Toyota Corolla 2020 automático full",
  description: "Único dueño",
  professional_photos: false,
  price: 18500,
  condition: "used",
  province: "Panamá",
  district: "Betania",
  photos: [{ url: "https://cdn.example.com/a.jpg", sort_order: 1 }],
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
  [mockGet, mockPost, mockPatch, mockDelete].forEach((m) => m.mockReset());
});

test("createListing posts the payload to the listings route and unwraps data", async () => {
  mockPost.mockResolvedValueOnce({ data: { id: "l1" } });

  await expect(createListing(payload)).resolves.toEqual({ id: "l1" });
  expect(mockPost).toHaveBeenCalledWith("/api/v1/listings", payload);
});

test("fetchListings sends filters and cursor as query params", async () => {
  mockGet.mockResolvedValueOnce({ data: { items: [], next_cursor: null } });

  await fetchListings({ province: "Panamá", price_min: 5000, cursor: "abc" });

  expect(mockGet).toHaveBeenCalledWith("/api/v1/listings", {
    params: { province: "Panamá", price_min: 5000, cursor: "abc" },
  });
});

test("fetchListings sends no params when called with no filters", async () => {
  mockGet.mockResolvedValueOnce({ data: { items: [], next_cursor: null } });

  await fetchListings();

  expect(mockGet).toHaveBeenCalledWith("/api/v1/listings", { params: {} });
});

test("fetchMyListings hits the /me route", async () => {
  mockGet.mockResolvedValueOnce({ data: { items: [], next_cursor: "next" } });

  const page = await fetchMyListings({ cursor: "abc" });

  expect(mockGet).toHaveBeenCalledWith("/api/v1/listings/me", { params: { cursor: "abc" } });
  expect(page.next_cursor).toBe("next");
});

test("fetchListing requests the listing by id", async () => {
  mockGet.mockResolvedValueOnce({ data: { id: "l1" } });

  await fetchListing("l1");

  expect(mockGet).toHaveBeenCalledWith("/api/v1/listings/l1");
});

test("updateListing patches only the given fields", async () => {
  mockPatch.mockResolvedValueOnce({ data: { id: "l1", status: "paused" } });

  await updateListing("l1", { status: "paused" });

  expect(mockPatch).toHaveBeenCalledWith("/api/v1/listings/l1", { status: "paused" });
});

test("deleteListing calls DELETE and resolves without parsing a body", async () => {
  mockDelete.mockResolvedValueOnce({ status: 204 });

  await expect(deleteListing("l1")).resolves.toBeUndefined();
  expect(mockDelete).toHaveBeenCalledWith("/api/v1/listings/l1");
});
