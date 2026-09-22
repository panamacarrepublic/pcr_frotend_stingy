import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { HERO_BADGES, HERO_BADGE_BOX } from "../lib/content";
import { homeMessages } from "../messages";

/**
 * The H1 with the three rotated vertical wordmarks layered over it
 * (Figma 10167:12362 plus the sibling vectors 10167:12369/12370, 10170:804).
 *
 * The badges are decorative artwork that repeats the vertical names already
 * present in the nav and the category cards, so they are `aria-hidden` and the
 * heading alone carries the meaning.
 */
export function HeroHeadline() {
  return (
    <Box sx={{ position: "relative", flex: 1, minWidth: 0 }}>
      <Typography variant="h1" component="h1" color="brand.darkest">
        {homeMessages.hero.headline}
      </Typography>

      {/*
        One scaling box holds all three badges so their relative arrangement is
        fixed. It rides up over the headline's last line, as in Figma.
      */}
      <Box
        aria-hidden
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: HERO_BADGE_BOX.width,
          aspectRatio: `${HERO_BADGE_BOX.width} / ${HERO_BADGE_BOX.height}`,
          mt: { xs: -2, md: -4 },
        }}
      >
        {HERO_BADGES.map((badge) => (
          <Box
            key={badge.src}
            sx={{ position: "absolute", top: badge.top, left: badge.left, width: badge.scale }}
          >
            <Image
              src={badge.src}
              alt=""
              width={badge.width}
              height={badge.height}
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
