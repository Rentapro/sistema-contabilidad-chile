'use client';

import { useState, useEffect } from 'react';
import { DocumentoProcesado, TareaWorkflow, Empresa } from '@/types';
import { firmApi } from '@/data/store';
import { formatCurrency, formatDateShort, formatearPorcentaje } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Brain, 
  Search,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings,
  Bot,
  Cpu,
  FileCheck,
  Archive,
  RefreshCw,
  DollarSign,
  Activity,
  Target
} from 'lucide-react';

interface AnalisisIA {
  precision: number;
  recall: number;
  documentosProcesados: number;
  tiempoPromedioIA: number;
  documentosValidados: number;
  erroresDetectados: number;
}

const tiposDocumento = [
  'factura_compra',
  'factura_venta', 
  'boleta',
  'nota_credito',
  'nota_debito',
  'guia_despacho',
  'liquidacion_sueldo',
  'honorarios',
  'otro'
] as const;

type TipoDocumento = typeof tiposDocumento[number];

const categoriasDocumento: Record<TipoDocumento, string> = {
  factura_compra: 'Compras',
  factura_venta: 'Ventas',
  boleta: 'Ventas',
  nota_credito: 'Ajustes',
  nota_debito: 'Ajustes',
  guia_despacho: 'Logística',
  liquidacion_sueldo: 'RRHH',
  honorarios: 'Servicios',
  otro: 'Sin Categorizar'
};

const estadosDocumento = [
  'pendiente',
  'procesando',
  'procesado',
  'error',
  'validado',
  'contabilizado',
  'revisado',
  'aprobado',
  'rechazado'
] as const;

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<DocumentoProcesado[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocumento, setSelectedDocumento] = useState<DocumentoProcesado | null>(null);
  const [analisisIA, setAnalisisIA] = useState<AnalisisIA | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [selectedTab, setSelectedTab] = useState('documentos');

  useEffect(() => {
    cargarDatos();
    cargarAnalisisIA();
  }, []);

  const cargarDatos = () => {
    setDocumentos(firmApi.getDocumentosProcesados());
    setEmpresas(firmApi.getEmpresas());
  };

  const cargarAnalisisIA = () => {
    // Simular análisis de IA
    setAnalisisIA({
      precision: 0.94,
      recall: 0.89,
      documentosProcesados: 1247,
      tiempoPromedioIA: 2.3,
      documentosValidados: 1156,
      erroresDetectados: 23
    });
  };

  const detectarTipoDocumento = (nombreArchivo: string): TipoDocumento => {
    const nombre = nombreArchivo.toLowerCase();
    if (nombre.includes('factura') && nombre.includes('compra')) return 'factura_compra';
    if (nombre.includes('factura')) return 'factura_venta';
    if (nombre.includes('boleta')) return 'boleta';
    if (nombre.includes('nota') && nombre.includes('credito')) return 'nota_credito';
    if (nombre.includes('nota') && nombre.includes('debito')) return 'nota_debito';
    if (nombre.includes('guia')) return 'guia_despacho';
    if (nombre.includes('liquidacion')) return 'liquidacion_sueldo';
    if (nombre.includes('honorarios')) return 'honorarios';
    return 'otro';
  };

  const categorizarDocumento = (tipo: TipoDocumento): string => {
    return categoriasDocumento[tipo] || 'Sin Categorizar';
  };

  const simularProcesamientoOCR = async (file: File): Promise<DocumentoProcesado> => {
    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const tipo = detectarTipoDocumento(file.name);
    const confianza = Math.random() * 0.3 + 0.7; // Entre 0.7 y 1.0
    
    return {
      id: Date.now().toString(),
      nombre: file.name,
      empresaId: filtroEmpresa || empresas[0]?.id || '',
      tipo,
      fecha: new Date(),
      fechaSubida: new Date(),
      fechaProcesamiento: new Date(),
      estado: confianza > 0.9 ? 'procesado' : 'pendiente',
      origen: 'upload',
      tamaño: file.size,
      confianza,
      requiereValidacion: confianza < 0.9,
      datosExtraidos: {
        rut: '12.345.678-9',
        numeroDocumento: Math.floor(Math.random() * 1000000).toString(),
        fecha: new Date().toISOString().split('T')[0],
        monto: Math.random() * 500000 + 10000,
        proveedor: 'Proveedor Ejemplo S.A.',
        conceptos: ['Servicios profesionales', 'Consultoría']
      },
      metadatos: {
        categoriaIA: categorizarDocumento(tipo),
        etiquetas: [tipo, 'nuevo'],
        recomendacionesIA: [
          'Verificar RUT del proveedor',
          'Validar fecha de emisión',
          'Revisar cálculo de impuestos'
        ]
      }
    };
  };

  const handleFileUpload = async (files: FileList) => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    const nuevosDocumentos: DocumentoProcesado[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress((i / files.length) * 100);
      
      try {
        const documentoProcesado = await simularProcesamientoOCR(file);
        nuevosDocumentos.push(documentoProcesado);
        
        // Crear tarea de validación si es necesaria
        if (documentoProcesado.requiereValidacion) {
          const nuevaTarea: Omit<TareaWorkflow, 'id'> = {
            empresaId: documentoProcesado.empresaId,
            contadorId: '',
            tipo: 'validacion_documento',
            titulo: `Validar ${documentoProcesado.nombre}`,
            descripcion: `Documento requiere validación manual debido a baja confianza (${((documentoProcesado.confianza || 0) * 100).toFixed(1)}%)`,
            prioridad: 'media',
            estado: 'pendiente',
            fechaCreacion: new Date(),
            fechaVencimiento: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
            estimacionHoras: 0.5,
            notas: '',
            documentosRequeridos: [documentoProcesado.nombre],
            dependencias: [],
            metadatos: {
              documentoId: documentoProcesado.id,
              confianza: documentoProcesado.confianza,
              tipoValidacion: 'ocr_revision'
            }
          };
          
          firmApi.createTareaWorkflow(nuevaTarea);
        }
        
      } catch (error) {
        console.error('Error procesando archivo:', file.name, error);
      }
    }
    
    // Guardar documentos
    nuevosDocumentos.forEach(doc => {
      firmApi.createDocumentoProcesado(doc);
    });
    
    setUploadProgress(100);
    setIsProcessing(false);
    cargarDatos();
  };

  const calcularEstadisticas = () => {
    const total = documentos.length;
    const procesados = documentos.filter(d => d.estado === 'procesado' || d.estado === 'validado').length;
    const pendientes = documentos.filter(d => d.estado === 'pendiente' || d.estado === 'procesando').length;
    const errores = documentos.filter(d => d.estado === 'error').length;
    
    const confianzaPromedio = documentos.length > 0 
      ? documentos.reduce((sum, d) => sum + (d.confianza || 0), 0) / documentos.length
      : 0;
    
    const montoTotal = documentos.reduce((sum, documento) => {
      const monto = documento.datosExtraidos?.monto || documento.montoTotal || 0;
      return sum + monto;
    }, 0);
    
    return {
      total,
      procesados,
      pendientes,
      errores,
      confianzaPromedio,
      montoTotal
    };
  };

  const documentosFiltrados = documentos.filter(documento => {
    const cumpleBusqueda = busqueda === '' || 
      documento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      documento.numeroDocumento?.toLowerCase().includes(busqueda.toLowerCase()) ||
      documento.proveedor?.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleEstado = filtroEstado === '' || documento.estado === filtroEstado;
    const cumpleTipo = filtroTipo === '' || documento.tipo === filtroTipo;
    const cumpleEmpresa = filtroEmpresa === '' || documento.empresaId === filtroEmpresa;
    
    return cumpleBusqueda && cumpleEstado && cumpleTipo && cumpleEmpresa;
  });

  const stats = calcularEstadisticas();

  const getEstadoBadge = (estado: string) => {
    const configs = {
      pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      procesando: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
      procesado: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      error: { color: 'bg-red-100 text-red-800', icon: XCircle },
      validado: { color: 'bg-emerald-100 text-emerald-800', icon: FileCheck },
      contabilizado: { color: 'bg-purple-100 text-purple-800', icon: Archive },
      revisado: { color: 'bg-indigo-100 text-indigo-800', icon: Eye },
      aprobado: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rechazado: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = configs[estado as keyof typeof configs] || configs.pendiente;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const getTipoColor = (tipo: string) => {
    const colors = {
      factura_compra: 'bg-red-500',
      factura_venta: 'bg-green-500',
      boleta: 'bg-blue-500',
      nota_credito: 'bg-yellow-500',
      nota_debito: 'bg-orange-500',
      guia_despacho: 'bg-purple-500',
      liquidacion_sueldo: 'bg-pink-500',
      honorarios: 'bg-indigo-500',
      otro: 'bg-gray-500'
    };
    return colors[tipo as keyof typeof colors] || colors.otro;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Documentos</h1>
          <p className="text-gray-500 mt-1">Procesamiento inteligente con IA y validación automática</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Subir Documentos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Subir Documentos</DialogTitle>
                <DialogDescription>
                  Selecciona los documentos para procesamiento automático con IA
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Arrastra archivos aquí o haz clic para seleccionar
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF, JPG, PNG hasta 10MB cada uno
                    </p>
                  </div>
                </div>
                
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600 animate-spin" />
                      <span className="text-sm">Procesando con IA...</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documentos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Procesados</p>
                <p className="text-2xl font-bold text-green-600">{stats.procesados}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confianza IA</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatearPorcentaje(stats.confianzaPromedio)}
                </p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monto Total</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(stats.montoTotal)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="procesamiento">Procesamiento IA</TabsTrigger>
          <TabsTrigger value="validacion">Validación</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="documentos" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar documentos..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los estados</SelectItem>
                    {estadosDocumento.map(estado => (
                      <SelectItem key={estado} value={estado}>
                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los tipos</SelectItem>
                    {tiposDocumento.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>
                        {categoriasDocumento[tipo]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filtroEmpresa} onValueChange={setFiltroEmpresa}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las empresas</SelectItem>
                    {empresas.map(empresa => (
                      <SelectItem key={empresa.id} value={empresa.id}>
                        {empresa.razonSocial}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Documentos */}
          <Card>
            <CardHeader>
              <CardTitle>Documentos ({documentosFiltrados.length})</CardTitle>
              <CardDescription>
                Documentos procesados con IA y validación automática
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentosFiltrados.map((documento) => (
                  <div key={documento.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getTipoColor(documento.tipo)}`} />
                        <div>
                          <h3 className="font-medium">{documento.nombre}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>#{documento.numeroDocumento}</span>
                            <span>{formatDateShort(documento.fecha)}</span>
                            <span>{documento.proveedor || documento.cliente}</span>
                            <span className="font-medium">
                              {formatCurrency(documento.datosExtraidos?.monto || documento.montoTotal || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {documento.confianza && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">
                              {((documento.confianza) * 100).toFixed(1)}%
                            </span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  (documento.confianza) >= 0.9 ? 'bg-green-500' :
                                  (documento.confianza) >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${(documento.confianza) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {getEstadoBadge(documento.estado)}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDocumento(documento)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {documentosFiltrados.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay documentos</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Sube documentos para comenzar el procesamiento automático
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procesamiento" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Motor de IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analisisIA && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Precisión</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatearPorcentaje(analisisIA.precision)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Recall</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatearPorcentaje(analisisIA.recall)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Documentos procesados</span>
                        <span className="font-medium">{analisisIA.documentosProcesados.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tiempo promedio</span>
                        <span className="font-medium">{analisisIA.tiempoPromedioIA}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Validados automáticamente</span>
                        <span className="font-medium">{analisisIA.documentosValidados.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Errores detectados</span>
                        <span className="font-medium text-red-600">{analisisIA.erroresDetectados}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Patrones Detectados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Facturas duplicadas</p>
                      <p className="text-sm text-gray-600">3 casos detectados</p>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">Fechas inconsistentes</p>
                      <p className="text-sm text-gray-600">7 casos detectados</p>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Proveedores recurrentes</p>
                      <p className="text-sm text-gray-600">15 identificados</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validacion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Pendientes de Validación</CardTitle>
              <CardDescription>
                Documentos que requieren revisión manual debido a baja confianza
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentos
                  .filter(d => d.requiereValidacion && d.estado === 'pendiente')
                  .map((documento) => (
                    <div key={documento.id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{documento.nombre}</h3>
                          <p className="text-sm text-gray-600">
                            Confianza: {((documento.confianza || 0) * 100).toFixed(1)}%
                          </p>
                          {documento.metadatos?.recomendacionesIA && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-700">Recomendaciones IA:</p>
                              <ul className="text-xs text-gray-600 ml-2">
                                {documento.metadatos.recomendacionesIA.map((rec, idx) => (
                                  <li key={idx}>• {rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Revisar
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Validar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {documentos.filter(d => d.requiereValidacion && d.estado === 'pendiente').length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No hay documentos pendientes de validación
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Todos los documentos han sido procesados exitosamente
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Procesamiento por Día
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Gráfico de procesamiento diario
                  <br />
                  <small>(Funcionalidad en desarrollo)</small>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Tipos de Documento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    documentos.reduce((acc, doc) => {
                      acc[doc.tipo] = (acc[doc.tipo] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([tipo, count]) => (
                    <div key={tipo} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getTipoColor(tipo)}`} />
                        <span className="text-sm">{categorizarDocumento(tipo as TipoDocumento)}</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración del Procesamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Umbral de Confianza</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Validación automática</span>
                    <span>≥ 90%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Revisión manual</span>
                    <span>70% - 89%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rechazo automático</span>
                    <span>&lt; 70%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Tipos de Documento Soportados</h3>
                <div className="grid grid-cols-2 gap-2">
                  {tiposDocumento.map(tipo => (
                    <div key={tipo} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {categorizarDocumento(tipo)}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Configuración de IA</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Procesamiento automático de OCR</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Detección de duplicados</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Validación de fechas</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Categorización automática</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalle de Documento */}
      {selectedDocumento && (
        <Dialog open={!!selectedDocumento} onOpenChange={() => setSelectedDocumento(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedDocumento.nombre}</DialogTitle>
              <DialogDescription>
                Detalles del documento procesado
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium">{categorizarDocumento(selectedDocumento.tipo)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  {getEstadoBadge(selectedDocumento.estado)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-medium">{formatDateShort(selectedDocumento.fecha)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confianza IA</p>
                  <p className="font-medium">
                    {selectedDocumento.confianza ? 
                      `${(selectedDocumento.confianza * 100).toFixed(1)}%` : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>
              
              {selectedDocumento.datosExtraidos && (
                <div>
                  <h3 className="font-medium mb-2">Datos Extraídos</h3>
                  <div className="bg-gray-50 rounded p-3 space-y-2 text-sm">
                    {selectedDocumento.datosExtraidos.rut && (
                      <div>
                        <span className="text-gray-600">RUT:</span> {selectedDocumento.datosExtraidos.rut}
                      </div>
                    )}
                    {selectedDocumento.datosExtraidos.numeroDocumento && (
                      <div>
                        <span className="text-gray-600">Número:</span> {selectedDocumento.datosExtraidos.numeroDocumento}
                      </div>
                    )}
                    {selectedDocumento.datosExtraidos.monto && (
                      <div>
                        <span className="text-gray-600">Monto:</span> {formatCurrency(selectedDocumento.datosExtraidos.monto)}
                      </div>
                    )}
                    {selectedDocumento.datosExtraidos.proveedor && (
                      <div>
                        <span className="text-gray-600">Proveedor:</span> {selectedDocumento.datosExtraidos.proveedor}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedDocumento.metadatos?.recomendacionesIA && (
                <div>
                  <h3 className="font-medium mb-2">Recomendaciones IA</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedDocumento.metadatos.recomendacionesIA.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Bot className="w-4 h-4 text-blue-600 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
