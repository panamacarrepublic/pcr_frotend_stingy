import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LoginForm from "@/modules/auth/components/LoginForm";
import { loginMessages } from "@/modules/auth/messages";
import { tokens } from "@/theme/tokens";
import Image from "next/image";

export default function LoginPanel() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        px: { xs: 2.5, md: 8 },
        py: { xs: 3, md: 4 },
      }}
    >
      {/* Navbar / logo. TODO: swap the wordmark for the real PCR logo SVG. */}
      <Box sx={{ py: 2, textAlign: "center" }}>
        <Image
          src="/pcr_logo.svg"
          width={120}
          height={40}
          alt={loginMessages.imageAlt}
          style={{ objectFit: "cover" }}
        />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          maxWidth: tokens.sizes.formMaxWidth,
          mx: "auto",
        }}
      >
        <Stack
          spacing={1}
          sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}
        >
          <Typography variant="h4" color="text.primary">
            {loginMessages.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "1.125rem", md: "1.25rem" } }}
          >
            {loginMessages.subtitle}
          </Typography>
        </Stack>

        <LoginForm />
      </Box>

      <Box sx={{ py: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {loginMessages.footer}
        </Typography>
      </Box>
    </Box>
  );
}
