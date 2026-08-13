import { publishListingSchema } from "../listing.schema";
import { OTHER_MODEL, vehicleDataSchema } from "../vehicle.schema";

const MAKE_ID = "11111111-1111-1111-1111-111111111111";
const MODEL_ID = "22222222-2222-2222-2222-222222222222";

// Values as they arrive from the form inputs (numbers as strings, blank optional).
// price/condition/province/district are NOT here — they belong to the listing.
const validVehicle = {
  category: "cars",
  vin_number: "",
  make_id: MAKE_ID,
  model_id: MODEL_ID,
  model_text: "",
  mileage: "45000",
  year: "2020",
  vehicle_type: "sedan",
  fuel_type: "gasoline",
  transmission_type: "automatic",
};

describe("vehicleDataSchema", () => {
  it("parses and coerces a valid vehicle", () => {
    const r = vehicleDataSchema.parse(validVehicle);
    expect(r.year).toBe(2020);
    expect(r.mileage).toBe(45000);
    expect(r.make_id).toBe(MAKE_ID);
    expect(r.model_id).toBe(MODEL_ID);
    expect(r.vin_number).toBeUndefined(); // blank optional → undefined
  });

  it("no longer carries the cross-vertical fields", () => {
    const r = vehicleDataSchema.parse(validVehicle) as Record<string, unknown>;
    expect(r).not.toHaveProperty("price");
    expect(r).not.toHaveProperty("condition");
    expect(r).not.toHaveProperty("province");
    expect(r).not.toHaveProperty("district");
  });

  it("rejects an out-of-range year", () => {
    expect(vehicleDataSchema.safeParse({ ...validVehicle, year: "1700" }).success).toBe(false);
    expect(vehicleDataSchema.safeParse({ ...validVehicle, year: "2099" }).success).toBe(false);
  });

  it("rejects negative mileage", () => {
    expect(vehicleDataSchema.safeParse({ ...validVehicle, mileage: "-5" }).success).toBe(false);
  });

  it("requires a make_id and a model choice", () => {
    expect(vehicleDataSchema.safeParse({ ...validVehicle, make_id: "" }).success).toBe(false);
    expect(vehicleDataSchema.safeParse({ ...validVehicle, model_id: "" }).success).toBe(false);
  });

  it("accepts the OTHER_MODEL sentinel for model_id", () => {
    const r = vehicleDataSchema.safeParse({ ...validVehicle, model_id: OTHER_MODEL });
    expect(r.success).toBe(true);
  });

  it("rejects an invalid enum value", () => {
    expect(vehicleDataSchema.safeParse({ ...validVehicle, fuel_type: "plasma" }).success).toBe(
      false,
    );
  });
});

const validForm = {
  title: "Toyota Corolla 2020 automático full",
  description: "Único dueño, mantenimientos al día.",
  professional_photos: false,
  price: "18500",
  condition: "used",
  province: "Panamá",
  district: "Betania",
  terms_accepted: true,
  photos: [{ url: "https://cdn.example.com/a.jpg", sort_order: 1 }],
  data: validVehicle,
};

describe("publishListingSchema", () => {
  it("parses a valid form", () => {
    expect(publishListingSchema.safeParse(validForm).success).toBe(true);
  });

  it("coerces the top-level price", () => {
    expect(publishListingSchema.parse(validForm).price).toBe(18500);
  });

  it("rejects a non-positive price", () => {
    expect(publishListingSchema.safeParse({ ...validForm, price: "0" }).success).toBe(false);
    expect(publishListingSchema.safeParse({ ...validForm, price: "" }).success).toBe(false);
  });

  it("requires condition, province and district", () => {
    for (const field of ["condition", "province", "district"] as const) {
      const { [field]: _omit, ...rest } = validForm;
      expect(publishListingSchema.safeParse(rest).success).toBe(false);
    }
    expect(publishListingSchema.safeParse({ ...validForm, province: "  " }).success).toBe(false);
    expect(publishListingSchema.safeParse({ ...validForm, district: "" }).success).toBe(false);
  });

  it("rejects an invalid condition", () => {
    expect(publishListingSchema.safeParse({ ...validForm, condition: "nuevo" }).success).toBe(
      false,
    );
  });

  it("requires model_text when 'Otro' is chosen", () => {
    const otro = { ...validForm, data: { ...validVehicle, model_id: OTHER_MODEL, model_text: "" } };
    expect(publishListingSchema.safeParse(otro).success).toBe(false);
    const withText = {
      ...validForm,
      data: { ...validVehicle, model_id: OTHER_MODEL, model_text: "Corolla Cross GR" },
    };
    expect(publishListingSchema.safeParse(withText).success).toBe(true);
  });

  it("rejects a title shorter than 5 chars", () => {
    expect(publishListingSchema.safeParse({ ...validForm, title: "abc" }).success).toBe(false);
  });

  it("requires at least one photo", () => {
    expect(publishListingSchema.safeParse({ ...validForm, photos: [] }).success).toBe(false);
  });

  it("rejects more than 10 photos", () => {
    const photos = Array.from({ length: 11 }, () => ({
      url: "https://cdn.example.com/a.jpg",
      sort_order: 1,
    }));
    expect(publishListingSchema.safeParse({ ...validForm, photos }).success).toBe(false);
  });

  it("requires the terms checkbox", () => {
    expect(publishListingSchema.safeParse({ ...validForm, terms_accepted: false }).success).toBe(
      false,
    );
  });

  it("defaults professional_photos to false when omitted", () => {
    const { professional_photos: _omit, ...rest } = validForm;
    const parsed = publishListingSchema.parse(rest);
    expect(parsed.professional_photos).toBe(false);
  });
});
