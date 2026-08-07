"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useWatch } from "react-hook-form";

import { tokens } from "@/theme/tokens";

import { listingMessages } from "../../messages";
import { StepFrame } from "../StepFrame";
import { PhotoUploader } from "./PhotoUploader";

const t = listingMessages.photos;

export function PhotosStep() {
  const s = listingMessages.steps.photos;
  const photos = (useWatch({ name: "photos" }) ?? []) as { url: string }[];
  const cover = photos[0]?.url;

  return (
    <StepFrame
      eyebrow={s.eyebrow}
      title={s.title}
      subtitle={s.subtitle}
      right={<PhotoUploader />}
      left={
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {t.tipsTitle}
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, color: "text.secondary" }}>
              {t.tips.map((tip) => (
                <Typography key={tip} component="li" variant="body2">
                  {tip}
                </Typography>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              pt: "66%",
              borderRadius: `${tokens.radius.lg}px`,
              overflow: "hidden",
              bgcolor: cover ? "transparent" : tokens.colors.neutralDarkest,
            }}
          >
            {cover ? (
              <Box sx={{ position: "absolute", inset: 0 }}>
                <Image
                  src={cover}
                  alt={t.cover}
                  fill
                  sizes="(max-width: 900px) 100vw, 40vw"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </Box>
            ) : (
              <Stack sx={{ position: "absolute", inset: 0 }} alignItems="center" justifyContent="center">
                <Typography variant="body2" sx={{ color: tokens.colors.whiteAlpha[60] }}>
                  {t.empty}
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      }
    />
  );
}
