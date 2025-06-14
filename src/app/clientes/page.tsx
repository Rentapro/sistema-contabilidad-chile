'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cliente } from '@/types';
import { clienteService, Cliente as ClienteDB, ClienteCreate } from '@/services/clienteService';
import { formatDate, validateRUT, validateEmail, formatRUT } from '@/lib/utils';

// Función adaptadora para convertir ClienteDB a Cliente
const adaptarClienteDB = (clienteDB: ClienteDB): Cliente => ({
  id: clienteDB.id,
  nombre: clienteDB.razon_social,
  email: clienteDB.email || '',
  telefono: clienteDB.telefono || '',
  direccion: clienteDB.direccion || '',
  rut: clienteDB.rut,
  giro: clienteDB.nombre_fantasia || '',
  fechaCreacion: new Date(clienteDB.created_at),
  activo: clienteDB.activo,
  tipoContribuyente: 'primera_categoria' // Por defecto
});

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    rut: '',
    giro: '',
    tipoContribuyente: 'primera_categoria' as 'primera_categoria' | 'segunda_categoria' | 'regimen_simplificado',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const clientesData = await clienteService.obtenerClientes();
      setClientes(clientesData.map(adaptarClienteDB));
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      // Fallback a datos locales si falla la conexión
      // setClientes(api.getClientes());
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (!validateEmail(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.rut.trim()) newErrors.rut = 'El RUT es requerido';
    else if (!validateRUT(formData.rut)) newErrors.rut = 'RUT inválido';
    if (!formData.giro.trim()) newErrors.giro = 'El giro comercial es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingCliente) {
        await clienteService.actualizarCliente(editingCliente.id, {
          razon_social: formData.nombre,
          email: formData.email || undefined,
          telefono: formData.telefono || undefined,
          direccion: formData.direccion || undefined,
          rut: formData.rut.toUpperCase(),
          nombre_fantasia: formData.giro || undefined,
        });
      } else {
        const nuevoClienteDB: ClienteCreate = {
          rut: formData.rut.toUpperCase(),
          razon_social: formData.nombre,
          email: formData.email || undefined,
          telefono: formData.telefono || undefined,
          direccion: formData.direccion || undefined,
          nombre_fantasia: formData.giro || undefined,
        };
        await clienteService.crearCliente(nuevoClienteDB);
      }

      resetForm();
      await loadClientes();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      alert('Error al guardar el cliente. Por favor inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      rut: '',
      giro: '',
      tipoContribuyente: 'primera_categoria' as const,
    });
    setEditingCliente(null);
    setShowForm(false);
    setErrors({});
  };

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      rut: cliente.rut,
      giro: cliente.giro || '',
      tipoContribuyente: cliente.tipoContribuyente || 'primera_categoria' as 'primera_categoria' | 'segunda_categoria' | 'regimen_simplificado',
    });
    setEditingCliente(cliente);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setLoading(true);
      try {
        await clienteService.eliminarCliente(id);
        await loadClientes();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert('Error al eliminar el cliente.');
      } finally {
        setLoading(false);
      }
    }
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
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
                <p className="text-gray-600">Administra tu cartera de clientes</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Nuevo Cliente
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulario Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">RUT</label>
                    <input
                      type="text"
                      value={formData.rut}
                      onChange={(e) => setFormData({...formData, rut: e.target.value})}
                      placeholder="12.345.678-9"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    {errors.rut && <p className="text-red-500 text-sm mt-1">{errors.rut}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giro Comercial</label>
                    <input
                      type="text"
                      value={formData.giro}
                      onChange={(e) => setFormData({...formData, giro: e.target.value})}
                      placeholder="Ej: Servicios de Consultoría"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    {errors.giro && <p className="text-red-500 text-sm mt-1">{errors.giro}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Contribuyente</label>
                    <select
                      value={formData.tipoContribuyente}
                      onChange={(e) => setFormData({...formData, tipoContribuyente: e.target.value as any})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="primera_categoria">Primera Categoría</option>
                      <option value="segunda_categoria">Segunda Categoría</option>
                      <option value="regimen_simplificado">Régimen Simplificado</option>
                      <option value="pro_pyme">Pro PyME</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <textarea
                      value={formData.direccion}
                      onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      {editingCliente ? 'Actualizar' : 'Crear'}
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

        {/* Lista de Clientes */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Clientes Registrados ({clientes.length})
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <li key={cliente.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-900">{cliente.nombre}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><span className="font-medium">Email:</span> {cliente.email}</p>
                        <p><span className="font-medium">Teléfono:</span> {cliente.telefono}</p>
                        <p><span className="font-medium">Giro:</span> {cliente.giro}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">RUT:</span> {formatRUT(cliente.rut)}</p>
                        <p><span className="font-medium">Tipo:</span> {cliente.tipoContribuyente?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                        <p><span className="font-medium">Fecha de registro:</span> {formatDate(cliente.fechaCreacion)}</p>
                      </div>
                    </div>
                    {cliente.direccion && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Dirección:</span> {cliente.direccion}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {clientes.length === 0 && (
              <li className="px-6 py-12 text-center">
                <p className="text-gray-500">No hay clientes registrados</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Crear tu primer cliente
                </button>
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
