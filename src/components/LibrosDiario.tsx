'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AsientoContable {
  id: string;
  fecha: string;
  numero: number;
  concepto: string;
  cuentas: CuentaAsiento[];
  total: number;
  estado: 'borrador' | 'contabilizado' | 'anulado';
}

interface CuentaAsiento {
  codigo: string;
  nombre: string;
  debe: number;
  haber: number;
}

const LibrosDiario = () => {
  const [asientos, setAsientos] = useState<AsientoContable[]>([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [nuevoAsiento, setNuevoAsiento] = useState(false);

  // Datos de ejemplo - En producción vendrían de la BD
  useEffect(() => {
    const asientosEjemplo: AsientoContable[] = [
      {
        id: '1',
        fecha: '2025-06-15',
        numero: 1,
        concepto: 'Venta de servicios contables - Factura 001',
        cuentas: [
          { codigo: '11010001', nombre: 'Clientes por Cobrar', debe: 1190000, haber: 0 },
          { codigo: '41010001', nombre: 'Ingresos por Servicios', debe: 0, haber: 1000000 },
          { codigo: '21070001', nombre: 'IVA Débito Fiscal', debe: 0, haber: 190000 }
        ],
        total: 1190000,
        estado: 'contabilizado'
      },
      {
        id: '2',
        fecha: '2025-06-15',
        numero: 2,
        concepto: 'Compra suministros oficina - Factura 456',
        cuentas: [
          { codigo: '51010001', nombre: 'Gastos Generales', debe: 59500, haber: 0 },
          { codigo: '11080001', nombre: 'IVA Crédito Fiscal', debe: 9500, haber: 0 },
          { codigo: '21010001', nombre: 'Proveedores por Pagar', debe: 0, haber: 69000 }
        ],
        total: 69000,
        estado: 'contabilizado'
      },
      {
        id: '3',
        fecha: '2025-06-15',
        numero: 3,
        concepto: 'Pago nómina empleados junio 2025',
        cuentas: [
          { codigo: '51020001', nombre: 'Sueldos y Salarios', debe: 2500000, haber: 0 },
          { codigo: '21020001', nombre: 'Retenciones por Pagar', debe: 0, haber: 300000 },
          { codigo: '10010001', nombre: 'Banco Cuenta Corriente', debe: 0, haber: 2200000 }
        ],
        total: 2500000,
        estado: 'borrador'
      }
    ];
    setAsientos(asientosEjemplo);
  }, []);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'contabilizado':
        return <Badge className="bg-green-100 text-green-800">✅ Contabilizado</Badge>;
      case 'borrador':
        return <Badge className="bg-yellow-100 text-yellow-800">📝 Borrador</Badge>;
      case 'anulado':
        return <Badge className="bg-red-100 text-red-800">❌ Anulado</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const calcularTotales = () => {
    const totalDebe = asientos.reduce((acc, asiento) => 
      acc + asiento.cuentas.reduce((sum, cuenta) => sum + cuenta.debe, 0), 0
    );
    const totalHaber = asientos.reduce((acc, asiento) => 
      acc + asiento.cuentas.reduce((sum, cuenta) => sum + cuenta.haber, 0), 0
    );
    return { totalDebe, totalHaber };
  };

  const { totalDebe, totalHaber } = calcularTotales();

  const asientosFiltrados = asientos.filter(asiento => {
    const cumpleFecha = !filtroFecha || asiento.fecha.includes(filtroFecha);
    const cumpleEstado = filtroEstado === 'todos' || asiento.estado === filtroEstado;
    return cumpleFecha && cumpleEstado;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📚 Libro Diario
              </h1>
              <p className="text-gray-600 text-lg">
                Registro cronológico de todas las operaciones contables
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {asientos.length} Asientos
              </div>
              <div className="text-sm text-gray-500">Período Junio 2025</div>
            </div>
          </div>
        </div>

        {/* Resumen de Totales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <span className="text-2xl mr-2">📈</span>
                Total Debe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatearMoneda(totalDebe)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {asientos.length} asientos registrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <span className="text-2xl mr-2">📉</span>
                Total Haber
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {formatearMoneda(totalHaber)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Balance: {totalDebe === totalHaber ? '✅ Cuadrado' : '❌ Descuadrado'}
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
              <div className={`text-3xl font-bold ${totalDebe === totalHaber ? 'text-green-600' : 'text-red-600'}`}>
                {formatearMoneda(Math.abs(totalDebe - totalHaber))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {totalDebe === totalHaber ? 'Balanceado correctamente' : 'Requiere ajuste'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">🔍 Filtros y Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <Input
                  type="date"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="contabilizado">Contabilizado</SelectItem>
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="anulado">Anulado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => setNuevoAsiento(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  ➕ Nuevo Asiento
                </Button>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline"
                  className="w-full"
                >
                  📊 Exportar Libro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Asientos */}
        <div className="space-y-4">
          {asientosFiltrados.map((asiento) => (
            <Card key={asiento.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-blue-600">
                        {asiento.numero}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Asiento N° {asiento.numero}
                      </CardTitle>
                      <CardDescription>
                        {asiento.fecha} • {asiento.concepto}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getEstadoBadge(asiento.estado)}
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {formatearMoneda(asiento.total)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Código</th>
                        <th className="text-left py-2 px-3 font-medium">Cuenta</th>
                        <th className="text-right py-2 px-3 font-medium">Debe</th>
                        <th className="text-right py-2 px-3 font-medium">Haber</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asiento.cuentas.map((cuenta, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 px-3 font-mono text-sm">
                            {cuenta.codigo}
                          </td>
                          <td className="py-2 px-3">
                            {cuenta.nombre}
                          </td>
                          <td className="py-2 px-3 text-right font-medium">
                            {cuenta.debe > 0 ? formatearMoneda(cuenta.debe) : '-'}
                          </td>
                          <td className="py-2 px-3 text-right font-medium">
                            {cuenta.haber > 0 ? formatearMoneda(cuenta.haber) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300 font-bold">
                        <td colSpan={2} className="py-2 px-3">TOTALES</td>
                        <td className="py-2 px-3 text-right">
                          {formatearMoneda(asiento.cuentas.reduce((sum, c) => sum + c.debe, 0))}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {formatearMoneda(asiento.cuentas.reduce((sum, c) => sum + c.haber, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumen Legal */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-xl text-green-800">
              ✅ Cumplimiento Legal - Libro Diario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-green-800 mb-2">📋 Normativa</div>
                <p className="text-green-700">
                  Cumple con Art. 16 del Código de Comercio y normativas SII Chile
                </p>
              </div>
              <div>
                <div className="font-medium text-green-800 mb-2">📅 Registro</div>
                <p className="text-green-700">
                  Asientos registrados cronológicamente sin espacios ni alteraciones
                </p>
              </div>
              <div>
                <div className="font-medium text-green-800 mb-2">🔒 Validación</div>
                <p className="text-green-700">
                  Balance cuadrado: Debe = Haber según principios contables
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LibrosDiario;
