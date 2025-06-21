import * as XLSX from 'xlsx';
import { supabase } from '../lib/database-service';
import { validarRUT, formatRUT } from '../lib/utils';
import { ClienteOnboardingService } from './clienteOnboardingService';

export interface ImportacionResultado {
  exitosos: number;
  errores: number;
  advertencias: number;
  detalles: {
    fila: number;
    rut?: string;
    razonSocial?: string;
    tipo: 'exito' | 'error' | 'advertencia';
    mensaje: string;
  }[];
}

export interface ClienteImportacion {
  rut: string;
  razonSocial: string;
  nombreFantasia?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  region?: string;
  giroComercial?: string;
  actividadEconomica?: string;
  regimen?: string;
}

export interface ConfiguracionImportacion {
  validarConSII: boolean;
  crearOnboardingAutomatico: boolean;
  enviarNotificacionBienvenida: boolean;
  asignarContador?: string;
  planPorDefecto: 'basico' | 'profesional' | 'empresarial';
  omitirDuplicados: boolean;
}

export class ImportacionMasivaService {
  
  /**
   * Procesa un archivo Excel con datos de clientes
   */
  static async procesarArchivoExcel(
    archivo: File,
    empresaId: string,
    configuracion: ConfiguracionImportacion
  ): Promise<{
    success: boolean;
    resultado?: ImportacionResultado;
    error?: string;
  }> {
    try {
      // Validar archivo
      if (!this.validarArchivoExcel(archivo)) {
        return {
          success: false,
          error: 'Archivo no válido. Solo se aceptan archivos .xlsx, .xls o .csv'
        };
      }

      // Leer archivo
      const datosExcel = await this.leerArchivoExcel(archivo);
      
      if (!datosExcel || datosExcel.length === 0) {
        return {
          success: false,
          error: 'El archivo no contiene datos válidos'
        };
      }

      // Procesar datos
      const resultado = await this.procesarDatosClientes(
        datosExcel,
        empresaId,
        configuracion
      );

      return {
        success: true,
        resultado
      };

    } catch (error) {
      console.error('Error procesando archivo Excel:', error);
      return {
        success: false,
        error: 'Error procesando el archivo. Verifique el formato y vuelva a intentar.'
      };
    }
  }

  /**
   * Valida que el archivo sea un Excel o CSV válido
   */
  private static validarArchivoExcel(archivo: File): boolean {
    const extensionesPermitidas = ['.xlsx', '.xls', '.csv'];
    const extension = archivo.name.toLowerCase().substring(archivo.name.lastIndexOf('.'));
    
    return extensionesPermitidas.includes(extension) && archivo.size > 0 && archivo.size < 10 * 1024 * 1024; // Máximo 10MB
  }

  /**
   * Lee los datos del archivo Excel/CSV
   */
  private static async leerArchivoExcel(archivo: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Tomar la primera hoja
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Procesar datos (primera fila como headers)
          if (jsonData.length < 2) {
            resolve([]);
            return;
          }

          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];
          
          const datosProcessados = rows
            .filter(row => row.some(cell => cell && cell.toString().trim() !== ''))
            .map((row, index) => {
              const objeto: any = {};
              headers.forEach((header, headerIndex) => {
                if (header && row[headerIndex] !== undefined) {
                  objeto[this.normalizarHeader(header)] = row[headerIndex];
                }
              });
              objeto._fila = index + 2; // +2 porque empezamos desde la fila 2 (después del header)
              return objeto;
            });

          resolve(datosProcessados);
          
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error leyendo el archivo'));
      reader.readAsArrayBuffer(archivo);
    });
  }

  /**
   * Normaliza los headers del Excel para mapear a campos conocidos
   */
  private static normalizarHeader(header: string): string {
    const mapping: Record<string, string> = {
      'rut': 'rut',
      'run': 'rut',
      'razón social': 'razonSocial',
      'razon social': 'razonSocial',
      'nombre': 'razonSocial',
      'empresa': 'razonSocial',
      'nombre fantasía': 'nombreFantasia',
      'nombre fantasia': 'nombreFantasia',
      'fantasia': 'nombreFantasia',
      'email': 'email',
      'correo': 'email',
      'correo electrónico': 'email',
      'teléfono': 'telefono',
      'telefono': 'telefono',
      'fono': 'telefono',
      'dirección': 'direccion',
      'direccion': 'direccion',
      'ciudad': 'ciudad',
      'comuna': 'ciudad',
      'región': 'region',
      'region': 'region',
      'giro': 'giroComercial',
      'giro comercial': 'giroComercial',
      'actividad': 'actividadEconomica',
      'actividad económica': 'actividadEconomica',
      'regimen': 'regimen',
      'régimen': 'regimen'
    };

    const headerNormalizado = header.toLowerCase().trim();
    return mapping[headerNormalizado] || headerNormalizado.replace(/\s+/g, '');
  }

  /**
   * Procesa los datos de clientes y los importa
   */
  private static async procesarDatosClientes(
    datos: any[],
    empresaId: string,
    configuracion: ConfiguracionImportacion
  ): Promise<ImportacionResultado> {
    const resultado: ImportacionResultado = {
      exitosos: 0,
      errores: 0,
      advertencias: 0,
      detalles: []
    };

    for (const fila of datos) {
      try {
        const cliente = await this.procesarFilaCliente(fila, empresaId, configuracion);
        
        if (cliente.tipo === 'exito') {
          resultado.exitosos++;
        } else if (cliente.tipo === 'error') {
          resultado.errores++;
        } else {
          resultado.advertencias++;
        }
        
        resultado.detalles.push(cliente);

      } catch (error) {
        resultado.errores++;
        resultado.detalles.push({
          fila: fila._fila,
          rut: fila.rut,
          razonSocial: fila.razonSocial,
          tipo: 'error',
          mensaje: `Error procesando fila: ${error instanceof Error ? error.message : 'Error desconocido'}`
        });
      }
    }

    return resultado;
  }

  /**
   * Procesa una fila individual de cliente
   */
  private static async procesarFilaCliente(
    fila: any,
    empresaId: string,
    configuracion: ConfiguracionImportacion
  ): Promise<ImportacionResultado['detalles'][0]> {
    const numeroFila = fila._fila;
    
    // Validar campos requeridos
    if (!fila.rut || !fila.razonSocial) {
      return {
        fila: numeroFila,
        rut: fila.rut,
        razonSocial: fila.razonSocial,
        tipo: 'error',
        mensaje: 'RUT y Razón Social son campos obligatorios'
      };
    }

    // Validar RUT
    if (!validarRUT(fila.rut)) {
      return {
        fila: numeroFila,
        rut: fila.rut,
        razonSocial: fila.razonSocial,
        tipo: 'error',
        mensaje: 'RUT inválido'
      };
    }

    const rutFormateado = formatRUT(fila.rut);

    // Verificar duplicados si está configurado
    if (configuracion.omitirDuplicados) {
      const { data: existente } = await supabase
        .from('clientes')
        .select('id')
        .eq('rut', rutFormateado)
        .eq('empresa_id', empresaId)
        .single();

      if (existente) {
        return {
          fila: numeroFila,
          rut: rutFormateado,
          razonSocial: fila.razonSocial,
          tipo: 'advertencia',
          mensaje: 'Cliente ya existe - omitido'
        };
      }
    }

    // Validar con SII si está configurado
    if (configuracion.validarConSII) {
      const datosSII = await ClienteOnboardingService.consultarDatosSII(rutFormateado);
      if (!datosSII) {
        return {
          fila: numeroFila,
          rut: rutFormateado,
          razonSocial: fila.razonSocial,
          tipo: 'advertencia',
          mensaje: 'No se pudo validar con SII - importado con datos del archivo'
        };
      }
    }

    // Crear cliente
    const clienteData = {
      empresa_id: empresaId,
      rut: rutFormateado,
      razon_social: fila.razonSocial.toString().trim(),
      nombre_fantasia: fila.nombreFantasia?.toString().trim() || null,
      email: this.validarEmail(fila.email?.toString().trim()) ? fila.email.toString().trim() : null,
      telefono: fila.telefono?.toString().trim() || null,
      direccion: fila.direccion?.toString().trim() || null,
      ciudad: fila.ciudad?.toString().trim() || null,
      region: fila.region?.toString().trim() || null,
      giro_comercial: fila.giroComercial?.toString().trim() || null,
      actividad_economica: fila.actividadEconomica?.toString().trim() || null,
      regimen: fila.regimen?.toString().trim() || 'general',
      plan: configuracion.planPorDefecto,
      estado: 'activo',
      contador_asignado: configuracion.asignarContador || null,
      fecha_importacion: new Date().toISOString()
    };

    const { data: clienteCreado, error } = await supabase
      .from('clientes')
      .insert(clienteData)
      .select()
      .single();

    if (error) {
      return {
        fila: numeroFila,
        rut: rutFormateado,
        razonSocial: fila.razonSocial,
        tipo: 'error',
        mensaje: `Error creando cliente: ${error.message}`
      };
    }

    // Crear onboarding automático si está configurado
    if (configuracion.crearOnboardingAutomatico) {
      await ClienteOnboardingService.iniciarOnboarding(rutFormateado, clienteCreado.id);
    }

    // Enviar notificación de bienvenida si está configurado
    if (configuracion.enviarNotificacionBienvenida) {
      await this.enviarNotificacionBienvenida(clienteCreado);
    }

    return {
      fila: numeroFila,
      rut: rutFormateado,
      razonSocial: fila.razonSocial,
      tipo: 'exito',
      mensaje: 'Cliente importado exitosamente'
    };
  }

  /**
   * Valida formato de email
   */
  private static validarEmail(email: string): boolean {
    if (!email) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Envía notificación de bienvenida al cliente
   */
  private static async enviarNotificacionBienvenida(cliente: any): Promise<void> {
    try {
      // Implementar envío de email de bienvenida
      console.log(`📧 Enviando bienvenida a ${cliente.email || cliente.razon_social}`);
      
      // TODO: Integrar con servicio de notificaciones
      // await NotificacionesService.crearNotificacion({...});
      
    } catch (error) {
      console.error('Error enviando notificación de bienvenida:', error);
    }
  }

  /**
   * Genera plantilla de Excel para importación
   */
  static generarPlantillaExcel(): Blob {
    const headers = [
      'RUT',
      'Razón Social',
      'Nombre Fantasía',
      'Email',
      'Teléfono',
      'Dirección',
      'Ciudad',
      'Región',
      'Giro Comercial',
      'Actividad Económica',
      'Régimen'
    ];

    const ejemplos = [
      [
        '12345678-9',
        'Empresa Ejemplo S.A.',
        'Ejemplo Corp',
        'contacto@ejemplo.cl',
        '+56912345678',
        'Av. Ejemplo 123',
        'Santiago',
        'Metropolitana',
        'Servicios de consultoría',
        '749900',
        'general'
      ],
      [
        '98765432-1',
        'Constructora Demo Ltda.',
        'Demo Construcción',
        'info@demo.cl',
        '+56987654321',
        'Calle Demo 456',
        'Valparaíso',
        'Valparaíso',
        'Construcción',
        '410000',
        'pro_pyme'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...ejemplos]);
    
    // Configurar ancho de columnas
    const colWidths = headers.map(() => ({ wch: 20 }));
    ws['!cols'] = colWidths;

    // Configurar estilos de header (solo disponible en versión pro de SheetJS)
    // En versión gratuita, solo podemos configurar datos básicos

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');

    // Generar archivo
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  /**
   * Valida los datos antes de la importación
   */
  static async validarDatosImportacion(
    datos: any[]
  ): Promise<{
    validos: number;
    invalidos: number;
    advertencias: string[];
    errores: string[];
  }> {
    let validos = 0;
    let invalidos = 0;
    const advertencias: string[] = [];
    const errores: string[] = [];

    for (let i = 0; i < datos.length; i++) {
      const fila = datos[i];
      const numeroFila = i + 2; // +2 porque contamos desde la fila 2 (después del header)

      // Validar campos requeridos
      if (!fila.rut || !fila.razonSocial) {
        invalidos++;
        errores.push(`Fila ${numeroFila}: RUT y Razón Social son obligatorios`);
        continue;
      }

      // Validar RUT
      if (!validarRUT(fila.rut)) {
        invalidos++;
        errores.push(`Fila ${numeroFila}: RUT inválido (${fila.rut})`);
        continue;
      }

      // Validar email si existe
      if (fila.email && !this.validarEmail(fila.email)) {
        advertencias.push(`Fila ${numeroFila}: Email inválido (${fila.email}) - se omitirá`);
      }

      // Validar campos opcionales
      if (fila.razonSocial && fila.razonSocial.length > 200) {
        advertencias.push(`Fila ${numeroFila}: Razón social muy larga - se truncará`);
      }

      validos++;
    }

    return {
      validos,
      invalidos,
      advertencias,
      errores
    };
  }

  /**
   * Exporta clientes existentes a Excel
   */
  static async exportarClientesExcel(empresaId: string): Promise<Blob> {
    try {
      const { data: clientes } = await supabase
        .from('clientes')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('razon_social');

      if (!clientes || clientes.length === 0) {
        // Crear archivo vacío con headers
        const headers = [
          'RUT', 'Razón Social', 'Nombre Fantasía', 'Email', 'Teléfono',
          'Dirección', 'Ciudad', 'Región', 'Giro Comercial', 'Actividad Económica',
          'Régimen', 'Plan', 'Estado', 'Fecha Creación'
        ];
        
        const ws = XLSX.utils.aoa_to_sheet([headers]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
        
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        return new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
      }

      // Convertir datos de clientes a formato para Excel
      const datosExcel = clientes.map(cliente => [
        cliente.rut,
        cliente.razon_social,
        cliente.nombre_fantasia || '',
        cliente.email || '',
        cliente.telefono || '',
        cliente.direccion || '',
        cliente.ciudad || '',
        cliente.region || '',
        cliente.giro_comercial || '',
        cliente.actividad_economica || '',
        cliente.regimen || 'general',
        cliente.plan || 'basico',
        cliente.estado || 'activo',
        cliente.created_at ? new Date(cliente.created_at).toLocaleDateString() : ''
      ]);

      const headers = [
        'RUT', 'Razón Social', 'Nombre Fantasía', 'Email', 'Teléfono',
        'Dirección', 'Ciudad', 'Región', 'Giro Comercial', 'Actividad Económica',
        'Régimen', 'Plan', 'Estado', 'Fecha Creación'
      ];

      const ws = XLSX.utils.aoa_to_sheet([headers, ...datosExcel]);
      
      // Configurar ancho de columnas
      const colWidths = headers.map(() => ({ wch: 15 }));
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Clientes');

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      return new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

    } catch (error) {
      console.error('Error exportando clientes:', error);
      throw new Error('Error generando archivo de exportación');
    }
  }
}
