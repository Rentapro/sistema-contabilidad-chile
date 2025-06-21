'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/database-service';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingPersonalizado from './OnboardingPersonalizadoMejorado';
import SuperAdminDashboard from './SuperAdminDashboard';
import ClienteDashboard from './ClienteDashboard';
import DashboardContadorExterno from './DashboardContadorExterno';
import DashboardMultiEmpresa from './DashboardMultiEmpresa';
import LoginPage from './LoginPage';
import HeaderWithLogout from './HeaderWithLogout';

interface ResumenFuncionalidad {
  titulo: string;
  descripcion: string;
  icono: string;
  href: string;
  stats: {
    valor: string | number;
    label: string;
    tendencia?: 'up' | 'down' | 'neutral';
  };
  estado: 'activo' | 'pendiente' | 'alerta';
  badge?: number;
}

const funcionalidadesResumen: ResumenFuncionalidad[] = [
  {
    titulo: 'Reportes SII Avanzados',
    descripcion: 'F29, F22, Libros IVA con IA',
    icono: '📋',
    href: '/reportes-avanzados',
    stats: {
      valor: '$5.585.000',
      label: 'Ahorro Detectado',
      tendencia: 'up'
    },
    estado: 'activo',
    badge: 3
  },
  {
    titulo: 'Calendario Tributario',
    descripcion: 'Fechas importantes y recordatorios',
    icono: '📅',
    href: '/calendario-tributario',
    stats: {
      valor: 8,
      label: 'Eventos Próximos',
      tendencia: 'neutral'
    },
    estado: 'alerta',
    badge: 8
  },
  {
    titulo: 'DTE Electrónico',
    descripcion: 'Factura y Boleta Electrónica SII',
    icono: '📄',
    href: '/dte-electronico',
    stats: {
      valor: 1247,
      label: 'Docs Emitidos',
      tendencia: 'up'
    },
    estado: 'activo',
    badge: 2
  },
  {
    titulo: 'Centro de Documentos',
    descripcion: 'Gestión inteligente de certificados',
    icono: '📁',
    href: '/centro-documentos',
    stats: {
      valor: 156,
      label: 'Documentos',
      tendencia: 'up'
    },
    estado: 'activo',
    badge: 12
  },
  {
    titulo: 'Simulador de Multas',
    descripcion: 'Calculadora de multas y recargos',
    icono: '⚖️',
    href: '/simulador-multas',
    stats: {
      valor: '$2.450.000',
      label: 'Multas Evitadas',
      tendencia: 'up'
    },
    estado: 'activo'
  },
  {
    titulo: 'IA Fiscal Avanzada',
    descripcion: 'Consultor tributario inteligente',
    icono: '🧠',
    href: '/ia-fiscal',
    stats: {
      valor: '95%',
      label: 'Precisión IA',
      tendencia: 'up'
    },
    estado: 'activo',
    badge: 4
  },  {
    titulo: 'Configuración SII',
    descripcion: 'Gestión de credenciales y conexión',
    icono: '🔐',
    href: '/configuracion-sii',
    stats: {
      valor: 'Disponible',
      label: 'Login Seguro',
      tendencia: 'neutral'
    },
    estado: 'activo',
    badge: 1
  },
  {
    titulo: 'Onboarding de Clientes',
    descripcion: 'Proceso completo de alta de clientes',
    icono: '🎯',
    href: '/onboarding-clientes',
    stats: {
      valor: 24,
      label: 'Clientes Nuevos',
      tendencia: 'up'
    },
    estado: 'activo',
    badge: 5
  },  {
    titulo: 'Gestión de Certificados',
    descripcion: 'Certificados digitales y firma electrónica',
    icono: '🔐',
    href: '/gestion-certificados',
    stats: {
      valor: 3,
      label: 'Certificados Activos',
      tendencia: 'neutral'
    },
    estado: 'alerta',
    badge: 1
  },
  {
    titulo: 'Centro de Notificaciones',
    descripcion: 'Alertas tributarias y recordatorios',
    icono: '🔔',
    href: '/centro-notificaciones',
    stats: {
      valor: 12,
      label: 'Notificaciones',
      tendencia: 'down'
    },
    estado: 'activo',
    badge: 12
  },
  {
    titulo: 'Importación Masiva',
    descripcion: 'Carga masiva de clientes desde Excel',
    icono: '📊',
    href: '/importacion-masiva',
    stats: {
      valor: 156,
      label: 'Últimos Importados',
      tendencia: 'up'
    },
    estado: 'activo'
  },
  // NUEVAS FUNCIONALIDADES AVANZADAS
  {
    titulo: 'Dashboard Tiempo Real',
    descripcion: 'Monitoreo en vivo del sistema',
    icono: '⚡',
    href: '/real-time-dashboard',
    stats: {
      valor: '5',
      label: 'Métricas Activas',
      tendencia: 'up'
    },
    estado: 'activo',
    badge: 2
  },
  {
    titulo: 'Centro de Notificaciones',
    descripcion: 'Sistema avanzado de alertas',
    icono: '🔔',
    href: '/notification-center',
    stats: {
      valor: 12,
      label: 'Notificaciones',
      tendencia: 'up'
    },
    estado: 'alerta',
    badge: 12
  },
  {
    titulo: 'Automatización IA',
    descripcion: 'Workflows inteligentes automáticos',
    icono: '🤖',
    href: '/workflow-automation',
    stats: {
      valor: '8',
      label: 'Procesos Activos',
      tendencia: 'up'
    },
    estado: 'activo',
    badge: 3
  },
  {
    titulo: 'Predicciones IA',
    descripcion: 'Análisis predictivo inteligente',
    icono: '🔮',
    href: '/ai-predictions',
    stats: {
      valor: '94%',
      label: 'Precisión Promedio',
      tendencia: 'up'
    },
    estado: 'activo',
    badge: 8
  },
  // NUEVOS MÓDULOS DE GESTIÓN AVANZADA
  {
    titulo: 'Exportador de Reportes',
    descripcion: 'Generación profesional de reportes',
    icono: '📤',
    href: '/export-reports',    stats: {
      valor: '25',
      label: 'Plantillas Disponibles',
      tendencia: 'neutral'
    },
    estado: 'activo'
  },
  {
    titulo: 'Notificaciones Tiempo Real',
    descripcion: 'Sistema avanzado de alertas en vivo',
    icono: '🔴',
    href: '/real-time-notifications',
    stats: {
      valor: '4',
      label: 'Canales Activos',
      tendencia: 'up'
    },
    estado: 'alerta',
    badge: 15
  },
  {
    titulo: 'Configuración Sistema',
    descripcion: 'Gestión avanzada del sistema',
    icono: '⚙️',
    href: '/system-config',    stats: {
      valor: '6',
      label: 'Módulos Activos',
      tendencia: 'neutral'
    },
    estado: 'activo',
    badge: 3
  },
  {
    titulo: 'Analytics Avanzado',
    descripcion: 'Análisis empresarial con IA',
    icono: '🧠',
    href: '/advanced-analytics',
    stats: {
      valor: '92.3%',
      label: 'Precisión Analytics',
      tendencia: 'up'
    },
    estado: 'activo'
  },
  {
    titulo: 'Monitor de Performance',
    descripcion: 'Monitoreo en tiempo real del sistema',
    icono: '📊',
    href: '/performance-monitor',
    stats: {
      valor: '99.8%',
      label: 'Uptime Sistema',
      tendencia: 'up'
    },
    estado: 'activo'
  },
];

interface AlertaUrgente {
  id: string;
  tipo: 'critica' | 'advertencia' | 'info';
  titulo: string;
  mensaje: string;
  accion: string;
  href: string;
  fechaLimite?: string;
}

const alertasUrgentes: AlertaUrgente[] = [
  {
    id: '1',
    tipo: 'critica',
    titulo: 'F29 Junio 2025 Pendiente',
    mensaje: 'Formulario F29 debe presentarse antes del 12 de julio',
    accion: 'Presentar Ahora',
    href: '/reportes-avanzados',
    fechaLimite: '2025-07-12'
  },
  {
    id: '2',
    tipo: 'advertencia',
    titulo: 'Certificado SSL por Vencer',
    mensaje: 'Certificado digital vence en 30 días',
    accion: 'Renovar Certificado',
    href: '/centro-documentos'
  },
  {
    id: '3',
    tipo: 'info',
    titulo: 'Optimización IA Disponible',
    mensaje: 'Nueva optimización detectada: ahorro $890.000',
    accion: 'Ver Detalles',
    href: '/ia-fiscal'
  }
];

export default function DashboardCompleto() {
  const { usuario, isLoading } = useAuth();
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);

  useEffect(() => {
    // Mostrar onboarding si es un usuario nuevo o si no ha completado la configuración inicial
    if (usuario && !localStorage.getItem(`onboarding-completed-${usuario.id}`)) {
      setMostrarOnboarding(true);
    }
  }, [usuario]);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 shadow-lg"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-2 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
        </div>
        <div className="absolute mt-32 text-slate-600 font-medium">
          Cargando sistema inteligente...
        </div>
      </div>
    );
  }
  if (!usuario) {
    return <LoginPage />;
  }

  // Dashboards específicos por rol
  const renderDashboardPorRol = () => {
    switch (usuario.rol) {
      case 'superadmin':
        return <SuperAdminDashboard usuario={usuario} />;
      case 'admin_empresa':
        return <DashboardMultiEmpresa />;
      case 'contador':
        return <DashboardContadorExterno />;
      case 'cliente_basico':
        return <ClienteDashboard usuario={usuario} />;
      default:
        return <DashboardGeneral />;
    }
  };

  return (
    <>
      {mostrarOnboarding && (
        <OnboardingPersonalizado />
      )}
      {renderDashboardPorRol()}
    </>
  );
}

// Dashboard general para usuarios no autenticados
function DashboardGeneral() {
  // Estado para estadísticas de importación masiva
  const [importCount, setImportCount] = useState<number>(0);

  useEffect(() => {
    // Obtener conteo de clientes (representa importaciones)
    supabase
      .from('clientes')
      .select('id', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (!error && count !== null) {
          setImportCount(count);
        }
      });
  }, []);
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return (
          <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full text-xs font-bold shadow-lg shadow-emerald-500/30">
            ✅ Activo
          </div>
        );
      case 'pendiente':
        return (
          <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg shadow-amber-500/30">
            ⏳ Pendiente
          </div>
        );
      case 'alerta':
        return (
          <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs font-bold shadow-lg shadow-red-500/30 animate-pulse">
            🚨 Alerta
          </div>
        );
      default:
        return (
          <div className="px-3 py-1 bg-gradient-to-r from-slate-500 to-gray-500 text-white rounded-full text-xs font-bold shadow-lg shadow-slate-500/30">
            {estado}
          </div>
        );
    }
  };

  const getTendenciaIcon = (tendencia?: string) => {
    switch (tendencia) {
      case 'up':
        return (
          <div className="flex items-center text-emerald-600">
            <span className="text-lg">📈</span>
            <div className="w-1 h-1 bg-emerald-500 rounded-full ml-1 animate-pulse"></div>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center text-red-600">
            <span className="text-lg">📉</span>
            <div className="w-1 h-1 bg-red-500 rounded-full ml-1 animate-pulse"></div>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-slate-600">
            <span className="text-lg">➡️</span>
            <div className="w-1 h-1 bg-slate-500 rounded-full ml-1"></div>
          </div>
        );
    }
  };

  const getAlertaTipo = (tipo: string) => {
    switch (tipo) {
      case 'critica':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'advertencia':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const calcularDiasRestantes = (fecha?: string) => {
    if (!fecha) return null;
    const hoy = new Date();
    const limite = new Date(fecha);
    const diff = Math.ceil((limite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <HeaderWithLogout 
        title="📊 Dashboard Inteligente"
        subtitle="Sistema de Contabilidad Chileno con IA Avanzada"
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Banner de métricas principales con glass morphism */}
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-700 p-1">
              <div className="bg-white/95 backdrop-blur-lg rounded-xl p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                      Ahorro Total Detectado por IA
                    </h1>
                    <p className="text-slate-600">Optimizaciones automáticas identificadas</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      $8.035.000
                    </div>
                    <div className="flex items-center text-emerald-600 text-sm font-medium mt-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                      +15% vs mes anterior
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full -translate-y-8 translate-x-8"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas Urgentes con efectos modernos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="text-red-500 mr-3 text-3xl animate-pulse">🚨</span>
            Alertas Urgentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alertasUrgentes.map((alerta) => {
              const diasRestantes = calcularDiasRestantes(alerta.fechaLimite);
              return (
                <div
                  key={alerta.id}
                  className={`group relative overflow-hidden rounded-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                    alerta.tipo === 'critica' 
                      ? 'bg-gradient-to-br from-red-50 to-rose-100 hover:from-red-100 hover:to-rose-200' 
                      : alerta.tipo === 'advertencia'
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-100 hover:from-amber-100 hover:to-yellow-200'
                      : 'bg-gradient-to-br from-blue-50 to-cyan-100 hover:from-blue-100 hover:to-cyan-200'
                  }`}
                >
                  <div className="relative z-10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className={`font-bold text-lg ${
                        alerta.tipo === 'critica' ? 'text-red-800' : 
                        alerta.tipo === 'advertencia' ? 'text-amber-800' : 'text-blue-800'
                      }`}>
                        {alerta.titulo}
                      </h3>
                      {diasRestantes !== null && (
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          alerta.tipo === 'critica' 
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                            : 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                        }`}>
                          {diasRestantes} días
                        </div>
                      )}
                    </div>
                    <p className={`text-sm mb-4 ${
                      alerta.tipo === 'critica' ? 'text-red-700' : 
                      alerta.tipo === 'advertencia' ? 'text-amber-700' : 'text-blue-700'
                    }`}>
                      {alerta.mensaje}
                    </p>
                    <Link
                      href={alerta.href}
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                        alerta.tipo === 'critica' 
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30' 
                          : alerta.tipo === 'advertencia'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/30'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                      }`}
                    >
                      {alerta.accion}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 ${
                    alerta.tipo === 'critica' ? 'bg-red-500' : 
                    alerta.tipo === 'advertencia' ? 'bg-amber-500' : 'bg-blue-500'
                  } -translate-y-8 translate-x-8`}></div>
                </div>
              );
            })}
          </div>
        </div>        {/* Funcionalidades Principales con glass morphism */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="text-blue-500 mr-3 text-3xl">🚀</span>
            Funcionalidades Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funcionalidadesResumen.map((func, index) => {
              // Sobrescribir stats para importación masiva
              let valor = func.stats.valor;
              let label = func.stats.label;
              if (func.href === '/importacion-masiva') {
                valor = importCount;
                label = 'Clientes Importados';
              }
              return (
                <Link
                  key={index}
                  href={func.href}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]"
                >
                  <div className="relative z-10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                            {func.icono}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                            {func.titulo}
                          </h3>
                          <p className="text-sm text-slate-600">{func.descripcion}</p>
                        </div>
                      </div>
                      {func.badge && (
                        <div className="relative">
                          <div className="h-7 w-7 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-red-500/30 animate-pulse">
                            {func.badge > 9 ? '9+' : func.badge}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping opacity-20"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {valor}
                        </div>
                        <div className="text-sm text-slate-600 flex items-center space-x-2 mt-1">
                          <span>{label}</span>
                          <div className="flex items-center">
                            {getTendenciaIcon(func.stats.tendencia)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {getEstadoBadge(func.estado)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Efecto hover background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  
                  {/* Efecto decorativo */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-6 translate-x-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              );
            })}
          </div>
        </div>        {/* Métricas Rápidas con efectos glass y gradientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 h-full">
              <div className="flex items-center">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-lg">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">💰</span>
                  </div>
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    $58.020.000
                  </div>
                  <div className="text-sm text-slate-600 font-medium">Ingresos Junio</div>
                  <div className="flex items-center text-blue-600 text-xs mt-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                    +12% vs anterior
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 h-full">
              <div className="flex items-center">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl shadow-lg">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">📊</span>
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    $4.659.200
                  </div>
                  <div className="text-sm text-slate-600 font-medium">IVA Diferencia</div>
                  <div className="flex items-center text-emerald-600 text-xs mt-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                    Optimizado por IA
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 h-full">
              <div className="flex items-center">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl shadow-lg">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🤖</span>
                  </div>
                  <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    93%
                  </div>
                  <div className="text-sm text-slate-600 font-medium">Precisión IA</div>
                  <div className="flex items-center text-purple-600 text-xs mt-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1 animate-pulse"></div>
                    Mejorando constantemente
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 h-full">
              <div className="flex items-center">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-lg">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">⚡</span>
                  </div>
                  <div className="absolute inset-0 bg-amber-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    15
                  </div>
                  <div className="text-sm text-slate-600 font-medium">Procesos Automatizados</div>
                  <div className="flex items-center text-amber-600 text-xs mt-1">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1 animate-pulse"></div>
                    Activos ahora
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Accesos Rápidos con glass morphism */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="text-yellow-500 mr-3 text-3xl">⚡</span>
              Accesos Rápidos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: '📄', label: 'Nueva Factura', href: '/facturas', color: 'from-blue-500 to-cyan-500' },
                { icon: '🧾', label: 'Nueva Boleta', href: '/dte-electronico', color: 'from-green-500 to-emerald-500' },
                { icon: '💰', label: 'Registrar Gasto', href: '/gastos', color: 'from-red-500 to-pink-500' },
                { icon: '👥', label: 'Nuevo Cliente', href: '/clientes', color: 'from-purple-500 to-violet-500' },
                { icon: '📋', label: 'Generar F29', href: '/reportes-avanzados', color: 'from-amber-500 to-orange-500' },
                { icon: '🤖', label: 'Consultar IA', href: '/ia-fiscal', color: 'from-indigo-500 to-blue-500' }
              ].map((acceso, index) => (
                <Link
                  key={index}
                  href={acceso.href}
                  className="group relative overflow-hidden bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm border border-white/60 rounded-xl p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${acceso.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <span className="text-2xl filter drop-shadow-lg">{acceso.icon}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                      {acceso.label}
                    </div>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${acceso.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl`}></div>
                </Link>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        </div>

        {/* Estado del Sistema Premium */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 rounded-2xl p-1 shadow-2xl">
          <div className="bg-emerald-50/95 backdrop-blur-lg rounded-xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-30"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-800 flex items-center">
                    <span className="mr-2">🇨🇱</span>
                    Sistema Operativo - Integración SII Activa
                  </h3>
                  <p className="text-emerald-700 mt-1">
                    Todas las funcionalidades están operativas. Última sincronización: 
                    <span className="font-semibold ml-1">hace 2 minutos</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-500/30">
                    ✅ Online
                  </div>
                  <div className="px-3 py-1 bg-white/80 text-emerald-800 rounded-full text-sm font-semibold">
                    v2.1.0
                  </div>
                </div>
                <div className="flex items-center text-emerald-600 text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  Rendimiento óptimo
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full -translate-y-8 translate-x-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
