"use client";

import Box from "@mui/material/Box";
import Image from "next/image";
import { useState } from "react";

import type { AccountKind } from "@/modules/auth/schemas";
import { signupMessages } from "@/modules/auth/signupMessages";

import { SignupPanel } from "./SignupPanel";
import { signupVariants } from "./variants";

/**
 * Two-column sign-up screen. The account kind lives here because it drives both
 * halves: the form fields on the left and the hero photo on the right.
 *
 * TODO(assets): Figma pairs each kind with its own photo. Both currently reuse
 * the login hero — the two images still need exporting from the file.
 */
export function SignupView() {
  const [kind, setKind] = useState<AccountKind>("regular");
  const style = signupVariants[kind];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        minHeight: "100vh",
        bgcolor: style.panelBg,
      }}
    >
      <SignupPanel kind={kind} onKindChange={setKind} />
      <Box sx={{ display: { xs: "none", md: "block" }, position: "relative", minHeight: "100vh" }}>
        <Image
          src="/images/login/login_image.png"
          alt={signupMessages.imageAlt[kind]}
          fill
          priority
          sizes="50vw"
          style={{ objectFit: "cover" }}
        />
      </Box>
    </Box>
  );
}
