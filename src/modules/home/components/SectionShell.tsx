import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { ReactNode } from "react";

import { containerMaxWidth, pageGutter, sectionPadding } from "@/theme/publicTheme";

/**
 * Every home section is the same frame in Figma: full-bleed background, the
 * global 64px page gutter, section padding, and a 1280px content column.
 *
 * It appeared in three sections before the lower half was built, so it lives
 * here instead of being retyped as `sx` eleven times.
 */
export function SectionShell({
  children,
  bgcolor,
  padding = "large",
  component = "section",
  id,
}: {
  children: ReactNode;
  /** Figma alternates cream, tan and white between sections. */
  bgcolor?: string;
  padding?: keyof typeof sectionPadding;
  component?: "section" | "footer";
  id?: string;
}) {
  return (
    <Box component={component} id={id} sx={{ px: pageGutter, py: sectionPadding[padding], bgcolor }}>
      <Container disableGutters maxWidth={false} sx={{ maxWidth: containerMaxWidth }}>
        {children}
      </Container>
    </Box>
  );
}
