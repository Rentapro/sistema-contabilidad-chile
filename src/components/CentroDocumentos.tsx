'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface Documento {
  id: string;
  nombre: string;
  tipo: 'certificado' | 'factura' | 'contrato' | 'declaracion' | 'otro';
  fechaSubida: string;
  fechaVencimiento?: string;
  estado: 'vigente' | 'vencido' | 'por_vencer' | 'procesando';
  tamaño: string;
  categoria: 'SII' | 'laboral' | 'legal' | 'financiero' | 'comercial';
  confidencialidad: 'publico' | 'confidencial' | 'secreto';
  observaciones?: string;
}

const documentos: Documento[] = [
  {
    id: '1',
    nombre: 'Certificado Digital SII 2025',
    tipo: 'certificado',
    fechaSubida: '2025-01-15',
    fechaVencimiento: '2026-01-15',
    estado: 'vigente',
    tamaño: '2.3 MB',
    categoria: 'SII',
    confidencialidad: 'secreto',
    observaciones: 'Certificado principal para firma electrónica SII'
  },
  {
    id: '2',
    nombre: 'F29 Enero 2025 - Presentado',
    tipo: 'declaracion',
    fechaSubida: '2025-02-12',
    estado: 'vigente',
    tamaño: '854 KB',
    categoria: 'SII',
    confidencialidad: 'confidencial'
  },
  {
    id: '3',
    nombre: 'Contrato Proveedor ABC Ltda',
    tipo: 'contrato',
    fechaSubida: '2025-03-20',
    fechaVencimiento: '2025-12-31',
    estado: 'por_vencer',
    tamaño: '1.2 MB',
    categoria: 'comercial',
    confidencialidad: 'confidencial'
  },
  {
    id: '4',
    nombre: 'Factura Electrónica #1234',
    tipo: 'factura',
    fechaSubida: '2025-06-10',
    estado: 'procesando',
    tamaño: '432 KB',
    categoria: 'financiero',
    confidencialidad: 'publico'
  },
  {
    id: '5',
    nombre: 'Certificado SSL Vencido',
    tipo: 'certificado',
    fechaSubida: '2024-06-01',
    fechaVencimiento: '2025-06-01',
    estado: 'vencido',
    tamaño: '1.8 MB',
    categoria: 'legal',
    confidencialidad: 'confidencial',
    observaciones: 'URGENTE: Renovar inmediatamente'
  }
];

const estadisticas = {
  total: 156,
  vigentes: 142,
  vencidos: 8,
  porVencer: 6,
  procesando: 2,
  almacenamientoUsado: '2.4 GB',
  limiteAlmacenamiento: '10 GB'
};

export default function CentroDocumentos() {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState<'lista' | 'grid'>('lista');

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'vigente':
        return <Badge className="bg-green-100 text-green-800">✅ Vigente</Badge>;
      case 'vencido':
        return <Badge className="bg-red-100 text-red-800">❌ Vencido</Badge>;
      case 'por_vencer':
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Por Vencer</Badge>;
      case 'procesando':
        return <Badge className="bg-blue-100 text-blue-800">🔄 Procesando</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const tipos = {
      certificado: { icon: '🏆', color: 'bg-purple-100 text-purple-800' },
      factura: { icon: '📄', color: 'bg-blue-100 text-blue-800' },
      contrato: { icon: '📋', color: 'bg-orange-100 text-orange-800' },
      declaracion: { icon: '🏛️', color: 'bg-green-100 text-green-800' },
      otro: { icon: '📎', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = tipos[tipo as keyof typeof tipos] || tipos.otro;
    return <Badge className={config.color}>{config.icon} {tipo}</Badge>;
  };

  const getConfidencialidadBadge = (nivel: string) => {
    switch (nivel) {
      case 'secreto':
        return <Badge className="bg-red-100 text-red-800">🔒 Secreto</Badge>;
      case 'confidencial':
        return <Badge className="bg-yellow-100 text-yellow-800">🔐 Confidencial</Badge>;
      case 'publico':
        return <Badge className="bg-green-100 text-green-800">🌐 Público</Badge>;
      default:
        return <Badge>{nivel}</Badge>;
    }
  };

  const documentosFiltrados = documentos.filter(doc => {
    const matchTipo = filtroTipo === 'todos' || doc.tipo === filtroTipo;
    const matchEstado = filtroEstado === 'todos' || doc.estado === filtroEstado;
    const matchBusqueda = doc.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchTipo && matchEstado && matchBusqueda;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📁 Centro de Documentos
              </h1>
              <p className="text-gray-600 text-lg">
                Gestión inteligente de certificados y documentos tributarios
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                📤 Subir Documento
              </button>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                🔄 Sincronizar SII
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-blue-600">{estadisticas.total}</div>
                <div className="text-sm text-gray-500">Total Documentos</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-green-600">{estadisticas.vigentes}</div>
                <div className="text-sm text-gray-500">Vigentes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-red-600">{estadisticas.vencidos}</div>
                <div className="text-sm text-gray-500">Vencidos</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">💾</span>
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold text-purple-600">
                  {estadisticas.almacenamientoUsado}
                </div>
                <div className="text-sm text-gray-500">
                  de {estadisticas.limiteAlmacenamiento}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los tipos</option>
                <option value="certificado">Certificados</option>
                <option value="factura">Facturas</option>
                <option value="contrato">Contratos</option>
                <option value="declaracion">Declaraciones</option>
                <option value="otro">Otros</option>
              </select>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="vigente">Vigentes</option>
                <option value="vencido">Vencidos</option>
                <option value="por_vencer">Por vencer</option>
                <option value="procesando">Procesando</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setVistaActual('lista')}
                  className={`px-3 py-1 rounded-md ${vistaActual === 'lista' ? 'bg-white shadow-sm' : ''}`}
                >
                  📋
                </button>
                <button
                  onClick={() => setVistaActual('grid')}
                  className={`px-3 py-1 rounded-md ${vistaActual === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  ⊞
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista/Grid de Documentos */}
        <div className="bg-white rounded-xl shadow-lg">
          {vistaActual === 'lista' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Documento</th>
                    <th className="text-left py-4 px-6 font-semibold">Tipo</th>
                    <th className="text-left py-4 px-6 font-semibold">Estado</th>
                    <th className="text-left py-4 px-6 font-semibold">Categoría</th>
                    <th className="text-left py-4 px-6 font-semibold">Confidencialidad</th>
                    <th className="text-left py-4 px-6 font-semibold">Fecha</th>
                    <th className="text-left py-4 px-6 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {documentosFiltrados.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{doc.nombre}</div>
                          <div className="text-sm text-gray-500">{doc.tamaño}</div>
                          {doc.observaciones && (
                            <div className="text-xs text-orange-600 mt-1">{doc.observaciones}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getTipoBadge(doc.tipo)}
                      </td>
                      <td className="py-4 px-6">
                        {getEstadoBadge(doc.estado)}
                      </td>
                      <td className="py-4 px-6">
                        <Badge className="bg-gray-100 text-gray-800">
                          {doc.categoria}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        {getConfidencialidadBadge(doc.confidencialidad)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <div>{doc.fechaSubida}</div>
                          {doc.fechaVencimiento && (
                            <div className="text-gray-500">Vence: {doc.fechaVencimiento}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-md">
                            👁️
                          </button>
                          <button className="text-green-600 hover:bg-green-50 p-2 rounded-md">
                            📥
                          </button>
                          <button className="text-red-600 hover:bg-red-50 p-2 rounded-md">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {documentosFiltrados.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{doc.nombre}</h3>
                      <div className="space-y-2">
                        {getTipoBadge(doc.tipo)}
                        {getEstadoBadge(doc.estado)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Categoría:</span>
                      <Badge className="bg-gray-100 text-gray-800">{doc.categoria}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Tamaño:</span>
                      <span>{doc.tamaño}</span>
                    </div>
                    {doc.fechaVencimiento && (
                      <div className="flex justify-between">
                        <span>Vencimiento:</span>
                        <span className="text-orange-600">{doc.fechaVencimiento}</span>
                      </div>
                    )}
                  </div>

                  {doc.observaciones && (
                    <div className="mt-3 p-2 bg-orange-50 rounded text-xs text-orange-800">
                      {doc.observaciones}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    {getConfidencialidadBadge(doc.confidencialidad)}
                    <div className="flex space-x-1">
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-md">👁️</button>
                      <button className="text-green-600 hover:bg-green-50 p-2 rounded-md">📥</button>
                      <button className="text-red-600 hover:bg-red-50 p-2 rounded-md">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alertas de Vencimiento */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-orange-800 mb-4">
            ⚠️ Documentos que Requieren Atención
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <span className="font-medium">Certificado SSL Vencido</span>
                <span className="text-sm text-red-600 ml-2">Vencido hace 10 días</span>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Renovar Urgente
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <span className="font-medium">Contrato Proveedor ABC</span>
                <span className="text-sm text-yellow-600 ml-2">Vence en 6 meses</span>
              </div>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                Programar Renovación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
