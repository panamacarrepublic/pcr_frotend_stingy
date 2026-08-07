import Box from "@mui/material/Box";
import { tokens } from "@/theme/tokens";

const TONE = {
  azul: { bg: "azul.lightest", fg: "azul.darkest" },
  verde: { bg: "verde.lightest", fg: "verde.main" },
  roti: { bg: "roti.lighter", fg: "roti.dark" },
  naranja: { bg: "naranja.lighter", fg: "naranja.darkest" },
  // thunderLightest is a flat token, not a palette key — use the raw value.
  neutral: { bg: tokens.colors.thunderLightest, fg: "text.primary" },
} as const;

export function Tag({ label, tone = "neutral" }: { label: string; tone?: keyof typeof TONE }) {
  const t = TONE[tone];
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1,
        py: 0.25,
        borderRadius: 999,
        bgcolor: t.bg,
        color: t.fg,
        fontSize: "0.75rem",
        fontWeight: 600,
        lineHeight: 1.5,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Box>
  );
}
