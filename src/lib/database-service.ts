import { createClient } from '@supabase/supabase-js';
import config from './config';

// Cliente de Supabase configurado
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos de base de datos
export interface Database {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string;
          rut: string;
          razon_social: string;
          nombre_fantasia?: string;
          email?: string;
          telefono?: string;
          direccion?: string;
          ciudad?: string;
          region?: string;
          codigo_postal?: string;
          actividad_economica?: string;
          fecha_inicio_actividades?: string;
          regimen_iva: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          rut: string;
          razon_social: string;
          nombre_fantasia?: string;
          email?: string;
          telefono?: string;
          direccion?: string;
          ciudad?: string;
          region?: string;
          codigo_postal?: string;
          actividad_economica?: string;
          fecha_inicio_actividades?: string;
          regimen_iva?: string;
        };
        Update: Partial<Database['public']['Tables']['empresas']['Insert']>;
      };
      usuarios: {
        Row: {
          id: string;
          empresa_id?: string;
          email: string;
          nombre: string;
          apellido: string;
          rut?: string;
          rol: string;
          activo: boolean;
          ultimo_acceso?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          empresa_id?: string;
          email: string;
          nombre: string;
          apellido: string;
          rut?: string;
          rol?: string;
          activo?: boolean;
        };
        Update: Partial<Database['public']['Tables']['usuarios']['Insert']>;
      };
      clientes: {
        Row: {
          id: string;
          empresa_id: string;
          rut: string;
          tipo: string;
          razon_social: string;
          nombre_fantasia?: string;
          email?: string;
          telefono?: string;
          direccion?: string;
          ciudad?: string;
          region?: string;
          actividad_economica?: string;
          contacto_principal?: string;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          empresa_id: string;
          rut: string;
          tipo?: string;
          razon_social: string;
          nombre_fantasia?: string;
          email?: string;
          telefono?: string;
          direccion?: string;
          ciudad?: string;
          region?: string;
          actividad_economica?: string;
          contacto_principal?: string;
          activo?: boolean;
        };
        Update: Partial<Database['public']['Tables']['clientes']['Insert']>;
      };
      certificados_digitales: {
        Row: {
          id: string;
          cliente_id: string;
          nombre: string;
          tipo: 'certificacion' | 'produccion';
          archivo_datos: any; // BYTEA encriptado
          password_hash: string;
          fecha_emision: string;
          fecha_vencimiento: string;
          emisor?: string;
          numero_serie?: string;
          activo: boolean;
          notificado_vencimiento: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          cliente_id: string;
          nombre: string;
          tipo: 'certificacion' | 'produccion';
          archivo_datos: any;
          password_hash: string;
          fecha_emision: string;
          fecha_vencimiento: string;
          emisor?: string;
          numero_serie?: string;
          activo?: boolean;
        };
        Update: Partial<Database['public']['Tables']['certificados_digitales']['Insert']>;
      };
    };
  };
}

// Funciones de utilidad para la base de datos
export class DatabaseService {
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('empresas').select('count').limit(1);
      return !error;
    } catch (error) {
      console.error('Error testing database connection:', error);
      return false;
    }
  }

  static async runMigrations(): Promise<boolean> {
    try {
      // Verificar si las tablas existen y crear si es necesario
      const { error } = await supabase.rpc('check_tables_exist');
      if (error) {
        console.error('Error checking tables:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error running migrations:', error);
      return false;
    }
  }

  static async backupData(): Promise<boolean> {
    try {
      // Backup de datos críticos
      const { data: empresas } = await supabase.from('empresas').select('*');
      const { data: clientes } = await supabase.from('clientes').select('*');
      const { data: usuarios } = await supabase.from('usuarios').select('*');

      const backup = {
        timestamp: new Date().toISOString(),
        empresas,
        clientes,
        usuarios
      };

      // Guardar backup en localStorage como respaldo
      localStorage.setItem('sistema_backup', JSON.stringify(backup));
      return true;
    } catch (error) {
      console.error('Error creating backup:', error);
      return false;
    }
  }

  static async migrateFromLocalStorage(): Promise<boolean> {
    try {
      // Migrar datos desde localStorage a la base de datos
      const localData = localStorage.getItem('contabilidad_data');
      if (!localData) return true;

      const data = JSON.parse(localData);
      
      // Migrar empresas
      if (data.empresas) {
        for (const empresa of data.empresas) {
          await supabase.from('empresas').upsert(empresa);
        }
      }

      // Migrar clientes
      if (data.clientes) {
        for (const cliente of data.clientes) {
          await supabase.from('clientes').upsert(cliente);
        }
      }

      // Migrar usuarios
      if (data.usuarios) {
        for (const usuario of data.usuarios) {
          await supabase.from('usuarios').upsert(usuario);
        }
      }

      console.log('Migration from localStorage completed');
      return true;
    } catch (error) {
      console.error('Error migrating from localStorage:', error);
      return false;
    }
  }
}

// Hook para usar la base de datos
export function useDatabase() {
  const isConnected = async () => {
    return await DatabaseService.testConnection();
  };

  const backup = async () => {
    return await DatabaseService.backupData();
  };

  const migrate = async () => {
    return await DatabaseService.migrateFromLocalStorage();
  };

  return {
    supabase,
    isConnected,
    backup,
    migrate
  };
}
