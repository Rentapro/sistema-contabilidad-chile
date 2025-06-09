'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DemoStep {
  id: string;
  titulo: string;
  descripcion: string;
  duracion: number;
  componente: string;
  highlights: string[];
  screenshot?: string;
}

interface VideoDemo {
  id: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  steps: DemoStep[];
  targetAudience: 'superadmin' | 'admin_empresa' | 'contador' | 'cliente_basico';
}

export default function SystemDemoInteractivo() {
  const [demoActual, setDemoActual] = useState<VideoDemo | null>(null);
  const [stepActual, setStepActual] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [modoDemo, setModoDemo] = useState<'seleccion' | 'reproduciendo'>('seleccion');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const demosDisponibles: VideoDemo[] = [
    {
      id: 'superadmin-tour',
      titulo: '👑 Tour SuperAdmin Completo',
      descripcion: 'Recorrido completo por todas las funcionalidades de SuperAdmin incluyendo IA Fiscal',
      duracion: '12 min',
      targetAudience: 'superadmin',
      steps: [
        {
          id: 'dashboard-superadmin',
          titulo: 'Dashboard Ejecutivo SuperAdmin',
          descripcion: 'Vista general de métricas empresariales, ingresos consolidados y KPIs de la plataforma',
          duracion: 90,
          componente: 'SuperAdminDashboard',
          highlights: [
            'Métricas en tiempo real de todas las empresas',
            'Ingresos mensuales consolidados',
            'Usuarios activos en toda la plataforma',
            'Analytics de uso por empresa'
          ]
        },
        {
          id: 'gestion-empresas',
          titulo: 'Gestión de Firmas Contables',
          descripcion: 'Creación y administración de empresas clientes, asignación de planes y configuración',
          duracion: 120,
          componente: 'CompanyManagement',
          highlights: [
            'Crear nuevas empresas con configuración completa',
            'Asignar planes (Trial/Básico/Premium)',
            'Gestión de usuarios por empresa',
            'Métricas de rendimiento por firma'
          ]
        },
        {
          id: 'ia-fiscal',
          titulo: '🧠 IA Fiscal Chilena Avanzada',
          descripcion: 'Sistema de optimización tributaria con IA, consultas inteligentes y asistente SII',
          duracion: 180,
          componente: 'IAFiscalChilena',
          highlights: [
            'Consultas de optimización fiscal con IA',
            'Estrategias de reducción de impuestos',
            'Asistente inteligente para formularios SII',
            'Análisis de riesgo vs beneficio fiscal'
          ]
        },
        {
          id: 'workflow-automation',
          titulo: '⚡ Automatización Avanzada',
          descripcion: 'Sistema de workflows automatizados y procesamiento inteligente de documentos',
          duracion: 150,
          componente: 'WorkflowAutomation',
          highlights: [
            'Editor visual de workflows',
            'OCR inteligente para documentos',
            'Categorización automática con IA',
            'Monitor financiero en tiempo real'
          ]
        },
        {
          id: 'analytics-business',
          titulo: '📊 Business Intelligence',
          descripcion: 'Analytics avanzado, reportes predictivos y métricas empresariales',
          duracion: 120,
          componente: 'BusinessIntelligence',
          highlights: [
            'Dashboards personalizables',
            'Predicciones financieras con IA',
            'Reportes automáticos',
            'Alertas inteligentes'
          ]
        }
      ]
    },
    {
      id: 'admin-empresa-tour',
      titulo: '🏢 Tour Admin Empresa',
      descripcion: 'Funcionalidades principales para administradores de firmas contables',
      duracion: '8 min',
      targetAudience: 'admin_empresa',
      steps: [
        {
          id: 'dashboard-empresa',
          titulo: 'Dashboard Empresarial',
          descripcion: 'Vista ejecutiva de la firma contable con métricas clave y KPIs',
          duracion: 90,
          componente: 'EmpresaDashboard',
          highlights: [
            'Métricas de clientes y facturación',
            'Rendimiento de contadores',
            'Ingresos mensuales de la firma',
            'Tareas pendientes prioritarias'
          ]
        },
        {
          id: 'gestion-clientes',
          titulo: 'Gestión de Clientes',
          descripcion: 'CRUD completo de clientes, asignación a contadores y seguimiento',
          duracion: 120,
          componente: 'ClientManagement',
          highlights: [
            'Crear y editar perfiles de clientes',
            'Asignar contadores responsables',
            'Historial de interacciones',
            'Estados de cuenta y facturación'
          ]
        },
        {
          id: 'facturacion-sii',
          titulo: 'Facturación Electrónica SII',
          descripcion: 'Sistema de facturación compatible con SII Chile',
          duracion: 150,
          componente: 'FacturacionSII',
          highlights: [
            'Generación automática de facturas',
            'Envío electrónico al SII',
            'Validación de RUT en tiempo real',
            'Seguimiento de estados DTE'
          ]
        },
        {
          id: 'reportes-financieros',
          titulo: 'Reportes Financieros',
          descripcion: 'Generación automática de reportes para clientes y SII',
          duracion: 100,
          componente: 'FinancialReports',
          highlights: [
            'Balance general automático',
            'Estado de resultados',
            'Flujo de caja proyectado',
            'Exportación a Excel/PDF'
          ]
        }
      ]
    },
    {
      id: 'contador-workflow',
      titulo: '👨‍💼 Flujo de Trabajo Contador',
      descripcion: 'Día típico de un contador usando el sistema',
      duracion: '6 min',
      targetAudience: 'contador',
      steps: [
        {
          id: 'inicio-dia',
          titulo: 'Inicio del Día - Dashboard Contador',
          descripcion: 'Revisión de tareas pendientes, clientes asignados y prioridades',
          duracion: 60,
          componente: 'ContadorDashboard',
          highlights: [
            'Lista de tareas priorizadas',
            'Clientes con facturas vencidas',
            'Documentos pendientes de revisión',
            'Alertas de fechas límite'
          ]
        },
        {
          id: 'procesamiento-docs',
          titulo: 'Procesamiento de Documentos IA',
          descripcion: 'Carga y procesamiento automático de facturas con OCR',
          duracion: 120,
          componente: 'DocumentProcessing',
          highlights: [
            'Carga masiva de documentos',
            'OCR automático con validación',
            'Categorización inteligente',
            'Detección de errores y alertas'
          ]
        },
        {
          id: 'revision-gastos',
          titulo: 'Revisión y Categorización de Gastos',
          descripcion: 'Validación de gastos categorizados por IA y ajustes manuales',
          duracion: 90,
          componente: 'ExpenseReview',
          highlights: [
            'Gastos categorizados automáticamente',
            'Validación de deducciones fiscales',
            'Ajustes manuales cuando necesario',
            'Generación de reportes de gastos'
          ]
        },
        {
          id: 'cliente-comunicacion',
          titulo: 'Comunicación con Cliente',
          descripcion: 'Envío de reportes y comunicación automatizada',
          duracion: 60,
          componente: 'ClientCommunication',
          highlights: [
            'Reportes automáticos por email',
            'Notificaciones de estado',
            'Chat integrado con clientes',
            'Programación de reuniones'
          ]
        }
      ]
    },
    {
      id: 'cliente-basico-tour',
      titulo: '👤 Experiencia Cliente Básico',
      descripcion: 'Vista del cliente final del sistema',
      duracion: '4 min',
      targetAudience: 'cliente_basico',
      steps: [
        {
          id: 'dashboard-cliente',
          titulo: 'Dashboard Personal',
          descripcion: 'Vista personal con facturas, gastos y estado financiero',
          duracion: 90,
          componente: 'ClienteDashboard',
          highlights: [
            'Resumen financiero personal',
            'Facturas emitidas y recibidas',
            'Estado de pagos y vencimientos',
            'Métricas básicas de negocio'
          ]
        },
        {
          id: 'facturas-personales',
          titulo: 'Gestión de Facturas',
          descripcion: 'Visualización y gestión de facturas personales',
          duracion: 80,
          componente: 'PersonalInvoices',
          highlights: [
            'Lista de facturas por período',
            'Descarga de documentos',
            'Estados de pago',
            'Historial de transacciones'
          ]
        },
        {
          id: 'reportes-basicos',
          titulo: 'Reportes Básicos',
          descripcion: 'Reportes financieros simplificados para el cliente',
          duracion: 70,
          componente: 'BasicReports',
          highlights: [
            'Resumen mensual de ingresos/gastos',
            'Gráficos simples de tendencias',
            'Exportación básica',
            'Proyecciones simples'
          ]
        }
      ]
    }
  ];

  const iniciarDemo = (demo: VideoDemo) => {
    setDemoActual(demo);
    setStepActual(0);
    setProgreso(0);
    setModoDemo('reproduciendo');
    setIsPlaying(true);
    iniciarReproduccion();
  };

  const iniciarReproduccion = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setProgreso(prev => {
        const newProgress = prev + 1;
        
        if (demoActual && newProgress >= demoActual.steps[stepActual]?.duracion) {
          // Paso completado, ir al siguiente
          if (stepActual < demoActual.steps.length - 1) {
            setStepActual(prevStep => prevStep + 1);
            return 0;
          } else {
            // Demo completado
            setIsPlaying(false);
            clearInterval(intervalRef.current!);
            return newProgress;
          }
        }
        
        return newProgress;
      });
    }, 100); // Actualizar cada 100ms para animación suave
  };

  const pausarReproduccion = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const reanudarReproduccion = () => {
    setIsPlaying(true);
    iniciarReproduccion();
  };

  const irAStep = (stepIndex: number) => {
    setStepActual(stepIndex);
    setProgreso(0);
    if (isPlaying) {
      iniciarReproduccion();
    }
  };

  const volverASeleccion = () => {
    setModoDemo('seleccion');
    setDemoActual(null);
    setStepActual(0);
    setProgreso(0);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'superadmin': return 'bg-purple-100 text-purple-800';
      case 'admin_empresa': return 'bg-blue-100 text-blue-800';
      case 'contador': return 'bg-green-100 text-green-800';
      case 'cliente_basico': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'superadmin': return '👑';
      case 'admin_empresa': return '🏢';
      case 'contador': return '👨‍💼';
      case 'cliente_basico': return '👤';
      default: return '👥';
    }
  };

  if (modoDemo === 'seleccion') {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎬 Demo Interactivo del Sistema
          </h1>
          <p className="text-gray-600 text-lg">
            Experiencia guiada paso a paso de todas las funcionalidades
          </p>
        </div>

        {/* Features del Demo */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="font-semibold text-lg mb-4 text-center">
            ✨ Características del Demo Interactivo
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-medium mb-1">Personalizado por Rol</h4>
              <p className="text-sm text-gray-600">
                Cada demo adaptado al tipo de usuario y sus necesidades específicas
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-medium mb-1">Interactivo y Dinámico</h4>
              <p className="text-sm text-gray-600">
                Pausa, avanza, retrocede y explora cada funcionalidad en detalle
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎪</div>
              <h4 className="font-medium mb-1">Casos Reales</h4>
              <p className="text-sm text-gray-600">
                Ejemplos con datos reales chilenos y casos de uso empresariales
              </p>
            </div>
          </div>
        </Card>

        {/* Demos Disponibles */}
        <div className="grid gap-6">
          {demosDisponibles.map((demo) => (
            <Card key={demo.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">
                      {demo.titulo}
                    </h3>
                    <Badge className={getAudienceColor(demo.targetAudience)}>
                      {getAudienceIcon(demo.targetAudience)} {demo.targetAudience.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {demo.descripcion}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    ⏱️ {demo.duracion}
                  </div>
                  <div className="text-sm text-gray-500">
                    {demo.steps.length} pasos
                  </div>
                </div>
              </div>

              {/* Preview de Steps */}
              <div className="mb-4">
                <h4 className="font-medium mb-2 text-sm">📋 Contenido del Demo:</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {demo.steps.slice(0, 4).map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span>{step.titulo}</span>
                    </div>
                  ))}
                  {demo.steps.length > 4 && (
                    <div className="text-sm text-gray-500 italic">
                      +{demo.steps.length - 4} pasos más...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => iniciarDemo(demo)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  ▶️ Iniciar Demo
                </Button>
                <Button variant="outline" className="px-4">
                  📋 Ver Detalles
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="p-6 text-center bg-gradient-to-r from-green-50 to-blue-50">
          <h3 className="text-xl font-semibold mb-2">
            🚀 ¿Listo para probar el sistema completo?
          </h3>
          <p className="text-gray-600 mb-4">
            Después del demo, puedes solicitar una prueba gratuita de 30 días
          </p>
          <div className="flex gap-3 justify-center">
            <Button className="bg-green-600 hover:bg-green-700">
              📞 Solicitar Prueba Gratuita
            </Button>
            <Button variant="outline">
              💬 Hablar con un Especialista
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Modo Reproduciendo
  if (!demoActual) return null;

  const stepActualData = demoActual.steps[stepActual];
  const progresoTotal = ((stepActual * 100) + (progreso / stepActualData.duracion * 100)) / demoActual.steps.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header del Demo */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🎬 {demoActual.titulo}
          </h1>
          <p className="text-gray-600">
            Paso {stepActual + 1} de {demoActual.steps.length}: {stepActualData.titulo}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={getAudienceColor(demoActual.targetAudience)}>
            {getAudienceIcon(demoActual.targetAudience)} {demoActual.targetAudience.replace('_', ' ')}
          </Badge>
          <Button variant="outline" onClick={volverASeleccion}>
            ⬅️ Volver
          </Button>
        </div>
      </div>

      {/* Progress Bar General */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progreso del Demo</span>
          <span>{Math.round(progresoTotal)}%</span>
        </div>
        <Progress value={progresoTotal} className="h-2" />
      </div>

      {/* Controles de Reproducción */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={isPlaying ? pausarReproduccion : reanudarReproduccion}
              className={isPlaying ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => stepActual > 0 && irAStep(stepActual - 1)}
                disabled={stepActual === 0}
                size="sm"
              >
                ⏮️
              </Button>
              <Button
                variant="outline"
                onClick={() => stepActual < demoActual.steps.length - 1 && irAStep(stepActual + 1)}
                disabled={stepActual === demoActual.steps.length - 1}
                size="sm"
              >
                ⏭️
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            ⏱️ {Math.round(progreso / 10)}s / {Math.round(stepActualData.duracion / 10)}s
          </div>
        </div>
      </Card>

      {/* Contenido del Step Actual */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Panel Principal - Simulación de Componente */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-96 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  {stepActualData.titulo}
                </h3>
                <Badge variant="outline">
                  📱 {stepActualData.componente}
                </Badge>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {stepActual === 0 ? '👑' : 
                     stepActual === 1 ? '🏢' : 
                     stepActual === 2 ? '🧠' : 
                     stepActual === 3 ? '⚡' : '📊'}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    {stepActualData.titulo}
                  </h4>
                  <p className="text-gray-600 max-w-md">
                    {stepActualData.descripcion}
                  </p>
                  
                  {/* Animación de progreso del step */}
                  <div className="mt-6">
                    <Progress 
                      value={(progreso / stepActualData.duracion) * 100} 
                      className="h-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Panel Lateral - Información */}
        <div className="space-y-4">
          {/* Highlights del Step */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">✨ Características Destacadas</h4>
            <ul className="space-y-2">
              {stepActualData.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-1">✅</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Lista de Steps */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">📋 Índice del Demo</h4>
            <div className="space-y-2">
              {demoActual.steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => irAStep(index)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    index === stepActual 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : index < stepActual
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium ${
                      index === stepActual 
                        ? 'bg-blue-600 text-white' 
                        : index < stepActual
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index < stepActual ? '✓' : index + 1}
                    </span>
                    <span className="font-medium">{step.titulo}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Footer con CTA */}
      {stepActual === demoActual.steps.length - 1 && progreso >= stepActualData.duracion && (
        <Card className="p-6 text-center bg-gradient-to-r from-green-50 to-blue-50">
          <h3 className="text-xl font-semibold mb-2">
            🎉 ¡Demo Completado!
          </h3>
          <p className="text-gray-600 mb-4">
            Has visto todas las funcionalidades de {demoActual.titulo}
          </p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={volverASeleccion}
              variant="outline"
            >
              📋 Ver Otros Demos
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              🚀 Solicitar Prueba Gratuita
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
