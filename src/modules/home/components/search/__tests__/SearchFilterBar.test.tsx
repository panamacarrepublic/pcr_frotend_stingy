import { ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { publicTheme } from "@/theme/publicTheme";

import type { SearchCriteria } from "../../../schemas/search.schema";
import { SearchFilterBar } from "../SearchFilterBar";

const renderBar = (onSearch?: (criteria: SearchCriteria) => void) =>
  render(
    <ThemeProvider theme={publicTheme}>
      <SearchFilterBar onSearch={onSearch} />
    </ThemeProvider>,
  );

const submit = () => fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

describe("SearchFilterBar", () => {
  it("submits the default vertical with an empty query", async () => {
    const onSearch = jest.fn();
    renderBar(onSearch);

    submit();

    await waitFor(() => expect(onSearch).toHaveBeenCalledTimes(1));
    expect(onSearch).toHaveBeenCalledWith({
      vertical: "cars",
      query: "",
      location: "",
      priceRange: "",
      year: "",
    });
  });

  it("emits the canonical backend value when another vertical is picked", async () => {
    const onSearch = jest.fn();
    renderBar(onSearch);

    // The label is Spanish ("Piezas & Accesorios"); the value must be "parts".
    fireEvent.click(screen.getByRole("radio", { name: /Piezas & Accesorios/ }));
    submit();

    await waitFor(() => expect(onSearch).toHaveBeenCalled());
    expect(onSearch.mock.calls[0][0]).toMatchObject({ vertical: "parts" });
  });

  it("trims the query before handing it over", async () => {
    const onSearch = jest.fn();
    renderBar(onSearch);

    fireEvent.change(screen.getByLabelText("¿Qué estás buscando?"), {
      target: { value: "  hilux  " },
    });
    submit();

    await waitFor(() => expect(onSearch).toHaveBeenCalled());
    expect(onSearch.mock.calls[0][0]).toMatchObject({ query: "hilux" });
  });

  it("orders the verticals as Figma does: Autos, Piezas, Hobbies", () => {
    renderBar();
    const values = screen.getAllByRole("radio").map((radio) => radio.getAttribute("value"));
    expect(values).toEqual(["cars", "parts", "collectibles"]);
  });

  it("falls back to logging when no handler is supplied", async () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    renderBar();

    submit();

    await waitFor(() => expect(log).toHaveBeenCalled());
    expect(log.mock.calls[0][0]).toBe("[home] búsqueda:");
    log.mockRestore();
  });
});
