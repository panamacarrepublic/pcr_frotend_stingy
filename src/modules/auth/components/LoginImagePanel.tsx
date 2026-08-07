import Box from "@mui/material/Box";
import Image from "next/image";

import { loginMessages } from "@/modules/auth/messages";

// Right-column hero image.
export default function LoginImagePanel() {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "block" },
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <Image
        src="/images/login/login_image.png"
        alt={loginMessages.imageAlt}
        fill
        priority
        sizes="50vw"
        style={{ objectFit: "cover" }}
      />
    </Box>
  );
}
