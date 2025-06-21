'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  TrendingUp, TrendingDown, DollarSign, Users, FileText, Clock,
  AlertTriangle, CheckCircle, Building2, Activity, Zap, Eye,
  Bell, Calendar, BarChart3, PieChart, LineChart
} from 'lucide-react';
import Link from 'next/link';

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  icon: React.ComponentType<any>;
  color: string;
  priority: 'high' | 'medium' | 'low';
  lastUpdated: Date;
}

interface LiveEvent {
  id: string;
  type: 'factura' | 'pago' | 'cliente' | 'alerta' | 'proceso';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'success' | 'warning' | 'error' | 'info';
  amount?: number;
  client?: string;
}

interface PredictionData {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
}

export default function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulación de WebSocket en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoRefresh) {
        updateRealTimeData();
        setLastUpdate(new Date());
      }
    }, 5000); // Actualizar cada 5 segundos

    // Simular conexión WebSocket
    setTimeout(() => setIsConnected(true), 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const updateRealTimeData = () => {
    // Métricas en tiempo real
    const newMetrics: RealTimeMetric[] = [
      {
        id: 'ingresos_hoy',
        name: 'Ingresos Hoy',
        value: Math.floor(850000 + Math.random() * 50000),
        previousValue: 825000,
        trend: 'up',
        changePercent: 3.2,
        icon: DollarSign,
        color: 'text-green-600',
        priority: 'high',
        lastUpdated: new Date()
      },
      {
        id: 'facturas_procesadas',
        name: 'Facturas Procesadas',
        value: Math.floor(45 + Math.random() * 10),
        previousValue: 42,
        trend: 'up',
        changePercent: 7.1,
        icon: FileText,
        color: 'text-blue-600',
        priority: 'medium',
        lastUpdated: new Date()
      },
      {
        id: 'usuarios_activos',
        name: 'Usuarios Activos',
        value: Math.floor(28 + Math.random() * 5),
        previousValue: 25,
        trend: 'up',
        changePercent: 12.0,
        icon: Users,
        color: 'text-purple-600',
        priority: 'medium',
        lastUpdated: new Date()
      },
      {
        id: 'tiempo_respuesta',
        name: 'Tiempo Respuesta Avg',
        value: Math.floor(120 + Math.random() * 30),
        previousValue: 145,
        trend: 'down',
        changePercent: -17.2,
        icon: Clock,
        color: 'text-orange-600',
        priority: 'low',
        lastUpdated: new Date()
      },
      {
        id: 'alertas_pendientes',
        name: 'Alertas Pendientes',
        value: Math.floor(3 + Math.random() * 4),
        previousValue: 8,
        trend: 'down',
        changePercent: -62.5,
        icon: AlertTriangle,
        color: 'text-red-600',
        priority: 'high',
        lastUpdated: new Date()
      },
      {
        id: 'tareas_completadas',
        name: 'Tareas Completadas',
        value: Math.floor(85 + Math.random() * 10),
        previousValue: 78,
        trend: 'up',
        changePercent: 9.0,
        icon: CheckCircle,
        color: 'text-green-600',
        priority: 'medium',
        lastUpdated: new Date()
      }
    ];

    // Eventos en vivo
    const eventTypes = [
      { type: 'factura', severity: 'success', messages: ['Nueva factura generada', 'Factura pagada', 'Factura aprobada'] },
      { type: 'pago', severity: 'success', messages: ['Pago recibido', 'Transferencia completada', 'Cobro exitoso'] },
      { type: 'cliente', severity: 'info', messages: ['Nuevo cliente registrado', 'Cliente actualizado', 'Consulta de cliente'] },
      { type: 'alerta', severity: 'warning', messages: ['Documento próximo a vencer', 'Límite de uso alcanzado', 'Revisión requerida'] },
      { type: 'proceso', severity: 'info', messages: ['Proceso de backup iniciado', 'Sincronización SII', 'Generación de reportes'] }
    ];

    if (Math.random() > 0.7) { // 30% probabilidad de nuevo evento
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)];
      
      const newEvent: LiveEvent = {
        id: Date.now().toString(),
        type: randomType.type as any,
        title: randomMessage,
        description: `Evento generado automáticamente a las ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        severity: randomType.severity as any,
        amount: randomType.type === 'factura' || randomType.type === 'pago' ? 
          Math.floor(50000 + Math.random() * 500000) : undefined,
        client: Math.random() > 0.5 ? 'Empresa Demo S.A.' : undefined
      };

      setLiveEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Mantener solo los últimos 10
    }

    // Predicciones IA
    const newPredictions: PredictionData[] = [
      {
        metric: 'Ingresos Próxima Semana',
        current: 2850000,
        predicted: 3120000,
        confidence: 87,
        timeframe: '7 días'
      },
      {
        metric: 'Facturas a Generar',
        current: 156,
        predicted: 189,
        confidence: 92,
        timeframe: '3 días'
      },
      {
        metric: 'Nuevos Clientes',
        current: 12,
        predicted: 18,
        confidence: 75,
        timeframe: '15 días'
      }
    ];

    setMetrics(newMetrics);
    setPredictions(newPredictions);
  };

  // Inicializar datos
  useEffect(() => {
    updateRealTimeData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'factura': return <FileText className="w-4 h-4" />;
      case 'pago': return <DollarSign className="w-4 h-4" />;
      case 'cliente': return <Users className="w-4 h-4" />;
      case 'alerta': return <AlertTriangle className="w-4 h-4" />;
      case 'proceso': return <Activity className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getEventColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const highPriorityMetrics = useMemo(() => 
    metrics.filter(m => m.priority === 'high').slice(0, 3), [metrics]
  );

  return (
    <div className="space-y-6">
      {/* Header con Estado de Conexión */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-500" />
            Dashboard en Tiempo Real
          </h1>
          <p className="text-gray-600 mt-2">
            Monitoreo continuo de métricas críticas del sistema
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="w-4 h-4 mr-2" />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
          
          <div className="text-sm text-gray-500">
            Última actualización: {formatTime(lastUpdate)}
          </div>
        </div>
      </div>

      {/* Métricas Principales en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.id} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                    )}
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {Math.abs(metric.changePercent).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.name.includes('Ingresos') ? formatCurrency(metric.value) : 
                     metric.name.includes('Tiempo') ? `${metric.value}ms` :
                     metric.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Actualizado: {formatTime(metric.lastUpdated)}
                  </div>
                </div>

                {/* Indicador de Prioridad */}
                {metric.priority === 'high' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Eventos en Vivo y Predicciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eventos en Tiempo Real */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Eventos en Vivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {liveEvents.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Esperando eventos...</p>
                </div>
              ) : (
                liveEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${getEventColor(event.severity)}`}
                  >
                    <div className="mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <span className="text-xs text-gray-500">
                          {formatTime(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                      {event.amount && (
                        <p className="text-sm font-semibold mt-1">
                          {formatCurrency(event.amount)}
                        </p>
                      )}
                      {event.client && (
                        <p className="text-xs text-gray-500">{event.client}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Predicciones IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Predicciones IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{prediction.metric}</h4>
                    <Badge variant="outline" className="text-xs">
                      {prediction.confidence}% confianza
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Actual:</span>
                      <div className="font-semibold">
                        {prediction.metric.includes('Ingresos') ? 
                          formatCurrency(prediction.current) : 
                          prediction.current.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Predicción:</span>
                      <div className="font-semibold text-purple-600">
                        {prediction.metric.includes('Ingresos') ? 
                          formatCurrency(prediction.predicted) : 
                          prediction.predicted.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <Progress 
                      value={(prediction.predicted / prediction.current) * 50} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Plazo: {prediction.timeframe}</span>
                      <span>
                        {prediction.predicted > prediction.current ? '+' : ''}
                        {((prediction.predicted - prediction.current) / prediction.current * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Alta Prioridad */}
      {highPriorityMetrics.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Métricas de Alta Prioridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {highPriorityMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <div className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{metric.name}</h4>
                      <div className="text-lg font-bold">
                        {metric.name.includes('Ingresos') ? formatCurrency(metric.value) : 
                         metric.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/analytics"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <LineChart className="w-6 h-6 text-blue-600" />
          <div>
            <h4 className="text-sm font-medium">Analytics</h4>
            <p className="text-xs text-gray-500">Análisis detallado</p>
          </div>
        </Link>
        
        <Link
          href="/reportes"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <PieChart className="w-6 h-6 text-green-600" />
          <div>
            <h4 className="text-sm font-medium">Reportes</h4>
            <p className="text-xs text-gray-500">Generación automática</p>
          </div>
        </Link>
        
        <Link
          href="/calendario-tributario"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <Calendar className="w-6 h-6 text-purple-600" />
          <div>
            <h4 className="text-sm font-medium">Calendario</h4>
            <p className="text-xs text-gray-500">Fechas importantes</p>
          </div>
        </Link>
        
        <Link
          href="/advanced-analytics"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <BarChart3 className="w-6 h-6 text-orange-600" />
          <div>
            <h4 className="text-sm font-medium">Analytics Pro</h4>
            <p className="text-xs text-gray-500">Análisis avanzado</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
