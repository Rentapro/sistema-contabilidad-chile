'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
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
  Lock,
  Activity,
  History,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Download,
  Upload,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Zap
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
  icono: React.ReactNode;
  categoria: 'core' | 'avanzado' | 'integracion' | 'seguridad';
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
  fechaCreacion: Date;
  permisos: string[];
  configuracionPersonal: {
    limitesFacturas?: number;
    limitesClientes?: number;
    accesoIA?: boolean;
    reportesAvanzados?: boolean;
    integracionesBancarias?: boolean;
  };
  estadisticas: {
    sesionesUltimos30Dias: number;
    facturasCreadas: number;
    reportesGenerados: number;
    ultimaActividad: string;
  };
}

interface EventoAuditoria {
  id: string;
  usuarioId: string;
  accion: string;
  modulo: string;
  detalles: string;
  fecha: Date;
  ip: string;
  exito: boolean;
  impacto: 'bajo' | 'medio' | 'alto';
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
    dependencias: ['clientes.leer'],
    icono: <FileText className="h-4 w-4" />,
    categoria: 'core'
  },
  {
    id: 'facturas.editar',
    modulo: 'Facturación',
    accion: 'Editar Facturas',
    descripcion: 'Permite modificar facturas no enviadas al SII',
    nivel: 'escritura',
    critico: true,
    dependencias: ['facturas.leer'],
    icono: <Edit className="h-4 w-4" />,
    categoria: 'core'
  },
  {
    id: 'facturas.anular',
    modulo: 'Facturación',
    accion: 'Anular Facturas',
    descripcion: 'Permite anular facturas enviadas al SII',
    nivel: 'admin',
    critico: true,
    dependencias: ['facturas.leer'],
    icono: <X className="h-4 w-4" />,
    categoria: 'core'
  },
  {
    id: 'facturas.leer',
    modulo: 'Facturación',
    accion: 'Ver Facturas',
    descripcion: 'Permite visualizar facturas y su estado',
    nivel: 'lectura',
    critico: false,
    dependencias: [],
    icono: <Eye className="h-4 w-4" />,
    categoria: 'core'
  },
  
  // Clientes
  {
    id: 'clientes.crear',
    modulo: 'Clientes',
    accion: 'Crear Clientes',
    descripcion: 'Permite agregar nuevos clientes al sistema',
    nivel: 'escritura',
    critico: false,
    dependencias: [],
    icono: <Plus className="h-4 w-4" />,
    categoria: 'core'
  },
  {
    id: 'clientes.leer',
    modulo: 'Clientes',
    accion: 'Ver Clientes',
    descripcion: 'Permite visualizar información de clientes',
    nivel: 'lectura',
    critico: false,
    dependencias: [],
    icono: <Users className="h-4 w-4" />,
    categoria: 'core'
  },
  {
    id: 'clientes.editar',
    modulo: 'Clientes',
    accion: 'Editar Clientes',
    descripcion: 'Permite modificar información de clientes',
    nivel: 'escritura',
    critico: false,
    dependencias: ['clientes.leer'],
    icono: <Edit className="h-4 w-4" />,
    categoria: 'core'
  },
  
  // Reportes
  {
    id: 'reportes.basicos',
    modulo: 'Reportes',
    accion: 'Reportes Básicos',
    descripcion: 'Permite generar reportes estándar de facturación',
    nivel: 'lectura',
    critico: false,
    dependencias: ['facturas.leer'],
    icono: <BarChart3 className="h-4 w-4" />,
    categoria: 'core'
  },
  {
    id: 'reportes.avanzados',
    modulo: 'Reportes',
    accion: 'Reportes Avanzados',
    descripcion: 'Permite generar reportes consolidados y análisis',
    nivel: 'admin',
    critico: false,
    dependencias: ['reportes.basicos'],
    icono: <BarChart3 className="h-4 w-4" />,
    categoria: 'avanzado'
  },
  
  // Configuración
  {
    id: 'configuracion.empresa',
    modulo: 'Configuración',
    accion: 'Configurar Empresa',
    descripcion: 'Permite modificar datos de la empresa',
    nivel: 'admin',
    critico: true,
    dependencias: [],
    icono: <Building2 className="h-4 w-4" />,
    categoria: 'core'
  },
  {
    id: 'configuracion.usuarios',
    modulo: 'Configuración',
    accion: 'Gestionar Usuarios',
    descripcion: 'Permite crear y modificar usuarios del sistema',
    nivel: 'admin',
    critico: true,
    dependencias: [],
    icono: <User className="h-4 w-4" />,
    categoria: 'seguridad'
  },
  {
    id: 'configuracion.sii',
    modulo: 'Configuración',
    accion: 'Configurar SII',
    descripcion: 'Permite configurar certificados y conexión al SII',
    nivel: 'superadmin',
    critico: true,
    dependencias: [],
    icono: <Shield className="h-4 w-4" />,
    categoria: 'integracion'
  },
  
  // Integraciones
  {
    id: 'ia.asistente',
    modulo: 'IA',
    accion: 'Asistente IA',
    descripcion: 'Permite usar el asistente de inteligencia artificial',
    nivel: 'escritura',
    critico: false,
    dependencias: [],
    icono: <Zap className="h-4 w-4" />,
    categoria: 'avanzado'
  },
  {
    id: 'integraciones.bancarias',
    modulo: 'Integraciones',
    accion: 'Integraciones Bancarias',
    descripcion: 'Permite configurar y usar integraciones bancarias',
    nivel: 'admin',
    critico: false,
    dependencias: [],
    icono: <DollarSign className="h-4 w-4" />,
    categoria: 'integracion'
  }
];

const USUARIOS_DEMO: UsuarioConPermisos[] = [
  {
    id: '1',
    email: 'admin@sistema.cl',
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'superadmin',
    activo: true,
    ultimoAcceso: new Date('2024-01-15T10:30:00'),
    fechaCreacion: new Date('2024-01-01T00:00:00'),
    permisos: PERMISOS_SISTEMA.map(p => p.id),
    configuracionPersonal: {
      limitesFacturas: -1,
      limitesClientes: -1,
      accesoIA: true,
      reportesAvanzados: true,
      integracionesBancarias: true
    },
    estadisticas: {
      sesionesUltimos30Dias: 45,
      facturasCreadas: 234,
      reportesGenerados: 89,
      ultimaActividad: 'Configuró nuevo certificado SII'
    }
  },
  {
    id: '2',
    email: 'contador@empresa.cl',
    nombre: 'María',
    apellido: 'González',
    rol: 'contador',
    empresa: 'Empresa Demo',
    empresasAsignadas: ['empresa1', 'empresa2'],
    activo: true,
    ultimoAcceso: new Date('2024-01-15T09:15:00'),
    fechaCreacion: new Date('2024-01-05T00:00:00'),
    permisos: [
      'facturas.crear', 'facturas.leer', 'facturas.editar',
      'clientes.crear', 'clientes.leer', 'clientes.editar',
      'reportes.basicos', 'reportes.avanzados',
      'ia.asistente'
    ],
    configuracionPersonal: {
      limitesFacturas: 500,
      limitesClientes: 100,
      accesoIA: true,
      reportesAvanzados: true,
      integracionesBancarias: false
    },
    estadisticas: {
      sesionesUltimos30Dias: 28,
      facturasCreadas: 156,
      reportesGenerados: 23,
      ultimaActividad: 'Generó reporte mensual'
    }
  },
  {
    id: '3',
    email: 'cliente@microempresa.cl',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    rol: 'cliente_basico',
    empresa: 'Mi Microempresa',
    activo: true,
    ultimoAcceso: new Date('2024-01-14T16:45:00'),
    fechaCreacion: new Date('2024-01-10T00:00:00'),
    permisos: [
      'facturas.crear', 'facturas.leer',
      'clientes.crear', 'clientes.leer', 'clientes.editar',
      'reportes.basicos'
    ],
    configuracionPersonal: {
      limitesFacturas: 50,
      limitesClientes: 20,
      accesoIA: false,
      reportesAvanzados: false,
      integracionesBancarias: false
    },
    estadisticas: {
      sesionesUltimos30Dias: 12,
      facturasCreadas: 23,
      reportesGenerados: 4,
      ultimaActividad: 'Creó factura #1234'
    }
  }
];

const EVENTOS_AUDITORIA: EventoAuditoria[] = [
  {
    id: '1',
    usuarioId: '1',
    accion: 'Modificó permisos de usuario',
    modulo: 'Configuración',
    detalles: 'Agregó permiso "reportes.avanzados" a María González',
    fecha: new Date('2024-01-15T10:30:00'),
    ip: '192.168.1.100',
    exito: true,
    impacto: 'medio'
  },
  {
    id: '2',
    usuarioId: '2',
    accion: 'Intentó acceder a configuración SII',
    modulo: 'Configuración',
    detalles: 'Acceso denegado - permisos insuficientes',
    fecha: new Date('2024-01-15T09:15:00'),
    ip: '192.168.1.101',
    exito: false,
    impacto: 'alto'
  },
  {
    id: '3',
    usuarioId: '3',
    accion: 'Creó nueva factura',
    modulo: 'Facturación',
    detalles: 'Factura #1234 por $125.000',
    fecha: new Date('2024-01-14T16:45:00'),
    ip: '192.168.1.102',
    exito: true,
    impacto: 'bajo'
  }
];

export default function CentroControlAccesoMejorado() {
  const { usuario: user } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioConPermisos[]>(USUARIOS_DEMO);
  const [permisos] = useState<PermisoDetallado[]>(PERMISOS_SISTEMA);
  const [eventos] = useState<EventoAuditoria[]>(EVENTOS_AUDITORIA);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioConPermisos | null>(null);
  const [vistaActual, setVistaActual] = useState<'usuarios' | 'permisos' | 'auditoria'>('usuarios');
  const [filtros, setFiltros] = useState({
    busqueda: '',
    rol: '',
    estado: '',
    categoria: ''
  });
  const [mostrarModalPermiso, setMostrarModalPermiso] = useState(false);
  const [feedback, setFeedback] = useState<{ mensaje: string; tipo: 'success' | 'error' | 'info' } | null>(null);

  const mostrarFeedback = (mensaje: string, tipo: 'success' | 'error' | 'info') => {
    setFeedback({ mensaje, tipo });
    setTimeout(() => setFeedback(null), 3000);
  };

  const alternarPermiso = (usuarioId: string, permisoId: string) => {
    setUsuarios(prev => prev.map(usuario => {
      if (usuario.id === usuarioId) {
        const tienePermiso = usuario.permisos.includes(permisoId);
        const nuevosPermisos = tienePermiso 
          ? usuario.permisos.filter(p => p !== permisoId)
          : [...usuario.permisos, permisoId];
        
        const permiso = permisos.find(p => p.id === permisoId);
        mostrarFeedback(
          `${tienePermiso ? 'Removido' : 'Agregado'} permiso "${permiso?.accion}" para ${usuario.nombre}`,
          'success'
        );
        
        return { ...usuario, permisos: nuevosPermisos };
      }
      return usuario;
    }));
  };

  const alternarEstadoUsuario = (usuarioId: string) => {
    setUsuarios(prev => prev.map(usuario => {
      if (usuario.id === usuarioId) {
        const nuevoEstado = !usuario.activo;
        mostrarFeedback(
          `Usuario ${usuario.nombre} ${nuevoEstado ? 'activado' : 'desactivado'}`,
          'info'
        );
        return { ...usuario, activo: nuevoEstado };
      }
      return usuario;
    }));
  };

  const getRoleIcon = (rol: string) => {
    switch (rol) {
      case 'superadmin': return <Crown className="h-4 w-4 text-purple-500" />;
      case 'admin_empresa': return <Building2 className="h-4 w-4 text-blue-500" />;
      case 'contador': return <Briefcase className="h-4 w-4 text-green-500" />;
      case 'cliente_basico': return <User className="h-4 w-4 text-orange-500" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'superadmin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin_empresa': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contador': return 'bg-green-100 text-green-800 border-green-200';
      case 'cliente_basico': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'lectura': return 'bg-blue-100 text-blue-800';
      case 'escritura': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-orange-100 text-orange-800';
      case 'superadmin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'core': return 'bg-green-100 text-green-800';
      case 'avanzado': return 'bg-purple-100 text-purple-800';
      case 'integracion': return 'bg-blue-100 text-blue-800';
      case 'seguridad': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case 'alto': return 'bg-red-100 text-red-800';
      case 'medio': return 'bg-orange-100 text-orange-800';
      case 'bajo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchBusqueda = usuario.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                          usuario.email.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const matchRol = !filtros.rol || usuario.rol === filtros.rol;
    const matchEstado = !filtros.estado || 
                       (filtros.estado === 'activo' && usuario.activo) ||
                       (filtros.estado === 'inactivo' && !usuario.activo);
    
    return matchBusqueda && matchRol && matchEstado;
  });

  const permisosFiltrados = permisos.filter(permiso => {
    const matchBusqueda = permiso.accion.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                          permiso.modulo.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const matchCategoria = !filtros.categoria || permiso.categoria === filtros.categoria;
    
    return matchBusqueda && matchCategoria;
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Control de Acceso</h1>
          <p className="text-gray-600 mt-1">
            Gestión avanzada de usuarios, permisos y auditoría de seguridad
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setVistaActual('usuarios')}
            variant={vistaActual === 'usuarios' ? 'default' : 'outline'}
            size="sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Usuarios
          </Button>
          <Button 
            onClick={() => setVistaActual('permisos')}
            variant={vistaActual === 'permisos' ? 'default' : 'outline'}
            size="sm"
          >
            <Shield className="h-4 w-4 mr-2" />
            Permisos
          </Button>
          <Button 
            onClick={() => setVistaActual('auditoria')}
            variant={vistaActual === 'auditoria' ? 'default' : 'outline'}
            size="sm"
          >
            <History className="h-4 w-4 mr-2" />
            Auditoría
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Buscar usuarios, permisos o eventos..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            {vistaActual === 'usuarios' && (
              <>
                <select 
                  value={filtros.rol}
                  onChange={(e) => setFiltros(prev => ({ ...prev, rol: e.target.value }))}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Todos los roles</option>
                  <option value="superadmin">SuperAdmin</option>
                  <option value="admin_empresa">Admin Empresa</option>
                  <option value="contador">Contador</option>
                  <option value="cliente_basico">Cliente</option>
                </select>
                
                <select 
                  value={filtros.estado}
                  onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Todos los estados</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>
              </>
            )}
            
            {vistaActual === 'permisos' && (
              <select 
                value={filtros.categoria}
                onChange={(e) => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Todas las categorías</option>
                <option value="core">Core</option>
                <option value="avanzado">Avanzado</option>
                <option value="integracion">Integración</option>
                <option value="seguridad">Seguridad</option>
              </select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vista de Usuarios */}
      {vistaActual === 'usuarios' && (
        <div className="grid gap-6">
          {usuariosFiltrados.map(usuario => (
            <Card key={usuario.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gray-100">
                      {getRoleIcon(usuario.rol)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {usuario.nombre} {usuario.apellido}
                      </h3>
                      <p className="text-gray-600">{usuario.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getRoleColor(usuario.rol)}>
                          {usuario.rol.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant={usuario.activo ? 'default' : 'secondary'}>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={usuario.activo}
                      onCheckedChange={() => alternarEstadoUsuario(usuario.id)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUsuarioSeleccionado(usuario)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>
                
                {/* Estadísticas del usuario */}
                <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {usuario.estadisticas.sesionesUltimos30Dias}
                    </div>
                    <div className="text-sm text-gray-600">Sesiones (30d)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {usuario.estadisticas.facturasCreadas}
                    </div>
                    <div className="text-sm text-gray-600">Facturas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {usuario.estadisticas.reportesGenerados}
                    </div>
                    <div className="text-sm text-gray-600">Reportes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">Último acceso</div>
                    <div className="text-sm text-gray-600">
                      {usuario.ultimoAcceso.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {/* Configuración personal */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Configuración Personal</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Límite Facturas</span>
                      <Badge variant="outline">
                        {usuario.configuracionPersonal.limitesFacturas === -1 
                          ? 'Ilimitado' 
                          : usuario.configuracionPersonal.limitesFacturas}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Límite Clientes</span>
                      <Badge variant="outline">
                        {usuario.configuracionPersonal.limitesClientes === -1 
                          ? 'Ilimitado' 
                          : usuario.configuracionPersonal.limitesClientes}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Asistente IA</span>
                      <Badge variant={usuario.configuracionPersonal.accesoIA ? 'default' : 'secondary'}>
                        {usuario.configuracionPersonal.accesoIA ? 'Habilitado' : 'Deshabilitado'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium">Reportes Avanzados</span>
                      <Badge variant={usuario.configuracionPersonal.reportesAvanzados ? 'default' : 'secondary'}>
                        {usuario.configuracionPersonal.reportesAvanzados ? 'Habilitado' : 'Deshabilitado'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Última actividad */}
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Última actividad:</span>
                    <span className="text-sm text-yellow-700">{usuario.estadisticas.ultimaActividad}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Vista de Permisos */}
      {vistaActual === 'permisos' && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {['core', 'avanzado', 'integracion', 'seguridad'].map(categoria => {
              const permisosCategoria = permisosFiltrados.filter(p => p.categoria === categoria);
              if (permisosCategoria.length === 0) return null;
              
              return (
                <Card key={categoria} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={getCategoriaColor(categoria)}>
                        {categoria.toUpperCase()}
                      </Badge>
                      <span>Permisos de {categoria}</span>
                      <span className="text-sm text-gray-500">({permisosCategoria.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {permisosCategoria.map(permiso => (
                        <div key={permiso.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-gray-100">
                              {permiso.icono}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">{permiso.accion}</h4>
                                <Badge className={getNivelColor(permiso.nivel)}>
                                  {permiso.nivel}
                                </Badge>
                                {permiso.critico && (
                                  <Badge variant="destructive">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Crítico
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{permiso.descripcion}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Módulo: {permiso.modulo}
                              </p>
                              {permiso.dependencias.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs text-gray-500">Requiere: </span>
                                  {permiso.dependencias.map(dep => (
                                    <Badge key={dep} variant="outline" className="text-xs mr-1">
                                      {permisos.find(p => p.id === dep)?.accion || dep}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              Usuarios con permiso:
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              {usuarios.filter(u => u.permisos.includes(permiso.id)).length}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Vista de Auditoría */}
      {vistaActual === 'auditoria' && (
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Registro de Auditoría
                <Badge variant="outline">{eventos.length} eventos</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventos.map(evento => {
                  const usuario = usuarios.find(u => u.id === evento.usuarioId);
                  
                  return (
                    <div key={evento.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            evento.exito ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {evento.exito ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{evento.accion}</h4>
                              <Badge className={getImpactoColor(evento.impacto)}>
                                {evento.impacto}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{evento.detalles}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Usuario: {usuario?.nombre} {usuario?.apellido}</span>
                              <span>Módulo: {evento.modulo}</span>
                              <span>IP: {evento.ip}</span>
                              <span>Fecha: {evento.fecha.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de edición de usuario */}
      {usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Editar Usuario: {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUsuarioSeleccionado(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre</label>
                    <Input value={usuarioSeleccionado.nombre} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input value={usuarioSeleccionado.email} readOnly />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Permisos del Usuario</h3>
                  <div className="space-y-4">
                    {['core', 'avanzado', 'integracion', 'seguridad'].map(categoria => {
                      const permisosCategoria = permisos.filter(p => p.categoria === categoria);
                      
                      return (
                        <div key={categoria}>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Badge className={getCategoriaColor(categoria)}>
                              {categoria.toUpperCase()}
                            </Badge>
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {permisosCategoria.map(permiso => (
                              <div key={permiso.id} className="flex items-center space-x-2 p-2 border rounded">
                                <Switch
                                  checked={usuarioSeleccionado.permisos.includes(permiso.id)}
                                  onCheckedChange={() => alternarPermiso(usuarioSeleccionado.id, permiso.id)}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    {permiso.icono}
                                    <span className="text-sm font-medium">{permiso.accion}</span>
                                  </div>
                                  <p className="text-xs text-gray-500">{permiso.descripcion}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feedback Toast */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
            feedback.tipo === 'success' ? 'bg-green-500 text-white' :
            feedback.tipo === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {feedback.tipo === 'success' && <CheckCircle2 className="h-5 w-5" />}
            {feedback.tipo === 'error' && <AlertCircle className="h-5 w-5" />}
            {feedback.tipo === 'info' && <AlertCircle className="h-5 w-5" />}
            {feedback.mensaje}
          </div>
        </div>
      )}
    </div>
  );
}
