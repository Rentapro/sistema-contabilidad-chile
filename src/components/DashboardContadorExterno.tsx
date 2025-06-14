'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Building2, 
  FileText, 
  Calculator,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Upload,
  Download,
  BarChart3
} from 'lucide-react';

interface EmpresaContadorExterno {
  id: string;
  rut: string;
  nombre: string;
  giro: string;
  estado: 'al_dia' | 'pendiente' | 'retrasado';
  ultimaDeclaracion: string;
  proximoVencimiento: string;
  ventasMensuales: number;
  ivaPendiente: number;
  tareasPendientes: number;
  planContratado: 'basico' | 'standard';
}

interface TareaContable {
  id: string;
  empresaId: string;
  tipo: 'f29' | 'f22' | 'libro_iva' | 'remuneraciones' | 'otros';
  descripcion: string;
  fechaVencimiento: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en_proceso' | 'completada';
  tiempoEstimado: number; // en horas
}

// Datos de ejemplo para contador externo
const empresasAsignadas: EmpresaContadorExterno[] = [
  {
    id: 'ext_001',
    rut: '76.555.888-9',
    nombre: 'Panadería San Francisco Ltda.',
    giro: 'Panadería y repostería',
    estado: 'al_dia',
    ultimaDeclaracion: '2025-05-12',
    proximoVencimiento: '2025-06-20',
    ventasMensuales: 12500000,
    ivaPendiente: 0,
    tareasPendientes: 1,
    planContratado: 'basico'
  },
  {
    id: 'ext_002',
    rut: '76.777.999-2',
    nombre: 'Ferretería El Clavo Ltda.',
    giro: 'Comercio ferreterías',
    estado: 'pendiente',
    ultimaDeclaracion: '2025-04-12',
    proximoVencimiento: '2025-06-15',
    ventasMensuales: 28900000,
    ivaPendiente: 4624000,
    tareasPendientes: 3,
    planContratado: 'standard'
  },
  {
    id: 'ext_003',
    rut: '76.333.444-5',
    nombre: 'Taller Mecánico Veloz SpA',
    giro: 'Servicios automotrices',
    estado: 'retrasado',
    ultimaDeclaracion: '2025-03-12',
    proximoVencimiento: '2025-06-12',
    ventasMensuales: 15600000,
    ivaPendiente: 2496000,
    tareasPendientes: 5,
    planContratado: 'basico'
  },
  {
    id: 'ext_004',
    rut: '76.111.222-8',
    nombre: 'Consultora Digital Innovar Ltda.',
    giro: 'Consultoría TI',
    estado: 'al_dia',
    ultimaDeclaracion: '2025-05-12',
    proximoVencimiento: '2025-06-25',
    ventasMensuales: 45200000,
    ivaPendiente: 0,
    tareasPendientes: 2,
    planContratado: 'standard'
  },
  {
    id: 'ext_005',
    rut: '76.666.777-1',
    nombre: 'Restaurante Sabores del Mar Ltda.',
    giro: 'Servicios gastronómicos',
    estado: 'pendiente',
    ultimaDeclaracion: '2025-04-12',
    proximoVencimiento: '2025-06-18',
    ventasMensuales: 18700000,
    ivaPendiente: 2992000,
    tareasPendientes: 2,
    planContratado: 'basico'
  }
];

const tareasContables: TareaContable[] = [
  {
    id: 'tarea_001',
    empresaId: 'ext_001',
    tipo: 'f29',
    descripcion: 'Declaración F29 Mayo 2025',
    fechaVencimiento: '2025-06-20',
    prioridad: 'media',
    estado: 'pendiente',
    tiempoEstimado: 2
  },
  {
    id: 'tarea_002',
    empresaId: 'ext_002',
    tipo: 'f29',
    descripcion: 'Declaración F29 Abril 2025',
    fechaVencimiento: '2025-06-15',
    prioridad: 'alta',
    estado: 'en_proceso',
    tiempoEstimado: 3
  },
  {
    id: 'tarea_003',
    empresaId: 'ext_002',
    tipo: 'libro_iva',
    descripcion: 'Libro IVA Abril 2025',
    fechaVencimiento: '2025-06-15',
    prioridad: 'alta',
    estado: 'pendiente',
    tiempoEstimado: 1.5
  },
  {
    id: 'tarea_004',
    empresaId: 'ext_003',
    tipo: 'f29',
    descripcion: 'Declaración F29 Marzo 2025',
    fechaVencimiento: '2025-06-12',
    prioridad: 'alta',
    estado: 'pendiente',
    tiempoEstimado: 3
  },
  {
    id: 'tarea_005',
    empresaId: 'ext_003',
    tipo: 'remuneraciones',
    descripcion: 'Liquidación remuneraciones Mayo',
    fechaVencimiento: '2025-06-15',
    prioridad: 'media',
    estado: 'pendiente',
    tiempoEstimado: 4
  }
];

export default function DashboardContadorExterno() {
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'empresas' | 'tareas' | 'reportes'>('dashboard');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<EmpresaContadorExterno | null>(null);
  const [tareaEnProceso, setTareaEnProceso] = useState<string | null>(null);

  // Funciones para manejar tareas
  const iniciarTarea = (tareaId: string) => {
    setTareaEnProceso(tareaId);
    // Simular proceso de inicio de tarea
    setTimeout(() => {
      alert(`Iniciando proceso para ${tareasContables.find(t => t.id === tareaId)?.descripcion}`);
      setTareaEnProceso(null);
    }, 1000);
  };

  const completarTarea = (tareaId: string) => {
    const tarea = tareasContables.find(t => t.id === tareaId);
    if (tarea) {
      tarea.estado = 'completada';
      alert(`✅ Tarea completada: ${tarea.descripcion}`);
    }
  };

  // Métricas calculadas
  const totalEmpresas = empresasAsignadas.length;
  const empresasAlDia = empresasAsignadas.filter(e => e.estado === 'al_dia').length;
  const empresasPendientes = empresasAsignadas.filter(e => e.estado === 'pendiente').length;
  const empresasRetrasadas = empresasAsignadas.filter(e => e.estado === 'retrasado').length;
  const ventasTotales = empresasAsignadas.reduce((sum, e) => sum + e.ventasMensuales, 0);
  const ivaTotalPendiente = empresasAsignadas.reduce((sum, e) => sum + e.ivaPendiente, 0);
  const tareasTotalesPendientes = tareasContables.filter(t => t.estado !== 'completada').length;
  const horasTrabajoEstimadas = tareasContables
    .filter(t => t.estado !== 'completada')
    .reduce((sum, t) => sum + t.tiempoEstimado, 0);

  if (vistaActual === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel Contador Externo</h1>
            <p className="text-gray-600 mt-2">
              Gestión simplificada de {totalEmpresas} empresas • {tareasTotalesPendientes} tareas pendientes
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700">
              <Briefcase className="w-4 h-4 mr-1" />
              Plan Profesional
            </Badge>
            <Badge variant="outline" className="text-sm bg-green-50 text-green-700">
              <CheckCircle className="w-4 h-4 mr-1" />
              {empresasAlDia} al día
            </Badge>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Empresas Gestionadas</p>
                  <p className="text-3xl font-bold">{totalEmpresas}</p>
                  <p className="text-blue-100 text-sm">{empresasAlDia} al día</p>
                </div>
                <Building2 className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Ventas Totales</p>
                  <p className="text-3xl font-bold">${(ventasTotales / 1000000).toFixed(1)}M</p>
                  <p className="text-green-100 text-sm">Último mes</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Tareas Pendientes</p>
                  <p className="text-3xl font-bold">{tareasTotalesPendientes}</p>
                  <p className="text-orange-100 text-sm">{horasTrabajoEstimadas}h estimadas</p>
                </div>
                <Clock className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">IVA Pendiente</p>
                  <p className="text-3xl font-bold">${(ivaTotalPendiente / 1000000).toFixed(1)}M</p>
                  <p className="text-red-100 text-sm">{empresasPendientes + empresasRetrasadas} empresas</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegación de secciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500" 
                onClick={() => setVistaActual('empresas')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Building2 className="w-6 h-6" />
                Gestión de Empresas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Administrar empresas asignadas</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-blue-100 text-blue-800">
                  {totalEmpresas} empresas
                </Badge>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                  Ver Todas
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500" 
                onClick={() => setVistaActual('tareas')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <FileText className="w-6 h-6" />
                Tareas Contables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gestionar obligaciones tributarias</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-orange-100 text-orange-800">
                  {tareasTotalesPendientes} pendientes
                </Badge>
                <Button variant="outline" size="sm" className="text-orange-600 border-orange-600">
                  Ver Tareas
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500" 
                onClick={() => setVistaActual('reportes')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <BarChart3 className="w-6 h-6" />
                Reportes Básicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Reportes y exportaciones</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-green-100 text-green-800">
                  Funciones limitadas
                </Badge>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  Ver Reportes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estado de empresas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Empresas al día */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Al Día ({empresasAlDia})
              </CardTitle>
            </CardHeader>            <CardContent>              <div className="space-y-2">
                {empresasAsignadas.filter(e => e.estado === 'al_dia').map(empresa => (
                  <div key={empresa.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium text-green-900">{empresa.nombre}</span>
                    <Badge variant="outline" className="text-xs text-green-700 bg-green-100 border-green-300">
                      ✓ Completo
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Empresas pendientes */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <Clock className="w-5 h-5" />
                Pendientes ({empresasPendientes})
              </CardTitle>
            </CardHeader>            <CardContent>              <div className="space-y-2">
                {empresasAsignadas.filter(e => e.estado === 'pendiente').map(empresa => (
                  <div key={empresa.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm font-medium text-yellow-900">{empresa.nombre}</span>
                    <Badge variant="outline" className="text-xs text-yellow-700 bg-yellow-100 border-yellow-300">
                      {empresa.tareasPendientes} tareas
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Empresas retrasadas */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                Retrasadas ({empresasRetrasadas})
              </CardTitle>
            </CardHeader>            <CardContent>              <div className="space-y-2">
                {empresasAsignadas.filter(e => e.estado === 'retrasado').map(empresa => (
                  <div key={empresa.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm font-medium text-red-900">{empresa.nombre}</span>
                    <Badge variant="outline" className="text-xs text-red-700 bg-red-100 border-red-300">
                      ¡Urgente!
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tareas próximas a vencer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximas Tareas a Vencer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tareasContables
                .filter(t => t.estado !== 'completada')
                .sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime())
                .slice(0, 5)
                .map(tarea => {
                  const empresa = empresasAsignadas.find(e => e.id === tarea.empresaId);
                  const diasVencimiento = Math.ceil((new Date(tarea.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={tarea.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tarea.prioridad === 'alta' ? 'bg-red-100' :
                          tarea.prioridad === 'media' ? 'bg-yellow-100' :
                          'bg-green-100'
                        }`}>
                          <FileText className={`w-5 h-5 ${
                            tarea.prioridad === 'alta' ? 'text-red-600' :
                            tarea.prioridad === 'media' ? 'text-yellow-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{tarea.descripcion}</h4>
                          <p className="text-sm text-gray-600">{empresa?.nombre}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${
                          diasVencimiento <= 3 ? 'bg-red-100 text-red-800' :
                          diasVencimiento <= 7 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {diasVencimiento > 0 ? `${diasVencimiento} días` : 'Vencido'}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{tarea.tiempoEstimado}h estimadas</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Limitaciones del plan */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <AlertTriangle className="w-5 h-5" />
              Limitaciones del Plan Contador Externo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-700 mb-2">🚫 Funciones No Disponibles</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• IA de optimización fiscal avanzada</li>
                  <li>• Rankings automáticos de créditos fiscales</li>
                  <li>• Análisis predictivo de ahorro</li>
                  <li>• Dashboard multi-empresa avanzado</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-blue-700 mb-2">✅ Funciones Disponibles</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Gestión básica de empresas (máx 50)</li>
                  <li>• Declaraciones F29 automáticas</li>
                  <li>• Reportes básicos</li>
                  <li>• Calendario de vencimientos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vistaActual === 'empresas') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Empresas</h1>
            <p className="text-gray-600 mt-2">Gestión de {totalEmpresas} empresas asignadas</p>
          </div>
          <Button onClick={() => setVistaActual('dashboard')} variant="outline">
            Volver al Panel
          </Button>
        </div>

        <div className="grid gap-4">
          {empresasAsignadas.map((empresa) => (
            <Card key={empresa.id} className={`border-l-4 ${
              empresa.estado === 'al_dia' ? 'border-l-green-500' :
              empresa.estado === 'pendiente' ? 'border-l-yellow-500' :
              'border-l-red-500'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      empresa.estado === 'al_dia' ? 'bg-green-100' :
                      empresa.estado === 'pendiente' ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      <Building2 className={`w-6 h-6 ${
                        empresa.estado === 'al_dia' ? 'text-green-600' :
                        empresa.estado === 'pendiente' ? 'text-yellow-600' :
                        'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{empresa.nombre}</h3>
                      <p className="text-gray-600">{empresa.giro} • {empresa.rut}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">
                          Plan {empresa.planContratado}
                        </Badge>
                        <Badge className={`${
                          empresa.estado === 'al_dia' ? 'bg-green-100 text-green-800' :
                          empresa.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {empresa.estado.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ${empresa.ventasMensuales.toLocaleString('es-CL')}
                    </p>
                    <p className="text-sm text-gray-600">Ventas mensuales</p>
                    {empresa.ivaPendiente > 0 && (
                      <p className="text-sm text-red-600 font-semibold">
                        IVA pendiente: ${empresa.ivaPendiente.toLocaleString('es-CL')}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      {empresa.tareasPendientes} tareas pendientes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (vistaActual === 'tareas') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tareas Contables</h1>
            <p className="text-gray-600 mt-2">{tareasTotalesPendientes} tareas pendientes • {horasTrabajoEstimadas}h estimadas</p>
          </div>
          <Button onClick={() => setVistaActual('dashboard')} variant="outline">
            Volver al Panel
          </Button>
        </div>

        <div className="grid gap-4">
          {tareasContables.map((tarea) => {
            const empresa = empresasAsignadas.find(e => e.id === tarea.empresaId);
            const diasVencimiento = Math.ceil((new Date(tarea.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={tarea.id} className={`border-l-4 ${
                tarea.prioridad === 'alta' ? 'border-l-red-500' :
                tarea.prioridad === 'media' ? 'border-l-yellow-500' :
                'border-l-green-500'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        tarea.prioridad === 'alta' ? 'bg-red-100' :
                        tarea.prioridad === 'media' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <FileText className={`w-6 h-6 ${
                          tarea.prioridad === 'alta' ? 'text-red-600' :
                          tarea.prioridad === 'media' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{tarea.descripcion}</h3>
                        <p className="text-gray-600">{empresa?.nombre}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">
                            {tarea.tipo.replace('_', ' ')}
                          </Badge>
                          <Badge className={`${
                            tarea.estado === 'completada' ? 'bg-green-100 text-green-800' :
                            tarea.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {tarea.estado.replace('_', ' ')}
                          </Badge>
                          <Badge className={`${
                            tarea.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                            tarea.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {tarea.prioridad}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${
                        diasVencimiento <= 3 ? 'bg-red-100 text-red-800' :
                        diasVencimiento <= 7 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {diasVencimiento > 0 ? `${diasVencimiento} días` : 'Vencido'}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-2">
                        Vence: {new Date(tarea.fechaVencimiento).toLocaleDateString('es-CL')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Tiempo estimado: {tarea.tiempoEstimado}h
                      </p>                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => alert(`Detalles de: ${tarea.descripcion}\nEmpresa: ${empresa?.nombre}\nVencimiento: ${new Date(tarea.fechaVencimiento).toLocaleDateString('es-CL')}`)}
                        >
                          Ver Detalle
                        </Button>
                        {tarea.estado === 'pendiente' && (
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => iniciarTarea(tarea.id)}
                            disabled={tareaEnProceso === tarea.id}
                          >
                            {tareaEnProceso === tarea.id ? 'Iniciando...' : 'Iniciar'}
                          </Button>
                        )}
                        {tarea.estado === 'en_proceso' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => completarTarea(tarea.id)}
                          >
                            Completar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
