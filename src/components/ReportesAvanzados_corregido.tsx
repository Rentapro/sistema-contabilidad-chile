'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface ReporteF29 {
  periodo: string;
  ventasPropias: number;
  ventasTerceros: number;
  compras: number;
  ivaDebito: number;
  ivaCredito: number;
  ppmPropio: number;
  ppmTerceros: number;
  impuestoResultante: number;
  estado: 'pendiente' | 'presentado' | 'vencido';
  fechaVencimiento: string;
}

interface LibroIVA {
  mes: string;
  totalVentas: number;
  totalCompras: number;
  ivaVentas: number;
  ivaCompras: number;
  diferencia: number;
  documentos: number;
  estado: 'completo' | 'incompleto' | 'revisando';
}

interface PropuestaF29 {
  periodo: string;
  sugerencias: string[];
  ahorroEstimado: number;
  confianza: number;
  impacto: 'bajo' | 'medio' | 'alto';
  categoria: string;
}

const reportesF29: ReporteF29[] = [
  {
    periodo: '2025-06',
    ventasPropias: 45680000,
    ventasTerceros: 12340000,
    compras: 28900000,
    ivaDebito: 8707200,
    ivaCredito: 4624000,
    ppmPropio: 456800,
    ppmTerceros: 123400,
    impuestoResultante: 4663600,
    estado: 'pendiente',
    fechaVencimiento: '2025-07-12'
  },
  {
    periodo: '2025-05',
    ventasPropias: 52340000,
    ventasTerceros: 15670000,
    compras: 31250000,
    ivaDebito: 10881600,
    ivaCredito: 5000000,
    ppmPropio: 523400,
    ppmTerceros: 156700,
    impuestoResultante: 6561900,
    estado: 'presentado',
    fechaVencimiento: '2025-06-12'
  },
  {
    periodo: '2025-04',
    ventasPropias: 38920000,
    ventasTerceros: 9870000,
    compras: 25600000,
    ivaDebito: 7806400,
    ivaCredito: 4096000,
    ppmPropio: 389200,
    ppmTerceros: 98700,
    impuestoResultante: 4198300,
    estado: 'vencido',
    fechaVencimiento: '2025-05-12'
  }
];

const librosIVA: LibroIVA[] = [
  {
    mes: 'Junio 2025',
    totalVentas: 58020000,
    totalCompras: 28900000,
    ivaVentas: 9283200,
    ivaCompras: 4624000,
    diferencia: 4659200,
    documentos: 156,
    estado: 'revisando'
  },
  {
    mes: 'Mayo 2025',
    totalVentas: 68010000,
    totalCompras: 31250000,
    ivaVentas: 10881600,
    ivaCompras: 5000000,
    diferencia: 5881600,
    documentos: 189,
    estado: 'completo'
  },
  {
    mes: 'Abril 2025',
    totalVentas: 48790000,
    totalCompras: 25600000,
    ivaVentas: 7806400,
    ivaCompras: 4096000,
    diferencia: 3710400,
    documentos: 134,
    estado: 'incompleto'
  }
];

const propuestasF29: PropuestaF29[] = [
  {
    periodo: '2025-06',
    sugerencias: [
      'Aplicar crédito IVA de facturas de servicios no contabilizadas: $890.000',
      'Reclasificar gastos como inversión para optimizar PPM: $1.200.000',
      'Utilizar crédito fiscal por capacitación: $345.000'
    ],
    ahorroEstimado: 2435000,
    confianza: 95,
    impacto: 'alto',
    categoria: 'Optimización IVA'
  },
  {
    periodo: '2025-05',
    sugerencias: [
      'Postergar venta para próximo periodo tributario: $1.800.000',
      'Acelerar depreciación de equipos: $650.000'
    ],
    ahorroEstimado: 2450000,
    confianza: 88,
    impacto: 'alto',
    categoria: 'Planificación Temporal'
  },
  {
    periodo: '2025-04',
    sugerencias: [
      'Aplicar beneficio tributario Ley I+D: $420.000',
      'Reclasificar gastos de marketing como inversión: $280.000'
    ],
    ahorroEstimado: 700000,
    confianza: 92,
    impacto: 'medio',
    categoria: 'Beneficios Tributarios'
  }
];

export default function ReportesAvanzados() {
  const [activeTab, setActiveTab] = useState<'f29' | 'libros' | 'propuestas'>('f29');
  const [selectedPeriod, setSelectedPeriod] = useState('2025-06');
  const [generatingReport, setGeneratingReport] = useState(false);

  const generarReporte = async (tipo: string, periodo: string) => {
    setGeneratingReport(true);
    // Simular generación de reporte
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratingReport(false);
    alert(`Reporte ${tipo} para ${periodo} generado exitosamente`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'presentado':
      case 'completo':
        return <Badge className="bg-green-100 text-green-800">✅ {estado}</Badge>;
      case 'pendiente':
      case 'revisando':
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ {estado}</Badge>;
      case 'vencido':
      case 'incompleto':
        return <Badge className="bg-red-100 text-red-800">❌ {estado}</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const getImpactoBadge = (impacto: string) => {
    switch (impacto) {
      case 'alto':
        return <Badge className="bg-red-100 text-red-800">🔥 Alto Impacto</Badge>;
      case 'medio':
        return <Badge className="bg-yellow-100 text-yellow-800">⚡ Medio Impacto</Badge>;
      case 'bajo':
        return <Badge className="bg-blue-100 text-blue-800">💡 Bajo Impacto</Badge>;
      default:
        return <Badge>{impacto}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📋 Reportes SII Avanzados
              </h1>
              <p className="text-gray-600 text-lg">
                F29, F22, Libros IVA y Propuestas automáticas con IA
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(5585000)}
              </div>
              <div className="text-sm text-gray-500">Ahorro Total Detectado</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm">
          {[
            { id: 'f29', label: 'Formulario F29', icon: '📊' },
            { id: 'libros', label: 'Libros IVA', icon: '📚' },
            { id: 'propuestas', label: 'Propuestas IA', icon: '🤖' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* F29 Tab */}
        {activeTab === 'f29' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Formularios F29</h2>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2025-06">Junio 2025</option>
                  <option value="2025-05">Mayo 2025</option>
                  <option value="2025-04">Abril 2025</option>
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {reportesF29.map((reporte, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{reporte.periodo}</h3>
                      {getEstadoBadge(reporte.estado)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Ventas Propias:</span>
                        <span className="font-medium">{formatCurrency(reporte.ventasPropias)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA Débito:</span>
                        <span className="font-medium">{formatCurrency(reporte.ivaDebito)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA Crédito:</span>
                        <span className="font-medium">{formatCurrency(reporte.ivaCredito)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Impuesto Resultante:</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(reporte.impuestoResultante)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Vencimiento:</span>
                        <span>{reporte.fechaVencimiento}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => generarReporte('F29', reporte.periodo)}
                      disabled={generatingReport}
                      className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {generatingReport ? 'Generando...' : 'Generar F29'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Libros IVA Tab */}
        {activeTab === 'libros' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Libros de IVA</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Período</th>
                      <th className="text-right py-3 px-4">Ventas</th>
                      <th className="text-right py-3 px-4">Compras</th>
                      <th className="text-right py-3 px-4">IVA Diferencia</th>
                      <th className="text-center py-3 px-4">Documentos</th>
                      <th className="text-center py-3 px-4">Estado</th>
                      <th className="text-center py-3 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {librosIVA.map((libro, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{libro.mes}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(libro.totalVentas)}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(libro.totalCompras)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          {formatCurrency(libro.diferencia)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className="bg-blue-100 text-blue-800">{libro.documentos}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getEstadoBadge(libro.estado)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => generarReporte('Libro IVA', libro.mes)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                          >
                            Exportar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Propuestas IA Tab */}
        {activeTab === 'propuestas' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🤖 Propuestas de Optimización IA
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {propuestasF29.map((propuesta, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{propuesta.periodo}</h3>
                      {getImpactoBadge(propuesta.impacto)}
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {formatCurrency(propuesta.ahorroEstimado)}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">Ahorro Estimado</div>
                      <Badge className="bg-purple-100 text-purple-800">
                        {propuesta.categoria}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Confianza IA:</span>
                        <span className="text-sm font-bold">{propuesta.confianza}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${propuesta.confianza}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-sm">Sugerencias:</h4>
                      <ul className="space-y-1">
                        {propuesta.sugerencias.map((sugerencia, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{sugerencia}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => alert(`Aplicando optimización para ${propuesta.periodo}`)}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Aplicar Optimización
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-500">F29 Pendientes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(5585000)}
                </div>
                <div className="text-sm text-gray-500">Ahorro Total IA</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-yellow-600">479</div>
                <div className="text-sm text-gray-500">Docs Procesados</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-purple-600">93%</div>
                <div className="text-sm text-gray-500">Precisión IA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
