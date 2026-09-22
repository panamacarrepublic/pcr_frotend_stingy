import { publicTokens as pt } from "@/theme/tokens";

/**
 * Static content for the public home, transcribed from Figma
 * "Inicio • Desktop" (10167:12355).
 *
 * The listing cards are placeholder content from the design, not API data —
 * the home is not wired to the backend yet. When it is, `FEATURED_LISTINGS` is
 * replaced by a TanStack Query hook in `src/hooks/` and nothing else here moves.
 */

/**
 * The three marketplace verticals.
 *
 * The ids are the canonical backend category values (they mirror
 * `listingCategoryEnum` in the listings module, which this module must not
 * import from). Keeping them identical means the search bar can emit
 * `?category=cars` straight into the listings feed later.
 */
export type VerticalId = "cars" | "parts" | "collectibles";

export type Vertical = {
  id: VerticalId;
  /** Spanish label, as shown in the Figma radio group and category cards. */
  label: string;
  /** Figma renders the vertical name as artwork, not text — hence the SVG. */
  labelSrc: string;
  /** Intrinsic size of `labelSrc`; each wordmark is a different shape. */
  labelWidth: number;
  labelHeight: number;
  mascotSrc: string;
  mascotAlt: string;
  href: string;
  /** Card surface + arrow-button fill for this vertical, per Figma. */
  surface: string;
  accent: string;
  onAccent: string;
};

/** Card order, matching the Figma row: Piezas, Autos, Hobbies. */
export const VERTICALS: readonly Vertical[] = [
  {
    id: "parts",
    label: "🔧 Piezas & Accesorios",
    labelSrc: "/images/home/category/label-piezas.svg",
    labelWidth: 208,
    labelHeight: 75,
    mascotSrc: "/images/home/category/mascot-piezas.png",
    mascotAlt: "Mecánico de Panama Car Republic sosteniendo una llave inglesa",
    href: "/listings?category=parts",
    surface: pt.colors.anakiwa.lighter,
    accent: pt.colors.anakiwa.main,
    onAccent: pt.colors.anakiwa.darkest,
  },
  {
    id: "cars",
    label: "🚗 Autos",
    labelSrc: "/images/home/category/label-autos.svg",
    labelWidth: 185,
    labelHeight: 67,
    mascotSrc: "/images/home/category/mascot-autos.png",
    mascotAlt: "Vendedor de Panama Car Republic junto a un vehículo",
    href: "/listings?category=cars",
    surface: pt.colors.frenchGray.lighter,
    accent: pt.colors.frenchGray.main,
    onAccent: pt.colors.frenchGray.darker,
  },
  {
    id: "collectibles",
    label: "🎮 Hobbies",
    labelSrc: "/images/home/category/label-hobbies.svg",
    labelWidth: 215,
    labelHeight: 59,
    mascotSrc: "/images/home/category/mascot-hobbies.png",
    mascotAlt: "Coleccionista de Panama Car Republic sosteniendo un auto a escala",
    href: "/listings?category=collectibles",
    surface: pt.colors.naranja.lighter,
    accent: pt.colors.naranja.light,
    onAccent: pt.colors.thunder,
  },
] as const;

/**
 * Radio order in the search bar, which Figma lists differently from the cards:
 * Autos first there, Piezas first in the card row.
 */
export const SEARCH_VERTICAL_ORDER: readonly VerticalId[] = ["cars", "parts", "collectibles"];

export const getVertical = (id: VerticalId) => {
  const vertical = VERTICALS.find((candidate) => candidate.id === id);
  if (!vertical) throw new Error(`Vertical desconocido: ${id}`);
  return vertical;
};

/**
 * The three rotated wordmarks layered over the bottom of the hero headline.
 *
 * Figma places them absolutely inside a 1280x335 frame; the offsets below are
 * expressed as percentages of the 626x176 box they collectively occupy (their
 * union from x=0,y=180 to x=626,y=356), so the cluster scales as one unit.
 */
export const HERO_BADGE_BOX = { width: 626, height: 176 } as const;

export const HERO_BADGES = [
  // Intrinsic w/h are the exported SVG's own size, not the Figma frame's.
  { src: "/images/home/hero/badge-autos.svg", width: 309, height: 108, left: "35.8%", top: "0%", scale: "47.4%" },
  { src: "/images/home/hero/badge-piezas.svg", width: 333, height: 117, left: "0%", top: "42%", scale: "51.3%" },
  { src: "/images/home/hero/badge-hobbies.svg", width: 347, height: 89, left: "46.5%", top: "56.3%", scale: "53.5%" },
] as const;

export type FeaturedListing = {
  id: string;
  title: string;
  /** Integer cents — never a float. Formatted with `formatPrice`. */
  priceCents: number;
  condition: string;
  imageSrc: string;
  vertical: VerticalId;
  /** Condition-chip colours, which Figma varies per vertical. */
  chipBg: string;
  chipFg: string;
};

export const FEATURED_LISTINGS: readonly FeaturedListing[] = [
  {
    id: "alternador-denso",
    title: "Alternador Original Denso para Toyota Hilux 3.0L Turbo Diésel 2016–2020",
    priceCents: 22_000,
    condition: "Usado",
    imageSrc: "/images/home/listings/alternador-denso.png",
    vertical: "parts",
    chipBg: pt.colors.anakiwa.main,
    chipFg: pt.colors.anakiwa.darker,
  },
  {
    id: "land-cruiser-prado",
    title: "Toyota Land Cruiser Prado TXL 4x4 2020",
    priceCents: 3_850_000,
    condition: "Usado",
    imageSrc: "/images/home/listings/land-cruiser-prado.png",
    vertical: "cars",
    chipBg: pt.colors.thunderLight,
    chipFg: pt.colors.white,
  },
  {
    id: "hot-wheels-skyline",
    title: "Hot Wheels Nissan Skyline GT-R R34 – Edición Fast & Furious",
    priceCents: 1_000,
    condition: "Usado",
    imageSrc: "/images/home/listings/hot-wheels-skyline.png",
    vertical: "collectibles",
    chipBg: pt.colors.naranja.tag,
    chipFg: pt.colors.thunder,
  },
] as const;

// Figma shows whole dollars ("$220", "$38,500"), so cents are not rendered.
// `narrowSymbol` is required: es-PA defaults to the "USD 220" form because the
// local currency is the balboa, and the design uses the "$" symbol.
const priceFormatter = new Intl.NumberFormat("es-PA", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formats integer cents as Panama-market USD. */
export const formatPrice = (cents: number) => priceFormatter.format(cents / 100);
