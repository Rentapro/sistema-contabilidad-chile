'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain, TrendingUp, TrendingDown, Target, Lightbulb, AlertCircle,
  DollarSign, Users, FileText, Calendar, BarChart3, PieChart, 
  LineChart, Zap, Eye, Download, RefreshCw, Settings, Filter
} from 'lucide-react';

interface Prediction {
  id: string;
  title: string;
  description: string;
  category: 'ingresos' | 'gastos' | 'clientes' | 'tributario' | 'cash_flow' | 'riesgos';
  timeframe: '7d' | '30d' | '90d' | '1y';
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  currentValue: number;
  predictedValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
  recommendations: string[];
  dataPoints: Array<{
    date: Date;
    actual?: number;
    predicted: number;
  }>;
  lastUpdated: Date;
}

interface InsightCard {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions: Array<{
    label: string;
    action: string;
    primary?: boolean;
  }>;
  metadata: {
    amount?: number;
    timeframe?: string;
    probability?: number;
  };
}

export default function AIPredictionsCenter() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Generar predicciones simuladas con IA
  useEffect(() => {
    generatePredictions();
    generateInsights();
  }, []);

  const generatePredictions = () => {
    setIsGenerating(true);
    
    // Simular tiempo de procesamiento de IA
    setTimeout(() => {
      const mockPredictions: Prediction[] = [
        {
          id: '1',
          title: 'Ingresos Próximo Trimestre',
          description: 'Predicción de ingresos basada en tendencias históricas y factores del mercado',
          category: 'ingresos',
          timeframe: '90d',
          confidence: 89,
          impact: 'high',
          currentValue: 12450000,
          predictedValue: 14280000,
          changePercent: 14.7,
          trend: 'up',
          factors: [
            'Incremento estacional del 15%',
            'Nuevos contratos firmados (+8 clientes)',
            'Mejora en retención de clientes (94%)',
            'Aumento de precios en servicios premium'
          ],
          recommendations: [
            'Aumentar capacidad del equipo comercial',
            'Preparar infraestructura para mayor demanda',
            'Optimizar flujo de caja para inversiones',
            'Establecer KPIs de seguimiento semanal'
          ],
          dataPoints: generateDataPoints(90, 12450000, 14280000),
          lastUpdated: new Date()
        },
        {
          id: '2',
          title: 'Flujo de Caja Crítico',
          description: 'Análisis predictivo de problemas de liquidez en las próximas 4 semanas',
          category: 'cash_flow',
          timeframe: '30d',
          confidence: 92,
          impact: 'critical',
          currentValue: 2800000,
          predictedValue: 1200000,
          changePercent: -57.1,
          trend: 'down',
          factors: [
            'Concentración de pagos en primera quincena',
            'Facturas pendientes por $3.2M',
            'Gastos fijos elevados ($1.8M/mes)',
            'Retraso en cobros de clientes grandes'
          ],
          recommendations: [
            'Contactar clientes con facturas vencidas',
            'Negociar plazos de pago con proveedores',
            'Considerar línea de crédito temporal',
            'Implementar descuentos por pronto pago'
          ],
          dataPoints: generateDataPoints(30, 2800000, 1200000),
          lastUpdated: new Date()
        },
        {
          id: '3',
          title: 'Riesgo Tributario F29',
          description: 'Predicción de multas potenciales por declaraciones tardías o incorrectas',
          category: 'tributario',
          timeframe: '30d',
          confidence: 76,
          impact: 'medium',
          currentValue: 0,
          predictedValue: 450000,
          changePercent: 100,
          trend: 'up',
          factors: [
            'Historial de declaraciones tardías (3 en 12 meses)',
            'Complejidad creciente de operaciones',
            'Cambios recientes en normativa SII',
            'Falta de automatización en F29'
          ],
          recommendations: [
            'Implementar alertas automáticas',
            'Contratar asesoría tributaria especializada',
            'Automatizar generación de F29',
            'Establecer revisiones semanales'
          ],
          dataPoints: generateDataPoints(30, 0, 450000),
          lastUpdated: new Date()
        },
        {
          id: '4',
          title: 'Crecimiento de Cartera de Clientes',
          description: 'Proyección de nuevos clientes basada en esfuerzos comerciales actuales',
          category: 'clientes',
          timeframe: '90d',
          confidence: 83,
          impact: 'medium',
          currentValue: 156,
          predictedValue: 189,
          changePercent: 21.2,
          trend: 'up',
          factors: [
            'Campaña de marketing en curso',
            'Referencias de clientes actuales',
            'Tendencia positiva del mercado',
            'Nuevos servicios atractivos'
          ],
          recommendations: [
            'Aumentar presupuesto de marketing',
            'Implementar programa de referidos',
            'Mejorar proceso de onboarding',
            'Desarrollar paquetes especializados'
          ],
          dataPoints: generateDataPoints(90, 156, 189),
          lastUpdated: new Date()
        },
        {
          id: '5',
          title: 'Optimización de Gastos Operacionales',
          description: 'Identificación de oportunidades de ahorro en gastos recurrentes',
          category: 'gastos',
          timeframe: '30d',
          confidence: 91,
          impact: 'medium',
          currentValue: 3200000,
          predictedValue: 2750000,
          changePercent: -14.1,
          trend: 'down',
          factors: [
            'Renegociación de contratos de servicios',
            'Automatización de procesos manuales',
            'Consolidación de proveedores',
            'Eliminación de gastos redundantes'
          ],
          recommendations: [
            'Revisar todos los contratos de servicios',
            'Implementar herramientas de automatización',
            'Centralizar compras corporativas',
            'Establecer presupuestos departamentales'
          ],
          dataPoints: generateDataPoints(30, 3200000, 2750000),
          lastUpdated: new Date()
        }
      ];

      setPredictions(mockPredictions);
      setIsGenerating(false);
      setLastUpdate(new Date());
    }, 2000);
  };

  const generateInsights = () => {
    const mockInsights: InsightCard[] = [
      {
        id: 'insight-1',
        type: 'opportunity',
        title: 'Oportunidad de Optimización Fiscal',
        description: 'Se detectó la posibilidad de reducir la carga tributaria en un 12% mediante reestructuración de operaciones.',
        confidence: 87,
        priority: 'high',
        actions: [
          { label: 'Analizar Propuesta', action: 'analyze_tax_optimization', primary: true },
          { label: 'Consultar Asesor', action: 'consult_advisor' },
          { label: 'Simular Escenarios', action: 'simulate_scenarios' }
        ],
        metadata: {
          amount: 1450000,
          timeframe: '12 meses',
          probability: 87
        }
      },
      {
        id: 'insight-2',
        type: 'risk',
        title: 'Concentración Excesiva de Clientes',
        description: 'El 65% de los ingresos proviene de solo 3 clientes, creando un riesgo significativo.',
        confidence: 94,
        priority: 'urgent',
        actions: [
          { label: 'Plan de Diversificación', action: 'create_diversification_plan', primary: true },
          { label: 'Fortalecer Relaciones', action: 'strengthen_relationships' },
          { label: 'Buscar Nuevos Mercados', action: 'explore_markets' }
        ],
        metadata: {
          probability: 78,
          timeframe: '6 meses'
        }
      },
      {
        id: 'insight-3',
        type: 'trend',
        title: 'Crecimiento Acelerado en Servicios Digitales',
        description: 'Los servicios digitales muestran un crecimiento del 45% interanual, superando las proyecciones.',
        confidence: 92,
        priority: 'medium',
        actions: [
          { label: 'Expandir Capacidad', action: 'expand_digital_capacity', primary: true },
          { label: 'Invertir en Tecnología', action: 'invest_technology' },
          { label: 'Capacitar Equipo', action: 'train_team' }
        ],
        metadata: {
          amount: 2100000,
          timeframe: 'Anual'
        }
      },
      {
        id: 'insight-4',
        type: 'anomaly',
        title: 'Patrón Inusual en Gastos de Oficina',
        description: 'Se detectó un incremento del 180% en gastos de oficina en las últimas 3 semanas.',
        confidence: 96,
        priority: 'medium',
        actions: [
          { label: 'Investigar Causas', action: 'investigate_expenses', primary: true },
          { label: 'Revisar Autorizaciones', action: 'review_approvals' },
          { label: 'Auditar Facturas', action: 'audit_invoices' }
        ],
        metadata: {
          amount: 780000,
          timeframe: '3 semanas'
        }
      }
    ];

    setInsights(mockInsights);
  };

  function generateDataPoints(days: number, startValue: number, endValue: number) {
    const points = [];
    const increment = (endValue - startValue) / days;
    
    for (let i = 0; i <= days; i++) {
      const noise = (Math.random() - 0.5) * (endValue * 0.1);
      points.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        predicted: startValue + (increment * i) + noise
      });
    }
    
    return points;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-green-600" />;
      case 'risk': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'anomaly': return <Eye className="w-5 h-5 text-orange-600" />;
      default: return <Brain className="w-5 h-5 text-purple-600" />;
    }
  };

  const filteredPredictions = predictions.filter(pred => {
    if (selectedCategory !== 'all' && pred.category !== selectedCategory) return false;
    if (selectedTimeframe !== 'all' && pred.timeframe !== selectedTimeframe) return false;
    return true;
  });

  const stats = {
    totalPredictions: predictions.length,
    highConfidence: predictions.filter(p => p.confidence >= 85).length,
    criticalImpact: predictions.filter(p => p.impact === 'critical').length,
    opportunities: insights.filter(i => i.type === 'opportunity').length,
    risks: insights.filter(i => i.type === 'risk').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            Centro de Predicciones IA
          </h1>
          <p className="text-gray-600 mt-2">
            Análisis predictivo inteligente para optimización empresarial
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isGenerating ? (
            <Button disabled>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generando Predicciones...
            </Button>
          ) : (
            <Button onClick={generatePredictions}>
              <Zap className="w-4 h-4 mr-2" />
              Generar Nuevas Predicciones
            </Button>
          )}
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalPredictions}</div>
                <div className="text-sm text-gray-600">Predicciones Activas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.highConfidence}</div>
                <div className="text-sm text-gray-600">Alta Confianza (85%+)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.criticalImpact}</div>
                <div className="text-sm text-gray-600">Impacto Crítico</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.opportunities}</div>
                <div className="text-sm text-gray-600">Oportunidades</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.risks}</div>
                <div className="text-sm text-gray-600">Riesgos Detectados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="all">Todas las categorías</option>
                <option value="ingresos">Ingresos</option>
                <option value="gastos">Gastos</option>
                <option value="clientes">Clientes</option>
                <option value="tributario">Tributario</option>
                <option value="cash_flow">Flujo de Caja</option>
                <option value="riesgos">Riesgos</option>
              </select>

              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="all">Todos los plazos</option>
                <option value="7d">7 días</option>
                <option value="30d">30 días</option>
                <option value="90d">90 días</option>
                <option value="1y">1 año</option>
              </select>
            </div>

            <div className="text-sm text-gray-500">
              Última actualización: {lastUpdate.toLocaleString('es-CL')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Predicciones ({filteredPredictions.length})</TabsTrigger>
          <TabsTrigger value="insights">Insights IA ({insights.length})</TabsTrigger>
          <TabsTrigger value="analysis">Análisis Avanzado</TabsTrigger>
        </TabsList>

        {/* Predicciones */}
        <TabsContent value="predictions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPredictions.map((prediction) => (
              <Card key={prediction.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{prediction.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{prediction.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactColor(prediction.impact)}>
                        {prediction.impact}
                      </Badge>
                      <Badge variant="outline">
                        {prediction.timeframe}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Métricas Principales */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Valor Actual</div>
                      <div className="text-lg font-bold">
                        {prediction.category === 'clientes' ? 
                          prediction.currentValue.toLocaleString() :
                          formatCurrency(prediction.currentValue)
                        }
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-500">Predicción</div>
                      <div className="text-lg font-bold text-blue-600">
                        {prediction.category === 'clientes' ? 
                          prediction.predictedValue.toLocaleString() :
                          formatCurrency(prediction.predictedValue)
                        }
                      </div>
                    </div>
                  </div>

                  {/* Cambio y Confianza */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {prediction.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`font-medium ${
                        prediction.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {prediction.changePercent > 0 ? '+' : ''}{prediction.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Confianza:</span>
                      <div className="flex items-center gap-1">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${prediction.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{prediction.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Factores */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Factores Clave:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {prediction.factors.slice(0, 3).map((factor, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recomendaciones */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recomendaciones:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {prediction.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalles
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Exportar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insights IA */}
        <TabsContent value="insights">
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getInsightIcon(insight.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{insight.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority}
                          </Badge>
                          <Badge variant="outline">
                            {insight.confidence}% confianza
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{insight.description}</p>
                      
                      {/* Metadata */}
                      {insight.metadata && (
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          {insight.metadata.amount && (
                            <span>Impacto: {formatCurrency(insight.metadata.amount)}</span>
                          )}
                          {insight.metadata.timeframe && (
                            <span>Plazo: {insight.metadata.timeframe}</span>
                          )}
                          {insight.metadata.probability && (
                            <span>Probabilidad: {insight.metadata.probability}%</span>
                          )}
                        </div>
                      )}
                      
                      {/* Acciones */}
                      <div className="flex items-center gap-2">
                        {insight.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.primary ? "default" : "outline"}
                            size="sm"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Análisis Avanzado */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Matriz de Impacto vs Probabilidad */}
            <Card>
              <CardHeader>
                <CardTitle>Matriz de Riesgo-Oportunidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div></div>
                    <div className="text-center font-medium">Baja Prob.</div>
                    <div className="text-center font-medium">Alta Prob.</div>
                    
                    <div className="font-medium">Alto Impacto</div>
                    <div className="bg-yellow-100 p-2 rounded text-center">⚠️ Monitor</div>
                    <div className="bg-red-100 p-2 rounded text-center">🚨 Crítico</div>
                    
                    <div className="font-medium">Bajo Impacto</div>
                    <div className="bg-green-100 p-2 rounded text-center">✅ Seguro</div>
                    <div className="bg-blue-100 p-2 rounded text-center">📊 Revisar</div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>• {predictions.filter(p => p.impact === 'critical').length} predicciones en zona crítica</p>
                    <p>• {predictions.filter(p => p.confidence >= 85).length} predicciones de alta confianza</p>
                    <p>• {insights.filter(i => i.type === 'opportunity').length} oportunidades identificadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tendencias por Categoría */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencias por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['ingresos', 'gastos', 'clientes', 'tributario'].map((category) => {
                    const categoryPredictions = predictions.filter(p => p.category === category);
                    const avgChange = categoryPredictions.reduce((sum, p) => sum + p.changePercent, 0) / categoryPredictions.length || 0;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${avgChange > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(Math.abs(avgChange), 100)}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${avgChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {avgChange > 0 ? '+' : ''}{avgChange.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
