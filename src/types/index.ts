// Tipos principales para el sistema de contabilidad

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  rut: string; // RUT chileno en lugar de RFC mexicano
  giro: string; // Giro comercial específico de Chile
  fechaCreacion: Date;
  activo: boolean;
  tipoContribuyente: 'primera_categoria' | 'segunda_categoria' | 'regimen_simplificado';
}

export interface Proveedor {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  rut: string; // RUT chileno
  giro: string; // Giro comercial
  fechaCreacion: Date;
  activo: boolean;
  tipoContribuyente: 'primera_categoria' | 'segunda_categoria' | 'regimen_simplificado';
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  activo: boolean;
}

export interface DetalleFactura {
  id: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

export interface Factura {
  id: string;
  numero: string;
  clienteId: string;
  fecha: Date;
  fechaVencimiento: Date;
  detalles: DetalleFactura[];
  subtotal: number;
  iva: number; // IVA 19% en Chile
  total: number;
  estado: 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
  notas?: string;
  tipoDocumento: 'boleta' | 'factura_electronica' | 'nota_credito' | 'nota_debito';
  folioSII?: string; // Folio del SII para documentos electrónicos
  timbreSII?: string; // Timbre electrónico del SII
}

export interface Gasto {
  id: string;
  proveedorId?: string;
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: Date;
  comprobante?: string;
  deducible: boolean;
}

export interface CuentaContable {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'activo' | 'pasivo' | 'capital' | 'ingreso' | 'gasto';
  padre?: string;
  nivel: number;
  saldo: number;
}

export interface MovimientoContable {
  id: string;
  fecha: Date;
  concepto: string;
  referencia: string;
  cuentaDeudora: string;
  cuentaAcreedora: string;
  monto: number;
  tipo: 'factura' | 'gasto' | 'pago' | 'ajuste';
}

export interface ReporteFinanciero {
  periodo: {
    inicio: Date;
    fin: Date;
  };
  ingresos: number;
  gastos: number;
  utilidadBruta: number;
  utilidadNeta: number;
  iva: number;
}

// Tipos para gestión de firma contable
export interface Empresa {
  id: string;
  razonSocial: string;
  rut: string;
  giro: string;
  direccion: string;
  telefono: string;
  email: string;
  representanteLegal: string;
  tipoEmpresa: 'spa' | 'limitada' | 'sa' | 'individual' | 'cooperativa';
  regimen: 'primera_categoria' | 'segunda_categoria' | 'pro_pyme' | '14ter';
  fechaConstitucion: Date;
  fechaInicioActividades: Date;
  plan: 'basico' | 'profesional' | 'premium';
  estado: 'activo' | 'suspendido' | 'moroso' | 'inactivo';
  contadorAsignado?: string;
  fechaRegistro: Date;
  configuracion: {
    frecuenciaReportes: 'mensual' | 'trimestral';
    tiposImpuestos: string[];
    integraciónBancaria: boolean;
    notificacionesEmail: boolean;
  };
}

export interface Contador {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string[];
  empresasAsignadas: string[];
  capacidadMaxima: number;
  activo: boolean;
  fechaIngreso: Date;
}

export interface TareaWorkflow {
  id: string;
  empresaId: string;
  contadorId?: string;
  tipo: 'cierre_mensual' | 'declaracion_f29' | 'declaracion_f22' | 'conciliacion' | 'facturacion' | 'revision' | 'validacion_documento';
  titulo: string;
  descripcion: string;
  fechaVencimiento: Date;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  estado: 'pendiente' | 'en_proceso' | 'completada' | 'atrasada';
  contadorAsignado?: string;
  estimacionHoras: number;
  horasReales?: number;
  fechaCreacion: Date;
  fechaCompletado?: Date;
  notas: string;
  documentosRequeridos: string[];
  dependencias: string[];
  metadatos?: {
    documentoId?: string;
    confianza?: number;
    tipoValidacion?: string;
  };
}

export interface Plantilla {
  id: string;
  nombre: string;
  tipo: 'workflow' | 'comunicacion' | 'reporte';
  contenido: object;
  activa: boolean;
  fechaCreacion: Date;
  ultimaModificacion: Date;
}

export interface DocumentoProcesado {
  id: string;
  nombre: string;
  empresaId: string;
  tipo: 'factura_compra' | 'factura_venta' | 'boleta' | 'nota_credito' | 'nota_debito' | 'guia_despacho' | 'liquidacion_sueldo' | 'honorarios' | 'otro';
  numeroDocumento?: string;
  fecha: Date;
  fechaSubida: Date;
  fechaProcesamiento?: Date;
  proveedor?: string;
  cliente?: string;
  montoNeto?: number;
  iva?: number;
  montoTotal?: number;
  estado: 'pendiente' | 'procesando' | 'procesado' | 'error' | 'validado' | 'contabilizado' | 'revisado' | 'aprobado' | 'rechazado';
  origen: 'manual' | 'ocr' | 'api' | 'importacion' | 'upload';
  archivoUrl?: string;
  tamaño: number;
  errores?: string[];
  confianza?: number;
  requiereValidacion?: boolean;
  datosExtraidos?: {
    rut?: string;
    numeroDocumento?: string;
    fecha?: string;
    monto?: number;
    proveedor?: string;
    cliente?: string;
    conceptos?: string[];
  };
  metadatos?: {
    categoriaIA?: string;
    etiquetas?: string[];
    ubicacionCuentas?: string[];
    recomendacionesIA?: string[];
  };
}

export interface MetricasFirma {
  totalEmpresas: number;
  empresasActivas: number;
  ingresosMensuales: number;
  tareasPendientes: number;
  tareasVencidas: number;
  eficienciaPromedio: number;
  satisfaccionClientes: number;
  documentosProcesados: number;
}

export interface NotificacionAutomatica {
  id: string;
  empresaId: string;
  tipo: 'vencimiento_tarea' | 'documento_pendiente' | 'pago_vencido' | 'cambio_normativo';
  titulo: string;
  mensaje: string;
  fechaEnvio: Date;
  canal: 'email' | 'whatsapp' | 'sistema';
  estado: 'enviada' | 'leida' | 'respondida';
}

// Tipos específicos para el SII (Servicio de Impuestos Internos) de Chile
export interface DocumentoTributarioSII {
  id: string;
  folio: number;
  tipoDocumento: 33 | 34 | 39 | 41 | 43 | 46 | 52 | 56 | 61; // Códigos del SII
  rutEmisor: string;
  rutReceptor: string;
  fechaEmision: Date;
  montoNeto: number;
  montoIVA: number;
  montoTotal: number;
  timbreElectronico?: string;
  CAF?: string; // Código de Autorización de Folios
  estadoSII: 'pendiente' | 'aceptado' | 'rechazado' | 'reparo';
  fechaRecepcionSII?: Date;
  motivoRechazo?: string;
}

export interface LibroCompraVenta {
  id: string;
  periodo: string; // AAAAMM
  tipoLibro: 'compras' | 'ventas';
  totalOperaciones: number;
  montoTotalNeto: number;
  montoTotalIVA: number;
  fechaEnvioSII?: Date;
  estadoSII: 'pendiente' | 'enviado' | 'aceptado' | 'rechazado';
  numeroOperacion?: string; // Número de operación del SII
  fechaAceptacionSII?: Date;
}

export interface FormularioF29 {
  id: string;
  empresaId: string;
  periodo: string; // AAAAMM
  ppmpagado?: number; // PPM pagado
  ivaDebitoFiscal: number;
  ivaCreditoFiscal: number;
  retenciones: number;
  otrosImpuestos: number;
  impuestoAPagar: number;
  fechaDeclaracion?: Date;
  fechaVencimiento: Date;
  estado: 'borrador' | 'enviado' | 'pagado';
  numeroOperacion?: string;
  cajasF29: { [key: string]: number }; // Todas las cajas del F29
}

export interface DeclaracionRenta {
  id: string;
  empresaId: string;
  añoTributario: number;
  ingresosBrutos: number;
  gastosAceptados: number;
  rentaLiquida: number;
  impuestoPrimeraCategoria: number;
  ppmliquidado: number; // PPM Liquidado
  saldoAPagar: number;
  saldoAFavor: number;
  fechaDeclaracion?: Date;
  fechaVencimiento: Date;
  estado: 'borrador' | 'enviado' | 'aprobado';
  formulario: 'F22' | 'F50';
}

export interface CalendarioTributario {
  id: string;
  año: number;
  obligaciones: ObligacionTributaria[];
}

export interface ObligacionTributaria {
  id: string;
  nombre: string;
  descripcion: string;
  tipoContribuyente: string[];
  fechaVencimiento: Date;
  formulario?: string;
  monto?: number;
  estado: 'pendiente' | 'presentado' | 'pagado' | 'vencido';
  requiereDeclaracion: boolean;
  requierePago: boolean;
  multa?: number;
  interes?: number;
}

export interface RegimenTributario {
  codigo: string;
  nombre: string;
  descripcion: string;
  ventajas: string[];
  requisitos: string[];
  obligaciones: string[];
  tasaImpuesto: number;
  limiteVentas?: number;
}

// Tipos para categorías de gastos según SII
export interface CategoriaGastoSII {
  codigo: string;
  nombre: string;
  descripcion: string;
  esDeducible: boolean;
  requiereDocumento: boolean;
  limitePorcentaje?: number;
  observaciones?: string;
}

// Estados de documentos según SII
export type EstadoDocumentoSII = 
  | 'DOK' // Documento aceptado por SII
  | 'DNK' // Documento no conocido por SII  
  | 'FAU' // Documento con errores
  | 'FNA' // Folio no autorizado
  | 'EMP' // Error en empresa
  | 'TMD' // Error en timbraje
  | 'FVE' // Folio vencido
  | 'RSC' // Rechazado por falta CAF;

// Códigos de actividad económica del SII
export interface ActividadEconomica {
  codigo: number;
  descripcion: string;
  categoria: string;
  requiereIniciacion: boolean;
  afectaIVA: boolean;
}
