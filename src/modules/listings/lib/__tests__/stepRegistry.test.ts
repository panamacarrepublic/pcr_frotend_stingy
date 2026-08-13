import { publishListingSchema } from "../../schemas/listing.schema";
import { wizardSteps } from "../stepRegistry";

const MAKE_ID = "11111111-1111-1111-1111-111111111111";
const MODEL_ID = "22222222-2222-2222-2222-222222222222";

/** Every field the wizard can show, all filled — so a path that resolves to
 * `undefined` below means the path itself is wrong, not that the value is blank. */
const fullyPopulatedForm = {
  title: "Toyota Corolla 2020 automático full",
  description: "Único dueño, mantenimientos al día.",
  professional_photos: true,
  price: "18500",
  condition: "used",
  province: "Panamá",
  district: "Betania",
  terms_accepted: true,
  photos: [{ url: "https://cdn.example.com/a.jpg", sort_order: 1 }],
  data: {
    category: "cars",
    vin_number: "JTDBR32E720012345",
    make_id: MAKE_ID,
    model_id: MODEL_ID,
    model_text: "",
    mileage: "45000",
    year: "2020",
    vehicle_type: "sedan",
    fuel_type: "gasoline",
    transmission_type: "automatic",
  },
};

const at = (obj: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], obj);

/**
 * `goNext` advances the wizard by calling `form.trigger(step.fields)`. React Hook
 * Form silently reports success for a path that doesn't exist, so a stale path
 * here means the step stops validating and the user only discovers the problem
 * at submit — as a 422 from the API. This pins every path to the schema.
 */
describe("wizardSteps field paths", () => {
  const parsed = publishListingSchema.parse(fullyPopulatedForm);
  const allPaths = wizardSteps.flatMap((step) => step.fields);

  it("covers every step", () => {
    expect(allPaths.length).toBeGreaterThan(0);
  });

  it.each(allPaths)("`%s` resolves against the parsed schema", (path) => {
    expect(at(parsed, path)).toBeDefined();
  });

  it("no longer points the cross-vertical fields at `data`", () => {
    for (const stale of ["data.price", "data.condition", "data.province", "data.district"]) {
      expect(allPaths).not.toContain(stale);
    }
    for (const moved of ["price", "condition", "province", "district"]) {
      expect(allPaths).toContain(moved);
    }
  });
});
