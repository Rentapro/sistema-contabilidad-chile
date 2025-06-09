'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, initializeData } from '@/data/store';
import { Factura, Cliente, DetalleFactura } from '@/types';
import { formatCurrency, formatDate, generateInvoiceNumber, calculateIVA } from '@/lib/utils';

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: '',
    fecha: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    notas: '',
  });
  const [detalles, setDetalles] = useState<Omit<DetalleFactura, 'id' | 'subtotal'>[]>([
    { productoId: '', cantidad: 1, precioUnitario: 0, descuento: 0 }
  ]);

  useEffect(() => {
    initializeData();
    loadData();
  }, []);

  const loadData = () => {
    setFacturas(api.getFacturas());
    setClientes(api.getClientes());
  };

  const calcularSubtotalDetalle = (detalle: Omit<DetalleFactura, 'id' | 'subtotal'>) => {
    const subtotal = detalle.cantidad * detalle.precioUnitario;
    return subtotal - (subtotal * detalle.descuento / 100);
  };

  const calcularTotales = () => {
    const subtotal = detalles.reduce((sum, detalle) => sum + calcularSubtotalDetalle(detalle), 0);
    const iva = calculateIVA(subtotal);
    const total = subtotal + iva;
    return { subtotal, iva, total };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clienteId || detalles.some(d => !d.productoId || d.cantidad <= 0 || d.precioUnitario <= 0)) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const { subtotal, iva, total } = calcularTotales();
    
    const nuevaFactura: Omit<Factura, 'id'> = {
      numero: generateInvoiceNumber(),
      clienteId: formData.clienteId,
      fecha: new Date(formData.fecha),
      fechaVencimiento: new Date(formData.fechaVencimiento || formData.fecha),
      detalles: detalles.map((detalle, index) => ({
        id: `det-${index}`,
        ...detalle,
        subtotal: calcularSubtotalDetalle(detalle),
      })),
      subtotal,
      iva,
      total,
      estado: 'pendiente',
      notas: formData.notas,
    };

    api.createFactura(nuevaFactura);
    resetForm();
    loadData();
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      fecha: new Date().toISOString().split('T')[0],
      fechaVencimiento: '',
      notas: '',
    });
    setDetalles([{ productoId: '', cantidad: 1, precioUnitario: 0, descuento: 0 }]);
    setShowForm(false);
  };

  const agregarDetalle = () => {
    setDetalles([...detalles, { productoId: '', cantidad: 1, precioUnitario: 0, descuento: 0 }]);
  };

  const eliminarDetalle = (index: number) => {
    if (detalles.length > 1) {
      setDetalles(detalles.filter((_, i) => i !== index));
    }
  };

  const updateEstadoFactura = (id: string, nuevoEstado: 'pendiente' | 'pagada' | 'vencida' | 'cancelada') => {
    api.updateFactura(id, { estado: nuevoEstado });
    loadData();
  };

  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  };

  const { subtotal, iva, total } = calcularTotales();

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
                <h1 className="text-3xl font-bold text-gray-900">Facturación Electrónica SII Chile 🇨🇱</h1>
                <p className="text-gray-600">Administra boletas y facturas electrónicas timbradas</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Nueva Factura Electrónica
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulario Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Factura Electrónica SII</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cliente *</label>
                      <select
                        value={formData.clienteId}
                        onChange={(e) => setFormData({...formData, clienteId: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Seleccionar cliente</option>
                        {clientes.map(cliente => (
                          <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha *</label>
                      <input
                        type="date"
                        value={formData.fecha}
                        onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha Vencimiento</label>
                      <input
                        type="date"
                        value={formData.fechaVencimiento}
                        onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Detalles de la factura */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-medium text-gray-900">Detalles de la Factura</h4>
                      <button
                        type="button"
                        onClick={agregarDetalle}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Agregar Línea
                      </button>
                    </div>

                    <div className="space-y-3">
                      {detalles.map((detalle, index) => (
                        <div key={index} className="grid grid-cols-6 gap-3 items-center">
                          <div className="col-span-2">
                            <input
                              type="text"
                              placeholder="Descripción del producto/servicio"
                              value={detalle.productoId}
                              onChange={(e) => {
                                const nuevosDetalles = [...detalles];
                                nuevosDetalles[index].productoId = e.target.value;
                                setDetalles(nuevosDetalles);
                              }}
                              className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              placeholder="Cantidad"
                              min="1"
                              value={detalle.cantidad}
                              onChange={(e) => {
                                const nuevosDetalles = [...detalles];
                                nuevosDetalles[index].cantidad = parseInt(e.target.value) || 1;
                                setDetalles(nuevosDetalles);
                              }}
                              className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              placeholder="Precio"
                              min="0"
                              step="0.01"
                              value={detalle.precioUnitario}
                              onChange={(e) => {
                                const nuevosDetalles = [...detalles];
                                nuevosDetalles[index].precioUnitario = parseFloat(e.target.value) || 0;
                                setDetalles(nuevosDetalles);
                              }}
                              className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              placeholder="% Desc"
                              min="0"
                              max="100"
                              value={detalle.descuento}
                              onChange={(e) => {
                                const nuevosDetalles = [...detalles];
                                nuevosDetalles[index].descuento = parseFloat(e.target.value) || 0;
                                setDetalles(nuevosDetalles);
                              }}
                              className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {formatCurrency(calcularSubtotalDetalle(detalle))}
                            </span>
                            {detalles.length > 1 && (
                              <button
                                type="button"
                                onClick={() => eliminarDetalle(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totales */}
                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-end space-y-2">
                        <div className="text-right">
                          <div className="text-sm">Subtotal: {formatCurrency(subtotal)}</div>
                          <div className="text-sm">IVA (16%): {formatCurrency(iva)}</div>
                          <div className="text-lg font-bold">Total: {formatCurrency(total)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notas</label>
                    <textarea
                      value={formData.notas}
                      onChange={(e) => setFormData({...formData, notas: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Notas adicionales..."
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Crear Factura
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Facturas */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Facturas Emitidas ({facturas.length})
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {facturas.map((factura) => (
              <li key={factura.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium text-gray-900">{factura.numero}</p>
                        <p className="text-sm text-gray-600">{getClienteNombre(factura.clienteId)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(factura.total)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          factura.estado === 'pagada' ? 'bg-green-100 text-green-800' :
                          factura.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          factura.estado === 'vencida' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><span className="font-medium">Fecha:</span> {formatDate(factura.fecha)}</p>
                        <p><span className="font-medium">Vencimiento:</span> {formatDate(factura.fechaVencimiento)}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Subtotal:</span> {formatCurrency(factura.subtotal)}</p>
                        <p><span className="font-medium">IVA:</span> {formatCurrency(factura.iva)}</p>
                      </div>
                    </div>
                    {factura.estado === 'pendiente' && (
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => updateEstadoFactura(factura.id, 'pagada')}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Marcar como Pagada
                        </button>
                        <button
                          onClick={() => updateEstadoFactura(factura.id, 'cancelada')}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {facturas.length === 0 && (
              <li className="px-6 py-12 text-center">
                <p className="text-gray-500">No hay facturas registradas</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Crear tu primera factura
                </button>
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
