import LinearProgress from "@mui/material/LinearProgress";
import { tokens } from "@/theme/tokens";

const BAR = {
  naranja: tokens.colors.naranja.main,
  azul: tokens.colors.azul.main,
  neutral: tokens.colors.neutralDarkest,
};

export function ProgressBar({ value, tone = "neutral" }: { value: number; tone?: keyof typeof BAR }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <LinearProgress
      variant="determinate"
      value={clamped}
      sx={{
        height: 7,
        borderRadius: 999,
        bgcolor: tokens.colors.thunderLightest,
        "& .MuiLinearProgress-bar": { borderRadius: 999, backgroundColor: BAR[tone] },
      }}
    />
  );
}
