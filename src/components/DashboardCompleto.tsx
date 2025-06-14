'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

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
  },
  {
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
  }
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
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-green-100 text-green-800">✅ Activo</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ Pendiente</Badge>;
      case 'alerta':
        return <Badge className="bg-red-100 text-red-800">🚨 Alerta</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const getTendenciaIcon = (tendencia?: string) => {
    switch (tendencia) {
      case 'up':
        return <span className="text-green-500">📈</span>;
      case 'down':
        return <span className="text-red-500">📉</span>;
      default:
        return <span className="text-gray-500">➡️</span>;
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Principal */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📊 Dashboard Inteligente
              </h1>
              <p className="text-gray-600 text-lg">
                Sistema de Contabilidad Chileno con IA Avanzada
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                $8.035.000
              </div>
              <div className="text-sm text-gray-500">Ahorro Total Detectado</div>
            </div>
          </div>
        </div>

        {/* Alertas Urgentes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚨 Alertas Urgentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alertasUrgentes.map((alerta) => {
              const diasRestantes = calcularDiasRestantes(alerta.fechaLimite);
              return (
                <div
                  key={alerta.id}
                  className={`p-4 rounded-lg border-2 ${getAlertaTipo(alerta.tipo)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{alerta.titulo}</h3>
                    {diasRestantes !== null && (
                      <Badge className="bg-red-100 text-red-800">
                        {diasRestantes} días
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm mb-3">{alerta.mensaje}</p>
                  <Link
                    href={alerta.href}
                    className="inline-block bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    {alerta.accion} →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funcionalidades Principales */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Funcionalidades Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funcionalidadesResumen.map((func, index) => (
              <Link
                key={index}
                href={func.href}
                className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{func.icono}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{func.titulo}</h3>
                      <p className="text-sm text-gray-600">{func.descripcion}</p>
                    </div>
                  </div>
                  {func.badge && (
                    <Badge variant="destructive" className="h-6 w-6 p-0 flex items-center justify-center text-xs">
                      {func.badge > 9 ? '9+' : func.badge}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {func.stats.valor}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-1">
                      <span>{func.stats.label}</span>
                      {getTendenciaIcon(func.stats.tendencia)}
                    </div>
                  </div>
                  {getEstadoBadge(func.estado)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-blue-600">$58.020.000</div>
                <div className="text-sm text-gray-500">Ingresos Junio</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-green-600">$4.659.200</div>
                <div className="text-sm text-gray-500">IVA Diferencia</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-purple-600">93%</div>
                <div className="text-sm text-gray-500">Precisión IA</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-yellow-600">15</div>
                <div className="text-sm text-gray-500">Procesos Automatizados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ Accesos Rápidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: '📄', label: 'Nueva Factura', href: '/facturas' },
              { icon: '🧾', label: 'Nueva Boleta', href: '/dte-electronico' },
              { icon: '💰', label: 'Registrar Gasto', href: '/gastos' },
              { icon: '👥', label: 'Nuevo Cliente', href: '/clientes' },
              { icon: '📋', label: 'Generar F29', href: '/reportes-avanzados' },
              { icon: '🤖', label: 'Consultar IA', href: '/ia-fiscal' }
            ].map((acceso, index) => (
              <Link
                key={index}
                href={acceso.href}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all"
              >
                <div className="text-2xl mb-2">{acceso.icon}</div>
                <div className="text-sm font-medium text-gray-700 text-center">
                  {acceso.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Estado del Sistema */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  🇨🇱 Sistema Operativo - Integración SII Activa
                </h3>
                <p className="text-green-600">
                  Todas las funcionalidades están operativas. Última sincronización: hace 2 minutos
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-green-100 text-green-800 mb-2">✅ Online</Badge>
              <div className="text-sm text-green-600">v2.1.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
