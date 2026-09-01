/**
 * The two mappers the edit form needs: listing → form values on open, and form
 * values → PATCH body on save.
 *
 * The save direction is a **diff**, not a full serialization, for one concrete
 * reason: `photos` is a total replacement server-side. Sending it on every save
 * would delete and re-insert the whole gallery even when the seller only fixed a
 * typo in the title. `PATCH` is partial by omission and `{}` is a valid no-op,
 * so omitting what did not change is both cheaper and safer.
 *
 * Only `description`, `vin_number`, `model_id` and `model_text` may be sent as
 * `null` (see `ListingUpdate`) — that is what "the user cleared this field"
 * looks like on the wire. Every other field is either sent with a value or left
 * out entirely.
 */
import type {
  ListingResponse,
  ListingUpdate,
  PhotoInput,
  VehicleDataUpdate,
} from "../api/types";
import { listingPrice } from "../api/types";
import type { EditListingForm, EditListingInput } from "../schemas/editListing.schema";
import { OTHER_MODEL } from "../schemas/vehicle.schema";

/**
 * Listing → RHF default values.
 *
 * Numbers become strings because the inputs are text fields whose zod schemas
 * coerce on validate, and nulls become `""` so the inputs render empty instead
 * of showing "null".
 */
export function toEditListingValues(listing: ListingResponse): EditListingInput {
  const d = listing.data;
  return {
    title: listing.title,
    description: listing.description ?? "",
    professional_photos: listing.professional_photos,
    price: listing.price,
    condition: listing.condition,
    province: listing.province,
    district: listing.district,
    photos: listing.photos.map((p) => ({ url: p.url, sort_order: p.sort_order })),
    data: {
      category: "cars",
      vin_number: d.vin_number ?? "",
      // No reference model means the listing was published with the "Otro"
      // free-text option; the dropdown represents that as the sentinel.
      make_id: d.make_id,
      model_id: d.model_id ?? OTHER_MODEL,
      model_text: d.model_text ?? "",
      mileage: String(d.mileage),
      year: String(d.year),
      vehicle_type: d.vehicle_type,
      fuel_type: d.fuel_type,
      transmission_type: d.transmission_type,
    },
  };
}

/**
 * Normalize a gallery to what we would send: `sort_order` renumbered 1..n in
 * array order.
 *
 * Renumbering is not cosmetic. `PhotoUploader` derives `sort_order` from the
 * field-array length, so removing a photo and adding another yields two photos
 * with the same number — and since the feed's cover photo is the lowest
 * `sort_order`, a duplicate makes the cover arbitrary.
 */
function normalizePhotos(photos: readonly PhotoInput[]): PhotoInput[] {
  return photos.map((photo, i) => ({ url: photo.url, sort_order: i + 1 }));
}

function samePhotos(a: readonly PhotoInput[], b: readonly PhotoInput[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((photo, i) => photo.url === b[i].url && photo.sort_order === b[i].sort_order);
}

/**
 * A field the API stores as nullable, edited through an input that yields
 * `undefined` when blank. Returns the value to send, or `undefined` to omit.
 */
function nullableChange(
  next: string | undefined,
  current: string | null,
): string | null | undefined {
  if (next === undefined) return current === null ? undefined : null;
  return next === current ? undefined : next;
}

/** Assign only when `value` is not `undefined`, so omitted keys stay omitted. */
function set<T extends object, K extends keyof T>(target: T, key: K, value: T[K] | undefined) {
  if (value !== undefined) target[key] = value;
}

function vehicleDiff(form: EditListingForm, original: ListingResponse): VehicleDataUpdate {
  const next = form.data;
  const current = original.data;
  const patch: VehicleDataUpdate = {};

  set(patch, "vin_number", nullableChange(next.vin_number, current.vin_number));

  if (next.make_id !== current.make_id) patch.make_id = next.make_id;
  if (next.mileage !== current.mileage) patch.mileage = next.mileage;
  if (next.year !== current.year) patch.year = next.year;
  if (next.vehicle_type !== current.vehicle_type) patch.vehicle_type = next.vehicle_type;
  if (next.fuel_type !== current.fuel_type) patch.fuel_type = next.fuel_type;
  if (next.transmission_type !== current.transmission_type) {
    patch.transmission_type = next.transmission_type;
  }

  // The model is one choice spread over two columns, so both sides move
  // together: picking a reference model must clear a stale `model_text`, and
  // picking "Otro" must clear the now-wrong `model_id`.
  const isOther = next.model_id === OTHER_MODEL;
  const modelId = isOther ? null : next.model_id;
  const modelText = isOther ? (next.model_text ?? null) : null;
  if (modelId !== current.model_id) patch.model_id = modelId;
  if (modelText !== current.model_text) patch.model_text = modelText;

  return patch;
}

/**
 * Parsed form values + the listing they were seeded from → the PATCH body.
 * Returns `{}` when nothing changed.
 *
 * `category`, `currency`, `quantity` and `status` are never emitted: the first
 * two are rejected by the API, `quantity` is not on this form, and `status` is
 * owned by the pause / mark-as-sold actions instead.
 */
export function toListingUpdatePayload(
  form: EditListingForm,
  original: ListingResponse,
): ListingUpdate {
  const patch: ListingUpdate = {};

  if (form.title !== original.title) patch.title = form.title;
  set(patch, "description", nullableChange(form.description, original.description));
  if (form.professional_photos !== original.professional_photos) {
    patch.professional_photos = form.professional_photos;
  }
  // The response carries price as a decimal string; comparing it to the form's
  // number directly would flag every untouched price as an edit.
  if (form.price !== listingPrice(original)) patch.price = form.price;
  if (form.condition !== original.condition) patch.condition = form.condition;
  if (form.province !== original.province) patch.province = form.province;
  if (form.district !== original.district) patch.district = form.district;

  const photos = normalizePhotos(form.photos);
  if (!samePhotos(photos, normalizePhotos(original.photos))) patch.photos = photos;

  const data = vehicleDiff(form, original);
  if (Object.keys(data).length > 0) patch.data = data;

  return patch;
}
