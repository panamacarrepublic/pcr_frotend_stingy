import { dashboardTheme } from "@/theme/dashboardTheme";

describe("dashboardTheme", () => {
  it("exposes the Figma accent palette", () => {
    expect(dashboardTheme.palette.roti.main).toBe("#caa34b");
    expect(dashboardTheme.palette.naranja.main).toBe("#e15c2b");
    expect(dashboardTheme.palette.azul.main).toBe("#3a86ff");
    expect(dashboardTheme.palette.azul.lightest).toBe("#ecf3ff");
    expect(dashboardTheme.palette.verde.main).toBe("#06893c");
  });

  it("inherits the base radius", () => {
    expect(dashboardTheme.shape.borderRadius).toBe(8);
  });
});
