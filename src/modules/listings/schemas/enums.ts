import { z } from "zod";

// zod enums mirror the Postgres enum types (Supabase schema). These are the
// single runtime source for the option lists; Spanish labels live in constants.ts.
export const listingCategoryEnum = z.enum(["cars", "parts", "collectibles"]);
export const itemConditionEnum = z.enum(["new", "used", "refurbished"]);
export const vehicleTypeEnum = z.enum([
  "sedan",
  "suv",
  "pickup",
  "coupe",
  "hatchback",
  "van",
  "truck",
  "motorcycle",
  "other",
]);
export const fuelTypeEnum = z.enum(["gasoline", "diesel", "electric", "hybrid", "natural_gas"]);
export const transmissionTypeEnum = z.enum(["manual", "automatic", "cvt", "dual_clutch"]);
export const brandTypeEnum = z.enum(["oem", "aftermarket", "generic"]);
export const pieceSubtypeEnum = z.enum(["tires", "rims", "fluids", "parts", "accessories"]);

// Module-local canonical enum types (derived from the zod enums). Kept here —
// not imported from @pcr/types — so the listings form owns its own contract
// until the shared package + backend Pydantic are aligned in a coordinated PR.
export type ListingCategory = z.infer<typeof listingCategoryEnum>;
export type ItemCondition = z.infer<typeof itemConditionEnum>;
export type VehicleType = z.infer<typeof vehicleTypeEnum>;
export type FuelType = z.infer<typeof fuelTypeEnum>;
export type TransmissionType = z.infer<typeof transmissionTypeEnum>;
export type BrandType = z.infer<typeof brandTypeEnum>;
export type PieceSubtype = z.infer<typeof pieceSubtypeEnum>;
