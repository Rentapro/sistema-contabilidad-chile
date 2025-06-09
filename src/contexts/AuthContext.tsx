'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Usuario, Empresa } from '@/types/auth';
import { authService } from '@/services/authService';

interface AuthContextType {
  usuario: Usuario | null;
  empresaActual: Empresa | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  cambiarEmpresa: (empresaId: string) => void;
  tienePermiso: (permiso: string) => boolean;
  esSuperAdmin: () => boolean;
  esCliente: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Exportar el contexto para uso directo
export { AuthContext };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresaActual, setEmpresaActual] = useState<Empresa | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar
    const checkSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session && session.usuario) {
          setUsuario(session.usuario);
          if (session.empresaActual) {
            setEmpresaActual(session.empresaActual);
          }
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success && result.usuario) {
        setUsuario(result.usuario);
        
        // Para SuperAdmin, cargar la primera empresa disponible
        if (result.usuario.rol === 'superadmin') {
          const empresas = await authService.getEmpresasGestionadas(result.usuario.id);
          if (empresas.length > 0) {
            setEmpresaActual(empresas[0]);
          }
        } else if (result.usuario.empresa) {
          // Para otros roles, cargar su empresa asignada
          const empresa = await authService.getEmpresaPorId(result.usuario.empresa);
          if (empresa) {
            setEmpresaActual(empresa);
          }
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
    setEmpresaActual(null);
  };

  const cambiarEmpresa = async (empresaId: string) => {
    if (usuario?.rol === 'superadmin') {
      const empresa = await authService.getEmpresaPorId(empresaId);
      if (empresa) {
        setEmpresaActual(empresa);
      }
    }
  };

  const tienePermiso = (permiso: string): boolean => {
    if (!usuario) return false;
    return usuario.permisos.includes(permiso);
  };

  const esSuperAdmin = (): boolean => {
    return usuario?.rol === 'superadmin';
  };

  const esCliente = (): boolean => {
    return usuario?.rol === 'cliente_basico';
  };

  const value = {
    usuario,
    empresaActual,
    isLoading,
    login,
    logout,
    cambiarEmpresa,
    tienePermiso,
    esSuperAdmin,
    esCliente
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
