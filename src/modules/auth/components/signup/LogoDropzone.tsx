"use client";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";

import { signupMessages } from "@/modules/auth/signupMessages";
import { tokens } from "@/theme/tokens";

import type { SignupVariantStyle } from "./variants";

const m = signupMessages.logo;

interface Props {
  style: SignupVariantStyle;
  onChange: (file: File | null) => void;
}

/**
 * Company logo picker for the business branch.
 *
 * It holds the `File` in local state rather than in the form values: the zod
 * schema is imported by server code too, and `z.instanceof(File)` would drag a
 * browser global into it — the same reason the listing wizard keeps files out
 * of its schema.
 *
 * `business_users.logo_url` is nullable and there is no upload endpoint yet, so
 * the file is captured and reported, not sent.
 */
export function LogoDropzone({ style, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const select = (next: File | null) => {
    setFile(next);
    onChange(next);
  };

  return (
    <Stack spacing={0.5}>
      <Box
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          select(e.dataTransfer.files?.[0] ?? null);
        }}
        sx={{
          border: `1.5px dashed ${dragOver ? style.text : style.fieldBorder}`,
          borderRadius: `${tokens.radius.md}px`,
          bgcolor: style.fieldBg,
          px: 2,
          py: 4,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: style.text }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: style.text, mt: 1 }}>
          {m.drop}
          <Box component="span" sx={{ textDecoration: "underline" }}>
            {m.browse}
          </Box>
        </Typography>
        <Typography variant="caption" sx={{ color: style.mutedText }}>
          {m.formats}
        </Typography>
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept=".svg,.eps,.ai,.pdf,.png,.jpg,.jpeg"
        hidden
        onChange={(e) => {
          select(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: style.text }}>
          {m.counter(file ? 1 : 0)}
        </Typography>
        {file ? (
          <>
            <Typography variant="caption" sx={{ color: style.mutedText, flexGrow: 1, minWidth: 0 }} noWrap>
              {file.name}
            </Typography>
            <IconButton size="small" aria-label={m.remove} onClick={() => select(null)} sx={{ color: style.text }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </>
        ) : null}
      </Stack>
    </Stack>
  );
}
