// Sistema de gestión de roles y niveles de acceso
export type TipoUsuario = 'admin' | 'empresa_propia' | 'contador_externo' | 'cliente_software';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rut: string;
  tipo: TipoUsuario;
  empresasAsignadas: string[];
  permisos: Permiso[];
  planActivo: 'basico' | 'premium' | 'empresarial';
  fechaCreacion: string;
  ultimoAcceso: string;
}

export interface Permiso {
  modulo: string;
  acciones: ('leer' | 'escribir' | 'eliminar' | 'exportar')[];
}

export interface Empresa {
  id: string;
  rut: string;
  razonSocial: string;
  giro: string;
  propietarioRut: string; // RUT de la persona natural que puede tener varias empresas
  contadorAsignado?: string; // ID del contador que lleva esta empresa
  tipoCliente: 'software_propio' | 'servicio_contable' | 'contador_externo';
  planActivo: 'basico' | 'premium' | 'empresarial';
  fechaCreacion: string;
  ultimaActividad: string;
  estado: 'activa' | 'suspendida' | 'cerrada';
  configuracion: ConfiguracionEmpresa;
  metricas: MetricasEmpresa;
}

export interface ConfiguracionEmpresa {
  periodoContable: string;
  tipoContabilidad: 'simplificada' | 'completa';
  regimen: 'primera_categoria' | 'pro_pyme' | 'micro_empresa';
  ivaQuincenal: boolean;
  ventasMinimas: boolean;
  trabajadoresCantidad: number;
}

export interface MetricasEmpresa {
  ventasUltimos12Meses: number;
  ivaPromedio: number;
  creditosFiscales: number;
  impuestosAhorrados: number;
  eficienciaTributaria: number; // Porcentaje de optimización lograda
}

// Datos de ejemplo para múltiples empresas
export const empresas: Empresa[] = [
  {
    id: 'emp_001',
    rut: '76.123.456-7',
    razonSocial: 'Comercial López y Asociados Ltda.',
    giro: 'Comercio al por menor',
    propietarioRut: '12.345.678-9',
    contadorAsignado: 'contador_001',
    tipoCliente: 'servicio_contable',
    planActivo: 'premium',
    fechaCreacion: '2024-01-15',
    ultimaActividad: '2025-06-12',
    estado: 'activa',
    configuracion: {
      periodoContable: '2025',
      tipoContabilidad: 'completa',
      regimen: 'primera_categoria',
      ivaQuincenal: false,
      ventasMinimas: false,
      trabajadoresCantidad: 12
    },
    metricas: {
      ventasUltimos12Meses: 850000000,
      ivaPromedio: 13600000,
      creditosFiscales: 2400000,
      impuestosAhorrados: 1850000,
      eficienciaTributaria: 78
    }
  },
  {
    id: 'emp_002',
    rut: '76.234.567-8',
    razonSocial: 'Constructora San Martín SpA',
    giro: 'Construcción',
    propietarioRut: '12.345.678-9', // Mismo propietario que la anterior
    contadorAsignado: 'contador_001',
    tipoCliente: 'servicio_contable',
    planActivo: 'empresarial',
    fechaCreacion: '2024-03-20',
    ultimaActividad: '2025-06-12',
    estado: 'activa',
    configuracion: {
      periodoContable: '2025',
      tipoContabilidad: 'completa',
      regimen: 'primera_categoria',
      ivaQuincenal: true,
      ventasMinimas: false,
      trabajadoresCantidad: 35
    },
    metricas: {
      ventasUltimos12Meses: 2400000000,
      ivaPromedio: 38400000,
      creditosFiscales: 8900000,
      impuestosAhorrados: 5200000,
      eficienciaTributaria: 85
    }
  },
  {
    id: 'emp_003',
    rut: '76.345.678-9',
    razonSocial: 'Tecnología Avanzada Chile Ltda.',
    giro: 'Desarrollo de software',
    propietarioRut: '98.765.432-1',
    tipoCliente: 'software_propio',
    planActivo: 'premium',
    fechaCreacion: '2024-06-10',
    ultimaActividad: '2025-06-12',
    estado: 'activa',
    configuracion: {
      periodoContable: '2025',
      tipoContabilidad: 'completa',
      regimen: 'pro_pyme',
      ivaQuincenal: false,
      ventasMinimas: true,
      trabajadoresCantidad: 8
    },
    metricas: {
      ventasUltimos12Meses: 450000000,
      ivaPromedio: 7200000,
      creditosFiscales: 3200000,
      impuestosAhorrados: 980000,
      eficienciaTributaria: 72
    }
  },
  {
    id: 'emp_004',
    rut: '76.456.789-0',
    razonSocial: 'Restaurante El Buen Sabor Ltda.',
    giro: 'Servicios de comida',
    propietarioRut: '87.654.321-0',
    contadorAsignado: 'contador_ext_001',
    tipoCliente: 'contador_externo',
    planActivo: 'basico',
    fechaCreacion: '2024-09-05',
    ultimaActividad: '2025-06-12',
    estado: 'activa',
    configuracion: {
      periodoContable: '2025',
      tipoContabilidad: 'simplificada',
      regimen: 'pro_pyme',
      ivaQuincenal: false,
      ventasMinimas: true,
      trabajadoresCantidad: 15
    },
    metricas: {
      ventasUltimos12Meses: 320000000,
      ivaPromedio: 5120000,
      creditosFiscales: 1800000,
      impuestosAhorrados: 520000,
      eficienciaTributaria: 65
    }
  },
  {
    id: 'emp_005',
    rut: '76.567.890-1',
    razonSocial: 'Importadora Global Chile SpA',
    giro: 'Importación y distribución',
    propietarioRut: '11.222.333-4',
    contadorAsignado: 'contador_001',
    tipoCliente: 'servicio_contable',
    planActivo: 'empresarial',
    fechaCreacion: '2024-02-28',
    ultimaActividad: '2025-06-12',
    estado: 'activa',
    configuracion: {
      periodoContable: '2025',
      tipoContabilidad: 'completa',
      regimen: 'primera_categoria',
      ivaQuincenal: true,
      ventasMinimas: false,
      trabajadoresCantidad: 28
    },
    metricas: {
      ventasUltimos12Meses: 1800000000,
      ivaPromedio: 28800000,
      creditosFiscales: 12500000,
      impuestosAhorrados: 3400000,
      eficienciaTributaria: 82
    }
  },
  {
    id: 'emp_006',
    rut: '76.678.901-2',
    razonSocial: 'Servicios Médicos Integral Ltda.',
    giro: 'Servicios de salud',
    propietarioRut: '55.666.777-8',
    tipoCliente: 'software_propio',
    planActivo: 'premium',
    fechaCreacion: '2024-04-12',
    ultimaActividad: '2025-06-12',
    estado: 'activa',
    configuracion: {
      periodoContable: '2025',
      tipoContabilidad: 'completa',
      regimen: 'primera_categoria',
      ivaQuincenal: false,
      ventasMinimas: false,
      trabajadoresCantidad: 22
    },
    metricas: {
      ventasUltimos12Meses: 680000000,
      ivaPromedio: 10880000,
      creditosFiscales: 4200000,
      impuestosAhorrados: 1200000,
      eficienciaTributaria: 75
    }
  },
  {
    id: 'emp_007',
    rut: '76.789.012-3',
    razonSocial: 'Transportes Rápidos del Sur Ltda.',
    giro: 'Transporte de carga',
    propietarioRut: '12.345.678-9', // Mismo propietario que emp_001 y emp_002
    contadorAsignado: 'contador_001',
    tipoCliente: 'servicio_contable',
    planActivo: 'premium',
    fechaCreacion: '2024-07-18',
    ultimaActividad: '2025-06-12',
    estado: 'activa',
    configuracion: {
      periodoContable: '2025',
      tipoContabilidad: 'completa',
      regimen: 'primera_categoria',
      ivaQuincenal: false,
      ventasMinimas: false,
      trabajadoresCantidad: 18
    },
    metricas: {
      ventasUltimos12Meses: 520000000,
      ivaPromedio: 8320000,
      creditosFiscales: 3800000,
      impuestosAhorrados: 890000,
      eficienciaTributaria: 71
    }
  },
  {
    id: 'emp_008',
    rut: '76.890.123-4',
    razonSocial: 'Consultora Empresarial Norte SpA',
    giro: 'Consultoría en gestión',
    propietarioRut: '33.444.555-6',
    contadorAsignado: 'contador_ext_002',
    tipoCliente: 'contador_externo',
    planActivo: 'basico',
    fechaCreacion: '2024-11-22',
    ultimaActividad: '2025-06-12',
    estado: 'activa',
    configuracion: {
      periodoContable: '2025',
      tipoContabilidad: 'simplificada',
      regimen: 'pro_pyme',
      ivaQuincenal: false,
      ventasMinimas: true,
      trabajadoresCantidad: 6
    },
    metricas: {
      ventasUltimos12Meses: 180000000,
      ivaPromedio: 2880000,
      creditosFiscales: 950000,
      impuestosAhorrados: 280000,
      eficienciaTributaria: 68
    }
  },
  {
    id: 'emp_009',
    rut: '76.901.234-5',
    razonSocial: 'Manufacturas Industriales Chile Ltda.',
    giro: 'Manufactura',
    propietarioRut: '77.888.999-0',
    contadorAsignado: 'contador_001',
    tipoCliente: 'servicio_contable',
    planActivo: 'empresarial',
    fechaCreacion: '2024-01-30',
    ultimaActividad: '2025-06-12',
    estado: 'activa',
    configuracion: {
      periodoContable: '2025',
      tipoContabilidad: 'completa',
      regimen: 'primera_categoria',
      ivaQuincenal: true,
      ventasMinimas: false,
      trabajadoresCantidad: 45
    },
    metricas: {
      ventasUltimos12Meses: 3200000000,
      ivaPromedio: 51200000,
      creditosFiscales: 15600000,
      impuestosAhorrados: 6800000,
      eficienciaTributaria: 88
    }
  },
  {
    id: 'emp_010',
    rut: '76.012.345-6',
    razonSocial: 'Comercializadora Digital Plus Ltda.',
    giro: 'E-commerce',
    propietarioRut: '22.333.444-5',
    tipoCliente: 'software_propio',
    planActivo: 'premium',
    fechaCreacion: '2024-08-14',
    ultimaActividad: '2025-06-12',
    estado: 'activa',
    configuracion: {
      periodoContable: '2025',
      tipoContabilidad: 'completa',
      regimen: 'pro_pyme',
      ivaQuincenal: false,
      ventasMinimas: false,
      trabajadoresCantidad: 11
    },
    metricas: {
      ventasUltimos12Meses: 380000000,
      ivaPromedio: 6080000,
      creditosFiscales: 2100000,
      impuestosAhorrados: 650000,
      eficienciaTributaria: 73
    }
  }
];

// Usuario actual simulado (admin que maneja varias empresas)
export const usuarioActual: Usuario = {
  id: 'admin_001',
  nombre: 'Administrador Principal',
  email: 'admin@contabilidad-chile.com',
  rut: '12.345.678-9',
  tipo: 'admin',
  empresasAsignadas: ['emp_001', 'emp_002', 'emp_005', 'emp_007', 'emp_009'],
  permisos: [
    {
      modulo: 'todas',
      acciones: ['leer', 'escribir', 'eliminar', 'exportar']
    }
  ],
  planActivo: 'empresarial',
  fechaCreacion: '2024-01-01',
  ultimoAcceso: '2025-06-12'
};

// Funciones utilitarias
export const obtenerEmpresasPorPropietario = (rutPropietario: string): Empresa[] => {
  return empresas.filter(emp => emp.propietarioRut === rutPropietario);
};

export const obtenerTopCreditosFiscales = (cantidad: number = 10): Empresa[] => {
  return empresas
    .sort((a, b) => b.metricas.creditosFiscales - a.metricas.creditosFiscales)
    .slice(0, cantidad);
};

export const obtenerTopImpuestosAPagar = (cantidad: number = 10): Empresa[] => {
  return empresas
    .sort((a, b) => b.metricas.ivaPromedio - a.metricas.ivaPromedio)
    .slice(0, cantidad);
};

export const calcularAhorroTotal = (): number => {
  return empresas.reduce((total, emp) => total + emp.metricas.impuestosAhorrados, 0);
};

export const obtenerEficienciaPromedio = (): number => {
  const suma = empresas.reduce((total, emp) => total + emp.metricas.eficienciaTributaria, 0);
  return Math.round(suma / empresas.length);
};
