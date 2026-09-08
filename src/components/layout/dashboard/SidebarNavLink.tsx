"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

import type { NavItem } from "@/components/layout/dashboard/types";
import { NAV_ICONS } from "@/components/layout/dashboard/navIcons";
import { useDashboardScheme } from "@/components/layout/dashboard/DashboardSchemeContext";

interface Props {
  item: NavItem;
  active: boolean;
  /** Fires on click so a drawer host can close itself after navigation. */
  onNavigate?: () => void;
}

export function SidebarNavLink({ item, active, onNavigate }: Props) {
  const scheme = useDashboardScheme();
  const Icon = NAV_ICONS[item.icon];

  return (
    <Box
      component={Link}
      href={item.href}
      onClick={onNavigate}
      sx={{ textDecoration: "none", display: "block" }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 1,
          color: active ? scheme.navActiveText : scheme.navText,
          bgcolor: active ? scheme.navActiveBg : "transparent",
          fontWeight: active ? 600 : 400,
          transition: "background-color 0.15s ease",
          "&:hover": {
            bgcolor: active ? scheme.navActiveBg : scheme.navHoverBg,
          },
        }}
      >
        {Icon ? (
          <Icon
            fontSize="small"
            sx={{ color: active ? scheme.navActiveIcon : scheme.navText, flexShrink: 0 }}
          />
        ) : null}

        <Typography
          variant="body2"
          sx={{ flexGrow: 1, fontWeight: active ? 600 : 400, color: "inherit", lineHeight: 1.4 }}
        >
          {item.label}
        </Typography>

        {item.badge != null ? (
          <Box
            component="span"
            sx={{
              bgcolor: scheme.badgeBg,
              color: "common.white",
              borderRadius: 999,
              px: 0.75,
              py: 0.125,
              fontSize: "0.75rem",
              fontWeight: 600,
              lineHeight: 1.5,
              minWidth: "1.25rem",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {item.badge}
          </Box>
        ) : item.info ? (
          <InfoOutlined fontSize="small" sx={{ color: scheme.mutedText, opacity: 0.7, flexShrink: 0 }} />
        ) : null}
      </Stack>
    </Box>
  );
}
