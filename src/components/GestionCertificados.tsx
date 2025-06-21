'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Shield, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Trash2, 
  RefreshCw,
  Key,
  FileX,
  Clock
} from 'lucide-react';
import { CertificadosDigitalesService, CertificadoDigital, ValidacionCertificado } from '@/services/certificadosDigitalesService';

interface GestionCertificadosProps {
  empresaId: string;
}

export default function GestionCertificados({ empresaId }: GestionCertificadosProps) {
  const [certificados, setCertificados] = useState<CertificadoDigital[]>([]);
  const [cargando, setCargando] = useState(false);
  const [subiendoCertificado, setSubiendoCertificado] = useState(false);
  const [alertas, setAlertas] = useState<string[]>([]);
  
  // Estado para subir certificado
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [passwordCertificado, setPasswordCertificado] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    cargarCertificados();
    verificarVencimientos();
  }, [empresaId]);

  const cargarCertificados = async () => {
    setCargando(true);
    try {
      const certificadosObtenidos = await CertificadosDigitalesService.obtenerCertificados(empresaId);
      setCertificados(certificadosObtenidos);
    } catch (error) {
      console.error('Error cargando certificados:', error);
    } finally {
      setCargando(false);
    }
  };

  const verificarVencimientos = async () => {
    try {
      const verificacion = await CertificadosDigitalesService.verificarVencimientos(empresaId);
      setAlertas(verificacion.alertas);
    } catch (error) {
      console.error('Error verificando vencimientos:', error);
    }
  };

  const subirCertificado = async () => {
    if (!archivoSeleccionado || !passwordCertificado) {
      return;
    }

    setSubiendoCertificado(true);
    try {
      const resultado = await CertificadosDigitalesService.subirCertificado(
        empresaId,
        archivoSeleccionado,
        passwordCertificado,
        {
          origen: 'subida_manual',
          usuario: 'current_user' // En producción obtener del contexto
        }
      );

      if (resultado.success) {
        await cargarCertificados();
        await verificarVencimientos();
        setArchivoSeleccionado(null);
        setPasswordCertificado('');
        // Mostrar mensaje de éxito
      } else {
        // Mostrar error
        console.error('Error subiendo certificado:', resultado.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubiendoCertificado(false);
    }
  };

  const renovarCertificado = async (certificadoId: string, nuevoArchivo: File, password: string) => {
    try {
      const resultado = await CertificadosDigitalesService.renovarCertificado(
        certificadoId,
        nuevoArchivo,
        password
      );

      if (resultado.success) {
        await cargarCertificados();
        await verificarVencimientos();
      }
    } catch (error) {
      console.error('Error renovando certificado:', error);
    }
  };

  const exportarCertificado = async (certificadoId: string, formato: 'pem' | 'der' | 'pfx' = 'pem') => {
    try {
      const resultado = await CertificadosDigitalesService.exportarCertificado(certificadoId, formato);
      
      if (resultado.success && resultado.archivo) {
        const blob = new Blob([resultado.archivo]);
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
    }
  };

  const obtenerEstadoBadge = (estado: CertificadoDigital['estado']) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-green-100 text-green-700">Activo</Badge>;
      case 'vencido':
        return <Badge className="bg-red-100 text-red-700">Vencido</Badge>;
      case 'revocado':
        return <Badge className="bg-gray-100 text-gray-700">Revocado</Badge>;
      case 'suspendido':
        return <Badge className="bg-yellow-100 text-yellow-700">Suspendido</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const obtenerIconoTipo = (tipo: CertificadoDigital['tipo']) => {
    switch (tipo) {
      case 'firma_electronica':
        return <Key className="w-4 h-4" />;
      case 'dte':
        return <FileX className="w-4 h-4" />;
      case 'ssl':
        return <Shield className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const calcularDiasRestantes = (fechaVencimiento: string) => {
    const fecha = new Date(fechaVencimiento);
    const hoy = new Date();
    const diferencia = fecha.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const archivo = files.find(file => 
      file.name.endsWith('.pfx') || file.name.endsWith('.p12')
    );
    
    if (archivo) {
      setArchivoSeleccionado(archivo);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Shield className="w-8 h-8" />
          Gestión de Certificados Digitales
        </h1>
        <p className="text-gray-600">
          Administra los certificados digitales para firma electrónica y DTE
        </p>
      </div>

      {/* Alertas de vencimiento */}
      {alertas.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Alertas de certificados:</strong>
            <ul className="list-disc list-inside mt-1">
              {alertas.map((alerta, index) => (
                <li key={index}>{alerta}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Subir nuevo certificado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Subir Nuevo Certificado
          </CardTitle>
          <CardDescription>
            Sube un certificado digital en formato .pfx o .p12
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Zona de subida */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pfx,.p12"
              onChange={(e) => setArchivoSeleccionado(e.target.files?.[0] || null)}
              className="hidden"
              id="certificado-upload"
            />
            
            {archivoSeleccionado ? (
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                <div className="font-medium text-green-700">
                  Archivo seleccionado: {archivoSeleccionado.name}
                </div>
                <div className="text-sm text-gray-500">
                  Tamaño: {(archivoSeleccionado.size / 1024).toFixed(2)} KB
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setArchivoSeleccionado(null)}
                >
                  Cambiar archivo
                </Button>
              </div>
            ) : (
              <label htmlFor="certificado-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="font-medium">Haga clic o arrastre un archivo aquí</div>
                <div className="text-sm text-gray-500 mt-1">
                  Formatos soportados: .pfx, .p12 (máximo 5MB)
                </div>
              </label>
            )}
          </div>

          {/* Contraseña del certificado */}
          {archivoSeleccionado && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña del Certificado</Label>
              <Input
                id="password"
                type="password"
                value={passwordCertificado}
                onChange={(e) => setPasswordCertificado(e.target.value)}
                placeholder="Ingrese la contraseña del certificado"
                className="max-w-md"
              />
            </div>
          )}

          {/* Botón de subida */}
          <Button
            onClick={subirCertificado}
            disabled={!archivoSeleccionado || !passwordCertificado || subiendoCertificado}
            className="w-full sm:w-auto"
          >
            {subiendoCertificado ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Subir Certificado
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de certificados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Certificados Digitales ({certificados.length})
            </span>
            <Button variant="outline" size="sm" onClick={cargarCertificados}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cargando ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <div className="mt-2 text-gray-500">Cargando certificados...</div>
            </div>
          ) : certificados.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <div className="text-gray-500">No hay certificados digitales</div>
              <div className="text-sm text-gray-400 mt-1">
                Sube tu primer certificado usando el formulario de arriba
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {certificados.map((certificado) => {
                const diasRestantes = calcularDiasRestantes(certificado.fecha_vencimiento);
                const esCritico = diasRestantes <= 30;
                
                return (
                  <Card key={certificado.id} className={`${esCritico ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {obtenerIconoTipo(certificado.tipo)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">
                              {certificado.nombre}
                            </h3>
                            <div className="mt-1 text-sm text-gray-500 space-y-1">
                              <div className="flex items-center gap-4">
                                <span><strong>Emisor:</strong> {certificado.emisor}</span>
                                <span><strong>Serial:</strong> {certificado.serial_number}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Vence: {new Date(certificado.fecha_vencimiento).toLocaleDateString()}
                                </span>
                                {diasRestantes > 0 ? (
                                  <span className={`flex items-center gap-1 ${esCritico ? 'text-yellow-600 font-medium' : ''}`}>
                                    <Clock className="w-3 h-3" />
                                    {diasRestantes} días restantes
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-red-600 font-medium">
                                    <AlertTriangle className="w-3 h-3" />
                                    Vencido hace {Math.abs(diasRestantes)} días
                                  </span>
                                )}
                              </div>
                              {certificado.usos_permitidos && (
                                <div>
                                  <strong>Usos:</strong> {certificado.usos_permitidos.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {obtenerEstadoBadge(certificado.estado)}
                        </div>
                      </div>

                      {/* Barra de progreso para vencimiento */}
                      {diasRestantes > 0 && diasRestantes <= 90 && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Tiempo restante</span>
                            <span>{diasRestantes} días</span>
                          </div>
                          <Progress 
                            value={(diasRestantes / 90) * 100} 
                            className={`h-2 ${esCritico ? 'bg-yellow-200' : ''}`}
                          />
                        </div>
                      )}

                      <Separator className="my-4" />

                      {/* Acciones */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportarCertificado(certificado.id!, 'pem')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </Button>
                          
                          {certificado.estado === 'activo' && diasRestantes <= 60 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Renovar
                            </Button>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>

                      {/* Información adicional colapsible */}
                      {certificado.metadata && (
                        <details className="mt-4">
                          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                            Ver detalles técnicos
                          </summary>
                          <div className="mt-2 p-3 bg-gray-50 rounded text-xs">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(certificado.metadata, null, 2)}
                            </pre>
                          </div>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información de ayuda */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900">Información sobre Certificados Digitales</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Los certificados digitales son necesarios para la firma electrónica de documentos tributarios</p>
                <p>• Deben renovarse antes de su fecha de vencimiento para evitar interrupciones</p>
                <p>• Solo se aceptan certificados emitidos por autoridades certificadoras reconocidas por el SII</p>
                <p>• Las contraseñas de los certificados no se almacenan, solo se usan para la validación inicial</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
