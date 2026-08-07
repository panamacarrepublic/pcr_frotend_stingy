import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";

import { dashboardTheme } from "@/theme/dashboardTheme";
import { MethodSelectStep } from "@/modules/listings/components/steps/MethodSelectStep";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={dashboardTheme}>{ui}</ThemeProvider>);

it("renders both options with bulk disabled and marked Próximamente", () => {
  wrap(<MethodSelectStep onNext={jest.fn()} onClose={jest.fn()} />);
  expect(screen.getByText("¿Cómo quieres subir tus anuncios hoy?")).toBeInTheDocument();
  expect(screen.getByText("Publicación manual")).toBeInTheDocument();
  expect(screen.getByText("Carga masiva")).toBeInTheDocument();
  expect(screen.getByText("Próximamente")).toBeInTheDocument();
});

it("Siguiente reports the manual method", () => {
  const onNext = jest.fn();
  wrap(<MethodSelectStep onNext={onNext} onClose={jest.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
  expect(onNext).toHaveBeenCalledWith("manual");
});

it("Cancelar closes the wizard", () => {
  const onClose = jest.fn();
  wrap(<MethodSelectStep onNext={jest.fn()} onClose={onClose} />);
  fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
  expect(onClose).toHaveBeenCalled();
});

it("bulk card is disabled and unselected", () => {
  wrap(<MethodSelectStep onNext={jest.fn()} onClose={jest.fn()} />);
  const bulkCard = screen.getByText("Carga masiva").closest('[role="radio"]');
  expect(bulkCard).toHaveAttribute("aria-disabled", "true");
  expect(bulkCard).toHaveAttribute("aria-checked", "false");
});

it("clicking bulk does not select it — Siguiente still reports manual", () => {
  const onNext = jest.fn();
  wrap(<MethodSelectStep onNext={onNext} onClose={jest.fn()} />);
  const bulkCard = screen.getByText("Carga masiva").closest('[role="radio"]');
  fireEvent.click(bulkCard!);
  fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
  expect(onNext).toHaveBeenCalledWith("manual");
  expect(onNext).not.toHaveBeenCalledWith("bulk");
});
