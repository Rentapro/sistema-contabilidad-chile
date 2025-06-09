# Sistema de Contabilidad

Un sistema de contabilidad completo construido con Next.js, TypeScript y React para la gestión empresarial.

## 🚀 Características

- **Gestión de Clientes**: CRUD completo de clientes con validación de RFC
- **Gestión de Proveedores**: Administración de proveedores
- **Facturación Electrónica**: Creación y gestión de facturas con cálculo automático de IVA
- **Control de Gastos**: Registro y categorización de gastos empresariales
- **Dashboard Financiero**: Vista general con métricas clave
- **Reportes**: Balance general, estado de resultados y análisis financieros
- **Interfaz Moderna**: Diseño responsivo con Tailwind CSS

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Estilos**: Tailwind CSS
- **Almacenamiento**: LocalStorage (migrable a base de datos)
- **Validaciones**: RFC mexicano, email, formularios
- **Formato**: Moneda mexicana (MXN), fechas locales

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone [url-del-repositorio]
cd contabilidad
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura del Proyecto

```
src/
├── app/                 # Páginas de la aplicación (App Router)
│   ├── page.tsx        # Dashboard principal
│   ├── clientes/       # Gestión de clientes
│   ├── facturas/       # Gestión de facturas
│   ├── gastos/         # Registro de gastos
│   └── reportes/       # Reportes financieros
├── components/         # Componentes reutilizables
├── data/              # Gestión de datos y API simulada
├── lib/               # Utilidades y funciones auxiliares
└── types/             # Definiciones de tipos TypeScript
```

## 💼 Funcionalidades Principales

### Dashboard
- Resumen de ingresos, gastos y utilidad neta
- Facturas pendientes de pago
- Acceso rápido a todas las secciones

### Gestión de Clientes
- Registro de clientes con datos fiscales
- Validación de RFC mexicano
- Edición y eliminación de registros

### Facturación
- Creación de facturas con múltiples productos/servicios
- Cálculo automático de IVA (16%)
- Gestión de estados (pendiente, pagada, vencida, cancelada)
- Numeración automática de facturas

### Control de Gastos
- Registro de gastos por categoría
- Vinculación con proveedores
- Clasificación de gastos deducibles

## 🔧 Configuración

### Datos Iniciales
El sistema incluye datos de ejemplo que se cargan automáticamente:
- Clientes de muestra
- Proveedores predefinidos
- Productos y servicios básicos

### Personalización
- Modifica `src/data/store.ts` para ajustar los datos iniciales
- Actualiza `src/lib/utils.ts` para cambiar formatos de moneda o fecha
- Personaliza los estilos en `src/app/globals.css`

## 📊 Características Fiscales Mexicanas

- **IVA**: Cálculo automático del 16%
- **RFC**: Validación del formato mexicano
- **Moneda**: Formato en pesos mexicanos (MXN)
- **Fechas**: Formato local mexicano

## 🚀 Próximas Características

- [ ] Integración con base de datos
- [ ] Exportación de reportes a PDF/Excel
- [ ] Envío de facturas por email
- [ ] Conciliación bancaria
- [ ] Catálogo de cuentas contables
- [ ] Inventario de productos
- [ ] Múltiples empresas

## 🤝 Contribución

1. Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes preguntas o necesitas ayuda:
- Abre un issue en GitHub
- Revisa la documentación en `/docs`
- Contacta al equipo de desarrollo

---

Desarrollado con ❤️ para la gestión empresarial moderna.
