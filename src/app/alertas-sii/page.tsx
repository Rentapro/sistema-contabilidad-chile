'use client';

import AlertasSII from '@/components/AlertasSII';

export default function AlertasSIIPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚨 Centro de Alertas del SII
        </h1>
        <p className="text-gray-600">
          Gestiona todas las notificaciones, observaciones y requerimientos del Servicio de Impuestos Internos
        </p>
      </div>
      <AlertasSII />
    </div>
  );
}
