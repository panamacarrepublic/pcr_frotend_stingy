"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useDashboardScheme } from "@/components/layout/dashboard/DashboardSchemeContext";

export function DashboardHeader({ title, action }: { title: string; action?: ReactNode }) {
  const scheme = useDashboardScheme();

  return (
    <Box sx={{ p: "20px" }}>
      {/* Figma "Card Header / 1 /": a row on desktop, stacked on mobile with the
          actions taking the full width below the title (node 11010:15113). */}
      <Box
        sx={{
          bgcolor: scheme.headerBg,
          borderRadius: 1,
          px: { xs: "20px", md: 3 },
          py: { xs: "20px", md: 3 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: { xs: "20px", md: 3 },
        }}
      >
        <Typography
          variant="h6"
          component="h1"
          sx={{
            color: scheme.headerTitleColor,
            fontWeight: 700,
            lineHeight: 1.5,
            // 26px in the mobile design; h4 is the nearest step on the scale.
            typography: { xs: "h4", md: "h6" },
          }}
        >
          {title}
        </Typography>
        {action}
      </Box>
    </Box>
  );
}
