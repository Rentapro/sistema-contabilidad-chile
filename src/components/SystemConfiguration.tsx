'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/hooks/use-toast';

interface SystemModule {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'integration' | 'automation' | 'reporting' | 'security';
  enabled: boolean;
  version: string;
  dependencies: string[];
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'error' | 'updating';
  icon: string;
}

interface IntegrationConfig {
  id: string;
  name: string;
  service: string;
  type: 'api' | 'database' | 'webhook' | 'file';
  enabled: boolean;
  credentials: Record<string, string>;
  endpoints: string[];
  lastSync: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  icon: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  type: 'authentication' | 'authorization' | 'encryption' | 'audit' | 'backup';
  enabled: boolean;
  rules: Array<{
    rule: string;
    value: any;
    required: boolean;
  }>;
  lastUpdated: string;
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  component: string;
  timestamp: string;
  resolved: boolean;
}

export default function SystemConfiguration() {
  const [modules, setModules] = useState<SystemModule[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [activeTab, setActiveTab] = useState<'modules' | 'integrations' | 'security' | 'alerts'>('modules');
  const [loading, setLoading] = useState(true);
  // const { toast } = useToast();
  const toast = ({ title, description, variant }: any) => {
    console.log('Toast:', { title, description, variant });
  };

  useEffect(() => {
    loadSystemConfiguration();
    const interval = setInterval(checkSystemHealth, 30000); // Verificar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const loadSystemConfiguration = async () => {
    try {
      // Simulación de módulos del sistema
      const mockModules: SystemModule[] = [
        {
          id: 'core-accounting',
          name: 'Motor Contable',
          description: 'Módulo principal de contabilidad y asientos',
          category: 'core',
          enabled: true,
          version: '2.1.0',
          dependencies: ['database', 'security'],
          config: {
            autoBalance: true,
            validateIVA: true,
            multiCurrency: false,
            fiscalYear: 2024
          },
          status: 'active',
          icon: '🧮'
        },
        {
          id: 'sii-integration',
          name: 'Integración SII',
          description: 'Conexión con Servicio de Impuestos Internos',
          category: 'integration',
          enabled: true,
          version: '1.5.2',
          dependencies: ['core-accounting', 'security'],
          config: {
            environment: 'production',
            autoSync: true,
            syncInterval: 3600,
            retryAttempts: 3
          },
          status: 'active',
          icon: '🏛️'
        },
        {
          id: 'ai-automation',
          name: 'Automatización IA',
          description: 'Procesamiento automático con inteligencia artificial',
          category: 'automation',
          enabled: true,
          version: '1.2.0',
          dependencies: ['core-accounting'],
          config: {
            aiProvider: 'groq',
            modelVersion: 'llama3-70b-8192',
            confidenceThreshold: 0.85,
            autoProcess: true
          },
          status: 'active',
          icon: '🤖'
        },
        {
          id: 'advanced-reports',
          name: 'Reportes Avanzados',
          description: 'Generación de reportes ejecutivos y análisis',
          category: 'reporting',
          enabled: true,
          version: '1.3.1',
          dependencies: ['core-accounting'],
          config: {
            templates: 25,
            exportFormats: ['pdf', 'excel', 'csv'],
            scheduledReports: true,
            watermark: true
          },
          status: 'active',
          icon: '📊'
        },
        {
          id: 'backup-system',
          name: 'Sistema de Respaldos',
          description: 'Respaldos automáticos y recuperación de datos',
          category: 'security',
          enabled: true,
          version: '1.1.0',
          dependencies: ['database'],
          config: {
            frequency: 'daily',
            retention: 30,
            compression: true,
            encryption: true
          },
          status: 'active',
          icon: '💾'
        },
        {
          id: 'email-service',
          name: 'Servicio de Email',
          description: 'Envío de correos electrónicos y notificaciones',
          category: 'integration',
          enabled: false,
          version: '1.0.3',
          dependencies: [],
          config: {
            provider: 'smtp',
            ssl: true,
            templates: 12,
            dailyLimit: 1000
          },
          status: 'inactive',
          icon: '📧'
        }
      ];

      // Simulación de integraciones
      const mockIntegrations: IntegrationConfig[] = [
        {
          id: 'sii-dte',
          name: 'SII - Documentos Tributarios',
          service: 'SII Chile',
          type: 'api',
          enabled: true,
          credentials: {
            rut: '76.123.456-7',
            token: '***************',
            environment: 'production'
          },
          endpoints: [
            'https://hercules.sii.cl/CGI_AUT/autenticacion.cgi',
            'https://hercules.sii.cl/cgi_AUT/centralizacion.cgi'
          ],
          lastSync: new Date(Date.now() - 1800000).toLocaleString(),
          status: 'connected',
          icon: '🏛️'
        },
        {
          id: 'banco-chile',
          name: 'Banco de Chile API',
          service: 'Banco de Chile',
          type: 'api',
          enabled: true,
          credentials: {
            clientId: 'BC123456',
            clientSecret: '***************',
            apiKey: '***************'
          },
          endpoints: [
            'https://api.bancochile.cl/v1/accounts',
            'https://api.bancochile.cl/v1/transactions'
          ],
          lastSync: new Date(Date.now() - 900000).toLocaleString(),
          status: 'connected',
          icon: '🏦'
        },
        {
          id: 'groq-ai',
          name: 'Groq AI Service',
          service: 'Groq Cloud',
          type: 'api',
          enabled: true,
          credentials: {
            apiKey: 'gsk_***************',
            model: 'llama3-70b-8192'
          },
          endpoints: [
            'https://api.groq.com/openai/v1/chat/completions'
          ],
          lastSync: new Date(Date.now() - 300000).toLocaleString(),
          status: 'connected',
          icon: '🧠'
        },
        {
          id: 'postgresql',
          name: 'Base de Datos Principal',
          service: 'PostgreSQL',
          type: 'database',
          enabled: true,
          credentials: {
            host: 'localhost',
            port: '5432',
            database: 'contabilidad_chile',
            username: 'admin'
          },
          endpoints: ['postgresql://localhost:5432/contabilidad_chile'],
          lastSync: new Date().toLocaleString(),
          status: 'connected',
          icon: '🗄️'
        }
      ];

      // Simulación de políticas de seguridad
      const mockSecurityPolicies: SecurityPolicy[] = [
        {
          id: 'password-policy',
          name: 'Política de Contraseñas',
          description: 'Requisitos de seguridad para contraseñas de usuario',
          type: 'authentication',
          enabled: true,
          rules: [
            { rule: 'minLength', value: 8, required: true },
            { rule: 'requireUppercase', value: true, required: true },
            { rule: 'requireNumbers', value: true, required: true },
            { rule: 'requireSymbols', value: true, required: false },
            { rule: 'expirationDays', value: 90, required: false }
          ],
          lastUpdated: new Date(Date.now() - 86400000 * 7).toLocaleString()
        },
        {
          id: 'session-policy',
          name: 'Política de Sesiones',
          description: 'Control de sesiones de usuario y timeouts',
          type: 'authentication',
          enabled: true,
          rules: [
            { rule: 'sessionTimeout', value: 3600, required: true },
            { rule: 'maxConcurrentSessions', value: 3, required: true },
            { rule: 'inactivityTimeout', value: 1800, required: true },
            { rule: 'requireReauth', value: true, required: false }
          ],
          lastUpdated: new Date(Date.now() - 86400000 * 3).toLocaleString()
        },
        {
          id: 'data-encryption',
          name: 'Cifrado de Datos',
          description: 'Políticas de cifrado para datos sensibles',
          type: 'encryption',
          enabled: true,
          rules: [
            { rule: 'encryptionAlgorithm', value: 'AES-256', required: true },
            { rule: 'keyRotationDays', value: 30, required: true },
            { rule: 'encryptBackups', value: true, required: true },
            { rule: 'encryptTransit', value: true, required: true }
          ],
          lastUpdated: new Date(Date.now() - 86400000 * 1).toLocaleString()
        },
        {
          id: 'audit-logging',
          name: 'Registro de Auditoría',
          description: 'Políticas de logging y auditoría del sistema',
          type: 'audit',
          enabled: true,
          rules: [
            { rule: 'logLevel', value: 'INFO', required: true },
            { rule: 'retentionDays', value: 365, required: true },
            { rule: 'logUserActions', value: true, required: true },
            { rule: 'logSystemEvents', value: true, required: true }
          ],
          lastUpdated: new Date(Date.now() - 86400000 * 2).toLocaleString()
        }
      ];

      // Simulación de alertas del sistema
      const mockAlerts: SystemAlert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Espacio en Disco Bajo',
          message: 'El disco principal tiene menos del 15% de espacio libre',
          component: 'Sistema',
          timestamp: new Date(Date.now() - 7200000).toLocaleString(),
          resolved: false
        },
        {
          id: '2',
          type: 'info',
          title: 'Actualización Disponible',
          message: 'Nueva versión del módulo SII disponible (v1.5.3)',
          component: 'sii-integration',
          timestamp: new Date(Date.now() - 3600000).toLocaleString(),
          resolved: false
        },
        {
          id: '3',
          type: 'success',
          title: 'Backup Completado',
          message: 'Respaldo automático realizado exitosamente',
          component: 'backup-system',
          timestamp: new Date(Date.now() - 1800000).toLocaleString(),
          resolved: true
        }
      ];

      setModules(mockModules);
      setIntegrations(mockIntegrations);
      setSecurityPolicies(mockSecurityPolicies);
      setSystemAlerts(mockAlerts);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando configuración del sistema:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración del sistema",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const checkSystemHealth = () => {
    // Simulación de verificación de salud del sistema
    const randomAlert = Math.random();
    if (randomAlert > 0.9) {
      const newAlert: SystemAlert = {
        id: Date.now().toString(),
        type: 'info',
        title: 'Verificación de Salud',
        message: 'Sistema funcionando correctamente',
        component: 'Sistema',
        timestamp: new Date().toLocaleString(),
        resolved: false
      };
      setSystemAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    }
  };

  const toggleModule = (moduleId: string) => {
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId 
          ? { 
              ...module, 
              enabled: !module.enabled,
              status: !module.enabled ? 'active' : 'inactive'
            }
          : module
      )
    );
    
    const module = modules.find(m => m.id === moduleId);
    toast({
      title: "Módulo Actualizado",
      description: `${module?.name} ${module?.enabled ? 'deshabilitado' : 'habilitado'}`,
    });
  };

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              enabled: !integration.enabled,
              status: !integration.enabled ? 'connected' : 'disconnected'
            }
          : integration
      )
    );
    
    const integration = integrations.find(i => i.id === integrationId);
    toast({
      title: "Integración Actualizada",
      description: `${integration?.name} ${integration?.enabled ? 'desconectada' : 'conectada'}`,
    });
  };

  const toggleSecurityPolicy = (policyId: string) => {
    setSecurityPolicies(prev => 
      prev.map(policy => 
        policy.id === policyId 
          ? { ...policy, enabled: !policy.enabled }
          : policy
      )
    );
    
    const policy = securityPolicies.find(p => p.id === policyId);
    toast({
      title: "Política Actualizada",
      description: `${policy?.name} ${policy?.enabled ? 'deshabilitada' : 'habilitada'}`,
    });
  };

  const resolveAlert = (alertId: string) => {
    setSystemAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true }
          : alert
      )
    );
    
    toast({
      title: "Alerta Resuelta",
      description: "La alerta ha sido marcada como resuelta",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'integration': return 'bg-green-100 text-green-800';
      case 'automation': return 'bg-purple-100 text-purple-800';
      case 'reporting': return 'bg-orange-100 text-orange-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': 
      case 'connected': return 'bg-green-100 text-green-800';
      case 'inactive': 
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'updating': 
      case 'syncing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Configuración del Sistema</h1>
            <p className="mt-2 text-gray-600">
              Gestión avanzada de módulos, integraciones y políticas de seguridad
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={loadSystemConfiguration}
              variant="outline"
            >
              🔄 Actualizar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              💾 Guardar Cambios
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Módulos Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {modules.filter(m => m.enabled).length}
                </p>
              </div>
              <div className="text-2xl">🔧</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Integraciones</p>
                <p className="text-2xl font-bold text-blue-600">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
              <div className="text-2xl">🔗</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Políticas Activas</p>
                <p className="text-2xl font-bold text-red-600">
                  {securityPolicies.filter(p => p.enabled).length}
                </p>
              </div>
              <div className="text-2xl">🛡️</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">
                  {systemAlerts.filter(a => !a.resolved).length}
                </p>
              </div>
              <div className="text-2xl">⚠️</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'modules', label: 'Módulos', icon: '🔧' },
              { id: 'integrations', label: 'Integraciones', icon: '🔗' },
              { id: 'security', label: 'Seguridad', icon: '🛡️' },
              { id: 'alerts', label: 'Alertas', icon: '⚠️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
                {tab.id === 'alerts' && systemAlerts.filter(a => !a.resolved).length > 0 && (
                  <Badge className="ml-2 bg-red-100 text-red-800">
                    {systemAlerts.filter(a => !a.resolved).length}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido por Tab */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{module.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <CardDescription>v{module.version}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(module.category)}>
                      {module.category}
                    </Badge>
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={() => toggleModule(module.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{module.description}</p>
                
                <div className="mb-4">
                  <Badge className={getStatusColor(module.status)}>
                    {module.status}
                  </Badge>
                </div>

                {module.dependencies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Dependencias:</h4>
                    <div className="flex flex-wrap gap-1">
                      {module.dependencies.map(dep => (
                        <Badge key={dep} variant="outline" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Configuración:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                    {Object.entries(module.config).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">
                          {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    ⚙️ Configurar
                  </Button>
                  <Button size="sm" variant="outline">
                    📋 Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.service}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={() => toggleIntegration(integration.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tipo:</h4>
                    <Badge variant="outline">{integration.type.toUpperCase()}</Badge>
                    
                    <h4 className="font-medium text-gray-900 mb-2 mt-4">Última Sincronización:</h4>
                    <p className="text-sm text-gray-600">{integration.lastSync}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Endpoints:</h4>
                    <div className="space-y-1">
                      {integration.endpoints.map((endpoint, index) => (
                        <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {endpoint}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Credenciales:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                    {Object.entries(integration.credentials).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">
                          {key.toLowerCase().includes('secret') || key.toLowerCase().includes('token') || key.toLowerCase().includes('key')
                            ? '***************'
                            : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    🔄 Sincronizar
                  </Button>
                  <Button size="sm" variant="outline">
                    🧪 Probar Conexión
                  </Button>
                  <Button size="sm" variant="outline">
                    ⚙️ Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          {securityPolicies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{policy.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {policy.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(policy.type)}>
                      {policy.type}
                    </Badge>
                    <Switch
                      checked={policy.enabled}
                      onCheckedChange={() => toggleSecurityPolicy(policy.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Reglas:</h4>
                  <div className="space-y-2">
                    {policy.rules.map((rule, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{rule.rule}:</span>
                          <span className="text-sm text-gray-600">
                            {typeof rule.value === 'boolean' ? (rule.value ? 'Sí' : 'No') : rule.value}
                          </span>
                        </div>
                        <Badge className={rule.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                          {rule.required ? 'Requerido' : 'Opcional'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Última actualización: {policy.lastUpdated}
                  </span>
                  <Button size="sm" variant="outline">
                    ✏️ Editar Policy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {systemAlerts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">✅</div>
                <p className="text-gray-600">No hay alertas del sistema</p>
              </CardContent>
            </Card>
          ) : (
            systemAlerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={`transition-all hover:shadow-lg ${
                  alert.resolved ? 'opacity-60' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {alert.type === 'error' ? '❌' : 
                         alert.type === 'warning' ? '⚠️' : 
                         alert.type === 'success' ? '✅' : '💡'}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <CardDescription>
                          {alert.component} • {alert.timestamp}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getAlertColor(alert.type)}>
                        {alert.type}
                      </Badge>
                      {alert.resolved && (
                        <Badge className="bg-green-100 text-green-800">
                          Resuelto
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{alert.message}</p>
                  
                  {!alert.resolved && (
                    <div className="flex justify-end space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        ✓ Resolver
                      </Button>
                      <Button size="sm" variant="outline">
                        📋 Ver Detalles
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
