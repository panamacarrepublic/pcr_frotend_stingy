"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import { dashboardSchemes } from "@/theme/dashboardSchemes";
import type { DashboardColorScheme, DashboardRole } from "@/theme/dashboardSchemes";

const DashboardSchemeContext = createContext<DashboardColorScheme>(dashboardSchemes.business);

export function DashboardSchemeProvider({
  role,
  children,
}: {
  role: DashboardRole;
  children: ReactNode;
}) {
  return (
    <DashboardSchemeContext.Provider value={dashboardSchemes[role]}>
      {children}
    </DashboardSchemeContext.Provider>
  );
}

export function useDashboardScheme(): DashboardColorScheme {
  return useContext(DashboardSchemeContext);
}
