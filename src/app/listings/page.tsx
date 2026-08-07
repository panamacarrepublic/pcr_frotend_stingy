import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function ListingsPage() {
  return (
    <>
      <Header />
      <Container maxWidth="lg" component="main" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={2}>
          <Typography variant="h2">Vehiculos</Typography>
          <Typography variant="body1" color="text.secondary">
            Feed de busqueda en construccion.
          </Typography>
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
