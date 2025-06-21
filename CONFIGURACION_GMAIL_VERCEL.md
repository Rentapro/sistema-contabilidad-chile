# 🔧 CONFIGURACIÓN PASO A PASO - GMAIL + VERCEL SECRET

## 1. 🔐 SECRET DE VERCEL (Ya generado)

1. Copia tu secret de Vercel y pégalo en `.env.local`:

```bash
# JWT y Seguridad - REEMPLAZA CON TU SECRET DE VERCEL
JWT_SECRET=tu_secret_de_vercel_aqui
NEXTAUTH_SECRET=tu_secret_de_vercel_aqui
```

## 2. 📧 CONFIGURACIÓN GMAIL TEMPORAL

### Paso 1: Habilitar autenticación de 2 factores en Gmail
1. Ve a tu cuenta de Google → Seguridad
2. Activa la autenticación de 2 factores

### Paso 2: Generar contraseña de aplicación
1. Google Account → Seguridad → Autenticación de 2 factores
2. Contraseñas de aplicación
3. Seleccionar app: "Correo"
4. Seleccionar dispositivo: "Otro"
5. Escribir: "Sistema Contabilidad"
6. Copiar la contraseña generada (16 caracteres)

### Paso 3: Actualizar .env.local
```bash
# EMAIL - CONFIGURACIÓN TEMPORAL CON GMAIL
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_password_de_aplicacion_16_caracteres
GMAIL_APP_PASSWORD=tu_password_de_aplicacion_16_caracteres

# EMAIL DESTINO PARA FORMULARIOS
ADMIN_EMAIL=tu_email@gmail.com
NOTIFICATION_EMAIL=tu_email@gmail.com
```

## 3. 🌐 CONFIGURACIÓN PARA PRODUCCIÓN

### Cuando tengas tu dominio y Zoho:
```bash
# EMAIL CORPORATIVO - ZOHO
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=contacto@tudominio.cl
SMTP_PASSWORD=tu_password_zoho

# EMAIL DESTINO PARA FORMULARIOS
ADMIN_EMAIL=contacto@tudominio.cl
NOTIFICATION_EMAIL=admin@tudominio.cl
```

## 4. 🧪 PRUEBAS

### Probar API de contacto:
```bash
# En el navegador, ve a:
http://localhost:3000/api/contacto

# Debería mostrar:
{
  "status": "API de contacto funcionando",
  "configured": true,
  "adminEmail": "✅ Configurado",
  "smtpConfig": "✅ Configurado"
}
```

### Probar formulario:
```bash
# Ve a la página de contacto:
http://localhost:3000/contacto

# Llena el formulario y envía
# Deberías recibir el email en tu Gmail
```

## 5. 📋 EJEMPLO COMPLETO DE .env.local

```bash
# SECRET DE VERCEL (reemplaza con el tuyo)
JWT_SECRET=tu_secret_de_vercel_aqui
NEXTAUTH_SECRET=tu_secret_de_vercel_aqui

# GMAIL TEMPORAL
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tucorreo@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop  # Password de aplicación Gmail
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# EMAILS DE DESTINO
ADMIN_EMAIL=tucorreo@gmail.com
NOTIFICATION_EMAIL=tucorreo@gmail.com

# RESTO DE CONFIGURACIONES (mantener como están)
NEXT_PUBLIC_SUPABASE_URL=https://pmqjxuuxexamplesupabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example_key
# ... resto de variables
```

## 6. ✅ RESULTADO

Una vez configurado:
- ✅ Los formularios de `/contacto` funcionarán
- ✅ Recibirás emails de contacto en tu Gmail
- ✅ Los usuarios recibirán confirmación automática
- ✅ Tienes 4 tipos de formulario: contacto, demo, soporte, comercial
- ✅ Fallback inteligente si falla el email (se guarda en logs)

## 7. 🚀 DEPLOY EN VERCEL

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar variables en Vercel dashboard
# Settings → Environment Variables
# Agregar todas las variables de .env.local
```

¡Tu sistema ya estará listo para recibir contactos de clientes reales!
