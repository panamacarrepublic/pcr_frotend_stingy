import type { ReactNode } from "react";
import Box from "@mui/material/Box";

import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
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
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Sidebar — hidden below md */}
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
    </DashboardSchemeProvider>
  );
}
