import Box from "@mui/material/Box";

import { DashboardShell } from "@/components/layout/dashboard/DashboardShell";
import { InventoryContent } from "@/modules/dashboard/components/inventory/InventoryContent";
import { InventoryHeaderActions } from "@/modules/dashboard/components/inventory/InventoryHeaderActions";
import { inventoryMessages } from "@/modules/dashboard/components/inventory/messages";
import { dashboardMock } from "@/modules/dashboard/mockData";
import { businessNavItems, businessBottomNavItems } from "@/modules/dashboard/navItems";

/**
 * Inventario — the seller's own listings, from `GET /api/v1/listings/me`
 * (every status, not just active). Figma node 10689-11715.
 *
 * The profile in the sidebar is still `dashboardMock`; only the table is on
 * real data. Wiring the profile needs a user/business endpoint that this page
 * doesn't own.
 */
export default function InventarioPage() {
  return (
    <DashboardShell
      role="business"
      navItems={businessNavItems}
      bottomNavItems={businessBottomNavItems}
      profile={dashboardMock.profile}
      activeKey="inventory"
      headerTitle={inventoryMessages.title}
      headerAction={<InventoryHeaderActions />}
    >
      <Box sx={{ px: "20px", pb: "20px" }}>
        <InventoryContent />
      </Box>
    </DashboardShell>
  );
}
