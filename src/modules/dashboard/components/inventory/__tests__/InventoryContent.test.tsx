import { fireEvent, render, screen } from "@testing-library/react";

import type { ListingSummary } from "@/modules/listings/api/types";

import { InventoryContent } from "../InventoryContent";
import { useInventoryPages } from "../useInventoryPages";

jest.mock("../useInventoryPages", () => ({ useInventoryPages: jest.fn() }));

/**
 * The panel and the two dialogs are covered by their own suites. Here they are
 * stubbed so the assertions are about what this component orchestrates: which
 * surface is open, for which listing, and how one hands off to the next.
 */
jest.mock("../ListingQuickView", () => ({
  ListingQuickView: ({
    listing,
    open,
    onEdit,
    onClose,
  }: {
    listing: ListingSummary;
    open: boolean;
    onEdit: () => void;
    onClose: () => void;
  }) =>
    open ? (
      <div>
        <span>{`panel: ${listing.title}`}</span>
        <button onClick={onEdit}>Editar Completo</button>
        <button onClick={onClose}>cerrar panel</button>
      </div>
    ) : null,
}));

jest.mock("@/modules/listings/components/edit/EditListingDialog", () => ({
  EditListingDialog: ({ listingId, open }: { listingId: string; open: boolean }) =>
    open ? <span>{`modal: ${listingId}`}</span> : null,
}));

jest.mock("../DeleteListingDialog", () => ({
  DeleteListingDialog: ({ listing, open }: { listing: ListingSummary; open: boolean }) =>
    open ? <span>{`borrar: ${listing.title}`}</span> : null,
}));

const mockUseInventoryPages = useInventoryPages as jest.Mock;

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

beforeEach(() => {
  mockUseInventoryPages.mockReset();
  mockUseInventoryPages.mockReturnValue({
    items: [summary()],
    isLoading: false,
    isError: false,
    error: null,
    pageIndex: 0,
    pageCount: 1,
    canGoPrevious: false,
    canGoNext: false,
    isLoadingMore: false,
    goPrevious: jest.fn(),
    goNext: jest.fn(),
    goToPage: jest.fn(),
    refetch: jest.fn(),
  });
});

test("the gear button opens the quick view for that listing", () => {
  render(<InventoryContent />);
  expect(screen.queryByText(/^panel:/)).not.toBeInTheDocument();

  fireEvent.click(screen.getByLabelText("Ajustes del anuncio"));

  expect(screen.getByText("panel: Toyota Hilux 2020")).toBeInTheDocument();
});

// The handover notes are explicit: "Sidebar - Editar Completo / Cierra sidebar /
// Abre modal de edicion completo". Leaving both open would stack a dialog on a
// drawer and trap focus in the wrong one.
test("Editar Completo closes the panel and opens the edit modal for the same listing", () => {
  render(<InventoryContent />);
  fireEvent.click(screen.getByLabelText("Ajustes del anuncio"));

  fireEvent.click(screen.getByRole("button", { name: "Editar Completo" }));

  expect(screen.queryByText(/^panel:/)).not.toBeInTheDocument();
  expect(
    screen.getByText("modal: a3f9c210-1111-2222-3333-444455556666"),
  ).toBeInTheDocument();
});

test("the trash button opens the delete confirmation for that listing", () => {
  render(<InventoryContent />);

  fireEvent.click(screen.getByLabelText("Eliminar anuncio"));

  expect(screen.getByText("borrar: Toyota Hilux 2020")).toBeInTheDocument();
  expect(screen.queryByText(/^panel:/)).not.toBeInTheDocument();
});

test("closing the panel leaves the table alone", () => {
  render(<InventoryContent />);
  fireEvent.click(screen.getByLabelText("Ajustes del anuncio"));

  fireEvent.click(screen.getByRole("button", { name: "cerrar panel" }));

  expect(screen.queryByText(/^panel:/)).not.toBeInTheDocument();
  expect(screen.getByText("Toyota Hilux 2020")).toBeInTheDocument();
});
