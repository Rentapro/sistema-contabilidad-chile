'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useSystemNotifications } from '@/hooks/useSystemNotifications';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  description?: string;
  badge?: number;
  status?: 'active' | 'warning' | 'error' | 'processing';
  requiredPermissions?: string[];
  roles?: string[];
}

const allNavItems: NavItem[] = [
  { 
    href: '/', 
    label: 'Dashboard', 
    icon: '📊', 
    description: 'Vista general del sistema',
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico']
  },  // NUEVOS MÓDULOS MULTI-TENANT
  { 
    href: '/multi-empresa', 
    label: 'Multi-Empresa', 
    icon: '🏢', 
    description: 'Gestión centralizada de múltiples empresas',
    badge: 10,
    status: 'active',
    roles: ['superadmin', 'admin_empresa']
  },
  { 
    href: '/gestion-comercial', 
    label: 'Gestión Comercial', 
    icon: '💰', 
    description: 'Planes, precios y métricas de negocio',
    badge: 531,
    status: 'processing',
    roles: ['superadmin']
  },
  { 
    href: '/control-acceso', 
    label: 'Control de Acceso', 
    icon: '🛡️', 
    description: 'Gestión granular de usuarios y permisos',
    badge: 3,
    status: 'active',
    roles: ['superadmin']
  },  { 
    href: '/notificaciones-personalizadas', 
    label: 'Notificaciones', 
    icon: '🔔', 
    description: 'Sistema de alertas personalizado por rol',
    status: 'active',
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico']
  },
  { 
    href: '/flujos-por-rol', 
    label: 'Flujos de Trabajo', 
    icon: '⚡', 
    description: 'Workflows optimizados por tipo de usuario',
    status: 'active',
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico']
  },// NUEVOS MÓDULOS CONTABLES OBLIGATORIOS
  { 
    href: '/libro-diario', 
    label: 'Libro Diario', 
    icon: '📚', 
    description: 'Registro cronológico de asientos contables',
    badge: 3,
    status: 'active',
    roles: ['superadmin', 'admin_empresa', 'contador']
  },
  { 
    href: '/conciliacion-bancaria', 
    label: 'Conciliación Bancaria', 
    icon: '🏦', 
    description: 'Reconciliación automática banco-contabilidad',
    badge: 5,
    status: 'warning',
    roles: ['superadmin', 'admin_empresa', 'contador']
  },
  { 
    href: '/contador-externo', 
    label: 'Panel Contador',
    icon: '👨‍💼', 
    description: 'Dashboard simplificado para contadores externos',
    badge: 13,
    status: 'warning',
    roles: ['contador_externo']
  },
  // MÓDULOS ORIGINALES
  { 
    href: '/firma', 
    label: 'Centro de Firma', 
    icon: '🏢', 
    description: 'Gestión de la firma contable',
    roles: ['superadmin']
  },
  { 
    href: '/clientes', 
    label: 'Clientes', 
    icon: '👥', 
    description: 'Gestión de clientes',
    requiredPermissions: ['GESTIONAR_CLIENTES', 'GESTIONAR_CLIENTES_PROPIOS'],
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico']
  },
  { 
    href: '/facturas', 
    label: 'Facturas', 
    icon: '📄', 
    description: 'Sistema de facturación electrónica SII',
    requiredPermissions: ['FACTURACION', 'FACTURACION_BASICA'],
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico']
  },
  { 
    href: '/gastos', 
    label: 'Gastos', 
    icon: '💰', 
    description: 'Control de gastos',
    requiredPermissions: ['GESTIONAR_GASTOS'],
    roles: ['superadmin', 'admin_empresa', 'contador']
  },
  { 
    href: '/proveedores', 
    label: 'Proveedores', 
    icon: '🏪', 
    description: 'Gestión de proveedores',
    requiredPermissions: ['GESTIONAR_PROVEEDORES'],
    roles: ['superadmin', 'admin_empresa', 'contador']
  },  { 
    href: '/sii', 
    label: 'Servicios SII', 
    icon: '🇨🇱', 
    description: 'Formularios y servicios SII Chile',
    roles: ['superadmin', 'admin_empresa', 'contador']
  },
  { 
    href: '/alertas-sii', 
    label: 'Alertas SII', 
    icon: '🚨', 
    description: 'Centro de alertas y notificaciones del SII',
    roles: ['superadmin', 'admin_empresa', 'contador'],
    status: 'warning',
    badge: 5
  },
  { 
    href: '/sii-real', 
    label: 'SII Integración Real', 
    icon: '🔗', 
    description: 'Integración directa con APIs del SII',
    status: 'active',
    requiredPermissions: ['INTEGRACION_SII_REAL'],
    roles: ['superadmin', 'admin_empresa', 'contador']
  },
  { 
    href: '/documentos', 
    label: 'Documentos IA', 
    icon: '🤖', 
    description: 'Procesamiento inteligente con IA',
    requiredPermissions: ['ACCESO_IA_AVANZADA'],
    roles: ['superadmin', 'admin_empresa']
  },
  { 
    href: '/workflow', 
    label: 'Workflow', 
    icon: '⚙️', 
    description: 'Gestión de flujos de trabajo',
    roles: ['superadmin', 'admin_empresa']
  },  { 
    href: '/declaraciones', 
    label: 'Declaraciones', 
    icon: '🏛️', 
    description: 'Formularios tributarios',
    requiredPermissions: ['DECLARACIONES', 'DECLARACIONES_SIMPLES'],
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico']
  },
  { 
    href: '/balance-automatico', 
    label: 'Balance Automático', 
    icon: '⚖️', 
    description: 'Balance mensual automático basado en F29 + Estado Financiero + RLI',
    requiredPermissions: ['DECLARACIONES', 'REPORTES_AVANZADOS'],
    roles: ['superadmin', 'admin_empresa', 'contador'],
    status: 'active',
    badge: 1
  },
  { 
    href: '/inteligencia', 
    label: 'Business Intelligence', 
    icon: '🧠', 
    description: 'IA y análisis avanzado',
    requiredPermissions: ['ACCESO_IA_AVANZADA'],
    roles: ['superadmin']
  },  { 
    href: '/ia-fiscal', 
    label: 'IA Fiscal Avanzada', 
    icon: '🧠', 
    description: 'Consultor tributario con IA + Optimizaciones automáticas',
    requiredPermissions: ['ACCESO_IA_AVANZADA'],
    roles: ['superadmin', 'admin_empresa'],
    status: 'active',
    badge: 4
  },
  { 
    href: '/consejos', 
    label: 'Consejos Diarios', 
    icon: '💡', 
    description: 'Tips y estrategias tributarias actualizadas diariamente',
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico']
  },
  { 
    href: '/demo', 
    label: 'Demo Interactivo', 
    icon: '🎬', 
    description: 'Sistema de demos para clientes',
    roles: ['superadmin', 'admin_empresa', 'contador']
  },
  { 
    href: '/analytics', 
    label: 'Analytics', 
    icon: '📈', 
    description: 'Reportes y métricas',
    roles: ['superadmin', 'admin_empresa']
  },
  { 
    href: '/reportes', 
    label: 'Reportes', 
    icon: '📋', 
    description: 'Reportes financieros',
    requiredPermissions: ['REPORTES_EMPRESA', 'REPORTES_BASICOS'],
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico']
  },
  { 
    href: '/notificaciones', 
    label: 'Notificaciones', 
    icon: '🔔', 
    description: 'Centro de notificaciones',
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico']
  },
  { 
    href: '/usuarios', 
    label: 'Usuarios', 
    icon: '👤', 
    description: 'Gestión de usuarios',
    requiredPermissions: ['GESTIONAR_USUARIOS', 'GESTIONAR_USUARIOS_EMPRESA'],
    roles: ['superadmin', 'admin_empresa']
  },
  { 
    href: '/auditoria', 
    label: 'Auditoría', 
    icon: '🔒', 
    description: 'Logs y seguridad',
    requiredPermissions: ['AUDITORIA_COMPLETA'],
    roles: ['superadmin']
  },
  { 
    href: '/bancos', 
    label: 'Bancos', 
    icon: '🏦', 
    description: 'Integraciones bancarias',
    roles: ['superadmin', 'admin_empresa']
  },
  { 
    href: '/backup', 
    label: 'Respaldo de Datos', 
    icon: '💾', 
    description: 'Sistema de respaldo y recuperación',
    requiredPermissions: ['BACKUP_RESTORE'],
    roles: ['superadmin']
  },
  { 
    href: '/advanced-analytics', 
    label: 'Analytics Avanzado', 
    icon: '📊', 
    description: 'Análisis empresarial avanzado',
    requiredPermissions: ['ANALYTICS_AVANZADO'],
    roles: ['superadmin']
  },
  { 
    href: '/export-reports', 
    label: 'Exportador Reportes', 
    icon: '📤', 
    description: 'Generación profesional de reportes avanzados',
    badge: 0,
    status: 'active',
    roles: ['superadmin', 'admin_empresa', 'contador']
  },
  { 
    href: '/real-time-notifications', 
    label: 'Notificaciones Tiempo Real', 
    icon: '🔴', 
    description: 'Sistema avanzado de notificaciones en tiempo real',
    badge: 15,
    status: 'warning',
    roles: ['superadmin', 'admin_empresa', 'contador']
  },
  { 
    href: '/system-config', 
    label: 'Configuración Sistema', 
    icon: '⚙️', 
    description: 'Gestión avanzada de configuración del sistema',
    badge: 3,
    status: 'active',
    roles: ['superadmin']
  },
  { 
    href: '/ai-predictions', 
    label: 'Predicciones IA', 
    icon: '🔮', 
    description: 'Centro de análisis predictivo inteligente',
    badge: 8,
    status: 'active',    roles: ['superadmin', 'admin_empresa']
  },
  { 
    href: '/performance-monitor', 
    label: 'Monitor Performance', 
    icon: '📊', 
    description: 'Monitoreo en tiempo real del rendimiento del sistema',
    badge: 0,
    status: 'active',
    roles: ['superadmin']
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { systemStatus, getNotificationCounts } = useSystemNotifications();
  const { usuario, logout, tienePermiso, empresaActual } = useAuth();
  const notificationCounts = getNotificationCounts();

  // Manejar cierre del menú con tecla ESC
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Filtrar elementos de navegación basado en roles y permisos
  const getFilteredNavItems = (): NavItem[] => {
    if (!usuario) return [];

    return allNavItems.filter(item => {
      // Verificar rol
      if (item.roles && !item.roles.includes(usuario.rol)) {
        return false;
      }

      // Verificar permisos específicos (OR logic - cualquier permiso es suficiente)
      if (item.requiredPermissions) {
        const hasAnyPermission = item.requiredPermissions.some(perm => tienePermiso(perm));
        if (!hasAnyPermission) {
          return false;
        }
      }

      return true;
    });
  };

  // Actualizar badges basado en el estado del sistema
  const getUpdatedNavItems = (): NavItem[] => {
    const filteredItems = getFilteredNavItems();
    
    return filteredItems.map(item => {
      switch (item.href) {
        case '/documentos':
          return { 
            ...item, 
            badge: systemStatus.documentsProcessing,
            status: systemStatus.documentsProcessing > 0 ? 'processing' : 'active'
          };
        case '/notificaciones':
          return { 
            ...item, 
            badge: notificationCounts.total,
            status: notificationCounts.critical > 0 ? 'error' : notificationCounts.warning > 0 ? 'warning' : 'active'
          };
        case '/workflow':
          return { 
            ...item, 
            badge: systemStatus.pendingValidations,
            status: systemStatus.pendingValidations > 5 ? 'warning' : 'active'
          };
        case '/inteligencia':
          return {
            ...item,
            status: 'active'
          };
        default:
          return item;
      }
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-green-500';
    }
  };

  const updatedNavItems = getUpdatedNavItems();  // Agrupar elementos por categorías para mejor organización
  const getCategorizedNavItems = () => {
    const items = getUpdatedNavItems();
    return {
      dashboard: items.filter(item => ['/', '/multi-empresa', '/contador-externo'].includes(item.href)),
      core: items.filter(item => ['/clientes', '/facturas', '/gastos', '/proveedores'].includes(item.href)),
      sii: items.filter(item => ['/sii', '/sii-real', '/alertas-sii'].includes(item.href)),
      advanced: items.filter(item => ['/ia-fiscal', '/inteligencia', '/documentos', '/workflow'].includes(item.href)),
      reports: items.filter(item => ['/reportes', '/analytics', '/declaraciones', '/balance-automatico', '/advanced-analytics', '/export-reports'].includes(item.href)),
      admin: items.filter(item => ['/usuarios', '/control-acceso', '/auditoria', '/system-config', '/real-time-notifications'].includes(item.href)),      other: items.filter(item => ![
        '/', '/multi-empresa', '/contador-externo',
        '/clientes', '/facturas', '/gastos', '/proveedores',
        '/sii', '/sii-real', '/alertas-sii',
        '/ia-fiscal', '/inteligencia', '/documentos', '/workflow',
        '/reportes', '/analytics', '/declaraciones', '/balance-automatico', '/advanced-analytics', '/export-reports',
        '/usuarios', '/control-acceso', '/auditoria', '/system-config',
        '/real-time-notifications'
      ].includes(item.href))
    };
  };

  const categorizedItems = getCategorizedNavItems();
  const mainNavItems = [...categorizedItems.dashboard, ...categorizedItems.core, ...categorizedItems.sii].slice(0, 6);
  return (
    <nav className="backdrop-blur-xl bg-white/80 border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-black/5">
      {/* Header principal minimalista con glass effect */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-12 px-6">          {/* Logo minimalista con efecto neon */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 p-0.5 group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm drop-shadow-lg">FC</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-light text-slate-800 tracking-wide">
                  Firma <span className="font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Contable</span>
                </h1>
                <div className="flex items-center text-xs text-slate-500">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${systemStatus.isOnline ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-red-400 shadow-sm shadow-red-400/50'} animate-pulse`}></div>
                  Sistema IA
                </div>
              </div>
            </Link>
          </div>          {/* Navegación principal minimalista */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center max-w-3xl">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-blue-700 shadow-md shadow-blue-500/10 backdrop-blur-sm border border-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 hover:shadow-md hover:shadow-black/5 hover:backdrop-blur-sm'
                  }`}
                  title={item.description}
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                  <span className="hidden xl:inline font-medium tracking-wide">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <div className="relative">
                      <Badge 
                        variant="secondary" 
                        className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg shadow-red-500/25 animate-pulse"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </Badge>
                    </div>
                  )}
                  {item.status && item.status !== 'active' && (
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.status)} shadow-sm animate-pulse`}></div>
                  )}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/5 to-blue-500/5 animate-pulse"></div>
                  )}
                </Link>
              );
            })}            
            {/* Botón "Más" con efectos neon */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`group px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  isMenuOpen 
                    ? 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-purple-700 shadow-lg shadow-purple-500/10 backdrop-blur-sm border border-purple-500/20' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 hover:shadow-md hover:shadow-black/5'
                }`}
                title="Más módulos"
              >
                <span className="text-base group-hover:scale-110 transition-transform duration-200">⋯</span>
                <span className="hidden xl:inline text-xs font-medium tracking-wide">Más</span>
                <svg 
                  className={`w-3 h-3 transition-all duration-300 ${isMenuOpen ? 'rotate-180 text-purple-600' : 'text-slate-400'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {isMenuOpen && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/5 to-purple-500/5 animate-pulse"></div>
                )}
              </button>
            </div>
          </div>          {/* Panel de usuario ultra minimalista con glass */}
          <div className="flex items-center space-x-3">
            {/* Indicador de empresa para SuperAdmin - glass style */}
            {usuario?.rol === 'superadmin' && empresaActual && (
              <div className="hidden lg:flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg shadow-black/5">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 mr-2 animate-pulse"></div>
                <span className="text-slate-700 font-medium text-xs truncate max-w-24">
                  {empresaActual.nombre}
                </span>
              </div>
            )}

            {/* Panel de usuario con glass morphism */}
            <div className="flex items-center space-x-3 px-3 py-1.5 bg-white/30 backdrop-blur-md rounded-xl border border-white/40 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
              {/* Info del usuario */}
              <div className="hidden md:block text-right">
                <p className="text-xs font-semibold text-slate-800 leading-none tracking-wide">
                  {usuario?.nombre} {usuario?.apellido}
                </p>
                <div className="flex items-center justify-end mt-1 space-x-2">
                  <span className="text-xs text-slate-600 capitalize font-medium">
                    {usuario?.rol === 'superadmin' ? 'Super Admin' : 
                     usuario?.rol === 'admin_empresa' ? 'Admin' :
                     usuario?.rol === 'contador' ? 'Contador' : 'Cliente'}
                  </span>
                  {(empresaActual?.tipoLicencia || usuario?.licencia) !== 'superadmin' && (
                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold leading-none backdrop-blur-sm border ${
                      (empresaActual?.tipoLicencia || usuario?.licencia) === 'premium' 
                        ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-orange-700 border-orange-300/30 shadow-sm shadow-orange-400/20' :
                      (empresaActual?.tipoLicencia || usuario?.licencia) === 'trial' 
                        ? 'bg-gradient-to-r from-orange-400/20 to-red-400/20 text-red-700 border-red-300/30 shadow-sm shadow-red-400/20' :
                        'bg-gradient-to-r from-emerald-400/20 to-green-400/20 text-emerald-700 border-emerald-300/30 shadow-sm shadow-emerald-400/20'
                    }`}>
                      {empresaActual?.tipoLicencia || usuario?.licencia}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Avatar con glass y neon */}
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                  <span className="text-white text-xs font-bold drop-shadow-lg">
                    {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-white/20 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Botón de logout minimalista con neon hover */}
              <button
                onClick={logout}
                className="group p-2 text-slate-500 hover:text-red-500 rounded-lg transition-all duration-300 hover:bg-white/40 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/20"
                title="Cerrar Sesión"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>          {/* Botón menú móvil con glass effect */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group p-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-slate-600 hover:text-slate-900 hover:bg-white/40 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>      {/* Overlay glassmorphism para cerrar menú */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-30 backdrop-blur-sm bg-black/10" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}      {/* Barra de navegación secundaria expandible con glass morphism */}
      <div className={`relative bg-gradient-to-r from-white/60 via-blue-50/80 to-purple-50/60 backdrop-blur-xl border-t border-transparent transition-all duration-500 ease-in-out overflow-hidden shadow-lg shadow-black/5 ${
        isMenuOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-3">
              {/* Categorías de navegación horizontal con glass effects */}
            <div className="flex items-center space-x-8 flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              {/* Módulos Avanzados IA */}
              {categorizedItems.advanced.length > 0 && (
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="flex items-center space-x-2 px-2 py-1 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-lg backdrop-blur-sm border border-purple-300/20">
                    <span className="text-purple-600 text-sm">🧠</span>
                    <span className="text-xs font-semibold text-purple-700 tracking-wide">IA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {categorizedItems.advanced.slice(0, 3).map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-800 shadow-lg shadow-purple-500/20 backdrop-blur-sm border border-purple-400/30'
                              : 'text-slate-700 hover:bg-white/60 hover:shadow-lg hover:shadow-black/5 hover:backdrop-blur-sm hover:text-purple-700'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                          title={item.description}
                        >
                          <span className="text-sm group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                          <span className="font-semibold tracking-wide">{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <Badge 
                              variant="secondary" 
                              className="h-4 w-4 p-0 text-xs bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0 shadow-md animate-pulse"
                            >
                              {item.badge > 9 ? '9+' : item.badge}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}              {/* Reportes */}
              {categorizedItems.reports.length > 0 && (
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="flex items-center space-x-2 px-2 py-1 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg backdrop-blur-sm border border-emerald-300/20">
                    <span className="text-emerald-600 text-sm">📊</span>
                    <span className="text-xs font-semibold text-emerald-700 tracking-wide">Reportes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {categorizedItems.reports.slice(0, 3).map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-800 shadow-lg shadow-emerald-500/20 backdrop-blur-sm border border-emerald-400/30'
                              : 'text-slate-700 hover:bg-white/60 hover:shadow-lg hover:shadow-black/5 hover:backdrop-blur-sm hover:text-emerald-700'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                          title={item.description}
                        >
                          <span className="text-sm group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                          <span className="font-semibold tracking-wide">{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <Badge 
                              variant="secondary" 
                              className="h-4 w-4 p-0 text-xs bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-md"
                            >
                              {item.badge > 9 ? '9+' : item.badge}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}              {/* Administración */}
              {categorizedItems.admin.length > 0 && (
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="flex items-center space-x-2 px-2 py-1 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-lg backdrop-blur-sm border border-red-300/20">
                    <span className="text-red-600 text-sm">⚙️</span>
                    <span className="text-xs font-semibold text-red-700 tracking-wide">Admin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {categorizedItems.admin.slice(0, 3).map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-800 shadow-lg shadow-red-500/20 backdrop-blur-sm border border-red-400/30'
                              : 'text-slate-700 hover:bg-white/60 hover:shadow-lg hover:shadow-black/5 hover:backdrop-blur-sm hover:text-red-700'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                          title={item.description}
                        >
                          <span className="text-sm group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                          <span className="font-semibold tracking-wide">{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <Badge 
                              variant="secondary" 
                              className="h-4 w-4 p-0 text-xs bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-md"
                            >
                              {item.badge > 9 ? '9+' : item.badge}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}              {/* Otros módulos con estilo compacto */}
              {categorizedItems.other.length > 0 && (
                <>
                  <div className="flex items-center space-x-2">
                    {categorizedItems.other.slice(0, 4).map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-800 shadow-lg shadow-blue-500/20 backdrop-blur-sm border border-blue-400/30'
                              : 'text-slate-700 hover:bg-white/60 hover:shadow-lg hover:shadow-black/5 hover:backdrop-blur-sm hover:text-blue-700'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                          title={item.description}
                        >
                          <span className="text-sm group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                          <span className="font-medium tracking-wide truncate max-w-20">{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <Badge 
                              variant="secondary" 
                              className="h-4 w-4 p-0 text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-md"
                            >
                              {item.badge > 9 ? '9+' : item.badge}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Panel de control del menú con glass */}
            <div className="flex items-center space-x-3 flex-shrink-0 ml-6">
              <div className="px-3 py-1 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
                <span className="text-xs text-slate-600 font-medium">
                  {[...categorizedItems.advanced, ...categorizedItems.reports, ...categorizedItems.admin, ...categorizedItems.other].length} módulos
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="group p-1.5 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-lg transition-all duration-300 backdrop-blur-sm"
                title="Cerrar barra de módulos (ESC)"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>      {/* Menú móvil rediseñado con glass morphism */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-white/95 to-slate-50/95 backdrop-blur-xl border-t border-white/20 shadow-2xl">
          <div className="px-6 py-4 space-y-4 max-h-screen overflow-y-auto">
            {/* Panel de usuario móvil con glass */}
            <div className="flex items-center space-x-4 pb-4 border-b border-white/30">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-white text-lg font-bold drop-shadow-lg">
                    {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-white/20 backdrop-blur-sm"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 tracking-wide">
                  {usuario?.nombre} {usuario?.apellido}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-slate-600 capitalize font-medium">
                    {usuario?.rol === 'superadmin' ? 'Super Admin' : 
                     usuario?.rol === 'admin_empresa' ? 'Admin' :
                     usuario?.rol === 'contador' ? 'Contador' : 'Cliente'}
                  </span>
                  {(empresaActual?.tipoLicencia || usuario?.licencia) !== 'superadmin' && (
                    <div className={`px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm border ${
                      (empresaActual?.tipoLicencia || usuario?.licencia) === 'premium' 
                        ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-orange-700 border-orange-300/30' :
                      (empresaActual?.tipoLicencia || usuario?.licencia) === 'trial' 
                        ? 'bg-gradient-to-r from-orange-400/20 to-red-400/20 text-red-700 border-red-300/30' :
                        'bg-gradient-to-r from-emerald-400/20 to-green-400/20 text-emerald-700 border-emerald-300/30'
                    }`}>
                      {empresaActual?.tipoLicencia || usuario?.licencia}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-3 text-red-500 hover:text-red-700 bg-red-50/50 hover:bg-red-100/70 rounded-xl transition-all duration-300 backdrop-blur-sm"
                title="Cerrar Sesión"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            {/* Elementos principales */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 px-2 mb-2">Principal</div>
              {[...categorizedItems.dashboard, ...categorizedItems.core].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-xs">
                          {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* SII */}
            {categorizedItems.sii.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 px-2 mb-2">SII Chile</div>
                {categorizedItems.sii.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                        isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {item.badge !== undefined && item.badge > 0 && (
                          <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-xs">
                            {item.badge > 99 ? '99+' : item.badge}
                          </Badge>
                        )}
                        {item.status && item.status !== 'active' && (
                          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.status)}`}></div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Otros módulos colapsados */}
            <details className="space-y-1">
              <summary className="text-xs font-medium text-gray-500 px-2 cursor-pointer hover:text-gray-700">
                Más Módulos ({[...categorizedItems.advanced, ...categorizedItems.reports, ...categorizedItems.admin, ...categorizedItems.other].length})
              </summary>
              <div className="space-y-1 mt-2">
                {[...categorizedItems.advanced, ...categorizedItems.reports, ...categorizedItems.admin, ...categorizedItems.other].map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                        isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xs">{item.icon}</span>
                        <div>
                          <div className="font-medium text-xs">{item.label}</div>
                          <div className="text-xs text-gray-500 truncate max-w-40">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {item.badge !== undefined && item.badge > 0 && (
                          <Badge variant="destructive" className="h-3 w-3 p-0 flex items-center justify-center text-xs">
                            {item.badge > 9 ? '9+' : item.badge}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </details>
          </div>
        </div>
      )}      {/* Barra de estado del sistema ultra minimalista con glass */}
      <div className={`relative backdrop-blur-md border-t border-transparent transition-all duration-300 ${
        systemStatus.isOnline 
          ? 'bg-gradient-to-r from-emerald-50/80 to-green-50/80' 
          : 'bg-gradient-to-r from-red-50/80 to-rose-50/80'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className={`relative w-2 h-2 rounded-full ${
                  systemStatus.isOnline ? 'bg-emerald-400' : 'bg-red-400'
                }`}>
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                    systemStatus.isOnline ? 'bg-emerald-400' : 'bg-red-400'
                  }`}></div>
                </div>
                <span className={`font-medium ${
                  systemStatus.isOnline ? 'text-emerald-800' : 'text-red-800'
                }`}>
                  {systemStatus.isOnline ? 'Sistema Online' : 'Sistema Offline'}
                </span>
              </div>
                {systemStatus.documentsProcessing > 0 && (
                <>
                  <div className="w-px h-3 bg-slate-200/30"></div>
                  <div className="flex items-center space-x-1 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-300/20">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-700 font-medium">
                      {systemStatus.documentsProcessing} documentos
                    </span>
                  </div>
                </>
              )}
                {systemStatus.criticalAlerts > 0 && (
                <>
                  <div className="w-px h-3 bg-slate-200/30"></div>
                  <div className="flex items-center space-x-1 px-2 py-0.5 bg-red-500/10 rounded-full border border-red-300/20">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-700 font-bold">
                      {systemStatus.criticalAlerts} alertas críticas
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-2 px-2 py-1 bg-white/30 backdrop-blur-sm rounded-lg border border-white/40">
                <span className="text-slate-600 font-medium">IA Fiscal Activa</span>
                <div className="relative">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  <div className="absolute inset-0 w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
              
              <div className="text-slate-500 font-medium">
                Chile SII Connected
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
