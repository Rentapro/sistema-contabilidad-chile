/**
 * Servicio de Exportación Excel Real - XLSX
 * Sistema Contabilidad Chile
 */

import * as XLSX from 'xlsx'

export interface ExcelReporteData {
  hoja: string
  datos: Array<Record<string, any>>
  encabezados?: Record<string, string>
}

export class ExcelService {
  
  /**
   * Crear libro de Excel con múltiples hojas
   */
  static crearLibroExcel(reportes: ExcelReporteData[]): XLSX.WorkBook {
    const libro = XLSX.utils.book_new()
    
    reportes.forEach(reporte => {
      // Crear hoja de trabajo
      const hoja = XLSX.utils.json_to_sheet(reporte.datos)
      
      // Aplicar encabezados personalizados si existen
      if (reporte.encabezados) {
        const range = XLSX.utils.decode_range(hoja['!ref'] || 'A1')
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
          const currentValue = hoja[cellAddress]?.v
          if (currentValue && reporte.encabezados[currentValue]) {
            hoja[cellAddress].v = reporte.encabezados[currentValue]
          }
        }
      }
      
      // Ajustar ancho de columnas
      const colWidths = []
      const range = XLSX.utils.decode_range(hoja['!ref'] || 'A1')
      
      for (let col = range.s.c; col <= range.e.c; col++) {
        let maxWidth = 10
        for (let row = range.s.r; row <= range.e.r; row++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
          const cell = hoja[cellAddress]
          if (cell && cell.v) {
            const cellLength = cell.v.toString().length
            maxWidth = Math.max(maxWidth, cellLength)
          }
        }
        colWidths.push({ width: Math.min(maxWidth + 2, 50) })
      }
      
      hoja['!cols'] = colWidths
      
      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(libro, hoja, reporte.hoja)
    })
    
    return libro
  }
  
  /**
   * Exportar facturas a Excel
   */
  static exportarFacturas(
    facturas: Array<{
      numero: string
      fecha: Date
      cliente: string
      rutCliente: string
      subtotal: number
      iva: number
      total: number
      estado: string
    }>,
    periodo: string
  ): string {
    const datosFormateados = facturas.map(factura => ({
      'Número': factura.numero,
      'Fecha': factura.fecha.toLocaleDateString('es-CL'),
      'Cliente': factura.cliente,
      'RUT Cliente': factura.rutCliente,
      'Subtotal': factura.subtotal,
      'IVA': factura.iva,
      'Total': factura.total,
      'Estado': factura.estado
    }))
    
    // Agregar hoja de resumen
    const totalFacturado = facturas.reduce((sum, f) => sum + f.total, 0)
    const totalIva = facturas.reduce((sum, f) => sum + f.iva, 0)
    const cantidadFacturas = facturas.length
    
    const resumen = [{
      'Concepto': 'Total Facturas',
      'Valor': cantidadFacturas
    }, {
      'Concepto': 'Total Facturado',
      'Valor': totalFacturado
    }, {
      'Concepto': 'Total IVA',
      'Valor': totalIva
    }, {
      'Concepto': 'Período',
      'Valor': periodo
    }]
    
    const libro = this.crearLibroExcel([
      {
        hoja: 'Facturas',
        datos: datosFormateados
      },
      {
        hoja: 'Resumen',
        datos: resumen
      }
    ])
    
    // Convertir a base64
    const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' })
    return Buffer.from(buffer).toString('base64')
  }
  
  /**
   * Exportar clientes a Excel
   */
  static exportarClientes(
    clientes: Array<{
      rut: string
      nombre: string
      email: string
      telefono: string
      direccion: string
      comuna: string
      region: string
      activo: boolean
      fechaCreacion: Date
    }>
  ): string {
    const datosFormateados = clientes.map(cliente => ({
      'RUT': cliente.rut,
      'Nombre': cliente.nombre,
      'Email': cliente.email,
      'Teléfono': cliente.telefono,
      'Dirección': cliente.direccion,
      'Comuna': cliente.comuna,
      'Región': cliente.region,
      'Estado': cliente.activo ? 'Activo' : 'Inactivo',
      'Fecha Creación': cliente.fechaCreacion.toLocaleDateString('es-CL')
    }))
    
    const libro = this.crearLibroExcel([{
      hoja: 'Clientes',
      datos: datosFormateados
    }])
    
    const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' })
    return Buffer.from(buffer).toString('base64')
  }
  
  /**
   * Exportar gastos a Excel
   */
  static exportarGastos(
    gastos: Array<{
      fecha: Date
      proveedor: string
      concepto: string
      categoria: string
      neto: number
      iva: number
      total: number
      numeroDocumento: string
    }>,
    periodo: string
  ): string {
    const datosFormateados = gastos.map(gasto => ({
      'Fecha': gasto.fecha.toLocaleDateString('es-CL'),
      'Proveedor': gasto.proveedor,
      'Concepto': gasto.concepto,
      'Categoría': gasto.categoria,
      'Neto': gasto.neto,
      'IVA': gasto.iva,
      'Total': gasto.total,
      'N° Documento': gasto.numeroDocumento
    }))
    
    // Resumen por categorías
    const gastosPorCategoria = gastos.reduce((acc, gasto) => {
      if (!acc[gasto.categoria]) {
        acc[gasto.categoria] = 0
      }
      acc[gasto.categoria] += gasto.total
      return acc
    }, {} as Record<string, number>)
    
    const resumenCategorias = Object.entries(gastosPorCategoria).map(([categoria, total]) => ({
      'Categoría': categoria,
      'Total': total
    }))
    
    const libro = this.crearLibroExcel([
      {
        hoja: 'Gastos',
        datos: datosFormateados
      },
      {
        hoja: 'Por Categoría',
        datos: resumenCategorias
      }
    ])
    
    const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' })
    return Buffer.from(buffer).toString('base64')
  }
  
  /**
   * Exportar estado de resultados a Excel
   */
  static exportarEstadoResultados(
    datos: {
      periodo: string
      ingresos: Array<{ concepto: string, monto: number }>
      costos: Array<{ concepto: string, monto: number }>
      gastosOperacionales: Array<{ concepto: string, monto: number }>
      otrosIngresos: Array<{ concepto: string, monto: number }>
      otrosGastos: Array<{ concepto: string, monto: number }>
    }
  ): string {
    // Calcular totales
    const totalIngresos = datos.ingresos.reduce((sum, item) => sum + item.monto, 0)
    const totalCostos = datos.costos.reduce((sum, item) => sum + item.monto, 0)
    const totalGastosOp = datos.gastosOperacionales.reduce((sum, item) => sum + item.monto, 0)
    const totalOtrosIngresos = datos.otrosIngresos.reduce((sum, item) => sum + item.monto, 0)
    const totalOtrosGastos = datos.otrosGastos.reduce((sum, item) => sum + item.monto, 0)
    
    const utilidadBruta = totalIngresos - totalCostos
    const utilidadOperacional = utilidadBruta - totalGastosOp
    const utilidadNeta = utilidadOperacional + totalOtrosIngresos - totalOtrosGastos
    
    // Crear estructura del estado de resultados
    const estadoResultados = [
      { 'Concepto': 'INGRESOS', 'Monto': '' },
      ...datos.ingresos.map(item => ({ 'Concepto': `  ${item.concepto}`, 'Monto': item.monto })),
      { 'Concepto': 'TOTAL INGRESOS', 'Monto': totalIngresos },
      { 'Concepto': '', 'Monto': '' },
      { 'Concepto': 'COSTOS DE VENTAS', 'Monto': '' },
      ...datos.costos.map(item => ({ 'Concepto': `  ${item.concepto}`, 'Monto': item.monto })),
      { 'Concepto': 'TOTAL COSTOS', 'Monto': totalCostos },
      { 'Concepto': '', 'Monto': '' },
      { 'Concepto': 'UTILIDAD BRUTA', 'Monto': utilidadBruta },
      { 'Concepto': '', 'Monto': '' },
      { 'Concepto': 'GASTOS OPERACIONALES', 'Monto': '' },
      ...datos.gastosOperacionales.map(item => ({ 'Concepto': `  ${item.concepto}`, 'Monto': item.monto })),
      { 'Concepto': 'TOTAL GASTOS OPERACIONALES', 'Monto': totalGastosOp },
      { 'Concepto': '', 'Monto': '' },
      { 'Concepto': 'UTILIDAD OPERACIONAL', 'Monto': utilidadOperacional },
      { 'Concepto': '', 'Monto': '' },
      { 'Concepto': 'OTROS INGRESOS', 'Monto': '' },
      ...datos.otrosIngresos.map(item => ({ 'Concepto': `  ${item.concepto}`, 'Monto': item.monto })),
      { 'Concepto': 'TOTAL OTROS INGRESOS', 'Monto': totalOtrosIngresos },
      { 'Concepto': '', 'Monto': '' },
      { 'Concepto': 'OTROS GASTOS', 'Monto': '' },
      ...datos.otrosGastos.map(item => ({ 'Concepto': `  ${item.concepto}`, 'Monto': item.monto })),
      { 'Concepto': 'TOTAL OTROS GASTOS', 'Monto': totalOtrosGastos },
      { 'Concepto': '', 'Monto': '' },
      { 'Concepto': 'UTILIDAD NETA', 'Monto': utilidadNeta }
    ]
    
    const libro = this.crearLibroExcel([{
      hoja: `Estado Resultados ${datos.periodo}`,
      datos: estadoResultados
    }])
    
    const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' })
    return Buffer.from(buffer).toString('base64')
  }
  
  /**
   * Exportar balance general a Excel
   */
  static exportarBalance(
    datos: {
      fecha: Date
      activos: Array<{ cuenta: string, monto: number }>
      pasivos: Array<{ cuenta: string, monto: number }>
      patrimonio: Array<{ cuenta: string, monto: number }>
    }
  ): string {
    const totalActivos = datos.activos.reduce((sum, item) => sum + item.monto, 0)
    const totalPasivos = datos.pasivos.reduce((sum, item) => sum + item.monto, 0)
    const totalPatrimonio = datos.patrimonio.reduce((sum, item) => sum + item.monto, 0)
    
    const balance = [
      { 'Cuenta': 'ACTIVOS', 'Monto': '' },
      ...datos.activos.map(item => ({ 'Cuenta': `  ${item.cuenta}`, 'Monto': item.monto })),
      { 'Cuenta': 'TOTAL ACTIVOS', 'Monto': totalActivos },
      { 'Cuenta': '', 'Monto': '' },
      { 'Cuenta': 'PASIVOS', 'Monto': '' },
      ...datos.pasivos.map(item => ({ 'Cuenta': `  ${item.cuenta}`, 'Monto': item.monto })),
      { 'Cuenta': 'TOTAL PASIVOS', 'Monto': totalPasivos },
      { 'Cuenta': '', 'Monto': '' },
      { 'Cuenta': 'PATRIMONIO', 'Monto': '' },
      ...datos.patrimonio.map(item => ({ 'Cuenta': `  ${item.cuenta}`, 'Monto': item.monto })),
      { 'Cuenta': 'TOTAL PATRIMONIO', 'Monto': totalPatrimonio }
    ]
    
    const libro = this.crearLibroExcel([{
      hoja: `Balance ${datos.fecha.toLocaleDateString('es-CL')}`,
      datos: balance
    }])
    
    const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' })
    return Buffer.from(buffer).toString('base64')
  }
}

export default ExcelService
