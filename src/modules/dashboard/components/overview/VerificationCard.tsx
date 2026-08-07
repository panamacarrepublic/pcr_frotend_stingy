import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { StatCard } from "@/modules/dashboard/components/overview/StatCard";
import { Tag } from "@/modules/dashboard/components/ui/Tag";

export function VerificationCard({
  status,
  detail,
  active,
}: {
  status: string;
  detail: string;
  active: boolean;
}) {
  return (
    <StatCard title="Estado de Verificación">
      <Stack spacing={0.875}>
        <Typography variant="h4" fontWeight={700}>
          {status}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ pb: 0.875 }}>
          {detail}
        </Typography>
        {active && <Tag label="Activo" tone="verde" />}
      </Stack>
    </StatCard>
  );
}
