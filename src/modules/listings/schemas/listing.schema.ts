import { z } from "zod";

import { listingMessages } from "../messages";
import { optionalText } from "./helpers";
import { OTHER_MODEL, vehicleDataSchema } from "./vehicle.schema";

// listing_photos: sort_order is 1..10, at least one photo required.
export const photoInputSchema = z.object({
  url: z.string().url(),
  sort_order: z.number().int().min(1).max(10),
});

/**
 * Category-specific payload, discriminated on `category`. Only the cars branch
 * exists today; parts/collectibles slot straight in here as their schemas land
 * — the wizard, mapper, and endpoint need no other change.
 */
export const listingDataSchema = z
  .discriminatedUnion("category", [vehicleDataSchema])
  .superRefine((data, ctx) => {
    // The "Otro" model choice requires the free-text field.
    if (
      data.category === "cars" &&
      data.model_id === OTHER_MODEL &&
      !data.model_text?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["model_text"],
        message: listingMessages.errors.required,
      });
    }
  });

/** Full form contract spanning every wizard step. */
export const publishListingSchema = z.object({
  title: z.string().trim().min(5).max(150),
  description: optionalText(z.string().trim().max(2000)),
  professional_photos: z.boolean().default(false),
  // UI-only gate (not persisted): the terms checkbox must be checked to publish.
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar los términos y condiciones" }),
  }),
  photos: z.array(photoInputSchema).min(1).max(10),
  data: listingDataSchema,
});

export type PublishListingInput = z.input<typeof publishListingSchema>;
export type PublishListingForm = z.output<typeof publishListingSchema>;
export type ListingDataInput = z.output<typeof listingDataSchema>;
export type PhotoInputValue = z.output<typeof photoInputSchema>;
