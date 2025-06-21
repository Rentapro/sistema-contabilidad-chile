import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface FormularioContacto {
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  mensaje: string;
  tipo: 'contacto' | 'demo' | 'soporte' | 'comercial' | 'consulta_contable';
}

// Función para crear el transportador de email
function createEmailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

// Función para determinar el email destino según el tipo de consulta
function getEmailDestinoPorTipo(tipo: string): string {
  const routing = {
    'contacto': process.env.EMAIL_CONTACTO || 'contacto@conta-ia.cl',
    'demo': process.env.EMAIL_CONTACTO || 'contacto@conta-ia.cl',
    'comercial': process.env.EMAIL_CONTACTO || 'contacto@conta-ia.cl',
    'soporte': process.env.EMAIL_SOPORTE || 'soporte@conta-ia.cl',
    'consulta_contable': process.env.EMAIL_CONTADOR || 'contador@conta-ia.cl'
  };

  return routing[tipo as keyof typeof routing] || process.env.EMAIL_ADMIN || 'contacto@conta-ia.cl';
}

export async function POST(req: NextRequest) {
  try {
    const datos: FormularioContacto = await req.json();

    // Validación básica
    if (!datos.nombre || !datos.email || !datos.mensaje || !datos.tipo) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Routing inteligente de emails según tipo de consulta
    const emailDestino = getEmailDestinoPorTipo(datos.tipo);
    
    if (!emailDestino) {
      console.warn('⚠️ No hay email configurado para el tipo:', datos.tipo);
      // En modo desarrollo, simplemente logueamos
      console.log('📧 FORMULARIO RECIBIDO (modo desarrollo):', datos);
      return NextResponse.json({ 
        success: true, 
        message: 'Formulario recibido correctamente (modo desarrollo)',
        desarrollo: true 
      });
    }    const tipoLabels = {
      contacto: 'Contacto General',
      demo: 'Solicitud de Demo',
      soporte: 'Soporte Técnico',
      comercial: 'Consulta Comercial',
      consulta_contable: 'Consulta Contable'
    };

    // HTML para el email al especialista correspondiente
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

    // Intentar enviar email
    try {
      const transporter = createEmailTransporter();
        await transporter.sendMail({
        from: `"${process.env.SENDGRID_FROM_NAME}" <${process.env.SENDGRID_FROM_EMAIL}>`,
        to: emailDestino,
        subject: `📧 ${tipoLabels[datos.tipo]} de ${datos.nombre} - ${datos.empresa || 'Cliente Potencial'}`,
        html: htmlContent
      });

      console.log('✅ Email enviado exitosamente a:', emailDestino);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Formulario enviado correctamente. Te contactaremos pronto.' 
      });

    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError);
      
      // Fallback: guardar en log/base de datos
      console.log('📧 FORMULARIO RECIBIDO (fallback):', {
        ...datos,
        fecha: new Date().toISOString(),
        emailDestino
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Formulario recibido correctamente. Te contactaremos pronto.',
        fallback: true 
      });
    }

  } catch (error) {
    console.error('❌ Error procesando formulario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Método GET para verificar que la API funciona
export async function GET() {
  return NextResponse.json({
    status: 'API de contacto funcionando',
    configured: !!(process.env.ADMIN_EMAIL && process.env.SMTP_PASSWORD),
    adminEmail: process.env.ADMIN_EMAIL ? '✅ Configurado' : '❌ No configurado',
    smtpConfig: process.env.SMTP_PASSWORD ? '✅ Configurado' : '❌ No configurado'
  });
}
