// Copy for the inventory (Anuncios) table. Spanish (Panama), transcribed from
// the Figma frame "Interaction States - Inventario - Dashboard Empresarial"
// (node 10689-11715). Kept out of JSX so i18n stays possible, mirroring
// modules/listings/messages.ts.
export const inventoryMessages = {
  title: "Anuncios",
  search: "Search",
  new: "Nuevo",
  filters: "Filters",
  more: "Más opciones",
  columns: {
    date: "Date",
    productId: "ID de Producto",
    name: "Nombre",
    category: "Categoría",
    price: "Precio",
  },
  selectAll: "Seleccionar todos los anuncios de esta página",
  selectRow: "Seleccionar anuncio",
  rowActions: {
    settings: "Ajustes del anuncio",
    delete: "Eliminar anuncio",
  },
  pagination: {
    previous: "Antes",
    next: "Siguiente",
    page: "Página",
  },
  states: {
    loading: "Cargando anuncios…",
    empty: "Todavía no has publicado ningún anuncio.",
    emptyHint: "Cuando publiques uno aparecerá aquí.",
    error: "No pudimos cargar tus anuncios.",
    retry: "Reintentar",
  },
  // Only the cars vertical exists in the API today, so every listing is a
  // vehicle. Parts / collectibles get their own labels when those land.
  categoryLabel: "Vehículos",
} as const;
