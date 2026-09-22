"use client";

import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";

import { display, sourceSans } from "@/theme/fonts";
import { publicTheme } from "@/theme/publicTheme";

// Scopes the marketing theme + Figma fonts to the public surface, the same way
// `(auth)/layout.tsx` scopes `authTheme`. `children` is a prop, so the pages
// under this layout stay Server Components despite the "use client" here.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={publicTheme}>
      <Box
        className={`${sourceSans.variable} ${display.variable}`}
        sx={{ minHeight: "100vh", bgcolor: "background.default" }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
}
