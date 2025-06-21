'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Monitor, 
  Smartphone, 
  Code, 
  Zap,
  DollarSign,
  FileText,
  BarChart3,
  Users,
  Settings,
  CheckCircle2
} from 'lucide-react';

interface FeatureDemo {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'basico' | 'avanzado' | 'integracion';
  steps: DemoStep[];
  benefits: string[];
  timeToImplement: string;
}

interface DemoStep {
  title: string;
  description: string;
  code?: string;
  image?: string;
  action?: () => void;
  result: string;
}

const featureDemos: FeatureDemo[] = [
  {
    id: 'dashboard-interactivo',
    title: 'Dashboard Interactivo en Tiempo Real',
    description: 'Visualiza tus datos financieros con gráficos dinámicos y KPIs actualizados',
    icon: <BarChart3 className="w-6 h-6" />,
    category: 'basico',
    timeToImplement: '15 min',
    benefits: [
      'Visualización inmediata de datos financieros',
      'Gráficos interactivos con Chart.js',
      'KPIs actualizados en tiempo real',
      'Responsive para móviles y desktop'
    ],
    steps: [
      {
        title: 'Configurar componentes de gráficos',
        description: 'Instalamos Chart.js y configuramos los componentes base',
        code: `npm install react-chartjs-2 chart.js
        
// Componente base para gráficos
import { Line, Bar, Doughnut } from 'react-chartjs-2';`,
        result: 'Librerías instaladas y componentes importados'
      },
      {
        title: 'Crear gráfico de ingresos vs gastos',
        description: 'Gráfico de líneas que muestra la evolución mensual',
        code: `const IngresosGastosChart = () => {
  const data = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ingresos',
        data: [12000, 15000, 13000, 18000, 16000, 20000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
      },
      {
        label: 'Gastos',
        data: [8000, 9000, 7500, 11000, 10000, 12000],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      }
    ]
  };
  return <Line data={data} options={{responsive: true}} />;
};`,
        result: 'Gráfico de líneas funcional mostrando tendencias financieras'
      },
      {
        title: 'KPIs dinámicos',
        description: 'Tarjetas con métricas clave que se actualizan automáticamente',
        code: `const KPICard = ({ title, value, change, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className={\`text-sm \${change > 0 ? 'text-green-500' : 'text-red-500'}\`}>
          {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
        </p>
      </div>
      <div className="text-blue-500">{icon}</div>
    </div>
  </div>
);`,
        result: 'KPIs interactivos con indicadores de tendencia'
      }
    ]
  },
  {
    id: 'facturacion-automatica',
    title: 'Facturación Automática Inteligente',
    description: 'Sistema de facturación con cálculos automáticos y plantillas personalizables',
    icon: <FileText className="w-6 h-6" />,
    category: 'basico',
    timeToImplement: '20 min',
    benefits: [
      'Cálculo automático de impuestos (IVA 19%)',
      'Plantillas profesionales personalizables',
      'Numeración automática consecutiva',
      'Generación de PDF automática'
    ],
    steps: [
      {
        title: 'Configurar formulario inteligente',
        description: 'Formulario que autocompleta y calcula automáticamente',
        code: `const FacturaForm = () => {
  const [factura, setFactura] = useState({
    cliente: '',
    items: [{ descripcion: '', cantidad: 1, precio: 0 }],
    subtotal: 0,
    iva: 0,
    total: 0
  });

  const calcularTotales = useCallback(() => {
    const subtotal = factura.items.reduce((sum, item) => 
      sum + (item.cantidad * item.precio), 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    
    setFactura(prev => ({ ...prev, subtotal, iva, total }));
  }, [factura.items]);`,
        result: 'Formulario con cálculos automáticos en tiempo real'
      },
      {
        title: 'Generador de PDF profesional',
        description: 'Crear PDFs con diseño profesional y datos dinámicos',
        code: `import jsPDF from 'jspdf';

const generarPDF = (facturaData) => {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.text('FACTURA', 20, 30);
  
  // Datos del cliente
  pdf.setFontSize(12);
  pdf.text(\`Cliente: \${facturaData.cliente}\`, 20, 50);
  
  // Items
  let y = 80;
  facturaData.items.forEach(item => {
    pdf.text(\`\${item.descripcion} - Qty: \${item.cantidad} - \$\${item.precio}\`, 20, y);
    y += 10;
  });
  
  // Totales
  pdf.text(\`Subtotal: \$\${facturaData.subtotal}\`, 20, y + 20);
  pdf.text(\`IVA (19%): \$\${facturaData.iva}\`, 20, y + 30);
  pdf.text(\`TOTAL: \$\${facturaData.total}\`, 20, y + 40);
  
  return pdf;
};`,
        result: 'PDF profesional generado automáticamente'
      }
    ]
  },
  {
    id: 'chat-contable',
    title: 'Asistente Contable con IA',
    description: 'Chatbot inteligente que responde consultas contables y fiscales',
    icon: <Zap className="w-6 h-6" />,
    category: 'avanzado',
    timeToImplement: '30 min',
    benefits: [
      'Respuestas inmediatas a consultas contables',
      'Base de conocimiento especializada en normativa chilena',
      'Integración con Groq API para respuestas inteligentes',
      'Historial de conversaciones'
    ],
    steps: [
      {
        title: 'Configurar API de Groq',
        description: 'Conectar con Groq para procesamiento de lenguaje natural',
        code: `// .env.local
GROQ_API_KEY=tu_api_key_aqui

// lib/groq.ts
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const consultarIA = async (pregunta: string) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "Eres un experto contador chileno especializado en normativas del SII..."
      },
      {
        role: "user",
        content: pregunta
      }
    ],
    model: "llama3-8b-8192",
  });
  
  return completion.choices[0]?.message?.content;
};`,
        result: 'API de IA configurada para consultas contables'
      },
      {
        title: 'Interfaz de chat interactiva',
        description: 'Chat UI con mensajes en tiempo real y typing indicators',
        code: `const ChatContable = () => {
  const [mensajes, setMensajes] = useState([]);
  const [escribiendo, setEscribiendo] = useState(false);
  
  const enviarPregunta = async (pregunta) => {
    setMensajes(prev => [...prev, { tipo: 'usuario', texto: pregunta }]);
    setEscribiendo(true);
    
    try {
      const respuesta = await consultarIA(pregunta);
      setMensajes(prev => [...prev, { tipo: 'asistente', texto: respuesta }]);
    } finally {
      setEscribiendo(false);
    }
  };
  
  return (
    <div className="h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensajes.map((mensaje, index) => (
          <div key={index} className={\`flex \${mensaje.tipo === 'usuario' ? 'justify-end' : 'justify-start'}\`}>
            <div className={\`max-w-xs p-3 rounded-lg \${
              mensaje.tipo === 'usuario' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }\`}>
              {mensaje.texto}
            </div>
          </div>
        ))}
        {escribiendo && <TypingIndicator />}
      </div>
    </div>
  );
};`,
        result: 'Chat funcional con IA especializada en contabilidad'
      }
    ]
  },
  {
    id: 'reportes-avanzados',
    title: 'Reportes Financieros Automáticos',
    description: 'Genera reportes profesionales con análisis automático y exportación',
    icon: <FileText className="w-6 h-6" />,
    category: 'avanzado',
    timeToImplement: '25 min',
    benefits: [
      'Balance General automático',
      'Estado de Resultados dinámico',
      'Análisis de ratios financieros',
      'Exportación a PDF y Excel'
    ],
    steps: [
      {
        title: 'Estructura de datos financieros',
        description: 'Organizar datos para generar reportes automáticamente',
        code: `interface BalanceGeneral {
  activos: {
    circulante: {
      efectivo: number;
      cuentasPorCobrar: number;
      inventarios: number;
    };
    fijo: {
      propiedadPlantaEquipo: number;
      depreciacionAcumulada: number;
    };
  };
  pasivos: {
    circulante: {
      cuentasPorPagar: number;
      prestamosCortoP: number;
    };
    largoPlazo: {
      prestamosLargoP: number;
    };
  };
  patrimonio: {
    capitalSocial: number;
    utilidadesRetenidas: number;
  };
}`,
        result: 'Estructura de datos organizados para reportes'
      }
    ]
  }
];

interface FeatureDemoComponentProps {
  onClose?: () => void;
}

export default function FeatureDemoComponent({ onClose }: FeatureDemoComponentProps) {
  const [selectedDemo, setSelectedDemo] = useState<FeatureDemo | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredDemos = {
    basico: featureDemos.filter(d => d.category === 'basico'),
    avanzado: featureDemos.filter(d => d.category === 'avanzado'),
    integracion: featureDemos.filter(d => d.category === 'integracion'),
  };

  const nextStep = () => {
    if (selectedDemo && currentStep < selectedDemo.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startDemo = (demo: FeatureDemo) => {
    setSelectedDemo(demo);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Demos Interactivas de Características
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Explora todas las funcionalidades del sistema con demos paso a paso. 
          Aprende cómo implementar cada característica en tu negocio.
        </p>
      </div>

      {!selectedDemo ? (
        <div className="space-y-8">
          {/* Características Básicas */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Monitor className="w-6 h-6 mr-2 text-green-500" />
              Características Básicas
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDemos.basico.map((demo) => (
                <motion.div
                  key={demo.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => startDemo(demo)}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-lg mr-4">
                      {demo.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{demo.title}</h3>
                      <p className="text-sm text-green-600">⏱️ {demo.timeToImplement}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{demo.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {demo.steps.length} pasos
                    </span>
                    <Play className="w-5 h-5 text-green-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Características Avanzadas */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-purple-500" />
              Características Avanzadas
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDemos.avanzado.map((demo) => (
                <motion.div
                  key={demo.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => startDemo(demo)}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg mr-4">
                      {demo.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{demo.title}</h3>
                      <p className="text-sm text-purple-600">⏱️ {demo.timeToImplement}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{demo.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      {demo.steps.length} pasos
                    </span>
                    <Play className="w-5 h-5 text-purple-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* Demo en ejecución */
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header de la demo */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-4">
                  {selectedDemo.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedDemo.title}</h2>
                  <p className="text-blue-100">{selectedDemo.description}</p>
                </div>
              </div>
              <button
                onClick={() => {setSelectedDemo(null); setCurrentStep(0);}}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Paso {currentStep + 1} de {selectedDemo.steps.length}</span>
                <span>{Math.round(((currentStep + 1) / selectedDemo.steps.length) * 100)}%</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / selectedDemo.steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Contenido del paso actual */}
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Información del paso */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {selectedDemo.steps[currentStep].title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedDemo.steps[currentStep].description}
                </p>
                
                {/* Resultado esperado */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium text-green-800">Resultado</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    {selectedDemo.steps[currentStep].result}
                  </p>
                </div>

                {/* Beneficios */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Beneficios de esta característica:</h4>
                  <ul className="space-y-1">
                    {selectedDemo.benefits.map((benefit, index) => (
                      <li key={index} className="text-blue-700 text-sm flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Código de ejemplo */}
              {selectedDemo.steps[currentStep].code && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Código de Implementación
                  </h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{selectedDemo.steps[currentStep].code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Controles de navegación */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              
              <div className="flex space-x-2">
                {selectedDemo.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep ? 'bg-blue-500' : 
                      index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                disabled={currentStep === selectedDemo.steps.length - 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentStep === selectedDemo.steps.length - 1 ? 'Completado' : 'Siguiente →'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
