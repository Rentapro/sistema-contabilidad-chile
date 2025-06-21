'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MovimientoBanco {
  id: string;
  fecha: string;
  descripcion: string;
  referencia: string;
  debito: number;
  credito: number;
  saldo: number;
  conciliado: boolean;
  tipo: 'transferencia' | 'cheque' | 'deposito' | 'comision' | 'interes';
}

interface MovimientoContable {
  id: string;
  fecha: string;
  concepto: string;
  documento: string;
  debito: number;
  credito: number;
  conciliado: boolean;
}

const ConciliacionBancaria = () => {
  const [movimientosBanco, setMovimientosBanco] = useState<MovimientoBanco[]>([]);
  const [movimientosContables, setMovimientosContables] = useState<MovimientoContable[]>([]);
  const [bancoSeleccionado, setBancoSeleccionado] = useState('banco-chile');
  const [fechaConciliacion, setFechaConciliacion] = useState('2025-06-15');
  const [saldoLibro, setSaldoLibro] = useState(15420000);
  const [saldoBanco, setSaldoBanco] = useState(15890000);

  // Datos de ejemplo
  useEffect(() => {
    const movimientosBancoEjemplo: MovimientoBanco[] = [
      {
        id: 'b1',
        fecha: '2025-06-15',
        descripcion: 'TRANSFERENCIA RECIBIDA - CLIENTE ABC LTDA',
        referencia: 'TRF001234',
        debito: 0,
        credito: 1190000,
        saldo: 15890000,
        conciliado: true,
        tipo: 'transferencia'
      },
      {
        id: 'b2',
        fecha: '2025-06-14',
        descripcion: 'CHEQUE N° 001234 - PROVEEDOR SUMINISTROS',
        referencia: 'CHQ001234',
        debito: 350000,
        credito: 0,
        saldo: 14700000,
        conciliado: false,
        tipo: 'cheque'
      },
      {
        id: 'b3',
        fecha: '2025-06-14',
        descripcion: 'COMISION MANTENIMIENTO CUENTA',
        referencia: 'COM-JUN25',
        debito: 15000,
        credito: 0,
        saldo: 15050000,
        conciliado: false,
        tipo: 'comision'
      },
      {
        id: 'b4',
        fecha: '2025-06-13',
        descripcion: 'DEPOSITO EN EFECTIVO',
        referencia: 'DEP-001',
        debito: 0,
        credito: 500000,
        saldo: 15065000,
        conciliado: true,
        tipo: 'deposito'
      },
      {
        id: 'b5',
        fecha: '2025-06-12',
        descripcion: 'TRANSFERENCIA ENVIADA - PAGO NOMINA',
        referencia: 'TRF005678',
        debito: 2200000,
        credito: 0,
        saldo: 14565000,
        conciliado: true,
        tipo: 'transferencia'
      }
    ];

    const movimientosContablesEjemplo: MovimientoContable[] = [
      {
        id: 'c1',
        fecha: '2025-06-15',
        concepto: 'Cobro Factura 001 - Cliente ABC Ltda',
        documento: 'FAC-001',
        debito: 1190000,
        credito: 0,
        conciliado: true
      },
      {
        id: 'c2',
        fecha: '2025-06-14',
        concepto: 'Pago Proveedor - Suministros Oficina',
        documento: 'CHQ-001234',
        debito: 0,
        credito: 350000,
        conciliado: false
      },
      {
        id: 'c3',
        fecha: '2025-06-13',
        concepto: 'Depósito ventas efectivo',
        documento: 'DEP-001',
        debito: 500000,
        credito: 0,
        conciliado: true
      },
      {
        id: 'c4',
        fecha: '2025-06-12',
        concepto: 'Pago nómina empleados',
        documento: 'NOM-JUN25',
        debito: 0,
        credito: 2200000,
        conciliado: true
      },
      {
        id: 'c5',
        fecha: '2025-06-10',
        concepto: 'Ingreso por servicios profesionales',
        documento: 'FAC-002',
        debito: 890000,
        credito: 0,
        conciliado: false
      }
    ];

    setMovimientosBanco(movimientosBancoEjemplo);
    setMovimientosContables(movimientosContablesEjemplo);
  }, []);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const getTipoBadge = (tipo: string) => {
    const badges: Record<string, JSX.Element> = {
      transferencia: <Badge className="bg-blue-100 text-blue-800">💸 Transferencia</Badge>,
      cheque: <Badge className="bg-yellow-100 text-yellow-800">📄 Cheque</Badge>,
      deposito: <Badge className="bg-green-100 text-green-800">💰 Depósito</Badge>,
      comision: <Badge className="bg-red-100 text-red-800">💳 Comisión</Badge>,
      interes: <Badge className="bg-purple-100 text-purple-800">📈 Interés</Badge>
    };
    return badges[tipo] || <Badge>{tipo}</Badge>;
  };

  const conciliarMovimiento = (id: string, esBanco: boolean) => {
    if (esBanco) {
      setMovimientosBanco(prev =>
        prev.map(mov => mov.id === id ? { ...mov, conciliado: !mov.conciliado } : mov)
      );
    } else {
      setMovimientosContables(prev =>
        prev.map(mov => mov.id === id ? { ...mov, conciliado: !mov.conciliado } : mov)
      );
    }
  };

  const calcularEstadisticas = () => {
    const movimientosBancoNoConciliados = movimientosBanco.filter(m => !m.conciliado);
    const movimientosContablesNoConciliados = movimientosContables.filter(m => !m.conciliado);
    
    const diferenciaBanco = movimientosBancoNoConciliados.reduce((acc, mov) => 
      acc + (mov.credito - mov.debito), 0
    );
    
    const diferenciaContable = movimientosContablesNoConciliados.reduce((acc, mov) => 
      acc + (mov.debito - mov.credito), 0
    );

    const diferenciaNeta = (saldoBanco + diferenciaBanco) - (saldoLibro + diferenciaContable);

    return {
      movimientosBancoNoConciliados: movimientosBancoNoConciliados.length,
      movimientosContablesNoConciliados: movimientosContablesNoConciliados.length,
      diferenciaBanco,
      diferenciaContable,
      diferenciaNeta,
      saldoAjustadoBanco: saldoBanco + diferenciaBanco,
      saldoAjustadoContable: saldoLibro + diferenciaContable
    };
  };

  const estadisticas = calcularEstadisticas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🏦 Conciliación Bancaria
              </h1>
              <p className="text-gray-600 text-lg">
                Reconciliación automática de movimientos bancarios y contables
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {estadisticas.diferenciaNeta === 0 ? '✅ Conciliado' : '⚠️ Pendiente'}
              </div>
              <div className="text-sm text-gray-500">Fecha: {fechaConciliacion}</div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">🔧 Configuración de Conciliación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banco
                </label>
                <Select value={bancoSeleccionado} onValueChange={setBancoSeleccionado}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banco-chile">Banco de Chile</SelectItem>
                    <SelectItem value="banco-estado">Banco Estado</SelectItem>
                    <SelectItem value="santander">Santander</SelectItem>
                    <SelectItem value="bci">BCI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Conciliación
                </label>
                <Input
                  type="date"
                  value={fechaConciliacion}
                  onChange={(e) => setFechaConciliacion(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  🔄 Importar Cartola
                </Button>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  📊 Generar Reporte
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Saldos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <span className="text-2xl mr-2">🏦</span>
                Saldo Banco
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatearMoneda(saldoBanco)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Según cartola bancaria
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Saldo Libro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatearMoneda(saldoLibro)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Según contabilidad
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <span className="text-2xl mr-2">⚖️</span>
                Diferencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${estadisticas.diferenciaNeta === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatearMoneda(Math.abs(estadisticas.diferenciaNeta))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {estadisticas.diferenciaNeta === 0 ? 'Perfecto balance' : 'Requiere ajustes'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <span className="text-2xl mr-2">📋</span>
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {estadisticas.movimientosBancoNoConciliados + estadisticas.movimientosContablesNoConciliados}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Movimientos por conciliar
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Movimientos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Movimientos Bancarios */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">
                🏦 Movimientos Bancarios
              </CardTitle>
              <CardDescription>
                {movimientosBanco.length} movimientos • {estadisticas.movimientosBancoNoConciliados} pendientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {movimientosBanco.map((movimiento) => (
                  <div
                    key={movimiento.id}
                    className={`p-4 rounded-lg border-2 ${
                      movimiento.conciliado 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {movimiento.descripcion}
                        </div>
                        <div className="text-sm text-gray-500">
                          {movimiento.fecha} • {movimiento.referencia}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={movimiento.conciliado ? "default" : "outline"}
                        onClick={() => conciliarMovimiento(movimiento.id, true)}
                        className="ml-2"
                      >
                        {movimiento.conciliado ? '✅' : '⭕'}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTipoBadge(movimiento.tipo)}
                      </div>
                      <div className="text-right">
                        {movimiento.debito > 0 && (
                          <div className="text-red-600 font-medium">
                            -{formatearMoneda(movimiento.debito)}
                          </div>
                        )}
                        {movimiento.credito > 0 && (
                          <div className="text-green-600 font-medium">
                            +{formatearMoneda(movimiento.credito)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Movimientos Contables */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">
                📚 Movimientos Contables
              </CardTitle>
              <CardDescription>
                {movimientosContables.length} movimientos • {estadisticas.movimientosContablesNoConciliados} pendientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {movimientosContables.map((movimiento) => (
                  <div
                    key={movimiento.id}
                    className={`p-4 rounded-lg border-2 ${
                      movimiento.conciliado 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {movimiento.concepto}
                        </div>
                        <div className="text-sm text-gray-500">
                          {movimiento.fecha} • {movimiento.documento}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={movimiento.conciliado ? "default" : "outline"}
                        onClick={() => conciliarMovimiento(movimiento.id, false)}
                        className="ml-2"
                      >
                        {movimiento.conciliado ? '✅' : '⭕'}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {movimiento.documento}
                        </Badge>
                      </div>
                      <div className="text-right">
                        {movimiento.debito > 0 && (
                          <div className="text-green-600 font-medium">
                            +{formatearMoneda(movimiento.debito)}
                          </div>
                        )}
                        {movimiento.credito > 0 && (
                          <div className="text-red-600 font-medium">
                            -{formatearMoneda(movimiento.credito)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen de Conciliación */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800">
              📊 Resumen de Conciliación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-700">Saldo según banco:</span>
                  <span className="font-medium">{formatearMoneda(saldoBanco)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">(-) Movimientos no conciliados:</span>
                  <span className="font-medium">{formatearMoneda(estadisticas.diferenciaBanco)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span className="text-blue-800">Saldo ajustado banco:</span>
                  <span>{formatearMoneda(estadisticas.saldoAjustadoBanco)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-700">Saldo según libros:</span>
                  <span className="font-medium">{formatearMoneda(saldoLibro)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">(+) Movimientos no conciliados:</span>
                  <span className="font-medium">{formatearMoneda(estadisticas.diferenciaContable)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span className="text-blue-800">Saldo ajustado libros:</span>
                  <span>{formatearMoneda(estadisticas.saldoAjustadoContable)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg">
              <div className="text-center">
                <div className={`text-2xl font-bold ${estadisticas.diferenciaNeta === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {estadisticas.diferenciaNeta === 0 ? '✅ CONCILIACIÓN EXITOSA' : '⚠️ DIFERENCIA PENDIENTE'}
                </div>
                {estadisticas.diferenciaNeta !== 0 && (
                  <div className="text-red-600 mt-2">
                    Diferencia a investigar: {formatearMoneda(Math.abs(estadisticas.diferenciaNeta))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConciliacionBancaria;
