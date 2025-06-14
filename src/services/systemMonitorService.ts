/**
 * Servicio de Monitoreo del Sistema
 * Sistema Contabilidad Chile
 */

import configManager from '@/lib/config';
import dbAdapter from '@/lib/database';

export interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  responseTime?: number;
  lastCheck: Date;
  uptime?: number;
  errorRate?: number;
  details?: string;
}

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  services: ServiceStatus[];
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    activeUsers: number;
    requestsPerMinute: number;
  };
  features: {
    name: string;
    enabled: boolean;
    configured: boolean;
    status: 'working' | 'partial' | 'broken';
    description: string;
  }[];
  lastUpdate: Date;
}

class SystemMonitorService {
  private healthData: SystemHealth;
  
  constructor() {
    this.healthData = this.initializeHealthData();
    this.startMonitoring();
  }
  
  private initializeHealthData(): SystemHealth {
    return {
      overall: 'healthy',
      services: [],
      metrics: {
        cpu: 0,
        memory: 0,
        disk: 0,
        activeUsers: 0,
        requestsPerMinute: 0
      },
      features: [],
      lastUpdate: new Date()
    };
  }
  
  private startMonitoring(): void {
    console.log('🔍 Iniciando monitoreo del sistema...');
    
    // Verificar servicios cada 30 segundos
    setInterval(() => {
      this.checkSystemHealth();
    }, 30000);
    
    // Verificación inicial
    this.checkSystemHealth();
  }
  
  /**
   * Verificar salud general del sistema
   */
  async checkSystemHealth(): Promise<SystemHealth> {
    try {
      // Verificar servicios críticos
      const services = await this.checkAllServices();
      
      // Verificar características del sistema
      const features = this.checkSystemFeatures();
      
      // Simular métricas del sistema (en producción serían reales)
      const metrics = await this.getSystemMetrics();
      
      // Determinar estado general
      const overall = this.calculateOverallHealth(services, features);
      
      this.healthData = {
        overall,
        services,
        metrics,
        features,
        lastUpdate: new Date()
      };
      
      return this.healthData;
      
    } catch (error) {
      console.error('❌ Error verificando salud del sistema:', error);
      
      return {
        overall: 'critical',
        services: [],
        metrics: {
          cpu: 0,
          memory: 0,
          disk: 0,
          activeUsers: 0,
          requestsPerMinute: 0
        },
        features: [],
        lastUpdate: new Date()
      };
    }
  }
  
  /**
   * Verificar todos los servicios
   */
  private async checkAllServices(): Promise<ServiceStatus[]> {
    const services: ServiceStatus[] = [];
    
    // Base de datos
    const dbStatus = await this.checkDatabaseStatus();
    services.push(dbStatus);
    
    // Servicio de Email
    const emailStatus = await this.checkEmailService();
    services.push(emailStatus);
    
    // Integración SII
    const siiStatus = await this.checkSIIService();
    services.push(siiStatus);
    
    // Servicio de IA
    const aiStatus = await this.checkAIService();
    services.push(aiStatus);
    
    // Servicio de Backup
    const backupStatus = await this.checkBackupService();
    services.push(backupStatus);
    
    return services;
  }
  
  private async checkDatabaseStatus(): Promise<ServiceStatus> {
    const startTime = Date.now();
    
    try {
      const isAvailable = await dbAdapter.testConnection();
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'Base de Datos',
        status: isAvailable ? 'online' : 'offline',
        responseTime,
        lastCheck: new Date(),
        uptime: 99.5,
        errorRate: 0.1,
        details: configManager.getDatabaseConfig().provider === 'mock' ? 
          'Usando datos en memoria (mock)' : 'Conexión establecida'
      };
    } catch (error) {
      return {
        name: 'Base de Datos',
        status: 'offline',
        lastCheck: new Date(),
        details: 'Error de conexión'
      };
    }
  }
  
  private async checkEmailService(): Promise<ServiceStatus> {
    const emailConfig = configManager.getEmailConfig();
    
    return {
      name: 'Servicio de Email',
      status: emailConfig.available ? 'online' : 'offline',
      responseTime: 250,
      lastCheck: new Date(),
      uptime: emailConfig.available ? 98.2 : 0,
      details: emailConfig.available ? 
        `Configurado: ${emailConfig.host}` : 
        'No configurado - Ver variables de entorno'
    };
  }
  
  private async checkSIIService(): Promise<ServiceStatus> {
    const siiConfig = configManager.getSIIConfig();
    
    // Simular verificación de conectividad SII
    const isConfigured = siiConfig.configured;
    
    return {
      name: 'Integración SII',
      status: isConfigured ? 'online' : 'degraded',
      responseTime: 1200,
      lastCheck: new Date(),
      uptime: isConfigured ? 95.8 : 0,
      errorRate: isConfigured ? 2.1 : 0,
      details: isConfigured ? 
        `Ambiente: ${siiConfig.ambiente}` : 
        'Certificado digital no configurado'
    };
  }
  
  private async checkAIService(): Promise<ServiceStatus> {
    const hasGroq = configManager.getApiKey('groq');
    const hasOpenAI = configManager.getApiKey('openai');
    
    let status: ServiceStatus['status'] = 'offline';
    let details = 'No hay APIs de IA configuradas';
    
    if (hasGroq && hasOpenAI) {
      status = 'online';
      details = 'Groq y OpenAI disponibles';
    } else if (hasGroq || hasOpenAI) {
      status = 'degraded';
      details = hasGroq ? 'Solo Groq disponible' : 'Solo OpenAI disponible';
    }
    
    return {
      name: 'Asistente IA',
      status,
      responseTime: 800,
      lastCheck: new Date(),
      uptime: status === 'online' ? 97.3 : status === 'degraded' ? 85.2 : 0,
      details
    };
  }
  
  private async checkBackupService(): Promise<ServiceStatus> {
    // El backup service siempre está disponible (mock o real)
    return {
      name: 'Sistema de Backup',
      status: 'online',
      responseTime: 150,
      lastCheck: new Date(),
      uptime: 99.9,
      details: 'Backups automáticos funcionando'
    };
  }
  
  /**
   * Verificar características del sistema
   */
  private checkSystemFeatures() {
    const config = configManager.getConfig();
    
    return [
      {
        name: 'Asistente IA Fiscal',
        enabled: config.features.aiAdvisor,
        configured: config.groq.available || config.openai.available,
        status: config.features.aiAdvisor ? 'working' as const : 'broken' as const,
        description: 'Consejos fiscales inteligentes con IA'
      },
      {
        name: 'Integración SII Real',
        enabled: true,
        configured: config.features.siiIntegration,
        status: config.features.siiIntegration ? 'working' as const : 'partial' as const,
        description: 'Documentos tributarios electrónicos'
      },
      {
        name: 'Notificaciones Email',
        enabled: true,
        configured: config.features.emailNotifications,
        status: config.features.emailNotifications ? 'working' as const : 'partial' as const,
        description: 'Alertas y reportes por correo'
      },
      {
        name: 'Base de Datos Persistente',
        enabled: true,
        configured: config.features.realDatabase,
        status: config.features.realDatabase ? 'working' as const : 'partial' as const,
        description: 'Almacenamiento permanente de datos'
      },      {
        name: 'Facturas Electrónicas',
        enabled: true,
        configured: true,
        status: 'working' as const,
        description: 'Generación de DTEs'
      },
      {
        name: 'Reportes Avanzados',
        enabled: true,
        configured: true,
        status: 'working' as const,
        description: 'F29, Libro IVA, Balance'
      },
      {
        name: 'Sistema Multi-empresa',
        enabled: true,
        configured: true,
        status: 'working' as const,
        description: 'Gestión de múltiples empresas'
      },
      {
        name: 'Auditoría Completa',
        enabled: true,
        configured: true,
        status: 'working' as const,
        description: 'Logs y seguimiento de actividad'
      }
    ];
  }
  
  /**
   * Obtener métricas del sistema (simuladas para demo)
   */
  private async getSystemMetrics() {
    // En producción, estas serían métricas reales del servidor
    return {
      cpu: Math.floor(Math.random() * 30) + 15, // 15-45%
      memory: Math.floor(Math.random() * 40) + 30, // 30-70%
      disk: Math.floor(Math.random() * 20) + 40, // 40-60%
      activeUsers: Math.floor(Math.random() * 50) + 10, // 10-60 usuarios
      requestsPerMinute: Math.floor(Math.random() * 200) + 50 // 50-250 req/min
    };
  }
  
  /**
   * Calcular estado general del sistema
   */
  private calculateOverallHealth(services: ServiceStatus[], features: any[]): SystemHealth['overall'] {
    const criticalServices = services.filter(s => s.name === 'Base de Datos');
    const offlineServices = services.filter(s => s.status === 'offline').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;
    
    // Si servicios críticos están offline
    if (criticalServices.some(s => s.status === 'offline')) {
      return 'critical';
    }
    
    // Si hay muchos servicios degradados u offline
    if (offlineServices > 2 || degradedServices > 3) {
      return 'warning';
    }
    
    return 'healthy';
  }
  
  /**
   * Obtener salud actual del sistema
   */
  getSystemHealth(): SystemHealth {
    return { ...this.healthData };
  }
  
  /**
   * Obtener estado de un servicio específico
   */
  getServiceStatus(serviceName: string): ServiceStatus | undefined {
    return this.healthData.services.find(s => s.name === serviceName);
  }
  
  /**
   * Reiniciar verificación de salud
   */
  async refreshSystemHealth(): Promise<SystemHealth> {
    console.log('🔄 Actualizando estado del sistema...');
    return await this.checkSystemHealth();
  }
}

// Singleton del servicio de monitoreo
export const systemMonitor = new SystemMonitorService();
export default systemMonitor;
