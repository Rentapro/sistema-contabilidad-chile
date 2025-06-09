'use client';

import { useMemo } from 'react';
import { SystemNotification } from '@/hooks/useSystemNotifications';

interface NotificationMetricsProps {
  notifications: SystemNotification[];
}

export default function NotificationMetrics({ notifications }: NotificationMetricsProps) {
  const metrics = useMemo(() => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const last24hNotifications = notifications.filter(n => n.timestamp >= last24h);
    const last7dNotifications = notifications.filter(n => n.timestamp >= last7d);

    const criticalRate = notifications.length > 0 
      ? (notifications.filter(n => n.priority === 'critical').length / notifications.length * 100).toFixed(1)
      : '0';

    const readRate = notifications.length > 0
      ? (notifications.filter(n => n.isRead).length / notifications.length * 100).toFixed(1)
      : '0';

    const avgResponseTime = notifications.filter(n => n.isRead).length > 0
      ? Math.round(notifications
          .filter(n => n.isRead)
          .reduce((acc) => {
            // Simular tiempo de respuesta (en minutos)
            const responseTime = Math.random() * 30; // 0-30 minutos
            return acc + responseTime;
          }, 0) / notifications.filter(n => n.isRead).length)
      : 0;

    const moduleDistribution = notifications.reduce((acc, n) => {
      acc[n.module] = (acc[n.module] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topModule = Object.entries(moduleDistribution)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      total: notifications.length,
      last24h: last24hNotifications.length,
      last7d: last7dNotifications.length,
      criticalRate,
      readRate,
      avgResponseTime,
      topModule: topModule ? { name: topModule[0], count: topModule[1] } : null,
      moduleDistribution
    };
  }, [notifications]);

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Métricas de Notificaciones</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{metrics.last24h}</div>
          <div className="text-sm text-gray-600">Últimas 24h</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{metrics.readRate}%</div>
          <div className="text-sm text-gray-600">Tasa de Lectura</div>
        </div>
        
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{metrics.criticalRate}%</div>
          <div className="text-sm text-gray-600">Críticas</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{metrics.avgResponseTime}m</div>
          <div className="text-sm text-gray-600">Tiempo Promedio</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Distribución por Módulo</h4>
          <div className="space-y-2">
            {Object.entries(metrics.moduleDistribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([module, count]) => {
                const percentage = (count / metrics.total * 100).toFixed(1);
                return (
                  <div key={module} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{module}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total histórico:</span>
              <span className="font-medium ml-1">{metrics.total}</span>
            </div>
            <div>
              <span className="text-gray-500">Última semana:</span>
              <span className="font-medium ml-1">{metrics.last7d}</span>
            </div>
            <div>
              <span className="text-gray-500">Módulo más activo:</span>
              <span className="font-medium ml-1">
                {metrics.topModule ? `${metrics.topModule.name} (${metrics.topModule.count})` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
