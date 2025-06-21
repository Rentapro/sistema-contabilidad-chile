import FormularioContacto from '@/components/FormularioContacto';

export default function SolicitarDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Solicita una Demo Gratuita
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Descubre cómo nuestro sistema puede revolucionar la contabilidad de tu empresa. 
            Demo personalizada de 30 minutos sin compromiso.
          </p>
          
          {/* Video preview placeholder */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12 max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl">▶️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">Vista Previa del Sistema</h3>
                <p className="text-gray-500">Solicita tu demo personalizada para ver el sistema completo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Formulario */}
          <div>
            <FormularioContacto 
              tipo="demo"
              titulo="Solicitar Demo Personalizada"
              descripcion="Completa el formulario y te contactaremos para agendar tu demo en menos de 2 horas"
            />
          </div>

          {/* Beneficios */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ¿Qué verás en la demo?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dashboard Ejecutivo</h3>
                    <p className="text-gray-600 text-sm">Vista completa de las finanzas de tu empresa en tiempo real</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Facturación Electrónica</h3>
                    <p className="text-gray-600 text-sm">Creación y envío automático de facturas SII</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Reportes SII</h3>
                    <p className="text-gray-600 text-sm">F29, F22 y Libros IVA generados automáticamente</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">IA Contador</h3>
                    <p className="text-gray-600 text-sm">Asistente inteligente para consultas contables</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multi-Tenant</h3>
                    <p className="text-gray-600 text-sm">Gestión de múltiples empresas desde una sola cuenta</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <p className="text-gray-600 italic mb-4">
                "La demo me convenció inmediatamente. En 30 minutos vi cómo podía automatizar 
                el 80% de mi trabajo contable mensual y ahorrar 15 horas semanales."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600">MC</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">María Contreras</p>
                  <p className="text-sm text-gray-500">Contadora Independiente</p>
                </div>
              </div>
            </div>

            {/* Urgencia */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2">🎯 Promoción de Lanzamiento</h3>
              <p className="text-green-100 mb-4">
                Los primeros 50 clientes reciben:
              </p>
              <ul className="text-green-100 space-y-1 mb-4">
                <li>✅ 3 meses gratis del plan Pro</li>
                <li>✅ Migración gratuita de datos</li>
                <li>✅ Capacitación personalizada</li>
                <li>✅ Soporte prioritario</li>
              </ul>
              <div className="flex items-center gap-2 text-green-100">
                <span className="text-2xl">⏰</span>
                <span className="font-semibold">Solo quedan 12 cupos disponibles</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Rápido */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Preguntas Frecuentes sobre la Demo
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">⏱️ ¿Cuánto dura?</h3>
              <p className="text-gray-600 text-sm">30 minutos personalizados según las necesidades de tu empresa.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">💳 ¿Es realmente gratis?</h3>
              <p className="text-gray-600 text-sm">Completamente gratis, sin compromiso ni tarjeta de crédito.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📞 ¿Cuándo me contactan?</h3>
              <p className="text-gray-600 text-sm">En menos de 2 horas en horario laboral (9:00 - 18:00).</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📊 ¿Puedo ver mis datos?</h3>
              <p className="text-gray-600 text-sm">Sí, podemos importar una muestra de tus datos para la demo.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🖥️ ¿Qué necesito?</h3>
              <p className="text-gray-600 text-sm">Solo un computador con internet. Nosotros nos encargamos de todo.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">👥 ¿Puede participar mi equipo?</h3>
              <p className="text-gray-600 text-sm">¡Por supuesto! Pueden participar hasta 5 personas de tu empresa.</p>
            </div>
          </div>
        </div>

        {/* Call to action final */}
        <div className="mt-12 text-center">
          <div className="bg-blue-600 text-white p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4">¿Listo para revolucionar tu contabilidad?</h3>
            <p className="mb-6">Únete a los más de 200 contadores que ya confían en nuestro sistema.</p>
            <a 
              href="#formulario" 
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Solicitar Demo Ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
