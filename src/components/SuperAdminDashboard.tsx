'use client';

import { useState, useEffect } from 'react';
import { Usuario, Empresa } from '@/types/auth';
import { formatCurrency } from '@/lib/utils';
import { CompanyManagementModal } from './CompanyManagementModal';

interface SuperAdminDashboardProps {
  usuario: Usuario;
}

// Mock data para demostración
const EMPRESAS_MOCK: Empresa[] = [
  {
    id: 'emp-1',
    nombre: 'Constructora Capizapallar',
    rut: '76.123.456-7',
    giro: 'Construcción y obras civiles',
    direccion: 'Santiago, Chile',
    telefono: '+56 9 1234 5678',
    email: 'info@capizapallar.cl',
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
  },
  {
    id: 'emp-2',
    nombre: 'Servicios Contables SpA',
    rut: '77.987.654-3',
    giro: 'Servicios de contabilidad',
    direccion: 'Valparaíso, Chile',
    telefono: '+56 9 8765 4321',
    email: 'contacto@servicios.cl',
    tipoLicencia: 'basico',
    fechaVencimiento: new Date('2025-08-15'),
    propietarioId: 'superadmin-1',
    administradores: ['admin-2'],
    contadores: ['contador-2'],
    configuracion: {
      modulosHabilitados: ['facturacion', 'gastos'],
      limitesUsuarios: 3,
      limitesFacturas: 100,
      limitesClientes: 50,
      automatizacionIA: false,
      reportesAvanzados: false,
      integracionesBancarias: false
    },
    activa: true,
    fechaCreacion: new Date('2024-03-01')
  }
];

export default function SuperAdminDashboard({ usuario }: SuperAdminDashboardProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>(EMPRESAS_MOCK);
  const [mostrarModalEmpresa, setMostrarModalEmpresa] = useState(false);
  const [metricas, setMetricas] = useState({
    totalEmpresas: 0,
    empresasActivas: 0,
    ingresosMensuales: 0,
    facturasGeneradas: 0,
    usuariosTotales: 0,
    tareasPendientesIA: 0
  });

  useEffect(() => {
    calcularMetricas();
  }, [empresas]);

  const calcularMetricas = () => {
    const totalEmpresas = empresas.length;
    const empresasActivas = empresas.filter(e => e.activa).length;
    const ingresosMensuales = empresas.reduce((total, empresa) => {
      const precio = empresa.tipoLicencia === 'premium' ? 89000 : 
                   empresa.tipoLicencia === 'basico' ? 29000 : 0;
      return total + precio;
    }, 0);

    setMetricas({
      totalEmpresas,
      empresasActivas,
      ingresosMensuales,
      facturasGeneradas: 1250, // Mock
      usuariosTotales: 45, // Mock
      tareasPendientesIA: 8 // Mock
    });
  };

  const procesarConIA = async (tipoTarea: string) => {
    // Simular procesamiento con IA
    setMetricas(prev => ({ ...prev, tareasPendientesIA: prev.tareasPendientesIA + 1 }));
    
    setTimeout(() => {
      setMetricas(prev => ({ ...prev, tareasPendientesIA: Math.max(0, prev.tareasPendientesIA - 1) }));
      // Simular notificación de completado
    }, 3000);
  };

  const crearNuevaEmpresa = (nuevaEmpresa: Partial<Empresa>) => {
    const empresaCompleta: Empresa = {
      id: `emp-${Date.now()}`,
      propietarioId: usuario.id,
      administradores: [],
      contadores: [],
      ...nuevaEmpresa
    } as Empresa;
    
    setEmpresas(prev => [...prev, empresaCompleta]);
    alert(`Empresa "${nuevaEmpresa.nombre}" creada exitosamente!`);
  };

  // Centro de Automatización IA Avanzado
  const AutomationCenter = () => (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          🤖 Centro de Automatización IA
          <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
            ACTIVO
          </span>
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Tareas en proceso</p>
          <p className="text-2xl font-bold text-purple-600">{metricas.tareasPendientesIA}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            titulo: 'Procesamiento Documentos',
            descripcion: 'OCR + clasificación automática',
            cantidad: 156,
            accion: 'Procesar Lote',
            tipo: 'documentos',
            icono: '📄',
            color: 'blue'
          },
          {
            titulo: 'Conciliación Bancaria',
            descripcion: 'Match automático de transacciones',
            cantidad: 23,
            accion: 'Ejecutar IA',
            tipo: 'conciliacion',
            icono: '🏦',
            color: 'green'
          },
          {
            titulo: 'Clasificación Gastos',
            descripcion: 'Categorización inteligente',
            cantidad: 89,
            accion: 'Clasificar Todo',
            tipo: 'clasificacion',
            icono: '🏷️',
            color: 'yellow'
          },
          {
            titulo: 'Predicciones Flujo',
            descripcion: 'Análisis predictivo de caja',
            cantidad: 12,
            accion: 'Generar Reporte',
            tipo: 'predicciones',
            icono: '📈',
            color: 'purple'
          },
          {
            titulo: 'Alertas Tributarias',
            descripcion: 'Detección de inconsistencias',
            cantidad: 5,
            accion: 'Revisar Alertas',
            tipo: 'alertas',
            icono: '⚠️',
            color: 'red'
          },
          {
            titulo: 'Optimización SII',
            descripcion: 'Preparación formularios automática',
            cantidad: 34,
            accion: 'Optimizar',
            tipo: 'sii',
            icono: '🇨🇱',
            color: 'indigo'
          }
        ].map((tarea, index) => (
          <div key={index} className={`bg-white rounded-lg p-4 border border-${tarea.color}-200 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{tarea.icono}</span>
              <span className={`text-lg font-bold text-${tarea.color}-600`}>{tarea.cantidad}</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{tarea.titulo}</h4>
            <p className="text-xs text-gray-600 mb-3">{tarea.descripcion}</p>
            <button
              onClick={() => procesarConIA(tarea.tipo)}
              className={`w-full bg-${tarea.color}-100 hover:bg-${tarea.color}-200 text-${tarea.color}-800 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              {tarea.accion}
            </button>
          </div>
        ))}
      </div>

      {/* Estado del Sistema IA */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Estado del Sistema IA</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">CPU IA</p>
            <p className="text-lg font-bold text-green-600">78%</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Memoria</p>
            <p className="text-lg font-bold text-blue-600">12.4GB</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Precisión</p>
            <p className="text-lg font-bold text-purple-600">97.8%</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Uptime</p>
            <p className="text-lg font-bold text-green-600">99.9%</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header Ejecutivo */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                👑 Panel Ejecutivo SuperAdmin
              </h1>
              <p className="text-purple-100 mt-2">
                Bienvenido {usuario.nombre} - Gestión Multi-Empresa con IA
              </p>
            </div>
            <div className="text-right text-white">
              <div className="text-sm opacity-90">Ingresos Mensuales</div>
              <div className="text-2xl font-bold">{formatCurrency(metricas.ingresosMensuales)}</div>
            </div>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Empresas Activas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metricas.empresasActivas}/{metricas.totalEmpresas}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Facturas Generadas</p>
                <p className="text-2xl font-semibold text-gray-900">{metricas.facturasGeneradas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Usuarios Totales</p>
                <p className="text-2xl font-semibold text-gray-900">{metricas.usuariosTotales}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tareas IA Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">{metricas.tareasPendientesIA}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Automatización IA */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              🤖 Centro de Automatización IA
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Procesa tareas de todas las empresas con inteligencia artificial
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => procesarConIA('Facturas Pendientes')}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📄</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Procesar Facturas</div>
                    <div className="text-sm text-gray-500">23 facturas pendientes</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => procesarConIA('Declaraciones SII')}
                className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏛️</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Declaraciones SII</div>
                    <div className="text-sm text-gray-500">8 F29 por generar</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => procesarConIA('Conciliaciones Bancarias')}
                className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏦</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Conciliaciones</div>
                    <div className="text-sm text-gray-500">12 cuentas pendientes</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Centro de Automatización IA Avanzado */}
        <AutomationCenter />

        {/* Lista de Empresas */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Empresas Gestionadas
              </h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      onClick={() => setMostrarModalEmpresa(true)}>
                + Nueva Empresa
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Licencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {empresas.map((empresa) => (
                  <tr key={empresa.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{empresa.nombre}</div>
                        <div className="text-sm text-gray-500">{empresa.rut}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        empresa.tipoLicencia === 'premium' 
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {empresa.tipoLicencia.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {empresa.fechaVencimiento.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        empresa.activa 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {empresa.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Administrar
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Ver Datos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
