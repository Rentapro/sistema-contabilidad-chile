/**
 * Servicio de Generación PDF Real - jsPDF
 * Sistema Contabilidad Chile
 */

import jsPDF from 'jspdf'
import 'jspdf-autotable'

export interface FacturaData {
  numero: string
  fecha: Date
  fechaVencimiento: Date
  empresa: {
    rut: string
    nombre: string
    direccion: string
    telefono: string
    email: string
  }
  cliente: {
    rut: string
    nombre: string
    direccion: string
    telefono?: string
    email?: string
  }
  items: Array<{
    descripcion: string
    cantidad: number
    precioUnitario: number
    total: number
  }>
  subtotal: number
  iva: number
  total: number
  observaciones?: string
}

export class PDFService {
  
  /**
   * Generar PDF de factura electrónica
   */
  static generarFacturaPDF(factura: FacturaData): string {
    const doc = new jsPDF()
    
    // Configuración inicial
    doc.setFont('helvetica')
    
    // Header - Logo y título
    doc.setFontSize(20)
    doc.setTextColor(37, 99, 235) // Azul
    doc.text('FACTURA ELECTRÓNICA', 20, 25)
    
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`N° ${factura.numero}`, 150, 25)
    
    // Datos de la empresa
    doc.setFontSize(14)
    doc.text('DATOS DEL EMISOR', 20, 45)
    doc.setFontSize(10)
    doc.text(factura.empresa.nombre, 20, 55)
    doc.text(`RUT: ${factura.empresa.rut}`, 20, 62)
    doc.text(factura.empresa.direccion, 20, 69)
    doc.text(`Tel: ${factura.empresa.telefono}`, 20, 76)
    doc.text(`Email: ${factura.empresa.email}`, 20, 83)
    
    // Datos del cliente
    doc.setFontSize(14)
    doc.text('DATOS DEL RECEPTOR', 110, 45)
    doc.setFontSize(10)
    doc.text(factura.cliente.nombre, 110, 55)
    doc.text(`RUT: ${factura.cliente.rut}`, 110, 62)
    doc.text(factura.cliente.direccion, 110, 69)
    if (factura.cliente.telefono) {
      doc.text(`Tel: ${factura.cliente.telefono}`, 110, 76)
    }
    if (factura.cliente.email) {
      doc.text(`Email: ${factura.cliente.email}`, 110, 83)
    }
    
    // Fechas
    doc.setFontSize(10)
    doc.text(`Fecha Emisión: ${factura.fecha.toLocaleDateString('es-CL')}`, 20, 95)
    doc.text(`Fecha Vencimiento: ${factura.fechaVencimiento.toLocaleDateString('es-CL')}`, 110, 95)
    
    // Línea separadora
    doc.line(20, 100, 190, 100)
    
    // Tabla de items
    const tableData = factura.items.map(item => [
      item.descripcion,
      item.cantidad.toString(),
      `$${item.precioUnitario.toLocaleString('es-CL')}`,
      `$${item.total.toLocaleString('es-CL')}`
    ])
    
    ;(doc as any).autoTable({
      startY: 110,
      head: [['Descripción', 'Cantidad', 'Precio Unit.', 'Total']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right' }
      }
    })
    
    // Totales
    const finalY = (doc as any).lastAutoTable.finalY + 10
    
    doc.setFontSize(10)
    doc.text('Subtotal:', 130, finalY)
    doc.text(`$${factura.subtotal.toLocaleString('es-CL')}`, 170, finalY)
    
    doc.text('IVA (19%):', 130, finalY + 7)
    doc.text(`$${factura.iva.toLocaleString('es-CL')}`, 170, finalY + 7)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL:', 130, finalY + 17)
    doc.text(`$${factura.total.toLocaleString('es-CL')}`, 170, finalY + 17)
    
    // Observaciones
    if (factura.observaciones) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text('Observaciones:', 20, finalY + 30)
      doc.text(factura.observaciones, 20, finalY + 37)
    }
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text('Documento generado electrónicamente según normativa SII Chile', 20, 280)
    doc.text(`Generado el ${new Date().toLocaleDateString('es-CL')} - Sistema Contabilidad Chile`, 20, 285)
    
    // Devolver como base64
    return doc.output('datauristring').split(',')[1]
  }
  
  /**
   * Generar PDF de reporte financiero
   */
  static generarReportePDF(
    periodo: string,
    datos: {
      ingresos: Array<{ fecha: Date, concepto: string, monto: number }>
      gastos: Array<{ fecha: Date, concepto: string, monto: number }>
      totalIngresos: number
      totalGastos: number
      utilidad: number
    }
  ): string {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(18)
    doc.setTextColor(37, 99, 235)
    doc.text('REPORTE FINANCIERO', 20, 25)
    
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text(`Período: ${periodo}`, 20, 35)
    
    // Resumen
    doc.setFontSize(12)
    doc.text('RESUMEN EJECUTIVO', 20, 50)
    
    doc.setFontSize(10)
    doc.text(`Total Ingresos: $${datos.totalIngresos.toLocaleString('es-CL')}`, 20, 60)
    doc.text(`Total Gastos: $${datos.totalGastos.toLocaleString('es-CL')}`, 20, 67)
    
    const utilidadColor = datos.utilidad >= 0 ? [34, 197, 94] : [239, 68, 68]
    doc.setTextColor(...utilidadColor)
    doc.text(`Utilidad: $${datos.utilidad.toLocaleString('es-CL')}`, 20, 74)
    doc.setTextColor(0, 0, 0)
    
    // Tabla de ingresos
    if (datos.ingresos.length > 0) {
      const ingresosData = datos.ingresos.map(item => [
        item.fecha.toLocaleDateString('es-CL'),
        item.concepto,
        `$${item.monto.toLocaleString('es-CL')}`
      ])
      
      ;(doc as any).autoTable({
        startY: 90,
        head: [['INGRESOS', '', '']],
        body: [['Fecha', 'Concepto', 'Monto'], ...ingresosData],
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
        styles: { fontSize: 8 }
      })
    }
    
    // Tabla de gastos
    if (datos.gastos.length > 0) {
      const gastosData = datos.gastos.map(item => [
        item.fecha.toLocaleDateString('es-CL'),
        item.concepto,
        `$${item.monto.toLocaleString('es-CL')}`
      ])
      
      const startY = datos.ingresos.length > 0 ? (doc as any).lastAutoTable.finalY + 20 : 90
      
      ;(doc as any).autoTable({
        startY,
        head: [['GASTOS', '', '']],
        body: [['Fecha', 'Concepto', 'Monto'], ...gastosData],
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] },
        styles: { fontSize: 8 }
      })
    }
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(`Reporte generado el ${new Date().toLocaleDateString('es-CL')}`, 20, 280)
    doc.text('Sistema de Contabilidad Chile - Automatización Inteligente', 20, 285)
    
    return doc.output('datauristring').split(',')[1]
  }
  
  /**
   * Generar PDF de balance general
   */
  static generarBalancePDF(
    fecha: Date,
    datos: {
      activos: Array<{ cuenta: string, monto: number }>
      pasivos: Array<{ cuenta: string, monto: number }>
      patrimonio: Array<{ cuenta: string, monto: number }>
      totalActivos: number
      totalPasivos: number
      totalPatrimonio: number
    }
  ): string {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(18)
    doc.setTextColor(37, 99, 235)
    doc.text('BALANCE GENERAL', 20, 25)
    
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Al ${fecha.toLocaleDateString('es-CL')}`, 20, 35)
    
    let currentY = 50
    
    // ACTIVOS
    doc.setFontSize(14)
    doc.text('ACTIVOS', 20, currentY)
    currentY += 10
    
    datos.activos.forEach(item => {
      doc.setFontSize(10)
      doc.text(item.cuenta, 25, currentY)
      doc.text(`$${item.monto.toLocaleString('es-CL')}`, 150, currentY)
      currentY += 7
    })
    
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL ACTIVOS', 25, currentY)
    doc.text(`$${datos.totalActivos.toLocaleString('es-CL')}`, 150, currentY)
    doc.setFont('helvetica', 'normal')
    currentY += 20
    
    // PASIVOS
    doc.setFontSize(14)
    doc.text('PASIVOS', 20, currentY)
    currentY += 10
    
    datos.pasivos.forEach(item => {
      doc.setFontSize(10)
      doc.text(item.cuenta, 25, currentY)
      doc.text(`$${item.monto.toLocaleString('es-CL')}`, 150, currentY)
      currentY += 7
    })
    
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL PASIVOS', 25, currentY)
    doc.text(`$${datos.totalPasivos.toLocaleString('es-CL')}`, 150, currentY)
    doc.setFont('helvetica', 'normal')
    currentY += 20
    
    // PATRIMONIO
    doc.setFontSize(14)
    doc.text('PATRIMONIO', 20, currentY)
    currentY += 10
    
    datos.patrimonio.forEach(item => {
      doc.setFontSize(10)
      doc.text(item.cuenta, 25, currentY)
      doc.text(`$${item.monto.toLocaleString('es-CL')}`, 150, currentY)
      currentY += 7
    })
    
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL PATRIMONIO', 25, currentY)
    doc.text(`$${datos.totalPatrimonio.toLocaleString('es-CL')}`, 150, currentY)
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(`Balance generado el ${new Date().toLocaleDateString('es-CL')}`, 20, 280)
    doc.text('Sistema de Contabilidad Chile', 20, 285)
    
    return doc.output('datauristring').split(',')[1]
  }
}

export default PDFService
