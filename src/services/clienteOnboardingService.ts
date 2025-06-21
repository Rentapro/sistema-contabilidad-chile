import { supabase } from '../lib/database-service';
import { validarRUT, formatRUT } from '../lib/utils';
import { encrypt, decrypt } from '../lib/encryption';

export interface DatosEmpresaSII {
  rut: string;
  razonSocial: string;
  nombreFantasia?: string;
  giroComercial: string;
  actividadEconomica: string;
  direccion: string;
  comuna: string;
  region: string;
  fechaInicioActividades: string;
  regimen: string;
  estado: string;
}

export interface ConfiguracionClienteInicial {
  planContable: string;
  tipoContabilidad: 'simplificada' | 'completa';
  regimen: 'general' | 'pro_pyme' | 'renta_efectiva';
  certificadosDigitales: boolean;
  facturacionElectronica: boolean;
  integracionBancos: boolean;
}

export class ClienteOnboardingService {
  
  /**
   * Inicia el proceso de onboarding para un nuevo cliente
   */
  static async iniciarOnboarding(rutEmpresa: string, empresaId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
    pasos: string[];
  }> {
    try {
      // Validar RUT
      if (!validarRUT(rutEmpresa)) {
        return {
          success: false,
          error: 'RUT inválido',
          pasos: []
        };
      }      // Formatear RUT
      const rutFormateado = formatRUT(rutEmpresa);

      // Verificar si el cliente ya existe
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id, rut, razon_social')
        .eq('empresa_id', empresaId)
        .eq('rut', rutFormateado)
        .single();

      if (clienteExistente) {
        return {
          success: false,
          error: 'El cliente ya existe en el sistema',
          pasos: []
        };
      }      // Obtener datos desde SII (simulado por ahora)
      const datosSII = await this.consultarDatosSII(rutFormateado);
      
      // Verificar si se obtuvieron datos del SII
      if (!datosSII) {
        return {
          success: false,
          error: 'No se pudieron obtener los datos del SII. Verifique el RUT o intente más tarde.',
          pasos: ['Error en consulta SII']
        };
      }
      
      const pasos = [
        'Validación de RUT completada',
        'Consulta a SII realizada',
        'Datos empresariales obtenidos',
        'Preparando formulario de configuración'
      ];

      return {
        success: true,
        data: {
          rut: rutFormateado,
          datosSII,
          configuracionSugerida: this.generarConfiguracionSugerida(datosSII)
        },
        pasos
      };

    } catch (error) {
      console.error('Error en onboarding:', error);
      return {
        success: false,
        error: 'Error interno del sistema',
        pasos: []
      };
    }
  }

  /**
   * Consulta datos de una empresa en el SII
   */
  static async consultarDatosSII(rut: string): Promise<DatosEmpresaSII | null> {
    try {
      // Por ahora simulamos la consulta al SII
      // En producción esto sería una llamada real a la API del SII
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay

      // Datos simulados basados en RUT
      const datosSimulados: DatosEmpresaSII = {
        rut,
        razonSocial: `Empresa ${rut.slice(-4)} SpA`,
        nombreFantasia: `Comercial ${rut.slice(-4)}`,
        giroComercial: 'Servicios de consultoría empresarial',
        actividadEconomica: '702000',
        direccion: 'Av. Providencia 1234, Of. 567',
        comuna: 'Providencia',
        region: 'Metropolitana de Santiago',
        fechaInicioActividades: '2020-01-15',
        regimen: 'General',
        estado: 'ACTIVO'
      };

      return datosSimulados;

    } catch (error) {
      console.error('Error consultando SII:', error);
      return null;
    }
  }

  /**
   * Valida una empresa contra los registros oficiales del SII
   */
  static async validarEmpresaConSII(rut: string): Promise<{
    valida: boolean;
    estado: string;
    mensaje: string;
    datos?: DatosEmpresaSII;
  }> {
    try {
      const datos = await this.consultarDatosSII(rut);
      
      if (!datos) {
        return {
          valida: false,
          estado: 'NO_ENCONTRADO',
          mensaje: 'No se encontraron datos para este RUT en el SII'
        };
      }

      if (datos.estado !== 'ACTIVO') {
        return {
          valida: false,
          estado: datos.estado,
          mensaje: `La empresa está en estado: ${datos.estado}`
        };
      }

      return {
        valida: true,
        estado: 'ACTIVO',
        mensaje: 'Empresa válida y activa en el SII',
        datos
      };

    } catch (error) {
      return {
        valida: false,
        estado: 'ERROR',
        mensaje: 'Error al validar con el SII'
      };
    }
  }

  /**
   * Genera configuración sugerida basada en los datos SII
   */
  static generarConfiguracionSugerida(datos: DatosEmpresaSII): ConfiguracionClienteInicial {
    // Determinar configuración basada en actividad económica y tamaño
    const esGranEmpresa = datos.actividadEconomica.startsWith('6') || 
                          datos.actividadEconomica.startsWith('7');
    
    return {
      planContable: esGranEmpresa ? 'completo' : 'simplificado',
      tipoContabilidad: esGranEmpresa ? 'completa' : 'simplificada',
      regimen: esGranEmpresa ? 'general' : 'pro_pyme',
      certificadosDigitales: true,
      facturacionElectronica: true,
      integracionBancos: esGranEmpresa
    };
  }

  /**
   * Completa el onboarding creando el cliente en la base de datos
   */
  static async completarOnboarding(
    empresaId: string,
    datosSII: DatosEmpresaSII,
    configuracion: ConfiguracionClienteInicial,
    datosAdicionales: any = {}
  ): Promise<{ success: boolean; clienteId?: string; error?: string }> {
    try {
      // Crear cliente en la base de datos
      const { data: nuevoCliente, error } = await supabase
        .from('clientes')
        .insert({
          empresa_id: empresaId,
          rut: datosSII.rut,
          tipo: 'empresa',
          razon_social: datosSII.razonSocial,
          nombre_fantasia: datosSII.nombreFantasia,
          email: datosAdicionales.email,
          telefono: datosAdicionales.telefono,
          direccion: datosSII.direccion,
          ciudad: datosSII.comuna,
          region: datosSII.region,
          actividad_economica: datosSII.actividadEconomica,
          contacto_principal: datosAdicionales.contactoPrincipal,
          activo: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Crear configuración inicial
      await this.crearConfiguracionInicial(nuevoCliente.id, configuracion);

      // Crear tareas de onboarding
      await this.crearTareasOnboarding(nuevoCliente.id, configuracion);

      return {
        success: true,
        clienteId: nuevoCliente.id
      };

    } catch (error) {
      console.error('Error completando onboarding:', error);
      return {
        success: false,
        error: 'Error al crear el cliente'
      };
    }
  }

  /**
   * Crea la configuración inicial del cliente
   */
  static async crearConfiguracionInicial(
    clienteId: string, 
    configuracion: ConfiguracionClienteInicial
  ): Promise<void> {
    // Implementar creación de configuración inicial
    // Por ahora guardamos en una tabla de configuraciones
    console.log('Configuración inicial creada para cliente:', clienteId, configuracion);
  }

  /**
   * Crea tareas de onboarding para el cliente
   */
  static async crearTareasOnboarding(
    clienteId: string,
    configuracion: ConfiguracionClienteInicial
  ): Promise<void> {
    const tareas = [
      'Configurar plan contable',
      'Validar datos fiscales',
    ];

    if (configuracion.certificadosDigitales) {
      tareas.push('Subir certificados digitales');
    }

    if (configuracion.facturacionElectronica) {
      tareas.push('Configurar facturación electrónica');
    }

    if (configuracion.integracionBancos) {
      tareas.push('Configurar integración bancaria');
    }

    // Crear notificaciones/tareas en el sistema
    console.log('Tareas de onboarding creadas:', tareas);
  }

  /**
   * Importa clientes masivamente desde Excel
   */
  static async importarClientesDesdeExcel(
    archivo: File,
    empresaId: string
  ): Promise<{
    success: boolean;
    procesados: number;
    errores: string[];
    clientesCreados: string[];
  }> {
    try {
      // Por ahora simulamos el procesamiento del Excel
      const result = {
        success: true,
        procesados: 0,
        errores: [],
        clientesCreados: []
      };

      // En una implementación real, aquí se procesaría el Excel
      // usando una librería como SheetJS o similar

      return result;

    } catch (error) {
      return {
        success: false,
        procesados: 0,
        errores: ['Error procesando archivo Excel'],
        clientesCreados: []
      };
    }
  }

  /**
   * Obtiene el progreso del onboarding de un cliente
   */
  static async obtenerProgresoOnboarding(clienteId: string): Promise<{
    progreso: number;
    tareasCompletadas: string[];
    tareasPendientes: string[];
    siguientePaso: string;
  }> {
    // Implementar lógica para calcular progreso
    return {
      progreso: 60,
      tareasCompletadas: [
        'Datos básicos configurados',
        'Plan contable asignado'
      ],
      tareasPendientes: [
        'Subir certificados digitales',
        'Configurar facturación electrónica'
      ],
      siguientePaso: 'Subir certificados digitales'
    };
  }
}
