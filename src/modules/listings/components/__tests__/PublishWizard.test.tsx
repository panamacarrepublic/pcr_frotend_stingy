import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { dashboardTheme } from "@/theme/dashboardTheme";
import { PublishWizard } from "@/modules/listings/components/PublishWizard";

const wrap = (ui: React.ReactElement) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider theme={dashboardTheme}>{ui}</ThemeProvider>
    </QueryClientProvider>,
  );
};

it("business variant shows the method selection before the wizard", () => {
  wrap(<PublishWizard variant="business" onClose={jest.fn()} />);
  expect(screen.getByText("¿Cómo quieres subir tus anuncios hoy?")).toBeInTheDocument();
  expect(screen.queryByText("ELIGE LA CATEGORÍA DE TU ANUNCIO")).not.toBeInTheDocument();
});

it("particular variant starts at the category step (no selection screen)", () => {
  wrap(<PublishWizard variant="particular" onClose={jest.fn()} />);
  expect(screen.getByText("ELIGE LA CATEGORÍA DE TU ANUNCIO")).toBeInTheDocument();
  expect(screen.queryByText("¿Cómo quieres subir tus anuncios hoy?")).not.toBeInTheDocument();
});
