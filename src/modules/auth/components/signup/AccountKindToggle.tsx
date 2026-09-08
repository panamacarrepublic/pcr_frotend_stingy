"use client";

import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import { signupMessages } from "@/modules/auth/signupMessages";
import type { AccountKind } from "@/modules/auth/schemas";
import { tokens } from "@/theme/tokens";

import type { SignupVariantStyle } from "./variants";

const m = signupMessages;

interface Props {
  value: AccountKind;
  onChange: (kind: AccountKind) => void;
  style: SignupVariantStyle;
}

/** Segmented "Particular / Empresarial" switch above the form. */
export function AccountKindToggle({ value, onChange, style }: Props) {
  return (
    <Stack spacing={1} alignItems="center">
      <Typography variant="body2" sx={{ color: style.mutedText }}>
        {m.chooseKind}
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={value}
        // `null` arrives when the active button is clicked again; the form
        // always has a kind, so that press is a no-op rather than a deselect.
        onChange={(_, next: AccountKind | null) => next && onChange(next)}
        aria-label={m.chooseKind}
        sx={{
          border: `1px solid ${style.toggleTrackBorder}`,
          borderRadius: `${tokens.radius.md}px`,
          p: 0.5,
          gap: 0.5,
          "& .MuiToggleButton-root": {
            border: 0,
            borderRadius: `${tokens.radius.sm}px !important`,
            px: 3,
            py: 0.75,
            textTransform: "none",
            fontWeight: 600,
            color: style.mutedText,
          },
          "& .MuiToggleButton-root.Mui-selected": {
            bgcolor: style.toggleActiveBg,
            color: style.toggleActiveText,
            "&:hover": { bgcolor: style.toggleActiveBg },
          },
        }}
      >
        <ToggleButton value="regular">{m.kinds.regular}</ToggleButton>
        <ToggleButton value="business">{m.kinds.business}</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
