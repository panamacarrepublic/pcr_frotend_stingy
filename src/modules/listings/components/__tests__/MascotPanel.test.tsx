import { render } from "@testing-library/react";

import { MascotPanel } from "@/modules/listings/components/MascotPanel";
import { IllustrationPanel } from "@/modules/listings/components/IllustrationPanel";

it("MascotPanel renders an image with the given src", () => {
  const { container } = render(<MascotPanel src="/images/dashboardForm/form0.png" />);
  const img = container.querySelector("img");
  expect(img?.getAttribute("src")).toContain("form0.png");
});

it("IllustrationPanel maps welcome to form1 and vehicle to form2 (Figma alignment)", () => {
  const welcome = render(<IllustrationPanel variant="welcome" />);
  expect(welcome.container.querySelector("img")?.getAttribute("src")).toContain("form1.png");

  const vehicle = render(<IllustrationPanel variant="vehicle" />);
  expect(vehicle.container.querySelector("img")?.getAttribute("src")).toContain("form2.png");
});
