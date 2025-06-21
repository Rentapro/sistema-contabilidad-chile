// Configuración centralizada del sistema
// Este archivo maneja todas las configuraciones y validaciones de variables de entorno

interface SystemConfig {
  // APIs Externas
  groq: {
    apiKey?: string;
    apiUrl: string;
    available: boolean;
  };
  openai: {
    apiKey?: string;
    apiUrl: string;
    available: boolean;
  };
  
  // SII Chile
  sii: {
    apiBaseUrl: string;
    ambiente: 'certificacion' | 'produccion';
    rutEmpresa: string;
    certificadoPath?: string;
    certificadoPassword?: string;
    configured: boolean;
  };
  
  // Base de Datos
  database: {
    url?: string;
    available: boolean;
    provider: 'mock' | 'postgresql' | 'mongodb';
  };
  
  // Email
  email: {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    available: boolean;
  };
  
  // Seguridad
  security: {
    jwtSecret?: string;
    nextAuthSecret?: string;
    configured: boolean;
  };
  
  // Estado general
  environment: 'development' | 'production' | 'staging';
  features: {
    aiAdvisor: boolean;
    siiIntegration: boolean;
    emailNotifications: boolean;
    realDatabase: boolean;
  };
}

class ConfigurationManager {
  private config: SystemConfig;
  
  constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }
  
  private loadConfiguration(): SystemConfig {
    return {
      groq: {
        apiKey: process.env.GROQ_API_KEY,
        apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
        available: !!process.env.GROQ_API_KEY
      },
      
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        apiUrl: process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions',
        available: !!process.env.OPENAI_API_KEY
      },
      
      sii: {
        apiBaseUrl: process.env.NEXT_PUBLIC_SII_API_BASE_URL || 'https://palena.sii.cl',
        ambiente: (process.env.NEXT_PUBLIC_SII_AMBIENTE as 'certificacion' | 'produccion') || 'certificacion',
        rutEmpresa: process.env.NEXT_PUBLIC_SII_RUT_EMPRESA || '77212362-0',
        certificadoPath: process.env.SII_CERTIFICADO_PATH,
        certificadoPassword: process.env.SII_CERTIFICADO_PASSWORD,
        configured: !!(process.env.SII_CERTIFICADO_PATH && process.env.SII_CERTIFICADO_PASSWORD)
      },
      
      database: {
        url: process.env.DATABASE_URL,
        available: !!process.env.DATABASE_URL,
        provider: process.env.DATABASE_URL ? 'postgresql' : 'mock'
      },
      
      email: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        available: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)
      },
      
      security: {
        jwtSecret: process.env.JWT_SECRET,
        nextAuthSecret: process.env.NEXTAUTH_SECRET,
        // En desarrollo, no es crítico tener secretos
        configured: process.env.NODE_ENV !== 'production' || !!(process.env.JWT_SECRET && process.env.NEXTAUTH_SECRET)
      },
      
      environment: (process.env.NODE_ENV as any) || 'development',
      
      features: {
        aiAdvisor: !!process.env.GROQ_API_KEY,
        siiIntegration: !!(process.env.SII_CERTIFICADO_PATH && process.env.SII_CERTIFICADO_PASSWORD),
        emailNotifications: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
        realDatabase: !!process.env.DATABASE_URL
      }
    };
  }
  
  private validateConfiguration(): void {
    const warnings: string[] = [];
    const errors: string[] = [];
    const isProd = this.config.environment === 'production';
    
    // Validar configuraciones críticas
    if (!this.config.security.configured) {
      if (isProd) {
        errors.push('⚠️ Seguridad: JWT_SECRET y NEXTAUTH_SECRET no configurados');
      } else {
        warnings.push('⚠️ Seguridad: JWT_SECRET y NEXTAUTH_SECRET no configurados (modo desarrollo)');
      }
    }
    
    // Validar configuraciones opcionales pero recomendadas
    if (!this.config.groq.available && !this.config.openai.available) {
      warnings.push('⚠️ IA: Ninguna API de IA configurada (GROQ_API_KEY u OPENAI_API_KEY)');
    }

    if (!this.config.sii.configured) {
      warnings.push('⚠️ SII: Certificado digital no configurado (funcionalidad limitada)');
    }
    
    if (!this.config.database.available) {
      warnings.push('⚠️ Base de Datos: Usando datos mock (no persistentes)');
    }
    
    if (!this.config.email.available) {
      warnings.push('⚠️ Email: Servicio de correo no configurado');
    }
    
    // Mostrar resultados
    if (errors.length > 0) {
      console.error('❌ Errores de configuración críticos:');
      errors.forEach(error => console.error(`  - ${error}`));
    }
    
    if (warnings.length > 0) {
      console.warn('⚠️ Advertencias de configuración:');
      warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ Configuración del sistema validada correctamente');
    }
  }
  
  // Getters para acceso fácil a la configuración
  getConfig(): SystemConfig {
    return { ...this.config };
  }
  
  isFeatureEnabled(feature: keyof SystemConfig['features']): boolean {
    return this.config.features[feature];
  }
  
  getApiKey(service: 'groq' | 'openai'): string | undefined {
    return this.config[service].apiKey;
  }
  
  getDatabaseConfig() {
    return this.config.database;
  }
  
  getSIIConfig() {
    return this.config.sii;
  }
  
  getEmailConfig() {
    return this.config.email;
  }
}

// Instancia singleton
export const configManager = new ConfigurationManager();
export default configManager;
