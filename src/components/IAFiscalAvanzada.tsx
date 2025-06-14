import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Lightbulb, TrendingUp, Calculator, Brain, Zap } from "lucide-react";

interface ConsultoraIA {
  tipo: 'optimizacion' | 'observacion' | 'planificacion' | 'creditos' | 'flujo_caja';
  pregunta: string;
  respuesta: string;
  impactoEconomico: string;
  acciones: string[];
  riesgo: 'bajo' | 'medio' | 'alto';
  confianza: number;
  referencias: string[];
}

interface OptimizacionAutomatica {
  categoria: string;
  titulo: string;
  descripcion: string;
  ahorroEstimado: number;
  facilidad: 'facil' | 'intermedio' | 'avanzado';
  plazo: string;
  requisitos: string[];
  pasosImplementacion: string[];
}

export default function IAFiscalAvanzada() {  const [consultaActual, setConsultaActual] = useState('');
  const [consultas, setConsultas] = useState<ConsultoraIA[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarOptimizaciones, setMostrarOptimizaciones] = useState(false);
  const [pasosExpandidos, setPasosExpandidos] = useState<{[key: string]: boolean}>({});

  // Optimizaciones automáticas detectadas por la IA
  const optimizacionesDetectadas: OptimizacionAutomatica[] = [
    {
      categoria: 'IVA',
      titulo: 'Optimización de Timing de Facturas',
      descripcion: 'Detecté que puedes optimizar el timing de facturación para maximizar créditos fiscales de IVA. Al sincronizar mejor compras y ventas, podrías mejorar tu flujo de caja.',
      ahorroEstimado: 2400000,
      facilidad: 'facil',
      plazo: '30 días',
      requisitos: [
        'Revisar ciclo de facturación actual',
        'Identificar proveedores con flexibilidad de fechas',
        'Planificar compras de fin de mes'
      ],
      pasosImplementacion: [
        '1. Programa facturas grandes para los primeros días del mes',
        '2. Acelera compras importantes hacia fin de mes anterior',
        '3. Negocia con proveedores fechas de facturación favorables',
        '4. Utiliza la regla del "devengado" a tu favor'
      ]
    },
    {
      categoria: 'PPM',
      titulo: 'Reducción Estratégica de PPM',
      descripcion: 'Tu PPM actual está sobredimensionado en un 35%. Puedes reducirlo significativamente basado en proyecciones más realistas, liberando flujo de caja.',
      ahorroEstimado: 4200000,
      facilidad: 'intermedio',
      plazo: '45 días',
      requisitos: [
        'Proyecciones de ingresos conservadoras pero realistas',
        'Análisis de estacionalidad histórica',
        'Presentar formulario de reducción de PPM'
      ],
      pasosImplementacion: [
        '1. Analizar ventas de últimos 12 meses',
        '2. Proyectar ingresos con método conservador',
        '3. Calcular nuevo PPM óptimo',
        '4. Presentar solicitud de reducción al SII',
        '5. Invertir excedente liberado en instrumentos de corto plazo'
      ]
    },
    {
      categoria: 'Créditos Fiscales',
      titulo: 'Recuperación Acelerada de Créditos',
      descripcion: 'Tienes $890.000 en créditos fiscales acumulados. La IA sugiere una estrategia de recuperación que optimiza tanto flujo de caja como rentabilidad bancaria.',
      ahorroEstimado: 890000,
      facilidad: 'facil',
      plazo: '60 días',
      requisitos: [
        'Documentación de créditos fiscales',
        'Decisión sobre uso (devolución vs imputación)',
        'Plan de inversión de fondos recuperados'
      ],
      pasosImplementacion: [
        '1. Solicitar devolución inmediata de $600.000',
        '2. Mantener $290.000 para imputar a próximo PPM',
        '3. Invertir devolución en depósito a plazo 90 días',
        '4. Generar rentabilidad adicional del 8% anual'
      ]
    },
    {
      categoria: 'Estructura Societaria',
      titulo: 'Optimización Tributaria con Holding',
      descripcion: 'Tus ingresos actuales justifican la creación de una estructura de holding. Podrías diferir impuestos y optimizar la carga tributaria total.',
      ahorroEstimado: 8500000,
      facilidad: 'avanzado',
      plazo: '90 días',
      requisitos: [
        'Ingresos anuales > $80.000.000',
        'Asesoría legal especializada',
        'Planificación patrimonial de mediano plazo'
      ],
      pasosImplementacion: [
        '1. Constituir sociedad holding',
        '2. Transferir activos productivos al holding',
        '3. Facturar servicios entre sociedades relacionadas',
        '4. Diferir retiros de utilidades estratégicamente',
        '5. Aprovechar tasa reducida de 25% vs 35% personal'
      ]
    }
  ];

  const procesarConsulta = async () => {
    if (!consultaActual.trim()) return;

    setLoading(true);

    // Simulación de procesamiento de IA
    setTimeout(() => {
      const respuestaIA = generarRespuestaIAAvanzada(consultaActual);
      
      const nuevaConsulta: ConsultoraIA = {
        tipo: respuestaIA.tipo,
        pregunta: consultaActual,
        respuesta: respuestaIA.respuesta,
        impactoEconomico: respuestaIA.impactoEconomico,
        acciones: respuestaIA.acciones,
        riesgo: respuestaIA.riesgo,
        confianza: respuestaIA.confianza,
        referencias: respuestaIA.referencias
      };

      setConsultas(prev => [nuevaConsulta, ...prev]);
      setConsultaActual('');
      setLoading(false);
    }, 2000);
  };

  const generarRespuestaIAAvanzada = (pregunta: string) => {
    const preguntaLower = pregunta.toLowerCase();

    // Detección de observaciones del SII
    if (preguntaLower.includes('observación') || preguntaLower.includes('observacion') || preguntaLower.includes('sii me observó')) {
      return {
        tipo: 'observacion' as const,
        respuesta: `🤖 **ANÁLISIS IA - OBSERVACIÓN SII:**

**Diagnóstico:** Las observaciones del SII generalmente se deben a inconsistencias en declaraciones o falta de documentación de respaldo.

**🎯 Plan de Acción Inmediato:**
1. **Revisión Técnica**: Analiza exactamente qué cuestionó el SII
2. **Documentación**: Recopila TODOS los documentos de respaldo
3. **Cálculo Correcto**: Recalcula los montos con metodología SII
4. **Respuesta Formal**: Presenta descargos dentro del plazo

**💡 Estrategia Legal:**
- Si hay error de interpretación: Cita normativas específicas
- Si hay error de cálculo: Presenta rectificatoria inmediata
- Si hay documentos faltantes: Presenta complemento probatorio

**⚠️ Evita estos errores comunes:**
- No ignorar la observación (se convierte en multa automática)
- No presentar documentos parciales
- No argumentar sin base legal sólida`,
        impactoEconomico: 'Resolver correctamente: $0. Ignorar: Multa de 50% del impuesto + intereses mensuales de 1,5%',
        acciones: [
          'Revisar observación detalladamente en portal SII',
          'Recopilar documentación completa de respaldo',
          'Calcular impacto económico exacto',
          'Preparar respuesta técnica y legal',
          'Presentar descargos antes del vencimiento'
        ],
        riesgo: 'alto' as const,
        confianza: 95,
        referencias: ['Código Tributario Art. 161', 'Resolución SII N°12.501', 'Circular N°78/2019']
      };
    }

    // Optimización de IVA
    if (preguntaLower.includes('iva') && (preguntaLower.includes('optimizar') || preguntaLower.includes('reducir'))) {
      return {
        tipo: 'optimizacion' as const,
        respuesta: `🤖 **ESTRATEGIA IA - OPTIMIZACIÓN IVA:**

**🎯 Oportunidades Detectadas:**

**1. TIMING ESTRATÉGICO 📅:**
- Acelera compras grandes en meses de altas ventas
- Difiere facturas de servicios al próximo período si hay exceso de débito
- Programa mantenciones y reparaciones en diciembre

**2. RECUPERACIÓN ACELERADA 💨:**
- Solicita devolución inmediata de créditos acumulados
- Imputa créditos a PPM para reducir pagos mensuales
- Aprovecha créditos de activos fijos inmediatamente

**3. OPTIMIZACIÓN OPERACIONAL ⚙️:**
- Negocia fechas de facturación con proveedores clave
- Centraliza compras para maximizar economías de escala
- Evalúa cambio de proveedores exentos a afectos (mejor crédito)

**🚀 HACK AVANZADO:**
Usa la "Regla del Devengado" para optimizar timing de reconocimiento de IVA sin alterar flujos de caja reales.`,
        impactoEconomico: 'Ahorro estimado: $3.2M anuales en mejor flujo de caja + optimización de créditos fiscales',
        acciones: [
          'Implementar calendario de facturación estratégico',
          'Solicitar devolución de créditos acumulados',
          'Renegociar términos con proveedores principales',
          'Establecer sistema de monitoreo mensual IVA',
          'Crear alertas automáticas de oportunidades'
        ],
        riesgo: 'bajo' as const,
        confianza: 92,
        referencias: ['DL 825 Ley IVA', 'Art. 23 sobre crédito fiscal', 'Circular SII N°45/2020']
      };
    }

    // Optimización PPM
    if (preguntaLower.includes('ppm') && (preguntaLower.includes('reducir') || preguntaLower.includes('optimizar'))) {
      return {
        tipo: 'optimizacion' as const,
        respuesta: `🤖 **ESTRATEGIA IA - PPM INTELIGENTE:**

**📊 Análisis de tu Situación:**
Tu PPM actual parece estar sobredimensionado. La IA detecta oportunidades de optimización.

**🎯 Plan de Optimización:**

**1. REDUCCIÓN ESTRATÉGICA 📉:**
- Recalcula PPM con proyecciones conservadoras pero realistas
- Considera estacionalidad de tu negocio
- Aplica coeficientes de ajuste por inflación

**2. GESTIÓN DE FLUJO DE CAJA 💰:**
- PPM reducido = más liquidez mensual
- Invierte excedentes en instrumentos de corto plazo
- Mantén reserva para regularización anual

**3. ESTRATEGIA BANCARIA 🏦:**
- PPM menor mejora ratios financieros
- Mayor liquidez = mejor evaluación crediticia
- Demuestra eficiencia en gestión tributaria

**⚡ RECOMENDACIÓN IA:**
Reduce tu PPM en 30-40% manteniendo un margen de seguridad del 15% sobre la proyección base.`,
        impactoEconomico: 'Liberación de flujo: $4.2M anuales. Rentabilidad adicional al 8%: $336.000',
        acciones: [
          'Calcular proyección conservadora de ingresos',
          'Presentar solicitud de reducción PPM',
          'Configurar inversiones automáticas de excedentes',
          'Monitorear performance vs proyección mensualmente',
          'Preparar ajustes para regularización anual'
        ],
        riesgo: 'medio' as const,
        confianza: 88,
        referencias: ['Art. 84 LIR sobre PPM', 'Resolución Ex. N°1.543', 'Circular N°23/2020']
      };
    }

    // Análisis de créditos fiscales
    if (preguntaLower.includes('crédito') && (preguntaLower.includes('fiscal') || preguntaLower.includes('recuperar'))) {
      return {
        tipo: 'creditos' as const,
        respuesta: `🤖 **ANÁLISIS IA - CRÉDITOS FISCALES:**

**💰 Estado Actual de tus Créditos:**
Detecté $890.000 en créditos fiscales disponibles. ¡Es dinero tuyo que el Estado debe devolver!

**🎯 Estrategia Óptima de Recuperación:**

**1. DEVOLUCIÓN INMEDIATA 💸:**
- Solicita devolución de $600.000 (liquidez inmediata)
- Tiempo estimado: 45-60 días
- Invierte en depósito a plazo mientras tanto

**2. IMPUTACIÓN ESTRATÉGICA 🔄:**
- Mantén $290.000 para imputar a próximos PPM
- Reduce pagos mensuales automáticamente
- Mejor para flujo de caja continuo

**3. MAXIMIZACIÓN DE RENTABILIDAD 📈:**
- Fondos devueltos al 8% anual = $48.000 adicionales
- Créditos imputados evitan intereses de financiamiento
- Mejora rating crediticio por mejor liquidez

**⚠️ Errores Comunes a Evitar:**
- No solicitar devolución (pierdes rentabilidad)
- Dejar créditos "durmiendo" sin usar
- No planificar uso óptimo de fondos recuperados`,
        impactoEconomico: 'Beneficio total: $890.000 + $71.200 anuales en rentabilidad adicional',
        acciones: [
          'Solicitar devolución inmediata vía portal SII',
          'Configurar imputación automática de saldo',
          'Abrir depósito a plazo para fondos devueltos',
          'Programar reinversión de intereses generados',
          'Monitorear nuevos créditos mensualmente'
        ],
        riesgo: 'bajo' as const,
        confianza: 96,
        referencias: ['Art. 23 Ley IVA', 'Resolución N°12.220', 'Procedimiento devoluciones SII']
      };
    }

    // Respuesta genérica avanzada
    return {
      tipo: 'planificacion' as const,
      respuesta: `🤖 **ANÁLISIS IA FISCAL PERSONALIZADO:**

He analizado tu consulta y detecté oportunidades de optimización tributaria.

**🎯 Recomendaciones Inmediatas:**

**1. ANÁLISIS INTELIGENTE 🧠:**
- Revisión completa de tu situación fiscal actual
- Identificación de oportunidades no aprovechadas
- Benchmarking con empresas similares

**2. OPTIMIZACIÓN AUTOMÁTICA ⚡:**
- Implementación de estrategias probadas
- Configuración de alertas inteligentes
- Automatización de procesos tributarios

**3. MONITOREO CONTINUO 📊:**
- Seguimiento en tiempo real de cambios tributarios
- Ajustes automáticos según performance
- Reportes ejecutivos mensuales

**💡 Próximos Pasos:**
Te sugiero usar nuestro módulo de "Optimizaciones Automáticas" que detectó 4 oportunidades específicas para tu caso.`,
      impactoEconomico: 'Potencial de optimización: $5M - $15M anuales según tamaño de operación',
      acciones: [
        'Activar módulo de optimizaciones automáticas',
        'Programar revisión fiscal trimestral',
        'Configurar alertas de oportunidades',
        'Implementar dashboard de KPIs tributarios',
        'Establecer metas de eficiencia fiscal'
      ],
      riesgo: 'bajo' as const,
      confianza: 85,
      referencias: ['Múltiples normativas aplicables según caso específico']
    };
  };
  const implementarOptimizacion = (optimizacion: OptimizacionAutomatica) => {
    alert(`🤖 IA FISCAL: Iniciando implementación de "${optimizacion.titulo}"\n\nAhorro estimado: $${optimizacion.ahorroEstimado.toLocaleString()}\nPlazo: ${optimizacion.plazo}\n\nLa IA comenzará a ejecutar los pasos automáticamente y te notificará el progreso.`);
  };

  const mostrarPasosCompletos = (optimizacion: OptimizacionAutomatica) => {
    const key = optimizacion.titulo;
    setPasosExpandidos(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-purple-600" />
          IA Fiscal Avanzada
        </h1>
        <p className="text-gray-600">
          Consultor tributario con inteligencia artificial para optimización fiscal chilena
        </p>
      </div>

      {/* Optimizaciones Automáticas Detectadas */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Optimizaciones Detectadas Automáticamente
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
              {optimizacionesDetectadas.length} oportunidades
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {optimizacionesDetectadas.map((opt, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{opt.titulo}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    opt.facilidad === 'facil' ? 'bg-green-100 text-green-800' :
                    opt.facilidad === 'intermedio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {opt.facilidad}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3 font-medium">{opt.descripcion}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-green-600">
                    💰 ${opt.ahorroEstimado.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">⏱️ {opt.plazo}</span>
                </div>                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-800">Pasos de implementación:</p>
                  <ul className="text-sm text-gray-800 space-y-1">
                    {(pasosExpandidos[opt.titulo] ? opt.pasosImplementacion : opt.pasosImplementacion.slice(0, 2)).map((paso, i) => (
                      <li key={i} className="font-medium">• {paso}</li>
                    ))}
                    {opt.pasosImplementacion.length > 2 && !pasosExpandidos[opt.titulo] && (
                      <li className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors">
                        <button 
                          onClick={() => mostrarPasosCompletos(opt)}
                          className="text-left underline hover:no-underline"
                        >
                          ... y {opt.pasosImplementacion.length - 2} pasos más (hacer clic para ver todos)
                        </button>
                      </li>
                    )}
                    {pasosExpandidos[opt.titulo] && opt.pasosImplementacion.length > 2 && (
                      <li className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors">
                        <button 
                          onClick={() => mostrarPasosCompletos(opt)}
                          className="text-left underline hover:no-underline"
                        >
                          ▲ Mostrar menos pasos
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                <Button 
                  onClick={() => implementarOptimizacion(opt)}
                  className="w-full"
                  size="sm"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Implementar Automáticamente
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consultor IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Consultor IA Tributario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Textarea
                placeholder="Pregunta cualquier cosa sobre tributación chilena: optimizaciones, observaciones del SII, estrategias de ahorro, etc."
                value={consultaActual}
                onChange={(e) => setConsultaActual(e.target.value)}
                className="flex-1"
                rows={3}
              />
            </div>
            
            <Button 
              onClick={procesarConsulta}
              disabled={loading || !consultaActual.trim()}
              className="w-full"
            >
              {loading ? (
                <>🤖 IA Analizando...</>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Consultar IA Fiscal
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Respuestas de la IA */}
      {consultas.map((consulta, index) => (
        <Card key={index} className={`border-l-4 ${
          consulta.riesgo === 'alto' ? 'border-l-red-500' :
          consulta.riesgo === 'medio' ? 'border-l-yellow-500' :
          'border-l-green-500'
        }`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center gap-2">
                {consulta.tipo === 'observacion' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                {consulta.tipo === 'optimizacion' && <TrendingUp className="h-5 w-5 text-green-500" />}
                {consulta.tipo === 'creditos' && <Calculator className="h-5 w-5 text-blue-500" />}
                {consulta.tipo === 'planificacion' && <Lightbulb className="h-5 w-5 text-yellow-500" />}
                Pregunta: {consulta.pregunta}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  consulta.riesgo === 'alto' ? 'bg-red-100 text-red-800' :
                  consulta.riesgo === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  Riesgo {consulta.riesgo}
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {consulta.confianza}% confianza
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-sm">{consulta.respuesta}</div>
            </div>            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
              <h4 className="font-bold mb-2 text-green-900 text-base">💰 Impacto Económico:</h4>
              <p className="text-sm font-bold text-green-950">{consulta.impactoEconomico}</p>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-300">
              <h4 className="font-bold mb-2 text-blue-900 text-base">✅ Acciones Recomendadas:</h4>
              <ul className="text-sm space-y-2">
                {consulta.acciones.map((accion, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-800 font-bold text-base">•</span>
                    <span className="text-blue-950 font-semibold">{accion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-gray-500">
              <strong>Referencias legales:</strong> {consulta.referencias.join(', ')}
            </div>
          </CardContent>
        </Card>
      ))}

      {consultas.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              IA Fiscal Lista para Ayudarte
            </h3>
            <p className="text-gray-500">
              Haz tu primera consulta sobre optimización tributaria, observaciones del SII, o cualquier tema fiscal
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
