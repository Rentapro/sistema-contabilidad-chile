// Datos y configuraciones para reportes oficiales del SII
export interface ReporteSII {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  periodicidad: 'mensual' | 'anual' | 'trimestral';
  obligatorio: boolean;
  fechaVencimiento: string;
  campos: CampoReporte[];
  categoria: 'declaracion' | 'informativo' | 'timbre';
}

export interface CampoReporte {
  codigo: string;
  nombre: string;
  tipo: 'numero' | 'texto' | 'fecha' | 'boolean';
  obligatorio: boolean;
  valor?: any;
  formula?: string;
}

export const reportesSII: ReporteSII[] = [
  {
    id: 'f29',
    nombre: 'Formulario 29 - Declaración Mensual de IVA',
    codigo: 'F29',
    descripcion: 'Declaración mensual de IVA y otros impuestos',
    periodicidad: 'mensual',
    obligatorio: true,
    fechaVencimiento: '12 del mes siguiente',
    categoria: 'declaracion',
    campos: [
      { codigo: '091', nombre: 'IVA Débito Fiscal', tipo: 'numero', obligatorio: true },
      { codigo: '092', nombre: 'IVA Crédito Fiscal', tipo: 'numero', obligatorio: true },
      { codigo: '093', nombre: 'Diferencia IVA (Débito - Crédito)', tipo: 'numero', obligatorio: true, formula: '091 - 092' },
      { codigo: '150', nombre: 'PPM Obligatorio', tipo: 'numero', obligatorio: false },
      { codigo: '151', nombre: 'PPM Voluntario', tipo: 'numero', obligatorio: false },
      { codigo: '159', nombre: 'Total a Pagar', tipo: 'numero', obligatorio: true },
    ]
  },
  {
    id: 'f22',
    nombre: 'Formulario 22 - Declaración Anual de Renta',
    codigo: 'F22',
    descripcion: 'Declaración anual de impuesto a la renta',
    periodicidad: 'anual',
    obligatorio: true,
    fechaVencimiento: '30 de abril',
    categoria: 'declaracion',
    campos: [
      { codigo: '001', nombre: 'Ingresos Brutos', tipo: 'numero', obligatorio: true },
      { codigo: '020', nombre: 'Gastos Aceptados', tipo: 'numero', obligatorio: true },
      { codigo: '033', nombre: 'Renta Líquida Imponible', tipo: 'numero', obligatorio: true },
      { codigo: '040', nombre: 'Impuesto de Primera Categoría', tipo: 'numero', obligatorio: true },
      { codigo: '091', nombre: 'PPM del Ejercicio', tipo: 'numero', obligatorio: true },
    ]
  },
  {
    id: 'f50',
    nombre: 'Formulario 50 - Libro de Compras y Ventas',
    codigo: 'F50',
    descripcion: 'Resumen mensual de compras y ventas',
    periodicidad: 'mensual',
    obligatorio: true,
    fechaVencimiento: '20 del mes siguiente',
    categoria: 'informativo',
    campos: [
      { codigo: '001', nombre: 'Total Ventas Netas', tipo: 'numero', obligatorio: true },
      { codigo: '002', nombre: 'Total IVA Ventas', tipo: 'numero', obligatorio: true },
      { codigo: '003', nombre: 'Total Compras Netas', tipo: 'numero', obligatorio: true },
      { codigo: '004', nombre: 'Total IVA Compras', tipo: 'numero', obligatorio: true },
    ]
  },
  {
    id: 'f1879',
    nombre: 'Formulario 1879 - Solicitud de Folios',
    codigo: 'F1879',
    descripcion: 'Solicitud de autorización de documentos tributarios',
    periodicidad: 'mensual',
    obligatorio: false,
    fechaVencimiento: 'Según necesidad',
    categoria: 'timbre',
    campos: [
      { codigo: '001', nombre: 'Tipo de Documento', tipo: 'texto', obligatorio: true },
      { codigo: '002', nombre: 'Cantidad de Folios', tipo: 'numero', obligatorio: true },
      { codigo: '003', nombre: 'Desde Folio', tipo: 'numero', obligatorio: true },
      { codigo: '004', nombre: 'Hasta Folio', tipo: 'numero', obligatorio: true },
    ]
  }
];

// Datos simulados para reportes
export const datosReportes = {
  f29_junio_2025: {
    '091': 2850000, // IVA Débito
    '092': 1200000, // IVA Crédito  
    '093': 1650000, // Diferencia
    '150': 450000,  // PPM Obligatorio
    '159': 2100000  // Total a Pagar
  },
  f22_2024: {
    '001': 125000000, // Ingresos Brutos
    '020': 85000000,  // Gastos
    '033': 40000000,  // Renta Líquida
    '040': 10800000,  // Impuesto 1ra Cat
    '091': 8500000    // PPM del Ejercicio
  },
  f50_junio_2025: {
    '001': 15000000,  // Ventas Netas
    '002': 2850000,   // IVA Ventas
    '003': 6300000,   // Compras Netas
    '004': 1200000    // IVA Compras
  }
};

export function calcularCampo(formula: string, datos: any): number {
  // Calculadora simple para fórmulas básicas
  const formula_limpia = formula.replace(/\s/g, '');
  
  if (formula_limpia.includes('-')) {
    const [campo1, campo2] = formula_limpia.split('-');
    return (datos[campo1] || 0) - (datos[campo2] || 0);
  }
  
  if (formula_limpia.includes('+')) {
    const [campo1, campo2] = formula_limpia.split('+');
    return (datos[campo1] || 0) + (datos[campo2] || 0);
  }
  
  if (formula_limpia.includes('*')) {
    const [campo1, campo2] = formula_limpia.split('*');
    return (datos[campo1] || 0) * (datos[campo2] || 0);
  }
  
  return 0;
}
