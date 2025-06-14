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
  DollarSign,
  Calendar,
  Building
} from 'lucide-react';

// Interfaces
interface ReporteF29 {
  periodo: string;
  ventasPropias: number;
  ventasTerceros: number;
  compras: number;
  ivaDebito: number;
  ivaCredito: number;
  ppmPropio: number;
  ppmTerceros: number;
  impuestoResultante: number;
  estado: 'pendiente' | 'presentado' | 'vencido';
  fechaVencimiento: string;
}

interface LibroIVA {
  periodo: string;
  ventasNetas: number;
  ivaDebito: number;
  comprasNetas: number;
  ivaCredito: number;
  diferencia: number;
  estado: string;
  fechaCreacion: string;
}

interface ReporteF22 {
  periodo: string;
  ingresosBrutos: number;
  gastosDeducibles: number;
  baseImponible: number;
  impuestoPrimera: number;
  creditos: number;
  impuestoFinal: number;
  estado: string;
  fechaLimite: string;
}

interface ReporteGenerado {
  id: string;
  nombre: string;
  tipo: 'F29' | 'F22' | 'LibroIVA' | 'Balances';
  periodo: string;
  estado: 'generado' | 'presentado' | 'pendiente' | 'vencido';
  montoTotal: number;
  fechaGeneracion: string;
  fechaVencimiento?: string;
  descripcion: string;
}

// Datos de ejemplo
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
  {
    periodo: '2025-06',
    ventasNetas: 58020000,
    ivaDebito: 11043800,
    comprasNetas: 28900000,
    ivaCredito: 5491000,
    diferencia: 5552800,
    estado: 'Generado',
    fechaCreacion: '2025-06-10'
  },
  {
    periodo: '2025-05',
    ventasNetas: 68010000,
    ivaDebito: 12921900,
    comprasNetas: 31250000,
    ivaCredito: 5937500,
    diferencia: 6984400,
    estado: 'Presentado',
    fechaCreacion: '2025-05-10'
  }
];

const reportesF22: ReporteF22[] = [
  {
    periodo: '2024',
    ingresosBrutos: 650000000,
    gastosDeducibles: 480000000,
    baseImponible: 170000000,
    impuestoPrimera: 45900000,
    creditos: 2300000,
    impuestoFinal: 43600000,
    estado: 'Presentado',
    fechaLimite: '2025-04-30'
  }
];

export default function ReportesAvanzados() {
  const [reportesGenerados, setReportesGenerados] = useState<ReporteGenerado[]>([]);
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'f29' | 'f22' | 'libros' | 'generador'>('dashboard');
  const [reporteSeleccionado, setReporteSeleccionado] = useState<any>(null);

  useEffect(() => {
    // Inicializar reportes generados
    setReportesGenerados([
      {
        id: 'f29_junio_2025',
        nombre: 'Formulario 29 - Junio 2025',
        tipo: 'F29',
        periodo: '2025-06',
        estado: 'pendiente',
        montoTotal: 4663600,
        fechaGeneracion: '2025-06-10',
        fechaVencimiento: '2025-07-12',
        descripcion: 'Declaración mensual IVA y PPM'
      },
      {
        id: 'f22_2024',
        nombre: 'Formulario 22 - Renta 2024',
        tipo: 'F22',
        periodo: '2024',
        estado: 'presentado',
        montoTotal: 43600000,
        fechaGeneracion: '2025-04-28',
        descripcion: 'Declaración anual de renta'
      },
      {
        id: 'libro_iva_junio',
        nombre: 'Libro IVA - Junio 2025',
        tipo: 'LibroIVA',
        periodo: '2025-06',
        estado: 'generado',
        montoTotal: 5552800,
        fechaGeneracion: '2025-06-10',
        descripcion: 'Registro mensual de IVA'
      }
    ]);
  }, []);

  const generarReportePDF = (reporte: ReporteGenerado) => {
    // Simular generación de PDF
    const contenido = `
REPORTE AUTOMATIZADO SII CHILE
================================

${reporte.nombre}
Período: ${reporte.periodo}
Estado: ${reporte.estado.toUpperCase()}
Monto Total: $${reporte.montoTotal.toLocaleString('es-CL')}
Fecha Generación: ${reporte.fechaGeneracion}

SERVICIO DE IMPUESTOS INTERNOS - CHILE
=====================================
    `;
    
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reporte.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const obtenerEstadoColor = (estado: string) => {
    switch (estado) {
      case 'presentado': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'vencido': return 'bg-red-100 text-red-800';
      case 'generado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (vistaActual === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes SII Avanzados</h1>
            <p className="text-gray-600 mt-2">
              Gestión automatizada de formularios y declaraciones SII
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm">
              <Calculator className="w-4 h-4 mr-1" />
              3 tipos de reportes
            </Badge>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reportes Pendientes</p>
                  <p className="text-2xl font-bold text-orange-600">2</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Presentados</p>
                  <p className="text-2xl font-bold text-green-600">1</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Impuestos del Mes</p>
                  <p className="text-2xl font-bold text-blue-600">$4.7M</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Próximo Vencimiento</p>
                  <p className="text-2xl font-bold text-red-600">7 días</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegación de reportes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => setVistaActual('f29')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Formulario 29
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Declaración mensual de IVA y PPM</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-blue-100 text-blue-800">
                  {reportesF29.length} períodos
                </Badge>
                <Button variant="outline" size="sm">
                  Ver Reportes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => setVistaActual('f22')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-green-600" />
                Formulario 22
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Declaración anual de renta</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-green-100 text-green-800">
                  {reportesF22.length} año
                </Badge>
                <Button variant="outline" size="sm">
                  Ver Reportes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => setVistaActual('libros')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Libros IVA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Registro mensual de operaciones</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-purple-100 text-purple-800">
                  {librosIVA.length} libros
                </Badge>
                <Button variant="outline" size="sm">
                  Ver Libros
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reportes recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Reportes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportesGenerados.map((reporte) => (
                <div key={reporte.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">{reporte.nombre}</h3>
                      <p className="text-sm text-gray-600">{reporte.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={obtenerEstadoColor(reporte.estado)}>
                      {reporte.estado}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generarReportePDF(reporte)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vistaActual === 'f29') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Formularios 29</h1>
            <p className="text-gray-600 mt-2">Declaraciones mensuales de IVA y PPM</p>
          </div>
          <Button onClick={() => setVistaActual('dashboard')} variant="outline">
            Volver al Dashboard
          </Button>
        </div>

        <div className="grid gap-6">
          {reportesF29.map((reporte) => (
            <Card key={reporte.periodo}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Período {reporte.periodo}
                  </CardTitle>
                  <Badge className={obtenerEstadoColor(reporte.estado)}>
                    {reporte.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Ventas Propias</p>
                    <p className="font-semibold">${reporte.ventasPropias.toLocaleString('es-CL')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">IVA Débito</p>
                    <p className="font-semibold">${reporte.ivaDebito.toLocaleString('es-CL')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">IVA Crédito</p>
                    <p className="font-semibold">${reporte.ivaCredito.toLocaleString('es-CL')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Impuesto Resultante</p>
                    <p className="font-semibold text-blue-600">${reporte.impuestoResultante.toLocaleString('es-CL')}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Vencimiento: {new Date(reporte.fechaVencimiento).toLocaleDateString('es-CL')}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalle
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (vistaActual === 'f22') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Formularios 22</h1>
            <p className="text-gray-600 mt-2">Declaración anual de renta</p>
          </div>
          <Button onClick={() => setVistaActual('dashboard')} variant="outline">
            Volver al Dashboard
          </Button>
        </div>

        <div className="grid gap-6">
          {reportesF22.map((reporte) => (
            <Card key={reporte.periodo}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Año {reporte.periodo}
                  </CardTitle>
                  <Badge className={obtenerEstadoColor(reporte.estado)}>
                    {reporte.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Ingresos Brutos</p>
                    <p className="font-semibold">${reporte.ingresosBrutos.toLocaleString('es-CL')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Base Imponible</p>
                    <p className="font-semibold">${reporte.baseImponible.toLocaleString('es-CL')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Impuesto Final</p>
                    <p className="font-semibold text-green-600">${reporte.impuestoFinal.toLocaleString('es-CL')}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Fecha Límite: {new Date(reporte.fechaLimite).toLocaleDateString('es-CL')}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalle
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (vistaActual === 'libros') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Libros de IVA</h1>
            <p className="text-gray-600 mt-2">Registro mensual de operaciones</p>
          </div>
          <Button onClick={() => setVistaActual('dashboard')} variant="outline">
            Volver al Dashboard
          </Button>
        </div>

        <div className="grid gap-6">
          {librosIVA.map((libro) => (
            <Card key={libro.periodo}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Período {libro.periodo}
                  </CardTitle>
                  <Badge className={obtenerEstadoColor(libro.estado.toLowerCase())}>
                    {libro.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Ventas Netas</p>
                    <p className="font-semibold">${libro.ventasNetas.toLocaleString('es-CL')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">IVA Débito</p>
                    <p className="font-semibold">${libro.ivaDebito.toLocaleString('es-CL')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diferencia</p>
                    <p className="font-semibold text-purple-600">${libro.diferencia.toLocaleString('es-CL')}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Creado: {new Date(libro.fechaCreacion).toLocaleDateString('es-CL')}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalle
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
