import { PANAMA_PROVINCES } from "@/lib/panama";

import type {
  FuelType,
  ItemCondition,
  TransmissionType,
  VehicleType,
} from "./schemas/enums";

export const MIN_PHOTOS = 1;
export const MAX_PHOTOS = 10;
export const RECOMMENDED_MIN_PHOTOS = 3;
export const LISTING_FEE_USD = 5;

// Panama's provinces + comarcas now live in `lib/panama` — sign-up needs the
// same list, and modules must not import each other's internals.
export { PANAMA_PROVINCES } from "@/lib/panama";

// Enum → Spanish (Panama) labels. Keys are exhaustive over the module enums, so
// adding a value to enums.ts forces a label here (compile error otherwise).
export const vehicleTypeLabels: Record<VehicleType, string> = {
  sedan: "Sedán",
  suv: "SUV",
  pickup: "Pickup",
  coupe: "Coupé",
  hatchback: "Hatchback",
  van: "Van",
  truck: "Camión",
  motorcycle: "Motocicleta",
  other: "Otro",
};

export const fuelTypeLabels: Record<FuelType, string> = {
  gasoline: "Gasolina",
  diesel: "Diésel",
  electric: "Eléctrico",
  hybrid: "Híbrido",
  natural_gas: "Gas natural",
};

export const transmissionLabels: Record<TransmissionType, string> = {
  manual: "Manual",
  automatic: "Automática",
  cvt: "CVT",
  dual_clutch: "Doble embrague",
};

export const conditionLabels: Record<ItemCondition, string> = {
  new: "Nuevo",
  used: "Usado",
  refurbished: "Reacondicionado",
};

export interface SelectOption {
  value: string;
  label: string;
}

/** Turn an enum→label map into `{ value, label }[]` for RhfSelect. */
export const toSelectOptions = <T extends string>(labels: Record<T, string>): SelectOption[] =>
  (Object.entries(labels) as [T, string][]).map(([value, label]) => ({ value, label }));

export const provinceOptions: SelectOption[] = PANAMA_PROVINCES.map((p) => ({
  value: p,
  label: p,
}));
