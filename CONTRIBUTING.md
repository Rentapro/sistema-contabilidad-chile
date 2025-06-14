# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al **Sistema de Contabilidad Chileno**! Esta guía te ayudará a hacer contribuciones efectivas.

## 📋 Tabla de Contenidos

- [🤝 Guía de Contribución](#-guía-de-contribución)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [🚀 Cómo Empezar](#-cómo-empezar)
  - [💻 Configuración del Entorno de Desarrollo](#-configuración-del-entorno-de-desarrollo)
  - [🔄 Proceso de Contribución](#-proceso-de-contribución)
  - [📝 Estándares de Código](#-estándares-de-código)
  - [🧪 Testing](#-testing)
  - [📄 Documentación](#-documentación)
  - [🐛 Reportar Bugs](#-reportar-bugs)
  - [✨ Sugerir Funciones](#-sugerir-funciones)
  - [📞 Obtener Ayuda](#-obtener-ayuda)

## 🚀 Cómo Empezar

1. **Fork** el repositorio
2. **Clone** tu fork localmente
3. **Configura** tu entorno de desarrollo
4. **Crea** una rama para tu contribución
5. **Haz** tus cambios
6. **Envía** un Pull Request

## 💻 Configuración del Entorno de Desarrollo

### Prerrequisitos

- **Node.js** 18.0 o superior
- **npm** o **yarn**
- **Git**

### Instalación

```bash
# 1. Clona tu fork
git clone https://github.com/TU_USUARIO/sistema-contabilidad-chile.git
cd sistema-contabilidad-chile

# 2. Instala dependencias
npm install

# 3. Crea archivo de variables de entorno
cp .env.example .env.local

# 4. Ejecuta en modo desarrollo
npm run dev
```

### Configuración Adicional

```bash
# Configurar upstream para mantener sincronizado con el repo original
git remote add upstream https://github.com/USUARIO_ORIGINAL/sistema-contabilidad-chile.git

# Verificar configuración
git remote -v
```

## 🔄 Proceso de Contribución

### 1. Sincronizar con el Repositorio Principal

```bash
git checkout main
git fetch upstream
git merge upstream/main
```

### 2. Crear una Rama de Trabajo

```bash
# Para nuevas funciones
git checkout -b feature/nombre-descriptivo

# Para corrección de bugs
git checkout -b fix/descripcion-del-bug

# Para mejoras de documentación
git checkout -b docs/descripcion-de-mejora
```

### 3. Hacer Cambios

- Sigue las [convenciones de código](#-estándares-de-código)
- Escribe mensajes de commit descriptivos
- Mantén los commits atómicos (un cambio por commit)

### 4. Probar tus Cambios

```bash
# Ejecutar linting
npm run lint

# Verificar tipos TypeScript
npm run type-check

# Probar en desarrollo
npm run dev
```

### 5. Enviar Pull Request

1. Push a tu fork:
   ```bash
   git push origin nombre-de-tu-rama
   ```

2. Crear Pull Request en GitHub
3. Llenar el template de PR completamente
4. Esperar revisión y feedback

## 📝 Estándares de Código

### TypeScript

- Usa **TypeScript estricto**
- Define tipos explícitos para props y estados
- Evita `any`, usa tipos específicos

```typescript
// ✅ Bien
interface ClienteProps {
  id: string;
  nombre: string;
  email: string;
}

// ❌ Mal
interface ClienteProps {
  data: any;
}
```

### React/Next.js

- Usa **componentes funcionales** con hooks
- Sigue las convenciones de **Next.js App Router**
- Prefiere **named exports** sobre default exports

```typescript
// ✅ Bien
export function DashboardCliente({ cliente }: ClienteProps) {
  return <div>{cliente.nombre}</div>;
}

// ❌ Mal
export default function Component(props: any) {
  return <div>{props.data}</div>;
}
```

### Estilos

- Usa **Tailwind CSS** para estilos
- Agrupa clases relacionadas
- Usa variables CSS para colores personalizados

```tsx
// ✅ Bien
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">

// ❌ Mal
<div className="bg-white rounded-lg shadow-md p-6" style={{boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
```

### Nombres y Convenciones

- **Archivos**: `kebab-case` para páginas, `PascalCase` para componentes
- **Variables**: `camelCase`
- **Constantes**: `SCREAMING_SNAKE_CASE`
- **Interfaces/Types**: `PascalCase`

### Mensajes de Commit

Sigue el formato **Conventional Commits**:

```
tipo(alcance): descripción breve

Descripción más detallada si es necesario.

- Lista de cambios
- Si hay breaking changes, mencionarlos

Closes #123
```

**Tipos permitidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato, estilos
- `refactor`: Refactoring de código
- `test`: Tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**
```
feat(clientes): agregar filtro por RUT

- Implementar componente de filtro
- Agregar validación de RUT
- Actualizar lista de clientes

fix(facturas): corregir cálculo de IVA

El cálculo de IVA no consideraba productos exentos.

Closes #156
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Escribir Tests

- Prueba la funcionalidad principal de cada componente
- Incluye casos edge y manejo de errores
- Usa descripciones claras para los tests

```typescript
describe('ClienteCard', () => {
  it('debería mostrar información del cliente correctamente', () => {
    // Test implementation
  });

  it('debería manejar cliente sin email', () => {
    // Test implementation
  });
});
```

## 📄 Documentación

### Componentes

Documenta componentes complejos:

```typescript
/**
 * Componente para mostrar información de un cliente
 * 
 * @param cliente - Información del cliente
 * @param onEdit - Callback cuando se edita el cliente
 * @param showActions - Si mostrar acciones (editar/eliminar)
 */
export function ClienteCard({ 
  cliente, 
  onEdit, 
  showActions = true 
}: ClienteCardProps) {
  // Implementation
}
```

### README y Documentación

- Mantén el README actualizado
- Documenta APIs y configuraciones
- Incluye ejemplos de uso

## 🐛 Reportar Bugs

1. Verifica que el bug no esté ya reportado
2. Usa el template de **Bug Report**
3. Incluye:
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Información del sistema

## ✨ Sugerir Funciones

1. Revisa issues existentes para evitar duplicados
2. Usa el template de **Feature Request**
3. Incluye:
   - Problema que resuelve
   - Solución propuesta
   - Casos de uso
   - Mockups o wireframes si aplica

## 📞 Obtener Ayuda

### Canales de Comunicación

- **GitHub Issues**: Para bugs y feature requests
- **GitHub Discussions**: Para preguntas generales
- **Email**: contacto@sistema-contabilidad.com

### Antes de Preguntar

1. Revisa la documentación
2. Busca en issues existentes
3. Consulta el código de ejemplo

### Formato de Preguntas

- Se específico sobre el problema
- Incluye código relevante
- Menciona qué has intentado
- Proporciona contexto del caso de uso

---

## 🙏 Reconocimientos

Agradecemos a todos los contribuidores que hacen posible este proyecto. Tu participación es valiosa para la comunidad contable chilena.

### Tipos de Contribución

- 💻 **Código**: Nuevas funciones, bug fixes, mejoras
- 📖 **Documentación**: README, guías, comentarios
- 🐛 **Testing**: Reportar bugs, escribir tests
- 💡 **Ideas**: Sugerencias, feedback, diseño
- 🌐 **Traducciones**: Localización y i18n
- 📢 **Comunidad**: Promoción, tutoriales, ayuda

---

**¡Esperamos tu contribución!** 🚀
