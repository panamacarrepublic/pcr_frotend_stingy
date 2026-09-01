import type { FieldErrors } from "react-hook-form";

import type { EditListingForm } from "../../schemas/editListing.schema";
import { editTabs, firstTabWithError } from "../editTabs";

const err = (message: string) => ({ type: "custom", message });

describe("editTabs", () => {
  it("covers every field of the edit form exactly once", () => {
    const owned = editTabs.flatMap((tab) => tab.fields as string[]);
    expect(new Set(owned).size).toBe(owned.length);
  });

  it("keeps the tab order the design documents", () => {
    expect(editTabs.map((tab) => tab.id)).toEqual(["info", "photos", "details"]);
  });
});

describe("firstTabWithError", () => {
  it("is undefined when the form is valid", () => {
    expect(firstTabWithError({})).toBeUndefined();
  });

  it("finds a top-level field's tab", () => {
    const errors = { title: err("Muy corto") } as FieldErrors<EditListingForm>;
    expect(firstTabWithError(errors)).toBe("info");
  });

  // A bad mileage lives under `data`, two levels down. Matching only top-level
  // keys would leave the seller staring at a Guardar that does nothing.
  it("finds a nested vehicle field's tab", () => {
    const errors = { data: { mileage: err("Ingresa un número válido") } } as FieldErrors<EditListingForm>;
    expect(firstTabWithError(errors)).toBe("details");
  });

  it("finds the photos tab from an array-level error", () => {
    const errors = { photos: err("Agrega al menos una foto") } as unknown as FieldErrors<EditListingForm>;
    expect(firstTabWithError(errors)).toBe("photos");
  });

  // Two broken fields on different tabs: land on the leftmost one so the seller
  // fixes them in reading order rather than being bounced backwards.
  it("prefers the earliest tab when several have errors", () => {
    const errors = {
      data: { year: err("Ingresa un año válido") },
      title: err("Muy corto"),
    } as FieldErrors<EditListingForm>;
    expect(firstTabWithError(errors)).toBe("info");
  });
});
