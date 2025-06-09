'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Database, Download, Upload, Shield, Clock, CheckCircle } from 'lucide-react';

interface BackupInfo {
  id: string;
  fecha: Date;
  tipo: 'manual' | 'automatico' | 'programado';
  tamaño: string;
  estado: 'completado' | 'en_progreso' | 'fallido';
  duracion: string;
  descripcion: string;
}

interface BackupConfig {
  automatico: boolean;
  frecuencia: 'diario' | 'semanal' | 'mensual';
  hora: string;
  retencion: number; // días
  incluirArchivos: boolean;
  compresion: boolean;
}

export default function DataBackupSystem() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [config, setConfig] = useState<BackupConfig>({
    automatico: false,
    frecuencia: 'diario',
    hora: '02:00',
    retencion: 30,
    incluirArchivos: true,
    compresion: true
  });

  // Simulación de backups existentes
  useEffect(() => {
    const mockBackups: BackupInfo[] = [
      {
        id: 'backup_001',
        fecha: new Date('2024-12-25T02:00:00'),
        tipo: 'automatico',
        tamaño: '45.2 MB',
        estado: 'completado',
        duracion: '2m 15s',
        descripcion: 'Respaldo automático diario'
      },
      {
        id: 'backup_002',
        fecha: new Date('2024-12-24T14:30:00'),
        tipo: 'manual',
        tamaño: '44.8 MB',
        estado: 'completado',
        duracion: '1m 45s',
        descripcion: 'Respaldo manual antes de actualización'
      },
      {
        id: 'backup_003',
        fecha: new Date('2024-12-23T02:00:00'),
        tipo: 'automatico',
        tamaño: '43.1 MB',
        estado: 'completado',
        duracion: '2m 05s',
        descripcion: 'Respaldo automático diario'
      }
    ];
    setBackups(mockBackups);
  }, []);

  const iniciarBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    // Simular proceso de backup
    const steps = ['Preparando datos...', 'Comprimiendo archivos...', 'Encriptando...', 'Guardando...'];
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setBackupProgress(i);
    }

    // Crear nuevo backup
    const newBackup: BackupInfo = {
      id: `backup_${Date.now()}`,
      fecha: new Date(),
      tipo: 'manual',
      tamaño: '46.1 MB',
      estado: 'completado',
      duracion: '2m 00s',
      descripcion: 'Respaldo manual'
    };

    setBackups(prev => [newBackup, ...prev]);
    setIsBackingUp(false);
    setBackupProgress(0);
  };

  const restaurarBackup = async (backupId: string) => {
    setIsRestoring(true);
    
    // Simular restauración
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsRestoring(false);
    alert('Respaldo restaurado exitosamente');
  };

  const descargarBackup = (backup: BackupInfo) => {
    // Simular descarga
    const link = document.createElement('a');
    link.href = '#';
    link.download = `backup_${backup.id}.zip`;
    link.click();
  };

  const getEstadoBadge = (estado: BackupInfo['estado']) => {
    const variants = {
      completado: 'bg-green-100 text-green-800 border-green-200',
      en_progreso: 'bg-blue-100 text-blue-800 border-blue-200',
      fallido: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const icons = {
      completado: <CheckCircle className="w-3 h-3" />,
      en_progreso: <Clock className="w-3 h-3" />,
      fallido: <AlertTriangle className="w-3 h-3" />
    };

    return (
      <Badge className={`${variants[estado]} flex items-center gap-1`}>
        {icons[estado]}
        {estado === 'completado' ? 'Completado' : estado === 'en_progreso' ? 'En Progreso' : 'Fallido'}
      </Badge>
    );
  };

  const getTipoBadge = (tipo: BackupInfo['tipo']) => {
    const variants = {
      manual: 'bg-blue-100 text-blue-800',
      automatico: 'bg-green-100 text-green-800',
      programado: 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge className={variants[tipo]}>
        {tipo === 'manual' ? 'Manual' : tipo === 'automatico' ? 'Automático' : 'Programado'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Database className="w-7 h-7 text-blue-600" />
          Sistema de Respaldos
        </h2>
        <p className="text-gray-600 mt-1">
          Gestiona los respaldos de datos y configuraciones del sistema
        </p>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Crear Respaldo</h3>
                <p className="text-sm text-gray-600">Backup manual inmediato</p>
              </div>
            </div>
            <Button 
              onClick={iniciarBackup} 
              disabled={isBackingUp}
              className="w-full"
            >
              {isBackingUp ? 'Creando Respaldo...' : 'Crear Respaldo'}
            </Button>
            {isBackingUp && (
              <div className="mt-3">
                <Progress value={backupProgress} className="w-full" />
                <p className="text-xs text-gray-500 mt-1">{backupProgress}% completado</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Último Respaldo</h3>
                <p className="text-sm text-gray-600">
                  {backups[0]?.fecha.toLocaleDateString('es-CL')}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Tamaño: {backups[0]?.tamaño}</p>
              <p>Duración: {backups[0]?.duracion}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Próximo Respaldo</h3>
                <p className="text-sm text-gray-600">
                  {config.automatico ? 'Hoy 02:00' : 'No programado'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Estado: {config.automatico ? 'Activo' : 'Inactivo'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuración */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Configuración de Respaldos</span>
          </CardTitle>
          <CardDescription>
            Configura las opciones de respaldo automático
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Respaldos Automáticos</Label>
              <p className="text-sm text-gray-600">Crear respaldos de forma automática</p>
            </div>
            <Switch
              checked={config.automatico}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, automatico: checked }))}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Frecuencia</Label>
              <Select 
                value={config.frecuencia} 
                onValueChange={(value: 'diario' | 'semanal' | 'mensual') => 
                  setConfig(prev => ({ ...prev, frecuencia: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diario</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hora</Label>
              <Input
                type="time"
                value={config.hora}
                onChange={(e) => setConfig(prev => ({ ...prev, hora: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Retención (días)</Label>
              <Input
                type="number"
                value={config.retencion}
                onChange={(e) => setConfig(prev => ({ ...prev, retencion: Number(e.target.value) }))}
                min="1"
                max="365"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Incluir Archivos</Label>
                <p className="text-sm text-gray-600">Incluir documentos y archivos adjuntos</p>
              </div>
              <Switch
                checked={config.incluirArchivos}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, incluirArchivos: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Compresión</Label>
                <p className="text-sm text-gray-600">Comprimir respaldos para ahorrar espacio</p>
              </div>
              <Switch
                checked={config.compresion}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, compresion: checked }))}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Guardar Configuración</Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Respaldos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Respaldos</CardTitle>
          <CardDescription>
            Gestiona y restaura respaldos anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Database className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{backup.descripcion}</span>
                      {getEstadoBadge(backup.estado)}
                      {getTipoBadge(backup.tipo)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>{backup.fecha.toLocaleDateString('es-CL')} {backup.fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="mx-2">•</span>
                      <span>{backup.tamaño}</span>
                      <span className="mx-2">•</span>
                      <span>{backup.duracion}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => descargarBackup(backup)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Descargar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => restaurarBackup(backup.id)}
                    disabled={isRestoring}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    {isRestoring ? 'Restaurando...' : 'Restaurar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
