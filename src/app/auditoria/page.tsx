'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Download, 
  Search,
  User,
  FileText,
  Clock,
  MapPin,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  usuario: string;
  usuarioId: string;
  accion: string;
  modulo: 'usuarios' | 'clientes' | 'facturas' | 'declaraciones' | 'sistema' | 'autenticacion';
  tipo: 'creacion' | 'modificacion' | 'eliminacion' | 'acceso' | 'error' | 'seguridad';
  nivel: 'info' | 'warning' | 'error' | 'critical';
  detalles: Record<string, unknown>;
  ip: string;
  userAgent: string;
  ubicacion?: string;
  exito: boolean;
}

interface AuditoriaSeguridad {
  id: string;
  tipo: 'intento_acceso_fallido' | 'cambio_permisos' | 'acceso_admin' | 'exportacion_datos' | 'configuracion_modificada';
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  descripcion: string;
  usuario: string;
  fecha: Date;
  resuelto: boolean;
  notas?: string;
}

interface EstadisticaActividad {
  periodo: string;
  totalAcciones: number;
  usuarios: number;
  errores: number;
  exportaciones: number;
  cambiosConfiguracion: number;
}

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [auditoriaSeguridad, setAuditoriaSeguridad] = useState<AuditoriaSeguridad[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticaActividad[]>([]);
  const [filtroModulo, setFiltroModulo] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroNivel, setFiltroNivel] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');

  // Datos iniciales
  useEffect(() => {
    const logsIniciales: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(),
        usuario: 'María González',
        usuarioId: '1',
        accion: 'Inicio de sesión exitoso',
        modulo: 'autenticacion',
        tipo: 'acceso',
        nivel: 'info',
        detalles: { metodo: 'email_password' },
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ubicacion: 'Santiago, Chile',
        exito: true
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        usuario: 'Carlos Rodríguez',
        usuarioId: '2',
        accion: 'Aprobación de factura',
        modulo: 'facturas',
        tipo: 'modificacion',
        nivel: 'info',
        detalles: { facturaId: '001234', monto: 2500000 },
        ip: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
        ubicacion: 'Valparaíso, Chile',
        exito: true
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        usuario: 'Ana López',
        usuarioId: '3',
        accion: 'Creación de declaración F29',
        modulo: 'declaraciones',
        tipo: 'creacion',
        nivel: 'info',
        detalles: { clienteId: 'ABC123', periodo: '2024-01' },
        ip: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ubicacion: 'Concepción, Chile',
        exito: true
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        usuario: 'Sistema',
        usuarioId: 'system',
        accion: 'Error en procesamiento automático',
        modulo: 'sistema',
        tipo: 'error',
        nivel: 'error',
        detalles: { error: 'Timeout en conexión SII', codigo: 'SII_TIMEOUT' },
        ip: '127.0.0.1',
        userAgent: 'Sistema Interno',
        exito: false
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        usuario: 'Desconocido',
        usuarioId: 'unknown',
        accion: 'Intento de acceso fallido',
        modulo: 'autenticacion',
        tipo: 'seguridad',
        nivel: 'warning',
        detalles: { intentos: 3, email: 'admin@fake.com' },
        ip: '203.0.113.45',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
        ubicacion: 'IP Externa',
        exito: false
      }
    ];

    const auditoriaIniciales: AuditoriaSeguridad[] = [
      {
        id: '1',
        tipo: 'intento_acceso_fallido',
        severidad: 'media',
        descripcion: 'Múltiples intentos de acceso fallidos desde IP externa',
        usuario: 'Desconocido',
        fecha: new Date(Date.now() - 60 * 60 * 1000),
        resuelto: false
      },
      {
        id: '2',
        tipo: 'acceso_admin',
        severidad: 'alta',
        descripcion: 'Acceso administrativo fuera del horario laboral',
        usuario: 'María González',
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        resuelto: true,
        notas: 'Acceso autorizado para mantenimiento de emergencia'
      },
      {
        id: '3',
        tipo: 'exportacion_datos',
        severidad: 'media',
        descripcion: 'Exportación masiva de datos de clientes',
        usuario: 'Carlos Rodríguez',
        fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        resuelto: true,
        notas: 'Exportación autorizada para auditoría externa'
      }
    ];

    const estadisticasIniciales: EstadisticaActividad[] = [
      {
        periodo: 'Hoy',
        totalAcciones: 142,
        usuarios: 8,
        errores: 2,
        exportaciones: 3,
        cambiosConfiguracion: 1
      },
      {
        periodo: 'Ayer',
        totalAcciones: 238,
        usuarios: 12,
        errores: 1,
        exportaciones: 7,
        cambiosConfiguracion: 0
      },
      {
        periodo: 'Esta semana',
        totalAcciones: 1456,
        usuarios: 15,
        errores: 8,
        exportaciones: 24,
        cambiosConfiguracion: 3
      },
      {
        periodo: 'Este mes',
        totalAcciones: 5832,
        usuarios: 18,
        errores: 23,
        exportaciones: 89,
        cambiosConfiguracion: 12
      }
    ];

    setLogs(logsIniciales);
    setAuditoriaSeguridad(auditoriaIniciales);
    setEstadisticas(estadisticasIniciales);
  }, []);

  const logsFiltrados = logs.filter(log => {
    const coincideBusqueda = 
      log.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      log.accion.toLowerCase().includes(busqueda.toLowerCase()) ||
      log.ip.includes(busqueda);
    
    const coincifeModulo = filtroModulo === 'todos' || log.modulo === filtroModulo;
    const coincideTipo = filtroTipo === 'todos' || log.tipo === filtroTipo;
    const coincifeNivel = filtroNivel === 'todos' || log.nivel === filtroNivel;
    
    return coincideBusqueda && coincifeModulo && coincideTipo && coincifeNivel;
  });

  const resolverIncidente = (id: string) => {
    setAuditoriaSeguridad(prev =>
      prev.map(item =>
        item.id === id ? { ...item, resuelto: true } : item
      )
    );
  };

  const exportarLogs = () => {
    // Simular exportación
    const data = logsFiltrados.map(log => ({
      Fecha: log.timestamp.toISOString(),
      Usuario: log.usuario,
      Acción: log.accion,
      Módulo: log.modulo,
      Tipo: log.tipo,
      Nivel: log.nivel,
      IP: log.ip,
      Éxito: log.exito ? 'Sí' : 'No'
    }));
    
    console.log('Exportando logs:', data);
    // Aquí iría la lógica real de exportación
  };

  const getIconoModulo = (modulo: string) => {
    switch (modulo) {
      case 'usuarios': return <User className="h-4 w-4" />;
      case 'clientes': return <User className="h-4 w-4" />;
      case 'facturas': return <FileText className="h-4 w-4" />;
      case 'declaraciones': return <FileText className="h-4 w-4" />;
      case 'sistema': return <Settings className="h-4 w-4" />;
      case 'autenticacion': return <Lock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getColorNivel = (nivel: string) => {
    switch (nivel) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getColorSeveridad = (severidad: string) => {
    switch (severidad) {
      case 'baja': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'critica': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Auditoría y Seguridad
            </h1>
            <p className="text-gray-600 mt-2">
              Monitoreo de actividades y seguridad del sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportarLogs} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Logs
            </Button>
            <Button>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Generar Reporte
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="actividad" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="actividad">Actividad</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="actividad" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar en logs..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={filtroModulo} onValueChange={setFiltroModulo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los módulos</SelectItem>
                    <SelectItem value="usuarios">Usuarios</SelectItem>
                    <SelectItem value="clientes">Clientes</SelectItem>
                    <SelectItem value="facturas">Facturas</SelectItem>
                    <SelectItem value="declaraciones">Declaraciones</SelectItem>
                    <SelectItem value="sistema">Sistema</SelectItem>
                    <SelectItem value="autenticacion">Autenticación</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="creacion">Creación</SelectItem>
                    <SelectItem value="modificacion">Modificación</SelectItem>
                    <SelectItem value="eliminacion">Eliminación</SelectItem>
                    <SelectItem value="acceso">Acceso</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="seguridad">Seguridad</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroNivel} onValueChange={setFiltroNivel}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los niveles</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Registro de Actividades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logsFiltrados.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          {getIconoModulo(log.modulo)}
                          {log.exito ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{log.accion}</span>
                            <Badge className={getColorNivel(log.nivel)}>
                              {log.nivel}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {log.modulo}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {log.usuario}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {log.timestamp.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {log.ip} - {log.ubicacion}
                              </span>
                            </div>
                            {log.detalles && (
                              <div className="text-xs bg-gray-100 p-2 rounded">
                                <pre>{JSON.stringify(log.detalles, null, 2)}</pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Incidentes de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditoriaSeguridad.map((incidente) => (
                    <div key={incidente.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{incidente.descripcion}</h4>
                            <Badge className={getColorSeveridad(incidente.severidad)}>
                              {incidente.severidad}
                            </Badge>
                            {incidente.resuelto ? (
                              <Badge className="bg-green-100 text-green-800">
                                Resuelto
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">
                                Pendiente
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Usuario: {incidente.usuario}</div>
                            <div>Fecha: {incidente.fecha.toLocaleString()}</div>
                            <div>Tipo: {incidente.tipo.replace('_', ' ')}</div>
                            {incidente.notas && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
                                Notas: {incidente.notas}
                              </div>
                            )}
                          </div>
                        </div>
                        {!incidente.resuelto && (
                          <Button 
                            size="sm" 
                            onClick={() => resolverIncidente(incidente.id)}
                          >
                            Resolver
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {estadisticas.map((stat) => (
              <Card key={stat.periodo}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{stat.periodo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Acciones</span>
                    <span className="font-bold text-blue-600">{stat.totalAcciones}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Usuarios Activos</span>
                    <span className="font-bold text-green-600">{stat.usuarios}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Errores</span>
                    <span className="font-bold text-red-600">{stat.errores}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Exportaciones</span>
                    <span className="font-bold text-orange-600">{stat.exportaciones}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Config. Cambios</span>
                    <span className="font-bold text-purple-600">{stat.cambiosConfiguracion}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tendencias de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Gráfico de tendencias (placeholder)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Auditoría</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Retención de Logs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Logs de Actividad (días)
                    </label>
                    <Input defaultValue="90" type="number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Logs de Seguridad (días)
                    </label>
                    <Input defaultValue="365" type="number" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Notificaciones de Seguridad</h4>
                <div className="space-y-3">
                  {[
                    'Intentos de acceso fallidos (>3)',
                    'Acceso administrativo fuera de horario',
                    'Exportación masiva de datos',
                    'Cambios en configuración crítica',
                    'Errores de sistema críticos'
                  ].map((config, index) => (
                    <label key={index} className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">{config}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Backup de Logs</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Backup automático diario</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Compresión de logs antiguos</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Envío a almacenamiento externo</span>
                  </label>
                </div>
              </div>

              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
