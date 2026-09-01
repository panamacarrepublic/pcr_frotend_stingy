/**
 * Uploads the wizard's photos to Supabase Storage and returns the same array
 * with durable public URLs.
 *
 * Why this exists: `PhotoUploader` stores `URL.createObjectURL(file)`, i.e. a
 * `blob:` URL that is valid only inside the tab that created it. The backend has
 * no upload endpoint (contract §8) — it stores `photos[].url` verbatim — so
 * posting those straight through would persist listings whose images 404 for
 * everyone, including the seller on their next visit.
 *
 * Rather than thread `File` objects through the zod schema and RHF field array
 * (which would drag `z.instanceof(File)` into a module that also gets imported
 * server-side), we read the bytes back out of the object URL. `fetch` resolves
 * `blob:` URLs from the same document, and the resulting `Blob` carries the
 * original MIME type.
 *
 * Non-`blob:` URLs pass through untouched, so an already-hosted photo survives a
 * re-submit — which is what the edit flow will need when it lands.
 */
import { supabase } from "@/lib/supabase-client";

import type { PhotoInput } from "../api/types";

export const LISTING_IMAGES_BUCKET = "listing-images";

/** Extensions for the formats the picker accepts (`image/png,image/jpeg`). */
const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export class PhotoUploadError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "PhotoUploadError";
  }
}

function extensionFor(mimeType: string): string {
  return EXTENSION_BY_MIME[mimeType] ?? "jpg";
}

/**
 * Uploads one photo and returns its public URL. Already-remote URLs short-circuit.
 * `userId` is the first path segment so a storage RLS policy can scope writes to
 * the owner via `(storage.foldername(name))[1] = auth.uid()::text`.
 */
async function uploadPhoto(photo: PhotoInput, userId: string): Promise<PhotoInput> {
  if (!photo.url.startsWith("blob:")) return photo;

  let blob: Blob;
  try {
    blob = await fetch(photo.url).then((res) => res.blob());
  } catch (cause) {
    // The object URL was revoked, or the document that created it is gone.
    throw new PhotoUploadError("No se pudo leer una de las imágenes.", cause);
  }

  const path = `${userId}/${crypto.randomUUID()}.${extensionFor(blob.type)}`;
  const { error } = await supabase.storage
    .from(LISTING_IMAGES_BUCKET)
    .upload(path, blob, { contentType: blob.type || "image/jpeg", upsert: false });

  if (error) throw new PhotoUploadError(error.message, error);

  const {
    data: { publicUrl },
  } = supabase.storage.from(LISTING_IMAGES_BUCKET).getPublicUrl(path);

  return { url: publicUrl, sort_order: photo.sort_order };
}

/**
 * Uploads every photo that still points at a `blob:` URL, preserving order and
 * `sort_order`. Uploads run in parallel; if any one fails the whole call
 * rejects, so we never POST a listing with a half-uploaded gallery.
 */
export async function uploadListingPhotos(photos: PhotoInput[]): Promise<PhotoInput[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    // The POST would 401 a moment later anyway; failing here gives a clearer message.
    throw new PhotoUploadError("Tu sesión expiró. Inicia sesión de nuevo para publicar.");
  }

  return Promise.all(photos.map((photo) => uploadPhoto(photo, userId)));
}
