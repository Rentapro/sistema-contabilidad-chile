import { supabase } from '../lib/database-service';
import { encrypt, decrypt } from '../lib/encryption';

export interface CertificadoDigital {
  id?: string;
  empresa_id: string;
  tipo: 'firma_electronica' | 'ssl' | 'dte' | 'otros';
  nombre: string;
  emisor: string;
  serial_number: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  estado: 'activo' | 'vencido' | 'revocado' | 'suspendido';
  archivo_pfx?: string; // Almacenado encriptado
  password_hint?: string;
  usos_permitidos: string[];
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ValidacionCertificado {
  esValido: boolean;
  detalles: {
    fechaVencimiento: Date;
    diasParaVencer: number;
    emisor: string;
    serial: string;
    usos: string[];
  };
  advertencias: string[];
  errores: string[];
}

export class CertificadosDigitalesService {
  
  /**
   * Sube y procesa un certificado digital
   */
  static async subirCertificado(
    empresaId: string,
    archivo: File,
    password: string,
    metadata: Record<string, any> = {}
  ): Promise<{
    success: boolean;
    certificado?: CertificadoDigital;
    error?: string;
  }> {
    try {
      // Validar archivo
      if (!archivo.name.endsWith('.pfx') && !archivo.name.endsWith('.p12')) {
        return {
          success: false,
          error: 'Solo se aceptan archivos .pfx o .p12'
        };
      }

      // Leer archivo como buffer
      const arrayBuffer = await archivo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Validar certificado (simulado - en producción usar librerías como node-forge)
      const validacion = await this.validarCertificado(buffer, password);
      
      if (!validacion.esValido) {
        return {
          success: false,
          error: `Certificado inválido: ${validacion.errores.join(', ')}`
        };
      }      // Encriptar el archivo PFX
      const archivoEncriptado = await encrypt(buffer.toString('base64'));

      // Crear hash del password para hint (sin almacenar el password real)
      const passwordHint = this.generarPasswordHint(password);

      // Extraer información del certificado
      const infoCertificado = await this.extraerInformacionCertificado(buffer, password);

      // Guardar en base de datos
      const certificado: CertificadoDigital = {
        empresa_id: empresaId,
        tipo: this.determinarTipoCertificado(infoCertificado.usos),
        nombre: archivo.name,
        emisor: infoCertificado.emisor,
        serial_number: infoCertificado.serial,
        fecha_emision: infoCertificado.fechaEmision,
        fecha_vencimiento: infoCertificado.fechaVencimiento,
        estado: this.determinarEstadoCertificado(validacion),
        archivo_pfx: archivoEncriptado,
        password_hint: passwordHint,
        usos_permitidos: infoCertificado.usos,
        metadata: {
          ...metadata,
          tamaño_archivo: archivo.size,
          nombre_original: archivo.name,
          upload_timestamp: new Date().toISOString()
        }
      };

      const { data, error } = await supabase
        .from('certificados_digitales')
        .insert(certificado)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        certificado: data
      };

    } catch (error) {
      console.error('Error subiendo certificado:', error);
      return {
        success: false,
        error: 'Error procesando el certificado digital'
      };
    }
  }

  /**
   * Obtiene todos los certificados de una empresa
   */
  static async obtenerCertificados(empresaId: string): Promise<CertificadoDigital[]> {
    try {
      const { data, error } = await supabase
        .from('certificados_digitales')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('fecha_vencimiento', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error obteniendo certificados:', error);
      return [];
    }
  }

  /**
   * Verifica el estado de los certificados y envía alertas
   */
  static async verificarVencimientos(empresaId: string): Promise<{
    proximosAVencer: CertificadoDigital[];
    vencidos: CertificadoDigital[];
    alertas: string[];
  }> {
    try {
      const certificados = await this.obtenerCertificados(empresaId);
      const ahora = new Date();
      const en30Dias = new Date(ahora.getTime() + (30 * 24 * 60 * 60 * 1000));

      const proximosAVencer = certificados.filter(cert => {
        const fechaVencimiento = new Date(cert.fecha_vencimiento);
        return fechaVencimiento > ahora && fechaVencimiento <= en30Dias;
      });

      const vencidos = certificados.filter(cert => {
        const fechaVencimiento = new Date(cert.fecha_vencimiento);
        return fechaVencimiento <= ahora;
      });

      const alertas: string[] = [];
      
      if (vencidos.length > 0) {
        alertas.push(`${vencidos.length} certificado(s) vencido(s)`);
      }
      
      if (proximosAVencer.length > 0) {
        alertas.push(`${proximosAVencer.length} certificado(s) próximo(s) a vencer`);
      }

      return {
        proximosAVencer,
        vencidos,
        alertas
      };

    } catch (error) {
      console.error('Error verificando vencimientos:', error);
      return {
        proximosAVencer: [],
        vencidos: [],
        alertas: ['Error verificando certificados']
      };
    }
  }

  /**
   * Renueva un certificado digital
   */
  static async renovarCertificado(
    certificadoId: string,
    nuevoArchivo: File,
    password: string
  ): Promise<{
    success: boolean;
    certificado?: CertificadoDigital;
    error?: string;
  }> {
    try {
      // Obtener certificado actual
      const { data: certificadoActual, error: errorActual } = await supabase
        .from('certificados_digitales')
        .select('*')
        .eq('id', certificadoId)
        .single();

      if (errorActual || !certificadoActual) {
        return {
          success: false,
          error: 'Certificado no encontrado'
        };
      }

      // Procesar nuevo certificado
      const resultadoSubida = await this.subirCertificado(
        certificadoActual.empresa_id,
        nuevoArchivo,
        password,
        {
          ...certificadoActual.metadata,
          renovacion_de: certificadoId,
          fecha_renovacion: new Date().toISOString()
        }
      );

      if (!resultadoSubida.success) {
        return resultadoSubida;
      }

      // Marcar certificado anterior como renovado
      await supabase
        .from('certificados_digitales')
        .update({ 
          estado: 'renovado',
          metadata: {
            ...certificadoActual.metadata,
            renovado_por: resultadoSubida.certificado?.id,
            fecha_renovacion: new Date().toISOString()
          }
        })
        .eq('id', certificadoId);

      return resultadoSubida;

    } catch (error) {
      console.error('Error renovando certificado:', error);
      return {
        success: false,
        error: 'Error en la renovación del certificado'
      };
    }
  }

  /**
   * Valida un certificado digital (simulado - en producción usar node-forge)
   */
  private static async validarCertificado(
    buffer: Buffer,
    password: string
  ): Promise<ValidacionCertificado> {
    // SIMULACIÓN - En producción implementar validación real con node-forge
    const fechaVencimiento = new Date();
    fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);
    
    const diasParaVencer = Math.floor(
      (fechaVencimiento.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return {
      esValido: true,
      detalles: {
        fechaVencimiento,
        diasParaVencer,
        emisor: 'CA Simulada',
        serial: this.generarSerial(),
        usos: ['firma_electronica', 'dte']
      },
      advertencias: diasParaVencer < 30 ? ['Certificado próximo a vencer'] : [],
      errores: []
    };
  }

  /**
   * Extrae información del certificado
   */
  private static async extraerInformacionCertificado(
    buffer: Buffer,
    password: string
  ): Promise<{
    emisor: string;
    serial: string;
    fechaEmision: string;
    fechaVencimiento: string;
    usos: string[];
  }> {
    // SIMULACIÓN - En producción extraer datos reales del certificado
    const ahora = new Date();
    const vencimiento = new Date();
    vencimiento.setFullYear(vencimiento.getFullYear() + 1);

    return {
      emisor: 'Autoridad Certificadora Simulada',
      serial: this.generarSerial(),
      fechaEmision: ahora.toISOString(),
      fechaVencimiento: vencimiento.toISOString(),
      usos: ['firma_electronica', 'dte', 'ssl']
    };
  }

  /**
   * Determina el tipo de certificado basado en sus usos
   */
  private static determinarTipoCertificado(usos: string[]): CertificadoDigital['tipo'] {
    if (usos.includes('dte')) return 'dte';
    if (usos.includes('ssl')) return 'ssl';
    if (usos.includes('firma_electronica')) return 'firma_electronica';
    return 'otros';
  }

  /**
   * Determina el estado del certificado
   */
  private static determinarEstadoCertificado(validacion: ValidacionCertificado): CertificadoDigital['estado'] {
    if (!validacion.esValido) return 'revocado';
    if (validacion.detalles.diasParaVencer <= 0) return 'vencido';
    return 'activo';
  }

  /**
   * Genera un hint para el password sin almacenar el password real
   */
  private static generarPasswordHint(password: string): string {
    if (password.length <= 4) return `**** (${password.length} caracteres)`;
    return `${password.substring(0, 2)}${'*'.repeat(password.length - 4)}${password.substring(password.length - 2)} (${password.length} caracteres)`;
  }

  /**
   * Genera un número de serie simulado
   */
  private static generarSerial(): string {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');
  }

  /**
   * Exporta un certificado para uso en aplicaciones externas
   */
  static async exportarCertificado(
    certificadoId: string,
    formato: 'pem' | 'der' | 'pfx' = 'pem'
  ): Promise<{
    success: boolean;
    archivo?: Buffer;
    nombreArchivo?: string;
    error?: string;
  }> {
    try {
      // Obtener certificado
      const { data: certificado, error } = await supabase
        .from('certificados_digitales')
        .select('*')
        .eq('id', certificadoId)
        .single();

      if (error || !certificado) {
        return {
          success: false,
          error: 'Certificado no encontrado'
        };
      }      // Desencriptar archivo
      const archivoDesencriptado = await decrypt(certificado.archivo_pfx || '');
      const buffer = Buffer.from(archivoDesencriptado, 'base64');

      // En producción, convertir entre formatos según se necesite
      const nombreArchivo = `${certificado.nombre.replace('.pfx', '').replace('.p12', '')}.${formato}`;

      return {
        success: true,
        archivo: buffer,
        nombreArchivo
      };

    } catch (error) {
      console.error('Error exportando certificado:', error);
      return {
        success: false,
        error: 'Error exportando el certificado'
      };
    }
  }
}
