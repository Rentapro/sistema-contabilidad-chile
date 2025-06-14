'use client';

import React, { useState, useEffect } from 'react';
import { useSII } from '@/hooks/useSII';
import { DocumentoSII, CAFInfo } from '@/services/siiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Upload, FileText, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FacturaSII {
  folio: number;
  tipo: number;
  rutReceptor: string;
  fechaEmision: string;
  montoNeto: number;
  montoIVA: number;
  montoTotal: number;
  glosa: string;
  estado?: 'BORRADOR' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA' | 'PROCESANDO';
  trackId?: string;
}

export default function IntegracionSIIReal() {
  const {
    enviarDocumento,
    consultarEstado,
    validarRUT,
    obtenerFoliosDisponibles,
    conectado,
    cargando,
    error,
    ultimaConsulta
  } = useSII();

  const [factura, setFactura] = useState<FacturaSII>({
    folio: 0,
    tipo: 33, // Factura electrónica
    rutReceptor: '',
    fechaEmision: new Date().toISOString().split('T')[0],
    montoNeto: 0,
    montoIVA: 0,
    montoTotal: 0,
    glosa: '',
    estado: 'BORRADOR'
  });
  const [foliosDisponibles, setFoliosDisponibles] = useState<CAFInfo[]>([]);
  const [rutValidacion, setRutValidacion] = useState<{ valido: boolean; razonSocial?: string; actividades?: string[] }>({ valido: false });
  const [trackIdConsulta, setTrackIdConsulta] = useState('');

  // Cargar folios disponibles al montar el componente
  useEffect(() => {
    if (conectado) {
      cargarFoliosDisponibles();
    }
  }, [conectado, factura.tipo]);

  const cargarFoliosDisponibles = async () => {
    try {
      const folios = await obtenerFoliosDisponibles(factura.tipo);
      setFoliosDisponibles(folios);
      
      // Asignar próximo folio disponible automáticamente
      if (folios.length > 0) {
        const folioActual = folios[0].folioDesde; // En producción, usar próximo folio disponible
        setFactura(prev => ({ ...prev, folio: folioActual }));
      }
    } catch (error) {
      console.error('Error cargando folios:', error);
    }
  };

  const handleRutChange = async (rut: string) => {
    setFactura(prev => ({ ...prev, rutReceptor: rut }));
    
    if (rut.length >= 8) {
      try {
        const resultado = await validarRUT(rut);
        setRutValidacion(resultado);
      } catch (error) {
        console.error('Error validando RUT:', error);
      }
    }
  };

  const calcularMontos = (montoNeto: number) => {
    const iva = Math.round(montoNeto * 0.19);
    const total = montoNeto + iva;
    
    setFactura(prev => ({
      ...prev,
      montoNeto,
      montoIVA: iva,
      montoTotal: total
    }));
  };

  const enviarFacturaSII = async () => {
    try {
      const documento: DocumentoSII = {
        folio: factura.folio,
        tipo: factura.tipo,
        rutEmisor: process.env.NEXT_PUBLIC_SII_RUT_EMPRESA || '77212362-0',
        rutReceptor: factura.rutReceptor,
        fechaEmision: new Date(factura.fechaEmision),
        montoNeto: factura.montoNeto,
        montoIVA: factura.montoIVA,
        montoTotal: factura.montoTotal,
        glosa: factura.glosa,
        items: [
          {
            nombre: factura.glosa || 'Producto/Servicio',
            cantidad: 1,
            precio: factura.montoNeto
          }
        ]
      };

      setFactura(prev => ({ ...prev, estado: 'PROCESANDO' }));
      
      const resultado = await enviarDocumento(documento);
      
      if (resultado.success) {
        setFactura(prev => ({
          ...prev,
          estado: 'ENVIADA',
          trackId: resultado.trackId
        }));
      } else {
        setFactura(prev => ({ ...prev, estado: 'BORRADOR' }));
      }
    } catch (error) {
      console.error('Error enviando factura:', error);
      setFactura(prev => ({ ...prev, estado: 'BORRADOR' }));
    }
  };

  const consultarEstadoDocumento = async () => {
    if (!trackIdConsulta) return;
    
    try {
      const resultado = await consultarEstado(trackIdConsulta);
      console.log('Estado del documento:', resultado);
    } catch (error) {
      console.error('Error consultando estado:', error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colores = {
      'BORRADOR': 'bg-gray-500',
      'ENVIADA': 'bg-blue-500',
      'PROCESANDO': 'bg-yellow-500',
      'ACEPTADA': 'bg-green-500',
      'RECHAZADA': 'bg-red-500'
    };
    
    return (
      <Badge className={colores[estado as keyof typeof colores] || 'bg-gray-500'}>
        {estado}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header con estado de conexión */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Integración SII Real</h1>
          <p className="text-gray-600">Sistema de facturación electrónica conectado al SII Chile</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {conectado ? (
            <>
              <Wifi className="h-5 w-5 text-green-500" />
              <span className="text-green-600 font-medium">Conectado al SII</span>
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5 text-red-500" />
              <span className="text-red-600 font-medium">Desconectado</span>
            </>
          )}
          {ultimaConsulta && (
            <span className="text-sm text-gray-500">
              Última consulta: {ultimaConsulta.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Alertas de error */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de factura */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Nueva Factura Electrónica</span>
            </CardTitle>
            <CardDescription>
              Crear y enviar documentos tributarios al SII
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo de Documento</Label>
                <Select value={factura.tipo.toString()} onValueChange={(value) => setFactura(prev => ({ ...prev, tipo: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="33">Factura Electrónica</SelectItem>
                    <SelectItem value="34">Factura Exenta</SelectItem>
                    <SelectItem value="39">Boleta Electrónica</SelectItem>
                    <SelectItem value="41">Boleta Exenta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="folio">Folio</Label>
                <Input
                  id="folio"
                  type="number"
                  value={factura.folio}
                  onChange={(e) => setFactura(prev => ({ ...prev, folio: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="rutReceptor">RUT Receptor</Label>
              <Input
                id="rutReceptor"
                value={factura.rutReceptor}
                onChange={(e) => handleRutChange(e.target.value)}
                placeholder="12345678-9"
              />              {rutValidacion.valido && rutValidacion.razonSocial && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ {rutValidacion.razonSocial}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="fechaEmision">Fecha de Emisión</Label>
              <Input
                id="fechaEmision"
                type="date"
                value={factura.fechaEmision}
                onChange={(e) => setFactura(prev => ({ ...prev, fechaEmision: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="montoNeto">Monto Neto</Label>
              <Input
                id="montoNeto"
                type="number"
                value={factura.montoNeto}
                onChange={(e) => calcularMontos(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>IVA (19%)</Label>
                <Input value={factura.montoIVA} readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label>Total</Label>
                <Input value={factura.montoTotal} readOnly className="bg-gray-50" />
              </div>
            </div>

            <div>
              <Label htmlFor="glosa">Glosa/Descripción</Label>
              <Input
                id="glosa"
                value={factura.glosa}
                onChange={(e) => setFactura(prev => ({ ...prev, glosa: e.target.value }))}
                placeholder="Descripción del producto o servicio"
              />
            </div>

            <div className="flex justify-between items-center">
              {getEstadoBadge(factura.estado || 'BORRADOR')}
              
              <Button 
                onClick={enviarFacturaSII}
                disabled={cargando || !conectado || !rutValidacion.valido}
                className="flex items-center space-x-2"
              >
                {cargando ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>Enviar al SII</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Panel de folios CAF */}
        <Card>
          <CardHeader>
            <CardTitle>Folios CAF Disponibles</CardTitle>
            <CardDescription>
              Códigos de Autorización de Folios del SII
            </CardDescription>
          </CardHeader>
          <CardContent>
            {foliosDisponibles.length > 0 ? (
              <div className="space-y-3">
                {foliosDisponibles.map((caf, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Tipo {caf.tipoDocumento}</p>
                        <p className="text-sm text-gray-600">
                          Folios: {caf.folioDesde} - {caf.folioHasta}
                        </p>
                        <p className="text-sm text-gray-600">
                          Vence: {caf.fechaVencimiento.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={caf.vigente ? "default" : "destructive"}>
                        {caf.vigente ? "Vigente" : "Vencido"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay folios CAF disponibles</p>
                <Button variant="outline" onClick={cargarFoliosDisponibles} className="mt-2">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consulta de estado */}
        <Card>
          <CardHeader>
            <CardTitle>Consultar Estado de Documento</CardTitle>
            <CardDescription>
              Verificar el estado de un documento enviado al SII
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="trackId">Track ID</Label>
              <Input
                id="trackId"
                value={trackIdConsulta}
                onChange={(e) => setTrackIdConsulta(e.target.value)}
                placeholder="Ingrese el Track ID del documento"
              />
            </div>
            
            <Button 
              onClick={consultarEstadoDocumento}
              disabled={!trackIdConsulta || cargando}
              className="w-full"
            >
              {cargando ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Consultar Estado
            </Button>
          </CardContent>
        </Card>

        {/* Información del ambiente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Ambiente:</span>
              <Badge variant="outline">
                {process.env.NEXT_PUBLIC_SII_AMBIENTE || 'Certificación'}
              </Badge>
            </div>            <div className="flex justify-between">
              <span className="text-gray-600">RUT Empresa:</span>
              <span className="font-mono">{process.env.NEXT_PUBLIC_SII_RUT_EMPRESA || '77212362-0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Razón Social:</span>
              <span className="text-sm">Constructora Capi Zapallar SpA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado Conexión:</span>
              {conectado ? (
                <span className="text-green-600 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Conectado
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Desconectado
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
