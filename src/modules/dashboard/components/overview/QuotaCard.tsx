import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { StatCard } from "@/modules/dashboard/components/overview/StatCard";
import { ProgressBar } from "@/modules/dashboard/components/ui/ProgressBar";
import type { QuotaCardData } from "@/modules/dashboard/types";
import { QUOTA_ICONS } from "@/modules/dashboard/components/overview/quotaIcons";

const TONE = { warm: "naranja", info: "azul", default: "neutral" } as const;

const ACTION_COLOR = {
  warm: "naranja.darkest",
  info: "azul.darkest",
  default: "text.secondary",
} as const;

export function QuotaCard({ data }: { data: QuotaCardData }) {
  const pct = Math.round((data.used / data.total) * 100);
  const tone = TONE[data.variant];
  const IconComponent = QUOTA_ICONS[data.icon];
  return (
    <StatCard
      title={data.label}
      variant={data.variant}
      icon={IconComponent ? <IconComponent fontSize="small" /> : undefined}
      action={
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{
            textDecoration: "underline",
            color: ACTION_COLOR[data.variant],
            cursor: "pointer",
            mt: 0.875,
          }}
        >
          Ver todos →
        </Typography>
      }
    >
      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 0.625 }}>
        <Typography variant="h4" fontWeight={600}>
          {data.used}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          de {data.total} disponibles
        </Typography>
      </Stack>
      <ProgressBar value={pct} tone={tone} />
    </StatCard>
  );
}
