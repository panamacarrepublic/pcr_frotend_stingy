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

/**
 * PUBLIC SITE (marketing) tokens — Figma "Inicio • Desktop", node 10167:12355.
 *
 * Transcribed 1:1 from that frame's Figma variables. Kept SEPARATE from
 * `tokens` on purpose: the dashboard palette above holds near-miss values for
 * some of the same hues (e.g. `azul.lighter` #a3c7ff vs Figma "Color/Anakiwa"
 * #a3c6ff — one digit apart), and the public site must render the Figma value
 * without perturbing the dashboard. Consumed only by `publicTheme.ts`.
 *
 * Key = the Figma variable name, so a value can be traced back to the file.
 */
export const publicTokens = {
  colors: {
    white: "#ffffff", // Color/White
    neutralDarkest: "#060607", // Color/Neutral Darkest
    neutralDarker: "#1e1e1f", // Color/Neutral Darker
    thunder: "#231f20", // Color/Thunder
    thunderLight: "#656262", // Color/Thunder Light
    // Color/Roti * — the brand gold. Identical to `tokens.colors.roti`; spelled
    // out here so the public theme never depends on the dashboard palette.
    roti: {
      main: "#caa34b",
      light: "#d9be81",
      lighter: "#f4ecdb",
      lightest: "#f9f5ed",
      dark: "#a1823c",
      darker: "#50411e",
      darkest: "#3c3016",
    },
    // Color/Anakiwa * — the "Piezas & Accesorios" vertical.
    anakiwa: { main: "#a3c6ff", lighter: "#ecf3ff", darker: "#414f66", darkest: "#303b4c" },
    // Color/Naranja * — the "Hobbies" vertical. `tag` is a raw hex in Figma
    // (product card condition chip, node 10928:8583), not a bound variable.
    naranja: { light: "#f5a07a", lighter: "#ffd9c7", tag: "#efa083" },
    // Color/Storm Gray * — footer surface.
    stormGray: { main: "#797b84", dark: "#606269", darker: "#303134" },
    // Color/French Gray * — the "Autos" vertical (neutral).
    frenchGray: { main: "#bcbdc0", lighter: "#f1f1f2", darker: "#4b4b4c" },
    schemeBorder: "#06060726", // Color Scheme 1/Border
    schemeForeground: "#f2f2f2", // Color Scheme 1/Foreground
    // Opacity/Neutral Darkest NN — fills and hairlines over the cream canvas.
    alphaDarkest: {
      5: "#0606070d",
      15: "#06060726",
      20: "#06060733",
      30: "#0606074d",
      50: "#06060780",
      60: "#06060799",
    },
    alphaWhite: { 15: "#ffffff26", 60: "#ffffff99" }, // Opacity/White NN
  },
  layout: {
    containerLarge: 1280, // Container/container-large
    maxWidthLarge: 768, // Max Width/max-width-large
    maxWidthXsmall: 400, // Max Width/max-width-xsmall
    pagePadding: 64, // Page Padding/padding-global
    // Section Padding/padding-section-*
    sectionPadding: { small: 48, medium: 80, large: 112 },
  },
  typography: {
    // Heading/H1..H6 — "Hanley Pro" in Figma. Not licensed in this repo, so the
    // display fallback from `fonts.ts` renders it (same TODO as authTheme).
    headings: { h1: 84, h2: 60, h3: 48, h4: 40, h5: 32, h6: 26 },
    // Text/*/Normal — Source Sans Pro. Note the public body size is 18, not the
    // 16 the base theme uses.
    text: { large: 26, medium: 20, regular: 18, small: 16, tiny: 12 },
    // Headings are uppercase with letterSpacing -1% of font size in Figma.
    headingLetterSpacing: "-0.01em",
  },
  shadows: {
    xsmall: "0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    small: "0 2px 4px -2px rgba(0, 0, 0, 0.06), 0 4px 8px -2px rgba(0, 0, 0, 0.1)",
    // Figma applies these as `drop-shadow` on the filled buttons/chips.
    button: "0 4px 4px rgba(0, 0, 0, 0.1), 0 2px 2px rgba(0, 0, 0, 0.06)",
    buttonFlat: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },
} as const;

export type PublicTokens = typeof publicTokens;
