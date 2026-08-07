import { z } from "zod";

import {
  fuelTypeEnum,
  itemConditionEnum,
  transmissionTypeEnum,
  vehicleTypeEnum,
} from "./enums";
import { numeric, optionalText } from "./helpers";

// year bounds mirror the DB check constraint on listing_vehicles.year.
const YEAR_MIN = 1886;
const YEAR_MAX = 2030;

/** Sentinel value for the Modelo dropdown's "Otro" (free-text) choice. The mapper
 * converts it to model_id:null + model_text before sending to the API. */
export const OTHER_MODEL = "__other__";

/** cars branch of the listing discriminated union → listing_vehicles row.
 * make_id is a required reference; model is hybrid: a reference model_id or the
 * OTHER_MODEL sentinel (which requires model_text — enforced on the union). */
export const vehicleDataSchema = z.object({
  category: z.literal("cars"),
  price: numeric().pipe(z.number().positive()),
  vin_number: optionalText(z.string().trim().max(17)),
  make_id: z.string().uuid(),
  model_id: z.union([z.string().uuid(), z.literal(OTHER_MODEL)]),
  model_text: optionalText(z.string().trim().max(60)),
  mileage: numeric().pipe(z.number().int().min(0)),
  year: numeric().pipe(z.number().int().min(YEAR_MIN).max(YEAR_MAX)),
  vehicle_type: vehicleTypeEnum,
  fuel_type: fuelTypeEnum,
  condition: itemConditionEnum,
  transmission_type: transmissionTypeEnum,
  province: z.string().trim().min(1),
  district: z.string().trim().min(1),
});

export type VehicleDataInput = z.input<typeof vehicleDataSchema>;
export type VehicleData = z.output<typeof vehicleDataSchema>;
