import { createTheme } from "@mui/material/styles";

import { theme as baseTheme } from "@/theme/theme";
import { publicTokens as pt } from "@/theme/tokens";

/**
 * Theme for the PUBLIC (marketing) surface — Figma "Inicio • Desktop".
 *
 * Same pattern as `authTheme.ts`: inherits the base theme and overrides only
 * what the marketing design changes. It is scoped by `app/(public)/layout.tsx`,
 * so the dashboard and auth surfaces are untouched.
 *
 * Two things differ structurally from the base theme and are the reason this
 * file exists at all:
 *   1. Type scale. Figma's H1 is 84px (base theme: 56) and body is 18px
 *      (base: 16). Nothing about the marketing scale matches the app scale.
 *   2. Palette. The canvas is Roti Lightest cream, not white, and the primary
 *      action is the brand gold rather than the monochrome near-black.
 *
 * Headings use "Hanley Pro" in Figma. It is not licensed in this repo, so the
 * `display` fallback from `fonts.ts` stands in — same TODO as `authTheme.ts`.
 */

/**
 * The two darkest steps of the Roti ramp are heading colours in Figma (H1 uses
 * Darkest, H2 uses Darker) and have no natural MUI palette slot, so they get
 * one — components reference `brand.darkest` instead of reaching for a token.
 */
declare module "@mui/material/styles" {
  interface Palette {
    brand: { darker: string; darkest: string };
  }
  interface PaletteOptions {
    brand?: { darker: string; darkest: string };
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    /** Filled brand gold — the primary action (Iniciar, Buscar, Registrarse). */
    brand: true;
    /** Translucent dark over the cream canvas (Crear Cuenta, Ver todo). */
    soft: true;
    /** Translucent white over a photo (Explorar, Ver). */
    glass: true;
  }
}

const rem = (px: number) => `${px / 16}rem`;

const { down } = baseTheme.breakpoints;

/**
 * Figma only specifies the 1440px desktop frame. The smaller steps are ours:
 * each heading drops roughly a third by `xs` so the display type stays
 * readable on a phone without reflowing the layout.
 */
const heading = (desktop: number, md: number, xs: number) => ({
  fontFamily: "var(--font-display), Georgia, serif",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  lineHeight: 1,
  letterSpacing: pt.typography.headingLetterSpacing,
  fontSize: rem(desktop),
  [down("lg")]: { fontSize: rem(md) },
  [down("sm")]: { fontSize: rem(xs) },
});

const body = (px: number) => ({
  fontSize: rem(px),
  lineHeight: 1.5,
});

export const publicTheme = createTheme(baseTheme, {
  palette: {
    // `light`/`dark` are pinned to the Figma ramp rather than left to MUI's
    // automatic lighten/darken, which lands near but not on the brand values.
    primary: {
      main: pt.colors.roti.main,
      light: pt.colors.roti.light,
      dark: pt.colors.roti.dark,
      contrastText: pt.colors.white,
    },
    brand: { darker: pt.colors.roti.darker, darkest: pt.colors.roti.darkest },
    text: { primary: pt.colors.neutralDarkest, secondary: pt.colors.neutralDarker },
    background: { default: pt.colors.roti.lightest, paper: pt.colors.white },
    divider: pt.colors.schemeBorder,
  },
  typography: {
    fontFamily: "var(--font-source-sans), system-ui, -apple-system, Arial, sans-serif",
    h1: heading(pt.typography.headings.h1, 56, 40),
    h2: heading(pt.typography.headings.h2, 44, 32),
    h3: heading(pt.typography.headings.h3, 36, 28),
    h4: heading(pt.typography.headings.h4, 32, 26),
    h5: { ...heading(pt.typography.headings.h5, 28, 24), lineHeight: 1.1 },
    h6: { ...heading(pt.typography.headings.h6, 22, 20), lineHeight: 1.1 },
    // Figma's Text/* ramp. `subtitle1` > `subtitle2` > `body1` > `body2` keeps
    // MUI's own size ordering intact.
    subtitle1: body(pt.typography.text.large), // Text/Large — hero lead
    subtitle2: body(pt.typography.text.medium), // Text/Medium — section lead
    body1: body(pt.typography.text.regular), // Text/Regular — default copy
    body2: body(pt.typography.text.small), // Text/Small
    caption: body(pt.typography.text.tiny),
    button: { fontSize: rem(pt.typography.text.regular), fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true, variant: "brand" },
      styleOverrides: {
        root: {
          borderRadius: baseTheme.shape.borderRadius,
          paddingInline: baseTheme.spacing(3),
          paddingBlock: baseTheme.spacing(1.25),
          whiteSpace: "nowrap",
        },
      },
      variants: [
        {
          props: { variant: "brand" },
          style: {
            backgroundColor: pt.colors.roti.main,
            color: pt.colors.white,
            boxShadow: pt.shadows.button,
            "&:hover": { backgroundColor: pt.colors.roti.dark, boxShadow: pt.shadows.button },
          },
        },
        {
          props: { variant: "soft" },
          style: {
            backgroundColor: pt.colors.alphaDarkest[15],
            color: pt.colors.neutralDarker,
            boxShadow: pt.shadows.buttonFlat,
            "&:hover": { backgroundColor: pt.colors.alphaDarkest[20] },
          },
        },
        {
          props: { variant: "glass" },
          style: {
            backgroundColor: pt.colors.alphaWhite[15],
            color: pt.colors.white,
            boxShadow: pt.shadows.buttonFlat,
            "&:hover": { backgroundColor: pt.colors.alphaWhite[60], color: pt.colors.neutralDarkest },
          },
        },
      ],
    },
    // Figma draws every input as a filled 5%-dark rectangle with a 15% hairline,
    // never MUI's notched outline. Centralised here so no `sx` repeats it.
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: pt.colors.alphaDarkest[5],
          borderRadius: baseTheme.shape.borderRadius,
          fontSize: rem(pt.typography.text.regular),
          "& .MuiOutlinedInput-notchedOutline": { borderColor: pt.colors.alphaDarkest[15] },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: pt.colors.alphaDarkest[30] },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: pt.colors.roti.main,
            borderWidth: 1,
          },
        },
        input: { paddingBlock: baseTheme.spacing(1), paddingInline: baseTheme.spacing(1.5) },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: { padding: baseTheme.spacing(0.75), color: pt.colors.alphaDarkest[30] },
      },
    },
    MuiLink: {
      defaultProps: { underline: "hover" },
      styleOverrides: { root: { color: "inherit" } },
    },
  },
});

/** Shared page gutter — Figma `Page Padding/padding-global` (64px), tapered on small screens. */
export const pageGutter = { xs: 3, md: 6, lg: pt.layout.pagePadding / 8 } as const;

/** Vertical rhythm — Figma `Section Padding/padding-section-*`, in theme spacing units. */
export const sectionPadding = {
  small: { xs: 4, md: pt.layout.sectionPadding.small / 8 },
  medium: { xs: 6, md: pt.layout.sectionPadding.medium / 8 },
  large: { xs: 8, md: pt.layout.sectionPadding.large / 8 },
} as const;

/** Figma `Container/container-large` — the 1280px content column. */
export const containerMaxWidth = pt.layout.containerLarge;
