import SystemStatusOverview from '@/components/SystemStatusOverview';

export default function SystemStatusPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Estado del Sistema</h1>
        <p className="text-gray-600 mt-2">
          Vista completa del estado y funcionalidades implementadas en la plataforma
        </p>
      </div>
      
      <SystemStatusOverview />
    </div>
  );
}
