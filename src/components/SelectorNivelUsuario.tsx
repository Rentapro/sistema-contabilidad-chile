'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Building2, 
  Calculator, 
  Briefcase,
  Check,
  Star,
  Zap,
  Users,
  BarChart3,
  Shield
} from 'lucide-react';

interface NivelUsuario {
  id: string;
  nombre: string;
  tipo: 'admin' | 'empresa_propia' | 'contador_externo' | 'cliente_software';
  descripcion: string;
  icono: React.ReactNode;
  color: string;
  caracteristicas: string[];
  limitaciones: string[];
  precio?: string;
  empresasMaximas?: number;
  funcionesIA: boolean;
  dashboard: string;
}

const nivelesUsuario: NivelUsuario[] = [
  {
    id: 'admin',
    nombre: 'Administrador Principal',
    tipo: 'admin',
    descripcion: 'Control total del sistema multi-tenant con IA fiscal avanzada',
    icono: <Crown className="w-8 h-8 text-yellow-600" />,
    color: 'border-yellow-500 bg-yellow-50',
    caracteristicas: [
      'Dashboard multi-empresa completo',
      'IA fiscal avanzada con optimización automática',
      'Top 10 créditos fiscales y obligaciones',
      'Gestión comercial y métricas de negocio',
      'Empresas ilimitadas',
      'Todos los reportes SII automatizados',
      'Análisis predictivo de ahorro',
      'Panel de administración completo'
    ],
    limitaciones: [],
    funcionesIA: true,
    dashboard: 'DashboardCompleto + DashboardMultiEmpresa'
  },
  {
    id: 'empresa_propia',
    nombre: 'Cliente Software Empresarial',
    tipo: 'empresa_propia',
    descripcion: 'Empresa que compra el software para gestionar su propia contabilidad',
    icono: <Building2 className="w-8 h-8 text-blue-600" />,
    color: 'border-blue-500 bg-blue-50',
    caracteristicas: [
      'Dashboard empresarial completo',
      'IA fiscal básica/premium según plan',
      'Reportes SII automatizados',
      'Centro de documentos',
      'DTE electrónico',
      'Calendario tributario',
      'Simulador de multas',
      'Soporte técnico'
    ],
    limitaciones: [
      'Sin gestión multi-empresa avanzada',
      'Sin métricas comerciales',
      'IA limitada según plan'
    ],
    precio: '$19.990 - $89.990 CLP/mes',
    empresasMaximas: 5,
    funcionesIA: true,
    dashboard: 'DashboardCompleto'
  },
  {
    id: 'servicio_contable',
    nombre: 'Cliente Servicio Contable',
    tipo: 'empresa_propia',
    descripcion: 'Empresa que contrata nuestro servicio contable completo',
    icono: <Calculator className="w-8 h-8 text-green-600" />,
    color: 'border-green-500 bg-green-50',
    caracteristicas: [
      'Servicio contable completo',
      'Contador dedicado con IA avanzada',
      'Optimización fiscal garantizada',
      'Declaraciones automáticas',
      'Reuniones periódicas',
      'Asesoría tributaria especializada',
      'Análisis financiero',
      'Garantía de mínimo pago de impuestos'
    ],
    limitaciones: [
      'No acceso directo al sistema',
      'Reportes a través del contador'
    ],
    precio: '$150.000 - $800.000 CLP/mes',
    funcionesIA: false, // Lo maneja el contador
    dashboard: 'Reportes por email/reuniones'
  },
  {
    id: 'contador_externo',
    nombre: 'Contador Externo',
    tipo: 'contador_externo',
    descripcion: 'Contador independiente que usa herramientas básicas para sus clientes',
    icono: <Briefcase className="w-8 h-8 text-purple-600" />,
    color: 'border-purple-500 bg-purple-50',
    caracteristicas: [
      'Dashboard simplificado',
      'Gestión hasta 50 empresas',
      'Herramientas básicas de contabilidad',
      'F29 automático',
      'Plantillas estándar',
      'Calendario de vencimientos',
      'Soporte técnico básico'
    ],
    limitaciones: [
      'Sin IA fiscal avanzada',
      'Sin optimización automática',
      'Sin rankings de créditos fiscales',
      'Funciones muy limitadas vs admin',
      'Sin análisis predictivo'
    ],
    precio: '$49.990 CLP/mes',
    empresasMaximas: 50,
    funcionesIA: false,
    dashboard: 'DashboardContadorExterno'
  }
];

export default function SelectorNivelUsuario() {
  const [nivelSeleccionado, setNivelSeleccionado] = useState<NivelUsuario | null>(null);
  const [vistaActual, setVistaActual] = useState<'selector' | 'comparacion'>('selector');

  if (vistaActual === 'selector') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Selecciona tu Nivel de Acceso</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestro sistema multi-tenant ofrece 3 modelos de negocio diferentes según tus necesidades
          </p>
          <Button 
            onClick={() => setVistaActual('comparacion')} 
            variant="outline"
            className="mt-4"
          >
            Ver Comparación Detallada
          </Button>
        </div>

        {/* Niveles de usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {nivelesUsuario.map((nivel) => (
            <Card 
              key={nivel.id} 
              className={`${nivel.color} border-2 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                nivelSeleccionado?.id === nivel.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setNivelSeleccionado(nivel)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {nivel.icono}
                </div>
                <CardTitle className="text-2xl">{nivel.nombre}</CardTitle>
                <p className="text-gray-600 mt-2">{nivel.descripcion}</p>
                {nivel.precio && (
                  <Badge variant="outline" className="text-lg p-2 mt-3">
                    {nivel.precio}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Características Principales
                  </h4>
                  <ul className="space-y-1">
                    {nivel.caracteristicas.slice(0, 4).map((caracteristica, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {caracteristica}
                      </li>
                    ))}
                  </ul>
                  {nivel.caracteristicas.length > 4 && (
                    <p className="text-sm text-blue-600 mt-2">
                      +{nivel.caracteristicas.length - 4} características más...
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    {nivel.funcionesIA && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Zap className="w-3 h-3 mr-1" />
                        IA Fiscal
                      </Badge>
                    )}
                    {nivel.empresasMaximas && (
                      <Badge variant="outline">
                        <Building2 className="w-3 h-3 mr-1" />
                        Máx {nivel.empresasMaximas}
                      </Badge>
                    )}
                  </div>
                  <Button 
                    className={`${
                      nivel.tipo === 'admin' ? 'bg-yellow-600 hover:bg-yellow-700' :
                      nivel.tipo === 'empresa_propia' ? 'bg-blue-600 hover:bg-blue-700' :
                      nivel.tipo === 'contador_externo' ? 'bg-purple-600 hover:bg-purple-700' :
                      'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    Seleccionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información del modelo de negocio */}
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-blue-700">
              🚀 Modelo de Negocio Multi-Tenant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-700">1. Venta de Software</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Empresas compran licencias para gestionar su propia contabilidad
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                  <Calculator className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-700">2. Servicio Contable</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Ofrecemos servicio contable completo con IA de optimización
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-700">3. Contador Externo</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Contadores independientes usan herramientas básicas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vistaActual === 'comparacion') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comparación de Niveles</h1>
            <p className="text-gray-600 mt-2">Funcionalidades detalladas por tipo de usuario</p>
          </div>
          <Button onClick={() => setVistaActual('selector')} variant="outline">
            Volver al Selector
          </Button>
        </div>

        {/* Tabla de comparación */}
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Funcionalidad</th>
                    {nivelesUsuario.map(nivel => (
                      <th key={nivel.id} className="text-center p-4 font-semibold">
                        <div className="flex flex-col items-center">
                          {nivel.icono}
                          <span className="mt-2 text-sm">{nivel.nombre}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">IA Fiscal Avanzada</td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4">❌</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Dashboard Multi-Empresa</td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4">❌</td>
                    <td className="text-center p-4">❌</td>
                    <td className="text-center p-4">❌</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Optimización Automática</td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4">❌</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Rankings de Créditos</td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4">❌</td>
                    <td className="text-center p-4">❌</td>
                    <td className="text-center p-4">❌</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Gestión Comercial</td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4">❌</td>
                    <td className="text-center p-4">❌</td>
                    <td className="text-center p-4">❌</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Reportes SII Completos</td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center p-4">⚠️ Básicos</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Precio Mensual</td>
                    <td className="text-center p-4 text-yellow-600 font-semibold">Admin</td>
                    <td className="text-center p-4 text-blue-600 font-semibold">$19K-89K</td>
                    <td className="text-center p-4 text-green-600 font-semibold">$150K-800K</td>
                    <td className="text-center p-4 text-purple-600 font-semibold">$49K</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Métricas de negocio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-blue-700">531 Clientes</h3>
              <p className="text-blue-600">Activos en todos los planes</p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-green-700">$50.1M MRR</h3>
              <p className="text-green-600">Ingreso mensual recurrente</p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-purple-700">88% Eficiencia</h3>
              <p className="text-purple-600">Promedio de optimización fiscal</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
