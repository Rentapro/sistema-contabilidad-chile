# 🇨🇱 CONFIGURACIÓN SII REAL - GUÍA PASO A PASO

## 📋 **DATOS REQUERIDOS PARA INTEGRACIÓN REAL**

### 1. **Información de tu Empresa**
```
- RUT de la empresa: 772123620
- Razón social: constructora capi zapallar spa
- Giro comercial: construccion
- Email institucional: contacto@capizallar.cl
- Teléfono empresa: 973732599
```

### 2. **Credenciales SII Portal**
```
- Usuario SII: capi zapallar
- RUT usuario: 772123620
- Clave SII: diego2016
```

### 3. **Certificado Digital SII** (Si tienes)
```
- ¿Tienes certificado digital? [✅] Sí [ ] No
- Archivo .pfx (PERFECTO): 17427220-4.pfx
- Contraseña certificado: 2138
```

### 4. **Ambiente de Trabajo**
```
- [✅] Certificación (Pruebas) - RECOMENDADO
- [ ] Producción (Real) - Para después
```

---

## 🛡️ **CONFIGURACIÓN PASO A PASO**

### **PASO 1: Configurar Variables de Entorno**

Una vez que completes los datos arriba, actualizaremos el archivo `.env.local` con:

```bash
# SII CHILE - TUS DATOS REALES
NEXT_PUBLIC_SII_RUT_EMPRESA=tu-rut-empresa
SII_USUARIO=tu-usuario-sii
SII_CLAVE=tu-clave-sii
SII_RUT_USUARIO=tu-rut-personal

# Certificado Digital (si tienes)
SII_CERTIFICADO_PATH=./certificates/certificado.p12
SII_CERTIFICADO_PASSWORD=tu-password-certificado

# Ambiente
NEXT_PUBLIC_SII_AMBIENTE=certificacion  # cambiar a 'produccion' cuando esté listo
```

### **PASO 2: Configurar Certificado Digital**

Si tienes certificado digital del SII:
1. Coloca el archivo `.p12` en la carpeta `certificates/`
2. Actualiza la configuración con la ruta y contraseña

Si NO tienes certificado:
- Te ayudamos a obtenerlo del SII
- O configuramos autenticación alternativa

### **PASO 3: Probar Conexión**

Ejecutaremos pruebas de conexión para validar:
- ✅ Autenticación con SII
- ✅ Validación de RUT
- ✅ Consulta de folios
- ✅ Envío de documentos de prueba

---

## 🎯 **PRÓXIMOS PASOS**

1. **Completa los datos** arriba
2. **Avísame** cuando estén listos
3. **Configuramos** las credenciales
4. **Probamos** la integración
5. **¡Sistema funcionando!** 🚀

---

## 📞 **¿NECESITAS AYUDA?**

Si no tienes algunos datos o certificados, te ayudo a:
- Obtenerlos del SII
- Configurar autenticación alternativa
- Usar ambiente de certificación para pruebas

**¡Empecemos!** 💪
