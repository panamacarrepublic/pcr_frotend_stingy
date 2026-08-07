import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { dashboardTheme } from "@/theme/dashboardTheme";
import { MessagesPanel } from "@/modules/dashboard/components/overview/MessagesPanel";
import { dashboardMock } from "@/modules/dashboard/mockData";

const wrap = () =>
  render(
    <ThemeProvider theme={dashboardTheme}>
      <MessagesPanel messages={dashboardMock.messages} reviews={dashboardMock.reviews} />
    </ThemeProvider>,
  );

it("shows messages by default and filters to reviews on the Comentarios tab", () => {
  wrap();
  expect(screen.getByText("Ricardo Ramirez")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: /Comentarios/i }));
  expect(screen.queryByText("Ricardo Ramirez")).not.toBeInTheDocument();
  expect(screen.getByText("Toyota Prado 2020")).toBeInTheDocument();
});

it("filters the list by search text", () => {
  wrap();
  fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "zzz" } });
  expect(screen.queryByText("Ricardo Ramirez")).not.toBeInTheDocument();
});
