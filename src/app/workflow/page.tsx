'use client';

import { useState, useEffect, useCallback } from 'react';
import { TareaWorkflow, Contador, Empresa } from '@/types';
import { firmApi } from '@/data/store';
import { formatDateShort, calcularEficienciaContador } from '@/lib/utils';

export default function WorkflowPage() {
  const [tareas, setTareas] = useState<TareaWorkflow[]>([]);
  const [contadores, setContadores] = useState<Contador[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [filtroContador, setFiltroContador] = useState('');
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [vistaActual, setVistaActual] = useState<'kanban' | 'lista'>('kanban');
  const [isAssigning, setIsAssigning] = useState(false);

  const cargarDatos = useCallback(() => {
    setTareas(firmApi.getTareasWorkflow());
    setContadores(firmApi.getContadores());
    setEmpresas(firmApi.getEmpresas());
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const encontrarMejorContador = useCallback((tarea: TareaWorkflow, contadoresParam: Contador[]): Contador | null => {
    if (contadoresParam.length === 0) return null;

    // Calcular score para cada contador
    const contadoresConScore = contadoresParam.map(contador => {
      let score = 0;

      // Factor 1: Especialización (40%)
      if (contador.especialidad.includes(tarea.tipo)) {
        score += 0.4;
      }

      // Factor 2: Carga de trabajo (30%)
      const tareasAsignadas = tareas.filter(t => 
        t.contadorId === contador.id && 
        ['pendiente', 'en_proceso'].includes(t.estado)
      ).length;
      const factorCarga = Math.max(0, 1 - (tareasAsignadas / 10)); // Máximo 10 tareas
      score += factorCarga * 0.3;

      // Factor 3: Eficiencia histórica (20%)
      const eficiencia = calcularEficienciaContador(contador.id, tareas);
      score += eficiencia * 0.2;

      // Factor 4: Disponibilidad (10%)
      score += contador.activo ? 0.1 : 0;

      return { contador, score };
    });

    // Ordenar por score y retornar el mejor
    contadoresConScore.sort((a, b) => b.score - a.score);
    return contadoresConScore[0]?.contador || null;
  }, [tareas]);

  const iniciarAsignacionAutomatica = useCallback(async () => {
    setIsAssigning(true);
    
    try {
      const tareasPendientes = tareas.filter(t => t.estado === 'pendiente' && !t.contadorId);
      const contadoresDisponibles = contadores.filter(c => c.activo);

      for (const tarea of tareasPendientes) {
        // Algoritmo de asignación automática
        const mejorContador = encontrarMejorContador(tarea, contadoresDisponibles);
        
        if (mejorContador) {
          firmApi.updateTarea(tarea.id, {
            contadorId: mejorContador.id,
            estado: 'en_proceso'
          });
        }
      }

      cargarDatos();
    } catch (error) {
      console.error('Error en asignación automática:', error);
    } finally {
      setIsAssigning(false);
    }
  }, [tareas, contadores, cargarDatos, encontrarMejorContador]);

  const asignarTarea = (tareaId: string, contadorId: string) => {
    firmApi.updateTarea(tareaId, {
      contadorId,
      estado: 'en_proceso'
    });
    cargarDatos();
  };

  const cambiarEstadoTarea = (tareaId: string, nuevoEstado: string) => {
    const updates: Partial<TareaWorkflow> = { estado: nuevoEstado as 'pendiente' | 'en_proceso' | 'completada' | 'atrasada' };
    
    if (nuevoEstado === 'completada') {
      updates.fechaCompletado = new Date();
    }

    firmApi.updateTarea(tareaId, updates);
    cargarDatos();
  };

  const crearTareaMasiva = () => {
    // Crear tareas de declaración mensual para todas las empresas
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 15); // 15 días

    empresas.forEach(empresa => {
      const nuevaTarea: Omit<TareaWorkflow, 'id'> = {
        empresaId: empresa.id,
        contadorId: '',
        tipo: 'declaracion_f29',
        titulo: `Declaración F29 - ${empresa.razonSocial}`,
        descripcion: `Declaración mensual F29 - ${empresa.razonSocial}`,
        prioridad: 'media',
        estado: 'pendiente',
        fechaCreacion: new Date(),
        fechaVencimiento,
        estimacionHoras: 2,
        notas: '',
        documentosRequeridos: ['F29', 'Libro Diario'],
        dependencias: [],
        metadatos: {
          documentoId: empresa.id
        }
      };

      firmApi.createTareaWorkflow(nuevaTarea);
    });

    cargarDatos();
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'baja': return 'text-green-600 bg-green-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'alta': return 'text-orange-600 bg-orange-100';
      case 'urgente': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'text-gray-600 bg-gray-100';
      case 'en_proceso': return 'text-blue-600 bg-blue-100';
      case 'completada': return 'text-green-600 bg-green-100';
      case 'atrasada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Estados y prioridades disponibles
  const estados = ['pendiente', 'en_proceso', 'completada', 'atrasada'];
  const prioridades = ['baja', 'media', 'alta', 'urgente'];

  // Filtrar tareas
  const tareasFiltradas = tareas.filter(tarea => {
    if (filtroEstado && tarea.estado !== filtroEstado) return false;
    if (filtroPrioridad && tarea.prioridad !== filtroPrioridad) return false;
    if (filtroContador && tarea.contadorId !== filtroContador) return false;
    if (filtroEmpresa && tarea.empresaId !== filtroEmpresa) return false;
    return true;
  });

  const estadisticas = {
    total: tareas.length,
    pendientes: tareas.filter(t => t.estado === 'pendiente').length,
    enProgreso: tareas.filter(t => t.estado === 'en_proceso').length,
    completadas: tareas.filter(t => t.estado === 'completada').length,
    vencidas: tareas.filter(t => 
      new Date(t.fechaVencimiento) < new Date() && 
      !['completada'].includes(t.estado)
    ).length
  };

  const tareasPorEstado = {
    pendiente: tareasFiltradas.filter(t => t.estado === 'pendiente'),
    en_proceso: tareasFiltradas.filter(t => t.estado === 'en_proceso'),
    completada: tareasFiltradas.filter(t => t.estado === 'completada'),
    atrasada: tareasFiltradas.filter(t => t.estado === 'atrasada')
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Workflow
        </h1>
        <div className="flex gap-4">
          <button
            onClick={iniciarAsignacionAutomatica}
            disabled={isAssigning}
            className={`px-4 py-2 rounded-lg text-white ${
              isAssigning 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isAssigning ? '🔄 Asignando...' : '🤖 Asignación Automática'}
          </button>
          <button
            onClick={crearTareaMasiva}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📊 Crear Tareas F29
          </button>
          <div className="flex border rounded-lg">
            <button
              onClick={() => setVistaActual('kanban')}
              className={`px-4 py-2 rounded-l-lg ${
                vistaActual === 'kanban' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🗂️ Kanban
            </button>
            <button
              onClick={() => setVistaActual('lista')}
              className={`px-4 py-2 rounded-r-lg ${
                vistaActual === 'lista' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📋 Lista
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total</h3>
          <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Pendientes</h3>
          <p className="text-2xl font-bold text-gray-600">{estadisticas.pendientes}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">En Progreso</h3>
          <p className="text-2xl font-bold text-blue-600">{estadisticas.enProgreso}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Completadas</h3>
          <p className="text-2xl font-bold text-green-600">{estadisticas.completadas}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Vencidas</h3>
          <p className="text-2xl font-bold text-red-600">{estadisticas.vencidas}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>
                  {estado.replace('_', ' ').charAt(0).toUpperCase() + estado.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las prioridades</option>
              {prioridades.map(prioridad => (
                <option key={prioridad} value={prioridad}>
                  {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contador
            </label>
            <select
              value={filtroContador}
              onChange={(e) => setFiltroContador(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los contadores</option>
              {contadores.map(contador => (
                <option key={contador.id} value={contador.id}>
                  {contador.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa
            </label>
            <select
              value={filtroEmpresa}
              onChange={(e) => setFiltroEmpresa(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las empresas</option>
              {empresas.map(empresa => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.razonSocial}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFiltroEstado('');
                setFiltroPrioridad('');
                setFiltroContador('');
                setFiltroEmpresa('');
              }}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Vista Kanban */}
      {vistaActual === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {Object.entries(tareasPorEstado).map(([estado, tareasEstado]) => (
            <div key={estado} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                <span>
                  {estado.replace('_', ' ').charAt(0).toUpperCase() + estado.replace('_', ' ').slice(1)}
                </span>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {tareasEstado.length}
                </span>
              </h3>
              <div className="space-y-3">
                {tareasEstado.map((tarea) => {
                  const empresa = empresas.find(e => e.id === tarea.empresaId);
                  const contador = contadores.find(c => c.id === tarea.contadorId);
                  const esVencida = new Date(tarea.fechaVencimiento) < new Date() && 
                                   !['completada'].includes(tarea.estado);

                  return (
                    <div
                      key={tarea.id}
                      className={`bg-white p-3 rounded-lg shadow-sm border-l-4 ${
                        esVencida ? 'border-l-red-500' : 'border-l-blue-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                          {tarea.descripcion}
                        </h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadColor(tarea.prioridad)}`}>
                          {tarea.prioridad}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-2">
                        <div>📊 {empresa?.razonSocial}</div>
                        {contador && <div>👤 {contador.nombre}</div>}
                        <div className={esVencida ? 'text-red-600 font-semibold' : ''}>
                          📅 {formatDateShort(new Date(tarea.fechaVencimiento))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {tarea.tipo.replace('_', ' ')}
                        </span>
                        <div className="flex space-x-1">
                          {tarea.estado === 'pendiente' && (
                            <button
                              onClick={() => cambiarEstadoTarea(tarea.id, 'en_proceso')}
                              className="text-blue-600 hover:text-blue-900 text-xs"
                            >
                              ▶️
                            </button>
                          )}
                          {tarea.estado === 'en_proceso' && (
                            <button
                              onClick={() => cambiarEstadoTarea(tarea.id, 'completada')}
                              className="text-green-600 hover:text-green-900 text-xs"
                            >
                              ✅
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista Lista */}
      {vistaActual === 'lista' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarea
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tareasFiltradas.map((tarea) => {
                  const empresa = empresas.find(e => e.id === tarea.empresaId);
                  const contador = contadores.find(c => c.id === tarea.contadorId);
                  const esVencida = new Date(tarea.fechaVencimiento) < new Date() && 
                                   !['completada'].includes(tarea.estado);

                  return (
                    <tr key={tarea.id} className={`hover:bg-gray-50 ${esVencida ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {tarea.descripcion}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tarea.tipo.replace('_', ' ').charAt(0).toUpperCase() + tarea.tipo.replace('_', ' ').slice(1)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {empresa?.razonSocial}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contador?.nombre || 'Sin asignar'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadColor(tarea.prioridad)}`}>
                          {tarea.prioridad}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(tarea.estado)}`}>
                          {tarea.estado.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={esVencida ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                          {formatDateShort(new Date(tarea.fechaVencimiento))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {!tarea.contadorId && (
                            <select
                              onChange={(e) => asignarTarea(tarea.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="">Asignar</option>
                              {contadores.map(contador => (
                                <option key={contador.id} value={contador.id}>
                                  {contador.nombre}
                                </option>
                              ))}
                            </select>
                          )}
                          {tarea.estado !== 'completada' && (
                            <select
                              value={tarea.estado}
                              onChange={(e) => cambiarEstadoTarea(tarea.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              {estados.map(estado => (
                                <option key={estado} value={estado}>
                                  {estado.replace('_', ' ').charAt(0).toUpperCase() + estado.replace('_', ' ').slice(1)}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
