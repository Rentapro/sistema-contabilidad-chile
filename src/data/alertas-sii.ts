// Sistema de alertas del SII
export interface AlertaSII {
  id: string;
  tipo: 'observacion' | 'requerimiento' | 'fiscalizacion' | 'vencimiento' | 'multa' | 'credito';
  titulo: string;
  descripcion: string;
  fechaEmision: Date;
  fechaVencimiento?: Date;
  estado: 'pendiente' | 'en_proceso' | 'resuelto' | 'vencido';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  rut?: string;
  monto?: number;
  numeroDocumento?: string;
  acciones: AccionSII[];
  explicacion?: string;
  solucion?: string;
  impactoEconomico?: string;
  consejoIA?: string;
}

export interface AccionSII {
  id: string;
  tipo: 'declarar' | 'pagar' | 'presentar_descargo' | 'enviar_documento' | 'contactar_sii';
  titulo: string;
  descripcion: string;
  plazo?: Date;
  completada: boolean;
  url?: string;
}

// Alertas simuladas del SII
export const alertasSIISimuladas: AlertaSII[] = [
  {
    id: 'ALT-2025-001',
    tipo: 'observacion',
    titulo: 'Observación en Declaración F29 Mayo 2025',
    descripcion: 'Se detectaron inconsistencias en el cálculo de IVA débito fiscal. Los montos declarados no coinciden con las ventas reportadas.',
    fechaEmision: new Date('2025-06-10'),
    fechaVencimiento: new Date('2025-06-25'),
    estado: 'pendiente',
    prioridad: 'alta',
    monto: 450000,
    numeroDocumento: 'F29-202505-001',
    explicacion: 'El SII ha detectado que el IVA débito fiscal declarado ($850.000) no coincide con el 19% de las ventas netas reportadas ($4.200.000). La diferencia es de $450.000.',
    solucion: 'Debes revisar tus ventas del mes de mayo y recalcular el IVA. Si hay ventas no declaradas, presenta una declaración rectificatoria. Si hay ventas exentas, justifícalas con documentación.',
    impactoEconomico: 'Multa potencial de $450.000 + intereses (3% mensual). Total estimado: $465.000 si se resuelve en 15 días.',
    consejoIA: 'Recomiendo revisar inmediatamente el libro de ventas de mayo. Probablemente hay facturas emitidas que no fueron incluidas en la declaración F29. Usa nuestro módulo de conciliación automática para identificar las diferencias.',
    acciones: [
      {
        id: 'ACC-001',
        tipo: 'presentar_descargo',
        titulo: 'Presentar Descargo con Documentación',
        descripcion: 'Presentar explicación formal con libro de ventas corregido',
        plazo: new Date('2025-06-25'),
        completada: false,
        url: 'https://zeusr.sii.cl/AUT2000/InicioAutenticacion/IngresoRutClave.html'
      },
      {
        id: 'ACC-002',
        tipo: 'declarar',
        titulo: 'Declaración Rectificatoria F29',
        descripcion: 'Presentar F29 rectificatorio con los montos corregidos',
        plazo: new Date('2025-06-25'),
        completada: false
      }
    ]
  },
  {
    id: 'ALT-2025-002',
    tipo: 'requerimiento',
    titulo: 'Requerimiento de Información - Gastos Rechazados',
    descripcion: 'El SII requiere documentación adicional para justificar gastos de $2.800.000 en servicios de consultoría informática.',
    fechaEmision: new Date('2025-06-05'),
    fechaVencimiento: new Date('2025-06-20'),
    estado: 'en_proceso',
    prioridad: 'critica',
    monto: 2800000,
    numeroDocumento: 'REQ-2025-1847',
    explicacion: 'El SII cuestiona la necesidad comercial de los servicios de consultoría informática facturados por $2.800.000. Considera que podrían ser gastos personales o no relacionados con el giro.',
    solucion: 'Debes presentar: 1) Contratos de servicios, 2) Emails de coordinación, 3) Entregables recibidos, 4) Justificación de la necesidad comercial, 5) Comparación de precios de mercado.',
    impactoEconomico: 'Si se rechazan los gastos: Impuesto adicional de $756.000 (27% de $2.800.000) + multa de 50% = $1.134.000 total.',
    consejoIA: 'Este tipo de requerimiento es común. La clave está en demostrar la necesidad comercial. Prepara un informe técnico que explique cómo estos servicios mejoran tu operación. También incluye benchmarking de precios.',
    acciones: [
      {
        id: 'ACC-003',
        tipo: 'enviar_documento',
        titulo: 'Enviar Documentación Completa',
        descripcion: 'Recopilar y enviar todos los documentos de respaldo',
        plazo: new Date('2025-06-20'),
        completada: false
      },
      {
        id: 'ACC-004',
        tipo: 'presentar_descargo',
        titulo: 'Presentar Informe Técnico',
        descripcion: 'Elaborar informe que justifique la necesidad comercial',
        plazo: new Date('2025-06-20'),
        completada: false
      }
    ]
  },
  {
    id: 'ALT-2025-003',
    tipo: 'vencimiento',
    titulo: 'PPM Junio 2025 - Vence Mañana',
    descripcion: 'El PPM de junio por $1.250.000 vence el 12 de junio de 2025. Aún no ha sido pagado.',
    fechaEmision: new Date('2025-06-11'),
    fechaVencimiento: new Date('2025-06-12'),
    estado: 'pendiente',
    prioridad: 'critica',
    monto: 1250000,
    numeroDocumento: 'PPM-202506',
    explicacion: 'El Pago Provisional Mensual (PPM) es obligatorio para empresas con ventas superiores a ciertas cantidades. Es un anticipo del impuesto anual.',
    solucion: 'Paga inmediatamente a través del portal del SII o en cualquier banco. Si no tienes el dinero, puedes pedir convenio de pago con hasta 6 cuotas.',
    impactoEconomico: 'Multa por atraso: 10% del impuesto ($125.000) + intereses de 1,5% mensual. Si pagas hoy: $125.000. Si pagas en 30 días: $143.750.',
    consejoIA: 'Situación crítica. Si no puedes pagar, solicita inmediatamente un convenio de pago en el portal SII. También revisa si puedes reducir el PPM del próximo mes basado en proyecciones más conservadoras.',
    acciones: [
      {
        id: 'ACC-005',
        tipo: 'pagar',
        titulo: 'Pagar PPM Inmediatamente',
        descripcion: 'Realizar pago a través del portal SII o banco',
        plazo: new Date('2025-06-12'),
        completada: false,
        url: 'https://www4.sii.cl/consdcvinternetui/#!/'
      },
      {
        id: 'ACC-006',
        tipo: 'contactar_sii',
        titulo: 'Solicitar Convenio de Pago',
        descripcion: 'Si no puedes pagar completo, solicitar convenio',
        plazo: new Date('2025-06-12'),
        completada: false
      }
    ]
  },
  {
    id: 'ALT-2025-004',
    tipo: 'credito',
    titulo: 'Crédito Fiscal IVA Disponible',
    descripcion: 'Tienes $890.000 en créditos fiscales de IVA acumulados. Puedes solicitar su devolución o imputación.',
    fechaEmision: new Date('2025-06-01'),
    estado: 'pendiente',
    prioridad: 'media',
    monto: 890000,
    explicacion: 'Los créditos fiscales de IVA se generan cuando pagas más IVA en compras que el que cobras en ventas. Puedes recuperar este dinero.',
    solucion: 'Opciones: 1) Solicitar devolución en efectivo (demora 60 días), 2) Imputar a PPM o impuesto anual, 3) Mantener para próximos períodos.',
    impactoEconomico: 'Potencial mejora de flujo de caja de $890.000. Si lo inviertes al 8% anual, generas $71.200 adicionales.',
    consejoIA: 'Recomiendo solicitar la devolución si tu flujo de caja lo necesita. Si no, déjalo acumulado para imputar al PPM y reducir pagos futuros. Es dinero tuyo que el SII debe devolver.',
    acciones: [
      {
        id: 'ACC-007',
        tipo: 'declarar',
        titulo: 'Solicitar Devolución de IVA',
        descripcion: 'Presentar solicitud de devolución de crédito fiscal',
        completada: false,
        url: 'https://www4.sii.cl'
      }
    ]
  },
  {
    id: 'ALT-2025-005',
    tipo: 'multa',
    titulo: 'Multa por Declaración Tardía F29 Abril',
    descripción: 'Multa aplicada por presentar F29 de abril fuera de plazo. Monto: $89.000.',
    fechaEmision: new Date('2025-06-08'),
    estado: 'pendiente',
    prioridad: 'alta',
    monto: 89000,
    numeroDocumento: 'MUL-2025-0842',
    explicacion: 'Las declaraciones F29 deben presentarse hasta el día 12 de cada mes. La tuya se presentó el día 15, generando una multa automática.',
    solucion: 'Puedes: 1) Pagar la multa, 2) Presentar recurso de reposición si tienes justificación válida (fuerza mayor, error del sistema, etc.)',
    impactoEconomico: '$89.000 + intereses si no pagas en 30 días. Total potencial: $90.335.',
    consejoIA: 'Multa relativamente baja. Si fue por un error justificable (falla del sistema, problema de salud, etc.), presenta recurso de reposición. Si no, es mejor pagarla y configurar recordatorios automáticos para evitar futuros atrasos.',
    acciones: [
      {
        id: 'ACC-008',
        tipo: 'pagar',
        titulo: 'Pagar Multa',
        descripcion: 'Pagar multa para evitar intereses adicionales',
        completada: false
      },
      {
        id: 'ACC-009',
        tipo: 'presentar_descargo',
        titulo: 'Recurso de Reposición',
        descripción: 'Presentar recurso si hay justificación válida',
        completada: false
      }
    ]
  }
];

// Función para obtener alertas por prioridad
export function obtenerAlertasPorPrioridad(prioridad: AlertaSII['prioridad']): AlertaSII[] {
  return alertasSIISimuladas.filter(alerta => alerta.prioridad === prioridad && alerta.estado !== 'resuelto');
}

// Función para obtener alertas críticas (alta y crítica)
export function obtenerAlertasCriticas(): AlertaSII[] {
  return alertasSIISimuladas.filter(alerta => 
    (alerta.prioridad === 'alta' || alerta.prioridad === 'critica') && 
    alerta.estado !== 'resuelto'
  );
}

// Función para obtener alertas próximas a vencer
export function obtenerAlertasProximasVencer(dias: number = 7): AlertaSII[] {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + dias);
  
  return alertasSIISimuladas.filter(alerta => 
    alerta.fechaVencimiento && 
    alerta.fechaVencimiento <= fechaLimite && 
    alerta.estado !== 'resuelto'
  );
}

// Función para calcular el impacto económico total
export function calcularImpactoEconomicoTotal(): number {
  return alertasSIISimuladas
    .filter(alerta => alerta.estado !== 'resuelto' && alerta.monto)
    .reduce((total, alerta) => total + (alerta.monto || 0), 0);
}
