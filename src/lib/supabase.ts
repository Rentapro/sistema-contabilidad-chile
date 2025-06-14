// Cliente de Base de Datos Real - Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key are required')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Tipos TypeScript para la base de datos
export interface Database {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string
          rut: string
          razon_social: string
          nombre_fantasia: string | null
          email: string | null
          telefono: string | null
          direccion: string | null
          ciudad: string | null
          region: string | null
          codigo_postal: string | null
          actividad_economica: string | null
          fecha_inicio_actividades: string | null
          regimen_iva: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          rut: string
          razon_social: string
          nombre_fantasia?: string | null
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          ciudad?: string | null
          region?: string | null
          codigo_postal?: string | null
          actividad_economica?: string | null
          fecha_inicio_actividades?: string | null
          regimen_iva?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          rut?: string
          razon_social?: string
          nombre_fantasia?: string | null
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          ciudad?: string | null
          region?: string | null
          codigo_postal?: string | null
          actividad_economica?: string | null
          fecha_inicio_actividades?: string | null
          regimen_iva?: string
          created_at?: string
          updated_at?: string
        }
      }
      clientes: {
        Row: {
          id: string
          empresa_id: string
          rut: string
          tipo: string
          razon_social: string
          nombre_fantasia: string | null
          email: string | null
          telefono: string | null
          direccion: string | null
          ciudad: string | null
          region: string | null
          codigo_postal: string | null
          limite_credito: number
          dias_credito: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          empresa_id: string
          rut: string
          tipo?: string
          razon_social: string
          nombre_fantasia?: string | null
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          ciudad?: string | null
          region?: string | null
          codigo_postal?: string | null
          limite_credito?: number
          dias_credito?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string
          rut?: string
          tipo?: string
          razon_social?: string
          nombre_fantasia?: string | null
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          ciudad?: string | null
          region?: string | null
          codigo_postal?: string | null
          limite_credito?: number
          dias_credito?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      facturas: {
        Row: {
          id: string
          empresa_id: string
          cliente_id: string | null
          numero_factura: string
          folio: number
          tipo_documento: number
          fecha_emision: string
          fecha_vencimiento: string | null
          monto_neto: number
          monto_iva: number
          monto_total: number
          estado: string
          observaciones: string | null
          track_id: string | null
          estado_sii: string | null
          xml_dte: string | null
          pdf_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          empresa_id: string
          cliente_id?: string | null
          numero_factura: string
          folio: number
          tipo_documento?: number
          fecha_emision: string
          fecha_vencimiento?: string | null
          monto_neto: number
          monto_iva: number
          monto_total: number
          estado?: string
          observaciones?: string | null
          track_id?: string | null
          estado_sii?: string | null
          xml_dte?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string
          cliente_id?: string | null
          numero_factura?: string
          folio?: number
          tipo_documento?: number
          fecha_emision?: string
          fecha_vencimiento?: string | null
          monto_neto?: number
          monto_iva?: number
          monto_total?: number
          estado?: string
          observaciones?: string | null
          track_id?: string | null
          estado_sii?: string | null
          xml_dte?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Cliente tipado
export type SupabaseClient = typeof supabase
