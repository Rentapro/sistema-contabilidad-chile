// Test rápido del servicio de IA con Groq
// Ejecutar con: node test-groq-directo.js

async function testGroqAPI() {
  console.log('🧪 Probando conexión directa con Groq API...\n');

  const GROQ_API_KEY = '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';
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto contador chileno especializado en normativa SII.'
          },
          {
            role: 'user',
            content: '¿Cuál es la tasa de IVA actual en Chile?'
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ ¡Groq API funcionando correctamente!');
      console.log('📝 Respuesta de ejemplo:');
      console.log(data.choices[0].message.content);
      console.log('\n🎉 Tu asesor fiscal IA está listo para usar a máxima velocidad!');
    } else {
      console.log('❌ Error en la respuesta de Groq:', response.status);
      console.log('📄 Detalles:', await response.text());
    }
  } catch (error) {
    console.log('❌ Error conectando con Groq:', error.message);
    console.log('🔧 Verifica tu conexión a internet y la API key');
  }
}

// Ejecutar el test
testGroqAPI();
