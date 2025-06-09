'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanManagementSystem } from '@/components/PlanManagementSystem';

export default function PlanManagementPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Planes</h1>
          <p className="text-muted-foreground">
            Sistema completo de gestión de planes de suscripción, precios y características
          </p>
        </div>
      </div>

      <PlanManagementSystem />
    </div>
  );
}
