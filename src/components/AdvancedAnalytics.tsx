'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  Users,
  Building2,
  DollarSign,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  periodo: string;
  empresas: {
    total: number;
    activas: number;
    trial: number;
    basico: number;
    premium: number;
    nuevas: number;
    churn: number;
  };
  ingresos: {
    total: number;
    mensuales: number;
    proyectados: number;
    crecimiento: number;
  };
  usuarios: {
    total: number;
    activos: number;
    nuevos: number;
    engagament: number;
  };
  uso: {
    facturas: number;
    reportes: number;
    IA: number;
    documentos: number;
  };
  tendencias: Array<{
    fecha: string;
    empresas: number;
    ingresos: number;
    usuarios: number;
  }>;
}

interface KPICard {
  titulo: string;
  valor: string | number;
  cambio: number;
  icono: React.ReactNode;
  color: string;
  descripcion: string;
}

export default function AdvancedAnalytics() {
  const { esSuperAdmin } = useAuth();
  const [periodo, setPeriodo] = useState('30d');
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarAnalytics();
  }, [periodo, fechaInicio, fechaFin]);

  const cargarAnalytics = async () => {
    setIsLoading(true);
    
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockData: AnalyticsData = {
      periodo: `${fechaInicio.toLocaleDateString()} - ${fechaFin.toLocaleDateString()}`,
      empresas: {
        total: 125,
        activas: 118,
        trial: 15,
        basico: 65,
        premium: 38,
        nuevas: 8,
        churn: 2
      },
      ingresos: {
        total: 2450000,
        mensuales: 185000,
        proyectados: 2800000,
        crecimiento: 12.5
      },
      usuarios: {
        total: 847,
        activos: 732,
        nuevos: 56,
        engagament: 78.5
      },
      uso: {
        facturas: 15420,
        reportes: 3280,
        IA: 892,
        documentos: 7650
      },
      tendencias: [
        { fecha: '2024-11-25', empresas: 110, ingresos: 160000, usuarios: 650 },
        { fecha: '2024-12-02', empresas: 115, ingresos: 170000, usuarios: 680 },
        { fecha: '2024-12-09', empresas: 120, ingresos: 175000, usuarios: 720 },
        { fecha: '2024-12-16', empresas: 123, ingresos: 180000, usuarios: 780 },
        { fecha: '2024-12-23', empresas: 125, ingresos: 185000, usuarios: 847 }
      ]
    };

    setAnalytics(mockData);
    setIsLoading(false);
  };

  const exportarReporte = (formato: 'pdf' | 'excel') => {
    // Simular exportación
    const link = document.createElement('a');
    link.href = '#';
    link.download = `analytics_${new Date().toISOString().split('T')[0]}.${formato}`;
    link.click();
  };

  const kpis: KPICard[] = analytics ? [
    {
      titulo: 'Empresas Activas',
      valor: analytics.empresas.activas,
      cambio: ((analytics.empresas.nuevas - analytics.empresas.churn) / analytics.empresas.total) * 100,
      icono: <Building2 className="w-5 h-5" />,
      color: 'text-blue-600',
      descripcion: `${analytics.empresas.nuevas} nuevas, ${analytics.empresas.churn} churn`
    },
    {
      titulo: 'Ingresos Mensuales',
      valor: `$${(analytics.ingresos.mensuales / 1000).toFixed(0)}K`,
      cambio: analytics.ingresos.crecimiento,
      icono: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600',
      descripcion: 'Crecimiento mensual'
    },
    {
      titulo: 'Usuarios Activos',
      valor: analytics.usuarios.activos,
      cambio: (analytics.usuarios.nuevos / analytics.usuarios.total) * 100,
      icono: <Users className="w-5 h-5" />,
      color: 'text-purple-600',
      descripcion: `${analytics.usuarios.nuevos} nuevos usuarios`
    },
    {
      titulo: 'Engagement',
      valor: `${analytics.usuarios.engagament}%`,
      cambio: 5.2,
      icono: <Activity className="w-5 h-5" />,
      color: 'text-orange-600',
      descripcion: 'Actividad promedio'
    }
  ] : [];

  if (!esSuperAdmin()) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Restringido</h3>
          <p className="text-gray-600">Solo los SuperAdministradores pueden acceder a los analytics avanzados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart className="w-7 h-7 text-blue-600" />
            Analytics Avanzado
          </h2>
          <p className="text-gray-600 mt-1">
            Análisis detallado del rendimiento del sistema y empresas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => exportarReporte('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>

          <Button variant="outline" onClick={() => exportarReporte('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Filtros de Fecha Personalizada */}
      {periodo === 'custom' && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Desde:</span>
                <DatePicker
                  date={fechaInicio}
                  onDateChange={setFechaInicio}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Hasta:</span>
                <DatePicker
                  date={fechaFin}
                  onDateChange={setFechaFin}
                />
              </div>
              <Button onClick={cargarAnalytics}>Aplicar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {kpis.map((kpi, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-gray-100 ${kpi.color}`}>
                      {kpi.icono}
                    </div>
                    <div className="flex items-center gap-1">
                      {kpi.cambio > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        kpi.cambio > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(kpi.cambio).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">{kpi.titulo}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.valor}</p>
                    <p className="text-xs text-gray-500">{kpi.descripcion}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Distribución de Empresas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Distribución por Plan
                </CardTitle>
                <CardDescription>
                  Empresas por tipo de licencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Premium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{analytics.empresas.premium}</span>
                      <Badge variant="secondary">
                        {((analytics.empresas.premium / analytics.empresas.total) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Básico</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{analytics.empresas.basico}</span>
                      <Badge variant="secondary">
                        {((analytics.empresas.basico / analytics.empresas.total) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{analytics.empresas.trial}</span>
                      <Badge variant="secondary">
                        {((analytics.empresas.trial / analytics.empresas.total) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Uso de Funcionalidades
                </CardTitle>
                <CardDescription>
                  Funciones más utilizadas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Facturas Generadas</span>
                    <span className="text-sm font-medium">{analytics.uso.facturas.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Documentos Procesados</span>
                    <span className="text-sm font-medium">{analytics.uso.documentos.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reportes Generados</span>
                    <span className="text-sm font-medium">{analytics.uso.reportes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Consultas IA</span>
                    <span className="text-sm font-medium">{analytics.uso.IA.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tendencias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Tendencias de Crecimiento
              </CardTitle>
              <CardDescription>
                Evolución de métricas clave en el tiempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.tendencias.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">
                      {new Date(item.fecha).toLocaleDateString('es-CL')}
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-500" />
                        <span>{item.empresas} empresas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span>${(item.ingresos / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>{item.usuarios} usuarios</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Proyecciones */}
          <Card>
            <CardHeader>
              <CardTitle>Proyecciones</CardTitle>
              <CardDescription>
                Estimaciones basadas en tendencias actuales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Empresas (próximo mes)</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(analytics.empresas.total * 1.08)}
                  </p>
                  <p className="text-sm text-blue-600">+8% estimado</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Ingresos Proyectados</h4>
                  <p className="text-2xl font-bold text-green-600">
                    ${(analytics.ingresos.proyectados / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-green-600">+{analytics.ingresos.crecimiento}% estimado</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Usuarios (próximo mes)</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(analytics.usuarios.total * 1.15)}
                  </p>
                  <p className="text-sm text-purple-600">+15% estimado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
