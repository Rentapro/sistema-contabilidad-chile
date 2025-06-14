'use client';

import { useState, useEffect, useCallback } from 'react';
import siiCredentialsService, { SIISession } from '@/services/siiCredentialsService';

export interface UseSIIAuthReturn {
  // Estado de autenticación
  isAuthenticated: boolean;
  session: SIISession | null;
  isLoading: boolean;
  
  // Información de configuración
  hasStoredCredentials: boolean;
  currentUser: string | undefined;
  currentEmpresa: string | undefined;
  ambiente: 'certificacion' | 'produccion' | undefined;
  
  // Funciones de control
  login: (credentials: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  renewSession: () => Promise<boolean>;
  clearStoredCredentials: () => Promise<void>;
  
  // Estado de la sesión
  sessionExpiresAt: Date | undefined;
  timeUntilExpiry: number | undefined;
}

/**
 * Hook personalizado para gestión de autenticación SII
 */
export function useSIIAuth(): UseSIIAuthReturn {
  const [session, setSession] = useState<SIISession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | undefined>();

  // Verificar estado inicial
  useEffect(() => {
    checkInitialState();
    
    // Verificar expiración cada minuto
    const interval = setInterval(checkSessionExpiry, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const checkInitialState = useCallback(async () => {
    const currentSession = siiCredentialsService.getCurrentSession();
    const config = siiCredentialsService.getSIIConfig();
    
    setSession(currentSession);
    setHasStoredCredentials(config.hasStoredCredentials);
    
    if (currentSession?.expiresAt) {
      updateTimeUntilExpiry(currentSession.expiresAt);
    }
  }, []);

  const checkSessionExpiry = useCallback(() => {
    const currentSession = siiCredentialsService.getCurrentSession();
    
    if (currentSession?.expiresAt) {
      const now = new Date();
      const expiry = currentSession.expiresAt;
      const timeLeft = expiry.getTime() - now.getTime();
      
      if (timeLeft <= 0) {
        // Sesión expirada
        handleSessionExpired();
      } else {
        setTimeUntilExpiry(Math.floor(timeLeft / 1000 / 60)); // minutos
        
        // Renovar automáticamente si queda menos de 30 minutos
        if (timeLeft < 30 * 60 * 1000) {
          renewSession();
        }
      }
    }
  }, []);

  const updateTimeUntilExpiry = useCallback((expiresAt: Date) => {
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();
    setTimeUntilExpiry(Math.floor(timeLeft / 1000 / 60));
  }, []);

  const handleSessionExpired = useCallback(() => {
    console.log('🕒 Sesión SII expirada');
    setSession(null);
    setTimeUntilExpiry(undefined);
    siiCredentialsService.logout();
  }, []);

  const login = useCallback(async (credentials: any) => {
    setIsLoading(true);
    
    try {
      const result = await siiCredentialsService.authenticateWithSII(credentials);
      
      if (result.success && result.session) {
        setSession(result.session);
        
        if (result.session.expiresAt) {
          updateTimeUntilExpiry(result.session.expiresAt);
        }
        
        // Actualizar estado de credenciales guardadas
        const config = siiCredentialsService.getSIIConfig();
        setHasStoredCredentials(config.hasStoredCredentials);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error || 'Error de autenticación' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Error interno del sistema' 
      };
    } finally {
      setIsLoading(false);
    }
  }, [updateTimeUntilExpiry]);

  const logout = useCallback(() => {
    siiCredentialsService.logout();
    setSession(null);
    setTimeUntilExpiry(undefined);
  }, []);

  const renewSession = useCallback(async (): Promise<boolean> => {
    try {
      const success = await siiCredentialsService.renewSession();
      
      if (success) {
        const updatedSession = siiCredentialsService.getCurrentSession();
        setSession(updatedSession);
        
        if (updatedSession?.expiresAt) {
          updateTimeUntilExpiry(updatedSession.expiresAt);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error renovando sesión SII:', error);
      return false;
    }
  }, [updateTimeUntilExpiry]);

  const clearStoredCredentials = useCallback(async () => {
    await siiCredentialsService.clearSavedCredentials();
    setHasStoredCredentials(false);
  }, []);

  return {
    // Estado de autenticación
    isAuthenticated: session?.isAuthenticated || false,
    session,
    isLoading,
    
    // Información de configuración
    hasStoredCredentials,
    currentUser: session?.rutUsuario,
    currentEmpresa: session?.rutEmpresa,
    ambiente: session?.ambiente,
    
    // Funciones de control
    login,
    logout,
    renewSession,
    clearStoredCredentials,
    
    // Estado de la sesión
    sessionExpiresAt: session?.expiresAt,
    timeUntilExpiry
  };
}
