'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { api } from '@/data/store';
import { Factura, Gasto } from '@/types';
import { facturacionService, Factura as FacturaDB } from '@/services/facturacionService';
import { gastoService, GastoDB } from '@/services/gastoService';

// Funciones adaptadoras para convertir entre tipos de BD y tipos de interfaz
const adaptarFacturaDB = (facturaDB: FacturaDB): Factura => ({
  id: facturaDB.id,
  numero: facturaDB.numero_factura,
  clienteId: facturaDB.cliente_id || '',
  fecha: new Date(facturaDB.fecha_emision),
  fechaVencimiento: new Date(facturaDB.fecha_vencimiento || facturaDB.fecha_emision),
  detalles: facturaDB.detalles?.map(d => ({
    id: d.id,
    productoId: d.producto_id || d.descripcion,
    cantidad: d.cantidad,
    precioUnitario: d.precio_unitario,
    descuento: d.descuento_porcentaje || 0,
    subtotal: d.monto_neto
  })) || [],
  subtotal: facturaDB.monto_neto,
  iva: facturaDB.monto_iva,
  total: facturaDB.monto_total,
  estado: facturaDB.estado,
  tipoDocumento: facturaDB.tipo_documento === 33 ? 'factura_electronica' : 
                 facturaDB.tipo_documento === 39 ? 'boleta' : 'factura_electronica',
  folioSII: facturaDB.folio.toString(),
  timbreSII: facturaDB.track_id,
  notas: facturaDB.observaciones
});

const adaptarGastoDB = (gastoDB: GastoDB): Gasto => ({
  id: gastoDB.id,
  proveedorId: gastoDB.proveedor_id,
  categoria: gastoDB.categoria,
  descripcion: gastoDB.descripcion,
  monto: gastoDB.monto,
  fecha: new Date(gastoDB.fecha),
  comprobante: gastoDB.comprobante,
  deducible: gastoDB.deducible
});

export default function DeclaracionesPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(false);
  const [periodo, setPeriodo] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Intentar usar servicios reales primero
      const [facturasData, gastosData] = await Promise.all([
        facturacionService.obtenerFacturas(),
        gastoService.obtenerGastos()
      ]);
      
      setFacturas(facturasData.map(adaptarFacturaDB));
      setGastos(gastosData.map(adaptarGastoDB));
    } catch (error) {
      console.error('Error al cargar datos, usando API local:', error);
      // Fallback a API local si falla la conexión a la BD
      setFacturas(api.getFacturas());
      setGastos(api.getGastos());
    } finally {
      setLoading(false);
    }
  };

  // Filtrar datos por periodo
  const facturasPeriodo = facturas.filter(factura => {
    const fechaFactura = new Date(factura.fecha);
    const [año, mes] = periodo.split('-').map(Number);
    return fechaFactura.getFullYear() === año && fechaFactura.getMonth() + 1 === mes;
  });

  const gastosPeriodo = gastos.filter(gasto => {
    const fechaGasto = new Date(gasto.fecha);
    const [año, mes] = periodo.split('-').map(Number);
    return fechaGasto.getFullYear() === año && fechaGasto.getMonth() + 1 === mes;
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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Declaraciones Tributarias - SII Chile
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Formularios y libros contables para el SII
            </p>
          </div>
          <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
            <Link
              href="https://www.sii.cl"
              target="_blank"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              🌐 Portal SII
            </Link>
          </div>
        </div>

        {/* Indicador de carga */}
        {loading && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 text-center">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600">Cargando datos tributarios...</span>
              </div>
            </div>
          </div>
        )}

        {/* Control de periodo */}
        {!loading && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Período de Declaración</h3>
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <input
                    type="month"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={generarF29}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    📄 Generar F29
                  </button>
                  <button
                    onClick={generarLibroVentas}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    📊 Libro Ventas
                  </button>
                  <button
                    onClick={generarLibroCompras}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    📋 Libro Compras
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumen F29 */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Formulario F29 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  📋 Formulario F29 - {periodo}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ventas Afectas</label>
                      <div className="mt-1 text-lg font-semibold text-gray-900">
                        {formatCurrency(ventasAfectas)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">IVA Débito</label>
                      <div className="mt-1 text-lg font-semibold text-red-600">
                        {formatCurrency(ivaVentas)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Compras Afectas</label>
                      <div className="mt-1 text-lg font-semibold text-gray-900">
                        {formatCurrency(comprasAfectas)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">IVA Crédito</label>
                      <div className="mt-1 text-lg font-semibold text-green-600">
                        {formatCurrency(ivaCompras)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-700">IVA Resultante:</span>
                      <span className={`text-xl font-bold ${ivaResultante >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(Math.abs(ivaResultante))} {ivaResultante >= 0 ? '(A Pagar)' : '(A Favor)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas del período */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  📊 Estadísticas del Período
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Facturas Emitidas</div>
                      <div className="text-2xl font-bold text-blue-600">{facturasPeriodo.length}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Gastos Registrados</div>
                      <div className="text-2xl font-bold text-green-600">{gastosPeriodo.length}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Total Ventas Brutas</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(facturasPeriodo.reduce((sum, f) => sum + f.total, 0))}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Total Gastos</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {formatCurrency(gastosPeriodo.reduce((sum, g) => sum + g.monto, 0))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Libro de Ventas */}
        {!loading && facturasPeriodo.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                📈 Libro de Ventas - {periodo}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Documento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Neto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IVA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facturasPeriodo.map((factura) => (
                    <tr key={factura.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(factura.fecha)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {factura.numero}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {factura.tipoDocumento === 'factura_electronica' ? 'Factura' : 'Boleta'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(factura.subtotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(factura.iva)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(factura.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Libro de Compras */}
        {!loading && gastosPeriodo.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                📉 Libro de Compras - {periodo}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Documento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Neto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IVA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deducible</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gastosPeriodo.map((gasto) => (
                    <tr key={gasto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(gasto.fecha)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {gasto.comprobante || 'Sin comprobante'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={gasto.descripcion}>
                          {gasto.descripcion}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(gasto.monto / 1.19)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(gasto.monto - (gasto.monto / 1.19))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(gasto.monto)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          gasto.deducible 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
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

        {/* Mensajes cuando no hay datos */}
        {!loading && facturasPeriodo.length === 0 && gastosPeriodo.length === 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 text-center">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos para el período seleccionado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Selecciona un período diferente o registra facturas y gastos.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
