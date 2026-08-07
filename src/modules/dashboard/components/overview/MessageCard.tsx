import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { tokens } from "@/theme/tokens";
import { Tag } from "@/modules/dashboard/components/ui/Tag";
import type { MessageItem } from "@/modules/dashboard/types";

export function MessageCard({ message }: { message: MessageItem }) {
  const { author, avatarUrl, subject, snippet, date, unread } = message;

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
      {/* Avatar */}
      <Avatar
        src={avatarUrl}
        alt={author}
        sx={{
          width: 48,
          height: 48,
          border: `2px solid rgba(30,30,30,0.1)`,
          flexShrink: 0,
        }}
      />

      {/* Text content */}
      <Box sx={{ flex: "1 0 0", minWidth: 0, mx: 1.5 }}>
        <Typography variant="caption" component="p" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.5 }}>
          {author}
        </Typography>
        <Typography variant="caption" component="p" sx={{ color: tokens.colors.thunder, lineHeight: 1.5 }}>
          {subject}
        </Typography>
        <Typography
          variant="caption"
          component="p"
          sx={{
            color: "text.primary",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {snippet}
        </Typography>
        <Typography variant="caption" component="p" sx={{ color: tokens.colors.thunder, lineHeight: 1.5 }}>
          {`Fecha: ${date}`}
        </Typography>
      </Box>

      {/* Tag + action column */}
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
        <IconButton size="small" aria-label="más opciones" sx={{ mt: "auto" }}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
