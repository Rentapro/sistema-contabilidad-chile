'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ImportacionMasivaService, ImportacionResultado, ConfiguracionImportacion } from '@/services/importacionMasivaService';
import Link from 'next/link';

interface ResultadoImportacion {
  exitosos: number;
  errores: number;
  detalles: Array<{
    fila: number;
    cliente: string;
    error?: string;
    exito: boolean;
  }>;
}

export default function ImportacionMasivaPage() {
  const { data: session, status } = useSession();
  const [authorized, setAuthorized] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<ImportacionResultado | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      // Verificar rol del usuario
      const rolesPermitidos = ['admin', 'contador'];
      const userRole = (session.user as any).rol;
      setAuthorized(rolesPermitidos.includes(userRole));
    }
  }, [status, session]);

  const handleArchivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArchivo(file);
      setResultado(null);
    }
  };

  const procesarImportacion = async () => {
    if (!archivo) return;

    setProcesando(true);
    setProgreso(0);
    setResultado(null);

    try {
      // Simular progreso
      const intervalos = [10, 25, 50, 75, 90, 100];
      for (const p of intervalos) {
        setProgreso(p);
        await new Promise(resolve => setTimeout(resolve, 500));      }

      // Configuración de importación
      const configuracion: ConfiguracionImportacion = {
        validarConSII: true,
        crearOnboardingAutomatico: true,
        enviarNotificacionBienvenida: true,
        planPorDefecto: 'basico',
        omitirDuplicados: true
      };

      // Procesar archivo
      const respuesta = await ImportacionMasivaService.procesarArchivoExcel(
        archivo,
        'default',
        configuracion
      );

      if (respuesta.success && respuesta.resultado) {
        setResultado(respuesta.resultado);
      } else {
        throw new Error(respuesta.error || 'Error desconocido');
      }
      setProgreso(100);
    } catch (error) {
      console.error('Error en importación:', error);
      alert('Error al procesar el archivo. Verifique el formato.');
    } finally {
      setProcesando(false);
    }
  };

  const descargarPlantilla = () => {
    // Crear plantilla de ejemplo
    const plantilla = [
      ['nombre', 'rut', 'email', 'telefono', 'direccion', 'comuna', 'region', 'actividad_economica'],
      ['Empresa Ejemplo S.A.', '12345678-9', 'contacto@ejemplo.cl', '+56912345678', 'Av. Providencia 123', 'Providencia', 'Metropolitana', 'Comercio al por menor']
    ];

    const csvContent = plantilla.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_clientes.csv';
    link.click();
  };

  if (status === 'loading') return <p>Cargando...</p>;
  if (status === 'unauthenticated' || !authorized) {
    return <p>No tienes permisos para acceder a esta página.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <nav className="mb-4 text-sm">
        <Link href="/">← Volver al Dashboard</Link> / Importación Masiva
      </nav>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Importación Masiva de Clientes
          </h1>
          <p className="text-gray-600">
            Importe múltiples clientes desde Excel o CSV con validación automática
          </p>
        </div>

        <div className="grid gap-6">
          {/* Instrucciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Instrucciones de Importación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Formatos Soportados:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Excel (.xlsx, .xls)</li>
                    <li>• CSV (.csv)</li>
                    <li>• Máximo 1000 registros</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Campos Requeridos:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Nombre (obligatorio)</li>
                    <li>• RUT (formato chileno)</li>
                    <li>• Email (válido)</li>
                    <li>• Teléfono</li>
                    <li>• Dirección y Comuna</li>
                  </ul>
                </div>
              </div>
              <Button onClick={descargarPlantilla} variant="outline" className="w-full">
                📥 Descargar Plantilla de Ejemplo
              </Button>
            </CardContent>
          </Card>

          {/* Carga de archivo */}
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Archivo</CardTitle>
              <CardDescription>
                Seleccione el archivo Excel o CSV con los datos de los clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleArchivoChange}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />
                <Button 
                  onClick={procesarImportacion}
                  disabled={!archivo || procesando}
                  className="min-w-[120px]"
                >
                  {procesando ? 'Procesando...' : 'Importar'}
                </Button>
              </div>

              {archivo && (
                <Alert>
                  <AlertTitle>Archivo Seleccionado</AlertTitle>
                  <AlertDescription>
                    {archivo.name} ({Math.round(archivo.size / 1024)} KB)
                  </AlertDescription>
                </Alert>
              )}

              {procesando && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Procesando archivo...</span>
                    <span>{progreso}%</span>
                  </div>
                  <Progress value={progreso} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resultados */}
          {resultado && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Resultados de Importación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {resultado.exitosos}
                    </div>
                    <div className="text-sm text-green-700">
                      Clientes importados exitosamente
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {resultado.errores}
                    </div>
                    <div className="text-sm text-red-700">
                      Registros con errores
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {resultado.advertencias}
                    </div>
                    <div className="text-sm text-yellow-700">
                      Advertencias
                    </div>
                  </div>
                </div>

                {resultado.detalles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Detalle de Procesamiento:</h4>                    <div className="max-h-60 overflow-y-auto">
                      {resultado.detalles.map((detalle, index) => (
                        <div 
                          key={index}
                          className={`p-2 mb-2 rounded text-sm ${
                            detalle.tipo === 'exito'
                              ? 'bg-green-50 text-green-800' 
                              : detalle.tipo === 'error'
                              ? 'bg-red-50 text-red-800'
                              : 'bg-yellow-50 text-yellow-800'
                          }`}
                        >
                          <div className="font-medium">
                            Fila {detalle.fila}: {detalle.razonSocial || detalle.rut || 'Sin identificar'}
                          </div>
                          <div className="text-xs mt-1">
                            {detalle.mensaje}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
