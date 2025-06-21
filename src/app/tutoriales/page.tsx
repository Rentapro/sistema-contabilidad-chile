import InteractiveTutorial from '@/components/InteractiveTutorial';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  BookOpen, 
  Video, 
  Code, 
  PlayCircle, 
  ArrowRight,
  Clock,
  Users,
  Star,
  Zap
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Centro de Aprendizaje - Conta-IA',
  description: 'Aprende a usar Conta-IA con tutoriales interactivos, videos paso a paso y demos de características',
};

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Centro de Aprendizaje
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Domina Conta-IA con nuestros recursos de aprendizaje interactivos. 
            Desde tutoriales básicos hasta características avanzadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Comenzar Tutorial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Ver Videos
            </button>
          </div>
        </div>
      </div>

      {/* Learning Options */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Elige tu forma de aprender
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ofrecemos diferentes formas de aprendizaje para que encuentres la que mejor se adapte a tu estilo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Tutoriales Interactivos */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
              <BookOpen className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Tutoriales Interactivos</h3>
              <p className="text-blue-100">Aprende practicando directamente en el sistema</p>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  5-10 minutos por tutorial
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  Perfecto para principiantes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Zap className="w-4 h-4 mr-2 text-blue-500" />
                  Guías paso a paso
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="text-sm font-medium text-gray-700">Incluye:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tour guiado del dashboard</li>
                  <li>• Creación de primera factura</li>
                  <li>• Gestión de clientes</li>
                  <li>• Generación de reportes</li>
                </ul>
              </div>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Iniciar Tutoriales
              </button>
            </div>
          </div>

          {/* Videos Tutoriales */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 text-white">
              <Video className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Video Tutoriales</h3>
              <p className="text-red-100">Aprende viendo explicaciones detalladas</p>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-red-500" />
                  8-18 minutos por video
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-red-500" />
                  Explicaciones profesionales
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <PlayCircle className="w-4 h-4 mr-2 text-red-500" />
                  5 videos disponibles
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="text-sm font-medium text-gray-700">Temas cubiertos:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Introducción al sistema</li>
                  <li>• Facturación electrónica</li>
                  <li>• Reportes avanzados</li>
                  <li>• Integración con SII</li>
                </ul>
              </div>
              <Link href="/videos">
                <button className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors">
                  Ver Videos
                </button>
              </Link>
            </div>
          </div>

          {/* Demos Interactivas */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
              <Code className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Demos de Características</h3>
              <p className="text-purple-100">Explora funcionalidades paso a paso</p>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-purple-500" />
                  15-30 minutos por demo
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-purple-500" />
                  Para usuarios avanzados
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Code className="w-4 h-4 mr-2 text-purple-500" />
                  Con código de ejemplo
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="text-sm font-medium text-gray-700">Funcionalidades:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Dashboard interactivo</li>
                  <li>• Asistente contable IA</li>
                  <li>• Reportes automáticos</li>
                  <li>• Integraciones API</li>
                </ul>
              </div>
              <Link href="/demos">
                <button className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors">
                  Explorar Demos
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Guía de Inicio Rápido</h3>
            <p className="text-gray-600">Comienza a usar Conta-IA en 4 pasos simples</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Configura tu empresa",
                description: "Ingresa los datos básicos de tu empresa y configuración inicial",
                time: "5 min"
              },
              {
                step: "2", 
                title: "Agrega tus clientes",
                description: "Importa o crea manualmente tu base de datos de clientes",
                time: "10 min"
              },
              {
                step: "3",
                title: "Crea tu primera factura",
                description: "Genera una factura profesional con cálculo automático de impuestos",
                time: "5 min"
              },
              {
                step: "4",
                title: "Revisa tus reportes",
                description: "Explora el dashboard y genera tu primer reporte financiero",
                time: "10 min"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {step.step}
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  ⏱️ {step.time}
                </span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all">
              Comenzar Configuración
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Preguntas Frecuentes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "¿Cuánto tiempo toma aprender el sistema?",
                answer: "Con nuestros tutoriales, puedes estar operativo en 30 minutos. Para dominar todas las características avanzadas, recomendamos 2-3 horas de práctica."
              },
              {
                question: "¿Necesito conocimientos de contabilidad?",
                answer: "No es necesario. El sistema está diseñado para ser intuitivo, y nuestros tutoriales cubren conceptos contables básicos además del uso técnico."
              },
              {
                question: "¿Los tutoriales se actualizan?",
                answer: "Sí, actualizamos regularmente nuestros tutoriales cuando agregamos nuevas características o mejoramos funcionalidades existentes."
              },
              {
                question: "¿Puedo acceder a los tutoriales desde móvil?",
                answer: "Absolutamente. Todos nuestros recursos de aprendizaje están optimizados para funcionar perfectamente en dispositivos móviles y tablets."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tutorial Component (floating) */}
      <InteractiveTutorial />
    </div>
  );
}
