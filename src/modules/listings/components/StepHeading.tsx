import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { tokens } from "@/theme/tokens";

interface StepHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

/** The step title block: large gold eyebrow, dark subtitle heading, muted lead. */
export function StepHeading({ eyebrow, title, subtitle }: StepHeadingProps) {
  return (
    <Stack spacing={0.5}>
      {eyebrow ? (
        <Typography
          variant="h4"
          sx={{
            color: tokens.colors.roti.dark,
            fontWeight: 700,
            textTransform: "uppercase",
            lineHeight: 1.1,
          }}
        >
          {eyebrow}
        </Typography>
      ) : null}
      <Typography
        variant="h6"
        sx={{
          color: "text.primary",
          fontWeight: 700,
          textTransform: "uppercase",
          lineHeight: 1.15,
        }}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 460, pt: 0.5 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}
