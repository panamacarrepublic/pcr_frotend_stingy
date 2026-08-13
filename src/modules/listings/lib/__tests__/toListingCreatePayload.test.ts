import { publishListingSchema } from "../../schemas/listing.schema";
import { OTHER_MODEL } from "../../schemas/vehicle.schema";
import { toListingCreatePayload } from "../toListingCreatePayload";

const MAKE_ID = "11111111-1111-1111-1111-111111111111";
const MODEL_ID = "22222222-2222-2222-2222-222222222222";

/** Parse through the real schema so the mapper sees the output shape the form
 * actually hands it (numbers coerced, blank optionals dropped). */
const parse = (overrides: Record<string, unknown> = {}) =>
  publishListingSchema.parse({
    title: "Toyota Corolla 2020 automático full",
    description: "Único dueño.",
    professional_photos: false,
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
    ...overrides,
  });

describe("toListingCreatePayload", () => {
  it("puts the cross-vertical fields at the top level", () => {
    const payload = toListingCreatePayload(parse());
    expect(payload.price).toBe(18500);
    expect(payload.condition).toBe("used");
    expect(payload.province).toBe("Panamá");
    expect(payload.district).toBe("Betania");
  });

  // The backend rejects the old shape outright (422), so a regression here is a
  // broken publish flow, not a silently-ignored field.
  it("does not leave them inside `data`", () => {
    const data = toListingCreatePayload(parse()).data as Record<string, unknown>;
    expect(data).not.toHaveProperty("price");
    expect(data).not.toHaveProperty("condition");
    expect(data).not.toHaveProperty("province");
    expect(data).not.toHaveProperty("district");
  });

  it("keeps the car-specific fields inside `data`", () => {
    const payload = toListingCreatePayload(parse());
    expect(payload.data.make_id).toBe(MAKE_ID);
    expect(payload.data.mileage).toBe(45000);
    expect(payload.data.year).toBe(2020);
    expect(payload.data.category).toBe("cars");
  });

  it("still resolves the OTHER_MODEL sentinel", () => {
    const form = parse({
      data: {
        category: "cars",
        vin_number: "",
        make_id: MAKE_ID,
        model_id: OTHER_MODEL,
        model_text: "Corolla Cross GR",
        mileage: "45000",
        year: "2020",
        vehicle_type: "sedan",
        fuel_type: "gasoline",
        transmission_type: "automatic",
      },
    });
    const payload = toListingCreatePayload(form);
    expect(payload.data.model_id).toBeNull();
    expect(payload.data.model_text).toBe("Corolla Cross GR");
  });
});
