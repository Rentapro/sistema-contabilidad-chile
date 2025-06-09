// Sistema de autenticación y roles
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'superadmin' | 'admin_empresa' | 'contador' | 'cliente_basico';
  empresa?: string;
  licencia: 'superadmin' | 'premium' | 'basico' | 'trial';
  fechaCreacion: Date;
  ultimoAcceso: Date;
  activo: boolean;
  permisos: string[];
}

export interface Empresa {
  id: string;
  nombre: string;
  rut: string;
  giro: string;
  direccion: string;
  telefono: string;
  email: string;
  tipoLicencia: 'premium' | 'basico' | 'trial';
  fechaVencimiento: Date;
  propietarioId: string; // ID del superadmin que la gestiona
  administradores: string[]; // IDs de usuarios admin_empresa
  contadores: string[]; // IDs de contadores asignados
  configuracion: EmpresaConfig;
  activa: boolean;
  fechaCreacion: Date;
}

export interface EmpresaConfig {
  modulosHabilitados: string[];
  limitesUsuarios: number;
  limitesFacturas: number;
  limitesClientes: number;
  automatizacionIA: boolean;
  reportesAvanzados: boolean;
  integracionesBancarias: boolean;
}

export interface Sesion {
  usuarioId: string;
  token: string;
  empresaActual?: string;
  permisos: string[];
  fechaInicio: Date;
  fechaExpiracion: Date;
}

// Permisos por rol
export const PERMISOS_POR_ROL = {
  superadmin: [
    'GESTIONAR_EMPRESAS',
    'GESTIONAR_USUARIOS',
    'ACCESO_IA_AVANZADA',
    'DASHBOARD_EJECUTIVO',
    'AUTOMATIZACION_COMPLETA',
    'REPORTES_MULTI_EMPRESA',
    'CONFIGURACION_SISTEMA',
    'FACTURACION_LICENCIAS',
    'AUDITORIA_COMPLETA',
    'BACKUPS_SISTEMA'
  ],
  admin_empresa: [
    'GESTIONAR_USUARIOS_EMPRESA',
    'CONFIGURAR_EMPRESA',
    'REPORTES_EMPRESA',
    'GESTIONAR_CLIENTES',
    'GESTIONAR_PROVEEDORES',
    'FACTURACION',
    'DECLARACIONES'
  ],
  contador: [
    'VER_REPORTES',
    'GESTIONAR_FACTURAS',
    'GESTIONAR_GASTOS',
    'DECLARACIONES',
    'VER_CLIENTES',
    'VER_PROVEEDORES'
  ],
  cliente_basico: [
    'FACTURACION_BASICA',
    'GESTIONAR_CLIENTES_PROPIOS',
    'REPORTES_BASICOS',
    'DECLARACIONES_SIMPLES'
  ]
} as const;
