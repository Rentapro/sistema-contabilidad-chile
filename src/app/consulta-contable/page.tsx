import FormularioContacto from '@/components/FormularioContacto';

export default function ConsultaContablePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💼 Consulta Contable Especializada
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            ¿Tienes dudas contables o fiscales? Nuestro equipo de contadores especialistas 
            está aquí para ayudarte con consultas específicas sobre normativa chilena.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Formulario */}
          <div>
            <FormularioContacto 
              tipo="consulta_contable"
              titulo="Consulta con Nuestros Especialistas"
              descripcion="Describe tu consulta contable y un especialista te responderá en menos de 4 horas"
            />
          </div>

          {/* Tipos de consultas */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tipos de Consultas que Resolvemos
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-xl">📋</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Reportes SII</h3>
                    <p className="text-gray-600 text-sm">F29, F22, Libros IVA, declaraciones mensuales y anuales</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xl">⚖️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Normativa Fiscal</h3>
                    <p className="text-gray-600 text-sm">Interpretación de leyes tributarias, régimen simplificado, IVA</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Estados Financieros</h3>
                    <p className="text-gray-600 text-sm">Balance, estado de resultados, flujo de caja, análisis financiero</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-orange-500">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 text-xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Constitución de Empresas</h3>
                    <p className="text-gray-600 text-sm">SpA, Ltda, régimen tributario, planificación fiscal</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 text-xl">🚨</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Problemas con SII</h3>
                    <p className="text-gray-600 text-sm">Multas, fiscalizaciones, rectificatorias, reclamos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nuestro equipo */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Nuestro Equipo</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">CA</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Carolina Andrade</p>
                    <p className="text-sm text-gray-500">Contador Auditor UC • 15+ años exp.</p>
                    <p className="text-xs text-gray-400">Especialista en SII y normativa fiscal</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">MR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Miguel Ramírez</p>
                    <p className="text-sm text-gray-500">Contador Auditor UAI • 12+ años exp.</p>
                    <p className="text-xs text-gray-400">Especialista en PYMES y microempresas</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">LS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Laura Silva</p>
                    <p className="text-sm text-gray-500">Contador Auditor USACH • 10+ años exp.</p>
                    <p className="text-xs text-gray-400">Especialista en IFRS y grandes empresas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tiempos de respuesta */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">⚡ Tiempos de Respuesta</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Consultas urgentes:</span>
                  <span className="font-bold">2 horas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Consultas normales:</span>
                  <span className="font-bold">4 horas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Análisis complejos:</span>
                  <span className="font-bold">24 horas</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-purple-400">
                <p className="text-sm text-purple-100">
                  📞 Para consultas muy urgentes, también puedes llamarnos al +56 9 7373 2599
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ejemplos de consultas */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Ejemplos de Consultas Frecuentes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">📋 Reportes y Declaraciones</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-sm">"¿Cómo llenar correctamente el F29 si tengo facturas de exportación?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-sm">"Mi libro de IVA no cuadra con las ventas, ¿qué puede estar pasando?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-sm">"¿Puedo hacer una rectificatoria del F22 después de 3 meses?"</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">⚖️ Normativa y Procedimientos</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-sm">"¿Cuándo debo cambiar de régimen simplificado a régimen general?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-sm">"¿Qué documentos necesito para justificar gastos rechazados?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-sm">"Me llegó una multa del SII, ¿puedo apelar?"</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Promoción */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4">🎯 Consultas Gratuitas para Nuevos Clientes</h3>
            <p className="mb-6">
              Si te conviertes en cliente de nuestro sistema, las primeras 5 consultas contables son completamente gratuitas.
            </p>
            <a 
              href="/solicitar-demo" 
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mr-4"
            >
              Ver Demo del Sistema
            </a>
            <a 
              href="#formulario" 
              className="inline-block bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-400 transition-colors"
            >
              Hacer Consulta Ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
