import VerifiedIcon from "@mui/icons-material/Verified";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { formatPrice, type FeaturedListing } from "../lib/content";

/**
 * A single listing tile in the "Anuncios nuevos" row (Figma 10928:8593).
 *
 * The condition chip changes colour per vertical, which is data rather than
 * style variation, so the palette travels with the listing in `content.ts`.
 */
export function ListingCard({
  listing,
  priority = false,
}: {
  listing: FeaturedListing;
  /** Set on the first card: it is the page's LCP element. */
  priority?: boolean;
}) {
  return (
    <Stack component="article" spacing={2} sx={{ flex: 1, minWidth: 0 }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "394 / 486",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Image
          src={listing.imageSrc}
          alt={listing.title}
          fill
          priority={priority}
          sizes="(max-width: 900px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </Box>

      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Chip
            size="small"
            icon={<VerifiedIcon sx={{ fontSize: 16, color: "inherit !important" }} />}
            label={listing.condition}
            sx={{
              borderRadius: 1,
              border: 1,
              borderColor: "divider",
              bgcolor: listing.chipBg,
              color: listing.chipFg,
              typography: "body2",
              fontWeight: 600,
            }}
          />
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mt: 0.5 }}>
            {listing.title}
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          {formatPrice(listing.priceCents)}
        </Typography>
      </Stack>
    </Stack>
  );
}
