// Hook para integración real con SII Chile
import { useState, useEffect } from 'react';
import { siiService, DocumentoSII, RespuestaSII, CAFInfo } from '@/services/siiService';

export interface UseSIIResult {
  enviarDocumento: (documento: DocumentoSII) => Promise<RespuestaSII>;
  consultarEstado: (trackId: string) => Promise<RespuestaSII>;
  validarRUT: (rut: string) => Promise<{ valido: boolean; razonSocial?: string; actividades?: string[] }>;
  obtenerFoliosDisponibles: (tipoDocumento: number) => Promise<CAFInfo[]>;
  generarLibroCompraVenta: (periodo: string, tipo: 'COMPRA' | 'VENTA', documentos: any[]) => Promise<RespuestaSII>;
  conectado: boolean;
  cargando: boolean;
  error: string | null;
  ultimaConsulta: Date | null;
}

export function useSII(): UseSIIResult {
  const [conectado, setConectado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ultimaConsulta, setUltimaConsulta] = useState<Date | null>(null);

  // Verificar conexión con SII al montar el hook
  useEffect(() => {
    verificarConexionSII();
  }, []);

  const verificarConexionSII = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Intentar obtener token del SII para verificar conectividad
      await siiService.obtenerToken();
      setConectado(true);
    } catch (error) {
      console.error('Error conectando con SII:', error);
      setError('No se pudo conectar con los servicios del SII');
      setConectado(false);
    } finally {
      setCargando(false);
      setUltimaConsulta(new Date());
    }
  };

  const enviarDocumento = async (documento: DocumentoSII): Promise<RespuestaSII> => {
    try {
      setCargando(true);
      setError(null);

      // Obtener folios CAF disponibles para el tipo de documento
      const folios = await siiService.obtenerCAF(documento.tipo);
      
      if (folios.length === 0) {
        throw new Error(`No hay folios CAF disponibles para el tipo de documento ${documento.tipo}`);
      }

      // Usar el primer folio disponible
      const caf = folios[0];
      
      // Verificar que el folio esté en el rango permitido
      if (documento.folio < caf.folioDesde || documento.folio > caf.folioHasta) {
        throw new Error(`El folio ${documento.folio} está fuera del rango autorizado (${caf.folioDesde}-${caf.folioHasta})`);
      }

      // Enviar documento al SII
      const resultado = await siiService.enviarDTE(documento, caf);
      
      if (!resultado.success) {
        throw new Error(resultado.error || 'Error desconocido al enviar documento');
      }

      setUltimaConsulta(new Date());
      return resultado;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error enviando documento al SII';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setCargando(false);
    }
  };

  const consultarEstado = async (trackId: string): Promise<RespuestaSII> => {
    try {
      setCargando(true);
      setError(null);

      const resultado = await siiService.consultarEstadoDTE(trackId);
      setUltimaConsulta(new Date());
      
      return resultado;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error consultando estado';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setCargando(false);
    }
  };

  const validarRUT = async (rut: string): Promise<{ valido: boolean; razonSocial?: string; actividades?: string[] }> => {
    try {
      setCargando(true);
      setError(null);

      const resultado = await siiService.validarRUTReal(rut);
      setUltimaConsulta(new Date());
      
      return resultado;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error validando RUT';
      setError(errorMessage);
      return { valido: false };
    } finally {
      setCargando(false);
    }
  };

  const obtenerFoliosDisponibles = async (tipoDocumento: number): Promise<CAFInfo[]> => {
    try {
      setCargando(true);
      setError(null);

      const folios = await siiService.obtenerCAF(tipoDocumento);
      setUltimaConsulta(new Date());
      
      return folios;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo folios CAF';
      setError(errorMessage);
      return [];
    } finally {
      setCargando(false);
    }
  };

  const generarLibroCompraVenta = async (
    periodo: string, 
    tipo: 'COMPRA' | 'VENTA', 
    documentos: any[]
  ): Promise<RespuestaSII> => {
    try {
      setCargando(true);
      setError(null);

      const resultado = await siiService.generarLibroCompraVenta(periodo, tipo, documentos);
      setUltimaConsulta(new Date());
      
      return resultado;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generando libro';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setCargando(false);
    }
  };

  return {
    enviarDocumento,
    consultarEstado,
    validarRUT,
    obtenerFoliosDisponibles,
    generarLibroCompraVenta,
    conectado,
    cargando,
    error,
    ultimaConsulta
  };
}
