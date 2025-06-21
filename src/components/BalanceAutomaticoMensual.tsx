'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { 
  Calculator, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Calendar,
  TrendingUp,
  DollarSign,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react';

interface BalanceItem {
  codigo: string;
  descripcion: string;
  montoF29: number;
  montoContable: number;
  diferencia: number;
  estado: 'cuadrado' | 'diferencia' | 'pendiente';
}

interface EstadoFinanciero {
  activos: {
    corrientes: number;
    noCorrientes: number;
    total: number;
  };
  pasivos: {
    corrientes: number;
    noCorrientes: number;
    total: number;
  };
  patrimonio: {
    capital: number;
    utilidades: number;
    total: number;
  };
}

interface RLI {
  ingresosBrutos: number;
  gastosAceptados: number;
  rentaLiquida: number;
  creditoCapacitacion: number;
  rentaLiquidaImponible: number;
  impuestoPrimeraCategoria: number;
  ppmliquidado: number;
  saldoAPagar: number;
}

export default function BalanceAutomaticoMensual() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('2025-06');
  const [cargando, setCargando] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());
  const { toasts, showSuccess, showInfo, showWarning, removeToast } = useToast();
  
  // Datos simulados del balance automático basado en F29
  const balanceItems: BalanceItem[] = [
    {
      codigo: '001',
      descripcion: 'Ventas Netas',
      montoF29: 45680000,
      montoContable: 45680000,
      diferencia: 0,
      estado: 'cuadrado'
    },
    {
      codigo: '002',
      descripcion: 'IVA Débito Fiscal',
      montoF29: 8678400,
      montoContable: 8678400,
      diferencia: 0,
      estado: 'cuadrado'
    },
    {
      codigo: '003',
      descripcion: 'Compras Netas',
      montoF29: 28900000,
      montoContable: 29150000,
      diferencia: -250000,
      estado: 'diferencia'
    },
    {
      codigo: '004',
      descripcion: 'IVA Crédito Fiscal',
      montoF29: 5491000,
      montoContable: 5536500,
      diferencia: -45500,
      estado: 'diferencia'
    },
    {
      codigo: '091',
      descripcion: 'PPM Mensual',
      montoF29: 456800,
      montoContable: 456800,
      diferencia: 0,
      estado: 'cuadrado'
    }
  ];

  // Estado financiero resumido
  const estadoFinanciero: EstadoFinanciero = {
    activos: {
      corrientes: 85600000,    // Caja, bancos, inventarios, cuentas por cobrar
      noCorrientes: 124300000, // Propiedades, equipos, inversiones a largo plazo
      total: 209900000
    },
    pasivos: {
      corrientes: 32800000,    // Proveedores, deudas corto plazo, impuestos por pagar
      noCorrientes: 45200000,  // Deudas bancarias largo plazo
      total: 78000000
    },
    patrimonio: {
      capital: 80000000,       // Capital inicial
      utilidades: 51900000,    // Utilidades acumuladas + del ejercicio
      total: 131900000
    }
  };

  // Cálculo RLI (Renta Líquida Imponible)
  const rli: RLI = {
    ingresosBrutos: 45680000,
    gastosAceptados: 32450000,
    rentaLiquida: 13230000,
    creditoCapacitacion: 228400, // 1% sobre remuneraciones
    rentaLiquidaImponible: 13001600,
    impuestoPrimeraCategoria: 3510432, // 27% sobre RLI
    ppmliquidado: 456800,
    saldoAPagar: 3053632
  };
  const cuadrarBalance = async () => {
    setCargando(true);
    // Simulación de proceso de cuadre automático
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUltimaActualizacion(new Date());
    setCargando(false);
  };
  const exportarPDF = async () => {
    showInfo('Generando PDF del balance automático...');
    // Simulación de exportación a PDF
    setTimeout(() => {
      showSuccess('PDF generado exitosamente. Descarga iniciada automáticamente.');
    }, 1500);
  };

  const enviarAlSII = async () => {
    showInfo('Enviando balance al Servicio de Impuestos Internos...');
    // Simulación de envío al SII
    setTimeout(() => {
      const folio = 'F29-' + Date.now().toString().slice(-6);
      showSuccess(`Balance enviado exitosamente al SII. Número de folio: ${folio}`);
    }, 2000);
  };

  const aprobarBalance = async () => {
    // Simulación de aprobación del balance
    const confirmed = confirm('¿Está seguro de aprobar este balance? Esta acción no se puede deshacer.');
    if (confirmed) {
      showSuccess('Balance aprobado exitosamente. Se ha registrado en el sistema.');
    }
  };

  const totalDiferencias = balanceItems.reduce((sum, item) => sum + Math.abs(item.diferencia), 0);
  const itemsCuadrados = balanceItems.filter(item => item.estado === 'cuadrado').length;
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Balance Automático Mensual
          </h1>
          <p className="text-gray-600 mt-1">
            Cuadre automático con información del F29 - Período {periodoSeleccionado}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✓ Integrado con SII
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              🤖 Cuadre Automático
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              📊 Para Contadores
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="2025-06">Junio 2025</option>
            <option value="2025-05">Mayo 2025</option>
            <option value="2025-04">Abril 2025</option>
          </select>
          <Button 
            onClick={cuadrarBalance} 
            disabled={cargando}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {cargando ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Cuadrando...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Cuadrar Balance
              </>
            )}
          </Button>
        </div>
      </div>      {/* Resumen de Estado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Items Cuadrados</p>
                <p className="text-2xl font-bold text-green-900">{itemsCuadrados}/{balanceItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Total Diferencias</p>
                <p className="text-xl font-bold text-red-900">${totalDiferencias.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Última Actualización</p>
                <p className="text-sm font-medium text-blue-900">
                  {ultimaActualizacion.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Precisión</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.round((itemsCuadrados / balanceItems.length) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banner Informativo para Contadores */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                🎯 Funcionalidades Especializadas para Contadores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-700 mb-1">⚖️ Balance Automático</h4>
                  <p className="text-amber-600">Se llena automáticamente con datos del F29 y se cuadra al instante. Sin errores manuales.</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-700 mb-1">📊 Estado Financiero</h4>
                  <p className="text-amber-600">Balance resumido automático con verificación de cuadre. Activos = Pasivos + Patrimonio.</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-700 mb-1">🧮 RLI Simplificada</h4>
                  <p className="text-amber-600">Cálculo automático de Renta Líquida Imponible con créditos y tasas actualizadas.</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-amber-600">
                💡 <strong>Ahorro de tiempo:</strong> Estas funcionalidades reducen el trabajo manual en un 80% y eliminan errores de cálculo.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Detallado F29 vs Contabilidad */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Balance Automático: F29 vs Contabilidad
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descripción</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Monto F29</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Monto Contable</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Diferencia</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {balanceItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{item.codigo}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.descripcion}</td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-gray-900">
                      ${item.montoF29.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-gray-900">
                      ${item.montoContable.toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono ${
                      item.diferencia === 0 ? 'text-gray-900' : 'text-red-600 font-bold'
                    }`}>
                      ${item.diferencia.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge 
                        variant={item.estado === 'cuadrado' ? 'default' : 'destructive'}
                        className={item.estado === 'cuadrado' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {item.estado === 'cuadrado' ? 'Cuadrado' : 'Diferencia'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Estado Financiero Resumido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Estado de Situación Financiera
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Activos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">ACTIVOS</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Activos Corrientes</span>
                    <span className="font-mono text-gray-900">${estadoFinanciero.activos.corrientes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Activos No Corrientes</span>
                    <span className="font-mono text-gray-900">${estadoFinanciero.activos.noCorrientes.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span className="text-gray-900">TOTAL ACTIVOS</span>
                    <span className="font-mono text-blue-600">${estadoFinanciero.activos.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Pasivos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">PASIVOS</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Pasivos Corrientes</span>
                    <span className="font-mono text-gray-900">${estadoFinanciero.pasivos.corrientes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Pasivos No Corrientes</span>
                    <span className="font-mono text-gray-900">${estadoFinanciero.pasivos.noCorrientes.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span className="text-gray-900">TOTAL PASIVOS</span>
                    <span className="font-mono text-red-600">${estadoFinanciero.pasivos.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Patrimonio */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">PATRIMONIO</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Capital</span>
                    <span className="font-mono text-gray-900">${estadoFinanciero.patrimonio.capital.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Utilidades Acumuladas</span>
                    <span className="font-mono text-gray-900">${estadoFinanciero.patrimonio.utilidades.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span className="text-gray-900">TOTAL PATRIMONIO</span>
                    <span className="font-mono text-green-600">${estadoFinanciero.patrimonio.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Verificación */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800">Verificación Balance:</span>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm font-bold text-green-700">
                      {estadoFinanciero.activos.total === (estadoFinanciero.pasivos.total + estadoFinanciero.patrimonio.total) 
                        ? 'CUADRADO' : 'DESCUADRADO'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RLI (Renta Líquida Imponible) */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
            <CardTitle className="flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              RLI - Renta Líquida Imponible
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Ingresos Brutos</label>
                  <div className="text-lg font-mono text-gray-900">${rli.ingresosBrutos.toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Gastos Aceptados</label>
                  <div className="text-lg font-mono text-red-600">-${rli.gastosAceptados.toLocaleString()}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Renta Líquida</span>
                  <span className="text-lg font-mono font-bold text-blue-600">${rli.rentaLiquida.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-800">Crédito Capacitación (1%)</span>
                  <span className="text-sm font-mono text-green-600">-${rli.creditoCapacitacion.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-green-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-800">RENTA LÍQUIDA IMPONIBLE</span>
                    <span className="text-xl font-mono font-bold text-green-900">${rli.rentaLiquidaImponible.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Impuesto 1ª Categoría (27%)</span>
                  <span className="font-mono text-red-600">${rli.impuestoPrimeraCategoria.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">PPM Liquidado</span>
                  <span className="font-mono text-green-600">-${rli.ppmliquidado.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">SALDO A PAGAR</span>
                  <span className="text-xl font-mono font-bold text-orange-600">${rli.saldoAPagar.toLocaleString()}</span>
                </div>
              </div>

              {/* Indicadores */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-blue-600 font-medium">Tasa Efectiva</div>
                  <div className="text-lg font-bold text-blue-800">
                    {((rli.saldoAPagar / rli.ingresosBrutos) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-purple-600 font-medium">Margen Neto</div>
                  <div className="text-lg font-bold text-purple-800">
                    {((rli.rentaLiquida / rli.ingresosBrutos) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>      {/* Acciones */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          className="flex items-center hover:bg-blue-50 hover:border-blue-300 transition-colors"
          onClick={exportarPDF}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center hover:bg-green-50 hover:border-green-300 transition-colors"
          onClick={enviarAlSII}
        >
          <FileText className="w-4 h-4 mr-2" />
          Enviar al SII
        </Button>
        <Button 
          className="bg-green-600 text-white hover:bg-green-700 flex items-center transition-colors"
          onClick={aprobarBalance}
        >
          <CheckCircle className="w-4 h-4 mr-2" />          Aprobar Balance
        </Button>
      </div>

      {/* Toast Container para notificaciones */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
