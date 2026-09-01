import type { ListingResponse } from "../../api/types";
import { editListingSchema } from "../../schemas/editListing.schema";
import { OTHER_MODEL } from "../../schemas/vehicle.schema";
import {
  countPendingChanges,
  toEditListingValues,
  toListingUpdatePayload,
} from "../editListingValues";

const MAKE_ID = "11111111-1111-1111-1111-111111111111";
const MODEL_ID = "22222222-2222-2222-2222-222222222222";
const OTHER_MAKE_ID = "33333333-3333-3333-3333-333333333333";

/** A full listing as `GET /api/v1/listings/{id}` returns it. */
function listing(overrides: Partial<ListingResponse> = {}): ListingResponse {
  return {
    id: "a3f9c210-1111-2222-3333-444455556666",
    category: "cars",
    title: "Toyota Hilux 2020 doble cabina",
    description: "Único dueño, mantenimientos al día.",
    professional_photos: false,
    business_id: null,
    price: "18500.00",
    currency: "USD",
    condition: "used",
    quantity: 1,
    province: "Panamá",
    district: "Betania",
    status: "active",
    data: {
      category: "cars",
      vin_number: "JTDBR32E720012345",
      make_id: MAKE_ID,
      model_id: MODEL_ID,
      model_text: null,
      mileage: 45000,
      year: 2020,
      vehicle_type: "pickup",
      fuel_type: "diesel",
      transmission_type: "automatic",
      make: "Toyota",
      model: "Hilux",
    },
    photos: [
      { url: "https://cdn.example.com/a.jpg", sort_order: 1 },
      { url: "https://cdn.example.com/b.jpg", sort_order: 2 },
    ],
    created_at: "2026-05-17T10:30:00-05:00",
    ...overrides,
  };
}

/**
 * Form values as RHF would hold them after the user edited the prefilled form:
 * seeded from the listing, then parsed through the real schema so the mapper
 * sees the output shape (numbers coerced, blank optionals dropped).
 */
const formFor = (source: ListingResponse, edits: Record<string, unknown> = {}) =>
  editListingSchema.parse({ ...toEditListingValues(source), ...edits });

describe("toEditListingValues", () => {
  it("produces values the edit schema accepts", () => {
    expect(() => editListingSchema.parse(toEditListingValues(listing()))).not.toThrow();
  });

  it("seeds the inputs from the listing", () => {
    const values = toEditListingValues(listing());
    expect(values.title).toBe("Toyota Hilux 2020 doble cabina");
    expect(values.price).toBe("18500.00");
    expect(values.province).toBe("Panamá");
    expect(values.photos).toHaveLength(2);
  });

  // A listing with no reference model stores model_id:null + model_text. The
  // dropdown has no such option — it has the "Otro" sentinel — so a round trip
  // through the form would otherwise silently drop the user's model.
  it("maps a null model_id back to the OTHER_MODEL sentinel", () => {
    const values = toEditListingValues(
      listing({
        data: { ...listing().data, model_id: null, model_text: "Hilux Conquest" },
      }),
    );
    expect(values.data.model_id).toBe(OTHER_MODEL);
    expect(values.data.model_text).toBe("Hilux Conquest");
  });

  it("turns nullable fields into empty inputs rather than the string 'null'", () => {
    const values = toEditListingValues(
      listing({ description: null, data: { ...listing().data, vin_number: null } }),
    );
    expect(values.description).toBe("");
    expect(values.data.vin_number).toBe("");
  });
});

describe("toListingUpdatePayload", () => {
  it("is an empty patch when nothing was edited", () => {
    const source = listing();
    expect(toListingUpdatePayload(formFor(source), source)).toEqual({});
  });

  it("sends only the field that changed", () => {
    const source = listing();
    const patch = toListingUpdatePayload(formFor(source, { title: "Toyota Hilux 2020 4x4" }), source);
    expect(patch).toEqual({ title: "Toyota Hilux 2020 4x4" });
  });

  // price arrives as a decimal string but the patch takes a number. Comparing
  // the two shapes directly would mark an untouched price as changed.
  it("does not mistake the decimal-string price for a change", () => {
    const source = listing({ price: "18500.00" });
    expect(toListingUpdatePayload(formFor(source), source)).not.toHaveProperty("price");
  });

  it("sends an edited price as a number", () => {
    const source = listing();
    const patch = toListingUpdatePayload(formFor(source, { price: "19000" }), source);
    expect(patch.price).toBe(19000);
  });

  describe("photos", () => {
    // photos is a total replacement server-side: sending it deletes every
    // existing row. An untouched gallery must not be rewritten.
    it("omits photos entirely when the gallery was not touched", () => {
      const source = listing();
      expect(toListingUpdatePayload(formFor(source), source)).not.toHaveProperty("photos");
    });

    it("sends the complete final gallery when a photo was removed", () => {
      const source = listing();
      const patch = toListingUpdatePayload(
        formFor(source, { photos: [{ url: "https://cdn.example.com/b.jpg", sort_order: 2 }] }),
        source,
      );
      expect(patch.photos).toEqual([{ url: "https://cdn.example.com/b.jpg", sort_order: 1 }]);
    });

    // PhotoUploader assigns sort_order from the field-array length, so removing
    // a photo and adding another produces a duplicate. The cover photo is the
    // lowest sort_order, so a duplicate makes the cover arbitrary.
    it("renumbers sort_order from 1 so duplicates cannot reach the API", () => {
      const source = listing();
      const patch = toListingUpdatePayload(
        formFor(source, {
          photos: [
            { url: "https://cdn.example.com/a.jpg", sort_order: 2 },
            { url: "https://cdn.example.com/new.jpg", sort_order: 2 },
          ],
        }),
        source,
      );
      expect(patch.photos).toEqual([
        { url: "https://cdn.example.com/a.jpg", sort_order: 1 },
        { url: "https://cdn.example.com/new.jpg", sort_order: 2 },
      ]);
    });

    it("treats a reorder as a change", () => {
      const source = listing();
      const patch = toListingUpdatePayload(
        formFor(source, {
          photos: [
            { url: "https://cdn.example.com/b.jpg", sort_order: 1 },
            { url: "https://cdn.example.com/a.jpg", sort_order: 2 },
          ],
        }),
        source,
      );
      expect(patch.photos?.map((p) => p.url)).toEqual([
        "https://cdn.example.com/b.jpg",
        "https://cdn.example.com/a.jpg",
      ]);
    });
  });

  describe("clearing nullable fields", () => {
    it("sends description:null when the user emptied it", () => {
      const source = listing();
      const patch = toListingUpdatePayload(formFor(source, { description: "" }), source);
      expect(patch.description).toBeNull();
    });

    it("does not send description when it was already empty", () => {
      const source = listing({ description: null });
      expect(toListingUpdatePayload(formFor(source), source)).not.toHaveProperty("description");
    });

    it("sends data.vin_number:null when the user emptied it", () => {
      const source = listing();
      const patch = toListingUpdatePayload(
        formFor(source, { data: { ...toEditListingValues(source).data, vin_number: "" } }),
        source,
      );
      expect(patch.data?.vin_number).toBeNull();
    });
  });

  describe("the model pair", () => {
    it("resolves the OTHER_MODEL sentinel to model_id:null plus the free text", () => {
      const source = listing();
      const patch = toListingUpdatePayload(
        formFor(source, {
          data: {
            ...toEditListingValues(source).data,
            model_id: OTHER_MODEL,
            model_text: "Hilux Conquest",
          },
        }),
        source,
      );
      expect(patch.data?.model_id).toBeNull();
      expect(patch.data?.model_text).toBe("Hilux Conquest");
    });

    // Going the other way must clear the stale free text, or the listing keeps
    // a model_text the seller can no longer see in the form.
    it("clears model_text when switching to a reference model", () => {
      const source = listing({
        data: { ...listing().data, model_id: null, model_text: "Hilux Conquest" },
      });
      const patch = toListingUpdatePayload(
        formFor(source, {
          data: { ...toEditListingValues(source).data, model_id: MODEL_ID, model_text: "" },
        }),
        source,
      );
      expect(patch.data?.model_id).toBe(MODEL_ID);
      expect(patch.data?.model_text).toBeNull();
    });
  });

  describe("the data sub-object", () => {
    it("is omitted when only top-level fields changed", () => {
      const source = listing();
      const patch = toListingUpdatePayload(formFor(source, { title: "Otro título aquí" }), source);
      expect(patch).not.toHaveProperty("data");
    });

    it("carries only the vehicle fields that changed", () => {
      const source = listing();
      const patch = toListingUpdatePayload(
        formFor(source, {
          data: { ...toEditListingValues(source).data, mileage: "52000", make_id: OTHER_MAKE_ID },
        }),
        source,
      );
      expect(patch.data).toEqual({ mileage: 52000, make_id: OTHER_MAKE_ID });
    });

    it("coerces the numeric text inputs", () => {
      const source = listing();
      const patch = toListingUpdatePayload(
        formFor(source, { data: { ...toEditListingValues(source).data, year: "2021" } }),
        source,
      );
      expect(patch.data?.year).toBe(2021);
    });
  });

  // Sending any of these is either a 422 (category, currency) or a state change
  // that belongs to a different action (status).
  it("never emits fields the edit form does not own", () => {
    const source = listing();
    const patch = toListingUpdatePayload(
      formFor(source, { title: "Un título completamente nuevo" }),
      source,
    ) as Record<string, unknown>;
    ["category", "currency", "status", "quantity", "id"].forEach((key) => {
      expect(patch).not.toHaveProperty(key);
    });
  });
});

describe("countPendingChanges", () => {
  it("is zero for an untouched form", () => {
    expect(countPendingChanges({})).toBe(0);
  });

  it("counts each top-level field", () => {
    expect(countPendingChanges({ title: "x", price: 1 })).toBe(2);
  });

  // `data` is one key on the wire but several edits to the seller, and the
  // banner speaks the seller's language.
  it("counts the vehicle fields individually, not the data wrapper", () => {
    expect(countPendingChanges({ title: "x", data: { mileage: 1, year: 2020 } })).toBe(3);
  });

  it("counts the whole gallery as a single change", () => {
    expect(
      countPendingChanges({
        photos: [
          { url: "a", sort_order: 1 },
          { url: "b", sort_order: 2 },
        ],
      }),
    ).toBe(1);
  });
});
