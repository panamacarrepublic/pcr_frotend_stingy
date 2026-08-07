import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { dashboardTheme } from "@/theme/dashboardTheme";
import { Tag } from "@/modules/dashboard/components/ui/Tag";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={dashboardTheme}>{ui}</ThemeProvider>);

it("renders the label", () => {
  wrap(<Tag label="Activo" tone="verde" />);
  expect(screen.getByText("Activo")).toBeInTheDocument();
});
