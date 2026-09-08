import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { QuotaCard } from "@/modules/dashboard/components/overview/QuotaCard";
import { StatCard } from "@/modules/dashboard/components/overview/StatCard";
import { SoldListingsCard } from "@/modules/dashboard/components/overview/SoldListingsCard";
import { VerificationCard } from "@/modules/dashboard/components/overview/VerificationCard";
import { TopProductsCard } from "@/modules/dashboard/components/overview/TopProductsCard";
import { PlanRenewalCard } from "@/modules/dashboard/components/overview/PlanRenewalCard";
import { MessagesPanel } from "@/modules/dashboard/components/overview/MessagesPanel";
import type { DashboardData } from "@/modules/dashboard/types";

export function OverviewGrid({ data }: { data: DashboardData }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 632px) 384px" },
        gap: { xs: 3, md: 6 },
        px: "20px",
        pb: "20px",
        // Grid items default to `min-width: auto`, so a card wider than its
        // track pushes the whole page sideways instead of shrinking. Both
        // columns here hold cards with long labels.
        "& > *": { minWidth: 0 },
      }}
    >
      {/* Left column: nested 3-col grid */}
      {/* Three columns is the desktop design. Below `md` the explicit placements
          below are dropped and the cards fall into DOM order, which already
          reads top to bottom: cuotas, actividad, vistas, top productos, plan. */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          gridTemplateRows: { md: "auto auto auto auto" },
          gap: "12px",
          "& > *": { minWidth: 0 },
        }}
      >
        {/* Row 1: Quota cards */}
        <QuotaCard data={data.quotas[0]} />
        <QuotaCard data={data.quotas[1]} />
        <QuotaCard data={data.quotas[2]} />

        {/* Row 2: Active listings, Sold listings, Verification */}
        <StatCard
          title="Anuncios Activos"
          icon={<Inventory2Icon fontSize="small" />}
          action={
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{
                textDecoration: "underline",
                color: "text.secondary",
                cursor: "pointer",
                mt: 0.5,
              }}
            >
              Ver todos →
            </Typography>
          }
        >
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              {data.activeListings.count}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Anuncios publicados actualmente
            </Typography>
          </Stack>
        </StatCard>

        <SoldListingsCard
          count={data.soldListings.count}
          trendPct={data.soldListings.trendPct}
        />

        <VerificationCard
          status={data.verification.status}
          detail={data.verification.detail}
          active={data.verification.active}
        />

        {/* Row 3, col 1: Total views */}
        <Box sx={{ gridColumn: { md: "1" }, gridRow: { md: "3" } }}>
          <StatCard
            title="Vistas Totales (30 días)"
            icon={<VisibilityIcon fontSize="small" />}
            action={
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{
                  textDecoration: "underline",
                  color: "text.secondary",
                  cursor: "pointer",
                  mt: 0.5,
                }}
              >
                Ver todos →
              </Typography>
            }
          >
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography variant="h4" fontWeight={700}>
                {data.totalViews.count.toLocaleString("en-US")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {data.totalViews.label}
              </Typography>
            </Stack>
          </StatCard>
        </Box>

        {/* Rows 3–4, cols 2–3: Top products (2×2 span) */}
        {/* Spans the full width at every breakpoint that has more than one
            column — the product rows are image + text side by side. */}
        <Box
          sx={{
            gridColumn: { sm: "1 / 3", md: "2 / 4" },
            gridRow: { md: "3 / 5" },
            minHeight: 0,
          }}
        >
          <TopProductsCard products={data.topProducts} />
        </Box>

        {/* Row 4, col 1: Plan renewal */}
        <Box sx={{ gridColumn: { md: "1" }, gridRow: { md: "4" } }}>
          <PlanRenewalCard
            tier={data.planRenewal.tier}
            daysLeft={data.planRenewal.daysLeft}
          />
        </Box>
      </Box>

      {/* Right column: Messages panel */}
      <MessagesPanel messages={data.messages} reviews={data.reviews} />
    </Box>
  );
}
