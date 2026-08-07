import Box from "@mui/material/Box";

import LoginImagePanel from "@/modules/auth/components/LoginImagePanel";
import LoginPanel from "@/modules/auth/components/LoginPanel";

export default function LoginView() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        minHeight: "100vh",
        backgroundColor: "background.canvas",
      }}
    >
      <LoginPanel />
      <LoginImagePanel />
    </Box>
  );
}
