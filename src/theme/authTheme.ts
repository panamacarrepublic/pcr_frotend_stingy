import { createTheme } from "@mui/material/styles";

import { theme as baseTheme } from "@/theme/theme";

// Inherits the base monochrome theme; overrides ONLY typography so the login
// uses the real body font + a display heading. Palette/shape/components inherit.
export const authTheme = createTheme(baseTheme, {
  typography: {
    fontFamily: "var(--font-source-sans), system-ui, -apple-system, Arial, sans-serif",
    h4: {
      fontFamily: "var(--font-display), Georgia, serif",
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
      fontSize: "2.5rem",
      [baseTheme.breakpoints.down("md")]: { fontSize: "1.75rem" },
    },
  },
});
