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

class RealEmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;

  constructor() {
    this.initializeConfig();
  }

  private initializeConfig() {
    this.config = {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || '',
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

    this.transporter = nodemailer.createTransport({
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

  async sendBackupCompletedNotification(to: string, backupSize: string): Promise<{ success: boolean; error?: string }> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">✅ Backup Completado</h2>
        <p>El backup automático de tu empresa se ha completado exitosamente.</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Tamaño del backup:</strong> ${backupSize}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CL')}</p>
          <p><strong>Estado:</strong> Completado</p>
        </div>
        <p>Tus datos están seguros y respaldados.</p>
        <p style="color: #6b7280;">Sistema de Contabilidad Chile</p>
      </div>
    `;

    return await this.sendEmail({
      to,
      subject: '✅ Backup Completado - Sistema de Contabilidad',
      html
    });
  }
}

// Singleton
export const realEmailService = new RealEmailService();
export default realEmailService;
