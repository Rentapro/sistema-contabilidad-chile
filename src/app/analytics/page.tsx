"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  FileText, 
  Clock,
  Download,
  Filter,
  RefreshCw,
  Target,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'

interface DateRange {
  from: Date | undefined
  to?: Date | undefined
}

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  // Datos simulados para analytics
  const kpis = [
    {
      title: 'Ingresos Totales',
      value: '$2,847,650',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Clientes Activos',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Facturas Emitidas',
      value: '3,891',
      change: '+15.3%',
      trend: 'up',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      title: 'Tiempo Promedio Cobro',
      value: '28 días',
      change: '-3.1%',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600'
    }
  ]

  const topClients = [
    { name: 'Empresa ABC S.A.', revenue: '$245,890', growth: '+18%', transactions: 156 },
    { name: 'Tecnología XYZ', revenue: '$198,750', growth: '+12%', transactions: 134 },
    { name: 'Servicios DEF', revenue: '$167,450', growth: '+8%', transactions: 98 },
    { name: 'Comercial GHI', revenue: '$145,320', growth: '+22%', transactions: 87 },
    { name: 'Industrias JKL', revenue: '$132,980', growth: '+5%', transactions: 76 }
  ]

  const revenueByCategory = [
    { category: 'Servicios Profesionales', amount: 850000, percentage: 35 },
    { category: 'Consultoría', amount: 650000, percentage: 27 },
    { category: 'Auditoría', amount: 480000, percentage: 20 },
    { category: 'Capacitación', amount: 290000, percentage: 12 },
    { category: 'Otros', amount: 145000, percentage: 6 }
  ]

  const monthlyMetrics = [
    { month: 'Ene', revenue: 180000, expenses: 125000, profit: 55000 },
    { month: 'Feb', revenue: 195000, expenses: 130000, profit: 65000 },
    { month: 'Mar', revenue: 210000, expenses: 140000, profit: 70000 },
    { month: 'Abr', revenue: 225000, expenses: 145000, profit: 80000 },
    { month: 'May', revenue: 240000, expenses: 150000, profit: 90000 },
    { month: 'Jun', revenue: 255000, expenses: 155000, profit: 100000 }
  ]

  const operationalMetrics = [
    { metric: 'Eficiencia Operacional', value: 87, target: 90, unit: '%' },
    { metric: 'Satisfacción del Cliente', value: 94, target: 95, unit: '%' },
    { metric: 'Tiempo de Respuesta', value: 78, target: 85, unit: '%' },
    { metric: 'Automatización de Procesos', value: 65, target: 80, unit: '%' },
    { metric: 'Cumplimiento Normativo', value: 98, target: 100, unit: '%' }
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics y Reportes</h1>
          <p className="text-gray-600 mt-2">
            Análisis completo del rendimiento empresarial y métricas clave
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros de Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="quarter">Último trimestre</SelectItem>
                  <SelectItem value="year">Último año</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Métrica Principal</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar métrica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Ingresos</SelectItem>
                  <SelectItem value="profit">Rentabilidad</SelectItem>
                  <SelectItem value="clients">Clientes</SelectItem>
                  <SelectItem value="efficiency">Eficiencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rango de Fechas</label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
                placeholder="Seleccionar rango"
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold mt-2">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pestañas de Análisis */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Ingresos
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Operaciones
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Rendimiento
          </TabsTrigger>
        </TabsList>

        {/* Análisis de Ingresos */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Tendencia de Ingresos Mensual
                </CardTitle>
                <CardDescription>
                  Evolución de ingresos, gastos y utilidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="font-medium">{metric.month}</span>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-green-600">${metric.revenue.toLocaleString()}</span>
                        <span className="text-red-600">${metric.expenses.toLocaleString()}</span>
                        <span className="text-blue-600 font-semibold">${metric.profit.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Ingresos por Categoría
                </CardTitle>
                <CardDescription>
                  Distribución de ingresos por tipo de servicio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByCategory.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="font-semibold">${item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Análisis de Clientes */}
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Top Clientes por Ingresos
              </CardTitle>
              <CardDescription>
                Clientes con mayor generación de ingresos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{client.name}</h4>
                      <p className="text-sm text-gray-600">{client.transactions} transacciones</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{client.revenue}</p>
                      <Badge variant="secondary" className="text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {client.growth}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis de Operaciones */}
        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Métricas Operacionales
              </CardTitle>
              <CardDescription>
                Indicadores de eficiencia y rendimiento operativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {operationalMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{metric.metric}</span>
                      <span className="text-sm text-gray-600">
                        {metric.value}{metric.unit} / {metric.target}{metric.unit}
                      </span>
                    </div>
                    <Progress value={(metric.value / metric.target) * 100} />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Actual: {metric.value}{metric.unit}</span>
                      <span>Meta: {metric.target}{metric.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis de Rendimiento */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Cumplimiento de Objetivos
                </CardTitle>
                <CardDescription>
                  Progreso hacia las metas establecidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Ingresos Anuales</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} />
                    <p className="text-xs text-gray-500 mt-1">$2.25M / $3M objetivo</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Nuevos Clientes</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} />
                    <p className="text-xs text-gray-500 mt-1">170 / 200 objetivo</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Satisfacción Cliente</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} />
                    <p className="text-xs text-gray-500 mt-1">4.7 / 5.0 objetivo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Resumen Ejecutivo
                </CardTitle>
                <CardDescription>
                  Indicadores clave de rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                    <h4 className="font-semibold text-green-800">Crecimiento Positivo</h4>
                    <p className="text-sm text-green-700">
                      Los ingresos han crecido 12.5% este período
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <h4 className="font-semibold text-blue-800">Alta Retención</h4>
                    <p className="text-sm text-blue-700">
                      94% de satisfacción del cliente
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                    <h4 className="font-semibold text-orange-800">Área de Mejora</h4>
                    <p className="text-sm text-orange-700">
                      Optimizar tiempo de respuesta operativa
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
