import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { dashboardTheme } from "@/theme/dashboardTheme";
import { QuotaCard } from "@/modules/dashboard/components/overview/QuotaCard";
import { SoldListingsCard } from "@/modules/dashboard/components/overview/SoldListingsCard";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={dashboardTheme}>{ui}</ThemeProvider>);

it("QuotaCard shows used/total and a progressbar at the right %", () => {
  wrap(
    <QuotaCard
      data={{
        key: "autos",
        label: "Anuncios Autos",
        icon: "directions_car",
        used: 23,
        total: 50,
        variant: "default",
      }}
    />,
  );
  expect(screen.getByText("23")).toBeInTheDocument();
  expect(screen.getByText("de 50 disponibles")).toBeInTheDocument();
  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("46"); // round(23/50*100)
});

it("SoldListingsCard shows the trend", () => {
  wrap(<SoldListingsCard count={47} trendPct={12} />);
  expect(screen.getByText("47")).toBeInTheDocument();
  expect(screen.getByText(/12%/)).toBeInTheDocument();
});
