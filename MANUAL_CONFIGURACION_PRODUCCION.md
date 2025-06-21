# 🔧 MANUAL DE CONFIGURACIÓN COMPLETA
## Sistema de Contabilidad Chile - Guía de Implementación 2025

---

## 🎯 **RESUMEN DE CONFIGURACIÓN**

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 15px; margin: 2rem 0;">

### 📊 **ESTADO ACTUAL**
| Componente | Estado | Acción Requerida |
|------------|--------|------------------|
| **🗄️ Base de Datos** | ⚠️ MOCK | Configurar PostgreSQL |
| **📧 Email Service** | ⚠️ SIMULADO | Configurar SMTP real |
| **🔐 JWT Secrets** | ⚠️ EJEMPLO | Generar secrets seguros |
| **🤖 IA (Groq)** | ⚠️ PLACEHOLDER | Obtener API key real |
| **🏛️ SII Integration** | ⚠️ CERTIFICACIÓN | Subir certificados reales |

</div>

---

## 📋 **CHECKLIST DE CONFIGURACIÓN**

<table style="width: 100%; border-collapse: collapse; margin: 2rem 0;">
<tr style="background-color: #f8f9fa;">
<th style="padding: 1rem; border: 1px solid #dee2e6;">🔧 COMPONENTE</th>
<th style="padding: 1rem; border: 1px solid #dee2e6;">📊 PRIORIDAD</th>
<th style="padding: 1rem; border: 1px solid #dee2e6;">⏱️ TIEMPO</th>
<th style="padding: 1rem; border: 1px solid #dee2e6;">💰 COSTO</th>
<th style="padding: 1rem; border: 1px solid #dee2e6;">✅ STATUS</th>
</tr>
<tr>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;"><strong>PostgreSQL</strong></td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6; background-color: #f8d7da;">🚨 CRÍTICA</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">30 min</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">$0 (Docker)</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">⬜ PENDIENTE</td>
</tr>
<tr style="background-color: #f8f9fa;">
<td style="padding: 0.8rem; border: 1px solid #dee2e6;"><strong>SMTP (SendGrid)</strong></td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6; background-color: #fff3cd;">⚠️ ALTA</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">15 min</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">$0 (100 emails/día)</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">⬜ PENDIENTE</td>
</tr>
<tr>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;"><strong>JWT Secrets</strong></td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6; background-color: #f8d7da;">🚨 CRÍTICA</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">5 min</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">$0</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">⬜ PENDIENTE</td>
</tr>
<tr style="background-color: #f8f9fa;">
<td style="padding: 0.8rem; border: 1px solid #dee2e6;"><strong>Groq API (IA)</strong></td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6; background-color: #d1ecf1;">ℹ️ OPCIONAL</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">10 min</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">$0 (Gratis)</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">⬜ PENDIENTE</td>
</tr>
<tr>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;"><strong>Certificados SII</strong></td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6; background-color: #d1ecf1;">ℹ️ OPCIONAL</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">Variable</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">$50K-200K CLP</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">⬜ PENDIENTE</td>
</tr>
</table>

---

## 🗄️ **1. CONFIGURACIÓN BASE DE DATOS POSTGRESQL**

<div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">

### 🐘 **OPCIÓN A: Docker (RECOMENDADA)**

#### 📋 **Pasos:**
1. **Instalar Docker Desktop**
   - Windows: https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe
   - Instalar y reiniciar PC

2. **Ejecutar PostgreSQL**
   ```bash
   docker run --name postgres-contabilidad \
     -e POSTGRES_PASSWORD=TuPasswordSeguro123! \
     -e POSTGRES_DB=contabilidad_chile \
     -p 5432:5432 -d postgres:15
   ```

3. **Verificar conexión**
   ```bash
   docker ps
   # Debe aparecer el contenedor corriendo
   ```

#### 🔑 **Credenciales generadas:**
- **Host:** `localhost`
- **Puerto:** `5432`
- **Usuario:** `postgres`
- **Password:** `TuPasswordSeguro123!`
- **Base de datos:** `contabilidad_chile`

</div>

<div style="background: #cce5ff; border: 1px solid #b3d9ff; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">

### 🌐 **OPCIÓN B: PostgreSQL Cloud (Alternativa)**

#### 🏢 **Supabase (Gratis hasta 500MB)**
1. Ir a https://supabase.com
2. Crear cuenta gratuita
3. Crear nuevo proyecto: "contabilidad-chile"
4. Copiar URL de conexión del dashboard

#### 🎯 **Otras opciones:**
- **Heroku Postgres** (Gratis hasta 10K filas)
- **Railway** (Gratis $5 crédito)
- **PlanetScale** (Gratis tier)

</div>

### 📝 **Archivo a modificar: `.env`**
```env
# Actualizar esta línea:
DATABASE_URL="postgresql://postgres:TuPasswordSeguro123!@localhost:5432/contabilidad_chile"
```

---

## 📧 **2. CONFIGURACIÓN EMAIL SERVICE (SMTP)**

<div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">

### 📬 **OPCIÓN A: SendGrid (RECOMENDADA - GRATIS)**

#### 📋 **Pasos detallados:**
1. **Registro SendGrid**
   - Ir a: https://sendgrid.com/free/
   - Crear cuenta con email empresarial (no Gmail personal)
   - Verificar email de confirmación

2. **Crear API Key**
   - Ir a Settings → API Keys
   - Click "Create API Key"
   - Nombre: "Contabilidad-Chile-Prod"
   - Permisos: "Full Access"
   - **COPIAR Y GUARDAR** la API key (solo se muestra una vez)

3. **Verificar dominio (Opcional pero recomendado)**
   - Settings → Sender Authentication
   - Verify Single Sender
   - Usar email empresarial: contacto@tuempresa.cl

#### 🔑 **Credenciales generadas:**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASSWORD="SG.tu-api-key-aqui-muy-larga"
```

</div>

<div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">

### 📱 **OPCIÓN B: Gmail SMTP (Desarrollo)**

#### ⚠️ **Solo para pruebas, NO producción**
1. **Habilitar 2FA en Gmail**
2. **Generar App Password**
   - Google Account → Security → 2-Step Verification
   - App passwords → Generate
   - Aplicación: "Contabilidad Chile"

#### 🔑 **Credenciales:**
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="tu-app-password-16-caracteres"
```

</div>

### 📝 **Archivo a modificar: `.env`**
```env
# Actualizar estas líneas:
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASSWORD="SG.tu-sendgrid-api-key-real"
```

---

## 🔐 **3. CONFIGURACIÓN JWT SECRETS**

<div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">

### 🚨 **CRÍTICO: Generar secrets seguros**

#### 📋 **Método 1: Node.js (Recomendado)**
```bash
# Abrir terminal y ejecutar:
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('NEXTAUTH_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

#### 📋 **Método 2: Online Generator**
- Ir a: https://generate-secret.vercel.app/64
- Generar 2 secrets diferentes
- **NUNCA usar el mismo secret para ambos**

#### 📋 **Método 3: OpenSSL**
```bash
openssl rand -hex 64
```

</div>

### 📝 **Archivo a modificar: `.env`**
```env
# Reemplazar estos valores de ejemplo:
JWT_SECRET="tu-jwt-secret-generado-de-128-caracteres-hexadecimales"
NEXTAUTH_SECRET="tu-nextauth-secret-diferente-de-128-caracteres-hexadecimales"
```

---

## 🤖 **4. CONFIGURACIÓN IA (GROQ API)**

<div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">

### 🧠 **GROQ API - Gratis y Rápida**

#### 📋 **Pasos:**
1. **Registro Groq**
   - Ir a: https://console.groq.com
   - Crear cuenta (puede usar Gmail)
   - Verificar email

2. **Crear API Key**
   - Dashboard → API Keys
   - "Create API Key"
   - Nombre: "Contabilidad-Chile"
   - **COPIAR** la key inmediatamente

3. **Límites gratuitos:**
   - 6,000 tokens/minuto
   - Suficiente para 100+ consultas/día

#### 🔑 **API Key format:**
```
gsk_tu-groq-api-key-aqui-40-caracteres
```

</div>

<div style="background: #e2e3e5; border: 1px solid #6c757d; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">

### 🎯 **Alternativas IA (Si Groq no funciona)**

| Proveedor | Costo | Límite Gratis | Calidad |
|-----------|-------|---------------|---------|
| **OpenAI** | $20/mes | $5 crédito | ⭐⭐⭐⭐⭐ |
| **Anthropic** | $20/mes | No gratis | ⭐⭐⭐⭐⭐ |
| **Groq** | **Gratis** | 6K tok/min | ⭐⭐⭐⭐ |
| **Ollama** | Gratis | Local | ⭐⭐⭐ |

</div>

### 📝 **Archivo a modificar: `.env`**
```env
# Actualizar esta línea:
GROQ_API_KEY="gsk_tu-groq-api-key-real-de-40-caracteres"
```

---

## 🏛️ **5. CONFIGURACIÓN SII CHILE**

<div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">

### 🇨🇱 **Certificados Digitales SII**

#### 📋 **Para Ambiente de Certificación (Gratis)**
1. **Obtener certificado de pruebas**
   - Ir a: https://palena.sii.cl
   - Portal MAULLIN → Certificados
   - Descargar certificado de pruebas (.p12)

2. **RUT de prueba disponibles:**
   - `77.212.362-0` (Empresa de prueba)
   - `96.790.240-3` (SII testing)

#### 📋 **Para Producción (Costo $50K-200K CLP)**
1. **Solicitar certificado oficial**
   - Presencial en SII con:
     - Cédula de identidad
     - RUT de la empresa
     - Poder notarial (si no es representante legal)

2. **Proceso:**
   - Solicitud presencial
   - Pago tasas SII
   - Espera 5-10 días hábiles
   - Descarga certificado (.p12)

</div>

### 📝 **Archivos a configurar:**

#### `.env`
```env
# Para certificación (testing):
NEXT_PUBLIC_SII_AMBIENTE="certificacion"
NEXT_PUBLIC_SII_RUT_EMPRESA="77212362-0"

# Para producción:
NEXT_PUBLIC_SII_AMBIENTE="produccion"
NEXT_PUBLIC_SII_RUT_EMPRESA="tu-rut-empresa-real"
```

#### **Certificado .p12**
- Subir archivo a: `certificates/sii-certificado.p12`
- **NUNCA** commitear certificados a Git
- Agregar `certificates/` a `.gitignore`

---

## ⚙️ **6. EJECUCIÓN DE MIGRACIONES**

<div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">

### 🚀 **Comandos de inicialización**

#### 📋 **Paso a paso:**
```bash
# 1. Instalar dependencias (si no está hecho)
npm install

# 2. Generar cliente Prisma
npx prisma generate

# 3. Crear y ejecutar migración inicial
npx prisma migrate dev --name init

# 4. Verificar que todo esté correcto
npx prisma studio
# Se abre interfaz web en localhost:5555

# 5. Iniciar servidor de desarrollo
npm run dev
```

#### ✅ **Verificación exitosa:**
- ✅ Prisma studio muestra tablas vacías
- ✅ Servidor inicia sin errores
- ✅ Dashboard carga correctamente
- ✅ No hay errores en consola del navegador

</div>

---

## 🧪 **7. TESTING Y VERIFICACIÓN**

<div style="background: #e2e3e5; border: 1px solid #6c757d; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">

### 📊 **Checklist de funcionalidades**

| Funcionalidad | Test | Resultado Esperado |
|---------------|------|-------------------|
| **🗄️ Base de datos** | Crear cliente | Se guarda en PostgreSQL |
| **📧 Email** | Enviar notificación | Email real enviado |
| **🔐 Autenticación** | Login/logout | JWT válido generado |
| **🤖 IA** | Consulta fiscal | Respuesta coherente |
| **🏛️ SII** | Validar RUT | Respuesta real del SII |

### 🔧 **Comandos de test:**
```bash
# Test de conexión BD
npm run test:db

# Test de email
npm run test:email

# Test integral
npm run test:all
```

</div>

---

## 📁 **8. ESTRUCTURA DE ARCHIVOS CRÍTICOS**

<div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">

### 📂 **Archivos que DEBES tener:**

```
proyecto/
├── .env                          # 🔑 CRÍTICO - Variables secretas
├── .env.example                  # ✅ Template para otros devs
├── prisma/
│   ├── schema.prisma            # ✅ YA EXISTE - Modelo BD
│   └── migrations/              # 🔄 Se genera automático
├── certificates/                # 📋 CREAR ESTA CARPETA
│   └── sii-certificado.p12     # 🏛️ Certificado SII
├── src/
│   ├── lib/
│   │   └── prisma.ts           # ✅ YA EXISTE - Cliente BD
│   └── services/
│       ├── emailService.ts      # ✅ YA EXISTE - Email real
│       └── auditService.ts      # ✅ YA EXISTE - Auditoría
└── package.json                 # ✅ YA EXISTE - Dependencias
```

### 🔒 **Archivo `.gitignore` actualizado:**
```gitignore
.env
.env.local
certificates/
*.p12
*.pem
node_modules/
.next/
```

</div>

---

## 🚨 **9. PROBLEMAS COMUNES Y SOLUCIONES**

<table style="width: 100%; border-collapse: collapse; margin: 2rem 0;">
<tr style="background-color: #f8f9fa;">
<th style="padding: 1rem; border: 1px solid #dee2e6;">❌ PROBLEMA</th>
<th style="padding: 1rem; border: 1px solid #dee2e6;">🔍 CAUSA</th>
<th style="padding: 1rem; border: 1px solid #dee2e6;">✅ SOLUCIÓN</th>
</tr>
<tr>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">Database connection error</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">PostgreSQL no ejecutándose</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">Verificar Docker: <code>docker ps</code></td>
</tr>
<tr style="background-color: #f8f9fa;">
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">SMTP Error</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">API key inválida</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">Regenerar API key en SendGrid</td>
</tr>
<tr>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">JWT malformed</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">Secret muy corto</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">Generar secret de 64+ caracteres</td>
</tr>
<tr style="background-color: #f8f9fa;">
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">IA no responde</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">API key incorrecta</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">Verificar formato: <code>gsk_...</code></td>
</tr>
<tr>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">SII certificate error</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">Certificado expirado</td>
<td style="padding: 0.8rem; border: 1px solid #dee2e6;">Usar ambiente certificación primero</td>
</tr>
</table>

---

## 💰 **10. COSTOS REALES DE IMPLEMENTACIÓN**

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">

<div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 10px; padding: 1.5rem;">

### 💸 **COSTOS MENSUALES**
- **PostgreSQL**: $0 (Docker local)
- **SendGrid**: $0 (hasta 100 emails/día)
- **Groq API**: $0 (6K tokens/min)
- **Hosting**: $0 (Vercel gratis)
- **Dominio**: $15K CLP/año

**TOTAL MENSUAL: ~$1.200 CLP**

</div>

<div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 1.5rem;">

### 💎 **COSTOS ÚNICOS**
- **Certificado SII**: $50K-200K CLP
- **Desarrollo inicial**: $0 (ya hecho)
- **Testing**: $0
- **Documentación**: $0

**TOTAL ÚNICO: $50K-200K CLP**

</div>

</div>

---

## 🎯 **11. ROADMAP DE IMPLEMENTACIÓN**

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin: 2rem 0;">

<div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 10px; padding: 1.5rem;">
<h3 style="color: #721c24; margin: 0 0 1rem 0;">🚨 DÍA 1: CRÍTICO</h3>
<div style="font-weight: bold; margin-bottom: 0.5rem;">Tiempo: 2-3 horas</div>
<ul style="margin: 0; padding-left: 1.2rem;">
<li>✅ PostgreSQL + Docker</li>
<li>✅ JWT Secrets seguros</li>
<li>✅ Migraciones Prisma</li>
<li>✅ Test básico funcionamiento</li>
</ul>
</div>

<div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 1.5rem;">
<h3 style="color: #856404; margin: 0 0 1rem 0;">⚠️ DÍA 2-3: IMPORTANTE</h3>
<div style="font-weight: bold; margin-bottom: 0.5rem;">Tiempo: 1-2 horas</div>
<ul style="margin: 0; padding-left: 1.2rem;">
<li>📧 SendGrid + Email real</li>
<li>🤖 Groq API + IA real</li>
<li>🧪 Testing completo</li>
<li>📋 Documentación uso</li>
</ul>
</div>

<div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 10px; padding: 1.5rem;">
<h3 style="color: #0c5460; margin: 0 0 1rem 0;">ℹ️ FUTURO: OPCIONAL</h3>
<div style="font-weight: bold; margin-bottom: 0.5rem;">Tiempo: Variable</div>
<ul style="margin: 0; padding-left: 1.2rem;">
<li>🏛️ Certificados SII reales</li>
<li>🌐 Dominio personalizado</li>
<li>📊 Analytics avanzado</li>
<li>🔐 Backup automático</li>
</ul>
</div>

</div>

---

## 📞 **12. SOPORTE Y AYUDA**

<div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 10px; padding: 2rem; margin: 2rem 0;">

### 🆘 **Si tienes problemas:**

#### 📧 **Recursos de ayuda:**
1. **Documentación oficial:**
   - PostgreSQL: https://www.postgresql.org/docs/
   - Prisma: https://www.prisma.io/docs/
   - SendGrid: https://docs.sendgrid.com/
   - Groq: https://console.groq.com/docs/

2. **Comunidades:**
   - Stack Overflow (tag: prisma, postgresql)
   - Discord de Prisma
   - Reddit: r/PostgreSQL, r/nextjs

3. **Videos YouTube:**
   - "PostgreSQL con Docker" 
   - "SendGrid setup tutorial"
   - "Prisma migrations explained"

### 🔧 **Comandos de emergencia:**
```bash
# Resetear base de datos completamente
npx prisma migrate reset

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Ver logs detallados
npm run dev -- --debug
```

</div>

---

## ✅ **13. CHECKLIST FINAL DE VERIFICACIÓN**

<div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 10px; padding: 2rem; margin: 2rem 0;">

### 📋 **Antes de considerar "LISTO"**

- [ ] **PostgreSQL ejecutándose** (docker ps muestra contenedor)
- [ ] **Variables .env configuradas** (todos los valores reales)
- [ ] **Migraciones ejecutadas** (npx prisma migrate dev)
- [ ] **Servidor inicia sin errores** (npm run dev exitoso)
- [ ] **Dashboard carga correctamente** (http://localhost:3000)
- [ ] **Email de prueba enviado** (función test email)
- [ ] **IA responde consultas** (test en /ia-fiscal)
- [ ] **Datos se guardan en BD** (crear cliente de prueba)
- [ ] **Logs de auditoría funcionan** (verificar en BD)
- [ ] **No hay errores en consola** (F12 en navegador)

### 🎉 **Cuando todos estén ✅:**
**TU SISTEMA ESTÁ 100% OPERATIVO EN PRODUCCIÓN**

</div>

---

<div style="background: #343a40; color: white; padding: 2rem; border-radius: 10px; text-align: center; margin: 3rem 0;">

### 📄 **MANUAL TÉCNICO COMPLETO**

**Guía de configuración creada el 15 de junio de 2025**  
**Sistema de Contabilidad Chile v2.0**  
**De MOCK a PRODUCCIÓN en 3 días**

**🎯 OBJETIVO:**  
*Transformar tu sistema de simulación en una plataforma real lista para clientes*

**⏱️ TIEMPO TOTAL ESTIMADO: 4-6 horas**  
**💰 INVERSIÓN TOTAL: $50K-200K CLP (certificados SII)**

</div>

---

*Este manual contiene toda la información técnica necesaria para poner tu sistema en producción real. Sigue los pasos en orden y tendrás un sistema completamente funcional.*
