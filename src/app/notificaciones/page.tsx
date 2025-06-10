'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSystemNotifications } from '@/hooks/useSystemNotifications';
import { SystemNotification } from '@/hooks/useSystemNotifications';
import NotificationSettingsModal from '@/components/NotificationSettingsModal';
import NotificationMetrics from '@/components/NotificationMetrics';
import ToastContainer from '@/components/ToastContainer';
import NotificationFilters from '@/components/NotificationFilters';
import ExportNotifications from '@/components/ExportNotifications';

export default function NotificationsPage() {
  const { 
    notifications, 
    systemStatus,
    isLoading: systemLoading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationCounts 
  } = useSystemNotifications();
  
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [advancedFiltered, setAdvancedFiltered] = useState<SystemNotification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    criticalOnly: false,
    autoMarkAsRead: false,
    notificationFrequency: 'immediate' as 'immediate' | 'hourly' | 'daily',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  
  // Memoizar los conteos para mejorar rendimiento - Corrigiendo la dependencia innecesaria
  const notificationCounts = useMemo(() => getNotificationCounts(), [notifications]);

  // Memoizar las notificaciones filtradas
  const filteredNotifications = useMemo(() => {
    const baseNotifications = advancedFiltered.length > 0 ? advancedFiltered : notifications;
    
    return baseNotifications.filter(notification => {
      if (activeTab === 'all') return true;
      if (activeTab === 'unread') return !notification.isRead;
      if (activeTab === 'critical') return notification.priority === 'critical';
      return notification.type === activeTab;
    });
  }, [advancedFiltered, activeTab, notifications]);

  // Callbacks optimizados
  const handleMarkAsRead = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await markAsRead(id);
    } finally {
      setIsLoading(false);
    }
  }, [markAsRead]);

  const handleRemoveNotification = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await removeNotification(id);
    } finally {
      setIsLoading(false);
    }
  }, [removeNotification]);

  const handleMarkAllAsRead = useCallback(async () => {
    setIsLoading(true);
    try {
      await markAllAsRead();
    } finally {
      setIsLoading(false);
    }
  }, [markAllAsRead]);

  const handleClearAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await clearAllNotifications();
    } finally {
      setIsLoading(false);
    }
  }, [clearAllNotifications]);

  const formatTimeAgo = useCallback((date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  }, []);

  const getPriorityIcon = useCallback((priority: SystemNotification['priority']) => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }, []);

  const getTypeIcon = useCallback((type: SystemNotification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  }, []);

  const getSystemHealthColor = useCallback((health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-700 bg-green-50 border-green-200';
      case 'good': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  }, []);

  const getSystemHealthText = useCallback((health: string) => {
    switch (health) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'warning': return 'Advertencia';
      case 'critical': return 'Crítico';
      default: return 'Desconocido';
    }
  }, []);

  const loading = isLoading || systemLoading;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Centro de Notificaciones</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona todas las notificaciones del sistema y mantente informado
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowMetrics(true)}
              className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
            >
              📊 Métricas
            </button>
            <button
              onClick={() => setShowFilters(true)}
              className="px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
            >
              🔍 Filtros Avanzados
            </button>
            <button
              onClick={() => setShowExport(true)}
              className="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100"
            >
              📤 Exportar
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ⚙️ Configuración
            </button>
          </div>
        </div>

        {/* Sistema de Estado Rápido */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-white p-4 md:p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Procesando</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{systemStatus.documentsProcessing}</p>
              </div>
              <div className="text-2xl">📄</div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-xl md:text-2xl font-bold text-orange-600">{systemStatus.pendingValidations}</p>
              </div>
              <div className="text-2xl">⏳</div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Cola IA</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">{systemStatus.aiProcessingQueue}</p>
              </div>
              <div className="text-2xl">🤖</div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Estado</p>
                <div className={`text-xs md:text-sm font-medium px-2 py-1 rounded-full border ${getSystemHealthColor(systemStatus.systemHealth)}`}>
                  {getSystemHealthText(systemStatus.systemHealth)}
                </div>
              </div>
              <div className="text-2xl">💚</div>
            </div>
          </div>
        </div>

        {/* Contadores de notificaciones */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 md:p-6 border-b">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                  activeTab === 'all'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Todas ({notifications.length})
              </button>
              
              <button
                onClick={() => setActiveTab('unread')}
                className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                  activeTab === 'unread'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                No leídas ({notificationCounts.total})
              </button>

              <button
                onClick={() => setActiveTab('critical')}
                className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                  activeTab === 'critical'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Críticas ({notificationCounts.critical})
              </button>

              <button
                onClick={() => setActiveTab('error')}
                className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                  activeTab === 'error'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Errores ({notificationCounts.error})
              </button>

              <button
                onClick={() => setActiveTab('warning')}
                className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                  activeTab === 'warning'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Advertencias ({notificationCounts.warning})
              </button>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="p-4 md:p-6 bg-gray-50 border-b">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleMarkAllAsRead}
                disabled={loading || notificationCounts.total === 0}
                className="px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✓ Marcar todas como leídas
              </button>
              
              <button
                onClick={handleClearAll}
                disabled={loading || notifications.length === 0}
                className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🗑️ Limpiar todas
              </button>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="divide-y divide-gray-200">
            {loading && (
              <div className="p-4 md:p-6 text-center">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-blue-600">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  </div>
                  Cargando...
                </div>
              </div>
            )}

            {!loading && filteredNotifications.length === 0 && (
              <div className="p-8 md:p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'all' 
                    ? 'No tienes notificaciones en este momento'
                    : `No hay notificaciones en la categoría "${activeTab}"`
                  }
                </p>
              </div>
            )}

            {!loading && filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 md:p-6 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {getTypeIcon(notification.type)}
                      </span>
                      <span className="text-sm">
                        {getPriorityIcon(notification.priority)}
                      </span>
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>📍 {notification.module}</span>
                      <span>•</span>
                      <span>🕒 {formatTimeAgo(notification.timestamp)}</span>
                      <span>•</span>
                      <span className="capitalize">📊 {notification.priority}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={loading}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Marcar como leída"
                      >
                        ✓
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleRemoveNotification(notification.id)}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Eliminar notificación"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer con estado de conexión */}
        <div className="text-center text-sm text-gray-500">
          🌐 Sistema conectado | Última actualización: {formatTimeAgo(systemStatus.lastSync)}
        </div>
      </div>

      {/* Modales */}
      {showSettings && (
        <NotificationSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={notificationSettings}
          onSave={setNotificationSettings}
        />
      )}

      {showMetrics && (
        <NotificationMetrics
          notifications={notifications}
        />
      )}

      {showFilters && (
        <NotificationFilters
          notifications={notifications}
          onFilterChange={setAdvancedFiltered}
          isOpen={true}
          onToggle={() => setShowFilters(false)}
        />
      )}

      {showExport && (
        <ExportNotifications
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          notifications={filteredNotifications}
        />
      )}

      <ToastContainer 
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onRemove={handleRemoveNotification}
      />
    </div>
  );
}
