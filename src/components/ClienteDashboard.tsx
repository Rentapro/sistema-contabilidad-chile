'use client';

import { useState } from 'react';
import { Usuario } from '@/types/auth';
import { formatCurrency } from '@/lib/utils';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import { useAuth } from '@/contexts/AuthContext';
import { PlanUpgradeModal } from './PlanUpgradeModal';
import HeaderWithLogout from './HeaderWithLogout';

interface ClienteDashboardProps {
  usuario: Usuario;
}

export default function ClienteDashboard({ usuario }: ClienteDashboardProps) {
  const { empresaActual } = useAuth();
  const { 
    limites, 
    cargando, 
    diasHastaVencimiento, 
    necesitaRenovacion,
    obtenerColorPorcentaje,
    puedeCrearFactura,
    puedeCrearCliente,
    puedeUsarIA,
    puedeAccederReportesAvanzados
  } = useUsageLimits();

  const [metricas] = useState({
    facturasMes: 15,
    ingresosMes: 2500000,
    gastosMes: 800000,
    clientesActivos: 25,
    proximoVencimiento: new Date('2025-07-15')
  });

  const [mostrarModalUpgrade, setMostrarModalUpgrade] = useState(false);

  // Funcionalidades limitadas para cliente básico
  const modulosBasicos = [
    {
      titulo: 'Facturación Simple',
      descripcion: 'Crear y gestionar facturas básicas',
      href: '/facturas',
      icon: '📄',
      disponible: true,
      verificacion: () => puedeCrearFactura()
    },
    {
      titulo: 'Gestión de Clientes',
      descripcion: 'Administrar información de clientes',
      href: '/clientes',
      icon: '👥',
      disponible: true,
      verificacion: () => puedeCrearCliente()
    },
    {
      titulo: 'Reportes Básicos',
      descripcion: 'Reportes esenciales para tu negocio',
      href: '/reportes',
      icon: '📊',
      disponible: true
    },
    {
      titulo: 'Declaraciones Simples',
      descripcion: 'F29 y declaraciones básicas',
      href: '/declaraciones',
      icon: '🏛️',
      disponible: true
    },    {
      titulo: 'Reportes Avanzados',
      descripcion: 'Analytics e IA avanzada',
      href: '/advanced-analytics',
      icon: '🧠',
      disponible: true,
      premium: true,
      verificacion: () => puedeAccederReportesAvanzados()
    },
    {
      titulo: 'Automatización IA',
      descripcion: 'Procesamiento automático con IA',
      href: '/workflow-automation',
      icon: '🤖',
      disponible: true,
      premium: true,
      verificacion: () => puedeUsarIA()
    }
  ];
  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 shadow-lg"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-2 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
        </div>
        <div className="absolute mt-32 text-slate-600 font-medium">
          Cargando panel de cliente...
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">      <HeaderWithLogout 
        title="🏢 Panel de Contabilidad"
        subtitle={`Bienvenido ${usuario.nombre} - ${usuario.empresa || 'Sistema Básico'}`}
      />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Banner de plan con glass morphism */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 p-1 mb-8 shadow-2xl">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-lg font-semibold mb-2 opacity-90">
                    Plan Activo
                  </h2>
                  <p className="text-white/80 text-sm">
                    Gestión contable simplificada
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-white drop-shadow-lg">
                    {usuario.licencia.toUpperCase()}
                  </div>
                  <div className="flex items-center text-white/90 text-sm mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Sistema activo
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
            </div>
          </div>

        {/* Métricas del Cliente con glass morphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 h-full">
              <div className="flex items-center">
                <div className="relative">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 shadow-lg">
                    <svg className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-slate-600">Facturas del Mes</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {metricas.facturasMes}
                  </p>
                  <div className="flex items-center text-blue-600 text-xs mt-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                    Este mes
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
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-slate-600">Ingresos del Mes</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {formatCurrency(metricas.ingresosMes)}
                  </p>
                  <div className="flex items-center text-emerald-600 text-xs mt-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                    +8% vs anterior
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 h-full">
              <div className="flex items-center">
                <div className="relative">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 shadow-lg">
                    <svg className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-red-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-slate-600">Gastos del Mes</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    {formatCurrency(metricas.gastosMes)}
                  </p>
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                    Control necesario
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 h-full">
              <div className="flex items-center">
                <div className="relative">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 shadow-lg">
                    <svg className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-slate-600">Clientes Activos</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    {metricas.clientesActivos}
                  </p>
                  <div className="flex items-center text-purple-600 text-xs mt-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1 animate-pulse"></div>
                    Base creciente
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Límites de Uso */}
        {limites && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Uso de Recursos
                </h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  empresaActual?.tipoLicencia === 'premium' 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  Plan {empresaActual?.tipoLicencia?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Facturas */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Facturas</span>
                    <span className="text-sm text-gray-500">
                      {limites.facturas.usado}/{limites.facturas.limite}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${obtenerColorPorcentaje(limites.facturas.porcentaje)}-500`}
                      style={{ width: `${Math.min(100, limites.facturas.porcentaje)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {limites.facturas.porcentaje.toFixed(1)}% utilizado
                  </p>
                </div>

                {/* Clientes */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Clientes</span>
                    <span className="text-sm text-gray-500">
                      {limites.clientes.usado}/{limites.clientes.limite}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${obtenerColorPorcentaje(limites.clientes.porcentaje)}-500`}
                      style={{ width: `${Math.min(100, limites.clientes.porcentaje)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {limites.clientes.porcentaje.toFixed(1)}% utilizado
                  </p>
                </div>

                {/* Usuarios */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Usuarios</span>
                    <span className="text-sm text-gray-500">
                      {limites.usuarios.usado}/{limites.usuarios.limite}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${obtenerColorPorcentaje(limites.usuarios.porcentaje)}-500`}
                      style={{ width: `${Math.min(100, limites.usuarios.porcentaje)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {limites.usuarios.porcentaje.toFixed(1)}% utilizado
                  </p>
                </div>

                {/* Almacenamiento */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Almacenamiento</span>
                    <span className="text-sm text-gray-500">
                      {(limites.almacenamiento.usado / 1000).toFixed(1)}GB/{(limites.almacenamiento.limite / 1000).toFixed(0)}GB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${obtenerColorPorcentaje(limites.almacenamiento.porcentaje)}-500`}
                      style={{ width: `${Math.min(100, limites.almacenamiento.porcentaje)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {limites.almacenamiento.porcentaje.toFixed(1)}% utilizado
                  </p>
                </div>
              </div>

              {/* Advertencias si hay límites cercanos */}
              {(limites.facturas.porcentaje > 90 || limites.clientes.porcentaje > 90 || limites.usuarios.porcentaje > 90) && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Límites de uso próximos</h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        Te estás acercando a los límites de tu plan. Considera actualizar para evitar interrupciones.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Utilidad del Mes */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen Financiero del Mes</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Utilidad del Mes:</span>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(metricas.ingresosMes - metricas.gastosMes)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Margen:</span>
                <div className="text-lg font-semibold text-blue-600">
                  {(((metricas.ingresosMes - metricas.gastosMes) / metricas.ingresosMes) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos Disponibles */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Funcionalidades Disponibles
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Herramientas para gestionar tu contabilidad
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modulosBasicos.map((modulo, index) => {
                const verificacion = modulo.verificacion ? modulo.verificacion() : { permitido: true };
                const puedeAcceder = modulo.disponible && verificacion.permitido;
                
                return (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 transition-colors relative ${
                      puedeAcceder
                        ? 'border-gray-200 hover:border-blue-300 cursor-pointer'
                        : 'border-gray-100 bg-gray-50 opacity-60'
                    }`}
                    onClick={() => puedeAcceder && (window.location.href = modulo.href)}
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{modulo.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{modulo.titulo}</h4>
                          {modulo.premium && (
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Premium
                            </span>
                          )}
                          {!verificacion.permitido && verificacion.razon && (
                            <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              Límite
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{modulo.descripcion}</p>
                        
                        {/* Mostrar restricciones específicas */}
                        {!verificacion.permitido && verificacion.razon && (
                          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                            {verificacion.razon}
                          </div>
                        )}
                        
                        {verificacion.permitido && verificacion.razon && (
                          <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                            {verificacion.razon}
                          </div>
                        )}
                        
                        {!modulo.disponible && (
                          <button 
                            className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMostrarModalUpgrade(true);
                            }}
                          >
                            {verificacion.accionSugerida || 'Actualizar Plan'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Información de Licencia y Vencimiento */}
        <div className={`border rounded-lg p-6 ${
          necesitaRenovacion() 
            ? 'bg-red-50 border-red-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <h4 className={`font-medium ${
                  necesitaRenovacion() ? 'text-red-900' : 'text-blue-900'
                }`}>
                  Plan {empresaActual?.tipoLicencia?.toUpperCase() || usuario.licencia.toUpperCase()}
                </h4>
                {necesitaRenovacion() && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-200 text-red-800 rounded-full animate-pulse">
                    ¡Renovar pronto!
                  </span>
                )}
              </div>
              <p className={`text-sm mt-1 ${
                necesitaRenovacion() ? 'text-red-700' : 'text-blue-700'
              }`}>
                {empresaActual?.tipoLicencia === 'premium' 
                  ? 'Acceso completo a todas las funcionalidades'
                  : 'Acceso a funcionalidades básicas de contabilidad'
                }
              </p>
              {necesitaRenovacion() && (
                <p className="text-sm text-red-700 mt-1 font-medium">
                  Tu licencia vence en {diasHastaVencimiento()} días
                </p>
              )}
            </div>
            <div className="text-right">
              <div className={`text-sm ${
                necesitaRenovacion() ? 'text-red-700' : 'text-blue-700'
              }`}>
                {necesitaRenovacion() ? 'Vence en:' : 'Próximo vencimiento:'}
              </div>
              <div className={`font-medium ${
                necesitaRenovacion() ? 'text-red-900' : 'text-blue-900'
              }`}>
                {empresaActual?.fechaVencimiento?.toLocaleDateString() || 
                 metricas.proximoVencimiento.toLocaleDateString()}
              </div>
              <div className="flex gap-2 mt-2">
                {empresaActual?.tipoLicencia !== 'premium' && (
                  <button 
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm"
                    onClick={() => setMostrarModalUpgrade(true)}
                  >
                    Actualizar a Premium
                  </button>
                )}
                {necesitaRenovacion() && (
                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                    onClick={() => alert('Funcionalidad de renovación próximamente')}
                  >
                    Renovar Licencia
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Comparación de planes */}
          {empresaActual?.tipoLicencia !== 'premium' && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">¿Por qué actualizar a Premium?</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-blue-700">
                  <span className="font-medium">✓</span> Facturas ilimitadas
                </div>
                <div className="text-blue-700">
                  <span className="font-medium">✓</span> Automatización IA
                </div>
                <div className="text-blue-700">
                  <span className="font-medium">✓</span> Reportes avanzados                </div>
                <div className="text-blue-700">
                  <span className="font-medium">✓</span> Integraciones bancarias
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Actualización de Plan */}
      <PlanUpgradeModal
        isOpen={mostrarModalUpgrade}
        onClose={() => setMostrarModalUpgrade(false)}
        planActual={empresaActual?.tipoLicencia || usuario.licencia}
      />
      </div>
    </div>
  );
}
