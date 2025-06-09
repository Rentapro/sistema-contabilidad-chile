import RealTimeFinancialMonitor from '@/components/RealTimeFinancialMonitor';

export default function MonitoreoFinancieroPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Monitor Financiero en Tiempo Real</h1>
        <p className="text-gray-600 mt-2">
          Supervisión continua de métricas financieras con alertas inteligentes y análisis predictivo
        </p>
      </div>
      
      <RealTimeFinancialMonitor />
    </div>
  );
}
