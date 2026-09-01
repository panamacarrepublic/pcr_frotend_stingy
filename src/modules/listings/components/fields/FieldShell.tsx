import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface FieldShellProps {
  label?: string;
  /** Renders the small (i) icon next to the label; string becomes its tooltip. */
  info?: string | boolean;
  error?: string;
  /** Appends the design's `*` marker to the label. */
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
}

/**
 * Presentational field wrapper: label row (with optional info icon) above the
 * control, and error text below. Matches the Figma "label on top" field layout
 * — we do NOT use MUI's floating label.
 */
export function FieldShell({ label, info, error, required, htmlFor, children }: FieldShellProps) {
  const infoIcon = info ? (
    <Tooltip title={typeof info === "string" ? info : ""} arrow disableHoverListener={info === true}>
      <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
    </Tooltip>
  ) : null;

  return (
    <Stack spacing={0.75}>
      {label ? (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          component="label"
          htmlFor={htmlFor}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
            {required ? `${label}*` : label}
          </Typography>
          {infoIcon}
        </Stack>
      ) : null}
      {children}
      {error ? (
        <Typography variant="caption" sx={{ color: "error.main" }}>
          {error}
        </Typography>
      ) : null}
    </Stack>
  );
}
