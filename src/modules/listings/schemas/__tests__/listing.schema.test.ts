import { publishListingSchema } from "../listing.schema";
import { OTHER_MODEL, vehicleDataSchema } from "../vehicle.schema";

const MAKE_ID = "11111111-1111-1111-1111-111111111111";
const MODEL_ID = "22222222-2222-2222-2222-222222222222";

// Values as they arrive from the form inputs (numbers as strings, blank optional).
const validVehicle = {
  category: "cars",
  price: "18500",
  vin_number: "",
  make_id: MAKE_ID,
  model_id: MODEL_ID,
  model_text: "",
  mileage: "45000",
  year: "2020",
  vehicle_type: "sedan",
  fuel_type: "gasoline",
  condition: "used",
  transmission_type: "automatic",
  province: "Panamá",
  district: "Betania",
};

describe("vehicleDataSchema", () => {
  it("parses and coerces a valid vehicle", () => {
    const r = vehicleDataSchema.parse(validVehicle);
    expect(r.price).toBe(18500);
    expect(r.year).toBe(2020);
    expect(r.mileage).toBe(45000);
    expect(r.make_id).toBe(MAKE_ID);
    expect(r.model_id).toBe(MODEL_ID);
    expect(r.vin_number).toBeUndefined(); // blank optional → undefined
  });

  it("rejects a non-positive price", () => {
    expect(vehicleDataSchema.safeParse({ ...validVehicle, price: "0" }).success).toBe(false);
    expect(vehicleDataSchema.safeParse({ ...validVehicle, price: "" }).success).toBe(false);
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
  terms_accepted: true,
  photos: [{ url: "https://cdn.example.com/a.jpg", sort_order: 1 }],
  data: validVehicle,
};

describe("publishListingSchema", () => {
  it("parses a valid form", () => {
    expect(publishListingSchema.safeParse(validForm).success).toBe(true);
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
