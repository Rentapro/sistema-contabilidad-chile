// Servicio de APIs Reales Chilenas
// Integración con servicios gratuitos y oficiales de Chile

export class APIChilenaService {
  private readonly API_MINDICADOR = 'https://mindicador.cl/api'
  private readonly API_RUTIFICADOR = 'https://rutificador.cl/api'
  private readonly API_BANCOS_CHILE = 'https://api.sbif.cl/api-sbifv3'

  /**
   * Obtener indicadores económicos de Chile (UF, UTM, Dólar, etc.)
   */
  async obtenerIndicadoresEconomicos(): Promise<{
    uf: { valor: number; fecha: string }
    utm: { valor: number; fecha: string }
    dolar: { valor: number; fecha: string }
    euro: { valor: number; fecha: string }
    ipc: { valor: number; fecha: string }
  }> {
    try {
      const response = await fetch(`${this.API_MINDICADOR}`)
      
      if (!response.ok) {
        throw new Error(`Error API Mindicador: ${response.status}`)
      }

      const data = await response.json()

      return {
        uf: {
          valor: data.uf?.valor || 0,
          fecha: data.uf?.fecha || new Date().toISOString()
        },
        utm: {
          valor: data.utm?.valor || 0,
          fecha: data.utm?.fecha || new Date().toISOString()
        },
        dolar: {
          valor: data.dolar?.valor || 0,
          fecha: data.dolar?.fecha || new Date().toISOString()
        },
        euro: {
          valor: data.euro?.valor || 0,
          fecha: data.euro?.fecha || new Date().toISOString()
        },
        ipc: {
          valor: data.ipc?.valor || 0,
          fecha: data.ipc?.fecha || new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Error obteniendo indicadores económicos:', error)
      // Retornar valores por defecto en caso de error
      return {
        uf: { valor: 36000, fecha: new Date().toISOString() },
        utm: { valor: 62000, fecha: new Date().toISOString() },
        dolar: { valor: 900, fecha: new Date().toISOString() },
        euro: { valor: 950, fecha: new Date().toISOString() },
        ipc: { valor: 0.3, fecha: new Date().toISOString() }
      }
    }
  }

  /**
   * Obtener valor UF histórico para una fecha específica
   */
  async obtenerUFHistorica(fecha: string): Promise<{ valor: number; fecha: string }> {
    try {
      // Formato: YYYY-MM-DD
      const fechaFormateada = fecha.split('T')[0]
      const response = await fetch(`${this.API_MINDICADOR}/uf/${fechaFormateada}`)
      
      if (!response.ok) {
        throw new Error(`Error API UF histórica: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.serie && data.serie.length > 0) {
        return {
          valor: data.serie[0].valor,
          fecha: data.serie[0].fecha
        }
      }

      throw new Error('No se encontró valor UF para la fecha')
    } catch (error) {
      console.error('Error obteniendo UF histórica:', error)
      return { valor: 36000, fecha: fecha }
    }
  }

  /**
   * Validar RUT con servicio externo (respaldo)
   */
  async validarRUTExterno(rut: string): Promise<{
    valido: boolean
    formateado?: string
    empresa?: string
  }> {
    try {
      const rutLimpio = rut.replace(/[.-]/g, '')
      
      // Usar API pública de validación RUT
      const response = await fetch(`https://api.libreapi.cl/rut/${rutLimpio}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Sistema-Contabilidad-Chile/1.0'
        }
      })

      if (!response.ok) {
        throw new Error(`Error API RUT: ${response.status}`)
      }

      const data = await response.json()

      return {
        valido: data.valido || false,
        formateado: data.rut_formateado,
        empresa: data.razon_social
      }
    } catch (error) {
      console.error('Error validando RUT externo:', error)
      
      // Fallback a validación local
      return {
        valido: this.validarRUTLocal(rut),
        formateado: this.formatearRUT(rut)
      }
    }
  }

  /**
   * Obtener información de banco por código
   */
  async obtenerInfoBanco(codigoBanco: string): Promise<{
    nombre: string
    codigo: string
    swift?: string
  }> {
    // Base de datos estática de bancos chilenos más comunes
    const bancosChile: Record<string, { nombre: string; swift?: string }> = {
      '001': { nombre: 'Banco de Chile', swift: 'BCHICLRM' },
      '009': { nombre: 'Banco Internacional', swift: 'BINTCLRM' },
      '012': { nombre: 'Banco del Estado', swift: 'BECHCLRM' },
      '014': { nombre: 'Scotiabank Chile', swift: 'NOSCCLRM' },
      '016': { nombre: 'Banco de Crédito e Inversiones', swift: 'CREDCLRM' },
      '017': { nombre: 'Banco Corpbanca', swift: 'CORPCLRM' },
      '027': { nombre: 'Banco Security', swift: 'SECUCLRM' },
      '028': { nombre: 'Banco Falabella', swift: 'FAABCLRM' },
      '037': { nombre: 'Banco Santander Chile', swift: 'BSANCLRM' },
      '039': { nombre: 'Banco Itaú Chile', swift: 'ITAUCLRM' },
      '049': { nombre: 'Banco Ripley', swift: 'RIPLCLRM' },
      '051': { nombre: 'Banco Consorcio', swift: 'CONSCHCL' },
      '055': { nombre: 'Banco BTG Pactual Chile', swift: 'BTGPCLRM' }
    }

    const banco = bancosChile[codigoBanco]
    
    if (banco) {
      return {
        nombre: banco.nombre,
        codigo: codigoBanco,
        swift: banco.swift
      }
    }

    return {
      nombre: `Banco ${codigoBanco}`,
      codigo: codigoBanco
    }
  }

  /**
   * Obtener regiones de Chile
   */
  obtenerRegionesChile(): Array<{ codigo: string; nombre: string }> {
    return [
      { codigo: 'XV', nombre: 'Arica y Parinacota' },
      { codigo: 'I', nombre: 'Tarapacá' },
      { codigo: 'II', nombre: 'Antofagasta' },
      { codigo: 'III', nombre: 'Atacama' },
      { codigo: 'IV', nombre: 'Coquimbo' },
      { codigo: 'V', nombre: 'Valparaíso' },
      { codigo: 'RM', nombre: 'Metropolitana' },
      { codigo: 'VI', nombre: "O'Higgins" },
      { codigo: 'VII', nombre: 'Maule' },
      { codigo: 'XVI', nombre: 'Ñuble' },
      { codigo: 'VIII', nombre: 'Biobío' },
      { codigo: 'IX', nombre: 'Araucanía' },
      { codigo: 'XIV', nombre: 'Los Ríos' },
      { codigo: 'X', nombre: 'Los Lagos' },
      { codigo: 'XI', nombre: 'Aysén' },
      { codigo: 'XII', nombre: 'Magallanes y Antártica' }
    ]
  }

  /**
   * Obtener comunas por región
   */
  async obtenerComunasPorRegion(codigoRegion: string): Promise<Array<{ codigo: string; nombre: string }>> {
    // Retornar comunas más comunes por región
    const comunasPorRegion: Record<string, Array<{ codigo: string; nombre: string }>> = {
      'RM': [
        { codigo: '13101', nombre: 'Santiago' },
        { codigo: '13102', nombre: 'Cerrillos' },
        { codigo: '13103', nombre: 'Cerro Navia' },
        { codigo: '13104', nombre: 'Conchalí' },
        { codigo: '13105', nombre: 'El Bosque' },
        { codigo: '13106', nombre: 'Estación Central' },
        { codigo: '13107', nombre: 'Huechuraba' },
        { codigo: '13108', nombre: 'Independencia' },
        { codigo: '13109', nombre: 'La Cisterna' },
        { codigo: '13110', nombre: 'La Florida' },
        { codigo: '13111', nombre: 'La Granja' },
        { codigo: '13112', nombre: 'La Pintana' },
        { codigo: '13113', nombre: 'La Reina' },
        { codigo: '13114', nombre: 'Las Condes' },
        { codigo: '13115', nombre: 'Lo Barnechea' },
        { codigo: '13116', nombre: 'Lo Espejo' },
        { codigo: '13117', nombre: 'Lo Prado' },
        { codigo: '13118', nombre: 'Macul' },
        { codigo: '13119', nombre: 'Maipú' },
        { codigo: '13120', nombre: 'Ñuñoa' },
        { codigo: '13121', nombre: 'Pedro Aguirre Cerda' },
        { codigo: '13122', nombre: 'Peñalolén' },
        { codigo: '13123', nombre: 'Providencia' },
        { codigo: '13124', nombre: 'Pudahuel' },
        { codigo: '13125', nombre: 'Quilicura' },
        { codigo: '13126', nombre: 'Quinta Normal' },
        { codigo: '13127', nombre: 'Recoleta' },
        { codigo: '13128', nombre: 'Renca' },
        { codigo: '13129', nombre: 'San Joaquín' },
        { codigo: '13130', nombre: 'San Miguel' },
        { codigo: '13131', nombre: 'San Ramón' },
        { codigo: '13132', nombre: 'Vitacura' }
      ],
      'V': [
        { codigo: '05101', nombre: 'Valparaíso' },
        { codigo: '05102', nombre: 'Casablanca' },
        { codigo: '05103', nombre: 'Concón' },
        { codigo: '05104', nombre: 'Juan Fernández' },
        { codigo: '05105', nombre: 'Puchuncaví' },
        { codigo: '05106', nombre: 'Quilpué' },
        { codigo: '05107', nombre: 'Quintero' },
        { codigo: '05108', nombre: 'Villa Alemana' },
        { codigo: '05109', nombre: 'Viña del Mar' }
      ]
    }

    return comunasPorRegion[codigoRegion] || []
  }

  /**
   * Calcular días hábiles entre dos fechas (excluyendo feriados chilenos)
   */
  calcularDiasHabiles(fechaInicio: Date, fechaFin: Date): number {
    const feriadosChile2025 = [
      '2025-01-01', // Año Nuevo
      '2025-04-18', // Viernes Santo
      '2025-04-19', // Sábado Santo
      '2025-05-01', // Día del Trabajador
      '2025-05-21', // Día de las Glorias Navales
      '2025-06-29', // San Pedro y San Pablo
      '2025-07-16', // Día de la Virgen del Carmen
      '2025-08-15', // Asunción de la Virgen
      '2025-09-18', // Independencia Nacional
      '2025-09-19', // Día de las Glorias del Ejército
      '2025-10-12', // Encuentro de Dos Mundos
      '2025-10-31', // Día de las Iglesias Evangélicas y Protestantes
      '2025-11-01', // Día de Todos los Santos
      '2025-12-08', // Inmaculada Concepción
      '2025-12-25'  // Navidad
    ]

    let diasHabiles = 0
    const fechaActual = new Date(fechaInicio)

    while (fechaActual <= fechaFin) {
      const diaSemana = fechaActual.getDay()
      const fechaStr = fechaActual.toISOString().split('T')[0]

      // Si no es fin de semana (0=domingo, 6=sábado) y no es feriado
      if (diaSemana !== 0 && diaSemana !== 6 && !feriadosChile2025.includes(fechaStr)) {
        diasHabiles++
      }

      fechaActual.setDate(fechaActual.getDate() + 1)
    }

    return diasHabiles
  }

  /**
   * Validación local de RUT (fallback)
   */
  private validarRUTLocal(rut: string): boolean {
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
   * Formatear RUT chileno
   */
  private formatearRUT(rut: string): string {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '')
    if (rutLimpio.length < 8) return rut

    const cuerpo = rutLimpio.slice(0, -1)
    const dv = rutLimpio.slice(-1)

    const cuerpoFormateado = parseInt(cuerpo).toLocaleString('es-CL')
    return `${cuerpoFormateado}-${dv.toUpperCase()}`
  }
}

// Exportar instancia singleton
export const apiChilenaService = new APIChilenaService()
