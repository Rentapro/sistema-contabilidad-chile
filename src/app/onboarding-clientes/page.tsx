'use client';

import OnboardingClientes from '@/components/OnboardingClientes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OnboardingClientesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Onboarding de Clientes
          </h1>
          <p className="text-gray-600">
            Proceso completo de alta y configuración inicial de nuevos clientes
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Proceso de Onboarding
              </CardTitle>
              <CardDescription>
                Configuración automática con validación SII y datos oficiales de Chile
              </CardDescription>
            </CardHeader>            <CardContent>
              <OnboardingClientes empresaId="default" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
