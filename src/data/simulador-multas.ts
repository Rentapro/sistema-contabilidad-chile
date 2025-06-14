// Simulador de multas y recargos del SII
export interface TipoMulta {
  id: string;
  nombre: string;
  descripcion: string;
  base: 'porcentaje' | 'utm' | 'fijo';
  valor: number;
  minimo?: number;
  maximo?: number;
  aplicacion: string;
}

export interface MultaCalculada {
  tipo: string;
  descripcion: string;
  baseCalculo: number;
  porcentaje?: number;
  utm?: number;
  montoMulta: number;
  montoTotal: number;
  diasAtraso: number;
  intereses: number;
}

export const tiposMultas: TipoMulta[] = [
  {
    id: 'declaracion_tardia',
    nombre: 'Declaración Tardía',
    descripcion: 'Por presentar declaración fuera de plazo',
    base: 'porcentaje',
    valor: 10,
    minimo: 1,
    aplicacion: 'Sobre el impuesto adeudado con mínimo de 1 UTM'
  },
  {
    id: 'no_declaracion',
    nombre: 'No Declaración',
    descripcion: 'Por no presentar declaración',
    base: 'porcentaje',
    valor: 20,
    minimo: 1,
    aplicacion: 'Sobre el impuesto determinado con mínimo de 1 UTM'
  },
  {
    id: 'pago_tardio',
    nombre: 'Pago Tardío',
    descripcion: 'Por pagar impuestos fuera de plazo',
    base: 'porcentaje',
    valor: 1.5,
    aplicacion: 'Mensual sobre el impuesto adeudado'
  },
  {
    id: 'libro_tardio',
    nombre: 'Libro de Compras/Ventas Tardío',
    descripcion: 'Por presentar F50 fuera de plazo',
    base: 'utm',
    valor: 1,
    maximo: 10,
    aplicacion: 'Entre 1 y 10 UTM según días de atraso'
  },
  {
    id: 'contabilidad_incompleta',
    nombre: 'Contabilidad Incompleta',
    descripcion: 'Por llevar contabilidad incompleta o atrasada',
    base: 'utm',
    valor: 10,
    maximo: 200,
    aplicacion: 'Entre 10 y 200 UTM según gravedad'
  },
  {
    id: 'documento_invalido',
    nombre: 'Documento Inválido',
    descripcion: 'Por emitir documentos sin autorización',
    base: 'utm',
    valor: 2,
    maximo: 40,
    aplicacion: 'Entre 2 y 40 UTM por documento'
  }
];

export class SimuladorMultas {
  private utm: number;
  
  constructor(utm: number = 65738) {
    this.utm = utm;
  }

  calcularMultaDeclaracionTardia(
    impuestoAdeudado: number, 
    diasAtraso: number
  ): MultaCalculada {
    const porcentajeMulta = 10;
    const montoMulta = Math.max(
      (impuestoAdeudado * porcentajeMulta) / 100,
      this.utm
    );
    
    const interesesMensuales = this.calcularIntereses(impuestoAdeudado, diasAtraso);
    
    return {
      tipo: 'Declaración Tardía',
      descripcion: `Multa por declarar ${diasAtraso} días tarde`,
      baseCalculo: impuestoAdeudado,
      porcentaje: porcentajeMulta,
      montoMulta,
      montoTotal: impuestoAdeudado + montoMulta + interesesMensuales,
      diasAtraso,
      intereses: interesesMensuales
    };
  }

  calcularMultaPagoTardio(
    impuestoAdeudado: number,
    diasAtraso: number
  ): MultaCalculada {
    const mesesAtraso = Math.ceil(diasAtraso / 30);
    const porcentajeInteres = 1.5 * mesesAtraso;
    const intereses = (impuestoAdeudado * porcentajeInteres) / 100;
    
    return {
      tipo: 'Pago Tardío',
      descripcion: `Intereses por pagar ${diasAtraso} días tarde`,
      baseCalculo: impuestoAdeudado,
      porcentaje: porcentajeInteres,
      montoMulta: 0,
      montoTotal: impuestoAdeudado + intereses,
      diasAtraso,
      intereses
    };
  }

  calcularMultaLibroTardio(diasAtraso: number): MultaCalculada {
    let utm = 1;
    
    if (diasAtraso > 90) utm = 10;
    else if (diasAtraso > 60) utm = 7;
    else if (diasAtraso > 30) utm = 4;
    else if (diasAtraso > 15) utm = 2;
    
    const montoMulta = utm * this.utm;
    
    return {
      tipo: 'Libro de Compras/Ventas Tardío',
      descripcion: `Multa por presentar F50 con ${diasAtraso} días de atraso`,
      baseCalculo: 0,
      utm,
      montoMulta,
      montoTotal: montoMulta,
      diasAtraso,
      intereses: 0
    };
  }

  calcularMultaNoDeclaracion(impuestoEstimado: number): MultaCalculada {
    const porcentajeMulta = 20;
    const montoMulta = Math.max(
      (impuestoEstimado * porcentajeMulta) / 100,
      this.utm
    );
    
    return {
      tipo: 'No Declaración',
      descripcion: 'Multa por no presentar declaración',
      baseCalculo: impuestoEstimado,
      porcentaje: porcentajeMulta,
      montoMulta,
      montoTotal: impuestoEstimado + montoMulta,
      diasAtraso: 0,
      intereses: 0
    };
  }

  private calcularIntereses(monto: number, dias: number): number {
    const meses = Math.ceil(dias / 30);
    const tasaMensual = 1.5;
    return (monto * tasaMensual * meses) / 100;
  }

  // Método principal para calcular cualquier tipo de multa
  calcularMulta(
    tipo: string,
    parametros: {
      impuestoAdeudado?: number;
      diasAtraso?: number;
      impuestoEstimado?: number;
    }
  ): MultaCalculada {
    switch (tipo) {
      case 'declaracion_tardia':
        return this.calcularMultaDeclaracionTardia(
          parametros.impuestoAdeudado || 0,
          parametros.diasAtraso || 0
        );
      
      case 'pago_tardio':
        return this.calcularMultaPagoTardio(
          parametros.impuestoAdeudado || 0,
          parametros.diasAtraso || 0
        );
      
      case 'libro_tardio':
        return this.calcularMultaLibroTardio(parametros.diasAtraso || 0);
      
      case 'no_declaracion':
        return this.calcularMultaNoDeclaracion(parametros.impuestoEstimado || 0);
      
      default:
        throw new Error(`Tipo de multa no reconocido: ${tipo}`);
    }
  }
}

// Datos de ejemplo para simulaciones
export const ejemplosMultas = [
  {
    escenario: 'F29 con 15 días de atraso',
    tipo: 'declaracion_tardia',
    impuestoAdeudado: 850000,
    diasAtraso: 15
  },
  {
    escenario: 'Pago IVA con 45 días de atraso',
    tipo: 'pago_tardio',
    impuestoAdeudado: 1200000,
    diasAtraso: 45
  },
  {
    escenario: 'F50 con 2 meses de atraso',
    tipo: 'libro_tardio',
    diasAtraso: 60
  },
  {
    escenario: 'No presentación F22',
    tipo: 'no_declaracion',
    impuestoEstimado: 2500000
  }
];
