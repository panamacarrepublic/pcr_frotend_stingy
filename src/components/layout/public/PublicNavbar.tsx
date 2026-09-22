"use client";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { homeMessages } from "@/modules/home/messages";
import { pageGutter } from "@/theme/publicTheme";

const m = homeMessages.nav;

type NavItem = { label: string; href: string; hasSubmenu?: boolean };

// `hasSubmenu` only renders Figma's chevron today — the submenus themselves are
// not in this scope, so the item still navigates to its category feed.
const NAV_ITEMS: readonly NavItem[] = [
  { label: m.home, href: "/" },
  { label: m.parts, href: "/listings?category=parts", hasSubmenu: true },
  { label: m.vehicles, href: "/listings?category=cars" },
  { label: m.hobbies, href: "/listings?category=collectibles" },
  { label: m.more, href: "/listings", hasSubmenu: true },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Stack
      component={Link}
      href={item.href}
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{
        typography: "body1",
        fontWeight: active ? 700 : 400,
        color: active ? "primary.dark" : "text.primary",
        "&:hover": { color: "primary.dark" },
      }}
    >
      <Box component="span">{item.label}</Box>
      {item.hasSubmenu ? <KeyboardArrowDownIcon fontSize="small" /> : null}
    </Stack>
  );
}

function AuthActions({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <>
      <Button
        variant="soft"
        component={Link}
        href="/registro"
        fullWidth={fullWidth}
      >
        {m.signUp}
      </Button>
      <Button component={Link} href="/login" fullWidth={fullWidth}>
        {m.signIn}
      </Button>
    </>
  );
}

/** Public site navigation (Figma 10175:32001). */
export function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "background.default", boxShadow: "none" }}
    >
      <Toolbar
        disableGutters
        sx={{ px: pageGutter, minHeight: { xs: 64, md: 72 }, gap: 3 }}
      >
        <Link href="/" aria-label={m.logoAlt}>
          <Image
            src="/images/home/brand/logo.svg"
            alt={m.logoAlt}
            width={191}
            height={79}
            priority
            style={{ height: "auto", width: 158 }}
          />
        </Link>

        <Stack
          direction="row"
          spacing={4}
          sx={{ display: { xs: "none", lg: "flex" }, flexGrow: 1 }}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} item={item} active={item.href === "/"} />
          ))}
        </Stack>

        <Box sx={{ flexGrow: { xs: 1, lg: 0 } }} />

        <Stack
          direction="row"
          spacing={2}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <AuthActions />
        </Stack>

        <IconButton
          aria-label={m.openMenu}
          onClick={() => setMenuOpen(true)}
          sx={{
            display: { xs: "inline-flex", lg: "none" },
            color: "text.primary",
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box
          sx={{
            width: 280,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          role="navigation"
          onClick={() => setMenuOpen(false)}
        >
          {NAV_ITEMS.map((item) => (
            <Typography
              key={item.label}
              component={Link}
              href={item.href}
              variant="body1"
            >
              {item.label}
            </Typography>
          ))}
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <AuthActions fullWidth />
          </Stack>
        </Box>
      </Drawer>
    </AppBar>
  );
}
