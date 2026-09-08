import type { FieldErrors, Path } from "react-hook-form";

import { listingMessages } from "../messages";
import type { EditListingForm } from "../schemas/editListing.schema";

export type EditTabId = "info" | "photos" | "details";

export interface EditTabMeta {
  id: EditTabId;
  label: string;
  /** RHF paths this tab renders. Used to route a validation error to its tab. */
  fields: Path<EditListingForm>[];
}

/**
 * The three tabs the Figma handover notes specify for the edit modal
 * ("Modal con tabs: Informacion, Fotos, Detalles del Producto"), with the field
 * each one owns.
 *
 * Data-driven for the same reason as `stepRegistry`: the tab bar, the error
 * routing and the field layout all read from one list, so moving a field
 * between tabs is a one-line change.
 */
export const editTabs: EditTabMeta[] = [
  {
    id: "info",
    label: listingMessages.edit.tabs.info,
    fields: ["title", "price", "condition", "province", "district", "description"],
  },
  {
    id: "photos",
    label: listingMessages.edit.tabs.photos,
    fields: ["photos", "professional_photos"],
  },
  {
    id: "details",
    label: listingMessages.edit.tabs.details,
    fields: [
      "data.make_id",
      "data.model_id",
      "data.model_text",
      "data.year",
      "data.mileage",
      "data.vin_number",
      "data.vehicle_type",
      "data.fuel_type",
      "data.transmission_type",
    ],
  },
];

/** Flatten RHF's nested error object into dotted paths (`data.mileage`). */
function errorPaths(errors: FieldErrors, prefix = ""): string[] {
  return Object.entries(errors).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    // A node carrying `message`/`type` is the error itself; anything else is a
    // nested group (`data`) whose children hold the real errors.
    if (value && typeof value === "object" && !("message" in value) && !("type" in value)) {
      return errorPaths(value as FieldErrors, path);
    }
    return [path];
  });
}

/**
 * Which tab to show for a failed submit. Returns the earliest tab in `editTabs`
 * that owns a broken field, so a seller with two mistakes fixes them left to
 * right instead of being bounced backwards.
 *
 * Without this, a validation error on a hidden tab makes "Guardar cambios" look
 * like it silently does nothing.
 */
export function firstTabWithError(errors: FieldErrors): EditTabId | undefined {
  const paths = errorPaths(errors);
  if (paths.length === 0) return undefined;

  return editTabs.find((tab) =>
    tab.fields.some((field) => paths.some((path) => path === field || path.startsWith(`${field}.`))),
  )?.id;
}
