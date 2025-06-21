'use client';

import { useState, useEffect } from 'react';
import { Usuario, Empresa } from '@/types/auth';
import { formatCurrency } from '@/lib/utils';
import { CompanyManagementModal } from './CompanyManagementModal';
import HeaderWithLogout from './HeaderWithLogout';

interface SuperAdminDashboardProps {
  usuario: Usuario;
}

// Mock data simplificado
const EMPRESAS_MOCK: Empresa[] = [
  {
    id: 'emp-1',
    nombre: 'Constructora Ejemplo',
    rut: '76.123.456-7',
    giro: 'Construcción',
    direccion: 'Santiago, Chile',
    telefono: '+56 9 1234 5678',
    email: 'info@ejemplo.cl',
    tipoLicencia: 'premium',
    fechaVencimiento: new Date('2025-12-31'),
    propietarioId: 'superadmin-1',
    administradores: ['admin-1'],
    contadores: ['contador-1'],
    configuracion: {
      modulosHabilitados: ['facturacion', 'gastos', 'reportes', 'sii'],
      limitesUsuarios: 10,
      limitesFacturas: 1000,
      limitesClientes: 500,
      automatizacionIA: true,
      reportesAvanzados: true,
      integracionesBancarias: true
    },
    activa: true,
    fechaCreacion: new Date('2024-01-15')
  }
];

export default function SuperAdminDashboard({ usuario }: SuperAdminDashboardProps) {
  const [empresas] = useState<Empresa[]>(EMPRESAS_MOCK);
  const [mostrarModalEmpresa, setMostrarModalEmpresa] = useState(false);
  const [metricas] = useState({
    totalEmpresas: 1,
    empresasActivas: 1,
    ingresosMensuales: 89000,
    facturasGeneradas: 1250,
    usuariosTotales: 45,
    tareasPendientesIA: 8
  });

  const crearNuevaEmpresa = (nuevaEmpresa: Partial<Empresa>) => {
    alert(`Empresa "${nuevaEmpresa.nombre}" creada exitosamente!`);
    setMostrarModalEmpresa(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      <HeaderWithLogout 
        title="👑 Panel Ejecutivo SuperAdmin"
        subtitle={`Bienvenido ${usuario.nombre} - Gestión Multi-Empresa con IA`}
      />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Banner de ingresos con glass morphism */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-1 mb-8 shadow-2xl">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-lg font-semibold mb-2 opacity-90">
                    💰 Ingresos Mensuales Totales
                  </h2>
                  <p className="text-white/80 text-sm">
                    Suma de todas las empresas activas
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-white drop-shadow-lg">
                    {formatCurrency(metricas.ingresosMensuales)}
                  </div>
                  <div className="flex items-center text-white/90 text-sm mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    +23% vs anterior
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
            </div>
          </div>

          {/* Métricas Principales con efectos glass */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 h-full">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 shadow-lg">
                      <svg className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-slate-600">Empresas Activas</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {metricas.empresasActivas}/{metricas.totalEmpresas}
                    </p>
                    <div className="flex items-center text-blue-600 text-xs mt-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                      100% operativas
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 h-full">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 shadow-lg">
                      <svg className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-slate-600">Ingresos Generados</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      {formatCurrency(89000)}
                    </p>
                    <div className="flex items-center text-emerald-600 text-xs mt-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                      +18% este mes
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 h-full">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 shadow-lg">
                      <svg className="w-6 h-6 text-violet-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-violet-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-slate-600">Usuarios Totales</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {metricas.usuariosTotales}
                    </p>
                    <div className="flex items-center text-violet-600 text-xs mt-1">
                      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-1 animate-pulse"></div>
                      Activos online
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 h-full">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-lg">
                      <svg className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-amber-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-slate-600">Tareas IA Pendientes</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {metricas.tareasPendientesIA}
                    </p>
                    <div className="flex items-center text-amber-600 text-xs mt-1">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1 animate-pulse"></div>
                      Procesando...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>          {/* Panel de Automatización IA con glass morphism */}
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 mb-8">
            <div className="p-8 border-b border-white/40">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                <span className="text-blue-500 mr-3 text-3xl">🤖</span>
                Centro de Automatización IA
              </h3>
              <p className="text-slate-600 mt-2">
                Procesa tareas de todas las empresas con inteligencia artificial avanzada
              </p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-300/30 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className="relative">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">📄</span>
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-bold text-slate-800 text-lg">Procesar Facturas</div>
                      <div className="text-sm text-blue-600 font-medium">23 facturas pendientes</div>
                      <div className="flex items-center text-blue-600 text-xs mt-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                        En cola de procesamiento
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -translate-y-4 translate-x-4"></div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-300/30 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className="relative">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🏛️</span>
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-bold text-slate-800 text-lg">Declaraciones SII</div>
                      <div className="text-sm text-emerald-600 font-medium">8 F29 por generar</div>
                      <div className="flex items-center text-emerald-600 text-xs mt-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                        Listo para generar
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full -translate-y-4 translate-x-4"></div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-300/30 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className="relative">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🏦</span>
                      <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-bold text-slate-800 text-lg">Conciliaciones</div>
                      <div className="text-sm text-purple-600 font-medium">12 cuentas pendientes</div>
                      <div className="flex items-center text-purple-600 text-xs mt-1">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1 animate-pulse"></div>
                        Automatización activa
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full -translate-y-4 translate-x-4"></div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-12 translate-x-12"></div>
          </div>

          {/* Lista de Empresas con glass morphism */}
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
            <div className="p-8 border-b border-white/40">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                    <span className="text-purple-500 mr-3 text-3xl">🏢</span>
                    Empresas Gestionadas
                  </h3>
                  <p className="text-slate-600 mt-1">
                    Administra todas las empresas desde un panel centralizado
                  </p>
                </div>
                <button 
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                  onClick={() => setMostrarModalEmpresa(true)}
                >
                  <span className="relative z-10 flex items-center">
                    <span className="text-lg mr-2">+</span>
                    Nueva Empresa
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-blue-50">
                    <th className="px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">Empresa</th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">Licencia</th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">Estado</th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40">
                  {empresas.map((empresa) => (
                    <tr key={empresa.id} className="hover:bg-white/60 hover:backdrop-blur-sm transition-all duration-200">
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                            <span className="text-white font-bold text-sm">
                              {empresa.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{empresa.nombre}</div>
                            <div className="text-sm text-slate-600">{empresa.rut}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          empresa.tipoLicencia === 'premium' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                        }`}>
                          {empresa.tipoLicencia.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          empresa.activa 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
                        }`}>
                          {empresa.activa ? '✅ Activa' : '❌ Inactiva'}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex space-x-3">
                          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-1">
                            Administrar
                          </button>
                          <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 transform hover:-translate-y-1">
                            Ver Datos
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nota sobre el widget flotante */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <div className="flex items-center space-x-3">
              <div className="text-blue-600">ℹ️</div>
              <div>
                <h3 className="font-semibold text-blue-900">Widget de Logout Flotante</h3>
                <p className="text-blue-700 text-sm">
                  Puedes cerrar sesión usando el widget flotante en la esquina superior derecha o desde el menú lateral.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Gestión de Empresas */}
      <CompanyManagementModal
        isOpen={mostrarModalEmpresa}
        onClose={() => setMostrarModalEmpresa(false)}
        onCreateCompany={crearNuevaEmpresa}
      />
    </div>
  );
}
