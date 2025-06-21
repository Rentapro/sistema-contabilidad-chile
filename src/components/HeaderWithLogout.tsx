'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Shield, Building } from 'lucide-react';

interface HeaderWithLogoutProps {
  title?: string;
  subtitle?: string;
  showUserInfo?: boolean;
}

export default function HeaderWithLogout({ 
  title = "Dashboard", 
  subtitle,
  showUserInfo = true 
}: HeaderWithLogoutProps) {
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contador':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cliente':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (rol: string) => {
    switch (rol) {
      case 'superadmin':
        return <Shield className="w-4 h-4" />;
      case 'contador':
        return <User className="w-4 h-4" />;
      case 'cliente':
        return <Building className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'superadmin':
        return 'Super Administrador';
      case 'contador':
        return 'Contador';
      case 'cliente':
        return 'Cliente/Microempresa';
      default:
        return rol;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Título y subtítulo */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Información del usuario y logout */}
        {showUserInfo && (
          <div className="flex items-center space-x-4">
            {/* Info del usuario */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {usuario.nombre}
                </p>
                <p className="text-xs text-gray-500">
                  {usuario.email}
                </p>
              </div>
              
              {/* Badge del rol */}
              <Badge 
                variant="outline" 
                className={`flex items-center space-x-1 ${getRoleColor(usuario.rol)}`}
              >
                {getRoleIcon(usuario.rol)}
                <span className="hidden sm:inline">
                  {getRoleLabel(usuario.rol)}
                </span>
              </Badge>
            </div>

            {/* Botón de logout */}
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
