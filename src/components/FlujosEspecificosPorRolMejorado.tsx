'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Crown,
  Building2,
  Briefcase,
  User,
  FileText,
  Calculator,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Target,
  Zap,
  Star,
  AlertCircle,
  Info,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Filter,
  Search,
  Plus,
  Edit,
  Eye,
  Settings,
  History,
  Award,
  BookOpen,
  Lightbulb,
  MapPin,
  Route
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';

interface PasoFlujo {
  id: string;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
  tipo: 'accion' | 'decision' | 'validacion' | 'automatico';
  estado: 'pendiente' | 'en_progreso' | 'completado' | 'omitido' | 'fallido';
  obligatorio: boolean;
  tiempoEstimado: number; // en minutos
  instrucciones: string;
  recursos: string[];
  validaciones: string[];
  siguientesPasos: string[];
  alternativas?: string[];
  automatizable: boolean;
  fechaCompletado?: Date;
  notas?: string;
}

interface FlujoTrabajo {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'fiscal' | 'operativo' | 'estrategico' | 'mantenimiento';
  icono: React.ReactNode;
  roles: ('superadmin' | 'admin_empresa' | 'contador' | 'cliente_basico')[];
  prioridad: 'alta' | 'media' | 'baja';
  frecuencia: 'diaria' | 'semanal' | 'mensual' | 'anual' | 'evento';
  duracionEstimada: number; // en minutos
  pasos: PasoFlujo[];
  activo: boolean;
  fechaCreacion: Date;
  estadisticas: {
    vecesEjecutado: number;
    tiempoPromedio: number;
    tasaCompletado: number;
    ultimaEjecucion?: Date;
  };
  configuracion: {
    notificaciones: boolean;
    recordatorios: boolean;
    validacionAutomatica: boolean;
    delegable: boolean;
  };
}

interface EjecucionFlujo {
  id: string;
  flujoId: string;
  usuarioId: string;
  estado: 'iniciado' | 'en_progreso' | 'pausado' | 'completado' | 'abandonado';
  pasoActual: number;
  fechaInicio: Date;
  fechaUltimaActividad: Date;
  fechaCompletado?: Date;
  progreso: number;
  notas: string[];
  tiempo: number; // tiempo acumulado en minutos
  pausas: { inicio: Date; fin?: Date; razon: string }[];
}

const FLUJOS_SUPERADMIN: FlujoTrabajo[] = [
  {
    id: 'configuracion-plataforma',
    nombre: 'Configuración Inicial de Plataforma',
    descripcion: 'Configurar todos los aspectos críticos de la plataforma multi-tenant',
    categoria: 'mantenimiento',
    icono: <Crown className="h-6 w-6" />,
    roles: ['superadmin'],
    prioridad: 'alta',
    frecuencia: 'evento',
    duracionEstimada: 120,
    activo: true,
    fechaCreacion: new Date(),
    estadisticas: {
      vecesEjecutado: 5,
      tiempoPromedio: 95,
      tasaCompletado: 100,
      ultimaEjecucion: new Date('2024-01-10')
    },
    configuracion: {
      notificaciones: true,
      recordatorios: true,
      validacionAutomatica: true,
      delegable: false
    },
    pasos: [
      {
        id: 'configurar-base-datos',
        titulo: 'Configurar Base de Datos',
        descripcion: 'Configurar conexiones y esquemas de base de datos',
        icono: <Settings className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'completado',
        obligatorio: true,
        tiempoEstimado: 30,
        instrucciones: 'Configurar strings de conexión, pools y esquemas de BD',
        recursos: ['Manual de configuración BD', 'Scripts de inicialización'],
        validaciones: ['Conexión exitosa', 'Esquemas creados', 'Permisos configurados'],
        siguientesPasos: ['configurar-autenticacion'],
        automatizable: true,
        fechaCompletado: new Date()
      },
      {
        id: 'configurar-autenticacion',
        titulo: 'Configurar Sistema de Autenticación',
        descripcion: 'Configurar JWT, OAuth y políticas de seguridad',
        icono: <User className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'completado',
        obligatorio: true,
        tiempoEstimado: 25,
        instrucciones: 'Configurar JWT secrets, proveedores OAuth, políticas de contraseñas',
        recursos: ['Documentación OAuth', 'Políticas de seguridad'],
        validaciones: ['JWT funcionando', 'OAuth configurado', 'Políticas aplicadas'],
        siguientesPasos: ['configurar-multi-tenant'],
        automatizable: false
      },      {
        id: 'configurar-multi-tenant',
        titulo: 'Configurar Multi-Tenancy',
        descripcion: 'Configurar aislamiento de datos por empresa',
        icono: <Building2 className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'en_progreso',
        obligatorio: true,
        tiempoEstimado: 45,
        instrucciones: 'Configurar Row Level Security, políticas de acceso por tenant',
        recursos: ['Documentación RLS', 'Políticas de ejemplo'],
        validaciones: ['RLS activo', 'Políticas funcionando', 'Aislamiento verificado'],
        siguientesPasos: ['pruebas-sistema'],
        automatizable: true
      },
      {
        id: 'pruebas-sistema',
        titulo: 'Ejecutar Pruebas del Sistema',
        descripcion: 'Ejecutar suite completa de pruebas',
        icono: <CheckCircle2 className="h-5 w-5" />,
        tipo: 'validacion',
        estado: 'pendiente',
        obligatorio: true,
        tiempoEstimado: 20,
        instrucciones: 'Ejecutar pruebas automatizadas y manuales',
        recursos: ['Suite de pruebas', 'Checklist de validación'],
        validaciones: ['Todas las pruebas pasan', 'Performance aceptable'],
        siguientesPasos: [],
        automatizable: true
      }
    ]
  }
];

const FLUJOS_ADMIN_EMPRESA: FlujoTrabajo[] = [
  {
    id: 'onboarding-empresa',
    nombre: 'Onboarding de Nueva Empresa',
    descripcion: 'Proceso completo de incorporación de una nueva empresa al sistema',
    categoria: 'operativo',
    icono: <Building2 className="h-6 w-6" />,
    roles: ['admin_empresa'],
    prioridad: 'alta',
    frecuencia: 'evento',
    duracionEstimada: 90,
    activo: true,
    fechaCreacion: new Date(),
    estadisticas: {
      vecesEjecutado: 12,
      tiempoPromedio: 85,
      tasaCompletado: 92,
      ultimaEjecucion: new Date('2024-01-12')
    },
    configuracion: {
      notificaciones: true,
      recordatorios: true,
      validacionAutomatica: false,
      delegable: true
    },
    pasos: [
      {
        id: 'recopilar-datos-empresa',
        titulo: 'Recopilar Datos de la Empresa',
        descripcion: 'Obtener RUT, razón social, giros y datos tributarios',
        icono: <FileText className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'completado',
        obligatorio: true,
        tiempoEstimado: 15,
        instrucciones: 'Solicitar RUT, certificados, poderes y documentos legales',
        recursos: ['Checklist de documentos', 'Formulario de registro'],
        validaciones: ['RUT válido', 'Documentos completos', 'Poderes vigentes'],
        siguientesPasos: ['configurar-certificados'],
        automatizable: false
      },
      {
        id: 'configurar-certificados',
        titulo: 'Configurar Certificados Digitales',
        descripcion: 'Instalar y configurar certificados para el SII',
        icono: <Award className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'en_progreso',
        obligatorio: true,
        tiempoEstimado: 30,
        instrucciones: 'Instalar certificados digitales y configurar conexión al SII',
        recursos: ['Manual SII', 'Certificados digitales'],
        validaciones: ['Certificados instalados', 'Conexión SII exitosa'],
        siguientesPasos: ['configurar-usuarios'],
        automatizable: false
      },
      {
        id: 'configurar-usuarios',
        titulo: 'Configurar Usuarios y Permisos',
        descripcion: 'Crear usuarios y asignar roles específicos',
        icono: <Users className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'pendiente',
        obligatorio: true,
        tiempoEstimado: 20,
        instrucciones: 'Crear cuentas de usuario y asignar permisos apropiados',
        recursos: ['Matriz de permisos', 'Roles por defecto'],
        validaciones: ['Usuarios creados', 'Permisos asignados', 'Acceso verificado'],
        siguientesPasos: ['primera-factura'],
        automatizable: true
      },
      {
        id: 'primera-factura',
        titulo: 'Crear Primera Factura de Prueba',
        descripcion: 'Generar y enviar primera factura electrónica',
        icono: <Calculator className="h-5 w-5" />,
        tipo: 'validacion',
        estado: 'pendiente',
        obligatorio: true,
        tiempoEstimado: 25,
        instrucciones: 'Crear factura de prueba y verificar envío al SII',
        recursos: ['Cliente de prueba', 'Productos ejemplo'],
        validaciones: ['Factura creada', 'Enviada al SII', 'Respuesta exitosa'],
        siguientesPasos: [],
        automatizable: false
      }
    ]
  }
];

const FLUJOS_CONTADOR: FlujoTrabajo[] = [
  {
    id: 'cierre-mensual',
    nombre: 'Cierre Contable Mensual',
    descripcion: 'Proceso completo de cierre contable mensual para todas las empresas asignadas',
    categoria: 'fiscal',
    icono: <Calendar className="h-6 w-6" />,
    roles: ['contador'],
    prioridad: 'alta',
    frecuencia: 'mensual',
    duracionEstimada: 180,
    activo: true,
    fechaCreacion: new Date(),
    estadisticas: {
      vecesEjecutado: 24,
      tiempoPromedio: 165,
      tasaCompletado: 96,
      ultimaEjecucion: new Date('2024-01-01')
    },
    configuracion: {
      notificaciones: true,
      recordatorios: true,
      validacionAutomatica: true,
      delegable: false
    },
    pasos: [
      {
        id: 'revisar-transacciones',
        titulo: 'Revisar Transacciones del Mes',
        descripcion: 'Verificar completitud y exactitud de todas las transacciones',
        icono: <Eye className="h-5 w-5" />,
        tipo: 'validacion',
        estado: 'completado',
        obligatorio: true,
        tiempoEstimado: 45,
        instrucciones: 'Revisar facturas, gastos y conciliaciones bancarias',
        recursos: ['Reporte de transacciones', 'Estados de cuenta'],
        validaciones: ['Transacciones completas', 'Montos cuadrados', 'Documentos respaldados'],
        siguientesPasos: ['generar-reportes'],
        automatizable: true
      },
      {
        id: 'generar-reportes',
        titulo: 'Generar Reportes Financieros',
        descripcion: 'Crear balance general, estado de resultados y flujo de caja',
        icono: <FileText className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'en_progreso',
        obligatorio: true,
        tiempoEstimado: 30,
        instrucciones: 'Generar reportes estándar y verificar coherencia',
        recursos: ['Plantillas de reportes', 'Datos contables'],
        validaciones: ['Reportes generados', 'Balances cuadrados', 'Ratios razonables'],
        siguientesPasos: ['revision-tributaria'],
        automatizable: true
      },
      {
        id: 'revision-tributaria',
        titulo: 'Revisión de Obligaciones Tributarias',
        descripcion: 'Verificar cumplimiento de obligaciones tributarias mensuales',
        icono: <AlertCircle className="h-5 w-5" />,
        tipo: 'validacion',
        estado: 'pendiente',
        obligatorio: true,
        tiempoEstimado: 40,
        instrucciones: 'Revisar F29, retenciones, PPM y otros formularios',
        recursos: ['Formularios SII', 'Calendario tributario'],
        validaciones: ['F29 cuadrado', 'Retenciones correctas', 'PPM calculado'],
        siguientesPasos: ['comunicar-resultados'],
        automatizable: false
      },
      {
        id: 'comunicar-resultados',
        titulo: 'Comunicar Resultados a Clientes',
        descripcion: 'Enviar reportes y resumen ejecutivo a los clientes',
        icono: <Users className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'pendiente',
        obligatorio: true,
        tiempoEstimado: 65,
        instrucciones: 'Preparar y enviar reportes con comentarios ejecutivos',
        recursos: ['Plantilla de comunicación', 'Reportes generados'],
        validaciones: ['Reportes enviados', 'Confirmación recibida'],
        siguientesPasos: [],
        automatizable: true
      }
    ]
  }
];

const FLUJOS_CLIENTE: FlujoTrabajo[] = [
  {
    id: 'facturacion-mensual',
    nombre: 'Proceso de Facturación Mensual',
    descripcion: 'Flujo completo para facturar a todos los clientes del mes',
    categoria: 'operativo',
    icono: <Calculator className="h-6 w-6" />,
    roles: ['cliente_basico'],
    prioridad: 'alta',
    frecuencia: 'mensual',
    duracionEstimada: 120,
    activo: true,
    fechaCreacion: new Date(),
    estadisticas: {
      vecesEjecutado: 8,
      tiempoPromedio: 110,
      tasaCompletado: 88,
      ultimaEjecucion: new Date('2024-01-05')
    },
    configuracion: {
      notificaciones: true,
      recordatorios: true,
      validacionAutomatica: false,
      delegable: false
    },
    pasos: [
      {
        id: 'preparar-datos',
        titulo: 'Preparar Datos de Facturación',
        descripcion: 'Recopilar información de ventas y servicios del mes',
        icono: <FileText className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'completado',
        obligatorio: true,
        tiempoEstimado: 30,
        instrucciones: 'Recopilar órdenes de compra, servicios prestados y productos vendidos',
        recursos: ['Registro de ventas', 'Órdenes de compra'],
        validaciones: ['Datos completos', 'Precios actualizados', 'Clientes válidos'],
        siguientesPasos: ['crear-facturas'],
        automatizable: true
      },
      {
        id: 'crear-facturas',
        titulo: 'Crear Facturas Electrónicas',
        descripcion: 'Generar facturas electrónicas en el sistema',
        icono: <Plus className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'en_progreso',
        obligatorio: true,
        tiempoEstimado: 45,
        instrucciones: 'Crear facturas usando datos recopilados y enviar al SII',
        recursos: ['Datos de facturación', 'Plantillas de facturas'],
        validaciones: ['Facturas creadas', 'Enviadas al SII', 'Folios asignados'],
        siguientesPasos: ['seguimiento-pagos'],
        automatizable: true
      },
      {
        id: 'seguimiento-pagos',
        titulo: 'Seguimiento de Pagos',
        descripcion: 'Monitorear el estado de pago de las facturas enviadas',
        icono: <DollarSign className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'pendiente',
        obligatorio: false,
        tiempoEstimado: 30,
        instrucciones: 'Hacer seguimiento a clientes y registrar pagos recibidos',
        recursos: ['Lista de facturas pendientes', 'Contactos de clientes'],
        validaciones: ['Pagos registrados', 'Cuentas por cobrar actualizadas'],
        siguientesPasos: ['generar-reporte'],
        automatizable: true
      },
      {
        id: 'generar-reporte',
        titulo: 'Generar Reporte de Facturación',
        descripcion: 'Crear reporte mensual de facturación y cobranza',
        icono: <FileText className="h-5 w-5" />,
        tipo: 'accion',
        estado: 'pendiente',
        obligatorio: false,
        tiempoEstimado: 15,
        instrucciones: 'Generar reporte con métricas de facturación del mes',
        recursos: ['Plantilla de reporte', 'Datos de facturación'],
        validaciones: ['Reporte generado', 'Métricas calculadas'],
        siguientesPasos: [],
        automatizable: true
      }
    ]
  }
];

export default function FlujosEspecificosPorRolMejorado() {
  const { usuario: user } = useAuth();
  const [flujos, setFlujos] = useState<FlujoTrabajo[]>([]);
  const [ejecuciones, setEjecuciones] = useState<EjecucionFlujo[]>([]);
  const [flujoSeleccionado, setFlujoSeleccionado] = useState<FlujoTrabajo | null>(null);
  const [ejecucionActiva, setEjecucionActiva] = useState<EjecucionFlujo | null>(null);
  const [vistaActual, setVistaActual] = useState<'flujos' | 'ejecucion' | 'historial'>('flujos');
  const [filtros, setFiltros] = useState({
    categoria: '',
    prioridad: '',
    frecuencia: '',
    busqueda: ''
  });
  const [pasoExpandido, setPasoExpandido] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Cargar flujos según el rol del usuario
    let flujosDisponibles: FlujoTrabajo[] = [];
    
    switch (user.rol) {
      case 'superadmin':
        flujosDisponibles = [...FLUJOS_SUPERADMIN, ...FLUJOS_ADMIN_EMPRESA, ...FLUJOS_CONTADOR];
        break;
      case 'admin_empresa':
        flujosDisponibles = [...FLUJOS_ADMIN_EMPRESA];
        break;
      case 'contador':
        flujosDisponibles = [...FLUJOS_CONTADOR, ...FLUJOS_ADMIN_EMPRESA];
        break;
      case 'cliente_basico':
        flujosDisponibles = [...FLUJOS_CLIENTE];
        break;
    }

    setFlujos(flujosDisponibles);

    // Cargar ejecuciones activas
    const ejecucionesGuardadas = localStorage.getItem(`flujos_ejecuciones_${user.id}`);
    if (ejecucionesGuardadas) {
      setEjecuciones(JSON.parse(ejecucionesGuardadas));
    }
  }, [user]);

  const iniciarFlujo = (flujo: FlujoTrabajo) => {
    if (!user) return;

    const nuevaEjecucion: EjecucionFlujo = {
      id: `${flujo.id}_${Date.now()}`,
      flujoId: flujo.id,
      usuarioId: user.id,
      estado: 'iniciado',
      pasoActual: 0,
      fechaInicio: new Date(),
      fechaUltimaActividad: new Date(),
      progreso: 0,
      notas: [],
      tiempo: 0,
      pausas: []
    };

    setEjecucionActiva(nuevaEjecucion);
    setEjecuciones(prev => {
      const nuevas = [...prev, nuevaEjecucion];
      localStorage.setItem(`flujos_ejecuciones_${user.id}`, JSON.stringify(nuevas));
      return nuevas;
    });
    setVistaActual('ejecucion');
  };

  const continuarEjecucion = (ejecucion: EjecucionFlujo) => {
    setEjecucionActiva(ejecucion);
    setVistaActual('ejecucion');
  };

  const completarPaso = (pasoId: string) => {
    if (!ejecucionActiva || !user) return;

    const flujo = flujos.find(f => f.id === ejecucionActiva.flujoId);
    if (!flujo) return;

    const pasoIndex = flujo.pasos.findIndex(p => p.id === pasoId);
    if (pasoIndex === -1) return;

    // Actualizar el paso como completado
    flujo.pasos[pasoIndex].estado = 'completado';
    flujo.pasos[pasoIndex].fechaCompletado = new Date();

    // Calcular nuevo progreso
    const pasosCompletados = flujo.pasos.filter(p => p.estado === 'completado').length;
    const nuevoProgreso = Math.round((pasosCompletados / flujo.pasos.length) * 100);

    // Actualizar ejecución
    const ejecucionActualizada: EjecucionFlujo = {
      ...ejecucionActiva,
      pasoActual: Math.min(pasoIndex + 1, flujo.pasos.length - 1),
      progreso: nuevoProgreso,
      fechaUltimaActividad: new Date(),
      estado: nuevoProgreso === 100 ? 'completado' : 'en_progreso'
    };

    setEjecucionActiva(ejecucionActualizada);
    
    // Actualizar en localStorage
    setEjecuciones(prev => {
      const nuevas = prev.map(e => e.id === ejecucionActualizada.id ? ejecucionActualizada : e);
      localStorage.setItem(`flujos_ejecuciones_${user.id}`, JSON.stringify(nuevas));
      return nuevas;
    });
  };

  const pausarEjecucion = (razon: string) => {
    if (!ejecucionActiva || !user) return;

    const ejecucionPausada: EjecucionFlujo = {
      ...ejecucionActiva,
      estado: 'pausado',
      fechaUltimaActividad: new Date(),
      pausas: [...ejecucionActiva.pausas, { inicio: new Date(), razon }]
    };

    setEjecucionActiva(ejecucionPausada);
    setEjecuciones(prev => {
      const nuevas = prev.map(e => e.id === ejecucionPausada.id ? ejecucionPausada : e);
      localStorage.setItem(`flujos_ejecuciones_${user.id}`, JSON.stringify(nuevas));
      return nuevas;
    });
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'fiscal': return 'bg-red-100 text-red-800 border-red-200';
      case 'operativo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'estrategico': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mantenimiento': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-yellow-500';
      case 'baja': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEstadoPasoColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'bg-green-100 text-green-800 border-green-200';
      case 'en_progreso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pendiente': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'omitido': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fallido': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const flujosFiltrados = flujos.filter(flujo => {
    const matchCategoria = !filtros.categoria || flujo.categoria === filtros.categoria;
    const matchPrioridad = !filtros.prioridad || flujo.prioridad === filtros.prioridad;
    const matchFrecuencia = !filtros.frecuencia || flujo.frecuencia === filtros.frecuencia;
    const matchBusqueda = !filtros.busqueda || 
      flujo.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      flujo.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    return matchCategoria && matchPrioridad && matchFrecuencia && matchBusqueda;
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Flujos de Trabajo Específicos</h1>
          <p className="text-gray-600 mt-1">
            Procesos optimizados para tu rol y responsabilidades
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setVistaActual('flujos')}
            variant={vistaActual === 'flujos' ? 'default' : 'outline'}
            size="sm"
          >
            <Route className="h-4 w-4 mr-2" />
            Flujos
          </Button>
          <Button 
            onClick={() => setVistaActual('historial')}
            variant={vistaActual === 'historial' ? 'default' : 'outline'}
            size="sm"
          >
            <History className="h-4 w-4 mr-2" />
            Historial
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <Route className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{flujos.length}</div>
              <div className="text-sm text-gray-600">Flujos Disponibles</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {ejecuciones.filter(e => e.estado === 'completado').length}
              </div>
              <div className="text-sm text-gray-600">Completados</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {ejecuciones.filter(e => e.estado === 'en_progreso' || e.estado === 'pausado').length}
              </div>
              <div className="text-sm text-gray-600">En Progreso</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-100">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {flujos.reduce((acc, f) => acc + (f.estadisticas.tasaCompletado || 0), 0) / flujos.length || 0}%
              </div>
              <div className="text-sm text-gray-600">Tasa Éxito</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Vista de Flujos */}
      {vistaActual === 'flujos' && (
        <div className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Buscar flujos..."
                    value={filtros.busqueda}
                    onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                
                <select 
                  value={filtros.categoria}
                  onChange={(e) => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Todas las categorías</option>
                  <option value="fiscal">Fiscal</option>
                  <option value="operativo">Operativo</option>
                  <option value="estrategico">Estratégico</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
                
                <select 
                  value={filtros.prioridad}
                  onChange={(e) => setFiltros(prev => ({ ...prev, prioridad: e.target.value }))}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Todas las prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de flujos */}
          <div className="grid gap-6">
            {flujosFiltrados.map(flujo => {
              const ejecucionExistente = ejecuciones.find(
                e => e.flujoId === flujo.id && (e.estado === 'en_progreso' || e.estado === 'pausado')
              );

              return (
                <Card key={flujo.id} className="shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-gray-100">
                          {flujo.icono}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{flujo.nombre}</h3>
                            <Badge className={getCategoriaColor(flujo.categoria)}>
                              {flujo.categoria}
                            </Badge>
                            <div className={`w-3 h-3 rounded-full ${getPrioridadColor(flujo.prioridad)}`} />
                          </div>
                          <p className="text-gray-600 mb-3">{flujo.descripcion}</p>
                          
                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <div className="text-lg font-semibold text-gray-900">
                                {flujo.duracionEstimada}min
                              </div>
                              <div className="text-xs text-gray-600">Duración</div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <div className="text-lg font-semibold text-gray-900">
                                {flujo.pasos.length}
                              </div>
                              <div className="text-xs text-gray-600">Pasos</div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <div className="text-lg font-semibold text-gray-900">
                                {flujo.estadisticas.vecesEjecutado}
                              </div>
                              <div className="text-xs text-gray-600">Ejecutados</div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <div className="text-lg font-semibold text-gray-900">
                                {flujo.estadisticas.tasaCompletado}%
                              </div>
                              <div className="text-xs text-gray-600">Éxito</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {ejecucionExistente ? (
                          <Button
                            onClick={() => continuarEjecucion(ejecucionExistente)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continuar
                          </Button>
                        ) : (
                          <Button
                            onClick={() => iniciarFlujo(flujo)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Iniciar
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFlujoSeleccionado(flujo)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                    
                    {/* Vista previa de pasos */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Pasos principales:</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {flujo.pasos.slice(0, 4).map((paso, index) => (
                          <div key={paso.id} className="flex items-center gap-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              paso.estado === 'completado' ? 'bg-green-100 text-green-800' :
                              paso.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="text-sm text-gray-600">{paso.titulo}</span>
                            {index < Math.min(flujo.pasos.length - 1, 3) && (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        ))}
                        {flujo.pasos.length > 4 && (
                          <span className="text-sm text-gray-500">+{flujo.pasos.length - 4} más</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Vista de Ejecución */}
      {vistaActual === 'ejecucion' && ejecucionActiva && (
        <div className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {flujos.find(f => f.id === ejecucionActiva.flujoId)?.nombre}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    Paso {ejecucionActiva.pasoActual + 1} de {flujos.find(f => f.id === ejecucionActiva.flujoId)?.pasos.length}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`px-3 py-1 ${
                    ejecucionActiva.estado === 'completado' ? 'bg-green-100 text-green-800' :
                    ejecucionActiva.estado === 'pausado' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {ejecucionActiva.estado.toUpperCase()}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pausarEjecucion('Pausado por usuario')}
                    disabled={ejecucionActiva.estado === 'completado'}
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVistaActual('flujos')}
                  >
                    ← Volver
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progreso</span>
                  <span>{ejecucionActiva.progreso}%</span>
                </div>
                <Progress value={ejecucionActiva.progreso} className="h-3" />
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Lista detallada de pasos */}
              <div className="space-y-4">
                {flujos.find(f => f.id === ejecucionActiva.flujoId)?.pasos.map((paso, index) => (
                  <div key={paso.id} className={`border rounded-lg p-4 ${
                    index === ejecucionActiva.pasoActual ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                          paso.estado === 'completado' ? 'bg-green-500 text-white' :
                          paso.estado === 'en_progreso' ? 'bg-blue-500 text-white' :
                          index === ejecucionActiva.pasoActual ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {paso.estado === 'completado' ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{paso.titulo}</h4>
                            <Badge className={getEstadoPasoColor(paso.estado)}>
                              {paso.estado}
                            </Badge>
                            {paso.obligatorio && (
                              <Badge variant="outline" className="text-xs">
                                Obligatorio
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{paso.descripcion}</p>
                          
                          {pasoExpandido === paso.id && (
                            <div className="space-y-3 mt-3 pt-3 border-t">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-1">Instrucciones:</h5>
                                <p className="text-sm text-gray-600">{paso.instrucciones}</p>
                              </div>
                              
                              {paso.recursos.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-1">Recursos necesarios:</h5>
                                  <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {paso.recursos.map((recurso, i) => (
                                      <li key={i}>{recurso}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {paso.validaciones.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-1">Validaciones:</h5>
                                  <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {paso.validaciones.map((validacion, i) => (
                                      <li key={i}>{validacion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{paso.tiempoEstimado}min</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPasoExpandido(pasoExpandido === paso.id ? null : paso.id)}
                        >
                          {pasoExpandido === paso.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        {index === ejecucionActiva.pasoActual && paso.estado !== 'completado' && (
                          <Button
                            size="sm"
                            onClick={() => completarPaso(paso.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Completar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vista de Historial */}
      {vistaActual === 'historial' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Historial de Ejecuciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ejecuciones.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Route className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No hay ejecuciones registradas aún</p>
                </div>
              ) : (
                ejecuciones.map(ejecucion => {
                  const flujo = flujos.find(f => f.id === ejecucion.flujoId);
                  if (!flujo) return null;

                  return (
                    <div key={ejecucion.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-gray-100">
                            {flujo.icono}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{flujo.nombre}</h4>
                              <Badge className={`${
                                ejecucion.estado === 'completado' ? 'bg-green-100 text-green-800' :
                                ejecucion.estado === 'pausado' ? 'bg-yellow-100 text-yellow-800' :
                                ejecucion.estado === 'abandonado' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {ejecucion.estado}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div>Iniciado: {ejecucion.fechaInicio.toLocaleString()}</div>
                              <div>Progreso: {ejecucion.progreso}%</div>
                              <div>Tiempo: {Math.round(ejecucion.tiempo / 60)}h {ejecucion.tiempo % 60}min</div>
                            </div>
                          </div>
                        </div>
                        
                        {(ejecucion.estado === 'en_progreso' || ejecucion.estado === 'pausado') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => continuarEjecucion(ejecucion)}
                          >
                            Continuar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalles del flujo */}
      {flujoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{flujoSeleccionado.nombre}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFlujoSeleccionado(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-gray-600">{flujoSeleccionado.descripcion}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Información General</h3>
                    <div className="space-y-2 text-sm">
                      <div>Categoría: <Badge className={getCategoriaColor(flujoSeleccionado.categoria)}>{flujoSeleccionado.categoria}</Badge></div>
                      <div>Prioridad: <Badge className={`${getPrioridadColor(flujoSeleccionado.prioridad)} text-white`}>{flujoSeleccionado.prioridad}</Badge></div>
                      <div>Frecuencia: {flujoSeleccionado.frecuencia}</div>
                      <div>Duración estimada: {flujoSeleccionado.duracionEstimada} minutos</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Estadísticas</h3>
                    <div className="space-y-2 text-sm">
                      <div>Veces ejecutado: {flujoSeleccionado.estadisticas.vecesEjecutado}</div>
                      <div>Tiempo promedio: {flujoSeleccionado.estadisticas.tiempoPromedio} min</div>
                      <div>Tasa de completado: {flujoSeleccionado.estadisticas.tasaCompletado}%</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Pasos del Flujo</h3>
                  <div className="space-y-3">
                    {flujoSeleccionado.pasos.map((paso, index) => (
                      <div key={paso.id} className="border rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{paso.titulo}</h4>
                            <p className="text-sm text-gray-600">{paso.descripcion}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">{paso.tipo}</Badge>
                              <span className="text-xs text-gray-500">{paso.tiempoEstimado} min</span>
                              {paso.obligatorio && <Badge variant="outline" className="text-xs">Obligatorio</Badge>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
