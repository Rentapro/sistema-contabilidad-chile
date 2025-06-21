import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface FormularioContacto {
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  mensaje: string;
  tipo: 'contacto' | 'demo' | 'soporte' | 'comercial';
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;

  constructor() {
    this.initializeConfig();
  }

  private initializeConfig() {
    // Configuración para Gmail temporal o SMTP personalizado
    this.config = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || process.env.ADMIN_EMAIL || '',
      password: process.env.SMTP_PASSWORD || ''
    };

    if (this.isConfigured()) {
      this.createTransporter();
    }
  }

  private isConfigured(): boolean {
    return !!(this.config?.host && this.config?.user && this.config?.password);
  }

  private createTransporter() {
    if (!this.config) return;

    this.transporter = nodemailer.createTransporter({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.port === 465,
      auth: {
        user: this.config.user,
        pass: this.config.password
      }
    });
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.isConfigured()) {
        console.warn('⚠️ Email service not configured - simulating send');
        return { 
          success: true, 
          messageId: 'simulated-' + Date.now() 
        };
      }

      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const result = await this.transporter.sendMail({
        from: this.config!.user,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
      });

      console.log('✅ Email sent successfully:', result.messageId);
      return { 
        success: true, 
        messageId: result.messageId 
      };

    } catch (error) {
      console.error('❌ Error sending email:', error);
      return { 
        success: false, 
        error: (error as Error).message 
      };
    }
  }

  // Templates de email predefinidos
  async sendWelcomeEmail(to: string, clientName: string): Promise<{ success: boolean; error?: string }> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">¡Bienvenido al Sistema de Contabilidad!</h2>
        <p>Hola <strong>${clientName}</strong>,</p>
        <p>Tu cuenta ha sido creada exitosamente en nuestro sistema de contabilidad.</p>
        <p>Ya puedes comenzar a gestionar tus facturas, clientes y reportes tributarios.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Próximos pasos:</h3>
          <ul>
            <li>Configura tu certificado digital SII</li>
            <li>Importa tus clientes y proveedores</li>
            <li>Comienza a generar tus primeras facturas</li>
          </ul>
        </div>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <p style="color: #6b7280;">Sistema de Contabilidad Chile</p>
      </div>
    `;

    return await this.sendEmail({
      to,
      subject: '¡Bienvenido al Sistema de Contabilidad!',
      html
    });
  }

  async sendCertificateExpiryNotification(to: string, daysUntilExpiry: number): Promise<{ success: boolean; error?: string }> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">⚠️ Certificado Digital por Vencer</h2>
        <p>Tu certificado digital SII vencerá en <strong>${daysUntilExpiry} días</strong>.</p>
        <p>Es importante renovarlo antes del vencimiento para evitar interrupciones en tus declaraciones.</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Acción requerida:</h3>
          <p>1. Contacta a tu proveedor de certificados digitales</p>
          <p>2. Solicita la renovación de tu certificado</p>
          <p>3. Sube el nuevo certificado al sistema</p>
        </div>
        <p style="color: #6b7280;">Sistema de Contabilidad Chile</p>
      </div>
    `;

    return await this.sendEmail({
      to,
      subject: `⚠️ Certificado Digital vence en ${daysUntilExpiry} días`,
      html
    });
  }

  /**
   * Método para enviar notificaciones de formularios de contacto
   * Funciona tanto con Gmail como con futuros servicios corporativos
   */
  async enviarNotificacionFormulario(datos: FormularioContacto): Promise<{ success: boolean; error?: string }> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL;
      
      if (!adminEmail) {
        console.warn('⚠️ No hay email de administrador configurado');
        return { success: false, error: 'Email de administrador no configurado' };
      }

      const tipoLabels = {
        contacto: 'Contacto General',
        demo: 'Solicitud de Demo',
        soporte: 'Soporte Técnico',
        comercial: 'Consulta Comercial'
      };

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2563eb; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
              📧 ${tipoLabels[datos.tipo]} - Sistema Contabilidad Chile
            </h2>
            
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0; color: #334155;">Información del Contacto</h3>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Nombre:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${datos.nombre}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${datos.email}</td>
              </tr>
              ${datos.empresa ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Empresa:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${datos.empresa}</td>
              </tr>
              ` : ''}
              ${datos.telefono ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Teléfono:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${datos.telefono}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Tipo:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${tipoLabels[datos.tipo]}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Fecha:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${new Date().toLocaleDateString('es-CL')}</td>
              </tr>
            </table>
            
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #334155;">Mensaje:</h3>
              <p style="margin: 0; color: #6b7280; line-height: 1.6; white-space: pre-wrap;">${datos.mensaje}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #dbeafe; border-radius: 8px; border-left: 4px solid #2563eb;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                💡 <strong>Responder a:</strong> ${datos.email}<br>
                🕒 <strong>Prioridad:</strong> ${datos.tipo === 'soporte' ? 'Alta' : datos.tipo === 'demo' ? 'Media' : 'Normal'}
              </p>
            </div>
          </div>
        </div>
      `;

      const textContent = `
NUEVO ${tipoLabels[datos.tipo].toUpperCase()} - SISTEMA CONTABILIDAD CHILE

Información del Contacto:
- Nombre: ${datos.nombre}
- Email: ${datos.email}
${datos.empresa ? `- Empresa: ${datos.empresa}` : ''}
${datos.telefono ? `- Teléfono: ${datos.telefono}` : ''}
- Tipo: ${tipoLabels[datos.tipo]}
- Fecha: ${new Date().toLocaleDateString('es-CL')}

Mensaje:
${datos.mensaje}

---
Responder a: ${datos.email}
Prioridad: ${datos.tipo === 'soporte' ? 'Alta' : datos.tipo === 'demo' ? 'Media' : 'Normal'}
      `;

      const resultado = await this.sendEmail({
        to: adminEmail,
        subject: `📧 ${tipoLabels[datos.tipo]} de ${datos.nombre} - ${datos.empresa || 'Cliente Potencial'}`,
        text: textContent,
        html: htmlContent
      });

      if (resultado.success) {
        console.log('✅ Notificación de formulario enviada exitosamente');
      }

      return resultado;

    } catch (error) {
      console.error('❌ Error enviando notificación de formulario:', error);
      return { 
        success: false, 
        error: (error as Error).message 
      };
    }
  }

  /**
   * Método para enviar email de confirmación al usuario que llena el formulario
   */
  async enviarConfirmacionUsuario(datos: FormularioContacto): Promise<{ success: boolean; error?: string }> {
    try {
      const tipoLabels = {
        contacto: 'contacto',
        demo: 'solicitud de demo',
        soporte: 'solicitud de soporte',
        comercial: 'consulta comercial'
      };

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2563eb; margin-bottom: 20px; text-align: center;">
              ✅ Hemos recibido tu ${tipoLabels[datos.tipo]}
            </h2>
            
            <p style="color: #374151; line-height: 1.6;">Hola <strong>${datos.nombre}</strong>,</p>
            
            <p style="color: #374151; line-height: 1.6;">
              Gracias por contactarnos. Hemos recibido tu ${tipoLabels[datos.tipo]} y nos pondremos en contacto contigo a la brevedad.
            </p>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #334155;">Resumen de tu solicitud:</h3>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Tipo:</strong> ${tipoLabels[datos.tipo]}</p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CL')}</p>
              ${datos.empresa ? `<p style="margin: 5px 0; color: #6b7280;"><strong>Empresa:</strong> ${datos.empresa}</p>` : ''}
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              ${datos.tipo === 'demo' ? 'Prepararemos una demostración personalizada para tu empresa.' : ''}
              ${datos.tipo === 'soporte' ? 'Nuestro equipo técnico revisará tu consulta y te contactará pronto.' : ''}
              ${datos.tipo === 'comercial' ? 'Un asesor comercial se pondrá en contacto contigo para resolver tus dudas.' : ''}
              ${datos.tipo === 'contacto' ? 'Revisaremos tu mensaje y te responderemos a la brevedad.' : ''}
            </p>
            
            <div style="margin-top: 30px; padding: 15px; background: #dbeafe; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                📞 <strong>¿Necesitas ayuda inmediata?</strong><br>
                Contáctanos al: +56 9 7373 2599<br>
                📧 Email: contacto@sistemacontabilidad.cl
              </p>
            </div>
          </div>
        </div>
      `;

      const resultado = await this.sendEmail({
        to: datos.email,
        subject: `✅ Confirmación - Tu ${tipoLabels[datos.tipo]} ha sido recibida`,
        html: htmlContent
      });

      return resultado;

    } catch (error) {
      console.error('❌ Error enviando confirmación al usuario:', error);
      return { 
        success: false, 
        error: (error as Error).message 
      };
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
