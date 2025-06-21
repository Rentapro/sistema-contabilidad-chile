import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Función para migrar datos desde localStorage a Prisma
export async function migrateFromLocalStorage() {
  try {
    const localData = typeof window !== 'undefined' ? localStorage.getItem('contabilidad_data') : null;
    if (!localData) return { success: true, message: 'No hay datos para migrar' };

    const data = JSON.parse(localData);
    let migratedCount = 0;

    // Migrar clientes
    if (data.clientes) {
      for (const cliente of data.clientes) {
        const existing = await prisma.cliente.findUnique({
          where: { rut: cliente.rut }
        });
        
        if (!existing) {
          await prisma.cliente.create({
            data: {
              rut: cliente.rut,
              razonSocial: cliente.razonSocial || cliente.nombre,
              email: cliente.email,
              telefono: cliente.telefono,
              direccion: cliente.direccion,
              ciudad: cliente.ciudad,
              region: cliente.region,
              actividadEconomica: cliente.actividadEconomica,
              empresaId: 'default-empresa' // Se asignará después
            }
          });
          migratedCount++;
        }
      }
    }

    // Migrar proveedores
    if (data.proveedores) {
      for (const proveedor of data.proveedores) {
        const existing = await prisma.proveedor.findFirst({
          where: { rut: proveedor.rut }
        });
        
        if (!existing) {
          await prisma.proveedor.create({
            data: {
              nombre: proveedor.nombre,
              rut: proveedor.rut,
              email: proveedor.email,
              telefono: proveedor.telefono,
              direccion: proveedor.direccion,
              empresaId: 'default-empresa'
            }
          });
          migratedCount++;
        }
      }
    }

    return { 
      success: true, 
      message: `Migración completada: ${migratedCount} registros migrados` 
    };

  } catch (error) {
    console.error('Error en migración:', error);
    return { 
      success: false, 
      error: 'Error durante la migración: ' + (error as Error).message 
    };
  }
}

// Funciones de utilidad para la base de datos
export class DatabaseService {
  static async testConnection(): Promise<boolean> {
    try {
      await prisma.$connect();
      await prisma.$disconnect();
      return true;
    } catch (error) {
      console.error('Error testing database connection:', error);
      return false;
    }
  }

  static async createDefaultEmpresa() {
    try {
      const existing = await prisma.empresa.findFirst({
        where: { id: 'default-empresa' }
      });

      if (!existing) {
        await prisma.empresa.create({
          data: {
            id: 'default-empresa',
            rut: '77212362-0',
            razonSocial: 'Empresa Demo S.A.',
            nombreFantasia: 'Demo Contabilidad',
            email: 'demo@contabilidad.cl',
            telefono: '+56 2 2234 5678',
            direccion: 'Av. Providencia 1234, Santiago',
            ciudad: 'Santiago',
            region: 'Metropolitana',
            actividadEconomica: 'Servicios de consultoría',
            tipoLicencia: 'premium'
          }
        });
        console.log('✅ Empresa por defecto creada');
      }
    } catch (error) {
      console.error('Error creando empresa por defecto:', error);
    }
  }

  static async seedInitialData() {
    try {
      await this.createDefaultEmpresa();
      
      // Crear usuario administrador por defecto
      const existingUser = await prisma.usuario.findFirst({
        where: { email: 'admin@contabilidad.pro' }
      });

      if (!existingUser) {
        await prisma.usuario.create({
          data: {
            empresaId: 'default-empresa',
            email: 'admin@contabilidad.pro',
            nombre: 'Administrador',
            apellido: 'Sistema',
            rol: 'superadmin'
          }
        });
        console.log('✅ Usuario administrador creado');
      }

      return { success: true };
    } catch (error) {
      console.error('Error en seed inicial:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}
