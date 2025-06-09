'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface FinancialAlert {
  id: string;
  type: 'warning' | 'critical' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  category: 'cashflow' | 'budget' | 'compliance' | 'debt' | 'revenue' | 'expense';
  action?: string;
  resolved: boolean;
  impact: 'low' | 'medium' | 'high' | 'critical';
  amount?: number;
  relatedAccount?: string;
}

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  changePercent: number;
  category: 'revenue' | 'expense' | 'profit' | 'cashflow' | 'debt' | 'assets';
  target?: number;
  lastUpdated: string;
}

interface CashFlowPrediction {
  date: string;
  predicted: number;
  actual?: number;
  confidence: number;
  factors: string[];
}

export default function RealTimeFinancialMonitor() {
  const { usuario, empresaActual } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alerts, setAlerts] = useState<FinancialAlert[]>([]);
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<FinancialAlert | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [alertFilter, setAlertFilter] = useState<string>('all');

  // Simulación de datos en tiempo real
  useEffect(() => {
    const mockAlerts: FinancialAlert[] = [
      {
        id: 'alert-001',
        type: 'critical',
        title: 'Flujo de Caja Crítico',
        message: 'El saldo proyectado para los próximos 7 días será negativo (-$2.5M CLP)',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        category: 'cashflow',
        action: 'Revisar pagos pendientes y acelerar cobranzas',
        resolved: false,
        impact: 'critical',
        amount: -2500000,
        relatedAccount: 'Cuenta Corriente Principal'
      },
      {
        id: 'alert-002',
        type: 'warning',
        title: 'Presupuesto Mensual Excedido',
        message: 'Los gastos operacionales han excedido el presupuesto mensual en un 15%',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        category: 'budget',
        action: 'Revisar categorías de gasto y ajustar presupuesto',
        resolved: false,
        impact: 'medium',
        amount: 3750000
      },
      {
        id: 'alert-003',
        type: 'info',
        title: 'Factura Grande Recibida',
        message: 'Se ha recibido una factura de $8.5M CLP, 300% superior al promedio',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        category: 'expense',
        action: 'Validar factura y verificar autorización',
        resolved: false,
        impact: 'medium',
        amount: 8500000
      },
      {
        id: 'alert-004',
        type: 'success',
        title: 'Meta de Ingresos Alcanzada',
        message: 'Los ingresos mensuales han superado la meta en un 8%',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: 'revenue',
        resolved: true,
        impact: 'low',
        amount: 24000000
      },
      {
        id: 'alert-005',
        type: 'warning',
        title: 'Vencimiento de Declaración SII',
        message: 'La declaración de IVA vence en 3 días y aún no se ha preparado',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        category: 'compliance',
        action: 'Preparar declaración IVA inmediatamente',
        resolved: false,
        impact: 'high'
      }
    ];

    const mockMetrics: RealTimeMetric[] = [
      {
        id: 'metric-001',
        name: 'Ingresos del Mes',
        value: 28750000,
        previousValue: 26500000,
        unit: 'CLP',
        trend: 'up',
        change: 2250000,
        changePercent: 8.5,
        category: 'revenue',
        target: 30000000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'metric-002',
        name: 'Gastos del Mes',
        value: 18900000,
        previousValue: 16800000,
        unit: 'CLP',
        trend: 'up',
        change: 2100000,
        changePercent: 12.5,
        category: 'expense',
        target: 18000000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'metric-003',
        name: 'Utilidad Neta',
        value: 9850000,
        previousValue: 9700000,
        unit: 'CLP',
        trend: 'up',
        change: 150000,
        changePercent: 1.5,
        category: 'profit',
        target: 12000000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'metric-004',
        name: 'Flujo de Caja',
        value: 5200000,
        previousValue: 7800000,
        unit: 'CLP',
        trend: 'down',
        change: -2600000,
        changePercent: -33.3,
        category: 'cashflow',
        target: 8000000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'metric-005',
        name: 'Cuentas por Cobrar',
        value: 15600000,
        previousValue: 14200000,
        unit: 'CLP',
        trend: 'up',
        change: 1400000,
        changePercent: 9.9,
        category: 'assets',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'metric-006',
        name: 'Cuentas por Pagar',
        value: 8300000,
        previousValue: 9100000,
        unit: 'CLP',
        trend: 'down',
        change: -800000,
        changePercent: -8.8,
        category: 'debt',
        lastUpdated: new Date().toISOString()
      }
    ];

    setAlerts(mockAlerts);
    setMetrics(mockMetrics);
  }, []);

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simular pequeños cambios en las métricas
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * metric.value * 0.001,
        lastUpdated: new Date().toISOString()
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔶';
      case 'low': return 'ℹ️';
      default: return '📋';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'unresolved') return !alert.resolved;
    if (alertFilter === 'critical') return alert.type === 'critical';
    if (alertFilter === 'today') {
      const today = new Date().toDateString();
      return new Date(alert.timestamp).toDateString() === today;
    }
    return alert.category === alertFilter;
  });

  const alertStats = {
    total: alerts.length,
    critical: alerts.filter(a => a.type === 'critical' && !a.resolved).length,
    warning: alerts.filter(a => a.type === 'warning' && !a.resolved).length,
    unresolved: alerts.filter(a => !a.resolved).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Monitor Financiero en Tiempo Real</h1>
          <p className="text-gray-600 mt-2">
            Monitoreo automático de métricas financieras con alertas inteligentes
          </p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span className="mr-2">🕐 Última actualización:</span>
            <span>{lastUpdate.toLocaleTimeString('es-CL')}</span>
            <div className={`ml-3 w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="ml-1">{autoRefresh ? 'Actualizando' : 'Pausado'}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            {autoRefresh ? '⏸️ Pausar' : '▶️ Reanudar'}
          </Button>
          <Button
            onClick={() => {
              setLastUpdate(new Date());
              // Trigger manual refresh
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🔄 Actualizar
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">🚨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Críticas</p>
              <p className="text-2xl font-bold text-red-600">{alertStats.critical}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Advertencias</p>
              <p className="text-2xl font-bold text-yellow-600">{alertStats.warning}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sin Resolver</p>
              <p className="text-2xl font-bold text-gray-900">{alertStats.unresolved}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Alertas</p>
              <p className="text-2xl font-bold text-gray-900">{alertStats.total}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'alerts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🚨 Alertas ({alertStats.unresolved})
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'metrics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📈 Métricas
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'predictions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔮 Predicciones
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.slice(0, 6).map((metric) => (
              <Card key={metric.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                  <span className="text-2xl">{getTrendIcon(metric.trend)}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(metric.value)}
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className={`font-medium ${
                      metric.trend === 'up' 
                        ? metric.category === 'expense' || metric.category === 'debt' 
                          ? 'text-red-600' 
                          : 'text-green-600'
                        : metric.trend === 'down'
                        ? metric.category === 'expense' || metric.category === 'debt'
                          ? 'text-green-600'
                          : 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                      {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                    </span>
                    <span className="text-gray-500 ml-2">vs mes anterior</span>
                  </div>

                  {metric.target && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progreso vs meta</span>
                        <span>{((metric.value / metric.target) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress 
                        value={(metric.value / metric.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Critical Alerts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">🚨 Alertas Críticas Recientes</h3>
            <div className="space-y-3">
              {alerts.filter(a => a.type === 'critical' && !a.resolved).slice(0, 3).map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertTypeColor(alert.type)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{getImpactIcon(alert.impact)}</span>
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm mt-1">{alert.message}</p>
                        {alert.action && (
                          <p className="text-sm mt-2 font-medium">💡 {alert.action}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString('es-CL')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {alerts.filter(a => a.type === 'critical' && !a.resolved).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl block mb-2">✅</span>
                <p>No hay alertas críticas activas</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Alert Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={alertFilter}
              onChange={(e) => setAlertFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">🔍 Todas las alertas</option>
              <option value="unresolved">⏳ Sin resolver</option>
              <option value="critical">🚨 Críticas</option>
              <option value="today">📅 Hoy</option>
              <option value="cashflow">💰 Flujo de caja</option>
              <option value="budget">📊 Presupuesto</option>
              <option value="compliance">🏛️ Cumplimiento</option>
              <option value="revenue">📈 Ingresos</option>
              <option value="expense">📉 Gastos</option>
            </select>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`p-6 border-l-4 ${
                alert.type === 'critical' ? 'border-l-red-500' :
                alert.type === 'warning' ? 'border-l-yellow-500' :
                alert.type === 'info' ? 'border-l-blue-500' : 'border-l-green-500'
              } ${alert.resolved ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <span className="text-2xl">{getImpactIcon(alert.impact)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        <Badge className={getAlertTypeColor(alert.type)}>
                          {alert.type === 'critical' ? 'Crítica' :
                           alert.type === 'warning' ? 'Advertencia' :
                           alert.type === 'info' ? 'Información' : 'Éxito'}
                        </Badge>
                        {alert.resolved && (
                          <Badge className="bg-gray-100 text-gray-800">Resuelta</Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-3">{alert.message}</p>
                      
                      {alert.amount && (
                        <p className="text-sm text-gray-600 mb-2">
                          💰 Monto: <span className="font-medium">{formatCurrency(Math.abs(alert.amount))}</span>
                        </p>
                      )}
                      
                      {alert.relatedAccount && (
                        <p className="text-sm text-gray-600 mb-2">
                          🏦 Cuenta: <span className="font-medium">{alert.relatedAccount}</span>
                        </p>
                      )}
                      
                      {alert.action && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">💡 Acción recomendada:</span> {alert.action}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📅 {new Date(alert.timestamp).toLocaleString('es-CL')}</span>
                        <span>📂 {alert.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!alert.resolved && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setAlerts(prev => prev.map(a => 
                            a.id === alert.id ? { ...a, resolved: true } : a
                          ));
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        ✅ Resolver
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      👁️ Ver
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🎉</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay alertas que mostrar
              </h3>
              <p className="text-gray-600">
                {alertFilter === 'all' 
                  ? 'Todas las alertas han sido resueltas' 
                  : 'No se encontraron alertas con los filtros seleccionados'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric) => (
              <Card key={metric.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getTrendIcon(metric.trend)}</span>
                    <Badge className={`${
                      metric.trend === 'up' 
                        ? metric.category === 'expense' || metric.category === 'debt' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                        : metric.trend === 'down'
                        ? metric.category === 'expense' || metric.category === 'debt'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {metric.trend === 'up' ? 'Subiendo' : 
                       metric.trend === 'down' ? 'Bajando' : 'Estable'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {formatCurrency(metric.value)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Anterior: {formatCurrency(metric.previousValue)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cambio:</span>
                    <span className={`font-medium ${
                      metric.change > 0 
                        ? metric.category === 'expense' || metric.category === 'debt' 
                          ? 'text-red-600' 
                          : 'text-green-600'
                        : metric.change < 0
                        ? metric.category === 'expense' || metric.category === 'debt'
                          ? 'text-green-600'
                          : 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{formatCurrency(metric.change)} ({metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%)
                    </span>
                  </div>

                  {metric.target && (
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Meta: {formatCurrency(metric.target)}</span>
                        <span>{((metric.value / metric.target) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={Math.min((metric.value / metric.target) * 100, 100)} 
                        className="h-3"
                      />
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Actualizado: {new Date(metric.lastUpdated).toLocaleTimeString('es-CL')}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔮</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Predicciones Financieras con IA
            </h3>
            <p className="text-gray-600 mb-6">
              Próximamente: Predicciones inteligentes de flujo de caja y análisis predictivo
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="p-6 text-center">
                <div className="text-3xl mb-3">📈</div>
                <h4 className="font-semibold mb-2">Flujo de Caja</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Predicciones de 30, 60 y 90 días
                </p>
                <div className="text-lg font-bold text-blue-600">85% precisión</div>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold mb-2">Metas de Ingresos</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Probabilidad de alcanzar objetivos
                </p>
                <div className="text-lg font-bold text-green-600">92% posibilidad</div>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-3xl mb-3">⚠️</div>
                <h4 className="font-semibold mb-2">Riesgos Financieros</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Detección temprana de problemas
                </p>
                <div className="text-lg font-bold text-yellow-600">2 riesgos detectados</div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
