'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  planActual: string;
}

interface Plan {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  caracteristicas: string[];
  destacado?: boolean;
  color: string;
}

const PLANES: Plan[] = [
  {
    id: 'basico',
    nombre: 'Básico',
    precio: 29000,
    descripcion: 'Perfecto para pequeños negocios',
    caracteristicas: [
      'Hasta 100 facturas por mes',
      'Hasta 50 clientes',
      'Hasta 3 usuarios',
      'Reportes básicos',
      'Soporte por email',
      '1GB de almacenamiento'
    ],
    color: 'blue'
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: 89000,
    descripcion: 'Para empresas en crecimiento',
    caracteristicas: [
      'Facturas ilimitadas',
      'Clientes ilimitados',
      'Hasta 10 usuarios',
      'Automatización IA completa',
      'Reportes avanzados y analytics',
      'Integraciones bancarias',
      'Soporte prioritario 24/7',
      '10GB de almacenamiento',
      'API completa',
      'Multi-empresa'
    ],
    destacado: true,
    color: 'purple'
  },
  {
    id: 'enterprise',
    nombre: 'Enterprise',
    precio: 199000,
    descripcion: 'Para grandes organizaciones',
    caracteristicas: [
      'Todo de Premium',
      'Usuarios ilimitados',
      'IA personalizada',
      'Servidor dedicado',
      'Almacenamiento ilimitado',
      'Gerente de cuenta dedicado',
      'Implementación personalizada',
      'SLA garantizado'
    ],
    color: 'indigo'
  }
];

export function PlanUpgradeModal({ isOpen, onClose, planActual }: PlanUpgradeModalProps) {
  const { empresaActual } = useAuth();
  const [planSeleccionado, setPlanSeleccionado] = useState<string>('');
  const [procesando, setProcesando] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!planSeleccionado) return;
    
    setProcesando(true);
    
    // Simular proceso de actualización
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`¡Actualización a ${planSeleccionado} exitosa! Recargando la página...`);
      window.location.reload();
    } catch (error) {
      alert('Error al procesar la actualización. Inténtalo nuevamente.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Actualizar Plan de Contabilidad
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
          <p className="text-gray-600 mt-2">
            Plan actual: <span className="font-medium">{planActual}</span>
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANES.map((plan) => {
              const esPlanActual = plan.id === planActual.toLowerCase();
              const esActualizable = !esPlanActual && 
                (planActual.toLowerCase() === 'basico' || 
                 (planActual.toLowerCase() === 'premium' && plan.id === 'enterprise'));

              return (
                <div
                  key={plan.id}
                  className={`border-2 rounded-lg p-6 relative transition-all ${
                    plan.destacado 
                      ? 'border-purple-500 shadow-lg transform scale-105' 
                      : 'border-gray-200'
                  } ${
                    planSeleccionado === plan.id 
                      ? `border-${plan.color}-500 bg-${plan.color}-50` 
                      : ''
                  } ${
                    esPlanActual 
                      ? 'opacity-60 bg-gray-50' 
                      : esActualizable 
                        ? 'cursor-pointer hover:shadow-md' 
                        : 'opacity-40'
                  }`}
                  onClick={() => esActualizable && setPlanSeleccionado(plan.id)}
                >
                  {plan.destacado && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Más Popular
                      </span>
                    </div>
                  )}

                  {esPlanActual && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Plan Actual
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className={`text-xl font-bold text-${plan.color}-600 mb-2`}>
                      {plan.nombre}
                    </h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {formatCurrency(plan.precio)}
                    </div>
                    <div className="text-sm text-gray-500">por mes</div>
                    <p className="text-sm text-gray-600 mt-2">{plan.descripcion}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-start">
                        <svg className={`w-5 h-5 text-${plan.color}-500 mr-2 flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{caracteristica}</span>
                      </li>
                    ))}
                  </ul>

                  {esActualizable && (
                    <button
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                        planSeleccionado === plan.id
                          ? `bg-${plan.color}-600 text-white`
                          : `border border-${plan.color}-600 text-${plan.color}-600 hover:bg-${plan.color}-50`
                      }`}
                    >
                      {planSeleccionado === plan.id ? 'Seleccionado' : 'Seleccionar'}
                    </button>
                  )}

                  {esPlanActual && (
                    <div className="text-center text-sm text-gray-500 font-medium">
                      Plan Actual
                    </div>
                  )}

                  {!esActualizable && !esPlanActual && (
                    <div className="text-center text-sm text-gray-400">
                      No disponible para actualización directa
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {planSeleccionado && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Resumen de la actualización</h4>
              <div className="flex justify-between items-center mb-4">
                <span>Plan seleccionado:</span>
                <span className="font-medium">
                  {PLANES.find(p => p.id === planSeleccionado)?.nombre}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span>Precio mensual:</span>
                <span className="font-medium">
                  {formatCurrency(PLANES.find(p => p.id === planSeleccionado)?.precio || 0)}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpgrade}
                    disabled={procesando}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {procesando ? 'Procesando...' : 'Confirmar Actualización'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
