import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import { fetchMyListings } from "@/modules/listings/api/listingsApi";
import type { ListingSummary } from "@/modules/listings/api/types";

import { useInventoryPages } from "../useInventoryPages";

jest.mock("@/modules/listings/api/listingsApi", () => ({ fetchMyListings: jest.fn() }));

const mockFetch = fetchMyListings as jest.Mock;

function summary(id: string): ListingSummary {
  return {
    id,
    title: `Listing ${id}`,
    price: "1000.00",
    currency: "USD",
    condition: "used",
    province: "Panamá",
    district: "Betania",
    status: "active",
    created_at: "2026-05-17T10:30:00-05:00",
    cover_photo: null,
    year: 2020,
    mileage: 1000,
    make: "Toyota",
    model: "Hilux",
    vehicle_type: "pickup",
  };
}

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  mockFetch.mockReset();
});

test("starts on page 1 with a single page number and no way back", async () => {
  mockFetch.mockResolvedValueOnce({ items: [summary("a")], next_cursor: "cursor-1" });

  const { result } = renderHook(() => useInventoryPages(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.pageIndex).toBe(0);
  // Numbers cover pages fetched so far, not the whole result set.
  expect(result.current.pageCount).toBe(1);
  expect(result.current.canGoPrevious).toBe(false);
  expect(result.current.canGoNext).toBe(true);
});

test("the first request sends no cursor; going forward echoes next_cursor back", async () => {
  mockFetch
    .mockResolvedValueOnce({ items: [summary("a")], next_cursor: "cursor-1" })
    .mockResolvedValueOnce({ items: [summary("b")], next_cursor: null });

  const { result } = renderHook(() => useInventoryPages(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(mockFetch).toHaveBeenCalledWith({ cursor: undefined });

  act(() => result.current.goNext());
  await waitFor(() => expect(result.current.pageIndex).toBe(1));

  // Passed through verbatim — the cursor is opaque.
  expect(mockFetch).toHaveBeenLastCalledWith({ cursor: "cursor-1" });
  expect(result.current.items.map((i) => i.id)).toEqual(["b"]);
});

test("page numbers grow as the user pages forward", async () => {
  mockFetch
    .mockResolvedValueOnce({ items: [summary("a")], next_cursor: "cursor-1" })
    .mockResolvedValueOnce({ items: [summary("b")], next_cursor: null });

  const { result } = renderHook(() => useInventoryPages(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.pageCount).toBe(1);

  act(() => result.current.goNext());
  await waitFor(() => expect(result.current.pageCount).toBe(2));
});

test("Siguiente is disabled on the last page (next_cursor null)", async () => {
  mockFetch.mockResolvedValueOnce({ items: [summary("a")], next_cursor: null });

  const { result } = renderHook(() => useInventoryPages(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.canGoNext).toBe(false);
});

test("going back to a visited page is served from cache, not refetched", async () => {
  mockFetch
    .mockResolvedValueOnce({ items: [summary("a")], next_cursor: "cursor-1" })
    .mockResolvedValueOnce({ items: [summary("b")], next_cursor: null });

  const { result } = renderHook(() => useInventoryPages(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  act(() => result.current.goNext());
  await waitFor(() => expect(result.current.pageIndex).toBe(1));

  const callsAfterForward = mockFetch.mock.calls.length;

  act(() => result.current.goPrevious());
  await waitFor(() => expect(result.current.pageIndex).toBe(0));

  expect(result.current.items.map((i) => i.id)).toEqual(["a"]);
  expect(mockFetch).toHaveBeenCalledTimes(callsAfterForward);
});

test("jumping directly to a visited page works; an unvisited index is ignored", async () => {
  mockFetch
    .mockResolvedValueOnce({ items: [summary("a")], next_cursor: "cursor-1" })
    .mockResolvedValueOnce({ items: [summary("b")], next_cursor: null });

  const { result } = renderHook(() => useInventoryPages(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  act(() => result.current.goNext());
  await waitFor(() => expect(result.current.pageCount).toBe(2));

  act(() => result.current.goToPage(0));
  expect(result.current.pageIndex).toBe(0);

  // Page 5 has never been walked to, so there is no cursor to jump with.
  act(() => result.current.goToPage(4));
  expect(result.current.pageIndex).toBe(0);
});

test("a failed page fetch leaves the user on the page they were reading", async () => {
  mockFetch
    .mockResolvedValueOnce({ items: [summary("a")], next_cursor: "cursor-1" })
    .mockRejectedValueOnce(new Error("boom"));

  const { result } = renderHook(() => useInventoryPages(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  act(() => result.current.goNext());
  await waitFor(() => expect(result.current.isLoadingMore).toBe(false));

  expect(result.current.pageIndex).toBe(0);
  expect(result.current.items.map((i) => i.id)).toEqual(["a"]);
});
