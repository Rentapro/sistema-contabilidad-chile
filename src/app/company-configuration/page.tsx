'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnterpriseConfigurationManager } from '@/components/EnterpriseConfigurationManager';

export default function CompanyConfigurationPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración Empresarial</h1>
          <p className="text-muted-foreground">
            Centro de control avanzado para configuraciones, límites y automatización empresarial
          </p>
        </div>
      </div>

      <EnterpriseConfigurationManager />
    </div>
  );
}
