import { tokens } from "@/theme/tokens";

/**
 * The two account kinds are not just different fields — Figma gives them
 * different chrome: the particular panel is the cream auth canvas, the business
 * panel is a solid gold surface with white type.
 *
 * Collected here so a component only asks "which variant" instead of repeating
 * a colour decision in every `sx`.
 */
export interface SignupVariantStyle {
  panelBg: string;
  text: string;
  mutedText: string;
  fieldBg: string;
  fieldBorder: string;
  placeholder: string;
  submitBg: string;
  submitHoverBg: string;
  submitText: string;
  /** Selected pill in the account-kind toggle. */
  toggleActiveBg: string;
  toggleActiveText: string;
  toggleTrackBorder: string;
  divider: string;
}

export const signupVariants: Record<"regular" | "business", SignupVariantStyle> = {
  regular: {
    panelBg: tokens.colors.canvas,
    text: tokens.colors.neutralDarkest,
    mutedText: tokens.colors.textSecondary,
    fieldBg: tokens.colors.foreground,
    fieldBorder: tokens.colors.border,
    placeholder: tokens.colors.neutral,
    submitBg: tokens.colors.roti.main,
    submitHoverBg: tokens.colors.roti.dark,
    submitText: tokens.colors.white,
    toggleActiveBg: tokens.colors.roti.light,
    toggleActiveText: tokens.colors.neutralDarkest,
    toggleTrackBorder: tokens.colors.border,
    divider: tokens.colors.border,
  },
  business: {
    // roti.dark, not roti.main: it matches the mock's deeper gold and lifts
    // white type toward a readable contrast ratio.
    panelBg: tokens.colors.roti.dark,
    text: tokens.colors.white,
    mutedText: tokens.colors.whiteAlpha[60],
    fieldBg: tokens.colors.whiteAlpha[10],
    fieldBorder: tokens.colors.whiteAlpha[20],
    placeholder: tokens.colors.whiteAlpha[60],
    submitBg: tokens.colors.roti.light,
    submitHoverBg: tokens.colors.roti.lighter,
    submitText: tokens.colors.neutralDarkest,
    toggleActiveBg: tokens.colors.white,
    toggleActiveText: tokens.colors.neutralDarkest,
    toggleTrackBorder: tokens.colors.whiteAlpha[30],
    divider: tokens.colors.whiteAlpha[20],
  },
};
