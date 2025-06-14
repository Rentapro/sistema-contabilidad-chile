// Servicio de Datos Real - Clientes
// Conexión directa con Supabase PostgreSQL
import { supabase } from '@/lib/supabase'

export interface Cliente {
  id: string
  empresa_id: string
  rut: string
  tipo: 'persona_natural' | 'empresa'
  razon_social: string
  nombre_fantasia?: string
  email?: string
  telefono?: string
  direccion?: string
  ciudad?: string
  region?: string
  codigo_postal?: string
  limite_credito: number
  dias_credito: number
  activo: boolean
  created_at: string
  updated_at: string
}

export interface ClienteCreate {
  rut: string
  tipo?: 'persona_natural' | 'empresa'
  razon_social: string
  nombre_fantasia?: string
  email?: string
  telefono?: string
  direccion?: string
  ciudad?: string
  region?: string
  codigo_postal?: string
  limite_credito?: number
  dias_credito?: number
  activo?: boolean
}

export interface ClienteUpdate extends Partial<ClienteCreate> {
  id: string
}

class ClienteService {
  private empresaId: string

  constructor(empresaId: string = '76123456-7') {
    this.empresaId = empresaId
  }

  /**
   * Obtener todos los clientes de la empresa
   */
  async obtenerClientes(): Promise<Cliente[]> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('empresa_id', this.empresaId)
        .eq('activo', true)
        .order('razon_social', { ascending: true })

      if (error) {
        console.error('Error obteniendo clientes:', error)
        throw new Error(`Error al obtener clientes: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error en obtenerClientes:', error)
      throw error
    }
  }

  /**
   * Obtener cliente por ID
   */
  async obtenerClientePorId(id: string): Promise<Cliente | null> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .eq('empresa_id', this.empresaId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No encontrado
        }
        throw new Error(`Error al obtener cliente: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error en obtenerClientePorId:', error)
      throw error
    }
  }

  /**
   * Buscar cliente por RUT
   */
  async buscarClientePorRUT(rut: string): Promise<Cliente | null> {
    try {
      const rutLimpio = rut.replace(/[.-]/g, '')
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('rut', rutLimpio)
        .eq('empresa_id', this.empresaId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No encontrado
        }
        throw new Error(`Error al buscar cliente: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error en buscarClientePorRUT:', error)
      throw error
    }
  }

  /**
   * Crear nuevo cliente
   */
  async crearCliente(clienteData: ClienteCreate): Promise<Cliente> {
    try {
      // Validar RUT
      if (!this.validarRUT(clienteData.rut)) {
        throw new Error('RUT inválido')
      }

      // Verificar que no exista el RUT
      const clienteExistente = await this.buscarClientePorRUT(clienteData.rut)
      if (clienteExistente) {
        throw new Error('Ya existe un cliente con este RUT')
      }

      const rutLimpio = clienteData.rut.replace(/[.-]/g, '')

      const { data, error } = await supabase
        .from('clientes')
        .insert({
          empresa_id: this.empresaId,
          rut: rutLimpio,
          tipo: clienteData.tipo || 'persona_natural',
          razon_social: clienteData.razon_social,
          nombre_fantasia: clienteData.nombre_fantasia,
          email: clienteData.email,
          telefono: clienteData.telefono,
          direccion: clienteData.direccion,
          ciudad: clienteData.ciudad,
          region: clienteData.region,
          codigo_postal: clienteData.codigo_postal,
          limite_credito: clienteData.limite_credito || 0,
          dias_credito: clienteData.dias_credito || 30,
          activo: clienteData.activo !== false
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear cliente: ${error.message}`)
      }

      console.log('✅ Cliente creado exitosamente:', data.razon_social)
      return data
    } catch (error) {
      console.error('Error en crearCliente:', error)
      throw error
    }
  }

  /**
   * Actualizar cliente
   */
  async actualizarCliente(id: string, clienteData: Partial<ClienteCreate>): Promise<Cliente> {
    try {
      // Si se actualiza el RUT, validarlo
      if (clienteData.rut && !this.validarRUT(clienteData.rut)) {
        throw new Error('RUT inválido')
      }

      const updateData: any = { ...clienteData }
      if (updateData.rut) {
        updateData.rut = updateData.rut.replace(/[.-]/g, '')
      }

      const { data, error } = await supabase
        .from('clientes')
        .update(updateData)
        .eq('id', id)
        .eq('empresa_id', this.empresaId)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar cliente: ${error.message}`)
      }

      console.log('✅ Cliente actualizado exitosamente:', data.razon_social)
      return data
    } catch (error) {
      console.error('Error en actualizarCliente:', error)
      throw error
    }
  }

  /**
   * Eliminar cliente (soft delete)
   */
  async eliminarCliente(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clientes')
        .update({ activo: false })
        .eq('id', id)
        .eq('empresa_id', this.empresaId)

      if (error) {
        throw new Error(`Error al eliminar cliente: ${error.message}`)
      }

      console.log('✅ Cliente eliminado exitosamente')
      return true
    } catch (error) {
      console.error('Error en eliminarCliente:', error)
      throw error
    }
  }

  /**
   * Buscar clientes con filtros
   */
  async buscarClientes(filtros: {
    busqueda?: string
    region?: string
    tipo?: 'persona_natural' | 'empresa'
    limite?: number
  }): Promise<Cliente[]> {
    try {
      let query = supabase
        .from('clientes')
        .select('*')
        .eq('empresa_id', this.empresaId)
        .eq('activo', true)

      if (filtros.busqueda) {
        query = query.or(`razon_social.ilike.%${filtros.busqueda}%,rut.ilike.%${filtros.busqueda}%`)
      }

      if (filtros.region) {
        query = query.eq('region', filtros.region)
      }

      if (filtros.tipo) {
        query = query.eq('tipo', filtros.tipo)
      }

      query = query.order('razon_social', { ascending: true })

      if (filtros.limite) {
        query = query.limit(filtros.limite)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al buscar clientes: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error en buscarClientes:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de clientes
   */
  async obtenerEstadisticas(): Promise<{
    total: number
    personas_naturales: number
    empresas: number
    activos: number
    con_limite_credito: number
  }> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('tipo, activo, limite_credito')
        .eq('empresa_id', this.empresaId)

      if (error) {
        throw new Error(`Error al obtener estadísticas: ${error.message}`)
      }

      const stats = {
        total: data.length,
        personas_naturales: data.filter(c => c.tipo === 'persona_natural').length,
        empresas: data.filter(c => c.tipo === 'empresa').length,
        activos: data.filter(c => c.activo).length,
        con_limite_credito: data.filter(c => c.limite_credito > 0).length
      }

      return stats
    } catch (error) {
      console.error('Error en obtenerEstadisticas:', error)
      throw error
    }
  }

  /**
   * Validar RUT chileno
   */
  private validarRUT(rut: string): boolean {
    if (!rut) return false
    
    const rutLimpio = rut.replace(/[.-]/g, '')
    if (rutLimpio.length < 8 || rutLimpio.length > 9) return false

    const cuerpo = rutLimpio.slice(0, -1)
    const dv = rutLimpio.slice(-1).toLowerCase()

    if (!/^\d+$/.test(cuerpo)) return false

    let suma = 0
    let multiplo = 2

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo
      multiplo = multiplo === 7 ? 2 : multiplo + 1
    }

    const resto = suma % 11
    const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'k' : (11 - resto).toString()

    return dv === dvCalculado
  }

  /**
   * Formatear RUT para mostrar
   */
  formatearRUT(rut: string): string {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '')
    if (rutLimpio.length < 8) return rut

    const cuerpo = rutLimpio.slice(0, -1)
    const dv = rutLimpio.slice(-1)

    const cuerpoFormateado = parseInt(cuerpo).toLocaleString('es-CL')
    return `${cuerpoFormateado}-${dv.toUpperCase()}`
  }
}

// Exportar instancia singleton
export const clienteService = new ClienteService()

// Hook para React Query (opcional)
export const useClienteService = (empresaId?: string) => {
  return new ClienteService(empresaId)
}
