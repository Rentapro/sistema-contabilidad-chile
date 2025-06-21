'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, ChevronDown, ChevronUp } from 'lucide-react';

export default function FloatingLogoutWidget() {
  const { usuario, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!usuario) return null;

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contador':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cliente':
      case 'cliente_basico':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'superadmin':
        return 'Super Admin';
      case 'contador':
        return 'Contador';
      case 'cliente_basico':
        return 'Cliente';
      default:
        return rol;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-lg border transition-all duration-300 ${
        isExpanded ? 'p-4' : 'p-2'
      }`}>
        {isExpanded ? (
          // Vista expandida
          <div className="space-y-3 min-w-[250px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">{usuario.nombre}</div>
                  <div className="text-xs text-gray-500">{usuario.email}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
            
            <Badge 
              variant="outline" 
              className={`text-xs w-fit ${getRoleColor(usuario.rol)}`}
            >
              {getRoleLabel(usuario.rol)}
            </Badge>
            
            <div className="border-t pt-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        ) : (
          // Vista colapsada
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="flex items-center space-x-2 hover:bg-gray-100"
            >
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">{usuario.nombre}</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
