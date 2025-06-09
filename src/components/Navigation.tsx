'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  },
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
  },
  { 
    href: '/sii', 
    label: 'Servicios SII', 
    icon: '🇨🇱', 
    description: 'Formularios y servicios SII Chile',
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
  },
  { 
    href: '/declaraciones', 
    label: 'Declaraciones', 
    icon: '🏛️', 
    description: 'Formularios tributarios',
    requiredPermissions: ['DECLARACIONES', 'DECLARACIONES_SIMPLES'],
    roles: ['superadmin', 'admin_empresa', 'contador', 'cliente_basico']
  },
  { 
    href: '/inteligencia', 
    label: 'Business Intelligence', 
    icon: '🧠', 
    description: 'IA y análisis avanzado',
    requiredPermissions: ['ACCESO_IA_AVANZADA'],
    roles: ['superadmin']
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
    label: 'Exportador de Reportes', 
    icon: '📤', 
    description: 'Generación profesional de reportes',
    requiredPermissions: ['REPORTES_AVANZADOS'],
    roles: ['superadmin', 'admin_empresa']
  },
  { 
    href: '/real-time-notifications', 
    label: 'Notificaciones en Tiempo Real', 
    icon: '🔔', 
    description: 'Sistema avanzado de notificaciones',
    requiredPermissions: ['NOTIFICACIONES_AVANZADAS'],
    roles: ['superadmin', 'admin_empresa']
  },
  { 
    href: '/company-configuration', 
    label: 'Configuración de Empresa', 
    icon: '🏢', 
    description: 'Gestión avanzada de configuraciones empresariales',
    requiredPermissions: ['CONFIGURACION_EMPRESA'],
    roles: ['superadmin', 'admin_empresa']
  },
  { 
    href: '/plan-management', 
    label: 'Gestión de Planes', 
    icon: '💼', 
    description: 'Administración de planes y suscripciones',
    requiredPermissions: ['GESTION_PLANES'],
    roles: ['superadmin']
  },
  { 
    href: '/workflow-automation', 
    label: 'Automatización de Workflows', 
    icon: '⚡', 
    description: 'Sistema avanzado de automatización de procesos',
    requiredPermissions: ['WORKFLOW_AUTOMATION'],
    roles: ['superadmin', 'admin_empresa']
  },
  { 
    href: '/documentos-ia', 
    label: 'Gestión Inteligente de Documentos', 
    icon: '🤖', 
    description: 'Procesamiento de documentos con IA y OCR',
    requiredPermissions: ['DOCUMENTOS_IA'],
    roles: ['superadmin', 'admin_empresa']
  },
  { 
    href: '/monitoreo-financiero', 
    label: 'Monitor Financiero en Tiempo Real', 
    icon: '📊', 
    description: 'Supervisión continua de métricas financieras',
    requiredPermissions: ['MONITOR_FINANCIERO'],
    roles: ['superadmin', 'admin_empresa', 'contador']
  },
  { 
    href: '/system-status', 
    label: 'Estado del Sistema', 
    icon: '🎯', 
    description: 'Vista completa del estado de la plataforma',
    requiredPermissions: ['SYSTEM_STATUS'],
    roles: ['superadmin']
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { systemStatus, getNotificationCounts } = useSystemNotifications();
  const { usuario, logout, tienePermiso, empresaActual } = useAuth();
  const notificationCounts = getNotificationCounts();

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

  const updatedNavItems = getUpdatedNavItems();

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Firma Contable</h1>
                <p className="text-xs text-gray-500 flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-1 ${systemStatus.isOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  Sistema Automatizado IA
                </p>
              </div>
            </Link>
          </div>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {updatedNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={item.description}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </Badge>
                  )}
                  {item.status && (
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${getStatusColor(item.status)}`}></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Información del usuario y opciones */}
          <div className="flex items-center space-x-4">
            {/* Selector de empresa para SuperAdmin */}
            {usuario?.rol === 'superadmin' && empresaActual && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-lg">
                <span className="text-xs text-blue-600 font-medium">Empresa:</span>
                <span className="text-xs text-blue-800 font-semibold">{empresaActual.nombre}</span>
              </div>
            )}

            {/* Información del usuario */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {usuario?.nombre} {usuario?.apellido}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {usuario?.rol === 'superadmin' ? 'Super Admin' : 
                   usuario?.rol === 'admin_empresa' ? 'Admin Empresa' :
                   usuario?.rol === 'contador' ? 'Contador' : 'Cliente'}
                  {usuario?.licencia !== 'superadmin' && (
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                      usuario?.licencia === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                      usuario?.licencia === 'trial' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {usuario?.licencia}
                    </span>
                  )}
                </p>
              </div>
              
              {/* Avatar del usuario */}
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
                </span>
              </div>

              {/* Botón de logout */}
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Cerrar Sesión"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navegación compacta para tablets */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {updatedNavItems.slice(0, 8).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative p-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={`${item.label} - ${item.description}`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              title="Más opciones"
            >
              <span className="text-lg">⋯</span>
            </button>
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Indicadores rápidos móvil */}
            <div className="flex space-x-1">
              {systemStatus.documentsProcessing > 0 && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
              {systemStatus.criticalAlerts > 0 && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil mejorado */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg mt-2 shadow-lg">
              {updatedNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center justify-between px-3 py-3 rounded-md text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <div>
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {item.badge > 9 ? '9+' : item.badge}
                        </Badge>
                      )}
                      {item.status && (
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Indicador de estado del sistema mejorado */}
      <div className={`border-t transition-colors duration-300 ${
        systemStatus.isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  systemStatus.isOnline ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <span className={systemStatus.isOnline ? 'text-green-800' : 'text-red-800'}>
                  {systemStatus.isOnline ? 'Sistema Operativo' : 'Sistema Offline'}
                </span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">
                Procesando: {systemStatus.documentsProcessing} docs
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">
                Última sincronización: {systemStatus.lastSync.toLocaleTimeString()}
              </span>
              {systemStatus.criticalAlerts > 0 && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="text-red-600 font-medium">
                    {systemStatus.criticalAlerts} alertas críticas
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span>IA Activa</span>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
              <span>v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
