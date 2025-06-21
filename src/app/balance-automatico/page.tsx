'use client';

import { useAuth } from '@/contexts/AuthContext';
import BalanceAutomaticoMensual from '@/components/BalanceAutomaticoMensual';

export default function BalanceAutomaticoPage() {
  const { usuario } = useAuth();

  // Verificar permisos (solo contadores y admins)
  const tienePermisos = usuario?.rol === 'superadmin' || 
                        usuario?.rol === 'admin_empresa' || 
                        usuario?.rol === 'contador';

  if (!tienePermisos) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600">No tienes permisos para acceder a esta funcionalidad.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <BalanceAutomaticoMensual />
    </div>
  );
}
