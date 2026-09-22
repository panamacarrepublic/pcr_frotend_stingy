"use client";

import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useState } from "react";

import { pageGutter } from "@/theme/publicTheme";
import { publicTokens as pt } from "@/theme/tokens";

import { homeMessages } from "../messages";

const m = homeMessages.banner;

/**
 * Promo bar above the navbar (Figma 10203:4237).
 *
 * Dismissal is real local state — a close button that does not close reads as
 * broken. The "Ver" action is still a placeholder, like the rest of the home.
 */
export function TopBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <Box component="aside" sx={{ px: pageGutter, pt: 1 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2, md: 4 }}
        alignItems={{ xs: "flex-start", md: "center" }}
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: 1,
          border: 1,
          borderColor: "divider",
          bgcolor: pt.colors.stormGray.dark,
          color: "common.white",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
          <Image src="/images/home/hero/youtube-banner.svg" alt="" width={32} height={32} aria-hidden />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body1" fontWeight={600}>
              {m.title}
            </Typography>
            <Typography variant="body2">{m.body}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
          <Button
            variant="glass"
            endIcon={<OpenInNewIcon />}
            sx={{ bgcolor: pt.colors.alphaDarkest[50] }}
            onClick={() => {
              // eslint-disable-next-line no-console -- placeholder action
              console.log("[home] banner: ver video");
            }}
          >
            {m.action}
          </Button>
          <IconButton
            aria-label={m.dismiss}
            onClick={() => setDismissed(true)}
            sx={{ color: "common.white" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
