import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 4, mt: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Panama Car Republic. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
