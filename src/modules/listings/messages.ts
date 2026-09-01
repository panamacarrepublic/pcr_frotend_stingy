// All copy for the publish-listing flow (Spanish - Panama). Lives here, not in
// JSX, so i18n stays possible later. Mirrors modules/auth/messages.ts. Strings
// are transcribed from the Figma "Formulario Publicar Anuncio Particulares".
export const listingMessages = {
  dialog: {
    title: "Publicar anuncio",
    close: "Cerrar",
    discardTitle: "¿Descartar cambios?",
    discardBody: "Los cambios no están guardados. ¿Seguro que deseas salir?",
    discardConfirm: "Descartar",
    discardCancel: "Seguir editando",
  },
  nav: {
    cancel: "Cancelar",
    back: "Atrás",
    next: "Siguiente",
    publish: "Publicar",
    publishing: "Publicando…",
    saveDraft: "Guardar Borrador",
    draftSaved: "Borrador guardado",
    backToEdit: "Volver a Editar",
    continue: "Continuar",
  },
  banner: {
    title: "Planes desde $2/trimestre.",
    subtitle: "Anuncios con promoción incluida.",
  },
  steps: {
    category: {
      eyebrow: "¡COMENCEMOS!",
      title: "ELIGE LA CATEGORÍA DE TU ANUNCIO",
      subtitle:
        "¿Qué vas a publicar hoy? Autos, Piezas & Repuestos o Hobbies & Coleccionables. ¡Tú decides!",
    },
    vehicle: {
      eyebrow: "¡GENIAL! HABLEMOS DE TU AUTO",
      title: "CUÉNTANOS TODO LO QUE IMPORTA",
      subtitle: "Precio, marca, modelo, año… Entre más detalles, más rápido lo venderás.",
    },
    description: {
      eyebrow: "¡ESTÁS A MITAD DE CAMINO!",
      title: "PONLE NOMBRE A TU ANUNCIO Y CUÉNTALE TU HISTORIA",
      subtitle:
        "Un título claro y una buena descripción atraen más miradas. Sé específico: estado, extras, historia… ¡hazlo irresistible!",
    },
    photos: {
      eyebrow: "¡HORA DE BRILLAR!",
      title: "SUBE LAS MEJORES FOTOS DE TU ANUNCIO",
      subtitle:
        "Las imágenes son tu mejor carta de presentación. Usa luz natural, múltiples ángulos y fondo limpio.",
    },
    preview: {
      title: "VISTA PREVIA",
      subtitle: "Los cambios no están guardados. Así es como se verá tu anuncio para los compradores.",
    },
  },
  category: {
    cars: "Automóviles",
    parts: "Piezas",
    collectibles: "Coleccionables",
    comingSoon: "Próximamente",
  },
  method: {
    title: "¿Cómo quieres subir tus anuncios hoy?",
    subtitle: "Elige el método que mejor se adapta a tu flujo",
    optionManualTitle: "Opción 1 – Subir uno a uno",
    optionBulkTitle: "Opción 2 – Subir por CSV",
    manual: {
      badge: "A",
      label: "Publicación manual",
      hint: "Ideal para subir anuncios con detalle personalizado.",
    },
    bulk: {
      badge: "B",
      label: "Carga masiva",
      hint: "Perfecto si tienes muchos productos. Descarga el template, complétalo y publícalos todos de una vez.",
    },
  },
  fields: {
    price: "Precio",
    vin: "Número VIN",
    brand: "Marca",
    model: "Modelo",
    otherModel: "Otro (escribir)",
    mileage: "Kilometraje",
    year: "Año",
    vehicleType: "Tipo de Vehículo",
    fuelType: "Tipo de Combustible",
    condition: "Estado",
    transmission: "Tipo de Transmisión",
    province: "Provincia",
    district: "Distrito/Ciudad",
    title: "Título del anuncio",
    description: "Descripción",
    selectPlaceholder: "Selecciona...",
  },
  placeholders: {
    price: "1,500.00",
    vin: "1HGBH41JXMN109186",
    brand: "Selecciona una marca",
    model: "Selecciona un modelo",
    modelText: "Escribe el modelo",
    mileage: "2000000 km",
    year: "2015",
    district: "Ciudad de Panamá",
    title: "Ej. Honda Civic 2020 – Impecable, único dueño…",
    description: "Detalles: mantenimiento, kilometraje, equipamiento, mejoras…",
  },
  hints: {
    title: "Títulos con modelo + año + estado reciben 40% más contactos",
  },
  professionalPhotos: {
    title: "Quiero fotos profesionales por 5 USD",
    subtitle: "Un fotógrafo se encargará de tus imágenes y potenciará tu anuncio.",
  },
  photos: {
    instructions: "Arrastra tus fotos aquí o haz clic para seleccionar (máx. 10 imágenes, .jpg/.png).",
    bullets: ["Mínimo 3 fotos", "Resolución recomendada: 1200×800 px", "Ordena arrastrando las miniaturas"],
    dropTitle: "Arrastra y suelta archivos o",
    browse: "Explorar",
    formats: "Formatos compatibles: PNG, JPG",
    tipsTitle: "💡 TIPS RÁPIDOS:",
    tips: ["Mínimo 3 fotos", "Resolución: 1200×800px", "Ordena arrastrando"],
    uploading: "Subiendo",
    cover: "Portada",
    remove: "Quitar",
    empty: "Aún no has agregado fotos",
  },
  terms: {
    label: "Acepto los términos y condiciones",
  },
  errors: {
    required: "Este campo es requerido",
    titleMin: "El título debe tener al menos 5 caracteres",
    titleMax: "El título no puede superar 150 caracteres",
    pricePositive: "Ingresa un precio válido",
    yearRange: "Ingresa un año válido",
    mileageMin: "El kilometraje no puede ser negativo",
    photosMin: "Agrega al menos una foto",
    photosMax: "Máximo 10 fotos",
    terms: "Debes aceptar los términos y condiciones",
    submit: "No se pudo publicar el anuncio. Inténtalo de nuevo.",
    // Fallbacks for API failures. Domain errors already arrive from the backend
    // in Spanish and are shown verbatim (see api/errors.ts) — these only cover
    // the cases where the response carries no usable message.
    api: {
      badReference: "La marca o el modelo seleccionado ya no está disponible.",
      unauthorized: "Tu sesión expiró. Inicia sesión de nuevo.",
      forbidden: "No tienes permiso para realizar esta acción.",
      notFound: "El anuncio no existe o ya no está disponible.",
      conflict: "No se pudo completar la acción por un conflicto con el anuncio.",
      validation: "Revisa los datos del anuncio",
      server: "Hubo un problema en el servidor. Inténtalo más tarde.",
      network: "No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.",
    },
  },
  // Full edit modal, reached from "Editar Completo" on the inventory panel. The
  // tab split is the one documented in the Figma handover notes (node
  // 10699:4078): "Modal con tabs: Informacion, Fotos, Detalles del Producto".
  edit: {
    title: "Editar Anuncio",
    close: "Cerrar",
    tabs: {
      info: "Información",
      photos: "Fotos",
      details: "Detalles del Producto",
    },
    save: "Guardar cambios",
    saving: "Guardando…",
    cancel: "Cancelar",
    // A PATCH with no keys is a valid no-op, so there is nothing to report but
    // also nothing to send — say so instead of faking a save.
    noChanges: "No hiciste ningún cambio.",
    loading: "Cargando el anuncio…",
    loadError: "No pudimos cargar el anuncio.",
    retry: "Reintentar",
    photosReplaceHint:
      "Al guardar, la galería queda exactamente como la ves aquí: las fotos que quites se eliminan del anuncio.",
  },
  success: {
    title: "¡Anuncio publicado!",
    subtitle: "Tu anuncio fue enviado correctamente.",
    cta: "Ver mis anuncios",
    another: "Publicar otro",
    viewListing: "Ver el anuncio publicado",
  },
} as const;
