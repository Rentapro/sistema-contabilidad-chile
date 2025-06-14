# Configuración de API Key de Groq - Guía Completa

## ¿Qué es Groq?
Groq es una plataforma de IA que ofrece modelos de lenguaje de alta velocidad, especialmente optimizada para inferencia rápida. Es ideal para aplicaciones que requieren respuestas inmediatas como nuestro sistema de asesoría fiscal.

## Paso 1: Obtener tu API Key de Groq

### 1.1 Registrarse en Groq
1. Ve a: https://console.groq.com/
2. Haz clic en "Sign Up" (Registrarse)
3. Completa el registro con tu email
4. Verifica tu email

### 1.2 Crear API Key
1. Una vez dentro del dashboard de Groq
2. Ve a "API Keys" en el menú lateral
3. Haz clic en "Create API Key"
4. Dale un nombre descriptivo como "Sistema-Contabilidad-Chile"
5. Copia la API key generada (empieza con `gsk_`)

## Paso 2: Configurar en tu sistema

### 2.1 Editar archivo .env.local
1. Abre el archivo `.env.local` en la raíz de tu proyecto
2. Busca la línea: `GROQ_API_KEY=tu_clave_groq_aqui`
3. Reemplaza `tu_clave_groq_aqui` por tu API key real de Groq

**Ejemplo:**
```bash
# Antes
GROQ_API_KEY=tu_clave_groq_aqui

# Después (con tu API key real)
GROQ_API_KEY=gsk_1234567890abcdef1234567890abcdef1234567890abcdef
```

### 2.2 Reiniciar el servidor
Después de agregar la API key, reinicia tu servidor de desarrollo:

```bash
# Detener el servidor (Ctrl+C si está corriendo)
# Luego ejecutar:
npm run dev
```

## Paso 3: Verificar funcionamiento

### 3.1 Probar la IA Fiscal
1. Ve al dashboard del contador externo: http://localhost:3000/contador-externo
2. Busca el widget "Asesor Fiscal IA" en la parte inferior
3. Haz una pregunta como: "¿Cuál es la tasa de IVA actual en Chile?"
4. Deberías ver una respuesta rápida y precisa

### 3.2 Indicadores de funcionamiento
- ✅ **Con Groq**: Respuestas muy rápidas (< 2 segundos)
- ⚠️ **Fallback OpenAI**: Respuestas normales (2-5 segundos)
- 🔧 **Fallback local**: Respuestas básicas predefinidas

## Configuración actual en tu sistema

Tu archivo `.env.local` ahora incluye:

```bash
# AI Configuration - Groq (Primaria) y OpenAI (Fallback)
GROQ_API_KEY=tu_clave_groq_aqui                    # ← ACTUALIZAR AQUÍ
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_MODEL=mixtral-8x7b-32768

OPENAI_API_KEY=tu_openai_api_key_aqui              # ← Opcional como fallback
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-3.5-turbo
```

## Ventajas de Groq para tu sistema

1. **Velocidad**: Respuestas en menos de 2 segundos
2. **Costo**: Generalmente más económico que OpenAI
3. **Especialización**: Modelos optimizados para tareas específicas
4. **Fallback inteligente**: Si falla, usa OpenAI automáticamente

## Modelos disponibles en Groq

- `mixtral-8x7b-32768` (Recomendado) - Excelente para asesoría fiscal
- `llama2-70b-4096` - Bueno para consultas generales
- `gemma-7b-it` - Rápido para respuestas cortas

## Troubleshooting

### Error: "Invalid API Key"
- Verifica que copiaste la API key completa
- Asegurate de que no tenga espacios al inicio o final
- La key debe empezar con `gsk_`

### Error: "Model not found"
- Verifica que el modelo esté disponible en tu plan de Groq
- Usa `mixtral-8x7b-32768` como modelo por defecto

### La IA no responde
1. Verifica que el servidor esté reiniciado después de agregar la API key
2. Revisa la consola del navegador para errores
3. Prueba con OpenAI como fallback

## Soporte

Si tienes problemas:
1. Revisa la documentación de Groq: https://console.groq.com/docs
2. Verifica los logs en la consola del navegador
3. El sistema tiene fallback automático a respuestas locales

---

**¡Importante!** 
- Nunca compartas tu API key públicamente
- Mantenla segura en el archivo `.env.local`
- No la subas a repositorios públicos
