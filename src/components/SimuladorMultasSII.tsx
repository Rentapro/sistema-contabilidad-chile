'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp,
  Clock,
  FileText,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { 
  SimuladorMultas, 
  tiposMultas, 
  ejemplosMultas,
  UTM_ACTUAL,
  type MultaCalculada,
  type TipoMulta 
} from '@/data/simulador-multas';

export default function SimuladorMultasSII() {
  const [simulador] = useState(new SimuladorMultas(UTM_ACTUAL));
  const [tipoMultaSeleccionado, setTipoMultaSeleccionado] = useState<string>('');
  const [parametros, setParametros] = useState({
    impuestoAdeudado: 0,
    diasAtraso: 0,
    impuestoEstimado: 0
  });
  const [resultado, setResultado] = useState<MultaCalculada | null>(null);
  const [ejemploSeleccionado, setEjemploSeleccionado] = useState<string>('');
  const [vistaActual, setVistaActual] = useState<'calculadora' | 'ejemplos' | 'guia'>('calculadora');

  const calcularMulta = () => {
    if (!tipoMultaSeleccionado) return;
    
    try {
      const resultadoCalculado = simulador.calcularMulta(tipoMultaSeleccionado, parametros);
      setResultado(resultadoCalculado);
    } catch (error) {
      console.error('Error al calcular multa:', error);
    }
  };

  const cargarEjemplo = (ejemplo: string) => {
    const ejemploData = ejemplosMultas.find(e => e.escenario === ejemplo);
    if (ejemploData) {
      setTipoMultaSeleccionado(ejemploData.tipo);
      setParametros({
        impuestoAdeudado: ejemploData.impuestoAdeudado || 0,
        diasAtraso: ejemploData.diasAtraso || 0,
        impuestoEstimado: ejemploData.impuestoEstimado || 0
      });
      setEjemploSeleccionado(ejemplo);
    }
  };

  const limpiarCalculadora = () => {
    setTipoMultaSeleccionado('');
    setParametros({
      impuestoAdeudado: 0,
      diasAtraso: 0,
      impuestoEstimado: 0
    });
    setResultado(null);
    setEjemploSeleccionado('');
  };

  const tipoMultaActual = tiposMultas.find(t => t.id === tipoMultaSeleccionado);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧮 Simulador de Multas SII
          </h1>
          <p className="text-gray-600">
            Calcula multas, intereses y recargos tributarios antes de que ocurran
          </p>
        </div>

        {/* Información UTM */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">UTM Actual (Junio 2025)</h3>
                <p className="text-blue-700">
                  1 UTM = <span className="font-bold">${UTM_ACTUAL.toLocaleString('es-CL')}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navegación */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={vistaActual === 'calculadora' ? 'default' : 'outline'}
            onClick={() => setVistaActual('calculadora')}
            className="flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Calculadora
          </Button>
          <Button
            variant={vistaActual === 'ejemplos' ? 'default' : 'outline'}
            onClick={() => setVistaActual('ejemplos')}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Ejemplos Prácticos
          </Button>
          <Button
            variant={vistaActual === 'guia' ? 'default' : 'outline'}
            onClick={() => setVistaActual('guia')}
            className="flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Guía de Multas
          </Button>
        </div>

        {/* Vista Calculadora */}
        {vistaActual === 'calculadora' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel de Configuración */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Configurar Simulación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selección de Tipo de Multa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Multa
                  </label>
                  <div className="space-y-2">
                    {tiposMultas.map((tipo) => (
                      <div
                        key={tipo.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          tipoMultaSeleccionado === tipo.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setTipoMultaSeleccionado(tipo.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{tipo.nombre}</h4>
                            <p className="text-sm text-gray-600">{tipo.descripcion}</p>
                            <p className="text-xs text-gray-500 mt-1">{tipo.aplicacion}</p>
                          </div>
                          <Badge variant={tipo.base === 'porcentaje' ? 'default' : 'secondary'}>
                            {tipo.base === 'porcentaje' ? `${tipo.valor}%` : `${tipo.valor} UTM`}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parámetros según el tipo seleccionado */}
                {tipoMultaActual && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Parámetros</h4>
                    
                    {(tipoMultaActual.id === 'declaracion_tardia' || 
                      tipoMultaActual.id === 'pago_tardio') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Impuesto Adeudado ($)
                        </label>
                        <input
                          type="number"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          value={parametros.impuestoAdeudado}
                          onChange={(e) => setParametros(prev => ({
                            ...prev,
                            impuestoAdeudado: Number(e.target.value)
                          }))}
                          placeholder="Ej: 850000"
                        />
                      </div>
                    )}

                    {tipoMultaActual.id === 'no_declaracion' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Impuesto Estimado ($)
                        </label>
                        <input
                          type="number"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          value={parametros.impuestoEstimado}
                          onChange={(e) => setParametros(prev => ({
                            ...prev,
                            impuestoEstimado: Number(e.target.value)
                          }))}
                          placeholder="Ej: 2500000"
                        />
                      </div>
                    )}

                    {tipoMultaActual.id !== 'no_declaracion' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Días de Atraso
                        </label>
                        <input
                          type="number"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          value={parametros.diasAtraso}
                          onChange={(e) => setParametros(prev => ({
                            ...prev,
                            diasAtraso: Number(e.target.value)
                          }))}
                          placeholder="Ej: 15"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-3">
                  <Button 
                    onClick={calcularMulta} 
                    disabled={!tipoMultaSeleccionado}
                    className="flex-1"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcular
                  </Button>
                  <Button variant="outline" onClick={limpiarCalculadora}>
                    Limpiar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Panel de Resultados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Resultado de la Simulación
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resultado ? (
                  <div className="space-y-6">
                    {/* Resumen del Cálculo */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{resultado.tipo}</h4>
                      <p className="text-gray-700">{resultado.descripcion}</p>
                    </div>

                    {/* Desglose Financiero */}
                    <div className="space-y-3">
                      {resultado.baseCalculo > 0 && (
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="text-gray-600">Base de Cálculo:</span>
                          <span className="font-semibold">
                            ${resultado.baseCalculo.toLocaleString('es-CL')}
                          </span>
                        </div>
                      )}

                      {resultado.porcentaje && (
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="text-gray-600">Porcentaje Aplicado:</span>
                          <span className="font-semibold">{resultado.porcentaje}%</span>
                        </div>
                      )}

                      {resultado.utm && (
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="text-gray-600">UTM Aplicadas:</span>
                          <span className="font-semibold">
                            {resultado.utm} UTM (${(resultado.utm * UTM_ACTUAL).toLocaleString('es-CL')})
                          </span>
                        </div>
                      )}

                      {resultado.diasAtraso > 0 && (
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="text-gray-600">Días de Atraso:</span>
                          <span className="font-semibold">{resultado.diasAtraso} días</span>
                        </div>
                      )}

                      {resultado.intereses > 0 && (
                        <div className="flex justify-between items-center p-3 border rounded-lg bg-yellow-50">
                          <span className="text-gray-600">Intereses:</span>
                          <span className="font-semibold text-yellow-700">
                            ${resultado.intereses.toLocaleString('es-CL')}
                          </span>
                        </div>
                      )}

                      {resultado.montoMulta > 0 && (
                        <div className="flex justify-between items-center p-3 border rounded-lg bg-red-50">
                          <span className="text-gray-600">Multa:</span>
                          <span className="font-semibold text-red-700">
                            ${resultado.montoMulta.toLocaleString('es-CL')}
                          </span>
                        </div>
                      )}

                      {/* Total Final */}
                      <div className="flex justify-between items-center p-4 border-2 border-gray-300 rounded-lg bg-gray-100">
                        <span className="text-lg font-semibold text-gray-800">TOTAL A PAGAR:</span>
                        <span className="text-2xl font-bold text-gray-900">
                          ${resultado.montoTotal.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>

                    {/* Recomendaciones */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-2">💡 Recomendaciones</h5>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Regulariza tu situación lo antes posible para evitar mayores costos</li>
                        <li>• Los intereses se siguen acumulando hasta el pago total</li>
                        <li>• Considera solicitar una facilidad de pago si el monto es alto</li>
                        <li>• Mantén al día tus declaraciones para evitar futuras multas</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Selecciona un tipo de multa y completa los parámetros
                    </h3>
                    <p className="text-gray-500">
                      El resultado aparecerá aquí cuando hagas el cálculo
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Vista Ejemplos */}
        {vistaActual === 'ejemplos' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ejemplos Prácticos de Multas</CardTitle>
                <p className="text-gray-600">Casos comunes y sus cálculos</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ejemplosMultas.map((ejemplo, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        ejemploSeleccionado === ejemplo.escenario 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        cargarEjemplo(ejemplo.escenario);
                        setVistaActual('calculadora');
                      }}
                    >
                      <h4 className="font-semibold mb-2">{ejemplo.escenario}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {ejemplo.impuestoAdeudado && (
                          <div>Impuesto: ${ejemplo.impuestoAdeudado.toLocaleString('es-CL')}</div>
                        )}
                        {ejemplo.impuestoEstimado && (
                          <div>Estimado: ${ejemplo.impuestoEstimado.toLocaleString('es-CL')}</div>
                        )}
                        {ejemplo.diasAtraso && (
                          <div>Atraso: {ejemplo.diasAtraso} días</div>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        Usar este ejemplo
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Vista Guía */}
        {vistaActual === 'guia' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Guía Completa de Multas SII
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tiposMultas.map((tipo) => (
                    <div key={tipo.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">{tipo.nombre}</h3>
                      <p className="text-gray-700 mb-3">{tipo.descripcion}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-500">Cálculo:</span>
                          <div className="font-medium">
                            {tipo.base === 'porcentaje' ? `${tipo.valor}%` : `${tipo.valor} UTM`}
                            {tipo.minimo && ` (mín: ${tipo.minimo} UTM)`}
                            {tipo.maximo && ` (máx: ${tipo.maximo} UTM)`}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Aplicación:</span>
                          <div className="font-medium">{tipo.aplicacion}</div>
                        </div>
                      </div>

                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium text-yellow-800">Cómo evitarla: </span>
                          <span className="text-yellow-700">
                            {tipo.id === 'declaracion_tardia' && 'Presenta tus declaraciones antes del vencimiento'}
                            {tipo.id === 'pago_tardio' && 'Paga tus impuestos en las fechas establecidas'}
                            {tipo.id === 'libro_tardio' && 'Mantén al día tu libro de compras y ventas'}
                            {tipo.id === 'no_declaracion' && 'No olvides presentar todas tus declaraciones'}
                            {tipo.id === 'contabilidad_incompleta' && 'Lleva tu contabilidad completa y ordenada'}
                            {tipo.id === 'documento_invalido' && 'Usa solo documentos autorizados por el SII'}
                          </span>
                        </div>
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
