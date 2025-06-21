'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Shield, 
  Settings, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Crown,
  Building2,
  Briefcase,
  UserCheck,
  AlertTriangle,
  Check,
  X,
  Clock,
  Key,
  Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PermisoDetallado {
  id: string;
  modulo: string;
  accion: string;
  descripcion: string;
  nivel: 'lectura' | 'escritura' | 'admin' | 'superadmin';
  critico: boolean;
  dependencias: string[];
}

interface UsuarioConPermisos {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'superadmin' | 'admin_empresa' | 'contador' | 'cliente_basico';
  empresa?: string;
  empresasAsignadas?: string[];
  activo: boolean;
  ultimoAcceso: Date;
  permisos: string[];
  configuracionPersonal: {
    limitesFacturas?: number;
    limitesClientes?: number;
    accesoIA?: boolean;
    reportesAvanzados?: boolean;
    integracionesBancarias?: boolean;
  };
}

const PERMISOS_SISTEMA: PermisoDetallado[] = [
  // Facturación
  {
    id: 'facturas.crear',
    modulo: 'Facturación',
    accion: 'Crear Facturas',
    descripcion: 'Permite crear nuevas facturas y documentos tributarios',
    nivel: 'escritura',
    critico: false,
    dependencias: ['clientes.leer']
  },
  {
    id: 'facturas.editar',
    modulo: 'Facturación',
    accion: 'Editar Facturas',
    descripcion: 'Permite modificar facturas no enviadas al SII',
    nivel: 'escritura',
    critico: true,
    dependencias: ['facturas.leer']
  },
  {
    id: 'facturas.anular',
    modulo: 'Facturación',
    accion: 'Anular Facturas',
    descripcion: 'Permite anular facturas enviadas al SII',
    nivel: 'admin',
    critico: true,
    dependencias: ['facturas.leer']
  },
  
  // Clientes
  {
    id: 'clientes.crear',
    modulo: 'Clientes',
    accion: 'Crear Clientes',
    descripcion: 'Permite agregar nuevos clientes al sistema',
    nivel: 'escritura',
    critico: false,
    dependencias: []
  },
  {
    id: 'clientes.editar',
    modulo: 'Clientes',
    accion: 'Editar Clientes',
    descripcion: 'Permite modificar información de clientes',
    nivel: 'escritura',
    critico: false,
    dependencias: ['clientes.leer']
  },
  {
    id: 'clientes.eliminar',
    modulo: 'Clientes',
    accion: 'Eliminar Clientes',
    descripcion: 'Permite eliminar clientes del sistema',
    nivel: 'admin',
    critico: true,
    dependencias: ['clientes.leer']
  },

  // Reportes
  {
    id: 'reportes.basicos',
    modulo: 'Reportes',
    accion: 'Reportes Básicos',
    descripcion: 'Acceso a reportes estándar de ventas y gastos',
    nivel: 'lectura',
    critico: false,
    dependencias: []
  },
  {
    id: 'reportes.avanzados',
    modulo: 'Reportes',
    accion: 'Reportes Avanzados',
    descripcion: 'Acceso a analytics avanzados y predicciones IA',
    nivel: 'escritura',
    critico: false,
    dependencias: ['reportes.basicos']
  },

  // SII
  {
    id: 'sii.configurar',
    modulo: 'SII',
    accion: 'Configurar SII',
    descripcion: 'Permite configurar certificados y conexión con SII',
    nivel: 'admin',
    critico: true,
    dependencias: []
  },
  {
    id: 'sii.enviar',
    modulo: 'SII',
    accion: 'Enviar al SII',
    descripcion: 'Permite enviar documentos tributarios al SII',
    nivel: 'escritura',
    critico: true,
    dependencias: ['sii.configurar']
  },

  // Sistema
  {
    id: 'sistema.usuarios',
    modulo: 'Sistema',
    accion: 'Gestionar Usuarios',
    descripcion: 'Crear, editar y eliminar usuarios del sistema',
    nivel: 'admin',
    critico: true,
    dependencias: []
  },
  {
    id: 'sistema.empresas',
    modulo: 'Sistema',
    accion: 'Gestionar Empresas',
    descripcion: 'Crear y administrar empresas en la plataforma',
    nivel: 'superadmin',
    critico: true,
    dependencias: []
  },
  {
    id: 'sistema.configuracion',
    modulo: 'Sistema',
    accion: 'Configuración Global',
    descripcion: 'Modificar configuraciones del sistema',
    nivel: 'superadmin',
    critico: true,
    dependencias: []
  },

  // IA y Automatización
  {
    id: 'ia.consultas',
    modulo: 'IA',
    accion: 'Consultar IA Fiscal',
    descripcion: 'Hacer consultas al asistente de IA fiscal',
    nivel: 'lectura',
    critico: false,
    dependencias: []
  },
  {
    id: 'ia.automatizacion',
    modulo: 'IA',
    accion: 'Automatización IA',
    descripcion: 'Configurar workflows automáticos con IA',
    nivel: 'escritura',
    critico: false,
    dependencias: ['ia.consultas']
  }
];

const USUARIOS_MOCK: UsuarioConPermisos[] = [
  {
    id: 'superadmin-1',
    email: 'admin@sistema.com',
    nombre: 'Sistema',
    apellido: 'Administrator',
    rol: 'superadmin',
    activo: true,
    ultimoAcceso: new Date(),
    permisos: PERMISOS_SISTEMA.map(p => p.id),
    configuracionPersonal: {}
  },
  {
    id: 'admin-1',
    email: 'gerente@capizapallar.cl',
    nombre: 'María',
    apellido: 'González',
    rol: 'admin_empresa',
    empresa: 'emp-1',
    activo: true,
    ultimoAcceso: new Date(Date.now() - 2 * 60 * 60 * 1000),
    permisos: [
      'facturas.crear', 'facturas.editar', 'facturas.anular',
      'clientes.crear', 'clientes.editar', 
      'reportes.basicos', 'reportes.avanzados',
      'sii.configurar', 'sii.enviar',
      'ia.consultas', 'ia.automatizacion'
    ],
    configuracionPersonal: {
      limitesFacturas: 1000,
      limitesClientes: 500,
      accesoIA: true,
      reportesAvanzados: true,
      integracionesBancarias: true
    }
  },
  {
    id: 'contador-1',
    email: 'contador@servicios.cl',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    rol: 'contador',
    empresasAsignadas: ['emp-1', 'emp-2', 'emp-3'],
    activo: true,
    ultimoAcceso: new Date(Date.now() - 30 * 60 * 1000),
    permisos: [
      'facturas.crear', 'facturas.editar',
      'clientes.crear', 'clientes.editar',
      'reportes.basicos', 'reportes.avanzados',
      'sii.enviar',
      'ia.consultas'
    ],
    configuracionPersonal: {
      limitesFacturas: 5000,
      limitesClientes: 2000,
      accesoIA: true,
      reportesAvanzados: true,
      integracionesBancarias: false
    }
  },
  {
    id: 'cliente-1',
    email: 'propietario@empresa.cl',
    nombre: 'Ana',
    apellido: 'Silva',
    rol: 'cliente_basico',
    empresa: 'emp-2',
    activo: true,
    ultimoAcceso: new Date(Date.now() - 24 * 60 * 60 * 1000),
    permisos: [
      'reportes.basicos',
      'ia.consultas'
    ],
    configuracionPersonal: {
      limitesFacturas: 50,
      limitesClientes: 50,
      accesoIA: false,
      reportesAvanzados: false,
      integracionesBancarias: false
    }
  }
];

export default function CentroControlAcceso() {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioConPermisos[]>(USUARIOS_MOCK);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioConPermisos | null>(null);
  const [filtroRol, setFiltroRol] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState<'usuarios' | 'permisos' | 'auditoria'>('usuarios');

  // Solo SuperAdmin puede acceder a este componente
  if (usuario?.rol !== 'superadmin') {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Acceso Restringido</h3>
          <p className="text-red-600">Solo los SuperAdministradores pueden acceder al Centro de Control de Acceso.</p>
        </div>
      </div>
    );
  }

  const usuariosFiltrados = usuarios.filter(u => {
    const coincideBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           u.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
                           u.email.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincidenFiltro = filtroRol === 'todos' || u.rol === filtroRol;
    
    return coincideBusqueda && coincidenFiltro;
  });

  const togglePermiso = (usuarioId: string, permisoId: string) => {
    setUsuarios(prev => prev.map(u => {
      if (u.id === usuarioId) {
        const permisos = u.permisos.includes(permisoId)
          ? u.permisos.filter(p => p !== permisoId)
          : [...u.permisos, permisoId];
        return { ...u, permisos };
      }
      return u;
    }));
  };

  const getRolIcon = (rol: string) => {
    switch (rol) {
      case 'superadmin': return <Crown className="h-5 w-5" />;
      case 'admin_empresa': return <Building2 className="h-5 w-5" />;
      case 'contador': return <Briefcase className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'superadmin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin_empresa': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contador': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'superadmin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'escritura': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Centro de Control de Acceso</h1>
        </div>
        <p className="text-gray-600">Gestiona usuarios, permisos y configuraciones de seguridad de toda la plataforma</p>
      </div>

      {/* Navegación de Pestañas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'usuarios', label: 'Usuarios', icon: User },
            { id: 'permisos', label: 'Permisos', icon: Key },
            { id: 'auditoria', label: 'Auditoría', icon: Eye }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setVistaActual(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                vistaActual === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Vista de Usuarios */}
      {vistaActual === 'usuarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Filtros y Lista */}
          <div className="lg:col-span-2">
            {/* Controles de Filtro */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar usuarios..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="sm:w-48">
                  <select
                    value={filtroRol}
                    onChange={(e) => setFiltroRol(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="todos">Todos los roles</option>
                    <option value="superadmin">SuperAdmin</option>
                    <option value="admin_empresa">Admin Empresa</option>
                    <option value="contador">Contador</option>
                    <option value="cliente_basico">Cliente</option>
                  </select>
                </div>

                <Button className="sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </div>
            </div>

            {/* Lista de Usuarios */}
            <div className="space-y-3">
              {usuariosFiltrados.map(u => (
                <Card 
                  key={u.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    usuarioSeleccionado?.id === u.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setUsuarioSeleccionado(u)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getRolColor(u.rol)}`}>
                          {getRolIcon(u.rol)}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">{u.nombre} {u.apellido}</h3>
                          <p className="text-sm text-gray-600">{u.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className={getRolColor(u.rol)}>
                              {u.rol.replace('_', ' ')}
                            </Badge>
                            {!u.activo && (
                              <Badge variant="destructive">
                                Inactivo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-sm text-gray-500">
                        <p>Último acceso:</p>
                        <p>{u.ultimoAcceso.toLocaleDateString()}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            u.activo ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <span>{u.activo ? 'Activo' : 'Inactivo'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Panel de Detalles del Usuario */}
          <div>
            {usuarioSeleccionado ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getRolIcon(usuarioSeleccionado.rol)}
                    <span>Detalles del Usuario</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Información Personal</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
                        <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
                        <p><strong>Rol:</strong> {usuarioSeleccionado.rol.replace('_', ' ')}</p>
                        {usuarioSeleccionado.empresa && (
                          <p><strong>Empresa:</strong> {usuarioSeleccionado.empresa}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Configuración Personal</h4>
                      <div className="space-y-2 text-sm">
                        {usuarioSeleccionado.configuracionPersonal.limitesFacturas && (
                          <p><strong>Límite Facturas:</strong> {usuarioSeleccionado.configuracionPersonal.limitesFacturas}</p>
                        )}
                        {usuarioSeleccionado.configuracionPersonal.limitesClientes && (
                          <p><strong>Límite Clientes:</strong> {usuarioSeleccionado.configuracionPersonal.limitesClientes}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span>Acceso IA:</span>
                          <Badge variant={usuarioSeleccionado.configuracionPersonal.accesoIA ? 'default' : 'secondary'}>
                            {usuarioSeleccionado.configuracionPersonal.accesoIA ? 'Sí' : 'No'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Permisos Activos</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {PERMISOS_SISTEMA.map(permiso => (
                          <div key={permiso.id} className="flex items-center justify-between p-2 rounded border">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{permiso.accion}</p>
                              <p className="text-xs text-gray-500">{permiso.modulo}</p>
                            </div>
                            <Switch
                              checked={usuarioSeleccionado.permisos.includes(permiso.id)}
                              onCheckedChange={() => togglePermiso(usuarioSeleccionado.id, permiso.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Lock className="h-4 w-4 mr-1" />
                        Suspender
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Selecciona un usuario para ver sus detalles y configurar permisos</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Vista de Permisos */}
      {vistaActual === 'permisos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estructura de Permisos del Sistema</h3>
            
            {Object.entries(
              PERMISOS_SISTEMA.reduce((acc, permiso) => {
                if (!acc[permiso.modulo]) acc[permiso.modulo] = [];
                acc[permiso.modulo].push(permiso);
                return acc;
              }, {} as Record<string, PermisoDetallado[]>)
            ).map(([modulo, permisos]) => (
              <div key={modulo} className="mb-6">
                <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  {modulo}
                </h4>
                
                <div className="grid gap-3">
                  {permisos.map(permiso => (
                    <div key={permiso.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-medium text-gray-900">{permiso.accion}</h5>
                          <Badge className={getNivelColor(permiso.nivel)}>
                            {permiso.nivel}
                          </Badge>
                          {permiso.critico && (
                            <Badge variant="destructive">
                              Crítico
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{permiso.descripcion}</p>
                        {permiso.dependencias.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>Dependencias:</strong> {permiso.dependencias.join(', ')}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {usuarios.filter(u => u.permisos.includes(permiso.id)).length} usuarios
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vista de Auditoría */}
      {vistaActual === 'auditoria' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registro de Auditoría de Accesos</h3>
            <p className="text-gray-600 mb-6">Próximamente: Logs detallados de accesos, cambios de permisos y actividad del sistema.</p>
            
            <div className="text-center py-12">
              <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Funcionalidad de Auditoría</p>
              <p className="text-gray-400">En desarrollo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
