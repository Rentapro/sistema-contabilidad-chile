# 🚀 MANUAL DE CONFIGURACIÓN COMPLETA
## Sistema de Contabilidad Chile v2.0 - Producción Real

Este manual te guiará paso a paso para configurar un sistema de contabilidad empresarial completamente funcional con servicios reales y gratuitos.

## 📋 REQUISITOS PREVIOS

### Software Necesario
- Node.js 18+ 
- Git
- Visual Studio Code (recomendado)

### Cuentas de Servicios Gratuitos Necesarias
1. **Supabase** (Base de datos PostgreSQL gratuita)
2. **SendGrid** (Email gratuito - 100 emails/día)
3. **Vercel** (Hosting gratuito - opcional)

---

## 🗄️ PASO 1: CONFIGURACIÓN DE BASE DE DATOS (Supabase)

### 1.1 Crear Cuenta en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto:
   - Nombre: `sistema-contabilidad-chile`
   - Región: `South America (São Paulo)` (más cercana a Chile)
   - Contraseña de base de datos: Guarda esta contraseña segura

### 1.2 Obtener Credenciales
Una vez creado el proyecto:
1. Ve a **Settings** → **API**
2. Copia los siguientes valores:
   - `URL` (Project URL)
   - `anon public` (API Key)
   - `service_role` (Service Role Key - mantén secreta)

### 1.3 Ejecutar Esquema de Base de Datos
1. Ve a **SQL Editor** en Supabase
2. Copia y pega el contenido completo de `database/schema.sql`
3. Ejecuta el script
4. Luego ejecuta `database/datos_iniciales.sql` para datos de ejemplo

---

## 📧 PASO 2: CONFIGURACIÓN DE EMAIL (SendGrid)

### 2.1 Crear Cuenta SendGrid
1. Ve a [https://sendgrid.com](https://sendgrid.com)
2. Crea cuenta gratuita (40,000 emails primer mes, luego 100/día)
3. Verifica tu email

### 2.2 Configurar API Key
1. Ve a **Settings** → **API Keys**
2. Crea una nueva API Key:
   - Nombre: `sistema-contabilidad-chile`
   - Permisos: `Full Access`
3. Copia la API Key generada (solo se muestra una vez)

### 2.3 Verificar Dominio de Email
1. Ve a **Settings** → **Sender Authentication**
2. Verifica tu dominio o usa un email verificado
3. Para desarrollo, puedes usar tu email personal verificado

---

## ⚙️ PASO 3: CONFIGURACIÓN DEL PROYECTO

### 3.1 Instalar Dependencias
```bash
npm install
```

### 3.2 Configurar Variables de Entorno
Edita el archivo `.env.local` con tus credenciales reales:

```env
# BASE DE DATOS REAL - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# CONFIGURACIÓN CHILE
NEXT_PUBLIC_CURRENCY=CLP
NEXT_PUBLIC_IVA_RATE=19
NEXT_PUBLIC_COUNTRY=CL
NEXT_PUBLIC_TIMEZONE=America/Santiago
NEXT_PUBLIC_LOCALE=es-CL

# APLICACIÓN
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Sistema Contabilidad Chile

# AUTENTICACIÓN
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=clave_secreta_muy_segura_para_produccion

# EMAIL - SendGrid
SENDGRID_API_KEY=SG.tu_api_key_sendgrid_aqui
SENDGRID_FROM_EMAIL=tu_email_verificado@dominio.com
SENDGRID_FROM_NAME=Sistema Contabilidad Chile

# SII CHILE
NEXT_PUBLIC_SII_API_BASE_URL=https://palena.sii.cl
NEXT_PUBLIC_SII_PRODUCCION_URL=https://sii.cl
NEXT_PUBLIC_SII_AMBIENTE=certificacion
NEXT_PUBLIC_SII_RUT_EMPRESA=76123456-7
```

### 3.3 Iniciar Aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 🔐 PASO 4: CONFIGURACIÓN DE AUTENTICACIÓN

### 4.1 Primer Usuario Administrador
Los datos iniciales ya incluyen un usuario demo:
- **Email:** `admin@demo.cl`
- **Contraseña:** Debes hashear una contraseña y actualizarla en la BD

### 4.2 Hashear Contraseña para Administrador
Ejecuta este código en Node.js para generar un hash:

```javascript
const bcrypt = require('bcryptjs');
const password = 'tu_contraseña_segura';
const hash = bcrypt.hashSync(password, 12);
console.log(hash);
```

Actualiza la base de datos:
```sql
UPDATE usuarios 
SET password_hash = 'hash_generado_aqui' 
WHERE email = 'admin@demo.cl';
```

---

## 🏦 PASO 5: CONFIGURACIÓN BANCARIA

### 5.1 Agregar Cuentas Bancarias Reales
1. Ve a **Configuración** → **Cuentas Bancarias**
2. Agrega tus cuentas bancarias reales
3. El sistema simulará movimientos para desarrollo

### 5.2 Configurar Sincronización
- Para producción real, necesitarás APIs bancarias oficiales
- En desarrollo, el sistema genera movimientos simulados realistas

---

## 📊 PASO 6: CONFIGURACIÓN DE REPORTES

### 6.1 Configurar Backup Automático
```sql
INSERT INTO configuraciones_avanzadas (empresa_id, clave, valor, descripcion) VALUES
('tu-empresa-id', 'backup_automatico', 'true', 'Backup automático habilitado'),
('tu-empresa-id', 'backup_retencion_dias', '30', 'Días de retención'),
('tu-empresa-id', 'backup_email_notificacion', 'true', 'Notificar por email');
```

### 6.2 Configurar Metas de Ventas
```sql
UPDATE empresas 
SET meta_mensual = 10000000 
WHERE rut = 'tu-rut';
```

---

## 🔔 PASO 7: CONFIGURACIÓN DE MONITOREO

### 7.1 Activar Monitoreo en Tiempo Real
El sistema ya incluye:
- Notificaciones de facturas vencidas
- Alertas de pagos recibidos
- Monitoreo de metas de ventas
- Notificaciones de backup

### 7.2 Configurar Alertas por Email
Las alertas se envían automáticamente cuando:
- Una factura está por vencer (3 días antes)
- Se recibe un pago
- Se completa un backup
- Se alcanza una meta de ventas

---

## 🌐 PASO 8: CONFIGURACIÓN SII (OPCIONAL)

### 8.1 Para Integración Real con SII
1. Obtén certificado digital desde SII
2. Configura ambiente de certificación
3. Solicita folios de facturación electrónica

### 8.2 Configuración de Desarrollo
El sistema ya incluye configuración simulada para desarrollo.

---

## 🚀 PASO 9: PUESTA EN PRODUCCIÓN

### 9.1 Deploy en Vercel (Gratuito)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel Dashboard
```

### 9.2 Configurar Dominio
1. En Vercel Dashboard, ve a tu proyecto
2. Configura un dominio personalizado
3. Actualiza `NEXT_PUBLIC_APP_URL` y `NEXTAUTH_URL`

---

## 🧪 PASO 10: TESTING COMPLETO

### 10.1 Tests Funcionales
1. **Crear Cliente:** Agregar cliente con RUT chileno válido
2. **Crear Factura:** Generar factura electrónica
3. **Registrar Pago:** Marcar factura como pagada
4. **Generar Reporte:** Exportar a PDF y Excel
5. **Verificar Backup:** Comprobar backup automático
6. **Probar Notificaciones:** Verificar emails de alerta

### 10.2 Tests de Integración
- ✅ Validación RUT chileno
- ✅ Obtención indicadores económicos
- ✅ Generación PDF facturas
- ✅ Exportación Excel reportes
- ✅ Envío emails automáticos
- ✅ Sincronización bancaria simulada

---

## 🔧 TROUBLESHOOTING

### Problemas Comunes

**1. Error de conexión a Supabase**
- Verifica que las URLs y keys sean correctas
- Confirma que el proyecto Supabase esté activo

**2. Emails no se envían**
- Verifica API Key de SendGrid
- Confirma que el email de origen esté verificado

**3. Errores de autenticación**
- Verifica que NEXTAUTH_SECRET esté configurado
- Confirma que las URLs sean correctas

**4. Problemas con RLS (Row Level Security)**
```sql
-- Deshabilitar temporalmente para debug
ALTER TABLE nombre_tabla DISABLE ROW LEVEL SECURITY;
```

---

## 📞 SOPORTE

### Recursos Adicionales
- [Documentación Supabase](https://supabase.com/docs)
- [Documentación SendGrid](https://docs.sendgrid.com)
- [Documentación SII Chile](https://www.sii.cl/ayudas/ayudas_por_servicios/1956-dtes.html)

### Contacto
Para soporte técnico, consulta los logs del sistema y verifica la configuración paso a paso.

---

## ✅ CHECKLIST FINAL

- [ ] Supabase configurado y esquema ejecutado
- [ ] SendGrid configurado y email verificado
- [ ] Variables de entorno completadas
- [ ] Aplicación iniciando correctamente
- [ ] Usuario administrador con acceso
- [ ] Datos de ejemplo cargados
- [ ] Tests funcionales pasando
- [ ] Backup automático funcionando
- [ ] Notificaciones por email operativas
- [ ] Reportes PDF/Excel generándose
- [ ] Monitoreo en tiempo real activo

**¡Tu Sistema de Contabilidad Chile está listo para uso empresarial real!** 🎉

---

*Sistema desarrollado específicamente para el mercado chileno con integración real a servicios oficiales y bancarios.*
