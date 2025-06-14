'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function DiagnosticoLogin() {
  const { login, usuario, isLoading } = useAuth();

  const testLogin = async () => {
    console.log('🔧 Iniciando test de login...');
    
    try {
      const result = await login('admin@contabilidad.pro', 'admin123');
      console.log('✅ Resultado del login:', result);
      
      if (result) {
        console.log('🎉 Login exitoso! Usuario autenticado.');
      } else {
        console.log('❌ Login falló');
      }
    } catch (error) {
      console.error('💥 Error en login:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg z-50">
      <h3 className="font-bold text-sm mb-2">🔧 Diagnóstico</h3>
      <div className="text-xs space-y-1">
        <p><strong>Estado:</strong> {isLoading ? 'Cargando...' : 'Listo'}</p>
        <p><strong>Usuario:</strong> {usuario ? `${usuario.email} (${usuario.rol})` : 'No autenticado'}</p>
        <button 
          onClick={testLogin}
          className="w-full bg-blue-500 text-white px-2 py-1 rounded text-xs mt-2 hover:bg-blue-600"
        >
          Test Login SuperAdmin
        </button>
      </div>
    </div>
  );
}
