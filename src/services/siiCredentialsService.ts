/**
 * Servicio de Gestión de Credenciales SII
 * Almacena de forma segura las credenciales de cada usuario
 */

import { encrypt, decrypt } from '@/lib/encryption';

export interface SIICredentials {
  rutEmpresa: string;
  rutUsuario: string;
  claveUsuario: string;
  certificadoDigital?: File | string;
  pinCertificado?: string;
  ambiente: 'certificacion' | 'produccion';
  activo: boolean;
  fechaRegistro: Date;
  ultimaValidacion?: Date;
}

export interface SIILoginForm {
  rutEmpresa: string;
  rutUsuario: string;
  claveUsuario: string;
  certificadoDigital?: File;
  pinCertificado?: string;
  ambiente: 'certificacion' | 'produccion';
  recordarCredenciales: boolean;
}

export interface SIISession {
  isAuthenticated: boolean;
  rutEmpresa: string;
  rutUsuario: string;
  ambiente: 'certificacion' | 'produccion';
  token?: string;
  expiresAt?: Date;
  lastActivity: Date;
}

class SIICredentialsService {
  private readonly STORAGE_KEY = 'sii_credentials_encrypted';
  private readonly SESSION_KEY = 'sii_session';
  private currentSession: SIISession | null = null;

  constructor() {
    this.loadSession();
  }

  /**
   * Autenticar usuario con SII
   */
  async authenticateWithSII(loginData: SIILoginForm): Promise<{
    success: boolean;
    session?: SIISession;
    error?: string;
  }> {
    try {
      console.log(`🔐 Intentando autenticación SII para RUT: ${loginData.rutUsuario}`);
      
      // Validar formato de RUTs
      if (!this.validateRUT(loginData.rutEmpresa) || !this.validateRUT(loginData.rutUsuario)) {
        return {
          success: false,
          error: 'Formato de RUT inválido'
        };
      }

      // Simular autenticación con SII (en producción sería una llamada real)
      const authResult = await this.performSIIAuthentication(loginData);
      
      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error || 'Error de autenticación'
        };
      }

      // Crear sesión
      const session: SIISession = {
        isAuthenticated: true,
        rutEmpresa: loginData.rutEmpresa,
        rutUsuario: loginData.rutUsuario,
        ambiente: loginData.ambiente,
        token: authResult.token,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 horas
        lastActivity: new Date()
      };

      // Guardar credenciales si el usuario lo solicita
      if (loginData.recordarCredenciales) {
        await this.saveCredentials({
          rutEmpresa: loginData.rutEmpresa,
          rutUsuario: loginData.rutUsuario,
          claveUsuario: loginData.claveUsuario,
          certificadoDigital: loginData.certificadoDigital ? 'stored' : undefined,
          pinCertificado: loginData.pinCertificado,
          ambiente: loginData.ambiente,
          activo: true,
          fechaRegistro: new Date(),
          ultimaValidacion: new Date()
        });
      }

      // Guardar sesión
      this.currentSession = session;
      this.saveSession(session);

      console.log('✅ Autenticación SII exitosa');
      
      return {
        success: true,
        session
      };

    } catch (error) {
      console.error('❌ Error en autenticación SII:', error);
      return {
        success: false,
        error: 'Error interno del sistema'
      };
    }
  }

  /**
   * Realizar autenticación real con SII
   */
  private async performSIIAuthentication(loginData: SIILoginForm): Promise<{
    success: boolean;
    token?: string;
    error?: string;
  }> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Validaciones básicas
    if (!loginData.claveUsuario || loginData.claveUsuario.length < 6) {
      return {
        success: false,
        error: 'Contraseña muy corta'
      };
    }

    // Aquí iría la llamada real al SII
    /*
    const siiResponse = await fetch('https://zeusr.sii.cl/AUT2000/InicioAutenticacion/IngresoRutClave.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'rut': loginData.rutUsuario,
        'clave': loginData.claveUsuario,
        'empresa': loginData.rutEmpresa
      }),
    });
    */

    // Por ahora, simular autenticación exitosa
    return {
      success: true,
      token: `sii_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Obtener credenciales guardadas
   */
  async getSavedCredentials(): Promise<SIICredentials | null> {
    try {
      const encryptedData = localStorage.getItem(this.STORAGE_KEY);
      if (!encryptedData) return null;

      const decryptedData = decrypt(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error obteniendo credenciales:', error);
      return null;
    }
  }

  /**
   * Guardar credenciales de forma segura
   */
  private async saveCredentials(credentials: SIICredentials): Promise<void> {
    try {
      const dataToEncrypt = JSON.stringify(credentials);
      const encryptedData = encrypt(dataToEncrypt);
      localStorage.setItem(this.STORAGE_KEY, encryptedData);
      
      console.log('🔐 Credenciales SII guardadas de forma segura');
    } catch (error) {
      console.error('Error guardando credenciales:', error);
      throw new Error('No se pudieron guardar las credenciales');
    }
  }

  /**
   * Obtener sesión actual
   */
  getCurrentSession(): SIISession | null {
    if (!this.currentSession) return null;

    // Verificar si la sesión ha expirado
    if (this.currentSession.expiresAt && new Date() > this.currentSession.expiresAt) {
      this.logout();
      return null;
    }

    return this.currentSession;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return session?.isAuthenticated || false;
  }

  /**
   * Renovar token de sesión
   */
  async renewSession(): Promise<boolean> {
    const session = this.getCurrentSession();
    if (!session) return false;

    try {
      // Simular renovación de token
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      session.expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
      session.lastActivity = new Date();
      
      this.saveSession(session);
      
      console.log('🔄 Sesión SII renovada');
      return true;
    } catch (error) {
      console.error('Error renovando sesión:', error);
      return false;
    }
  }

  /**
   * Cerrar sesión SII
   */
  logout(): void {
    this.currentSession = null;
    localStorage.removeItem(this.SESSION_KEY);
    console.log('👋 Sesión SII cerrada');
  }

  /**
   * Eliminar credenciales guardadas
   */
  async clearSavedCredentials(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🗑️ Credenciales SII eliminadas');
  }

  /**
   * Validar formato de RUT
   */
  private validateRUT(rut: string): boolean {
    if (!rut) return false;
    
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    
    let suma = 0;
    let multiplo = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    
    const resto = suma % 11;
    const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'K' : (11 - resto).toString();
    
    return dv === dvCalculado;
  }

  /**
   * Cargar sesión desde localStorage
   */
  private loadSession(): void {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        
        // Verificar si no ha expirado
        if (session.expiresAt && new Date(session.expiresAt) > new Date()) {
          this.currentSession = {
            ...session,
            expiresAt: new Date(session.expiresAt),
            lastActivity: new Date(session.lastActivity)
          };
        }
      }
    } catch (error) {
      console.error('Error cargando sesión:', error);
    }
  }

  /**
   * Guardar sesión en localStorage
   */
  private saveSession(session: SIISession): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Error guardando sesión:', error);
    }
  }

  /**
   * Obtener información de configuración para mostrar en UI
   */
  getSIIConfig() {
    const session = this.getCurrentSession();
    const hasCredentials = localStorage.getItem(this.STORAGE_KEY) !== null;
    
    return {
      isAuthenticated: this.isAuthenticated(),
      hasStoredCredentials: hasCredentials,
      currentUser: session?.rutUsuario,
      currentEmpresa: session?.rutEmpresa,
      ambiente: session?.ambiente,
      sessionExpiresAt: session?.expiresAt
    };
  }
}

// Singleton del servicio
export const siiCredentialsService = new SIICredentialsService();
export default siiCredentialsService;
