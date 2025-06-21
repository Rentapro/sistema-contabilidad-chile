import FormularioContacto from '@/components/FormularioContacto';

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ponte en Contacto con Nosotros
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Listo para revolucionar la contabilidad de tu empresa? 
            Contáctanos y descubre cómo nuestro sistema puede ayudarte.
          </p>
        </div>

        {/* Formulario de contacto */}
        <FormularioContacto 
          tipo="contacto"
          titulo="¿Cómo podemos ayudarte?"
          descripcion="Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas"
        />

        {/* Información adicional */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Demo Gratuita</h3>
            <p className="text-gray-600 text-sm">
              Solicita una demostración personalizada de 30 minutos sin compromiso
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Soporte 24/7</h3>
            <p className="text-gray-600 text-sm">
              Nuestro equipo técnico está disponible para resolver tus dudas
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Asesoría Comercial</h3>
            <p className="text-gray-600 text-sm">
              Te ayudamos a elegir el plan perfecto para tu empresa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
