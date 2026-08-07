import { DashboardShell } from "@/components/layout/dashboard/DashboardShell";
import { DashboardOverview } from "@/modules/dashboard/components/DashboardOverview";
import { NewListingButton } from "@/modules/dashboard/components/NewListingButton";
import { dashboardMock } from "@/modules/dashboard/mockData";
import { businessNavItems, businessBottomNavItems } from "@/modules/dashboard/navItems";

// TODO(data): replace dashboardMock with a useDashboard() TanStack Query hook.
// TODO(auth): derive `role` from the Supabase session instead of hardcoding "business".
export default function DashboardPage() {
  return (
    <DashboardShell
      role="business"
      navItems={businessNavItems}
      bottomNavItems={businessBottomNavItems}
      profile={dashboardMock.profile}
      activeKey="overview"
      headerTitle="Resumen General"
      headerAction={<NewListingButton />}
    >
      <DashboardOverview data={dashboardMock} />
    </DashboardShell>
  );
}
