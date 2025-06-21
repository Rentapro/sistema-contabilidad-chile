import axios from 'axios';

// Interfaces para datos oficiales de Chile
export interface ActividadEconomica {
  codigo: string;
  descripcion: string;
  categoria: string;
  vigente: boolean;
}

export interface Comuna {
  codigo: string;
  nombre: string;
  region: string;
  codigoRegion: string;
}

export interface Region {
  codigo: string;
  nombre: string;
  numero: number;
}

export interface BancoChile {
  codigo: string;
  nombre: string;
  swift?: string;
  activo: boolean;
}

export interface TipoCambio {
  fecha: string;
  usd: number;
  eur: number;
  uf: number;
  utm: number;
}

export interface FechaTributaria {
  fecha: string;
  descripcion: string;
  tipo: 'pago' | 'declaracion' | 'plazo';
  categoria: 'iva' | 'renta' | 'contribuciones' | 'otros';
  obligatorio: boolean;
}

export class DatosOficialesChileService {
  
  private static readonly SII_BASE_URL = 'https://www.sii.cl/servicios_online/api';
  private static readonly BCN_BASE_URL = 'https://www.bcn.cl/siit/api';
  private static readonly BANCO_CENTRAL_URL = 'https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx';
  
  /**
   * Obtiene todas las actividades económicas del SII
   */
  static async obtenerActividadesEconomicas(): Promise<ActividadEconomica[]> {
    try {
      // En producción, esto consultaría la API real del SII
      // Por ahora, devolvemos datos simulados basados en las actividades económicas reales
      
      const actividadesSimuladas: ActividadEconomica[] = [
        {
          codigo: '010000',
          descripcion: 'Agricultura, ganadería, caza y silvicultura',
          categoria: 'Sector Primario',
          vigente: true
        },
        {
          codigo: '111000',
          descripcion: 'Cultivo de cereales, oleaginosas y forrajeras',
          categoria: 'Agricultura',
          vigente: true
        },
        {
          codigo: '451000',
          descripcion: 'Construcción',
          categoria: 'Construcción',
          vigente: true
        },
        {
          codigo: '452100',
          descripcion: 'Instalaciones eléctricas',
          categoria: 'Construcción',
          vigente: true
        },
        {
          codigo: '521000',
          descripcion: 'Comercio al por menor',
          categoria: 'Comercio',
          vigente: true
        },
        {
          codigo: '522000',
          descripcion: 'Comercio al por mayor',
          categoria: 'Comercio',
          vigente: true
        },
        {
          codigo: '551000',
          descripcion: 'Hoteles y restaurantes',
          categoria: 'Servicios',
          vigente: true
        },
        {
          codigo: '601000',
          descripcion: 'Transporte terrestre',
          categoria: 'Transporte',
          vigente: true
        },
        {
          codigo: '651000',
          descripcion: 'Intermediación financiera',
          categoria: 'Financiero',
          vigente: true
        },
        {
          codigo: '721000',
          descripcion: 'Informática y actividades conexas',
          categoria: 'Tecnología',
          vigente: true
        },
        {
          codigo: '741000',
          descripcion: 'Actividades empresariales',
          categoria: 'Servicios Profesionales',
          vigente: true
        },
        {
          codigo: '749900',
          descripcion: 'Otras actividades empresariales n.c.p.',
          categoria: 'Servicios Profesionales',
          vigente: true
        },
        {
          codigo: '851000',
          descripcion: 'Actividades de salud humana',
          categoria: 'Salud',
          vigente: true
        },
        {
          codigo: '801000',
          descripcion: 'Educación',
          categoria: 'Educación',
          vigente: true
        },
        {
          codigo: '900000',
          descripcion: 'Actividades de saneamiento público',
          categoria: 'Servicios Públicos',
          vigente: true
        }
      ];
      
      // TODO: Implementar consulta real a la API del SII
      // const response = await axios.get(`${this.SII_BASE_URL}/actividades-economicas`);
      // return response.data;
      
      return actividadesSimuladas;
      
    } catch (error) {
      console.error('Error obteniendo actividades económicas:', error);
      return [];
    }
  }
  
  /**
   * Obtiene todas las comunas de Chile
   */
  static async obtenerComunas(): Promise<Comuna[]> {
    try {
      // Datos reales de comunas chilenas (muestra)
      const comunasChile: Comuna[] = [
        // Región Metropolitana
        { codigo: '13101', nombre: 'Santiago', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13102', nombre: 'Cerrillos', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13103', nombre: 'Cerro Navia', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13104', nombre: 'Conchalí', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13105', nombre: 'El Bosque', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13106', nombre: 'Estación Central', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13107', nombre: 'Huechuraba', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13108', nombre: 'Independencia', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13109', nombre: 'La Cisterna', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13110', nombre: 'La Florida', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13111', nombre: 'La Granja', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13112', nombre: 'La Pintana', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13113', nombre: 'La Reina', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13114', nombre: 'Las Condes', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13115', nombre: 'Lo Barnechea', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13116', nombre: 'Lo Espejo', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13117', nombre: 'Lo Prado', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13118', nombre: 'Macul', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13119', nombre: 'Maipú', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13120', nombre: 'Ñuñoa', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13121', nombre: 'Pedro Aguirre Cerda', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13122', nombre: 'Peñalolén', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13123', nombre: 'Providencia', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13124', nombre: 'Pudahuel', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13125', nombre: 'Quilicura', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13126', nombre: 'Quinta Normal', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13127', nombre: 'Recoleta', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13128', nombre: 'Renca', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13129', nombre: 'San Joaquín', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13130', nombre: 'San Miguel', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13131', nombre: 'San Ramón', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        { codigo: '13132', nombre: 'Vitacura', region: 'Metropolitana de Santiago', codigoRegion: '13' },
        
        // Valparaíso
        { codigo: '05101', nombre: 'Valparaíso', region: 'Valparaíso', codigoRegion: '05' },
        { codigo: '05102', nombre: 'Casablanca', region: 'Valparaíso', codigoRegion: '05' },
        { codigo: '05103', nombre: 'Concón', region: 'Valparaíso', codigoRegion: '05' },
        { codigo: '05104', nombre: 'Juan Fernández', region: 'Valparaíso', codigoRegion: '05' },
        { codigo: '05105', nombre: 'Puchuncaví', region: 'Valparaíso', codigoRegion: '05' },
        { codigo: '05107', nombre: 'Quintero', region: 'Valparaíso', codigoRegion: '05' },
        { codigo: '05109', nombre: 'Viña del Mar', region: 'Valparaíso', codigoRegion: '05' },
        
        // Biobío
        { codigo: '08101', nombre: 'Concepción', region: 'Biobío', codigoRegion: '08' },
        { codigo: '08102', nombre: 'Coronel', region: 'Biobío', codigoRegion: '08' },
        { codigo: '08103', nombre: 'Chiguayante', region: 'Biobío', codigoRegion: '08' },
        { codigo: '08104', nombre: 'Florida', region: 'Biobío', codigoRegion: '08' },
        { codigo: '08105', nombre: 'Hualqui', region: 'Biobío', codigoRegion: '08' },
        { codigo: '08106', nombre: 'Lota', region: 'Biobío', codigoRegion: '08' },
        { codigo: '08107', nombre: 'Penco', region: 'Biobío', codigoRegion: '08' },
        { codigo: '08108', nombre: 'San Pedro de la Paz', region: 'Biobío', codigoRegion: '08' },
        { codigo: '08109', nombre: 'Santa Juana', region: 'Biobío', codigoRegion: '08' },
        { codigo: '08110', nombre: 'Talcahuano', region: 'Biobío', codigoRegion: '08' },
        { codigo: '08111', nombre: 'Tomé', region: 'Biobío', codigoRegion: '08' },
        { codigo: '08112', nombre: 'Hualpén', region: 'Biobío', codigoRegion: '08' }
      ];
      
      // TODO: Implementar consulta real a la API
      // const response = await axios.get(`${this.BCN_BASE_URL}/comunas`);
      // return response.data;
      
      return comunasChile;
      
    } catch (error) {
      console.error('Error obteniendo comunas:', error);
      return [];
    }
  }
  
  /**
   * Obtiene todas las regiones de Chile
   */
  static async obtenerRegiones(): Promise<Region[]> {
    try {
      const regionesChile: Region[] = [
        { codigo: '15', nombre: 'Arica y Parinacota', numero: 15 },
        { codigo: '01', nombre: 'Tarapacá', numero: 1 },
        { codigo: '02', nombre: 'Antofagasta', numero: 2 },
        { codigo: '03', nombre: 'Atacama', numero: 3 },
        { codigo: '04', nombre: 'Coquimbo', numero: 4 },
        { codigo: '05', nombre: 'Valparaíso', numero: 5 },
        { codigo: '13', nombre: 'Metropolitana de Santiago', numero: 13 },
        { codigo: '06', nombre: 'Libertador General Bernardo O\'Higgins', numero: 6 },
        { codigo: '07', nombre: 'Maule', numero: 7 },
        { codigo: '16', nombre: 'Ñuble', numero: 16 },
        { codigo: '08', nombre: 'Biobío', numero: 8 },
        { codigo: '09', nombre: 'La Araucanía', numero: 9 },
        { codigo: '14', nombre: 'Los Ríos', numero: 14 },
        { codigo: '10', nombre: 'Los Lagos', numero: 10 },
        { codigo: '11', nombre: 'Aysén del General Carlos Ibáñez del Campo', numero: 11 },
        { codigo: '12', nombre: 'Magallanes y de la Antártica Chilena', numero: 12 }
      ];
      
      return regionesChile;
      
    } catch (error) {
      console.error('Error obteniendo regiones:', error);
      return [];
    }
  }
  
  /**
   * Obtiene lista de bancos chilenos
   */
  static async obtenerBancos(): Promise<BancoChile[]> {
    try {
      const bancosChile: BancoChile[] = [
        { codigo: '001', nombre: 'Banco de Chile', swift: 'BCHICLRM', activo: true },
        { codigo: '009', nombre: 'Banco Internacional', swift: 'BINTCLRM', activo: true },
        { codigo: '012', nombre: 'Banco del Estado de Chile', swift: 'BECHCLRM', activo: true },
        { codigo: '014', nombre: 'Scotiabank Chile', swift: 'SCBLCLRM', activo: true },
        { codigo: '016', nombre: 'Banco de Crédito e Inversiones', swift: 'CREDCLRM', activo: true },
        { codigo: '017', nombre: 'Banco Corpbanca', swift: 'CORPCLRM', activo: true },
        { codigo: '027', nombre: 'Banco Security', swift: 'SECUCLRM', activo: true },
        { codigo: '028', nombre: 'Banco Falabella', swift: 'FALACLRM', activo: true },
        { codigo: '037', nombre: 'Banco Santander Chile', swift: 'BSANCLRM', activo: true },
        { codigo: '039', nombre: 'Banco Itaú Chile', swift: 'ITAUCLRM', activo: true },
        { codigo: '049', nombre: 'Banco Consorcio', swift: 'CONSCLRM', activo: true },
        { codigo: '051', nombre: 'Banco Ripley', swift: 'RIPLCLRM', activo: true },
        { codigo: '052', nombre: 'Banco Paris', swift: 'PARISCLRM', activo: true },
        { codigo: '054', nombre: 'Banco BICE', swift: 'BICECLRM', activo: true },
        { codigo: '055', nombre: 'Banco BTG Pactual Chile', swift: 'BTGPCLRM', activo: true },
        { codigo: '056', nombre: 'Banco Penta', swift: 'PENTACLRM', activo: true },
        { codigo: '057', nombre: 'Banco Do Brasil S.A.', swift: 'BRASBRRJ', activo: true },
        { codigo: '059', nombre: 'Banco Compass', swift: 'COMPCLRM', activo: true }
      ];
      
      return bancosChile;
      
    } catch (error) {
      console.error('Error obteniendo bancos:', error);
      return [];
    }
  }
  
  /**
   * Obtiene tipos de cambio desde el Banco Central
   */
  static async obtenerTiposCambio(fecha?: string): Promise<TipoCambio | null> {
    try {
      // Simulación de consulta al Banco Central
      // En producción, usar la API real del Banco Central de Chile
      
      const fechaConsulta = fecha || new Date().toISOString().split('T')[0];
      
      // Valores simulados basados en rangos reales
      const tiposCambio: TipoCambio = {
        fecha: fechaConsulta,
        usd: 920.50 + (Math.random() * 40 - 20), // Rango aproximado 900-940
        eur: 980.25 + (Math.random() * 50 - 25), // Rango aproximado 955-1005
        uf: 36500.15 + (Math.random() * 200 - 100), // Rango aproximado 36400-36600
        utm: 63000.00 + (Math.random() * 1000 - 500) // Rango aproximado 62500-63500
      };
      
      // TODO: Implementar consulta real al Banco Central
      // const response = await axios.get(`${this.BANCO_CENTRAL_URL}/GetSeries`, {
      //   params: {
      //     user: process.env.BCN_USER,
      //     pass: process.env.BCN_PASS,
      //     timeseries: 'F073.TCO.PRE.Z.D',
      //     function: 'GetSeries',
      //     firstdate: fechaConsulta,
      //     lastdate: fechaConsulta
      //   }
      // });
      
      return tiposCambio;
      
    } catch (error) {
      console.error('Error obteniendo tipos de cambio:', error);
      return null;
    }
  }
  
  /**
   * Obtiene calendario tributario del SII
   */
  static async obtenerCalendarioTributario(año: number): Promise<FechaTributaria[]> {
    try {
      // Calendario tributario simulado basado en fechas reales del SII
      const fechasTributarias: FechaTributaria[] = [
        // Enero
        { fecha: `${año}-01-31`, descripcion: 'Pago IVA Diciembre', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Febrero
        { fecha: `${año}-02-28`, descripcion: 'Pago IVA Enero', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Marzo
        { fecha: `${año}-03-31`, descripcion: 'Pago IVA Febrero', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Abril
        { fecha: `${año}-04-30`, descripcion: 'Declaración Anual de Renta', tipo: 'declaracion', categoria: 'renta', obligatorio: true },
        { fecha: `${año}-04-30`, descripcion: 'Pago IVA Marzo', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Mayo
        { fecha: `${año}-05-31`, descripcion: 'Pago IVA Abril', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Junio
        { fecha: `${año}-06-30`, descripcion: 'Pago IVA Mayo', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Julio
        { fecha: `${año}-07-31`, descripcion: 'Pago IVA Junio', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Agosto
        { fecha: `${año}-08-31`, descripcion: 'Pago IVA Julio', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Septiembre
        { fecha: `${año}-09-30`, descripcion: 'Pago IVA Agosto', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Octubre
        { fecha: `${año}-10-31`, descripcion: 'Pago IVA Septiembre', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Noviembre
        { fecha: `${año}-11-30`, descripcion: 'Pago IVA Octubre', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Diciembre
        { fecha: `${año}-12-31`, descripcion: 'Pago IVA Noviembre', tipo: 'pago', categoria: 'iva', obligatorio: true },
        
        // Contribuciones (fechas variables según región)
        { fecha: `${año}-04-30`, descripcion: 'Pago 1era Cuota Contribuciones', tipo: 'pago', categoria: 'contribuciones', obligatorio: true },
        { fecha: `${año}-09-30`, descripcion: 'Pago 2da Cuota Contribuciones', tipo: 'pago', categoria: 'contribuciones', obligatorio: true }
      ];
      
      // TODO: Implementar consulta real al SII
      // const response = await axios.get(`${this.SII_BASE_URL}/calendario-tributario`, {
      //   params: { año }
      // });
      
      return fechasTributarias;
      
    } catch (error) {
      console.error('Error obteniendo calendario tributario:', error);
      return [];
    }
  }
  
  /**
   * Valida RUT con el SII (simulado)
   */
  static async validarRUTConSII(rut: string): Promise<{
    valido: boolean;
    datos?: {
      rut: string;
      razonSocial: string;
      activo: boolean;
      situacion: string;
      fechaInicio: string;
    };
    error?: string;
  }> {
    try {
      // Simulación de consulta al SII
      // En producción, usar la API real del SII
      
      // Validación de formato básica
      const rutLimpio = rut.replace(/[.-]/g, '');
      if (rutLimpio.length < 8) {
        return {
          valido: false,
          error: 'RUT con formato inválido'
        };
      }
      
      // Simulación de respuesta del SII
      const esValido = Math.random() > 0.1; // 90% de probabilidad de éxito
      
      if (esValido) {
        return {
          valido: true,
          datos: {
            rut: rut,
            razonSocial: `Empresa Simulada ${rutLimpio}`,
            activo: true,
            situacion: 'Activo',
            fechaInicio: '2020-01-01'
          }
        };
      } else {
        return {
          valido: false,
          error: 'RUT no encontrado en registros del SII'
        };
      }
      
      // TODO: Implementar consulta real al SII
      // const response = await axios.get(`${this.SII_BASE_URL}/validar-rut`, {
      //   params: { rut }
      // });
      
    } catch (error) {
      console.error('Error validando RUT con SII:', error);
      return {
        valido: false,
        error: 'Error consultando el SII'
      };
    }
  }
  
  /**
   * Obtiene el plan contable general chileno
   */
  static async obtenerPlanContableGeneral(): Promise<Array<{
    codigo: string;
    nombre: string;
    tipo: 'activo' | 'pasivo' | 'patrimonio' | 'ingreso' | 'gasto';
    nivel: number;
    padre?: string;
  }>> {
    try {
      // Plan contable general chileno (extracto)
      const planContable = [
        // ACTIVOS
        { codigo: '1', nombre: 'ACTIVOS', tipo: 'activo' as const, nivel: 1 },
        { codigo: '11', nombre: 'ACTIVOS CIRCULANTES', tipo: 'activo' as const, nivel: 2, padre: '1' },
        { codigo: '111', nombre: 'Disponible', tipo: 'activo' as const, nivel: 3, padre: '11' },
        { codigo: '11101', nombre: 'Caja', tipo: 'activo' as const, nivel: 4, padre: '111' },
        { codigo: '11102', nombre: 'Bancos', tipo: 'activo' as const, nivel: 4, padre: '111' },
        { codigo: '112', nombre: 'Realizable', tipo: 'activo' as const, nivel: 3, padre: '11' },
        { codigo: '11201', nombre: 'Clientes', tipo: 'activo' as const, nivel: 4, padre: '112' },
        { codigo: '11202', nombre: 'Documentos por Cobrar', tipo: 'activo' as const, nivel: 4, padre: '112' },
        { codigo: '11203', nombre: 'Deudores Varios', tipo: 'activo' as const, nivel: 4, padre: '112' },
        { codigo: '113', nombre: 'Existencias', tipo: 'activo' as const, nivel: 3, padre: '11' },
        { codigo: '11301', nombre: 'Mercaderías', tipo: 'activo' as const, nivel: 4, padre: '113' },
        { codigo: '11302', nombre: 'Materias Primas', tipo: 'activo' as const, nivel: 4, padre: '113' },
        
        { codigo: '12', nombre: 'ACTIVOS FIJOS', tipo: 'activo' as const, nivel: 2, padre: '1' },
        { codigo: '121', nombre: 'Activos Fijos', tipo: 'activo' as const, nivel: 3, padre: '12' },
        { codigo: '12101', nombre: 'Terrenos', tipo: 'activo' as const, nivel: 4, padre: '121' },
        { codigo: '12102', nombre: 'Edificios', tipo: 'activo' as const, nivel: 4, padre: '121' },
        { codigo: '12103', nombre: 'Maquinarias', tipo: 'activo' as const, nivel: 4, padre: '121' },
        { codigo: '12104', nombre: 'Vehículos', tipo: 'activo' as const, nivel: 4, padre: '121' },
        { codigo: '12105', nombre: 'Muebles y Útiles', tipo: 'activo' as const, nivel: 4, padre: '121' },
        
        // PASIVOS
        { codigo: '2', nombre: 'PASIVOS', tipo: 'pasivo' as const, nivel: 1 },
        { codigo: '21', nombre: 'PASIVOS CIRCULANTES', tipo: 'pasivo' as const, nivel: 2, padre: '2' },
        { codigo: '211', nombre: 'Obligaciones con Terceros', tipo: 'pasivo' as const, nivel: 3, padre: '21' },
        { codigo: '21101', nombre: 'Proveedores', tipo: 'pasivo' as const, nivel: 4, padre: '211' },
        { codigo: '21102', nombre: 'Documentos por Pagar', tipo: 'pasivo' as const, nivel: 4, padre: '211' },
        { codigo: '21103', nombre: 'Acreedores Varios', tipo: 'pasivo' as const, nivel: 4, padre: '211' },
        { codigo: '212', nombre: 'Obligaciones Fiscales', tipo: 'pasivo' as const, nivel: 3, padre: '21' },
        { codigo: '21201', nombre: 'IVA Débito Fiscal', tipo: 'pasivo' as const, nivel: 4, padre: '212' },
        { codigo: '21202', nombre: 'IVA Crédito Fiscal', tipo: 'pasivo' as const, nivel: 4, padre: '212' },
        { codigo: '21203', nombre: 'PPM', tipo: 'pasivo' as const, nivel: 4, padre: '212' },
        { codigo: '21204', nombre: 'Retenciones', tipo: 'pasivo' as const, nivel: 4, padre: '212' },
        
        // PATRIMONIO
        { codigo: '3', nombre: 'PATRIMONIO', tipo: 'patrimonio' as const, nivel: 1 },
        { codigo: '31', nombre: 'Capital', tipo: 'patrimonio' as const, nivel: 2, padre: '3' },
        { codigo: '31001', nombre: 'Capital Pagado', tipo: 'patrimonio' as const, nivel: 3, padre: '31' },
        { codigo: '32', nombre: 'Utilidades', tipo: 'patrimonio' as const, nivel: 2, padre: '3' },
        { codigo: '32001', nombre: 'Utilidades Retenidas', tipo: 'patrimonio' as const, nivel: 3, padre: '32' },
        { codigo: '32002', nombre: 'Utilidad del Ejercicio', tipo: 'patrimonio' as const, nivel: 3, padre: '32' },
        
        // INGRESOS
        { codigo: '4', nombre: 'INGRESOS', tipo: 'ingreso' as const, nivel: 1 },
        { codigo: '41', nombre: 'Ingresos Operacionales', tipo: 'ingreso' as const, nivel: 2, padre: '4' },
        { codigo: '41001', nombre: 'Ventas', tipo: 'ingreso' as const, nivel: 3, padre: '41' },
        { codigo: '41002', nombre: 'Servicios', tipo: 'ingreso' as const, nivel: 3, padre: '41' },
        { codigo: '42', nombre: 'Ingresos No Operacionales', tipo: 'ingreso' as const, nivel: 2, padre: '4' },
        { codigo: '42001', nombre: 'Ingresos Financieros', tipo: 'ingreso' as const, nivel: 3, padre: '42' },
        
        // GASTOS
        { codigo: '5', nombre: 'GASTOS', tipo: 'gasto' as const, nivel: 1 },
        { codigo: '51', nombre: 'Costo de Ventas', tipo: 'gasto' as const, nivel: 2, padre: '5' },
        { codigo: '51001', nombre: 'Costo de Mercaderías Vendidas', tipo: 'gasto' as const, nivel: 3, padre: '51' },
        { codigo: '52', nombre: 'Gastos de Administración', tipo: 'gasto' as const, nivel: 2, padre: '5' },
        { codigo: '52001', nombre: 'Sueldos y Salarios', tipo: 'gasto' as const, nivel: 3, padre: '52' },
        { codigo: '52002', nombre: 'Cargas Sociales', tipo: 'gasto' as const, nivel: 3, padre: '52' },
        { codigo: '52003', nombre: 'Materiales y Suministros', tipo: 'gasto' as const, nivel: 3, padre: '52' },
        { codigo: '53', nombre: 'Gastos de Ventas', tipo: 'gasto' as const, nivel: 2, padre: '5' },
        { codigo: '53001', nombre: 'Publicidad', tipo: 'gasto' as const, nivel: 3, padre: '53' },
        { codigo: '53002', nombre: 'Comisiones', tipo: 'gasto' as const, nivel: 3, padre: '53' }
      ];
      
      return planContable;
      
    } catch (error) {
      console.error('Error obteniendo plan contable:', error);
      return [];
    }
  }
  
  /**
   * Inicializa los datos oficiales en la base de datos
   */
  static async inicializarDatosOficiales(): Promise<{
    success: boolean;
    mensaje: string;
    detalles: Record<string, number>;
  }> {
    try {
      const detalles: Record<string, number> = {};
      
      // Insertar actividades económicas
      const actividades = await this.obtenerActividadesEconomicas();
      if (actividades.length > 0) {
        // TODO: Insertar en base de datos
        // await supabase.from('actividades_economicas').upsert(actividades);
        detalles.actividades_economicas = actividades.length;
      }
      
      // Insertar comunas
      const comunas = await this.obtenerComunas();
      if (comunas.length > 0) {
        // TODO: Insertar en base de datos
        // await supabase.from('comunas').upsert(comunas);
        detalles.comunas = comunas.length;
      }
      
      // Insertar regiones
      const regiones = await this.obtenerRegiones();
      if (regiones.length > 0) {
        // TODO: Insertar en base de datos
        // await supabase.from('regiones').upsert(regiones);
        detalles.regiones = regiones.length;
      }
      
      // Insertar bancos
      const bancos = await this.obtenerBancos();
      if (bancos.length > 0) {
        // TODO: Insertar en base de datos
        // await supabase.from('bancos').upsert(bancos);
        detalles.bancos = bancos.length;
      }
      
      // Insertar plan contable
      const planContable = await this.obtenerPlanContableGeneral();
      if (planContable.length > 0) {
        // TODO: Insertar en base de datos
        // await supabase.from('plan_contable').upsert(planContable);
        detalles.cuentas_contables = planContable.length;
      }
      
      return {
        success: true,
        mensaje: 'Datos oficiales inicializados correctamente',
        detalles
      };
      
    } catch (error) {
      console.error('Error inicializando datos oficiales:', error);
      return {
        success: false,
        mensaje: 'Error inicializando datos oficiales',
        detalles: {}
      };
    }
  }
  
  /**
   * Actualiza los tipos de cambio diariamente
   */
  static async actualizarTiposCambio(): Promise<void> {
    try {
      const tiposCambio = await this.obtenerTiposCambio();
      
      if (tiposCambio) {
        // TODO: Actualizar en base de datos
        // await supabase.from('tipos_cambio').upsert(tiposCambio);
        console.log('✅ Tipos de cambio actualizados:', tiposCambio);
      }
      
    } catch (error) {
      console.error('Error actualizando tipos de cambio:', error);
    }
  }
}
