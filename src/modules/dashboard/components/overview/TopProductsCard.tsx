import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { StatCard } from "@/modules/dashboard/components/overview/StatCard";
import { Tag } from "@/modules/dashboard/components/ui/Tag";
import { tokens } from "@/theme/tokens";
import type { TopProduct } from "@/modules/dashboard/types";

// Rank-1 product uses azul.lightest bg; rank-2+ use thunderLightest.
function rankBg(rank: number): string {
  return rank === 1 ? tokens.colors.azul.lightest : tokens.colors.thunderLightest;
}

export function TopProductsCard({ products }: { products: TopProduct[] }) {
  return (
    <StatCard title="Producto Más Visto">
      <Stack spacing={2.5} sx={{ overflowY: "auto" }}>
        {products.map((p) => (
          <Stack key={p.rank} direction="row" spacing={3.5} alignItems="flex-start">
            {/* Rank number — display font (h4 variant = Source Sans / Hanley Pro display heading) */}
            <Typography
              variant="h4"
              sx={{ fontFamily: "var(--font-display), Georgia, serif", lineHeight: 1, letterSpacing: "-0.01em", flexShrink: 0 }}
            >
              {p.rank}
            </Typography>

            {/* Product card */}
            <Box
              sx={{
                bgcolor: rankBg(p.rank),
                borderRadius: 1.5,
                p: 1.25,
                display: "flex",
                // Image beside text needs ~270px; below that they stack.
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1.5, sm: 2.5 },
                flex: "1 0 0",
                minWidth: 0,
              }}
            >
              {/* Image */}
              <Box
                sx={{
                  flex: { xs: "0 0 auto", sm: "1 0 0" },
                  width: { xs: "100%", sm: "auto" },
                  minWidth: 0,
                  position: "relative",
                  minHeight: { xs: 140, sm: 80 },
                }}
              >
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    style={{ objectFit: "cover", borderRadius: 6 }}
                    sizes="100px"
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      minHeight: 80,
                      bgcolor: tokens.colors.thunderLightest,
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>

              {/* Content */}
              <Stack spacing={1} sx={{ flexShrink: 0, width: { xs: "100%", sm: 171 } }}>
                <Tag label={p.category} tone={p.categoryTone} />
                <Typography variant="caption" fontWeight={600} color="text.primary">
                  {p.title}
                </Typography>
                <Typography variant="caption" color="text.primary">
                  Vistas: {p.views}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        ))}
      </Stack>
    </StatCard>
  );
}
