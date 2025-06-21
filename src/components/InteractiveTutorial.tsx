'use client';

import React, { useState, useCallback } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  BookOpen, 
  Video, 
  CheckCircle,
  ArrowRight,
  X
} from 'lucide-react';

interface TutorialSteps {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  video?: string;
  duration?: number;
}

const tutorialData: TutorialSteps[] = [
  {
    id: 'onboarding',
    title: 'Bienvenido a Conta-IA',
    description: 'Aprende los conceptos básicos del sistema de contabilidad',
    duration: 5,
    steps: [
      {
        target: '.dashboard-card',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-bold text-blue-600 mb-2">¡Bienvenido al Dashboard!</h3>
            <p className="text-gray-700 mb-3">
              Este es tu centro de control principal. Aquí puedes ver un resumen de toda tu información financiera.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Consejo:</strong> El dashboard se actualiza en tiempo real con tus datos.
              </p>
            </div>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '.nav-clientes',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-bold text-green-600 mb-2">Gestión de Clientes</h3>
            <p className="text-gray-700 mb-3">
              Aquí puedes agregar, editar y gestionar toda la información de tus clientes.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Datos de contacto completos</li>
              <li>• Historial de transacciones</li>
              <li>• Estados de cuenta</li>
            </ul>
          </div>
        ),
        placement: 'right',
      },
      {
        target: '.nav-facturas',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-bold text-purple-600 mb-2">Facturación Inteligente</h3>
            <p className="text-gray-700 mb-3">
              Crea facturas profesionales con cálculo automático de impuestos y seguimiento de pagos.
            </p>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-800">
                🚀 <strong>Función destacada:</strong> Integración con SII para facturación electrónica.
              </p>
            </div>
          </div>
        ),
        placement: 'right',
      },
      {
        target: '.nav-reportes',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-bold text-orange-600 mb-2">Reportes Avanzados</h3>
            <p className="text-gray-700 mb-3">
              Genera reportes financieros profesionales con un clic.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Balance General</li>
              <li>• Estado de Resultados</li>
              <li>• Flujo de Caja</li>
              <li>• Análisis de Rentabilidad</li>
            </ul>
          </div>
        ),
        placement: 'right',
      }
    ]
  },
  {
    id: 'facturacion',
    title: 'Cómo crear tu primera factura',
    description: 'Guía paso a paso para generar facturas profesionales',
    duration: 8,
    steps: [
      {
        target: '.btn-nueva-factura',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-bold text-blue-600 mb-2">Crear Nueva Factura</h3>
            <p className="text-gray-700">
              Haz clic aquí para comenzar a crear una nueva factura. Te guiaremos paso a paso.
            </p>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '.form-cliente',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-bold text-green-600 mb-2">Seleccionar Cliente</h3>
            <p className="text-gray-700 mb-3">
              Selecciona un cliente existente o crea uno nuevo. El sistema autocompletará los datos.
            </p>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                ⚡ <strong>Tip rápido:</strong> Puedes buscar clientes por nombre o RUT.
              </p>
            </div>
          </div>
        ),
        placement: 'right',
      }
    ]
  },
  {
    id: 'reportes',
    title: 'Generación de Reportes',
    description: 'Aprende a crear reportes financieros profesionales',
    duration: 6,
    steps: [
      {
        target: '.filtros-reporte',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-bold text-blue-600 mb-2">Filtros Inteligentes</h3>
            <p className="text-gray-700 mb-3">
              Usa los filtros para personalizar tus reportes por fecha, cliente, tipo de transacción y más.
            </p>
          </div>
        ),
        placement: 'bottom',
      }
    ]
  }
];

interface InteractiveTutorialProps {
  currentPath?: string;
}

export default function InteractiveTutorial({ currentPath = '/' }: InteractiveTutorialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<string>('onboarding');
  const [runTutorial, setRunTutorial] = useState(false);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTutorial(false);
      if (status === STATUS.FINISHED) {
        setCompletedTutorials(prev => [...prev, currentTutorial]);
      }
    }
  }, [currentTutorial]);

  const startTutorial = (tutorialId: string) => {
    setCurrentTutorial(tutorialId);
    setRunTutorial(true);
  };

  const currentTutorialData = tutorialData.find(t => t.id === currentTutorial);

  return (
    <>
      {/* Botón flotante para abrir tutoriales */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </motion.div>

      {/* Modal de tutoriales */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Tutoriales Interactivos</h2>
                    <p className="text-blue-100">Aprende a usar Conta-IA de forma fácil y rápida</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {tutorialData.map((tutorial) => (
                    <motion.div
                      key={tutorial.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => startTutorial(tutorial.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{tutorial.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{tutorial.description}</p>
                          <div className="flex items-center text-xs text-gray-500 space-x-3">
                            <span>⏱️ {tutorial.duration} min</span>
                            <span>📝 {tutorial.steps.length} pasos</span>
                          </div>
                        </div>
                        {completedTutorials.includes(tutorial.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <Play className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {tutorial.video && (
                            <span className="inline-flex items-center text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                              <Video className="w-3 h-3 mr-1" />
                              Video
                            </span>
                          )}
                          <span className="inline-flex items-center text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            Interactivo
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Tutorial en ejecución */}
                {runTutorial && currentTutorialData && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-800">Tutorial en progreso</h4>
                        <p className="text-sm text-blue-600">{currentTutorialData.title}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setRunTutorial(false)}
                          className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                        >
                          Pausar
                        </button>
                        <button
                          onClick={() => setRunTutorial(false)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                        >
                          Detener
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estadísticas de progreso */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Tu Progreso</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(completedTutorials.length / tutorialData.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {completedTutorials.length}/{tutorialData.length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Has completado {completedTutorials.length} de {tutorialData.length} tutoriales
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Joyride Component */}
      <Joyride
        steps={currentTutorialData?.steps || []}
        run={runTutorial}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#3b82f6',
            textColor: '#374151',
            backgroundColor: '#ffffff',
            arrowColor: '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
          },
          tooltip: {
            borderRadius: 12,
            fontSize: 14,
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: '#3b82f6',
            fontSize: 14,
            borderRadius: 8,
            padding: '8px 16px',
          },
          buttonBack: {
            color: '#6b7280',
            fontSize: 14,
          },
          buttonSkip: {
            color: '#6b7280',
            fontSize: 14,
          },
        }}
        locale={{
          back: 'Anterior',
          close: 'Cerrar',
          last: 'Finalizar',
          next: 'Siguiente',
          skip: 'Saltar',
        }}
      />
    </>
  );
}
