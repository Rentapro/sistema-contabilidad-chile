'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  FileText, 
  ExternalLink, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  TrendingDown
} from "lucide-react";
import { 
  AlertaSII, 
  alertasSIISimuladas, 
  obtenerAlertasCriticas, 
  obtenerAlertasProximasVencer,
  calcularImpactoEconomicoTotal 
} from "@/data/alertas-sii";

export default function AlertasSII() {
  const [alertas, setAlertas] = useState<AlertaSII[]>([]);
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<AlertaSII | null>(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);

  useEffect(() => {
    // Cargar alertas críticas y próximas a vencer
    const alertasCriticas = obtenerAlertasCriticas();
    const alertasVencimiento = obtenerAlertasProximasVencer();
    
    // Combinar y eliminar duplicados
    const alertasUnicas = [...alertasCriticas, ...alertasVencimiento]
      .filter((alerta, index, self) => 
        index === self.findIndex(a => a.id === alerta.id)
      );

    setAlertas(alertasUnicas);

    // Seleccionar la alerta más crítica por defecto
    const alertaMasCritica = alertasUnicas.find(a => a.prioridad === 'critica') || alertasUnicas[0];
    if (alertaMasCritica) {
      setAlertaSeleccionada(alertaMasCritica);
    }
  }, []);

  const obtenerIconoPorTipo = (tipo: AlertaSII['tipo']) => {
    switch (tipo) {
      case 'observacion': return <Eye className="h-5 w-5 text-orange-600" />;
      case 'requerimiento': return <FileText className="h-5 w-5 text-red-600" />;
      case 'fiscalizacion': return <AlertTriangle className="h-5 w-5 text-red-700" />;
      case 'vencimiento': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'multa': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'credito': return <TrendingDown className="h-5 w-5 text-green-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const obtenerColorPorPrioridad = (prioridad: AlertaSII['prioridad']) => {
    switch (prioridad) {
      case 'critica': return 'border-red-500 bg-red-50';
      case 'alta': return 'border-orange-500 bg-orange-50';
      case 'media': return 'border-yellow-500 bg-yellow-50';
      case 'baja': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const obtenerBadgePorPrioridad = (prioridad: AlertaSII['prioridad']) => {
    const configs = {
      critica: { variant: 'destructive' as const, text: '🚨 CRÍTICA' },
      alta: { variant: 'secondary' as const, text: '⚠️ ALTA' },
      media: { variant: 'outline' as const, text: '📋 MEDIA' },
      baja: { variant: 'outline' as const, text: '📝 BAJA' }
    };
    return configs[prioridad] || configs.baja;
  };

  const obtenerDiasRestantes = (fecha?: Date) => {
    if (!fecha) return null;
    const hoy = new Date();
    const diffTime = fecha.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const marcarAccionCompletada = (alertaId: string, accionId: string) => {
    const alertasActualizadas = alertas.map(alerta => {
      if (alerta.id === alertaId) {
        const accionesActualizadas = alerta.acciones.map(accion => 
          accion.id === accionId ? { ...accion, completada: true } : accion
        );
        return { ...alerta, acciones: accionesActualizadas };
      }
      return alerta;
    });
    
    setAlertas(alertasActualizadas);
    
    // Actualizar alerta seleccionada si corresponde
    if (alertaSeleccionada?.id === alertaId) {
      const alertaActualizada = alertasActualizadas.find(a => a.id === alertaId);
      if (alertaActualizada) {
        setAlertaSeleccionada(alertaActualizada);
      }
    }
  };

  const impactoTotal = calcularImpactoEconomicoTotal();

  if (alertas.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-900 mb-2">
              ✅ ¡Todo en Orden!
            </h3>
            <p className="text-green-700">
              No tienes alertas pendientes del SII. Tu situación tributaria está al día.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen de Alertas */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-6 w-6" />
            🚨 Alertas del SII - Atención Requerida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-700">{alertas.length}</div>
              <div className="text-sm text-red-600">Alertas Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">
                {alertas.filter(a => a.prioridad === 'critica').length}
              </div>
              <div className="text-sm text-orange-600">Críticas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                ${impactoTotal.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">Impacto Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alertas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Panel Izquierdo - Lista de Alertas */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Alertas Pendientes</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarTodas(!mostrarTodas)}
            >
              {mostrarTodas ? 'Mostrar Críticas' : 'Mostrar Todas'}
            </Button>
          </div>

          {(mostrarTodas ? alertasSIISimuladas : alertas).map((alerta) => (
            <Card
              key={alerta.id}
              className={`cursor-pointer transition-all ${
                alertaSeleccionada?.id === alerta.id 
                  ? 'ring-2 ring-blue-500 ' + obtenerColorPorPrioridad(alerta.prioridad)
                  : obtenerColorPorPrioridad(alerta.prioridad)
              }`}
              onClick={() => setAlertaSeleccionada(alerta)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {obtenerIconoPorTipo(alerta.tipo)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm truncate">
                        {alerta.titulo}
                      </h4>
                      <Badge {...obtenerBadgePorPrioridad(alerta.prioridad)}>
                        {obtenerBadgePorPrioridad(alerta.prioridad).text}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {alerta.descripcion}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      {alerta.monto && (
                        <span className="font-medium text-red-600">
                          ${alerta.monto.toLocaleString()}
                        </span>
                      )}
                      {alerta.fechaVencimiento && (
                        <span className={`flex items-center gap-1 ${
                          (obtenerDiasRestantes(alerta.fechaVencimiento) || 0) <= 1 
                            ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          <Calendar className="h-3 w-3" />
                          {obtenerDiasRestantes(alerta.fechaVencimiento)} días
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Panel Derecho - Detalle de Alerta */}
        {alertaSeleccionada && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {obtenerIconoPorTipo(alertaSeleccionada.tipo)}
                Detalle de la Alerta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {alertaSeleccionada.titulo}
                </h3>
                <p className="text-gray-700 text-sm">
                  {alertaSeleccionada.descripcion}
                </p>
              </div>

              {/* Explicación de la IA */}
              {alertaSeleccionada.explicacion && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    🤖 Explicación IA:
                  </h4>
                  <p className="text-sm text-blue-800">
                    {alertaSeleccionada.explicacion}
                  </p>
                </div>
              )}

              {/* Solución Propuesta */}
              {alertaSeleccionada.solucion && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    ✅ Cómo Solucionarlo:
                  </h4>
                  <p className="text-sm text-green-800">
                    {alertaSeleccionada.solucion}
                  </p>
                </div>
              )}

              {/* Impacto Económico */}
              {alertaSeleccionada.impactoEconomico && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">
                    💰 Impacto Económico:
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {alertaSeleccionada.impactoEconomico}
                  </p>
                </div>
              )}

              {/* Consejo de la IA */}
              {alertaSeleccionada.consejoIA && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">
                    🧠 Consejo de la IA:
                  </h4>
                  <p className="text-sm text-purple-800">
                    {alertaSeleccionada.consejoIA}
                  </p>
                </div>
              )}

              {/* Acciones Requeridas */}
              <div>
                <h4 className="font-medium mb-3">Acciones Requeridas:</h4>
                <div className="space-y-2">
                  {alertaSeleccionada.acciones.map((accion) => (
                    <div
                      key={accion.id}
                      className={`p-3 rounded-lg border ${
                        accion.completada 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm mb-1">
                            {accion.titulo}
                          </h5>
                          <p className="text-xs text-gray-600 mb-2">
                            {accion.descripcion}
                          </p>
                          {accion.plazo && (
                            <span className="text-xs text-red-600">
                              Plazo: {accion.plazo.toLocaleDateString('es-CL')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          {accion.url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(accion.url, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant={accion.completada ? "secondary" : "default"}
                            onClick={() => marcarAccionCompletada(alertaSeleccionada.id, accion.id)}
                            disabled={accion.completada}
                          >
                            {accion.completada ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              '✓'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
