'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Workflow,
  Play,
  Pause,
  Settings,
  Edit,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
  DollarSign,
  Users,
  Building2,
  Briefcase,
  Crown,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FlujoTrabajo {
  id: string;
  nombre: string;
  descripcion: string;
  rol: 'superadmin' | 'admin_empresa' | 'contador' | 'cliente_basico';
  categoria: 'tributario' | 'financiero' | 'operacional' | 'sistema';
  icono: React.ReactNode;
  pasos: PasoFlujo[];
  frecuencia: 'diaria' | 'semanal' | 'mensual' | 'bajo_demanda';
  activo: boolean;
  prioridad: 'alta' | 'media' | 'baja';
  tiempoEstimado: string;
  beneficios: string[];
}

interface PasoFlujo {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'accion' | 'revision' | 'aprobacion' | 'notificacion';
  href?: string;
  completado: boolean;
  opcional: boolean;
  tiempoEstimado: string;
}

const FLUJOS_SUPERADMIN: FlujoTrabajo[] = [
  {
    id: 'monitoreo-plataforma',
    nombre: 'Monitoreo de Plataforma',
    descripcion: 'Supervisión diaria de todas las operaciones del sistema',
    rol: 'superadmin',
    categoria: 'sistema',
    icono: <Crown className="h-5 w-5" />,
    frecuencia: 'diaria',
    activo: true,
    prioridad: 'alta',
    tiempoEstimado: '30-45 min',
    beneficios: ['Control total', 'Detección temprana de problemas', 'Optimización del rendimiento'],
    pasos: [
      {
        id: 'revisar-metricas',
        titulo: 'Revisar Métricas del Sistema',
        descripcion: 'Verificar rendimiento, uptime y uso de recursos',
        tipo: 'accion',
        href: '/performance-monitor',
        completado: false,
        opcional: false,
        tiempoEstimado: '10 min'
      },
      {
        id: 'verificar-empresas',
        titulo: 'Verificar Estado de Empresas',
        descripcion: 'Revisar nuevas empresas, vencimientos y alertas',
        tipo: 'revision',
        href: '/multi-empresa',
        completado: false,
        opcional: false,
        tiempoEstimado: '15 min'
      },
      {
        id: 'revisar-tickets',
        titulo: 'Revisar Tickets de Soporte',
        descripcion: 'Atender consultas críticas y escalamientos',
        tipo: 'accion',
        href: '/soporte',
        completado: false,
        opcional: true,
        tiempoEstimado: '20 min'
      }
    ]
  },
  {
    id: 'gestion-usuarios',
    nombre: 'Gestión de Usuarios y Accesos',
    descripcion: 'Administración semanal de usuarios, roles y permisos',
    rol: 'superadmin',
    categoria: 'sistema',
    icono: <Users className="h-5 w-5" />,
    frecuencia: 'semanal',
    activo: true,
    prioridad: 'media',
    tiempoEstimado: '1-2 horas',
    beneficios: ['Seguridad optimizada', 'Control de accesos', 'Auditoría completa'],
    pasos: [
      {
        id: 'revisar-nuevos-usuarios',
        titulo: 'Revisar Nuevos Usuarios',
        descripcion: 'Aprobar o rechazar solicitudes de acceso',
        tipo: 'aprobacion',
        href: '/control-acceso',
        completado: false,
        opcional: false,
        tiempoEstimado: '30 min'
      },
      {
        id: 'auditoria-permisos',
        titulo: 'Auditoría de Permisos',
        descripcion: 'Verificar que los permisos estén correctamente asignados',
        tipo: 'revision',
        href: '/control-acceso',
        completado: false,
        opcional: false,
        tiempoEstimado: '45 min'
      }
    ]
  }
];

const FLUJOS_ADMIN_EMPRESA: FlujoTrabajo[] = [
  {
    id: 'cierre-mensual',
    nombre: 'Cierre Mensual',
    descripcion: 'Proceso completo de cierre contable mensual',
    rol: 'admin_empresa',
    categoria: 'tributario',
    icono: <Calendar className="h-5 w-5" />,
    frecuencia: 'mensual',
    activo: true,
    prioridad: 'alta',
    tiempoEstimado: '2-3 horas',
    beneficios: ['Cumplimiento tributario', 'Información financiera actualizada', 'Toma de decisiones informada'],
    pasos: [
      {
        id: 'conciliar-bancos',
        titulo: 'Conciliación Bancaria',
        descripcion: 'Verificar movimientos bancarios vs registros contables',
        tipo: 'accion',
        href: '/conciliacion-bancaria',
        completado: false,
        opcional: false,
        tiempoEstimado: '45 min'
      },
      {
        id: 'revisar-facturas',
        titulo: 'Revisar Facturas Pendientes',
        descripcion: 'Verificar facturas por cobrar y por pagar',
        tipo: 'revision',
        href: '/facturas',
        completado: false,
        opcional: false,
        tiempoEstimado: '30 min'
      },
      {
        id: 'generar-f29',
        titulo: 'Generar F29',
        descripcion: 'Crear y enviar declaración mensual al SII',
        tipo: 'accion',
        href: '/sii-real',
        completado: false,
        opcional: false,
        tiempoEstimado: '60 min'
      }
    ]
  },
  {
    id: 'gestion-flujo-caja',
    nombre: 'Gestión de Flujo de Caja',
    descripcion: 'Monitoreo semanal del flujo de efectivo',
    rol: 'admin_empresa',
    categoria: 'financiero',
    icono: <DollarSign className="h-5 w-5" />,
    frecuencia: 'semanal',
    activo: true,
    prioridad: 'alta',
    tiempoEstimado: '45-60 min',
    beneficios: ['Control de liquidez', 'Planificación financiera', 'Prevención de problemas de caja'],
    pasos: [
      {
        id: 'revisar-proyecciones',
        titulo: 'Revisar Proyecciones',
        descripcion: 'Analizar proyecciones de ingresos y gastos',
        tipo: 'revision',
        href: '/reportes',
        completado: false,
        opcional: false,
        tiempoEstimado: '20 min'
      },
      {
        id: 'actualizar-presupuesto',
        titulo: 'Actualizar Presupuesto',
        descripcion: 'Ajustar presupuesto según realidad actual',
        tipo: 'accion',
        href: '/presupuesto',
        completado: false,
        opcional: true,
        tiempoEstimado: '25 min'
      }
    ]
  }
];

const FLUJOS_CONTADOR: FlujoTrabajo[] = [
  {
    id: 'revision-clientes',
    nombre: 'Revisión de Clientes',
    descripcion: 'Revisión diaria del estado de todas las empresas asignadas',
    rol: 'contador',
    categoria: 'operacional',
    icono: <Briefcase className="h-5 w-5" />,
    frecuencia: 'diaria',
    activo: true,
    prioridad: 'alta',
    tiempoEstimado: '1-2 horas',
    beneficios: ['Atención proactiva', 'Detección temprana de problemas', 'Mejor servicio al cliente'],
    pasos: [
      {
        id: 'revisar-vencimientos',
        titulo: 'Revisar Vencimientos',
        descripcion: 'Verificar fechas importantes y obligaciones pendientes',
        tipo: 'revision',
        href: '/calendario-tributario',
        completado: false,
        opcional: false,
        tiempoEstimado: '30 min'
      },
      {
        id: 'contactar-clientes',
        titulo: 'Contactar Clientes',
        descripcion: 'Comunicarse con clientes que tienen tareas pendientes',
        tipo: 'accion',
        href: '/comunicaciones',
        completado: false,
        opcional: false,
        tiempoEstimado: '45 min'
      }
    ]
  }
];

const FLUJOS_CLIENTE: FlujoTrabajo[] = [
  {
    id: 'revision-reportes',
    nombre: 'Revisión de Reportes',
    descripcion: 'Revisión semanal del estado financiero de la empresa',
    rol: 'cliente_basico',
    categoria: 'financiero',
    icono: <BarChart3 className="h-5 w-5" />,
    frecuencia: 'semanal',
    activo: true,
    prioridad: 'media',
    tiempoEstimado: '30-45 min',
    beneficios: ['Conocimiento del negocio', 'Mejor toma de decisiones', 'Control financiero'],
    pasos: [
      {
        id: 'revisar-ventas',
        titulo: 'Revisar Ventas',
        descripcion: 'Analizar el rendimiento de ventas del período',
        tipo: 'revision',
        href: '/reportes',
        completado: false,
        opcional: false,
        tiempoEstimado: '15 min'
      },
      {
        id: 'revisar-gastos',
        titulo: 'Revisar Gastos',
        descripcion: 'Verificar gastos y controlar presupuesto',
        tipo: 'revision',
        href: '/gastos',
        completado: false,
        opcional: false,
        tiempoEstimado: '15 min'
      }
    ]
  }
];

export default function FlujosEspecificosPorRol() {
  const { usuario } = useAuth();
  const [flujos, setFlujos] = useState<FlujoTrabajo[]>([]);
  const [flujoSeleccionado, setFlujoSeleccionado] = useState<FlujoTrabajo | null>(null);
  const [vistaActual, setVistaActual] = useState<'lista' | 'detalle' | 'ejecucion'>('lista');

  useEffect(() => {
    if (!usuario) return;

    let flujosPorRol: FlujoTrabajo[] = [];
    
    switch (usuario.rol) {
      case 'superadmin':
        flujosPorRol = FLUJOS_SUPERADMIN;
        break;
      case 'admin_empresa':
        flujosPorRol = FLUJOS_ADMIN_EMPRESA;
        break;
      case 'contador':
        flujosPorRol = FLUJOS_CONTADOR;
        break;
      case 'cliente_basico':
        flujosPorRol = FLUJOS_CLIENTE;
        break;
    }

    setFlujos(flujosPorRol);
  }, [usuario?.rol]);

  if (!usuario) return null;

  const ejecutarPaso = (flujoId: string, pasoId: string) => {
    setFlujos(prev => 
      prev.map(flujo => {
        if (flujo.id === flujoId) {
          return {
            ...flujo,
            pasos: flujo.pasos.map(paso => 
              paso.id === pasoId 
                ? { ...paso, completado: true }
                : paso
            )
          };
        }
        return flujo;
      })
    );
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'tributario': return 'bg-red-100 text-red-800 border-red-200';
      case 'financiero': return 'bg-green-100 text-green-800 border-green-200';
      case 'operacional': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sistema': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Workflow className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Flujos de Trabajo Personalizados</h1>
        </div>
        <p className="text-gray-600">
          Flujos optimizados para tu rol: <strong>{getRolTitle()}</strong>
        </p>
      </div>

      {/* Vista Lista de Flujos */}
      {vistaActual === 'lista' && (
        <div className="space-y-6">
          {flujos.map(flujo => {
            const pasosCompletados = flujo.pasos.filter(p => p.completado).length;
            const progreso = (pasosCompletados / flujo.pasos.length) * 100;

            return (
              <Card key={flujo.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${getCategoriaColor(flujo.categoria)}`}>
                        {flujo.icono}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{flujo.nombre}</h3>
                          <Badge className={getPrioridadColor(flujo.prioridad)}>
                            {flujo.prioridad}
                          </Badge>
                          <Badge variant="outline" className={getCategoriaColor(flujo.categoria)}>
                            {flujo.categoria}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{flujo.descripcion}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>⏱️ {flujo.tiempoEstimado}</span>
                          <span>📅 {flujo.frecuencia}</span>
                          <span>📋 {flujo.pasos.length} pasos</span>
                        </div>

                        {/* Progreso */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progreso</span>
                            <span>{pasosCompletados}/{flujo.pasos.length} completados</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progreso}%` }}
                            />
                          </div>
                        </div>

                        {/* Beneficios */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Beneficios:</p>
                          <div className="flex flex-wrap gap-1">
                            {flujo.beneficios.map((beneficio, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {beneficio}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => {
                          setFlujoSeleccionado(flujo);
                          setVistaActual('detalle');
                        }}
                        className="flex items-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>{progreso === 100 ? 'Revisar' : 'Ejecutar'}</span>
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Configurar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Vista Detalle del Flujo */}
      {vistaActual === 'detalle' && flujoSeleccionado && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setVistaActual('lista')}
            >
              ← Volver a Flujos
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Personalizar Flujo
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                {flujoSeleccionado.icono}
                <span>{flujoSeleccionado.nombre}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flujoSeleccionado.pasos.map((paso, index) => (
                  <div 
                    key={paso.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      paso.completado ? 'bg-green-50 border-green-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        paso.completado 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {paso.completado ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{paso.titulo}</h4>
                          {paso.opcional && (
                            <Badge variant="secondary" className="text-xs">
                              Opcional
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{paso.descripcion}</p>
                        <p className="text-xs text-gray-500">⏱️ {paso.tiempoEstimado}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {paso.href && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(paso.href, '_blank')}
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Ir
                        </Button>
                      )}
                      
                      {!paso.completado && (
                        <Button
                          size="sm"
                          onClick={() => ejecutarPaso(flujoSeleccionado.id, paso.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
