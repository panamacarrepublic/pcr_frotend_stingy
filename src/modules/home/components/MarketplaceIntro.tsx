import GridViewIcon from "@mui/icons-material/GridView";
import VerifiedIcon from "@mui/icons-material/Verified";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { publicTokens as pt } from "@/theme/tokens";

import { homeMessages } from "../messages";
import { SectionShell } from "./SectionShell";

const m = homeMessages.marketplaceIntro;
const ICONS = [GridViewIcon, VerifiedIcon] as const;

/** "Descubre un mercado automotriz…" (Figma 10167:12453). */
export function MarketplaceIntro() {
  return (
    <SectionShell bgcolor={pt.colors.roti.light}>
      <Stack spacing={10}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 4, md: 10 }} alignItems="flex-start">
          <Typography variant="h3" component="h2" color="brand.darkest" sx={{ flex: 1, minWidth: 0 }}>
            {m.headingBefore}
            <Box component="span" sx={{ color: "common.white" }}>
              {m.headingAccent}
            </Box>
            {m.headingAfter}
          </Typography>

          <Stack spacing={4} sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {m.lead}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              {m.features.map((feature, index) => {
                const Icon = ICONS[index];
                return (
                  <Stack key={feature.title} spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                    <Icon sx={{ fontSize: 48, color: "brand.darkest" }} />
                    <Typography variant="h6" component="h3" color="brand.darkest">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.body}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        </Stack>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "1280 / 683",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/home/sections/mercado-automotriz.png"
            alt={m.imageAlt}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            style={{ objectFit: "cover" }}
          />
        </Box>
      </Stack>
    </SectionShell>
  );
}
