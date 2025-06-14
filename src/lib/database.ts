// Adaptador de Base de Datos - Abstrae la implementación de BD
// Permite cambiar fácilmente entre Mock y BD real

import configManager from '@/lib/config';
import { Cliente, Proveedor, Factura, Gasto, Empresa } from '@/types';

export interface DatabaseAdapter {
  // Clientes
  obtenerClientes(): Promise<Cliente[]>;
  crearCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente>;
  actualizarCliente(id: string, cliente: Partial<Cliente>): Promise<Cliente>;
  eliminarCliente(id: string): Promise<void>;
  
  // Proveedores
  obtenerProveedores(): Promise<Proveedor[]>;
  crearProveedor(proveedor: Omit<Proveedor, 'id'>): Promise<Proveedor>;
  actualizarProveedor(id: string, proveedor: Partial<Proveedor>): Promise<Proveedor>;
  eliminarProveedor(id: string): Promise<void>;
  
  // Facturas
  obtenerFacturas(): Promise<Factura[]>;
  crearFactura(factura: Omit<Factura, 'id'>): Promise<Factura>;
  actualizarFactura(id: string, factura: Partial<Factura>): Promise<Factura>;
  eliminarFactura(id: string): Promise<void>;
  
  // Gastos
  obtenerGastos(): Promise<Gasto[]>;
  crearGasto(gasto: Omit<Gasto, 'id'>): Promise<Gasto>;
  actualizarGasto(id: string, gasto: Partial<Gasto>): Promise<Gasto>;
  eliminarGasto(id: string): Promise<void>;
  
  // Sistema
  testConnection(): Promise<boolean>;
  migrate(): Promise<void>;
}

// Implementación Mock (datos en memoria)
class MockDatabaseAdapter implements DatabaseAdapter {
  private clientes: Cliente[] = [];
  private proveedores: Proveedor[] = [];
  private facturas: Factura[] = [];
  private gastos: Gasto[] = [];
  
  constructor() {
    this.loadInitialData();
  }
  
  private loadInitialData() {
    // Cargar datos iniciales desde store.ts
    // Por ahora mantener vacío para testing
    console.log('📦 MockDatabaseAdapter inicializado con datos en memoria');
  }
  
  async obtenerClientes(): Promise<Cliente[]> {
    return [...this.clientes];
  }
  
  async crearCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    const nuevoCliente: Cliente = {
      ...cliente,
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    this.clientes.push(nuevoCliente);
    return nuevoCliente;
  }
  
  async actualizarCliente(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    const index = this.clientes.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cliente no encontrado');
    
    this.clientes[index] = { ...this.clientes[index], ...cliente };
    return this.clientes[index];
  }
  
  async eliminarCliente(id: string): Promise<void> {
    const index = this.clientes.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cliente no encontrado');
    
    this.clientes.splice(index, 1);
  }
  
  async obtenerProveedores(): Promise<Proveedor[]> {
    return [...this.proveedores];
  }
  
  async crearProveedor(proveedor: Omit<Proveedor, 'id'>): Promise<Proveedor> {
    const nuevoProveedor: Proveedor = {
      ...proveedor,
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    this.proveedores.push(nuevoProveedor);
    return nuevoProveedor;
  }
  
  async actualizarProveedor(id: string, proveedor: Partial<Proveedor>): Promise<Proveedor> {
    const index = this.proveedores.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Proveedor no encontrado');
    
    this.proveedores[index] = { ...this.proveedores[index], ...proveedor };
    return this.proveedores[index];
  }
  
  async eliminarProveedor(id: string): Promise<void> {
    const index = this.proveedores.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Proveedor no encontrado');
    
    this.proveedores.splice(index, 1);
  }
  
  // Implementar resto de métodos...
  async obtenerFacturas(): Promise<Factura[]> { return [...this.facturas]; }
  async crearFactura(factura: Omit<Factura, 'id'>): Promise<Factura> { 
    const nueva: Factura = { ...factura, id: `mock_${Date.now()}` };
    this.facturas.push(nueva);
    return nueva;
  }
  async actualizarFactura(id: string, factura: Partial<Factura>): Promise<Factura> {
    const index = this.facturas.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Factura no encontrada');
    this.facturas[index] = { ...this.facturas[index], ...factura };
    return this.facturas[index];
  }
  async eliminarFactura(id: string): Promise<void> {
    const index = this.facturas.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Factura no encontrada');
    this.facturas.splice(index, 1);
  }
  
  async obtenerGastos(): Promise<Gasto[]> { return [...this.gastos]; }
  async crearGasto(gasto: Omit<Gasto, 'id'>): Promise<Gasto> { 
    const nuevo: Gasto = { ...gasto, id: `mock_${Date.now()}` };
    this.gastos.push(nuevo);
    return nuevo;
  }
  async actualizarGasto(id: string, gasto: Partial<Gasto>): Promise<Gasto> {
    const index = this.gastos.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Gasto no encontrado');
    this.gastos[index] = { ...this.gastos[index], ...gasto };
    return this.gastos[index];
  }
  async eliminarGasto(id: string): Promise<void> {
    const index = this.gastos.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Gasto no encontrado');
    this.gastos.splice(index, 1);
  }
  
  async testConnection(): Promise<boolean> {
    console.log('🔗 Probando conexión Mock Database...');
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
  }
  
  async migrate(): Promise<void> {
    console.log('📄 Mock Database no requiere migraciones');
  }
}

// Implementación PostgreSQL (futura)
class PostgreSQLAdapter implements DatabaseAdapter {
  async obtenerClientes(): Promise<Cliente[]> {
    throw new Error('PostgreSQL adapter no implementado aún');
  }
  
  // ... resto de métodos lanzarían error similar
  async crearCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> { throw new Error('No implementado'); }
  async actualizarCliente(id: string, cliente: Partial<Cliente>): Promise<Cliente> { throw new Error('No implementado'); }
  async eliminarCliente(id: string): Promise<void> { throw new Error('No implementado'); }
  async obtenerProveedores(): Promise<Proveedor[]> { throw new Error('No implementado'); }
  async crearProveedor(proveedor: Omit<Proveedor, 'id'>): Promise<Proveedor> { throw new Error('No implementado'); }
  async actualizarProveedor(id: string, proveedor: Partial<Proveedor>): Promise<Proveedor> { throw new Error('No implementado'); }
  async eliminarProveedor(id: string): Promise<void> { throw new Error('No implementado'); }
  async obtenerFacturas(): Promise<Factura[]> { throw new Error('No implementado'); }
  async crearFactura(factura: Omit<Factura, 'id'>): Promise<Factura> { throw new Error('No implementado'); }
  async actualizarFactura(id: string, factura: Partial<Factura>): Promise<Factura> { throw new Error('No implementado'); }
  async eliminarFactura(id: string): Promise<void> { throw new Error('No implementado'); }
  async obtenerGastos(): Promise<Gasto[]> { throw new Error('No implementado'); }
  async crearGasto(gasto: Omit<Gasto, 'id'>): Promise<Gasto> { throw new Error('No implementado'); }
  async actualizarGasto(id: string, gasto: Partial<Gasto>): Promise<Gasto> { throw new Error('No implementado'); }
  async eliminarGasto(id: string): Promise<void> { throw new Error('No implementado'); }
  
  async testConnection(): Promise<boolean> {
    // Aquí iría la conexión real a PostgreSQL
    return false;
  }
  
  async migrate(): Promise<void> {
    // Aquí irían las migraciones reales
  }
}

// Factory para crear el adaptador correcto
function createDatabaseAdapter(): DatabaseAdapter {
  const config = configManager.getDatabaseConfig();
  
  switch (config.provider) {
    case 'postgresql':
      console.log('🐘 Inicializando PostgreSQL Database Adapter');
      return new PostgreSQLAdapter();
    
    case 'mongodb':
      console.log('🍃 MongoDB Database Adapter no implementado aún, usando Mock');
      return new MockDatabaseAdapter();
    
    case 'mock':
    default:
      console.log('📦 Usando Mock Database Adapter (datos en memoria)');
      return new MockDatabaseAdapter();
  }
}

// Singleton del adaptador de BD
export const dbAdapter = createDatabaseAdapter();
export default dbAdapter;
