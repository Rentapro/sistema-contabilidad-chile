'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  FileBarChart, 
  Calendar,
  Filter,
  Settings,
  Printer,
  Mail,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'financiero' | 'operativo' | 'analytics' | 'auditoria';
  formatos: ('pdf' | 'excel' | 'csv')[];
  parametros: string[];
  estimatedTime: string;
  icon: React.ReactNode;
}

interface ExportJob {
  id: string;
  reporte: string;
  formato: string;
  estado: 'generando' | 'completado' | 'error';
  progreso: number;
  fechaCreacion: Date;
  fechaCompletado?: Date;
  archivo?: string;
}

export default function AdvancedReportExporter() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState<string>('');
  const [formatoSeleccionado, setFormatoSeleccionado] = useState<string>('pdf');
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [filtros, setFiltros] = useState({
    empresa: '',
    usuario: '',
    estado: '',
    incluirAnexos: true,
    incluirGraficos: true,
    incluirResumen: true
  });
  const [trabajosExportacion, setTrabajosExportacion] = useState<ExportJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const plantillasReporte: ReportTemplate[] = [
    {
      id: 'balance-general',
      nombre: 'Balance General',
      descripcion: 'Estado de situación financiera completo',
      tipo: 'financiero',
      formatos: ['pdf', 'excel'],
      parametros: ['fecha_corte', 'nivel_detalle', 'comparativo'],
      estimatedTime: '2-3 min',
      icon: <FileBarChart className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'estado-resultados',
      nombre: 'Estado de Resultados',
      descripcion: 'Ingresos, gastos y utilidades del período',
      tipo: 'financiero',
      formatos: ['pdf', 'excel', 'csv'],
      parametros: ['periodo', 'agrupacion', 'comparativo'],
      estimatedTime: '1-2 min',
      icon: <FileText className="w-5 h-5 text-green-600" />
    },
    {
      id: 'flujo-caja',
      nombre: 'Flujo de Caja',
      descripcion: 'Movimientos de efectivo del período',
      tipo: 'financiero',
      formatos: ['pdf', 'excel'],
      parametros: ['periodo', 'metodo', 'proyeccion'],
      estimatedTime: '2-4 min',
      icon: <FileSpreadsheet className="w-5 h-5 text-purple-600" />
    },
    {
      id: 'libro-ventas',
      nombre: 'Libro de Ventas',
      descripcion: 'Registro detallado de facturas emitidas',
      tipo: 'operativo',
      formatos: ['pdf', 'excel', 'csv'],
      parametros: ['periodo', 'tipo_documento', 'estado'],
      estimatedTime: '3-5 min',
      icon: <FileText className="w-5 h-5 text-orange-600" />
    },
    {
      id: 'analytics-empresas',
      nombre: 'Analytics de Empresas',
      descripcion: 'Métricas y KPIs de rendimiento empresarial',
      tipo: 'analytics',
      formatos: ['pdf', 'excel'],
      parametros: ['metricas', 'comparativo', 'tendencias'],
      estimatedTime: '5-7 min',
      icon: <FileBarChart className="w-5 h-5 text-indigo-600" />
    },
    {
      id: 'auditoria-sistema',
      nombre: 'Auditoría del Sistema',
      descripcion: 'Logs de actividad y seguridad',
      tipo: 'auditoria',
      formatos: ['pdf', 'excel'],
      parametros: ['tipo_evento', 'usuario', 'nivel_detalle'],
      estimatedTime: '10-15 min',
      icon: <FileText className="w-5 h-5 text-red-600" />
    }
  ];

  const generarReporte = async () => {
    if (!reporteSeleccionado) return;

    setIsGenerating(true);
    
    const nuevoTrabajo: ExportJob = {
      id: `job_${Date.now()}`,
      reporte: plantillasReporte.find(p => p.id === reporteSeleccionado)?.nombre || '',
      formato: formatoSeleccionado.toUpperCase(),
      estado: 'generando',
      progreso: 0,
      fechaCreacion: new Date()
    };

    setTrabajosExportacion(prev => [nuevoTrabajo, ...prev]);

    // Simular progreso de generación
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setTrabajosExportacion(prev => 
        prev.map(job => 
          job.id === nuevoTrabajo.id 
            ? { ...job, progreso: i }
            : job
        )
      );
    }

    // Completar trabajo
    setTrabajosExportacion(prev => 
      prev.map(job => 
        job.id === nuevoTrabajo.id 
          ? { 
              ...job, 
              estado: 'completado',
              fechaCompletado: new Date(),
              archivo: `${reporteSeleccionado}_${new Date().toISOString().split('T')[0]}.${formatoSeleccionado}`
            }
          : job
      )
    );

    setIsGenerating(false);
  };

  const descargarArchivo = (trabajo: ExportJob) => {
    if (trabajo.archivo) {
      const link = document.createElement('a');
      link.href = '#';
      link.download = trabajo.archivo;
      link.click();
    }
  };

  const enviarPorEmail = (trabajo: ExportJob) => {
    // Simular envío por email
    alert(`Reporte "${trabajo.reporte}" enviado por email exitosamente`);
  };

  const previsualizarReporte = (trabajo: ExportJob) => {
    // Simular previsualización
    alert(`Abriendo previsualización de "${trabajo.reporte}"`);
  };

  const getEstadoBadge = (estado: ExportJob['estado']) => {
    const configs = {
      generando: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-3 h-3" /> },
      completado: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
      error: { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-3 h-3" /> }
    };

    const config = configs[estado];
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {estado === 'generando' ? 'Generando' : estado === 'completado' ? 'Completado' : 'Error'}
      </Badge>
    );
  };

  const plantillaActual = plantillasReporte.find(p => p.id === reporteSeleccionado);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Download className="w-7 h-7 text-blue-600" />
          Exportador de Reportes Avanzado
        </h2>
        <p className="text-gray-600 mt-1">
          Genera y personaliza reportes detallados en múltiples formatos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Configuración */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selección de Plantilla */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Seleccionar Reporte
              </CardTitle>
              <CardDescription>
                Elige el tipo de reporte que deseas generar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plantillasReporte.map((plantilla) => (
                  <div
                    key={plantilla.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      reporteSeleccionado === plantilla.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setReporteSeleccionado(plantilla.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {plantilla.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {plantilla.nombre}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {plantilla.descripcion}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {plantilla.tipo}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            ⏱️ {plantilla.estimatedTime}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {plantilla.formatos.map((formato) => (
                            <Badge key={formato} variant="outline" className="text-xs">
                              {formato.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Parámetros */}
          {plantillaActual && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración
                </CardTitle>
                <CardDescription>
                  Personaliza los parámetros del reporte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Formato */}
                <div className="space-y-2">
                  <Label>Formato de Exportación</Label>
                  <Select value={formatoSeleccionado} onValueChange={setFormatoSeleccionado}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {plantillaActual.formatos.map((formato) => (
                        <SelectItem key={formato} value={formato}>
                          {formato.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Período */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha Inicio</Label>
                    <DatePicker
                      date={fechaInicio}
                      onDateChange={setFechaInicio}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha Fin</Label>
                    <DatePicker
                      date={fechaFin}
                      onDateChange={setFechaFin}
                    />
                  </div>
                </div>

                {/* Filtros */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filtros Adicionales
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Empresa</Label>
                      <Select value={filtros.empresa} onValueChange={(value) => setFiltros(prev => ({ ...prev, empresa: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas las empresas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todas las empresas</SelectItem>
                          <SelectItem value="empresa1">TechSoft Chile</SelectItem>
                          <SelectItem value="empresa2">Comercial Andina</SelectItem>
                          <SelectItem value="empresa3">PyME Básica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Usuario</Label>
                      <Select value={filtros.usuario} onValueChange={(value) => setFiltros(prev => ({ ...prev, usuario: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los usuarios" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos los usuarios</SelectItem>
                          <SelectItem value="admin">Administradores</SelectItem>
                          <SelectItem value="contador">Contadores</SelectItem>
                          <SelectItem value="cliente">Clientes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="incluir-anexos"
                        checked={filtros.incluirAnexos}
                        onCheckedChange={(checked) => setFiltros(prev => ({ ...prev, incluirAnexos: checked as boolean }))}
                      />
                      <Label htmlFor="incluir-anexos">Incluir anexos y documentos</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="incluir-graficos"
                        checked={filtros.incluirGraficos}
                        onCheckedChange={(checked) => setFiltros(prev => ({ ...prev, incluirGraficos: checked as boolean }))}
                      />
                      <Label htmlFor="incluir-graficos">Incluir gráficos y visualizaciones</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="incluir-resumen"
                        checked={filtros.incluirResumen}
                        onCheckedChange={(checked) => setFiltros(prev => ({ ...prev, incluirResumen: checked as boolean }))}
                      />
                      <Label htmlFor="incluir-resumen">Incluir resumen ejecutivo</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={generarReporte}
                    disabled={!reporteSeleccionado || isGenerating}
                    className="w-full md:w-auto"
                  >
                    {isGenerating ? 'Generando...' : 'Generar Reporte'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel de Trabajos */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Trabajos de Exportación
              </CardTitle>
              <CardDescription>
                Estado de los reportes generados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trabajosExportacion.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No hay trabajos de exportación</p>
                  </div>
                ) : (
                  trabajosExportacion.map((trabajo) => (
                    <div key={trabajo.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{trabajo.reporte}</h4>
                          <p className="text-xs text-gray-600">
                            {trabajo.fechaCreacion.toLocaleTimeString('es-CL')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {trabajo.formato}
                          </Badge>
                          {getEstadoBadge(trabajo.estado)}
                        </div>
                      </div>

                      {trabajo.estado === 'generando' && (
                        <div>
                          <Progress value={trabajo.progreso} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            {trabajo.progreso}% completado
                          </p>
                        </div>
                      )}

                      {trabajo.estado === 'completado' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => previsualizarReporte(trabajo)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => descargarArchivo(trabajo)}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Descargar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => enviarPorEmail(trabajo)}
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
