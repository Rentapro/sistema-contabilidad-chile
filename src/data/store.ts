// Sistema de datos en memoria para el sistema de contabilidad
import { Cliente, Proveedor, Factura, Gasto, Producto, Empresa, Contador, TareaWorkflow, MetricasFirma, DocumentoProcesado } from '@/types';
import { generateId, calcularTarifaPorPlan } from '@/lib/utils';

// Datos de ejemplo para el mercado chileno
export const clientesIniciales: Cliente[] = [
  {
    id: '1',
    nombre: 'Empresa ABC SpA',
    email: 'contacto@abc.cl',
    telefono: '+56 9 8765 4321',
    direccion: 'Av. Providencia 123, Providencia, Santiago',
    rut: '12345678-9',
    giro: 'Servicios de Consultoría Empresarial',
    fechaCreacion: new Date('2024-01-15'),
    activo: true,
    tipoContribuyente: 'primera_categoria',
  },
  {
    id: '2',
    nombre: 'Comercializadora XYZ Ltda.',
    email: 'ventas@xyz.cl',
    telefono: '+56 2 2345 6789',
    direccion: 'Av. Las Condes 456, Las Condes, Santiago',
    rut: '87654321-k',
    giro: 'Comercio al por Mayor de Productos Tecnológicos',
    fechaCreacion: new Date('2024-02-10'),
    activo: true,
    tipoContribuyente: 'primera_categoria',
  },
  {
    id: '3',
    nombre: 'Constructora DEF S.A.',
    email: 'proyectos@def.cl',
    telefono: '+56 9 1234 5678',
    direccion: 'Av. Vitacura 789, Vitacura, Santiago',
    rut: '19876543-2',
    giro: 'Construcción de Obras de Ingeniería Civil',
    fechaCreacion: new Date('2024-03-05'),
    activo: true,
    tipoContribuyente: 'primera_categoria',
  },
];

export const proveedoresIniciales: Proveedor[] = [
  {
    id: '1',
    nombre: 'Distribuidora GHI Ltda.',
    email: 'compras@ghi.cl',
    telefono: '+56 2 2987 6543',
    direccion: 'Parque Industrial Maipú, Maipú, Santiago',
    rut: '15987456-3',
    giro: 'Distribución de Materiales de Oficina',
    fechaCreacion: new Date('2024-01-20'),
    activo: true,
    tipoContribuyente: 'primera_categoria',
  },
  {
    id: '2',
    nombre: 'Servicios JKL SpA',
    email: 'facturacion@jkl.cl',
    telefono: '+56 9 5678 9012',
    direccion: 'Av. Apoquindo 321, Las Condes, Santiago',
    rut: '26789012-7',
    giro: 'Servicios de Mantención y Limpieza',
    fechaCreacion: new Date('2024-02-15'),
    activo: true,
    tipoContribuyente: 'regimen_simplificado',
  },
];

export const productosIniciales: Producto[] = [
  {
    id: '1',
    nombre: 'Consultoría Empresarial',
    descripcion: 'Servicios de consultoría especializada en gestión',
    precio: 250000, // CLP
    categoria: 'Servicios Profesionales',
    activo: true,
  },
  {
    id: '2',
    nombre: 'Auditoría Contable',
    descripcion: 'Auditoría externa de estados financieros',
    precio: 450000, // CLP
    categoria: 'Servicios Profesionales',
    activo: true,
  },
  {
    id: '3',
    nombre: 'Asesoría Tributaria',
    descripcion: 'Asesoría en materias tributarias y SII',
    precio: 180000, // CLP
    categoria: 'Servicios Profesionales',
    activo: true,
  },
  {
    id: '4',
    nombre: 'Implementación Software',
    descripcion: 'Implementación de software contable',
    precio: 350000, // CLP
    categoria: 'Servicios Tecnológicos',
    activo: true,
  },
  {
    id: '5',
    nombre: 'Desarrollo de Software',
    descripcion: 'Desarrollo de aplicaciones web personalizadas',
    precio: 680000, // CLP
    categoria: 'Servicios Tecnológicos',
    activo: true,
  },
];

// Facturas de ejemplo para Chile
export const facturasIniciales: Factura[] = [
  {
    id: '1',
    numero: 'BOL-000001',
    clienteId: '1',
    fecha: new Date('2024-05-15'),
    fechaVencimiento: new Date('2024-06-15'),
    detalles: [
      {
        id: '1',
        productoId: '1',
        cantidad: 1,
        precioUnitario: 250000,
        descuento: 0,
        subtotal: 250000,
      }
    ],
    subtotal: 250000,
    iva: 47500, // 19% en Chile
    total: 297500,
    estado: 'pagada',
    tipoDocumento: 'boleta',
    notas: 'Boleta electrónica por servicios de consultoría',
  },
  {
    id: '2',
    numero: 'FAC-000001',
    clienteId: '2',
    fecha: new Date('2024-05-20'),
    fechaVencimiento: new Date('2024-06-20'),
    detalles: [
      {
        id: '2',
        productoId: '2',
        cantidad: 1,
        precioUnitario: 450000,
        descuento: 0,
        subtotal: 450000,
      }
    ],
    subtotal: 450000,
    iva: 85500,
    total: 535500,
    estado: 'pendiente',
    tipoDocumento: 'factura_electronica',
    folioSII: 'A001000001',
    timbreSII: 'TIMBRE_SII_HASH_12345',
    notas: 'Factura electrónica por auditoría contable',
  },
  {
    id: '3',
    numero: 'FAC-000002',
    clienteId: '3',
    fecha: new Date('2024-05-25'),
    fechaVencimiento: new Date('2024-06-10'),
    detalles: [
      {
        id: '3',
        productoId: '3',
        cantidad: 2,
        precioUnitario: 180000,
        descuento: 10000,
        subtotal: 350000,
      }
    ],
    subtotal: 350000,
    iva: 66500,
    total: 416500,
    estado: 'vencida',
    tipoDocumento: 'factura_electronica',
    folioSII: 'A001000002',
    timbreSII: 'TIMBRE_SII_HASH_67890',
    notas: 'Factura por asesoría tributaria con descuento',
  },
];

// Gastos de ejemplo para Chile
export const gastosIniciales: Gasto[] = [
  {
    id: '1',
    proveedorId: '1',
    categoria: 'Suministros de Oficina',
    descripcion: 'Compra de materiales de oficina y papelería',
    monto: 45000,
    fecha: new Date('2024-05-18'),
    comprobante: 'FAC-001234',
    deducible: true,
  },
  {
    id: '2',
    proveedorId: '2',
    categoria: 'Servicios Básicos',
    descripcion: 'Servicio de limpieza mensual oficinas',
    monto: 180000,
    fecha: new Date('2024-05-01'),
    comprobante: 'BOL-005678',
    deducible: true,
  },
  {
    id: '3',
    categoria: 'Combustible',
    descripcion: 'Combustible vehículo empresa',
    monto: 65000,
    fecha: new Date('2024-05-22'),
    comprobante: 'BOL-789012',
    deducible: true,
  },
  {
    id: '4',
    categoria: 'Capacitación',
    descripcion: 'Curso de actualización tributaria SII',
    monto: 120000,
    fecha: new Date('2024-05-10'),
    comprobante: 'FAC-345678',
    deducible: true,
  },
];

// Datos de ejemplo para firma contable
export const empresasIniciales: Empresa[] = [
  {
    id: '1',
    razonSocial: 'Tech Solutions SpA',
    rut: '76123456-7',
    giro: 'Desarrollo de Software',
    direccion: 'Av. Providencia 1234, Santiago',
    telefono: '+56 2 2345 6789',
    email: 'contacto@techsolutions.cl',
    representanteLegal: 'Juan Pérez González',
    tipoEmpresa: 'spa',
    regimen: 'primera_categoria',
    fechaConstitucion: new Date('2020-03-15'),
    fechaInicioActividades: new Date('2020-04-01'),
    plan: 'profesional',
    estado: 'activo',
    contadorAsignado: '1',
    fechaRegistro: new Date('2024-01-15'),
    configuracion: {
      frecuenciaReportes: 'mensual',
      tiposImpuestos: ['iva', 'ppm', 'segunda_categoria'],
      integraciónBancaria: true,
      notificacionesEmail: true,
    },
  },
  {
    id: '2',
    razonSocial: 'Restaurante El Buen Sabor Ltda.',
    rut: '96987654-3',
    giro: 'Servicios de Restaurante',
    direccion: 'Calle Principal 567, Valparaíso',
    telefono: '+56 32 234 5678',
    email: 'admin@elbuensabor.cl',
    representanteLegal: 'María González Silva',
    tipoEmpresa: 'limitada',
    regimen: 'pro_pyme',
    fechaConstitucion: new Date('2019-08-20'),
    fechaInicioActividades: new Date('2019-09-01'),
    plan: 'basico',
    estado: 'activo',
    fechaRegistro: new Date('2024-02-10'),
    configuracion: {
      frecuenciaReportes: 'mensual',
      tiposImpuestos: ['iva'],
      integraciónBancaria: false,
      notificacionesEmail: true,
    },
  },
];

export const contadoresIniciales: Contador[] = [
  {
    id: '1',
    nombre: 'Carlos Contador Principal',
    email: 'carlos@mifirma.cl',
    telefono: '+56 9 8765 4321',
    especialidad: ['spa', 'limitada', 'tecnologia'],
    empresasAsignadas: ['1'],
    capacidadMaxima: 50,
    activo: true,
    fechaIngreso: new Date('2024-01-01'),
  },
  {
    id: '2',
    nombre: 'Ana Especialista PyME',
    email: 'ana@mifirma.cl',
    telefono: '+56 9 7654 3210',
    especialidad: ['pro_pyme', 'retail', 'servicios'],
    empresasAsignadas: ['2'],
    capacidadMaxima: 75,
    activo: true,
    fechaIngreso: new Date('2024-01-15'),
  },
];

export const tareasIniciales: TareaWorkflow[] = [
  {
    id: '1',
    empresaId: '1',
    tipo: 'cierre_mensual',
    titulo: 'Cierre Contable Mayo 2025',
    descripcion: 'Realizar cierre contable mensual, conciliaciones y reportes',
    fechaVencimiento: new Date('2025-06-15'),
    prioridad: 'alta',
    estado: 'pendiente',
    contadorAsignado: '1',
    estimacionHoras: 4,
    fechaCreacion: new Date('2025-06-01'),
    notas: '',
    documentosRequeridos: ['facturas_compra', 'facturas_venta', 'conciliacion_bancaria'],
    dependencias: [],
  },
  {
    id: '2',
    empresaId: '2',
    tipo: 'declaracion_f29',
    titulo: 'Declaración F29 Mayo 2025',
    descripcion: 'Preparar y presentar declaración mensual de IVA',
    fechaVencimiento: new Date('2025-06-20'),
    prioridad: 'critica',
    estado: 'en_proceso',
    contadorAsignado: '2',
    estimacionHoras: 2,
    fechaCreacion: new Date('2025-06-08'),
    notas: 'Revisar crédito fiscal del período',
    documentosRequeridos: ['libro_compras', 'libro_ventas'],
    dependencias: ['1'],
  },
];

// Clase para manejar el almacenamiento local
class DataStore {
  private storageKey: string;

  constructor(key: string) {
    this.storageKey = key;
  }

  getData<T>(): T[] {
    if (typeof window === 'undefined') return [];
    
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  setData<T>(data: T[]): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  addItem<T extends { id: string }>(item: Omit<T, 'id'>): T {
    const newItem = { ...item, id: generateId() } as T;
    const currentData = this.getData<T>();
    const updatedData = [...currentData, newItem];
    this.setData(updatedData);
    return newItem;
  }

  updateItem<T extends { id: string }>(id: string, updates: Partial<T>): T | null {
    const currentData = this.getData<T>();
    const index = currentData.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = { ...currentData[index], ...updates };
    currentData[index] = updatedItem;
    this.setData(currentData);
    return updatedItem;
  }

  deleteItem<T extends { id: string }>(id: string): boolean {
    const currentData = this.getData<T>();
    const filteredData = currentData.filter(item => item.id !== id);
    
    if (filteredData.length === currentData.length) return false;
    
    this.setData(filteredData);
    return true;
  }

  getById<T extends { id: string }>(id: string): T | null {
    const currentData = this.getData<T>();
    return currentData.find(item => item.id === id) || null;
  }
}

// Instancias de almacenes de datos
export const clientesStore = new DataStore('clientes');
export const proveedoresStore = new DataStore('proveedores');
export const facturasStore = new DataStore('facturas');
export const gastosStore = new DataStore('gastos');
export const productosStore = new DataStore('productos');
export const empresasStore = new DataStore('empresas');
export const contadoresStore = new DataStore('contadores');
export const tareasStore = new DataStore('tareas');
export const plantillasStore = new DataStore('plantillas');
export const documentosStore = new DataStore('documentos_procesados');

// Funciones de inicialización
export const initializeData = () => {
  // Inicializar clientes
  if (clientesStore.getData<Cliente>().length === 0) {
    clientesStore.setData(clientesIniciales);
  }

  // Inicializar proveedores
  if (proveedoresStore.getData<Proveedor>().length === 0) {
    proveedoresStore.setData(proveedoresIniciales);
  }

  // Inicializar productos
  if (productosStore.getData<Producto>().length === 0) {
    productosStore.setData(productosIniciales);
  }

  // Inicializar facturas
  if (facturasStore.getData<Factura>().length === 0) {
    facturasStore.setData(facturasIniciales);
  }

  // Inicializar gastos
  if (gastosStore.getData<Gasto>().length === 0) {
    gastosStore.setData(gastosIniciales);
  }
};

// API simulada
export const api = {
  // Clientes
  getClientes: () => clientesStore.getData<Cliente>(),
  getCliente: (id: string) => clientesStore.getById<Cliente>(id),
  createCliente: (cliente: Omit<Cliente, 'id'>) => clientesStore.addItem<Cliente>(cliente),
  updateCliente: (id: string, updates: Partial<Cliente>) => clientesStore.updateItem<Cliente>(id, updates),
  deleteCliente: (id: string) => clientesStore.deleteItem<Cliente>(id),

  // Proveedores
  getProveedores: () => proveedoresStore.getData<Proveedor>(),
  getProveedor: (id: string) => proveedoresStore.getById<Proveedor>(id),
  createProveedor: (proveedor: Omit<Proveedor, 'id'>) => proveedoresStore.addItem<Proveedor>(proveedor),
  updateProveedor: (id: string, updates: Partial<Proveedor>) => proveedoresStore.updateItem<Proveedor>(id, updates),
  deleteProveedor: (id: string) => proveedoresStore.deleteItem<Proveedor>(id),

  // Productos
  getProductos: () => productosStore.getData<Producto>(),
  getProducto: (id: string) => productosStore.getById<Producto>(id),
  createProducto: (producto: Omit<Producto, 'id'>) => productosStore.addItem<Producto>(producto),
  updateProducto: (id: string, updates: Partial<Producto>) => productosStore.updateItem<Producto>(id, updates),
  deleteProducto: (id: string) => productosStore.deleteItem<Producto>(id),

  // Facturas
  getFacturas: () => facturasStore.getData<Factura>(),
  getFactura: (id: string) => facturasStore.getById<Factura>(id),
  createFactura: (factura: Omit<Factura, 'id'>) => facturasStore.addItem<Factura>(factura),
  updateFactura: (id: string, updates: Partial<Factura>) => facturasStore.updateItem<Factura>(id, updates),
  deleteFactura: (id: string) => facturasStore.deleteItem<Factura>(id),

  // Gastos
  getGastos: () => gastosStore.getData<Gasto>(),
  getGasto: (id: string) => gastosStore.getById<Gasto>(id),
  createGasto: (gasto: Omit<Gasto, 'id'>) => gastosStore.addItem<Gasto>(gasto),
  updateGasto: (id: string, updates: Partial<Gasto>) => gastosStore.updateItem<Gasto>(id, updates),
  deleteGasto: (id: string) => gastosStore.deleteItem<Gasto>(id),
};

// API expandida para firma contable
export const firmApi = {
  // Empresas
  getEmpresas: () => empresasStore.getData<Empresa>(),
  getEmpresa: (id: string) => empresasStore.getById<Empresa>(id),
  createEmpresa: (empresa: Omit<Empresa, 'id'>) => empresasStore.addItem<Empresa>(empresa),
  updateEmpresa: (id: string, updates: Partial<Empresa>) => empresasStore.updateItem<Empresa>(id, updates),
  deleteEmpresa: (id: string) => empresasStore.deleteItem<Empresa>(id),

  // Contadores
  getContadores: () => contadoresStore.getData<Contador>(),
  getContador: (id: string) => contadoresStore.getById<Contador>(id),
  createContador: (contador: Omit<Contador, 'id'>) => contadoresStore.addItem<Contador>(contador),
  updateContador: (id: string, updates: Partial<Contador>) => contadoresStore.updateItem<Contador>(id, updates),

  // Tareas y Workflows
  getTareas: () => tareasStore.getData<TareaWorkflow>(),
  getTareasWorkflow: () => tareasStore.getData<TareaWorkflow>(),
  getTareasByEmpresa: (empresaId: string) => tareasStore.getData<TareaWorkflow>().filter(t => t.empresaId === empresaId),
  getTareasByContador: (contadorId: string) => tareasStore.getData<TareaWorkflow>().filter(t => t.contadorAsignado === contadorId),
  createTarea: (tarea: Omit<TareaWorkflow, 'id'>) => tareasStore.addItem<TareaWorkflow>(tarea),
  createTareaWorkflow: (tarea: Omit<TareaWorkflow, 'id'>) => tareasStore.addItem<TareaWorkflow>(tarea),
  updateTarea: (id: string, updates: Partial<TareaWorkflow>) => tareasStore.updateItem<TareaWorkflow>(id, updates),

  // Documentos Procesados
  getDocumentosProcesados: () => documentosStore.getData<DocumentoProcesado>(),
  getDocumentoProcesado: (id: string) => documentosStore.getById<DocumentoProcesado>(id),
  createDocumentoProcesado: (documento: Omit<DocumentoProcesado, 'id'>) => documentosStore.addItem<DocumentoProcesado>(documento),
  updateDocumentoProcesado: (id: string, updates: Partial<DocumentoProcesado>) => documentosStore.updateItem<DocumentoProcesado>(id, updates),
  deleteDocumentoProcesado: (id: string) => documentosStore.deleteItem<DocumentoProcesado>(id),
  getDocumentosByEmpresa: (empresaId: string) => documentosStore.getData<DocumentoProcesado>().filter(d => d.empresaId === empresaId),

  // Métricas de la firma
  getMetricasFirma: (): MetricasFirma => {
    const empresas = empresasStore.getData<Empresa>();
    const tareas = tareasStore.getData<TareaWorkflow>();
    const hoy = new Date();

    return {
      totalEmpresas: empresas.length,
      empresasActivas: empresas.filter(e => e.estado === 'activo').length,
      ingresosMensuales: empresas.reduce((sum, e) => sum + calcularTarifaPorPlan(e.plan), 0),
      tareasPendientes: tareas.filter(t => t.estado === 'pendiente').length,
      tareasVencidas: tareas.filter(t => t.fechaVencimiento < hoy && t.estado !== 'completada').length,
      eficienciaPromedio: 85, // Calculado basado en tareas completadas a tiempo
      satisfaccionClientes: 4.5, // De 5.0
      documentosProcesados: 1250, // Este mes
    };
  },

  // Asignación automática de contadores
  asignarContadorAutomatico: (empresaId: string): string | null => {
    const empresa = empresasStore.getById<Empresa>(empresaId);
    const contadores = contadoresStore.getData<Contador>();
    
    if (!empresa) return null;

    // Encontrar contador con capacidad y especialidad adecuada
    const contadorIdeal = contadores
      .filter(c => c.activo && c.empresasAsignadas.length < c.capacidadMaxima)
      .filter(c => c.especialidad.some(esp => 
        esp === empresa.tipoEmpresa || 
        esp === empresa.giro.toLowerCase() ||
        esp === empresa.regimen
      ))
      .sort((a, b) => a.empresasAsignadas.length - b.empresasAsignadas.length)[0];

    if (contadorIdeal) {
      // Asignar empresa al contador
      contadorIdeal.empresasAsignadas.push(empresaId);
      contadoresStore.updateItem<Contador>(contadorIdeal.id, { 
        empresasAsignadas: contadorIdeal.empresasAsignadas 
      });
      
      // Actualizar empresa con contador asignado
      empresasStore.updateItem<Empresa>(empresaId, { 
        contadorAsignado: contadorIdeal.id 
      });

      return contadorIdeal.id;
    }

    return null;
  },
};

// Inicialización expandida
export const initializeFirmData = () => {
  // Inicializar datos existentes
  initializeData();

  // Inicializar empresas
  if (empresasStore.getData<Empresa>().length === 0) {
    empresasIniciales.forEach(empresa => {
      empresasStore.setData([...empresasStore.getData<Empresa>(), empresa]);
    });
  }

  // Inicializar contadores
  if (contadoresStore.getData<Contador>().length === 0) {
    contadoresIniciales.forEach(contador => {
      contadoresStore.setData([...contadoresStore.getData<Contador>(), contador]);
    });
  }

  // Inicializar tareas
  if (tareasStore.getData<TareaWorkflow>().length === 0) {
    tareasIniciales.forEach(tarea => {
      tareasStore.setData([...tareasStore.getData<TareaWorkflow>(), tarea]);
    });
  }
};
