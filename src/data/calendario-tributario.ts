// Calendario tributario chileno completo
export interface FechaTributaria {
  id: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  tipo: 'vencimiento' | 'importante' | 'recordatorio';
  formulario?: string;
  contribuyentes: string[];
  multa?: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export const calendarioTributario2025: FechaTributaria[] = [
  // ENERO 2025
  {
    id: 'ene_12_f29',
    fecha: '2025-01-12',
    titulo: 'Vencimiento F29 Diciembre 2024',
    descripcion: 'Declaración y pago mensual de IVA correspondiente a diciembre 2024',
    tipo: 'vencimiento',
    formulario: 'F29',
    contribuyentes: ['Todos los contribuyentes de IVA'],
    multa: '10% del impuesto adeudado con mínimo de 1 UTM',
    prioridad: 'alta'
  },
  {
    id: 'ene_20_f50',
    fecha: '2025-01-20',
    titulo: 'Vencimiento F50 Diciembre 2024',
    descripcion: 'Presentación Libro de Compras y Ventas de diciembre 2024',
    tipo: 'vencimiento',
    formulario: 'F50',
    contribuyentes: ['Contribuyentes obligados a llevar contabilidad'],
    multa: 'Entre 1 y 10 UTM según el atraso',
    prioridad: 'media'
  },

  // FEBRERO 2025
  {
    id: 'feb_12_f29',
    fecha: '2025-02-12',
    titulo: 'Vencimiento F29 Enero 2025',
    descripcion: 'Declaración y pago mensual de IVA correspondiente a enero 2025',
    tipo: 'vencimiento',
    formulario: 'F29',
    contribuyentes: ['Todos los contribuyentes de IVA'],
    multa: '10% del impuesto adeudado con mínimo de 1 UTM',
    prioridad: 'alta'
  },

  // MARZO 2025
  {
    id: 'mar_12_f29',
    fecha: '2025-03-12',
    titulo: 'Vencimiento F29 Febrero 2025',
    descripcion: 'Declaración y pago mensual de IVA correspondiente a febrero 2025',
    tipo: 'vencimiento',
    formulario: 'F29',
    contribuyentes: ['Todos los contribuyentes de IVA'],
    multa: '10% del impuesto adeudado con mínimo de 1 UTM',
    prioridad: 'alta'
  },
  {
    id: 'mar_31_rel_anual',
    fecha: '2025-03-31',
    titulo: 'Relación Anual de Terceros',
    descripcion: 'Presentación de información anual de operaciones con terceros',
    tipo: 'vencimiento',
    contribuyentes: ['Empresas con ventas anuales > 50.000 UF'],
    multa: 'Entre 1 y 40 UTM',
    prioridad: 'media'
  },

  // ABRIL 2025
  {
    id: 'abr_12_f29',
    fecha: '2025-04-12',
    titulo: 'Vencimiento F29 Marzo 2025',
    descripcion: 'Declaración y pago mensual de IVA correspondiente a marzo 2025',
    tipo: 'vencimiento',
    formulario: 'F29',
    contribuyentes: ['Todos los contribuyentes de IVA'],
    multa: '10% del impuesto adeudado con mínimo de 1 UTM',
    prioridad: 'alta'
  },
  {
    id: 'abr_30_f22',
    fecha: '2025-04-30',
    titulo: 'Vencimiento F22 - Renta 2024',
    descripcion: 'Declaración anual de impuesto a la renta año tributario 2024',
    tipo: 'vencimiento',
    formulario: 'F22',
    contribuyentes: ['Todas las empresas', 'Personas con obligación'],
    multa: '10% del impuesto adeudado con mínimo de 1 UTM',
    prioridad: 'alta'
  },

  // MAYO 2025
  {
    id: 'may_12_f29',
    fecha: '2025-05-12',
    titulo: 'Vencimiento F29 Abril 2025',
    descripcion: 'Declaración y pago mensual de IVA correspondiente a abril 2025',
    tipo: 'vencimiento',
    formulario: 'F29',
    contribuyentes: ['Todos los contribuyentes de IVA'],
    multa: '10% del impuesto adeudado con mínimo de 1 UTM',
    prioridad: 'alta'
  },

  // JUNIO 2025
  {
    id: 'jun_12_f29',
    fecha: '2025-06-12',
    titulo: 'Vencimiento F29 Mayo 2025',
    descripcion: 'Declaración y pago mensual de IVA correspondiente a mayo 2025',
    tipo: 'vencimiento',
    formulario: 'F29',
    contribuyentes: ['Todos los contribuyentes de IVA'],
    multa: '10% del impuesto adeudado con mínimo de 1 UTM',
    prioridad: 'alta'
  },
  {
    id: 'jun_30_balance',
    fecha: '2025-06-30',
    titulo: 'Balance Tributario Semestral',
    descripcion: 'Presentación de balance para empresas obligadas',
    tipo: 'importante',
    contribuyentes: ['Empresas con capital > 5.000 UF'],
    prioridad: 'media'
  },

  // Fechas adicionales importantes
  {
    id: 'recordatorio_ppm',
    fecha: '2025-06-15',
    titulo: 'Recordatorio PPM Julio',
    descripcion: 'Recordatorio para calcular y preparar PPM de julio',
    tipo: 'recordatorio',
    contribuyentes: ['Contribuyentes con PPM'],
    prioridad: 'baja'
  }
];

// Utilidades para el calendario
export function obtenerFechasProximas(dias: number = 30): FechaTributaria[] {
  const hoy = new Date();
  const fechaLimite = new Date();
  fechaLimite.setDate(hoy.getDate() + dias);

  return calendarioTributario2025.filter(fecha => {
    const fechaEvento = new Date(fecha.fecha);
    return fechaEvento >= hoy && fechaEvento <= fechaLimite;
  }).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

export function obtenerFechasVencidas(): FechaTributaria[] {
  const hoy = new Date();
  
  return calendarioTributario2025.filter(fecha => {
    const fechaEvento = new Date(fecha.fecha);
    return fechaEvento < hoy && fecha.tipo === 'vencimiento';
  }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function obtenerFechasPorMes(año: number, mes: number): FechaTributaria[] {
  return calendarioTributario2025.filter(fecha => {
    const fechaEvento = new Date(fecha.fecha);
    return fechaEvento.getFullYear() === año && fechaEvento.getMonth() === mes - 1;
  }).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

// Valor de la UTM actualizado (junio 2025)
export const UTM_ACTUAL = 65738; // Valor aproximado en pesos chilenos
