'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  AlertTriangle, 
  Mail, 
  Smartphone, 
  Monitor,
  Clock,
  Settings,
  Eye,
  Archive,
  Trash2,
  Filter
} from 'lucide-react';
import { NotificacionesService, Notificacion, ConfiguracionNotificaciones } from '@/services/notificacionesService';

interface CentroNotificacionesProps {
  empresaId: string;
  usuarioId?: string;
}

export default function CentroNotificaciones({ empresaId, usuarioId }: CentroNotificacionesProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionNotificaciones>({
    empresa_id: empresaId,
    usuario_id: usuarioId,
    email_enabled: true,
    sms_enabled: false,
    push_enabled: true,
    horario_preferido: {
      inicio: '09:00',
      fin: '18:00'
    },
    tipos_habilitados: ['vencimiento_certificado', 'alerta_multa', 'tributario'],
    frecuencia_resumen: 'diario'
  });
  
  const [cargando, setCargando] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<Notificacion['tipo'] | 'todas'>('todas');
  const [filtroEstado, setFiltroEstado] = useState<Notificacion['estado'] | 'todos'>('todos');
  const [resumen, setResumen] = useState({
    total: 0,
    noLeidas: 0,
    criticas: 0,
    porTipo: {} as Record<string, number>
  });

  useEffect(() => {
    cargarNotificaciones();
    cargarResumen();
    cargarConfiguracion();
  }, [empresaId, usuarioId]);

  const cargarNotificaciones = async () => {
    setCargando(true);
    try {
      const filtros: any = {};
      if (usuarioId) filtros.usuario_id = usuarioId;
      if (filtroTipo !== 'todas') filtros.tipo = filtroTipo;
      if (filtroEstado !== 'todos') filtros.estado = filtroEstado;
      
      const notificacionesObtenidas = await NotificacionesService.obtenerNotificaciones(
        empresaId,
        { ...filtros, limite: 50 }
      );
      setNotificaciones(notificacionesObtenidas);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarResumen = async () => {
    try {
      const resumenObtenido = await NotificacionesService.obtenerResumen(empresaId);
      setResumen(resumenObtenido);
    } catch (error) {
      console.error('Error cargando resumen:', error);
    }
  };

  const cargarConfiguracion = async () => {
    // La configuración se obtendría del servicio, por ahora usamos la por defecto
  };

  const marcarComoLeida = async (notificacionId: string) => {
    try {
      const exito = await NotificacionesService.marcarComoLeida(notificacionId);
      if (exito) {
        setNotificaciones(prev => 
          prev.map(n => 
            n.id === notificacionId 
              ? { ...n, estado: 'leida' as const }
              : n
          )
        );
        await cargarResumen();
      }
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  const actualizarConfiguracion = async (nuevaConfiguracion: Partial<ConfiguracionNotificaciones>) => {
    try {
      const configActualizada = { ...configuracion, ...nuevaConfiguracion };
      const exito = await NotificacionesService.actualizarConfiguracion(configActualizada);
      if (exito) {
        setConfiguracion(configActualizada);
      }
    } catch (error) {
      console.error('Error actualizando configuración:', error);
    }
  };

  const obtenerIconoTipo = (tipo: Notificacion['tipo']) => {
    switch (tipo) {
      case 'vencimiento_certificado':
        return <Bell className="w-4 h-4 text-yellow-600" />;
      case 'factura_vencida':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'recordatorio_pago':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'alerta_multa':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'backup_completado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'sistema':
        return <Monitor className="w-4 h-4 text-gray-600" />;
      case 'tributario':
        return <BellRing className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const obtenerBadgePrioridad = (prioridad: Notificacion['prioridad']) => {
    switch (prioridad) {
      case 'critica':
        return <Badge className="bg-red-100 text-red-700">Crítica</Badge>;
      case 'alta':
        return <Badge className="bg-orange-100 text-orange-700">Alta</Badge>;
      case 'media':
        return <Badge className="bg-yellow-100 text-yellow-700">Media</Badge>;
      case 'baja':
        return <Badge className="bg-gray-100 text-gray-700">Baja</Badge>;
      default:
        return <Badge>{prioridad}</Badge>;
    }
  };

  const obtenerIconoCanal = (canal: string) => {
    switch (canal) {
      case 'email':
        return <Mail className="w-3 h-3" />;
      case 'sms':
        return <Smartphone className="w-3 h-3" />;
      case 'push':
        return <BellRing className="w-3 h-3" />;
      case 'sistema':
        return <Monitor className="w-3 h-3" />;
      default:
        return <Bell className="w-3 h-3" />;
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString();
  };

  const notificacionesFiltradas = notificaciones.filter(n => {
    const coincideTipo = filtroTipo === 'todas' || n.tipo === filtroTipo;
    const coincideEstado = filtroEstado === 'todos' || n.estado === filtroEstado;
    return coincideTipo && coincideEstado;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Bell className="w-8 h-8" />
          Centro de Notificaciones
        </h1>
        <p className="text-gray-600">
          Gestiona tus notificaciones y alertas del sistema
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{resumen.total}</p>
              </div>
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">No Leídas</p>
                <p className="text-2xl font-bold text-blue-600">{resumen.noLeidas}</p>
              </div>
              <BellRing className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Críticas</p>
                <p className="text-2xl font-bold text-red-600">{resumen.criticas}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tributarias</p>
                <p className="text-2xl font-bold text-purple-600">
                  {resumen.porTipo.tributario || 0}
                </p>
              </div>
              <BellRing className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notificaciones" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="notificaciones" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Label>Filtros:</Label>
                </div>
                
                <Select value={filtroTipo} onValueChange={(value: any) => setFiltroTipo(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos los tipos</SelectItem>
                    <SelectItem value="vencimiento_certificado">Vencimiento Certificado</SelectItem>
                    <SelectItem value="factura_vencida">Factura Vencida</SelectItem>
                    <SelectItem value="recordatorio_pago">Recordatorio Pago</SelectItem>
                    <SelectItem value="alerta_multa">Alerta Multa</SelectItem>
                    <SelectItem value="backup_completado">Backup Completado</SelectItem>
                    <SelectItem value="sistema">Sistema</SelectItem>
                    <SelectItem value="tributario">Tributario</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtroEstado} onValueChange={(value: any) => setFiltroEstado(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="enviada">Enviada</SelectItem>
                    <SelectItem value="leida">Leída</SelectItem>
                    <SelectItem value="archivada">Archivada</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={() => { setFiltroTipo('todas'); setFiltroEstado('todos'); }}>
                  Limpiar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Notificaciones ({notificacionesFiltradas.length})</span>
                <Button variant="outline" size="sm" onClick={cargarNotificaciones}>
                  Actualizar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cargando ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <div className="mt-2 text-gray-500">Cargando notificaciones...</div>
                </div>
              ) : notificacionesFiltradas.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <div className="text-gray-500">No hay notificaciones</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Las notificaciones aparecerán aquí cuando se generen
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {notificacionesFiltradas.map((notificacion) => (
                    <Card 
                      key={notificacion.id} 
                      className={`transition-all ${
                        notificacion.estado === 'pendiente' || notificacion.estado === 'enviada'
                          ? 'border-blue-200 bg-blue-50'
                          : ''
                      } ${
                        notificacion.prioridad === 'critica'
                          ? 'border-red-200 bg-red-50'
                          : ''
                      }`}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0 mt-1">
                              {obtenerIconoTipo(notificacion.tipo)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {notificacion.titulo}
                                </h3>
                                {obtenerBadgePrioridad(notificacion.prioridad)}
                                {(notificacion.estado === 'pendiente' || notificacion.estado === 'enviada') && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">
                                {notificacion.mensaje}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>
                                  {formatearFecha(notificacion.created_at || '')}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span>Canales:</span>
                                  {notificacion.canales.map((canal, index) => (
                                    <span key={index} className="flex items-center gap-1">
                                      {obtenerIconoCanal(canal)}
                                      {canal}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Acciones de la notificación */}
                              {notificacion.acciones && notificacion.acciones.length > 0 && (
                                <div className="mt-3 flex gap-2">
                                  {notificacion.acciones.map((accion, index) => (
                                    <Button
                                      key={index}
                                      variant={accion.tipo === 'button' ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => {
                                        if (accion.url.startsWith('http')) {
                                          window.open(accion.url, '_blank');
                                        } else {
                                          // Navegación interna
                                          window.location.href = accion.url;
                                        }
                                      }}
                                    >
                                      {accion.texto}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {(notificacion.estado === 'pendiente' || notificacion.estado === 'enviada') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => marcarComoLeida(notificacion.id!)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Marcar leída
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-600"
                            >
                              <Archive className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>
                Personaliza cómo y cuándo recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Canales habilitados */}
              <div className="space-y-4">
                <h3 className="font-semibold">Canales de Notificación</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <Label htmlFor="email-enabled">Notificaciones por Email</Label>
                    </div>
                    <Switch
                      id="email-enabled"
                      checked={configuracion.email_enabled}
                      onCheckedChange={(checked) => 
                        actualizarConfiguracion({ email_enabled: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <Label htmlFor="sms-enabled">Notificaciones por SMS</Label>
                    </div>
                    <Switch
                      id="sms-enabled"
                      checked={configuracion.sms_enabled}
                      onCheckedChange={(checked) => 
                        actualizarConfiguracion({ sms_enabled: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4" />
                      <Label htmlFor="push-enabled">Notificaciones Push</Label>
                    </div>
                    <Switch
                      id="push-enabled"
                      checked={configuracion.push_enabled}
                      onCheckedChange={(checked) => 
                        actualizarConfiguracion({ push_enabled: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Horario preferido */}
              <div className="space-y-4">
                <h3 className="font-semibold">Horario Preferido</h3>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div>
                    <Label htmlFor="hora-inicio">Desde</Label>
                    <Select 
                      value={configuracion.horario_preferido.inicio}
                      onValueChange={(value) => 
                        actualizarConfiguracion({
                          horario_preferido: {
                            ...configuracion.horario_preferido,
                            inicio: value
                          }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hora = i.toString().padStart(2, '0') + ':00';
                          return (
                            <SelectItem key={hora} value={hora}>
                              {hora}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="hora-fin">Hasta</Label>
                    <Select 
                      value={configuracion.horario_preferido.fin}
                      onValueChange={(value) => 
                        actualizarConfiguracion({
                          horario_preferido: {
                            ...configuracion.horario_preferido,
                            fin: value
                          }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hora = i.toString().padStart(2, '0') + ':00';
                          return (
                            <SelectItem key={hora} value={hora}>
                              {hora}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Frecuencia de resumen */}
              <div className="space-y-4">
                <h3 className="font-semibold">Resumen de Notificaciones</h3>
                <Select 
                  value={configuracion.frecuencia_resumen}
                  onValueChange={(value: any) => 
                    actualizarConfiguracion({ frecuencia_resumen: value })
                  }
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">Diario</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="nunca">Nunca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
