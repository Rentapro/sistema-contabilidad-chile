'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { api, initializeData } from '@/data/store';
import { Factura, Gasto } from '@/types';

export default function SIIPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [periodo, setPeriodo] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    initializeData();
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setFacturas(api.getFacturas());
    setGastos(api.getGastos());
  };

  // Filtrar datos por período
  const facturasPeriodo = facturas.filter(f => {
    const fechaFactura = new Date(f.fecha);
    const periodoFactura = `${fechaFactura.getFullYear()}-${String(fechaFactura.getMonth() + 1).padStart(2, '0')}`;
    return periodoFactura === periodo;
  });

  const gastosPeriodo = gastos.filter(g => {
    const fechaGasto = new Date(g.fecha);
    const periodoGasto = `${fechaGasto.getFullYear()}-${String(fechaGasto.getMonth() + 1).padStart(2, '0')}`;
    return periodoGasto === periodo;
  });

  // Cálculos para F29
  const ventasAfectas = facturasPeriodo
    .filter(f => f.tipoDocumento === 'factura_electronica')
    .reduce((sum, f) => sum + f.subtotal, 0);
    
  const ivaVentas = facturasPeriodo
    .filter(f => f.tipoDocumento === 'factura_electronica')
    .reduce((sum, f) => sum + f.iva, 0);

  const comprasAfectas = gastosPeriodo
    .filter(g => g.deducible)
    .reduce((sum, g) => sum + (g.monto / 1.19), 0); // Descontar IVA

  const ivaCompras = gastosPeriodo
    .filter(g => g.deducible)
    .reduce((sum, g) => sum + (g.monto - (g.monto / 1.19)), 0); // Solo IVA

  const ivaResultante = ivaVentas - ivaCompras;

  const generarF29 = () => {
    const f29Data = {
      periodo,
      ventasAfectas,
      ivaVentas,
      comprasAfectas,
      ivaCompras,
      ivaResultante,
      fechaGeneracion: new Date(),
    };
    
    console.log('Datos F29:', f29Data);
    alert('Formulario F29 generado. Ver consola para detalles.');
  };

  const generarLibroVentas = () => {
    const libroVentas = facturasPeriodo.map(f => ({
      fecha: f.fecha,
      numero: f.numero,
      rut: 'Cliente-RUT', // Buscar RUT del cliente
      razonSocial: 'Cliente', // Buscar nombre del cliente
      neto: f.subtotal,
      iva: f.iva,
      total: f.total,
      tipo: f.tipoDocumento,
    }));
    
    console.log('Libro de Ventas:', libroVentas);
    alert('Libro de Ventas generado. Ver consola para detalles.');
  };

  const generarLibroCompras = () => {
    const libroCompras = gastosPeriodo.map(g => ({
      fecha: g.fecha,
      numero: g.comprobante,
      rut: 'Proveedor-RUT', // Buscar RUT del proveedor
      razonSocial: 'Proveedor', // Buscar nombre del proveedor
      neto: g.monto / 1.19,
      iva: g.monto - (g.monto / 1.19),
      total: g.monto,
      tipo: 'compra',
    }));
    
    console.log('Libro de Compras:', libroCompras);
    alert('Libro de Compras generado. Ver consola para detalles.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Volver al Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Servicios SII Chile 🇨🇱</h1>
                <p className="text-gray-600">Formularios y reportes para el Servicio de Impuestos Internos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Selector de Período */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Período de Trabajo</h2>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Mes/Año:</label>
            <input
              type="month"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">
              {facturasPeriodo.length} facturas, {gastosPeriodo.length} gastos
            </span>
          </div>
        </div>

        {/* Resumen IVA */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Ventas Afectas</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(ventasAfectas)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">IVA Ventas</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(ivaVentas)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">IVA Compras</h3>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(ivaCompras)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">IVA Resultante</h3>
            <p className={`text-2xl font-bold ${ivaResultante >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(Math.abs(ivaResultante))}
            </p>
            <p className="text-xs text-gray-500">
              {ivaResultante >= 0 ? 'A pagar' : 'A favor'}
            </p>
          </div>
        </div>

        {/* Acciones Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulario F29 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-md">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Formulario F29</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Declaración Jurada de IVA mensual. Incluye ventas, compras y cálculo del IVA resultante.
            </p>
            <button
              onClick={generarF29}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Generar F29
            </button>
          </div>

          {/* Libro de Ventas */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-md">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Libro de Ventas</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Registro detallado de todas las ventas del período. Requerido para la declaración mensual.
            </p>
            <button
              onClick={generarLibroVentas}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Generar Libro
            </button>
          </div>

          {/* Libro de Compras */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-2 rounded-md">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Libro de Compras</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Registro de compras y gastos deducibles. Permite recuperar crédito fiscal del IVA.
            </p>
            <button
              onClick={generarLibroCompras}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
            >
              Generar Libro
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Información y Enlaces Útiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Fechas de Vencimiento</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• F29 IVA: Día 12 del mes siguiente</li>
                <li>• F22 Renta: 30 de abril</li>
                <li>• PPM: Día 12 de cada mes</li>
                <li>• Segunda Categoría: Día 12 del mes siguiente</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Enlaces SII</h4>
              <ul className="text-sm space-y-1">
                <li>
                  <a href="https://www.sii.cl" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    • Portal SII
                  </a>
                </li>
                <li>
                  <a href="https://maullin.sii.cl/cvc_cgi/stc/stc" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    • Declaraciones y Pagos
                  </a>
                </li>
                <li>
                  <a href="https://www4.sii.cl/mapaidocdigitalinternetui/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    • Facturación Electrónica
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Estado de Documentos Electrónicos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Documentos Electrónicos del Período</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Neto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IVA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado SII
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facturasPeriodo.slice(0, 10).map((factura) => (
                  <tr key={factura.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {factura.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {factura.tipoDocumento?.replace('_', ' ').toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(factura.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(factura.subtotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(factura.iva)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(factura.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Enviado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
