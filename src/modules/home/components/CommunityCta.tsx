import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";

import { containerMaxWidth, pageGutter, sectionPadding } from "@/theme/publicTheme";
import { publicTokens as pt } from "@/theme/tokens";

import { homeMessages } from "../messages";

const m = homeMessages.community;

/** Registration CTA over a photo (Figma 10167:12568). */
export function CommunityCta() {
  return (
    <Box
      component="section"
      sx={{ px: pageGutter, py: sectionPadding.large, bgcolor: pt.colors.roti.lighter }}
    >
      <Container disableGutters maxWidth={false} sx={{ maxWidth: containerMaxWidth }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 1,
            px: { xs: 3, md: 8 },
            py: { xs: 6, md: 8 },
          }}
        >
          <Image
            src="/images/home/cta-comunidad.png"
            alt={m.imageAlt}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            style={{ objectFit: "cover" }}
          />
          {/* Figma dims the photo 50% so the white heading keeps its contrast. */}
          <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0, 0, 0, 0.5)" }} />

          <Stack
            spacing={4}
            alignItems="center"
            sx={{ position: "relative", maxWidth: pt.layout.maxWidthLarge, mx: "auto" }}
          >
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography variant="h2" component="h2" color="common.white">
                {m.headingBefore}
                <Box component="span" sx={{ color: "primary.light" }}>
                  {m.headingAccent}
                </Box>
                {m.headingAfter}
              </Typography>
              <Typography variant="subtitle2" color="common.white">
                {m.lead}
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button component={Link} href="/registro">
                {m.primary}
              </Button>
              <Button variant="glass" component={Link} href="/listings">
                {m.secondary}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
