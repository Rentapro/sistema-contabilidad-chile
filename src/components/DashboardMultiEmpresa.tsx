'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Crown, Zap, Award, Target } from 'lucide-react';
import HeaderWithLogout from './HeaderWithLogout';

// Mock data simplificado
const mockEmpresas = [
  {
    id: '1',
    nombre: 'Empresa Ejemplo 1',
    rut: '12.345.678-9',
    ventasUltimos12Meses: 50000000
  },
  {
    id: '2', 
    nombre: 'Empresa Ejemplo 2',
    rut: '98.765.432-1',
    ventasUltimos12Meses: 75000000
  }
];

export default function DashboardMultiEmpresa() {
  const [empresasGestionadas] = useState(mockEmpresas);

  const ahorroTotal = 2500000;
  const eficienciaPromedio = 87;
  const ventasTotales = empresasGestionadas.reduce((sum, emp) => sum + emp.ventasUltimos12Meses, 0);
  const creditosFiscalesTotales = 1200000;

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithLogout 
        title="Dashboard Multi-Empresa"
        subtitle={`Gestión centralizada de ${empresasGestionadas.length} empresas • Ahorro total: $${ahorroTotal.toLocaleString('es-CL')}`}
      />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Badges informativos */}
          <div className="flex gap-2 justify-end">
            <Badge variant="outline" className="text-sm bg-green-50 text-green-700">
              <Crown className="w-4 h-4 mr-1" />
              Plan Premium
            </Badge>
            <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700">
              <Building2 className="w-4 h-4 mr-1" />
              {empresasGestionadas.length} empresas
            </Badge>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Ventas Consolidadas</p>
                    <p className="text-3xl font-bold">${(ventasTotales / 1000000).toFixed(1)}M</p>
                    <p className="text-blue-100 text-sm">Últimos 12 meses</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Ahorro Total IA</p>
                    <p className="text-3xl font-bold">${(ahorroTotal / 1000000).toFixed(1)}M</p>
                    <p className="text-green-100 text-sm">Optimización automática</p>
                  </div>
                  <Zap className="h-10 w-10 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Créditos Fiscales</p>
                    <p className="text-3xl font-bold">${(creditosFiscalesTotales / 1000000).toFixed(1)}M</p>
                    <p className="text-purple-100 text-sm">Disponibles</p>
                  </div>
                  <Award className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Eficiencia Promedio</p>
                    <p className="text-3xl font-bold">{eficienciaPromedio}%</p>
                    <p className="text-orange-100 text-sm">Automatización IA</p>
                  </div>
                  <Target className="h-10 w-10 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de empresas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Empresas Gestionadas ({empresasGestionadas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {empresasGestionadas.map((empresa) => (
                  <div
                    key={empresa.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">🏢</div>
                      <div>
                        <h3 className="font-semibold">{empresa.nombre}</h3>
                        <p className="text-sm text-gray-600">{empresa.rut}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        ${empresa.ventasUltimos12Meses.toLocaleString('es-CL')}
                      </div>
                      <div className="text-sm text-gray-500">Ventas anuales</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nota sobre el widget flotante */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">ℹ️</div>
                <div>
                  <h3 className="font-semibold text-blue-900">Widget de Logout Flotante</h3>
                  <p className="text-blue-700 text-sm">
                    Puedes cerrar sesión usando el widget flotante en la esquina superior derecha o desde el menú lateral.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}