'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { api, initializeData } from '@/data/store';
import { Factura, Gasto } from '@/types';

export default function SIIPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [periodo, setPeriodo] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Datos del formulario F29
  const [datosF29] = useState({
    ventasAfectas: 0,
    ventasExentas: 0,
    ivaDebito: 0,
    comprasAfectas: 0,
    ivaCredito: 0,
    ivaRetenido: 0,
    otrosImpuestos: 0,
    ppmVoluntario: 0,
    creditoAnterior: 0
  });

  // Datos del formulario F22
  const [datosF22] = useState({
    ingresosBrutos: 0,
    costosDirectos: 0,
    gastosAdministracion: 0,
    gastosVentas: 0,
    depreciacion: 0,
    amortizacion: 0,
    otrosGastos: 0,
    ingresoNoConstitutivos: 0,
    deduccionesEspeciales: 0,
    perdidaAnterior: 0,
    creditosPagados: 0
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setEmpresas(firmApi.getEmpresas());
    // En una implementación real, cargaríamos las declaraciones desde el store
    setDeclaraciones([]);
  };

  const generarDeclaracionAutomatica = async () => {
    if (!selectedEmpresa) return;

    setIsGenerating(true);
    
    try {
      const empresa = empresas.find(e => e.id === selectedEmpresa);
      if (!empresa) return;

      // Simular obtención de datos contables
      await new Promise(resolve => setTimeout(resolve, 2000));

      let datosFormulario: Record<string, number> = {};
      let montoImpuesto = 0;

      if (selectedTipo === 'F29') {
        // Cálculos automáticos para F29
        const ventasAfectas = Math.floor(Math.random() * 10000000) + 1000000;
        const ivaDebito = ventasAfectas * 0.19;
        const comprasAfectas = ventasAfectas * 0.6;
        const ivaCredito = comprasAfectas * 0.19;
        const ivaAPagar = Math.max(0, ivaDebito - ivaCredito);

        datosFormulario = {
          ...datosF29,
          ventasAfectas,
          ivaDebito,
          comprasAfectas,
          ivaCredito
        };

        montoImpuesto = ivaAPagar;

      } else if (selectedTipo === 'F22') {
        // Cálculos automáticos para F22
        const ingresosBrutos = Math.floor(Math.random() * 50000000) + 5000000;
        const costosDirectos = ingresosBrutos * 0.4;
        const gastosOperacionales = ingresosBrutos * 0.3;
        const utilidadTributaria = ingresosBrutos - costosDirectos - gastosOperacionales;
        const impuestoPrimeraCategoria = utilidadTributaria * 0.25; // 25%

        datosFormulario = {
          ...datosF22,
          ingresosBrutos,
          costosDirectos,
          gastosAdministracion: gastosOperacionales * 0.6,
          gastosVentas: gastosOperacionales * 0.4
        };

        montoImpuesto = impuestoPrimeraCategoria;
      }

      const nuevaDeclaracion: DeclaracionTributaria = {
        id: Date.now().toString(),
        empresaId: selectedEmpresa,
        tipo: selectedTipo,
        periodo: selectedPeriodo,
        estado: 'borrador',
        fechaCreacion: new Date(),
        datosFormulario,
        montoImpuesto,
        totalAPagar: montoImpuesto
      };

      setDeclaraciones([...declaraciones, nuevaDeclaracion]);
      setDeclaracionActual(nuevaDeclaracion);

      // Crear tarea de revisión
      const nuevaTarea: Omit<TareaWorkflow, 'id'> = {
        empresaId: selectedEmpresa,
        contadorId: '',
        tipo: 'declaracion_f29',
        titulo: `Declaración ${selectedTipo} - ${empresa.razonSocial}`,
        descripcion: `Revisar declaración ${selectedTipo} - ${empresa.razonSocial}`,
        prioridad: 'alta',
        estado: 'pendiente',
        fechaCreacion: new Date(),
        fechaVencimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
        estimacionHoras: 2,
        notas: '',
        documentosRequeridos: [],
        dependencias: [],
        metadatos: {
          documentoId: nuevaDeclaracion.id,
          tipoValidacion: selectedTipo
        }
      };

      firmApi.createTareaWorkflow(nuevaTarea);

    } catch (error) {
      console.error('Error generando declaración:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const validarDeclaracion = (declaracionId: string) => {
    setDeclaraciones(declaraciones.map(d => 
      d.id === declaracionId 
        ? { ...d, estado: 'validada' as const }
        : d
    ));
  };

  const presentarDeclaracion = (declaracionId: string) => {
    setDeclaraciones(declaraciones.map(d => 
      d.id === declaracionId 
        ? { 
            ...d, 
            estado: 'presentada' as const,
            fechaPresentacion: new Date()
          }
        : d
    ));
  };

  const calcularTotalF29 = (datos: Record<string, number>) => {
    const ivaAPagar = Math.max(0, (datos.ivaDebito || 0) - (datos.ivaCredito || 0) - (datos.ivaRetenido || 0));
    return ivaAPagar + (datos.otrosImpuestos || 0) + (datos.ppmVoluntario || 0) - (datos.creditoAnterior || 0);
  };

  const calcularTotalF22 = (datos: Record<string, number>) => {
    const utilidadTributaria = (datos.ingresosBrutos || 0) - (datos.costosDirectos || 0) - 
      (datos.gastosAdministracion || 0) - (datos.gastosVentas || 0) - (datos.depreciacion || 0) - 
      (datos.amortizacion || 0) - (datos.otrosGastos || 0) + (datos.ingresoNoConstitutivos || 0) - 
      (datos.deduccionesEspeciales || 0) - (datos.perdidaAnterior || 0);
    
    const impuestoPrimeraCategoria = Math.max(0, utilidadTributaria * 0.25);
    return Math.max(0, impuestoPrimeraCategoria - (datos.creditosPagados || 0));
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'borrador': return 'text-gray-600 bg-gray-100';
      case 'validada': return 'text-blue-600 bg-blue-100';
      case 'presentada': return 'text-green-600 bg-green-100';
      case 'aceptada': return 'text-green-800 bg-green-200';
      case 'rechazada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const estadisticas = {
    totalDeclaraciones: declaraciones.length,
    borradores: declaraciones.filter(d => d.estado === 'borrador').length,
    validadas: declaraciones.filter(d => d.estado === 'validada').length,
    presentadas: declaraciones.filter(d => d.estado === 'presentada').length,
    montoTotalImpuestos: declaraciones.reduce((sum, d) => sum + d.totalAPagar, 0)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Declaraciones Tributarias
        </h1>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total</h3>
          <p className="text-2xl font-bold text-gray-900">{estadisticas.totalDeclaraciones}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Borradores</h3>
          <p className="text-2xl font-bold text-gray-600">{estadisticas.borradores}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Validadas</h3>
          <p className="text-2xl font-bold text-blue-600">{estadisticas.validadas}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Presentadas</h3>
          <p className="text-2xl font-bold text-green-600">{estadisticas.presentadas}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Impuestos</h3>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(estadisticas.montoTotalImpuestos)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generador de Declaraciones */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            🏛️ Generar Nueva Declaración
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <select
                value={selectedEmpresa}
                onChange={(e) => setSelectedEmpresa(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar empresa</option>
                {empresas.map(empresa => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.razonSocial} - {formatRUT(empresa.rut)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Formulario
              </label>
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value as 'F29' | 'F22' | 'DJ1847' | 'DJ1879')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="F29">F29 - Declaración Mensual IVA</option>
                <option value="F22">F22 - Declaración Anual Renta</option>
                <option value="DJ1847">DJ1847 - Declaración Jurada Anual</option>
                <option value="DJ1879">DJ1879 - Declaración Jurada Mensual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <input
                type="month"
                value={selectedPeriodo}
                onChange={(e) => setSelectedPeriodo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={generarDeclaracionAutomatica}
              disabled={!selectedEmpresa || isGenerating}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                !selectedEmpresa || isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isGenerating ? '🔄 Generando...' : '🚀 Generar Declaración Automática'}
            </button>
          </div>

          {/* Información del formulario seleccionado */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Información del Formulario {selectedTipo}
            </h3>
            {selectedTipo === 'F29' && (
              <div className="text-sm text-gray-600">
                <p>• Declaración mensual de IVA</p>
                <p>• Vencimiento: día 12 del mes siguiente</p>
                <p>• Incluye ventas afectas, exentas y crédito fiscal</p>
              </div>
            )}
            {selectedTipo === 'F22' && (
              <div className="text-sm text-gray-600">
                <p>• Declaración anual de impuesto a la renta</p>
                <p>• Vencimiento: 30 de abril</p>
                <p>• Primera categoría para empresas</p>
              </div>
            )}
            {selectedTipo === 'DJ1847' && (
              <div className="text-sm text-gray-600">
                <p>• Declaración jurada anual de facturación</p>
                <p>• Para empresas acogidas a régimen simplificado</p>
                <p>• Vencimiento: 31 de marzo</p>
              </div>
            )}
            {selectedTipo === 'DJ1879' && (
              <div className="text-sm text-gray-600">
                <p>• Declaración jurada mensual de ventas</p>
                <p>• Para empresas con ventas superiores a UF 2.400</p>
                <p>• Vencimiento: día 20 del mes siguiente</p>
              </div>
            )}
          </div>
        </div>

        {/* Editor de Declaración */}
        {declaracionActual && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                📝 Formulario {declaracionActual.tipo}
              </h2>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getEstadoColor(declaracionActual.estado)}`}>
                {declaracionActual.estado.charAt(0).toUpperCase() + declaracionActual.estado.slice(1)}
              </span>
            </div>

            {declaracionActual.tipo === 'F29' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ventas Afectas
                    </label>
                    <input
                      type="number"
                      value={declaracionActual.datosFormulario.ventasAfectas}
                      onChange={(e) => setDeclaracionActual({
                        ...declaracionActual,
                        datosFormulario: {
                          ...declaracionActual.datosFormulario,
                          ventasAfectas: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IVA Débito
                    </label>
                    <input
                      type="number"
                      value={declaracionActual.datosFormulario.ivaDebito}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compras Afectas
                    </label>
                    <input
                      type="number"
                      value={declaracionActual.datosFormulario.comprasAfectas}
                      onChange={(e) => setDeclaracionActual({
                        ...declaracionActual,
                        datosFormulario: {
                          ...declaracionActual.datosFormulario,
                          comprasAfectas: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IVA Crédito
                    </label>
                    <input
                      type="number"
                      value={declaracionActual.datosFormulario.ivaCredito}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total a Pagar:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(calcularTotalF29(declaracionActual.datosFormulario))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {declaracionActual.tipo === 'F22' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ingresos Brutos
                    </label>
                    <input
                      type="number"
                      value={declaracionActual.datosFormulario.ingresosBrutos}
                      onChange={(e) => setDeclaracionActual({
                        ...declaracionActual,
                        datosFormulario: {
                          ...declaracionActual.datosFormulario,
                          ingresosBrutos: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Costos Directos
                    </label>
                    <input
                      type="number"
                      value={declaracionActual.datosFormulario.costosDirectos}
                      onChange={(e) => setDeclaracionActual({
                        ...declaracionActual,
                        datosFormulario: {
                          ...declaracionActual.datosFormulario,
                          costosDirectos: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gastos Administración
                    </label>
                    <input
                      type="number"
                      value={declaracionActual.datosFormulario.gastosAdministracion}
                      onChange={(e) => setDeclaracionActual({
                        ...declaracionActual,
                        datosFormulario: {
                          ...declaracionActual.datosFormulario,
                          gastosAdministracion: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gastos de Ventas
                    </label>
                    <input
                      type="number"
                      value={declaracionActual.datosFormulario.gastosVentas}
                      onChange={(e) => setDeclaracionActual({
                        ...declaracionActual,
                        datosFormulario: {
                          ...declaracionActual.datosFormulario,
                          gastosVentas: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Impuesto Primera Categoría:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(calcularTotalF22(declaracionActual.datosFormulario))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4 mt-6">
              {declaracionActual.estado === 'borrador' && (
                <button
                  onClick={() => validarDeclaracion(declaracionActual.id)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  ✅ Validar Declaración
                </button>
              )}
              {declaracionActual.estado === 'validada' && (
                <button
                  onClick={() => presentarDeclaracion(declaracionActual.id)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  🏛️ Presentar al SII
                </button>
              )}
              <button
                onClick={() => setDeclaracionActual(null)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                📋 Ver Lista
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Declaraciones */}
      {!declaracionActual && declaraciones.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              📊 Declaraciones Recientes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formulario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {declaraciones.map((declaracion) => {
                  const empresa = empresas.find(e => e.id === declaracion.empresaId);
                  return (
                    <tr key={declaracion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {empresa?.razonSocial}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {declaracion.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {declaracion.periodo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(declaracion.estado)}`}>
                          {declaracion.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(declaracion.totalAPagar)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateShort(declaracion.fechaCreacion)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setDeclaracionActual(declaracion)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
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
