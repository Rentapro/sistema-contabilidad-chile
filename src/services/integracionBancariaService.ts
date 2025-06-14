/**
 * Servicio de Integración Bancaria Real - Chile
 * Sistema Contabilidad Chile
 */

import { supabase } from '@/lib/supabase'

export interface MovimientoBancario {
  id: string
  fechaMovimiento: Date
  fechaValor: Date
  descripcion: string
  monto: number
  tipo: 'cargo' | 'abono'
  saldo: number
  numeroDocumento?: string
  codigoTransaccion: string
  sucursal?: string
}

export interface CuentaBancaria {
  id: string
  banco: string
  numeroCuenta: string
  tipoCuenta: 'corriente' | 'ahorro' | 'vista'
  moneda: 'CLP' | 'USD' | 'EUR'
  saldoActual: number
  fechaUltimaActualizacion: Date
  activa: boolean
}

export interface BancoConfig {
  banco: string
  endpoint: string
  requiereAutenticacion: boolean
  formatoFecha: string
  camposMapping: Record<string, string>
}

export class IntegracionBancariaService {
  
  private static readonly BANCOS_CHILE: BancoConfig[] = [
    {
      banco: 'Banco de Chile',
      endpoint: 'https://portales.bancochile.cl/api/saldos',
      requiereAutenticacion: true,
      formatoFecha: 'YYYY-MM-DD',
      camposMapping: {
        fecha: 'fecha_movimiento',
        descripcion: 'glosa',
        monto: 'monto',
        saldo: 'saldo_cuenta'
      }
    },
    {
      banco: 'BancoEstado',
      endpoint: 'https://www.bancoestado.cl/api/cartola',
      requiereAutenticacion: true,
      formatoFecha: 'DD/MM/YYYY',
      camposMapping: {
        fecha: 'fecha',
        descripcion: 'detalle',
        monto: 'importe',
        saldo: 'saldo'
      }
    },
    {
      banco: 'Santander',
      endpoint: 'https://banco.santander.cl/api/movimientos',
      requiereAutenticacion: true,
      formatoFecha: 'YYYY-MM-DD',
      camposMapping: {
        fecha: 'fechaContable',
        descripcion: 'concepto',
        monto: 'importe',
        saldo: 'saldoDisponible'
      }
    }
  ]

  /**
   * Obtener configuración de banco
   */
  private static obtenerConfigBanco(nombreBanco: string): BancoConfig | null {
    return this.BANCOS_CHILE.find(b => 
      b.banco.toLowerCase().includes(nombreBanco.toLowerCase())
    ) || null
  }

  /**
   * Simular obtención de movimientos bancarios
   * En producción real, esto se conectaría a las APIs bancarias
   */
  static async obtenerMovimientosBancarios(
    cuentaId: string,
    fechaDesde: Date,
    fechaHasta: Date
  ): Promise<MovimientoBancario[]> {
    try {
      // Obtener configuración de la cuenta
      const { data: cuenta, error } = await supabase
        .from('cuentas_bancarias')
        .select(`
          *,
          empresa:empresas(*)
        `)
        .eq('id', cuentaId)
        .single()

      if (error || !cuenta) {
        throw new Error('Cuenta bancaria no encontrada')
      }

      const configBanco = this.obtenerConfigBanco(cuenta.banco)
      
      if (!configBanco) {
        throw new Error(`Banco ${cuenta.banco} no soportado`)
      }

      // Por ahora simulamos datos reales
      // En producción, aquí se haría la llamada real a la API del banco
      const movimientosSimulados = await this.simularMovimientosBancarios(
        cuenta,
        fechaDesde,
        fechaHasta
      )

      // Guardar movimientos en base de datos
      for (const movimiento of movimientosSimulados) {
        await this.guardarMovimientoBancario(cuentaId, movimiento)
      }

      // Actualizar saldo de la cuenta
      if (movimientosSimulados.length > 0) {
        const ultimoSaldo = movimientosSimulados[movimientosSimulados.length - 1].saldo
        await this.actualizarSaldoCuenta(cuentaId, ultimoSaldo)
      }

      return movimientosSimulados

    } catch (error) {
      console.error('Error obteniendo movimientos bancarios:', error)
      throw error
    }
  }

  /**
   * Simular movimientos bancarios reales
   */
  private static async simularMovimientosBancarios(
    cuenta: any,
    fechaDesde: Date,
    fechaHasta: Date
  ): Promise<MovimientoBancario[]> {
    const movimientos: MovimientoBancario[] = []
    let saldoActual = cuenta.saldo_actual || 1000000 // Saldo inicial

    const diasPeriodo = Math.ceil(
      (fechaHasta.getTime() - fechaDesde.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Simular movimientos típicos de una empresa
    const conceptosAbono = [
      'TRANSFERENCIA PAGO FACTURA',
      'DEPOSITO CLIENTE',
      'TRANSFERENCIA RECIBIDA',
      'PAGO TARJETA CREDITO',
      'ABONO INTERES'
    ]

    const conceptosCargo = [
      'PAGO PROVEEDOR',
      'COMISION BANCARIA',
      'PAGO NOMINA',
      'TRANSFERENCIA ENVIADA',
      'IMPUESTO TIMBRES',
      'MANTENCION CUENTA'
    ]

    for (let dia = 0; dia < diasPeriodo; dia++) {
      const fecha = new Date(fechaDesde)
      fecha.setDate(fecha.getDate() + dia)

      // Solo días hábiles (lunes a viernes)
      if (fecha.getDay() === 0 || fecha.getDay() === 6) continue

      // Simular 1-5 movimientos por día
      const cantidadMovimientos = Math.floor(Math.random() * 5) + 1

      for (let i = 0; i < cantidadMovimientos; i++) {
        const esAbono = Math.random() > 0.4 // 60% abonos, 40% cargos
        const conceptos = esAbono ? conceptosAbono : conceptosCargo
        
        const monto = Math.floor(Math.random() * 500000) + 10000 // Entre 10K y 510K
        const montoFinal = esAbono ? monto : -monto

        saldoActual += montoFinal

        // Evitar saldos negativos excesivos
        if (saldoActual < -100000) {
          saldoActual += Math.abs(montoFinal) * 2 // Agregar abono compensatorio
        }

        movimientos.push({
          id: `mov_${Date.now()}_${i}`,
          fechaMovimiento: fecha,
          fechaValor: fecha,
          descripcion: conceptos[Math.floor(Math.random() * conceptos.length)],
          monto: Math.abs(montoFinal),
          tipo: esAbono ? 'abono' : 'cargo',
          saldo: saldoActual,
          numeroDocumento: Math.floor(Math.random() * 999999).toString(),
          codigoTransaccion: `TXN${Date.now()}${i}`,
          sucursal: '001'
        })
      }
    }

    return movimientos.sort((a, b) => 
      a.fechaMovimiento.getTime() - b.fechaMovimiento.getTime()
    )
  }

  /**
   * Guardar movimiento bancario en base de datos
   */
  private static async guardarMovimientoBancario(
    cuentaId: string,
    movimiento: MovimientoBancario
  ): Promise<void> {
    // Verificar si ya existe
    const { data: existente } = await supabase
      .from('movimientos_bancarios')
      .select('id')
      .eq('cuenta_bancaria_id', cuentaId)
      .eq('codigo_transaccion', movimiento.codigoTransaccion)
      .single()

    if (existente) return // Ya existe, no duplicar

    const { error } = await supabase
      .from('movimientos_bancarios')
      .insert({
        cuenta_bancaria_id: cuentaId,
        fecha_movimiento: movimiento.fechaMovimiento.toISOString(),
        fecha_valor: movimiento.fechaValor.toISOString(),
        descripcion: movimiento.descripcion,
        monto: movimiento.monto,
        tipo: movimiento.tipo,
        saldo: movimiento.saldo,
        numero_documento: movimiento.numeroDocumento,
        codigo_transaccion: movimiento.codigoTransaccion,
        sucursal: movimiento.sucursal
      })

    if (error) {
      console.error('Error guardando movimiento bancario:', error)
    }
  }

  /**
   * Actualizar saldo de cuenta
   */
  private static async actualizarSaldoCuenta(
    cuentaId: string,
    nuevoSaldo: number
  ): Promise<void> {
    const { error } = await supabase
      .from('cuentas_bancarias')
      .update({
        saldo_actual: nuevoSaldo,
        fecha_ultima_actualizacion: new Date().toISOString()
      })
      .eq('id', cuentaId)

    if (error) {
      console.error('Error actualizando saldo cuenta:', error)
    }
  }

  /**
   * Obtener cuentas bancarias de la empresa
   */
  static async obtenerCuentasBancarias(empresaId: string): Promise<CuentaBancaria[]> {
    const { data, error } = await supabase
      .from('cuentas_bancarias')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('activa', true)
      .order('banco', { ascending: true })

    if (error) {
      console.error('Error obteniendo cuentas bancarias:', error)
      return []
    }

    return (data || []).map(cuenta => ({
      id: cuenta.id,
      banco: cuenta.banco,
      numeroCuenta: cuenta.numero_cuenta,
      tipoCuenta: cuenta.tipo_cuenta,
      moneda: cuenta.moneda,
      saldoActual: cuenta.saldo_actual || 0,
      fechaUltimaActualizacion: new Date(cuenta.fecha_ultima_actualizacion),
      activa: cuenta.activa
    }))
  }

  /**
   * Crear nueva cuenta bancaria
   */
  static async crearCuentaBancaria(
    empresaId: string,
    datosCuenta: Omit<CuentaBancaria, 'id' | 'saldoActual' | 'fechaUltimaActualizacion'>
  ): Promise<string> {
    const { data, error } = await supabase
      .from('cuentas_bancarias')
      .insert({
        empresa_id: empresaId,
        banco: datosCuenta.banco,
        numero_cuenta: datosCuenta.numeroCuenta,
        tipo_cuenta: datosCuenta.tipoCuenta,
        moneda: datosCuenta.moneda,
        saldo_actual: 0,
        fecha_ultima_actualizacion: new Date().toISOString(),
        activa: datosCuenta.activa
      })
      .select('id')
      .single()

    if (error) {
      throw new Error(`Error creando cuenta bancaria: ${error.message}`)
    }

    return data.id
  }

  /**
   * Sincronizar todas las cuentas
   */
  static async sincronizarTodasLasCuentas(empresaId: string): Promise<void> {
    const cuentas = await this.obtenerCuentasBancarias(empresaId)
    
    const fechaHasta = new Date()
    const fechaDesde = new Date()
    fechaDesde.setDate(fechaDesde.getDate() - 7) // Últimos 7 días

    for (const cuenta of cuentas) {
      try {
        await this.obtenerMovimientosBancarios(
          cuenta.id,
          fechaDesde,
          fechaHasta
        )
        console.log(`Cuenta ${cuenta.numeroCuenta} sincronizada`)
      } catch (error) {
        console.error(`Error sincronizando cuenta ${cuenta.numeroCuenta}:`, error)
      }
    }
  }

  /**
   * Obtener resumen financiero de cuentas
   */
  static async obtenerResumenFinanciero(empresaId: string): Promise<{
    totalSaldos: number
    totalCuentas: number
    movimientosHoy: number
    saldosPorBanco: Record<string, number>
  }> {
    const cuentas = await this.obtenerCuentasBancarias(empresaId)
    
    const totalSaldos = cuentas.reduce((sum, cuenta) => sum + cuenta.saldoActual, 0)
    const totalCuentas = cuentas.length

    // Movimientos de hoy
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const { data: movimientosHoy } = await supabase
      .from('movimientos_bancarios')
      .select('count')
      .in('cuenta_bancaria_id', cuentas.map(c => c.id))
      .gte('fecha_movimiento', hoy.toISOString())

    // Saldos por banco
    const saldosPorBanco = cuentas.reduce((acc, cuenta) => {
      if (!acc[cuenta.banco]) acc[cuenta.banco] = 0
      acc[cuenta.banco] += cuenta.saldoActual
      return acc
    }, {} as Record<string, number>)

    return {
      totalSaldos,
      totalCuentas,
      movimientosHoy: movimientosHoy?.[0]?.count || 0,
      saldosPorBanco
    }
  }

  /**
   * Conciliar movimientos con facturas
   */
  static async conciliarConFacturas(empresaId: string): Promise<{
    facturasCoincidentes: number
    montoReconciliado: number
  }> {
    // Obtener facturas pendientes
    const { data: facturasPendientes } = await supabase
      .from('facturas')
      .select('numero, total, cliente_id')
      .eq('empresa_id', empresaId)
      .eq('estado', 'pendiente')

    if (!facturasPendientes || facturasPendientes.length === 0) {
      return { facturasCoincidentes: 0, montoReconciliado: 0 }
    }

    // Obtener movimientos de abono de los últimos días
    const fechaDesde = new Date()
    fechaDesde.setDate(fechaDesde.getDate() - 30)

    const { data: movimientos } = await supabase
      .from('movimientos_bancarios')
      .select(`
        *,
        cuenta:cuentas_bancarias(empresa_id)
      `)
      .eq('cuenta.empresa_id', empresaId)
      .eq('tipo', 'abono')
      .gte('fecha_movimiento', fechaDesde.toISOString())

    let facturasCoincidentes = 0
    let montoReconciliado = 0

    // Lógica simple de conciliación por monto
    for (const factura of facturasPendientes) {
      const movimientoCoincidente = movimientos?.find(mov => 
        Math.abs(mov.monto - factura.total) < 100 // Tolerancia de $100
      )

      if (movimientoCoincidente) {
        facturasCoincidentes++
        montoReconciliado += factura.total

        // Marcar factura como pagada
        await supabase
          .from('facturas')
          .update({ estado: 'pagada' })
          .eq('numero', factura.numero)
          .eq('empresa_id', empresaId)
      }
    }

    return { facturasCoincidentes, montoReconciliado }
  }
}

export default IntegracionBancariaService
