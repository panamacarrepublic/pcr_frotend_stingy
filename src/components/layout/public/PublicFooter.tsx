import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedIcon from "@mui/icons-material/Verified";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import Image from "next/image";
import NextLink from "next/link";

import { homeMessages } from "@/modules/home/messages";
import { containerMaxWidth, pageGutter, sectionPadding } from "@/theme/publicTheme";
import { publicTokens as pt } from "@/theme/tokens";

const m = homeMessages.footer;

const SOCIAL = [
  { name: "Facebook", src: "/images/home/social/facebook.svg" },
  { name: "Instagram", src: "/images/home/social/instagram.svg" },
  { name: "TikTok", src: "/images/home/social/tiktok.svg" },
  { name: "YouTube", src: "/images/home/social/youtube.svg" },
] as const;

const TRUST_ICONS = [VerifiedIcon, LockIcon, CreditCardIcon, SupportAgentIcon] as const;

/** Public site footer (Figma 10175:32169). */
export function PublicFooter() {
  return (
    <Box
      component="footer"
      sx={{
        px: pageGutter,
        py: sectionPadding.medium,
        bgcolor: pt.colors.stormGray.main,
        color: "common.white",
      }}
    >
      <Container disableGutters maxWidth={false} sx={{ maxWidth: containerMaxWidth }}>
        <Stack spacing={8}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={8} alignItems="flex-start">
            <Stack spacing={4} sx={{ flex: 1, minWidth: 0 }}>
              <Image
                src="/images/home/brand/logo.svg"
                alt={m.wordmarkAlt}
                width={191}
                height={79}
                style={{ height: "auto", width: 158 }}
              />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {m.contactLabel}
                </Typography>
                <Link href={`mailto:${m.email}`} underline="always" variant="body2">
                  {m.email}
                </Link>
              </Box>
              <Stack direction="row" spacing={1.5} aria-label={m.social}>
                {SOCIAL.map((network) => (
                  <Link key={network.name} href="/" aria-label={network.name} sx={{ display: "flex" }}>
                    <Image src={network.src} alt="" width={24} height={24} aria-hidden />
                  </Link>
                ))}
              </Stack>
            </Stack>

            <Stack
              direction="row"
              spacing={4}
              sx={{ flex: 1, minWidth: 0, maxWidth: pt.layout.maxWidthXsmall }}
            >
              {m.columns.map((column) => (
                <Stack key={column.heading} sx={{ flex: 1, minWidth: 0 }}>
                  {/* Figma shows no column headings; they exist for screen readers only. */}
                  <Typography variant="body1" sx={visuallyHidden}>
                    {column.heading}
                  </Typography>
                  {column.links.map((label) => (
                    <Link
                      key={label}
                      component={NextLink}
                      href="/listings"
                      variant="body1"
                      sx={{ py: 1, fontWeight: 600 }}
                    >
                      {label}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Stack spacing={6}>
            <Image
              src="/images/home/brand/wordmark-footer.svg"
              alt={m.wordmarkAlt}
              width={1280}
              height={398}
              style={{ width: "100%", height: "auto" }}
            />

            <Stack spacing={4}>
              <Divider sx={{ borderColor: "common.white", opacity: 0.4 }} />

              <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent="center"
                sx={{ gap: { xs: 2, md: 4 } }}
              >
                {m.trust.map((label, index) => {
                  const Icon = TRUST_ICONS[index];
                  return (
                    <Stack key={label} direction="row" spacing={1.25} alignItems="center">
                      <Icon fontSize="small" />
                      <Typography variant="body1" fontWeight={600}>
                        {label}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>

              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Typography variant="body2">{m.copyright}</Typography>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 3 }}>
                  {m.legal.map((label) => (
                    <Link key={label} component={NextLink} href="/" variant="body2" underline="always">
                      {label}
                    </Link>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
