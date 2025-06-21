'use client';

import GestionCertificados from '@/components/GestionCertificados';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GestionCertificadosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔐 Gestión de Certificados Digitales
          </h1>
          <p className="text-gray-600">
            Administración completa de certificados digitales para firma electrónica
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🛡️ Centro de Certificados
              </CardTitle>
              <CardDescription>
                Subida, validación, renovación y gestión de certificados digitales
              </CardDescription>
            </CardHeader>            <CardContent>
              <GestionCertificados empresaId="default" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
