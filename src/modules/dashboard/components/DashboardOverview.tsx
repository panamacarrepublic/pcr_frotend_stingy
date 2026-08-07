import { OverviewGrid } from "@/modules/dashboard/components/overview/OverviewGrid";
import type { DashboardData } from "@/modules/dashboard/types";

export function DashboardOverview({ data }: { data: DashboardData }) {
  return <OverviewGrid data={data} />;
}
