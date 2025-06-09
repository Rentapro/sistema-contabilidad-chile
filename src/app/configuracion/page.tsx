"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Settings, 
  Database, 
  Shield, 
  Palette, 
  Bell,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  Check,
  Server,
  Key,
  Globe,
  Monitor,
  Moon,
  Sun
} from 'lucide-react'

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('general')
  const [configurations, setConfigurations] = useState({
    empresa: {
      nombre: 'Contabilidad Profesional S.A.',
      rfc: 'CPS123456789',
      direccion: 'Av. Principal 123, Ciudad de México',
      telefono: '+52 55 1234 5678',
      email: 'info@contabilidadpro.mx',
      website: 'www.contabilidadpro.mx'
    },
    sistema: {
      idioma: 'es',
      zona_horaria: 'America/Mexico_City',
      formato_fecha: 'dd/mm/yyyy',
      formato_moneda: 'MXN',
      tema: 'light'
    },
    notificaciones: {
      email: true,
      push: true,
      sms: false,
      recordatorios: true,
      reportes: true
    },
    seguridad: {
      autenticacion_2fa: true,
      sesion_expira: 120,
      intentos_login: 3,
      bloqueo_temporal: 15
    },
    integraciones: {
      sat: true,
      banco_central: false,
      sii: true,
      api_externa: false
    }
  })

  const [backups] = useState([
    { 
      id: 1, 
      fecha: '2024-12-08 14:30', 
      tipo: 'Automático', 
      tamaño: '2.4 GB', 
      estado: 'Completado',
      descripcion: 'Backup diario automático'
    },
    { 
      id: 2, 
      fecha: '2024-12-07 14:30', 
      tipo: 'Automático', 
      tamaño: '2.3 GB', 
      estado: 'Completado',
      descripcion: 'Backup diario automático'
    },
    { 
      id: 3, 
      fecha: '2024-12-06 14:30', 
      tipo: 'Manual', 
      tamaño: '2.3 GB', 
      estado: 'Completado',
      descripcion: 'Backup antes de actualización'
    }
  ])

  const [usuarios] = useState([
    {
      id: 1,
      nombre: 'Ana García',
      email: 'ana@contabilidad.mx',
      rol: 'Administrador',
      estado: 'Activo',
      ultimo_acceso: '2024-12-08 09:15'
    },
    {
      id: 2,
      nombre: 'Carlos Mendoza',
      email: 'carlos@contabilidad.mx',
      rol: 'Contador Senior',
      estado: 'Activo',
      ultimo_acceso: '2024-12-08 10:45'
    },
    {
      id: 3,
      nombre: 'María López',
      email: 'maria@contabilidad.mx',
      rol: 'Asistente',
      estado: 'Inactivo',
      ultimo_acceso: '2024-12-05 16:30'
    }
  ])

  const updateConfiguration = (section: string, key: string, value: string | number | boolean) => {
    setConfigurations(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Completado':
      case 'Activo':
        return 'bg-green-100 text-green-800'
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800'
      case 'Error':
      case 'Inactivo':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-2">
            Administra todas las configuraciones y parámetros del sistema
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Config
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar Config
          </Button>
        </div>
      </div>

      {/* Estado del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estado del Sistema</p>
                <p className="text-2xl font-bold text-green-600">Operativo</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Base de Datos</p>
                <p className="text-2xl font-bold text-blue-600">98.5%</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-purple-600">147</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Monitor className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Último Backup</p>
                <p className="text-sm font-bold text-orange-600">Hoy 14:30</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas de Configuración */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="empresa" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="integraciones" className="flex items-center">
            <Cloud className="h-4 w-4 mr-2" />
            Integraciones
          </TabsTrigger>
          <TabsTrigger value="backups" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Backups
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center">
            <Monitor className="h-4 w-4 mr-2" />
            Usuarios
          </TabsTrigger>
        </TabsList>

        {/* Configuración General */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configuración Regional
                </CardTitle>
                <CardDescription>
                  Configuraciones de idioma, zona horaria y formatos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Idioma del Sistema</label>
                  <Select 
                    value={configurations.sistema.idioma} 
                    onValueChange={(value) => updateConfiguration('sistema', 'idioma', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español (México)</SelectItem>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="pt">Português (Brasil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Zona Horaria</label>
                  <Select 
                    value={configurations.sistema.zona_horaria}
                    onValueChange={(value) => updateConfiguration('sistema', 'zona_horaria', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Mexico_City">México (GMT-6)</SelectItem>
                      <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Los Ángeles (GMT-8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Formato de Fecha</label>
                  <Select 
                    value={configurations.sistema.formato_fecha}
                    onValueChange={(value) => updateConfiguration('sistema', 'formato_fecha', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Moneda Principal</label>
                  <Select 
                    value={configurations.sistema.formato_moneda}
                    onValueChange={(value) => updateConfiguration('sistema', 'formato_moneda', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Apariencia y Tema
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tema del Sistema</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${
                        configurations.sistema.tema === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => updateConfiguration('sistema', 'tema', 'light')}
                    >
                      <Sun className="h-6 w-6 mb-2" />
                      <span className="text-sm">Claro</span>
                    </div>
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${
                        configurations.sistema.tema === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => updateConfiguration('sistema', 'tema', 'dark')}
                    >
                      <Moon className="h-6 w-6 mb-2" />
                      <span className="text-sm">Oscuro</span>
                    </div>
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${
                        configurations.sistema.tema === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => updateConfiguration('sistema', 'tema', 'auto')}
                    >
                      <Monitor className="h-6 w-6 mb-2" />
                      <span className="text-sm">Auto</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Densidad de Interfaz</label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar densidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compacto">Compacto</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="espacioso">Espacioso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración de Empresa */}
        <TabsContent value="empresa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Información de la Empresa
              </CardTitle>
              <CardDescription>
                Datos principales de tu organización
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre de la Empresa</label>
                  <Input 
                    value={configurations.empresa.nombre}
                    onChange={(e) => updateConfiguration('empresa', 'nombre', e.target.value)}
                    placeholder="Nombre de la empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">RFC</label>
                  <Input 
                    value={configurations.empresa.rfc}
                    onChange={(e) => updateConfiguration('empresa', 'rfc', e.target.value)}
                    placeholder="RFC de la empresa"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Dirección</label>
                  <Textarea 
                    value={configurations.empresa.direccion}
                    onChange={(e) => updateConfiguration('empresa', 'direccion', e.target.value)}
                    placeholder="Dirección completa"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono</label>
                  <Input 
                    value={configurations.empresa.telefono}
                    onChange={(e) => updateConfiguration('empresa', 'telefono', e.target.value)}
                    placeholder="Teléfono de contacto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input 
                    type="email"
                    value={configurations.empresa.email}
                    onChange={(e) => updateConfiguration('empresa', 'email', e.target.value)}
                    placeholder="Email de contacto"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Sitio Web</label>
                  <Input 
                    value={configurations.empresa.website}
                    onChange={(e) => updateConfiguration('empresa', 'website', e.target.value)}
                    placeholder="www.ejemplo.com"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Check className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Seguridad */}
        <TabsContent value="seguridad" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Autenticación y Acceso
                </CardTitle>
                <CardDescription>
                  Configuraciones de seguridad del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticación de Dos Factores</p>
                    <p className="text-sm text-gray-600">Requiere verificación adicional</p>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      configurations.seguridad.autenticacion_2fa ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    onClick={() => updateConfiguration('seguridad', 'autenticacion_2fa', !configurations.seguridad.autenticacion_2fa)}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        configurations.seguridad.autenticacion_2fa ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duración de Sesión (minutos)</label>
                  <Input 
                    type="number"
                    value={configurations.seguridad.sesion_expira}
                    onChange={(e) => updateConfiguration('seguridad', 'sesion_expira', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Intentos de Login Permitidos</label>
                  <Input 
                    type="number"
                    value={configurations.seguridad.intentos_login}
                    onChange={(e) => updateConfiguration('seguridad', 'intentos_login', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bloqueo Temporal (minutos)</label>
                  <Input 
                    type="number"
                    value={configurations.seguridad.bloqueo_temporal}
                    onChange={(e) => updateConfiguration('seguridad', 'bloqueo_temporal', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notificaciones de Seguridad
                </CardTitle>
                <CardDescription>
                  Alertas y notificaciones de seguridad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { key: 'login_fallido', label: 'Intentos de login fallidos', desc: 'Notificar intentos no autorizados' },
                    { key: 'acceso_admin', label: 'Acceso de administrador', desc: 'Notificar accesos administrativos' },
                    { key: 'cambio_config', label: 'Cambios de configuración', desc: 'Notificar modificaciones del sistema' },
                    { key: 'backup_fallido', label: 'Fallas en backup', desc: 'Notificar errores en respaldos' }
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{notif.label}</p>
                        <p className="text-sm text-gray-600">{notif.desc}</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integraciones */}
        <TabsContent value="integraciones" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cloud className="h-5 w-5 mr-2" />
                  Integraciones Fiscales
                </CardTitle>
                <CardDescription>
                  Conexiones con entidades fiscales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { 
                      key: 'sat', 
                      label: 'SAT (México)', 
                      desc: 'Sistema de Administración Tributaria',
                      status: configurations.integraciones.sat,
                      icon: Key
                    },
                    { 
                      key: 'sii', 
                      label: 'SII (Chile)', 
                      desc: 'Servicio de Impuestos Internos',
                      status: configurations.integraciones.sii,
                      icon: Globe
                    },
                    { 
                      key: 'banco_central', 
                      label: 'Banco Central', 
                      desc: 'Tipos de cambio oficiales',
                      status: configurations.integraciones.banco_central,
                      icon: Database
                    }
                  ].map((integration) => (
                    <div key={integration.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <integration.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{integration.label}</p>
                          <p className="text-sm text-gray-600">{integration.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={integration.status ? getEstadoColor('Activo') : getEstadoColor('Inactivo')}>
                          {integration.status ? 'Conectado' : 'Desconectado'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {integration.status ? 'Configurar' : 'Conectar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  APIs y Servicios Externos
                </CardTitle>
                <CardDescription>
                  Integraciones con servicios de terceros
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { name: 'API de Facturación Electrónica', status: 'Activo', url: 'https://api.facturacion.mx' },
                    { name: 'Servicio de Email Marketing', status: 'Inactivo', url: 'https://api.mailchimp.com' },
                    { name: 'Integración Bancaria', status: 'Activo', url: 'https://api.banxico.org.mx' },
                    { name: 'Validación de RFC', status: 'Activo', url: 'https://api.sat.gob.mx' }
                  ].map((api, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{api.name}</p>
                        <p className="text-xs text-gray-500">{api.url}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getEstadoColor(api.status)}>
                          {api.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Probar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestión de Backups */}
        <TabsContent value="backups" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Configuración de Backups
                </CardTitle>
                <CardDescription>
                  Automatización de respaldos del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Frecuencia de Backup</label>
                  <Select defaultValue="diario">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cada_6_horas">Cada 6 horas</SelectItem>
                      <SelectItem value="diario">Diario</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hora de Backup</label>
                  <Input type="time" defaultValue="14:30" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Retención (días)</label>
                  <Input type="number" defaultValue="30" />
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Crear Backup Ahora
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Restaurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Backups</CardTitle>
                <CardDescription>
                  Últimos respaldos realizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backups.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{backup.descripcion}</p>
                        <p className="text-sm text-gray-600">{backup.fecha}</p>
                        <p className="text-xs text-gray-500">{backup.tamaño}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getEstadoColor(backup.estado)}>
                          {backup.estado}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestión de Usuarios */}
        <TabsContent value="usuarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Usuarios del Sistema
              </CardTitle>
              <CardDescription>
                Administración de usuarios y permisos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usuarios.map((usuario) => (
                  <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${usuario.email}`} />
                        <AvatarFallback>
                          {usuario.nombre.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{usuario.nombre}</p>
                        <p className="text-sm text-gray-600">{usuario.email}</p>
                        <p className="text-xs text-gray-500">Último acceso: {usuario.ultimo_acceso}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{usuario.rol}</Badge>
                      <Badge className={getEstadoColor(usuario.estado)}>
                        {usuario.estado}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button>
                  Agregar Usuario
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
