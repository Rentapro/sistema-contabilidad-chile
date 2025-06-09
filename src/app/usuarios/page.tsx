'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Edit, 
  Lock,
  Unlock,
  Mail,
  Phone,
  Activity,
  Settings,
  Search,
  Star,
  Clock,
  Crown
} from 'lucide-react';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: 'admin' | 'contador-senior' | 'contador-junior' | 'asistente' | 'cliente';
  estado: 'activo' | 'inactivo' | 'suspendido';
  fechaCreacion: Date;
  ultimoAcceso: Date;
  avatar?: string;
  especializaciones?: string[];
  clientesAsignados?: string[];
  eficiencia?: number;
  tareasPendientes?: number;
  tareasCompletadas?: number;
}

interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
  nivel: number;
}

interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [filtroRol, setFiltroRol] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Datos iniciales
  useEffect(() => {
    const permisosIniciales: Permiso[] = [
      { id: '1', nombre: 'usuarios.ver', descripcion: 'Ver usuarios', categoria: 'Gestión de Usuarios' },
      { id: '2', nombre: 'usuarios.crear', descripcion: 'Crear usuarios', categoria: 'Gestión de Usuarios' },
      { id: '3', nombre: 'usuarios.editar', descripcion: 'Editar usuarios', categoria: 'Gestión de Usuarios' },
      { id: '4', nombre: 'usuarios.eliminar', descripcion: 'Eliminar usuarios', categoria: 'Gestión de Usuarios' },
      { id: '5', nombre: 'clientes.ver', descripcion: 'Ver clientes', categoria: 'Clientes' },
      { id: '6', nombre: 'clientes.crear', descripcion: 'Crear clientes', categoria: 'Clientes' },
      { id: '7', nombre: 'clientes.editar', descripcion: 'Editar clientes', categoria: 'Clientes' },
      { id: '8', nombre: 'facturas.ver', descripcion: 'Ver facturas', categoria: 'Facturación' },
      { id: '9', nombre: 'facturas.crear', descripcion: 'Crear facturas', categoria: 'Facturación' },
      { id: '10', nombre: 'facturas.aprobar', descripcion: 'Aprobar facturas', categoria: 'Facturación' },
      { id: '11', nombre: 'declaraciones.ver', descripcion: 'Ver declaraciones', categoria: 'Declaraciones' },
      { id: '12', nombre: 'declaraciones.crear', descripcion: 'Crear declaraciones', categoria: 'Declaraciones' },
      { id: '13', nombre: 'reportes.ver', descripcion: 'Ver reportes', categoria: 'Reportes' },
      { id: '14', nombre: 'reportes.exportar', descripcion: 'Exportar reportes', categoria: 'Reportes' },
      { id: '15', nombre: 'configuracion.sistema', descripcion: 'Configuración del sistema', categoria: 'Sistema' }
    ];

    const rolesIniciales: Rol[] = [
      {
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Acceso completo al sistema',
        nivel: 1,
        permisos: permisosIniciales.map(p => p.id)
      },
      {
        id: '2',
        nombre: 'Contador Senior',
        descripcion: 'Contador con experiencia, puede supervisar y aprobar',
        nivel: 2,
        permisos: ['1', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
      },
      {
        id: '3',
        nombre: 'Contador Junior',
        descripcion: 'Contador en formación, operaciones básicas',
        nivel: 3,
        permisos: ['1', '5', '6', '7', '8', '9', '11', '12', '13']
      },
      {
        id: '4',
        nombre: 'Asistente',
        descripcion: 'Asistente administrativo, tareas de apoyo',
        nivel: 4,
        permisos: ['1', '5', '8', '11', '13']
      },
      {
        id: '5',
        nombre: 'Cliente',
        descripcion: 'Cliente con acceso limitado a sus datos',
        nivel: 5,
        permisos: ['8', '13']
      }
    ];

    const usuariosIniciales: Usuario[] = [
      {
        id: '1',
        nombre: 'María',
        apellido: 'González',
        email: 'maria.gonzalez@firma.cl',
        telefono: '+56 9 1234 5678',
        rol: 'admin',
        estado: 'activo',
        fechaCreacion: new Date('2023-01-15'),
        ultimoAcceso: new Date(),
        eficiencia: 95,
        tareasPendientes: 3,
        tareasCompletadas: 127,
        especializaciones: ['Impuestos', 'Auditoría', 'IFRS']
      },
      {
        id: '2',
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        email: 'carlos.rodriguez@firma.cl',
        telefono: '+56 9 2345 6789',
        rol: 'contador-senior',
        estado: 'activo',
        fechaCreacion: new Date('2023-02-20'),
        ultimoAcceso: new Date(Date.now() - 2 * 60 * 60 * 1000),
        eficiencia: 88,
        tareasPendientes: 8,
        tareasCompletadas: 95,
        especializaciones: ['F29', 'F22', 'Nóminas'],
        clientesAsignados: ['ABC S.A.', 'XYZ Ltda.', 'DEF Corp.']
      },
      {
        id: '3',
        nombre: 'Ana',
        apellido: 'López',
        email: 'ana.lopez@firma.cl',
        telefono: '+56 9 3456 7890',
        rol: 'contador-junior',
        estado: 'activo',
        fechaCreacion: new Date('2023-06-10'),
        ultimoAcceso: new Date(Date.now() - 1 * 60 * 60 * 1000),
        eficiencia: 75,
        tareasPendientes: 12,
        tareasCompletadas: 45,
        especializaciones: ['Facturación', 'Conciliaciones'],
        clientesAsignados: ['GHI S.A.', 'JKL Ltda.']
      },
      {
        id: '4',
        nombre: 'Pedro',
        apellido: 'Martínez',
        email: 'pedro.martinez@firma.cl',
        telefono: '+56 9 4567 8901',
        rol: 'asistente',
        estado: 'activo',
        fechaCreacion: new Date('2023-08-01'),
        ultimoAcceso: new Date(Date.now() - 3 * 60 * 60 * 1000),
        eficiencia: 82,
        tareasPendientes: 5,
        tareasCompletadas: 28
      },
      {
        id: '5',
        nombre: 'Laura',
        apellido: 'Silva',
        email: 'laura.silva@cliente.cl',
        telefono: '+56 9 5678 9012',
        rol: 'cliente',
        estado: 'activo',
        fechaCreacion: new Date('2023-09-15'),
        ultimoAcceso: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ];

    setPermisos(permisosIniciales);
    setRoles(rolesIniciales);
    setUsuarios(usuariosIniciales);
  }, []);

  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideBusqueda = 
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincifeRol = filtroRol === 'todos' || usuario.rol === filtroRol;
    const coincifeEstado = filtroEstado === 'todos' || usuario.estado === filtroEstado;
    
    return coincideBusqueda && coincifeRol && coincifeEstado;
  });

  const cambiarEstadoUsuario = (id: string, nuevoEstado: 'activo' | 'inactivo' | 'suspendido') => {
    setUsuarios(prev => 
      prev.map(usuario => 
        usuario.id === id ? { ...usuario, estado: nuevoEstado } : usuario
      )
    );
  };

  const getIconoRol = (rol: string) => {
    switch (rol) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'contador-senior': return <Star className="h-4 w-4 text-blue-600" />;
      case 'contador-junior': return <Users className="h-4 w-4 text-green-600" />;
      case 'asistente': return <Settings className="h-4 w-4 text-purple-600" />;
      case 'cliente': return <Users className="h-4 w-4 text-gray-600" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-gray-100 text-gray-800';
      case 'suspendido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calcularTiempoTranscurrido = (fecha: Date) => {
    const ahora = new Date();
    const diferencia = ahora.getTime() - fecha.getTime();
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    
    if (horas < 1) return 'Hace menos de 1 hora';
    if (horas < 24) return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    
    const dias = Math.floor(horas / 24);
    return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8" />
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 mt-2">
              Administra usuarios, roles y permisos del sistema
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      <Tabs defaultValue="usuarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={filtroRol} onValueChange={setFiltroRol}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los roles</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="contador-senior">Contador Senior</SelectItem>
                    <SelectItem value="contador-junior">Contador Junior</SelectItem>
                    <SelectItem value="asistente">Asistente</SelectItem>
                    <SelectItem value="cliente">Cliente</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="suspendido">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Usuarios */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {usuariosFiltrados.map((usuario) => (
              <Card key={usuario.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={usuario.avatar} />
                        <AvatarFallback>
                          {usuario.nombre[0]}{usuario.apellido[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {usuario.nombre} {usuario.apellido}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getIconoRol(usuario.rol)}
                          <span className="text-sm text-gray-600 capitalize">
                            {usuario.rol.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getColorEstado(usuario.estado)}>
                      {usuario.estado}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {usuario.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {usuario.telefono}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {calcularTiempoTranscurrido(usuario.ultimoAcceso)}
                    </div>
                  </div>

                  {/* Métricas para contadores */}
                  {(usuario.rol === 'contador-senior' || usuario.rol === 'contador-junior') && (
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {usuario.eficiencia}%
                        </div>
                        <div className="text-xs text-gray-500">Eficiencia</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {usuario.tareasPendientes}
                        </div>
                        <div className="text-xs text-gray-500">Pendientes</div>
                      </div>
                    </div>
                  )}

                  {/* Especializaciones */}
                  {usuario.especializaciones && (
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Especializaciones</div>
                      <div className="flex flex-wrap gap-1">
                        {usuario.especializaciones.map((esp, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {esp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setUsuarioSeleccionado(usuario);
                        setModalAbierto(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => 
                        cambiarEstadoUsuario(
                          usuario.id, 
                          usuario.estado === 'activo' ? 'suspendido' : 'activo'
                        )
                      }
                    >
                      {usuario.estado === 'activo' ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid gap-6">
            {roles.map((rol) => (
              <Card key={rol.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {rol.nombre}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{rol.descripcion}</p>
                    </div>
                    <Badge variant="outline">
                      Nivel {rol.nivel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Permisos ({rol.permisos.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {rol.permisos.map((permisoId) => {
                          const permiso = permisos.find(p => p.id === permisoId);
                          return permiso ? (
                            <Badge key={permisoId} variant="secondary" className="text-xs">
                              {permiso.nombre}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar Rol
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="h-4 w-4 mr-1" />
                        Ver Usuarios ({usuarios.filter(u => u.rol === rol.id).length})
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="auditoria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Actividades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    usuario: 'María González',
                    accion: 'Inició sesión',
                    fecha: new Date(),
                    ip: '192.168.1.100'
                  },
                  {
                    usuario: 'Carlos Rodríguez',
                    accion: 'Aprobó factura #001234',
                    fecha: new Date(Date.now() - 30 * 60 * 1000),
                    ip: '192.168.1.101'
                  },
                  {
                    usuario: 'Ana López',
                    accion: 'Creó declaración F29',
                    fecha: new Date(Date.now() - 60 * 60 * 1000),
                    ip: '192.168.1.102'
                  }
                ].map((actividad, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{actividad.usuario}</div>
                        <div className="text-sm text-gray-600">{actividad.accion}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{actividad.fecha.toLocaleString()}</div>
                      <div>IP: {actividad.ip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de edición */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Editar Usuario: {usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellido}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {usuarioSeleccionado && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre</label>
                    <Input defaultValue={usuarioSeleccionado.nombre} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Apellido</label>
                    <Input defaultValue={usuarioSeleccionado.apellido} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input defaultValue={usuarioSeleccionado.email} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rol</label>
                    <Select defaultValue={usuarioSeleccionado.rol}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="contador-senior">Contador Senior</SelectItem>
                        <SelectItem value="contador-junior">Contador Junior</SelectItem>
                        <SelectItem value="asistente">Asistente</SelectItem>
                        <SelectItem value="cliente">Cliente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Estado</label>
                    <Select defaultValue={usuarioSeleccionado.estado}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Guardar Cambios</Button>
                  <Button variant="outline" onClick={() => setModalAbierto(false)}>
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
