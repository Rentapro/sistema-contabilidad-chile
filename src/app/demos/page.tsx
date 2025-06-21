import FeatureDemoComponent from '@/components/FeatureDemoComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demos Interactivas - Conta-IA',
  description: 'Explora todas las características del sistema con demos paso a paso y tutoriales interactivos',
};

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <FeatureDemoComponent />
    </div>
  );
}
