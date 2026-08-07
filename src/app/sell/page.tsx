import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function SellPage() {
  return (
    <>
      <Header />
      <Container maxWidth="md" component="main" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={2}>
          <Typography variant="h2">Vender</Typography>
          <Typography variant="body1" color="text.secondary">
            Flujo de publicacion en construccion.
          </Typography>
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
