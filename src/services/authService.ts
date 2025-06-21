'use client';

import { Usuario, Sesion, Empresa } from '@/types/auth';
import { PERMISOS_POR_ROL } from '@/types/auth';

// Simulación de base de datos de usuarios
const USUARIOS_MOCK: Usuario[] = [
  // Usuario de prueba: SuperAdmin (correo: 1, clave: 1)
  {
    id: 'superadmin-test',
    email: '1',
    nombre: 'Super',
    apellido: 'Administrador',
    rol: 'superadmin',
    licencia: 'superadmin',
    fechaCreacion: new Date('2024-01-01'),
    ultimoAcceso: new Date(),
    activo: true,
    permisos: [...PERMISOS_POR_ROL.superadmin]
  },
  // Usuario de prueba: Contador (correo: 2, clave: 2)
  {
    id: 'contador-test',
    email: '2',
    nombre: 'Carlos',
    apellido: 'Contador',
    rol: 'contador',
    licencia: 'premium',
    fechaCreacion: new Date('2024-02-01'),
    ultimoAcceso: new Date(),
    activo: true,
    permisos: [...PERMISOS_POR_ROL.contador]
  },
  // Usuario de prueba: Cliente/Microempresa (correo: 3, clave: 3)
  {
    id: 'cliente-test',
    email: '3',
    nombre: 'Ana',
    apellido: 'Microempresaria',
    rol: 'cliente_basico',
    empresa: 'empresa-test',
    licencia: 'basico',
    fechaCreacion: new Date('2024-03-01'),
    ultimoAcceso: new Date(),
    activo: true,
    permisos: [...PERMISOS_POR_ROL.cliente_basico]
  },
  // Usuarios originales del sistema
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
    permisos: [...PERMISOS_POR_ROL.superadmin]
  },{
    id: 'cliente-1',
    email: 'cliente@empresa.com',
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'cliente_basico',
    empresa: 'empresa-1',
    licencia: 'premium', // Cambiado de 'basico' a 'premium' para que coincida con la empresa
    fechaCreacion: new Date('2024-06-01'),
    ultimoAcceso: new Date(),
    activo: true,
    permisos: [...PERMISOS_POR_ROL.cliente_basico]
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
    permisos: [...PERMISOS_POR_ROL.admin_empresa]
  }
];

// Simulación de base de datos de empresas
const EMPRESAS_MOCK: Empresa[] = [
  // Empresa de prueba para usuario cliente
  {
    id: 'empresa-test',
    nombre: 'Mi Microempresa Ltda.',
    rut: '77.888.999-0',
    giro: 'Comercio al por menor',
    direccion: 'Calle Los Emprendedores 123, Santiago',
    telefono: '+56 9 8765 4321',
    email: 'contacto@mimicroempresa.cl',
    tipoLicencia: 'basico',
    fechaVencimiento: new Date('2025-06-30'),
    propietarioId: 'superadmin-test',
    administradores: ['cliente-test'],
    contadores: [],
    configuracion: {
      modulosHabilitados: ['facturacion', 'reportes'],
      limitesUsuarios: 2,
      limitesFacturas: 100,
      limitesClientes: 50,
      automatizacionIA: false,
      reportesAvanzados: false,
      integracionesBancarias: false
    },
    activa: true,
    fechaCreacion: new Date('2024-03-01')
  },
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

    // Credenciales de prueba simples
    const credencialesValidas = (
      (email === '1' && password === '1') ||    // SuperAdmin
      (email === '2' && password === '2') ||    // Contador
      (email === '3' && password === '3') ||    // Cliente
      // Credenciales originales del sistema
      (password === 'admin123') ||
      (password === 'cliente123')
    );

    if (!credencialesValidas) {
      return { success: false, error: 'Credenciales incorrectas' };
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
  }  getUsuarioActual(): Usuario | null {
    if (!this.sesionActual) return null;
    
    // TODO: Reemplazar con consulta a BD real
    // const usuario = await db.usuarios.findUnique({ where: { id: this.sesionActual.usuarioId } });
    
    // Fallback temporal a datos mock
    const usuario = USUARIOS_MOCK.find(u => u.id === this.sesionActual!.usuarioId);
    
    if (!usuario) {
      console.warn('⚠️ Usuario no encontrado en la sesión actual');
      this.logout();
      return null;
    }
    
    return usuario;
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

  /**
   * Obtener configuración SII desde localStorage
   */
  getSIIConfig(): { rut?: string; token?: string } | null {
    if (typeof window === 'undefined') return null;
    const data = window.localStorage.getItem('siiConfig');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Guardar configuración SII en localStorage
   */
  saveSIIConfig(config: { rut: string; token: string }): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('siiConfig', JSON.stringify(config));
  }

  /**
   * Eliminar configuración SII de localStorage
   */
  clearSIIConfig(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('siiConfig');
  }
}

// Instancia global de AuthService
const authService = new AuthService();
export default authService;
export { authService };
