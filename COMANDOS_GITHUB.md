# 🚀 Comandos para Subir a GitHub

## Una vez que tengas la URL de tu repositorio, ejecuta:

```bash
# 1. Agregar el repositorio remoto (reemplaza [TU_USUARIO] con tu usuario de GitHub)
git remote add origin https://github.com/[TU_USUARIO]/sistema-contabilidad-chileno.git

# 2. Verificar que se agregó correctamente
git remote -v

# 3. Subir el código y establecer upstream
git push -u origin main

# 4. Subir los tags
git push origin --tags
```

## Autenticación
Si es tu primera vez subiendo a GitHub desde esta máquina, podrías necesitar:

### Opción 1: Personal Access Token (Recomendado)
1. Ve a GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Genera un nuevo token con permisos de `repo`
3. Usa tu username y el token como password cuando te lo pida

### Opción 2: SSH (Más seguro a largo plazo)
```bash
# Generar clave SSH
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"

# Agregar a SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Mostrar clave pública para copiar a GitHub
cat ~/.ssh/id_ed25519.pub
```

Luego agregar la clave pública en GitHub Settings → SSH and GPG keys

## Después de subir
1. Configura la descripción y topics en GitHub
2. Habilita GitHub Pages si quieres deployment automático
3. Configura branch protection rules si trabajas en equipo

## Topics Sugeridos para GitHub
- `nextjs`
- `typescript`
- `contabilidad`
- `chile`
- `sii`
- `multi-tenant`
- `artificial-intelligence`
- `enterprise`
- `accounting`
- `fintech`
