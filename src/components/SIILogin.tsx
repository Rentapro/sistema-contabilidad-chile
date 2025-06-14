'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Upload, 
  Check, 
  AlertCircle,
  Info,
  Settings,
  LogOut
} from 'lucide-react';
import siiCredentialsService, { SIILoginForm, SIISession } from '@/services/siiCredentialsService';
import { formatRUT, validateRUT } from '@/lib/utils';

interface SIILoginProps {
  onSuccess?: (session: SIISession) => void;
  onError?: (error: string) => void;
}

export default function SIILogin({ onSuccess, onError }: SIILoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [session, setSession] = useState<SIISession | null>(null);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);

  const [formData, setFormData] = useState<SIILoginForm>({
    rutEmpresa: '',
    rutUsuario: '',
    claveUsuario: '',
    certificadoDigital: undefined,
    pinCertificado: '',
    ambiente: 'certificacion',
    recordarCredenciales: false
  });

  useEffect(() => {
    checkCurrentSession();
    checkStoredCredentials();
  }, []);

  const checkCurrentSession = () => {
    const currentSession = siiCredentialsService.getCurrentSession();
    if (currentSession) {
      setSession(currentSession);
      setSuccess(`Conectado como ${currentSession.rutUsuario} - ${currentSession.ambiente}`);
    }
  };

  const checkStoredCredentials = async () => {
    const config = siiCredentialsService.getSIIConfig();
    setHasStoredCredentials(config.hasStoredCredentials);
    
    if (config.hasStoredCredentials) {
      const savedCredentials = await siiCredentialsService.getSavedCredentials();
      if (savedCredentials) {
        setFormData(prev => ({
          ...prev,
          rutEmpresa: savedCredentials.rutEmpresa,
          rutUsuario: savedCredentials.rutUsuario,
          ambiente: savedCredentials.ambiente,
          recordarCredenciales: true
        }));
      }
    }
  };

  const handleInputChange = (field: keyof SIILoginForm, value: string | boolean | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar errores al escribir
    if (error) setError('');
  };

  const handleRUTChange = (field: 'rutEmpresa' | 'rutUsuario', value: string) => {
    // Auto-formatear RUT mientras se escribe
    const formattedRUT = formatRUT(value);
    handleInputChange(field, formattedRUT);
  };

  const validateForm = (): string | null => {
    if (!formData.rutEmpresa || !validateRUT(formData.rutEmpresa)) {
      return 'RUT de empresa inválido';
    }
    
    if (!formData.rutUsuario || !validateRUT(formData.rutUsuario)) {
      return 'RUT de usuario inválido';
    }
    
    if (!formData.claveUsuario || formData.claveUsuario.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return null;
  };

  const handleLogin = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await siiCredentialsService.authenticateWithSII(formData);
      
      if (result.success && result.session) {
        setSession(result.session);
        setSuccess(`¡Conectado exitosamente! Usuario: ${result.session.rutUsuario}`);
        
        // Callback de éxito
        if (onSuccess) {
          onSuccess(result.session);
        }
        
        // Limpiar contraseña del formulario por seguridad
        setFormData(prev => ({ ...prev, claveUsuario: '' }));
        
      } else {
        setError(result.error || 'Error de autenticación');
        if (onError) {
          onError(result.error || 'Error de autenticación');
        }
      }
    } catch (error) {
      const errorMessage = 'Error interno del sistema';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    siiCredentialsService.logout();
    setSession(null);
    setSuccess('');
    setError('');
    setFormData(prev => ({ ...prev, claveUsuario: '' }));
  };

  const handleClearCredentials = async () => {
    await siiCredentialsService.clearSavedCredentials();
    setHasStoredCredentials(false);
    setFormData({
      rutEmpresa: '',
      rutUsuario: '',
      claveUsuario: '',
      certificadoDigital: undefined,
      pinCertificado: '',
      ambiente: 'certificacion',
      recordarCredenciales: false
    });
    setSuccess('Credenciales eliminadas');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.p12') || file.name.endsWith('.pfx')) {
        setFormData(prev => ({ ...prev, certificadoDigital: file }));
      } else {
        setError('Por favor sube un archivo de certificado válido (.p12 o .pfx)');
      }
    }
  };

  // Si ya está autenticado, mostrar panel de sesión activa
  if (session?.isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Sesión SII Activa
          </CardTitle>
          <CardDescription>
            Conectado al Servicio de Impuestos Internos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Usuario:</span>
              <Badge variant="outline">{session.rutUsuario}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Empresa:</span>
              <Badge variant="outline">{session.rutEmpresa}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ambiente:</span>
              <Badge variant={session.ambiente === 'produccion' ? 'default' : 'secondary'}>
                {session.ambiente}
              </Badge>
            </div>
            {session.expiresAt && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Expira:</span>
                <span className="text-sm">{session.expiresAt.toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex-1"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
            
            {hasStoredCredentials && (
              <Button 
                onClick={handleClearCredentials}
                variant="ghost"
                size="sm"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Formulario de login
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Iniciar Sesión SII
        </CardTitle>
        <CardDescription>
          Conecta con tus credenciales del Servicio de Impuestos Internos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasStoredCredentials && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Se encontraron credenciales guardadas. Solo ingresa tu contraseña.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rutEmpresa">RUT Empresa</Label>
            <Input
              id="rutEmpresa"
              type="text"
              placeholder="12.345.678-9"
              value={formData.rutEmpresa}
              onChange={(e) => handleRUTChange('rutEmpresa', e.target.value)}
              maxLength={12}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rutUsuario">RUT Usuario</Label>
            <Input
              id="rutUsuario"
              type="text"
              placeholder="11.111.111-1"
              value={formData.rutUsuario}
              onChange={(e) => handleRUTChange('rutUsuario', e.target.value)}
              maxLength={12}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="claveUsuario">Contraseña</Label>
            <div className="relative">
              <Input
                id="claveUsuario"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña del SII"
                value={formData.claveUsuario}
                onChange={(e) => handleInputChange('claveUsuario', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ambiente">Ambiente</Label>
            <Select
              value={formData.ambiente}
              onValueChange={(value: 'certificacion' | 'produccion') => 
                handleInputChange('ambiente', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="certificacion">Certificación (Pruebas)</SelectItem>
                <SelectItem value="produccion">Producción</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificado">Certificado Digital (Opcional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="certificado"
                type="file"
                accept=".p12,.pfx"
                onChange={handleFileUpload}
                className="file:mr-2 file:px-2 file:py-1 file:border-0 file:bg-gray-100 file:text-sm"
              />
              <Upload className="h-4 w-4 text-gray-400" />
            </div>
            {formData.certificadoDigital && (
              <p className="text-sm text-green-600">
                ✓ Certificado cargado: {(formData.certificadoDigital as File).name}
              </p>
            )}
          </div>

          {formData.certificadoDigital && (
            <div className="space-y-2">
              <Label htmlFor="pinCertificado">PIN del Certificado</Label>
              <Input
                id="pinCertificado"
                type="password"
                placeholder="PIN del certificado digital"
                value={formData.pinCertificado}
                onChange={(e) => handleInputChange('pinCertificado', e.target.value)}
              />
            </div>
          )}          <div className="flex items-center space-x-2">
            <Checkbox
              id="recordarCredenciales"
              checked={formData.recordarCredenciales}
              onChange={(e) => 
                handleInputChange('recordarCredenciales', e.target.checked)
              }
            />
            <Label htmlFor="recordarCredenciales" className="text-sm">
              Recordar credenciales (seguro)
            </Label>
          </div>

          <Button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Conectando...
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </>
            )}
          </Button>

          {hasStoredCredentials && (
            <Button 
              onClick={handleClearCredentials}
              variant="ghost"
              className="w-full text-sm"
            >
              Eliminar credenciales guardadas
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
