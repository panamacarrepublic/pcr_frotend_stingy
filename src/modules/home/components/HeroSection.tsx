import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { containerMaxWidth, pageGutter, sectionPadding } from "@/theme/publicTheme";
import { publicTokens as pt } from "@/theme/tokens";

import { homeMessages } from "../messages";
import { CategoryCards } from "./CategoryCards";
import { HeroHeadline } from "./HeroHeadline";
import { SearchFilterBar } from "./search/SearchFilterBar";

/**
 * Top of the public home (Figma 10167:12358): headline + lead + search panel,
 * the wide feature image, then the three category cards.
 */
export function HeroSection() {
  return (
    <Box component="section" sx={{ px: pageGutter, pt: sectionPadding.medium, pb: sectionPadding.small }}>
      <Container disableGutters maxWidth={false} sx={{ maxWidth: containerMaxWidth }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 4, lg: 10 }} alignItems="flex-start">
          <HeroHeadline />

          <Stack spacing={4} sx={{ flex: 1, minWidth: 0, width: "100%" }}>
            <Typography variant="subtitle1" color="text.primary">
              {homeMessages.hero.lead}
            </Typography>
            <SearchFilterBar />
          </Stack>
        </Stack>

        {/*
          Figma node 10167:12372 is a "Placeholder Image" frame with no exported
          asset, so there is no real photo to download for this slot. It renders
          as the design's dark rounded surface until art direction supplies one.
        */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            height: { xs: 220, sm: 320, md: 428 },
            borderRadius: 1,
            bgcolor: pt.colors.neutralDarkest,
          }}
          role="img"
          aria-label={homeMessages.hero.imageAlt}
        />

        <Box sx={{ mt: { xs: 6, md: 8 } }}>
          <CategoryCards />
        </Box>
      </Container>
    </Box>
  );
}
