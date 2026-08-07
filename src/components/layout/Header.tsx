import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const NAV = [
  { label: "Vehiculos", href: "/listings" },
  { label: "Vender", href: "/sell" },
  { label: "Mi cuenta", href: "/account" },
];

export default function Header() {
  return (
    <AppBar position="sticky" sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <Typography component={Link} href="/" variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            Panama Car Republic
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
            {NAV.map((item) => (
              <Button key={item.href} component={Link} href={item.href} color="inherit">
                {item.label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
