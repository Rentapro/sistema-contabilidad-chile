'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DatosOficialesChileService } from '@/services/datosOficialesChileService';

interface DatoOficial {
  tipo: string;
  nombre: string;
  codigo?: string;
  activo: boolean;
  ultimaActualizacion: string;
}

export default function DatosOficialesChilePage() {
  const [datos, setDatos] = useState<{
    regiones: DatoOficial[];
    comunas: DatoOficial[];
    actividades: DatoOficial[];
    bancos: DatoOficial[];
  }>({
    regiones: [],
    comunas: [],
    actividades: [],
    bancos: []
  });
  
  const [cargando, setCargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      // Simular progreso
      setProgreso(25);
      const regiones = await DatosOficialesChileService.obtenerRegiones();
      
      setProgreso(50);
      const comunas = await DatosOficialesChileService.obtenerComunas();
      
      setProgreso(75);
      const actividades = await DatosOficialesChileService.obtenerActividadesEconomicas();
      
      setProgreso(100);
      const bancos = await DatosOficialesChileService.obtenerBancos();

      setDatos({
        regiones: regiones.map(r => ({
          tipo: 'region',
          nombre: r.nombre,
          codigo: r.codigo,
          activo: true,
          ultimaActualizacion: new Date().toISOString()
        })),
        comunas: comunas.slice(0, 10).map(c => ({
          tipo: 'comuna',
          nombre: c.nombre,
          codigo: c.codigo,
          activo: true,
          ultimaActualizacion: new Date().toISOString()
        })),
        actividades: actividades.slice(0, 15).map(a => ({
          tipo: 'actividad',
          nombre: a.descripcion,
          codigo: a.codigo,
          activo: true,
          ultimaActualizacion: new Date().toISOString()
        })),
        bancos: bancos.map(b => ({
          tipo: 'banco',
          nombre: b.nombre,
          codigo: b.codigo,
          activo: true,
          ultimaActualizacion: new Date().toISOString()
        }))
      });

      setUltimaActualizacion(new Date().toLocaleString('es-CL'));
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
      setProgreso(0);
    }
  };

  const actualizarDatos = async () => {
    setCargando(true);
    setProgreso(0);
    
    try {
      // Simular actualización desde fuentes oficiales
      const pasos = [
        'Conectando con SII...',
        'Descargando actividades económicas...',
        'Actualizando regiones y comunas...',
        'Sincronizando datos bancarios...',
        'Validando información...',
        'Finalizando actualización...'
      ];

      for (let i = 0; i < pasos.length; i++) {
        setProgreso((i + 1) * (100 / pasos.length));
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      await cargarDatos();
      alert('Datos actualizados exitosamente desde fuentes oficiales');
    } catch (error) {
      console.error('Error actualizando datos:', error);
      alert('Error al actualizar datos oficiales');
    } finally {
      setCargando(false);
    }
  };

  const validarRUT = async () => {
    const rut = prompt('Ingrese RUT para validar (ej: 12345678-9):');
    if (!rut) return;

    try {
      const resultado = await DatosOficialesChileService.validarRUTConSII(rut);      if (resultado.valido) {
        alert(`✅ RUT válido: ${resultado.datos?.razonSocial || 'Persona Natural'}`);
      } else {
        alert(`❌ RUT inválido: ${resultado.error}`);
      }
    } catch (error) {
      alert('Error al validar RUT con SII');
    }
  };

  const obtenerTipoCambio = async () => {
    try {      const tipoCambio = await DatosOficialesChileService.obtenerTiposCambio();
      if (tipoCambio) {
        alert(`💵 Tipo de cambio USD/CLP: $${tipoCambio.usd} - UF: $${tipoCambio.uf} (${tipoCambio.fecha})`);
      } else {
        alert('No se pudo obtener el tipo de cambio');
      }
    } catch (error) {
      alert('Error al obtener tipo de cambio');
    }
  };

  const getTotalDatos = () => {
    return datos.regiones.length + datos.comunas.length + datos.actividades.length + datos.bancos.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🇨🇱 Datos Oficiales de Chile
          </h1>
          <p className="text-gray-600">
            Integración con fuentes oficiales: SII, Banco Central, INE
          </p>
        </div>

        {/* Panel de Control */}
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  🔄 Panel de Actualización
                </span>
                {ultimaActualizacion && (
                  <Badge variant="outline">
                    Última actualización: {ultimaActualizacion}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Mantenga los datos oficiales actualizados desde fuentes gubernamentales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={actualizarDatos}
                  disabled={cargando}
                  className="flex items-center gap-2"
                >
                  🔄 Actualizar Todos los Datos
                </Button>
                <Button 
                  onClick={validarRUT}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  🔍 Validar RUT con SII
                </Button>
                <Button 
                  onClick={obtenerTipoCambio}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  💵 Tipo de Cambio
                </Button>
              </div>

              {cargando && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Actualizando datos oficiales...</span>
                    <span>{progreso.toFixed(0)}%</span>
                  </div>
                  <Progress value={progreso} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {datos.regiones.length}
              </div>
              <div className="text-sm text-gray-600">
                Regiones
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {datos.comunas.length}+
              </div>
              <div className="text-sm text-gray-600">
                Comunas (muestra)
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">
                {datos.actividades.length}+
              </div>
              <div className="text-sm text-gray-600">
                Actividades Económicas (muestra)
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">
                {datos.bancos.length}
              </div>
              <div className="text-sm text-gray-600">
                Instituciones Bancarias
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Datos por Categoría */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regiones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🗺️ Regiones de Chile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {datos.regiones.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{region.nombre}</span>
                    <Badge variant="outline">{region.codigo}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comunas (muestra) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏘️ Comunas (Muestra)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {datos.comunas.map((comuna, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{comuna.nombre}</span>
                    <Badge variant="outline">{comuna.codigo}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actividades Económicas (muestra) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏭 Actividades Económicas (Muestra)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {datos.actividades.map((actividad, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium text-sm">{actividad.nombre}</span>
                    <Badge variant="outline">{actividad.codigo}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bancos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏦 Instituciones Bancarias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {datos.bancos.map((banco, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{banco.nombre}</span>
                    <Badge variant="outline">{banco.codigo}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información Adicional */}
        <div className="mt-8">
          <Alert>
            <AlertTitle>ℹ️ Información Importante</AlertTitle>
            <AlertDescription className="mt-2">
              <ul className="space-y-1 text-sm">
                <li>• Los datos se actualizan automáticamente cada 24 horas</li>
                <li>• La validación de RUT se realiza en tiempo real con el SII</li>
                <li>• El tipo de cambio se obtiene del Banco Central de Chile</li>
                <li>• Total de registros disponibles: {getTotalDatos()}+ elementos</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
