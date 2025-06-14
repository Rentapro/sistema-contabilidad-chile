'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  Bell,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign
} from 'lucide-react';
import { 
  calendarioTributario2025, 
  obtenerFechasProximas, 
  obtenerFechasVencidas,
  obtenerFechasPorMes,
  UTM_ACTUAL,
  type FechaTributaria 
} from '@/data/calendario-tributario';

export default function CalendarioTributario() {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [mesVisualizando, setMesVisualizando] = useState(new Date());
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [vistaActual, setVistaActual] = useState<'calendario' | 'proximas' | 'vencidas'>('proximas');

  const fechasProximas = obtenerFechasProximas(30);
  const fechasVencidas = obtenerFechasVencidas();
  const fechasDelMes = obtenerFechasPorMes(mesVisualizando.getFullYear(), mesVisualizando.getMonth() + 1);

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(mesVisualizando);
    if (direccion === 'anterior') {
      nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    }
    setMesVisualizando(nuevaFecha);
  };

  const filtrarFechas = (fechas: FechaTributaria[]) => {
    if (filtroTipo === 'todos') return fechas;
    return fechas.filter(fecha => fecha.tipo === filtroTipo);
  };

  const obtenerColorBadge = (tipo: string, prioridad: string) => {
    if (tipo === 'vencimiento') {
      return prioridad === 'alta' ? 'destructive' : 'secondary';
    }
    if (tipo === 'importante') return 'default';
    return 'outline';
  };

  const obtenerIcono = (tipo: string) => {
    switch (tipo) {
      case 'vencimiento': return <AlertTriangle className="w-4 h-4" />;
      case 'importante': return <Bell className="w-4 h-4" />;
      case 'recordatorio': return <Clock className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const calcularDiasRestantes = (fecha: string) => {
    const fechaObjetivo = new Date(fecha);
    const hoy = new Date();
    const diferencia = fechaObjetivo.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📅 Calendario Tributario 2025
          </h1>
          <p className="text-gray-600">
            Mantente al día con todas las fechas importantes del SII
          </p>
        </div>

        {/* Alertas de Estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{fechasVencidas.length}</div>
                  <div className="text-sm text-gray-600">Fechas Vencidas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{fechasProximas.length}</div>
                  <div className="text-sm text-gray-600">Próximas (30 días)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${UTM_ACTUAL.toLocaleString('es-CL')}
                  </div>
                  <div className="text-sm text-gray-600">UTM Actual (Jun 2025)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegación de Vistas */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={vistaActual === 'proximas' ? 'default' : 'outline'}
            onClick={() => setVistaActual('proximas')}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Próximas Fechas ({fechasProximas.length})
          </Button>
          <Button
            variant={vistaActual === 'vencidas' ? 'default' : 'outline'}
            onClick={() => setVistaActual('vencidas')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Vencidas ({fechasVencidas.length})
          </Button>
          <Button
            variant={vistaActual === 'calendario' ? 'default' : 'outline'}
            onClick={() => setVistaActual('calendario')}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Vista Calendario
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filtroTipo === 'todos' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFiltroTipo('todos')}
          >
            Todos
          </Button>
          <Button
            variant={filtroTipo === 'vencimiento' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFiltroTipo('vencimiento')}
          >
            Vencimientos
          </Button>
          <Button
            variant={filtroTipo === 'importante' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFiltroTipo('importante')}
          >
            Importantes
          </Button>
          <Button
            variant={filtroTipo === 'recordatorio' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFiltroTipo('recordatorio')}
          >
            Recordatorios
          </Button>
        </div>

        {/* Vista Próximas Fechas */}
        {vistaActual === 'proximas' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Próximas Fechas Tributarias (30 días)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filtrarFechas(fechasProximas).map((fecha) => {
                    const diasRestantes = calcularDiasRestantes(fecha.fecha);
                    
                    return (
                      <div key={fecha.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {obtenerIcono(fecha.tipo)}
                              <h3 className="font-semibold text-lg">{fecha.titulo}</h3>
                              <Badge variant={obtenerColorBadge(fecha.tipo, fecha.prioridad)}>
                                {fecha.tipo.charAt(0).toUpperCase() + fecha.tipo.slice(1)}
                              </Badge>
                              {fecha.formulario && (
                                <Badge variant="outline">{fecha.formulario}</Badge>
                              )}
                            </div>
                            
                            <p className="text-gray-700 mb-3">{fecha.descripcion}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">Contribuyentes:</span>
                                <ul className="ml-2 text-gray-700">
                                  {fecha.contribuyentes.map((contrib, idx) => (
                                    <li key={idx}>• {contrib}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              {fecha.multa && (
                                <div>
                                  <span className="text-gray-500">Multa por atraso:</span>
                                  <div className="text-red-600 font-medium">{fecha.multa}</div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold mb-1">
                              {new Date(fecha.fecha).toLocaleDateString('es-CL', { 
                                day: '2-digit', 
                                month: 'short' 
                              })}
                            </div>
                            <div className={`text-sm font-medium ${
                              diasRestantes <= 7 ? 'text-red-600' : 
                              diasRestantes <= 15 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {diasRestantes === 0 ? 'HOY' : 
                               diasRestantes === 1 ? 'Mañana' : 
                               `${diasRestantes} días`}
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

        {/* Vista Fechas Vencidas */}
        {vistaActual === 'vencidas' && (
          <div className="space-y-4">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  Fechas Vencidas - Acción Requerida
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {fechasVencidas.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      ¡Excelente! No tienes fechas vencidas
                    </h3>
                    <p className="text-gray-600">
                      Todas tus obligaciones tributarias están al día
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filtrarFechas(fechasVencidas).map((fecha) => {
                      const diasVencidos = Math.abs(calcularDiasRestantes(fecha.fecha));
                      
                      return (
                        <div key={fecha.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <h3 className="font-semibold text-lg text-red-800">{fecha.titulo}</h3>
                                <Badge variant="destructive">VENCIDO</Badge>
                                {fecha.formulario && (
                                  <Badge variant="outline">{fecha.formulario}</Badge>
                                )}
                              </div>
                              
                              <p className="text-red-700 mb-3">{fecha.descripcion}</p>
                              
                              {fecha.multa && (
                                <div className="bg-red-100 p-3 rounded-lg mb-3">
                                  <div className="text-sm font-medium text-red-800 mb-1">
                                    ⚠️ Multa Aplicable:
                                  </div>
                                  <div className="text-red-700">{fecha.multa}</div>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right ml-4">
                              <div className="text-2xl font-bold text-red-600 mb-1">
                                {new Date(fecha.fecha).toLocaleDateString('es-CL', { 
                                  day: '2-digit', 
                                  month: 'short' 
                                })}
                              </div>
                              <div className="text-sm font-medium text-red-600">
                                {diasVencidos} días vencido
                              </div>
                              <Button variant="destructive" size="sm" className="mt-2">
                                Regularizar
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Vista Calendario Mensual */}
        {vistaActual === 'calendario' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {mesVisualizando.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => cambiarMes('anterior')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => cambiarMes('siguiente')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filtrarFechas(fechasDelMes).map((fecha) => (
                  <div key={fecha.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {new Date(fecha.fecha).getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(fecha.fecha).toLocaleDateString('es-CL', { weekday: 'short' })}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold">{fecha.titulo}</h3>
                          <p className="text-sm text-gray-600">{fecha.descripcion}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={obtenerColorBadge(fecha.tipo, fecha.prioridad)}>
                          {fecha.tipo}
                        </Badge>
                        {fecha.formulario && (
                          <Badge variant="outline">{fecha.formulario}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {fechasDelMes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay fechas tributarias programadas para este mes
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
