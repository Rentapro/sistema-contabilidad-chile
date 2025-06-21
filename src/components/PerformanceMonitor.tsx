'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold: {
    warning: number;
    critical: number;
  };
  status: 'good' | 'warning' | 'critical';
  trend: Array<{
    timestamp: string;
    value: number;
  }>;
  category: 'system' | 'database' | 'network' | 'application';
  icon: string;
}

interface SystemResource {
  id: string;
  name: string;
  usage: number;
  available: number;
  total: number;
  status: 'good' | 'warning' | 'critical';
  processes: Array<{
    name: string;
    usage: number;
    pid: number;
  }>;
}

interface ServiceStatus {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'starting';
  uptime: string;
  lastRestart: string;
  healthCheck: 'pass' | 'fail' | 'unknown';
  dependencies: string[];
  port?: number;
  version: string;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [resources, setResources] = useState<SystemResource[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [activeTab, setActiveTab] = useState<'metrics' | 'resources' | 'services'>('metrics');
  const [loading, setLoading] = useState(true);

  const toast = ({ title, description, variant }: any) => {
    console.log('Toast:', { title, description, variant });
  };

  useEffect(() => {
    loadPerformanceData();
    const interval = setInterval(updateMetrics, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceData = async () => {
    try {
      // Simulación de métricas de performance
      const mockMetrics: PerformanceMetric[] = [
        {
          id: 'cpu',
          name: 'CPU Usage',
          value: 24.5,
          unit: '%',
          threshold: { warning: 70, critical: 90 },
          status: 'good',
          trend: generateTrendData(20, 30),
          category: 'system',
          icon: '🖥️'
        },
        {
          id: 'memory',
          name: 'Memory Usage',
          value: 68.2,
          unit: '%',
          threshold: { warning: 80, critical: 95 },
          status: 'good',
          trend: generateTrendData(65, 75),
          category: 'system',
          icon: '🧠'
        },
        {
          id: 'disk',
          name: 'Disk I/O',
          value: 15.8,
          unit: 'MB/s',
          threshold: { warning: 50, critical: 80 },
          status: 'good',
          trend: generateTrendData(10, 25),
          category: 'system',
          icon: '💾'
        },
        {
          id: 'network',
          name: 'Network Latency',
          value: 45,
          unit: 'ms',
          threshold: { warning: 100, critical: 200 },
          status: 'good',
          trend: generateTrendData(40, 60),
          category: 'network',
          icon: '🌐'
        },
        {
          id: 'db-connections',
          name: 'DB Connections',
          value: 35,
          unit: 'conns',
          threshold: { warning: 80, critical: 100 },
          status: 'good',
          trend: generateTrendData(30, 45),
          category: 'database',
          icon: '🗄️'
        },
        {
          id: 'response-time',
          name: 'Response Time',
          value: 235,
          unit: 'ms',
          threshold: { warning: 500, critical: 1000 },
          status: 'good',
          trend: generateTrendData(200, 300),
          category: 'application',
          icon: '⚡'
        },
        {
          id: 'error-rate',
          name: 'Error Rate',
          value: 0.8,
          unit: '%',
          threshold: { warning: 2, critical: 5 },
          status: 'good',
          trend: generateTrendData(0.5, 1.5),
          category: 'application',
          icon: '❌'
        },
        {
          id: 'throughput',
          name: 'Throughput',
          value: 1247,
          unit: 'req/min',
          threshold: { warning: 500, critical: 200 },
          status: 'good',
          trend: generateTrendData(1000, 1500),
          category: 'application',
          icon: '📈'
        }
      ];

      // Simulación de recursos del sistema
      const mockResources: SystemResource[] = [
        {
          id: 'cpu',
          name: 'CPU',
          usage: 24.5,
          available: 75.5,
          total: 100,
          status: 'good',
          processes: [
            { name: 'nextjs-server', usage: 8.2, pid: 1234 },
            { name: 'postgres', usage: 6.1, pid: 5678 },
            { name: 'redis', usage: 2.3, pid: 9101 },
            { name: 'nginx', usage: 1.8, pid: 1121 }
          ]
        },
        {
          id: 'memory',
          name: 'Memory',
          usage: 68.2,
          available: 31.8,
          total: 100,
          status: 'good',
          processes: [
            { name: 'nextjs-server', usage: 25.4, pid: 1234 },
            { name: 'postgres', usage: 18.7, pid: 5678 },
            { name: 'redis', usage: 12.3, pid: 9101 },
            { name: 'system', usage: 11.8, pid: 0 }
          ]
        },
        {
          id: 'disk',
          name: 'Disk Space',
          usage: 76.3,
          available: 23.7,
          total: 100,
          status: 'warning',
          processes: [
            { name: 'database', usage: 45.2, pid: 0 },
            { name: 'logs', usage: 15.8, pid: 0 },
            { name: 'uploads', usage: 8.9, pid: 0 },
            { name: 'system', usage: 6.4, pid: 0 }
          ]
        }
      ];

      // Simulación de servicios
      const mockServices: ServiceStatus[] = [
        {
          id: 'nextjs',
          name: 'Next.js Server',
          status: 'running',
          uptime: '2d 14h 32m',
          lastRestart: '2024-01-13 09:15:00',
          healthCheck: 'pass',
          dependencies: ['postgres', 'redis'],
          port: 3000,
          version: '14.0.0'
        },
        {
          id: 'postgres',
          name: 'PostgreSQL Database',
          status: 'running',
          uptime: '7d 3h 45m',
          lastRestart: '2024-01-08 15:30:00',
          healthCheck: 'pass',
          dependencies: [],
          port: 5432,
          version: '15.4'
        },
        {
          id: 'redis',
          name: 'Redis Cache',
          status: 'running',
          uptime: '4d 22h 10m',
          lastRestart: '2024-01-10 12:05:00',
          healthCheck: 'pass',
          dependencies: [],
          port: 6379,
          version: '7.0.11'
        },
        {
          id: 'nginx',
          name: 'Nginx Proxy',
          status: 'running',
          uptime: '15d 8h 22m',
          lastRestart: '2023-12-30 16:45:00',
          healthCheck: 'pass',
          dependencies: [],
          port: 80,
          version: '1.24.0'
        },
        {
          id: 'email',
          name: 'Email Service',
          status: 'stopped',
          uptime: '0',
          lastRestart: '2024-01-15 10:00:00',
          healthCheck: 'fail',
          dependencies: [],
          version: '1.0.3'
        }
      ];

      setMetrics(mockMetrics);
      setResources(mockResources);
      setServices(mockServices);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos de performance:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de performance",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const generateTrendData = (min: number, max: number) => {
    return Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 300000).toISOString(),
      value: Math.random() * (max - min) + min
    }));
  };

  const updateMetrics = () => {
    setMetrics(prev => 
      prev.map(metric => {
        const variance = metric.value * 0.1; // 10% de variación
        const newValue = Math.max(0, metric.value + (Math.random() - 0.5) * variance);
        
        let status: 'good' | 'warning' | 'critical' = 'good';
        if (newValue >= metric.threshold.critical) {
          status = 'critical';
        } else if (newValue >= metric.threshold.warning) {
          status = 'warning';
        }

        return {
          ...metric,
          value: parseFloat(newValue.toFixed(1)),
          status,
          trend: [
            ...metric.trend.slice(1),
            {
              timestamp: new Date().toISOString(),
              value: newValue
            }
          ]
        };
      })
    );
  };

  const restartService = (serviceId: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { 
              ...service, 
              status: 'starting',
              lastRestart: new Date().toLocaleString()
            }
          : service
      )
    );

    // Simular reinicio
    setTimeout(() => {
      setServices(prev => 
        prev.map(service => 
          service.id === serviceId 
            ? { 
                ...service, 
                status: 'running',
                uptime: '0m',
                healthCheck: 'pass'
              }
            : service
        )
      );
      toast({
        title: "Servicio Reiniciado",
        description: `${serviceId} se ha reiniciado correctamente`,
      });
    }, 3000);

    toast({
      title: "Reiniciando Servicio",
      description: `Reiniciando ${serviceId}...`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
      case 'running':
      case 'pass': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical':
      case 'error':
      case 'fail': return 'bg-red-100 text-red-800';
      case 'stopped': return 'bg-gray-100 text-gray-800';
      case 'starting': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system': return 'bg-blue-100 text-blue-800';
      case 'database': return 'bg-green-100 text-green-800';
      case 'network': return 'bg-purple-100 text-purple-800';
      case 'application': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Monitor de Performance</h1>
            <p className="mt-2 text-gray-600">
              Monitoreo en tiempo real del rendimiento del sistema y servicios
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={loadPerformanceData}
              variant="outline"
            >
              🔄 Actualizar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              📥 Exportar Reporte
            </Button>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sistema</p>
                <p className="text-2xl font-bold text-green-600">Estable</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Servicios Activos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {services.filter(s => s.status === 'running').length}/{services.length}
                </p>
              </div>
              <div className="text-2xl">🔧</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Críticas</p>
                <p className="text-2xl font-bold text-red-600">
                  {metrics.filter(m => m.status === 'critical').length}
                </p>
              </div>
              <div className="text-2xl">🚨</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-green-600">99.8%</p>
              </div>
              <div className="text-2xl">⏱️</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'metrics', label: 'Métricas', icon: '📈' },
              { id: 'resources', label: 'Recursos', icon: '🖥️' },
              { id: 'services', label: 'Servicios', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido por Tab */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{metric.icon}</span>
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                  </div>
                  <Badge className={getCategoryColor(metric.category)}>
                    {metric.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">
                      {metric.value} {metric.unit}
                    </span>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={metric.value} 
                    max={metric.threshold.critical}
                    className="h-2"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span className="text-yellow-600">
                      ⚠️ {metric.threshold.warning}
                    </span>
                    <span className="text-red-600">
                      🚨 {metric.threshold.critical}
                    </span>
                  </div>
                </div>

                {/* Mini gráfico de tendencia */}
                <div className="h-16 bg-gray-50 rounded p-2">
                  <div className="flex items-end h-full space-x-1">
                    {metric.trend.slice(-10).map((point, index) => (
                      <div
                        key={index}
                        className="bg-blue-500 rounded-sm"
                        style={{
                          height: `${(point.value / metric.threshold.critical) * 100}%`,
                          width: '8px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-6">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{resource.name}</CardTitle>
                  <Badge className={getStatusColor(resource.status)}>
                    {resource.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Uso General</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>En Uso:</span>
                        <span className="font-medium">{resource.usage.toFixed(1)}%</span>
                      </div>
                      <Progress value={resource.usage} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Disponible: {resource.available.toFixed(1)}%</span>
                        <span>Total: {resource.total}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Top Procesos</h4>
                    <div className="space-y-2">
                      {resource.processes.slice(0, 4).map((process, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="text-sm font-medium">{process.name}</span>
                            {process.pid > 0 && (
                              <span className="text-xs text-gray-500 ml-2">PID: {process.pid}</span>
                            )}
                          </div>
                          <span className="text-sm font-medium">{process.usage.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>v{service.version}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                    <Badge className={getStatusColor(service.healthCheck)}>
                      {service.healthCheck}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Uptime:</span>
                      <div className="font-medium">{service.uptime}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Puerto:</span>
                      <div className="font-medium">{service.port || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Último Reinicio:</span>
                      <div className="font-medium text-xs">{service.lastRestart}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Health Check:</span>
                      <div className="font-medium">{service.healthCheck}</div>
                    </div>
                  </div>

                  {service.dependencies.length > 0 && (
                    <div>
                      <span className="text-gray-600 text-sm">Dependencias:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.dependencies.map(dep => (
                          <Badge key={dep} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => restartService(service.id)}
                      disabled={service.status === 'starting'}
                    >
                      🔄 Reiniciar
                    </Button>
                    <Button size="sm" variant="outline">
                      📋 Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
