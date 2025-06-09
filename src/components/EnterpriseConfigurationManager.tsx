'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Settings, 
  Users, 
  DollarSign, 
  Shield, 
  Database,
  Globe,
  Key,
  Calendar,
  Clock,
  FileText,
  Zap,
  AlertTriangle,
  CheckCircle,
  Upload,
  Download,
  Trash2,
  Edit,
  Plus,
  Copy,
  Archive,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';

interface CompanySettings {
  general: {
    timezone: string;
    language: string;
    currency: string;
    theme: string;
    dateFormat: string;
    businessHours: {
      start: string;
      end: string;
      timezone: string;
    };
  };
  limits: {
    maxUsers: number;
    currentUsers: number;
    maxInvoices: number;
    currentInvoices: number;
    maxStorage: number; // GB
    currentStorage: number; // GB
    maxApiCalls: number;
    currentApiCalls: number;
  };
  features: {
    aiEnabled: boolean;
    multiCompanyEnabled: boolean;
    advancedReports: boolean;
    apiAccess: boolean;
    customBranding: boolean;
    prioritySupport: boolean;
    backupFrequency: string;
    retentionPeriod: number; // days
  };
  security: {
    enforceSSO: boolean;
    require2FA: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    sessionTimeout: number; // minutes
    auditLogEnabled: boolean;
    encryptionEnabled: boolean;
  };
  integrations: {
    sii: {
      enabled: boolean;
      certificateExpiry: string;
      lastSync: string;
    };
    banking: {
      enabled: boolean;
      connectedBanks: string[];
      lastSync: string;
    };
    erp: {
      enabled: boolean;
      type: string;
      lastSync: string;
    };
  };
  automation: {
    autoBackup: boolean;
    autoInvoicing: boolean;
    autoReports: boolean;
    autoNotifications: boolean;
    workflowEnabled: boolean;
  };
}

export function EnterpriseConfigurationManager() {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<CompanySettings>({
    general: {
      timezone: 'America/Santiago',
      language: 'es-CL',
      currency: 'CLP',
      theme: 'system',
      dateFormat: 'DD/MM/YYYY',
      businessHours: {
        start: '09:00',
        end: '18:00',
        timezone: 'America/Santiago'
      }
    },
    limits: {
      maxUsers: 50,
      currentUsers: 12,
      maxInvoices: 10000,
      currentInvoices: 2847,
      maxStorage: 100,
      currentStorage: 24.7,
      maxApiCalls: 100000,
      currentApiCalls: 15689
    },
    features: {
      aiEnabled: true,
      multiCompanyEnabled: false,
      advancedReports: true,
      apiAccess: true,
      customBranding: false,
      prioritySupport: true,
      backupFrequency: 'daily',
      retentionPeriod: 365
    },
    security: {
      enforceSSO: false,
      require2FA: true,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: false
      },
      sessionTimeout: 60,
      auditLogEnabled: true,
      encryptionEnabled: true
    },
    integrations: {
      sii: {
        enabled: true,
        certificateExpiry: '2024-12-31',
        lastSync: '2024-01-15 14:30:00'
      },
      banking: {
        enabled: true,
        connectedBanks: ['Banco de Chile', 'BCI'],
        lastSync: '2024-01-15 08:00:00'
      },
      erp: {
        enabled: false,
        type: '',
        lastSync: ''
      }
    },
    automation: {
      autoBackup: true,
      autoInvoicing: false,
      autoReports: true,
      autoNotifications: true,
      workflowEnabled: true
    }
  });

  // Lista de empresas simulada
  const companies = [
    { id: '1', name: 'Empresa Demo S.A.', rut: '76.123.456-7', plan: 'Premium' },
    { id: '2', name: 'Tech Solutions Ltda.', rut: '77.234.567-8', plan: 'Básico' },
    { id: '3', name: 'Consultora ABC', rut: '78.345.678-9', plan: 'Premium' }
  ];

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Configuración guardada:', settings);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      alert('Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const getUsagePercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Selector de empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Seleccionar Empresa
          </CardTitle>
          <CardDescription>
            Elige la empresa para configurar sus parámetros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Selecciona una empresa..." />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{company.name}</span>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline">{company.rut}</Badge>
                      <Badge variant={company.plan === 'Premium' ? 'default' : 'secondary'}>
                        {company.plan}
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCompany && (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="limits">Límites</TabsTrigger>
            <TabsTrigger value="features">Características</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="integrations">Integraciones</TabsTrigger>
            <TabsTrigger value="automation">Automatización</TabsTrigger>
          </TabsList>

          {/* Configuración General */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración General
                </CardTitle>
                <CardDescription>
                  Parámetros básicos y configuración regional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select 
                      value={settings.general.timezone} 
                      onValueChange={(value) => updateSetting('general.timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Santiago">Chile (Santiago)</SelectItem>
                        <SelectItem value="America/Argentina/Buenos_Aires">Argentina (Buenos Aires)</SelectItem>
                        <SelectItem value="America/Bogota">Colombia (Bogotá)</SelectItem>
                        <SelectItem value="America/Lima">Perú (Lima)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select 
                      value={settings.general.language} 
                      onValueChange={(value) => updateSetting('general.language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es-CL">Español (Chile)</SelectItem>
                        <SelectItem value="es-AR">Español (Argentina)</SelectItem>
                        <SelectItem value="es-CO">Español (Colombia)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Moneda</Label>
                    <Select 
                      value={settings.general.currency} 
                      onValueChange={(value) => updateSetting('general.currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLP">Peso Chileno (CLP)</SelectItem>
                        <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                        <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                        <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <Select 
                      value={settings.general.theme} 
                      onValueChange={(value) => updateSetting('general.theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Horario Comercial</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Hora de Inicio</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={settings.general.businessHours.start}
                        onChange={(e) => updateSetting('general.businessHours.start', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">Hora de Fin</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={settings.general.businessHours.end}
                        onChange={(e) => updateSetting('general.businessHours.end', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Límites de Uso */}
          <TabsContent value="limits">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Límites de Uso
                </CardTitle>
                <CardDescription>
                  Control y monitoreo de límites de plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Usuarios */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Usuarios
                      </Label>
                      <Badge className={getUsageColor(getUsagePercentage(settings.limits.currentUsers, settings.limits.maxUsers))}>
                        {getUsagePercentage(settings.limits.currentUsers, settings.limits.maxUsers)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={settings.limits.maxUsers}
                        onChange={(e) => updateSetting('limits.maxUsers', parseInt(e.target.value))}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">
                        / {settings.limits.currentUsers} en uso
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(getUsagePercentage(settings.limits.currentUsers, settings.limits.maxUsers), 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Facturas */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Facturas Mensuales
                      </Label>
                      <Badge className={getUsageColor(getUsagePercentage(settings.limits.currentInvoices, settings.limits.maxInvoices))}>
                        {getUsagePercentage(settings.limits.currentInvoices, settings.limits.maxInvoices)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={settings.limits.maxInvoices}
                        onChange={(e) => updateSetting('limits.maxInvoices', parseInt(e.target.value))}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">
                        / {settings.limits.currentInvoices.toLocaleString()} emitidas
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(getUsagePercentage(settings.limits.currentInvoices, settings.limits.maxInvoices), 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Almacenamiento */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Almacenamiento (GB)
                      </Label>
                      <Badge className={getUsageColor(getUsagePercentage(settings.limits.currentStorage, settings.limits.maxStorage))}>
                        {getUsagePercentage(settings.limits.currentStorage, settings.limits.maxStorage)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={settings.limits.maxStorage}
                        onChange={(e) => updateSetting('limits.maxStorage', parseInt(e.target.value))}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">
                        / {settings.limits.currentStorage} GB usados
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(getUsagePercentage(settings.limits.currentStorage, settings.limits.maxStorage), 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* API Calls */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Llamadas API Mensuales
                      </Label>
                      <Badge className={getUsageColor(getUsagePercentage(settings.limits.currentApiCalls, settings.limits.maxApiCalls))}>
                        {getUsagePercentage(settings.limits.currentApiCalls, settings.limits.maxApiCalls)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={settings.limits.maxApiCalls}
                        onChange={(e) => updateSetting('limits.maxApiCalls', parseInt(e.target.value))}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">
                        / {settings.limits.currentApiCalls.toLocaleString()} realizadas
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(getUsagePercentage(settings.limits.currentApiCalls, settings.limits.maxApiCalls), 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Características */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Características del Plan
                </CardTitle>
                <CardDescription>
                  Habilitar o deshabilitar funcionalidades según el plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-enabled" className="flex items-center gap-2">
                        <span>🤖</span>
                        Inteligencia Artificial
                      </Label>
                      <Switch
                        id="ai-enabled"
                        checked={settings.features.aiEnabled}
                        onCheckedChange={(checked) => updateSetting('features.aiEnabled', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Procesamiento de documentos con IA, clasificación automática y análisis predictivo
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="multi-company" className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Multi-Empresa
                      </Label>
                      <Switch
                        id="multi-company"
                        checked={settings.features.multiCompanyEnabled}
                        onCheckedChange={(checked) => updateSetting('features.multiCompanyEnabled', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Gestión de múltiples empresas desde una sola cuenta
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="advanced-reports" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Reportes Avanzados
                      </Label>
                      <Switch
                        id="advanced-reports"
                        checked={settings.features.advancedReports}
                        onCheckedChange={(checked) => updateSetting('features.advancedReports', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reportes personalizados, dashboards avanzados y análisis financiero
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="api-access" className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Acceso API
                      </Label>
                      <Switch
                        id="api-access"
                        checked={settings.features.apiAccess}
                        onCheckedChange={(checked) => updateSetting('features.apiAccess', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      API REST para integraciones con sistemas externos
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="custom-branding" className="flex items-center gap-2">
                        <span>🎨</span>
                        Branding Personalizado
                      </Label>
                      <Switch
                        id="custom-branding"
                        checked={settings.features.customBranding}
                        onCheckedChange={(checked) => updateSetting('features.customBranding', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Logo personalizado, colores corporativos y documentos con marca propia
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="priority-support" className="flex items-center gap-2">
                        <span>🏆</span>
                        Soporte Prioritario
                      </Label>
                      <Switch
                        id="priority-support"
                        checked={settings.features.prioritySupport}
                        onCheckedChange={(checked) => updateSetting('features.prioritySupport', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Soporte técnico prioritario y dedicado
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium">Configuración de Respaldos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Frecuencia de Respaldo</Label>
                      <Select 
                        value={settings.features.backupFrequency} 
                        onValueChange={(value) => updateSetting('features.backupFrequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Cada Hora</SelectItem>
                          <SelectItem value="daily">Diario</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retention-period">Período de Retención (días)</Label>
                      <Input
                        id="retention-period"
                        type="number"
                        value={settings.features.retentionPeriod}
                        onChange={(e) => updateSetting('features.retentionPeriod', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seguridad */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>
                  Políticas de seguridad y autenticación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enforce-sso" className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Forzar SSO
                      </Label>
                      <Switch
                        id="enforce-sso"
                        checked={settings.security.enforceSSO}
                        onCheckedChange={(checked) => updateSetting('security.enforceSSO', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Requerir autenticación única para todos los usuarios
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-2fa" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Requerir 2FA
                      </Label>
                      <Switch
                        id="require-2fa"
                        checked={settings.security.require2FA}
                        onCheckedChange={(checked) => updateSetting('security.require2FA', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Autenticación de dos factores obligatoria
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="audit-log" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Log de Auditoría
                      </Label>
                      <Switch
                        id="audit-log"
                        checked={settings.security.auditLogEnabled}
                        onCheckedChange={(checked) => updateSetting('security.auditLogEnabled', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Registro detallado de todas las acciones del sistema
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="encryption" className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Encriptación Avanzada
                      </Label>
                      <Switch
                        id="encryption"
                        checked={settings.security.encryptionEnabled}
                        onCheckedChange={(checked) => updateSetting('security.encryptionEnabled', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Encriptación AES-256 para datos sensibles
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium">Política de Contraseñas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-length">Longitud Mínima</Label>
                      <Input
                        id="min-length"
                        type="number"
                        value={settings.security.passwordPolicy.minLength}
                        onChange={(e) => updateSetting('security.passwordPolicy.minLength', parseInt(e.target.value))}
                        min="6"
                        max="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Timeout de Sesión (minutos)</Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting('security.sessionTimeout', parseInt(e.target.value))}
                        min="5"
                        max="480"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Requerimientos de Contraseña</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="require-uppercase"
                          checked={settings.security.passwordPolicy.requireUppercase}
                          onCheckedChange={(checked) => updateSetting('security.passwordPolicy.requireUppercase', checked)}
                        />
                        <Label htmlFor="require-uppercase">Mayúsculas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="require-numbers"
                          checked={settings.security.passwordPolicy.requireNumbers}
                          onCheckedChange={(checked) => updateSetting('security.passwordPolicy.requireNumbers', checked)}
                        />
                        <Label htmlFor="require-numbers">Números</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="require-symbols"
                          checked={settings.security.passwordPolicy.requireSymbols}
                          onCheckedChange={(checked) => updateSetting('security.passwordPolicy.requireSymbols', checked)}
                        />
                        <Label htmlFor="require-symbols">Símbolos</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integraciones */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Integraciones Externas
                </CardTitle>
                <CardDescription>
                  Conexiones con servicios externos y APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* SII Integration */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <span className="text-lg">🇨🇱</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Servicio de Impuestos Internos (SII)</h4>
                        <p className="text-sm text-muted-foreground">
                          Facturación electrónica y validación tributaria
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={settings.integrations.sii.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {settings.integrations.sii.enabled ? "Conectado" : "Desconectado"}
                      </Badge>
                      <Switch
                        checked={settings.integrations.sii.enabled}
                        onCheckedChange={(checked) => updateSetting('integrations.sii.enabled', checked)}
                      />
                    </div>
                  </div>
                  
                  {settings.integrations.sii.enabled && (
                    <div className="space-y-2 ml-14">
                      <div className="text-sm text-muted-foreground">
                        <strong>Certificado expira:</strong> {settings.integrations.sii.certificateExpiry}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Última sincronización:</strong> {settings.integrations.sii.lastSync}
                      </div>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sincronizar Ahora
                      </Button>
                    </div>
                  )}
                </div>

                {/* Banking Integration */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <span className="text-lg">🏦</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Integración Bancaria</h4>
                        <p className="text-sm text-muted-foreground">
                          Sincronización automática de movimientos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={settings.integrations.banking.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {settings.integrations.banking.enabled ? "Conectado" : "Desconectado"}
                      </Badge>
                      <Switch
                        checked={settings.integrations.banking.enabled}
                        onCheckedChange={(checked) => updateSetting('integrations.banking.enabled', checked)}
                      />
                    </div>
                  </div>
                  
                  {settings.integrations.banking.enabled && (
                    <div className="space-y-2 ml-14">
                      <div className="text-sm text-muted-foreground">
                        <strong>Bancos conectados:</strong> {settings.integrations.banking.connectedBanks.join(', ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Última sincronización:</strong> {settings.integrations.banking.lastSync}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Banco
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sincronizar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ERP Integration */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <span className="text-lg">⚙️</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Sistema ERP</h4>
                        <p className="text-sm text-muted-foreground">
                          Integración con sistemas de gestión empresarial
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={settings.integrations.erp.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {settings.integrations.erp.enabled ? "Conectado" : "Desconectado"}
                      </Badge>
                      <Switch
                        checked={settings.integrations.erp.enabled}
                        onCheckedChange={(checked) => updateSetting('integrations.erp.enabled', checked)}
                      />
                    </div>
                  </div>
                  
                  {settings.integrations.erp.enabled && (
                    <div className="space-y-2 ml-14">
                      <div className="space-y-2">
                        <Label htmlFor="erp-type">Tipo de ERP</Label>
                        <Select 
                          value={settings.integrations.erp.type} 
                          onValueChange={(value) => updateSetting('integrations.erp.type', value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Seleccionar ERP" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sap">SAP</SelectItem>
                            <SelectItem value="oracle">Oracle ERP</SelectItem>
                            <SelectItem value="sage">Sage</SelectItem>
                            <SelectItem value="odoo">Odoo</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automatización */}
          <TabsContent value="automation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Automatización y Workflows
                </CardTitle>
                <CardDescription>
                  Configuración de procesos automáticos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-backup" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Respaldo Automático
                      </Label>
                      <Switch
                        id="auto-backup"
                        checked={settings.automation.autoBackup}
                        onCheckedChange={(checked) => updateSetting('automation.autoBackup', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Respaldos automáticos según la frecuencia configurada
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-invoicing" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Facturación Automática
                      </Label>
                      <Switch
                        id="auto-invoicing"
                        checked={settings.automation.autoInvoicing}
                        onCheckedChange={(checked) => updateSetting('automation.autoInvoicing', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Generación automática de facturas recurrentes
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-reports" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Reportes Automáticos
                      </Label>
                      <Switch
                        id="auto-reports"
                        checked={settings.automation.autoReports}
                        onCheckedChange={(checked) => updateSetting('automation.autoReports', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Generación y envío automático de reportes periódicos
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-notifications" className="flex items-center gap-2">
                        <span>🔔</span>
                        Notificaciones Automáticas
                      </Label>
                      <Switch
                        id="auto-notifications"
                        checked={settings.automation.autoNotifications}
                        onCheckedChange={(checked) => updateSetting('automation.autoNotifications', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Alertas automáticas por vencimientos y eventos importantes
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="workflow-enabled" className="flex items-center gap-2">
                        <span>⚙️</span>
                        Workflows Personalizados
                      </Label>
                      <Switch
                        id="workflow-enabled"
                        checked={settings.automation.workflowEnabled}
                        onCheckedChange={(checked) => updateSetting('automation.workflowEnabled', checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Flujos de trabajo personalizados para procesos empresariales
                    </p>
                  </div>
                </div>

                {settings.automation.workflowEnabled && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium">Workflows Disponibles</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium">Aprobación de Facturas</h5>
                          <p className="text-sm text-muted-foreground">
                            Workflow de aprobación en múltiples niveles para facturas
                          </p>
                        </div>
                        <Badge variant="outline">Activo</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium">Validación de Gastos</h5>
                          <p className="text-sm text-muted-foreground">
                            Validación automática de gastos según políticas empresariales
                          </p>
                        </div>
                        <Badge variant="outline">Configurar</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setSelectedCompany('')}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </>
              )}
            </Button>
          </div>
        </Tabs>
      )}
    </div>
  );
}
