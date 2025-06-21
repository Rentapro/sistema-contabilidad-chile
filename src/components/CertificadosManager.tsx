'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Upload, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileX, 
  Key,
  Calendar,
  Building,
  RefreshCw
} from 'lucide-react';
import { CertificadosDigitalesService, CertificadoDigital } from '@/services/certificadosDigitalesService';

interface CertificadosManagerProps {
  empresaId: string;
}

export function CertificadosManager({ empresaId }: CertificadosManagerProps) {
  const [certificados, setCertificados] = useState<CertificadoDigital[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [alertas, setAlertas] = useState<string[]>([]);

  // Cargar certificados
  const cargarCertificados = useCallback(async () => {
    try {
      setLoading(true);
      const [certs, verificacion] = await Promise.all([
        CertificadosDigitalesService.obtenerCertificados(empresaId),
        CertificadosDigitalesService.verificarVencimientos(empresaId)
      ]);

      setCertificados(certs);
      setAlertas(verificacion.alertas);
    } catch (error) {
      console.error('Error cargando certificados:', error);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    cargarCertificados();
  }, [cargarCertificados]);

  // Subir certificado
  const handleUpload = async () => {
    if (!selectedFile || !password) return;

    try {
      setUploading(true);
      const resultado = await CertificadosDigitalesService.subirCertificado(
        empresaId,
        selectedFile,
        password
      );

      if (resultado.success) {
        setUploadDialogOpen(false);
        setSelectedFile(null);
        setPassword('');
        await cargarCertificados();
      } else {
        alert(resultado.error);
      }
    } catch (error) {
      console.error('Error subiendo certificado:', error);
      alert('Error subiendo el certificado');
    } finally {
      setUploading(false);
    }
  };

  // Exportar certificado
  const handleExport = async (certificadoId: string, formato: 'pem' | 'der' | 'pfx' = 'pem') => {
    try {
      const resultado = await CertificadosDigitalesService.exportarCertificado(certificadoId, formato);
      
      if (resultado.success && resultado.archivo) {
        // Crear blob y descargar
        const blob = new Blob([resultado.archivo], { 
          type: 'application/octet-stream' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = resultado.nombreArchivo || `certificado.${formato}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exportando certificado:', error);
      alert('Error exportando el certificado');
    }
  };

  // Renovar certificado
  const handleRenewal = async (certificadoId: string, nuevoArchivo: File, password: string) => {
    try {
      const resultado = await CertificadosDigitalesService.renovarCertificado(
        certificadoId,
        nuevoArchivo,
        password
      );

      if (resultado.success) {
        await cargarCertificados();
        alert('Certificado renovado exitosamente');
      } else {
        alert(resultado.error);
      }
    } catch (error) {
      console.error('Error renovando certificado:', error);
      alert('Error renovando el certificado');
    }
  };

  // Obtener icono por estado
  const getEstadoIcon = (estado: CertificadoDigital['estado']) => {
    switch (estado) {
      case 'activo':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'vencido':
        return <FileX className="h-4 w-4 text-red-500" />;
      case 'revocado':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'suspendido':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  // Obtener color por estado
  const getEstadoColor = (estado: CertificadoDigital['estado']) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      case 'revocado':
        return 'bg-red-100 text-red-800';
      case 'suspendido':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calcular días para vencer
  const calcularDiasParaVencer = (fechaVencimiento: string) => {
    const fecha = new Date(fechaVencimiento);
    const ahora = new Date();
    const diferencia = fecha.getTime() - ahora.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando certificados...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con alertas */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Certificados Digitales</h2>
          <p className="text-gray-600">Gestiona tus certificados para firma electrónica y DTE</p>
        </div>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Subir Certificado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subir Certificado Digital</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="certificado-file">Archivo del Certificado (.pfx, .p12)</Label>
                <Input
                  id="certificado-file"
                  type="file"
                  accept=".pfx,.p12"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <Label htmlFor="certificado-password">Contraseña del Certificado</Label>
                <Input
                  id="certificado-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                />
              </div>
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || !password || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Certificado
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">Atención requerida</h3>
                <ul className="text-sm text-yellow-700 mt-1">
                  {alertas.map((alerta, index) => (
                    <li key={index}>• {alerta}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de certificados */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList>
          <TabsTrigger value="todos">Todos ({certificados.length})</TabsTrigger>
          <TabsTrigger value="activos">
            Activos ({certificados.filter(c => c.estado === 'activo').length})
          </TabsTrigger>
          <TabsTrigger value="venciendo">
            Por vencer ({certificados.filter(c => {
              const diasParaVencer = calcularDiasParaVencer(c.fecha_vencimiento);
              return diasParaVencer <= 30 && diasParaVencer > 0;
            }).length})
          </TabsTrigger>
          <TabsTrigger value="vencidos">
            Vencidos ({certificados.filter(c => c.estado === 'vencido').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          {certificados.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay certificados digitales
                </h3>
                <p className="text-gray-600 mb-4">
                  Sube tu primer certificado para empezar a firmar documentos digitalmente
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Certificado
                </Button>
              </CardContent>
            </Card>
          ) : (
            certificados.map((certificado) => (
              <CertificadoCard
                key={certificado.id}
                certificado={certificado}
                onExport={handleExport}
                onRenewal={handleRenewal}
                getEstadoIcon={getEstadoIcon}
                getEstadoColor={getEstadoColor}
                calcularDiasParaVencer={calcularDiasParaVencer}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="activos" className="space-y-4">
          {certificados
            .filter(c => c.estado === 'activo')
            .map((certificado) => (
              <CertificadoCard
                key={certificado.id}
                certificado={certificado}
                onExport={handleExport}
                onRenewal={handleRenewal}
                getEstadoIcon={getEstadoIcon}
                getEstadoColor={getEstadoColor}
                calcularDiasParaVencer={calcularDiasParaVencer}
              />
            ))}
        </TabsContent>

        <TabsContent value="venciendo" className="space-y-4">
          {certificados
            .filter(c => {
              const diasParaVencer = calcularDiasParaVencer(c.fecha_vencimiento);
              return diasParaVencer <= 30 && diasParaVencer > 0;
            })
            .map((certificado) => (
              <CertificadoCard
                key={certificado.id}
                certificado={certificado}
                onExport={handleExport}
                onRenewal={handleRenewal}
                getEstadoIcon={getEstadoIcon}
                getEstadoColor={getEstadoColor}
                calcularDiasParaVencer={calcularDiasParaVencer}
              />
            ))}
        </TabsContent>

        <TabsContent value="vencidos" className="space-y-4">
          {certificados
            .filter(c => c.estado === 'vencido')
            .map((certificado) => (
              <CertificadoCard
                key={certificado.id}
                certificado={certificado}
                onExport={handleExport}
                onRenewal={handleRenewal}
                getEstadoIcon={getEstadoIcon}
                getEstadoColor={getEstadoColor}
                calcularDiasParaVencer={calcularDiasParaVencer}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para cada certificado
interface CertificadoCardProps {
  certificado: CertificadoDigital;
  onExport: (id: string, formato: 'pem' | 'der' | 'pfx') => void;
  onRenewal: (id: string, archivo: File, password: string) => void;
  getEstadoIcon: (estado: CertificadoDigital['estado']) => React.ReactNode;
  getEstadoColor: (estado: CertificadoDigital['estado']) => string;
  calcularDiasParaVencer: (fecha: string) => number;
}

function CertificadoCard({ 
  certificado, 
  onExport, 
  onRenewal,
  getEstadoIcon,
  getEstadoColor,
  calcularDiasParaVencer
}: CertificadoCardProps) {
  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [renewalFile, setRenewalFile] = useState<File | null>(null);
  const [renewalPassword, setRenewalPassword] = useState('');

  const diasParaVencer = calcularDiasParaVencer(certificado.fecha_vencimiento);
  const porcentajeVida = Math.max(0, Math.min(100, (diasParaVencer / 365) * 100));

  const handleRenewalSubmit = () => {
    if (renewalFile && renewalPassword && certificado.id) {
      onRenewal(certificado.id, renewalFile, renewalPassword);
      setRenewalDialogOpen(false);
      setRenewalFile(null);
      setRenewalPassword('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{certificado.nombre}</CardTitle>
              <p className="text-sm text-gray-600">
                Emisor: {certificado.emisor}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getEstadoIcon(certificado.estado)}
            <Badge className={getEstadoColor(certificado.estado)}>
              {certificado.estado.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Información del certificado */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Tipo:</span>
            <span className="ml-2 capitalize">{certificado.tipo.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="font-medium">Serial:</span>
            <span className="ml-2 font-mono text-xs">{certificado.serial_number}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="font-medium">Vence:</span>
            <span className="ml-2">
              {new Date(certificado.fecha_vencimiento).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-medium">Días restantes:</span>
            <span className={`ml-2 font-medium ${
              diasParaVencer <= 7 ? 'text-red-600' : 
              diasParaVencer <= 30 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {diasParaVencer > 0 ? diasParaVencer : 'Vencido'}
            </span>
          </div>
        </div>

        {/* Barra de progreso del tiempo de vida */}
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Tiempo de vida</span>
            <span>{Math.round(porcentajeVida)}%</span>
          </div>
          <Progress 
            value={porcentajeVida} 
            className={`h-2 ${
              porcentajeVida <= 10 ? 'bg-red-100' : 
              porcentajeVida <= 25 ? 'bg-yellow-100' : 'bg-green-100'
            }`}
          />
        </div>

        {/* Usos permitidos */}
        <div>
          <span className="font-medium text-sm">Usos permitidos:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {certificado.usos_permitidos.map((uso, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {uso.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex space-x-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => certificado.id && onExport(certificado.id, 'pem')}
          >
            <Download className="h-4 w-4 mr-1" />
            Exportar
          </Button>
          
          {certificado.estado === 'activo' && diasParaVencer <= 90 && (
            <Dialog open={renewalDialogOpen} onOpenChange={setRenewalDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Renovar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Renovar Certificado</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nuevo certificado (.pfx, .p12)</Label>
                    <Input
                      type="file"
                      accept=".pfx,.p12"
                      onChange={(e) => setRenewalFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <Label>Contraseña del nuevo certificado</Label>
                    <Input
                      type="password"
                      value={renewalPassword}
                      onChange={(e) => setRenewalPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleRenewalSubmit}
                    disabled={!renewalFile || !renewalPassword}
                    className="w-full"
                  >
                    Renovar Certificado
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
