import FormularioContacto from '@/components/FormularioContacto';

export default function SoportePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛠️ Soporte Técnico
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            ¿Necesitas ayuda técnica con el sistema? Nuestro equipo de soporte 
            está disponible para resolver cualquier problema técnico que tengas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Formulario */}
          <div>
            <FormularioContacto 
              tipo="soporte"
              titulo="Reportar Problema Técnico"
              descripcion="Describe el problema que estás experimentando y te ayudaremos a resolverlo"
            />
          </div>

          {/* Información de soporte */}
          <div className="space-y-8">
            {/* Estado del sistema */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                📊 Estado del Sistema
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plataforma principal:</span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-semibold">Operativo</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base de datos:</span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-semibold">Operativo</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">API SII:</span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-semibold">Operativo</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Emails:</span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-semibold">Operativo</span>
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Última actualización: Hoy a las 14:30 • Tiempo de actividad: 99.9%
                </p>
              </div>
            </div>

            {/* Tipos de problemas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Problemas Más Comunes
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 text-xl">🔐</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Problemas de Login</h4>
                    <p className="text-gray-600 text-sm">No puedo iniciar sesión, olvidé mi contraseña</p>
                    <p className="text-xs text-red-600 mt-1">⚡ Prioridad: Alta • Respuesta: 30 min</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 text-xl">📄</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Errores en Reportes</h4>
                    <p className="text-gray-600 text-sm">PDF no se genera, datos incorrectos en reportes</p>
                    <p className="text-xs text-orange-600 mt-1">⚡ Prioridad: Media • Respuesta: 2 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xl">🔄</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sincronización</h4>
                    <p className="text-gray-600 text-sm">Datos no se actualizan, problemas de conexión</p>
                    <p className="text-xs text-blue-600 mt-1">⚡ Prioridad: Media • Respuesta: 1 hora</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xl">📱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Problemas de Interfaz</h4>
                    <p className="text-gray-600 text-sm">Botones no funcionan, página no carga</p>
                    <p className="text-xs text-green-600 mt-1">⚡ Prioridad: Normal • Respuesta: 4 horas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de contacto urgente */}
            <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                🚨 Problemas Críticos
              </h3>
              
              <p className="text-red-100 mb-4">
                Si tienes un problema crítico que afecta tu operación (como no poder acceder 
                al sistema en día de vencimiento), contáctanos inmediatamente:
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📞</span>
                  <span className="font-bold">+56 9 7373 2599</span>
                  <span className="text-red-100">(24/7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💬</span>
                  <span>WhatsApp: +56 9 7373 2599</span>
                </div>
              </div>
            </div>

            {/* Auto-diagnóstico */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔍 Auto-diagnóstico Rápido
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">1.</span>
                  <span className="text-gray-600">
                    <strong>Verifica tu conexión:</strong> ¿Otras páginas web funcionan normalmente?
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">2.</span>
                  <span className="text-gray-600">
                    <strong>Actualiza la página:</strong> Presiona Ctrl+F5 (PC) o Cmd+R (Mac)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">3.</span>
                  <span className="text-gray-600">
                    <strong>Verifica tu navegador:</strong> ¿Usas Chrome, Firefox o Safari actualizado?
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">4.</span>
                  <span className="text-gray-600">
                    <strong>Limpia el caché:</strong> Borra el caché y cookies del navegador
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  💡 Si estos pasos no resuelven el problema, úsanos el formulario de arriba 
                  e incluye esta información en tu mensaje.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Centro de ayuda */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            📚 Centro de Ayuda
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📖</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Manuales</h3>
              <p className="text-gray-600 text-sm mb-4">
                Guías paso a paso para usar todas las funciones del sistema
              </p>
              <a href="/manuales" className="text-blue-600 hover:underline text-sm font-medium">
                Ver Manuales →
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Videos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Tutoriales en video para aprender visualmente
              </p>
              <a href="/tutoriales" className="text-green-600 hover:underline text-sm font-medium">
                Ver Videos →
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
              <p className="text-gray-600 text-sm mb-4">
                Preguntas frecuentes y respuestas rápidas
              </p>
              <a href="/faq" className="text-purple-600 hover:underline text-sm font-medium">
                Ver FAQ →
              </a>
            </div>
          </div>
        </div>

        {/* Horarios de atención */}
        <div className="mt-12 text-center">
          <div className="bg-blue-600 text-white p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4">🕒 Horarios de Atención</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold mb-2">Soporte General</p>
                <p>Lunes a Viernes: 9:00 - 18:00</p>
                <p>Sábados: 9:00 - 13:00</p>
                <p>Respuesta: 2-4 horas</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Emergencias</p>
                <p>24/7 todos los días</p>
                <p>Solo problemas críticos</p>
                <p>Respuesta: 30 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
