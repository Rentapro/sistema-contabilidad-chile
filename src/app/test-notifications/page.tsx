'use client';

import { useState, useEffect } from 'react';

// Mock data para simulación
const mockNotifications = [
  {
    id: '1',
    type: 'success',
    title: 'Documento procesado exitosamente',
    message: 'Factura #12345 ha sido procesada con 98% de confianza',
    module: 'Documentos IA',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false,
    priority: 'medium'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Validación manual requerida',
    message: 'Documento con confianza del 75% requiere revisión humana',
    module: 'Workflow',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isRead: false,
    priority: 'high'
  },
  {
    id: '3',
    type: 'error',
    title: 'Error en integración bancaria',
    message: 'Conexión con banco perdida, reintentando automáticamente',
    module: 'Bancos',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: true,
    priority: 'critical'
  },
  {
    id: '4',
    type: 'info',
    title: 'Nuevo patrón detectado',
    message: 'IA ha identificado un nuevo patrón de gastos recurrentes',
    module: 'Business Intelligence',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isRead: false,
    priority: 'low'
  }
];

const mockSystemStatus = {
  documentsProcessing: 5,
  pendingValidations: 12,
  criticalAlerts: 2,
  isOnline: true,
  lastSync: new Date(),
  aiProcessingQueue: 8,
  systemHealth: 'good' as const
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [systemStatus] = useState(mockSystemStatus);
  const [activeTab, setActiveTab] = useState('all');

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationCounts = () => {
    return notifications.reduce((acc, notif) => {
      if (!notif.isRead) {
        acc.total++;
        acc[notif.type]++;
        if (notif.priority === 'critical') acc.critical++;
      }
      return acc;
    }, {
      total: 0,
      info: 0,
      success: 0,
      warning: 0,
      error: 0,
      critical: 0
    });
  };

  const notificationCounts = getNotificationCounts();

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'critical') return notification.priority === 'critical';
    return notification.type === activeTab;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Centro de Notificaciones</h1>
          <p className="text-gray-600">
            Gestiona y monitorea todas las notificaciones del sistema en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Marcar todas como leídas
          </button>
          <button 
            onClick={clearAllNotifications}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Limpiar todas
          </button>
        </div>
      </div>

      {/* System Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Documentos Procesando</p>
              <p className="text-2xl font-bold">{systemStatus.documentsProcessing}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              📄
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Validaciones Pendientes</p>
              <p className="text-2xl font-bold">{systemStatus.pendingValidations}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              ⏰
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Cola de IA</p>
              <p className="text-2xl font-bold">{systemStatus.aiProcessingQueue}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              🤖
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Alertas Críticas</p>
              <p className="text-2xl font-bold text-red-600">{systemStatus.criticalAlerts}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              ⚠️
            </div>
          </div>
        </div>
      </div>

      {/* System Health Status */}
      <div className={`flex items-center gap-2 p-3 rounded-lg ${
        systemStatus.systemHealth === 'excellent' ? 'bg-green-50 text-green-700' :
        systemStatus.systemHealth === 'good' ? 'bg-blue-50 text-blue-700' :
        systemStatus.systemHealth === 'warning' ? 'bg-yellow-50 text-yellow-700' :
        'bg-red-50 text-red-700'
      }`}>
        <span>🔄</span>
        <span className="font-medium">
          Estado del Sistema: {
            systemStatus.systemHealth === 'excellent' ? 'Excelente' :
            systemStatus.systemHealth === 'good' ? 'Bueno' :
            systemStatus.systemHealth === 'warning' ? 'Advertencia' :
            'Crítico'
          }
        </span>
        <span className="text-sm opacity-75 ml-auto">
          Última sincronización: {formatTimeAgo(systemStatus.lastSync)}
        </span>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-4">
            <span>🔔</span>
            <h2 className="text-xl font-semibold">Notificaciones del Sistema</h2>
            {notificationCounts.total > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                {notificationCounts.total} nuevas
              </span>
            )}
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 border-b">
            {[
              { id: 'all', label: 'Todas', count: notifications.length },
              { id: 'unread', label: 'No leídas', count: notificationCounts.total },
              { id: 'critical', label: 'Críticas', count: notificationCounts.critical },
              { id: 'error', label: 'Errores', count: notificationCounts.error },
              { id: 'warning', label: 'Advertencias', count: notificationCounts.warning },
              { id: 'success', label: 'Éxito', count: notificationCounts.success },
              { id: 'info', label: 'Info', count: notificationCounts.info }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    tab.id === 'critical' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-sm text-gray-400">
                  {activeTab === 'all' 
                    ? 'No tienes notificaciones en este momento.'
                    : `No hay notificaciones de tipo "${activeTab}".`
                  }
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                  } ${
                    notification.priority === 'critical' ? 'border-l-red-500 bg-red-50/30' : ''
                  } ${getTypeColor(notification.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl">
                        {notification.type === 'success' ? '✅' :
                         notification.type === 'warning' ? '⚠️' :
                         notification.type === 'error' ? '❌' : 'ℹ️'}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{notification.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded ${
                            notification.priority === 'critical' ? 'bg-red-600 text-white animate-pulse' :
                            notification.priority === 'high' ? 'bg-red-500 text-white' :
                            notification.priority === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {notification.priority.toUpperCase()}
                          </span>
                          {!notification.isRead && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              Nuevo
                            </span>
                          )}
                        </div>
                        <p className="text-sm opacity-80">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs opacity-60">
                          <span>📍 {notification.module}</span>
                          <span>🕒 {formatTimeAgo(notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                          title="Marcar como leída"
                        >
                          ✓
                        </button>
                      )}
                      <button 
                        onClick={() => removeNotification(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">📋 Resumen del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
              <div className="text-sm text-gray-600">Total Notificaciones</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.isRead).length}
              </div>
              <div className="text-sm text-gray-600">Leídas</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{notificationCounts.critical}</div>
              <div className="text-sm text-gray-600">Críticas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
