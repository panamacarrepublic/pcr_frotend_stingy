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
  // "Detalles del Anuncio" panel — Figma node 10689:14128. Opened by the gear
  // button or a row click; the gateway to the full edit modal.
  quickView: {
    title: "Detalles del Anuncio",
    close: "Cerrar",
    idPrefix: "ID:",
    published: "Publicado",
    description: "Descripción",
    noDescription: "Este anuncio todavía no tiene descripción.",
    viewPublic: "Ver Público",
    editFull: "Editar Completo",
    loading: "Cargando el anuncio…",
    error: "No pudimos cargar este anuncio.",
    // Shown instead of enabling the edit button. The API rejects every PATCH on
    // these three states with a 409, so opening the form would waste the
    // seller's time on a save that cannot succeed.
    readOnly: {
      sold: "Este anuncio está vendido y ya no puede editarse.",
      expired: "Este anuncio expiró y ya no puede editarse.",
      rejected: "Este anuncio fue rechazado y no puede editarse.",
    },
  },
  deleteDialog: {
    title: "¿Eliminar este anuncio?",
    body: "Dejará de estar visible para los compradores y saldrá de tu inventario.",
    // Known backend debt, worth surfacing before the seller confirms: the soft
    // delete does not release the VIN, so the same vehicle cannot be relisted.
    vinWarning:
      "Ojo: el VIN no se libera, así que no podrás volver a publicar este mismo vehículo.",
    confirm: "Eliminar",
    deleting: "Eliminando…",
    cancel: "Cancelar",
    error: "No pudimos eliminar el anuncio.",
  },
} as const;
