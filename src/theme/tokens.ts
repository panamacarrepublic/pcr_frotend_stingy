// Design tokens extracted from the Figma Style Guide (node 2368:52).
// SINGLE SOURCE OF TRUTH. Never hardcode these values in components —
// reference them through the MUI theme instead.
//
// Colors below are CONFIRMED against Figma variables (2368:52):
//   Color/Neutral Darkest #060607, Color/White #ffffff, Color/Thunder #231f20,
//   Color/Neutral Darker #1e1e1f, Color Scheme 1/Foreground #f2f2f2.
// FOLLOW-UP: the type scale, border radius, and font family are the confirmed
// Relume-monochrome baseline — verify exact numbers against the Figma
// Typography/Buttons frames when they are available.

export const tokens = {
  colors: {
    // Monochrome / Relume base palette (confirmed from Figma).
    neutralDarkest: "#060607",
    neutralDarker: "#1e1e1f",
    thunder: "#231f20",
    foreground: "#f2f2f2",
    white: "#ffffff",
    // Semantic grays for text/borders (refine from Figma if specified).
    textSecondary: "#4d4d4f",
    border: "#d9d9d9",
    // Warm cream canvas (e.g. login page background).
    canvas: "#f9f5ed",
    // Dashboard accent palettes (Figma 11014-52099 variables).
    roti: { main: "#caa34b", dark: "#a1823c", light: "#d9be81", lighter: "#f4ecdb", lightest: "#f9f5ed" },
    naranja: { main: "#e15c2b", lighter: "#ffd9c7", darkest: "#4d1c0a" },
    azul: { main: "#3a86ff", lighter: "#a3c7ff", lightest: "#ecf3ff", darkest: "#132e66" },
    verde: { main: "#06893c", lightest: "#e6f7ec" },
    // Figma "Color/Rojo Intenso" — the destructive row action on the inventory
    // table (node 11010:15297). Distinct from `naranja`, which is a brand accent.
    rojoIntenso: "#eb3333",
    // Figma variable "Color/Amarillo Vibrante Light" — the primary action fill
    // on the listing detail panel (node 10694:4070, "Editar Completo").
    amarilloVibrante: { light: "#ffd666" },
    neutralDark: "#505051",
    neutral: "#828283",
    thunderLightest: "#e9e8e8",
    // Card hairline border = Neutral Darkest @ 15%.
    cardBorder: "#06060726",
    // White overlays for tinted (dark/gold) sidebars — Figma "Opacity/White".
    whiteAlpha: { 10: "#ffffff1a", 20: "#ffffff33", 30: "#ffffff4d", 60: "#ffffff99" },
    // Neutral-Darkest overlays — Figma "Opacity/Neutral Darkest".
    darkestAlpha: { 5: "#0606070d", 15: "#06060726", 40: "#06060766", 60: "#06060799" },
  },
  typography: {
    // Refine fontFamily from Figma Typography frame in Step 1.
    fontFamily: "var(--font-sans), system-ui, -apple-system, Arial, sans-serif",
    // px sizes; converted to rem in theme.ts.
    sizes: {
      h1: 56,
      h2: 44,
      h3: 36,
      h4: 28,
      h5: 22,
      h6: 18,
      body1: 16,
      body2: 14,
      button: 16,
      caption: 12,
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
    },
  },
  radius: {
    // Refine from Figma (button/card radius). Relume default is small.
    sm: 4,
    md: 8,
    lg: 12,
    pill: 999,
  },
  sizes: {
    // Figma "Max Width/max-width-small" — the login form content column.
    formMaxWidth: 480,
  },
  spacingBase: 8,
  shadows: {
    card: "0 1px 3px rgba(6, 6, 7, 0.08)",
    raised: "0 4px 12px rgba(6, 6, 7, 0.12)",
    // Figma effect "medium" — lifts the sticky actions column above the row
    // content it scrolls over.
    overlay: "0 12px 16px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.03)",
  },
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
} as const;

export type Tokens = typeof tokens;
