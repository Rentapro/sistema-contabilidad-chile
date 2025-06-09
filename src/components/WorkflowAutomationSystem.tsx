'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  name: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  trigger: string;
  steps: WorkflowStep[];
  company: string;
  createdAt: string;
  lastRun?: string;
  totalRuns: number;
  successRate: number;
  category: 'facturacion' | 'gastos' | 'reportes' | 'notificaciones' | 'backup' | 'custom';
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  workflow: Partial<Workflow>;
}

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'auto-invoice-approval',
    name: 'Aprobación Automática de Facturas',
    description: 'Aprueba automáticamente facturas bajo cierto monto y de proveedores confiables',
    category: 'Facturación',
    icon: '🤖',
    complexity: 'intermediate',
    estimatedTime: '15 min',
    workflow: {
      category: 'facturacion',
      trigger: 'invoice_received'
    }
  },
  {
    id: 'expense-categorization',
    name: 'Categorización Inteligente de Gastos',
    description: 'Categoriza automáticamente gastos usando IA basada en descripción y proveedor',
    category: 'Gastos',
    icon: '🧠',
    complexity: 'advanced',
    estimatedTime: '20 min',
    workflow: {
      category: 'gastos',
      trigger: 'expense_uploaded'
    }
  },
  {
    id: 'monthly-reports',
    name: 'Reportes Mensuales Automáticos',
    description: 'Genera y envía reportes financieros automáticamente cada mes',
    category: 'Reportes',
    icon: '📊',
    complexity: 'beginner',
    estimatedTime: '10 min',
    workflow: {
      category: 'reportes',
      trigger: 'monthly_schedule'
    }
  },
  {
    id: 'overdue-reminders',
    name: 'Recordatorios de Pagos Vencidos',
    description: 'Envía recordatorios automáticos a clientes con facturas vencidas',
    category: 'Notificaciones',
    icon: '⏰',
    complexity: 'intermediate',
    estimatedTime: '12 min',
    workflow: {
      category: 'notificaciones',
      trigger: 'invoice_overdue'
    }
  },
  {
    id: 'backup-validation',
    name: 'Validación de Respaldos',
    description: 'Verifica automáticamente la integridad de los respaldos diarios',
    category: 'Backup',
    icon: '🔍',
    complexity: 'advanced',
    estimatedTime: '25 min',
    workflow: {
      category: 'backup',
      trigger: 'backup_completed'
    }
  },
  {
    id: 'tax-preparation',
    name: 'Preparación Automática de Impuestos',
    description: 'Prepara automáticamente documentos para declaración de impuestos',
    category: 'Declaraciones',
    icon: '🏛️',
    complexity: 'advanced',
    estimatedTime: '30 min',
    workflow: {
      category: 'reportes',
      trigger: 'tax_period_start'
    }
  }
];

export default function WorkflowAutomationSystem() {
  const { usuario, empresaActual } = useAuth();
  const [activeTab, setActiveTab] = useState('workflows');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showWorkflowEditor, setShowWorkflowEditor] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Simulación de datos de workflows
  useEffect(() => {
    const mockWorkflows: Workflow[] = [
      {
        id: 'wf-001',
        name: 'Aprobación Automática de Facturas < $100k',
        description: 'Aprueba automáticamente facturas menores a $100,000 de proveedores verificados',
        status: 'active',
        trigger: 'invoice_received',
        steps: [],
        company: empresaActual?.id || 'default',
        createdAt: '2024-05-15',
        lastRun: '2024-06-08T10:30:00Z',
        totalRuns: 156,
        successRate: 98.7,
        category: 'facturacion'
      },
      {
        id: 'wf-002',
        name: 'Reportes Mensuales Automáticos',
        description: 'Genera y envía reportes financieros el primer día de cada mes',
        status: 'active',
        trigger: 'monthly_schedule',
        steps: [],
        company: empresaActual?.id || 'default',
        createdAt: '2024-04-20',
        lastRun: '2024-06-01T08:00:00Z',
        totalRuns: 2,
        successRate: 100,
        category: 'reportes'
      },
      {
        id: 'wf-003',
        name: 'Categorización IA de Gastos',
        description: 'Categoriza automáticamente gastos usando inteligencia artificial',
        status: 'draft',
        trigger: 'expense_uploaded',
        steps: [],
        company: empresaActual?.id || 'default',
        createdAt: '2024-06-07',
        totalRuns: 0,
        successRate: 0,
        category: 'gastos'
      }
    ];
    setWorkflows(mockWorkflows);
  }, [empresaActual]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'facturacion': return '📄';
      case 'gastos': return '💰';
      case 'reportes': return '📊';
      case 'notificaciones': return '🔔';
      case 'backup': return '💾';
      case 'custom': return '⚙️';
      default: return '📋';
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const workflowStats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    totalRuns: workflows.reduce((sum, w) => sum + w.totalRuns, 0),
    avgSuccessRate: workflows.length > 0 ? workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length : 0
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🤖 Sistema de Automatización</h1>
          <p className="text-gray-600 mt-2">
            Automatiza procesos contables y optimiza flujos de trabajo empresariales
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowTemplateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            📋 Usar Plantilla
          </Button>
          <Button
            onClick={() => setShowWorkflowEditor(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            ✨ Crear Workflow
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">{workflowStats.active}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ejecuciones</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.totalRuns.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.avgSuccessRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('workflows')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'workflows'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔧 Mis Workflows
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Plantillas
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Analytics
            </button>
          </nav>
        </div>

        {/* Workflows Tab */}
        {activeTab === 'workflows' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="🔍 Buscar workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">📂 Todas las categorías</option>
                <option value="facturacion">📄 Facturación</option>
                <option value="gastos">💰 Gastos</option>
                <option value="reportes">📊 Reportes</option>
                <option value="notificaciones">🔔 Notificaciones</option>
                <option value="backup">💾 Backup</option>
                <option value="custom">⚙️ Personalizado</option>
              </select>
            </div>

            {/* Workflows Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredWorkflows.map((workflow) => (
                <Card key={workflow.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getCategoryIcon(workflow.category)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{workflow.name}</h3>
                        <Badge className={`mt-1 ${getStatusColor(workflow.status)}`}>
                          {workflow.status === 'active' ? 'Activo' :
                           workflow.status === 'inactive' ? 'Inactivo' : 'Borrador'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{workflow.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ejecuciones:</span>
                      <span className="font-medium">{workflow.totalRuns.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tasa de éxito:</span>
                      <span className="font-medium text-green-600">{workflow.successRate}%</span>
                    </div>
                    {workflow.lastRun && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Última ejecución:</span>
                        <span className="font-medium">
                          {new Date(workflow.lastRun).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedWorkflow(workflow)}
                      className="flex-1"
                    >
                      👁️ Ver
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedWorkflow(workflow);
                        setShowWorkflowEditor(true);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      ✏️ Editar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {filteredWorkflows.length === 0 && (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🤖</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron workflows
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Prueba ajustando los filtros de búsqueda'
                    : 'Comienza creando tu primer workflow automatizado'}
                </p>
                <Button
                  onClick={() => setShowTemplateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  📋 Explorar Plantillas
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <span className="text-6xl mb-4 block">📋</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Plantillas de Automatización
              </h3>
              <p className="text-gray-600">
                Selecciona una plantilla predefinida para comenzar rápidamente
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflowTemplates.map((template) => (
                <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{template.icon}</span>
                    <Badge className={`
                      ${template.complexity === 'beginner' ? 'bg-green-100 text-green-800' :
                        template.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}
                    `}>
                      {template.complexity === 'beginner' ? 'Principiante' :
                       template.complexity === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>📂 {template.category}</span>
                    <span>⏱️ {template.estimatedTime}</span>
                  </div>

                  <Button
                    onClick={() => {
                      // Lógica para usar plantilla
                      console.log('Usando plantilla:', template.id);
                      setShowTemplateModal(false);
                      setShowWorkflowEditor(true);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    🚀 Usar Plantilla
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📊</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analytics de Automatización
              </h3>
              <p className="text-gray-600 mb-6">
                Próximamente: Métricas detalladas de rendimiento y optimización
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <Card className="p-4 text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm text-gray-600">Tiempo Ahorrado</div>
                  <div className="text-lg font-bold">240h/mes</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-sm text-gray-600">Costos Reducidos</div>
                  <div className="text-lg font-bold">$2.5M CLP</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm text-gray-600">Precisión</div>
                  <div className="text-lg font-bold">99.2%</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="text-sm text-gray-600">Productividad</div>
                  <div className="text-lg font-bold">+45%</div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </Tabs>

      {/* Workflow Editor Modal */}
      {showWorkflowEditor && (
        <Dialog open={showWorkflowEditor} onOpenChange={setShowWorkflowEditor}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    🛠️ Editor de Workflow
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setShowWorkflowEditor(false)}
                  >
                    ✕ Cerrar
                  </Button>
                </div>

                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🔧</span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Editor de Workflow Visual
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Próximamente: Editor visual drag-and-drop para crear workflows personalizados
                  </p>
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <span className="mr-3">🎯</span>
                      <span className="text-sm">Editor visual intuitivo</span>
                    </div>
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <span className="mr-3">🔗</span>
                      <span className="text-sm">Conectores de sistemas</span>
                    </div>
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <span className="mr-3">🤖</span>
                      <span className="text-sm">Integración con IA</span>
                    </div>
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="mr-3">📊</span>
                      <span className="text-sm">Monitoreo en tiempo real</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    📋 Seleccionar Plantilla
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateModal(false)}
                  >
                    ✕ Cerrar
                  </Button>
                </div>

                <div className="space-y-4">
                  {workflowTemplates.slice(0, 3).map((template) => (
                    <Card key={template.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start">
                        <span className="text-2xl mr-4">{template.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <Badge className={`
                              ${template.complexity === 'beginner' ? 'bg-green-100 text-green-800' :
                                template.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}
                            `}>
                              {template.complexity === 'beginner' ? 'Principiante' :
                               template.complexity === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">⏱️ {template.estimatedTime}</span>
                            <Button
                              size="sm"
                              onClick={() => {
                                setShowTemplateModal(false);
                                setShowWorkflowEditor(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              🚀 Usar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
