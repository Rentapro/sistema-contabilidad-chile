'use client';

import ConsejosDiarios from '@/components/ConsejosDiarios';

export default function ConsejosDiariosPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💡 Consejos Tributarios Diarios
        </h1>
        <p className="text-gray-600">
          Estrategias y consejos actualizados diariamente para optimizar tu situación tributaria en Chile
        </p>
      </div>
      <ConsejosDiarios />
    </div>
  );
}
