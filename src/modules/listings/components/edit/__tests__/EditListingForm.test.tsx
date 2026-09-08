import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";

import { useUpdateListing } from "@/hooks/useUpdateListing";
import type { ListingResponse } from "@/modules/listings/api/types";

import { EditListingForm } from "../EditListingForm";

const MAKE_ID = "11111111-1111-1111-1111-111111111111";
const MODEL_ID = "22222222-2222-2222-2222-222222222222";

jest.mock("@/hooks/useUpdateListing", () => ({ useUpdateListing: jest.fn() }));
jest.mock("@/hooks/useMakes", () => ({
  useMakes: () => ({ data: [{ id: "11111111-1111-1111-1111-111111111111", name: "Toyota" }] }),
}));
jest.mock("@/hooks/useModels", () => ({
  useModels: () => ({ data: [{ id: "22222222-2222-2222-2222-222222222222", name: "Hilux" }] }),
}));

const mockUseUpdateListing = useUpdateListing as jest.Mock;
let mutateAsync: jest.Mock;

function listing(overrides: Partial<ListingResponse> = {}): ListingResponse {
  return {
    id: "listing-1",
    category: "cars",
    title: "Toyota Hilux 2020 doble cabina",
    description: "Único dueño.",
    professional_photos: false,
    business_id: null,
    price: "18500.00",
    currency: "USD",
    condition: "used",
    quantity: 1,
    province: "Panamá",
    district: "Betania",
    status: "active",
    data: {
      category: "cars",
      vin_number: "JTDBR32E720012345",
      make_id: MAKE_ID,
      model_id: MODEL_ID,
      model_text: null,
      mileage: 45000,
      year: 2020,
      vehicle_type: "pickup",
      fuel_type: "diesel",
      transmission_type: "automatic",
      make: "Toyota",
      model: "Hilux",
    },
    photos: [{ url: "https://cdn.example.com/a.jpg", sort_order: 1 }],
    created_at: "2026-05-17T10:30:00-05:00",
    ...overrides,
  };
}

const noop = () => {};

beforeEach(() => {
  mutateAsync = jest.fn().mockResolvedValue(listing());
  mockUseUpdateListing.mockReset();
  mockUseUpdateListing.mockReturnValue({ mutateAsync, isPending: false, error: null });
});

const renderForm = (props: Partial<Parameters<typeof EditListingForm>[0]> = {}) =>
  render(<EditListingForm listing={listing()} onClose={noop} {...props} />);

const save = () => fireEvent.click(screen.getByRole("button", { name: "Guardar Cambios" }));
const goToTab = (name: string) => fireEvent.click(screen.getByRole("tab", { name }));

test("opens on Información with the listing's values already in the fields", () => {
  renderForm();

  expect(screen.getByLabelText(/^Título del anuncio/)).toHaveValue("Toyota Hilux 2020 doble cabina");
  expect(screen.getByLabelText(/^Precio/)).toHaveValue("18500.00");
  expect(screen.getByLabelText("Descripción")).toHaveValue("Único dueño.");
});

test("the vehicle fields live behind the Detalles del Producto tab", () => {
  renderForm();
  expect(screen.queryByLabelText("Kilometraje")).not.toBeInTheDocument();

  goToTab("Detalles del Producto");

  expect(screen.getByLabelText("Kilometraje")).toHaveValue("45000");
  expect(screen.getByLabelText("Año")).toHaveValue("2020");
  expect(screen.getByLabelText("Número VIN")).toHaveValue("JTDBR32E720012345");
});

// A PATCH with no keys is a valid no-op, so firing it would be a round trip that
// changes nothing. Say so instead.
test("saving without touching anything does not call the API", async () => {
  renderForm();
  save();

  await waitFor(() => expect(screen.getByText(/No hiciste ningún cambio/i)).toBeInTheDocument());
  expect(mutateAsync).not.toHaveBeenCalled();
});

test("saving an edited title sends only that field", async () => {
  const onClose = jest.fn();
  renderForm({ onClose });

  fireEvent.change(screen.getByLabelText(/^Título del anuncio/), {
    target: { value: "Toyota Hilux 2020 4x4 full extras" },
  });
  save();

  await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
  expect(mutateAsync).toHaveBeenCalledWith({
    listingId: "listing-1",
    patch: { title: "Toyota Hilux 2020 4x4 full extras" },
  });
  await waitFor(() => expect(onClose).toHaveBeenCalled());
});

// The gallery is untouched here, so `photos` must stay out of the patch — a
// total replacement would delete and re-insert every row for a title edit.
test("an unrelated edit leaves the gallery out of the patch", async () => {
  renderForm();

  fireEvent.change(screen.getByLabelText(/^Título del anuncio/), {
    target: { value: "Toyota Hilux 2020 4x4 full extras" },
  });
  save();

  await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
  expect(mutateAsync.mock.calls[0][0].patch).not.toHaveProperty("photos");
});

// Without this the seller sees "Guardar cambios" do nothing at all, because the
// field that failed is on a tab they cannot see.
test("a validation error on a hidden tab brings that tab forward", async () => {
  renderForm();

  goToTab("Detalles del Producto");
  fireEvent.change(screen.getByLabelText("Año"), { target: { value: "12" } });
  goToTab("Información");
  expect(screen.queryByLabelText("Año")).not.toBeInTheDocument();

  save();

  await waitFor(() =>
    expect(screen.getByRole("tab", { name: "Detalles del Producto" })).toHaveAttribute(
      "aria-selected",
      "true",
    ),
  );
  expect(screen.getByLabelText("Año")).toBeInTheDocument();
  expect(mutateAsync).not.toHaveBeenCalled();
});

test("a rejected save shows the backend's reason and keeps the form open", async () => {
  const onClose = jest.fn();
  const config = { headers: new AxiosHeaders() };
  const response = {
    status: 409,
    data: { detail: "El anuncio ya fue vendido." },
    statusText: "",
    headers: {},
    config,
  } as AxiosResponse;
  const conflict = new AxiosError("Request failed", "ERR_BAD_REQUEST", config, {}, response);

  mutateAsync.mockRejectedValueOnce(conflict);
  mockUseUpdateListing.mockReturnValue({ mutateAsync, isPending: false, error: conflict });

  renderForm({ onClose });
  fireEvent.change(screen.getByLabelText(/^Título del anuncio/), {
    target: { value: "Toyota Hilux 2020 4x4 full extras" },
  });
  save();

  await waitFor(() => expect(screen.getByText("El anuncio ya fue vendido.")).toBeInTheDocument());
  expect(onClose).not.toHaveBeenCalled();
});

test("the save button reports progress while the PATCH is in flight", () => {
  mockUseUpdateListing.mockReturnValue({ mutateAsync, isPending: true, error: null });
  renderForm();

  expect(screen.getByRole("button", { name: "Guardando…" })).toBeDisabled();
});

test("the photos tab warns that saving replaces the whole gallery", () => {
  renderForm();
  goToTab("Fotos");

  expect(screen.getByText(/las fotos que quites se eliminan/i)).toBeInTheDocument();
});

describe("the identity header", () => {
  test("names the listing being edited, with its cover photo", () => {
    renderForm();

    expect(screen.getByText("Toyota Hilux 2020 doble cabina")).toBeInTheDocument();
    expect(screen.getByAltText("Toyota Hilux 2020 doble cabina")).toBeInTheDocument();
  });

  // The design shows the publish date relatively here, unlike the table.
  test("shows how long ago the listing was published", () => {
    renderForm();
    expect(screen.getByText(/Publicado hace/)).toBeInTheDocument();
  });
});

describe("the pending-changes banner", () => {
  test("stays hidden while nothing has been edited", () => {
    renderForm();
    expect(screen.queryByText(/cambio.? pendiente/i)).not.toBeInTheDocument();
  });

  test("counts the edits as they happen", () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/^Título del anuncio/), {
      target: { value: "Toyota Hilux 2020 4x4 full extras" },
    });
    fireEvent.change(screen.getByLabelText(/^Precio/), { target: { value: "19000" } });

    expect(screen.getByText(/2 cambios pendientes/i)).toBeInTheDocument();
  });

  test("uses the singular for a single edit", () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/^Título del anuncio/), {
      target: { value: "Toyota Hilux 2020 4x4 full extras" },
    });

    expect(screen.getByText(/1 cambio pendiente/i)).toBeInTheDocument();
  });
});

// The design's counter reads "/100", but the API contract is 5..150 characters.
// The counter must track the real limit, not the mock's.
test("the title counter tracks the schema's real maximum", () => {
  renderForm();
  expect(screen.getByText("30/150 caracteres")).toBeInTheDocument();
});

test("Vista Previa opens the public page in a new tab", () => {
  renderForm();

  const preview = screen.getByRole("link", { name: "Vista Previa" });
  expect(preview).toHaveAttribute("href", "/listings/listing-1");
  expect(preview).toHaveAttribute("target", "_blank");
});

test("the required fields are marked as such", () => {
  renderForm();
  expect(screen.getByLabelText("Título del anuncio*")).toBeInTheDocument();
});
