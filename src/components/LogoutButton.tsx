'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleLogout}
      className="w-full flex items-center justify-center space-x-2 font-medium"
    >
      <LogOut className="h-4 w-4" />
      <span>Cerrar Sesión</span>
    </Button>
  );
}
