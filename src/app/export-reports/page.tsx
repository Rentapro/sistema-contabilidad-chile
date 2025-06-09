'use client';

import { AdvancedReportExporter } from '@/components/AdvancedReportExporter';

export default function ExportReportsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Exportador de Reportes Profesional</h1>
        <p className="mt-2 text-sm text-gray-600">
          Genera reportes profesionales en múltiples formatos
        </p>
      </div>
      
      <AdvancedReportExporter />
    </div>
  );
}
