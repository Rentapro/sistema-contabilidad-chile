'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      
      if (!success) {
        setError('Email o contraseña incorrectos');
      }
      // Si el login es exitoso, el contexto se actualizará automáticamente
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🏢</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sistema de Contabilidad
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Plataforma Multi-Empresa con IA
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-700 font-medium"
                placeholder="cliente@empresa.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-700 font-medium"
                placeholder="cliente123"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Información de cuentas de prueba */}
          <div className="mt-6 border-t pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Cuentas de prueba disponibles:</p>
              <div className="space-y-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium">🔧 SuperAdmin:</span>
                  <span className="font-mono">admin@contabilidad.pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">🏢 Cliente:</span>
                  <span className="font-mono">cliente@empresa.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">🔐 Contraseña:</span>
                  <span className="font-mono">admin123 / cliente123</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                El sistema identificará automáticamente tu tipo de usuario
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 Sistema de Contabilidad Multi-Empresa</p>
          <p className="mt-1">Automatización con IA para gestión contable</p>
        </div>
      </div>
    </div>
  );
}
