import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";

import { useDeleteListing } from "@/hooks/useDeleteListing";
import type { ListingSummary } from "@/modules/listings/api/types";

import { DeleteListingDialog } from "../DeleteListingDialog";

jest.mock("@/hooks/useDeleteListing", () => ({ useDeleteListing: jest.fn() }));

const mockUseDeleteListing = useDeleteListing as jest.Mock;

function summary(overrides: Partial<ListingSummary> = {}): ListingSummary {
  return {
    id: "a3f9c210-1111-2222-3333-444455556666",
    title: "Toyota Hilux 2020",
    price: "2500.00",
    currency: "USD",
    condition: "used",
    province: "Panamá",
    district: "Betania",
    status: "active",
    created_at: "2026-05-17T10:30:00-05:00",
    cover_photo: null,
    year: 2020,
    mileage: 45000,
    make: "Toyota",
    model: "Hilux",
    vehicle_type: "pickup",
    ...overrides,
  };
}

const noop = () => {};
let mutateAsync: jest.Mock;

beforeEach(() => {
  mutateAsync = jest.fn().mockResolvedValue(undefined);
  mockUseDeleteListing.mockReset();
  mockUseDeleteListing.mockReturnValue({ mutateAsync, isPending: false, error: null });
});

function renderDialog(props: Partial<Parameters<typeof DeleteListingDialog>[0]> = {}) {
  return render(
    <DeleteListingDialog listing={summary()} open onClose={noop} onDeleted={noop} {...props} />,
  );
}

test("names the listing being deleted so the wrong row cannot be confirmed blindly", () => {
  renderDialog();
  expect(screen.getByText(/Toyota Hilux 2020/)).toBeInTheDocument();
});

// The soft delete does not release the VIN, so the seller can never relist this
// vehicle. That is worth knowing before confirming, not after.
test("warns that the vehicle cannot be republished afterwards", () => {
  renderDialog();
  expect(screen.getByText(/VIN no se libera/i)).toBeInTheDocument();
});

test("confirming deletes that listing and closes", async () => {
  const onClose = jest.fn();
  const onDeleted = jest.fn();
  renderDialog({ onClose, onDeleted });

  fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

  await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(summary().id));
  await waitFor(() => expect(onDeleted).toHaveBeenCalled());
  expect(onClose).toHaveBeenCalled();
});

test("cancelling closes without deleting anything", () => {
  const onClose = jest.fn();
  renderDialog({ onClose });

  fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

  expect(mutateAsync).not.toHaveBeenCalled();
  expect(onClose).toHaveBeenCalled();
});

test("a failed delete keeps the dialog open and shows the reason", async () => {
  const onClose = jest.fn();
  const onDeleted = jest.fn();
  // A real AxiosError: `getListingErrorMessage` narrows on the class, so a
  // look-alike object would silently take the generic-fallback path.
  const config = { headers: new AxiosHeaders() };
  const response = {
    status: 404,
    data: { detail: "El anuncio no existe." },
    statusText: "",
    headers: {},
    config,
  } as AxiosResponse;
  const apiError = new AxiosError("Request failed", "ERR_BAD_REQUEST", config, {}, response);

  mutateAsync.mockRejectedValueOnce(apiError);
  mockUseDeleteListing.mockReturnValue({ mutateAsync, isPending: false, error: apiError });

  renderDialog({ onClose, onDeleted });
  fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

  await waitFor(() => expect(screen.getByText("El anuncio no existe.")).toBeInTheDocument());
  expect(onDeleted).not.toHaveBeenCalled();
  expect(onClose).not.toHaveBeenCalled();
});

test("the confirm button reports progress while the request is in flight", () => {
  mockUseDeleteListing.mockReturnValue({ mutateAsync, isPending: true, error: null });
  renderDialog();

  expect(screen.getByRole("button", { name: "Eliminando…" })).toBeDisabled();
});
