import type {
  ListingDataInput,
  PhotoInputValue,
  PublishListingForm,
} from "../schemas/listing.schema";
import { OTHER_MODEL } from "../schemas/vehicle.schema";

type CarsData = Extract<ListingDataInput, { category: "cars" }>;

/** Vehicle data as sent to the API: the "Otro" sentinel is resolved to
 * model_id:null + model_text; a real model sends model_id + model_text:null. */
export type VehicleCreatePayloadData = Omit<CarsData, "model_id" | "model_text"> & {
  model_id: string | null;
  model_text: string | null;
};

/**
 * Request body for POST /api/v1/listings. `user_id`/`business_id` come from the
 * JWT server-side and are not sent; `category` (inside `data`) maps to
 * `category_id` server-side.
 */
export interface ListingCreatePayload {
  title: string;
  description?: string;
  professional_photos: boolean;
  photos: PhotoInputValue[];
  data: VehicleCreatePayloadData;
}

/** Pure mapper: parsed form values → the normalized create payload. */
export function toListingCreatePayload(form: PublishListingForm): ListingCreatePayload {
  const d = form.data;
  const isOther = d.model_id === OTHER_MODEL;
  return {
    title: form.title,
    description: form.description,
    professional_photos: form.professional_photos,
    photos: form.photos,
    data: {
      ...d,
      model_id: isOther ? null : d.model_id,
      model_text: isOther ? (d.model_text ?? null) : null,
    },
  };
}
