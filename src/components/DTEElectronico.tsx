'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface DocumentoElectronico {
  id: string;
  folio: string;
  tipo: 'factura' | 'boleta' | 'nota_credito' | 'nota_debito';
  emisor: string;
  receptor: string;
  fecha: string;
  monto: number;
  estado: 'emitido' | 'enviado' | 'aceptado' | 'rechazado' | 'cedido';
  estadoSII: 'pendiente' | 'autorizado' | 'rechazado' | 'anulado';
  observaciones?: string;
}

interface EstadisticasDTE {
  totalEmitidos: number;
  facturasEmitidas: number;
  boletasEmitidas: number;
  montoTotal: number;
  pendientesAutorizacion: number;
  rechazados: number;
}

const documentosElectronicos: DocumentoElectronico[] = [
  {
    id: '1',
    folio: 'F001-00012345',
    tipo: 'factura',
    emisor: 'MI EMPRESA SPA',
    receptor: 'CLIENTE ABC LTDA',
    fecha: '2025-06-11',
    monto: 2450000,
    estado: 'aceptado',
    estadoSII: 'autorizado'
  },
  {
    id: '2',
    folio: 'B001-00089234',
    tipo: 'boleta',
    emisor: 'MI EMPRESA SPA',
    receptor: 'CONSUMIDOR FINAL',
    fecha: '2025-06-11',
    monto: 125000,
    estado: 'emitido',
    estadoSII: 'autorizado'
  },
  {
    id: '3',
    folio: 'F001-00012346',
    tipo: 'factura',
    emisor: 'MI EMPRESA SPA',
    receptor: 'EMPRESA XYZ SA',
    fecha: '2025-06-10',
    monto: 3890000,
    estado: 'enviado',
    estadoSII: 'pendiente'
  },
  {
    id: '4',
    folio: 'NC01-00001234',
    tipo: 'nota_credito',
    emisor: 'MI EMPRESA SPA',
    receptor: 'CLIENTE ABC LTDA',
    fecha: '2025-06-09',
    monto: 250000,
    estado: 'aceptado',
    estadoSII: 'autorizado',
    observaciones: 'Devolución producto defectuoso'
  },
  {
    id: '5',
    folio: 'F001-00012347',
    tipo: 'factura',
    emisor: 'MI EMPRESA SPA',
    receptor: 'CLIENTE DEF EIRL',
    fecha: '2025-06-08',
    monto: 1750000,
    estado: 'rechazado',
    estadoSII: 'rechazado',
    observaciones: 'RUT receptor inválido'
  }
];

const estadisticas: EstadisticasDTE = {
  totalEmitidos: 1247,
  facturasEmitidas: 856,
  boletasEmitidas: 391,
  montoTotal: 245890000,
  pendientesAutorizacion: 15,
  rechazados: 3
};

export default function DTEElectronico() {
  const [activeTab, setActiveTab] = useState<'documentos' | 'emitir' | 'reportes'>('documentos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTipoBadge = (tipo: string) => {
    const tipos = {
      factura: { icon: '🧾', color: 'bg-blue-100 text-blue-800', label: 'Factura' },
      boleta: { icon: '🧾', color: 'bg-green-100 text-green-800', label: 'Boleta' },
      nota_credito: { icon: '↩️', color: 'bg-orange-100 text-orange-800', label: 'Nota Crédito' },
      nota_debito: { icon: '↪️', color: 'bg-red-100 text-red-800', label: 'Nota Débito' }
    };
    
    const config = tipos[tipo as keyof typeof tipos];
    return <Badge className={config.color}>{config.icon} {config.label}</Badge>;
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'emitido':
        return <Badge className="bg-blue-100 text-blue-800">📤 Emitido</Badge>;
      case 'enviado':
        return <Badge className="bg-yellow-100 text-yellow-800">📨 Enviado</Badge>;
      case 'aceptado':
        return <Badge className="bg-green-100 text-green-800">✅ Aceptado</Badge>;
      case 'rechazado':
        return <Badge className="bg-red-100 text-red-800">❌ Rechazado</Badge>;
      case 'cedido':
        return <Badge className="bg-purple-100 text-purple-800">🔄 Cedido</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const getEstadoSIIBadge = (estadoSII: string) => {
    switch (estadoSII) {
      case 'autorizado':
        return <Badge className="bg-green-100 text-green-800">🇨🇱 Autorizado SII</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ Pendiente SII</Badge>;
      case 'rechazado':
        return <Badge className="bg-red-100 text-red-800">❌ Rechazado SII</Badge>;
      case 'anulado':
        return <Badge className="bg-gray-100 text-gray-800">🚫 Anulado SII</Badge>;
      default:
        return <Badge>{estadoSII}</Badge>;
    }
  };

  const documentosFiltrados = documentosElectronicos.filter(doc => {
    const matchTipo = filtroTipo === 'todos' || doc.tipo === filtroTipo;
    const matchEstado = filtroEstado === 'todos' || doc.estado === filtroEstado;
    return matchTipo && matchEstado;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📄 DTE Electrónico
              </h1>
              <p className="text-gray-600 text-lg">
                Factura y Boleta Electrónica - Sistema integrado con SII
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                📄 Nueva Factura
              </button>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                🧾 Nueva Boleta
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{estadisticas.totalEmitidos}</div>
              <div className="text-sm text-gray-500">Total Emitidos</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{estadisticas.facturasEmitidas}</div>
              <div className="text-sm text-gray-500">Facturas</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{estadisticas.boletasEmitidas}</div>
              <div className="text-sm text-gray-500">Boletas</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-indigo-600">
                {formatCurrency(estadisticas.montoTotal)}
              </div>
              <div className="text-sm text-gray-500">Monto Total</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{estadisticas.pendientesAutorizacion}</div>
              <div className="text-sm text-gray-500">Pendientes</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{estadisticas.rechazados}</div>
              <div className="text-sm text-gray-500">Rechazados</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm">
          {[
            { id: 'documentos', label: 'Documentos', icon: '📋' },
            { id: 'emitir', label: 'Emitir DTE', icon: '✏️' },
            { id: 'reportes', label: 'Reportes', icon: '📊' }
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

        {/* Documentos Tab */}
        {activeTab === 'documentos' && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="factura">Facturas</option>
                  <option value="boleta">Boletas</option>
                  <option value="nota_credito">Notas de Crédito</option>
                  <option value="nota_debito">Notas de Débito</option>
                </select>

                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="emitido">Emitidos</option>
                  <option value="enviado">Enviados</option>
                  <option value="aceptado">Aceptados</option>
                  <option value="rechazado">Rechazados</option>
                </select>

                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  🔄 Sincronizar SII
                </button>
              </div>
            </div>

            {/* Lista de Documentos */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold">Folio</th>
                      <th className="text-left py-4 px-6 font-semibold">Tipo</th>
                      <th className="text-left py-4 px-6 font-semibold">Receptor</th>
                      <th className="text-left py-4 px-6 font-semibold">Fecha</th>
                      <th className="text-right py-4 px-6 font-semibold">Monto</th>
                      <th className="text-left py-4 px-6 font-semibold">Estado</th>
                      <th className="text-left py-4 px-6 font-semibold">Estado SII</th>
                      <th className="text-left py-4 px-6 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentosFiltrados.map((doc) => (
                      <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{doc.folio}</div>
                        </td>
                        <td className="py-4 px-6">
                          {getTipoBadge(doc.tipo)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium">{doc.receptor}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">{doc.fecha}</div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="font-semibold">{formatCurrency(doc.monto)}</div>
                        </td>
                        <td className="py-4 px-6">
                          {getEstadoBadge(doc.estado)}
                        </td>
                        <td className="py-4 px-6">
                          {getEstadoSIIBadge(doc.estadoSII)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-md" title="Ver">
                              👁️
                            </button>
                            <button className="text-green-600 hover:bg-green-50 p-2 rounded-md" title="Descargar PDF">
                              📥
                            </button>
                            <button className="text-purple-600 hover:bg-purple-50 p-2 rounded-md" title="Enviar">
                              📧
                            </button>
                            {doc.estado === 'rechazado' && (
                              <button className="text-red-600 hover:bg-red-50 p-2 rounded-md" title="Corregir">
                                🔧
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Emitir DTE Tab */}
        {activeTab === 'emitir' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emitir Nuevo DTE</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="factura">Factura Electrónica</option>
                    <option value="boleta">Boleta Electrónica</option>
                    <option value="nota_credito">Nota de Crédito</option>
                    <option value="nota_debito">Nota de Débito</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RUT Receptor
                  </label>
                  <input
                    type="text"
                    placeholder="12.345.678-9"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón Social Receptor
                  </label>
                  <input
                    type="text"
                    placeholder="EMPRESA CLIENTE LTDA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Emisión
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    defaultValue="2025-06-11"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Detalle de Productos/Servicios</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-700">
                      <div className="col-span-5">Descripción</div>
                      <div className="col-span-2">Cantidad</div>
                      <div className="col-span-3">Precio Unit.</div>
                      <div className="col-span-2">Total</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <input className="col-span-5 px-2 py-1 border rounded" placeholder="Servicio/Producto" />
                      <input className="col-span-2 px-2 py-1 border rounded" placeholder="1" />
                      <input className="col-span-3 px-2 py-1 border rounded" placeholder="0" />
                      <div className="col-span-2 flex items-center px-2 text-sm font-medium">$0</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Subtotal:</span>
                      <span>$0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">IVA (19%):</span>
                      <span>$0</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>$0</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    📄 Generar y Enviar DTE
                  </button>
                  <button className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors">
                    💾 Guardar Borrador
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reportes Tab */}
        {activeTab === 'reportes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Libro de Ventas</h3>
                <p className="text-gray-600 mb-4">Reporte mensual para SII</p>
                <div className="flex space-x-4">
                  <select className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Junio 2025</option>
                    <option>Mayo 2025</option>
                    <option>Abril 2025</option>
                  </select>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                    📊 Generar
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen IVA</h3>
                <p className="text-gray-600 mb-4">Análisis de IVA por período</p>
                <div className="flex space-x-4">
                  <select className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Junio 2025</option>
                    <option>Mayo 2025</option>
                    <option>Abril 2025</option>
                  </select>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    📋 Generar
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reportes Adicionales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="font-medium">Análisis de Ventas</div>
                  <div className="text-sm text-gray-500">Tendencias por período</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-medium">Clientes Frecuentes</div>
                  <div className="text-sm text-gray-500">Top clientes por volumen</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <div className="text-2xl mb-2">⚠️</div>
                  <div className="font-medium">Documentos Problemáticos</div>
                  <div className="text-sm text-gray-500">Rechazados y anulados</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert de Estado SII */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  🇨🇱 Conexión SII Activa
                </h3>
                <p className="text-green-600">
                  Sistema sincronizado con Servicios SII - Última actualización: hace 2 minutos
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">✅ Online</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
