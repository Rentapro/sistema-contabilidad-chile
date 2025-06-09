'use client';

import { Usuario, Sesion, Empresa } from '@/types/auth';
import { PERMISOS_POR_ROL } from '@/types/auth';

// Simulación de base de datos de usuarios
const USUARIOS_MOCK: Usuario[] = [
  {
    id: 'superadmin-1',
    email: 'admin@contabilidad.pro',
    nombre: 'Administrador',
    apellido: 'Principal',
    rol: 'superadmin',
    licencia: 'superadmin',
    fechaCreacion: new Date('2024-01-01'),
    ultimoAcceso: new Date(),
    activo: true,
    permisos: PERMISOS_POR_ROL.superadmin
  },
  {
    id: 'cliente-1',
    email: 'cliente@empresa.com',
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'cliente_basico',
    empresa: 'empresa-1',
    licencia: 'basico',
    fechaCreacion: new Date('2024-06-01'),
    ultimoAcceso: new Date(),
    activo: true,
    permisos: PERMISOS_POR_ROL.cliente_basico
  },
  {
    id: 'admin-empresa-1',
    email: 'admin@empresademo.cl',
    nombre: 'María',
    apellido: 'González',
    rol: 'admin_empresa',
    empresa: 'empresa-1',
    licencia: 'premium',
    fechaCreacion: new Date('2024-03-01'),
    ultimoAcceso: new Date(),
    activo: true,
    permisos: PERMISOS_POR_ROL.admin_empresa
  }
];

// Simulación de base de datos de empresas
const EMPRESAS_MOCK: Empresa[] = [
  {
    id: 'empresa-1',
    nombre: 'Empresa Demo S.A.',
    rut: '76.123.456-7',
    giro: 'Servicios de consultoría',
    direccion: 'Av. Providencia 1234, Santiago',
    telefono: '+56 2 2234 5678',
    email: 'contacto@empresademo.cl',
    tipoLicencia: 'premium',
    fechaVencimiento: new Date('2025-12-31'),
    propietarioId: 'superadmin-1',
    administradores: ['admin-empresa-1'],
    contadores: [],
    configuracion: {
      modulosHabilitados: ['facturacion', 'reportes', 'clientes', 'proveedores'],
      limitesUsuarios: 10,
      limitesFacturas: 1000,
      limitesClientes: 500,
      automatizacionIA: true,
      reportesAvanzados: true,
      integracionesBancarias: true
    },
    activa: true,
    fechaCreacion: new Date('2024-01-15')
  },
  {
    id: 'empresa-2',
    nombre: 'Pyme Básica Ltda.',
    rut: '76.987.654-3',
    giro: 'Comercio al por menor',
    direccion: 'Calle Comercio 567, Valparaíso',
    telefono: '+56 32 2345 678',
    email: 'info@pymebasica.cl',
    tipoLicencia: 'basico',
    fechaVencimiento: new Date('2025-06-30'),
    propietarioId: 'superadmin-1',
    administradores: [],
    contadores: [],
    configuracion: {
      modulosHabilitados: ['facturacion', 'clientes'],
      limitesUsuarios: 3,
      limitesFacturas: 200,
      limitesClientes: 100,
      automatizacionIA: false,
      reportesAvanzados: false,
      integracionesBancarias: false
    },
    activa: true,
    fechaCreacion: new Date('2024-05-01')
  }
];

class AuthService {
  private sesionActual: Sesion | null = null;

  // Simular login
  async login(email: string, password: string): Promise<{ success: boolean; usuario?: Usuario; error?: string }> {
    // Simulación de verificación
    const usuario = USUARIOS_MOCK.find(u => u.email === email && u.activo);
    
    if (!usuario) {
      return { success: false, error: 'Usuario no encontrado o inactivo' };
    }

    // En producción, aquí verificarías la contraseña hasheada
    if (password !== 'admin123' && password !== 'cliente123') {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    // Crear sesión
    this.sesionActual = {
      usuarioId: usuario.id,
      token: this.generateToken(),
      empresaActual: usuario.empresa,
      permisos: usuario.permisos,
      fechaInicio: new Date(),
      fechaExpiracion: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 horas
    };

    // Actualizar último acceso
    usuario.ultimoAcceso = new Date();

    return { success: true, usuario };
  }

  logout(): void {
    this.sesionActual = null;
  }

  getSesionActual(): Sesion | null {
    return this.sesionActual;
  }

  getUsuarioActual(): Usuario | null {
    if (!this.sesionActual) return null;
    return USUARIOS_MOCK.find(u => u.id === this.sesionActual!.usuarioId) || null;
  }

  tienePermiso(permiso: string): boolean {
    return this.sesionActual?.permisos.includes(permiso) || false;
  }

  esSuperAdmin(): boolean {
    const usuario = this.getUsuarioActual();
    return usuario?.rol === 'superadmin' || false;
  }

  private generateToken(): string {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
  }

  // Gestión de empresas (solo superadmin)
  async crearEmpresa(datosEmpresa: any): Promise<{ success: boolean; empresaId?: string; error?: string }> {
    if (!this.esSuperAdmin()) {
      return { success: false, error: 'Permisos insuficientes' };
    }

    // Simular creación
    const empresaId = 'emp-' + Date.now();
    return { success: true, empresaId };
  }

  // Gestión de usuarios (solo superadmin)
  async crearUsuario(datosUsuario: any): Promise<{ success: boolean; usuarioId?: string; error?: string }> {
    if (!this.esSuperAdmin()) {
      return { success: false, error: 'Permisos insuficientes' };
    }

    // Simular creación
    const usuarioId = 'usr-' + Date.now();
    return { success: true, usuarioId };
  }

  // Funciones para el AuthContext
  async getCurrentSession(): Promise<{ usuario?: Usuario; empresaActual?: Empresa } | null> {
    if (!this.sesionActual) return null;

    const usuario = this.getUsuarioActual();
    if (!usuario) return null;

    let empresaActual: Empresa | undefined;
    if (this.sesionActual.empresaActual) {
      empresaActual = EMPRESAS_MOCK.find(e => e.id === this.sesionActual!.empresaActual);
    }

    return { usuario, empresaActual };
  }

  async getEmpresasGestionadas(superAdminId: string): Promise<Empresa[]> {
    if (!this.esSuperAdmin()) return [];
    
    return EMPRESAS_MOCK.filter(e => e.propietarioId === superAdminId);
  }

  async getEmpresaPorId(empresaId: string): Promise<Empresa | null> {
    return EMPRESAS_MOCK.find(e => e.id === empresaId) || null;
  }

  // Función para cambiar empresa activa (solo superadmin)
  cambiarEmpresaActiva(empresaId: string): boolean {
    if (!this.esSuperAdmin() || !this.sesionActual) return false;

    const empresa = EMPRESAS_MOCK.find(e => e.id === empresaId);
    if (!empresa || empresa.propietarioId !== this.sesionActual.usuarioId) return false;

    this.sesionActual.empresaActual = empresaId;
    return true;
  }
}

export const authService = new AuthService();
