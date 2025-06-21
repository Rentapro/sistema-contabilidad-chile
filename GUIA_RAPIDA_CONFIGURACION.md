# 🚀 GUÍA RÁPIDA DE CONFIGURACIÓN
## Sistema de Contabilidad Chile - Producción en 3 Pasos

---

## 📊 **ESTADO ACTUAL Y OBJETIVO**

<table style="width: 100%; border-collapse: collapse;">
<tr style="background-color: #f8f9fa;">
<th style="padding: 0.8rem; border: 1px solid #ddd;">Componente</th>
<th style="padding: 0.8rem; border: 1px solid #ddd;">Estado Actual</th>
<th style="padding: 0.8rem; border: 1px solid #ddd;">Acción Requerida</th>
<th style="padding: 0.8rem; border: 1px solid #ddd;">Tiempo</th>
</tr>
<tr>
<td style="padding: 0.6rem; border: 1px solid #ddd;">🗄️ Base de Datos</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">❌ MOCK</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">PostgreSQL</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">30min</td>
</tr>
<tr style="background-color: #f8f9fa;">
<td style="padding: 0.6rem; border: 1px solid #ddd;">📧 Email</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">❌ SIMULADO</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">SendGrid</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">15min</td>
</tr>
<tr>
<td style="padding: 0.6rem; border: 1px solid #ddd;">🔐 Seguridad</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">❌ EJEMPLO</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">JWT Secrets</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">5min</td>
</tr>
<tr style="background-color: #f8f9fa;">
<td style="padding: 0.6rem; border: 1px solid #ddd;">🤖 IA</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">⚠️ OPCIONAL</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">Groq API</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">10min</td>
</tr>
</table>

**🎯 OBJETIVO:** Pasar de sistema MOCK a sistema REAL en 1 hora

---

## 🔧 **PASO 1: BASE DE DATOS POSTGRESQL (30 min)**

### 🐘 **Opción A: Docker (Recomendada)**
```bash
# 1. Instalar Docker Desktop
# Windows: https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe

# 2. Ejecutar PostgreSQL
docker run --name postgres-contabilidad \
  -e POSTGRES_PASSWORD=MiPassword123! \
  -e POSTGRES_DB=contabilidad_chile \
  -p 5432:5432 -d postgres:15

# 3. Verificar
docker ps
```

### 🌐 **Opción B: Cloud Gratuito**
- **Supabase:** https://supabase.com (500MB gratis)
- **Railway:** https://railway.app ($5 crédito)
- **Heroku:** https://heroku.com (10K filas gratis)

### 📝 **Actualizar archivo `.env`:**
```env
DATABASE_URL="postgresql://postgres:MiPassword123!@localhost:5432/contabilidad_chile"
```

### ✅ **Ejecutar migraciones:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 📧 **PASO 2: EMAIL REAL SENDGRID (15 min)**

### 📬 **Configuración SendGrid**
1. **Registro:** https://sendgrid.com/free/
2. **API Key:** Settings → API Keys → Create API Key
3. **Permisos:** Full Access
4. **Copiar:** `SG.tu-api-key-muy-larga`

### 📝 **Actualizar archivo `.env`:**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASSWORD="SG.tu-sendgrid-api-key-real"
```

### 🔄 **Alternativa: Gmail (Solo testing)**
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="tu-app-password-16-chars"
```

---

## 🔐 **PASO 3: JWT SECRETS SEGUROS (5 min)**

### 🔑 **Generar secrets únicos:**
```bash
# Ejecutar en terminal:
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('NEXTAUTH_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

### 📝 **Actualizar archivo `.env`:**
```env
JWT_SECRET="tu-jwt-secret-generado-128-caracteres"
NEXTAUTH_SECRET="tu-nextauth-secret-diferente-128-caracteres"
```

---

## 🤖 **PASO 4: IA GROQ API (10 min) - OPCIONAL**

### 🧠 **Configuración Groq**
1. **Registro:** https://console.groq.com
2. **API Key:** Dashboard → API Keys → Create
3. **Formato:** `gsk_tu-groq-key-40-caracteres`

### 📝 **Actualizar archivo `.env`:**
```env
GROQ_API_KEY="gsk_tu-groq-api-key-real"
```

---

## 🧪 **VERIFICACIÓN FINAL**

### ✅ **Checklist de funcionamiento:**
```bash
# 1. Iniciar servidor
npm run dev

# 2. Abrir navegador
http://localhost:3000

# 3. Verificar que NO hay errores en consola (F12)
# 4. Crear un cliente de prueba
# 5. Verificar que se guarda en BD (Prisma Studio)
npx prisma studio
```

### 🚨 **Problemas comunes:**
| Error | Solución |
|-------|----------|
| Database connection | Verificar Docker: `docker ps` |
| SMTP Error | Regenerar API key SendGrid |
| JWT malformed | Generar secrets más largos |

---

## 💰 **COSTOS REALES**

<table style="width: 100%; border-collapse: collapse;">
<tr style="background-color: #f8f9fa;">
<th style="padding: 0.8rem; border: 1px solid #ddd;">Servicio</th>
<th style="padding: 0.8rem; border: 1px solid #ddd;">Costo Mensual</th>
<th style="padding: 0.8rem; border: 1px solid #ddd;">Límite Gratis</th>
</tr>
<tr>
<td style="padding: 0.6rem; border: 1px solid #ddd;">PostgreSQL (Docker)</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">$0</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">Ilimitado local</td>
</tr>
<tr style="background-color: #f8f9fa;">
<td style="padding: 0.6rem; border: 1px solid #ddd;">SendGrid</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">$0</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">100 emails/día</td>
</tr>
<tr>
<td style="padding: 0.6rem; border: 1px solid #ddd;">Groq API</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">$0</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">6K tokens/minuto</td>
</tr>
<tr style="background-color: #f8f9fa;">
<td style="padding: 0.6rem; border: 1px solid #ddd;"><strong>TOTAL</strong></td>
<td style="padding: 0.6rem; border: 1px solid #ddd;"><strong>$0</strong></td>
<td style="padding: 0.6rem; border: 1px solid #ddd;"><strong>Suficiente para 100+ clientes</strong></td>
</tr>
</table>

---

## 📁 **ARCHIVO .env COMPLETO**

```env
# Base de Datos
DATABASE_URL="postgresql://postgres:MiPassword123!@localhost:5432/contabilidad_chile"

# JWT Secrets (GENERAR NUEVOS)
JWT_SECRET="tu-jwt-secret-128-caracteres-hexadecimales"
NEXTAUTH_SECRET="tu-nextauth-secret-diferente-128-caracteres"

# Email Service
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASSWORD="SG.tu-sendgrid-api-key-completa"

# IA (Opcional)
GROQ_API_KEY="gsk_tu-groq-api-key-40-caracteres"

# SII Chile (Opcional - Producción)
NEXT_PUBLIC_SII_API_BASE_URL="https://palena.sii.cl"
NEXT_PUBLIC_SII_AMBIENTE="certificacion"
NEXT_PUBLIC_SII_RUT_EMPRESA="77212362-0"
```

---

## 🎯 **ROADMAP DE 1 HORA**

<table style="width: 100%; border-collapse: collapse;">
<tr style="background-color: #f8f9fa;">
<th style="padding: 0.8rem; border: 1px solid #ddd;">Tiempo</th>
<th style="padding: 0.8rem; border: 1px solid #ddd;">Tarea</th>
<th style="padding: 0.8rem; border: 1px solid #ddd;">Estado</th>
</tr>
<tr>
<td style="padding: 0.6rem; border: 1px solid #ddd;">0-30min</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">PostgreSQL + Migraciones</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">⬜</td>
</tr>
<tr style="background-color: #f8f9fa;">
<td style="padding: 0.6rem; border: 1px solid #ddd;">30-45min</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">SendGrid + JWT</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">⬜</td>
</tr>
<tr>
<td style="padding: 0.6rem; border: 1px solid #ddd;">45-55min</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">Groq API + Testing</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">⬜</td>
</tr>
<tr style="background-color: #f8f9fa;">
<td style="padding: 0.6rem; border: 1px solid #ddd;">55-60min</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">Verificación Final</td>
<td style="padding: 0.6rem; border: 1px solid #ddd;">⬜</td>
</tr>
</table>

---

## 🆘 **COMANDOS DE EMERGENCIA**

```bash
# Si algo sale mal, resetear:
npx prisma migrate reset

# Reinstalar todo:
rm -rf node_modules package-lock.json
npm install

# Ver estado Docker:
docker ps
docker logs postgres-contabilidad

# Test de conexión:
npx prisma studio
```

---

## ✅ **CHECKLIST FINAL - ANTES DE "LISTO"**

- [ ] ✅ Docker muestra PostgreSQL corriendo
- [ ] ✅ Archivo `.env` tiene valores reales (no ejemplos)
- [ ] ✅ `npm run dev` inicia sin errores
- [ ] ✅ Dashboard carga en http://localhost:3000
- [ ] ✅ Crear cliente de prueba funciona
- [ ] ✅ No hay errores en consola del navegador
- [ ] ✅ Prisma Studio muestra datos guardados

### 🎉 **CUANDO TODOS ESTÉN ✅:**
**TU SISTEMA ESTÁ 100% OPERATIVO EN PRODUCCIÓN**

---

**📊 RESULTADO FINAL:** Sistema real con base de datos persistente, emails reales, IA funcional y seguridad empresarial

**⏱️ TIEMPO TOTAL:** 1 hora

**💰 COSTO TOTAL:** $0 (completamente gratis)

**🚀 PRÓXIMO PASO:** ¡Agregar clientes reales y facturar!

---

*Guía creada el 15 de junio de 2025 - Sistema de Contabilidad Chile v2.0*
