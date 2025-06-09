'use client';

import { useState, useMemo } from 'react';
import { useSystemNotifications } from '@/hooks/useSystemNotifications';

export default function NotificationsPage() {
  const { 
    notifications, 
    getNotificationCounts 
  } = useSystemNotifications();
  
  const [activeTab, setActiveTab] = useState('all');
  
  // Memoizar los conteos para mejorar rendimiento
  const notificationCounts = useMemo(() => getNotificationCounts(), [getNotificationCounts]);

  const tabs = [
    { id: 'all', label: 'Todas', count: notifications.length },
    { id: 'unread', label: 'No leídas', count: notificationCounts.total },
    { id: 'critical', label: 'Críticas', count: notificationCounts.critical },
    { id: 'success', label: 'Éxito', count: notificationCounts.success },
    { id: 'warning', label: 'Advertencias', count: notificationCounts.warning },
    { id: 'error', label: 'Errores', count: notificationCounts.error }
  ];

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (activeTab === 'all') return true;
      if (activeTab === 'unread') return !notification.isRead;
      if (activeTab === 'critical') return notification.priority === 'critical';
      return notification.type === activeTab;
    });
  }, [notifications, activeTab]);

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '📢';
      case 'low': return 'ℹ️';
      default: return '📋';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Centro de Notificaciones</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Gestiona y monitorea todas las notificaciones del sistema en tiempo real
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 md:px-6 py-3 md:py-4 font-medium text-xs md:text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 md:p-6 space-y-3 md:space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className="text-4xl md:text-6xl mb-4">📭</div>
              <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
                No hay notificaciones
              </h3>
              <p className="text-sm md:text-base text-gray-500">
                {activeTab === 'all' 
                  ? 'No tienes notificaciones en este momento'
                  : `No hay notificaciones del tipo "${tabs.find(t => t.id === activeTab)?.label}"`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 md:p-6 border rounded-lg transition-colors ${
                  notification.isRead ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'
                } ${getTypeColor(notification.type)}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <div className="text-lg md:text-xl">
                      {getPriorityIcon(notification.priority)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-sm md:text-base font-medium text-gray-900 truncate">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                          {notification.module}
                        </span>
                        <span>{formatTimeAgo(notification.timestamp)}</span>
                      </div>
                    </div>
                    
                    <p className="mt-1 text-xs md:text-sm text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notification.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {notification.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>
          Total de notificaciones: {notifications.length} | 
          No leídas: {notificationCounts.total} | 
          Críticas: {notificationCounts.critical}
        </p>
      </div>
    </div>
  );
}
