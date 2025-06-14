# 🚀 Guía de Despliegue - Sistema de Contabilidad Chileno

Esta guía te ayudará a desplegar el sistema de contabilidad en diferentes entornos de manera segura y eficiente.

## 📋 Tabla de Contenidos

- [🚀 Guía de Despliegue - Sistema de Contabilidad Chileno](#-guía-de-despliegue---sistema-de-contabilidad-chileno)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [🏗️ Prerrequisitos](#️-prerrequisitos)
  - [🌐 Despliegue en GitHub Pages](#-despliegue-en-github-pages)
  - [☁️ Despliegue en Vercel](#️-despliegue-en-vercel)
  - [🐳 Despliegue con Docker](#-despliegue-con-docker)
  - [🖥️ Despliegue en VPS/Servidor Propio](#️-despliegue-en-vpsservidor-propio)
  - [🔧 Configuración de Variables de Entorno](#-configuración-de-variables-de-entorno)
  - [🛡️ Configuración de Seguridad](#️-configuración-de-seguridad)
  - [📊 Monitoreo y Logs](#-monitoreo-y-logs)
  - [🔄 CI/CD](#-cicd)
  - [🔧 Troubleshooting](#-troubleshooting)

## 🏗️ Prerrequisitos

Antes de comenzar el despliegue, asegúrate de tener:

- **Node.js** 18.0 o superior
- **npm** o **yarn**
- **Git** configurado
- Acceso al repositorio del proyecto
- Variables de entorno configuradas

## 🌐 Despliegue en GitHub Pages

### Configuración Automática

El proyecto incluye un workflow de GitHub Actions para despliegue automático:

1. **Configurar GitHub Pages**:
   ```bash
   # En la configuración del repositorio:
   Settings > Pages > Source > GitHub Actions
   ```

2. **Variables de Entorno en GitHub**:
   ```bash
   # En Settings > Secrets and variables > Actions
   Repository secrets:
   - ENCRYPTION_KEY
   - JWT_SECRET
   - SII_API_KEY (si aplica)
   ```

3. **Trigger del Despliegue**:
   ```bash
   # El despliegue se ejecuta automáticamente al hacer push a main
   git push origin main
   ```

### Configuración Manual

Si prefieres configurar manualmente:

```bash
# 1. Instalar dependencias
npm install

# 2. Construir para producción
npm run build

# 3. Desplegar (usando gh-pages)
npm install -g gh-pages
gh-pages -d out
```

## ☁️ Despliegue en Vercel

### Despliegue con Git Integration

1. **Conectar Repositorio**:
   - Ir a [vercel.com](https://vercel.com)
   - Importar proyecto desde GitHub
   - Seleccionar el repositorio

2. **Configurar Variables de Entorno**:
   ```bash
   # En Vercel Dashboard > Settings > Environment Variables
   ENCRYPTION_KEY=your-encryption-key
   JWT_SECRET=your-jwt-secret
   NEXT_PUBLIC_BASE_PATH=/
   ```

3. **Configurar Build Settings**:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "out",
     "installCommand": "npm install"
   }
   ```

### Despliegue con CLI

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Desplegar
vercel --prod
```

## 🐳 Despliegue con Docker

### Dockerfile

El proyecto incluye un Dockerfile optimizado:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/out ./out
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["npx", "serve", "out", "-p", "3000"]
```

### Comandos Docker

```bash
# 1. Construir imagen
docker build -t sistema-contabilidad .

# 2. Ejecutar contenedor
docker run -p 3000:3000 -e ENCRYPTION_KEY=your-key sistema-contabilidad

# 3. Con Docker Compose
docker-compose up -d
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

## 🖥️ Despliegue en VPS/Servidor Propio

### Con PM2 (Recomendado)

```bash
# 1. Instalar PM2
npm install -g pm2

# 2. Crear archivo ecosystem
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'sistema-contabilidad',
    script: 'npx',
    args: 'serve out -p 3000',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
      JWT_SECRET: process.env.JWT_SECRET
    }
  }]
}
EOF

# 3. Iniciar aplicación
pm2 start ecosystem.config.js

# 4. Configurar startup
pm2 startup
pm2 save
```

### Con Nginx (Proxy Reverso)

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Configuración SSL con Let's Encrypt
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;
}
```

## 🔧 Configuración de Variables de Entorno

### Archivo .env.production

```env
# Configuración de la aplicación
NODE_ENV=production
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_APP_URL=https://tu-dominio.com

# Seguridad
ENCRYPTION_KEY=your-very-secure-encryption-key-32-chars
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret

# Base de datos (cuando se implemente)
DATABASE_URL=postgresql://user:password@localhost:5432/contabilidad

# Servicios SII (para producción real)
SII_API_URL=https://api.sii.cl
SII_API_KEY=your-sii-api-key
SII_ENVIRONMENT=production

# Email y notificaciones
EMAIL_SERVICE_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@tu-dominio.com
SMS_SERVICE_API_KEY=your-sms-service-key

# Monitoreo
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id

# Respaldos
BACKUP_SERVICE_URL=your-backup-service
BACKUP_ENCRYPTION_KEY=your-backup-key
```

### Variables por Plataforma

#### GitHub Actions
```yaml
# .github/workflows/deploy.yml
env:
  ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  NEXT_PUBLIC_BASE_PATH: /sistema-contabilidad-chile
```

#### Vercel
```bash
# Vercel CLI
vercel env add ENCRYPTION_KEY
vercel env add JWT_SECRET
```

#### Docker
```bash
# Docker run
docker run -e ENCRYPTION_KEY=key -e JWT_SECRET=secret

# Docker Compose
environment:
  - ENCRYPTION_KEY=${ENCRYPTION_KEY}
  - JWT_SECRET=${JWT_SECRET}
```

## 🛡️ Configuración de Seguridad

### Headers de Seguridad

```javascript
// next.config.ts
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
];
```

### Rate Limiting

```bash
# Con Nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
    }
}
```

### SSL/TLS

```bash
# Let's Encrypt con Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

## 📊 Monitoreo y Logs

### Configuración de Logs

```javascript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### Monitoreo con PM2

```bash
# Ver logs en tiempo real
pm2 logs sistema-contabilidad

# Monitoreo
pm2 monit

# Métricas
pm2 show sistema-contabilidad
```

### Health Checks

```javascript
// pages/api/health.ts
export default function handler(req, res) {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  };
  
  res.status(200).json(health);
}
```

## 🔄 CI/CD

### GitHub Actions Workflow

```yaml
name: 🚀 Deploy Production

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        env:
          ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
          
      - name: Deploy to Production
        run: |
          # Script de despliegue específico
```

### Scripts de Despliegue

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Iniciando despliegue..."

# Backup de la versión anterior
pm2 save
cp -r /var/www/app /var/www/app.backup

# Actualizar código
git pull origin main
npm ci --production
npm run build

# Reiniciar aplicación
pm2 restart sistema-contabilidad

# Verificar salud
sleep 10
curl -f http://localhost:3000/api/health || exit 1

echo "✅ Despliegue completado exitosamente"
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 404 en GitHub Pages
```bash
# Verificar configuración de basePath
# next.config.ts
basePath: process.env.NODE_ENV === 'production' ? '/repo-name' : ''
```

#### Variables de Entorno No Disponibles
```bash
# Verificar que las variables estén configuradas
echo "ENCRYPTION_KEY: ${ENCRYPTION_KEY:0:10}..."

# En el código
if (!process.env.ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY no está configurada');
}
```

#### Problemas de Build
```bash
# Limpiar cache
rm -rf .next node_modules
npm install
npm run build

# Verificar TypeScript
npm run type-check
```

#### Problemas de Permisos
```bash
# Corregir permisos de archivos
chmod +x deploy.sh
chown -R www-data:www-data /var/www/app
```

### Logs de Debug

```bash
# Habilitar logs detallados
export DEBUG=*
export LOG_LEVEL=debug

# Ver logs específicos
tail -f logs/error.log
journalctl -u nginx -f
```

### Rollback de Emergencia

```bash
#!/bin/bash
# rollback.sh

echo "🔄 Ejecutando rollback..."

# Parar aplicación actual
pm2 stop sistema-contabilidad

# Restaurar backup
rm -rf /var/www/app
mv /var/www/app.backup /var/www/app

# Reiniciar aplicación
pm2 start sistema-contabilidad

echo "✅ Rollback completado"
```

---

## 📞 Soporte

Si encuentras problemas durante el despliegue:

- **Documentación**: Revisa este documento completo
- **Issues**: Crear issue en GitHub con logs completos
- **Email**: deploy-support@sistema-contabilidad.com

---

**¡Feliz despliegue!** 🚀
