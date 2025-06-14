/**
 * Sistema de Monitoreo en Tiempo Real
 * Sistema Contabilidad Chile
 */

import { supabase } from '@/lib/supabase'
import EmailService from './emailService'

export interface NotificacionConfig {
  tipo: 'factura_vencida' | 'pago_recibido' | 'meta_alcanzada' | 'error_sistema' | 'backup_completado'
  habilitado: boolean
  emailNotificacion: boolean
  umbralValor?: number
  diasAnticipacion?: number
}

export interface EventoMonitoreo {
  id: string
  tipo: string
  mensaje: string
  datos: Record<string, any>
  fechaCreacion: Date
  empresaId: string
  usuarioId?: string
  procesado: boolean
}

export class MonitoreoService {
  
  /**
   * Inicializar monitoreo en tiempo real
   */
  static async inicializarMonitoreo(empresaId: string): Promise<void> {
    // Suscribirse a cambios en facturas
    supabase
      .channel('facturas_cambios')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'facturas',
          filter: `empresa_id=eq.${empresaId}`
        }, 
        (payload) => {
          this.procesarCambioFactura(payload.new as any, payload.old as any)
        }
      )
      .subscribe()

    // Suscribirse a nuevos pagos
    supabase
      .channel('pagos_nuevos')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pagos',
          filter: `empresa_id=eq.${empresaId}`
        },
        (payload) => {
          this.procesarNuevoPago(payload.new as any)
        }
      )
      .subscribe()

    // Iniciar verificaciones periódicas
    this.iniciarVerificacionesPeriodicas(empresaId)
  }

  /**
   * Procesar cambio en factura
   */
  private static async procesarCambioFactura(nueva: any, anterior: any): Promise<void> {
    // Detectar cambio de estado
    if (nueva.estado !== anterior.estado) {
      if (nueva.estado === 'pagada') {
        await this.notificarPagoRecibido(nueva)
      } else if (nueva.estado === 'vencida') {
        await this.notificarFacturaVencida(nueva)
      }
    }
  }

  /**
   * Procesar nuevo pago
   */
  private static async procesarNuevoPago(pago: any): Promise<void> {
    await this.notificarPagoRecibido(pago)
    await this.verificarMetasVentas(pago.empresa_id)
  }

  /**
   * Verificaciones periódicas
   */
  private static iniciarVerificacionesPeriodicas(empresaId: string): void {
    // Verificar facturas por vencer cada hora
    setInterval(async () => {
      await this.verificarFacturasPorVencer(empresaId)
    }, 60 * 60 * 1000) // 1 hora

    // Verificar backup diario
    setInterval(async () => {
      await this.verificarBackupDiario(empresaId)
    }, 24 * 60 * 60 * 1000) // 24 horas

    // Verificar métricas cada 30 minutos
    setInterval(async () => {
      await this.verificarMetricas(empresaId)
    }, 30 * 60 * 1000) // 30 minutos
  }

  /**
   * Verificar facturas por vencer
   */
  private static async verificarFacturasPorVencer(empresaId: string): Promise<void> {
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() + 3) // 3 días de anticipación

    const { data: facturas, error } = await supabase
      .from('facturas')
      .select(`
        *,
        cliente:clientes(nombre, email)
      `)
      .eq('empresa_id', empresaId)
      .eq('estado', 'pendiente')
      .lte('fecha_vencimiento', fechaLimite.toISOString())

    if (error) {
      console.error('Error verificando facturas por vencer:', error)
      return
    }

    for (const factura of facturas || []) {
      await this.notificarFacturaPorVencer(factura)
    }
  }

  /**
   * Verificar metas de ventas
   */
  private static async verificarMetasVentas(empresaId: string): Promise<void> {
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const { data: ventasMes, error } = await supabase
      .from('facturas')
      .select('total')
      .eq('empresa_id', empresaId)
      .eq('estado', 'pagada')
      .gte('fecha_emision', inicioMes.toISOString())

    if (error) {
      console.error('Error verificando metas:', error)
      return
    }

    const totalVentasMes = ventasMes?.reduce((sum, f) => sum + f.total, 0) || 0

    // Obtener meta mensual de la empresa
    const { data: empresa } = await supabase
      .from('empresas')
      .select('meta_mensual')
      .eq('id', empresaId)
      .single()

    if (empresa?.meta_mensual && totalVentasMes >= empresa.meta_mensual) {
      await this.notificarMetaAlcanzada(empresaId, totalVentasMes, empresa.meta_mensual)
    }
  }

  /**
   * Verificar backup diario
   */
  private static async verificarBackupDiario(empresaId: string): Promise<void> {
    const ayer = new Date()
    ayer.setDate(ayer.getDate() - 1)
    
    const { data: backup, error } = await supabase
      .from('backups')
      .select('*')
      .eq('empresa_id', empresaId)
      .gte('fecha_creacion', ayer.toISOString())
      .order('fecha_creacion', { ascending: false })
      .limit(1)

    if (error || !backup || backup.length === 0) {
      await this.notificarBackupFaltante(empresaId)
    } else {
      await this.notificarBackupCompletado(empresaId, backup[0])
    }
  }

  /**
   * Verificar métricas del sistema
   */
  private static async verificarMetricas(empresaId: string): Promise<void> {
    // Verificar rendimiento de la base de datos
    const startTime = Date.now()
    
    const { data, error } = await supabase
      .from('facturas')
      .select('count')
      .eq('empresa_id', empresaId)
      .limit(1)

    const responseTime = Date.now() - startTime

    if (error || responseTime > 5000) { // Más de 5 segundos
      await this.notificarProblemaRendimiento(empresaId, responseTime, error)
    }
  }

  /**
   * Notificaciones específicas
   */
  private static async notificarFacturaVencida(factura: any): Promise<void> {
    await this.crearEvento({
      tipo: 'factura_vencida',
      mensaje: `Factura ${factura.numero} ha vencido`,
      datos: { facturaId: factura.id, numero: factura.numero, total: factura.total },
      empresaId: factura.empresa_id
    })

    // Email al cliente
    if (factura.cliente?.email) {
      await EmailService.notificarVencimiento(
        factura.cliente.email,
        factura.numero,
        new Date(factura.fecha_vencimiento),
        factura.total
      )
    }
  }

  private static async notificarFacturaPorVencer(factura: any): Promise<void> {
    const diasRestantes = Math.ceil(
      (new Date(factura.fecha_vencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )

    await this.crearEvento({
      tipo: 'factura_por_vencer',
      mensaje: `Factura ${factura.numero} vence en ${diasRestantes} días`,
      datos: { facturaId: factura.id, diasRestantes },
      empresaId: factura.empresa_id
    })
  }

  private static async notificarPagoRecibido(pago: any): Promise<void> {
    await this.crearEvento({
      tipo: 'pago_recibido',
      mensaje: `Pago recibido: $${pago.monto?.toLocaleString('es-CL')}`,
      datos: { pagoId: pago.id, monto: pago.monto },
      empresaId: pago.empresa_id
    })
  }

  private static async notificarMetaAlcanzada(empresaId: string, ventasActuales: number, meta: number): Promise<void> {
    await this.crearEvento({
      tipo: 'meta_alcanzada',
      mensaje: `¡Meta mensual alcanzada! $${ventasActuales.toLocaleString('es-CL')}`,
      datos: { ventasActuales, meta },
      empresaId
    })
  }

  private static async notificarBackupFaltante(empresaId: string): Promise<void> {
    await this.crearEvento({
      tipo: 'backup_faltante',
      mensaje: 'Backup diario no realizado',
      datos: { fecha: new Date().toISOString() },
      empresaId
    })
  }

  private static async notificarBackupCompletado(empresaId: string, backup: any): Promise<void> {
    await this.crearEvento({
      tipo: 'backup_completado',
      mensaje: 'Backup diario completado exitosamente',
      datos: { backupId: backup.id, tamaño: backup.tamaño },
      empresaId
    })
  }

  private static async notificarProblemaRendimiento(empresaId: string, responseTime: number, error: any): Promise<void> {
    await this.crearEvento({
      tipo: 'problema_rendimiento',
      mensaje: `Problema de rendimiento detectado: ${responseTime}ms`,
      datos: { responseTime, error: error?.message },
      empresaId
    })
  }

  /**
   * Crear evento de monitoreo
   */
  private static async crearEvento(evento: Omit<EventoMonitoreo, 'id' | 'fechaCreacion' | 'procesado'>): Promise<void> {
    const { error } = await supabase
      .from('eventos_monitoreo')
      .insert({
        ...evento,
        fecha_creacion: new Date().toISOString(),
        procesado: false
      })

    if (error) {
      console.error('Error creando evento de monitoreo:', error)
    }
  }

  /**
   * Obtener eventos recientes
   */
  static async obtenerEventosRecientes(empresaId: string, limit = 50): Promise<EventoMonitoreo[]> {
    const { data, error } = await supabase
      .from('eventos_monitoreo')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('fecha_creacion', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error obteniendo eventos:', error)
      return []
    }

    return data || []
  }

  /**
   * Marcar eventos como procesados
   */
  static async marcarEventosProcesados(eventosIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('eventos_monitoreo')
      .update({ procesado: true })
      .in('id', eventosIds)

    if (error) {
      console.error('Error marcando eventos como procesados:', error)
    }
  }

  /**
   * Obtener estadísticas de monitoreo
   */
  static async obtenerEstadisticas(empresaId: string): Promise<{
    eventosHoy: number
    eventosSemana: number
    tiposEventos: Record<string, number>
  }> {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    const semanaAtras = new Date()
    semanaAtras.setDate(semanaAtras.getDate() - 7)

    // Eventos de hoy
    const { data: eventosHoy } = await supabase
      .from('eventos_monitoreo')
      .select('count')
      .eq('empresa_id', empresaId)
      .gte('fecha_creacion', hoy.toISOString())

    // Eventos de la semana
    const { data: eventosSemana } = await supabase
      .from('eventos_monitoreo')
      .select('count')
      .eq('empresa_id', empresaId)
      .gte('fecha_creacion', semanaAtras.toISOString())

    // Tipos de eventos
    const { data: tiposEventos } = await supabase
      .from('eventos_monitoreo')
      .select('tipo')
      .eq('empresa_id', empresaId)
      .gte('fecha_creacion', semanaAtras.toISOString())

    const tiposCount = (tiposEventos || []).reduce((acc, evento) => {
      acc[evento.tipo] = (acc[evento.tipo] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      eventosHoy: eventosHoy?.[0]?.count || 0,
      eventosSemana: eventosSemana?.[0]?.count || 0,
      tiposEventos: tiposCount
    }
  }
}

export default MonitoreoService
