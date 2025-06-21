# 🚀 GUÍA DE CONFIGURACIÓN GMAIL + EMAILS CORPORATIVOS

## 📧 Configuración Actual - Conta-IA

### Emails Corporativos Definidos:
- `contaia.czsdigital@gmail.com` (Principal/SMTP)
- `contacto@conta-ia.cl` (Contacto general)
- `contador@conta-ia.cl` (Consultas contables)
- `operaciones@conta-ia.cl` (Operaciones)
- `soporte@conta-ia.cl` (Soporte técnico)

## 🔧 Próximos Pasos para Activar el Sistema

### Paso 1: Configurar Gmail para SMTP

1. **Ir a Gmail** (`contaia.czsdigital@gmail.com`)

2. **Habilitar verificación en 2 pasos**:
   - Configuración → Seguridad
   - Verificación en 2 pasos → Activar

3. **Generar contraseña de aplicación**:
   - Configuración → Seguridad → Contraseñas de aplicaciones
   - Seleccionar "Correo" y "Otro dispositivo personalizado"
   - Nombre: "Sistema Conta-IA"
   - Copiar la contraseña generada (16 caracteres)

4. **Actualizar `.env.local`**:
   ```bash
   SMTP_PASS=la_password_de_aplicacion_aqui
   ```

### Paso 2: Configurar Redirecciones del Dominio

**Opción A: Forwarding Simple** (Recomendado para empezar)
```
contacto@conta-ia.cl → contaia.czsdigital@gmail.com
contador@conta-ia.cl → contaia.czsdigital@gmail.com
operaciones@conta-ia.cl → contaia.czsdigital@gmail.com
soporte@conta-ia.cl → contaia.czsdigital@gmail.com
```

**Dónde configurar**: Panel del proveedor del dominio `conta-ia.cl`

### Paso 3: Probar el Sistema

1. **Arrancar servidor**:
   ```bash
   npm run dev
   ```

2. **Probar formularios**:
   - http://localhost:3000/contacto
   - http://localhost:3000/solicitar-demo
   - http://localhost:3000/consulta-contable
   - http://localhost:3000/soporte

3. **Verificar recepción**:
   - Revisar `contaia.czsdigital@gmail.com`
   - Confirmar que llegan emails con el routing correcto

## 📋 Checklist de Configuración

- [ ] Verificación en 2 pasos activada en Gmail
- [ ] Contraseña de aplicación generada
- [ ] `.env.local` actualizado con nueva password
- [ ] Redirecciones configuradas en el dominio
- [ ] Servidor de desarrollo funcionando
- [ ] Formularios probados
- [ ] Emails recibidos correctamente

## 🎯 Resultado Final

Una vez completado, tendrás:

✅ **Sistema de emails profesional** con dominio corporativo
✅ **Routing inteligente** que dirige cada tipo de consulta al especialista correcto
✅ **Formularios especializados** para diferentes tipos de usuarios
✅ **Configuración robusta** lista para producción

## 🔍 Debugging

Si algo no funciona:

1. **Verificar variables de entorno**:
   ```bash
   echo $SMTP_USER
   echo $SMTP_PASS
   ```

2. **Revisar logs del servidor**:
   ```bash
   npm run dev
   # Buscar errores en la consola
   ```

3. **Probar conexión SMTP**:
   - Usar herramientas como Mailtrap o similar
   - Verificar credenciales Gmail

4. **Confirmar redirecciones**:
   - Enviar email manual a `contacto@conta-ia.cl`
   - Verificar que llega a Gmail principal
