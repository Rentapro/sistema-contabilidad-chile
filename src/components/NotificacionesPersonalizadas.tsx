'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
  Settings
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
    horarioInicio: string;
    horarioFin: string;
    diasSemana: number[];
    umbralImporte?: number;
    anticipacionDias?: number;
  };
}

const TIPOS_NOTIFICACIONES: TipoNotificacion[] = [
  // Tributarias
  {
    id: 'vencimiento-f29',
    categoria: 'tributario',
    titulo: 'Vencimiento F29',
    descripcion: 'Recordatorio de presentación de declaración mensual F29',
    icono: <Calendar className="h-5 w-5" />,
    prioridad: 'alta',
    canales: ['email', 'push', 'sms'],
    roles: ['admin_empresa', 'contador'],
    frecuencia: 'inmediata',
    activa: true
  },
  {
    id: 'vencimiento-iva',
    categoria: 'tributario',
    titulo: 'Vencimiento IVA',
    descripcion: 'Recordatorio de pago de IVA mensual',
    icono: <DollarSign className="h-5 w-5" />,
    prioridad: 'alta',
    canales: ['email', 'push', 'sistema'],
    roles: ['admin_empresa', 'contador'],
    frecuencia: 'inmediata',
    activa: true
  },
  {
    id: 'actualizacion-sii',
    categoria: 'tributario',
    titulo: 'Actualizaciones SII',
    descripcion: 'Cambios en normativas y formularios del SII',
    icono: <FileText className="h-5 w-5" />,
    prioridad: 'media',
    canales: ['email', 'sistema'],
    roles: ['admin_empresa', 'contador'],
    frecuencia: 'inmediata',
    activa: true
  },

  // Financieras
  {
    id: 'factura-vencida',
    categoria: 'financiero',
    titulo: 'Facturas Vencidas',
    descripcion: 'Alerta de facturas por cobrar vencidas',
    icono: <AlertTriangle className="h-5 w-5" />,
    prioridad: 'alta',
    canales: ['email', 'push', 'sistema'],
    roles: ['admin_empresa', 'contador', 'cliente_basico'],
    frecuencia: 'diaria',
    activa: true
  },
  {
    id: 'meta-ventas',
    categoria: 'financiero',
    titulo: 'Metas de Ventas',
    descripcion: 'Progreso hacia metas mensuales de ventas',
    icono: <TrendingUp className="h-5 w-5" />,
    prioridad: 'media',
    canales: ['email', 'sistema'],
    roles: ['admin_empresa', 'cliente_basico'],
    frecuencia: 'semanal',
    activa: true
  },
  {
    id: 'flujo-caja-bajo',
    categoria: 'financiero',
    titulo: 'Flujo de Caja Bajo',
    descripcion: 'Alerta cuando el flujo de caja está por debajo del umbral',
    icono: <DollarSign className="h-5 w-5" />,
    prioridad: 'alta',
    canales: ['email', 'push', 'sms'],
    roles: ['admin_empresa', 'cliente_basico'],
    frecuencia: 'inmediata',
    activa: true
  },

  // Operacionales
  {
    id: 'nuevo-cliente',
    categoria: 'operacional',
    titulo: 'Nuevo Cliente',
    descripcion: 'Notificación cuando se registra un nuevo cliente',
    icono: <Users className="h-5 w-5" />,
    prioridad: 'baja',
    canales: ['sistema'],
    roles: ['admin_empresa', 'contador'],
    frecuencia: 'inmediata',
    activa: true
  },
  {
    id: 'limite-facturas',
    categoria: 'operacional',
    titulo: 'Límite de Facturas',
    descripcion: 'Aviso cuando se acerca al límite mensual de facturas',
    icono: <FileText className="h-5 w-5" />,
    prioridad: 'media',
    canales: ['email', 'sistema'],
    roles: ['admin_empresa', 'cliente_basico'],
    frecuencia: 'inmediata',
    activa: true
  },

  // Sistema
  {
    id: 'mantenimiento-programado',
    categoria: 'sistema',
    titulo: 'Mantenimiento Programado',
    descripcion: 'Notificación de mantenimientos del sistema',
    icono: <Settings className="h-5 w-5" />,
    prioridad: 'media',
    canales: ['email', 'sistema'],
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico'],
    frecuencia: 'inmediata',
    activa: true
  },
  {
    id: 'actualizacion-sistema',
    categoria: 'sistema',
    titulo: 'Actualizaciones del Sistema',
    descripcion: 'Nuevas funcionalidades y mejoras',
    icono: <Zap className="h-5 w-5" />,
    prioridad: 'baja',
    canales: ['email', 'sistema'],
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico'],
    frecuencia: 'inmediata',
    activa: true
  },

  // Marketing/Engagement
  {
    id: 'upgrade-plan',
    categoria: 'marketing',
    titulo: 'Upgrade de Plan',
    descripcion: 'Sugerencias para mejorar el plan actual',
    icono: <Star className="h-5 w-5" />,
    prioridad: 'baja',
    canales: ['email', 'sistema'],
    roles: ['cliente_basico'],
    frecuencia: 'semanal',
    activa: true
  },
  {
    id: 'tips-fiscales',
    categoria: 'marketing',
    titulo: 'Tips Fiscales',
    descripcion: 'Consejos y mejores prácticas tributarias',
    icono: <Info className="h-5 w-5" />,
    prioridad: 'baja',
    canales: ['email'],
    roles: ['admin_empresa', 'contador', 'cliente_basico'],
    frecuencia: 'semanal',
    activa: true
  }
];

export default function NotificacionesPersonalizadas() {
  const { usuario } = useAuth();
  const [notificacionesPersonalizadas, setNotificacionesPersonalizadas] = useState<NotificacionPersonalizada[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas');

  useEffect(() => {
    // Cargar configuración existente del usuario
    if (usuario) {
      // Mock de configuración por defecto
      const configDefault: NotificacionPersonalizada[] = TIPOS_NOTIFICACIONES
        .filter(tipo => tipo.roles.includes(usuario.rol))
        .map(tipo => ({
          id: `${usuario.id}-${tipo.id}`,
          usuarioId: usuario.id,
          tipoNotificacionId: tipo.id,
          configuracion: {
            email: tipo.canales.includes('email'),
            push: tipo.canales.includes('push'),
            sms: false, // Por defecto desactivado
            sistema: tipo.canales.includes('sistema'),
            horarioInicio: '08:00',
            horarioFin: '18:00',
            diasSemana: [1, 2, 3, 4, 5], // Lunes a Viernes
            umbralImporte: tipo.id.includes('flujo') ? 100000 : undefined,
            anticipacionDias: tipo.categoria === 'tributario' ? 7 : 3
          }
        }));
      
      setNotificacionesPersonalizadas(configDefault);
    }
  }, [usuario]);

  if (!usuario) return null;

  const tiposDisponibles = TIPOS_NOTIFICACIONES.filter(tipo => 
    tipo.roles.includes(usuario.rol) && 
    (categoriaSeleccionada === 'todas' || tipo.categoria === categoriaSeleccionada)
  );

  const actualizarConfiguracion = (tipoId: string, canal: string, valor: boolean) => {
    setNotificacionesPersonalizadas(prev => 
      prev.map(notif => {
        if (notif.tipoNotificacionId === tipoId) {
          return {
            ...notif,
            configuracion: {
              ...notif.configuracion,
              [canal]: valor
            }
          };
        }
        return notif;
      })
    );
  };

  const getConfiguracion = (tipoId: string) => {
    return notificacionesPersonalizadas.find(n => n.tipoNotificacionId === tipoId)?.configuracion;
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'tributario': return 'bg-red-100 text-red-800 border-red-200';
      case 'financiero': return 'bg-green-100 text-green-800 border-green-200';
      case 'operacional': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sistema': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'marketing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categorias = ['todas', ...Array.from(new Set(TIPOS_NOTIFICACIONES.map(t => t.categoria)))];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <BellRing className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Notificaciones Personalizadas</h1>
        </div>
        <p className="text-gray-600">
          Configura cómo y cuándo quieres recibir notificaciones importantes del sistema
        </p>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Activas</p>
                <p className="text-xl font-bold text-gray-900">
                  {notificacionesPersonalizadas.filter(n => 
                    n.configuracion.email || n.configuracion.push || n.configuracion.sms || n.configuracion.sistema
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Por Email</p>
                <p className="text-xl font-bold text-gray-900">
                  {notificacionesPersonalizadas.filter(n => n.configuracion.email).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Push</p>
                <p className="text-xl font-bold text-gray-900">
                  {notificacionesPersonalizadas.filter(n => n.configuracion.push).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Alta Prioridad</p>
                <p className="text-xl font-bold text-gray-900">
                  {tiposDisponibles.filter(t => t.prioridad === 'alta').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categorias.map(categoria => (
              <Button
                key={categoria}
                variant={categoriaSeleccionada === categoria ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoriaSeleccionada(categoria)}
              >
                {categoria === 'todas' ? 'Todas' : categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Notificaciones */}
      <div className="space-y-4">
        {tiposDisponibles.map(tipo => {
          const config = getConfiguracion(tipo.id);
          if (!config) return null;

          return (
            <Card key={tipo.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getCategoriaColor(tipo.categoria)}`}>
                      {tipo.icono}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{tipo.titulo}</h3>
                        <Badge className={getPrioridadColor(tipo.prioridad)}>
                          {tipo.prioridad}
                        </Badge>
                        <Badge variant="outline" className={getCategoriaColor(tipo.categoria)}>
                          {tipo.categoria}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{tipo.descripcion}</p>
                      <p className="text-xs text-gray-500">
                        Frecuencia: {tipo.frecuencia} • Canales disponibles: {tipo.canales.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Configuración de Canales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {tipo.canales.map(canal => {
                    const iconos = {
                      email: <Mail className="h-4 w-4" />,
                      push: <Smartphone className="h-4 w-4" />,
                      sms: <MessageSquare className="h-4 w-4" />,
                      sistema: <Bell className="h-4 w-4" />
                    };

                    return (
                      <div key={canal} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          {iconos[canal]}
                          <span className="text-sm font-medium capitalize">{canal}</span>
                        </div>
                        <Switch
                          checked={config[canal as keyof typeof config] as boolean}
                          onCheckedChange={(checked) => actualizarConfiguracion(tipo.id, canal, checked)}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Configuración Avanzada */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Horario de Notificaciones
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="time"
                        value={config.horarioInicio}
                        className="text-xs px-2 py-1 border rounded flex-1"
                        readOnly
                      />
                      <span className="text-gray-500 text-xs self-center">a</span>
                      <input
                        type="time"
                        value={config.horarioFin}
                        className="text-xs px-2 py-1 border rounded flex-1"
                        readOnly
                      />
                    </div>
                  </div>

                  {config.anticipacionDias && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Anticipación (días)
                      </label>
                      <input
                        type="number"
                        value={config.anticipacionDias}
                        className="text-xs px-2 py-1 border rounded w-full"
                        readOnly
                      />
                    </div>
                  )}

                  {config.umbralImporte && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Umbral Monto ($)
                      </label>
                      <input
                        type="number"
                        value={config.umbralImporte}
                        className="text-xs px-2 py-1 border rounded w-full"
                        readOnly
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Acciones */}
      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <p>💡 <strong>Tip:</strong> Las notificaciones de alta prioridad siempre se envían, independientemente del horario configurado</p>
        </div>
        
        <div className="space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuración Avanzada
          </Button>
          <Button>
            <CheckCircle className="h-4 w-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </div>
  );
}
