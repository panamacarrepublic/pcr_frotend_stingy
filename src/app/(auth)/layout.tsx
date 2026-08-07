"use client";

import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";

import { authTheme } from "@/theme/authTheme";
import { display, sourceSans } from "@/theme/fonts";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={authTheme}>
      <Box className={`${sourceSans.variable} ${display.variable}`} sx={{ minHeight: "100vh" }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}
