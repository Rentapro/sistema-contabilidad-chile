'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';
import SuperAdminDashboard from '@/components/SuperAdminDashboard';
import ClienteDashboard from '@/components/ClienteDashboard';
import Navigation from '@/components/Navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Usuario } from '@/types/auth';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { usuario, isLoading, esSuperAdmin, esCliente, login } = useAuth();
  const pathname = usePathname();
  const [showAuthenticatedContent, setShowAuthenticatedContent] = useState(false);

  useEffect(() => {
    // Delay para evitar flash de contenido no autenticado
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowAuthenticatedContent(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);  const handleLoginSuccess = async (usuarioLogueado: Usuario) => {
    // Esta función será llamada cuando el login sea exitoso
    // Usar el método login del contexto para actualizar el estado
    console.log('Login exitoso:', usuarioLogueado);
    
    // Forzar recarga del estado de autenticación
    window.location.reload();
  };

  // Pantalla de carga
  if (isLoading || !showAuthenticatedContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando sistema...</p>
        </div>
      </div>
    );
  }  // Si no hay usuario autenticado, mostrar login
  if (!usuario) {
    return <LoginPage />;
  }
  // Para SuperAdmin en la ruta raíz, mostrar dashboard ejecutivo
  if (esSuperAdmin() && pathname === '/') {
    return <SuperAdminDashboard usuario={usuario} />;
  }

  // Para cliente básico en la ruta raíz, mostrar dashboard simplificado
  if (esCliente() && pathname === '/') {
    return <ClienteDashboard usuario={usuario} />;
  }

  // Para todas las demás rutas, mostrar la aplicación normal con navegación
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
}
