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
  X,
  Pause,
  RotateCcw
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
  progreso: number; // porcentaje
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
    beneficio: 'Experiencia personalizada',
    tags: ['perfil', 'básico', 'personalización'],
    prerequisitos: []
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
    beneficio: 'Conocer capacidades del sistema',
    tags: ['reportes', 'exploración', 'funcionalidades'],
    prerequisitos: ['completar-perfil']
  },
  {
    id: 'configurar-notificaciones',
    titulo: 'Configurar Notificaciones',
    descripcion: 'Personalizar alertas de vencimientos y recordatorios',
    icono: <Settings className="h-6 w-6" />,
    accion: 'Configurar Alertas',
    href: '/configuracion/notificaciones',
    completado: false,
    prioridad: 'media',
    tiempoEstimado: '5-10 min',
    beneficio: 'No perder fechas importantes',
    tags: ['notificaciones', 'alertas', 'automatización'],
    prerequisitos: ['completar-perfil']
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
    beneficio: 'Maximizar valor del sistema',
    tags: ['planes', 'upgrade', 'premium'],
    prerequisitos: ['explorar-reportes']
  }
];

const ONBOARDING_CONTADOR: PasoOnboarding[] = [
  {
    id: 'configurar-workspace',
    titulo: 'Configurar Espacio de Trabajo',
    descripcion: 'Personalizar vista de empresas asignadas y herramientas',
    icono: <Briefcase className="h-6 w-6" />,
    accion: 'Configurar Workspace',
    href: '/workspace',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '10-15 min',
    beneficio: 'Productividad optimizada',
    tags: ['workspace', 'personalización', 'productividad'],
    prerequisitos: []
  },
  {
    id: 'revisar-empresas',
    titulo: 'Revisar Empresas Asignadas',
    descripcion: 'Conocer el estado tributario y pendientes de cada empresa',
    icono: <Building2 className="h-6 w-6" />,
    accion: 'Ver Empresas',
    href: '/empresas-asignadas',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '15-20 min',
    beneficio: 'Visión clara de responsabilidades',
    tags: ['empresas', 'estado', 'pendientes'],
    prerequisitos: ['configurar-workspace']
  },
  {
    id: 'configurar-automatizacion',
    titulo: 'Configurar Automatización',
    descripcion: 'Activar recordatorios automáticos y workflows',
    icono: <Zap className="h-6 w-6" />,
    accion: 'Automatizar',
    href: '/automatizacion',
    completado: false,
    prioridad: 'media',
    tiempoEstimado: '10-15 min',
    beneficio: 'Reducir trabajo manual',
    tags: ['automatización', 'workflows', 'eficiencia'],
    prerequisitos: ['revisar-empresas']
  },
  {
    id: 'generar-primer-reporte',
    titulo: 'Generar Primer Reporte',
    descripcion: 'Crear un reporte consolidado de todas tus empresas',
    icono: <FileText className="h-6 w-6" />,
    accion: 'Generar Reporte',
    href: '/reportes/consolidado',
    completado: false,
    prioridad: 'alta',
    tiempoEstimado: '10-20 min',
    beneficio: 'Información ejecutiva centralizada',
    tags: ['reportes', 'consolidado', 'análisis'],
    prerequisitos: ['configurar-automatizacion']
  }
];

export default function OnboardingPersonalizado() {
  const { usuario: user } = useAuth();
  const [estado, setEstado] = useState<EstadoOnboarding | null>(null);
  const [pasosActuales, setPasosActuales] = useState<PasoOnboarding[]>([]);
  const [pasoActivoId, setPasoActivoId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo>({ visible: false, pasoId: '', mensaje: '' });
  const [mostrarCompletados, setMostrarCompletados] = useState(false);
  const [filtroTags, setFiltroTags] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    // Cargar estado del onboarding desde localStorage
    const estadoGuardado = localStorage.getItem(`onboarding_${user.id}`);
    if (estadoGuardado) {
      const estadoParsed = JSON.parse(estadoGuardado);
      estadoParsed.fechaInicio = new Date(estadoParsed.fechaInicio);
      estadoParsed.fechaUltimaActividad = new Date(estadoParsed.fechaUltimaActividad);
      setEstado(estadoParsed);
    }

    // Determinar pasos según rol
    let pasos: PasoOnboarding[] = [];
    switch (user.rol) {
      case 'superadmin':
        pasos = [...ONBOARDING_SUPER_ADMIN];
        break;
      case 'admin_empresa':
        pasos = [...ONBOARDING_ADMIN_EMPRESA];
        break;
      case 'contador':
        pasos = [...ONBOARDING_CONTADOR];
        break;
      case 'cliente_basico':
        pasos = [...ONBOARDING_CLIENTE];
        break;
    }

    // Cargar progreso de pasos
    const progresoPasos = localStorage.getItem(`onboarding_pasos_${user.id}`);
    if (progresoPasos) {
      const pasosParsed = JSON.parse(progresoPasos);
      pasos = pasos.map(paso => ({
        ...paso,
        completado: pasosParsed[paso.id] || false
      }));
    }

    setPasosActuales(pasos);
  }, [user]);

  const iniciarOnboarding = () => {
    const nuevoEstado: EstadoOnboarding = {
      iniciado: true,
      completado: false,
      pasoActual: 0,
      fechaInicio: new Date(),
      fechaUltimaActividad: new Date(),
      tiempoTotal: 0,
      pausado: false,
      progreso: 0
    };
    
    setEstado(nuevoEstado);
    localStorage.setItem(`onboarding_${user?.id}`, JSON.stringify(nuevoEstado));
  };

  const completarPaso = (pasoId: string) => {
    const nuevoPasos = pasosActuales.map(paso => 
      paso.id === pasoId ? { ...paso, completado: true } : paso
    );
    
    setPasosActuales(nuevoPasos);
    
    // Guardar progreso
    const progreso = nuevoPasos.reduce((acc, paso) => ({
      ...acc,
      [paso.id]: paso.completado
    }), {});
    
    localStorage.setItem(`onboarding_pasos_${user?.id}`, JSON.stringify(progreso));
    
    // Actualizar estado general
    const completados = nuevoPasos.filter(p => p.completado).length;
    const porcentajeProgreso = Math.round((completados / nuevoPasos.length) * 100);
    
    if (estado) {
      const nuevoEstado = {
        ...estado,
        progreso: porcentajeProgreso,
        completado: porcentajeProgreso === 100,
        fechaUltimaActividad: new Date()
      };
      
      setEstado(nuevoEstado);
      localStorage.setItem(`onboarding_${user?.id}`, JSON.stringify(nuevoEstado));
    }

    // Mostrar mensaje de éxito
    setTooltip({
      visible: true,
      pasoId,
      mensaje: '¡Paso completado exitosamente! 🎉'
    });

    setTimeout(() => {
      setTooltip({ visible: false, pasoId: '', mensaje: '' });
    }, 3000);
  };

  const reiniciarOnboarding = () => {
    localStorage.removeItem(`onboarding_${user?.id}`);
    localStorage.removeItem(`onboarding_pasos_${user?.id}`);
    setEstado(null);
    
    // Reset de todos los pasos
    const pasosReset = pasosActuales.map(paso => ({ ...paso, completado: false }));
    setPasosActuales(pasosReset);
  };

  const pausarOnboarding = () => {
    if (estado) {
      const nuevoEstado = { ...estado, pausado: !estado.pausado };
      setEstado(nuevoEstado);
      localStorage.setItem(`onboarding_${user?.id}`, JSON.stringify(nuevoEstado));
    }
  };

  const getRoleIcon = (rol: string) => {
    switch (rol) {
      case 'superadmin': return <Crown className="h-6 w-6 text-purple-500" />;
      case 'admin_empresa': return <Building2 className="h-6 w-6 text-blue-500" />;
      case 'contador': return <Briefcase className="h-6 w-6 text-green-500" />;
      case 'cliente_basico': return <User className="h-6 w-6 text-orange-500" />;
      default: return <User className="h-6 w-6" />;
    }
  };

  const getRoleTitle = (rol: string) => {
    switch (rol) {
      case 'superadmin': return 'SuperAdmin';
      case 'admin_empresa': return 'Admin de Empresa';
      case 'contador': return 'Contador';
      case 'cliente_basico': return 'Cliente';
      default: return 'Usuario';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const pasosPendientes = pasosActuales.filter(p => !p.completado);
  const pasosCompletados = pasosActuales.filter(p => p.completado);
  const progreso = pasosActuales.length > 0 ? Math.round((pasosCompletados.length / pasosActuales.length) * 100) : 0;

  if (!user) return null;

  // Si no hay onboarding iniciado, mostrar pantalla de bienvenida
  if (!estado || !estado.iniciado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                {getRoleIcon(user.rol)}
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ¡Bienvenido, {user.nombre}!
              </CardTitle>
              <p className="text-lg text-gray-600 mt-2">
                Configuremos tu experiencia como <strong>{getRoleTitle(user.rol)}</strong>
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Lo que configuraremos
                  </h3>
                  <div className="space-y-3">
                    {pasosActuales.slice(0, 3).map((paso, index) => (
                      <div key={paso.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="flex-shrink-0 mt-1">
                          {paso.icono}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{paso.titulo}</h4>
                          <p className="text-sm text-gray-600">{paso.descripcion}</p>
                        </div>
                      </div>
                    ))}
                    {pasosActuales.length > 3 && (
                      <div className="text-center text-sm text-gray-500 font-medium">
                        Y {pasosActuales.length - 3} pasos más...
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                    Beneficios
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-green-800">Sistema configurado correctamente</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                      <Zap className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-blue-800">Flujos de trabajo optimizados</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                      <Target className="h-5 w-5 text-purple-500 flex-shrink-0" />
                      <span className="text-purple-800">Máximo aprovechamiento de funcionalidades</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">Tiempo estimado:</span>
                    </div>
                    <p className="text-lg font-bold">
                      {Math.round(pasosActuales.reduce((acc, paso) => {
                        const tiempo = parseInt(paso.tiempoEstimado.split('-')[0]);
                        return acc + tiempo;
                      }, 0))} - {Math.round(pasosActuales.reduce((acc, paso) => {
                        const tiempo = parseInt(paso.tiempoEstimado.split('-')[1]);
                        return acc + tiempo;
                      }, 0))} minutos
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={iniciarOnboarding}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Comenzar Configuración
                </Button>
                <p className="text-sm text-gray-500 mt-3">
                  Puedes pausar y continuar en cualquier momento
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Pantalla principal de onboarding
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header con progreso */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getRoleIcon(user.rol)}
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Configuración para {getRoleTitle(user.rol)}
                  </CardTitle>
                  <p className="text-gray-600">
                    {estado.completado 
                      ? '¡Configuración completa! 🎉' 
                      : `${pasosCompletados.length} de ${pasosActuales.length} pasos completados`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pausarOnboarding}
                  className={estado.pausado ? 'bg-green-50 border-green-200' : ''}
                >
                  {estado.pausado ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {estado.pausado ? 'Continuar' : 'Pausar'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={reiniciarOnboarding}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reiniciar
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progreso general</span>
                <span>{progreso}%</span>
              </div>
              <Progress value={progreso} className="h-3" />
            </div>
          </CardHeader>
        </Card>

        {/* Controles de filtros */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant={mostrarCompletados ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMostrarCompletados(!mostrarCompletados)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {mostrarCompletados ? 'Ocultar completados' : 'Mostrar completados'}
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                {estado.pausado && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <Pause className="h-4 w-4" />
                    Configuración pausada
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de pasos */}
        <div className="grid gap-6">
          {pasosActuales
            .filter(paso => mostrarCompletados || !paso.completado)
            .map((paso, index) => {
              const puedeCompletar = !paso.prerequisitos || 
                paso.prerequisitos.every(prereq => 
                  pasosActuales.find(p => p.id === prereq)?.completado
                );

              return (
                <Card 
                  key={paso.id} 
                  className={`transition-all duration-300 shadow-lg hover:shadow-xl border-0 ${
                    paso.completado 
                      ? 'bg-green-50/80 backdrop-blur-sm' 
                      : puedeCompletar 
                        ? 'bg-white/80 backdrop-blur-sm hover:bg-white/90' 
                        : 'bg-gray-50/80 backdrop-blur-sm opacity-60'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 p-4 rounded-full ${
                        paso.completado 
                          ? 'bg-green-100' 
                          : puedeCompletar 
                            ? 'bg-blue-100' 
                            : 'bg-gray-100'
                      }`}>
                        {paso.completado ? (
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        ) : (
                          paso.icono
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {paso.titulo}
                            </h3>
                            <p className="text-gray-600 mb-3">
                              {paso.descripcion}
                            </p>
                            
                            <div className="flex items-center gap-4 mb-3">
                              <Badge className={getPrioridadColor(paso.prioridad)}>
                                {paso.prioridad.toUpperCase()}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                {paso.tiempoEstimado}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {paso.tags.map(tag => (
                                <Badge 
                                  key={tag} 
                                  variant="outline" 
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-sm font-medium text-blue-800">Beneficio:</span>
                                  <p className="text-sm text-blue-700">{paso.beneficio}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 ml-4">
                            {!paso.completado && puedeCompletar && (
                              <Button
                                onClick={() => completarPaso(paso.id)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                disabled={estado.pausado}
                              >
                                {paso.accion}
                                <ChevronRight className="h-4 w-4 ml-2" />
                              </Button>
                            )}
                            
                            {paso.completado && (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">Completado</span>
                              </div>
                            )}
                            
                            {!puedeCompletar && !paso.completado && (
                              <div className="flex items-center gap-2 text-gray-500">
                                <AlertCircle className="h-5 w-5" />
                                <span className="text-sm">Prerrequisitos pendientes</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Prerrequisitos */}
                        {paso.prerequisitos && paso.prerequisitos.length > 0 && (
                          <div className="border-t pt-3">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Requiere completar:</span>
                              <div className="mt-1 space-x-2">
                                {paso.prerequisitos.map(prereqId => {
                                  const prereq = pasosActuales.find(p => p.id === prereqId);
                                  if (!prereq) return null;
                                  
                                  return (
                                    <Badge 
                                      key={prereqId}
                                      variant={prereq.completado ? "default" : "secondary"}
                                      className="text-xs"
                                    >
                                      {prereq.completado && <CheckCircle className="h-3 w-3 mr-1" />}
                                      {prereq.titulo}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {/* Mensaje de finalización */}
        {estado.completado && (
          <Card className="mt-8 shadow-xl border-0 bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <CardContent className="p-8 text-center">
              <Award className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">¡Configuración Completada!</h2>
              <p className="text-lg mb-4">
                Has completado exitosamente todos los pasos de configuración para tu rol de {getRoleTitle(user.rol)}
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="secondary"
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-white/20 hover:bg-white/30 border-white/30"
                >
                  Ir al Dashboard
                </Button>
                <Button 
                  variant="secondary"
                  onClick={reiniciarOnboarding}
                  className="bg-white/20 hover:bg-white/30 border-white/30"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reiniciar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tooltip de feedback */}
      {tooltip.visible && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
            <CheckCircle2 className="h-5 w-5" />
            {tooltip.mensaje}
          </div>
        </div>
      )}
    </div>
  );
}
