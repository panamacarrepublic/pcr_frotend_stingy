import { DashboardShell } from "@/components/layout/dashboard/DashboardShell";
import { DashboardInProgress } from "@/modules/dashboard/components/DashboardInProgress";
import { dashboardMock } from "@/modules/dashboard/mockData";
import { businessNavItems, businessBottomNavItems } from "@/modules/dashboard/navItems";

// Placeholder shell for dashboard routes that aren't built yet: keeps the full
// sidebar + header layout, swaps the content area for a "Currently in progress" note.
export function DashboardPlaceholderPage({ activeKey }: { activeKey: string }) {
  const item = [...businessNavItems, ...businessBottomNavItems].find((i) => i.key === activeKey);

  return (
    <DashboardShell
      role="business"
      navItems={businessNavItems}
      bottomNavItems={businessBottomNavItems}
      profile={dashboardMock.profile}
      activeKey={activeKey}
      headerTitle={item?.label ?? ""}
    >
      <DashboardInProgress />
    </DashboardShell>
  );
}
