import { supabase } from '../lib/database-service';

export interface Notificacion {
  id?: string;
  empresa_id: string;
  usuario_id?: string;
  tipo: 'vencimiento_certificado' | 'factura_vencida' | 'recordatorio_pago' | 'alerta_multa' | 'backup_completado' | 'sistema' | 'tributario';
  titulo: string;
  mensaje: string;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  estado: 'pendiente' | 'enviada' | 'leida' | 'archivada';
  canales: ('email' | 'sms' | 'push' | 'sistema')[];
  fecha_envio?: string;
  fecha_programada?: string;
  metadata?: Record<string, any>;
  acciones?: {
    texto: string;
    url: string;
    tipo: 'link' | 'button';
  }[];
  created_at?: string;
  updated_at?: string;
}

export interface ConfiguracionNotificaciones {
  empresa_id: string;
  usuario_id?: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  horario_preferido: {
    inicio: string; // HH:MM
    fin: string; // HH:MM
  };
  tipos_habilitados: Notificacion['tipo'][];
  frecuencia_resumen: 'diario' | 'semanal' | 'mensual' | 'nunca';
}

export class NotificacionesService {
  
  /**
   * Crea una nueva notificación
   */
  static async crearNotificacion(notification: Omit<Notificacion, 'id' | 'created_at' | 'updated_at'>): Promise<{
    success: boolean;
    notificacion?: Notificacion;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .insert(notification)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Programar envío si tiene fecha programada
      if (notification.fecha_programada) {
        await this.programarEnvio(data.id);
      } else {
        // Enviar inmediatamente
        await this.enviarNotificacion(data.id);
      }

      return {
        success: true,
        notificacion: data
      };

    } catch (error) {
      console.error('Error creando notificación:', error);
      return {
        success: false,
        error: 'Error creando la notificación'
      };
    }
  }

  /**
   * Obtiene notificaciones de una empresa
   */
  static async obtenerNotificaciones(
    empresaId: string,
    filtros: {
      usuario_id?: string;
      estado?: Notificacion['estado'];
      tipo?: Notificacion['tipo'];
      prioridad?: Notificacion['prioridad'];
      limite?: number;
    } = {}
  ): Promise<Notificacion[]> {
    try {
      let query = supabase
        .from('notificaciones')
        .select('*')
        .eq('empresa_id', empresaId);

      if (filtros.usuario_id) {
        query = query.eq('usuario_id', filtros.usuario_id);
      }
      if (filtros.estado) {
        query = query.eq('estado', filtros.estado);
      }
      if (filtros.tipo) {
        query = query.eq('tipo', filtros.tipo);
      }
      if (filtros.prioridad) {
        query = query.eq('prioridad', filtros.prioridad);
      }
      if (filtros.limite) {
        query = query.limit(filtros.limite);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return [];
    }
  }

  /**
   * Marca una notificación como leída
   */
  static async marcarComoLeida(notificacionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notificaciones')
        .update({ 
          estado: 'leida',
          updated_at: new Date().toISOString()
        })
        .eq('id', notificacionId);

      return !error;

    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
      return false;
    }
  }

  /**
   * Programa el envío de una notificación
   */
  private static async programarEnvio(notificacionId: string): Promise<void> {
    // En producción, esto se haría con un sistema de colas como Bull/Agenda
    // Por ahora, simulamos la programación
    console.log(`Notificación ${notificacionId} programada para envío`);
    
    // TODO: Implementar con sistema de colas real
    // - Bull Queue con Redis
    // - AWS SQS
    // - Google Cloud Tasks
    // - Vercel Cron Jobs
  }

  /**
   * Envía una notificación por los canales configurados
   */
  private static async enviarNotificacion(notificacionId: string): Promise<void> {
    try {
      // Obtener notificación
      const { data: notificacion, error } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('id', notificacionId)
        .single();

      if (error || !notificacion) {
        throw new Error('Notificación no encontrada');
      }

      // Obtener configuración de notificaciones
      const configuracion = await this.obtenerConfiguracion(
        notificacion.empresa_id,
        notificacion.usuario_id
      );

      // Enviar por cada canal habilitado
      const promesasEnvio = [];

      if (notificacion.canales.includes('email') && configuracion.email_enabled) {
        promesasEnvio.push(this.enviarPorEmail(notificacion));
      }

      if (notificacion.canales.includes('sms') && configuracion.sms_enabled) {
        promesasEnvio.push(this.enviarPorSMS(notificacion));
      }

      if (notificacion.canales.includes('push') && configuracion.push_enabled) {
        promesasEnvio.push(this.enviarPorPush(notificacion));
      }

      if (notificacion.canales.includes('sistema')) {
        // Las notificaciones del sistema siempre se muestran
        promesasEnvio.push(Promise.resolve());
      }

      await Promise.all(promesasEnvio);

      // Marcar como enviada
      await supabase
        .from('notificaciones')
        .update({ 
          estado: 'enviada',
          fecha_envio: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', notificacionId);

    } catch (error) {
      console.error('Error enviando notificación:', error);
    }
  }

  /**
   * Envía notificación por email
   */
  private static async enviarPorEmail(notificacion: Notificacion): Promise<void> {
    // SIMULACIÓN - En producción usar SendGrid, AWS SES, etc.
    console.log('📧 Enviando email:', {
      titulo: notificacion.titulo,
      mensaje: notificacion.mensaje,
      prioridad: notificacion.prioridad
    });

    // TODO: Implementar envío real de email
    // - SendGrid
    // - AWS SES
    // - Nodemailer
    // - Postmark
  }

  /**
   * Envía notificación por SMS
   */
  private static async enviarPorSMS(notificacion: Notificacion): Promise<void> {
    // SIMULACIÓN - En producción usar Twilio, AWS SNS, etc.
    console.log('📱 Enviando SMS:', {
      titulo: notificacion.titulo,
      mensaje: notificacion.mensaje.substring(0, 160) // Límite SMS
    });

    // TODO: Implementar envío real de SMS
    // - Twilio
    // - AWS SNS
    // - Nexmo/Vonage
  }

  /**
   * Envía notificación push
   */
  private static async enviarPorPush(notificacion: Notificacion): Promise<void> {
    // SIMULACIÓN - En producción usar Firebase, OneSignal, etc.
    console.log('🔔 Enviando push:', {
      titulo: notificacion.titulo,
      body: notificacion.mensaje
    });

    // TODO: Implementar notificaciones push reales
    // - Firebase Cloud Messaging
    // - OneSignal
    // - Pusher
    // - Web Push API
  }

  /**
   * Obtiene configuración de notificaciones
   */
  private static async obtenerConfiguracion(
    empresaId: string, 
    usuarioId?: string
  ): Promise<ConfiguracionNotificaciones> {
    try {
      let query = supabase
        .from('configuracion_notificaciones')
        .select('*')
        .eq('empresa_id', empresaId);

      if (usuarioId) {
        query = query.eq('usuario_id', usuarioId);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        // Devolver configuración por defecto
        return {
          empresa_id: empresaId,
          usuario_id: usuarioId,
          email_enabled: true,
          sms_enabled: false,
          push_enabled: true,
          horario_preferido: {
            inicio: '09:00',
            fin: '18:00'
          },
          tipos_habilitados: ['vencimiento_certificado', 'alerta_multa', 'tributario'],
          frecuencia_resumen: 'diario'
        };
      }

      return data;

    } catch (error) {
      console.error('Error obteniendo configuración:', error);
      return {
        empresa_id: empresaId,
        email_enabled: true,
        sms_enabled: false,
        push_enabled: true,
        horario_preferido: {
          inicio: '09:00',
          fin: '18:00'
        },
        tipos_habilitados: ['sistema'],
        frecuencia_resumen: 'diario'
      };
    }
  }

  /**
   * Actualiza configuración de notificaciones
   */
  static async actualizarConfiguracion(
    configuracion: ConfiguracionNotificaciones
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('configuracion_notificaciones')
        .upsert(configuracion);

      return !error;

    } catch (error) {
      console.error('Error actualizando configuración:', error);
      return false;
    }
  }

  /**
   * Crea notificaciones automáticas para vencimiento de certificados
   */
  static async verificarVencimientosCertificados(): Promise<void> {
    try {
      // Obtener certificados que vencen en 30, 15, 7, 3 y 1 día
      const diasAlerta = [30, 15, 7, 3, 1];
      
      for (const dias of diasAlerta) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + dias);
        
        const { data: certificados } = await supabase
          .from('certificados_digitales')
          .select('*')
          .eq('estado', 'activo')
          .gte('fecha_vencimiento', fechaLimite.toISOString().split('T')[0])
          .lt('fecha_vencimiento', new Date(fechaLimite.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

        for (const certificado of certificados || []) {
          // Verificar si ya se envió notificación para este certificado y plazo
          const { data: existente } = await supabase
            .from('notificaciones')
            .select('id')
            .eq('empresa_id', certificado.empresa_id)
            .eq('tipo', 'vencimiento_certificado')
            .like('metadata->certificado_id', certificado.id)
            .like('metadata->dias_restantes', dias.toString())
            .single();

          if (!existente) {
            await this.crearNotificacion({
              empresa_id: certificado.empresa_id,
              tipo: 'vencimiento_certificado',
              titulo: `Certificado próximo a vencer (${dias} día${dias > 1 ? 's' : ''})`,
              mensaje: `El certificado "${certificado.nombre}" vencerá el ${new Date(certificado.fecha_vencimiento).toLocaleDateString()}. Es importante renovarlo para evitar interrupciones en la firma digital.`,
              prioridad: dias <= 3 ? 'critica' : dias <= 7 ? 'alta' : 'media',
              estado: 'pendiente',
              canales: ['email', 'sistema', 'push'],
              metadata: {
                certificado_id: certificado.id,
                dias_restantes: dias,
                fecha_vencimiento: certificado.fecha_vencimiento
              },
              acciones: [
                {
                  texto: 'Ver certificado',
                  url: `/certificados/${certificado.id}`,
                  tipo: 'link'
                },
                {
                  texto: 'Renovar ahora',
                  url: `/certificados/${certificado.id}/renovar`,
                  tipo: 'button'
                }
              ]
            });
          }
        }
      }

    } catch (error) {
      console.error('Error verificando vencimientos de certificados:', error);
    }
  }

  /**
   * Crea notificaciones para fechas tributarias importantes
   */
  static async crearNotificacionesTributarias(): Promise<void> {
    try {
      const fechasImportantes = await this.obtenerFechasTributariasProximas();
      
      for (const fecha of fechasImportantes) {
        // Crear notificaciones 7 y 1 día antes
        const diasAntes = [7, 1];
        
        for (const dias of diasAntes) {
          const fechaNotificacion = new Date(fecha.fecha);
          fechaNotificacion.setDate(fechaNotificacion.getDate() - dias);
          
          if (fechaNotificacion <= new Date()) continue; // Ya pasó la fecha
          
          // Obtener todas las empresas activas
          const { data: empresas } = await supabase
            .from('empresas')
            .select('id');
          
          for (const empresa of empresas || []) {
            await this.crearNotificacion({
              empresa_id: empresa.id,
              tipo: 'tributario',
              titulo: `Recordatorio tributario: ${fecha.descripcion}`,
              mensaje: `Recuerda que el ${new Date(fecha.fecha).toLocaleDateString()} es la fecha límite para ${fecha.descripcion.toLowerCase()}. ${dias === 1 ? '¡Es mañana!' : `Faltan ${dias} días.`}`,
              prioridad: dias === 1 ? 'alta' : 'media',
              estado: 'pendiente',
              canales: ['email', 'sistema'],
              fecha_programada: fechaNotificacion.toISOString(),
              metadata: {
                fecha_tributaria: fecha.fecha,
                tipo_obligacion: fecha.tipo,
                dias_restantes: dias
              }
            });
          }
        }
      }

    } catch (error) {
      console.error('Error creando notificaciones tributarias:', error);
    }
  }

  /**
   * Obtiene las próximas fechas tributarias importantes
   */
  private static async obtenerFechasTributariasProximas(): Promise<Array<{
    fecha: string;
    descripcion: string;
    tipo: string;
  }>> {
    // SIMULACIÓN - En producción obtener del calendario tributario oficial
    const fechasEjemplo = [
      {
        fecha: '2025-07-31',
        descripcion: 'Declaración de IVA mensual',
        tipo: 'iva_mensual'
      },
      {
        fecha: '2025-08-15',
        descripcion: 'Pago de contribuciones',
        tipo: 'contribuciones'
      },
      {
        fecha: '2025-08-30',
        descripcion: 'Declaración F29',
        tipo: 'f29'
      }
    ];

    return fechasEjemplo.filter(fecha => new Date(fecha.fecha) > new Date());
  }

  /**
   * Obtiene resumen de notificaciones para el dashboard
   */
  static async obtenerResumen(empresaId: string): Promise<{
    total: number;
    noLeidas: number;
    criticas: number;
    porTipo: Record<string, number>;
  }> {
    try {
      const notificaciones = await this.obtenerNotificaciones(empresaId, { limite: 100 });
      
      const resumen = {
        total: notificaciones.length,
        noLeidas: notificaciones.filter(n => n.estado === 'pendiente' || n.estado === 'enviada').length,
        criticas: notificaciones.filter(n => n.prioridad === 'critica').length,
        porTipo: {} as Record<string, number>
      };

      // Contar por tipo
      notificaciones.forEach(n => {
        resumen.porTipo[n.tipo] = (resumen.porTipo[n.tipo] || 0) + 1;
      });

      return resumen;

    } catch (error) {
      console.error('Error obteniendo resumen de notificaciones:', error);
      return {
        total: 0,
        noLeidas: 0,
        criticas: 0,
        porTipo: {}
      };
    }
  }
}
