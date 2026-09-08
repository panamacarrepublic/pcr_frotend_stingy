"use client";

import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import SearchOutlined from "@mui/icons-material/SearchOutlined";

import type { DashboardProfile, NavItem } from "@/components/layout/dashboard/types";
import { SidebarNavLink } from "@/components/layout/dashboard/SidebarNavLink";
import { useDashboardScheme } from "@/components/layout/dashboard/DashboardSchemeContext";

interface Props {
  navItems: NavItem[];
  bottomNavItems: NavItem[];
  profile: DashboardProfile;
  activeKey: string;
  /** Passed down to every link; the mobile drawer uses it to close itself. */
  onNavigate?: () => void;
}

export function Sidebar({ navItems, bottomNavItems, profile, activeKey, onNavigate }: Props) {
  const scheme = useDashboardScheme();
  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Stack
      component="nav"
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: scheme.sidebarBg,
        borderRight: `1px solid ${scheme.sidebarBorder}`,
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Back to home */}
      <Box
        component={Link}
        href="/"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 2,
          pt: 2.5,
          pb: 1.5,
          textDecoration: "none",
          color: scheme.mutedText,
          "&:hover": { color: scheme.navText },
        }}
      >
        <ChevronLeft fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 500, color: "inherit" }}>
          Volver a Inicio
        </Typography>
      </Box>

      {/* Company logo area */}
      <Box sx={{ px: 2, pb: 2 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pcr_logo.svg"
          alt="Panama Car Republic"
          style={{ height: 36, width: "auto", display: "block" }}
        />
      </Box>

      {/* Decorative search */}
      <Box sx={{ px: 2, pb: 2 }}>
        <TextField
          placeholder="Buscar"
          size="small"
          fullWidth
          disabled
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" sx={{ color: scheme.mutedText }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: scheme.searchBg,
              borderRadius: 1,
              fontSize: "0.875rem",
            },
          }}
        />
      </Box>

      {/* Primary nav */}
      <Stack component="ul" sx={{ listStyle: "none", m: 0, px: 1.5, pb: 1, gap: 0.25 }}>
        {navItems.map((item) => (
          <Box component="li" key={item.key}>
            <SidebarNavLink item={item} active={item.key === activeKey} onNavigate={onNavigate} />
          </Box>
        ))}
      </Stack>

      <Divider sx={{ mx: 2, borderColor: scheme.divider }} />

      {/* Bottom nav */}
      <Stack component="ul" sx={{ listStyle: "none", m: 0, px: 1.5, py: 1, gap: 0.25 }}>
        {bottomNavItems.map((item) => (
          <Box component="li" key={item.key}>
            <SidebarNavLink item={item} active={item.key === activeKey} onNavigate={onNavigate} />
          </Box>
        ))}
      </Stack>

      <Divider sx={{ mx: 2, borderColor: scheme.divider }} />

      {/* Profile row */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 2.5, mt: "auto" }}>
        <Avatar
          src={profile.avatarUrl}
          alt={profile.name}
          sx={{
            width: 36,
            height: 36,
            bgcolor: "roti.main",
            color: "common.white",
            fontSize: "0.875rem",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {!profile.avatarUrl ? initials : undefined}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: scheme.profileNameText,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {profile.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: scheme.mutedText,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {profile.email}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
