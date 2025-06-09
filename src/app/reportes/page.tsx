'use client';

import { useState, useEffect } from 'react';
import { Cliente, Factura, Gasto, ReporteFinanciero } from '@/types';
import { api } from '@/data/store';
import { formatCurrency, formatDateShort } from '@/lib/utils';

export default function ReportesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [tipoReporte, setTipoReporte] = useState<'resumen' | 'ingresos' | 'gastos' | 'balance' | 'sii'>('resumen');
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFin, setPeriodoFin] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');

  useEffect(() => {
    cargarDatos();
    // Establecer periodo por defecto (mes actual)
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    
    setPeriodoInicio(inicioMes.toISOString().split('T')[0]);
    setPeriodoFin(finMes.toISOString().split('T')[0]);
  }, []);

  const cargarDatos = () => {
    setClientes(api.getClientes());
    setFacturas(api.getFacturas());
    setGastos(api.getGastos());
  };

  const filtrarPorPeriodo = () => {
    const inicio = new Date(periodoInicio);
    const fin = new Date(periodoFin);
    
    const facturasFiltradas = facturas.filter(factura => {
      const fechaFactura = new Date(factura.fecha);
      const cumplePeriodo = fechaFactura >= inicio && fechaFactura <= fin;
      const cumpleCliente = !clienteSeleccionado || factura.clienteId === clienteSeleccionado;
      return cumplePeriodo && cumpleCliente;
    });

    const gastosFiltrados = gastos.filter(gasto => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto >= inicio && fechaGasto <= fin;
    });

    return { facturasFiltradas, gastosFiltrados };
  };

  const calcularReporteFinanciero = (): ReporteFinanciero => {
    const { facturasFiltradas, gastosFiltrados } = filtrarPorPeriodo();
    
    const ingresos = facturasFiltradas
      .filter(f => f.estado === 'pagada')
      .reduce((sum, f) => sum + f.total, 0);
    
    const gastosTotales = gastosFiltrados.reduce((sum, g) => sum + g.monto, 0);
    const ivaFacturas = facturasFiltradas
      .filter(f => f.estado === 'pagada')
      .reduce((sum, f) => sum + f.iva, 0);

    return {
      periodo: {
        inicio: new Date(periodoInicio),
        fin: new Date(periodoFin)
      },
      ingresos,
      gastos: gastosTotales,
      utilidadBruta: ingresos - gastosTotales,
      utilidadNeta: (ingresos - gastosTotales) - ivaFacturas,
      iva: ivaFacturas
    };
  };

  const reporte = calcularReporteFinanciero();
  const { facturasFiltradas, gastosFiltrados } = filtrarPorPeriodo();

  const exportarPDF = () => {
    // Simular exportación a PDF
    alert('Función de exportación a PDF en desarrollo...');
  };

  const exportarExcel = () => {
    // Simular exportación a Excel
    alert('Función de exportación a Excel en desarrollo...');
  };

  const renderResumenFinanciero = () => (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ingresos</p>
              <p className="text-2xl font-semibold text-green-600">{formatCurrency(reporte.ingresos)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Gastos</p>
              <p className="text-2xl font-semibold text-red-600">{formatCurrency(reporte.gastos)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${reporte.utilidadBruta >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Utilidad Bruta</p>
              <p className={`text-2xl font-semibold ${reporte.utilidadBruta >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatCurrency(reporte.utilidadBruta)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">IVA Cobrado</p>
              <p className="text-2xl font-semibold text-purple-600">{formatCurrency(reporte.iva)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de barras simulado */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Comparativo Ingresos vs Gastos</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Ingresos</span>
              <span>{formatCurrency(reporte.ingresos)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div 
                className="bg-green-600 h-6 rounded-full flex items-center justify-end pr-2"
                style={{ width: '100%' }}
              >
                <span className="text-white text-xs font-medium">100%</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Gastos</span>
              <span>{formatCurrency(reporte.gastos)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div 
                className="bg-red-600 h-6 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${reporte.ingresos > 0 ? (reporte.gastos / reporte.ingresos * 100) : 0}%` }}
              >
                <span className="text-white text-xs font-medium">
                  {reporte.ingresos > 0 ? Math.round(reporte.gastos / reporte.ingresos * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis por categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top 5 Gastos por Categoría</h3>
          <div className="space-y-3">
            {Object.entries(
              gastosFiltrados.reduce((acc, gasto) => {
                acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.monto;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([categoria, monto]) => (
                <div key={categoria} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{categoria}</span>
                  <span className="font-medium">{formatCurrency(monto)}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estados de Facturas</h3>
          <div className="space-y-3">
            {['pagada', 'pendiente', 'vencida', 'cancelada'].map(estado => {
              const count = facturasFiltradas.filter(f => f.estado === estado).length;
              const total = facturasFiltradas.filter(f => f.estado === estado).reduce((sum, f) => sum + f.total, 0);
              return (
                <div key={estado} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${
                      estado === 'pagada' ? 'bg-green-500' :
                      estado === 'pendiente' ? 'bg-yellow-500' :
                      estado === 'vencida' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></span>
                    <span className="text-sm text-gray-600 capitalize">{estado} ({count})</span>
                  </div>
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Reportes Financieros - SII Chile
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Análisis detallado para cumplimiento tributario SII
            </p>
          </div>
          <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
            <button
              onClick={exportarPDF}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              📄 PDF
            </button>
            <button
              onClick={exportarExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              📊 Excel
            </button>
          </div>
        </div>

        {/* Controles de filtros */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Parámetros del Reporte</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
                <select
                  value={tipoReporte}
                  onChange={(e) => setTipoReporte(e.target.value as 'resumen' | 'ingresos' | 'gastos' | 'balance' | 'sii')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="resumen">Resumen Financiero</option>
                  <option value="ingresos">Detalle de Ingresos</option>
                  <option value="gastos">Detalle de Gastos</option>
                  <option value="balance">Balance General</option>
                  <option value="sii">Reportes SII Chile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  value={periodoInicio}
                  onChange={(e) => setPeriodoInicio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input
                  type="date"
                  value={periodoFin}
                  onChange={(e) => setPeriodoFin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select
                  value={clienteSeleccionado}
                  onChange={(e) => setClienteSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los clientes</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del reporte */}
        {tipoReporte === 'resumen' && renderResumenFinanciero()}

        {tipoReporte === 'ingresos' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Detalle de Ingresos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factura</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IVA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facturasFiltradas.map((factura) => {
                    const cliente = clientes.find(c => c.id === factura.clienteId);
                    return (
                      <tr key={factura.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateShort(new Date(factura.fecha))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {factura.numero}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cliente?.nombre || 'Cliente no encontrado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(factura.subtotal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(factura.iva)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(factura.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            factura.estado === 'pagada' ? 'bg-green-100 text-green-800' :
                            factura.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            factura.estado === 'vencida' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {factura.estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tipoReporte === 'gastos' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Detalle de Gastos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deducible</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gastosFiltrados.map((gasto) => (
                    <tr key={gasto.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateShort(new Date(gasto.fecha))}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {gasto.descripcion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {gasto.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(gasto.monto)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          gasto.deducible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {gasto.deducible ? 'Sí' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tipoReporte === 'balance' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Balance General (Simulado)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">ACTIVOS</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Efectivo y bancos</span>
                    <span>{formatCurrency(reporte.ingresos * 0.3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cuentas por cobrar</span>
                    <span>{formatCurrency(facturasFiltradas.filter(f => f.estado === 'pendiente').reduce((sum, f) => sum + f.total, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inventario</span>
                    <span>{formatCurrency(reporte.ingresos * 0.2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total Activos</span>
                    <span>{formatCurrency(reporte.ingresos * 0.5 + facturasFiltradas.filter(f => f.estado === 'pendiente').reduce((sum, f) => sum + f.total, 0))}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-4">PASIVOS Y PATRIMONIO</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cuentas por pagar</span>
                    <span>{formatCurrency(reporte.gastos * 0.3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA por pagar</span>
                    <span>{formatCurrency(reporte.iva)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capital</span>
                    <span>{formatCurrency(reporte.utilidadBruta)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total Pasivos + Patrimonio</span>
                    <span>{formatCurrency(reporte.gastos * 0.3 + reporte.iva + reporte.utilidadBruta)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tipoReporte === 'sii' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">📋 Reportes SII Chile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* F29 Mensual */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Formulario F29</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Ventas Afectas</span>
                      <span>{formatCurrency(reporte.ingresos)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA Débito Fiscal</span>
                      <span>{formatCurrency(reporte.iva)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gastos con IVA</span>
                      <span>{formatCurrency(reporte.gastos * 0.19)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>IVA a Pagar</span>
                      <span>{formatCurrency(Math.max(0, reporte.iva - (reporte.gastos * 0.19)))}</span>
                    </div>
                  </div>
                </div>

                {/* Libro de Ventas */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Libro de Ventas</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Facturas</span>
                      <span>{facturasFiltradas.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ventas Netas</span>
                      <span>{formatCurrency(reporte.ingresos - reporte.iva)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA Total</span>
                      <span>{formatCurrency(reporte.iva)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total Bruto</span>
                      <span>{formatCurrency(reporte.ingresos)}</span>
                    </div>
                  </div>
                </div>

                {/* Libro de Compras */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Libro de Compras</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Gastos</span>
                      <span>{gastosFiltrados.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compras Netas</span>
                      <span>{formatCurrency(reporte.gastos - (reporte.gastos * 0.19))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA Crédito</span>
                      <span>{formatCurrency(reporte.gastos * 0.19)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total con IVA</span>
                      <span>{formatCurrency(reporte.gastos)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen Tributario */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">🏛️ Resumen Tributario Mensual</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{formatCurrency(reporte.ingresos)}</div>
                    <div className="text-gray-600">Ingresos Brutos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">{formatCurrency(reporte.gastos)}</div>
                    <div className="text-gray-600">Gastos Totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{formatCurrency(reporte.utilidadBruta)}</div>
                    <div className="text-gray-600">Utilidad Bruta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">{formatCurrency(Math.max(0, reporte.iva - (reporte.gastos * 0.19)))}</div>
                    <div className="text-gray-600">IVA a Pagar</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  📄 Generar F29
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  📊 Exportar Libros
                </button>
                <a
                  href="https://www.sii.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  🌐 Portal SII
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
