'use client';

import CentroNotificaciones from '@/components/CentroNotificaciones';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CentroNotificacionesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔔 Centro de Notificaciones
          </h1>
          <p className="text-gray-600">
            Sistema completo de alertas tributarias y notificaciones automáticas
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📢 Panel de Notificaciones
              </CardTitle>
              <CardDescription>
                Gestión de alertas, recordatorios y notificaciones tributarias
              </CardDescription>
            </CardHeader>            <CardContent>
              <CentroNotificaciones empresaId="default" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
