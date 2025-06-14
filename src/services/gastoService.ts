'use client';

// Servicio de gastos - Mock service que se conectará a Supabase en producción
export interface GastoDB {
  id: string;
  proveedor_id?: string;
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
  comprobante?: string;
  deducible: boolean;
  created_at: string;
  updated_at: string;
}

export interface GastoCreate {
  proveedor_id?: string;
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
  comprobante?: string;
  deducible: boolean;
}

class GastoService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  async obtenerGastos(): Promise<GastoDB[]> {
    try {
      // En producción, aquí se haría la llamada real a Supabase
      // const response = await fetch(`${this.baseUrl}/gastos`);
      // return await response.json();
      
      // Mock data para desarrollo
      return [
        {
          id: '1',
          proveedor_id: '1',
          categoria: 'Suministros de Oficina',
          descripcion: 'Compra de materiales de oficina y papelería',
          monto: 45000,
          fecha: '2024-05-18',
          comprobante: 'FAC-001234',
          deducible: true,
          created_at: '2024-05-18T10:00:00Z',
          updated_at: '2024-05-18T10:00:00Z'
        },
        {
          id: '2',
          proveedor_id: '2',
          categoria: 'Servicios Básicos',
          descripcion: 'Servicio de limpieza mensual oficinas',
          monto: 180000,
          fecha: '2024-05-01',
          comprobante: 'BOL-005678',
          deducible: true,
          created_at: '2024-05-01T09:00:00Z',
          updated_at: '2024-05-01T09:00:00Z'
        },
        {
          id: '3',
          categoria: 'Combustible',
          descripcion: 'Combustible vehículo empresa',
          monto: 65000,
          fecha: '2024-05-10',
          comprobante: 'FAC-789012',
          deducible: true,
          created_at: '2024-05-10T14:30:00Z',
          updated_at: '2024-05-10T14:30:00Z'
        }
      ];
    } catch (error) {
      console.error('Error al obtener gastos:', error);
      throw new Error('Error al cargar los gastos');
    }
  }

  async crearGasto(gasto: GastoCreate): Promise<GastoDB> {
    try {
      // En producción, aquí se haría la llamada real a Supabase
      // const response = await fetch(`${this.baseUrl}/gastos`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(gasto)
      // });
      // return await response.json();
      
      // Mock para desarrollo
      const nuevoGasto: GastoDB = {
        id: Date.now().toString(),
        ...gasto,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return nuevoGasto;
    } catch (error) {
      console.error('Error al crear gasto:', error);
      throw new Error('Error al crear el gasto');
    }
  }

  async actualizarGasto(id: string, updates: Partial<GastoCreate>): Promise<GastoDB> {
    try {
      // En producción, aquí se haría la llamada real a Supabase
      // const response = await fetch(`${this.baseUrl}/gastos/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      // return await response.json();
      
      // Mock para desarrollo
      const gastoActualizado: GastoDB = {
        id,
        proveedor_id: updates.proveedor_id,
        categoria: updates.categoria || '',
        descripcion: updates.descripcion || '',
        monto: updates.monto || 0,
        fecha: updates.fecha || '',
        comprobante: updates.comprobante,
        deducible: updates.deducible || false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      };
      
      return gastoActualizado;
    } catch (error) {
      console.error('Error al actualizar gasto:', error);
      throw new Error('Error al actualizar el gasto');
    }
  }

  async eliminarGasto(id: string): Promise<void> {
    try {
      // En producción, aquí se haría la llamada real a Supabase
      // await fetch(`${this.baseUrl}/gastos/${id}`, {      //   method: 'DELETE'
      // });
      
      // Implementación preparada para BD real
      console.log(`✅ Gasto ${id} eliminado correctamente`);
      
      // TODO: Eliminar esta simulación cuando se implemente BD real
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error('❌ Error al eliminar gasto:', error);
      throw new Error('No se pudo eliminar el gasto. Verifique la conexión.');
    }
  }
}

export const gastoService = new GastoService();
