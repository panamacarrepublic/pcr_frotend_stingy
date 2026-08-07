import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { StatCard } from "@/modules/dashboard/components/overview/StatCard";

export function SoldListingsCard({ count, trendPct }: { count: number; trendPct: number }) {
  return (
    <StatCard
      title="Anuncios Vendidos"
      action={
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{ textDecoration: "underline", color: "text.secondary", cursor: "pointer", mt: 0.5 }}
        >
          Ver Historial →
        </Typography>
      }
    >
      <Stack spacing={0.25}>
        <Stack direction="row" alignItems="baseline" spacing={1.25}>
          <Typography variant="h4" fontWeight={700}>
            {count}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Anuncios marcados vendidos
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.375}>
          <Typography variant="caption" sx={{ color: "verde.main", fontWeight: 400 }}>
            ↗ {trendPct}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            este mes
          </Typography>
        </Stack>
      </Stack>
    </StatCard>
  );
}
