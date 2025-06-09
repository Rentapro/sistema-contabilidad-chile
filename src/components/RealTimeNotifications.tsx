'use client';

import React, { useState, useEffect } from 'react';
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
  Bell, 
  Send, 
  Settings, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Mail,
  Smartphone,
  Globe,
  Archive,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Filter,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  category: string;
  targetUsers: string[];
  targetRoles: string[];
  targetCompanies: string[];
  channels: ('system' | 'email' | 'sms' | 'push')[];
  scheduledAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  createdBy: string;
  readBy: string[];
  actions?: {
    id: string;
    label: string;
    action: string;
    style: 'primary' | 'secondary' | 'destructive';
  }[];
}

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  channels: ('system' | 'email' | 'sms' | 'push')[];
  variables: string[];
}

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: any[];
  actions: any[];
  isActive: boolean;
  targetRoles: string[];
  channels: ('system' | 'email' | 'sms' | 'push')[];
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nuevo cliente registrado',
    message: 'El cliente "Empresa ABC Ltda." ha sido registrado exitosamente en el sistema.',
    type: 'success',
    priority: 'medium',
    status: 'unread',
    category: 'clientes',
    targetUsers: ['admin'],
    targetRoles: ['admin_empresa'],
    targetCompanies: ['all'],
    channels: ['system', 'email'],
    createdAt: new Date(),
    createdBy: 'Sistema',
    readBy: [],
    actions: [
      { id: '1', label: 'Ver Cliente', action: '/clientes/123', style: 'primary' },
      { id: '2', label: 'Enviar Bienvenida', action: 'send_welcome', style: 'secondary' }
    ]
  },
  {
    id: '2',
    title: 'Respaldo programado completado',
    message: 'El respaldo automático del sistema se ha completado exitosamente. Tamaño: 2.4 GB',
    type: 'system',
    priority: 'low',
    status: 'read',
    category: 'sistema',
    targetUsers: ['superadmin'],
    targetRoles: ['superadmin'],
    targetCompanies: ['all'],
    channels: ['system'],
    createdAt: new Date(Date.now() - 3600000),
    createdBy: 'Sistema de Respaldo',
    readBy: ['superadmin']
  },
  {
    id: '3',
    title: 'Límite de plan alcanzado',
    message: 'La empresa "Consultora XYZ" ha alcanzado el 90% de su límite mensual de facturas.',
    type: 'warning',
    priority: 'high',
    status: 'unread',
    category: 'facturacion',
    targetUsers: ['admin'],
    targetRoles: ['superadmin', 'admin_empresa'],
    targetCompanies: ['consultora-xyz'],
    channels: ['system', 'email'],
    createdAt: new Date(Date.now() - 7200000),
    createdBy: 'Monitor de Límites',
    readBy: [],
    actions: [
      { id: '1', label: 'Actualizar Plan', action: '/planes/upgrade', style: 'primary' },
      { id: '2', label: 'Ver Uso', action: '/usage/consultora-xyz', style: 'secondary' }
    ]
  }
];

const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Bienvenida Cliente',
    title: 'Bienvenido a {{company_name}}',
    message: 'Hola {{client_name}}, bienvenido a nuestro sistema de contabilidad. Tu cuenta ha sido creada exitosamente.',
    type: 'info',
    priority: 'medium',
    category: 'clientes',
    channels: ['system', 'email'],
    variables: ['company_name', 'client_name', 'login_url']
  },
  {
    id: '2',
    name: 'Factura Vencida',
    title: 'Factura {{invoice_number}} vencida',
    message: 'La factura {{invoice_number}} por ${{amount}} ha vencido. Fecha de vencimiento: {{due_date}}',
    type: 'warning',
    priority: 'high',
    category: 'facturacion',
    channels: ['system', 'email', 'sms'],
    variables: ['invoice_number', 'amount', 'due_date', 'client_name']
  }
];

const mockRules: NotificationRule[] = [
  {
    id: '1',
    name: 'Nuevo Cliente Registrado',
    description: 'Notifica cuando se registra un nuevo cliente',
    trigger: 'client.created',
    conditions: [],
    actions: [
      {
        type: 'notification',
        template: 'welcome_client',
        delay: 0
      }
    ],
    isActive: true,
    targetRoles: ['admin_empresa'],
    channels: ['system', 'email']
  },
  {
    id: '2',
    name: 'Límite de Plan Alcanzado',
    description: 'Alerta cuando se alcanza el 90% del límite del plan',
    trigger: 'usage.limit_reached',
    conditions: [
      {
        field: 'usage_percentage',
        operator: 'gte',
        value: 90
      }
    ],
    actions: [
      {
        type: 'notification',
        template: 'plan_limit_warning',
        delay: 0
      }
    ],
    isActive: true,
    targetRoles: ['superadmin', 'admin_empresa'],
    channels: ['system', 'email']
  }
];

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [templates, setTemplates] = useState<NotificationTemplate[]>(mockTemplates);
  const [rules, setRules] = useState<NotificationRule[]>(mockRules);
  const [isConnected, setIsConnected] = useState(true);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Nuevo formulario de notificación
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    priority: 'medium' as const,
    category: '',
    targetRoles: [] as string[],
    channels: ['system'] as ('system' | 'email' | 'sms' | 'push')[],
    scheduledAt: '',
    expiresAt: ''
  });

  // Configuración de canales
  const [channelSettings, setChannelSettings] = useState({
    email: {
      enabled: true,
      smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: '',
          pass: ''
        }
      }
    },
    sms: {
      enabled: false,
      provider: 'twilio',
      credentials: {
        accountSid: '',
        authToken: '',
        from: ''
      }
    },
    push: {
      enabled: true,
      vapidPublicKey: '',
      vapidPrivateKey: ''
    }
  });

  useEffect(() => {
    // Simular conexión WebSocket
    const interval = setInterval(() => {
      setIsConnected(prev => !prev ? true : prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'system': return <Settings className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter !== 'all' && notification.category !== filter) return false;
    if (statusFilter !== 'all' && notification.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id 
          ? { ...n, status: 'read' as const, readBy: [...n.readBy, 'current_user'] }
          : n
      )
    );
  };

  const handleBulkAction = (action: string) => {
    setNotifications(prev => 
      prev.map(n => 
        selectedNotifications.includes(n.id)
          ? { ...n, status: action === 'read' ? 'read' as const : 'archived' as const }
          : n
      )
    );
    setSelectedNotifications([]);
  };

  const handleSendNotification = () => {
    const notification: Notification = {
      id: Date.now().toString(),
      ...newNotification,
      status: 'unread',
      targetUsers: [],
      targetCompanies: ['all'],
      createdAt: new Date(),
      createdBy: 'Admin',
      readBy: []
    };
    
    setNotifications(prev => [notification, ...prev]);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      category: '',
      targetRoles: [],
      channels: ['system'],
      scheduledAt: '',
      expiresAt: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Notificaciones</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-blue-50">
            {notifications.filter(n => n.status === 'unread').length} sin leer
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            {notifications.filter(n => n.status === 'read').length} leídas
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="send">Enviar</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="rules">Reglas</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Lista de Notificaciones */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notificaciones Recientes</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="sistema">Sistema</SelectItem>
                      <SelectItem value="clientes">Clientes</SelectItem>
                      <SelectItem value="facturacion">Facturación</SelectItem>
                      <SelectItem value="respaldos">Respaldos</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="unread">Sin leer</SelectItem>
                      <SelectItem value="read">Leídas</SelectItem>
                      <SelectItem value="archived">Archivadas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedNotifications.length > 0 && (
                <div className="flex items-center space-x-2 pt-2">
                  <span className="text-sm text-gray-600">
                    {selectedNotifications.length} seleccionadas
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkAction('read')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Marcar como leídas
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkAction('archived')}
                  >
                    <Archive className="w-4 h-4 mr-1" />
                    Archivar
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      notification.status === 'unread' 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNotifications(prev => [...prev, notification.id]);
                            } else {
                              setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                            }
                          }}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getTypeIcon(notification.type)}
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline">{notification.category}</Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{notification.createdAt.toLocaleString()}</span>
                            </span>
                            <span>Por: {notification.createdBy}</span>
                            <span>Canales: {notification.channels.join(', ')}</span>
                          </div>
                          
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex items-center space-x-2 mt-3">
                              {notification.actions.map((action) => (
                                <Button
                                  key={action.id}
                                  size="sm"
                                  variant={action.style === 'primary' ? 'default' : 'outline'}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {notification.status === 'unread' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enviar Notificación */}
        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Enviar Nueva Notificación</span>
              </CardTitle>
              <CardDescription>
                Crea y envía notificaciones personalizadas a usuarios específicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título de la notificación"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={newNotification.category}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Categoría (ej: sistema, clientes)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Contenido de la notificación"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select 
                    value={newNotification.type} 
                    onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Información</SelectItem>
                      <SelectItem value="success">Éxito</SelectItem>
                      <SelectItem value="warning">Advertencia</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <Select 
                    value={newNotification.priority} 
                    onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Roles Objetivo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="superadmin">SuperAdmin</SelectItem>
                      <SelectItem value="admin_empresa">Admin Empresa</SelectItem>
                      <SelectItem value="contador">Contador</SelectItem>
                      <SelectItem value="cliente_basico">Cliente Básico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Canales de Envío</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="channel-system"
                      checked={newNotification.channels.includes('system')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewNotification(prev => ({ 
                            ...prev, 
                            channels: [...prev.channels, 'system'] 
                          }));
                        } else {
                          setNewNotification(prev => ({ 
                            ...prev, 
                            channels: prev.channels.filter(c => c !== 'system') 
                          }));
                        }
                      }}
                    />
                    <Label htmlFor="channel-system" className="text-sm">Sistema</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="channel-email"
                      checked={newNotification.channels.includes('email')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewNotification(prev => ({ 
                            ...prev, 
                            channels: [...prev.channels, 'email'] 
                          }));
                        } else {
                          setNewNotification(prev => ({ 
                            ...prev, 
                            channels: prev.channels.filter(c => c !== 'email') 
                          }));
                        }
                      }}
                    />
                    <Label htmlFor="channel-email" className="text-sm">Email</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="channel-sms"
                      checked={newNotification.channels.includes('sms')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewNotification(prev => ({ 
                            ...prev, 
                            channels: [...prev.channels, 'sms'] 
                          }));
                        } else {
                          setNewNotification(prev => ({ 
                            ...prev, 
                            channels: prev.channels.filter(c => c !== 'sms') 
                          }));
                        }
                      }}
                    />
                    <Label htmlFor="channel-sms" className="text-sm">SMS</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="channel-push"
                      checked={newNotification.channels.includes('push')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewNotification(prev => ({ 
                            ...prev, 
                            channels: [...prev.channels, 'push'] 
                          }));
                        } else {
                          setNewNotification(prev => ({ 
                            ...prev, 
                            channels: prev.channels.filter(c => c !== 'push') 
                          }));
                        }
                      }}
                    />
                    <Label htmlFor="channel-push" className="text-sm">Push</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Programar Envío (Opcional)</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={newNotification.scheduledAt}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Fecha de Expiración (Opcional)</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={newNotification.expiresAt}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, expiresAt: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewNotification({
                  title: '',
                  message: '',
                  type: 'info',
                  priority: 'medium',
                  category: '',
                  targetRoles: [],
                  channels: ['system'],
                  scheduledAt: '',
                  expiresAt: ''
                })}>
                  Limpiar
                </Button>
                <Button onClick={handleSendNotification}>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Notificación
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plantillas */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Plantillas de Notificación</span>
                </CardTitle>
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Nueva Plantilla
                </Button>
              </div>
              <CardDescription>
                Gestiona plantillas reutilizables para notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(template.priority)}>
                          {template.priority}
                        </Badge>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">Título: {template.title}</p>
                      <p className="text-sm text-gray-600">{template.message}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Variables: {template.variables.join(', ')}</span>
                      <span>Canales: {template.channels.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <Button size="sm" variant="outline">Editar</Button>
                      <Button size="sm" variant="outline">Usar</Button>
                      <Button size="sm" variant="outline">Duplicar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reglas */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Reglas de Notificación</span>
                </CardTitle>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Nueva Regla
                </Button>
              </div>
              <CardDescription>
                Configura reglas automáticas para envío de notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        <Switch checked={rule.isActive} />
                      </div>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Disparador: {rule.trigger}</span>
                      <span>Roles: {rule.targetRoles.join(', ')}</span>
                      <span>Canales: {rule.channels.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <Button size="sm" variant="outline">Editar</Button>
                      <Button size="sm" variant="outline">Probar</Button>
                      <Button size="sm" variant="outline">Duplicar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Configuración de Canales</span>
              </CardTitle>
              <CardDescription>
                Configura los canales de envío de notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium">Configuración de Email</h4>
                  </div>
                  <Switch 
                    checked={channelSettings.email.enabled}
                    onCheckedChange={(checked) => 
                      setChannelSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, enabled: checked }
                      }))
                    }
                  />
                </div>
                
                {channelSettings.email.enabled && (
                  <div className="grid grid-cols-2 gap-4 pl-8">
                    <div className="space-y-2">
                      <Label>Servidor SMTP</Label>
                      <Input 
                        value={channelSettings.email.smtp.host}
                        onChange={(e) => 
                          setChannelSettings(prev => ({
                            ...prev,
                            email: {
                              ...prev.email,
                              smtp: { ...prev.email.smtp, host: e.target.value }
                            }
                          }))
                        }
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Puerto</Label>
                      <Input 
                        type="number"
                        value={channelSettings.email.smtp.port}
                        onChange={(e) => 
                          setChannelSettings(prev => ({
                            ...prev,
                            email: {
                              ...prev.email,
                              smtp: { ...prev.email.smtp, port: parseInt(e.target.value) }
                            }
                          }))
                        }
                        placeholder="587"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Usuario</Label>
                      <Input 
                        value={channelSettings.email.smtp.auth.user}
                        onChange={(e) => 
                          setChannelSettings(prev => ({
                            ...prev,
                            email: {
                              ...prev.email,
                              smtp: {
                                ...prev.email.smtp,
                                auth: { ...prev.email.smtp.auth, user: e.target.value }
                              }
                            }
                          }))
                        }
                        placeholder="usuario@empresa.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contraseña</Label>
                      <Input 
                        type="password"
                        value={channelSettings.email.smtp.auth.pass}
                        onChange={(e) => 
                          setChannelSettings(prev => ({
                            ...prev,
                            email: {
                              ...prev.email,
                              smtp: {
                                ...prev.email.smtp,
                                auth: { ...prev.email.smtp.auth, pass: e.target.value }
                              }
                            }
                          }))
                        }
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SMS Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium">Configuración de SMS</h4>
                  </div>
                  <Switch 
                    checked={channelSettings.sms.enabled}
                    onCheckedChange={(checked) => 
                      setChannelSettings(prev => ({
                        ...prev,
                        sms: { ...prev.sms, enabled: checked }
                      }))
                    }
                  />
                </div>
                
                {channelSettings.sms.enabled && (
                  <div className="grid grid-cols-2 gap-4 pl-8">
                    <div className="space-y-2">
                      <Label>Proveedor</Label>
                      <Select 
                        value={channelSettings.sms.provider}
                        onValueChange={(value) => 
                          setChannelSettings(prev => ({
                            ...prev,
                            sms: { ...prev.sms, provider: value }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twilio">Twilio</SelectItem>
                          <SelectItem value="aws-sns">AWS SNS</SelectItem>
                          <SelectItem value="nexmo">Nexmo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Número Origen</Label>
                      <Input 
                        value={channelSettings.sms.credentials.from}
                        onChange={(e) => 
                          setChannelSettings(prev => ({
                            ...prev,
                            sms: {
                              ...prev.sms,
                              credentials: { ...prev.sms.credentials, from: e.target.value }
                            }
                          }))
                        }
                        placeholder="+56912345678"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Push Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium">Notificaciones Push</h4>
                  </div>
                  <Switch 
                    checked={channelSettings.push.enabled}
                    onCheckedChange={(checked) => 
                      setChannelSettings(prev => ({
                        ...prev,
                        push: { ...prev.push, enabled: checked }
                      }))
                    }
                  />
                </div>
                
                {channelSettings.push.enabled && (
                  <div className="grid grid-cols-2 gap-4 pl-8">
                    <div className="space-y-2">
                      <Label>VAPID Public Key</Label>
                      <Input 
                        value={channelSettings.push.vapidPublicKey}
                        onChange={(e) => 
                          setChannelSettings(prev => ({
                            ...prev,
                            push: { ...prev.push, vapidPublicKey: e.target.value }
                          }))
                        }
                        placeholder="Clave pública VAPID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>VAPID Private Key</Label>
                      <Input 
                        type="password"
                        value={channelSettings.push.vapidPrivateKey}
                        onChange={(e) => 
                          setChannelSettings(prev => ({
                            ...prev,
                            push: { ...prev.push, vapidPrivateKey: e.target.value }
                          }))
                        }
                        placeholder="Clave privada VAPID"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  Probar Configuración
                </Button>
                <Button>
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
