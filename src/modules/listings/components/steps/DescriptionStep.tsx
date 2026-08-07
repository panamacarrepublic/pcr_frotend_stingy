"use client";

import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { tokens } from "@/theme/tokens";

import { listingMessages } from "../../messages";
import { RhfCheckbox, RhfTextField } from "../fields";
import { StepFrame } from "../StepFrame";

const f = listingMessages.fields;
const p = listingMessages.placeholders;

function ProfessionalPhotosCard() {
  const pp = listingMessages.professionalPhotos;
  return (
    <Box
      sx={{
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: `${tokens.radius.md}px`,
        bgcolor: tokens.colors.white,
        p: 2,
        maxWidth: 440,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <PhotoCameraOutlinedIcon sx={{ color: tokens.colors.neutralDarkest }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {pp.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {pp.subtitle}
          </Typography>
        </Box>
        <RhfCheckbox name="professional_photos" ariaLabel={pp.title} />
      </Stack>
    </Box>
  );
}

export function DescriptionStep() {
  const s = listingMessages.steps.description;
  return (
    <StepFrame
      eyebrow={s.eyebrow}
      title={s.title}
      subtitle={s.subtitle}
      left={<ProfessionalPhotosCard />}
      right={
        <Stack spacing={2.5}>
          <Box>
            <RhfTextField name="title" label={f.title} placeholder={p.title} maxLength={150} />
            <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
              {listingMessages.hints.title}
            </Typography>
          </Box>
          <RhfTextField
            name="description"
            label={f.description}
            placeholder={p.description}
            multiline
            minRows={9}
          />
        </Stack>
      }
    />
  );
}
