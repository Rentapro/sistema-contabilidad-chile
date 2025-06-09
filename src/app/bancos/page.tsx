'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Banknote,
  RefreshCw,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  Building,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCw,
  Settings,
  Link,
  Unlink,
  FileText,
  Search,
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface CuentaBancaria {
  id: string;
  banco: string;
  numeroCuenta: string;
  tipoCuenta: 'corriente' | 'vista' | 'ahorro';
  moneda: 'CLP' | 'USD' | 'EUR';
  saldo: number;
  fechaUltimaSync: Date;
  estado: 'activa' | 'inactiva' | 'error';
  clienteId: string;
  cliente: string;
}

interface MovimientoBancario {
  id: string;
  cuentaId: string;
  fecha: Date;
  descripcion: string;
  referencia: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
  saldo: number;
  categoria?: string;
  conciliado: boolean;
  facturaRelacionada?: string;
}

interface IntegracionBanco {
  id: string;
  nombre: string;
  logo: string;
  conectado: boolean;
  ultimaSync: Date;
  cuentasConectadas: number;
  estado: 'activo' | 'error' | 'mantenimiento';
  configuracion: {
    syncAutomatico: boolean;
    frecuenciaHoras: number;
    notificaciones: boolean;
  };
}

interface EstadisticaBancaria {
  totalCuentas: number;
  saldoTotal: number;
  movimientosHoy: number;
  pendientesConciliacion: number;
  erroresSync: number;
}

export default function BancosPage() {
  const [cuentas, setCuentas] = useState<CuentaBancaria[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoBancario[]>([]);
  const [integraciones, setIntegraciones] = useState<IntegracionBanco[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticaBancaria | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroConciliado, setFiltroConciliado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [sincronizando, setSincronizando] = useState(false);

  // Datos iniciales
  useEffect(() => {
    const integracionesIniciales: IntegracionBanco[] = [
      {
        id: '1',
        nombre: 'Banco de Chile',
        logo: '🏦',
        conectado: true,
        ultimaSync: new Date(Date.now() - 30 * 60 * 1000),
        cuentasConectadas: 3,
        estado: 'activo',
        configuracion: {
          syncAutomatico: true,
          frecuenciaHoras: 4,
          notificaciones: true
        }
      },
      {
        id: '2',
        nombre: 'Banco Santander',
        logo: '🏦',
        conectado: true,
        ultimaSync: new Date(Date.now() - 60 * 60 * 1000),
        cuentasConectadas: 2,
        estado: 'activo',
        configuracion: {
          syncAutomatico: true,
          frecuenciaHoras: 6,
          notificaciones: true
        }
      },
      {
        id: '3',
        nombre: 'Banco Estado',
        logo: '🏛️',
        conectado: false,
        ultimaSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
        cuentasConectadas: 0,
        estado: 'error',
        configuracion: {
          syncAutomatico: false,
          frecuenciaHoras: 8,
          notificaciones: false
        }
      },
      {
        id: '4',
        nombre: 'Banco Falabella',
        logo: '🏪',
        conectado: true,
        ultimaSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        cuentasConectadas: 1,
        estado: 'activo',
        configuracion: {
          syncAutomatico: true,
          frecuenciaHoras: 12,
          notificaciones: false
        }
      }
    ];

    const cuentasIniciales: CuentaBancaria[] = [
      {
        id: '1',
        banco: 'Banco de Chile',
        numeroCuenta: '****1234',
        tipoCuenta: 'corriente',
        moneda: 'CLP',
        saldo: 15750000,
        fechaUltimaSync: new Date(Date.now() - 30 * 60 * 1000),
        estado: 'activa',
        clienteId: '1',
        cliente: 'ABC Empresa S.A.'
      },
      {
        id: '2',
        banco: 'Banco Santander',
        numeroCuenta: '****5678',
        tipoCuenta: 'vista',
        moneda: 'CLP',
        saldo: 8920000,
        fechaUltimaSync: new Date(Date.now() - 60 * 60 * 1000),
        estado: 'activa',
        clienteId: '2',
        cliente: 'XYZ Comercial Ltda.'
      },
      {
        id: '3',
        banco: 'Banco de Chile',
        numeroCuenta: '****9012',
        tipoCuenta: 'corriente',
        moneda: 'USD',
        saldo: 25000,
        fechaUltimaSync: new Date(Date.now() - 30 * 60 * 1000),
        estado: 'activa',
        clienteId: '1',
        cliente: 'ABC Empresa S.A.'
      },
      {
        id: '4',
        banco: 'Banco Falabella',
        numeroCuenta: '****3456',
        tipoCuenta: 'ahorro',
        moneda: 'CLP',
        saldo: 2100000,
        fechaUltimaSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        estado: 'activa',
        clienteId: '3',
        cliente: 'DEF Servicios SpA'
      }
    ];

    const movimientosIniciales: MovimientoBancario[] = [
      {
        id: '1',
        cuentaId: '1',
        fecha: new Date(),
        descripcion: 'Transferencia recibida - Factura 001234',
        referencia: 'TRF001234',
        tipo: 'ingreso',
        monto: 2500000,
        saldo: 15750000,
        categoria: 'Ventas',
        conciliado: false,
        facturaRelacionada: '001234'
      },
      {
        id: '2',
        cuentaId: '1',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
        descripcion: 'Pago nómina empleados',
        referencia: 'NOM202401',
        tipo: 'egreso',
        monto: 3200000,
        saldo: 13250000,
        categoria: 'Sueldos',
        conciliado: true
      },
      {
        id: '3',
        cuentaId: '2',
        fecha: new Date(Date.now() - 4 * 60 * 60 * 1000),
        descripcion: 'Pago proveedor - Factura PR5678',
        referencia: 'PAG5678',
        tipo: 'egreso',
        monto: 1500000,
        saldo: 8920000,
        categoria: 'Compras',
        conciliado: false
      },
      {
        id: '4',
        cuentaId: '3',
        fecha: new Date(Date.now() - 6 * 60 * 60 * 1000),
        descripcion: 'Ingreso por exportación',
        referencia: 'EXP001',
        tipo: 'ingreso',
        monto: 15000,
        saldo: 25000,
        categoria: 'Exportaciones',
        conciliado: true
      },
      {
        id: '5',
        cuentaId: '4',
        fecha: new Date(Date.now() - 8 * 60 * 60 * 1000),
        descripcion: 'Intereses ganados',
        referencia: 'INT202401',
        tipo: 'ingreso',
        monto: 50000,
        saldo: 2100000,
        categoria: 'Intereses',
        conciliado: false
      }
    ];

    const estadisticasIniciales: EstadisticaBancaria = {
      totalCuentas: cuentasIniciales.length,
      saldoTotal: cuentasIniciales.reduce((total, cuenta) => {
        const saldoEnCLP = cuenta.moneda === 'USD' ? cuenta.saldo * 900 : cuenta.saldo;
        return total + saldoEnCLP;
      }, 0),
      movimientosHoy: movimientosIniciales.filter(m => 
        m.fecha.toDateString() === new Date().toDateString()
      ).length,
      pendientesConciliacion: movimientosIniciales.filter(m => !m.conciliado).length,
      erroresSync: integracionesIniciales.filter(i => i.estado === 'error').length
    };

    setIntegraciones(integracionesIniciales);
    setCuentas(cuentasIniciales);
    setMovimientos(movimientosIniciales);
    setEstadisticas(estadisticasIniciales);
  }, []);

  const sincronizarTodas = async () => {
    setSincronizando(true);
    
    // Simular sincronización
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIntegraciones(prev => 
      prev.map(integracion => ({
        ...integracion,
        ultimaSync: new Date(),
        estado: integracion.conectado ? 'activo' : integracion.estado
      }))
    );
    
    setCuentas(prev => 
      prev.map(cuenta => ({
        ...cuenta,
        fechaUltimaSync: new Date()
      }))
    );
    
    setSincronizando(false);
  };

  const conectarBanco = (id: string) => {
    setIntegraciones(prev => 
      prev.map(integracion => 
        integracion.id === id 
          ? { ...integracion, conectado: true, estado: 'activo' }
          : integracion
      )
    );
  };

  const desconectarBanco = (id: string) => {
    setIntegraciones(prev => 
      prev.map(integracion => 
        integracion.id === id 
          ? { ...integracion, conectado: false, estado: 'error' }
          : integracion
      )
    );
  };

  const conciliarMovimiento = (id: string) => {
    setMovimientos(prev => 
      prev.map(movimiento => 
        movimiento.id === id 
          ? { ...movimiento, conciliado: true }
          : movimiento
      )
    );
  };

  const movimientosFiltrados = movimientos.filter(movimiento => {
    const coincideBusqueda = 
      movimiento.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      movimiento.referencia.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideTipo = filtroTipo === 'todos' || movimiento.tipo === filtroTipo;
    const coincideConciliado = filtroConciliado === 'todos' || 
      (filtroConciliado === 'conciliado' && movimiento.conciliado) ||
      (filtroConciliado === 'pendiente' && !movimiento.conciliado);
    
    return coincideBusqueda && coincideTipo && coincideConciliado;
  });

  const formatearMoneda = (monto: number, moneda: string = 'CLP') => {
    if (moneda === 'USD') {
      return `$${monto.toLocaleString('en-US')} USD`;
    }
    return `$${monto.toLocaleString('es-CL')} CLP`;
  };

  const calcularTiempoSync = (fecha: Date) => {
    const ahora = new Date();
    const diferencia = ahora.getTime() - fecha.getTime();
    const minutos = Math.floor(diferencia / (1000 * 60));
    
    if (minutos < 60) return `Hace ${minutos} min`;
    
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `Hace ${horas}h`;
    
    const dias = Math.floor(horas / 24);
    return `Hace ${dias}d`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Banknote className="h-8 w-8" />
              Integraciones Bancarias
            </h1>
            <p className="text-gray-600 mt-2">
              Conecta y sincroniza cuentas bancarias para automatizar la contabilidad
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={sincronizarTodas} 
              disabled={sincronizando}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${sincronizando ? 'animate-spin' : ''}`} />
              {sincronizando ? 'Sincronizando...' : 'Sincronizar Todo'}
            </Button>
            <Button>
              <Link className="h-4 w-4 mr-2" />
              Conectar Banco
            </Button>
          </div>
        </div>
      </div>

      {/* Estadísticas Principales */}
      {estadisticas && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cuentas</p>
                  <p className="text-2xl font-bold">{estadisticas.totalCuentas}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saldo Total</p>
                  <p className="text-2xl font-bold">{formatearMoneda(estadisticas.saldoTotal)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Movimientos Hoy</p>
                  <p className="text-2xl font-bold">{estadisticas.movimientosHoy}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-orange-600">{estadisticas.pendientesConciliacion}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Errores</p>
                  <p className="text-2xl font-bold text-red-600">{estadisticas.erroresSync}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="cuentas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cuentas">Cuentas</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="integraciones">Integraciones</TabsTrigger>
          <TabsTrigger value="conciliacion">Conciliación</TabsTrigger>
        </TabsList>

        <TabsContent value="cuentas" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cuentas.map((cuenta) => (
              <Card key={cuenta.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{cuenta.banco}</h3>
                        <p className="text-sm text-gray-600">{cuenta.numeroCuenta}</p>
                      </div>
                    </div>
                    <Badge className={
                      cuenta.estado === 'activa' ? 'bg-green-100 text-green-800' :
                      cuenta.estado === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {cuenta.estado}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tipo:</span>
                      <span className="font-medium capitalize">{cuenta.tipoCuenta}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cliente:</span>
                      <span className="font-medium text-sm">{cuenta.cliente}</span>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Saldo</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatearMoneda(cuenta.saldo, cuenta.moneda)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center">
                      Última sync: {calcularTiempoSync(cuenta.fechaUltimaSync)}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <RotateCw className="h-4 w-4 mr-1" />
                      Sincronizar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="movimientos" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar movimientos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ingreso">Ingresos</SelectItem>
                    <SelectItem value="egreso">Egresos</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroConciliado} onValueChange={setFiltroConciliado}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="conciliado">Conciliados</SelectItem>
                    <SelectItem value="pendiente">Pendientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Movimientos */}
          <Card>
            <CardHeader>
              <CardTitle>Movimientos Bancarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movimientosFiltrados.map((movimiento) => {
                  const cuenta = cuentas.find(c => c.id === movimiento.cuentaId);
                  return (
                    <div key={movimiento.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            movimiento.tipo === 'ingreso' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {movimiento.tipo === 'ingreso' ? (
                              <ArrowDownLeft className="h-5 w-5" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{movimiento.descripcion}</h4>
                              {movimiento.conciliado ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Conciliado
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pendiente
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Ref: {movimiento.referencia} • {cuenta?.banco} {cuenta?.numeroCuenta}</div>
                              <div>{movimiento.fecha.toLocaleString()}</div>
                              {movimiento.categoria && (
                                <Badge variant="outline" className="text-xs">
                                  {movimiento.categoria}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {movimiento.tipo === 'ingreso' ? '+' : '-'}
                            {formatearMoneda(movimiento.monto, cuenta?.moneda)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Saldo: {formatearMoneda(movimiento.saldo, cuenta?.moneda)}
                          </div>
                          {!movimiento.conciliado && (
                            <Button 
                              size="sm" 
                              onClick={() => conciliarMovimiento(movimiento.id)}
                              className="mt-2"
                            >
                              Conciliar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integraciones" className="space-y-6">
          <div className="grid gap-6">
            {integraciones.map((integracion) => (
              <Card key={integracion.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{integracion.logo}</div>
                      <div>
                        <h3 className="text-xl font-semibold">{integracion.nombre}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>{integracion.cuentasConectadas} cuentas conectadas</span>
                          <span>Última sync: {calcularTiempoSync(integracion.ultimaSync)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className={
                        integracion.estado === 'activo' ? 'bg-green-100 text-green-800' :
                        integracion.estado === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {integracion.estado}
                      </Badge>
                      
                      {integracion.conectado ? (
                        <Button 
                          variant="outline" 
                          onClick={() => desconectarBanco(integracion.id)}
                        >
                          <Unlink className="h-4 w-4 mr-2" />
                          Desconectar
                        </Button>
                      ) : (
                        <Button onClick={() => conectarBanco(integracion.id)}>
                          <Link className="h-4 w-4 mr-2" />
                          Conectar
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {integracion.conectado && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-6">
                      <div>
                        <label className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={integracion.configuracion.syncAutomatico}
                            className="rounded"
                          />
                          <span className="text-sm">Sync automático</span>
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Frecuencia (horas)
                        </label>
                        <Input 
                          type="number" 
                          defaultValue={integracion.configuracion.frecuenciaHoras}
                          className="w-24"
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={integracion.configuracion.notificaciones}
                            className="rounded"
                          />
                          <span className="text-sm">Notificaciones</span>
                        </label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conciliacion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asistente de Conciliación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {movimientos.filter(m => !m.conciliado).length}
                    </div>
                    <div className="text-sm text-gray-600">Movimientos pendientes</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {movimientos.filter(m => m.conciliado).length}
                    </div>
                    <div className="text-sm text-gray-600">Movimientos conciliados</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {Math.round((movimientos.filter(m => m.conciliado).length / movimientos.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Progreso de conciliación</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso de conciliación</span>
                    <span>{Math.round((movimientos.filter(m => m.conciliado).length / movimientos.length) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(movimientos.filter(m => m.conciliado).length / movimientos.length) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Conciliación Automática
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Pendientes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Movimientos pendientes de conciliación */}
          <Card>
            <CardHeader>
              <CardTitle>Movimientos Pendientes de Conciliación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movimientos.filter(m => !m.conciliado).map((movimiento) => {
                  const cuenta = cuentas.find(c => c.id === movimiento.cuentaId);
                  return (
                    <div key={movimiento.id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            movimiento.tipo === 'ingreso' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {movimiento.tipo === 'ingreso' ? (
                              <ArrowDownLeft className="h-5 w-5" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5" />
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{movimiento.descripcion}</h4>
                            <div className="text-sm text-gray-600">
                              {movimiento.fecha.toLocaleDateString()} • Ref: {movimiento.referencia}
                            </div>
                            <div className="text-sm text-gray-600">
                              {cuenta?.banco} {cuenta?.numeroCuenta}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {movimiento.tipo === 'ingreso' ? '+' : '-'}
                            {formatearMoneda(movimiento.monto, cuenta?.moneda)}
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => conciliarMovimiento(movimiento.id)}
                            className="mt-2"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Conciliar
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
