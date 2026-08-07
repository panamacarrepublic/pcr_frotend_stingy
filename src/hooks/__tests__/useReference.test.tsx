import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import apiClient from "@/lib/api-client";

import { useMakes } from "../useMakes";
import { useModels } from "../useModels";

jest.mock("@/lib/api-client", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  mockGet.mockReset();
});

test("useMakes fetches makes from the reference endpoint", async () => {
  mockGet.mockResolvedValueOnce({ data: [{ id: "m1", name: "Toyota" }] });
  const { result } = renderHook(() => useMakes(), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toEqual([{ id: "m1", name: "Toyota" }]);
  expect(mockGet).toHaveBeenCalledWith("/api/v1/reference/makes");
});

test("useModels stays disabled (no fetch) without a makeId", () => {
  renderHook(() => useModels(undefined), { wrapper });
  expect(mockGet).not.toHaveBeenCalled();
});

test("useModels fetches models for the given make", async () => {
  mockGet.mockResolvedValueOnce({ data: [{ id: "x1", name: "Corolla" }] });
  const { result } = renderHook(() => useModels("m1"), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(mockGet).toHaveBeenCalledWith("/api/v1/reference/models?make_id=m1");
});
