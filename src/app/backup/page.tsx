'use client';

import { DataBackupSystem } from '@/components/DataBackupSystem';

export default function BackupPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sistema de Respaldo de Datos</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gestiona los respaldos automáticos y manuales del sistema
        </p>
      </div>
      
      <DataBackupSystem />
    </div>
  );
}
