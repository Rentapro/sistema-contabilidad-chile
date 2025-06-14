'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FeatureProtectionProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRole?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function FeatureProtection({
  children,
  requiredPermissions = [],
  requiredRole = [],
  fallback,
  redirectTo
}: FeatureProtectionProps) {
  const { usuario, tienePermiso, empresaActual } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // Función helper para determinar el plan actual
  const getPlanActual = () => {
    return empresaActual?.tipoLicencia || usuario?.licencia || 'basico';
  };

  const esBasico = () => {
    return getPlanActual() === 'basico';
  };

  useEffect(() => {
    if (!usuario) {
      setHasAccess(false);
      return;
    }

    // Verificar rol
    if (requiredRole.length > 0 && !requiredRole.includes(usuario.rol)) {
      setHasAccess(false);
      return;
    }

    // Verificar permisos (OR logic - cualquier permiso es suficiente)
    if (requiredPermissions.length > 0) {
      const hasAnyPermission = requiredPermissions.some(perm => tienePermiso(perm));
      if (!hasAnyPermission) {
        setHasAccess(false);
        return;
      }
    }

    setHasAccess(true);
  }, [usuario, requiredPermissions, requiredRole, tienePermiso]);

  // Redirigir si es necesario
  useEffect(() => {
    if (hasAccess === false && redirectTo) {
      router.push(redirectTo);
    }
  }, [hasAccess, redirectTo, router]);

  // Mostrar loading mientras se verifica
  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no tiene acceso, mostrar fallback o nada
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 m-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Función No Disponible
            </h3>            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Esta funcionalidad requiere una licencia superior. 
                {esBasico() && (
                  <span className="block mt-1">
                    <strong>Actualiza a Premium</strong> para acceder a todas las características avanzadas.
                  </span>
                )}
              </p>
            </div>
            {esBasico() && (
              <div className="mt-4">
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Actualizar Licencia
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
