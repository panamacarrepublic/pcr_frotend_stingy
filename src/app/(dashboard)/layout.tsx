"use client";

import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";

import { dashboardTheme } from "@/theme/dashboardTheme";
import { display, sourceSans } from "@/theme/fonts";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <Box className={`${sourceSans.variable} ${display.variable}`} sx={{ minHeight: "100vh" }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}
