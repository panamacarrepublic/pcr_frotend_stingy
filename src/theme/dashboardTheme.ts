import { createTheme } from "@mui/material/styles";

import { theme as baseTheme } from "@/theme/theme";
import { tokens } from "@/theme/tokens";

const c = tokens.colors;

// Register custom palette colors on the MUI theme.
declare module "@mui/material/styles" {
  interface Palette {
    roti: { main: string; dark: string; light: string; lighter: string; lightest: string };
    naranja: { main: string; lighter: string; darkest: string };
    azul: { main: string; lighter: string; lightest: string; darkest: string };
    verde: { main: string; lightest: string };
  }
  interface PaletteOptions {
    roti?: Palette["roti"];
    naranja?: Palette["naranja"];
    azul?: Palette["azul"];
    verde?: Palette["verde"];
  }
}

// Extends base monochrome theme: adds accent palette + display-font headings.
export const dashboardTheme = createTheme(baseTheme, {
  palette: {
    roti: c.roti,
    naranja: c.naranja,
    azul: c.azul,
    verde: c.verde,
    background: { default: c.roti.lightest }, // warm cream canvas behind the shell
  },
  typography: {
    fontFamily: "var(--font-source-sans), system-ui, -apple-system, Arial, sans-serif",
    h1: { fontFamily: "var(--font-display), Georgia, serif" },
    h2: { fontFamily: "var(--font-display), Georgia, serif" },
    h3: { fontFamily: "var(--font-display), Georgia, serif" },
    h4: {
      fontFamily: "var(--font-display), Georgia, serif",
      fontSize: "2.5rem",
      lineHeight: 1,
      letterSpacing: "-0.025em",
    },
  },
});
