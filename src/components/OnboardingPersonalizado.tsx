'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Crown, 
  Briefcase, 
  Building2, 
  CheckCircle,
  ArrowRight,
  Play,
  FileText,
  Calculator,
  Settings,
  Star,
  Target,
  Award,
  Zap,
  Clock,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PasoOnboarding {
  id: string;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
  accion: string;
  href?: string;
  completado: boolean;
  prioridad: 'alta' | 'media' | 'baja';
  tiempoEstimado: string;
  beneficio: string;
  tags: string[];
  prerequisitos?: string[];
}

interface EstadoOnboarding {
  iniciado: boolean;
  completado: boolean;
  pasoActual: number;
  fechaInicio: Date;
  fechaUltimaActividad: Date;
  tiempoTotal: number; // en minutos
  pausado: boolean;
}

interface TooltipInfo {
  visible: boolean;
  pasoId: string;
  mensaje: string;
}

const ONBOARDING_SUPER_ADMIN: PasoOnboarding[] = [
  {
    id: 'configurar-plataforma',
    titulo: 'Configurar Plataforma Global',
    descripcion: 'Establecer configuraciones maestras y políticas de la plataforma',
    icono: <Settings className="h-6 w-6" />,
    accion: 'Configurar Sistema',
    href: '/system-config',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '15-20 min',
    beneficio: 'Control total de la plataforma',
    tags: ['configuración', 'sistema', 'maestro'],
    prerequisitos: []
  },
  {
    id: 'crear-empresas',
    titulo: 'Crear Primera Empresa',
    descripcion: 'Agregar empresas al sistema y configurar sus parámetros iniciales',
    icono: <Building2 className="h-6 w-6" />,
    accion: 'Gestionar Empresas',
    href: '/empresas-management',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '10-15 min',
    beneficio: 'Base para facturación y operaciones',
    tags: ['empresas', 'configuración', 'básico'],
    prerequisitos: ['configurar-plataforma']
  },
  {
    id: 'configurar-usuarios',
    titulo: 'Configurar Usuarios y Roles',
    descripcion: 'Definir usuarios administradores y permisos granulares',
    icono: <User className="h-6 w-6" />,
    accion: 'Gestionar Usuarios',
    href: '/usuarios',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '20-25 min',
    beneficio: 'Seguridad y control de acceso',
    tags: ['usuarios', 'seguridad', 'permisos'],
    prerequisitos: ['crear-empresas']
  },
  {
    id: 'revisar-analytics',
    titulo: 'Configurar Analytics Globales',
    descripcion: 'Activar monitoreo y métricas de toda la plataforma',
    icono: <Target className="h-6 w-6" />,
    accion: 'Ver Analytics',
    href: '/advanced-analytics',
    completado: false,
    prioridad: 'media',
    tiempoEstimado: '10-15 min',
    beneficio: 'Insights de negocio y rendimiento',
    tags: ['analytics', 'métricas', 'monitoreo'],
    prerequisitos: ['configurar-usuarios']
  }
];

const ONBOARDING_ADMIN_EMPRESA: PasoOnboarding[] = [
  {
    id: 'configurar-empresa',
    titulo: 'Completar Perfil de Empresa',
    descripcion: 'Verificar datos tributarios, logos y configuración básica',
    icono: <Building2 className="h-6 w-6" />,
    accion: 'Completar Perfil',
    href: '/configuracion-empresa',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '10-15 min',
    beneficio: 'Documentos legales correctos',
    tags: ['empresa', 'configuración', 'básico'],
    prerequisitos: []
  },
  {
    id: 'configurar-sii',
    titulo: 'Conectar con SII',
    descripcion: 'Configurar certificados digitales y conexión tributaria',
    icono: <FileText className="h-6 w-6" />,
    accion: 'Configurar SII',
    href: '/configuracion-sii',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '15-20 min',
    beneficio: 'Facturación electrónica automática',
    tags: ['sii', 'tributario', 'certificados'],
    prerequisitos: ['configurar-empresa']
  },
  {
    id: 'importar-clientes',
    titulo: 'Importar Base de Clientes',
    descripcion: 'Subir clientes existentes desde Excel o sistema anterior',
    icono: <User className="h-6 w-6" />,
    accion: 'Importar Clientes',
    href: '/clientes/importar',
    completado: false,
    prioridad: 'media',
    tiempoEstimado: '15-25 min',
    beneficio: 'Facturación inmediata',
    tags: ['clientes', 'importar', 'datos'],
    prerequisitos: ['configurar-sii']
  },
  {
    id: 'primera-factura',
    titulo: 'Crear Primera Factura',
    descripcion: 'Generar tu primera factura electrónica de prueba',
    icono: <Calculator className="h-6 w-6" />,
    accion: 'Crear Factura',
    href: '/facturas/nueva',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '5-10 min',
    beneficio: 'Validar funcionamiento del sistema',
    tags: ['facturación', 'prueba', 'validación'],
    prerequisitos: ['importar-clientes']
  }
];

const ONBOARDING_CLIENTE: PasoOnboarding[] = [
  {
    id: 'completar-perfil',
    titulo: 'Completar tu Perfil',
    descripcion: 'Agregar información de contacto y preferencias',
    icono: <User className="h-6 w-6" />,
    accion: 'Completar Perfil',
    href: '/perfil',
    completado: false,
    prioridad: 'media',
    tiempoEstimado: '5-10 min',
    beneficio: 'Experiencia personalizada'
  },
  {
    id: 'explorar-reportes',
    titulo: 'Explorar Reportes Disponibles',
    descripcion: 'Conocer qué reportes puedes generar con tu plan actual',
    icono: <FileText className="h-6 w-6" />,
    accion: 'Ver Reportes',
    href: '/reportes',
    completado: false,
    prioridad: 'baja',
    tiempoEstimado: '10-15 min',
    beneficio: 'Mejor toma de decisiones'
  },
  {
    id: 'configurar-notificaciones',
    titulo: 'Configurar Notificaciones',
    descripcion: 'Personalizar alertas de vencimientos y recordatorios',
    icono: <Settings className="h-6 w-6" />,
    accion: 'Configurar Alertas',
    href: '/notificaciones',
    completado: false,
    prioridad: 'media',
    tiempoEstimado: '5-10 min',
    beneficio: 'Nunca pierdas fechas importantes'
  },
  {
    id: 'upgrade-plan',
    titulo: 'Considerar Upgrade del Plan',
    descripcion: 'Evaluar funcionalidades premium que podrían beneficiarte',
    icono: <Star className="h-6 w-6" />,
    accion: 'Ver Planes',
    href: '/planes',
    completado: false,
    prioridad: 'baja',
    tiempoEstimado: '5-10 min',
    beneficio: 'Acceso a funcionalidades avanzadas'
  }
];

const ONBOARDING_CONTADOR: PasoOnboarding[] = [
  {
    id: 'configurar-workspace',
    titulo: 'Configurar Espacio de Trabajo',
    descripcion: 'Personalizar vista de empresas asignadas y herramientas',
    icono: <Briefcase className="h-6 w-6" />,
    accion: 'Configurar Workspace',
    href: '/contador/workspace',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '10-15 min',
    beneficio: 'Máxima productividad'
  },
  {
    id: 'revisar-empresas',
    titulo: 'Revisar Empresas Asignadas',
    descripcion: 'Conocer el estado tributario y pendientes de cada empresa',
    icono: <Building2 className="h-6 w-6" />,
    accion: 'Ver Empresas',
    href: '/contador/empresas',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '15-20 min',
    beneficio: 'Control total de cartera'
  },
  {
    id: 'configurar-automatizacion',
    titulo: 'Configurar Automatización',
    descripcion: 'Activar recordatorios automáticos y workflows',
    icono: <Zap className="h-6 w-6" />,
    accion: 'Configurar Workflows',
    href: '/workflow-automation',
    completado: false,
    prioridad: 'media',
    tiempoEstimado: '15-20 min',
    beneficio: 'Reducir trabajo manual'
  },
  {
    id: 'generar-primer-reporte',
    titulo: 'Generar Primer Reporte',
    descripcion: 'Crear un reporte consolidado de todas tus empresas',
    icono: <FileText className="h-6 w-6" />,
    accion: 'Generar Reporte',
    href: '/reportes-consolidados',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '10-15 min',
    beneficio: 'Demostrar valor a clientes'
  }
];

export default function OnboardingPersonalizado() {
  const { usuario } = useAuth();
  const [pasosOnboarding, setPasosOnboarding] = useState<PasoOnboarding[]>([]);
  const [mostrarOnboarding, setMostrarOnboarding] = useState(true);
  const [pasoActual, setPasoActual] = useState(0);

  useEffect(() => {
    if (!usuario) return;    let pasos: PasoOnboarding[] = [];
    
    switch (usuario.rol) {
      case 'superadmin':
        pasos = ONBOARDING_SUPER_ADMIN;
        break;
      case 'admin_empresa':
        pasos = ONBOARDING_ADMIN_EMPRESA;
        break;
      case 'contador':
        pasos = ONBOARDING_CONTADOR;
        break;
      case 'cliente_basico':
      default:
        pasos = ONBOARDING_CLIENTE;
        break;
    }

    // Cargar progreso guardado del localStorage
    const progresoGuardado = localStorage.getItem(`onboarding-progress-${usuario.id}`);
    if (progresoGuardado) {
      const idsCompletados = JSON.parse(progresoGuardado);
      pasos = pasos.map(paso => ({
        ...paso,
        completado: idsCompletados.includes(paso.id)
      }));
    }

    setPasosOnboarding(pasos);

    // Verificar si debe mostrar onboarding
    const onboardingCompletado = localStorage.getItem(`onboarding-completed-${usuario.id}`);
    const progreso = pasos.filter(p => p.completado).length / pasos.length;
    
    // Solo mostrar si no está completado Y el progreso es menor al 80%
    if (!onboardingCompletado && progreso < 0.8) {
      setMostrarOnboarding(true);
    }
  }, [usuario?.rol, usuario?.id]);
  const completarPaso = (pasoId: string) => {
    setPasosOnboarding(prev => {
      const nuevosParsos = prev.map(paso => 
        paso.id === pasoId 
          ? { ...paso, completado: true }
          : paso
      );
      
      // Guardar progreso en localStorage
      const idsCompletados = nuevosParsos.filter(p => p.completado).map(p => p.id);
      localStorage.setItem(`onboarding-progress-${usuario?.id}`, JSON.stringify(idsCompletados));
      
      return nuevosParsos;
    });
  };

  const saltarOnboarding = () => {
    setMostrarOnboarding(false);
    // Marcar como completado permanentemente
    localStorage.setItem(`onboarding-completed-${usuario?.id}`, 'true');
  };

  const completarOnboarding = () => {
    saltarOnboarding();
    // Mostrar mensaje de congratulaciones
    if (typeof window !== 'undefined') {
      alert('¡Felicitaciones! Has completado la configuración inicial. Tu sistema está listo para usar.');
    }
  };

  const progreso = (pasosOnboarding.filter(p => p.completado).length / pasosOnboarding.length) * 100;

  if (!mostrarOnboarding || !usuario) return null;
  const getRolIcon = () => {
    switch (usuario.rol) {
      case 'superadmin': return <Crown className="h-8 w-8" />;
      case 'admin_empresa': return <Building2 className="h-8 w-8" />;
      case 'contador': return <Briefcase className="h-8 w-8" />;
      default: return <User className="h-8 w-8" />;
    }
  };
  const getRolTitle = () => {
    switch (usuario.rol) {
      case 'superadmin': return 'SuperAdministrador';
      case 'admin_empresa': return 'Administrador de Empresa';
      case 'contador': return 'Contador Profesional';
      default: return 'Cliente';
    }
  };
  const getRolDescription = () => {
    switch (usuario.rol) {
      case 'superadmin': return 'Gestiona toda la plataforma y empresas';
      case 'admin_empresa': return 'Administra tu empresa y facturación';
      case 'contador': return 'Maneja múltiples empresas clientes';
      default: return 'Accede a reportes y funcionalidades básicas';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                {getRolIcon()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">¡Bienvenido, {usuario.nombre}!</h2>
                <p className="text-blue-100 text-lg">{getRolTitle()}</p>
                <p className="text-blue-200 text-sm">{getRolDescription()}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white hover:bg-opacity-20"
              onClick={saltarOnboarding}
            >
              Saltar Tour
            </Button>
          </div>

          {/* Barra de Progreso */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progreso de Configuración</span>
              <span>{Math.round(progreso)}% Completado</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pasos de Onboarding */}
        <div className="p-6">
          <div className="grid gap-4">
            {pasosOnboarding.map((paso, index) => (
              <Card 
                key={paso.id}
                className={`transition-all duration-200 ${
                  paso.completado 
                    ? 'bg-green-50 border-green-200' 
                    : paso.prioridad === 'alta' 
                      ? 'bg-red-50 border-red-200'
                      : paso.prioridad === 'media'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        paso.completado 
                          ? 'bg-green-500 text-white' 
                          : paso.prioridad === 'alta'
                            ? 'bg-red-500 text-white'
                            : paso.prioridad === 'media'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-gray-500 text-white'
                      }`}>
                        {paso.completado ? <CheckCircle className="h-5 w-5" /> : paso.icono}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{paso.titulo}</h3>
                          <Badge variant={
                            paso.prioridad === 'alta' ? 'destructive' :
                            paso.prioridad === 'media' ? 'default' : 'secondary'
                          }>
                            {paso.prioridad}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{paso.descripcion}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>⏱️ {paso.tiempoEstimado}</span>
                          <span>💡 {paso.beneficio}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {paso.completado ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✅ Completado
                        </Badge>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => {
                            if (paso.href) {
                              window.open(paso.href, '_blank');
                            }
                            completarPaso(paso.id);
                          }}
                          className="flex items-center space-x-1"
                        >
                          <Play className="h-4 w-4" />
                          <span>{paso.accion}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>💡 <strong>Tip:</strong> Completar estos pasos te ayudará a aprovechar al máximo el sistema</p>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={saltarOnboarding}>
                Continuar Más Tarde
              </Button>
              {progreso === 100 && (
                <Button onClick={saltarOnboarding} className="bg-green-600 hover:bg-green-700">
                  <Award className="h-4 w-4 mr-2" />
                  ¡Configuración Completa!
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
