'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

export interface UsageLimits {
  facturas: {
    usado: number;
    limite: number;
    porcentaje: number;
  };
  clientes: {
    usado: number;
    limite: number;
    porcentaje: number;
  };
  usuarios: {
    usado: number;
    limite: number;
    porcentaje: number;
  };
  reportesAvanzados: boolean;
  automatizacionIA: boolean;
  integracionesBancarias: boolean;
  almacenamiento: {
    usado: number; // en MB
    limite: number; // en MB
    porcentaje: number;
  };
}

export interface FeatureRestriction {
  permitido: boolean;
  razon?: string;
  accionSugerida?: string;
  planRequerido?: string;
}

export function useUsageLimits() {
  const { usuario, empresaActual } = useAuth();
  const [limites, setLimites] = useState<UsageLimits | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (usuario && empresaActual) {
      cargarLimites();
    }
  }, [usuario, empresaActual]);

  const cargarLimites = async () => {
    setCargando(true);
    try {
      if (!usuario || !empresaActual) return;

      // Simular datos de uso real (en implementación real vendría de la API)
      const usoActual = {
        facturas: Math.floor(Math.random() * 50) + 10,
        clientes: Math.floor(Math.random() * 30) + 5,
        usuarios: Math.floor(Math.random() * 5) + 1,
        almacenamientoMB: Math.floor(Math.random() * 500) + 100
      };

      const configuracion = empresaActual.configuracion;

      const limitesCalculados: UsageLimits = {
        facturas: {
          usado: usoActual.facturas,
          limite: configuracion.limitesFacturas,
          porcentaje: (usoActual.facturas / configuracion.limitesFacturas) * 100
        },
        clientes: {
          usado: usoActual.clientes,
          limite: configuracion.limitesClientes,
          porcentaje: (usoActual.clientes / configuracion.limitesClientes) * 100
        },
        usuarios: {
          usado: usoActual.usuarios,
          limite: configuracion.limitesUsuarios,
          porcentaje: (usoActual.usuarios / configuracion.limitesUsuarios) * 100
        },
        reportesAvanzados: configuracion.reportesAvanzados,
        automatizacionIA: configuracion.automatizacionIA,
        integracionesBancarias: configuracion.integracionesBancarias,
        almacenamiento: {
          usado: usoActual.almacenamientoMB,
          limite: empresaActual.tipoLicencia === 'premium' ? 10000 : 1000, // 10GB vs 1GB
          porcentaje: (usoActual.almacenamientoMB / (empresaActual.tipoLicencia === 'premium' ? 10000 : 1000)) * 100
        }
      };

      setLimites(limitesCalculados);
    } catch (error) {
      console.error('Error al cargar límites:', error);
    } finally {
      setCargando(false);
    }
  };

  const verificarCaracteristica = (caracteristica: keyof Omit<UsageLimits, 'facturas' | 'clientes' | 'usuarios' | 'almacenamiento'>): FeatureRestriction => {
    if (!limites || !empresaActual) {
      return { permitido: false, razon: 'Datos no disponibles' };
    }

    const valor = limites[caracteristica];
    if (typeof valor === 'boolean') {
      if (!valor) {
        return {
          permitido: false,
          razon: 'Característica no incluida en tu plan actual',
          accionSugerida: 'Actualizar a plan Premium',
          planRequerido: 'premium'
        };
      }
      return { permitido: true };
    }

    return { permitido: false, razon: 'Tipo de característica no válido' };
  };

  const verificarLimiteRecurso = (recurso: 'facturas' | 'clientes' | 'usuarios'): FeatureRestriction => {
    if (!limites) {
      return { permitido: false, razon: 'Datos no disponibles' };
    }

    const limite = limites[recurso];
    if (limite.usado >= limite.limite) {
      return {
        permitido: false,
        razon: `Has alcanzado el límite de ${limite.limite} ${recurso}`,
        accionSugerida: 'Actualizar tu plan para obtener más capacidad',
        planRequerido: 'premium'
      };
    }

    if (limite.porcentaje > 90) {
      return {
        permitido: true,
        razon: `Advertencia: Has usado el ${limite.porcentaje.toFixed(1)}% de tu límite`
      };
    }

    return { permitido: true };
  };

  const puedeCrearFactura = (): FeatureRestriction => {
    return verificarLimiteRecurso('facturas');
  };

  const puedeCrearCliente = (): FeatureRestriction => {
    return verificarLimiteRecurso('clientes');
  };

  const puedeInvitarUsuario = (): FeatureRestriction => {
    return verificarLimiteRecurso('usuarios');
  };

  const puedeUsarIA = (): FeatureRestriction => {
    return verificarCaracteristica('automatizacionIA');
  };

  const puedeAccederReportesAvanzados = (): FeatureRestriction => {
    return verificarCaracteristica('reportesAvanzados');
  };

  const puedeUsarIntegracionesBancarias = (): FeatureRestriction => {
    return verificarCaracteristica('integracionesBancarias');
  };

  const obtenerColorPorcentaje = (porcentaje: number): string => {
    if (porcentaje < 50) return 'green';
    if (porcentaje < 80) return 'yellow';
    if (porcentaje < 95) return 'orange';
    return 'red';
  };

  const diasHastaVencimiento = (): number => {
    if (!empresaActual?.fechaVencimiento) return 0;
    const hoy = new Date();
    const vencimiento = new Date(empresaActual.fechaVencimiento);
    const diferencia = vencimiento.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  };

  const necesitaRenovacion = (): boolean => {
    return diasHastaVencimiento() <= 30;
  };

  return {
    limites,
    cargando,
    cargarLimites,
    verificarCaracteristica,
    verificarLimiteRecurso,
    puedeCrearFactura,
    puedeCrearCliente,
    puedeInvitarUsuario,
    puedeUsarIA,
    puedeAccederReportesAvanzados,
    puedeUsarIntegracionesBancarias,
    obtenerColorPorcentaje,
    diasHastaVencimiento,
    necesitaRenovacion
  };
}
