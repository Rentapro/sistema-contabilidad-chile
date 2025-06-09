// Utilidades para el sistema de contabilidad
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TareaWorkflow, Empresa, Contador } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

// IVA en Chile es 19%
export const calculateIVA = (subtotal: number): number => {
  return subtotal * 0.19;
};

export const calculateTotal = (subtotal: number): number => {
  return subtotal + calculateIVA(subtotal);
};

// Conversión aproximada de MXN a CLP (1 MXN ≈ 33 CLP)
export const convertMXNtoCLP = (amountMXN: number): number => {
  const exchangeRate = 33; // Tasa aproximada
  return Math.round(amountMXN * exchangeRate);
};

// Calcular neto desde total con IVA incluido
export const calculateNetFromTotal = (total: number): number => {
  return Math.round(total / 1.19);
};

// Validar montos para SII (máximos permitidos)
export const validateSIIAmount = (amount: number): boolean => {
  return amount <= 999999999; // Límite SII para facturas
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateInvoiceNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `BOL-${timestamp}`; // Boleta en Chile
};

export const generateFacturaNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `FAC-${timestamp}`; // Factura electrónica
};

// Validación de RUT chileno (reemplaza RFC mexicano)
export const validateRUT = (rut: string): boolean => {
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');
  if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toLowerCase();
  
  let suma = 0;
  let multiplo = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  
  const resto = suma % 11;
  const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'k' : (11 - resto).toString();
  
  return dv === dvCalculado;
};

// Formatear RUT chileno
export const formatRUT = (rut: string): string => {
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');
  if (rutLimpio.length < 8) return rut;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);
  
  return `${parseInt(cuerpo).toLocaleString('es-CL')}-${dv.toUpperCase()}`;
};

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const calculateAge = (date: Date): number => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getEstadoFactura = (factura: { fechaVencimiento: Date; estado: string }): string => {
  if (factura.estado === 'pagada') return 'Pagada';
  if (factura.estado === 'cancelada') return 'Cancelada';
  
  const hoy = new Date();
  if (factura.fechaVencimiento < hoy) {
    return 'Vencida';
  }
  
  return 'Pendiente';
};

// Utilidades específicas para firma contable chilena
export const validarRUT = (rut: string): boolean => {
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');
  if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toLowerCase();
  
  let suma = 0;
  let multiplo = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  
  const resto = suma % 11;
  const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'k' : (11 - resto).toString();
  
  return dv === dvCalculado;
};

export const formatRUT = (rut: string): string => {
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');
  if (rutLimpio.length < 8) return rut;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${cuerpoFormateado}-${dv}`;
};

export const calcularDiasVencimiento = (fechaVencimiento: Date): number => {
  const hoy = new Date();
  const diffTime = fechaVencimiento.getTime() - hoy.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getPrioridadColor = (prioridad: string): string => {
  switch (prioridad) {
    case 'critica': return 'bg-red-100 text-red-800';
    case 'alta': return 'bg-orange-100 text-orange-800';
    case 'media': return 'bg-yellow-100 text-yellow-800';
    case 'baja': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case 'completada': return 'bg-green-100 text-green-800';
    case 'en_proceso': return 'bg-blue-100 text-blue-800';
    case 'atrasada': return 'bg-red-100 text-red-800';
    case 'pendiente': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const generarCodigoEmpresa = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `EMP-${timestamp}-${random}`;
};

export const calcularTarifaPorPlan = (plan: string): number => {
  const tarifas = {
    'basico': 50000,
    'profesional': 150000,
    'empresarial': 300000,
    'premium': 500000
  };
  return tarifas[plan as keyof typeof tarifas] || 0;
};

export const generarCalendarioTributario = (año: number) => {
  return [
    { fecha: new Date(año, 0, 20), descripcion: 'F29 Diciembre (año anterior)' },
    { fecha: new Date(año, 1, 20), descripcion: 'F29 Enero' },
    { fecha: new Date(año, 2, 20), descripcion: 'F29 Febrero' },
    { fecha: new Date(año, 3, 30), descripcion: 'Declaración Renta' },
    // ... más fechas importantes
  ];
};

export const obtenerProximasObligaciones = (): Array<{fecha: Date, descripcion: string}> => {
  const hoy = new Date();
  const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 20);
  
  return [
    { fecha: proximoMes, descripcion: 'Declaración F29 mensual' },
    // Lógica para obtener obligaciones específicas por empresa
  ];
};

// Nuevas utilidades para el sistema de firma
export const formatearMoneda = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amount);
};

export const calcularEficienciaContador = (contadorId: string, tareas: TareaWorkflow[]): number => {
  const tareasContador = tareas.filter(t => t.contadorAsignado === contadorId);
  if (tareasContador.length === 0) return 100;
  
  const completadas = tareasContador.filter(t => t.estado === 'completada').length;
  return Math.round((completadas / tareasContador.length) * 100);
};

export const calcularFacturacionMensual = (empresas: Empresa[]): number => {
  return empresas.reduce((total, empresa) => {
    const tarifas = { basico: 150000, profesional: 350000, premium: 750000 };
    return total + (tarifas[empresa.plan as keyof typeof tarifas] || 0);
  }, 0);
};

export const obtenerEstadisticasPorPlan = (empresas: Empresa[]) => {
  const stats = { basico: 0, profesional: 0, premium: 0 };
  empresas.forEach(empresa => {
    if (stats.hasOwnProperty(empresa.plan)) {
      stats[empresa.plan as keyof typeof stats]++;
    }
  });
  return stats;
};

export const calcularCapacidadContador = (contador: Contador, tareas: TareaWorkflow[]): number => {
  const tareasAsignadas = tareas.filter(t => t.contadorAsignado === contador.id).length;
  return Math.round((tareasAsignadas / contador.capacidadMaxima) * 100);
};

// Funciones adicionales para el procesamiento de documentos y workflow
export const generarCodigoTarea = (tipo: string, empresaId: string): string => {
  const prefijo = tipo.substring(0, 3).toUpperCase();
  const sufijo = empresaId.substring(0, 4).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefijo}-${sufijo}-${timestamp}`;
};

export const calcularDiasHastaVencimiento = (fechaVencimiento: Date): number => {
  const hoy = new Date();
  const vencimiento = new Date(fechaVencimiento);
  const diferencia = vencimiento.getTime() - hoy.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

export const obtenerPrioridadPorVencimiento = (diasHastaVencimiento: number): string => {
  if (diasHastaVencimiento < 0) return 'urgente';
  if (diasHastaVencimiento <= 3) return 'alta';
  if (diasHastaVencimiento <= 7) return 'media';
  return 'baja';
};

export const formatearPorcentaje = (valor: number): string => {
  return `${(valor * 100).toFixed(1)}%`;
};

export const validarRUTChileno = (rut: string): boolean => {
  // Limpiar el RUT
  const rutLimpio = rut.replace(/[.-]/g, '');
  
  if (rutLimpio.length < 8 || rutLimpio.length > 9) {
    return false;
  }

  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toLowerCase();

  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvCalculado = 11 - (suma % 11);
  let dvEsperado = '';

  if (dvCalculado === 11) {
    dvEsperado = '0';
  } else if (dvCalculado === 10) {
    dvEsperado = 'k';
  } else {
    dvEsperado = dvCalculado.toString();
  }

  return dv === dvEsperado;
};

// Formateo específico para pesos chilenos
export const formatCurrencyChilean = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
