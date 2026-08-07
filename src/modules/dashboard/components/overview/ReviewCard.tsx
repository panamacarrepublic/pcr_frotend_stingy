import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { tokens } from "@/theme/tokens";
import { Tag } from "@/modules/dashboard/components/ui/Tag";
import type { ReviewItem } from "@/modules/dashboard/types";

function StarRow({ rating }: { rating: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = rating >= i + 1;
        const half = !filled && rating >= i + 0.5;
        const color = tokens.colors.roti.main;
        if (filled) return <StarIcon key={i} sx={{ fontSize: 16, color }} />;
        if (half) return <StarHalfIcon key={i} sx={{ fontSize: 16, color }} />;
        return <StarBorderIcon key={i} sx={{ fontSize: 16, color }} />;
      })}
    </Box>
  );
}

export function ReviewCard({ review }: { review: ReviewItem }) {
  const { productTitle, imageUrl, rating, comments, lastDate, unread } = review;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "rgba(255,255,255,0.6)",
        border: `1px solid ${tokens.colors.cardBorder}`,
        borderRadius: 2,
        px: 1.5,
        py: 1,
        width: "100%",
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 1,
          overflow: "hidden",
          flexShrink: 0,
          bgcolor: tokens.colors.thunderLightest,
        }}
      >
        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt={productTitle}
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </Box>

      {/* Text content */}
      <Box sx={{ flex: "1 0 0", minWidth: 0, mx: 1.5 }}>
        <Typography variant="caption" component="p" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {productTitle}
        </Typography>

        {/* Stars + label */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <StarRow rating={rating} />
          <Typography variant="caption" sx={{ color: tokens.colors.thunder, lineHeight: 1.5 }}>
            {`${rating} Estrellas`}
          </Typography>
        </Box>

        {/* Comments */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 15, color: tokens.colors.thunder }} />
          <Typography variant="caption" sx={{ color: tokens.colors.thunder, lineHeight: 1.5 }}>
            {`${comments} comentarios`}
          </Typography>
        </Box>

        {/* Last date */}
        <Typography variant="caption" component="p" sx={{ color: tokens.colors.thunder, lineHeight: 1.5 }}>
          {`Último: ${lastDate}`}
        </Typography>
      </Box>

      {/* Tag column */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: 72,
          width: 57,
          flexShrink: 0,
        }}
      >
        {unread && <Tag label="Sin leer" tone="neutral" />}
      </Box>
    </Box>
  );
}
