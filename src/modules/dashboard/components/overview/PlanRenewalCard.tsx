import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { StatCard } from "@/modules/dashboard/components/overview/StatCard";
import { Tag } from "@/modules/dashboard/components/ui/Tag";

export function PlanRenewalCard({ tier, daysLeft }: { tier: string; daysLeft: number }) {
  return (
    <StatCard
      title="Renovación de Plan"
      action={
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="caption"
            fontWeight={600}
            sx={{ textDecoration: "underline", color: "text.secondary", cursor: "pointer" }}
          >
            Renovar
          </Typography>
          <Typography
            variant="caption"
            fontWeight={600}
            sx={{ textDecoration: "underline", color: "text.secondary", cursor: "pointer" }}
          >
            Ver Detalle →
          </Typography>
        </Stack>
      }
    >
      <Stack spacing={0.5}>
        <Tag label={tier} tone="roti" />
        <Stack direction="row" alignItems="baseline" spacing={2.5}>
          <Typography variant="h4" fontWeight={600}>
            {daysLeft} días
          </Typography>
          <Typography variant="caption" color="text.secondary">
            hasta el vencimiento
          </Typography>
        </Stack>
      </Stack>
    </StatCard>
  );
}
