import { createTheme } from "@mui/material/styles";

import { tokens } from "@/theme/tokens";

// Extend the MUI background palette with our warm cream canvas.
declare module "@mui/material/styles" {
  interface TypeBackground {
    canvas: string;
  }
}

const rem = (px: number) => `${px / 16}rem`;

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: tokens.colors.neutralDarkest, contrastText: tokens.colors.white },
    secondary: { main: tokens.colors.thunder, contrastText: tokens.colors.white },
    text: { primary: tokens.colors.neutralDarkest, secondary: tokens.colors.textSecondary },
    background: { default: tokens.colors.white, paper: tokens.colors.white, canvas: tokens.colors.canvas },
    divider: tokens.colors.border,
  },
  shape: { borderRadius: tokens.radius.md },
  spacing: tokens.spacingBase,
  breakpoints: { values: tokens.breakpoints },
  typography: {
    fontFamily: tokens.typography.fontFamily,
    h1: { fontSize: rem(tokens.typography.sizes.h1), fontWeight: tokens.typography.weights.bold, lineHeight: tokens.typography.lineHeights.tight },
    h2: { fontSize: rem(tokens.typography.sizes.h2), fontWeight: tokens.typography.weights.bold, lineHeight: tokens.typography.lineHeights.tight },
    h3: { fontSize: rem(tokens.typography.sizes.h3), fontWeight: tokens.typography.weights.semibold, lineHeight: tokens.typography.lineHeights.tight },
    h4: { fontSize: rem(tokens.typography.sizes.h4), fontWeight: tokens.typography.weights.semibold, lineHeight: tokens.typography.lineHeights.tight },
    h5: { fontSize: rem(tokens.typography.sizes.h5), fontWeight: tokens.typography.weights.semibold, lineHeight: tokens.typography.lineHeights.normal },
    h6: { fontSize: rem(tokens.typography.sizes.h6), fontWeight: tokens.typography.weights.semibold, lineHeight: tokens.typography.lineHeights.normal },
    body1: { fontSize: rem(tokens.typography.sizes.body1), lineHeight: tokens.typography.lineHeights.normal },
    body2: { fontSize: rem(tokens.typography.sizes.body2), lineHeight: tokens.typography.lineHeights.normal },
    button: { fontSize: rem(tokens.typography.sizes.button), fontWeight: tokens.typography.weights.semibold, textTransform: "none" },
    caption: { fontSize: rem(tokens.typography.sizes.caption), lineHeight: tokens.typography.lineHeights.normal },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: tokens.radius.sm, textTransform: "none", paddingInline: 20, paddingBlock: 10 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "medium" },
    },
    MuiPaper: {
      styleOverrides: { rounded: { borderRadius: tokens.radius.md } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { borderRadius: tokens.radius.md, boxShadow: tokens.shadows.card } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
    },
  },
});
