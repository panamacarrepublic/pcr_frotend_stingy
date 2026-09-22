import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import { containerMaxWidth, pageGutter, sectionPadding } from "@/theme/publicTheme";

import { FEATURED_LISTINGS } from "../lib/content";
import { homeMessages } from "../messages";
import { ListingCard } from "./ListingCard";

const m = homeMessages.featured;

/**
 * "Anuncios nuevos" (Figma 10167:12391).
 *
 * Content is static for now — see the note on `FEATURED_LISTINGS`. Swapping in
 * a TanStack Query hook later changes only where the array comes from.
 */
export function FeaturedListings() {
  return (
    <Box component="section" sx={{ px: pageGutter, py: sectionPadding.large }}>
      <Container disableGutters maxWidth={false} sx={{ maxWidth: containerMaxWidth }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          justifyContent="space-between"
        >
          <Stack spacing={2} sx={{ maxWidth: 768 }}>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              {m.tagline}
            </Typography>
            <Typography variant="h2" component="h2" color="brand.darker">
              {m.heading}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {m.lead}
            </Typography>
          </Stack>
          <Button variant="soft" component={Link} href="/listings" sx={{ flexShrink: 0 }}>
            {m.action}
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={6} sx={{ mt: { xs: 5, md: 7 } }}>
          {FEATURED_LISTINGS.map((listing, index) => (
            <ListingCard key={listing.id} listing={listing} priority={index === 0} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
