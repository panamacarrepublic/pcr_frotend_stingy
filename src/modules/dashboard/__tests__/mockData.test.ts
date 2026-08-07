import { dashboardMock } from "@/modules/dashboard/mockData";

it("matches the Figma figures", () => {
  expect(dashboardMock.profile.name).toBe("AutoTech S.A.");
  expect(dashboardMock.quotas.find((q) => q.key === "autos")).toMatchObject({ used: 23, total: 50 });
  expect(dashboardMock.totalViews.count).toBe(2847);
  expect(dashboardMock.soldListings).toMatchObject({ count: 47, trendPct: 12 });
  expect(dashboardMock.planRenewal).toMatchObject({ tier: "Premium", daysLeft: 15 });
  expect(dashboardMock.messages[0].author).toBe("Ricardo Ramirez");
  expect(dashboardMock.topProducts).toHaveLength(2);
  expect(dashboardMock.topProducts[0].title).toContain("Alternador");
  expect(dashboardMock.verification).toMatchObject({ status: "Verificado", detail: "Identidad confirmada", active: true });
  expect(dashboardMock.reviews[0]).toMatchObject({ productTitle: "Toyota Prado 2020", rating: 4.5, comments: 3 });
});
