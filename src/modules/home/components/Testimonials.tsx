import StarIcon from "@mui/icons-material/Star";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import { publicTokens as pt } from "@/theme/tokens";

import { TESTIMONIALS, type Testimonial } from "../lib/sectionsContent";
import { homeMessages } from "../messages";
import { SectionShell } from "./SectionShell";

const m = homeMessages.testimonials;

function TestimonialColumn({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Stack component="figure" spacing={4} sx={{ flex: 1, minWidth: 0, m: 0 }}>
      <Box>
        {/* The five stars are decorative; the rating is announced once, as text. */}
        <Box aria-hidden sx={{ display: "flex", color: "primary.main" }}>
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon key={index} sx={{ fontSize: 20 }} />
          ))}
        </Box>
        <Box sx={visuallyHidden}>{m.rating}</Box>
      </Box>

      <Typography variant="h6" component="blockquote" color="brand.darker" sx={{ m: 0 }}>
        {testimonial.quote}
      </Typography>

      <Stack component="figcaption" direction="row" spacing={2.5} alignItems="center">
        <Avatar src={testimonial.avatarSrc} alt="" sx={{ width: 56, height: 56 }} />
        <Box>
          <Typography variant="body1" fontWeight={600} color="text.secondary">
            {testimonial.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {testimonial.role}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

/** "Testimonios de clientes" (Figma 10285:20428). */
export function Testimonials() {
  return (
    <SectionShell bgcolor={pt.colors.roti.lightest}>
      <Stack spacing={10}>
        <Stack spacing={3} sx={{ maxWidth: pt.layout.maxWidthLarge }}>
          <Typography variant="h2" component="h2" color="brand.darker">
            {m.heading}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {m.lead}
          </Typography>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={8}>
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialColumn key={testimonial.id} testimonial={testimonial} />
          ))}
        </Stack>
      </Stack>
    </SectionShell>
  );
}
