import type { DashboardData } from "@/modules/dashboard/types";

export const dashboardMock: DashboardData = {
  profile: { name: "AutoTech S.A.", email: "email@autotechsa.com" },
  quotas: [
    { key: "hobbies", label: "Anuncios Hobbies", icon: "toys_and_games", used: 12, total: 20, variant: "warm" },
    { key: "autos", label: "Anuncios Autos", icon: "directions_car", used: 23, total: 50, variant: "default" },
    { key: "piezas", label: "Anuncios Piezas", icon: "tools_power_drill", used: 8, total: 30, variant: "info" },
  ],
  activeListings: { count: 43 },
  soldListings: { count: 47, trendPct: 12 },
  verification: { status: "Verificado", detail: "Identidad confirmada", active: true },
  totalViews: { count: 2847, label: "Vistas este mes" },
  topProducts: [
    {
      rank: 1,
      category: "Piezas & Accesorios",
      categoryTone: "azul",
      title: "Alternador Original Denso para Toyota Hilux 3.0L Turbo Diésel 2016-2020",
      views: 234,
    },
    {
      rank: 2,
      category: "Vehículos",
      categoryTone: "neutral",
      title: "Toyota Land Cruiser Prado TXL 4x4 2020",
      views: 100,
    },
  ],
  planRenewal: { tier: "Premium", daysLeft: 15 },
  messages: [
    {
      id: "m1",
      author: "Ricardo Ramirez",
      subject: "Sobre: Toyota Prado 2020",
      snippet: "Hola, estoy interesado en tu Toyota Prado 2020...",
      date: "12/04/2025",
      unread: true,
    },
  ],
  reviews: [
    {
      id: "r1",
      productTitle: "Toyota Prado 2020",
      rating: 4.5,
      comments: 3,
      lastDate: "12 dic 2025",
      unread: true,
    },
  ],
};
