"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useCallback, useState } from "react";

import { useDashboardScheme } from "@/components/layout/dashboard/DashboardSchemeContext";
import { dashboardChromeMessages } from "@/components/layout/dashboard/messages";
import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import type { DashboardProfile, NavItem } from "@/components/layout/dashboard/types";
import { tokens } from "@/theme/tokens";

const m = dashboardChromeMessages;

/** Figma "Navbar Mobile" (node 11010:15043) — logo left, hamburger right. */
const LOGO_WIDTH = 158;
const LOGO_HEIGHT = 53;
/** The permanent sidebar's width; the drawer matches it, capped on small phones. */
const DRAWER_WIDTH = 312;

interface Props {
  navItems: NavItem[];
  bottomNavItems: NavItem[];
  profile: DashboardProfile;
  activeKey: string;
}

/**
 * The dashboard's mobile chrome: a brand bar with a hamburger, and the drawer it
 * opens. Below `md` this replaces the permanent sidebar entirely.
 *
 * It owns the open/closed state, which is why it is the only client component in
 * the shell — `DashboardShell` itself stays a Server Component.
 *
 * The bar has its own colour in the scheme rather than reusing `headerBg`: the
 * design fills it with roti-dark (node 11000:36995), which is a shade darker
 * than the business header card sitting below it.
 */
export function DashboardMobileNav({ navItems, bottomNavItems, profile, activeKey }: Props) {
  const scheme = useDashboardScheme();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  return (
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      <Stack
        component="header"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ bgcolor: scheme.mobileNavBg, py: "20px", pl: "20px", pr: "12px" }}
      >
        {/* Matches the Sidebar's own logo treatment — an inline SVG asset that
            next/image would only wrap without optimising. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pcr_logo.svg"
          alt={m.brand}
          style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT, display: "block" }}
        />
        <IconButton
          aria-label={m.openMenu}
          onClick={() => setOpen(true)}
          sx={{ width: 48, height: 48, color: tokens.colors.white }}
        >
          <MenuIcon />
        </IconButton>
      </Stack>

      <Drawer
        anchor="left"
        open={open}
        onClose={close}
        // Phones swipe faster than they render; keeping the tree mounted avoids
        // re-creating the whole nav on every open.
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: DRAWER_WIDTH, maxWidth: "85vw" } }}
      >
        <Box sx={{ position: "relative", height: "100%" }}>
          <IconButton
            aria-label={m.closeMenu}
            onClick={close}
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, color: scheme.navText }}
          >
            <CloseIcon />
          </IconButton>
          <Sidebar
            navItems={navItems}
            bottomNavItems={bottomNavItems}
            profile={profile}
            activeKey={activeKey}
            onNavigate={close}
          />
        </Box>
      </Drawer>
    </Box>
  );
}
