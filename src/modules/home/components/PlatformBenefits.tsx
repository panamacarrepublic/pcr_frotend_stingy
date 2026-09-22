import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import GridViewIcon from "@mui/icons-material/GridView";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";

import { publicTokens as pt } from "@/theme/tokens";

import { homeMessages } from "../messages";
import { SectionShell } from "./SectionShell";

const m = homeMessages.benefits;
const ICONS = [ChatBubbleOutlineIcon, GridViewIcon, ReportGmailerrorredIcon] as const;

/** "Beneficios de usar nuestra plataforma" (Figma 10167:12471). */
export function PlatformBenefits() {
  return (
    <SectionShell bgcolor={pt.colors.roti.light}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 6, md: 10 }}
        alignItems="center"
      >
        <Stack spacing={4} sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={2}>
            <Typography variant="body2" fontWeight={600} color="brand.darkest">
              {m.tagline}
            </Typography>
            <Typography variant="h2" component="h2" color="brand.darkest">
              {m.headingBefore}
              <Box component="span" sx={{ color: "common.white" }}>
                {m.headingAccent}
              </Box>
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {m.lead}
            </Typography>
          </Stack>

          <Stack component="ul" spacing={2} sx={{ listStyle: "none", m: 0, p: 0 }}>
            {m.items.map((item, index) => {
              const Icon = ICONS[index];
              return (
                <Stack key={item} component="li" direction="row" spacing={2} alignItems="center">
                  <Icon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body1" fontWeight={600} color="text.secondary">
                    {item}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>

          <Box>
            <Button variant="soft" component={Link} href="/registro" sx={{ color: "common.white" }}>
              {m.action}
            </Button>
          </Box>
        </Stack>

        <Box sx={{ flex: 1, minWidth: 0, position: "relative", width: "100%" }}>
          {/* Decorative cream blob the mascot sits on (Figma node 10167:12494). */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url(/images/home/sections/mascota-blob.svg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          />
          <Box sx={{ position: "relative", width: "100%", aspectRatio: "600 / 640" }}>
            <Image
              src="/images/home/sections/mascota-plataforma.png"
              alt={m.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>
      </Stack>
    </SectionShell>
  );
}
