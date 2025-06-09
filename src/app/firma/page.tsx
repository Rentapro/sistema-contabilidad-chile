'use client';

import { useState, useEffect, useCallback } from 'react';
import { MetricasFirma, Empresa, TareaWorkflow, Contador } from '@/types';
import { firmApi } from '@/data/store';
import { formatearMoneda, calcularEficienciaContador } from '@/lib/utils';

export default function FirmaPage() {
  const [metricas, setMetricas] = useState<MetricasFirma>({
    totalEmpresas: 0,
    empresasActivas: 0,
    ingresosMensuales: 0,
    tareasPendientes: 0,
    tareasVencidas: 0,
    eficienciaPromedio: 0,
    satisfaccionClientes: 0,
    documentosProcesados: 0
  });
  
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [contadores, setContadores] = useState<Contador[]>([]);
  const [tareasCriticas, setTareasCriticas] = useState<TareaWorkflow[]>([]);
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'empresas' | 'contadores' | 'tareas'>('dashboard');

  useEffect(() => {
    cargarDatosFirma();
    // Simular datos iniciales si no existen
    if (firmApi.getEmpresas().length === 0) {
      generarDatosDemostracion();
    }
  }, [cargarDatosFirma, generarDatosDemostracion]);

  const calcularEficienciaPromedio = useCallback((contadores: Contador[], tareas: TareaWorkflow[]) => {
    if (contadores.length === 0) return 0;
    
    const eficiencias = contadores.map(contador => 
      calcularEficienciaContador(contador.id, tareas)
    );
    
    return eficiencias.reduce((sum, eff) => sum + eff, 0) / eficiencias.length;
  }, []);

  const cargarDatosFirma = useCallback(() => {
    const empresasData = firmApi.getEmpresas();
    const contadoresData = firmApi.getContadores();
    const tareasData = firmApi.getTareas();
    
    setEmpresas(empresasData);
    setContadores(contadoresData);
    
    // Filtrar tareas críticas
    const criticas = tareasData.filter((t: TareaWorkflow) => 
      t.prioridad === 'critica' || 
      (t.estado === 'atrasada' && t.prioridad === 'alta')
    ).slice(0, 10);
    setTareasCriticas(criticas);
    
    // Calcular métricas
    const empresasActivas = empresasData.filter((e: Empresa) => e.estado === 'activo').length;
    const tareasPendientes = tareasData.filter((t: TareaWorkflow) => t.estado === 'pendiente').length;
    const tareasVencidas = tareasData.filter((t: TareaWorkflow) => t.estado === 'atrasada').length;
    
    // Calcular ingresos mensuales basado en planes
    const ingresosMensuales = empresasData.reduce((total: number, empresa: Empresa) => {
      const tarifas = { basico: 150000, profesional: 350000, premium: 750000 };
      return total + (tarifas[empresa.plan as keyof typeof tarifas] || 0);
    }, 0);
    
    setMetricas({
      totalEmpresas: empresasData.length,
      empresasActivas,
      ingresosMensuales,
      tareasPendientes,
      tareasVencidas,
      eficienciaPromedio: calcularEficienciaPromedio(contadoresData, tareasData),
      satisfaccionClientes: 4.2, // Simulado
      documentosProcesados: empresasData.length * 45 // Promedio mensual
    });
  }, [calcularEficienciaPromedio]);

  const generarDatosDemostracion = useCallback(() => {
    // Generar contadores
    const contadoresDemostracion: Contador[] = [
      {
        id: 'c1',
        nombre: 'María González',
        email: 'maria@firma.cl',
        telefono: '+56912345678',
        especialidad: ['Primera Categoría', 'PyME'],
        empresasAsignadas: [],
        capacidadMaxima: 50,
        activo: true,
        fechaIngreso: new Date('2020-01-15')
      },
      {
        id: 'c2',
        nombre: 'Carlos Rodríguez',
        email: 'carlos@firma.cl',
        telefono: '+56987654321',
        especialidad: ['Segunda Categoría', 'Cooperativas'],
        empresasAsignadas: [],
        capacidadMaxima: 40,
        activo: true,
        fechaIngreso: new Date('2019-06-01')
      },
      {
        id: 'c3',
        nombre: 'Ana Silva',
        email: 'ana@firma.cl',
        telefono: '+56955443322',
        especialidad: ['Grandes Empresas', 'Holding'],
        empresasAsignadas: [],
        capacidadMaxima: 30,
        activo: true,
        fechaIngreso: new Date('2021-03-10')
      }
    ];

    contadoresDemostracion.forEach(contador => {
      firmApi.createContador(contador);
    });

    // Generar empresas clientes
    const empresasDemostracion: Empresa[] = [
      {
        id: 'e1',
        razonSocial: 'Tecnología Avanzada SpA',
        rut: '76543210-1',
        giro: 'Desarrollo de Software',
        direccion: 'Av. Libertador 1234, Santiago',
        telefono: '+56222334455',
        email: 'contacto@tecavanzada.cl',
        representanteLegal: 'Juan Pérez',
        tipoEmpresa: 'spa',
        regimen: 'primera_categoria',
        fechaConstitucion: new Date('2018-05-15'),
        fechaInicioActividades: new Date('2018-06-01'),
        plan: 'premium',
        estado: 'activo',
        contadorAsignado: 'c3',
        fechaRegistro: new Date('2023-01-15'),
        configuracion: {
          frecuenciaReportes: 'mensual',
          tiposImpuestos: ['F29', 'F22'],
          integraciónBancaria: true,
          notificacionesEmail: true
        }
      },
      {
        id: 'e2',
        razonSocial: 'Comercial Los Andes Ltda',
        rut: '78901234-5',
        giro: 'Comercio al por Mayor',
        direccion: 'Los Andes 567, Valparaíso',
        telefono: '+56322556677',
        email: 'info@losandes.cl',
        representanteLegal: 'María López',
        tipoEmpresa: 'limitada',
        regimen: 'pro_pyme',
        fechaConstitucion: new Date('2015-03-20'),
        fechaInicioActividades: new Date('2015-04-01'),
        plan: 'profesional',
        estado: 'activo',
        contadorAsignado: 'c1',
        fechaRegistro: new Date('2023-02-10'),
        configuracion: {
          frecuenciaReportes: 'mensual',
          tiposImpuestos: ['F29'],
          integraciónBancaria: false,
          notificacionesEmail: true
        }
      }
    ];

    empresasDemostracion.forEach(empresa => {
      firmApi.createEmpresa(empresa);
    });

    // Generar tareas de workflow
    const tareasWorkflow: TareaWorkflow[] = [
      {
        id: 't1',
        empresaId: 'e1',
        tipo: 'declaracion_f29',
        titulo: 'Declaración F29 Octubre 2024',
        descripcion: 'Presentar declaración mensual de IVA',
        fechaVencimiento: new Date('2024-11-12'),
        prioridad: 'alta',
        estado: 'pendiente',
        contadorAsignado: 'c3',
        estimacionHoras: 3,
        fechaCreacion: new Date(),
        notas: '',
        documentosRequeridos: ['Libro de Ventas', 'Libro de Compras'],
        dependencias: []
      },
      {
        id: 't2',
        empresaId: 'e2',
        tipo: 'cierre_mensual',
        titulo: 'Cierre Contable Octubre 2024',
        descripcion: 'Realizar cierre contable del mes',
        fechaVencimiento: new Date('2024-11-05'),
        prioridad: 'critica',
        estado: 'atrasada',
        contadorAsignado: 'c1',
        estimacionHoras: 6,
        fechaCreacion: new Date(),
        notas: 'Pendiente conciliación bancaria',
        documentosRequeridos: ['Cartola Bancaria', 'Facturas Pendientes'],
        dependencias: []
      }
    ];

    tareasWorkflow.forEach(tarea => {
      firmApi.createTarea(tarea);
    });

    cargarDatosFirma();
  }, [cargarDatosFirma]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Empresas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{metricas.empresasActivas}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">de {metricas.totalEmpresas} totales</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
              <p className="text-2xl font-bold text-gray-900">{formatearMoneda(metricas.ingresosMensuales)}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+12% vs mes anterior</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{metricas.tareasPendientes}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-red-500 mt-2">{metricas.tareasVencidas} vencidas</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eficiencia Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{metricas.eficienciaPromedio.toFixed(1)}%</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+5% vs mes anterior</p>
        </div>
      </div>

      {/* Tareas críticas */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Tareas Críticas</h3>
          <p className="text-sm text-gray-500">Requieren atención inmediata</p>
        </div>
        <div className="p-6">
          {tareasCriticas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay tareas críticas pendientes</p>
          ) : (
            <div className="space-y-4">
              {tareasCriticas.map((tarea) => (
                <div key={tarea.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{tarea.titulo}</h4>
                    <p className="text-sm text-gray-600">{empresas.find(e => e.id === tarea.empresaId)?.razonSocial}</p>
                    <p className="text-xs text-gray-500">Vence: {tarea.fechaVencimiento.toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      tarea.prioridad === 'critica' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {tarea.prioridad}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      tarea.estado === 'atrasada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tarea.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de productividad por contador */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Productividad por Contador</h3>
          <div className="space-y-4">
            {contadores.map((contador) => (
              <div key={contador.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{contador.nombre}</p>
                  <p className="text-xs text-gray-500">{contador.empresasAsignadas.length} empresas asignadas</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(contador.empresasAsignadas.length / contador.capacidadMaxima * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    {Math.round(contador.empresasAsignadas.length / contador.capacidadMaxima * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución por Plan</h3>
          <div className="space-y-4">
            {['basico', 'profesional', 'premium'].map((plan) => {
              const count = empresas.filter(e => e.plan === plan).length;
              const percentage = empresas.length > 0 ? (count / empresas.length * 100) : 0;
              return (
                <div key={plan} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{plan}</p>
                    <p className="text-xs text-gray-500">{count} empresas</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          plan === 'basico' ? 'bg-gray-600' : 
                          plan === 'profesional' ? 'bg-blue-600' : 'bg-green-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Centro de Control - Firma Contable
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Gestión automatizada de {metricas.totalEmpresas} empresas clientes
            </p>
          </div>
        </div>

        {/* Navegación */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: '📊' },
              { id: 'empresas', name: 'Empresas', icon: '🏢' },
              { id: 'contadores', name: 'Contadores', icon: '👥' },
              { id: 'tareas', name: 'Workflow', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setVistaActual(tab.id as 'dashboard' | 'empresas' | 'contadores' | 'tareas')}
                className={`${
                  vistaActual === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido */}
        {vistaActual === 'dashboard' && renderDashboard()}
        
        {vistaActual === 'empresas' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gestión de Empresas Clientes</h3>
            <p className="text-gray-600">Esta sección estará disponible próximamente...</p>
          </div>
        )}
        
        {vistaActual === 'contadores' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gestión del Equipo Contable</h3>
            <p className="text-gray-600">Esta sección estará disponible próximamente...</p>
          </div>
        )}
        
        {vistaActual === 'tareas' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Centro de Workflow Automatizado</h3>
            <p className="text-gray-600">Esta sección estará disponible próximamente...</p>
          </div>
        )}
      </div>
    </div>
  );
}
