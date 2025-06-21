'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  FileText, 
  Calculator, 
  Settings, 
  Bell,
  Shield,
  Upload,
  Target,
  BarChart3,
  Calendar,
  Building,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Video,
  Code
} from 'lucide-react';
import LogoutButton from './LogoutButton';

interface MenuItem {
  id: string;
  titulo: string;
  descripcion?: string;
  href: string;
  icono: React.ReactNode;
  badge?: number;
  categoria: 'principal' | 'gestion' | 'reportes' | 'configuracion' | 'aprendizaje';
  estado?: 'activo' | 'beta' | 'nuevo';
}

const menuItems: MenuItem[] = [
  // Principal
  {
    id: 'dashboard',
    titulo: 'Dashboard',
    descripcion: 'Vista general del sistema',
    href: '/',
    icono: <Home className="w-5 h-5" />,
    categoria: 'principal'
  },
  
  // Gestión
  {
    id: 'clientes',
    titulo: 'Clientes',
    descripcion: 'Gestión de clientes',
    href: '/clientes',
    icono: <Users className="w-5 h-5" />,
    categoria: 'gestion',
    badge: 12
  },
  {
    id: 'onboarding-clientes',
    titulo: 'Onboarding Clientes',
    descripcion: 'Alta de nuevos clientes',
    href: '/onboarding-clientes',
    icono: <Target className="w-5 h-5" />,
    categoria: 'gestion',
    estado: 'nuevo',
    badge: 5
  },
  {
    id: 'importacion-masiva',
    titulo: 'Importación Masiva',
    descripcion: 'Carga desde Excel/CSV',
    href: '/importacion-masiva',
    icono: <Upload className="w-5 h-5" />,
    categoria: 'gestion',
    estado: 'nuevo'
  },
  {
    id: 'proveedores',
    titulo: 'Proveedores',
    descripcion: 'Gestión de proveedores',
    href: '/proveedores',
    icono: <Building className="w-5 h-5" />,
    categoria: 'gestion'
  },
  {
    id: 'facturas',
    titulo: 'Facturas',
    descripcion: 'Facturación electrónica',
    href: '/facturas',
    icono: <FileText className="w-5 h-5" />,
    categoria: 'gestion',
    badge: 3
  },
  {
    id: 'gastos',
    titulo: 'Gastos',
    descripcion: 'Control de gastos',
    href: '/gastos',
    icono: <Calculator className="w-5 h-5" />,
    categoria: 'gestion'
  },
  
  // Reportes
  {
    id: 'reportes-avanzados',
    titulo: 'Reportes SII',
    descripcion: 'F29, F22, Libros IVA',
    href: '/reportes-avanzados',
    icono: <BarChart3 className="w-5 h-5" />,
    categoria: 'reportes',
    badge: 2
  },
  {
    id: 'calendario-tributario',
    titulo: 'Calendario Tributario',
    descripcion: 'Fechas importantes',
    href: '/calendario-tributario',
    icono: <Calendar className="w-5 h-5" />,
    categoria: 'reportes',
    badge: 8
  },
  
  // Configuración
  {
    id: 'gestion-certificados',
    titulo: 'Certificados Digitales',
    descripcion: 'Gestión de certificados',
    href: '/gestion-certificados',
    icono: <Shield className="w-5 h-5" />,
    categoria: 'configuracion',
    estado: 'nuevo',
    badge: 1
  },
  {
    id: 'centro-notificaciones',
    titulo: 'Notificaciones',
    descripcion: 'Centro de alertas',
    href: '/centro-notificaciones',
    icono: <Bell className="w-5 h-5" />,
    categoria: 'configuracion',
    estado: 'nuevo',
    badge: 12
  },  {
    id: 'configuracion-sii',
    titulo: 'Configuración SII',
    descripcion: 'Conexión con SII',
    href: '/configuracion-sii',
    icono: <Settings className="w-5 h-5" />,
    categoria: 'configuracion'
  },
  {
    id: 'datos-oficiales-chile',
    titulo: 'Datos Oficiales Chile',
    descripcion: 'SII, Banco Central, INE',    href: '/datos-oficiales-chile',
    icono: <BarChart3 className="w-5 h-5" />,
    categoria: 'configuracion',
    estado: 'nuevo'
  },
  
  // Aprendizaje
  {
    id: 'centro-aprendizaje',
    titulo: 'Centro de Aprendizaje',
    descripcion: 'Tutoriales y recursos',
    href: '/tutoriales',
    icono: <BookOpen className="w-5 h-5" />,
    categoria: 'aprendizaje',
    estado: 'nuevo'
  },
  {
    id: 'video-tutoriales',
    titulo: 'Video Tutoriales',
    descripcion: 'Aprende viendo',
    href: '/videos',
    icono: <Video className="w-5 h-5" />,
    categoria: 'aprendizaje',
    badge: 5
  },
  {
    id: 'demos-interactivas',
    titulo: 'Demos Interactivas',
    descripcion: 'Explora características',
    href: '/demos',
    icono: <Code className="w-5 h-5" />,
    categoria: 'aprendizaje',
    estado: 'nuevo'
  }
];

export default function NavigationSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Estado inicial inteligente: expandir secciones que contienen la página activa
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    const hasActiveItem = (categoria: string) => {
      const items = menuItems.filter(item => item.categoria === categoria);
      return items.some(item => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
    };    return {
      gestion: !hasActiveItem('gestion'),
      reportes: !hasActiveItem('reportes'),
      configuracion: !hasActiveItem('configuracion'),
      aprendizaje: !hasActiveItem('aprendizaje')
    };
  });
  const categorias = {
    principal: 'Principal',
    gestion: 'Gestión',
    reportes: 'Reportes',
    configuracion: 'Configuración',
    aprendizaje: 'Aprendizaje'
  };

  const getEstadoBadge = (estado?: string) => {
    switch (estado) {
      case 'nuevo':
        return <Badge className="bg-green-100 text-green-800 text-xs">Nuevo</Badge>;
      case 'beta':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Beta</Badge>;
      default:
        return null;
    }
  };
  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveItem = (categoria: string) => {
    const items = menuItems.filter(item => item.categoria === categoria);
    return items.some(item => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-100 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}><div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SC</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Sistema Contable</h1>
              <p className="text-sm text-gray-500">Versión Chile 2025</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(categorias).map(([categoria, titulo]) => {
            const items = menuItems.filter(item => item.categoria === categoria);
              return (
              <div key={categoria} className="mb-4">
                {/* Principal se mantiene siempre visible, otros grupos tienen colapso */}
                {categoria === 'principal' ? (
                  <>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      {titulo}
                    </h3>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                            ${isActive(item.href)
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <div className="flex-shrink-0">
                            {item.icono}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.titulo}</span>
                              {getEstadoBadge(item.estado)}
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            {item.descripcion && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.descripcion}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <>                    {/* Header de grupo colapsable */}
                    <button
                      onClick={() => toggleSection(categoria)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200 mb-2 ${
                        hasActiveItem(categoria) 
                          ? 'bg-blue-50 hover:bg-blue-100 border-l-2 border-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <h3 className={`text-xs font-semibold uppercase tracking-wider ${
                        hasActiveItem(categoria) ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {titulo}
                      </h3>                      <div className="flex items-center gap-2">
                        {/* Badge total de items en la sección */}
                        <Badge 
                          variant={hasActiveItem(categoria) ? "default" : "outline"} 
                          className={`text-xs h-5 ${
                            hasActiveItem(categoria) ? 'bg-blue-500 text-white' : ''
                          }`}
                        >
                          {items.length}
                        </Badge>
                        {hasActiveItem(categoria) && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        )}
                        {collapsedSections[categoria] ? (
                          <ChevronRight className={`w-4 h-4 ${
                            hasActiveItem(categoria) ? 'text-blue-500' : 'text-gray-400'
                          }`} />
                        ) : (
                          <ChevronDown className={`w-4 h-4 ${
                            hasActiveItem(categoria) ? 'text-blue-500' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                    </button>
                    
                    {/* Contenido colapsable */}
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      collapsedSections[categoria] ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
                    }`}>
                      <div className="space-y-1 pl-2">
                        {items.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`
                              flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                              ${isActive(item.href)
                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                              }
                            `}
                          >
                            <div className="flex-shrink-0">
                              {item.icono}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.titulo}</span>
                                {getEstadoBadge(item.estado)}
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              {item.descripcion && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.descripcion}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>        {/* Footer */}
        <div className="p-4 space-y-3">
          {/* Botón de Logout */}
          <LogoutButton />
          
          <div className="text-xs text-gray-500 text-center">
            <p>© 2025 Sistema de Contabilidad</p>
            <p>Versión 2.1.0 - Chile</p>
          </div>
        </div>
      </div>
    </>
  );
}
