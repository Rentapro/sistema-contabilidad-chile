'use client';

import { useEffect, useState, useCallback } from 'react';
import { SystemNotification } from '@/hooks/useSystemNotifications';

interface ToastNotificationProps {
  notification: SystemNotification;
  onClose: () => void;
  onMarkAsRead: () => void;
}

function ToastNotification({ notification, onClose, onMarkAsRead }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // Auto-cerrar después de 8 segundos para notificaciones no críticas
    if (notification.priority !== 'critical') {
      const timer = setTimeout(() => {
        handleClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [notification.priority, handleClose]);

  const handleMarkAsRead = () => {
    onMarkAsRead();
    handleClose();
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success': return 'border-l-green-500';
      case 'warning': return 'border-l-yellow-500';
      case 'error': return 'border-l-red-500';
      default: return 'border-l-blue-500';
    }
  };

  const getPriorityBadge = () => {
    if (notification.priority === 'critical') {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          CRÍTICO
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-in-out ${
        isVisible && !isLeaving
          ? 'transform translate-x-0 opacity-100'
          : 'transform translate-x-full opacity-0'
      }`}
    >
      <div className={`bg-white border-l-4 ${getBorderColor()} rounded-lg shadow-lg p-4 max-w-sm w-80`}>
        <div className="flex items-start gap-3">
          <span className="text-lg flex-shrink-0">{getIcon()}</span>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-medium text-gray-900 text-sm leading-tight">
                {notification.title}
              </h4>
              {getPriorityBadge()}
            </div>
            
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {notification.module}
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={handleMarkAsRead}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded text-xs"
                  title="Marcar como leída"
                >
                  ✓
                </button>
                <button
                  onClick={handleClose}
                  className="p-1 text-gray-400 hover:bg-gray-100 rounded text-xs"
                  title="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  notifications: SystemNotification[];
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function ToastContainer({ notifications, onMarkAsRead, onRemove }: ToastContainerProps) {
  const [visibleToasts, setVisibleToasts] = useState<SystemNotification[]>([]);

  useEffect(() => {
    // Mostrar solo las últimas 3 notificaciones no leídas
    const unreadNotifications = notifications
      .filter(n => !n.isRead)
      .slice(0, 3);
    
    setVisibleToasts(unreadNotifications);
  }, [notifications]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {visibleToasts.map((notification, index) => (
        <div
          key={notification.id}
          style={{ 
            top: `${index * 100}px`,
            position: 'relative'
          }}
        >
          <ToastNotification
            notification={notification}
            onClose={() => onRemove(notification.id)}
            onMarkAsRead={() => onMarkAsRead(notification.id)}
          />
        </div>
      ))}
    </div>
  );
}
