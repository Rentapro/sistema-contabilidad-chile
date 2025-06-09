'use client';

import { useState } from 'react';
import { authService } from '@/services/authService';
import { Usuario } from '@/types/auth';

interface LoginPageProps {
  onLoginSuccess: (usuario: Usuario) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(email, password);
      
      if (result.success && result.usuario) {
        onLoginSuccess(result.usuario);
      } else {
        setError(result.error || 'Error de autenticación');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async (tipo: 'superadmin' | 'cliente') => {
    const credentials = tipo === 'superadmin' 
      ? { email: 'admin@contabilidad.pro', password: 'admin123' }
      : { email: 'cliente@empresa.com', password: 'cliente123' };
    
    setEmail(credentials.email);
    setPassword(credentials.password);
    
    const result = await authService.login(credentials.email, credentials.password);
    if (result.success && result.usuario) {
      onLoginSuccess(result.usuario);
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="correo@empresa.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
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

          {/* Demo Buttons */}
          <div className="mt-6 border-t pt-6">
            <div className="text-center">
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {showDemo ? 'Ocultar' : 'Ver'} cuentas de demostración
              </button>
            </div>

            {showDemo && (
              <div className="mt-4 space-y-3">
                <button
                  onClick={() => loginDemo('superadmin')}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-blue-700 flex items-center justify-center"
                >
                  <span className="mr-2">👑</span>
                  SuperAdmin - Panel Ejecutivo
                </button>
                
                <button
                  onClick={() => loginDemo('cliente')}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 rounded-md hover:from-green-700 hover:to-blue-700 flex items-center justify-center"
                >
                  <span className="mr-2">🏢</span>
                  Cliente - Sistema Básico
                </button>
              </div>
            )}
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
