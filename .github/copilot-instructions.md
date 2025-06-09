<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Instrucciones del Proyecto - Sistema de Contabilidad

Este es un sistema de contabilidad completo construido con Next.js, TypeScript y React.

## Contexto del Proyecto
- **Tipo**: Aplicación web de contabilidad empresarial
- **Stack**: Next.js 14, TypeScript, React, Tailwind CSS
- **Propósito**: Gestión completa de contabilidad empresarial

## Funcionalidades Principales
1. **Gestión de Clientes**: CRUD completo de clientes
2. **Gestión de Proveedores**: CRUD completo de proveedores  
3. **Facturación**: Creación, edición y gestión de facturas
4. **Gestión de Gastos**: Registro y categorización de gastos
5. **Reportes Financieros**: Balance general, estado de resultados, flujo de caja
6. **Dashboard**: Vista general con métricas clave

## Arquitectura
- `/src/app`: Rutas y páginas principales (App Router)
- `/src/components`: Componentes reutilizables
- `/src/lib`: Utilidades y configuraciones
- `/src/types`: Definiciones de tipos TypeScript
- `/src/data`: Gestión de datos y API calls

## Patrones de Código
- Usa componentes funcionales con hooks
- Aplica TypeScript estricto
- Sigue las convenciones de Next.js App Router
- Usa Tailwind CSS para estilos
- Implementa patrones de diseño responsivo
- Maneja estados con React hooks

## Base de Datos
- Inicialmente usa datos en memoria/localStorage
- Estructura preparada para migrar a base de datos real
- Modelos: Cliente, Proveedor, Factura, Gasto, Cuenta

## Consideraciones Especiales
- Formato de moneda en pesos mexicanos (MXN)
- Cálculos de IVA (16%)
- Reportes en formato exportable (PDF/Excel)
- Interfaz intuitiva para usuarios no técnicos
