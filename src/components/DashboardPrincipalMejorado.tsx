'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface MetricaRapida {
  titulo: string;
  valor: string;
  icono: string;
  color: string;
  enlace: string;
  cambio?: string;
  tendencia?: 'up' | 'down' | 'stable';
}

interface AlertaUrgente {
  tipo: 'critica' | 'importante' | 'info';
  mensaje: string;
  enlace: string;
  icono: string;
}

const metricas: MetricaRapida[] = [
  {
    titulo: 'F29 Pendientes',
    valor: '3',
    icono: '📊',
    color: 'bg-red-100 text-red-800',
    enlace: '/reportes-avanzados',
    cambio: '+1',
    tendencia: 'up'
  },
  {
    titulo: 'Docs Vencidos',
    valor: '8',
    icono: '📁',
    color: 'bg-orange-100 text-orange-800',
    enlace: '/centro-documentos',
    cambio: '+2',
    tendencia: 'up'
  },
  {
    titulo: 'DTE Hoy',
    valor: '15',
    icono: '📄',
    color: 'bg-blue-100 text-blue-800',
    enlace: '/dte-electronico',
    cambio: '+8',
    tendencia: 'up'
  },
  {
    titulo: 'Eventos Tributarios',
    valor: '6',
    icono: '📅',
    color: 'bg-yellow-100 text-yellow-800',
    enlace: '/calendario-tributario',
    cambio: '=',
    tendencia: 'stable'
  },
  {
    titulo: 'Ahorro IA',
    valor: '$8.5M',
    icono: '🤖',
    color: 'bg-green-100 text-green-800',
    enlace: '/ia-fiscal',
    cambio: '+$2.1M',
    tendencia: 'up'
  },
  {
    titulo: 'Alertas SII',
    valor: '5',
    icono: '🚨',
    color: 'bg-red-100 text-red-800',
    enlace: '/alertas-sii',
    cambio: '+2',
    tendencia: 'up'
  }
];

const alertasUrgentes: AlertaUrgente[] = [
  {
    tipo: 'critica',
    mensaje: 'Certificado SSL vencido hace 10 días - Renovar inmediatamente',
    enlace: '/centro-documentos',
    icono: '🔒'
  },
  {
    tipo: 'importante',
    mensaje: 'F29 de Mayo con observación del SII - Revisar y corregir',
    enlace: '/alertas-sii',
    icono: '🇨🇱'
  },
  {
    tipo: 'info',
    mensaje: 'Nueva optimización IA detectada: Ahorro potencial $890.000',
    enlace: '/ia-fiscal',
    icono: '💡'
  }
];

const accionesRapidas = [
  {
    titulo: 'Generar F29',
    descripcion: 'Formulario automático con IA',
    icono: '📊',
    enlace: '/reportes-avanzados',
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    titulo: 'Nueva Factura',
    descripcion: 'DTE electrónico SII',
    icono: '📄',
    enlace: '/dte-electronico',
    color: 'bg-green-600 hover:bg-green-700'
  },
  {
    titulo: 'Consultar IA',
    descripcion: 'Optimizaciones tributarias',
    icono: '🤖',
    enlace: '/ia-fiscal',
    color: 'bg-purple-600 hover:bg-purple-700'
  },
  {
    titulo: 'Ver Calendario',
    descripcion: 'Fechas importantes',
    icono: '📅',
    enlace: '/calendario-tributario',
    color: 'bg-orange-600 hover:bg-orange-700'
  }
];

export default function DashboardPrincipalMejorado() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTendenciaIcon = (tendencia?: string) => {
    switch (tendencia) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '➡️';
      default:
        return '';
    }
  };

  const getAlertaBadge = (tipo: string) => {
    switch (tipo) {
      case 'critica':
        return <Badge className="bg-red-100 text-red-800">🚨 Crítica</Badge>;
      case 'importante':
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Importante</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">💡 Info</Badge>;
      default:
        return <Badge>{tipo}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Principal */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏢 Dashboard Principal</h1>
            <p className="text-blue-100 text-lg">
              Sistema Integrado de Contabilidad Chilena con IA Avanzada
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Última actualización</div>
            <div className="text-lg font-semibold">
              {new Date().toLocaleString('es-CL')}
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Resumen Ejecutivo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {metricas.map((metrica, index) => (
            <Link
              key={index}
              href={metrica.enlace}
              className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{metrica.icono}</div>
                <Badge className={metrica.color}>
                  {metrica.cambio} {getTendenciaIcon(metrica.tendencia)}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {metrica.valor}
              </div>
              <div className="text-sm text-gray-600">
                {metrica.titulo}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Alertas Urgentes */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🚨 Alertas Urgentes</h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            {alertasUrgentes.map((alerta, index) => (
              <Link
                key={index}
                href={alerta.enlace}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{alerta.icono}</div>
                  <div>
                    <div className="font-medium text-gray-900">{alerta.mensaje}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getAlertaBadge(alerta.tipo)}
                  <div className="text-gray-400">→</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">⚡ Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accionesRapidas.map((accion, index) => (
            <Link
              key={index}
              href={accion.enlace}
              className={`${accion.color} text-white rounded-xl p-6 transition-all duration-200 hover:scale-105 shadow-lg`}
            >
              <div className="text-4xl mb-4">{accion.icono}</div>
              <div className="text-lg font-semibold mb-2">{accion.titulo}</div>
              <div className="text-sm opacity-90">{accion.descripcion}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Nuevas Funcionalidades */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Nuevas Funcionalidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/reportes-avanzados"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📋</div>
              <Badge className="bg-blue-200 text-blue-800">Nuevo</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">Reportes SII Avanzados</h3>
            <p className="text-blue-100 text-sm mb-4">
              F29, F22, Libros IVA y Propuestas automáticas con IA
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm">3 F29 pendientes</span>
              <Badge className="bg-red-200 text-red-800">Urgente</Badge>
            </div>
          </Link>

          <Link
            href="/calendario-tributario"
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📅</div>
              <Badge className="bg-orange-200 text-orange-800">8 eventos</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">Calendario Tributario</h3>
            <p className="text-orange-100 text-sm mb-4">
              Fechas importantes y recordatorios automáticos
            </p>
            <div className="text-sm">
              Próximo: F29 vence en 12 días
            </div>
          </Link>

          <Link
            href="/simulador-multas"
            className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">⚖️</div>
              <Badge className="bg-red-200 text-red-800">Calculadora</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">Simulador de Multas</h3>
            <p className="text-red-100 text-sm mb-4">
              Calculadora de multas y recargos del SII
            </p>
            <div className="text-sm">
              Evita sanciones con cálculos precisos
            </div>
          </Link>

          <Link
            href="/centro-documentos"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📁</div>
              <Badge className="bg-purple-200 text-purple-800">156 docs</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">Centro de Documentos</h3>
            <p className="text-purple-100 text-sm mb-4">
              Gestión de certificados y documentos tributarios
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm">12 requieren atención</span>
              <Badge className="bg-yellow-200 text-yellow-800">Revisar</Badge>
            </div>
          </Link>

          <Link
            href="/dte-electronico"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📄</div>
              <Badge className="bg-green-200 text-green-800">SII Activo</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">DTE Electrónico</h3>
            <p className="text-green-100 text-sm mb-4">
              Factura y Boleta Electrónica integrada con SII
            </p>
            <div className="text-sm">
              {formatCurrency(245890000)} facturado este mes
            </div>
          </Link>

          <Link
            href="/ia-fiscal"
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🤖</div>
              <Badge className="bg-indigo-200 text-indigo-800">IA Activa</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">IA Fiscal Avanzada</h3>
            <p className="text-indigo-100 text-sm mb-4">
              Consultor tributario inteligente con optimizaciones
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ahorro detectado: $8.5M</span>
              <Badge className="bg-green-200 text-green-800">+$2.1M</Badge>
            </div>
          </Link>
        </div>
      </div>

      {/* Estado del Sistema */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Estado del Sistema</h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-sm font-medium text-gray-900">SII Conectado</div>
              <div className="text-xs text-gray-500">Última sync: hace 2 min</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">🤖</span>
              </div>
              <div className="text-sm font-medium text-gray-900">IA Activa</div>
              <div className="text-xs text-gray-500">Procesando 15 docs</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600 font-bold">📊</span>
              </div>
              <div className="text-sm font-medium text-gray-900">Reportes</div>
              <div className="text-xs text-gray-500">3 pendientes</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">📁</span>
              </div>
              <div className="text-sm font-medium text-gray-900">Almacenamiento</div>
              <div className="text-xs text-gray-500">2.4 GB / 10 GB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Consejo del Día Compacto */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">💡</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Consejo Tributario del Día</h3>
            <p className="text-yellow-100 mb-4">
              Aprovecha el beneficio del Art. 33 bis de la Ley de Renta para depreciar 
              instantáneamente activos bajo 13.5 UTM y reduce tu base imponible hasta en $8.500.000.
            </p>
            <Link
              href="/consejos"
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              Ver más consejos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
