// Consejos diarios de contabilidad chilena
export interface ConsejoDiario {
  id: number;
  titulo: string;
  contenido: string;
  categoria: 'ahorro' | 'renta' | 'iva' | 'ppm' | 'creditos' | 'sii' | 'general';
  icono: string;
  importancia: 'baja' | 'media' | 'alta' | 'critica';
  fecha?: string;
  aplicaA: ('persona' | 'empresa' | 'ambos')[];
}

export const consejosDiarios: ConsejoDiario[] = [
  // Consejos de Ahorro Tributario
  {
    id: 1,
    titulo: "Maximiza tus Gastos Deducibles en Diciembre",
    contenido: "Acelera las compras de equipos, suministros y servicios antes del 31 de diciembre para reducir tu base imponible. Recuerda que las facturas deben estar recibidas y pagadas en el período tributario.",
    categoria: 'ahorro',
    icono: '💰',
    importancia: 'alta',
    aplicaA: ['empresa', 'persona']
  },
  {
    id: 2,
    titulo: "Optimiza tu PPM con Inversiones de Corto Plazo",
    contenido: "Si tienes excedentes de PPM, considera invertir en depósitos a plazo o fondos mutuos de corto plazo. Los intereses generados pueden compensar el costo financiero del PPM.",
    categoria: 'ppm',
    icono: '📈',
    importancia: 'media',
    aplicaA: ['empresa']
  },
  {
    id: 3,
    titulo: "Revisa tus Créditos Fiscales Acumulados",
    contenido: "Verifica en el portal SII si tienes créditos fiscales de IVA no utilizados. Puedes solicitar su devolución o imputarlos a otros impuestos como PPM o impuesto anual.",
    categoria: 'creditos',
    icono: '🔄',
    importancia: 'alta',
    aplicaA: ['empresa']
  },
  {
    id: 4,
    titulo: "Planifica tus Retiros de Utilidades",
    contenido: "En régimen Pro-PyME, los retiros de utilidades tributan solo cuando se retiran. Planifica estratégicamente cuándo y cuánto retirar para optimizar tu carga tributaria personal.",
    categoria: 'renta',
    icono: '🏦',
    importancia: 'alta',
    aplicaA: ['empresa']
  },
  {
    id: 5,
    titulo: "Documenta Correctamente tus Gastos Rechazados",
    contenido: "Si el SII rechaza gastos, presenta los descargos con documentación adicional: contratos, emails, fotos, etc. Un buen respaldo puede revertir el rechazo y evitar multas.",
    categoria: 'sii',
    icono: '📋',
    importancia: 'critica',
    aplicaA: ['empresa', 'persona']
  },

  // Consejos de Preparación para Renta Anual
  {
    id: 6,
    titulo: "Reúne todos tus Certificados de Renta",
    contenido: "Solicita certificados de sueldos, honorarios, arriendos y dividendos desde enero. También certificados de retenciones de impuestos y cotizaciones previsionales.",
    categoria: 'renta',
    icono: '📄',
    importancia: 'alta',
    aplicaA: ['persona']
  },
  {
    id: 7,
    titulo: "Actualiza tu Registro de Gastos Médicos",
    contenido: "Mantén ordenadas todas las boletas y facturas de gastos médicos, dentales, ópticos y medicamentos. Son 100% deducibles sin límite para personas naturales.",
    categoria: 'renta',
    icono: '⚕️',
    importancia: 'media',
    aplicaA: ['persona']
  },
  {
    id: 8,
    titulo: "Revisa tus Donaciones del Año",
    contenido: "Las donaciones a instituciones con 'personalidad jurídica' son deducibles hasta un 1,6% de tu renta líquida imponible. Asegúrate de tener los certificados.",
    categoria: 'renta',
    icono: '🤝',
    importancia: 'baja',
    aplicaA: ['persona']
  },

  // Consejos de IVA
  {
    id: 9,
    titulo: "Sincroniza tus Compras y Ventas de IVA",
    contenido: "Si tienes estacionalidad, programa compras grandes en meses de altas ventas para aprovechar mejor el crédito fiscal de IVA.",
    categoria: 'iva',
    icono: '⚖️',
    importancia: 'media',
    aplicaA: ['empresa']
  },
  {
    id: 10,
    titulo: "Revisa el IVA de tus Activos Fijos",
    contenido: "El IVA de activos fijos se puede recuperar inmediatamente si se usan 100% en actividades gravadas. Si hay uso mixto, recupera proporcionalmente.",
    categoria: 'iva',
    icono: '🏭',
    importancia: 'alta',
    aplicaA: ['empresa']
  },

  // Consejos Generales
  {
    id: 11,
    titulo: "Mantén tus Datos Actualizados en el SII",
    contenido: "Revisa mensualmente que tu dirección, teléfonos, email y actividad económica estén actualizados en el SII. Evita multas por notificaciones no recibidas.",
    categoria: 'sii',
    icono: '📱',
    importancia: 'media',
    aplicaA: ['empresa', 'persona']
  },
  {
    id: 12,
    titulo: "Utiliza el Régimen de Renta Presunta Agrícola",
    contenido: "Si tienes actividades agrícolas, evalúa acogerte al régimen de renta presunta. Puede ser más beneficioso que tributar sobre renta efectiva.",
    categoria: 'renta',
    icono: '🌾',
    importancia: 'media',
    aplicaA: ['empresa']
  },
  {
    id: 13,
    titulo: "Aprovecha las Depreciaciones Aceleradas",
    contenido: "Para activos tecnológicos y vehículos, usa depreciación acelerada. Te permite deducir más rápido y diferir impuestos a períodos futuros.",
    categoria: 'ahorro',
    icono: '🚗',
    importancia: 'alta',
    aplicaA: ['empresa']
  },
  {
    id: 14,
    titulo: "Planifica tus Vacaciones Tributarias",
    contenido: "Programa actividades de planificación fiscal en enero-febrero cuando las obligaciones tributarias son menores. Es el mejor momento para estructurar el año.",
    categoria: 'general',
    icono: '🏖️',
    importancia: 'baja',
    aplicaA: ['empresa', 'persona']
  },
  {
    id: 15,
    titulo: "Constituye una Sociedad para Optimizar Impuestos",
    contenido: "Si tienes ingresos superiores a $50M anuales, evalúa constituir una sociedad. Puedes diferir impuestos y optimizar la carga tributaria total.",
    categoria: 'ahorro',
    icono: '🏢',
    importancia: 'alta',
    aplicaA: ['persona']
  },

  // Más consejos específicos
  {
    id: 16,
    titulo: "Usa Correctamente las Boletas de Honorarios Electrónicas",
    contenido: "Emite boletas de honorarios electrónicas para todos tus servicios profesionales. Son obligatorias y te permiten llevar mejor control de tus ingresos.",
    categoria: 'sii',
    icono: '💼',
    importancia: 'alta',
    aplicaA: ['persona']
  },
  {
    id: 17,
    titulo: "Optimiza tu Flujo de Caja con PPM",
    contenido: "Calcula tu PPM considerando proyecciones reales. Un PPM muy bajo genera intereses, muy alto afecta tu flujo. Busca el equilibrio óptimo.",
    categoria: 'ppm',
    icono: '💹',
    importancia: 'alta',
    aplicaA: ['empresa']
  },
  {
    id: 18,
    titulo: "Aprovecha los Gastos de Capacitación SENCE",
    contenido: "Los gastos de capacitación son deducibles y además puedes usar franquicia SENCE. Es una doble ventaja: reduces impuestos y mejoras competencias.",
    categoria: 'ahorro',
    icono: '🎓',
    importancia: 'media',
    aplicaA: ['empresa']
  },
  {
    id: 19,
    titulo: "Revisa Mensualmente tu Situación Tributaria",
    contenido: "No esperes al final del año. Revisa mensualmente tus números para tomar decisiones oportunas de planificación fiscal.",
    categoria: 'general',
    icono: '📊',
    importancia: 'alta',
    aplicaA: ['empresa', 'persona']
  },
  {
    id: 20,
    titulo: "Mantén Respaldos Digitales de Todo",
    contenido: "Digitaliza y respalda todas tus facturas, contratos y documentos tributarios. En caso de fiscalización, tener todo ordenado digitalmente te ahorra tiempo y stress.",
    categoria: 'sii',
    icono: '☁️',
    importancia: 'media',
    aplicaA: ['empresa', 'persona']
  },

  // Consejos avanzados de optimización
  {
    id: 21,
    titulo: "Estructura Holding para Múltiples Negocios",
    contenido: "Si tienes varios negocios, considera estructurar un holding. Permite optimizar impuestos, consolidar pérdidas y facilitar planificación sucesoria.",
    categoria: 'ahorro',
    icono: '🏗️',
    importancia: 'alta',
    aplicaA: ['empresa']
  },
  {
    id: 22,
    titulo: "Utiliza Pérdidas Tributarias Estratégicamente",
    contenido: "Las pérdidas tributarias se pueden arrastrar indefinidamente. Planifica cuándo y cómo utilizarlas para maximizar su beneficio fiscal.",
    categoria: 'ahorro',
    icono: '🔄',
    importancia: 'alta',
    aplicaA: ['empresa']
  },
  {
    id: 23,
    titulo: "Timing Estratégico de Ingresos y Gastos",
    contenido: "Acelera gastos deducibles y difiere ingresos cuando sea posible para suavizar la carga tributaria entre períodos.",
    categoria: 'ahorro',
    icono: '⏰',
    importancia: 'media',
    aplicaA: ['empresa']
  },
  {
    id: 24,
    titulo: "Revisa Exenciones de Impuesto Territorial",
    contenido: "Muchas propiedades comerciales tienen exenciones tributarias disponibles. Revisa si calificas para reducir tu impuesto territorial.",
    categoria: 'ahorro',
    icono: '🏠',
    importancia: 'media',
    aplicaA: ['empresa']
  },
  {
    id: 25,
    titulo: "Planifica Sucesión Empresarial Temprano",
    contenido: "La planificación sucesoria empresarial debe comenzar años antes. Evalúa estructuras que minimicen impuestos en la transferencia generacional.",
    categoria: 'general',
    icono: '👨‍👩‍👧‍👦',
    importancia: 'baja',
    aplicaA: ['empresa']
  },

  // Consejos específicos por época del año
  {
    id: 26,
    titulo: "Junio: Evalúa tu Situación Tributaria Semestral",
    contenido: "A mitad de año, revisa tu performance tributaria. Ajusta estrategias, evalúa PPM y planifica el segundo semestre.",
    categoria: 'general',
    icono: '📅',
    importancia: 'alta',
    aplicaA: ['empresa', 'persona']
  },
  {
    id: 27,
    titulo: "Aprovecha Beneficios de Zonas Extremas",
    contenido: "Si operas en zonas extremas del país, revisa beneficios tributarios especiales como exenciones de impuesto a la renta y IVA.",
    categoria: 'ahorro',
    icono: '🗺️',
    importancia: 'media',
    aplicaA: ['empresa']
  },
  {
    id: 28,
    titulo: "Optimiza Gastos de Vehículos Empresariales",
    contenido: "Los gastos de vehículos son deducibles si son necesarios para el giro. Mantén bitácora de uso comercial para justificar la deducción.",
    categoria: 'ahorro',
    icono: '🚙',
    importancia: 'media',
    aplicaA: ['empresa']
  },
  {
    id: 29,
    titulo: "Utiliza Convenios Internacionales",
    contenido: "Si tienes ingresos del extranjero, revisa convenios para evitar doble tributación. Chile tiene convenios con muchos países.",
    categoria: 'renta',
    icono: '🌍',
    importancia: 'media',
    aplicaA: ['persona', 'empresa']
  },
  {
    id: 30,
    titulo: "Mantén Separación Clara entre Personal y Empresa",
    contenido: "Nunca mezcles gastos personales con empresariales. Mantén cuentas y tarjetas separadas para evitar problemas con el SII.",
    categoria: 'sii',
    icono: '🔐',
    importancia: 'critica',
    aplicaA: ['empresa']
  }
];

// Función para obtener el consejo del día
export function obtenerConsejoDiario(): ConsejoDiario {
  const hoy = new Date();
  const inicioAño = new Date(hoy.getFullYear(), 0, 1);
  const diasTranscurridos = Math.floor((hoy.getTime() - inicioAño.getTime()) / (1000 * 60 * 60 * 24));
  
  // Rotar consejos basado en el día del año
  const indice = diasTranscurridos % consejosDiarios.length;
  return consejosDiarios[indice];
}

// Función para obtener consejos por categoría
export function obtenerConsejosPorCategoria(categoria: ConsejoDiario['categoria']): ConsejoDiario[] {
  return consejosDiarios.filter(consejo => consejo.categoria === categoria);
}

// Función para obtener consejos por importancia
export function obtenerConsejosPorImportancia(importancia: ConsejoDiario['importancia']): ConsejoDiario[] {
  return consejosDiarios.filter(consejo => consejo.importancia === importancia);
}
