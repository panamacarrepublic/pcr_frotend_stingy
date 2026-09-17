/**
 * Panama-specific constants shared by more than one feature module.
 *
 * These started inside `modules/listings/constants.ts`; sign-up needs the same
 * province list, and modules must not import each other's internals, so they
 * live here now and `listings` re-exports them for its existing call sites.
 */

/** Panama's provinces + comarcas. Stored as free text, constrained by the UI. */
export const PANAMA_PROVINCES = [
  "Bocas del Toro",
  "Coclé",
  "Colón",
  "Chiriquí",
  "Darién",
  "Herrera",
  "Los Santos",
  "Panamá",
  "Panamá Oeste",
  "Veraguas",
  "Guna Yala",
  "Emberá-Wounaan",
  "Ngäbe-Buglé",
] as const;

/**
 * `phone_prefix` is its own column on both profile tables, so the country code
 * is picked rather than typed. Panama is the only market today; the neighbours
 * are here because sellers near the border commonly use them.
 */
export const PHONE_PREFIXES = ["+507", "+506", "+57", "+1"] as const;

export const DEFAULT_PHONE_PREFIX = "+507";
