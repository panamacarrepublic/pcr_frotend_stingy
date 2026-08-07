import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <Container maxWidth="lg" component="main" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={2}>
          <Typography variant="h2">Detalle del anuncio</Typography>
          <Typography variant="body1" color="text.secondary">
            Anuncio {params.id} en construccion.
          </Typography>
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
