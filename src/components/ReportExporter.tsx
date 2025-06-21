'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'tax' | 'operational' | 'compliance';
  format: 'pdf' | 'excel' | 'csv' | 'word';
  complexity: 'basic' | 'advanced' | 'executive';
  estimatedTime: number; // en minutos
  requires: string[];
  icon: string;
}

interface ExportJob {
  id: string;
  reportName: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  estimatedCompletion?: string;
  downloadUrl?: string;
  format: string;
}

interface CustomizationOptions {
  dateRange: {
    start: string;
    end: string;
  };
  companies: string[];
  includeCharts: boolean;
  includeDetails: boolean;
  watermark: boolean;
  language: 'es' | 'en';
  format: 'pdf' | 'excel' | 'csv' | 'word';
}

export default function ReportExporter() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    dateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    companies: [],
    includeCharts: true,
    includeDetails: true,
    watermark: true,
    language: 'es',
    format: 'pdf'
  });
  const [activeTab, setActiveTab] = useState<'templates' | 'queue' | 'history'>('templates');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadReportData();
    const interval = setInterval(updateExportJobs, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const loadReportData = async () => {
    try {
      // Simulación de plantillas de reportes disponibles
      const mockTemplates: ReportTemplate[] = [
        {
          id: '1',
          name: 'Balance General Completo',
          description: 'Estado financiero detallado con análisis de activos, pasivos y patrimonio',
          category: 'financial',
          format: 'pdf',
          complexity: 'executive',
          estimatedTime: 8,
          requires: ['contabilidad', 'conciliacion'],
          icon: '📊'
        },
        {
          id: '2',
          name: 'Reporte F29 Automático',
          description: 'Formulario 29 con cálculos automáticos y validaciones SII',
          category: 'tax',
          format: 'pdf',
          complexity: 'advanced',
          estimatedTime: 5,
          requires: ['ventas', 'compras', 'iva'],
          icon: '🏛️'
        },
        {
          id: '3',
          name: 'Análisis de Flujo de Caja',
          description: 'Proyección de flujo de caja con análisis de tendencias',
          category: 'financial',
          format: 'excel',
          complexity: 'advanced',
          estimatedTime: 6,
          requires: ['contabilidad', 'presupuestos'],
          icon: '💰'
        },
        {
          id: '4',
          name: 'Reporte de Rentabilidad',
          description: 'Análisis detallado de rentabilidad por línea de negocio',
          category: 'operational',
          format: 'pdf',
          complexity: 'executive',
          estimatedTime: 10,
          requires: ['contabilidad', 'costos', 'ventas'],
          icon: '📈'
        },
        {
          id: '5',
          name: 'Libro Diario Digital',
          description: 'Libro diario con firmas digitales y trazabilidad completa',
          category: 'compliance',
          format: 'pdf',
          complexity: 'basic',
          estimatedTime: 3,
          requires: ['contabilidad'],
          icon: '📚'
        },
        {
          id: '6',
          name: 'Dashboard Ejecutivo',
          description: 'Resumen ejecutivo con KPIs principales y gráficos interactivos',
          category: 'operational',
          format: 'pdf',
          complexity: 'executive',
          estimatedTime: 7,
          requires: ['analytics', 'kpis'],
          icon: '🎯'
        },
        {
          id: '7',
          name: 'Reporte de Cumplimiento',
          description: 'Estado de cumplimiento regulatorio y tributario',
          category: 'compliance',
          format: 'word',
          complexity: 'advanced',
          estimatedTime: 12,
          requires: ['tributario', 'legal', 'auditoria'],
          icon: '✅'
        },
        {
          id: '8',
          name: 'Análisis de Proveedores',
          description: 'Evaluación detallada de proveedores con scoring de riesgo',
          category: 'operational',
          format: 'excel',
          complexity: 'advanced',
          estimatedTime: 4,
          requires: ['compras', 'pagos'],
          icon: '🤝'
        }
      ];

      const mockJobs: ExportJob[] = [
        {
          id: '1',
          reportName: 'Balance General Completo',
          status: 'processing',
          progress: 65,
          startTime: new Date(Date.now() - 300000).toLocaleString(),
          estimatedCompletion: new Date(Date.now() + 180000).toLocaleString(),
          format: 'pdf'
        },
        {
          id: '2',
          reportName: 'Reporte F29 Automático',
          status: 'completed',
          progress: 100,
          startTime: new Date(Date.now() - 900000).toLocaleString(),
          downloadUrl: '/downloads/f29-report.pdf',
          format: 'pdf'
        }
      ];

      setTemplates(mockTemplates);
      setExportJobs(mockJobs);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos de reportes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las plantillas de reportes",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const updateExportJobs = () => {
    setExportJobs(prevJobs => 
      prevJobs.map(job => {
        if (job.status === 'processing' && job.progress < 100) {
          return {
            ...job,
            progress: Math.min(job.progress + Math.random() * 10, 100),
            status: job.progress >= 95 ? 'completed' : 'processing',
            downloadUrl: job.progress >= 95 ? `/downloads/${job.reportName.toLowerCase().replace(/\s+/g, '-')}.${job.format}` : undefined
          };
        }
        return job;
      })
    );
  };

  const startExport = async () => {
    if (!selectedTemplate) return;

    const newJob: ExportJob = {
      id: Date.now().toString(),
      reportName: selectedTemplate.name,
      status: 'queued',
      progress: 0,
      startTime: new Date().toLocaleString(),
      format: customization.format
    };

    setExportJobs(prev => [newJob, ...prev]);
    setActiveTab('queue');

    toast({
      title: "Exportación Iniciada",
      description: `Generando "${selectedTemplate.name}" en formato ${customization.format.toUpperCase()}`,
    });

    // Simular inicio del proceso
    setTimeout(() => {
      setExportJobs(prev => 
        prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: 'processing', progress: 5 }
            : job
        )
      );
    }, 1000);
  };

  const downloadReport = (job: ExportJob) => {
    if (job.downloadUrl) {
      toast({
        title: "Descarga Iniciada",
        description: `Descargando ${job.reportName}...`,
      });
    }
  };

  const cancelExport = (jobId: string) => {
    setExportJobs(prev => prev.filter(job => job.id !== jobId));
    toast({
      title: "Exportación Cancelada",
      description: "El proceso de exportación ha sido cancelado",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'bg-blue-100 text-blue-800';
      case 'tax': return 'bg-red-100 text-red-800';
      case 'operational': return 'bg-green-100 text-green-800';
      case 'compliance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-yellow-100 text-yellow-800';
      case 'executive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-gray-100 text-gray-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📤 Exportador de Reportes</h1>
            <p className="mt-2 text-gray-600">
              Generación profesional de reportes con personalización avanzada
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={startExport}
              disabled={!selectedTemplate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              🚀 Generar Reporte
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'templates', label: 'Plantillas', icon: '📋' },
              { id: 'queue', label: 'Cola de Proceso', icon: '⏳' },
              { id: 'history', label: 'Historial', icon: '📚' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
                {tab.id === 'queue' && exportJobs.filter(j => j.status === 'processing' || j.status === 'queued').length > 0 && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {exportJobs.filter(j => j.status === 'processing' || j.status === 'queued').length}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Principal */}
        <div className="lg:col-span-2">
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{template.icon}</span>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <Badge className={getComplexityColor(template.complexity)}>
                        {template.complexity}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        ⏱️ ~{template.estimatedTime} min
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <strong>Requiere:</strong> {template.requires.join(', ')}
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {template.format.toUpperCase()}
                      </Badge>
                      {selectedTemplate?.id === template.id && (
                        <span className="text-blue-600 text-sm font-medium">
                          ✓ Seleccionado
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'queue' && (
            <div className="space-y-4">
              {exportJobs.filter(job => job.status === 'processing' || job.status === 'queued').length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📋</div>
                    <p className="text-gray-600">No hay reportes en proceso</p>
                  </CardContent>
                </Card>
              ) : (
                exportJobs
                  .filter(job => job.status === 'processing' || job.status === 'queued')
                  .map((job) => (
                    <Card key={job.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{job.reportName}</CardTitle>
                            <CardDescription>
                              Iniciado: {job.startTime}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(job.status)}>
                              {job.status === 'queued' ? 'En Cola' : 
                               job.status === 'processing' ? 'Procesando' : job.status}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => cancelExport(job.id)}
                            >
                              ❌ Cancelar
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progreso</span>
                            <span>{Math.round(job.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        {job.estimatedCompletion && (
                          <p className="text-sm text-gray-600">
                            ⏰ Finalización estimada: {job.estimatedCompletion}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {exportJobs.filter(job => job.status === 'completed' || job.status === 'failed').map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{job.reportName}</CardTitle>
                        <CardDescription>
                          Generado: {job.startTime}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(job.status)}>
                          {job.status === 'completed' ? 'Completado' : 'Falló'}
                        </Badge>
                        <Badge variant="outline">
                          {job.format.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {job.status === 'completed' && job.downloadUrl && (
                      <Button 
                        onClick={() => downloadReport(job)}
                        className="w-full"
                      >
                        📥 Descargar Reporte
                      </Button>
                    )}
                    {job.status === 'failed' && (
                      <div className="text-red-600 text-sm">
                        ❌ Error en la generación del reporte
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Panel de Personalización */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>⚙️ Personalización</CardTitle>
              <CardDescription>
                Configura los parámetros del reporte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTemplate && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{selectedTemplate.icon}</span>
                    <span className="font-medium text-blue-900">
                      {selectedTemplate.name}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">
                    {selectedTemplate.description}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato de Salida
                </label>
                <Select 
                  value={customization.format} 
                  onValueChange={(value: any) => 
                    setCustomization(prev => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">📄 PDF</SelectItem>
                    <SelectItem value="excel">📊 Excel</SelectItem>
                    <SelectItem value="csv">📈 CSV</SelectItem>
                    <SelectItem value="word">📝 Word</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de Fechas
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <input
                    type="date"
                    value={customization.dateRange.start}
                    onChange={(e) => setCustomization(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="date"
                    value={customization.dateRange.end}
                    onChange={(e) => setCustomization(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="charts"
                    checked={customization.includeCharts}
                    onCheckedChange={(checked) => 
                      setCustomization(prev => ({ ...prev, includeCharts: checked as boolean }))
                    }
                  />
                  <label htmlFor="charts" className="text-sm font-medium">
                    Incluir Gráficos
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="details"
                    checked={customization.includeDetails}
                    onCheckedChange={(checked) => 
                      setCustomization(prev => ({ ...prev, includeDetails: checked as boolean }))
                    }
                  />
                  <label htmlFor="details" className="text-sm font-medium">
                    Incluir Detalles
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="watermark"
                    checked={customization.watermark}
                    onCheckedChange={(checked) => 
                      setCustomization(prev => ({ ...prev, watermark: checked as boolean }))
                    }
                  />
                  <label htmlFor="watermark" className="text-sm font-medium">
                    Marca de Agua
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma
                </label>
                <Select 
                  value={customization.language} 
                  onValueChange={(value: any) => 
                    setCustomization(prev => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">🇨🇱 Español</SelectItem>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
