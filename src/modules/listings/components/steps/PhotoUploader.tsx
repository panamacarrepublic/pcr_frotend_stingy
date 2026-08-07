"use client";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { tokens } from "@/theme/tokens";

import { MAX_PHOTOS } from "../../constants";
import { listingMessages } from "../../messages";

const m = listingMessages.photos;

/**
 * Drag-and-drop / click photo picker backed by an RHF field array. Stores object
 * URLs for preview + validation; the real Supabase Storage upload happens in
 * useCreateListing (TODO M4). Drag-to-reorder is a follow-up.
 */
export function PhotoUploader() {
  const { control, formState } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "photos" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const remaining = MAX_PHOTOS - fields.length;
    Array.from(list)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, Math.max(0, remaining))
      .forEach((file, i) => {
        append({ url: URL.createObjectURL(file), sort_order: fields.length + i + 1 });
      });
  };

  const photosError = formState.errors.photos?.message as string | undefined;

  return (
    <Stack spacing={2}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {m.instructions}
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 2.5, color: "text.secondary" }}>
        {m.bullets.map((b) => (
          <Typography key={b} component="li" variant="body2">
            {b}
          </Typography>
        ))}
      </Box>

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
          addFiles(e.dataTransfer.files);
        }}
        sx={{
          border: `1.5px dashed ${dragOver ? tokens.colors.roti.main : tokens.colors.border}`,
          borderRadius: `${tokens.radius.md}px`,
          bgcolor: dragOver ? tokens.colors.roti.lighter : tokens.colors.white,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: tokens.colors.neutral }} />
        <Typography sx={{ fontWeight: 600, mt: 1 }}>
          {m.dropTitle}{" "}
          <Box component="span" sx={{ color: tokens.colors.roti.dark }}>
            {m.browse}
          </Box>
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {m.formats}
        </Typography>
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        multiple
        hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {photosError ? (
        <Typography variant="caption" sx={{ color: "error.main" }}>
          {photosError}
        </Typography>
      ) : null}

      {fields.length > 0 ? (
        <Stack spacing={1}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {`${fields.length}/${MAX_PHOTOS}`}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))",
              gap: 1,
            }}
          >
            {fields.map((field, i) => {
              const url = (field as unknown as { url: string }).url;
              return (
                <Box
                  key={field.id}
                  sx={{
                    position: "relative",
                    pt: "75%",
                    borderRadius: `${tokens.radius.md}px`,
                    overflow: "hidden",
                    border: `1px solid ${tokens.colors.border}`,
                  }}
                >
                  <Box sx={{ position: "absolute", inset: 0 }}>
                    <Image src={url} alt={`Foto ${i + 1}`} fill sizes="84px" style={{ objectFit: "cover" }} unoptimized />
                  </Box>
                  <IconButton
                    size="small"
                    aria-label={m.remove}
                    onClick={() => remove(i)}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      bgcolor: tokens.colors.whiteAlpha[60],
                      "&:hover": { bgcolor: tokens.colors.white },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        </Stack>
      ) : null}
    </Stack>
  );
}
