// Per-role dashboard chrome colors (sidebar + header). Values come from tokens —
// the single source of truth. See docs/superpowers/specs/2026-07-22-shared-dashboard-layout-design.md
import { tokens } from "@/theme/tokens";

const c = tokens.colors;

export type DashboardRole = "business" | "particular" | "admin";

export interface DashboardColorScheme {
  // chrome backgrounds
  sidebarBg: string;
  sidebarBorder: string;
  headerBg: string;
  headerTitleColor: string;
  /** Mobile brand bar. Figma fixes it to roti-dark (node 11000:36995), which is
   *  darker than the business header — they are not the same surface. */
  mobileNavBg: string;
  // nav items
  navText: string; // idle label + icon
  navActiveBg: string; // active item chip background
  navActiveText: string; // active label
  navActiveIcon: string; // active icon tint
  navHoverBg: string; // idle item hover background
  // sidebar chrome
  searchBg: string;
  divider: string;
  mutedText: string; // "Volver a Inicio", profile email, info icon
  profileNameText: string;
  badgeBg: string; // notification / count badge
}

export const dashboardSchemes: Record<DashboardRole, DashboardColorScheme> = {
  // Golden sidebar (#CAA34B), dark text — Figma node 10641-16200.
  business: {
    sidebarBg: c.roti.main,
    sidebarBorder: c.cardBorder,
    // roti-dark, not roti: the mobile design (nodes 11000:36995 and
    // 11010:15113) shows the brand bar and the header card as one continuous
    // darker block, and it is what makes the roti-filled "Nuevo" button read
    // against it. The sidebar stays roti.main.
    headerBg: c.roti.dark,
    headerTitleColor: c.white,
    mobileNavBg: c.roti.dark,
    navText: c.neutralDarkest,
    navActiveBg: c.roti.lightest,
    navActiveText: c.neutralDarkest,
    navActiveIcon: c.roti.dark,
    navHoverBg: c.whiteAlpha[20],
    searchBg: c.white,
    divider: c.whiteAlpha[30],
    mutedText: c.darkestAlpha[60],
    profileNameText: c.neutralDarkest,
    badgeBg: c.naranja.main,
  },
  // Cream sidebar — the look currently shipped.
  particular: {
    sidebarBg: c.roti.lightest,
    sidebarBorder: c.cardBorder,
    headerBg: c.roti.dark,
    headerTitleColor: c.white,
    mobileNavBg: c.roti.dark,
    navText: c.neutralDark,
    navActiveBg: c.roti.lighter,
    navActiveText: c.neutralDarkest,
    navActiveIcon: c.roti.dark,
    navHoverBg: c.thunderLightest,
    searchBg: c.white,
    divider: c.cardBorder,
    mutedText: c.neutral,
    profileNameText: c.neutralDarkest,
    badgeBg: c.naranja.main,
  },
  // Neutral gray — admin reference image. Light sidebar, #828283 header, dark badges.
  admin: {
    sidebarBg: c.thunderLightest,
    sidebarBorder: c.cardBorder,
    headerBg: c.neutral,
    headerTitleColor: c.neutralDarkest,
    mobileNavBg: c.neutral,
    navText: c.neutralDark,
    navActiveBg: c.white,
    navActiveText: c.neutralDarkest,
    navActiveIcon: c.neutralDarkest,
    navHoverBg: c.whiteAlpha[60],
    searchBg: c.white,
    divider: c.cardBorder,
    mutedText: c.neutral,
    profileNameText: c.neutralDarkest,
    badgeBg: c.neutralDarkest,
  },
};
