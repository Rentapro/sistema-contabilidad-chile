/**
 * Servicio de Auditoría y Logs del Sistema
 * Sistema Contabilidad Chile
 */

import configManager from '@/lib/config';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';
  category: 'AUTENTICACION' | 'TRANSACCION' | 'SISTEMA' | 'SEGURIDAD' | 'BACKUP' | 'SII';
  action: string;
  userId?: string;
  userName?: string;
  empresaId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  metadata?: {
    before?: any;
    after?: any;
    [key: string]: any;
  };
}

export interface AuditFilter {
  fechaDesde?: Date;
  fechaHasta?: Date;
  level?: string;
  category?: string;
  userId?: string;
  empresaId?: string;
  buscar?: string;
}

export interface AuditStats {
  totalLogs: number;
  errores: number;
  warnings: number;
  auditorias: number;
  loginsFallidos: number;
  ultimaActividad: Date;
}

class AuditService {
  private logs: LogEntry[] = [];
  private maxLogs: number = 10000; // Límite de logs en memoria
  
  constructor() {
    this.initializeService();
  }
  
  private initializeService() {
    console.log('🔍 Inicializando servicio de auditoría...');
    
    // Cargar logs de ejemplo para mostrar funcionalidad
    this.loadMockLogs();
    
    // En producción, aquí se cargarían los logs reales de BD
    if (configManager.isFeatureEnabled('realDatabase')) {
      // TODO: Cargar logs desde base de datos real
      console.log('🔗 Conectando con sistema de logs real...');
    }
  }
  
  /**
   * Registrar evento de auditoría
   */
  async logEvent(entry: Omit<LogEntry, 'id' | 'timestamp'>): Promise<void> {
    const logEntry: LogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    // Agregar a logs en memoria
    this.logs.unshift(logEntry);
    
    // Mantener límite de logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
    // En producción, guardar en BD
    if (configManager.isFeatureEnabled('realDatabase')) {
      // TODO: Guardar en base de datos real
      console.log('💾 Guardando log en BD:', logEntry.action);
    }
    
    // Log crítico en consola para errores
    if (entry.level === 'ERROR') {
      console.error('🚨 ERROR AUDITADO:', entry.action, entry.details);
    } else if (entry.level === 'WARN') {
      console.warn('⚠️ WARNING AUDITADO:', entry.action);
    }
  }
  
  /**
   * Obtener logs con filtros
   */
  async getLogs(filter: AuditFilter = {}, page: number = 1, limit: number = 50): Promise<{
    logs: LogEntry[];
    total: number;
    hasMore: boolean;
  }> {
    let filteredLogs = [...this.logs];
    
    // Aplicar filtros
    if (filter.fechaDesde) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.fechaDesde!);
    }
    
    if (filter.fechaHasta) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filter.fechaHasta!);
    }
    
    if (filter.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filter.level);
    }
    
    if (filter.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filter.category);
    }
    
    if (filter.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filter.userId);
    }
    
    if (filter.empresaId) {
      filteredLogs = filteredLogs.filter(log => log.empresaId === filter.empresaId);
    }
    
    if (filter.buscar) {
      const searchTerm = filter.buscar.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.action.toLowerCase().includes(searchTerm) ||
        log.userName?.toLowerCase().includes(searchTerm) ||
        JSON.stringify(log.details || {}).toLowerCase().includes(searchTerm)
      );
    }
    
    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
    
    return {
      logs: paginatedLogs,
      total: filteredLogs.length,
      hasMore: endIndex < filteredLogs.length
    };
  }
  
  /**
   * Obtener estadísticas de auditoría
   */
  async getAuditStats(empresaId?: string): Promise<AuditStats> {
    let relevantLogs = this.logs;
    
    if (empresaId) {
      relevantLogs = this.logs.filter(log => log.empresaId === empresaId);
    }
    
    const stats: AuditStats = {
      totalLogs: relevantLogs.length,
      errores: relevantLogs.filter(log => log.level === 'ERROR').length,
      warnings: relevantLogs.filter(log => log.level === 'WARN').length,
      auditorias: relevantLogs.filter(log => log.level === 'AUDIT').length,
      loginsFallidos: relevantLogs.filter(log => 
        log.category === 'AUTENTICACION' && log.action.includes('FALLIDO')
      ).length,
      ultimaActividad: relevantLogs.length > 0 ? relevantLogs[0].timestamp : new Date()
    };
    
    return stats;
  }
  
  /**
   * Exportar logs para auditoría externa
   */
  async exportLogs(filter: AuditFilter = {}, format: 'JSON' | 'CSV' | 'XLSX' = 'JSON'): Promise<string> {
    const { logs } = await this.getLogs(filter, 1, 10000); // Obtener todos los logs filtrados
    
    switch (format) {
      case 'JSON':
        return JSON.stringify(logs, null, 2);
      
      case 'CSV':
        const headers = ['timestamp', 'level', 'category', 'action', 'userName', 'ipAddress'];
        const csvRows = logs.map(log => 
          headers.map(header => 
            header === 'timestamp' ? log.timestamp.toISOString() : 
            (log as any)[header] || ''
          ).join(',')
        );
        return [headers.join(','), ...csvRows].join('\n');
      
      case 'XLSX':
        // TODO: Implementar exportación Excel
        console.log('📊 Exportación XLSX no implementada aún');
        return this.exportLogs(filter, 'JSON');
      
      default:
        return JSON.stringify(logs, null, 2);
    }
  }
  
  /**
   * Limpiar logs antiguos
   */
  async cleanOldLogs(daysBefore: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBefore);
    
    const logsBeforeClean = this.logs.length;
    this.logs = this.logs.filter(log => log.timestamp >= cutoffDate);
    const logsRemoved = logsBeforeClean - this.logs.length;
    
    console.log(`🧹 Logs limpiados: ${logsRemoved} logs anteriores a ${cutoffDate.toISOString()}`);
    
    return logsRemoved;
  }
  
  /**
   * Cargar logs de ejemplo para demo
   */
  private loadMockLogs(): void {
    const mockLogs: Omit<LogEntry, 'id' | 'timestamp'>[] = [
      {
        level: 'AUDIT',
        category: 'AUTENTICACION',
        action: 'LOGIN_EXITOSO',
        userId: 'user_1',
        userName: 'Juan Pérez',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        empresaId: 'empresa_1'
      },
      {
        level: 'INFO',
        category: 'TRANSACCION',
        action: 'FACTURA_CREADA',
        userId: 'user_1',
        userName: 'Juan Pérez',
        empresaId: 'empresa_1',
        details: { facturaId: 'FAC-123456', monto: 150000 }
      },
      {
        level: 'WARN',
        category: 'SII',
        action: 'CERTIFICADO_PROXIMO_VENCIMIENTO',
        details: { diasRestantes: 15, certificado: 'cert_empresa_1.pfx' }
      },
      {
        level: 'ERROR',
        category: 'SISTEMA',
        action: 'BACKUP_FALLIDO',
        details: { error: 'Conexión BD perdida', timestamp: new Date() }
      },
      {
        level: 'AUDIT',
        category: 'SEGURIDAD',
        action: 'INTENTO_ACCESO_NO_AUTORIZADO',
        ipAddress: '192.168.1.200',
        details: { recurso: '/admin/usuarios', metodo: 'GET' }
      }
    ];
    
    // Crear logs con timestamps variados
    mockLogs.forEach((mockLog, index) => {
      const logEntry: LogEntry = {
        ...mockLog,
        id: `mock_${index}`,
        timestamp: new Date(Date.now() - (index * 3600000)) // Cada hora hacia atrás
      };
      this.logs.push(logEntry);
    });
    
    console.log(`📋 Cargados ${mockLogs.length} logs de ejemplo`);
  }
  
  /**
   * Métodos de auditoría específicos para eventos comunes
   */
  async auditLogin(userId: string, userName: string, success: boolean, ipAddress?: string) {
    await this.logEvent({
      level: 'AUDIT',
      category: 'AUTENTICACION',
      action: success ? 'LOGIN_EXITOSO' : 'LOGIN_FALLIDO',
      userId,
      userName,
      ipAddress
    });
  }
  
  async auditTransaction(userId: string, action: string, entityType: string, entityId: string, details?: any) {
    await this.logEvent({
      level: 'INFO',
      category: 'TRANSACCION',
      action: `${entityType.toUpperCase()}_${action.toUpperCase()}`,
      userId,
      details: { entityId, ...details }
    });
  }
  
  async auditSystemError(error: Error, context?: string) {
    await this.logEvent({
      level: 'ERROR',
      category: 'SISTEMA',
      action: 'ERROR_SISTEMA',
      details: {
        message: error.message,
        stack: error.stack,
        context
      }
    });
  }
  
  async auditSIIInteraction(action: string, details?: any) {
    await this.logEvent({
      level: 'INFO',
      category: 'SII',
      action: `SII_${action.toUpperCase()}`,
      details
    });
  }
}

// Singleton del servicio de auditoría
export const auditService = new AuditService();
export default auditService;
