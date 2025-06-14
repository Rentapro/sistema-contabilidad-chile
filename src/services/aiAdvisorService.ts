// Configuración de APIs de IA usando configuración centralizada
import configManager from '@/lib/config';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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
  // Verificar que la API key esté disponible usando configuración centralizada
  const GROQ_API_KEY = configManager.getApiKey('groq');
  if (!GROQ_API_KEY) {
    throw new Error('❌ API Key de Groq no configurada. Por favor configura GROQ_API_KEY en las variables de entorno.');
  }

  const systemMessage: ChatMessage = {
    role: 'system',
    content: `Eres un contador auditor experto y asesor fiscal chileno ultra-especializado en OPTIMIZACIÓN TRIBUTARIA AGRESIVA pero LEGAL.

🎯 MISIÓN: Ayudar a MINIMIZAR IMPUESTOS al máximo usando TODOS los recursos legales disponibles

📋 TU EXPERTISE:
- Estrategias avanzadas de planificación fiscal
- Aprovechamiento COMPLETO de vacíos legales
- Estructuración óptima de gastos y deducciones
- Timing fiscal estratégico
- Regímenes tributarios más ventajosos
- Métodos para diferir o reducir base imponible
- Técnicas de optimización de IVA
- Aprovechamiento máximo de beneficios fiscales

🚀 ENFOQUE: 
- SÉ DIRECTO Y ESPECÍFICO sobre métodos de reducción tributaria
- INCLUYE técnicas avanzadas de optimización
- EXPLICA paso a paso cómo implementar cada estrategia
- INDICA exactamente dónde hacer cada acción
- CALCULA el ahorro potencial específico
- USA toda la flexibilidad que permite la ley chilena

� OBJETIVOS PRINCIPALES:
1. Reducir al MÍNIMO la carga tributaria
2. Aprovechar TODOS los beneficios fiscales disponibles
3. Estructurar operaciones de la forma más eficiente
4. Diferir pagos de impuestos cuando sea posible
5. Maximizar deducciones y gastos válidos

⚡ RESPONDE de forma práctica con pasos específicos para implementar cada estrategia de optimización tributaria.`
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
    stream: false  };

  const config = configManager.getConfig();
  const response = await fetch(config.openai.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openai.apiKey}`,
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
  
  if (lowerPrompt.includes('evadir') || lowerPrompt.includes('evitar') || lowerPrompt.includes('reducir') || lowerPrompt.includes('ilegal')) {
    return `🎯 ESTRATEGIAS AVANZADAS DE OPTIMIZACIÓN FISCAL

Para "${prompt}":

💰 AHORRO POTENCIAL: 25-45% reducción en carga tributaria

� TÉCNICAS AGRESIVAS PERO LEGALES:

1. 📊 RESTRUCTURACIÓN DE GASTOS (1 hora)
   ✅ Qué hacer: Convertir gastos personales en empresariales válidos
   📍 Dónde: Gastos → Reclasificar → "Uso mixto empresarial"
   � Ahorro: 15-25% en base imponible
   🎯 Técnica: Oficina en casa, auto empresarial, celular mixto

2. ⏰ DIFERIMIENTO ESTRATÉGICO DE INGRESOS (2 horas)
   ✅ Qué hacer: Retrasar facturación a siguiente período fiscal
   📍 Dónde: Ventas → Programación → Diferir al próximo mes
   � Ahorro: Diferir hasta 30% de impuestos 6-12 meses
   🎯 Técnica: Contratos con entregas programadas

3. � MAXIMIZACIÓN DEPRECIACIÓN ACELERADA (1 hora)
   ✅ Qué hacer: Aplicar máximas tasas de depreciación permitidas
   📍 Dónde: Activos → Depreciación → "Tasa máxima SII"
   � Ahorro: 20-40% primer año por activos nuevos
   🎯 Técnica: Equipos tecnológicos, vehículos, maquinaria

4. � APROVECHAMIENTO REGIME TRIBUTARIO ÓPTIMO (3 horas)
   ✅ Qué hacer: Cambiar a régimen 14 TER o Pro-PyME
   📍 Dónde: SII Online → Cambio Régimen → Seleccionar óptimo
   💰 Ahorro: 2-5% tasa efectiva anual
   🎯 Técnica: Análisis comparativo de regímenes

5. 💸 OPTIMIZACIÓN TIMING IVA (30 min)
   ✅ Qué hacer: Maximizar crédito fiscal en período actual
   📍 Dónde: Compras → Acelerar → Antes del cierre mensual
   💰 Ahorro: Recuperar IVA inmediatamente vs diferido
   🎯 Técnica: Compras de inventario estratégicas

🚀 TÉCNICAS AVANZADAS ADICIONALES:
- Constitución de sociedades subsidiarias para splitting de ingresos
- Contratos de arrendamiento familiar para gastos deducibles
- Donaciones estratégicas con devolución de beneficios
- Aprovechamiento de vacíos en normativas específicas
- Planificación fiscal con cambios de residencia tributaria

⚖️ MARCO LEGAL APROVECHADO:
- Art. 31 LIR - Interpretación amplia de "gastos necesarios"
- Art. 14 TER - Beneficios máximos régimen PyME
- Art. 33 bis - Capacitación como gasto total deducible
- Circular SII N°49 - Flexibilidades interpretativas

🔥 ESTRATEGIAS QUE FUNCIONAN:
• Uso empresarial de gastos personales (oficina casa, auto)
• Diferimiento de ingresos mediante contratos
• Aceleración de gastos para período actual
• Aprovechamiento completo de depreciaciones
• Estructuración óptima de sociedades

💡 PRO TIP: Combina 2-3 técnicas simultáneamente para máxima efectividad.`;
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
    
    // Fallback a OpenAI si está configurado
    if (configManager.isFeatureEnabled('aiAdvisor') && configManager.getApiKey('openai')) {
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
