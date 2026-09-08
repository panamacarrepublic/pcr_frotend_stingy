import { fireEvent, render, screen } from "@testing-library/react";

import { useListing } from "@/hooks/useListing";

import { EditListingDialog } from "../EditListingDialog";

jest.mock("@/hooks/useListing", () => ({ useListing: jest.fn() }));
jest.mock("../EditListingForm", () => ({
  EditListingForm: ({ listing }: { listing: { title: string } }) => (
    <div>formulario de {listing.title}</div>
  ),
}));

const mockUseListing = useListing as jest.Mock;
const noop = () => {};

beforeEach(() => mockUseListing.mockReset());

const renderDialog = (props: Partial<Parameters<typeof EditListingDialog>[0]> = {}) =>
  render(<EditListingDialog listingId="listing-1" open onClose={noop} {...props} />);

test("waits for the listing before rendering the form", () => {
  mockUseListing.mockReturnValue({ data: undefined, isLoading: true, isError: false });
  renderDialog();

  expect(screen.getByText(/Cargando el anuncio/i)).toBeInTheDocument();
  expect(screen.queryByText(/formulario de/)).not.toBeInTheDocument();
});

// The form seeds its defaults from the listing exactly once, so it must not
// mount until the real values are there — otherwise every field starts empty
// and the diff would read as "the seller cleared everything".
test("renders the form seeded with the fetched listing", () => {
  mockUseListing.mockReturnValue({
    data: { title: "Toyota Hilux 2020" },
    isLoading: false,
    isError: false,
  });
  renderDialog();

  expect(screen.getByText("formulario de Toyota Hilux 2020")).toBeInTheDocument();
});

test("a failed fetch offers a retry rather than an empty form", () => {
  const refetch = jest.fn();
  mockUseListing.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch });
  renderDialog();

  expect(screen.queryByText(/formulario de/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
  expect(refetch).toHaveBeenCalled();
});

test("the close button reports back to the caller", () => {
  const onClose = jest.fn();
  mockUseListing.mockReturnValue({ data: { title: "X" }, isLoading: false, isError: false });
  renderDialog({ onClose });

  fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
  expect(onClose).toHaveBeenCalled();
});
