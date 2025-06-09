'use client';

import { AdvancedAnalytics } from '@/components/AdvancedAnalytics';

export default function AdvancedAnalyticsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Empresarial Avanzado</h1>
        <p className="mt-2 text-sm text-gray-600">
          Análisis detallado de métricas y KPIs del sistema
        </p>
      </div>
      
      <AdvancedAnalytics />
    </div>
  );
}
