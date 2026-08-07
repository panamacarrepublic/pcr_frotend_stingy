import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { loginMessages } from "@/modules/auth/messages";

// Static, non-functional facsimile of the reCAPTCHA v2 checkbox.
// TODO: replace with a real reCAPTCHA integration when auth is wired.
export default function RecaptchaPlaceholder() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        px: 1.5,
        py: 1.25,
        bgcolor: "grey.50",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Checkbox disableRipple sx={{ p: 0 }} inputProps={{ "aria-label": loginMessages.recaptcha }} />
        <Typography variant="body2">{loginMessages.recaptcha}</Typography>
      </Stack>
      <Stack alignItems="center" spacing={0.25} sx={{ color: "text.secondary" }}>
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.02em" }}>
          {loginMessages.recaptchaBrand}
        </Typography>
        <Typography variant="caption">{loginMessages.recaptchaLinks}</Typography>
      </Stack>
    </Box>
  );
}
