'use client';

import { useState, useEffect } from 'react';
import { Gasto, Proveedor } from '@/types';
import { api } from '@/data/store';
import { formatCurrency, formatDateShort } from '@/lib/utils';

export default function GastosPage() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGasto, setEditingGasto] = useState<Gasto | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroProveedor, setFiltroProveedor] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const [formData, setFormData] = useState({
    proveedorId: '',
    categoria: '',
    descripcion: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    comprobante: '',
    deducible: true,
  });

  const categorias = [
    'Servicios Profesionales',
    'Arriendos y Gastos Comunes',
    'Suministros de Oficina',
    'Tecnología y Software',
    'Marketing y Publicidad',
    'Transporte y Combustible',
    'Alimentación y Representación',
    'Servicios Básicos',
    'Seguros',
    'Mantenimiento y Reparaciones',
    'Capacitación y Desarrollo',
    'Gastos Bancarios',
    'Otros Gastos Deducibles'
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setGastos(api.getGastos());
    setProveedores(api.getProveedores());
  };

  const gastosFiltrados = gastos.filter(gasto => {
    const proveedor = proveedores.find(p => p.id === gasto.proveedorId);
    const cumpleCategoria = !filtroCategoria || gasto.categoria.toLowerCase().includes(filtroCategoria.toLowerCase());
    const cumpleProveedor = !filtroProveedor || (proveedor && proveedor.nombre.toLowerCase().includes(filtroProveedor.toLowerCase()));
    const cumpleFechaInicio = !fechaInicio || new Date(gasto.fecha) >= new Date(fechaInicio);
    const cumpleFechaFin = !fechaFin || new Date(gasto.fecha) <= new Date(fechaFin);
    
    return cumpleCategoria && cumpleProveedor && cumpleFechaInicio && cumpleFechaFin;
  });

  const totalGastos = gastosFiltrados.reduce((sum, gasto) => sum + gasto.monto, 0);
  const gastosDeducibles = gastosFiltrados.filter(g => g.deducible).reduce((sum, gasto) => sum + gasto.monto, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const gastoData = {
      ...formData,
      monto: parseFloat(formData.monto),
      fecha: new Date(formData.fecha),
    };

    if (editingGasto) {
      api.updateGasto(editingGasto.id, gastoData);
    } else {
      api.createGasto(gastoData);
    }

    cargarDatos();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      proveedorId: '',
      categoria: '',
      descripcion: '',
      monto: '',
      fecha: new Date().toISOString().split('T')[0],
      comprobante: '',
      deducible: true,
    });
    setEditingGasto(null);
    setIsModalOpen(false);
  };

  const handleEdit = (gasto: Gasto) => {
    setEditingGasto(gasto);
    setFormData({
      proveedorId: gasto.proveedorId || '',
      categoria: gasto.categoria,
      descripcion: gasto.descripcion,
      monto: gasto.monto.toString(),
      fecha: new Date(gasto.fecha).toISOString().split('T')[0],
      comprobante: gasto.comprobante || '',
      deducible: gasto.deducible,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      api.deleteGasto(id);
      cargarDatos();
    }
  };

  const limpiarFiltros = () => {
    setFiltroCategoria('');
    setFiltroProveedor('');
    setFechaInicio('');
    setFechaFin('');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Gestión de Gastos - SII Chile
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Control y seguimiento de gastos empresariales para declaración al SII
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              + Nuevo Gasto
            </button>
          </div>
        </div>

        {/* Métricas Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Gastos</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalGastos)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Gastos Deducibles</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(gastosDeducibles)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Registros</p>
                <p className="text-2xl font-semibold text-gray-900">{gastosFiltrados.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <input
                  type="text"
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  placeholder="Buscar categoría..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <input
                  type="text"
                  value={filtroProveedor}
                  onChange={(e) => setFiltroProveedor(e.target.value)}
                  placeholder="Buscar proveedor..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={limpiarFiltros}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Gastos */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Gastos Registrados ({gastosFiltrados.length})
            </h3>
          </div>
          
          {gastosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay gastos registrados</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza agregando un nuevo gasto.</p>
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  + Agregar Primer Gasto
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deducible
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gastosFiltrados.map((gasto) => {
                    const proveedor = proveedores.find(p => p.id === gasto.proveedorId);
                    return (
                      <tr key={gasto.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateShort(new Date(gasto.fecha))}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate" title={gasto.descripcion}>
                            {gasto.descripcion}
                          </div>
                          {gasto.comprobante && (
                            <div className="text-xs text-blue-600 mt-1">
                              📎 {gasto.comprobante}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {gasto.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {proveedor ? proveedor.nombre : 'Sin proveedor'}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(gasto)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(gasto.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingGasto ? 'Editar Gasto' : 'Nuevo Gasto'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proveedor
                    </label>
                    <select
                      value={formData.proveedorId}
                      onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sin proveedor específico</option>
                      {proveedores.map((proveedor) => (
                        <option key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe el gasto..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.monto}
                      onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comprobante
                    </label>
                    <input
                      type="text"
                      value={formData.comprobante}
                      onChange={(e) => setFormData({ ...formData, comprobante: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Número de factura, recibo, etc."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.deducible}
                        onChange={(e) => setFormData({ ...formData, deducible: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Gasto deducible de impuestos
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingGasto ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
