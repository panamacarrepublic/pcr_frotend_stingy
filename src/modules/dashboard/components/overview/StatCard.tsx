import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { tokens } from "@/theme/tokens";

const VARIANT = {
  default: { bg: tokens.colors.white, border: tokens.colors.cardBorder },
  warm: { bg: tokens.colors.naranja.lighter, border: tokens.colors.naranja.main },
  info: { bg: tokens.colors.azul.lightest, border: tokens.colors.azul.lighter },
} as const;

export function StatCard({
  title,
  icon,
  variant = "default",
  action,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  variant?: keyof typeof VARIANT;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const v = VARIANT[variant];
  return (
    <Card
      sx={{
        p: 2.5,
        height: "100%",
        bgcolor: v.bg,
        border: `1px solid ${v.border}`,
        boxShadow: "none",
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" fontWeight={600}>
          {title}
        </Typography>
        {icon}
      </Stack>
      <Stack sx={{ flexGrow: 1 }}>{children}</Stack>
      {action}
    </Card>
  );
}
