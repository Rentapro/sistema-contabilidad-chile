'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface OptimizacionFiscal {
  id: string;
  titulo: string;
  descripcion: string;
  ahorroEstimado: number;
  riesgoNivel: 'bajo' | 'medio' | 'alto';
  legalidad: 'totalmente_legal' | 'zona_gris' | 'requiere_revision';
  categoria: 'creditos' | 'deducciones' | 'diferimiento' | 'reestructuracion';
  pasos: string[];
  documentosRequeridos: string[];
  articulos: string[];
  deadline?: string;
}

interface ConsultaIA {
  pregunta: string;
  respuesta: string;
  timestamp: Date;
  confianza: number;
  referencias: string[];
}

export default function IAFiscalChilena() {
  const { usuario } = useAuth();
  const [consultaActual, setConsultaActual] = useState('');
  const [historialConsultas, setHistorialConsultas] = useState<ConsultaIA[]>([]);
  const [optimizaciones, setOptimizaciones] = useState<OptimizacionFiscal[]>([]);
  const [loading, setLoading] = useState(false);
  const [modoAnalisis, setModoAnalisis] = useState<'consulta' | 'optimizacion' | 'formulario'>('consulta');
  const [formularioSeleccionado, setFormularioSeleccionado] = useState('');
  const [datosEmpresa, setDatosEmpresa] = useState({
    ingresos: '',
    gastos: '',
    inversiones: '',
    empleados: '',
    giro: ''
  });

  useEffect(() => {
    cargarOptimizaciones();
  }, []);

  const cargarOptimizaciones = () => {
    const optimizacionesMock: OptimizacionFiscal[] = [
      {
        id: 'opt-001',
        titulo: '💰 Optimización Crédito por Capacitación',
        descripcion: 'Maximizar el crédito fiscal del 1% de la planilla por capacitación de empleados según Ley 19.518',
        ahorroEstimado: 2500000,
        riesgoNivel: 'bajo',
        legalidad: 'totalmente_legal',
        categoria: 'creditos',
        pasos: [
          'Identificar cursos elegibles en SENCE',
          'Documentar participantes y horas',
          'Mantener respaldos por 6 años',
          'Declarar en formulario 22 línea 98'
        ],
        documentosRequeridos: [
          'Certificados de capacitación',
          'Facturas de proveedores SENCE',
          'Nómina de participantes',
          'Evaluaciones de impacto'
        ],
        articulos: ['Ley 19.518', 'DFL N°1 de 2017', 'Resolución SII N°126']
      },
      {
        id: 'opt-002',
        titulo: '🏭 Depreciación Acelerada Activos Tecnológicos',
        descripcion: 'Aplicar depreciación acelerada a equipos computacionales e inversión en I+D',
        ahorroEstimado: 4200000,
        riesgoNivel: 'medio',
        legalidad: 'totalmente_legal',
        categoria: 'deducciones',
        pasos: [
          'Categorizar activos tecnológicos elegibles',
          'Aplicar vida útil de 3 años vs 6 años normal',
          'Documentar uso empresarial 100%',
          'Revisar límites por categoría'
        ],
        documentosRequeridos: [
          'Facturas de compra',
          'Inventario técnico detallado',
          'Declaración de uso empresarial',
          'Evaluación técnica independiente'
        ],
        articulos: ['Art. 31 N°5 LIR', 'Circular N°56 SII', 'Resolución Ex. N°1.543']
      },
      {
        id: 'opt-003',
        titulo: '⚖️ Reorganización Empresarial Estratégica',
        descripcion: 'Crear estructura holding para optimizar tributación entre empresas relacionadas',
        ahorroEstimado: 8500000,
        riesgoNivel: 'alto',
        legalidad: 'requiere_revision',
        categoria: 'reestructuracion',
        pasos: [
          'PRECAUCIÓN: Requiere asesoría legal especializada',
          'Analizar sustancia económica real',
          'Evaluar norma anti-elusión general',
          'Documentar razones comerciales válidas'
        ],
        documentosRequeridos: [
          'Estudio de planificación fiscal',
          'Análisis de sustancia económica',
          'Documentación de precios de transferencia',
          'Opinión legal independiente'
        ],
        articulos: ['Art. 4 bis LIR', 'Ley 20.780', 'Circular N°13 SII 2015']
      },
      {
        id: 'opt-004',
        titulo: '🔄 Diferimiento de Ingresos por Contratos Largo Plazo',
        descripcion: 'Aplicar método de avance de obra para diferir tributación en proyectos multianuales',
        ahorroEstimado: 6300000,
        riesgoNivel: 'bajo',
        legalidad: 'totalmente_legal',
        categoria: 'diferimiento',
        pasos: [
          'Identificar contratos elegibles (+12 meses)',
          'Implementar sistema de medición de avance',
          'Documentar hitos y porcentajes',
          'Declarar ingresos proporcionales'
        ],
        documentosRequeridos: [
          'Contratos con cronograma detallado',
          'Informes de avance mensuales',
          'Valuaciones independientes',
          'Estados de pago certificados'
        ],
        articulos: ['Art. 29 LIR', 'Circular N°47 SII', 'Resolución N°2.397']
      }
    ];

    setOptimizaciones(optimizacionesMock);
  };

  const procesarConsulta = async () => {
    if (!consultaActual.trim()) return;

    setLoading(true);
    
    // Simulación de consulta a IA fiscal
    setTimeout(() => {
      const respuestaIA = generarRespuestaIA(consultaActual);
      
      const nuevaConsulta: ConsultaIA = {
        pregunta: consultaActual,
        respuesta: respuestaIA.respuesta,
        timestamp: new Date(),
        confianza: respuestaIA.confianza,
        referencias: respuestaIA.referencias
      };

      setHistorialConsultas(prev => [nuevaConsulta, ...prev]);
      setConsultaActual('');
      setLoading(false);
    }, 2000);
  };

  const generarRespuestaIA = (pregunta: string): { respuesta: string; confianza: number; referencias: string[] } => {
    const preguntaLower = pregunta.toLowerCase();
    
    if (preguntaLower.includes('iva') || preguntaLower.includes('débito fiscal')) {
      return {
        respuesta: `🎯 **ESTRATEGIA IVA AVANZADA:**

**1. Maximización de Crédito Fiscal:**
- Adelanta compras de activos fijos antes del cierre tributario
- Revisa facturas rechazadas por errores menores (RUT, fechas)
- Implementa facturación electrónica para acelerar créditos

**2. Técnicas de Timing Legal:**
- Difiere ventas grandes al período siguiente si tienes exceso de débito
- Acelera gastos deducibles en diciembre
- Usa remanente de crédito fiscal de ejercicios anteriores

**3. ZONA DE ATENCIÓN ⚠️:**
- Evita patrones artificiales obvios de timing
- Mantén sustancia económica en todas las operaciones
- Documenta razones comerciales válidas

**Ahorro potencial estimado: $2.5M - $8M anuales**`,
        confianza: 95,
        referencias: ['DL 825', 'Art. 23 Ley IVA', 'Circular SII N°78/2019']
      };
    }

    if (preguntaLower.includes('primera categoría') || preguntaLower.includes('impuesto renta')) {
      return {
        respuesta: `💡 **OPTIMIZACIÓN IMPUESTO PRIMERA CATEGORÍA:**

**1. Gastos Deducibles Estratégicos:**
- Arriendos de vehículos vs compra (mejor flujo)
- Gastos de representación hasta 0.5% ventas
- Inversión en I+D con beneficios especiales

**2. Créditos Fiscales Infrautilizados:**
- Crédito por inversión en activos fijos
- Incentivo a la inversión privada (Art. 33 bis)
- Crédito por donaciones (hasta 1.6% RLI)

**3. ESTRATEGIA AGRESIVA LEGAL 🎯:**
- Constitución de provisiones máximas permitidas
- Diferimiento de ingresos en contratos largos
- Amortización acelerada de intangibles

**⚖️ LÍMITE ÉTICO:** Todo dentro del marco legal, con documentación sólida y sustancia económica real.`,
        confianza: 92,
        referencias: ['Art. 31 LIR', 'Art. 33 bis LIR', 'Circular N°47 SII']
      };
    }

    if (preguntaLower.includes('ppm') || preguntaLower.includes('pagos provisionales')) {
      return {
        respuesta: `⚡ **OPTIMIZACIÓN PPM INTELIGENTE:**

**1. Técnicas de Reducción Legal:**
- Solicita rebaja de PPM si proyectas menor utilidad
- Usa PPM efectivo vs teórico cuando sea favorable
- Considera cambio de sistema si eres empresa nueva

**2. Estrategia de Flujo de Caja:**
- PPM como crédito vs impuesto anual - optimiza timing
- Invierte excedentes de PPM en instrumentos de corto plazo
- Planifica gastos grandes antes de períodos PPM altos

**3. HACK LEGAL AVANZADO 🚀:**
- Constitución temporal de sociedades para proyectos específicos
- Uso de pérdidas tributarias acumuladas estratégicamente
- Sincronización de ciclos de ingresos/gastos

**PRECAUCIÓN:** Mantén coherencia en declaraciones y evita fluctuaciones artificiosas evidentes.`,
        confianza: 88,
        referencias: ['Art. 84 LIR', 'Resolución Ex. N°1.543', 'Circular N°23/2020']
      };
    }

    // Respuesta genérica
    return {
      respuesta: `🤖 **ANÁLISIS IA FISCAL:**

He analizado tu consulta y te sugiero las siguientes líneas de investigación:

**1. Optimizaciones Potenciales:**
- Revisar gastos deducibles infrautilizados
- Evaluar timing de ingresos/gastos
- Explorar créditos fiscales disponibles

**2. Áreas de Oportunidad:**
- Restructuración de operaciones
- Planificación tributaria anual
- Uso estratégico de incentivos sectoriales

**3. Próximos Pasos:**
- Realizar análisis detallado de tu situación específica
- Consultar normativa actualizada
- Evaluar riesgo vs beneficio

Para una respuesta más específica, proporciona más detalles sobre tu situación particular.`,
      confianza: 75,
      referencias: ['Ley de Impuesto a la Renta', 'Código Tributario', 'Normativa SII']
    };
  };

  const asistirFormulario = (tipo: string) => {
    const asistencias = {
      'f22': {
        titulo: 'Formulario 22 - Renta Primera Categoría',
        consejos: [
          '💡 Línea 10: Maximiza gastos operacionales documentados',
          '🎯 Línea 98: No olvides crédito por capacitación SENCE',
          '⚡ Línea 145: Revisa créditos por inversión en activos',
          '🔥 Línea 167: Usa pérdidas tributarias de ejercicios anteriores'
        ]
      },
      'f29': {
        titulo: 'Formulario 29 - IVA Mensual',
        consejos: [
          '💰 Código 115: Maximiza crédito fiscal documentado',
          '⚖️ Código 127: Timing estratégico de facturas grandes',
          '🎪 Código 156: Recuperación de IVA exportadores',
          '🚀 Código 158: Crédito especial para activos fijos'
        ]
      }
    };

    return asistencias[tipo as keyof typeof asistencias] || null;
  };

  const getRiesgoColor = (nivel: string) => {
    switch (nivel) {
      case 'bajo': return 'text-green-600 bg-green-100';
      case 'medio': return 'text-yellow-600 bg-yellow-100';
      case 'alto': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLegalidadColor = (legalidad: string) => {
    switch (legalidad) {
      case 'totalmente_legal': return 'text-green-700 bg-green-50 border-green-200';
      case 'zona_gris': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'requiere_revision': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (usuario?.rol !== 'superadmin') {
    return (
      <div className="p-6 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Acceso Restringido
        </h2>
        <p className="text-gray-600">
          Esta funcionalidad está disponible solo para SuperAdmin
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🧠 IA Fiscal Chilena Avanzada
          </h1>
          <p className="text-gray-600 mt-1">
            Asistente inteligente para optimización tributaria extrema
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-red-100 text-red-800">
            ⚖️ Uso Bajo Tu Responsabilidad
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            🎯 Solo SuperAdmin
          </Badge>
        </div>
      </div>

      {/* Disclaimer Legal */}
      <Card className="p-4 border-yellow-200 bg-yellow-50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Disclaimer Legal Importante
            </h3>
            <p className="text-sm text-yellow-700">
              Esta IA proporciona estrategias fiscales avanzadas que operan en el límite legal. 
              Siempre consulta con un abogado tributario antes de implementar estrategias marcadas como 
              "zona gris" o "requiere revisión". El usuario asume total responsabilidad por el uso de esta información.
            </p>
          </div>
        </div>
      </Card>

      {/* Modo Selection */}
      <div className="flex gap-4">
        <Button
          variant={modoAnalisis === 'consulta' ? 'default' : 'outline'}
          onClick={() => setModoAnalisis('consulta')}
          className="flex-1"
        >
          💬 Consulta IA
        </Button>
        <Button
          variant={modoAnalisis === 'optimizacion' ? 'default' : 'outline'}
          onClick={() => setModoAnalisis('optimizacion')}
          className="flex-1"
        >
          🎯 Optimizaciones
        </Button>
        <Button
          variant={modoAnalisis === 'formulario' ? 'default' : 'outline'}
          onClick={() => setModoAnalisis('formulario')}
          className="flex-1"
        >
          📝 Asistente Formularios
        </Button>
      </div>

      {/* Consulta IA */}
      {modoAnalisis === 'consulta' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              🤖 Consulta a la IA Fiscal
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Ej: ¿Cómo puedo reducir mi IVA débito fiscal legalmente?"
                  value={consultaActual}
                  onChange={(e) => setConsultaActual(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && procesarConsulta()}
                  className="flex-1"
                />
                <Button 
                  onClick={procesarConsulta}
                  disabled={loading || !consultaActual.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? '🔄' : '🚀'} Analizar
                </Button>
              </div>

              {loading && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="animate-spin text-xl">🧠</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-800">
                      Analizando normativa tributaria chilena...
                    </div>
                    <Progress value={85} className="mt-2" />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Historial de Consultas */}
          <div className="space-y-4">
            {historialConsultas.map((consulta, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 mb-2">
                        ❓ {consulta.pregunta}
                      </div>
                      <div className="text-sm text-gray-500">
                        {consulta.timestamp.toLocaleString('es-CL')}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      ✅ {consulta.confianza}% confianza
                    </Badge>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="whitespace-pre-line text-sm">
                      {consulta.respuesta}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-600">Referencias:</span>
                    {consulta.referencias.map((ref, refIndex) => (
                      <Badge key={refIndex} variant="outline" className="text-xs">
                        📚 {ref}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Optimizaciones */}
      {modoAnalisis === 'optimizacion' && (
        <div className="space-y-4">
          {optimizaciones.map((opt) => (
            <Card key={opt.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {opt.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {opt.descripcion}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${opt.ahorroEstimado.toLocaleString('es-CL')}
                  </div>
                  <div className="text-sm text-gray-500">ahorro estimado</div>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Badge className={getRiesgoColor(opt.riesgoNivel)}>
                  🎯 Riesgo {opt.riesgoNivel}
                </Badge>
                <Badge className={getLegalidadColor(opt.legalidad)}>
                  {opt.legalidad === 'totalmente_legal' ? '✅' : 
                   opt.legalidad === 'zona_gris' ? '⚠️' : '🔍'} 
                  {opt.legalidad.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  📂 {opt.categoria}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">📋 Pasos a Seguir:</h4>
                  <ul className="text-sm space-y-1">
                    {opt.pasos.map((paso, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">{index + 1}.</span>
                        <span>{paso}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">📄 Documentos Requeridos:</h4>
                  <ul className="text-sm space-y-1">
                    {opt.documentosRequeridos.map((doc, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span>📌</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {opt.articulos.map((articulo, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        📚 {articulo}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    🚀 Implementar Estrategia
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Asistente Formularios */}
      {modoAnalisis === 'formulario' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">📝 Asistente Inteligente de Formularios SII</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Button
                variant={formularioSeleccionado === 'f22' ? 'default' : 'outline'}
                onClick={() => setFormularioSeleccionado('f22')}
                className="h-16"
              >
                <div className="text-center">
                  <div className="text-lg mb-1">📊 Formulario 22</div>
                  <div className="text-xs">Renta Primera Categoría</div>
                </div>
              </Button>
              <Button
                variant={formularioSeleccionado === 'f29' ? 'default' : 'outline'}
                onClick={() => setFormularioSeleccionado('f29')}
                className="h-16"
              >
                <div className="text-center">
                  <div className="text-lg mb-1">💰 Formulario 29</div>
                  <div className="text-xs">IVA Mensual</div>
                </div>
              </Button>
            </div>

            {formularioSeleccionado && (
              <div className="space-y-4">
                {(() => {
                  const asistencia = asistirFormulario(formularioSeleccionado);
                  if (!asistencia) return null;

                  return (
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3">
                        🎯 {asistencia.titulo}
                      </h4>
                      <div className="space-y-2">
                        {asistencia.consejos.map((consejo, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-white rounded border">
                            <span className="text-sm font-medium text-blue-600">
                              {consejo}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })()}

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">🎯 Optimización en Tiempo Real</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Ingresos anuales"
                      value={datosEmpresa.ingresos}
                      onChange={(e) => setDatosEmpresa({...datosEmpresa, ingresos: e.target.value})}
                    />
                    <Input
                      placeholder="Gastos deducibles"
                      value={datosEmpresa.gastos}
                      onChange={(e) => setDatosEmpresa({...datosEmpresa, gastos: e.target.value})}
                    />
                    <Input
                      placeholder="Inversiones en activos"
                      value={datosEmpresa.inversiones}
                      onChange={(e) => setDatosEmpresa({...datosEmpresa, inversiones: e.target.value})}
                    />
                    <Input
                      placeholder="Número de empleados"
                      value={datosEmpresa.empleados}
                      onChange={(e) => setDatosEmpresa({...datosEmpresa, empleados: e.target.value})}
                    />
                  </div>
                  
                  <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
                    🧮 Calcular Optimización Máxima
                  </Button>
                </Card>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
