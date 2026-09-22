"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { publicTokens as pt } from "@/theme/tokens";

import { formatPrice } from "../lib/content";
import { MERCH_ITEMS, type MerchItem } from "../lib/sectionsContent";
import { homeMessages } from "../messages";
import { SectionShell } from "./SectionShell";

const m = homeMessages.merch;

function MerchCard({ item }: { item: MerchItem }) {
  return (
    <Stack
      component="article"
      spacing={2}
      sx={{
        flex: "0 0 auto",
        width: { xs: "78%", sm: "46%", lg: "31%" },
        scrollSnapAlign: "start",
      }}
    >
      <Box sx={{ position: "relative", width: "100%", aspectRatio: "394 / 486", borderRadius: 1, overflow: "hidden" }}>
        <Image
          src={item.imageSrc}
          alt={`${item.name} — ${item.variant}`}
          fill
          sizes="(max-width: 600px) 78vw, (max-width: 1200px) 46vw, 31vw"
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.variant}
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          {formatPrice(item.priceCents)}
        </Typography>
      </Stack>
    </Stack>
  );
}

/**
 * "¡Compra nuestra mercancía!" (Figma 10928:8859).
 *
 * Scroll-snap rather than a carousel library: the row is already horizontally
 * scrollable for touch and keyboard, and the arrows just nudge it. No new
 * dependency, and it degrades to a plain scroller if JS is unavailable.
 */
export function MerchSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const pages = Math.ceil(MERCH_ITEMS.length / 3);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  };

  const syncPage = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setPage(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <SectionShell bgcolor={pt.colors.roti.lightest}>
      <Stack spacing={10}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          justifyContent="space-between"
        >
          <Stack spacing={2} sx={{ maxWidth: pt.layout.maxWidthLarge }}>
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

        <Stack spacing={6}>
          <Box
            ref={trackRef}
            onScroll={syncPage}
            role="group"
            aria-label={m.carousel}
            sx={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {MERCH_ITEMS.map((item) => (
              <MerchCard key={item.id} item={item} />
            ))}
          </Box>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} aria-hidden>
              {Array.from({ length: pages }, (_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: index === page ? pt.colors.neutralDarkest : pt.colors.alphaDarkest[20],
                  }}
                />
              ))}
            </Stack>

            <Stack direction="row" spacing={2}>
              <IconButton
                aria-label={m.previous}
                onClick={() => scrollBy(-1)}
                sx={{
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: pt.colors.schemeForeground,
                  color: "text.primary",
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                aria-label={m.next}
                onClick={() => scrollBy(1)}
                sx={{
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: pt.colors.schemeForeground,
                  color: "text.primary",
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </SectionShell>
  );
}
