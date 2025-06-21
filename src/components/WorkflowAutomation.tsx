'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Zap, Play, Pause, Settings, BarChart3, Clock, CheckCircle, 
  AlertTriangle, Users, FileText, DollarSign, Calendar, Bot,
  ArrowRight, RefreshCw, Target, Workflow, Filter, Search,
  Edit, Trash2, Copy, Download, Upload
} from 'lucide-react';

interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'schedule' | 'event' | 'condition';
    config: any;
  };
  actions: Array<{
    type: string;
    config: any;
  }>;
  status: 'active' | 'paused' | 'draft';
  priority: 'low' | 'medium' | 'high';
  lastRun?: Date;
  nextRun?: Date;
  successRate: number;
  executionCount: number;
  category: 'facturacion' | 'tributario' | 'clientes' | 'reportes' | 'sistema';
}

interface AutomationTask {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  progress: number;
  steps: Array<{
    name: string;
    status: 'pending' | 'running' | 'success' | 'failed';
    duration?: number;
    result?: any;
  }>;
  logs: Array<{
    timestamp: Date;
    level: 'info' | 'warning' | 'error';
    message: string;
  }>;
}

export default function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [activeTasks, setActiveTasks] = useState<AutomationTask[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowRule | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos simulados para workflows
  useEffect(() => {
    const mockWorkflows: WorkflowRule[] = [
      {
        id: '1',
        name: 'Procesamiento Automático de Facturas',
        description: 'Procesa automáticamente las facturas recibidas, extrae datos y actualiza el sistema',
        trigger: {
          type: 'event',
          config: { event: 'factura_recibida' }
        },
        actions: [
          { type: 'extract_data', config: { useOCR: true } },
          { type: 'validate_data', config: { strictMode: true } },
          { type: 'update_system', config: { notify: true } }
        ],
        status: 'active',
        priority: 'high',
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 30 * 60 * 1000),
        successRate: 94.5,
        executionCount: 1247,
        category: 'facturacion'
      },
      {
        id: '2',
        name: 'Generación Automática F29',
        description: 'Genera formularios F29 automáticamente basado en las transacciones del mes',
        trigger: {
          type: 'schedule',
          config: { cron: '0 9 25 * *', description: 'Día 25 de cada mes a las 9:00' }
        },
        actions: [
          { type: 'collect_data', config: { period: 'current_month' } },
          { type: 'generate_f29', config: { template: 'standard' } },
          { type: 'send_notification', config: { email: true, push: true } }
        ],
        status: 'active',
        priority: 'high',
        lastRun: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        nextRun: new Date('2025-04-25T09:00:00'),
        successRate: 98.2,
        executionCount: 36,
        category: 'tributario'
      },
      {
        id: '3',
        name: 'Recordatorios de Pagos Pendientes',
        description: 'Envía recordatorios automáticos a clientes con facturas vencidas',
        trigger: {
          type: 'schedule',
          config: { cron: '0 10 * * 1', description: 'Lunes a las 10:00' }
        },
        actions: [
          { type: 'check_overdue', config: { days: 30 } },
          { type: 'send_reminder', config: { template: 'polite', channel: 'email' } },
          { type: 'log_action', config: { category: 'customer_communication' } }
        ],
        status: 'active',
        priority: 'medium',
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        successRate: 89.7,
        executionCount: 156,
        category: 'clientes'
      },
      {
        id: '4',
        name: 'Backup Automático Nocturno',
        description: 'Realiza respaldo completo de la base de datos y documentos importantes',
        trigger: {
          type: 'schedule',
          config: { cron: '0 2 * * *', description: 'Diariamente a las 2:00 AM' }
        },
        actions: [
          { type: 'backup_database', config: { compression: true } },
          { type: 'backup_files', config: { includeDocuments: true } },
          { type: 'verify_backup', config: { checksum: true } },
          { type: 'cleanup_old', config: { retentionDays: 30 } }
        ],
        status: 'active',
        priority: 'medium',
        lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 18 * 60 * 60 * 1000),
        successRate: 99.1,
        executionCount: 890,
        category: 'sistema'
      },
      {
        id: '5',
        name: 'Clasificación Inteligente de Gastos',
        description: 'Clasifica automáticamente los gastos usando IA basándose en patrones históricos',
        trigger: {
          type: 'event',
          config: { event: 'gasto_creado' }
        },
        actions: [
          { type: 'analyze_expense', config: { useAI: true } },
          { type: 'categorize_expense', config: { confidence_threshold: 0.85 } },
          { type: 'flag_anomalies', config: { notify_admin: true } }
        ],
        status: 'active',
        priority: 'low',
        lastRun: new Date(Date.now() - 45 * 60 * 1000),
        nextRun: undefined,
        successRate: 92.3,
        executionCount: 2847,
        category: 'sistema'
      },
      {
        id: '6',
        name: 'Generación de Reportes Mensuales',
        description: 'Genera y envía reportes financieros mensuales automáticamente',
        trigger: {
          type: 'schedule',
          config: { cron: '0 8 1 * *', description: 'Primer día del mes a las 8:00' }
        },
        actions: [
          { type: 'generate_report', config: { type: 'monthly_financial' } },
          { type: 'create_pdf', config: { template: 'executive' } },
          { type: 'send_email', config: { recipients: 'stakeholders' } }
        ],
        status: 'paused',
        priority: 'medium',
        lastRun: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        nextRun: new Date('2025-05-01T08:00:00'),
        successRate: 95.8,
        executionCount: 12,
        category: 'reportes'
      }
    ];

    // Generar tareas activas simuladas
    const mockTasks: AutomationTask[] = [
      {
        id: 'task-1',
        workflowId: '1',
        workflowName: 'Procesamiento Automático de Facturas',
        status: 'running',
        startTime: new Date(Date.now() - 2 * 60 * 1000),
        progress: 65,
        steps: [
          { name: 'Extraer datos de factura', status: 'success', duration: 15 },
          { name: 'Validar información', status: 'success', duration: 8 },
          { name: 'Actualizar sistema', status: 'running' },
          { name: 'Enviar notificación', status: 'pending' }
        ],
        logs: [
          { timestamp: new Date(Date.now() - 2 * 60 * 1000), level: 'info', message: 'Iniciando procesamiento de factura FAC-001234' },
          { timestamp: new Date(Date.now() - 90 * 1000), level: 'info', message: 'Datos extraídos exitosamente usando OCR' },
          { timestamp: new Date(Date.now() - 45 * 1000), level: 'info', message: 'Validación completada sin errores' },
          { timestamp: new Date(Date.now() - 10 * 1000), level: 'info', message: 'Actualizando registro en base de datos...' }
        ]
      },
      {
        id: 'task-2',
        workflowId: '4',
        workflowName: 'Backup Automático Nocturno',
        status: 'success',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 90 * 60 * 1000),
        progress: 100,
        steps: [
          { name: 'Backup base de datos', status: 'success', duration: 1200 },
          { name: 'Backup archivos', status: 'success', duration: 2100 },
          { name: 'Verificar backup', status: 'success', duration: 300 },
          { name: 'Limpiar archivos antiguos', status: 'success', duration: 150 }
        ],
        logs: [
          { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), level: 'info', message: 'Iniciando backup nocturno' },
          { timestamp: new Date(Date.now() - 110 * 60 * 1000), level: 'info', message: 'Backup completado exitosamente' },
          { timestamp: new Date(Date.now() - 90 * 60 * 1000), level: 'info', message: 'Verificación completada - Backup válido' }
        ]
      }
    ];

    setWorkflows(mockWorkflows);
    setActiveTasks(mockTasks);
  }, []);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'paused': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'facturacion': return <FileText className="w-4 h-4" />;
      case 'tributario': return <Calculator className="w-4 h-4" />;
      case 'clientes': return <Users className="w-4 h-4" />;
      case 'reportes': return <BarChart3 className="w-4 h-4" />;
      case 'sistema': return <Settings className="w-4 h-4" />;
      default: return <Workflow className="w-4 h-4" />;
    }
  };

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' }
        : workflow
    ));
  };

  const runWorkflowNow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    const newTask: AutomationTask = {
      id: `task-${Date.now()}`,
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: 'running',
      startTime: new Date(),
      progress: 0,
      steps: workflow.actions.map(action => ({
        name: action.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        status: 'pending'
      })),
      logs: [
        { timestamp: new Date(), level: 'info', message: `Ejecución manual iniciada para: ${workflow.name}` }
      ]
    };

    setActiveTasks(prev => [newTask, ...prev]);

    // Simular progreso
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setActiveTasks(prev => prev.map(task => 
          task.id === newTask.id 
            ? { 
                ...task, 
                status: 'success', 
                progress: 100,
                endTime: new Date(),
                logs: [...task.logs, 
                  { timestamp: new Date(), level: 'info', message: 'Ejecución completada exitosamente' }
                ]
              }
            : task
        ));
      } else {
        setActiveTasks(prev => prev.map(task => 
          task.id === newTask.id ? { ...task, progress } : task
        ));
      }
    }, 1000);
  };

  const filteredWorkflows = workflows.filter(workflow => {
    if (filterCategory !== 'all' && workflow.category !== filterCategory) return false;
    if (searchTerm && !workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !workflow.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.status === 'active').length,
    runningTasks: activeTasks.filter(t => t.status === 'running').length,
    successfulExecutions: workflows.reduce((sum, w) => sum + w.executionCount, 0),
    averageSuccessRate: workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bot className="w-8 h-8 text-purple-600" />
            Automatización de Workflows
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona y monitorea procesos automatizados del sistema
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Importar Workflow
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Crear Nuevo
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Workflow className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalWorkflows}</div>
                <div className="text-sm text-gray-600">Total Workflows</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.activeWorkflows}</div>
                <div className="text-sm text-gray-600">Activos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <RefreshCw className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.runningTasks}</div>
                <div className="text-sm text-gray-600">Ejecutándose</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.successfulExecutions.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Ejecuciones</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.averageSuccessRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Éxito Promedio</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Workflows ({workflows.length})</TabsTrigger>
          <TabsTrigger value="tasks">Tareas Activas ({activeTasks.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Lista de Workflows */}
        <TabsContent value="workflows">
          {/* Filtros y Búsqueda */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Buscar workflows..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border rounded px-3 py-2 w-64"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="border rounded px-3 py-2"
                    >
                      <option value="all">Todas las categorías</option>
                      <option value="facturacion">Facturación</option>
                      <option value="tributario">Tributario</option>
                      <option value="clientes">Clientes</option>
                      <option value="reportes">Reportes</option>
                      <option value="sistema">Sistema</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    Lista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflows Grid/List */}
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {filteredWorkflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getCategoryIcon(workflow.category)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {workflow.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Estadísticas del Workflow */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Éxito</div>
                        <div className="font-semibold">{workflow.successRate}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Ejecuciones</div>
                        <div className="font-semibold">{workflow.executionCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Categoría</div>
                        <div className="font-semibold capitalize">{workflow.category}</div>
                      </div>
                    </div>

                    {/* Información de Ejecución */}
                    <div className="text-xs text-gray-500 space-y-1">
                      {workflow.lastRun && (
                        <div>Última ejecución: {workflow.lastRun.toLocaleString('es-CL')}</div>
                      )}
                      {workflow.nextRun && (
                        <div>Próxima ejecución: {workflow.nextRun.toLocaleString('es-CL')}</div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={workflow.status === 'active'}
                          onCheckedChange={() => toggleWorkflowStatus(workflow.id)}
                        />
                        <span className="text-sm">{workflow.status === 'active' ? 'Activo' : 'Pausado'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => runWorkflowNow(workflow.id)}
                          disabled={workflow.status !== 'active'}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tareas Activas */}
        <TabsContent value="tasks">
          <div className="space-y-4">
            {activeTasks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay tareas ejecutándose
                  </h3>
                  <p className="text-gray-500">
                    Las tareas aparecerán aquí cuando se ejecuten workflows automáticamente.
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeTasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{task.workflowName}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Iniciado: {task.startTime.toLocaleString('es-CL')}
                          {task.endTime && ` • Finalizado: ${task.endTime.toLocaleString('es-CL')}`}
                        </p>
                      </div>
                      
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progreso */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progreso</span>
                          <span className="text-sm text-gray-600">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} />
                      </div>

                      {/* Pasos */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">Pasos de Ejecución</h4>
                        <div className="space-y-2">
                          {task.steps.map((step, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                step.status === 'success' ? 'bg-green-500' :
                                step.status === 'running' ? 'bg-blue-500 animate-pulse' :
                                step.status === 'failed' ? 'bg-red-500' :
                                'bg-gray-300'
                              }`}></div>
                              <span className="text-sm flex-1">{step.name}</span>
                              {step.duration && (
                                <span className="text-xs text-gray-500">
                                  {formatDuration(step.duration)}
                                </span>
                              )}
                              <div className={`text-xs px-2 py-1 rounded ${getStatusColor(step.status)}`}>
                                {step.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Logs Recientes */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">Logs Recientes</h4>
                        <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono space-y-1 max-h-32 overflow-y-auto">
                          {task.logs.slice(-5).map((log, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className="text-gray-500 whitespace-nowrap">
                                {log.timestamp.toLocaleTimeString('es-CL')}
                              </span>
                              <span className={`font-medium ${
                                log.level === 'error' ? 'text-red-600' :
                                log.level === 'warning' ? 'text-yellow-600' :
                                'text-gray-700'
                              }`}>
                                [{log.level.toUpperCase()}]
                              </span>
                              <span className="text-gray-700">{log.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Ejecuciones */}
            <Card>
              <CardHeader>
                <CardTitle>Ejecuciones por Día</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => {
                    const value = Math.floor(Math.random() * 50) + 10;
                    return (
                      <div key={day} className="flex items-center gap-3">
                        <span className="text-sm w-8">{day}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full" 
                            style={{ width: `${(value / 60) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm w-8 text-right">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Workflows */}
            <Card>
              <CardHeader>
                <CardTitle>Workflows Más Utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows
                    .sort((a, b) => b.executionCount - a.executionCount)
                    .slice(0, 5)
                    .map((workflow, index) => (
                      <div key={workflow.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{workflow.name}</div>
                          <div className="text-xs text-gray-500">{workflow.executionCount} ejecuciones</div>
                        </div>
                        <div className="text-sm text-gray-600">{workflow.successRate}%</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente adicional para el icono de Calculator
function Calculator({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <line x1="8" y1="6" x2="16" y2="6"/>
      <line x1="8" y1="10" x2="16" y2="10"/>
      <line x1="8" y1="14" x2="16" y2="14"/>
      <line x1="8" y1="18" x2="16" y2="18"/>
    </svg>
  );
}
