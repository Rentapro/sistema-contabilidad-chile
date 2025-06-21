# Configuración de Emails Corporativos Conta-IA

## 📧 Estructura de Emails

### Dominio Corporativo: `conta-ia.cl`

| Función | Email | Responsabilidad |
|---------|-------|-----------------|
| **Contacto General** | `contacto@conta-ia.cl` | Email principal del sistema, consultas generales, demos |
| **Contador** | `contador@conta-ia.cl` | Consultas contables especializadas |
| **Operaciones** | `operaciones@conta-ia.cl` | Gestión operativa y facturación |
| **Soporte Técnico** | `soporte@conta-ia.cl` | Soporte técnico y problemas del sistema |

**Nota**: `contaia.czsdigital@gmail.com` solo se usa para SMTP (envío de emails), pero todos los emails públicos son corporativos.

## 🚀 Routing Inteligente de Emails

### Por Tipo de Formulario:

1. **Contacto General** → `contacto@conta-ia.cl`
   - Formulario: `/contacto`
   - Consultas generales sobre servicios

2. **Solicitar Demo** → `contacto@conta-ia.cl`
   - Formulario: `/solicitar-demo`
   - Interesados en probar el sistema

3. **Consulta Contable** → `contador@conta-ia.cl`
   - Formulario: `/consulta-contable`
   - Preguntas específicas de contabilidad

4. **Soporte Técnico** → `soporte@conta-ia.cl`
   - Formulario: `/soporte`
   - Problemas técnicos y ayuda

5. **Comercial** → `contacto@conta-ia.cl`
   - Ventas y cotizaciones

## ⚙️ Configuración Técnica

### Variables de Entorno (`.env.local`):
```bash
# SMTP Configuration (Solo para envío)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contaia.czsdigital@gmail.com
SMTP_PASS=[PASSWORD_APLICACION_GMAIL]

# Email Principal Corporativo
SENDGRID_FROM_EMAIL=contacto@conta-ia.cl

# Routing de Emails Corporativos
EMAIL_CONTACTO=contacto@conta-ia.cl
EMAIL_CONTADOR=contador@conta-ia.cl
EMAIL_OPERACIONES=operaciones@conta-ia.cl
EMAIL_SOPORTE=soporte@conta-ia.cl
EMAIL_ADMIN=contacto@conta-ia.cl
```

### Función de Routing (API):
```typescript
function getEmailDestinoPorTipo(tipo: string): string {
  const routing = {
    'contacto': process.env.EMAIL_CONTACTO || 'contacto@conta-ia.cl',
    'demo': process.env.EMAIL_CONTACTO || 'contacto@conta-ia.cl',
    'comercial': process.env.EMAIL_CONTACTO || 'contacto@conta-ia.cl',
    'soporte': process.env.EMAIL_SOPORTE || 'soporte@conta-ia.cl',
    'consulta_contable': process.env.EMAIL_CONTADOR || 'contador@conta-ia.cl'
  };
  return routing[tipo as keyof typeof routing] || 'contacto@conta-ia.cl';
}
```

## 📋 Próximos Pasos

### 1. Configurar Gmail para SMTP
- Habilitar "Verificación en 2 pasos" en `contaia.czsdigital@gmail.com`
- Generar "Contraseña de aplicación" específica
- Actualizar `SMTP_PASS` en `.env.local`

### 2. Configurar Redirecciones de Email
Opciones para manejar los emails `@conta-ia.cl`:

#### Opción A: Forwarding/Redirección
- `contacto@conta-ia.cl` → `contaia.czsdigital@gmail.com`
- `contador@conta-ia.cl` → `contaia.czsdigital@gmail.com`
- `soporte@conta-ia.cl` → `contaia.czsdigital@gmail.com`
- `operaciones@conta-ia.cl` → `contaia.czsdigital@gmail.com`

#### Opción B: Cuentas Separadas
- Crear cuentas individuales en el proveedor del dominio
- Configurar cada una por separado

### 3. Testing
```bash
# Arrancar servidor
npm run dev

# Probar formularios en:
# http://localhost:3000/contacto
# http://localhost:3000/solicitar-demo
# http://localhost:3000/consulta-contable
# http://localhost:3000/soporte
```

## 🔧 Templates de Email

### Para Contacto General:
```
Asunto: Nueva consulta desde Conta-IA - [Tipo]
De: Sistema Conta-IA <contaia.czsdigital@gmail.com>
Para: contacto@conta-ia.cl

Nueva consulta recibida:
- Nombre: [nombre]
- Email: [email]
- Empresa: [empresa]
- Teléfono: [telefono]
- Tipo: [tipo]
- Mensaje: [mensaje]
```

### Para Consulta Contable:
```
Asunto: Consulta Contable - [nombre]
De: Sistema Conta-IA <contaia.czsdigital@gmail.com>
Para: contador@conta-ia.cl

Nueva consulta contable:
- Cliente: [nombre] ([email])
- Empresa: [empresa]
- Consulta: [mensaje]
- Fecha: [fecha actual]
```

## ✅ Estado Actual
- ✅ Estructura de emails definida
- ✅ Routing inteligente implementado
- ✅ Variables de entorno configuradas
- ✅ API actualizada para nuevos emails
- ⏳ Pendiente: Configurar password de aplicación Gmail
- ⏳ Pendiente: Configurar redirecciones del dominio
