-- =====================================================
-- DATOS INICIALES PARA CHILE
-- Sistema Contabilidad Chile v2.0
-- =====================================================

-- Datos de empresas reales de ejemplo
INSERT INTO empresas (rut, razon_social, nombre_fantasia, email, telefono, direccion, ciudad, region, actividad_economica) VALUES
('76.123.456-7', 'Servicios Contables Integrados SpA', 'ContaChile', 'admin@contachile.cl', '+56912345678', 'Av. Providencia 1234, Oficina 501', 'Santiago', 'Metropolitana', 'Servicios de contabilidad y auditoría'),
('96.963.440-4', 'Consultoría Empresarial del Sur Ltda', 'ConSur', 'contacto@consur.cl', '+56987654321', 'Av. Las Condes 5678, Piso 12', 'Las Condes', 'Metropolitana', 'Servicios de consultoría empresarial');

-- Clientes chilenos típicos
INSERT INTO clientes (empresa_id, rut, tipo, razon_social, nombre_fantasia, email, telefono, direccion, ciudad, region, limite_credito, dias_credito) VALUES
-- Clientes de la primera empresa
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), '12.345.678-9', 'persona_natural', 'Juan Carlos Pérez López', NULL, 'juan.perez@email.cl', '+56998765432', 'Calle Los Álamos 123', 'Santiago', 'Metropolitana', 500000, 30),
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), '98.765.432-1', 'empresa', 'Distribuidora Santiago SpA', 'DistriSantiago', 'ventas@distrisantiago.cl', '+56912345555', 'Av. Maipú 4567', 'Maipú', 'Metropolitana', 2000000, 45),
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), '76.543.210-K', 'empresa', 'Importadora del Norte Ltda', 'ImpNorte', 'compras@impnorte.cl', '+56955566777', 'Calle Antofagasta 890', 'Antofagasta', 'Antofagasta', 3000000, 60),
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), '15.987.654-3', 'persona_natural', 'María Elena González Soto', NULL, 'maria.gonzalez@gmail.com', '+56987123456', 'Pasaje Los Aromos 456', 'Valparaíso', 'Valparaíso', 750000, 30),
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), '87.654.321-0', 'empresa', 'Construcciones del Sur SA', 'ConsSur', 'contacto@conssur.cl', '+56933445566', 'Av. Bernardo O\'Higgins 1234', 'Concepción', 'Biobío', 5000000, 90);

-- Proveedores chilenos típicos
INSERT INTO proveedores (empresa_id, rut, tipo, razon_social, nombre_fantasia, email, telefono, direccion, ciudad, region, rubro) VALUES
-- Proveedores de la primera empresa
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), '90.123.000-K', 'empresa', 'Papelería y Oficina SpA', 'PapelOficina', 'ventas@papelofi.cl', '+56922334455', 'Av. Salvador 789', 'Santiago', 'Metropolitana', 'Artículos de oficina'),
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), '91.456.789-2', 'empresa', 'Servicios Informáticos Chile Ltda', 'InfoChile', 'soporte@infochile.cl', '+56912223344', 'Calle Moneda 1122', 'Santiago', 'Metropolitana', 'Servicios informáticos'),
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), '92.789.456-5', 'empresa', 'Transportes Rápidos del Centro SA', 'TransRápido', 'despachos@transrapido.cl', '+56945556677', 'Av. Matta 3344', 'Santiago', 'Metropolitana', 'Transporte de carga'),
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), '88.111.222-3', 'empresa', 'Limpieza Industrial Total Ltda', 'LimpiezaTotal', 'ventas@limpiezatotal.cl', '+56966778899', 'Calle Brasil 567', 'Valparaíso', 'Valparaíso', 'Servicios de limpieza');

-- Productos/Servicios típicos chilenos
INSERT INTO productos (empresa_id, codigo, nombre, descripcion, tipo, precio_neto, exento_iva, unidad_medida) VALUES
-- Productos/Servicios de la primera empresa
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 'SERV001', 'Servicio de Contabilidad Mensual', 'Servicio completo de contabilidad para empresas', 'servicio', 150000, false, 'mes'),
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 'SERV002', 'Declaración de Renta', 'Preparación y presentación de declaración de renta', 'servicio', 80000, false, 'unidad'),
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 'SERV003', 'Asesoría Tributaria', 'Asesoría especializada en temas tributarios', 'servicio', 120000, false, 'hora'),
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 'SERV004', 'Constitución de Empresa', 'Servicio completo de constitución de empresas', 'servicio', 350000, false, 'unidad'),
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 'PROD001', 'Software Contable Premium', 'Licencia anual de software contable', 'producto', 200000, false, 'licencia');

-- Facturas de ejemplo
INSERT INTO facturas (empresa_id, cliente_id, numero_factura, folio, fecha_emision, fecha_vencimiento, monto_neto, monto_iva, monto_total, estado) VALUES
-- Facturas de la primera empresa
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 
 (SELECT id FROM clientes WHERE rut = '12.345.678-9' AND empresa_id = (SELECT id FROM empresas WHERE rut = '76.123.456-7')), 
 'F001-000001', 1, '2024-12-01', '2024-12-31', 150000, 28500, 178500, 'pendiente'),

((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 
 (SELECT id FROM clientes WHERE rut = '98.765.432-1' AND empresa_id = (SELECT id FROM empresas WHERE rut = '76.123.456-7')), 
 'F001-000002', 2, '2024-12-05', '2025-01-19', 300000, 57000, 357000, 'pendiente'),

((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 
 (SELECT id FROM clientes WHERE rut = '76.543.210-K' AND empresa_id = (SELECT id FROM empresas WHERE rut = '76.123.456-7')), 
 'F001-000003', 3, '2024-11-20', '2025-01-19', 500000, 95000, 595000, 'pagada'),

((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 
 (SELECT id FROM clientes WHERE rut = '15.987.654-3' AND empresa_id = (SELECT id FROM empresas WHERE rut = '76.123.456-7')), 
 'F001-000004', 4, '2024-12-10', '2025-01-09', 80000, 15200, 95200, 'pendiente');

-- Detalles de facturas
INSERT INTO factura_detalles (factura_id, producto_id, descripcion, cantidad, precio_unitario, monto_neto) VALUES
-- Detalles para factura F001-000001
((SELECT id FROM facturas WHERE numero_factura = 'F001-000001'), 
 (SELECT id FROM productos WHERE codigo = 'SERV001'), 
 'Servicio de Contabilidad Mensual - Diciembre 2024', 1, 150000, 150000),

-- Detalles para factura F001-000002
((SELECT id FROM facturas WHERE numero_factura = 'F001-000002'), 
 (SELECT id FROM productos WHERE codigo = 'SERV001'), 
 'Servicio de Contabilidad Mensual - Diciembre 2024', 1, 150000, 150000),
((SELECT id FROM facturas WHERE numero_factura = 'F001-000002'), 
 (SELECT id FROM productos WHERE codigo = 'SERV003'), 
 'Asesoría Tributaria - 1.25 horas', 1.25, 120000, 150000),

-- Detalles para factura F001-000003
((SELECT id FROM facturas WHERE numero_factura = 'F001-000003'), 
 (SELECT id FROM productos WHERE codigo = 'SERV004'), 
 'Constitución de Empresa SpA', 1, 350000, 350000),
((SELECT id FROM facturas WHERE numero_factura = 'F001-000003'), 
 (SELECT id FROM productos WHERE codigo = 'SERV001'), 
 'Servicio de Contabilidad Mensual - Noviembre 2024', 1, 150000, 150000),

-- Detalles para factura F001-000004
((SELECT id FROM facturas WHERE numero_factura = 'F001-000004'), 
 (SELECT id FROM productos WHERE codigo = 'SERV002'), 
 'Declaración de Renta Persona Natural 2024', 1, 80000, 80000);

-- Gastos de ejemplo
INSERT INTO gastos (empresa_id, proveedor_id, numero_documento, tipo_documento, fecha_gasto, fecha_vencimiento, concepto, categoria, monto_neto, monto_iva, monto_total, estado) VALUES
-- Gastos de la primera empresa
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 
 (SELECT id FROM proveedores WHERE rut = '90.123.000-K'), 
 'FC-12345', 'factura', '2024-12-01', '2024-12-31', 'Compra de artículos de oficina', 'Suministros', 50000, 9500, 59500, 'pendiente'),

((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 
 (SELECT id FROM proveedores WHERE rut = '91.456.789-2'), 
 'FC-67890', 'factura', '2024-12-05', '2025-01-04', 'Mantenimiento equipos computacionales', 'Servicios Técnicos', 120000, 22800, 142800, 'pendiente'),

((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 
 (SELECT id FROM proveedores WHERE rut = '92.789.456-5'), 
 'FC-11111', 'factura', '2024-11-25', '2024-12-25', 'Servicio de transporte documentos', 'Transporte', 25000, 4750, 29750, 'pagado'),

((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 
 (SELECT id FROM proveedores WHERE rut = '88.111.222-3'), 
 'FC-22222', 'factura', '2024-12-01', '2024-12-31', 'Servicio de limpieza oficinas', 'Servicios Generales', 80000, 15200, 95200, 'pendiente');

-- Pagos de ejemplo
INSERT INTO pagos (empresa_id, factura_id, tipo, metodo_pago, monto, fecha_pago, numero_documento, banco) VALUES
-- Pago de factura pagada
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 
 (SELECT id FROM facturas WHERE numero_factura = 'F001-000003'), 
 'ingreso', 'transferencia', 595000, '2024-12-15', 'TRF-789456', 'Banco de Chile');

-- Pago de gasto
INSERT INTO pagos (empresa_id, gasto_id, tipo, metodo_pago, monto, fecha_pago, numero_documento, banco) VALUES
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 
 (SELECT id FROM gastos WHERE numero_documento = 'FC-11111'), 
 'egreso', 'transferencia', 29750, '2024-12-10', 'TRF-123789', 'Banco de Chile');

-- Configuración SII de ejemplo
INSERT INTO configuracion_sii (empresa_id, ambiente, folios_disponibles, ultimo_folio_usado, activo) VALUES
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 'certificacion', 
 '{"33": {"desde": 1, "hasta": 1000}, "39": {"desde": 1, "hasta": 500}}', 
 4, true);

-- Cuentas bancarias adicionales
INSERT INTO cuentas_bancarias (empresa_id, banco, numero_cuenta, tipo_cuenta, saldo_actual) VALUES
((SELECT id FROM empresas WHERE rut = '96.963.440-4'), 'Santander', '98765432', 'corriente', 3500000),
((SELECT id FROM empresas WHERE rut = '96.963.440-4'), 'BCI', '55443322', 'vista', 1200000);

-- Eventos de monitoreo de ejemplo
INSERT INTO eventos_monitoreo (empresa_id, tipo, mensaje, datos) VALUES
((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 'factura_por_vencer', 
 'Factura F001-000001 vence en 15 días', 
 '{"factura_numero": "F001-000001", "dias_restantes": 15, "monto": 178500}'),

((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 'pago_recibido', 
 'Pago recibido por $595.000', 
 '{"factura_numero": "F001-000003", "monto": 595000, "metodo": "transferencia"}'),

((SELECT id FROM empresas WHERE rut = '76.123.456-7'), 'backup_completado', 
 'Backup diario completado exitosamente', 
 '{"fecha": "2024-12-11", "tamaño": "2.5MB", "tablas": 11}');
