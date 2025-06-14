// Servicio Real de Facturación - Con Base de Datos y SII
import { supabase } from '@/lib/supabase'
import { siiService } from './siiService'

export interface Factura {
  id: string
  empresa_id: string
  cliente_id: string | null
  numero_factura: string
  folio: number
  tipo_documento: number // 33=Factura, 34=Factura Exenta, 39=Boleta
  fecha_emision: string
  fecha_vencimiento: string | null
  monto_neto: number
  monto_iva: number
  monto_total: number
  estado: 'pendiente' | 'pagada' | 'vencida' | 'anulada'
  observaciones?: string
  track_id?: string // ID de seguimiento SII
  estado_sii?: 'ACEPTADO' | 'RECHAZADO' | 'PROCESANDO'
  xml_dte?: string
  pdf_url?: string
  created_at: string
  updated_at: string
  // Relaciones
  cliente?: {
    rut: string
    razon_social: string
    email?: string
  }
  detalles?: FacturaDetalle[]
}

export interface FacturaDetalle {
  id: string
  factura_id: string
  producto_id?: string
  descripcion: string
  cantidad: number
  precio_unitario: number
  descuento_porcentaje: number
  monto_neto: number
  exento_iva: boolean
}

export interface FacturaCreate {
  cliente_id: string
  tipo_documento?: number
  fecha_emision: string
  fecha_vencimiento?: string
  observaciones?: string
  detalles: {
    producto_id?: string
    descripcion: string
    cantidad: number
    precio_unitario: number
    descuento_porcentaje?: number
    exento_iva?: boolean
  }[]
}

class FacturacionService {
  private empresaId: string
  private IVA_RATE = 0.19 // 19% IVA Chile

  constructor(empresaId: string = '76123456-7') {
    this.empresaId = empresaId
  }

  /**
   * Obtener todas las facturas
   */
  async obtenerFacturas(filtros?: {
    estado?: string
    cliente_id?: string
    fecha_desde?: string
    fecha_hasta?: string
    limite?: number
  }): Promise<Factura[]> {
    try {
      let query = supabase
        .from('facturas')
        .select(`
          *,
          cliente:clientes(rut, razon_social, email),
          detalles:factura_detalles(*)
        `)
        .eq('empresa_id', this.empresaId)

      if (filtros?.estado) {
        query = query.eq('estado', filtros.estado)
      }

      if (filtros?.cliente_id) {
        query = query.eq('cliente_id', filtros.cliente_id)
      }

      if (filtros?.fecha_desde) {
        query = query.gte('fecha_emision', filtros.fecha_desde)
      }

      if (filtros?.fecha_hasta) {
        query = query.lte('fecha_emision', filtros.fecha_hasta)
      }

      query = query.order('fecha_emision', { ascending: false })

      if (filtros?.limite) {
        query = query.limit(filtros.limite)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener facturas: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error en obtenerFacturas:', error)
      throw error
    }
  }

  /**
   * Obtener factura por ID
   */
  async obtenerFacturaPorId(id: string): Promise<Factura | null> {
    try {
      const { data, error } = await supabase
        .from('facturas')
        .select(`
          *,
          cliente:clientes(rut, razon_social, email),
          detalles:factura_detalles(*)
        `)
        .eq('id', id)
        .eq('empresa_id', this.empresaId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw new Error(`Error al obtener factura: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error en obtenerFacturaPorId:', error)
      throw error
    }
  }

  /**
   * Crear nueva factura
   */
  async crearFactura(facturaData: FacturaCreate): Promise<Factura> {
    try {
      // 1. Calcular totales
      const totales = this.calcularTotales(facturaData.detalles)
      
      // 2. Obtener siguiente folio
      const siguienteFolio = await this.obtenerSiguienteFolio(facturaData.tipo_documento || 33)
      
      // 3. Generar número de factura
      const numeroFactura = `${facturaData.tipo_documento || 33}-${siguienteFolio}`

      // 4. Crear factura en base de datos
      const { data: factura, error: facturaError } = await supabase
        .from('facturas')
        .insert({
          empresa_id: this.empresaId,
          cliente_id: facturaData.cliente_id,
          numero_factura: numeroFactura,
          folio: siguienteFolio,
          tipo_documento: facturaData.tipo_documento || 33,
          fecha_emision: facturaData.fecha_emision,
          fecha_vencimiento: facturaData.fecha_vencimiento,
          monto_neto: totales.neto,
          monto_iva: totales.iva,
          monto_total: totales.total,
          estado: 'pendiente',
          observaciones: facturaData.observaciones
        })
        .select()
        .single()

      if (facturaError) {
        throw new Error(`Error al crear factura: ${facturaError.message}`)
      }

      // 5. Crear detalles de factura
      const detallesConId = facturaData.detalles.map(detalle => ({
        factura_id: factura.id,
        producto_id: detalle.producto_id,
        descripcion: detalle.descripcion,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        descuento_porcentaje: detalle.descuento_porcentaje || 0,
        monto_neto: this.calcularMontoNetoDetalle(detalle),
        exento_iva: detalle.exento_iva || false
      }))

      const { error: detallesError } = await supabase
        .from('factura_detalles')
        .insert(detallesConId)

      if (detallesError) {
        // Rollback: eliminar factura si fallan los detalles
        await supabase.from('facturas').delete().eq('id', factura.id)
        throw new Error(`Error al crear detalles: ${detallesError.message}`)
      }

      // 6. Intentar enviar al SII (si está configurado)
      try {
        await this.enviarAlSII(factura.id)
      } catch (siiError) {
        console.warn('Error enviando al SII (continuando):', siiError)
        // No fallar la creación por errores del SII
      }

      console.log('✅ Factura creada exitosamente:', numeroFactura)
      
      // 7. Retornar factura completa
      return await this.obtenerFacturaPorId(factura.id) as Factura
    } catch (error) {
      console.error('Error en crearFactura:', error)
      throw error
    }
  }

  /**
   * Actualizar estado de factura
   */
  async actualizarEstadoFactura(id: string, estado: Factura['estado']): Promise<Factura> {
    try {
      const { data, error } = await supabase
        .from('facturas')
        .update({ estado })
        .eq('id', id)
        .eq('empresa_id', this.empresaId)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar estado: ${error.message}`)
      }

      console.log('✅ Estado de factura actualizado:', estado)
      return data
    } catch (error) {
      console.error('Error en actualizarEstadoFactura:', error)
      throw error
    }
  }

  /**
   * Enviar factura al SII
   */
  async enviarAlSII(facturaId: string): Promise<{ success: boolean; trackId?: string; error?: string }> {
    try {
      const factura = await this.obtenerFacturaPorId(facturaId)
      if (!factura) {
        throw new Error('Factura no encontrada')
      }

      // Obtener folios CAF del SII
      const folios = await siiService.obtenerCAF(factura.tipo_documento)
      if (folios.length === 0) {
        throw new Error('No hay folios CAF disponibles')
      }

      // Preparar documento para SII
      const documentoSII = {
        folio: factura.folio,
        tipo: factura.tipo_documento,
        rutEmisor: this.empresaId,
        rutReceptor: factura.cliente?.rut || '11111111-1',
        fechaEmision: new Date(factura.fecha_emision),
        montoNeto: factura.monto_neto,
        montoIVA: factura.monto_iva,
        montoTotal: factura.monto_total,
        glosa: factura.observaciones,
        items: factura.detalles?.map(detalle => ({
          nombre: detalle.descripcion,
          cantidad: detalle.cantidad,
          precio: detalle.precio_unitario,
          exento: detalle.exento_iva
        })) || []
      }

      // Enviar al SII
      const respuestaSII = await siiService.enviarDTE(documentoSII, folios[0])

      // Actualizar factura con respuesta del SII
      await supabase
        .from('facturas')
        .update({
          track_id: respuestaSII.trackId,
          estado_sii: respuestaSII.estado || 'PROCESANDO'
        })
        .eq('id', facturaId)

      return respuestaSII
    } catch (error) {
      console.error('Error enviando al SII:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
    }
  }

  /**
   * Consultar estado en SII
   */
  async consultarEstadoSII(facturaId: string): Promise<{ success: boolean; estado?: string; mensaje?: string }> {
    try {
      const factura = await this.obtenerFacturaPorId(facturaId)
      if (!factura || !factura.track_id) {
        throw new Error('Factura no tiene track ID del SII')
      }

      const respuesta = await siiService.consultarEstadoDTE(factura.track_id)

      // Actualizar estado en base de datos
      if (respuesta.success && respuesta.estado) {
        await supabase
          .from('facturas')
          .update({ estado_sii: respuesta.estado })
          .eq('id', facturaId)
      }

      return respuesta
    } catch (error) {
      console.error('Error consultando estado SII:', error)
      return { success: false, mensaje: error instanceof Error ? error.message : 'Error desconocido' }
    }
  }

  /**
   * Generar PDF de factura
   */
  async generarPDF(facturaId: string): Promise<string> {
    try {
      const factura = await this.obtenerFacturaPorId(facturaId)
      if (!factura) {
        throw new Error('Factura no encontrada')
      }

      // Aquí iría la lógica de generación de PDF
      // Por ahora retornamos una URL simulada
      const pdfUrl = `/api/facturas/${facturaId}/pdf`

      // Actualizar URL en base de datos
      await supabase
        .from('facturas')
        .update({ pdf_url: pdfUrl })
        .eq('id', facturaId)

      return pdfUrl
    } catch (error) {
      console.error('Error generando PDF:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de facturación
   */
  async obtenerEstadisticas(mes?: string): Promise<{
    total_facturas: number
    monto_total: number
    facturas_pendientes: number
    facturas_pagadas: number
    facturas_vencidas: number
    promedio_factura: number
  }> {
    try {
      let query = supabase
        .from('facturas')
        .select('estado, monto_total, fecha_emision')
        .eq('empresa_id', this.empresaId)

      if (mes) {
        const [año, mesNum] = mes.split('-')
        query = query
          .gte('fecha_emision', `${año}-${mesNum}-01`)
          .lt('fecha_emision', `${año}-${String(parseInt(mesNum) + 1).padStart(2, '0')}-01`)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener estadísticas: ${error.message}`)
      }

      const facturas = data || []
      const totalMontos = facturas.reduce((sum, f) => sum + f.monto_total, 0)

      return {
        total_facturas: facturas.length,
        monto_total: totalMontos,
        facturas_pendientes: facturas.filter(f => f.estado === 'pendiente').length,
        facturas_pagadas: facturas.filter(f => f.estado === 'pagada').length,
        facturas_vencidas: facturas.filter(f => f.estado === 'vencida').length,
        promedio_factura: facturas.length > 0 ? totalMontos / facturas.length : 0
      }
    } catch (error) {
      console.error('Error en obtenerEstadisticas:', error)
      throw error
    }
  }

  /**
   * Calcular totales de una factura
   */
  private calcularTotales(detalles: FacturaCreate['detalles']): {
    neto: number
    iva: number
    total: number
  } {
    let totalNeto = 0
    let totalIva = 0

    for (const detalle of detalles) {
      const montoNeto = this.calcularMontoNetoDetalle(detalle)
      totalNeto += montoNeto
      
      if (!detalle.exento_iva) {
        totalIva += montoNeto * this.IVA_RATE
      }
    }

    // Redondear a 2 decimales
    totalNeto = Math.round(totalNeto * 100) / 100
    totalIva = Math.round(totalIva * 100) / 100
    const total = Math.round((totalNeto + totalIva) * 100) / 100

    return {
      neto: totalNeto,
      iva: totalIva,
      total: total
    }
  }

  /**
   * Calcular monto neto de un detalle
   */
  private calcularMontoNetoDetalle(detalle: FacturaCreate['detalles'][0]): number {
    const subtotal = detalle.cantidad * detalle.precio_unitario
    const descuento = subtotal * ((detalle.descuento_porcentaje || 0) / 100)
    return subtotal - descuento
  }

  /**
   * Obtener siguiente folio disponible
   */
  private async obtenerSiguienteFolio(tipoDocumento: number): Promise<number> {
    try {
      // Obtener último folio usado
      const { data, error } = await supabase
        .from('facturas')
        .select('folio')
        .eq('empresa_id', this.empresaId)
        .eq('tipo_documento', tipoDocumento)
        .order('folio', { ascending: false })
        .limit(1)

      if (error) {
        throw new Error(`Error obteniendo último folio: ${error.message}`)
      }

      const ultimoFolio = data && data.length > 0 ? data[0].folio : 0
      return ultimoFolio + 1
    } catch (error) {
      console.error('Error en obtenerSiguienteFolio:', error)
      // En caso de error, empezar desde 1000
      return 1000
    }
  }
}

// Exportar instancia singleton
export const facturacionService = new FacturacionService()

// Hook para React Query
export const useFacturacionService = (empresaId?: string) => {
  return new FacturacionService(empresaId)
}
