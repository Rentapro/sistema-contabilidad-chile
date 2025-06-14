'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DeclaracionesPage() {
  const { usuario } = useAuth();
  const [selectedDeclaration, setSelectedDeclaration] = useState<string | null>(null);

  const declaracionesDisponibles = [
    {
      id: 'f29',
      nombre: 'Declaración F29',
      descripcion: 'Declaración mensual de IVA',
      periodo: 'Mensual',
      proximoVencimiento: '12 de Julio 2025',
      estado: 'Pendiente'
    },
    {
      id: 'f22',
      nombre: 'Declaración F22',
      descripcion: 'Declaración anual de renta',
      periodo: 'Anual',
      proximoVencimiento: '30 de Abril 2026',
      estado: 'Al día'
    },
    {
      id: 'dj1879',
      nombre: 'DJ 1879',
      descripcion: 'Declaración jurada anual',
      periodo: 'Anual',
      proximoVencimiento: '31 de Marzo 2026',
      estado: 'Al día'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Declaraciones Tributarias
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona y presenta tus declaraciones al SII
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Nueva Declaración
        </button>
      </div>

      {/* Resumen de Estado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Pendientes</p>
              <p className="text-2xl font-bold text-red-900">1</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Al día</p>
              <p className="text-2xl font-bold text-green-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">📋</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">Total</p>
              <p className="text-2xl font-bold text-blue-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Declaraciones */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Declaraciones Disponibles
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {declaracionesDisponibles.map((declaracion) => (
            <div
              key={declaracion.id}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedDeclaration(declaracion.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {declaracion.nombre}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      declaracion.estado === 'Pendiente' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {declaracion.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {declaracion.descripcion}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <span>Periodo: {declaracion.periodo}</span>
                    <span className="mx-2">•</span>
                    <span>Próximo vencimiento: {declaracion.proximoVencimiento}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {declaracion.estado === 'Pendiente' && (
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      Presentar
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos Vencimientos */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Próximos Vencimientos
          </h2>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">F29 - Junio 2025</p>
                  <p className="text-xs text-gray-500">12 de Julio 2025</p>
                </div>
              </div>
              <span className="text-xs text-red-600 font-medium">
                Faltan 1 días
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">F22 - Año 2025</p>
                  <p className="text-xs text-gray-500">30 de Abril 2026</p>
                </div>
              </div>
              <span className="text-xs text-gray-600">
                Faltan 323 días
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal o panel de detalle si hay una declaración seleccionada */}
      {selectedDeclaration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Detalles de la Declaración
              </h3>
              <button
                onClick={() => setSelectedDeclaration(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Aquí aparecerían los detalles específicos de la declaración seleccionada.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedDeclaration(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    // Aquí iría la lógica para procesar la declaración
                    alert('Funcionalidad en desarrollo');
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Procesar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}