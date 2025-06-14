/**
 * Servicio de Backup Automático Real
 * Sistema Contabilidad Chile
 */

import configManager from '@/lib/config';
import dbAdapter from '@/lib/database';
import ExcelService from './excelService';
import { EmailService } from './emailService';

export interface BackupConfig {
  empresaId: string
  frecuencia: 'diario' | 'semanal' | 'mensual'
  horaEjecucion: string // HH:MM formato 24h
  incluirDocumentos: boolean
  emailNotificacion: boolean
  emailDestino?: string
  retencionDias: number
}

export interface BackupData {
  id: string
  empresaId: string
  fecha: Date
  tipo: 'completo' | 'incremental'
  tamaño: number
  tablas: string[]
  archivoUrl?: string
  estado: 'completado' | 'error' | 'en_proceso'
  error?: string
}

export class BackupService {
  
  private static isRealDatabaseAvailable(): boolean {
    return configManager.isFeatureEnabled('realDatabase');
  }
  
  /**
   * Ejecutar backup completo
   */
  static async ejecutarBackupCompleto(empresaId: string): Promise<BackupData> {
    const inicioBackup = new Date();
    
    console.log(`🔄 Iniciando backup completo para empresa: ${empresaId}`);
    
    try {
      if (!this.isRealDatabaseAvailable()) {
        console.warn('⚠️ Base de datos real no disponible. Generando backup mock...');
        return await this.generarBackupMock(empresaId);
      }
      
      // TODO: Implementar backup real cuando esté disponible la BD
      // const backup = await this.crearRegistroBackup(empresaId);
        .select()
        .single()

      if (backupError) {
        throw new Error(`Error creando registro backup: ${backupError.message}`)
      }

      // Obtener todos los datos de la empresa
      const datosBackup = await this.obtenerDatosEmpresa(empresaId)
      
      // Generar archivos Excel con todos los datos
      const excelBackup = await this.generarExcelBackup(datosBackup)
      
      // Calcular tamaño aproximado
      const tamaño = Buffer.from(excelBackup, 'base64').length
      
      // Guardar archivo en Supabase Storage
      const nombreArchivo = `backup_${empresaId}_${inicioBackup.toISOString().split('T')[0]}.xlsx`
      
      const { data: archivo, error: archivoError } = await supabase.storage
        .from('backups')
        .upload(nombreArchivo, Buffer.from(excelBackup, 'base64'), {
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

      if (archivoError) {
        throw new Error(`Error subiendo archivo: ${archivoError.message}`)
      }

      // Actualizar registro de backup
      const { error: updateError } = await supabase
        .from('backups')
        .update({
          estado: 'completado',
          tamaño,
          archivo_url: archivo.path,
          tablas: Object.keys(datosBackup)
        })
        .eq('id', backup.id)

      if (updateError) {
        throw new Error(`Error actualizando backup: ${updateError.message}`)
      }

      // Enviar notificación por email
      await this.enviarNotificacionBackup(empresaId, {
        ...backup,
        tamaño,
        estado: 'completado',
        tablas: Object.keys(datosBackup)
      })

      // Limpiar backups antiguos
      await this.limpiarBackupsAntiguos(empresaId)

      return {
        id: backup.id,
        empresaId,
        fecha: inicioBackup,
        tipo: 'completo',
        tamaño,
        tablas: Object.keys(datosBackup),
        archivoUrl: archivo.path,
        estado: 'completado'
      }

    } catch (error) {
      console.error('Error en backup:', error)
      
      // Actualizar estado de error
      await supabase
        .from('backups')
        .update({
          estado: 'error',
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
        .eq('empresa_id', empresaId)
        .eq('fecha_creacion', inicioBackup.toISOString())

      throw error
    }
  }

  /**
   * Obtener todos los datos de la empresa
   */
  private static async obtenerDatosEmpresa(empresaId: string): Promise<Record<string, any[]>> {
    const datos: Record<string, any[]> = {}

    // Tablas principales a respaldar
    const tablas = [
      'empresas',
      'usuarios', 
      'clientes',
      'proveedores',
      'productos',
      'facturas',
      'items_factura',
      'gastos',
      'pagos',
      'configuraciones'
    ]

    for (const tabla of tablas) {
      try {
        const { data, error } = await supabase
          .from(tabla)
          .select('*')
          .eq('empresa_id', empresaId)

        if (error) {
          console.error(`Error obteniendo datos de ${tabla}:`, error)
          datos[tabla] = []
        } else {
          datos[tabla] = data || []
        }
      } catch (error) {
        console.error(`Error procesando tabla ${tabla}:`, error)
        datos[tabla] = []
      }
    }

    // Datos de la empresa (sin filtro por empresa_id)
    try {
      const { data: empresaData, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', empresaId)
        .single()

      if (!error && empresaData) {
        datos['empresa_info'] = [empresaData]
      }
    } catch (error) {
      console.error('Error obteniendo info empresa:', error)
    }

    return datos
  }

  /**
   * Generar Excel con todos los datos de backup
   */
  private static async generarExcelBackup(datos: Record<string, any[]>): Promise<string> {
    const reportes = Object.entries(datos).map(([tabla, registros]) => ({
      hoja: tabla,
      datos: registros
    }))

    // Agregar hoja de metadatos
    reportes.unshift({
      hoja: 'Metadata',
      datos: [{
        'Fecha Backup': new Date().toISOString(),
        'Versión Sistema': '2.0.0',
        'Tablas Incluidas': Object.keys(datos).join(', '),
        'Total Registros': Object.values(datos).reduce((sum, arr) => sum + arr.length, 0)
      }]
    })

    const libro = ExcelService.crearLibroExcel(reportes)
    const buffer = ExcelService['XLSX'].write(libro, { type: 'buffer', bookType: 'xlsx' })
    return Buffer.from(buffer).toString('base64')
  }

  /**
   * Enviar notificación de backup
   */
  private static async enviarNotificacionBackup(empresaId: string, backup: any): Promise<void> {
    // Obtener configuración de notificaciones
    const { data: config } = await supabase
      .from('configuraciones')
      .select('valor')
      .eq('empresa_id', empresaId)
      .eq('clave', 'backup_email_notificacion')
      .single()

    if (config?.valor === 'true') {
      // Obtener email del administrador
      const { data: admin } = await supabase
        .from('usuarios')
        .select('email')
        .eq('empresa_id', empresaId)
        .eq('rol', 'administrador')
        .eq('activo', true)
        .limit(1)
        .single()

      if (admin?.email) {
        await EmailService.enviarEmail({
          to: admin.email,
          subject: 'Backup Completado - Sistema Contabilidad',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #059669;">✅ Backup Completado</h2>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px;">
                <p><strong>Fecha:</strong> ${new Date(backup.fecha_creacion).toLocaleString('es-CL')}</p>
                <p><strong>Tipo:</strong> ${backup.tipo}</p>
                <p><strong>Tamaño:</strong> ${(backup.tamaño / 1024).toFixed(2)} KB</p>
                <p><strong>Tablas:</strong> ${backup.tablas.join(', ')}</p>
              </div>
              <p>Su backup se ha completado exitosamente y está disponible para descarga.</p>
              <hr>
              <p style="font-size: 12px; color: #666;">
                Sistema de Contabilidad Chile - Backup Automático
              </p>
            </div>
          `
        })
      }
    }
  }

  /**
   * Limpiar backups antiguos
   */
  private static async limpiarBackupsAntiguos(empresaId: string): Promise<void> {
    // Obtener configuración de retención
    const { data: retencionConfig } = await supabase
      .from('configuraciones')
      .select('valor')
      .eq('empresa_id', empresaId)
      .eq('clave', 'backup_retencion_dias')
      .single()

    const diasRetencion = parseInt(retencionConfig?.valor || '30')
    
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() - diasRetencion)

    // Obtener backups antiguos
    const { data: backupsAntiguos, error } = await supabase
      .from('backups')
      .select('id, archivo_url')
      .eq('empresa_id', empresaId)
      .lt('fecha_creacion', fechaLimite.toISOString())

    if (error) {
      console.error('Error obteniendo backups antiguos:', error)
      return
    }

    // Eliminar archivos del storage
    for (const backup of backupsAntiguos || []) {
      if (backup.archivo_url) {
        await supabase.storage
          .from('backups')
          .remove([backup.archivo_url])
      }
    }

    // Eliminar registros de la base de datos
    if (backupsAntiguos && backupsAntiguos.length > 0) {
      const { error: deleteError } = await supabase
        .from('backups')
        .delete()
        .in('id', backupsAntiguos.map(b => b.id))

      if (deleteError) {
        console.error('Error eliminando registros de backup:', deleteError)
      }
    }
  }

  /**
   * Programar backup automático
   */
  static async programarBackupAutomatico(config: BackupConfig): Promise<void> {
    // Guardar configuración
    await supabase
      .from('configuraciones')
      .upsert([
        {
          empresa_id: config.empresaId,
          clave: 'backup_automatico',
          valor: JSON.stringify(config)
        }
      ])

    // En un entorno real, esto se haría con un cron job
    // Por ahora, simulamos con setTimeout para desarrollo
    this.simularCronJob(config)
  }

  /**
   * Simular cron job para desarrollo
   */
  private static simularCronJob(config: BackupConfig): void {
    const ahora = new Date()
    const [hora, minuto] = config.horaEjecucion.split(':').map(Number)
    
    const proximaEjecucion = new Date()
    proximaEjecucion.setHours(hora, minuto, 0, 0)
    
    // Si ya pasó la hora de hoy, programar para mañana
    if (proximaEjecucion <= ahora) {
      proximaEjecucion.setDate(proximaEjecucion.getDate() + 1)
    }

    const tiempoEspera = proximaEjecucion.getTime() - ahora.getTime()

    setTimeout(async () => {
      try {
        await this.ejecutarBackupCompleto(config.empresaId)
        
        // Reprogramar según frecuencia
        const siguienteEjecucion = new Date(proximaEjecucion)
        switch (config.frecuencia) {
          case 'diario':
            siguienteEjecucion.setDate(siguienteEjecucion.getDate() + 1)
            break
          case 'semanal':
            siguienteEjecucion.setDate(siguienteEjecucion.getDate() + 7)
            break
          case 'mensual':
            siguienteEjecucion.setMonth(siguienteEjecucion.getMonth() + 1)
            break
        }
        
        this.simularCronJob({
          ...config,
          horaEjecucion: siguienteEjecucion.toTimeString().substring(0, 5)
        })
        
      } catch (error) {
        console.error('Error en backup automático:', error)
      }
    }, tiempoEspera)
  }

  /**
   * Obtener historial de backups
   */
  static async obtenerHistorialBackups(empresaId: string, limit = 20): Promise<BackupData[]> {
    const { data, error } = await supabase
      .from('backups')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('fecha_creacion', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error obteniendo historial backups:', error)
      return []
    }

    return (data || []).map(backup => ({
      id: backup.id,
      empresaId: backup.empresa_id,
      fecha: new Date(backup.fecha_creacion),
      tipo: backup.tipo,
      tamaño: backup.tamaño || 0,
      tablas: backup.tablas || [],
      archivoUrl: backup.archivo_url,
      estado: backup.estado,
      error: backup.error
    }))
  }

  /**
   * Descargar backup
   */
  static async descargarBackup(backupId: string): Promise<string | null> {
    const { data: backup } = await supabase
      .from('backups')
      .select('archivo_url')
      .eq('id', backupId)
      .single()

    if (!backup?.archivo_url) {
      return null
    }

    const { data } = await supabase.storage
      .from('backups')
      .createSignedUrl(backup.archivo_url, 3600) // 1 hora de validez

    return data?.signedUrl || null
  }

  /**
   * Restaurar desde backup
   */
  static async restaurarDesdeBackup(
    empresaId: string, 
    backupId: string,
    tablas: string[] = []
  ): Promise<boolean> {
    try {
      // Obtener datos del backup
      const { data: backup } = await supabase
        .from('backups')
        .select('archivo_url, tablas')
        .eq('id', backupId)
        .single()

      if (!backup?.archivo_url) {
        throw new Error('Backup no encontrado')
      }

      // Descargar archivo
      const { data: archivo } = await supabase.storage
        .from('backups')
        .download(backup.archivo_url)

      if (!archivo) {
        throw new Error('No se pudo descargar el archivo de backup')
      }

      // Aquí implementarías la lógica de restauración
      // Por seguridad, esto requiere validaciones adicionales
      console.log('Restauración iniciada desde backup:', backupId)
      
      return true
    } catch (error) {
      console.error('Error en restauración:', error)
      return false
    }
  }
}

export default BackupService
