import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { dashboardTheme } from "@/theme/dashboardTheme";
import { ProgressBar } from "@/modules/dashboard/components/ui/ProgressBar";

it("clamps value into 0-100 aria range", () => {
  const { getByRole } = render(
    <ThemeProvider theme={dashboardTheme}>
      <ProgressBar value={150} />
    </ThemeProvider>,
  );
  expect(getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
});
