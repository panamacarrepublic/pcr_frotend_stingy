import { fireEvent, render, screen, within } from "@testing-library/react";

import type { ListingSummary } from "@/modules/listings/api/types";

import { InventoryTable } from "../InventoryTable";

function listing(overrides: Partial<ListingSummary> = {}): ListingSummary {
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

test("renders the six columns from the design", () => {
  render(
    <InventoryTable items={[listing()]} selectedIds={[]} onToggleRow={noop} onToggleAll={noop} />,
  );

  ["Date", "ID de Producto", "Nombre", "Categoría", "Precio"].forEach((label) => {
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

test("price arrives as a decimal string and is formatted as currency", () => {
  render(
    <InventoryTable
      items={[listing({ price: "18500.50" })]}
      selectedIds={[]}
      onToggleRow={noop}
      onToggleAll={noop}
    />,
  );

  // The raw wire value must not leak into the cell.
  expect(screen.queryByText("18500.50")).not.toBeInTheDocument();
  expect(screen.getByText(/18,500\.50/)).toBeInTheDocument();
});

test("a malformed price renders a dash rather than NaN", () => {
  render(
    <InventoryTable
      items={[listing({ price: "not-a-number" })]}
      selectedIds={[]}
      onToggleRow={noop}
      onToggleAll={noop}
    />,
  );

  expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
});

test("the ID column shows a readable prefix of the real UUID", () => {
  render(
    <InventoryTable items={[listing()]} selectedIds={[]} onToggleRow={noop} onToggleAll={noop} />,
  );

  expect(screen.getByText("a3f9c210")).toBeInTheDocument();
});

test("created_at is rendered as a date, not a raw ISO string", () => {
  render(
    <InventoryTable items={[listing()]} selectedIds={[]} onToggleRow={noop} onToggleAll={noop} />,
  );

  expect(screen.getByText("05/17/2026")).toBeInTheDocument();
  expect(screen.queryByText(/T10:30:00/)).not.toBeInTheDocument();
});

test("row and header checkboxes report selection to the caller", () => {
  const onToggleRow = jest.fn();
  const onToggleAll = jest.fn();

  render(
    <InventoryTable
      items={[listing()]}
      selectedIds={[]}
      onToggleRow={onToggleRow}
      onToggleAll={onToggleAll}
    />,
  );

  fireEvent.click(screen.getByLabelText(/Seleccionar anuncio/));
  expect(onToggleRow).toHaveBeenCalledWith("a3f9c210-1111-2222-3333-444455556666");

  fireEvent.click(screen.getByLabelText(/Seleccionar todos/));
  expect(onToggleAll).toHaveBeenCalled();
});

test("the header checkbox is indeterminate on a partial selection", () => {
  const items = [listing(), listing({ id: "b0000000-0000-0000-0000-000000000000" })];

  render(
    <InventoryTable
      items={items}
      selectedIds={[items[0].id]}
      onToggleRow={noop}
      onToggleAll={noop}
    />,
  );

  // MUI reflects the indeterminate state as an attribute, not the DOM property.
  const selectAll = screen.getByLabelText(/Seleccionar todos/);
  expect(selectAll).toHaveAttribute("data-indeterminate", "true");
  expect(selectAll).not.toBeChecked();
});

test("the header checkbox is checked once every row on the page is selected", () => {
  const items = [listing(), listing({ id: "b0000000-0000-0000-0000-000000000000" })];

  render(
    <InventoryTable
      items={items}
      selectedIds={items.map((i) => i.id)}
      onToggleRow={noop}
      onToggleAll={noop}
    />,
  );

  const selectAll = screen.getByLabelText(/Seleccionar todos/);
  expect(selectAll).toBeChecked();
  expect(selectAll).toHaveAttribute("data-indeterminate", "false");
});

test("row action buttons render but stay disabled — no actions are wired yet", () => {
  render(
    <InventoryTable items={[listing()]} selectedIds={[]} onToggleRow={noop} onToggleAll={noop} />,
  );

  expect(screen.getByLabelText("Ajustes del anuncio")).toBeDisabled();
  expect(screen.getByLabelText("Eliminar anuncio")).toBeDisabled();
});

test("every listing shows the Vehículos badge, since cars is the only vertical", () => {
  render(
    <InventoryTable
      items={[listing(), listing({ id: "c0000000-0000-0000-0000-000000000000" })]}
      selectedIds={[]}
      onToggleRow={noop}
      onToggleAll={noop}
    />,
  );

  expect(screen.getAllByText("Vehículos")).toHaveLength(2);
});

test("a long title is kept on one line with the full text available on hover", () => {
  const title = "Toyota Hilux 2020 doble cabina 4x4 full extras único dueño impecable";
  render(
    <InventoryTable
      items={[listing({ title })]}
      selectedIds={[]}
      onToggleRow={noop}
      onToggleAll={noop}
    />,
  );

  expect(screen.getByTitle(title)).toBeInTheDocument();
});

test("selected rows are marked so the blue-50 style applies", () => {
  const item = listing();
  render(
    <InventoryTable
      items={[item]}
      selectedIds={[item.id]}
      onToggleRow={noop}
      onToggleAll={noop}
    />,
  );

  const row = screen.getByRole("row", { name: /Toyota Hilux/ });
  expect(within(row).getByLabelText(/Seleccionar anuncio/)).toBeChecked();
  expect(row).toHaveClass("Mui-selected");
});
