'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Upload, CheckCircle, AlertCircle, FileText, Building, CreditCard, Settings, Users } from 'lucide-react';
import { ClienteOnboardingService, DatosEmpresaSII, ConfiguracionClienteInicial } from '@/services/clienteOnboardingService';
import { ImportacionMasivaService, ConfiguracionImportacion } from '@/services/importacionMasivaService';
import { validarRUT, formatRUT } from '@/lib/utils';

interface OnboardingClientesProps {
  empresaId: string;
  onClienteCreado?: (cliente: any) => void;
  onOnboardingCompleto?: () => void;
}

interface PasoOnboarding {
  id: string;
  titulo: string;
  descripcion: string;
  completado: boolean;
  activo: boolean;
  icono: React.ComponentType<any>;
}

export default function OnboardingClientes({ 
  empresaId, 
  onClienteCreado, 
  onOnboardingCompleto 
}: OnboardingClientesProps) {
  const [modalidad, setModalidad] = useState<'individual' | 'masiva'>('individual');
  const [pasoActual, setPasoActual] = useState(0);
  const [cargando, setCargando] = useState(false);
  
  // Estado para onboarding individual
  const [rutCliente, setRutCliente] = useState('');
  const [datosSII, setDatosSII] = useState<DatosEmpresaSII | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionClienteInicial>({
    planContable: 'general',
    tipoContabilidad: 'simplificada',
    regimen: 'general',
    certificadosDigitales: false,
    facturacionElectronica: true,
    integracionBancos: false
  });
  
  // Estado para importación masiva
  const [archivoImportacion, setArchivoImportacion] = useState<File | null>(null);
  const [configuracionImportacion, setConfiguracionImportacion] = useState<ConfiguracionImportacion>({
    validarConSII: true,
    crearOnboardingAutomatico: true,
    enviarNotificacionBienvenida: true,
    planPorDefecto: 'basico',
    omitirDuplicados: true
  });
  const [resultadoImportacion, setResultadoImportacion] = useState<any>(null);
  
  const [errores, setErrores] = useState<string[]>([]);
  const [exito, setExito] = useState<string>('');

  const pasosOnboarding: PasoOnboarding[] = [
    {
      id: 'validacion',
      titulo: 'Validación de Datos',
      descripcion: 'Validar RUT y obtener datos del SII',
      completado: datosSII !== null,
      activo: pasoActual === 0,
      icono: CheckCircle
    },
    {
      id: 'configuracion',
      titulo: 'Configuración Inicial',
      descripcion: 'Configurar parámetros contables y servicios',
      completado: false,
      activo: pasoActual === 1,
      icono: Settings
    },
    {
      id: 'confirmacion',
      titulo: 'Confirmación',
      descripcion: 'Revisar y confirmar la configuración',
      completado: false,
      activo: pasoActual === 2,
      icono: Building
    }
  ];

  const validarRutInput = useCallback((rut: string) => {
    const rutLimpio = rut.replace(/[.-]/g, '');
    if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
    return validarRUT(rut);
  }, []);

  const consultarDatosSII = async () => {
    if (!rutCliente || !validarRutInput(rutCliente)) {
      setErrores(['RUT inválido']);
      return;
    }

    setCargando(true);
    setErrores([]);

    try {
      const resultado = await ClienteOnboardingService.iniciarOnboarding(rutCliente, empresaId);
      
      if (resultado.success && resultado.data) {
        setDatosSII(resultado.data.datosSII);
        setConfiguracion(resultado.data.configuracionSugerida);
        setExito('Datos obtenidos correctamente del SII');
        setPasoActual(1);
      } else {
        setErrores([resultado.error || 'Error consultando datos del SII']);
      }
    } catch (error) {
      setErrores(['Error interno del sistema']);
    } finally {
      setCargando(false);
    }
  };

  const completarOnboarding = async () => {
    setCargando(true);
    setErrores([]);

    try {
      // Aquí iría la lógica para completar el onboarding
      // Por ahora simulamos el éxito
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setExito('¡Onboarding completado exitosamente!');
      onOnboardingCompleto?.();
      
      // Reset del formulario
      setTimeout(() => {
        setRutCliente('');
        setDatosSII(null);
        setPasoActual(0);
        setExito('');
      }, 3000);
      
    } catch (error) {
      setErrores(['Error completando el onboarding']);
    } finally {
      setCargando(false);
    }
  };

  const procesarImportacionMasiva = async () => {
    if (!archivoImportacion) {
      setErrores(['Debe seleccionar un archivo para importar']);
      return;
    }

    setCargando(true);
    setErrores([]);

    try {
      const resultado = await ImportacionMasivaService.procesarArchivoExcel(
        archivoImportacion,
        empresaId,
        configuracionImportacion
      );

      if (resultado.success && resultado.resultado) {
        setResultadoImportacion(resultado.resultado);
        setExito(`Importación completada: ${resultado.resultado.exitosos} clientes procesados`);
      } else {
        setErrores([resultado.error || 'Error procesando el archivo']);
      }
    } catch (error) {
      setErrores(['Error interno procesando la importación']);
    } finally {
      setCargando(false);
    }
  };

  const descargarPlantilla = () => {
    const plantilla = ImportacionMasivaService.generarPlantillaExcel();
    const url = URL.createObjectURL(plantilla);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_clientes.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Onboarding de Clientes</h1>
        <p className="text-gray-600">
          Incorpora nuevos clientes de forma individual o masiva
        </p>
      </div>

      {/* Selector de modalidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Modalidad de Incorporación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={modalidad} onValueChange={(value) => setModalidad(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">Cliente Individual</TabsTrigger>
              <TabsTrigger value="masiva">Importación Masiva</TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="space-y-6">
              {/* Progreso del onboarding */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progreso del Onboarding</span>
                  <span className="text-sm text-gray-500">{pasoActual + 1} de {pasosOnboarding.length}</span>
                </div>
                <Progress value={((pasoActual + 1) / pasosOnboarding.length) * 100} />
                
                <div className="flex justify-between">
                  {pasosOnboarding.map((paso, index) => (
                    <div key={paso.id} className="flex flex-col items-center space-y-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        paso.completado 
                          ? 'bg-green-100 text-green-600' 
                          : paso.activo 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        <paso.icono className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-medium">{paso.titulo}</div>
                        <div className="text-xs text-gray-500">{paso.descripcion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Paso 1: Validación */}
              {pasoActual === 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rut">RUT del Cliente</Label>
                    <Input
                      id="rut"
                      value={rutCliente}
                      onChange={(e) => setRutCliente(formatRUT(e.target.value))}
                      placeholder="12.345.678-9"
                      className="max-w-xs"
                    />
                  </div>
                  
                  <Button 
                    onClick={consultarDatosSII}
                    disabled={!rutCliente || !validarRutInput(rutCliente) || cargando}
                    className="w-full sm:w-auto"
                  >
                    {cargando ? 'Consultando SII...' : 'Validar y Consultar SII'}
                  </Button>

                  {datosSII && (
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-green-800 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Datos Obtenidos del SII
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-2 text-sm">
                        <div><strong>RUT:</strong> {datosSII.rut}</div>
                        <div><strong>Razón Social:</strong> {datosSII.razonSocial}</div>
                        <div><strong>Nombre Fantasía:</strong> {datosSII.nombreFantasia || 'No registra'}</div>
                        <div><strong>Giro Comercial:</strong> {datosSII.giroComercial}</div>
                        <div><strong>Dirección:</strong> {datosSII.direccion}</div>
                        <div><strong>Comuna:</strong> {datosSII.comuna}</div>
                        <div><strong>Estado:</strong> <Badge variant="outline">{datosSII.estado}</Badge></div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Paso 2: Configuración */}
              {pasoActual === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Configuración Contable</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="plan-contable">Plan Contable</Label>
                        <Select 
                          value={configuracion.planContable} 
                          onValueChange={(value) => setConfiguracion(prev => ({ ...prev, planContable: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Plan General Chileno</SelectItem>
                            <SelectItem value="pymes">Plan para PYMES</SelectItem>
                            <SelectItem value="personalizado">Personalizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tipo-contabilidad">Tipo de Contabilidad</Label>
                        <Select 
                          value={configuracion.tipoContabilidad} 
                          onValueChange={(value: any) => setConfiguracion(prev => ({ ...prev, tipoContabilidad: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simplificada">Simplificada</SelectItem>
                            <SelectItem value="completa">Completa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="regimen">Régimen Tributario</Label>
                        <Select 
                          value={configuracion.regimen} 
                          onValueChange={(value: any) => setConfiguracion(prev => ({ ...prev, regimen: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Régimen General</SelectItem>
                            <SelectItem value="pro_pyme">Pro PYME</SelectItem>
                            <SelectItem value="renta_efectiva">Renta Efectiva</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Servicios Adicionales</h3>
                      
                      <div className="space-y-3">                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="certificados"
                            checked={configuracion.certificadosDigitales}
                            onChange={(e) => 
                              setConfiguracion(prev => ({ ...prev, certificadosDigitales: e.target.checked }))
                            }
                          />
                          <Label htmlFor="certificados">Gestión de Certificados Digitales</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="facturacion"
                            checked={configuracion.facturacionElectronica}
                            onChange={(e) => 
                              setConfiguracion(prev => ({ ...prev, facturacionElectronica: e.target.checked }))
                            }
                          />
                          <Label htmlFor="facturacion">Facturación Electrónica DTE</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="bancos"
                            checked={configuracion.integracionBancos}
                            onChange={(e) => 
                              setConfiguracion(prev => ({ ...prev, integracionBancos: e.target.checked }))
                            }
                          />
                          <Label htmlFor="bancos">Integración con Bancos</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setPasoActual(0)}>
                      Volver
                    </Button>
                    <Button onClick={() => setPasoActual(2)}>
                      Continuar
                    </Button>
                  </div>
                </div>
              )}

              {/* Paso 3: Confirmación */}
              {pasoActual === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Datos del Cliente</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div><strong>RUT:</strong> {datosSII?.rut}</div>
                        <div><strong>Razón Social:</strong> {datosSII?.razonSocial}</div>
                        <div><strong>Giro:</strong> {datosSII?.giroComercial}</div>
                        <div><strong>Dirección:</strong> {datosSII?.direccion}</div>
                        <div><strong>Comuna:</strong> {datosSII?.comuna}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Configuración</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div><strong>Plan Contable:</strong> {configuracion.planContable}</div>
                        <div><strong>Tipo Contabilidad:</strong> {configuracion.tipoContabilidad}</div>
                        <div><strong>Régimen:</strong> {configuracion.regimen}</div>
                        <div><strong>Servicios:</strong></div>
                        <ul className="ml-4 space-y-1">
                          {configuracion.certificadosDigitales && <li>• Certificados Digitales</li>}
                          {configuracion.facturacionElectronica && <li>• Facturación Electrónica</li>}
                          {configuracion.integracionBancos && <li>• Integración Bancaria</li>}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setPasoActual(1)}>
                      Volver
                    </Button>
                    <Button 
                      onClick={completarOnboarding}
                      disabled={cargando}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {cargando ? 'Completando...' : 'Completar Onboarding'}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="masiva" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Importación Masiva de Clientes
                  </CardTitle>
                  <CardDescription>
                    Importa múltiples clientes desde un archivo Excel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Configuración de importación */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Configuración de Importación</h3>
                        <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="validar-sii"
                            checked={configuracionImportacion.validarConSII}
                            onChange={(e) => 
                              setConfiguracionImportacion(prev => ({ ...prev, validarConSII: e.target.checked }))
                            }
                          />
                          <Label htmlFor="validar-sii">Validar datos con SII</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="onboarding-auto"
                            checked={configuracionImportacion.crearOnboardingAutomatico}
                            onChange={(e) => 
                              setConfiguracionImportacion(prev => ({ ...prev, crearOnboardingAutomatico: e.target.checked }))
                            }
                          />
                          <Label htmlFor="onboarding-auto">Crear onboarding automático</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="notificacion"
                            checked={configuracionImportacion.enviarNotificacionBienvenida}
                            onChange={(e) => 
                              setConfiguracionImportacion(prev => ({ ...prev, enviarNotificacionBienvenida: e.target.checked }))
                            }
                          />
                          <Label htmlFor="notificacion">Enviar notificación de bienvenida</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="omitir-duplicados"
                            checked={configuracionImportacion.omitirDuplicados}
                            onChange={(e) => 
                              setConfiguracionImportacion(prev => ({ ...prev, omitirDuplicados: e.target.checked }))
                            }
                          />
                          <Label htmlFor="omitir-duplicados">Omitir duplicados</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Plan por Defecto</h3>
                      <Select 
                        value={configuracionImportacion.planPorDefecto} 
                        onValueChange={(value: any) => setConfiguracionImportacion(prev => ({ ...prev, planPorDefecto: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basico">Plan Básico</SelectItem>
                          <SelectItem value="profesional">Plan Profesional</SelectItem>
                          <SelectItem value="empresarial">Plan Empresarial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Carga de archivo */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Archivo de Importación</h3>
                      <Button variant="outline" onClick={descargarPlantilla} size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Descargar Plantilla
                      </Button>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={(e) => setArchivoImportacion(e.target.files?.[0] || null)}
                        className="hidden"
                        id="archivo-importacion"
                      />
                      <label 
                        htmlFor="archivo-importacion" 
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <Upload className="w-8 h-8 text-gray-400" />
                        <div>
                          <div className="font-medium">Haga clic para seleccionar archivo</div>
                          <div className="text-sm text-gray-500">
                            Formatos soportados: .xlsx, .xls, .csv (máximo 10MB)
                          </div>
                        </div>
                      </label>
                      
                      {archivoImportacion && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="font-medium text-blue-800">
                            Archivo seleccionado: {archivoImportacion.name}
                          </div>
                          <div className="text-sm text-blue-600">
                            Tamaño: {(archivoImportacion.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={procesarImportacionMasiva}
                      disabled={!archivoImportacion || cargando}
                      className="w-full"
                    >
                      {cargando ? 'Procesando...' : 'Procesar Importación'}
                    </Button>
                  </div>

                  {/* Resultados de importación */}
                  {resultadoImportacion && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Resultados de la Importación</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {resultadoImportacion.exitosos}
                            </div>
                            <div className="text-sm text-green-800">Exitosos</div>
                          </div>
                          <div className="p-3 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                              {resultadoImportacion.errores}
                            </div>
                            <div className="text-sm text-red-800">Errores</div>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                              {resultadoImportacion.advertencias}
                            </div>
                            <div className="text-sm text-yellow-800">Advertencias</div>
                          </div>
                        </div>

                        {resultadoImportacion.detalles.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">Detalles:</h4>
                            <div className="max-h-60 overflow-y-auto space-y-1">
                              {resultadoImportacion.detalles.map((detalle: any, index: number) => (
                                <div 
                                  key={index}
                                  className={`text-sm p-2 rounded ${
                                    detalle.tipo === 'exito' 
                                      ? 'bg-green-50 text-green-800'
                                      : detalle.tipo === 'error'
                                        ? 'bg-red-50 text-red-800'
                                        : 'bg-yellow-50 text-yellow-800'
                                  }`}
                                >
                                  <strong>Fila {detalle.fila}:</strong> {detalle.mensaje}
                                  {detalle.rut && <span className="ml-2">({detalle.rut})</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Mensajes de error y éxito */}
      {errores.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">Errores encontrados:</h4>
                <ul className="list-disc list-inside text-red-700 text-sm mt-1">
                  {errores.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {exito && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">{exito}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
