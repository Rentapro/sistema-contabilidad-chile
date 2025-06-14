'use client';

// Servicio de proveedores - Mock service que se conectará a Supabase en producción
export interface ProveedorDB {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  rut: string;
  giro?: string;
  tipo_contribuyente: 'primera_categoria' | 'segunda_categoria' | 'regimen_simplificado';
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProveedorCreate {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  rut: string;
  giro?: string;
  tipo_contribuyente: 'primera_categoria' | 'segunda_categoria' | 'regimen_simplificado';
  activo?: boolean;
}

class ProveedorService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  async obtenerProveedores(): Promise<ProveedorDB[]> {
    try {
      // En producción, aquí se haría la llamada real a Supabase
      // const response = await fetch(`${this.baseUrl}/proveedores`);
      // return await response.json();
      
      // Mock data para desarrollo
      return [
        {
          id: '1',
          nombre: 'Distribuidora GHI Ltda.',
          email: 'compras@ghi.cl',
          telefono: '+56 2 2987 6543',
          direccion: 'Parque Industrial Maipú, Maipú, Santiago',
          rut: '15987456-3',
          giro: 'Distribución de Materiales de Oficina',
          tipo_contribuyente: 'primera_categoria',
          activo: true,
          created_at: '2024-01-20T10:00:00Z',
          updated_at: '2024-01-20T10:00:00Z'
        },
        {
          id: '2',
          nombre: 'Servicios JKL SpA',
          email: 'facturacion@jkl.cl',
          telefono: '+56 9 5678 9012',
          direccion: 'Av. Apoquindo 321, Las Condes, Santiago',
          rut: '26789012-7',
          giro: 'Servicios de Mantención y Limpieza',
          tipo_contribuyente: 'primera_categoria',
          activo: true,
          created_at: '2024-02-15T09:00:00Z',
          updated_at: '2024-02-15T09:00:00Z'
        },
        {
          id: '3',
          nombre: 'Tecnología MNO Limitada',
          email: 'ventas@mno.cl',
          telefono: '+56 2 2876 5432',
          direccion: 'Av. Providencia 654, Providencia, Santiago',
          rut: '98765432-1',
          giro: 'Venta y Mantención de Equipos Tecnológicos',
          tipo_contribuyente: 'primera_categoria',
          activo: true,
          created_at: '2024-03-01T11:30:00Z',
          updated_at: '2024-03-01T11:30:00Z'
        }
      ];
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw new Error('Error al cargar los proveedores');
    }
  }

  async crearProveedor(proveedor: ProveedorCreate): Promise<ProveedorDB> {
    try {
      // En producción, aquí se haría la llamada real a Supabase
      // const response = await fetch(`${this.baseUrl}/proveedores`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(proveedor)
      // });
      // return await response.json();
      
      // Mock para desarrollo
      const nuevoProveedor: ProveedorDB = {
        id: Date.now().toString(),
        ...proveedor,
        activo: proveedor.activo ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return nuevoProveedor;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw new Error('Error al crear el proveedor');
    }
  }

  async actualizarProveedor(id: string, updates: Partial<ProveedorCreate>): Promise<ProveedorDB> {
    try {
      // En producción, aquí se haría la llamada real a Supabase
      // const response = await fetch(`${this.baseUrl}/proveedores/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      // return await response.json();
      
      // Mock para desarrollo
      const proveedorActualizado: ProveedorDB = {
        id,
        nombre: updates.nombre || '',
        email: updates.email || '',
        telefono: updates.telefono || '',
        direccion: updates.direccion || '',
        rut: updates.rut || '',
        giro: updates.giro,
        tipo_contribuyente: updates.tipo_contribuyente || 'primera_categoria',
        activo: updates.activo ?? true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      };
      
      return proveedorActualizado;
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      throw new Error('Error al actualizar el proveedor');
    }
  }

  async eliminarProveedor(id: string): Promise<void> {    try {
      // En producción, aquí se haría la llamada real a Supabase
      // await fetch(`${this.baseUrl}/proveedores/${id}`, {
      //   method: 'DELETE'
      // });
      
      // Implementación preparada para BD real
      console.log(`✅ Proveedor ${id} eliminado correctamente`);
      
      // TODO: Eliminar esta simulación cuando se implemente BD real
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error('❌ Error al eliminar proveedor:', error);
      throw new Error('No se pudo eliminar el proveedor. Verifique la conexión.');
    }
  }
}

export const proveedorService = new ProveedorService();
