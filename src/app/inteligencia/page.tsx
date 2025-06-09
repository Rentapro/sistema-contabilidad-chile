'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  AlertTriangle, 
  PieChart,
  Activity,
  Zap,
  Lightbulb,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  AlertCircle,
  Eye,
  Download
} from 'lucide-react';
import { formatCurrency, formatearPorcentaje } from '@/lib/utils';

interface PrediccionIA {
  id: string;
  tipo: 'ingresos' | 'clientes' | 'gastos' | 'riesgo';
  prediccion: number;
  confianza: number;
  periodo: string;
  tendencia: 'al_alza' | 'a_la_baja' | 'estable';
  factores: string[];
  recomendaciones: string[];
}

interface AnalisisRiesgo {
  id: string;
  empresaId: string;
  nombreEmpresa: string;
  nivelRiesgo: 'bajo' | 'medio' | 'alto';
  puntuacion: number;
  factores: {
    liquidez: number;
    solvencia: number;
    rentabilidad: number;
    cumplimiento: number;
  };
  alertas: string[];
  recomendaciones: string[];
}

interface PatronDetectado {
  id: string;
  tipo: 'anomalia' | 'oportunidad' | 'tendencia';
  descripcion: string;
  impacto: 'alto' | 'medio' | 'bajo';
  confianza: number;
  datos: Record<string, unknown>;
  fechaDeteccion: Date;
}

interface MetricaBI {
  nombre: string;
  valor: number;
  unidad: string;
  cambio: number;
  tendencia: 'positiva' | 'negativa' | 'neutral';
  objetivo?: number;
}

export default function InteligenciaPage() {
  const [predicciones, setPredicciones] = useState<PrediccionIA[]>([]);
  const [analisisRiesgo, setAnalisisRiesgo] = useState<AnalisisRiesgo[]>([]);
  const [patronesDetectados, setPatronesDetectados] = useState<PatronDetectado[]>([]);
  const [metricas, setMetricas] = useState<MetricaBI[]>([]);
  const [periodoAnalisis, setPeriodoAnalisis] = useState('6m');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');

  useEffect(() => {
    cargarDatosIA();
  }, [periodoAnalisis]);

  const cargarDatosIA = async () => {
    setIsAnalyzing(true);
    
    // Simular análisis de IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generar predicciones
    const prediccionesGeneradas: PrediccionIA[] = [
      {
        id: '1',
        tipo: 'ingresos',
        prediccion: 2850000,
        confianza: 0.87,
        periodo: 'Próximos 3 meses',
        tendencia: 'al_alza',
        factores: ['Crecimiento de clientes', 'Nuevos servicios', 'Época fiscal'],
        recomendaciones: ['Contratar más contadores', 'Expandir servicios premium']
      },
      {
        id: '2',
        tipo: 'clientes',
        prediccion: 15,
        confianza: 0.92,
        periodo: 'Próximo mes',
        tendencia: 'al_alza',
        factores: ['Marketing digital', 'Referidos', 'Temporada alta'],
        recomendaciones: ['Preparar onboarding', 'Asignar recursos']
      },
      {
        id: '3',
        tipo: 'riesgo',
        prediccion: 0.23,
        confianza: 0.78,
        periodo: 'Próximos 6 meses',
        tendencia: 'estable',
        factores: ['Diversificación de clientes', 'Estabilidad financiera'],
        recomendaciones: ['Mantener diversificación', 'Monitorear mercado']
      }
    ];

    // Generar análisis de riesgo
    const riesgosGenerados: AnalisisRiesgo[] = [
      {
        id: '1',
        empresaId: 'emp1',
        nombreEmpresa: 'TechCorp S.A.',
        nivelRiesgo: 'medio',
        puntuacion: 65,
        factores: {
          liquidez: 0.75,
          solvencia: 0.68,
          rentabilidad: 0.82,
          cumplimiento: 0.95
        },
        alertas: ['Liquidez por debajo del promedio', 'Aumento en gastos operativos'],
        recomendaciones: ['Mejorar gestión de efectivo', 'Revisar gastos no esenciales']
      },
      {
        id: '2',
        empresaId: 'emp2',
        nombreEmpresa: 'Retail Plus Ltda.',
        nivelRiesgo: 'alto',
        puntuacion: 35,
        factores: {
          liquidez: 0.45,
          solvencia: 0.32,
          rentabilidad: 0.15,
          cumplimiento: 0.88
        },
        alertas: ['Liquidez crítica', 'Rentabilidad muy baja', 'Deudas elevadas'],
        recomendaciones: ['Plan de reestructuración urgente', 'Renegociar deudas', 'Reducir costos operativos']
      }
    ];

    // Generar patrones detectados
    const patronesGenerados: PatronDetectado[] = [
      {
        id: '1',
        tipo: 'oportunidad',
        descripcion: 'Incremento del 340% en consultas de servicios de auditoría en el último trimestre',
        impacto: 'alto',
        confianza: 0.94,
        datos: { incremento: 340, servicio: 'auditoria', periodo: 'Q4' },
        fechaDeteccion: new Date()
      },
      {
        id: '2',
        tipo: 'anomalia',
        descripcion: 'Patrón inusual de gastos en 3 empresas clientes durante diciembre',
        impacto: 'medio',
        confianza: 0.76,
        datos: { empresas: 3, mes: 'diciembre', tipo: 'gastos' },
        fechaDeteccion: new Date()
      },
      {
        id: '3',
        tipo: 'tendencia',
        descripcion: 'Adopción creciente de facturación electrónica: +85% en 6 meses',
        impacto: 'alto',
        confianza: 0.91,
        datos: { incremento: 85, periodo: '6 meses', tipo: 'facturacion_electronica' },
        fechaDeteccion: new Date()
      }
    ];

    // Generar métricas BI
    const metricsGeneradas: MetricaBI[] = [
      { 
        nombre: 'ROI Promedio Clientes', 
        valor: 285, 
        unidad: '%', 
        cambio: 15.3, 
        tendencia: 'positiva',
        objetivo: 250 
      },
      { 
        nombre: 'Tiempo Promedio Respuesta', 
        valor: 4.2, 
        unidad: 'horas', 
        cambio: -12.8, 
        tendencia: 'positiva' 
      },
      { 
        nombre: 'Satisfacción Cliente', 
        valor: 94.7, 
        unidad: '%', 
        cambio: 2.1, 
        tendencia: 'positiva',
        objetivo: 95 
      },
      { 
        nombre: 'Productividad Contadores', 
        valor: 87.3, 
        unidad: '%', 
        cambio: 8.9, 
        tendencia: 'positiva',
        objetivo: 90 
      }
    ];

    setPredicciones(prediccionesGeneradas);
    setAnalisisRiesgo(riesgosGenerados);
    setPatronesDetectados(patronesGenerados);
    setMetricas(metricsGeneradas);
    setIsAnalyzing(false);
  };

  const ejecutarAnalisisCompleto = async () => {
    setIsAnalyzing(true);
    await cargarDatosIA();
  };

  const exportarReporte = () => {
    // Implementar exportación de reporte BI
    alert('Generando reporte de inteligencia de negocios...');
  };

  const getTrendIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'al_alza':
      case 'positiva':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'a_la_baja':
      case 'negativa':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskColor = (nivel: string) => {
    switch (nivel) {
      case 'bajo':
        return 'bg-green-100 text-green-800';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800';
      case 'alto':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPatternIcon = (tipo: string) => {
    switch (tipo) {
      case 'oportunidad':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'anomalia':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'tendencia':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Inteligencia de Negocios
          </h1>
          <p className="text-gray-600">
            Análisis predictivo y insights automatizados para tu firma contable
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={periodoAnalisis} onValueChange={setPeriodoAnalisis}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Último mes</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={ejecutarAnalisisCompleto} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Ejecutar Análisis
              </>
            )}
          </Button>
          <Button variant="outline" onClick={exportarReporte}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-5 w-full mb-6">
          <TabsTrigger value="dashboard">Dashboard IA</TabsTrigger>
          <TabsTrigger value="predicciones">Predicciones</TabsTrigger>
          <TabsTrigger value="riesgos">Análisis de Riesgo</TabsTrigger>
          <TabsTrigger value="patrones">Patrones</TabsTrigger>
          <TabsTrigger value="metricas">Métricas Avanzadas</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Métricas principales */}
            {metricas.slice(0, 4).map((metrica, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metrica.nombre}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">
                          {metrica.valor}{metrica.unidad}
                        </p>
                        {getTrendIcon(metrica.tendencia)}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className={`${metrica.cambio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {metrica.cambio >= 0 ? '+' : ''}{metrica.cambio}%
                        </span>
                        <span className="text-gray-500">vs período anterior</span>
                      </div>
                    </div>
                  </div>
                  {metrica.objetivo && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Objetivo: {metrica.objetivo}{metrica.unidad}</span>
                        <span>{Math.round((metrica.valor / metrica.objetivo) * 100)}%</span>
                      </div>
                      <Progress value={(metrica.valor / metrica.objetivo) * 100} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Predicciones destacadas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Predicciones Clave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predicciones.slice(0, 3).map((prediccion) => (
                    <div key={prediccion.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium capitalize">{prediccion.tipo.replace('_', ' ')}</h4>
                        <Badge variant="secondary">{formatearPorcentaje(prediccion.confianza)} confianza</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{prediccion.periodo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold">
                          {prediccion.tipo === 'ingresos' ? formatCurrency(prediccion.prediccion) : 
                           prediccion.tipo === 'clientes' ? `${prediccion.prediccion} nuevos` :
                           formatearPorcentaje(prediccion.prediccion)}
                        </span>
                        {getTrendIcon(prediccion.tendencia)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Alertas y Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patronesDetectados.slice(0, 3).map((patron) => (
                    <div key={patron.id} className="flex items-start gap-3">
                      {getPatternIcon(patron.tipo)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={patron.tipo === 'oportunidad' ? 'default' : 
                                   patron.tipo === 'anomalia' ? 'destructive' : 'secondary'}
                          >
                            {patron.tipo}
                          </Badge>
                          <Badge variant="outline">
                            {formatearPorcentaje(patron.confianza)} confianza
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">{patron.descripcion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análisis de riesgo resumen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                Resumen de Riesgos por Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analisisRiesgo.slice(0, 3).map((riesgo) => (
                  <div key={riesgo.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{riesgo.nombreEmpresa}</h4>
                      <Badge className={getRiskColor(riesgo.nivelRiesgo)}>
                        {riesgo.nivelRiesgo}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">Puntuación:</span>
                      <span className="font-bold">{riesgo.puntuacion}/100</span>
                    </div>
                    <Progress value={riesgo.puntuacion} className="h-2 mb-2" />
                    <p className="text-xs text-gray-600">
                      {riesgo.alertas[0] || 'Sin alertas activas'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predicciones">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {predicciones.map((prediccion) => (
              <Card key={prediccion.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{prediccion.tipo.replace('_', ' ')}</span>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(prediccion.tendencia)}
                      <Badge variant="secondary">
                        {formatearPorcentaje(prediccion.confianza)} confianza
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>{prediccion.periodo}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">
                    {prediccion.tipo === 'ingresos' ? formatCurrency(prediccion.prediccion) :
                     prediccion.tipo === 'clientes' ? `${prediccion.prediccion} nuevos clientes` :
                     formatearPorcentaje(prediccion.prediccion)}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Factores Clave:</h4>
                      <ul className="space-y-1">
                        {prediccion.factores.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Recomendaciones:</h4>
                      <ul className="space-y-1">
                        {prediccion.recomendaciones.map((recomendacion, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <ArrowUpRight className="h-3 w-3 text-blue-500" />
                            {recomendacion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="riesgos">
          <div className="space-y-6">
            {analisisRiesgo.map((riesgo) => (
              <Card key={riesgo.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{riesgo.nombreEmpresa}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(riesgo.nivelRiesgo)}>
                        Riesgo {riesgo.nivelRiesgo}
                      </Badge>
                      <span className="text-2xl font-bold">{riesgo.puntuacion}/100</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Factores de Riesgo:</h4>
                      <div className="space-y-3">
                        {Object.entries(riesgo.factores).map(([factor, valor]) => (
                          <div key={factor}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize">{factor}</span>
                              <span>{formatearPorcentaje(valor)}</span>
                            </div>
                            <Progress value={valor * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          Alertas Activas:
                        </h4>
                        <ul className="space-y-1">
                          {riesgo.alertas.map((alerta, index) => (
                            <li key={index} className="text-sm text-red-600 flex items-center gap-2">
                              <XCircle className="h-3 w-3" />
                              {alerta}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-500" />
                          Recomendaciones:
                        </h4>
                        <ul className="space-y-1">
                          {riesgo.recomendaciones.map((recomendacion, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {recomendacion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patrones">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {patronesDetectados.map((patron) => (
              <Card key={patron.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPatternIcon(patron.tipo)}
                      <CardTitle className="text-lg capitalize">{patron.tipo}</CardTitle>
                    </div>
                    <Badge 
                      variant={patron.impacto === 'alto' ? 'default' : 
                              patron.impacto === 'medio' ? 'secondary' : 'outline'}
                    >
                      Impacto {patron.impacto}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{patron.descripcion}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confianza:</span>
                      <span className="font-medium">{formatearPorcentaje(patron.confianza)}</span>
                    </div>
                    <Progress value={patron.confianza * 100} className="h-2" />
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Detectado:</span>
                      <span>{patron.fechaDeteccion.toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metricas">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {metricas.map((metrica, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {metrica.nombre}
                    {getTrendIcon(metrica.tendencia)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">
                    {metrica.valor}{metrica.unidad}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-sm font-medium ${
                      metrica.cambio >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metrica.cambio >= 0 ? '+' : ''}{metrica.cambio}%
                    </span>
                    <span className="text-sm text-gray-500">vs período anterior</span>
                  </div>
                  
                  {metrica.objetivo && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Objetivo: {metrica.objetivo}{metrica.unidad}</span>
                        <span className="font-medium">
                          {Math.round((metrica.valor / metrica.objetivo) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min((metrica.valor / metrica.objetivo) * 100, 100)} 
                        className="h-3"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
