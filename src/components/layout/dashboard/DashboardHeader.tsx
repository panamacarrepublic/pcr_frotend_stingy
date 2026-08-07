"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useDashboardScheme } from "@/components/layout/dashboard/DashboardSchemeContext";

export function DashboardHeader({ title, action }: { title: string; action?: ReactNode }) {
  const scheme = useDashboardScheme();

  return (
    <Box sx={{ p: "20px" }}>
      <Box
        sx={{
          bgcolor: scheme.headerBg,
          borderRadius: 1,
          px: 3,
          py: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Typography
          variant="h6"
          component="h1"
          sx={{ color: scheme.headerTitleColor, fontWeight: 700, lineHeight: 1.5 }}
        >
          {title}
        </Typography>
        {action}
      </Box>
    </Box>
  );
}
