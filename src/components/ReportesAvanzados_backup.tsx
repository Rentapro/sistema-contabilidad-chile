'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Calculator, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { reportesSII, datosReportes, calcularCampo, type ReporteSII, type CampoReporte } from '@/data/reportes-sii';

interface ReporteGenerado {
  id: string;
  const reportesF29: ReporteF29[] = [
  {
    periodo: '2025-06',
    ventasPropias: 45680000,
    ventasTerceros: 12340000,
    compras: 28900000,
    ivaDebito: 8707200,
    ivaCredito: 4624000,
    ppmPropio: 456800,
    ppmTerceros: 123400,
    impuestoResultante: 4663600,
    estado: 'pendiente',
    fechaVencimiento: '2025-07-12'
  },
  {
    periodo: '2025-05',
    ventasPropias: 52340000,
    ventasTerceros: 15670000,
    compras: 31250000,
    ivaDebito: 10881600,
    ivaCredito: 5000000,
    ppmPropio: 523400,
    ppmTerceros: 156700,
    impuestoResultante: 6561900,
    estado: 'presentado',
    fechaVencimiento: '2025-06-12'
  },
  {
    periodo: '2025-04',
    ventasPropias: 38920000,
    ventasTerceros: 9870000,
    compras: 25600000,
    ivaDebito: 7806400,
    ivaCredito: 4096000,
    ppmPropio: 389200,
    ppmTerceros: 98700,
    impuestoResultante: 4198300,
    estado: 'vencido',
    fechaVencimiento: '2025-05-12'
  }
];

const librosIVA: LibroIVA[] = [

export default function ReportesAvanzados() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState<ReporteSII | null>(null);
  const [reportesGenerados, setReportesGenerados] = useState<ReporteGenerado[]>([]);
  const [vistaActual, setVistaActual] = useState<'lista' | 'generador' | 'historial'>('lista');

  useEffect(() => {
    // Simular reportes generados existentes
    setReportesGenerados([
      {
        id: 'f29_junio_2025',
        nombre: 'F29 - Junio 2025',
        periodo: '2025-06',
        estado: 'generado',
        montoTotal: 2100000,
        fechaGeneracion: '2025-06-10',
        campos: datosReportes.f29_junio_2025
      },
      {
        id: 'f22_2024',
        nombre: 'F22 - Año 2024',
        periodo: '2024',
        estado: 'presentado',
        montoTotal: 2300000,
        fechaGeneracion: '2025-04-28',
        campos: datosReportes.f22_2024
      }
    ]);
  }, []);

  const generarReporte = (reporte: ReporteSII) => {
    const datos = datosReportes[reporte.id as keyof typeof datosReportes] || {};
    
    // Calcular campos con fórmulas
    const camposCalculados = { ...datos };
    reporte.campos.forEach(campo => {
      if (campo.formula) {
        camposCalculados[campo.codigo] = calcularCampo(campo.formula, datos);
      }
    });

    const nuevoReporte: ReporteGenerado = {
      id: `${reporte.id}_${Date.now()}`,
      nombre: `${reporte.nombre} - ${new Date().toLocaleDateString('es-CL')}`,
      periodo: new Date().toISOString().slice(0, 7),
      estado: 'generado',
      montoTotal: camposCalculados['159'] || camposCalculados['040'] || 0,
      fechaGeneracion: new Date().toISOString().slice(0, 10),
      campos: camposCalculados
    };

    setReportesGenerados(prev => [nuevoReporte, ...prev]);
    setVistaActual('historial');
  };

  const exportarReporte = (reporte: ReporteGenerado) => {
    // Simular exportación
    const contenido = `
SERVICIO DE IMPUESTOS INTERNOS
${reporte.nombre}
Período: ${reporte.periodo}
Fecha de Generación: ${reporte.fechaGeneracion}

${Object.entries(reporte.campos).map(([codigo, valor]) => 
  `Código ${codigo}: $${valor.toLocaleString('es-CL')}`
).join('\n')}

TOTAL: $${reporte.montoTotal.toLocaleString('es-CL')}
    `;

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reporte.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📋 Reportes Avanzados SII
          </h1>
          <p className="text-gray-600">
            Genera y gestiona todos tus reportes oficiales del SII
          </p>
        </div>

        {/* Navegación */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={vistaActual === 'lista' ? 'default' : 'outline'}
            onClick={() => setVistaActual('lista')}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Formularios SII
          </Button>
          <Button
            variant={vistaActual === 'historial' ? 'default' : 'outline'}
            onClick={() => setVistaActual('historial')}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Historial ({reportesGenerados.length})
          </Button>
        </div>

        {/* Vista Lista de Formularios */}
        {vistaActual === 'lista' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportesSII.map((reporte) => (
              <Card key={reporte.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{reporte.codigo}</CardTitle>
                    <Badge variant={reporte.obligatorio ? 'destructive' : 'secondary'}>
                      {reporte.obligatorio ? 'Obligatorio' : 'Opcional'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{reporte.nombre}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">{reporte.descripcion}</p>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Periodicidad:</span>
                      <span className="capitalize font-medium">{reporte.periodicidad}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Vencimiento:</span>
                      <span className="font-medium">{reporte.fechaVencimiento}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Campos:</span>
                      <span className="font-medium">{reporte.campos.length}</span>
                    </div>

                    <Button
                      onClick={() => {
                        setReporteSeleccionado(reporte);
                        setVistaActual('generador');
                      }}
                      className="w-full mt-4"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Generar Reporte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Vista Generador */}
        {vistaActual === 'generador' && reporteSeleccionado && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {reporteSeleccionado.nombre}
              </CardTitle>
              <p className="text-gray-600">{reporteSeleccionado.descripcion}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Información del Formulario */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">Código</span>
                    <div className="font-semibold">{reporteSeleccionado.codigo}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Periodicidad</span>
                    <div className="font-semibold capitalize">{reporteSeleccionado.periodicidad}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Vencimiento</span>
                    <div className="font-semibold">{reporteSeleccionado.fechaVencimiento}</div>
                  </div>
                </div>

                {/* Campos del Formulario */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Campos del Formulario</h3>
                  <div className="space-y-3">
                    {reporteSeleccionado.campos.map((campo) => {
                      const datos = datosReportes[reporteSeleccionado.id as keyof typeof datosReportes] || {};
                      const valor = campo.formula 
                        ? calcularCampo(campo.formula, datos)
                        : datos[campo.codigo as keyof typeof datos] || 0;

                      return (
                        <div key={campo.codigo} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{campo.codigo}</Badge>
                              <span className="font-medium">{campo.nombre}</span>
                              {campo.obligatorio && (
                                <Badge variant="destructive" className="text-xs">Obligatorio</Badge>
                              )}
                              {campo.formula && (
                                <Badge variant="secondary" className="text-xs">Auto</Badge>
                              )}
                            </div>
                            {campo.formula && (
                              <div className="text-xs text-gray-500 mt-1">
                                Fórmula: {campo.formula}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              ${valor.toLocaleString('es-CL')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {campo.tipo}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resumen */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Resumen del Reporte</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-blue-700">Total de Campos:</span>
                      <div className="font-semibold">{reporteSeleccionado.campos.length}</div>
                    </div>
                    <div>
                      <span className="text-sm text-blue-700">Campos Obligatorios:</span>
                      <div className="font-semibold">
                        {reporteSeleccionado.campos.filter(c => c.obligatorio).length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => generarReporte(reporteSeleccionado)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Generar Reporte
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setVistaActual('lista')}
                  >
                    Volver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vista Historial */}
        {vistaActual === 'historial' && (
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{reportesGenerados.length}</div>
                      <div className="text-sm text-gray-600">Total Reportes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {reportesGenerados.filter(r => r.estado === 'presentado').length}
                      </div>
                      <div className="text-sm text-gray-600">Presentados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {reportesGenerados.filter(r => r.estado === 'generado').length}
                      </div>
                      <div className="text-sm text-gray-600">Pendientes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        ${reportesGenerados.reduce((sum, r) => sum + r.montoTotal, 0).toLocaleString('es-CL')}
                      </div>
                      <div className="text-sm text-gray-600">Total Declarado</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Reportes */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de Reportes Generados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportesGenerados.map((reporte) => (
                    <div key={reporte.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{reporte.nombre}</h4>
                          <Badge variant={
                            reporte.estado === 'presentado' ? 'default' : 
                            reporte.estado === 'generado' ? 'secondary' : 'destructive'
                          }>
                            {reporte.estado === 'presentado' ? 'Presentado' : 
                             reporte.estado === 'generado' ? 'Generado' : 'Pendiente'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Período: {reporte.periodo} • Generado: {reporte.fechaGeneracion}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          ${reporte.montoTotal.toLocaleString('es-CL')}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportarReporte(reporte)}
                          className="mt-2"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
