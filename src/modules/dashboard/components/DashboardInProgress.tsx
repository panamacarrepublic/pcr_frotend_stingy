"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ConstructionOutlined from "@mui/icons-material/ConstructionOutlined";

import { useDashboardScheme } from "@/components/layout/dashboard/DashboardSchemeContext";

export function DashboardInProgress() {
  const scheme = useDashboardScheme();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ minHeight: "60vh", px: 3, textAlign: "center" }}
    >
      <ConstructionOutlined sx={{ fontSize: 48, color: scheme.mutedText }} />
      <Typography variant="h6" sx={{ color: scheme.mutedText, fontWeight: 600 }}>
        Currently in progress
      </Typography>
    </Stack>
  );
}
