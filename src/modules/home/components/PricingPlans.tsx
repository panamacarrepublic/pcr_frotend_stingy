"use client";

import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { publicTokens as pt } from "@/theme/tokens";

import { formatPrice } from "../lib/content";
import {
  PRICING_AUDIENCES,
  PRICING_PLANS,
  type PricingAudience,
  type PricingPlan,
} from "../lib/sectionsContent";
import { homeMessages } from "../messages";
import { SectionShell } from "./SectionShell";

const m = homeMessages.pricing;

function PlanCard({ plan }: { plan: PricingPlan }) {
  return (
    <Stack
      component="article"
      spacing={3}
      sx={{
        flex: 1,
        minWidth: 0,
        p: 3,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "transparent",
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Typography variant="h6" component="h3" color="brand.darker" textAlign="center">
          {plan.name}
        </Typography>
        <Typography variant="h3" component="p" color="brand.darker">
          {formatPrice(plan.priceCents)}
          <Box component="span" sx={{ typography: "h5" }}>
            {m.perQuarter}
          </Box>
        </Typography>
      </Stack>

      <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0, flex: 1 }}>
        {plan.features.map((feature) => (
          <Stack key={feature} component="li" direction="row" spacing={1.5} alignItems="center">
            <CheckIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {feature}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Button
        fullWidth
        sx={{ bgcolor: pt.colors.neutralDarker, "&:hover": { bgcolor: pt.colors.neutralDarkest } }}
        onClick={() => {
          // eslint-disable-next-line no-console -- placeholder until checkout exists
          console.log("[home] comprar plan:", plan.id);
        }}
      >
        {m.action}
      </Button>
    </Stack>
  );
}

/** "Planes de precios" with the Particular/Empresarial toggle (Figma 10175:32030). */
export function PricingPlans() {
  const [audience, setAudience] = useState<PricingAudience>("particular");
  const active = PRICING_AUDIENCES.find((option) => option.id === audience) ?? PRICING_AUDIENCES[0];

  return (
    <SectionShell bgcolor={pt.colors.roti.lightest}>
      <Stack spacing={6} alignItems="center">
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ maxWidth: pt.layout.maxWidthLarge }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            {m.tagline}
          </Typography>
          <Typography variant="h2" component="h2" color="brand.darker">
            {m.heading}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {m.lead}
          </Typography>
        </Stack>

        <ToggleButtonGroup
          exclusive
          value={audience}
          aria-label={m.audienceLabel}
          onChange={(_, next: PricingAudience | null) => {
            // MUI emits null when the active button is re-clicked; keep a selection.
            if (next) setAudience(next);
          }}
          sx={{
            p: 0.5,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            "& .MuiToggleButton-root": {
              border: 0,
              borderRadius: 1,
              px: 3,
              py: 1,
              typography: "body1",
              textTransform: "none",
              color: "text.secondary",
              "&.Mui-selected": {
                bgcolor: "primary.light",
                color: "brand.darkest",
                fontWeight: 600,
                "&:hover": { bgcolor: "primary.light" },
              },
            },
          }}
        >
          {PRICING_AUDIENCES.map((option) => (
            <ToggleButton key={option.id} value={option.id}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Typography variant="body2" fontWeight={600} color="text.secondary" textAlign="center">
          {active.note}
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="stretch" sx={{ width: "100%" }}>
          {PRICING_PLANS[audience].map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </Stack>
      </Stack>
    </SectionShell>
  );
}
