"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useState } from "react";

import type { AccountKind } from "@/modules/auth/schemas";
import { signupMessages } from "@/modules/auth/signupMessages";
import { tokens } from "@/theme/tokens";

import { SignupForm } from "./SignupForm";
import { SignupSuccess } from "./SignupSuccess";
import { signupVariants } from "./variants";

const m = signupMessages;

interface Props {
  kind: AccountKind;
  onKindChange: (kind: AccountKind) => void;
}

/** Left column: brand, headings, and either the form or its confirmation. */
export function SignupPanel({ kind, onKindChange }: Props) {
  const style = signupVariants[kind];
  const [submitted, setSubmitted] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: style.panelBg,
        px: { xs: 2.5, md: 8 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Box sx={{ py: 2, textAlign: "center" }}>
        <Image src="/pcr_logo.svg" width={120} height={40} alt="Panama Car Republic" />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: tokens.sizes.formMaxWidth,
          mx: "auto",
        }}
      >
        <Stack spacing={0.5} sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h3" sx={{ color: style.text, textTransform: "uppercase" }}>
            {m.title}
          </Typography>
          <Typography variant="body1" sx={{ color: style.mutedText }}>
            {m.welcome}
          </Typography>
        </Stack>

        {submitted ? (
          <SignupSuccess style={style} />
        ) : (
          <SignupForm
            kind={kind}
            onKindChange={onKindChange}
            onSubmitted={() => setSubmitted(true)}
          />
        )}
      </Box>

      <Box sx={{ py: 2, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: style.mutedText }}>
          {m.footer}
        </Typography>
      </Box>
    </Box>
  );
}
