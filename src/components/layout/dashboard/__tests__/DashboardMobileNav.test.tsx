import { fireEvent, render, screen, within } from "@testing-library/react";

import type { DashboardProfile, NavItem } from "@/components/layout/dashboard/types";

import { DashboardMobileNav } from "../DashboardMobileNav";

const navItems: NavItem[] = [
  { key: "overview", label: "Resumen General", icon: "Summarize", href: "/dashboard" },
  { key: "inventory", label: "Inventario", icon: "PostAdd", href: "/dashboard/inventario" },
];

const bottomNavItems: NavItem[] = [
  { key: "settings", label: "Configuración", icon: "SettingsOutlined", href: "/dashboard/configuracion" },
];

const profile: DashboardProfile = {
  name: "AutoTech S.A.",
  email: "email@autotechsa.com",
};

const renderNav = () =>
  render(
    <DashboardMobileNav
      navItems={navItems}
      bottomNavItems={bottomNavItems}
      profile={profile}
      activeKey="inventory"
    />,
  );

test("the navigation is closed until the menu button is pressed", () => {
  renderNav();
  expect(screen.queryByRole("link", { name: /Inventario/ })).not.toBeInTheDocument();
});

test("the menu button opens the navigation", () => {
  renderNav();

  fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));

  expect(screen.getByRole("link", { name: /Resumen General/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Inventario/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Configuración/ })).toBeInTheDocument();
});

// On a phone the drawer covers the page. Leaving it open over the destination
// would hide the very screen the tap asked for.
test("choosing a destination closes the navigation", () => {
  renderNav();
  fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));

  fireEvent.click(screen.getByRole("link", { name: /Inventario/ }));

  expect(screen.queryByRole("link", { name: /Inventario/ })).not.toBeInTheDocument();
});

test("the close button dismisses the navigation without navigating", () => {
  renderNav();
  fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));

  fireEvent.click(screen.getByRole("button", { name: "Cerrar menú" }));

  expect(screen.queryByRole("link", { name: /Inventario/ })).not.toBeInTheDocument();
});

// The drawer keeps its tree mounted for snappier opens, so the Sidebar's own
// logo is in the DOM too — scope to the bar rather than the whole document.
test("the brand mark stays visible in the bar itself", () => {
  renderNav();
  const bar = screen.getByRole("banner");
  expect(within(bar).getByAltText("Panama Car Republic")).toBeInTheDocument();
});
