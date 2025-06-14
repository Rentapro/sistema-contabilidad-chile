'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Star,
  Target,
  PieChart,
  BarChart3,
  Calculator,
  Briefcase,
  Crown,
  Zap,
  Award
} from 'lucide-react';
import { 
  empresas, 
  usuarioActual, 
  obtenerTopCreditosFiscales, 
  obtenerTopImpuestosAPagar,
  calcularAhorroTotal,
  obtenerEficienciaPromedio,
  obtenerEmpresasPorPropietario,
  type Empresa 
} from '@/data/empresas-multitenant';

export default function DashboardMultiEmpresa() {
  const [empresasGestionadas, setEmpresasGestionadas] = useState<Empresa[]>([]);
  const [vistaActual, setVistaActual] = useState<'overview' | 'creditos' | 'impuestos' | 'eficiencia'>('overview');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | null>(null);

  useEffect(() => {
    // Filtrar empresas según el usuario actual
    const empresasDelUsuario = empresas.filter(emp => 
      usuarioActual.empresasAsignadas.includes(emp.id) || usuarioActual.tipo === 'admin'
    );
    setEmpresasGestionadas(empresasDelUsuario);
  }, []);

  const topCreditosFiscales = obtenerTopCreditosFiscales();
  const topImpuestosAPagar = obtenerTopImpuestosAPagar();
  const ahorroTotal = calcularAhorroTotal();
  const eficienciaPromedio = obtenerEficienciaPromedio();

  // Métricas consolidadas
  const ventasTotales = empresasGestionadas.reduce((sum, emp) => sum + emp.metricas.ventasUltimos12Meses, 0);
  const ivaTotalPromedio = empresasGestionadas.reduce((sum, emp) => sum + emp.metricas.ivaPromedio, 0);
  const creditosFiscalesTotales = empresasGestionadas.reduce((sum, emp) => sum + emp.metricas.creditosFiscales, 0);

  if (vistaActual === 'overview') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Multi-Empresa</h1>
            <p className="text-gray-600 mt-2">
              Gestión centralizada de {empresasGestionadas.length} empresas • Ahorro total: ${ahorroTotal.toLocaleString('es-CL')}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm bg-green-50 text-green-700">
              <Crown className="w-4 h-4 mr-1" />
              Plan {usuarioActual.planActivo}
            </Badge>
            <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700">
              <Building2 className="w-4 h-4 mr-1" />
              {empresasGestionadas.length} empresas
            </Badge>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Ventas Consolidadas</p>
                  <p className="text-3xl font-bold">${(ventasTotales / 1000000000).toFixed(1)}B</p>
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
                  <p className="text-orange-100 text-sm">Optimización tributaria</p>
                </div>
                <Target className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegación de secciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500" 
                onClick={() => setVistaActual('creditos')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Star className="w-6 h-6" />
                Top Créditos Fiscales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Empresas con más oportunidades de ahorro</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-green-100 text-green-800">
                  {topCreditosFiscales.length} empresas
                </Badge>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  Ver Ranking
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-red-500" 
                onClick={() => setVistaActual('impuestos')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-6 h-6" />
                Top Impuestos a Pagar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Empresas que más impuestos deben pagar</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-red-100 text-red-800">
                  {topImpuestosAPagar.length} empresas
                </Badge>
                <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                  Ver Ranking
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500" 
                onClick={() => setVistaActual('eficiencia')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <BarChart3 className="w-6 h-6" />
                Análisis de Eficiencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Rendimiento de optimización por empresa</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-blue-100 text-blue-800">
                  {eficienciaPromedio}% promedio
                </Badge>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                  Ver Análisis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>        {/* Sugerencias de Facturas Cruzadas IA */}
        <Card className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Zap className="w-7 h-7 text-yellow-300" />
              </div>
              🤖 IA Fiscal: Oportunidades de Facturas Cruzadas
            </CardTitle>
            <p className="text-purple-100 text-lg mt-2">
              Ahorro automático detectado: <span className="font-bold text-yellow-300">$2.128.000</span> anuales
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              
              {/* Contador de oportunidades */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-300">4</div>
                  <div className="text-purple-200 text-sm">Oportunidades</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-300">18%</div>
                  <div className="text-purple-200 text-sm">Reducción IVA</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-300">60</div>
                  <div className="text-purple-200 text-sm">Días para implementar</div>
                </div>
              </div>

              {/* Lista compacta de sugerencias */}
              <div className="space-y-4">
                
                {/* Sugerencia 1 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white">TechSolutions → RetailMax</h4>
                        <p className="text-purple-200">Servicios IT: $3.2M + IVA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-300">$512K</div>
                      <div className="text-green-200 text-sm">ahorro anual</div>
                    </div>
                    <Button 
                      className="ml-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      size="sm"
                    >
                      Generar Factura
                    </Button>
                  </div>
                </div>

                {/* Sugerencia 2 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white">LogisticsPro → TechSolutions</h4>
                        <p className="text-purple-200">Transporte: $1.8M + IVA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-300">$288K</div>
                      <div className="text-green-200 text-sm">ahorro anual</div>
                    </div>
                    <Button 
                      className="ml-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      size="sm"
                    >
                      Generar Factura
                    </Button>
                  </div>
                </div>

                {/* Sugerencia 3 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white">ManufacturingCorp → LogisticsPro</h4>
                        <p className="text-purple-200">Distribución: $2.9M + IVA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-300">$464K</div>
                      <div className="text-green-200 text-sm">ahorro anual</div>
                    </div>
                    <Button 
                      className="ml-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      size="sm"
                    >
                      Generar Factura
                    </Button>
                  </div>
                </div>

                {/* Sugerencia 4 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white">RetailMax → ManufacturingCorp</h4>
                        <p className="text-purple-200">Productos: $5.4M + IVA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-300">$864K</div>
                      <div className="text-green-200 text-sm">ahorro anual</div>
                    </div>
                    <Button 
                      className="ml-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      size="sm"
                    >
                      Generar Factura
                    </Button>
                  </div>
                </div>
              </div>

              {/* Acciones principales */}
              <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-white/20">
                <Button 
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold py-4 text-lg shadow-lg"
                  onClick={() => alert('Función: Generar todas las facturas automáticamente')}
                >
                  <Zap className="w-6 h-6 mr-3" />
                  Generar Todas las Facturas (4)
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1 border-white/30 text-white hover:bg-white/10 font-semibold py-4 text-lg"
                  onClick={() => alert('Función: Programar facturas para fechas óptimas')}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Programar Automáticamente
                </Button>

                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-6"
                  onClick={() => alert('Función: Ver análisis detallado de optimización')}
                >
                  <PieChart className="w-5 h-5 mr-2" />
                  Ver Análisis
                </Button>
              </div>

              {/* Alerta de tiempo */}
              <div className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-4 border border-amber-400/30">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-300 flex-shrink-0" />
                  <div>
                    <p className="text-amber-100 font-bold">
                      ⏰ Oportunidad Limitada: Implementar antes del 15 de junio
                    </p>
                    <p className="text-amber-200 text-sm mt-1">
                      Para maximizar créditos fiscales del período actual. La IA programará automáticamente las fechas óptimas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de empresas gestionadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Empresas Bajo Gestión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {empresasGestionadas.map((empresa) => (
                <div key={empresa.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{empresa.razonSocial}</h3>
                      <p className="text-sm text-gray-600">{empresa.giro} • {empresa.rut}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {empresa.tipoCliente.replace('_', ' ')}
                        </Badge>
                        <Badge className={`text-xs ${
                          empresa.metricas.eficienciaTributaria >= 80 ? 'bg-green-100 text-green-800' :
                          empresa.metricas.eficienciaTributaria >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {empresa.metricas.eficienciaTributaria}% eficiencia
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      ${empresa.metricas.impuestosAhorrados.toLocaleString('es-CL')}
                    </p>
                    <p className="text-sm text-gray-600">ahorrado</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setEmpresaSeleccionada(empresa)}
                    >
                      Ver Detalle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas y recomendaciones */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Zap className="w-5 h-5" />
              Recomendaciones IA Fiscal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-green-700 mb-2">💡 Oportunidad de Ahorro</h4>
                <p className="text-sm text-gray-600">
                  3 empresas pueden optimizar créditos fiscales por $2.4M adicionales este mes
                </p>
                <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                  Optimizar Ahora
                </Button>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-blue-700 mb-2">📊 Análisis Predictivo</h4>
                <p className="text-sm text-gray-600">
                  Proyección de ahorro para próximo trimestre: $8.7M con estrategias IA
                </p>
                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                  Ver Proyección
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vistaActual === 'creditos') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Top 10 - Créditos Fiscales</h1>
            <p className="text-gray-600 mt-2">Empresas con mayores oportunidades de optimización</p>
          </div>
          <Button onClick={() => setVistaActual('overview')} variant="outline">
            Volver al Dashboard
          </Button>
        </div>

        <div className="grid gap-4">
          {topCreditosFiscales.map((empresa, index) => (
            <Card key={empresa.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index < 3 ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{empresa.razonSocial}</h3>
                      <p className="text-gray-600">{empresa.giro}</p>
                      <Badge variant="outline" className="mt-1">
                        {empresa.tipoCliente.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${empresa.metricas.creditosFiscales.toLocaleString('es-CL')}
                    </p>
                    <p className="text-sm text-gray-600">Créditos disponibles</p>
                    <p className="text-sm text-green-600 font-semibold">
                      Ahorro potencial: ${Math.round(empresa.metricas.creditosFiscales * 0.15).toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (vistaActual === 'impuestos') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Top 10 - Impuestos a Pagar</h1>
            <p className="text-gray-600 mt-2">Empresas con mayores obligaciones tributarias</p>
          </div>
          <Button onClick={() => setVistaActual('overview')} variant="outline">
            Volver al Dashboard
          </Button>
        </div>

        <div className="grid gap-4">
          {topImpuestosAPagar.map((empresa, index) => (
            <Card key={empresa.id} className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index < 3 ? 'bg-red-500' : 'bg-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{empresa.razonSocial}</h3>
                      <p className="text-gray-600">{empresa.giro}</p>
                      <Badge variant="outline" className="mt-1">
                        {empresa.tipoCliente.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">
                      ${empresa.metricas.ivaPromedio.toLocaleString('es-CL')}
                    </p>
                    <p className="text-sm text-gray-600">IVA promedio mensual</p>
                    <p className="text-sm text-blue-600 font-semibold">
                      Ya ahorrado: ${empresa.metricas.impuestosAhorrados.toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (vistaActual === 'eficiencia') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Análisis de Eficiencia Tributaria</h1>
            <p className="text-gray-600 mt-2">Rendimiento de optimización por empresa</p>
          </div>
          <Button onClick={() => setVistaActual('overview')} variant="outline">
            Volver al Dashboard
          </Button>
        </div>

        <div className="grid gap-4">
          {empresasGestionadas
            .sort((a, b) => b.metricas.eficienciaTributaria - a.metricas.eficienciaTributaria)
            .map((empresa, index) => (
            <Card key={empresa.id} className={`border-l-4 ${
              empresa.metricas.eficienciaTributaria >= 80 ? 'border-l-green-500' :
              empresa.metricas.eficienciaTributaria >= 70 ? 'border-l-yellow-500' :
              'border-l-red-500'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      empresa.metricas.eficienciaTributaria >= 80 ? 'bg-green-500' :
                      empresa.metricas.eficienciaTributaria >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{empresa.razonSocial}</h3>
                      <p className="text-gray-600">{empresa.giro}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">
                          {empresa.tipoCliente.replace('_', ' ')}
                        </Badge>
                        <Badge className={`${
                          empresa.metricas.eficienciaTributaria >= 80 ? 'bg-green-100 text-green-800' :
                          empresa.metricas.eficienciaTributaria >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {empresa.metricas.eficienciaTributaria >= 80 ? 'Excelente' :
                           empresa.metricas.eficienciaTributaria >= 70 ? 'Bueno' : 'Mejorable'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${
                      empresa.metricas.eficienciaTributaria >= 80 ? 'text-green-600' :
                      empresa.metricas.eficienciaTributaria >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {empresa.metricas.eficienciaTributaria}%
                    </p>
                    <p className="text-sm text-gray-600">Eficiencia tributaria</p>
                    <p className="text-sm text-green-600 font-semibold">
                      Ahorrado: ${empresa.metricas.impuestosAhorrados.toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        empresa.metricas.eficienciaTributaria >= 80 ? 'bg-green-500' :
                        empresa.metricas.eficienciaTributaria >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${empresa.metricas.eficienciaTributaria}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
