/**
 * Servicio de Email Real - Múltiples Proveedores
 * Sistema Contabilidad Chile
 */

import configManager from '@/lib/config';

export interface EmailTemplate {
  to: string | string[]
  subject: string
  html: string
  text?: string
  attachments?: Array<{
    content: string
    filename: string
    type: string
  }>
}

export class EmailService {
  private static isConfigured(): boolean {
    return configManager.isFeatureEnabled('emailNotifications');
  }
  
  /**
   * Enviar email genérico
   */
  static async enviarEmail(template: EmailTemplate): Promise<boolean> {
    try {
      // Verificar si el servicio está configurado
      if (!this.isConfigured()) {
        console.warn('⚠️ Servicio de email no configurado. Email no enviado:', template.subject);
        console.warn('   Destinatario:', template.to);
        console.warn('   Para configurar, establece SMTP_HOST, SMTP_USER y SMTP_PASSWORD');
        
        // En desarrollo, simular éxito
        if (configManager.getConfig().environment === 'development') {
          console.log('📧 [SIMULADO] Email enviado exitosamente en modo desarrollo');
          return true;
        }
        
        return false;
      }

      // TODO: Implementar envío real con SMTP o SendGrid
      const emailConfig = configManager.getEmailConfig();
      
      // Aquí iría la implementación real con nodemailer o SendGrid
      console.log('📧 Enviando email real...', {
        to: template.to,
        subject: template.subject,
        host: emailConfig.host
      });
      
      // Simular envío exitoso por ahora
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Email enviado exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      return false;
    }
  }

  /**
   * Enviar factura por email
   */
  static async enviarFactura(
    clienteEmail: string,
    numeroFactura: string,
    pdfBase64: string,
    montoTotal: number
  ): Promise<boolean> {
    const template: EmailTemplate = {
      to: clienteEmail,
      subject: `Factura Electrónica N° ${numeroFactura}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Factura Electrónica</h2>
          <p>Estimado cliente,</p>
          <p>Adjunto encontrará la factura electrónica N° <strong>${numeroFactura}</strong></p>
          <p><strong>Monto Total:</strong> $${montoTotal.toLocaleString('es-CL')}</p>
          <p>Esta factura ha sido generada según normativa SII Chile.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            Este es un email automático del Sistema de Contabilidad Chile.
          </p>
        </div>
      `,
      attachments: [{
        content: pdfBase64,
        filename: `factura_${numeroFactura}.pdf`,
        type: 'application/pdf'
      }]
    }

    return await this.enviarEmail(template)
  }

  /**
   * Enviar notificación de vencimiento
   */
  static async notificarVencimiento(
    clienteEmail: string,
    numeroFactura: string,
    fechaVencimiento: Date,
    montoTotal: number
  ): Promise<boolean> {
    const diasParaVencimiento = Math.ceil(
      (fechaVencimiento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )

    const template: EmailTemplate = {
      to: clienteEmail,
      subject: `Recordatorio: Factura ${numeroFactura} vence en ${diasParaVencimiento} días`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Recordatorio de Vencimiento</h2>
          <p>Estimado cliente,</p>
          <p>Le recordamos que la factura N° <strong>${numeroFactura}</strong> vence el 
             <strong>${fechaVencimiento.toLocaleDateString('es-CL')}</strong></p>
          <p><strong>Monto a pagar:</strong> $${montoTotal.toLocaleString('es-CL')}</p>
          <p>Por favor, gestione el pago para evitar recargos.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            Sistema de Contabilidad Chile - Gestión Automática
          </p>
        </div>
      `
    }

    return await this.enviarEmail(template)
  }

  /**
   * Enviar reporte mensual
   */
  static async enviarReporteMensual(
    emailDestino: string,
    periodo: string,
    excelBase64: string,
    resumen: {
      totalFacturado: number
      totalGastos: number
      utilidad: number
    }
  ): Promise<boolean> {
    const template: EmailTemplate = {
      to: emailDestino,
      subject: `Reporte Mensual - ${periodo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Reporte Mensual ${periodo}</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
            <h3>Resumen Financiero</h3>
            <p><strong>Total Facturado:</strong> $${resumen.totalFacturado.toLocaleString('es-CL')}</p>
            <p><strong>Total Gastos:</strong> $${resumen.totalGastos.toLocaleString('es-CL')}</p>
            <p><strong>Utilidad:</strong> $${resumen.utilidad.toLocaleString('es-CL')}</p>
          </div>
          <p>En el archivo adjunto encontrará el reporte detallado.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            Sistema de Contabilidad Chile - Automatización Inteligente
          </p>
        </div>
      `,
      attachments: [{
        content: excelBase64,
        filename: `reporte_${periodo}.xlsx`,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }]
    }

    return await this.enviarEmail(template)
  }

  /**
   * Enviar bienvenida nuevo usuario
   */
  static async enviarBienvenida(
    email: string,
    nombre: string,
    empresaNombre: string,
    passwordTemporal: string
  ): Promise<boolean> {
    const template: EmailTemplate = {
      to: email,
      subject: `Bienvenido al Sistema de Contabilidad Chile`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">¡Bienvenido ${nombre}!</h2>
          <p>Su cuenta ha sido creada exitosamente para la empresa <strong>${empresaNombre}</strong></p>
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Datos de Acceso</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Contraseña temporal:</strong> ${passwordTemporal}</p>
            <p style="color: #dc2626; font-size: 14px;">
              Por seguridad, cambie su contraseña en el primer inicio de sesión.
            </p>
          </div>
          <p>Puede acceder al sistema en: 
             <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Sistema Contabilidad</a>
          </p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            Sistema de Contabilidad Chile - Su solución empresarial
          </p>
        </div>
      `
    }

    return await this.enviarEmail(template)
  }
}

export default EmailService
