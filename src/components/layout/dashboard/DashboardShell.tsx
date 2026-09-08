import type { ReactNode } from "react";
import Box from "@mui/material/Box";

import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
import { DashboardMobileNav } from "@/components/layout/dashboard/DashboardMobileNav";
import { DashboardSchemeProvider } from "@/components/layout/dashboard/DashboardSchemeContext";
import type { DashboardProfile, NavItem } from "@/components/layout/dashboard/types";
import type { DashboardRole } from "@/theme/dashboardSchemes";

interface Props {
  role: DashboardRole;
  navItems: NavItem[];
  bottomNavItems: NavItem[];
  profile: DashboardProfile;
  activeKey: string;
  headerTitle: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function DashboardShell({
  role,
  navItems,
  bottomNavItems,
  profile,
  activeKey,
  headerTitle,
  headerAction,
  children,
}: Props) {
  return (
    <DashboardSchemeProvider role={role}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        {/* Below md the sidebar collapses into this bar's drawer. It sits
            outside the flex row so its `banner` landmark stays top level. */}
        <DashboardMobileNav
          navItems={navItems}
          bottomNavItems={bottomNavItems}
          profile={profile}
          activeKey={activeKey}
        />

        <Box sx={{ display: "flex", flexGrow: 1, minHeight: 0 }}>
          {/* Permanent sidebar — md and up only. */}
          <Box
            sx={{
              width: 312,
              flexShrink: 0,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              position: "sticky",
              top: 0,
              height: "100vh",
            }}
          >
            <Sidebar
              navItems={navItems}
              bottomNavItems={bottomNavItems}
              profile={profile}
              activeKey={activeKey}
            />
          </Box>

          {/* Main content */}
          <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
            <DashboardHeader title={headerTitle} action={headerAction} />
            {children}
          </Box>
        </Box>
      </Box>
    </DashboardSchemeProvider>
  );
}
