'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SystemNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  module: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
  autoHide?: boolean;
}

export interface SystemStatus {
  documentsProcessing: number;
  pendingValidations: number;
  criticalAlerts: number;
  isOnline: boolean;
  lastSync: Date;
  aiProcessingQueue: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

export function useSystemNotifications() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    documentsProcessing: 0,
    pendingValidations: 0,
    criticalAlerts: 0,
    isOnline: true,
    lastSync: new Date(),
    aiProcessingQueue: 0,
    systemHealth: 'excellent'
  });

  // Simular notificaciones del sistema en tiempo real
  const generateMockNotification = useCallback((): SystemNotification => {
    const priorities: SystemNotification['priority'][] = ['low', 'medium', 'high', 'critical'];
    
    const mockNotifications = [
      {
        type: 'success' as const,
        title: 'Documento procesado exitosamente',
        message: 'Factura #12345 ha sido procesada con 98% de confianza',
        module: 'Documentos IA'
      },
      {
        type: 'warning' as const,
        title: 'Validación manual requerida',
        message: 'Documento con confianza del 75% requiere revisión humana',
        module: 'Workflow'
      },
      {
        type: 'info' as const,
        title: 'Nuevo patrón detectado',
        message: 'IA ha identificado un nuevo patrón de gastos recurrentes',
        module: 'Business Intelligence'
      },
      {
        type: 'error' as const,
        title: 'Error en integración bancaria',
        message: 'Conexión con banco perdida, reintentando automáticamente',
        module: 'Bancos'
      },
      {
        type: 'info' as const,
        title: 'Predicción de ingresos actualizada',
        message: 'Las predicciones de Q2 han sido recalculadas con nuevos datos',
        module: 'Business Intelligence'
      }
    ];

    const template = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
    
    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: template.type,
      title: template.title,
      message: template.message,
      timestamp: new Date(),
      module: template.module,
      isRead: false,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      actionUrl: template.type === 'warning' ? '/workflow' : undefined,
      autoHide: template.type === 'success'
    };
  }, []);

  // Simular actualizaciones del estado del sistema
  const updateSystemStatus = useCallback(() => {
    setSystemStatus(prev => {
      const newStatus = {
        ...prev,
        documentsProcessing: Math.floor(Math.random() * 8),
        pendingValidations: Math.floor(Math.random() * 15),
        criticalAlerts: Math.floor(Math.random() * 4),
        aiProcessingQueue: Math.floor(Math.random() * 12),
        lastSync: new Date()
      };

      // Determinar salud del sistema basado en métricas
      if (newStatus.criticalAlerts > 2 || newStatus.pendingValidations > 10) {
        newStatus.systemHealth = 'critical';
      } else if (newStatus.criticalAlerts > 0 || newStatus.pendingValidations > 7) {
        newStatus.systemHealth = 'warning';
      } else if (newStatus.documentsProcessing > 5) {
        newStatus.systemHealth = 'good';
      } else {
        newStatus.systemHealth = 'excellent';
      }

      return newStatus;
    });
  }, []);

  // Agregar nueva notificación
  const addNotification = useCallback((notification: Omit<SystemNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: SystemNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Mantener solo las últimas 50
  }, []);

  // Marcar notificación como leída
  const markAsRead = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Simular operación async
      await new Promise(resolve => setTimeout(resolve, 200));
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simular operación async
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Eliminar notificación
  const removeNotification = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Simular operación async
      await new Promise(resolve => setTimeout(resolve, 200));
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Limpiar todas las notificaciones
  const clearAllNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simular operación async
      await new Promise(resolve => setTimeout(resolve, 300));
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener contadores por tipo
  const getNotificationCounts = useCallback(() => {
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
  }, [notifications]);

  // Efectos para simular actividad en tiempo real
  useEffect(() => {
    // Generar notificaciones aleatorias
    const notificationInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% probabilidad cada intervalo
        const newNotification = generateMockNotification();
        setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
      }
    }, 15000); // Cada 15 segundos

    // Actualizar estado del sistema
    const statusInterval = setInterval(updateSystemStatus, 10000); // Cada 10 segundos

    // Auto-eliminar notificaciones de éxito después de 5 segundos
    const autoHideInterval = setInterval(() => {
      setNotifications(prev => 
        prev.filter(notif => 
          !(notif.autoHide && !notif.isRead && 
            (Date.now() - notif.timestamp.getTime()) > 5000)
        )
      );
    }, 1000);

    return () => {
      clearInterval(notificationInterval);
      clearInterval(statusInterval);
      clearInterval(autoHideInterval);
    };
  }, [generateMockNotification, updateSystemStatus]);

  return {
    notifications,
    systemStatus,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationCounts
  };
}
