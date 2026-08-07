"use client";

import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { tokens } from "@/theme/tokens";

import { listingMessages } from "../../messages";
import { MascotPanel } from "../MascotPanel";
import { StepHeading } from "../StepHeading";
import type { UploadMethod } from "../PublishWizardContext";

const m = listingMessages.method;

interface OptionCardProps {
  badge: string;
  label: string;
  selected: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

function OptionCard({ badge, label, selected, disabled, onSelect }: OptionCardProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={
        disabled
          ? undefined
          : (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.();
              }
            }
      }
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: `${tokens.radius.md}px`,
        bgcolor: tokens.colors.white,
        border: `1.5px solid ${selected ? tokens.colors.roti.main : tokens.colors.border}`,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <Box
        component="span"
        sx={{
          width: 28,
          height: 28,
          borderRadius: `${tokens.radius.sm}px`,
          bgcolor: tokens.colors.foreground,
          color: tokens.colors.neutralDarkest,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {badge}
      </Box>
      <Typography sx={{ flex: 1, fontWeight: 600 }}>{label}</Typography>
      {disabled ? (
        <Chip
          size="small"
          label={listingMessages.category.comingSoon}
          sx={{ bgcolor: tokens.colors.roti.lighter, color: tokens.colors.roti.dark }}
        />
      ) : selected ? (
        <CheckCircleIcon sx={{ color: tokens.colors.roti.main }} />
      ) : null}
    </Stack>
  );
}

interface MethodSelectStepProps {
  onNext: (method: UploadMethod) => void;
  onClose: () => void;
}

export function MethodSelectStep({ onNext, onClose }: MethodSelectStepProps) {
  const [method, setMethod] = useState<UploadMethod>("manual");
  const nav = listingMessages.nav;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: { xs: 4, md: 6 },
        alignItems: "center",
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <StepHeading title={m.title} subtitle={m.subtitle} />

        <Stack spacing={2} sx={{ mt: 3 }} role="radiogroup" aria-label={m.title}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {m.optionManualTitle}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>
              {m.manual.hint}
            </Typography>
            <OptionCard
              badge={m.manual.badge}
              label={m.manual.label}
              selected={method === "manual"}
              onSelect={() => setMethod("manual")}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {m.optionBulkTitle}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>
              {m.bulk.hint}
            </Typography>
            <OptionCard badge={m.bulk.badge} label={m.bulk.label} selected={false} disabled />
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ mt: { xs: 3, md: 4 } }}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: tokens.colors.neutral,
              color: tokens.colors.white,
              px: 3,
              "&:hover": { bgcolor: tokens.colors.neutralDark },
            }}
          >
            {nav.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={() => onNext(method)}
            sx={{
              bgcolor: tokens.colors.roti.main,
              color: tokens.colors.white,
              px: 3,
              "&:hover": { bgcolor: tokens.colors.roti.dark },
            }}
          >
            {nav.next}
          </Button>
        </Stack>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <MascotPanel src="/images/dashboardForm/form0.png" />
      </Box>
    </Box>
  );
}
