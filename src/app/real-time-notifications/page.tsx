'use client';

import { RealTimeNotifications } from '@/components/RealTimeNotifications';

export default function RealTimeNotificationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sistema de Notificaciones en Tiempo Real</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gestiona notificaciones, plantillas y configuraciones de envío
        </p>
      </div>
      
      <RealTimeNotifications />
    </div>
  );
}
