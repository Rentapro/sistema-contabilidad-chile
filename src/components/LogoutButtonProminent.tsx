'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

interface LogoutButtonProminentProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  showUserInfo?: boolean;
  className?: string;
}

export default function LogoutButtonProminent({ 
  variant = 'destructive',
  size = 'default',
  showUserInfo = true,
  className = ''
}: LogoutButtonProminentProps) {
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showUserInfo && (
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4 text-gray-500" />
          <div className="text-right">
            <div className="font-medium text-gray-900">{usuario.nombre}</div>
            <div className="text-xs text-gray-500">{usuario.rol}</div>
          </div>
        </div>
      )}
      
      <Button
        variant={variant}
        size={size}
        onClick={handleLogout}
        className="flex items-center space-x-2 font-medium"
      >
        <LogOut className="h-4 w-4" />
        <span>Cerrar Sesión</span>
      </Button>
    </div>
  );
}
