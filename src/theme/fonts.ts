import { Bricolage_Grotesque, Source_Sans_3 } from "next/font/google";

// Body font — exact Figma match (Source Sans). Scoped to the (auth) subtree.
export const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
});

// Heading DISPLAY FALLBACK for Hanley Pro (commercial, not yet licensed here).
// TODO: swap for next/font/local Hanley Pro when the font files are available.
export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});
