'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  BellRing,
  Mail,
  MessageSquare,
  Smartphone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Clock,
  DollarSign,
  FileText,
  Users,
  Building2,
  TrendingUp,
  Zap,
  Settings,
  Plus,
  X,
  Edit,
  Trash2,
  Filter,
  Send,
  Pause,
  Play,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  Megaphone,
  History,
  RefreshCw,
  BarChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TipoNotificacion {
  id: string;
  categoria: 'tributario' | 'financiero' | 'operacional' | 'sistema' | 'marketing';
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
  prioridad: 'alta' | 'media' | 'baja';
  canales: ('email' | 'push' | 'sms' | 'sistema')[];
  roles: ('superadmin' | 'admin_empresa' | 'contador' | 'cliente_basico')[];
  frecuencia: 'inmediata' | 'diaria' | 'semanal' | 'mensual';
  activa: boolean;
  trigger: string;
  plantilla: string;
  configuracion: {
    anticipacion?: number; // días
    limite?: number; // cantidad
    horario?: string; // formato HH:MM
    dias?: string[]; // días de la semana
  };
}

interface NotificacionPersonalizada {
  id: string;
  usuarioId: string;
  tipoNotificacionId: string;
  configuracion: {
    email: boolean;
    push: boolean;
    sms: boolean;
    sistema: boolean;
    frecuencia: 'inmediata' | 'diaria' | 'semanal' | 'mensual';
    horario: string;
    silenciar: boolean;
    palabrasClave: string[];
  };
  filtros: {
    montoMinimo?: number;
    empresas?: string[];
    clientes?: string[];
    categorias?: string[];
  };
  estadisticas: {
    enviadas: number;
    abiertas: number;
    clickeadas: number;
    ultimoEnvio: Date | null;
  };
  activa: boolean;
  fechaCreacion: Date;
}

interface NotificacionEnviada {
  id: string;
  usuarioId: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  canal: 'email' | 'push' | 'sms' | 'sistema';
  estado: 'enviado' | 'entregado' | 'leido' | 'fallido';
  fecha: Date;
  metadata: {
    facturaId?: string;
    clienteId?: string;
    monto?: number;
    vencimiento?: Date;
  };
}

const TIPOS_NOTIFICACION: TipoNotificacion[] = [
  // Tributarias
  {
    id: 'vencimiento-declaracion',
    categoria: 'tributario',
    titulo: 'Vencimiento de Declaraciones',
    descripcion: 'Alertas sobre vencimientos de declaraciones tributarias',
    icono: <Calendar className="h-5 w-5" />,
    prioridad: 'alta',
    canales: ['email', 'push', 'sms'],
    roles: ['admin_empresa', 'contador'],
    frecuencia: 'inmediata',
    activa: true,
    trigger: 'fecha_vencimiento',
    plantilla: 'Su declaración {tipo} vence el {fecha}. Recuerde cumplir con sus obligaciones tributarias.',
    configuracion: {
      anticipacion: 7,
      horario: '09:00'
    }
  },
  {
    id: 'actualizacion-sii',
    categoria: 'tributario',
    titulo: 'Actualizaciones del SII',
    descripcion: 'Cambios en normativas y procedimientos del SII',
    icono: <AlertTriangle className="h-5 w-5" />,
    prioridad: 'media',
    canales: ['email', 'sistema'],
    roles: ['admin_empresa', 'contador'],
    frecuencia: 'inmediata',
    activa: true,
    trigger: 'actualizacion_normativa',
    plantilla: 'Nueva actualización del SII: {titulo}. {descripcion}',
    configuracion: {}
  },
  
  // Financieras
  {
    id: 'facturas-vencidas',
    categoria: 'financiero',
    titulo: 'Facturas Vencidas',
    descripcion: 'Alertas sobre facturas por cobrar vencidas',
    icono: <DollarSign className="h-5 w-5" />,
    prioridad: 'alta',
    canales: ['email', 'push'],
    roles: ['admin_empresa', 'contador'],
    frecuencia: 'diaria',
    activa: true,
    trigger: 'factura_vencida',
    plantilla: 'Tiene {cantidad} facturas vencidas por un total de ${monto}.',
    configuracion: {
      horario: '08:00',
      limite: 5
    }
  },
  {
    id: 'flujo-caja-bajo',
    categoria: 'financiero',
    titulo: 'Flujo de Caja Bajo',
    descripcion: 'Alerta cuando el flujo de caja está por debajo del límite',
    icono: <TrendingUp className="h-5 w-5" />,
    prioridad: 'alta',
    canales: ['email', 'push', 'sms'],
    roles: ['admin_empresa'],
    frecuencia: 'inmediata',
    activa: true,
    trigger: 'flujo_caja_limite',
    plantilla: 'Su flujo de caja está por debajo del límite establecido: ${monto}',
    configuracion: {}
  },
  {
    id: 'metas-facturacion',
    categoria: 'financiero',
    titulo: 'Metas de Facturación',
    descripcion: 'Progreso hacia las metas de facturación mensual',
    icono: <Target className="h-5 w-5" />,
    prioridad: 'media',
    canales: ['email', 'sistema'],
    roles: ['admin_empresa', 'contador'],
    frecuencia: 'semanal',
    activa: true,
    trigger: 'meta_facturacion',
    plantilla: 'Progreso de facturación: {porcentaje}% de la meta mensual (${actual} de ${meta})',
    configuracion: {
      horario: '09:00',
      dias: ['lunes']
    }
  },
  
  // Operacionales
  {
    id: 'nuevos-clientes',
    categoria: 'operacional',
    titulo: 'Nuevos Clientes',
    descripcion: 'Notificaciones sobre nuevos clientes registrados',
    icono: <Users className="h-5 w-5" />,
    prioridad: 'media',
    canales: ['email', 'push'],
    roles: ['admin_empresa', 'contador'],
    frecuencia: 'inmediata',
    activa: true,
    trigger: 'cliente_nuevo',
    plantilla: 'Nuevo cliente registrado: {nombre} - {email}',
    configuracion: {}
  },
  {
    id: 'facturas-creadas',
    categoria: 'operacional',
    titulo: 'Facturas Creadas',
    descripcion: 'Resumen de facturas creadas diariamente',
    icono: <FileText className="h-5 w-5" />,
    prioridad: 'baja',
    canales: ['email'],
    roles: ['admin_empresa'],
    frecuencia: 'diaria',
    activa: false,
    trigger: 'resumen_facturas',
    plantilla: 'Resumen del día: {cantidad} facturas creadas por ${total}',
    configuracion: {
      horario: '18:00'
    }
  },
  
  // Sistema
  {
    id: 'mantenimiento-programado',
    categoria: 'sistema',
    titulo: 'Mantenimiento Programado',
    descripcion: 'Notificaciones sobre mantenimientos del sistema',
    icono: <Settings className="h-5 w-5" />,
    prioridad: 'media',
    canales: ['email', 'push', 'sistema'],
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico'],
    frecuencia: 'inmediata',
    activa: true,
    trigger: 'mantenimiento',
    plantilla: 'Mantenimiento programado para {fecha} de {hora_inicio} a {hora_fin}',
    configuracion: {
      anticipacion: 3
    }
  },
  {
    id: 'actualizaciones-sistema',
    categoria: 'sistema',
    titulo: 'Actualizaciones del Sistema',
    descripcion: 'Nuevas funcionalidades y mejoras',
    icono: <Sparkles className="h-5 w-5" />,
    prioridad: 'baja',
    canales: ['email', 'sistema'],
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico'],
    frecuencia: 'inmediata',
    activa: true,
    trigger: 'actualizacion_sistema',
    plantilla: 'Nueva actualización disponible: {titulo}. {descripcion}',
    configuracion: {}
  },
  
  // Marketing
  {
    id: 'tips-uso',
    categoria: 'marketing',
    titulo: 'Tips de Uso',
    descripcion: 'Consejos para aprovechar mejor el sistema',
    icono: <Megaphone className="h-5 w-5" />,
    prioridad: 'baja',
    canales: ['email', 'sistema'],
    roles: ['admin_empresa', 'contador', 'cliente_basico'],
    frecuencia: 'semanal',
    activa: true,
    trigger: 'tip_semanal',
    plantilla: 'Tip de la semana: {titulo}. {descripcion}',
    configuracion: {
      horario: '10:00',
      dias: ['miércoles']
    }
  },
  {
    id: 'funcionalidades-premium',
    categoria: 'marketing',
    titulo: 'Funcionalidades Premium',
    descripcion: 'Promoción de funcionalidades premium',
    icono: <Star className="h-5 w-5" />,
    prioridad: 'baja',
    canales: ['email'],
    roles: ['cliente_basico'],
    frecuencia: 'mensual',
    activa: true,
    trigger: 'promocion_premium',
    plantilla: 'Descubre las funcionalidades premium: {titulo}. {descripcion}',
    configuracion: {
      horario: '11:00',
      dias: ['lunes']
    }
  }
];

const NOTIFICACIONES_DEMO: NotificacionEnviada[] = [
  {
    id: '1',
    usuarioId: '2',
    tipo: 'vencimiento-declaracion',
    titulo: 'Vencimiento Declaración F29',
    mensaje: 'Su declaración F29 vence el 12 de febrero. Recuerde cumplir con sus obligaciones tributarias.',
    canal: 'email',
    estado: 'leido',
    fecha: new Date('2024-01-15T09:00:00'),
    metadata: {
      vencimiento: new Date('2024-02-12')
    }
  },
  {
    id: '2',
    usuarioId: '3',
    tipo: 'facturas-vencidas',
    titulo: 'Facturas Vencidas',
    mensaje: 'Tiene 3 facturas vencidas por un total de $450.000.',
    canal: 'push',
    estado: 'entregado',
    fecha: new Date('2024-01-15T08:00:00'),
    metadata: {
      monto: 450000
    }
  },
  {
    id: '3',
    usuarioId: '1',
    tipo: 'actualizacion-sii',
    titulo: 'Nueva Normativa SII',
    mensaje: 'Nueva actualización del SII: Cambios en formato de facturación electrónica.',
    canal: 'sistema',
    estado: 'enviado',
    fecha: new Date('2024-01-14T16:30:00'),
    metadata: {}
  }
];

export default function NotificacionesPersonalizadasMejorado() {
  const { usuario: user } = useAuth();
  const [tiposNotificacion] = useState<TipoNotificacion[]>(TIPOS_NOTIFICACION);
  const [notificacionesUsuario, setNotificacionesUsuario] = useState<NotificacionPersonalizada[]>([]);
  const [historialNotificaciones] = useState<NotificacionEnviada[]>(NOTIFICACIONES_DEMO);
  const [vistaActual, setVistaActual] = useState<'configuracion' | 'historial' | 'estadisticas'>('configuracion');
  const [categoriaActiva, setCategoriaActiva] = useState<string>('');
  const [notificacionEditando, setNotificacionEditando] = useState<TipoNotificacion | null>(null);
  const [feedback, setFeedback] = useState<{ mensaje: string; tipo: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (!user) return;

    // Cargar configuraciones personalizadas del usuario
    const configuraciones = localStorage.getItem(`notificaciones_${user.id}`);
    if (configuraciones) {
      setNotificacionesUsuario(JSON.parse(configuraciones));
    } else {
      // Configuración por defecto basada en el rol
      const configuracionDefault = tiposNotificacion
        .filter(tipo => tipo.roles.includes(user.rol))
        .map(tipo => ({
          id: `${user.id}-${tipo.id}`,
          usuarioId: user.id,
          tipoNotificacionId: tipo.id,
          configuracion: {
            email: tipo.canales.includes('email'),
            push: tipo.canales.includes('push'),
            sms: false, // SMS deshabilitado por defecto
            sistema: tipo.canales.includes('sistema'),
            frecuencia: tipo.frecuencia,
            horario: tipo.configuracion.horario || '09:00',
            silenciar: false,
            palabrasClave: []
          },
          filtros: {},
          estadisticas: {
            enviadas: 0,
            abiertas: 0,
            clickeadas: 0,
            ultimoEnvio: null
          },
          activa: tipo.activa,
          fechaCreacion: new Date()
        }));
      
      setNotificacionesUsuario(configuracionDefault);
      localStorage.setItem(`notificaciones_${user.id}`, JSON.stringify(configuracionDefault));
    }
  }, [user, tiposNotificacion]);

  const mostrarFeedback = (mensaje: string, tipo: 'success' | 'error' | 'info') => {
    setFeedback({ mensaje, tipo });
    setTimeout(() => setFeedback(null), 3000);
  };

  const actualizarConfiguracion = (tipoId: string, campo: string, valor: any) => {
    setNotificacionesUsuario(prev => {
      const nuevas = prev.map(notif => {
        if (notif.tipoNotificacionId === tipoId) {
          return {
            ...notif,
            configuracion: {
              ...notif.configuracion,
              [campo]: valor
            }
          };
        }
        return notif;
      });
      
      localStorage.setItem(`notificaciones_${user?.id}`, JSON.stringify(nuevas));
      return nuevas;
    });
    
    mostrarFeedback('Configuración actualizada', 'success');
  };

  const alternarNotificacion = (tipoId: string) => {
    setNotificacionesUsuario(prev => {
      const nuevas = prev.map(notif => {
        if (notif.tipoNotificacionId === tipoId) {
          return { ...notif, activa: !notif.activa };
        }
        return notif;
      });
      
      localStorage.setItem(`notificaciones_${user?.id}`, JSON.stringify(nuevas));
      return nuevas;
    });
  };

  const obtenerConfiguracion = (tipoId: string) => {
    return notificacionesUsuario.find(n => n.tipoNotificacionId === tipoId);
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'tributario': return 'bg-red-100 text-red-800 border-red-200';
      case 'financiero': return 'bg-green-100 text-green-800 border-green-200';
      case 'operacional': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sistema': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'marketing': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-500 text-white';
      case 'media': return 'bg-yellow-500 text-white';
      case 'baja': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'leido': return 'bg-green-100 text-green-800';
      case 'entregado': return 'bg-blue-100 text-blue-800';
      case 'enviado': return 'bg-yellow-100 text-yellow-800';
      case 'fallido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tiposFiltrados = tiposNotificacion.filter(tipo => {
    if (!user) return false;
    const cumpleRol = tipo.roles.includes(user.rol);
    const cumpleCategoria = !categoriaActiva || tipo.categoria === categoriaActiva;
    return cumpleRol && cumpleCategoria;
  });

  const estadisticasGlobales = {
    totalEnviadas: historialNotificaciones.length,
    leidas: historialNotificaciones.filter(n => n.estado === 'leido').length,
    entregadas: historialNotificaciones.filter(n => n.estado === 'entregado').length,
    fallidas: historialNotificaciones.filter(n => n.estado === 'fallido').length
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notificaciones Personalizadas</h1>
          <p className="text-gray-600 mt-1">
            Configura cómo y cuándo quieres recibir notificaciones importantes
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setVistaActual('configuracion')}
            variant={vistaActual === 'configuracion' ? 'default' : 'outline'}
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
          <Button 
            onClick={() => setVistaActual('historial')}
            variant={vistaActual === 'historial' ? 'default' : 'outline'}
            size="sm"
          >
            <History className="h-4 w-4 mr-2" />
            Historial
          </Button>          <Button 
            onClick={() => setVistaActual('estadisticas')}
            variant={vistaActual === 'estadisticas' ? 'default' : 'outline'}
            size="sm"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Estadísticas
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{estadisticasGlobales.totalEnviadas}</div>
              <div className="text-sm text-gray-600">Total Enviadas</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{estadisticasGlobales.leidas}</div>
              <div className="text-sm text-gray-600">Leídas</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{estadisticasGlobales.entregadas}</div>
              <div className="text-sm text-gray-600">Entregadas</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{estadisticasGlobales.fallidas}</div>
              <div className="text-sm text-gray-600">Fallidas</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Vista de Configuración */}
      {vistaActual === 'configuracion' && (
        <div className="space-y-6">
          {/* Filtros de categoría */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Filtrar por categoría:</span>
                <Button
                  variant={categoriaActiva === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoriaActiva('')}
                >
                  Todas
                </Button>
                {['tributario', 'financiero', 'operacional', 'sistema', 'marketing'].map(categoria => (
                  <Button
                    key={categoria}
                    variant={categoriaActiva === categoria ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoriaActiva(categoria)}
                  >
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lista de notificaciones */}
          <div className="space-y-4">
            {tiposFiltrados.map(tipo => {
              const configuracion = obtenerConfiguracion(tipo.id);
              if (!configuracion) return null;

              return (
                <Card key={tipo.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-gray-100">
                          {tipo.icono}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{tipo.titulo}</h3>
                            <Badge className={getCategoriaColor(tipo.categoria)}>
                              {tipo.categoria}
                            </Badge>
                            <Badge className={getPrioridadColor(tipo.prioridad)}>
                              {tipo.prioridad}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{tipo.descripcion}</p>
                          
                          <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <p className="text-sm text-gray-700 font-medium">Plantilla:</p>
                            <p className="text-sm text-gray-600 italic">{tipo.plantilla}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={configuracion.activa}
                          onCheckedChange={() => alternarNotificacion(tipo.id)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNotificacionEditando(tipo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {configuracion.activa && (
                      <div className="space-y-4 border-t pt-4">
                        {/* Canales */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Canales de notificación</h4>
                          <div className="grid grid-cols-4 gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={configuracion.configuracion.email}
                                onCheckedChange={(checked) => actualizarConfiguracion(tipo.id, 'email', checked)}
                              />
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">Email</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={configuracion.configuracion.push}
                                onCheckedChange={(checked) => actualizarConfiguracion(tipo.id, 'push', checked)}
                              />
                              <Smartphone className="h-4 w-4" />
                              <span className="text-sm">Push</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={configuracion.configuracion.sms}
                                onCheckedChange={(checked) => actualizarConfiguracion(tipo.id, 'sms', checked)}
                              />
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-sm">SMS</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={configuracion.configuracion.sistema}
                                onCheckedChange={(checked) => actualizarConfiguracion(tipo.id, 'sistema', checked)}
                              />
                              <Bell className="h-4 w-4" />
                              <span className="text-sm">Sistema</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Configuración de timing */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Frecuencia</label>
                            <select 
                              value={configuracion.configuracion.frecuencia}
                              onChange={(e) => actualizarConfiguracion(tipo.id, 'frecuencia', e.target.value)}
                              className="mt-1 w-full px-3 py-2 border rounded-md"
                            >
                              <option value="inmediata">Inmediata</option>
                              <option value="diaria">Diaria</option>
                              <option value="semanal">Semanal</option>
                              <option value="mensual">Mensual</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Horario</label>
                            <Input
                              type="time"
                              value={configuracion.configuracion.horario}
                              onChange={(e) => actualizarConfiguracion(tipo.id, 'horario', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        {/* Estadísticas */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Estadísticas</h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-blue-700">Enviadas:</span>
                              <span className="ml-2 font-semibold">{configuracion.estadisticas.enviadas}</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Abiertas:</span>
                              <span className="ml-2 font-semibold">{configuracion.estadisticas.abiertas}</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Último envío:</span>
                              <span className="ml-2 font-semibold">
                                {configuracion.estadisticas.ultimoEnvio 
                                  ? configuracion.estadisticas.ultimoEnvio.toLocaleDateString()
                                  : 'Nunca'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Vista de Historial */}
      {vistaActual === 'historial' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historial de Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historialNotificaciones.map(notificacion => (
                <div key={notificacion.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Bell className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{notificacion.titulo}</h4>
                          <Badge className={getEstadoColor(notificacion.estado)}>
                            {notificacion.estado}
                          </Badge>
                          <Badge variant="outline">
                            {notificacion.canal}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notificacion.mensaje}</p>
                        <div className="text-xs text-gray-500">
                          {notificacion.fecha.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vista de Estadísticas */}
      {vistaActual === 'estadisticas' && (
        <div className="grid gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Estadísticas Detalladas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Por Canal</h3>
                  <div className="space-y-3">
                    {['email', 'push', 'sms', 'sistema'].map(canal => {
                      const cantidad = historialNotificaciones.filter(n => n.canal === canal).length;
                      const porcentaje = estadisticasGlobales.totalEnviadas > 0 
                        ? Math.round((cantidad / estadisticasGlobales.totalEnviadas) * 100)
                        : 0;
                      
                      return (
                        <div key={canal} className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{canal}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${porcentaje}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{cantidad}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Por Estado</h3>
                  <div className="space-y-3">
                    {['leido', 'entregado', 'enviado', 'fallido'].map(estado => {
                      const cantidad = historialNotificaciones.filter(n => n.estado === estado).length;
                      const porcentaje = estadisticasGlobales.totalEnviadas > 0 
                        ? Math.round((cantidad / estadisticasGlobales.totalEnviadas) * 100)
                        : 0;
                      
                      return (
                        <div key={estado} className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{estado}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${porcentaje}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{cantidad}</span>
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

      {/* Modal de edición detallada */}
      {notificacionEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Configurar: {notificacionEditando.titulo}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotificacionEditando(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Configuración Avanzada</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Personaliza cómo y cuándo quieres recibir esta notificación
                  </p>
                  
                  {/* Aquí puedes agregar más configuraciones avanzadas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Anticipación (días)</label>
                      <Input 
                        type="number" 
                        defaultValue={notificacionEditando.configuracion.anticipacion || 0}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Límite por día</label>
                      <Input 
                        type="number" 
                        defaultValue={notificacionEditando.configuracion.limite || 10}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setNotificacionEditando(null)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={() => {
                    mostrarFeedback('Configuración guardada', 'success');
                    setNotificacionEditando(null);
                  }}>
                    Guardar Cambios
                  </Button>
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
            {feedback.tipo === 'info' && <Info className="h-5 w-5" />}
            {feedback.mensaje}
          </div>
        </div>
      )}
    </div>
  );
}
