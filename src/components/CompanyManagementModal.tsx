'use client';

import { useState } from 'react';
import { Empresa } from '@/types/auth';
import { formatCurrency } from '@/lib/utils';

interface CompanyManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCompany: (empresa: Partial<Empresa>) => void;
}

interface NuevaEmpresaForm {
  nombre: string;
  rut: string;
  giro: string;
  direccion: string;
  telefono: string;
  email: string;
  tipoLicencia: 'basico' | 'premium' | 'trial';
  fechaVencimiento: string;
  emailAdministrador: string;
  nombreAdministrador: string;
}

const PLANES_PRECIOS = {
  basico: 29000,
  premium: 89000,
  trial: 0
};

export function CompanyManagementModal({ isOpen, onClose, onCreateCompany }: CompanyManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'crear' | 'buscar'>('crear');
  const [form, setForm] = useState<NuevaEmpresaForm>({
    nombre: '',
    rut: '',
    giro: '',
    direccion: '',
    telefono: '',
    email: '',
    tipoLicencia: 'basico',
    fechaVencimiento: '',
    emailAdministrador: '',
    nombreAdministrador: ''
  });

  const [busqueda, setBusqueda] = useState('');
  const [empresasEncontradas, setEmpresasEncontradas] = useState<Empresa[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nuevaEmpresa: Partial<Empresa> = {
      nombre: form.nombre,
      rut: form.rut,
      giro: form.giro,
      direccion: form.direccion,
      telefono: form.telefono,
      email: form.email,
      tipoLicencia: form.tipoLicencia,
      fechaVencimiento: new Date(form.fechaVencimiento),
      activa: true,
      fechaCreacion: new Date(),
      configuracion: {
        modulosHabilitados: form.tipoLicencia === 'basico' 
          ? ['facturacion', 'gastos']
          : form.tipoLicencia === 'premium'
          ? ['facturacion', 'gastos', 'reportes', 'sii', 'ia']
          : ['facturacion'], // trial
        limitesUsuarios: form.tipoLicencia === 'basico' ? 3 : form.tipoLicencia === 'premium' ? 10 : 1,
        limitesFacturas: form.tipoLicencia === 'basico' ? 100 : form.tipoLicencia === 'premium' ? 9999 : 10,
        limitesClientes: form.tipoLicencia === 'basico' ? 50 : form.tipoLicencia === 'premium' ? 500 : 5,
        automatizacionIA: form.tipoLicencia !== 'basico',
        reportesAvanzados: form.tipoLicencia !== 'basico',
        integracionesBancarias: form.tipoLicencia !== 'basico'
      }
    };

    onCreateCompany(nuevaEmpresa);
    
    // Reset form
    setForm({
      nombre: '',
      rut: '',
      giro: '',
      direccion: '',
      telefono: '',
      email: '',
      tipoLicencia: 'basico',
      fechaVencimiento: '',
      emailAdministrador: '',
      nombreAdministrador: ''
    });
    
    onClose();
  };

  const buscarEmpresas = async () => {
    // Simular búsqueda de empresas
    if (busqueda.length > 2) {
      // En una implementación real, esto haría una llamada a la API
      setEmpresasEncontradas([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Gestión de Empresas
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('crear')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'crear'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Crear Nueva Empresa
              </button>
              <button
                onClick={() => setActiveTab('buscar')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'buscar'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Buscar Empresas
              </button>
            </nav>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'crear' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Básica */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={(e) => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RUT *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="12.345.678-9"
                      value={form.rut}
                      onChange={(e) => setForm(prev => ({ ...prev, rut: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giro Comercial *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.giro}
                      onChange={(e) => setForm(prev => ({ ...prev, giro: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={form.telefono}
                      onChange={(e) => setForm(prev => ({ ...prev, telefono: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={form.direccion}
                      onChange={(e) => setForm(prev => ({ ...prev, direccion: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email de la Empresa *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Plan y Configuración */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Plan y Configuración</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Licencia *
                    </label>
                    <select
                      value={form.tipoLicencia}
                      onChange={(e) => setForm(prev => ({ ...prev, tipoLicencia: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="trial">Trial - Gratis (30 días)</option>
                      <option value="basico">Básico - {formatCurrency(PLANES_PRECIOS.basico)}/mes</option>
                      <option value="premium">Premium - {formatCurrency(PLANES_PRECIOS.premium)}/mes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Vencimiento *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.fechaVencimiento}
                      onChange={(e) => setForm(prev => ({ ...prev, fechaVencimiento: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Administrador */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Administrador Principal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Administrador *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nombreAdministrador}
                      onChange={(e) => setForm(prev => ({ ...prev, nombreAdministrador: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email del Administrador *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.emailAdministrador}
                      onChange={(e) => setForm(prev => ({ ...prev, emailAdministrador: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Resumen del Plan */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Resumen del Plan {form.tipoLicencia}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Precio: {formatCurrency(PLANES_PRECIOS[form.tipoLicencia])}/mes</div>
                  <div>
                    Límites: {form.tipoLicencia === 'trial' ? '10 facturas, 5 clientes, 1 usuario' :
                             form.tipoLicencia === 'basico' ? '100 facturas, 50 clientes, 3 usuarios' : 
                             'Facturas ilimitadas, 500 clientes, 10 usuarios'}
                  </div>
                  <div>
                    IA: {form.tipoLicencia === 'trial' || form.tipoLicencia === 'basico' ? 'No incluida' : 'Incluida'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Crear Empresa
                </button>
              </div>
            </form>
          ) : (
            /* Tab de Búsqueda */
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Empresa
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Nombre, RUT o email..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={buscarEmpresas}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {empresasEncontradas.length > 0 ? (
                <div className="space-y-4">
                  {empresasEncontradas.map((empresa) => (
                    <div key={empresa.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{empresa.nombre}</h4>
                          <p className="text-sm text-gray-500">{empresa.rut}</p>
                          <p className="text-sm text-gray-600">{empresa.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            empresa.tipoLicencia === 'premium' 
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {empresa.tipoLicencia.toUpperCase()}
                          </span>
                          <div className="mt-2 space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              Ver Detalles
                            </button>
                            <button className="text-green-600 hover:text-green-800 text-sm">
                              Administrar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : busqueda.length > 2 ? (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron empresas con ese criterio de búsqueda.
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Ingresa al menos 3 caracteres para buscar empresas.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
