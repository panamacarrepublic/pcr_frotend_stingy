import { tokens } from "@/theme/tokens";

// Shared input look (white bg, hairline border, 8px radius, gold focus ring) —
// matches the Figma form inputs. Used by RhfTextField + RhfSelect. Promote to a
// theme `MuiOutlinedInput` override if a third consumer appears.
export const inputSx = {
  bgcolor: tokens.colors.white,
  "& .MuiOutlinedInput-root": {
    borderRadius: `${tokens.radius.md}px`,
    "& fieldset": { borderColor: tokens.colors.border },
    "&:hover fieldset": { borderColor: tokens.colors.neutral },
    "&.Mui-focused fieldset": { borderColor: tokens.colors.roti.main, borderWidth: 1 },
  },
} as const;
