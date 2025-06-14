// Configuración de APIs de IA
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export interface ChatMessage {
  id?: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface StepByStepGuide {
  title: string;
  description: string;
  steps: GuideStep[];
  estimatedSavings: string;
  legalFramework: string[];
  warnings: string[];
}

export interface GuideStep {
  step: number;
  title: string;
  description: string;
  action: string;
  location: string;
  documentation: string[];
  estimatedTime: string;
}

async function callGroqAPI(prompt: string, history: ChatMessage[]): Promise<string> {
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `Eres un experto contador auditor y asesor fiscal chileno especializado en optimización tributaria LEGAL. 

Tu misión es:
🎯 GUIAR PASO A PASO a empresarios y contadores en:
- Optimización fiscal legal y estratégica
- Reducción de carga tributaria dentro del marco legal
- Aprovechamiento de beneficios fiscales disponibles
- Planificación tributaria preventiva
- Identificación de gastos deducibles
- Estrategias de inversión con beneficios fiscales

📋 CONOCIMIENTO ESPECIALIZADO:
- Código Tributario de Chile y normativas SII actualizadas
- Formularios F29, F22, libros de IVA, declaraciones complementarias
- Impuesto a la Renta (1ª y 2ª categoría), IVA, y otros tributos
- Beneficios tributarios: Ley de I+D, donaciones, capacitación
- Gastos deducibles: operacionales, financieros, depreciación
- Regímenes especiales: PyME, 14 ter, pro PyME
- Planificación de flujos de caja tributarios

🚀 FORMATO DE RESPUESTA:
Siempre responde de forma PRÁCTICA con:
1. ✅ PASOS ESPECÍFICOS (qué hacer exactamente)
2. 📍 DÓNDE ejecutar cada acción (botones, formularios)
3. 💰 IMPACTO ESTIMADO (ahorro potencial)
4. ⚖️ MARCO LEGAL (artículos y normativas)
5. ⚠️ PRECAUCIONES (riesgos a evitar)

IMPORTANTE: Solo estrategias 100% LEGALES según normativa chilena vigente.`
  };

  const messages: ChatMessage[] = [
    systemMessage,
    ...history.slice(-8),
    { role: 'user', content: prompt }
  ];

  const payload = {
    model: 'llama3-8b-8192',
    messages: messages.map(({ role, content }) => ({ role, content })),
    temperature: 0.3,
    max_tokens: 1024,
    stream: false
  };

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content;
  
  if (!answer) {
    throw new Error('No se recibió respuesta de Groq');
  }
  
  return answer;
}

async function callOpenAIAPI(prompt: string, history: ChatMessage[]): Promise<string> {
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `Eres un experto contador y asesor tributario especializado en la normativa fiscal chilena. 
    Tienes conocimiento profundo de:
    - Código Tributario de Chile
    - Normativas del SII (Servicio de Impuestos Internos)
    - Contabilidad empresarial según normativa chilena
    - Formularios de declaración como F29, F22, etc.
    - IVA, Impuesto a la Renta, y otros tributos
    - Procedimientos de auditoría y fiscalización
    
    Proporciona respuestas precisas, prácticas y siempre actualizadas según la legislación chilena.`
  };

  const messages: ChatMessage[] = [
    systemMessage,
    ...history.slice(-8),
    { role: 'user', content: prompt }
  ];

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: messages.map(({ role, content }) => ({ role, content })),
    temperature: 0.4,
    max_tokens: 800,
    stream: false
  };

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content;
  
  if (!answer) {
    throw new Error('No se recibió respuesta de OpenAI');
  }
  
  return answer;
}

function generateSmartFallbackResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('evadir') || lowerPrompt.includes('evitar') || lowerPrompt.includes('reducir')) {
    return `🎯 OPTIMIZACIÓN FISCAL LEGAL - Guía Paso a Paso

Para "${prompt}":

💰 AHORRO ESTIMADO: 15-30% reducción en carga tributaria

📋 PASOS ESTRATÉGICOS:

1. 📊 AUDITAR GASTOS ACTUALES (30 min)
   ✅ Qué hacer: Revisar todos los gastos registrados
   📍 Dónde: Panel Gastos → Revisar → Filtrar "Deducibles"
   📄 Documentos: Facturas, recibos, comprobantes

2. 💼 MAXIMIZAR GASTOS DEDUCIBLES (1 hora)
   ✅ Qué hacer: Registrar gastos operacionales faltantes
   📍 Dónde: Gastos → Nuevo → Categoría "Deducible"
   📄 Documentos: Servicios básicos, arriendo, insumos

3. 🎓 GASTOS DE CAPACITACIÓN (2 horas)
   ✅ Qué hacer: Programar capacitaciones (1% sobre remuneraciones)
   📍 Dónde: Gastos → Capacitación → Certificado SENCE
   📄 Documentos: Certificados SENCE, facturas capacitación

4. 🏢 EVALUAR RÉGIMEN PYME (1 hora)
   ✅ Qué hacer: Verificar elegibilidad 14 TER (25% vs 27%)
   📍 Dónde: Configuración → Régimen Tributario
   📄 Documentos: Estados financieros, nómina empleados

⚖️ MARCO LEGAL:
- Art. 31 Ley Impuesto a la Renta (gastos necesarios)
- Art. 14 TER (régimen PyME)
- Art. 33 bis (capacitación)

⚠️ PRECAUCIONES:
- Solo estrategias 100% legales
- Mantener documentación completa
- Respetar límites legales
- Consultar contador si tienes dudas`;
  }

  if (lowerPrompt.includes('iva') || lowerPrompt.includes('débito') || lowerPrompt.includes('crédito')) {
    return `📊 **Optimización de IVA - Guía Práctica**

Para "${prompt}":

**Conceptos clave:**
- IVA débito: 19% sobre ventas afectas
- IVA crédito: 19% sobre compras con facturas válidas
- Saldo a pagar: Débito - Crédito
- Remanente: Si crédito > débito

**Optimización fiscal:**
- Maximizar facturas de gastos válidos
- Revisar servicios profesionales con retención
- Considerar timing de compras de activos fijos

📋 Para cálculo exacto, necesito revisar manualmente las cifras específicas.

¿Qué aspecto del IVA te interesa profundizar?`;
  }

  return `🧮 **Consulta Fiscal Recibida**

He registrado tu consulta: "${prompt}"

Para generar una guía paso a paso específica, puedo ayudarte con:

🎯 **TEMAS POPULARES:**
- Maximizar gastos deducibles
- Optimizar timing fiscal  
- Evaluar régimen PyME
- Planificar donaciones estratégicas
- Aprovechamiento de beneficios tributarios

💡 **DIME ESPECÍFICAMENTE:**
- ¿Cuál es tu situación actual?
- ¿Qué tipo de empresa tienes?
- ¿Cuáles son tus ingresos anuales aproximados?

Con más detalles puedo generar una guía personalizada paso a paso.

¿Sobre qué tema específico quieres que te guíe?`;
}

export async function askTaxAdvisor(prompt: string, history: ChatMessage[] = []): Promise<string> {
  // Intentar primero con Groq (más rápido y gratuito)
  try {
    return await callGroqAPI(prompt, history);
  } catch (groqError) {
    console.log('Groq API no disponible, intentando OpenAI...');
    
    // Fallback a OpenAI
    if (OPENAI_API_KEY) {
      try {
        return await callOpenAIAPI(prompt, history);
      } catch (openaiError) {
        console.error('Error en OpenAI:', openaiError);
      }
    }
    
    // Respuesta inteligente de fallback
    return generateSmartFallbackResponse(prompt);
  }
}

// Función para generar guía específica basada en el contexto del usuario
export async function generateContextualGuide(userPrompt: string, userContext?: any): Promise<string> {
  const contextualPrompt = `
CONTEXTO DEL USUARIO: ${JSON.stringify(userContext || {})}
CONSULTA: ${userPrompt}

Genera una guía paso a paso ESPECÍFICA y PRÁCTICA para esta consulta, considerando:
1. Situación actual del usuario
2. Pasos específicos a seguir
3. Dónde hacer cada acción en el sistema
4. Ahorro estimado
5. Marco legal aplicable
6. Precauciones importantes

FORMATO REQUERIDO:
🎯 OBJETIVO: [objetivo claro]
💰 AHORRO ESTIMADO: [rango de ahorro]

📋 PASOS A SEGUIR:
1. [Título del paso] ([tiempo estimado])
   ✅ Qué hacer: [acción específica]
   📍 Dónde: [ubicación exacta en el sistema]
   📄 Documentos: [documentos necesarios]

2. [Siguiente paso...]

⚖️ MARCO LEGAL:
- [Artículos aplicables]

⚠️ PRECAUCIONES:
- [Advertencias importantes]

Sé específico sobre dónde hacer clic, qué botones usar, qué formularios llenar.
`;

  return await askTaxAdvisor(contextualPrompt);
}

// Función para obtener guías predefinidas
export async function getStepByStepGuide(topic: string): Promise<StepByStepGuide | null> {
  const guides: { [key: string]: StepByStepGuide } = {
    'gastos_deducibles': {
      title: '💰 Maximizar Gastos Deducibles - Guía Paso a Paso',
      description: 'Estrategia para reducir la base imponible aprovechando todos los gastos deducibles permitidos por ley',
      steps: [
        {
          step: 1,
          title: 'Auditar Gastos Actuales',
          description: 'Revisar todos los gastos registrados en el último período',
          action: 'Ir a Gastos → Revisar → Filtrar por "Deducibles"',
          location: 'Panel de Gastos → Pestaña "Análisis Fiscal"',
          documentation: ['Facturas de servicios', 'Boletas de honorarios', 'Comprobantes de gastos'],
          estimatedTime: '30 minutos'
        },
        {
          step: 2,
          title: 'Identificar Gastos No Registrados',
          description: 'Buscar gastos operacionales que no han sido ingresados',
          action: 'Crear lista de gastos faltantes → Categorizar → Ingresar al sistema',
          location: 'Gastos → Nuevo Gasto → Categoría "Deducible"',
          documentation: ['Facturas pendientes', 'Servicios básicos', 'Arriendo oficina'],
          estimatedTime: '45 minutos'
        }
      ],
      estimatedSavings: '15-30% reducción en base imponible (ahorro promedio $500K-2M anuales)',
      legalFramework: [
        'Art. 31 Ley de Impuesto a la Renta - Gastos necesarios',
        'Art. 33 bis - Gastos de capacitación'
      ],
      warnings: [
        '⚠️ Todos los gastos deben tener respaldo documental válido',
        '⚠️ Los gastos deben ser necesarios para producir la renta'
      ]
    }
  };

  const normalizedTopic = topic.toLowerCase().replace(/\s+/g, '_');
  
  for (const [key, guide] of Object.entries(guides)) {
    if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
      return guide;
    }
  }

  return null;
}
