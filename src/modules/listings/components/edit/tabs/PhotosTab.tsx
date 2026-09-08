"use client";

import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { tokens } from "@/theme/tokens";

import { listingMessages } from "../../../messages";
import { RhfCheckbox } from "../../fields";
import { PhotoUploader } from "../../steps/PhotoUploader";

const pp = listingMessages.professionalPhotos;

/**
 * "Fotos": the same uploader the wizard uses, plus the professional-photos
 * upsell.
 *
 * The banner is not decoration. `photos` is a total replacement server-side, so
 * whatever is in this list at save time *is* the gallery — a photo removed here
 * is gone from the listing, not merely hidden.
 */
export function PhotosTab() {
  return (
    <Stack spacing={2.5}>
      <Alert severity="info">{listingMessages.edit.photosReplaceHint}</Alert>

      <PhotoUploader />

      <Box
        sx={{
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: `${tokens.radius.md}px`,
          bgcolor: tokens.colors.white,
          p: 2,
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
    </Stack>
  );
}
