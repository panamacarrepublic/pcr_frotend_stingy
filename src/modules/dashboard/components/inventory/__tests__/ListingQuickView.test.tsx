import { fireEvent, render, screen } from "@testing-library/react";

import { useListing } from "@/hooks/useListing";
import type { ListingResponse, ListingStatus, ListingSummary } from "@/modules/listings/api/types";

import { ListingQuickView } from "../ListingQuickView";

jest.mock("@/hooks/useListing", () => ({ useListing: jest.fn() }));

const mockUseListing = useListing as jest.Mock;

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

/** Only the description comes from the detail query; the rest is on the row. */
function detail(description: string | null): Partial<ListingResponse> {
  return { description };
}

const noop = () => {};

beforeEach(() => {
  mockUseListing.mockReset();
  mockUseListing.mockReturnValue({ data: detail("Único dueño."), isLoading: false, isError: false });
});

function renderPanel(props: Partial<Parameters<typeof ListingQuickView>[0]> = {}) {
  return render(
    <ListingQuickView
      listing={summary()}
      open
      onClose={noop}
      onEdit={noop}
      {...props}
    />,
  );
}

test("shows the listing identity from the row, with no wait for the detail query", () => {
  mockUseListing.mockReturnValue({ data: undefined, isLoading: true, isError: false });
  renderPanel();

  expect(screen.getByText("Detalles del Anuncio")).toBeInTheDocument();
  expect(screen.getByText("Toyota Hilux 2020")).toBeInTheDocument();
  expect(screen.getByText(/2,500\.00/)).toBeInTheDocument();
  expect(screen.getByText(/a3f9c210/)).toBeInTheDocument();
  expect(screen.getByText(/05\/17\/2026/)).toBeInTheDocument();
});

test("renders the description once the detail query resolves", () => {
  renderPanel();
  expect(screen.getByText("Único dueño.")).toBeInTheDocument();
});

test("a listing with no description says so rather than rendering an empty block", () => {
  mockUseListing.mockReturnValue({ data: detail(null), isLoading: false, isError: false });
  renderPanel();

  expect(screen.getByText(/todavía no tiene descripción/i)).toBeInTheDocument();
});

test("Ver Público points at the public listing page in a new tab", () => {
  renderPanel();

  const link = screen.getByRole("link", { name: "Ver Público" });
  expect(link).toHaveAttribute("href", "/listings/a3f9c210-1111-2222-3333-444455556666");
  expect(link).toHaveAttribute("target", "_blank");
});

test("Editar Completo hands control to the caller", () => {
  const onEdit = jest.fn();
  renderPanel({ onEdit });

  fireEvent.click(screen.getByRole("button", { name: "Editar Completo" }));
  expect(onEdit).toHaveBeenCalled();
});

// sold / expired / rejected reject every PATCH with a 409, so the form would be
// a dead end. The panel says why instead of letting the seller fill it in.
describe.each([
  ["sold", /vendido/i],
  ["expired", /expiró/i],
  ["rejected", /rechazado/i],
])("a %s listing", (status, explanation) => {
  test("cannot be edited, and the panel explains why", () => {
    renderPanel({ listing: summary({ status: status as ListingStatus }) });

    expect(screen.getByRole("button", { name: "Editar Completo" })).toBeDisabled();
    expect(screen.getByText(explanation)).toBeInTheDocument();
  });
});

test("a paused listing can still be edited", () => {
  renderPanel({ listing: summary({ status: "paused" }) });
  expect(screen.getByRole("button", { name: "Editar Completo" })).toBeEnabled();
});

test("the close button reports back to the caller", () => {
  const onClose = jest.fn();
  renderPanel({ onClose });

  fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
  expect(onClose).toHaveBeenCalled();
});
