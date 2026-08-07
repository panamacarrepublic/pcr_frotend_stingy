"use client";

import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ExtensionIcon from "@mui/icons-material/Extension";
import InfoIcon from "@mui/icons-material/Info";
import type { SvgIconComponent } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { tokens } from "@/theme/tokens";

import { listingMessages } from "../../messages";
import { IllustrationPanel } from "../IllustrationPanel";
import { StepFrame } from "../StepFrame";

const cat = listingMessages.category;

interface CategoryOption {
  key: string;
  label: string;
  Icon: SvgIconComponent;
  enabled: boolean;
}

// Only cars is wired for now; parts/collectibles land with their schemas.
const options: CategoryOption[] = [
  { key: "cars", label: cat.cars, Icon: DirectionsCarIcon, enabled: true },
  { key: "parts", label: cat.parts, Icon: BuildIcon, enabled: false },
  { key: "collectibles", label: cat.collectibles, Icon: ExtensionIcon, enabled: false },
];

function PlansBanner() {
  const b = listingMessages.banner;
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ bgcolor: tokens.colors.thunderLightest, borderRadius: `${tokens.radius.md}px`, p: 2 }}
    >
      <InfoIcon sx={{ color: tokens.colors.azul.main }} />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {b.title}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {b.subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

export function CategoryStep() {
  const s = listingMessages.steps.category;
  return (
    <StepFrame
      eyebrow={s.eyebrow}
      title={s.title}
      subtitle={s.subtitle}
      banner={<PlansBanner />}
      right={<IllustrationPanel variant="welcome" />}
      left={
        <Stack spacing={1.5}>
          {options.map(({ key, label, Icon, enabled }) => {
            const selected = key === "cars";
            return (
              <Stack
                key={key}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: `${tokens.radius.md}px`,
                  bgcolor: tokens.colors.white,
                  border: `1.5px solid ${selected ? tokens.colors.roti.main : tokens.colors.border}`,
                  opacity: enabled ? 1 : 0.6,
                  cursor: enabled ? "pointer" : "not-allowed",
                }}
              >
                <Icon sx={{ color: selected ? tokens.colors.roti.dark : tokens.colors.neutral }} />
                <Typography sx={{ flex: 1, fontWeight: 600 }}>{label}</Typography>
                {selected ? <CheckCircleIcon sx={{ color: tokens.colors.roti.main }} /> : null}
                {!enabled ? (
                  <Chip
                    size="small"
                    label={cat.comingSoon}
                    sx={{ bgcolor: tokens.colors.roti.lighter, color: tokens.colors.roti.dark }}
                  />
                ) : null}
              </Stack>
            );
          })}
        </Stack>
      }
    />
  );
}
