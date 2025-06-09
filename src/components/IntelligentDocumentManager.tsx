'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface Document {
  id: string;
  name: string;
  type: 'factura' | 'boleta' | 'recibo' | 'contrato' | 'estado_cuenta' | 'otro';
  status: 'processing' | 'completed' | 'error' | 'pending_review';
  uploadDate: string;
  size: number;
  extractedData?: any;
  confidence: number;
  category: string;
  tags: string[];
  aiAnalysis?: {
    summary: string;
    keyFields: any;
    riskFlags: string[];
    suggestions: string[];
  };
  ocrText?: string;
  thumbnail?: string;
}

interface DocumentAnalytics {
  totalDocuments: number;
  processedToday: number;
  accuracyRate: number;
  timesSaved: number;
  categoryDistribution: { [key: string]: number };
  monthlyTrends: { month: string; count: number }[];
}

export default function IntelligentDocumentManager() {
  const { usuario, empresaActual } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulación de datos de documentos
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: 'doc-001',
        name: 'Factura_Proveedor_ABC_2024.pdf',
        type: 'factura',
        status: 'completed',
        uploadDate: '2024-06-08T09:30:00Z',
        size: 245760,
        confidence: 95.8,
        category: 'Gastos Operacionales',
        tags: ['proveedor-abc', 'servicios', 'mensual'],
        extractedData: {
          rut: '12.345.678-9',
          razonSocial: 'Proveedor ABC Ltda.',
          monto: 150000,
          iva: 28500,
          total: 178500,
          fechaEmision: '2024-06-01',
          fechaVencimiento: '2024-07-01'
        },
        aiAnalysis: {
          summary: 'Factura mensual de servicios de proveedor habitual con montos dentro del rango esperado.',
          keyFields: { tipo: 'Factura de servicios', criticidad: 'Baja' },
          riskFlags: [],
          suggestions: ['Categorizar como gasto operacional', 'Aprobar automáticamente']
        },
        ocrText: 'FACTURA ELECTRÓNICA N° 12345...'
      },
      {
        id: 'doc-002',
        name: 'Estado_Cuenta_Banco_Mayo_2024.pdf',
        type: 'estado_cuenta',
        status: 'completed',
        uploadDate: '2024-06-07T14:15:00Z',
        size: 1024000,
        confidence: 98.2,
        category: 'Estados Financieros',
        tags: ['banco', 'mayo-2024', 'conciliacion'],
        extractedData: {
          banco: 'Banco de Chile',
          cuenta: '****1234',
          periodo: 'Mayo 2024',
          saldoInicial: 5000000,
          saldoFinal: 4750000,
          totalIngresos: 2500000,
          totalEgresos: 2750000
        },
        aiAnalysis: {
          summary: 'Estado de cuenta con movimientos normales. Se detectaron 3 transacciones grandes.',
          keyFields: { tipo: 'Estado de cuenta bancario', criticidad: 'Media' },
          riskFlags: ['Egreso inusual de $500,000'],
          suggestions: ['Revisar egreso grande', 'Conciliar con registros internos']
        }
      },
      {
        id: 'doc-003',
        name: 'Recibo_Honorarios_Consultor_XYZ.pdf',
        type: 'recibo',
        status: 'pending_review',
        uploadDate: '2024-06-08T11:45:00Z',
        size: 189440,
        confidence: 87.3,
        category: 'Honorarios',
        tags: ['consultor', 'honorarios', 'pendiente'],
        extractedData: {
          receptor: 'Juan Pérez',
          rut: '11.111.111-1',
          monto: 800000,
          retencion: 104000,
          liquido: 696000,
          periodo: 'Mayo 2024'
        },
        aiAnalysis: {
          summary: 'Recibo de honorarios con monto superior al promedio mensual.',
          keyFields: { tipo: 'Boleta de honorarios', criticidad: 'Alta' },
          riskFlags: ['Monto 25% superior al promedio', 'RUT no verificado'],
          suggestions: ['Verificar RUT del receptor', 'Confirmar autorización del gasto']
        }
      },
      {
        id: 'doc-004',
        name: 'Factura_Electricidad_Abril_2024.pdf',
        type: 'factura',
        status: 'processing',
        uploadDate: '2024-06-08T12:00:00Z',
        size: 156789,
        confidence: 0,
        category: 'Servicios Básicos',
        tags: ['electricidad', 'servicios-basicos']
      }
    ];
    setDocuments(mockDocuments);
  }, []);

  const analytics: DocumentAnalytics = {
    totalDocuments: documents.length,
    processedToday: documents.filter(d => 
      new Date(d.uploadDate).toDateString() === new Date().toDateString()
    ).length,
    accuracyRate: documents.filter(d => d.confidence > 0).length > 0 
      ? documents.filter(d => d.confidence > 0).reduce((sum, d) => sum + d.confidence, 0) / documents.filter(d => d.confidence > 0).length 
      : 0,
    timesSaved: 48.5, // horas ahorradas este mes
    categoryDistribution: {
      'Gastos Operacionales': 35,
      'Honorarios': 20,
      'Servicios Básicos': 15,
      'Estados Financieros': 12,
      'Otros': 18
    },
    monthlyTrends: [
      { month: 'Ene', count: 145 },
      { month: 'Feb', count: 132 },
      { month: 'Mar', count: 158 },
      { month: 'Abr', count: 167 },
      { month: 'May', count: 189 },
      { month: 'Jun', count: 94 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'factura': return '📄';
      case 'boleta': return '🧾';
      case 'recibo': return '📋';
      case 'contrato': return '📑';
      case 'estado_cuenta': return '🏦';
      default: return '📄';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulación de carga de archivo
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          // Aquí agregarías el documento procesado a la lista
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🤖 Gestión Inteligente de Documentos</h1>
          <p className="text-gray-600 mt-2">
            Procesamiento automático con IA para documentos contables y financieros
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isUploading}
          >
            {isUploading ? '📤 Procesando...' : '📤 Subir Documentos'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Procesando con IA...</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Documentos</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalDocuments}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Procesados Hoy</p>
              <p className="text-2xl font-bold text-green-600">{analytics.processedToday}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Precisión IA</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.accuracyRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tiempo Ahorrado</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.timesSaved}h</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📄 Documentos
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
            <button
              onClick={() => setActiveTab('ai-config')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ai-config'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🤖 Configuración IA
            </button>
          </nav>
        </div>

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="🔍 Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">📂 Todos los tipos</option>
                <option value="factura">📄 Facturas</option>
                <option value="boleta">🧾 Boletas</option>
                <option value="recibo">📋 Recibos</option>
                <option value="contrato">📑 Contratos</option>
                <option value="estado_cuenta">🏦 Estados de Cuenta</option>
                <option value="otro">📄 Otros</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">🔄 Todos los estados</option>
                <option value="completed">✅ Completado</option>
                <option value="processing">🔄 Procesando</option>
                <option value="pending_review">⏳ Pendiente Revisión</option>
                <option value="error">❌ Error</option>
              </select>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedDocument(doc)}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getTypeIcon(doc.type)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{doc.name}</h3>
                        <Badge className={`mt-1 text-xs ${getStatusColor(doc.status)}`}>
                          {doc.status === 'completed' ? 'Completado' :
                           doc.status === 'processing' ? 'Procesando' :
                           doc.status === 'pending_review' ? 'Pendiente' : 'Error'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Categoría:</span>
                      <span className="font-medium">{doc.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tamaño:</span>
                      <span className="font-medium">{formatFileSize(doc.size)}</span>
                    </div>
                    {doc.confidence > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Confianza IA:</span>
                        <span className={`font-medium ${
                          doc.confidence > 90 ? 'text-green-600' :
                          doc.confidence > 75 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {doc.confidence.toFixed(1)}%
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subido:</span>
                      <span className="font-medium">
                        {new Date(doc.uploadDate).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  </div>

                  {doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {doc.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{doc.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {doc.aiAnalysis?.riskFlags && doc.aiAnalysis.riskFlags.length > 0 && (
                    <div className="flex items-center text-sm text-amber-600 mb-2">
                      <span className="mr-1">⚠️</span>
                      <span>{doc.aiAnalysis.riskFlags.length} alerta(s)</span>
                    </div>
                  )}

                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDocument(doc);
                    }}
                  >
                    👁️ Ver Detalles
                  </Button>
                </Card>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📄</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron documentos
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                    ? 'Prueba ajustando los filtros de búsqueda'
                    : 'Sube tu primer documento para comenzar el procesamiento con IA'}
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  📤 Subir Documento
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">📊 Distribución por Categoría</h3>
                <div className="space-y-3">
                  {Object.entries(analytics.categoryDistribution).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / analytics.totalDocuments) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Performance */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">🤖 Rendimiento de IA</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Precisión Global</span>
                    <span className="text-lg font-bold text-green-600">{analytics.accuracyRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Documentos Procesados</span>
                    <span className="text-lg font-bold">{analytics.totalDocuments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tiempo Ahorrado (mes)</span>
                    <span className="text-lg font-bold text-blue-600">{analytics.timesSaved}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ahorro Estimado</span>
                    <span className="text-lg font-bold text-green-600">$1.2M CLP</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">📈 Tendencias Mensuales</h3>
              <div className="grid grid-cols-6 gap-4">
                {analytics.monthlyTrends.map((month, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-gray-600 mb-2">{month.month}</div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(month.count / 200) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium">{month.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* AI Configuration Tab */}
        {activeTab === 'ai-config' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🤖</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Configuración de IA Avanzada
              </h3>
              <p className="text-gray-600 mb-6">
                Personaliza el comportamiento de la inteligencia artificial
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <Card className="p-6 text-center">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="font-semibold mb-2">Precisión de OCR</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Ajusta la sensibilidad del reconocimiento óptico
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">85% - Óptimo</div>
                </Card>

                <Card className="p-6 text-center">
                  <div className="text-3xl mb-3">🏷️</div>
                  <h4 className="font-semibold mb-2">Auto-Categorización</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Categorización automática de documentos
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">92% - Excelente</div>
                </Card>

                <Card className="p-6 text-center">
                  <div className="text-3xl mb-3">⚠️</div>
                  <h4 className="font-semibold mb-2">Detección de Riesgos</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Identificación automática de anomalías
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">78% - Bueno</div>
                </Card>

                <Card className="p-6 text-center">
                  <div className="text-3xl mb-3">🔄</div>
                  <h4 className="font-semibold mb-2">Procesamiento Automático</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Velocidad de procesamiento en tiempo real
                  </p>
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                </Card>

                <Card className="p-6 text-center">
                  <div className="text-3xl mb-3">📚</div>
                  <h4 className="font-semibold mb-2">Aprendizaje Continuo</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Mejora automática basada en correcciones
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">Entrenando</Badge>
                </Card>

                <Card className="p-6 text-center">
                  <div className="text-3xl mb-3">🔐</div>
                  <h4 className="font-semibold mb-2">Privacidad de Datos</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Procesamiento local sin envío a nube
                  </p>
                  <Badge className="bg-green-100 text-green-800">Seguro</Badge>
                </Card>
              </div>
            </div>
          </div>
        )}
      </Tabs>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {getTypeIcon(selectedDocument.type)} {selectedDocument.name}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDocument(null)}
                >
                  ✕ Cerrar
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Document Info */}
                <div className="space-y-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">📋 Información General</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <Badge className={getStatusColor(selectedDocument.status)}>
                          {selectedDocument.status === 'completed' ? 'Completado' :
                           selectedDocument.status === 'processing' ? 'Procesando' :
                           selectedDocument.status === 'pending_review' ? 'Pendiente' : 'Error'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categoría:</span>
                        <span>{selectedDocument.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tamaño:</span>
                        <span>{formatFileSize(selectedDocument.size)}</span>
                      </div>
                      {selectedDocument.confidence > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Confianza IA:</span>
                          <span className={
                            selectedDocument.confidence > 90 ? 'text-green-600' :
                            selectedDocument.confidence > 75 ? 'text-yellow-600' : 'text-red-600'
                          }>
                            {selectedDocument.confidence.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Extracted Data */}
                  {selectedDocument.extractedData && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3">🤖 Datos Extraídos</h3>
                      <div className="space-y-2 text-sm">
                        {Object.entries(selectedDocument.extractedData).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-medium">
                              {typeof value === 'number' && key.includes('monto') || key.includes('total') || key.includes('saldo')
                                ? `$${value.toLocaleString('es-CL')}`
                                : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>

                {/* AI Analysis */}
                <div className="space-y-4">
                  {selectedDocument.aiAnalysis && (
                    <>
                      <Card className="p-4">
                        <h3 className="font-semibold mb-3">🧠 Análisis de IA</h3>
                        <p className="text-sm text-gray-700 mb-4">{selectedDocument.aiAnalysis.summary}</p>
                        
                        {selectedDocument.aiAnalysis.riskFlags.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-amber-600 mb-2">⚠️ Alertas Detectadas</h4>
                            <ul className="space-y-1">
                              {selectedDocument.aiAnalysis.riskFlags.map((flag, index) => (
                                <li key={index} className="text-sm text-amber-700 flex items-center">
                                  <span className="mr-2">•</span>
                                  {flag}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {selectedDocument.aiAnalysis.suggestions.length > 0 && (
                          <div>
                            <h4 className="font-medium text-blue-600 mb-2">💡 Sugerencias</h4>
                            <ul className="space-y-1">
                              {selectedDocument.aiAnalysis.suggestions.map((suggestion, index) => (
                                <li key={index} className="text-sm text-blue-700 flex items-center">
                                  <span className="mr-2">•</span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Card>

                      <Card className="p-4">
                        <h3 className="font-semibold mb-3">🏷️ Etiquetas</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedDocument.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    </>
                  )}

                  {selectedDocument.ocrText && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3">📄 Texto Extraído (OCR)</h3>
                      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                        {selectedDocument.ocrText}
                      </div>
                    </Card>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline">
                  📥 Descargar
                </Button>
                <Button variant="outline">
                  ✏️ Editar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  ✅ Aprobar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
