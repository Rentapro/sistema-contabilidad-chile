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
  RefreshCw
} from 'lucide-react';

interface CompanyConfiguration {
  id: string;
  name: string;
  rut: string;
  plan: string;
  status: 'active' | 'suspended' | 'trial' | 'inactive';
  configuration: {
    general: {
      timezone: string;
      language: string;
      currency: string;
      fiscalYear: string;
      logo?: string;
      theme: string;
    };
    limits: {
      maxUsers: number;
      maxInvoices: number;
      maxStorage: number; // GB
      maxApiCalls: number;
      retentionDays: number;
    };
    features: {
      advancedReports: boolean;
      aiIntegration: boolean;
      multiCompany: boolean;
      bankIntegration: boolean;
      emailNotifications: boolean;
      smsNotifications: boolean;
      apiAccess: boolean;
      whiteLabel: boolean;
    };
    security: {
      twoFactorAuth: boolean;
      sessionTimeout: number; // minutes
      passwordPolicy: string;
      ipWhitelist: string[];
      auditLog: boolean;
      dataEncryption: boolean;
    };
    integrations: {
      sii: {
        enabled: boolean;
        certificateFile?: string;
        environment: 'certificacion' | 'produccion';
      };
      banks: {
        enabled: boolean;
        providers: string[];
      };
      accounting: {
        enabled: boolean;
        system: string;
      };
      crm: {
        enabled: boolean;
        provider: string;
      };
    };
    automation: {
      autoBackup: boolean;
      backupFrequency: 'daily' | 'weekly' | 'monthly';
      autoInvoicing: boolean;
      reminderEmails: boolean;
      reportGeneration: boolean;
    };
  };
  usage: {
    currentUsers: number;
    currentInvoices: number;
    currentStorage: number;
    currentApiCalls: number;
  };
  createdAt: Date;
  lastModified: Date;
  modifiedBy: string;
}

const mockCompanies: CompanyConfiguration[] = [
  {
    id: '1',
    name: 'Constructora Capiza Pallar',
    rut: '12.345.678-9',
    plan: 'enterprise',
    status: 'active',
    configuration: {
      general: {
        timezone: 'America/Santiago',
        language: 'es',
        currency: 'CLP',
        fiscalYear: '2024',
        theme: 'light'
      },
      limits: {
        maxUsers: 50,
        maxInvoices: 1000,
        maxStorage: 100,
        maxApiCalls: 10000,
        retentionDays: 2555
      },
      features: {
        advancedReports: true,
        aiIntegration: true,
        multiCompany: true,
        bankIntegration: true,
        emailNotifications: true,
        smsNotifications: true,
        apiAccess: true,
        whiteLabel: true
      },
      security: {
        twoFactorAuth: true,
        sessionTimeout: 480,
        passwordPolicy: 'strong',
        ipWhitelist: ['192.168.1.0/24'],
        auditLog: true,
        dataEncryption: true
      },
      integrations: {
        sii: {
          enabled: true,
          environment: 'produccion'
        },
        banks: {
          enabled: true,
          providers: ['BancoChile', 'BCI']
        },
        accounting: {
          enabled: true,
          system: 'custom'
        },
        crm: {
          enabled: false,
          provider: ''
        }
      },
      automation: {
        autoBackup: true,
        backupFrequency: 'daily',
        autoInvoicing: true,
        reminderEmails: true,
        reportGeneration: true
      }
    },
    usage: {
      currentUsers: 25,
      currentInvoices: 456,
      currentStorage: 45.6,
      currentApiCalls: 5678
    },
    createdAt: new Date('2024-01-15'),
    lastModified: new Date(),
    modifiedBy: 'SuperAdmin'
  },
  {
    id: '2',
    name: 'Consultora ABC Ltda',
    rut: '98.765.432-1',
    plan: 'professional',
    status: 'active',
    configuration: {
      general: {
        timezone: 'America/Santiago',
        language: 'es',
        currency: 'CLP',
        fiscalYear: '2024',
        theme: 'dark'
      },
      limits: {
        maxUsers: 20,
        maxInvoices: 500,
        maxStorage: 50,
        maxApiCalls: 5000,
        retentionDays: 1825
      },
      features: {
        advancedReports: true,
        aiIntegration: false,
        multiCompany: false,
        bankIntegration: true,
        emailNotifications: true,
        smsNotifications: false,
        apiAccess: true,
        whiteLabel: false
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 240,
        passwordPolicy: 'medium',
        ipWhitelist: [],
        auditLog: true,
        dataEncryption: true
      },
      integrations: {
        sii: {
          enabled: true,
          environment: 'certificacion'
        },
        banks: {
          enabled: false,
          providers: []
        },
        accounting: {
          enabled: false,
          system: ''
        },
        crm: {
          enabled: false,
          provider: ''
        }
      },
      automation: {
        autoBackup: true,
        backupFrequency: 'weekly',
        autoInvoicing: false,
        reminderEmails: true,
        reportGeneration: false
      }
    },
    usage: {
      currentUsers: 8,
      currentInvoices: 123,
      currentStorage: 12.3,
      currentApiCalls: 1234
    },
    createdAt: new Date('2024-02-01'),
    lastModified: new Date(Date.now() - 86400000),
    modifiedBy: 'Admin Empresa'
  }
];

export function CompanyConfigurationManager() {
  const [companies, setCompanies] = useState<CompanyConfiguration[]>(mockCompanies);
  const [selectedCompany, setSelectedCompany] = useState<string>(companies[0].id);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const currentCompany = companies.find(c => c.id === selectedCompany);

  const handleSaveConfiguration = () => {
    setEditMode(false);
    // Aquí se guardarían los cambios
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'trial': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'professional': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'standard': return 'bg-green-100 text-green-800 border-green-200';
      case 'basic': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUsagePercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const filteredCompanies = companies.filter(company => {
    if (searchTerm && !company.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !company.rut.includes(searchTerm)) {
      return false;
    }
    if (filterStatus !== 'all' && company.status !== filterStatus) {
      return false;
    }
    return true;
  });

  if (!currentCompany) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Configuración de Empresas</h2>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Empresa
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar Config
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Config
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Lista de Empresas */}
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Empresas Registradas</CardTitle>
              <div className="space-y-3">
                <Input
                  placeholder="Buscar empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="trial">Prueba</SelectItem>
                    <SelectItem value="suspended">Suspendido</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCompany === company.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCompany(company.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{company.name}</h4>
                      <Badge className={getStatusColor(company.status)}>
                        {company.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{company.rut}</span>
                      <Badge className={getPlanColor(company.plan)}>
                        {company.plan}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Usuarios: {company.usage.currentUsers}/{company.configuration.limits.maxUsers}</span>
                        <span>Facturas: {company.usage.currentInvoices}/{company.configuration.limits.maxInvoices}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuración Detallada */}
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{currentCompany.name}</span>
                    <Badge className={getStatusColor(currentCompany.status)}>
                      {currentCompany.status}
                    </Badge>
                    <Badge className={getPlanColor(currentCompany.plan)}>
                      {currentCompany.plan}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    RUT: {currentCompany.rut} | Modificado: {currentCompany.lastModified.toLocaleDateString()} por {currentCompany.modifiedBy}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={editMode ? "default" : "outline"}
                    onClick={() => editMode ? handleSaveConfiguration() : setEditMode(true)}
                  >
                    {editMode ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Guardar
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="limits">Límites</TabsTrigger>
                  <TabsTrigger value="features">Funciones</TabsTrigger>
                  <TabsTrigger value="security">Seguridad</TabsTrigger>
                  <TabsTrigger value="integrations">Integraciones</TabsTrigger>
                  <TabsTrigger value="automation">Automatización</TabsTrigger>
                </TabsList>

                {/* Configuración General */}
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Zona Horaria</Label>
                      <Select 
                        value={currentCompany.configuration.general.timezone}
                        disabled={!editMode}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Santiago">Santiago (GMT-3)</SelectItem>
                          <SelectItem value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                          <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Idioma</Label>
                      <Select 
                        value={currentCompany.configuration.general.language}
                        disabled={!editMode}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Moneda</Label>
                      <Select 
                        value={currentCompany.configuration.general.currency}
                        disabled={!editMode}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CLP">Peso Chileno (CLP)</SelectItem>
                          <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Año Fiscal</Label>
                      <Input
                        value={currentCompany.configuration.general.fiscalYear}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tema</Label>
                      <Select 
                        value={currentCompany.configuration.general.theme}
                        disabled={!editMode}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Oscuro</SelectItem>
                          <SelectItem value="auto">Automático</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Logo de la Empresa</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept="image/*"
                          disabled={!editMode}
                          className="flex-1"
                        />
                        {editMode && (
                          <Button size="sm" variant="outline">
                            <Upload className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Límites y Uso */}
                <TabsContent value="limits" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Usuarios */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Máximo de Usuarios</Label>
                        <span className="text-sm text-gray-600">
                          {currentCompany.usage.currentUsers} / {currentCompany.configuration.limits.maxUsers}
                        </span>
                      </div>
                      <Input
                        type="number"
                        value={currentCompany.configuration.limits.maxUsers}
                        disabled={!editMode}
                      />
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${getUsagePercentage(currentCompany.usage.currentUsers, currentCompany.configuration.limits.maxUsers)}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Facturas */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Máximo de Facturas/Mes</Label>
                        <span className="text-sm text-gray-600">
                          {currentCompany.usage.currentInvoices} / {currentCompany.configuration.limits.maxInvoices}
                        </span>
                      </div>
                      <Input
                        type="number"
                        value={currentCompany.configuration.limits.maxInvoices}
                        disabled={!editMode}
                      />
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ 
                            width: `${getUsagePercentage(currentCompany.usage.currentInvoices, currentCompany.configuration.limits.maxInvoices)}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Almacenamiento */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Almacenamiento (GB)</Label>
                        <span className="text-sm text-gray-600">
                          {currentCompany.usage.currentStorage} / {currentCompany.configuration.limits.maxStorage} GB
                        </span>
                      </div>
                      <Input
                        type="number"
                        value={currentCompany.configuration.limits.maxStorage}
                        disabled={!editMode}
                      />
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{ 
                            width: `${getUsagePercentage(currentCompany.usage.currentStorage, currentCompany.configuration.limits.maxStorage)}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* API Calls */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Llamadas API/Mes</Label>
                        <span className="text-sm text-gray-600">
                          {currentCompany.usage.currentApiCalls} / {currentCompany.configuration.limits.maxApiCalls}
                        </span>
                      </div>
                      <Input
                        type="number"
                        value={currentCompany.configuration.limits.maxApiCalls}
                        disabled={!editMode}
                      />
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ 
                            width: `${getUsagePercentage(currentCompany.usage.currentApiCalls, currentCompany.configuration.limits.maxApiCalls)}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Retención de Datos */}
                    <div className="space-y-3 col-span-2">
                      <Label>Días de Retención de Datos</Label>
                      <Input
                        type="number"
                        value={currentCompany.configuration.limits.retentionDays}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Funciones Habilitadas */}
                <TabsContent value="features" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(currentCompany.configuration.features).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {key === 'advancedReports' && 'Reportes avanzados y analytics'}
                            {key === 'aiIntegration' && 'Integración con IA'}
                            {key === 'multiCompany' && 'Gestión multi-empresa'}
                            {key === 'bankIntegration' && 'Integración bancaria'}
                            {key === 'emailNotifications' && 'Notificaciones por email'}
                            {key === 'smsNotifications' && 'Notificaciones por SMS'}
                            {key === 'apiAccess' && 'Acceso a API'}
                            {key === 'whiteLabel' && 'Marca blanca'}
                          </p>
                        </div>
                        <Switch checked={enabled} disabled={!editMode} />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Seguridad */}
                <TabsContent value="security" className="space-y-4">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Autenticación de Dos Factores</h4>
                          <p className="text-sm text-gray-600">Requiere verificación adicional</p>
                        </div>
                        <Switch 
                          checked={currentCompany.configuration.security.twoFactorAuth} 
                          disabled={!editMode} 
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Log de Auditoría</h4>
                          <p className="text-sm text-gray-600">Registro de todas las acciones</p>
                        </div>
                        <Switch 
                          checked={currentCompany.configuration.security.auditLog} 
                          disabled={!editMode} 
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Encriptación de Datos</h4>
                          <p className="text-sm text-gray-600">Datos encriptados en reposo</p>
                        </div>
                        <Switch 
                          checked={currentCompany.configuration.security.dataEncryption} 
                          disabled={!editMode} 
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Tiempo de Sesión (minutos)</Label>
                        <Input
                          type="number"
                          value={currentCompany.configuration.security.sessionTimeout}
                          disabled={!editMode}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Política de Contraseñas</Label>
                      <Select 
                        value={currentCompany.configuration.security.passwordPolicy}
                        disabled={!editMode}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weak">Débil</SelectItem>
                          <SelectItem value="medium">Media</SelectItem>
                          <SelectItem value="strong">Fuerte</SelectItem>
                          <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>IPs Permitidas (una por línea)</Label>
                      <Textarea
                        value={currentCompany.configuration.security.ipWhitelist.join('\n')}
                        disabled={!editMode}
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Integraciones */}
                <TabsContent value="integrations" className="space-y-4">
                  <div className="space-y-6">
                    {/* SII Integration */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h4 className="font-medium">Servicio de Impuestos Internos (SII)</h4>
                        </div>
                        <Switch 
                          checked={currentCompany.configuration.integrations.sii.enabled} 
                          disabled={!editMode} 
                        />
                      </div>
                      {currentCompany.configuration.integrations.sii.enabled && (
                        <div className="space-y-3 mt-3">
                          <div className="space-y-2">
                            <Label>Ambiente</Label>
                            <Select 
                              value={currentCompany.configuration.integrations.sii.environment}
                              disabled={!editMode}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="certificacion">Certificación</SelectItem>
                                <SelectItem value="produccion">Producción</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Certificado Digital</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="file"
                                accept=".p12,.pfx"
                                disabled={!editMode}
                                className="flex-1"
                              />
                              {editMode && (
                                <Button size="sm" variant="outline">
                                  <Upload className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bank Integration */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <h4 className="font-medium">Integración Bancaria</h4>
                        </div>
                        <Switch 
                          checked={currentCompany.configuration.integrations.banks.enabled} 
                          disabled={!editMode} 
                        />
                      </div>
                      {currentCompany.configuration.integrations.banks.enabled && (
                        <div className="space-y-3 mt-3">
                          <Label>Bancos Conectados</Label>
                          <div className="flex flex-wrap gap-2">
                            {currentCompany.configuration.integrations.banks.providers.map((bank, index) => (
                              <Badge key={index} variant="outline">{bank}</Badge>
                            ))}
                          </div>
                          {editMode && (
                            <Button size="sm" variant="outline">
                              <Plus className="w-4 h-4 mr-2" />
                              Agregar Banco
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CRM Integration */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-purple-600" />
                          <h4 className="font-medium">Sistema CRM</h4>
                        </div>
                        <Switch 
                          checked={currentCompany.configuration.integrations.crm.enabled} 
                          disabled={!editMode} 
                        />
                      </div>
                      {currentCompany.configuration.integrations.crm.enabled && (
                        <div className="space-y-3 mt-3">
                          <div className="space-y-2">
                            <Label>Proveedor CRM</Label>
                            <Select 
                              value={currentCompany.configuration.integrations.crm.provider}
                              disabled={!editMode}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar proveedor" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="salesforce">Salesforce</SelectItem>
                                <SelectItem value="hubspot">HubSpot</SelectItem>
                                <SelectItem value="pipedrive">Pipedrive</SelectItem>
                                <SelectItem value="custom">Personalizado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Automatización */}
                <TabsContent value="automation" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Respaldo Automático</h4>
                        <p className="text-sm text-gray-600">Respaldos programados</p>
                      </div>
                      <Switch 
                        checked={currentCompany.configuration.automation.autoBackup} 
                        disabled={!editMode} 
                      />
                    </div>

                    {currentCompany.configuration.automation.autoBackup && (
                      <div className="space-y-2">
                        <Label>Frecuencia de Respaldo</Label>
                        <Select 
                          value={currentCompany.configuration.automation.backupFrequency}
                          disabled={!editMode}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Diario</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Facturación Automática</h4>
                        <p className="text-sm text-gray-600">Facturas recurrentes</p>
                      </div>
                      <Switch 
                        checked={currentCompany.configuration.automation.autoInvoicing} 
                        disabled={!editMode} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Emails de Recordatorio</h4>
                        <p className="text-sm text-gray-600">Recordatorios automáticos</p>
                      </div>
                      <Switch 
                        checked={currentCompany.configuration.automation.reminderEmails} 
                        disabled={!editMode} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Generación de Reportes</h4>
                        <p className="text-sm text-gray-600">Reportes programados</p>
                      </div>
                      <Switch 
                        checked={currentCompany.configuration.automation.reportGeneration} 
                        disabled={!editMode} 
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
