-- Esquema de Base de Datos para Sistema Contabilidad Chile
-- PostgreSQL con Supabase (Gratuito)
-- ========================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de Empresas
CREATE TABLE empresas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rut VARCHAR(12) UNIQUE NOT NULL,
  razon_social VARCHAR(255) NOT NULL,
  nombre_fantasia VARCHAR(255),
  email VARCHAR(255),
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  region VARCHAR(100),
  codigo_postal VARCHAR(10),
  actividad_economica VARCHAR(255),
  fecha_inicio_actividades DATE,
  regimen_iva VARCHAR(20) DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Usuarios
CREATE TABLE usuarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  rut VARCHAR(12) UNIQUE,
  rol VARCHAR(50) DEFAULT 'usuario',
  activo BOOLEAN DEFAULT true,
  ultimo_acceso TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Clientes
CREATE TABLE clientes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  rut VARCHAR(12) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'persona_natural', -- persona_natural, empresa
  razon_social VARCHAR(255) NOT NULL,
  nombre_fantasia VARCHAR(255),
  email VARCHAR(255),
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  region VARCHAR(100),
  codigo_postal VARCHAR(10),
  limite_credito DECIMAL(15,2) DEFAULT 0,
  dias_credito INTEGER DEFAULT 30,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(empresa_id, rut)
);

-- Tabla de Proveedores
CREATE TABLE proveedores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  rut VARCHAR(12) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'empresa',
  razon_social VARCHAR(255) NOT NULL,
  nombre_fantasia VARCHAR(255),
  email VARCHAR(255),
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  region VARCHAR(100),
  codigo_postal VARCHAR(10),
  rubro VARCHAR(255),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(empresa_id, rut)
);

-- Tabla de Productos/Servicios
CREATE TABLE productos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  codigo VARCHAR(50),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(20) DEFAULT 'producto', -- producto, servicio
  precio_neto DECIMAL(15,2) NOT NULL,
  exento_iva BOOLEAN DEFAULT false,
  stock_actual INTEGER DEFAULT 0,
  stock_minimo INTEGER DEFAULT 0,
  unidad_medida VARCHAR(20) DEFAULT 'unidad',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(empresa_id, codigo)
);

-- Tabla de Facturas
CREATE TABLE facturas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id),
  numero_factura VARCHAR(20) NOT NULL,
  folio INTEGER NOT NULL,
  tipo_documento INTEGER DEFAULT 33, -- 33=Factura, 34=Factura Exenta, 39=Boleta
  fecha_emision DATE NOT NULL,
  fecha_vencimiento DATE,
  monto_neto DECIMAL(15,2) NOT NULL,
  monto_iva DECIMAL(15,2) NOT NULL,
  monto_total DECIMAL(15,2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, pagada, vencida, anulada
  observaciones TEXT,
  -- Integración SII
  track_id VARCHAR(100),
  estado_sii VARCHAR(20), -- ACEPTADO, RECHAZADO, PROCESANDO
  xml_dte TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(empresa_id, numero_factura)
);

-- Tabla de Detalles de Factura
CREATE TABLE factura_detalles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  factura_id UUID REFERENCES facturas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  descripcion VARCHAR(255) NOT NULL,
  cantidad DECIMAL(10,3) NOT NULL,
  precio_unitario DECIMAL(15,2) NOT NULL,
  descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
  monto_neto DECIMAL(15,2) NOT NULL,
  exento_iva BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Gastos
CREATE TABLE gastos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  proveedor_id UUID REFERENCES proveedores(id),
  numero_documento VARCHAR(50),
  tipo_documento VARCHAR(20) DEFAULT 'factura', -- factura, boleta, recibo
  fecha_gasto DATE NOT NULL,
  fecha_vencimiento DATE,
  concepto VARCHAR(255) NOT NULL,
  categoria VARCHAR(100),
  monto_neto DECIMAL(15,2) NOT NULL,
  monto_iva DECIMAL(15,2) DEFAULT 0,
  monto_total DECIMAL(15,2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, pagado
  centro_costo VARCHAR(100),
  archivo_adjunto TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Pagos
CREATE TABLE pagos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  factura_id UUID REFERENCES facturas(id),
  gasto_id UUID REFERENCES gastos(id),
  tipo VARCHAR(20) NOT NULL, -- ingreso, egreso
  metodo_pago VARCHAR(50) NOT NULL, -- efectivo, transferencia, cheque, tarjeta
  monto DECIMAL(15,2) NOT NULL,
  fecha_pago DATE NOT NULL,
  numero_documento VARCHAR(50),
  banco VARCHAR(100),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Configuración SII
CREATE TABLE configuracion_sii (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  certificado_digital TEXT,
  clave_privada TEXT,
  ambiente VARCHAR(20) DEFAULT 'certificacion', -- certificacion, produccion
  folios_disponibles JSONB,
  ultimo_folio_usado INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(empresa_id)
);

-- Tabla de Auditoría
CREATE TABLE auditoria (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id),
  tabla VARCHAR(100) NOT NULL,
  registro_id UUID NOT NULL,
  accion VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
  datos_anteriores JSONB,
  datos_nuevos JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_clientes_empresa_rut ON clientes(empresa_id, rut);
CREATE INDEX idx_proveedores_empresa_rut ON proveedores(empresa_id, rut);
CREATE INDEX idx_facturas_empresa_fecha ON facturas(empresa_id, fecha_emision);
CREATE INDEX idx_gastos_empresa_fecha ON gastos(empresa_id, fecha_gasto);
CREATE INDEX idx_pagos_empresa_fecha ON pagos(empresa_id, fecha_pago);
CREATE INDEX idx_auditoria_empresa_fecha ON auditoria(empresa_id, created_at);

-- Triggers para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facturas_updated_at BEFORE UPDATE ON facturas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gastos_updated_at BEFORE UPDATE ON gastos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracion_sii_updated_at BEFORE UPDATE ON configuracion_sii
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) para multitenancy
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE factura_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_sii ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- Datos de ejemplo para Chile
INSERT INTO empresas (rut, razon_social, nombre_fantasia, email, telefono, direccion, ciudad, region) VALUES
('76123456-7', 'Empresa Demo SpA', 'Demo Corp', 'admin@demo.cl', '+56912345678', 'Av. Providencia 1234', 'Santiago', 'Metropolitana'),
('96963440-4', 'Servicios Integrales Ltda', 'ServInt', 'info@servint.cl', '+56987654321', 'Av. Las Condes 5678', 'Las Condes', 'Metropolitana');

-- Insertar usuario administrador
INSERT INTO usuarios (empresa_id, email, nombre, apellido, rut, rol) VALUES
((SELECT id FROM empresas WHERE rut = '76123456-7'), 'admin@demo.cl', 'Administrador', 'Sistema', '12345678-9', 'admin');

-- =====================================================
-- NUEVAS TABLAS PARA FUNCIONALIDADES EMPRESARIALES
-- =====================================================

-- Tabla de Cuentas Bancarias
CREATE TABLE cuentas_bancarias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    
    banco VARCHAR(100) NOT NULL,
    numero_cuenta VARCHAR(30) NOT NULL,
    tipo_cuenta VARCHAR(20) NOT NULL, -- corriente, ahorro, vista
    moneda VARCHAR(3) DEFAULT 'CLP',
    
    saldo_actual DECIMAL(15,2) DEFAULT 0,
    fecha_ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(empresa_id, banco, numero_cuenta)
);

-- Tabla de Movimientos Bancarios
CREATE TABLE movimientos_bancarios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cuenta_bancaria_id UUID REFERENCES cuentas_bancarias(id) ON DELETE CASCADE,
    
    fecha_movimiento DATE NOT NULL,
    fecha_valor DATE NOT NULL,
    descripcion TEXT NOT NULL,
    
    monto DECIMAL(15,2) NOT NULL,
    tipo VARCHAR(10) NOT NULL, -- cargo, abono
    saldo DECIMAL(15,2) NOT NULL,
    
    numero_documento VARCHAR(50),
    codigo_transaccion VARCHAR(100) UNIQUE,
    sucursal VARCHAR(10),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_tipo CHECK (tipo IN ('cargo', 'abono'))
);

-- Tabla de Configuraciones Avanzadas
CREATE TABLE configuraciones_avanzadas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    
    clave VARCHAR(100) NOT NULL,
    valor TEXT,
    tipo VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    descripcion TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(empresa_id, clave)
);

-- Tabla de Backups
CREATE TABLE backups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tipo VARCHAR(20) NOT NULL, -- completo, incremental
    estado VARCHAR(20) DEFAULT 'en_proceso', -- en_proceso, completado, error
    
    tamaño BIGINT,
    archivo_url TEXT,
    tablas TEXT[], -- Array de nombres de tablas incluidas
    
    error TEXT,
    
    CONSTRAINT valid_estado CHECK (estado IN ('en_proceso', 'completado', 'error'))
);

-- Tabla de Eventos de Monitoreo
CREATE TABLE eventos_monitoreo (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id),
    
    tipo VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    datos JSONB DEFAULT '{}',
    
    procesado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_tipo CHECK (tipo IN (
        'factura_vencida', 'factura_por_vencer', 'pago_recibido', 
        'meta_alcanzada', 'backup_completado', 'backup_faltante',
        'problema_rendimiento', 'error_sistema'
    ))
);

-- Índices adicionales para rendimiento
CREATE INDEX idx_cuentas_bancarias_empresa ON cuentas_bancarias(empresa_id);
CREATE INDEX idx_movimientos_cuenta ON movimientos_bancarios(cuenta_bancaria_id);
CREATE INDEX idx_movimientos_fecha ON movimientos_bancarios(fecha_movimiento);
CREATE INDEX idx_eventos_empresa ON eventos_monitoreo(empresa_id);
CREATE INDEX idx_eventos_tipo ON eventos_monitoreo(tipo);
CREATE INDEX idx_eventos_fecha ON eventos_monitoreo(created_at);
CREATE INDEX idx_backups_empresa ON backups(empresa_id);

-- Triggers para nuevas tablas
CREATE TRIGGER update_configuraciones_avanzadas_updated_at BEFORE UPDATE ON configuraciones_avanzadas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS para nuevas tablas
ALTER TABLE cuentas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_bancarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_avanzadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_monitoreo ENABLE ROW LEVEL SECURITY;

-- Datos de ejemplo para cuentas bancarias
INSERT INTO cuentas_bancarias (empresa_id, banco, numero_cuenta, tipo_cuenta, saldo_actual) VALUES
((SELECT id FROM empresas WHERE rut = '76123456-7'), 'Banco de Chile', '12345678', 'corriente', 5000000),
((SELECT id FROM empresas WHERE rut = '76123456-7'), 'BancoEstado', '87654321', 'vista', 2500000);

-- Configuraciones iniciales
INSERT INTO configuraciones_avanzadas (empresa_id, clave, valor, descripcion) VALUES
((SELECT id FROM empresas WHERE rut = '76123456-7'), 'backup_automatico', 'true', 'Backup automático habilitado'),
((SELECT id FROM empresas WHERE rut = '76123456-7'), 'backup_retencion_dias', '30', 'Días de retención de backups'),
((SELECT id FROM empresas WHERE rut = '76123456-7'), 'backup_email_notificacion', 'true', 'Notificar backups por email'),
((SELECT id FROM empresas WHERE rut = '76123456-7'), 'meta_mensual', '10000000', 'Meta de ventas mensual en pesos'),
((SELECT id FROM empresas WHERE rut = '76123456-7'), 'monitoreo_activo', 'true', 'Sistema de monitoreo activo');

COMMENT ON TABLE empresas IS 'Tabla principal de empresas del sistema';
COMMENT ON TABLE clientes IS 'Clientes de cada empresa';
COMMENT ON TABLE facturas IS 'Facturas emitidas con integración SII';
COMMENT ON TABLE configuracion_sii IS 'Configuración para integración con SII Chile';
COMMENT ON TABLE cuentas_bancarias IS 'Cuentas bancarias de las empresas';
COMMENT ON TABLE movimientos_bancarios IS 'Movimientos bancarios sincronizados';
COMMENT ON TABLE eventos_monitoreo IS 'Eventos del sistema de monitoreo en tiempo real';
COMMENT ON TABLE backups IS 'Historial de backups automáticos';
