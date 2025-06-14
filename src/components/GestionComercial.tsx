'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Crown,
  Star,
  Zap,
  Building2,
  Calculator,
  PieChart,
  BarChart3,
  Award,
  Briefcase,
  Package
} from 'lucide-react';

interface PlanComercial {
  id: string;
  nombre: string;
  tipo: 'software' | 'servicio' | 'contador_externo';
  precio: number;
  caracteristicas: string[];
  limitaciones: string[];
  clientesActuales: number;
  ingresoMensual: number;
  margenGanancia: number;
  crecimientoMensual: number;
}

interface MetricasComerciales {
  totalClientes: number;
  ingresoMensualRecurrente: number;
  ingresoAnualProyectado: number;
  clientesNuevosMes: number;
  churnRate: number;
  valorPromedioPorCliente: number;
  satisfaccionCliente: number;
}

const planesComerciales: PlanComercial[] = [
  {
    id: 'software_basico',
    nombre: 'Software Empresarial - Básico',
    tipo: 'software',
    precio: 19990,
    caracteristicas: [
      'Contabilidad completa',
      'Facturación electrónica',
      'F29 automático',
      'Hasta 5 empresas',
      'Soporte básico',
      'IA fiscal básica'
    ],
    limitaciones: [
      'Sin optimización avanzada',
      'Reportes limitados',
      'Sin análisis predictivo'
    ],
    clientesActuales: 145,
    ingresoMensual: 2898550,
    margenGanancia: 75,
    crecimientoMensual: 12
  },
  {
    id: 'software_premium',
    nombre: 'Software Empresarial - Premium',
    tipo: 'software',
    precio: 59990,
    caracteristicas: [
      'Todo del plan básico',
      'Optimización IA avanzada',
      'Empresas ilimitadas',
      'Análisis predictivo',
      'Soporte prioritario',
      'Integración bancaria',
      'Dashboard ejecutivo'
    ],
    limitaciones: [
      'Sin servicio contable personalizado'
    ],
    clientesActuales: 89,
    ingresoMensual: 5339110,
    margenGanancia: 80,
    crecimientoMensual: 18
  },
  {
    id: 'software_empresarial',
    nombre: 'Software Empresarial - Corporativo',
    tipo: 'software',
    precio: 89990,
    caracteristicas: [
      'Todo del plan premium',
      'API personalizada',
      'Integración ERP',
      'Soporte 24/7',
      'Onboarding dedicado',
      'Consultoría trimestral',
      'White-label disponible'
    ],
    limitaciones: [],
    clientesActuales: 28,
    ingresoMensual: 2519720,
    margenGanancia: 85,
    crecimientoMensual: 25
  },
  {
    id: 'servicio_pequena',
    nombre: 'Servicio Contable - PYME',
    tipo: 'servicio',
    precio: 150000,
    caracteristicas: [
      'Contabilidad completa',
      'Declaraciones automáticas',
      'Optimización fiscal IA',
      'Reuniones mensuales',
      'Asesoría tributaria',
      'Hasta 50 trabajadores'
    ],
    limitaciones: [
      'Una empresa por contrato'
    ],
    clientesActuales: 67,
    ingresoMensual: 10050000,
    margenGanancia: 65,
    crecimientoMensual: 8
  },
  {
    id: 'servicio_mediana',
    nombre: 'Servicio Contable - Mediana',
    tipo: 'servicio',
    precio: 350000,
    caracteristicas: [
      'Todo del plan PYME',
      'Múltiples empresas',
      'Contador dedicado',
      'Reuniones quincenales',
      'Análisis financiero',
      'Proyecciones de crecimiento',
      'Hasta 200 trabajadores'
    ],
    limitaciones: [],
    clientesActuales: 34,
    ingresoMensual: 11900000,
    margenGanancia: 70,
    crecimientoMensual: 15
  },
  {
    id: 'servicio_grande',
    nombre: 'Servicio Contable - Corporativo',
    tipo: 'servicio',
    precio: 800000,
    caracteristicas: [
      'Todo del plan mediano',
      'Equipo contable dedicado',
      'CFO virtual',
      'Reuniones semanales',
      'Auditoría interna',
      'Planificación estratégica',
      'Sin límite de trabajadores'
    ],
    limitaciones: [],
    clientesActuales: 12,
    ingresoMensual: 9600000,
    margenGanancia: 75,
    crecimientoMensual: 20
  },
  {
    id: 'contador_externo',
    nombre: 'Contador Externo - Profesional',
    tipo: 'contador_externo',
    precio: 49990,
    caracteristicas: [
      'Hasta 50 empresas',
      'Herramientas básicas',
      'Plantillas estándar',
      'Soporte técnico',
      'Capacitación inicial'
    ],
    limitaciones: [
      'Funciones limitadas vs admin',
      'Sin IA avanzada',
      'Sin optimización automática'
    ],
    clientesActuales: 156,
    ingresoMensual: 7798440,
    margenGanancia: 60,
    crecimientoMensual: 22
  }
];

export default function GestionComercial() {
  const [vistaActual, setVistaActual] = useState<'overview' | 'planes' | 'metricas' | 'proyecciones'>('overview');
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanComercial | null>(null);

  // Calcular métricas comerciales
  const metricas: MetricasComerciales = {
    totalClientes: planesComerciales.reduce((sum, plan) => sum + plan.clientesActuales, 0),
    ingresoMensualRecurrente: planesComerciales.reduce((sum, plan) => sum + plan.ingresoMensual, 0),
    ingresoAnualProyectado: planesComerciales.reduce((sum, plan) => sum + plan.ingresoMensual, 0) * 12,
    clientesNuevosMes: Math.round(planesComerciales.reduce((sum, plan) => sum + (plan.clientesActuales * plan.crecimientoMensual / 100), 0)),
    churnRate: 3.2,
    valorPromedioPorCliente: planesComerciales.reduce((sum, plan) => sum + plan.ingresoMensual, 0) / planesComerciales.reduce((sum, plan) => sum + plan.clientesActuales, 0),
    satisfaccionCliente: 4.7
  };

  if (vistaActual === 'overview') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión Comercial</h1>
            <p className="text-gray-600 mt-2">
              Administración de planes, precios y métricas de negocio • {metricas.totalClientes} clientes activos
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm bg-green-50 text-green-700">
              <DollarSign className="w-4 h-4 mr-1" />
              MRR: ${(metricas.ingresoMensualRecurrente / 1000000).toFixed(1)}M
            </Badge>
            <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700">
              <TrendingUp className="w-4 h-4 mr-1" />
              ARR: ${(metricas.ingresoAnualProyectado / 1000000).toFixed(1)}M
            </Badge>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">MRR Total</p>
                  <p className="text-3xl font-bold">${(metricas.ingresoMensualRecurrente / 1000000).toFixed(1)}M</p>
                  <p className="text-green-100 text-sm">Ingreso mensual recurrente</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Clientes Totales</p>
                  <p className="text-3xl font-bold">{metricas.totalClientes}</p>
                  <p className="text-blue-100 text-sm">+{metricas.clientesNuevosMes} este mes</p>
                </div>
                <Users className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">ARPU</p>
                  <p className="text-3xl font-bold">${Math.round(metricas.valorPromedioPorCliente / 1000)}K</p>
                  <p className="text-purple-100 text-sm">Valor promedio por cliente</p>
                </div>
                <Target className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Satisfacción</p>
                  <p className="text-3xl font-bold">{metricas.satisfaccionCliente}/5</p>
                  <p className="text-orange-100 text-sm">Rating promedio</p>
                </div>
                <Star className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegación de secciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500" 
                onClick={() => setVistaActual('planes')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Package className="w-6 h-6" />
                Gestión de Planes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Administrar planes y precios</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-blue-100 text-blue-800">
                  {planesComerciales.length} planes activos
                </Badge>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                  Administrar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500" 
                onClick={() => setVistaActual('metricas')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <BarChart3 className="w-6 h-6" />
                Métricas Detalladas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Análisis profundo de rendimiento</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-green-100 text-green-800">
                  {metricas.churnRate}% churn rate
                </Badge>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  Ver Análisis
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500" 
                onClick={() => setVistaActual('proyecciones')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <TrendingUp className="w-6 h-6" />
                Proyecciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Forecasting y crecimiento</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-purple-100 text-purple-800">
                  +{metricas.clientesNuevosMes} clientes/mes
                </Badge>
                <Button variant="outline" size="sm" className="text-purple-600 border-purple-600">
                  Ver Proyección
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen de planes por tipo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Software Empresarial */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Building2 className="w-5 h-5" />
                Software Empresarial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Clientes:</span>
                  <span className="font-semibold">
                    {planesComerciales.filter(p => p.tipo === 'software').reduce((sum, p) => sum + p.clientesActuales, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">MRR:</span>
                  <span className="font-semibold text-green-600">
                    ${(planesComerciales.filter(p => p.tipo === 'software').reduce((sum, p) => sum + p.ingresoMensual, 0) / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crecimiento:</span>
                  <span className="font-semibold text-blue-600">
                    +{Math.round(planesComerciales.filter(p => p.tipo === 'software').reduce((sum, p) => sum + (p.clientesActuales * p.crecimientoMensual / 100), 0))}/mes
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Servicio Contable */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Calculator className="w-5 h-5" />
                Servicio Contable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Clientes:</span>
                  <span className="font-semibold">
                    {planesComerciales.filter(p => p.tipo === 'servicio').reduce((sum, p) => sum + p.clientesActuales, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">MRR:</span>
                  <span className="font-semibold text-green-600">
                    ${(planesComerciales.filter(p => p.tipo === 'servicio').reduce((sum, p) => sum + p.ingresoMensual, 0) / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crecimiento:</span>
                  <span className="font-semibold text-blue-600">
                    +{Math.round(planesComerciales.filter(p => p.tipo === 'servicio').reduce((sum, p) => sum + (p.clientesActuales * p.crecimientoMensual / 100), 0))}/mes
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contador Externo */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Briefcase className="w-5 h-5" />
                Contador Externo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Contadores:</span>
                  <span className="font-semibold">
                    {planesComerciales.filter(p => p.tipo === 'contador_externo').reduce((sum, p) => sum + p.clientesActuales, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">MRR:</span>
                  <span className="font-semibold text-green-600">
                    ${(planesComerciales.filter(p => p.tipo === 'contador_externo').reduce((sum, p) => sum + p.ingresoMensual, 0) / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crecimiento:</span>
                  <span className="font-semibold text-blue-600">
                    +{Math.round(planesComerciales.filter(p => p.tipo === 'contador_externo').reduce((sum, p) => sum + (p.clientesActuales * p.crecimientoMensual / 100), 0))}/mes
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (vistaActual === 'planes') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Planes y Precios</h1>
            <p className="text-gray-600 mt-2">Administración completa de la estructura comercial</p>
          </div>
          <Button onClick={() => setVistaActual('overview')} variant="outline">
            Volver al Dashboard
          </Button>
        </div>

        <div className="grid gap-6">
          {planesComerciales.map((plan) => (
            <Card key={plan.id} className={`border-l-4 ${
              plan.tipo === 'software' ? 'border-l-blue-500' :
              plan.tipo === 'servicio' ? 'border-l-green-500' :
              'border-l-purple-500'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        plan.tipo === 'software' ? 'bg-blue-100' :
                        plan.tipo === 'servicio' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        {plan.tipo === 'software' ? <Building2 className="w-6 h-6 text-blue-600" /> :
                         plan.tipo === 'servicio' ? <Calculator className="w-6 h-6 text-green-600" /> :
                         <Briefcase className="w-6 h-6 text-purple-600" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{plan.nombre}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">
                            {plan.tipo.replace('_', ' ')}
                          </Badge>
                          <Badge className={`${
                            plan.margenGanancia >= 80 ? 'bg-green-100 text-green-800' :
                            plan.margenGanancia >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {plan.margenGanancia}% margen
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Características</h4>
                        <ul className="space-y-1">
                          {plan.caracteristicas.map((caracteristica, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              {caracteristica}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {plan.limitaciones.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Limitaciones</h4>
                          <ul className="space-y-1">
                            {plan.limitaciones.map((limitacion, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                {limitacion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">
                          ${plan.precio.toLocaleString('es-CL')}
                        </p>
                        <p className="text-sm text-gray-600">CLP/mes</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-lg font-semibold text-blue-600">{plan.clientesActuales}</p>
                          <p className="text-xs text-gray-600">Clientes</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-lg font-semibold text-green-600">
                            ${(plan.ingresoMensual / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-xs text-gray-600">MRR</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Editar Plan
                        </Button>
                        <Button size="sm" className={`${
                          plan.tipo === 'software' ? 'bg-blue-600 hover:bg-blue-700' :
                          plan.tipo === 'servicio' ? 'bg-green-600 hover:bg-green-700' :
                          'bg-purple-600 hover:bg-purple-700'
                        }`}>
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Otras vistas (metricas, proyecciones) se pueden agregar aquí
  return null;
}
