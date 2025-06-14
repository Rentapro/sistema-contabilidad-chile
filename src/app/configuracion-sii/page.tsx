'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Settings, 
  Check, 
  X, 
  AlertCircle, 
  Info,
  RefreshCw,
  Key,
  Clock
} from 'lucide-react';
import SIILogin from '@/components/SIILogin';
import { useSIIAuth } from '@/hooks/useSIIAuth';

export default function ConfiguracionSIIPage() {
  const {
    isAuthenticated,
    session,
    hasStoredCredentials,
    currentUser,
    currentEmpresa,
    ambiente,
    timeUntilExpiry,
    logout,
    renewSession,
    clearStoredCredentials
  } = useSIIAuth();

  const handleLoginSuccess = (newSession: any) => {
    console.log('✅ Login SII exitoso:', newSession);
  };

  const handleLoginError = (error: string) => {
    console.error('❌ Error en login SII:', error);
  };

  const handleRenewSession = async () => {
    const success = await renewSession();
    if (success) {
      console.log('✅ Sesión SII renovada');
    } else {
      console.error('❌ Error renovando sesión SII');
    }
  };

  const formatTimeRemaining = (minutes: number | undefined): string => {
    if (!minutes) return 'Desconocido';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          Configuración SII
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona tu conexión con el Servicio de Impuestos Internos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Panel de Estado Actual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Estado de Conexión
            </CardTitle>
            <CardDescription>
              Información actual de tu sesión SII
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estado de Autenticación */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado:</span>
              <Badge variant={isAuthenticated ? 'default' : 'secondary'}>
                {isAuthenticated ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Conectado
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3 mr-1" />
                    Desconectado
                  </>
                )}
              </Badge>
            </div>

            {/* Información del Usuario */}
            {isAuthenticated && currentUser && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Usuario:</span>
                  <Badge variant="outline">{currentUser}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Empresa:</span>
                  <Badge variant="outline">{currentEmpresa}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Ambiente:</span>
                  <Badge variant={ambiente === 'produccion' ? 'default' : 'secondary'}>
                    {ambiente}
                  </Badge>
                </div>

                {timeUntilExpiry !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Expira en:</span>
                    <Badge variant={timeUntilExpiry < 30 ? 'destructive' : 'outline'}>
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeRemaining(timeUntilExpiry)}
                    </Badge>
                  </div>
                )}
              </>
            )}

            {/* Credenciales Guardadas */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Credenciales:</span>
              <Badge variant={hasStoredCredentials ? 'default' : 'secondary'}>
                {hasStoredCredentials ? (
                  <>
                    <Key className="h-3 w-3 mr-1" />
                    Guardadas
                  </>
                ) : (
                  'No guardadas'
                )}
              </Badge>
            </div>

            {/* Botones de Acción */}
            {isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleRenewSession}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renovar
                </Button>
                
                <Button 
                  onClick={logout}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  Desconectar
                </Button>
              </div>
            )}

            {hasStoredCredentials && (
              <Button 
                onClick={clearStoredCredentials}
                variant="ghost"
                size="sm"
                className="w-full mt-2"
              >
                Eliminar credenciales guardadas
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Panel de Login */}
        <div>
          <SIILogin 
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        </div>
      </div>

      {/* Información y Alertas */}
      <div className="mt-6 space-y-4">
        {/* Alerta de Seguridad */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Seguridad:</strong> Tus credenciales son encriptadas y almacenadas de forma segura en tu navegador. 
            Nunca se envían a servidores externos sin encriptación.
          </AlertDescription>
        </Alert>

        {/* Información sobre Ambientes */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Ambientes:</strong> Usa "Certificación" para pruebas y desarrollo. 
            Solo cambia a "Producción" cuando tengas datos reales que procesar.
          </AlertDescription>
        </Alert>

        {/* Advertencia de Expiración */}
        {isAuthenticated && timeUntilExpiry !== undefined && timeUntilExpiry < 30 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Sesión próxima a expirar:</strong> Tu sesión SII expirará en {formatTimeRemaining(timeUntilExpiry)}. 
              Considera renovarla para evitar interrupciones.
            </AlertDescription>
          </Alert>
        )}

        {/* Guía de Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Guía de Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">1. Obtener credenciales SII</h4>
              <p className="text-sm text-gray-600">
                Si no tienes credenciales SII, regístrate en{' '}
                <a href="https://www.sii.cl" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  www.sii.cl
                </a>
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">2. Certificado digital (opcional)</h4>
              <p className="text-sm text-gray-600">
                Para funcionalidades avanzadas, puedes cargar tu certificado digital (.p12 o .pfx)
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">3. Recordar credenciales</h4>
              <p className="text-sm text-gray-600">
                Marca "Recordar credenciales" para no tener que ingresar tus datos cada vez
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
