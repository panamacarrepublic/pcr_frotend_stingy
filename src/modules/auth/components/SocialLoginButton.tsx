import Button from "@mui/material/Button";
import type { ReactNode } from "react";

interface SocialLoginButtonProps {
  icon: ReactNode;
  label: string;
}

export default function SocialLoginButton({ icon, label }: SocialLoginButtonProps) {
  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={icon}
      sx={{
        bgcolor: "grey.100",
        color: "text.primary",
        borderColor: "divider",
        py: 1.25,
        fontWeight: 600,
        "&:hover": { bgcolor: "grey.200", borderColor: "divider" },
      }}
    >
      {label}
    </Button>
  );
}
