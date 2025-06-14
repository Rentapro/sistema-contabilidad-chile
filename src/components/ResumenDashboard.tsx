'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { 
  AlertTriangle, 
  Lightbulb, 
  Clock, 
  TrendingUp, 
  ExternalLink,
  Bell,
  DollarSign
} from "lucide-react";
import { obtenerConsejoDiario } from "@/data/consejos-diarios";
import { obtenerAlertasCriticas, calcularImpactoEconomicoTotal } from "@/data/alertas-sii";

export default function ResumenDashboard() {
  const consejoDiario = obtenerConsejoDiario();
  const alertasCriticas = obtenerAlertasCriticas();
  const impactoTotal = calcularImpactoEconomicoTotal();

  const obtenerColorPorImportancia = (importancia: string) => {
    switch (importancia) {
      case 'critica': return 'border-red-500 bg-red-50';
      case 'alta': return 'border-orange-500 bg-orange-50';
      case 'media': return 'border-yellow-500 bg-yellow-50';
      case 'baja': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      {/* Consejo Diario Compacto */}
      <Card className={`border-l-4 ${obtenerColorPorImportancia(consejoDiario.importancia)}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              💡 Consejo Tributario del Día
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {consejoDiario.categoria.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">
            {consejoDiario.icono} {consejoDiario.titulo}
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
            {consejoDiario.contenido}
          </p>
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              consejoDiario.importancia === 'critica' ? 'bg-red-100 text-red-800' :
              consejoDiario.importancia === 'alta' ? 'bg-orange-100 text-orange-800' :
              consejoDiario.importancia === 'media' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {consejoDiario.importancia.toUpperCase()}
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/" className="flex items-center gap-1">
                <span>Ver Más</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertas del SII Compacto */}
      <Card className={alertasCriticas.length > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              {alertasCriticas.length > 0 ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  🚨 Alertas del SII
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-green-600" />
                  ✅ Estado SII
                </>
              )}
            </CardTitle>
            {alertasCriticas.length > 0 && (
              <Badge variant="destructive">
                {alertasCriticas.length} crítica{alertasCriticas.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {alertasCriticas.length > 0 ? (
            <>
              <div className="space-y-2 mb-3">
                {alertasCriticas.slice(0, 2).map((alerta) => (
                  <div key={alerta.id} className="bg-white p-2 rounded border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xs">{
                        alerta.tipo === 'observacion' ? '👁️' :
                        alerta.tipo === 'requerimiento' ? '📋' :
                        alerta.tipo === 'vencimiento' ? '⏰' :
                        alerta.tipo === 'multa' ? '❌' : '⚠️'
                      }</div>
                      <span className="text-xs font-medium text-gray-900 truncate">
                        {alerta.titulo}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {alerta.descripcion}
                    </p>
                    {alerta.monto && (
                      <div className="flex items-center gap-1 mt-1">
                        <DollarSign className="h-3 w-3 text-red-600" />
                        <span className="text-xs font-medium text-red-700">
                          ${alerta.monto.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {alertasCriticas.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{alertasCriticas.length - 2} alertas más
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-red-700">
                  <span className="font-medium">Impacto: ${impactoTotal.toLocaleString()}</span>
                </div>
                <Button variant="destructive" size="sm" asChild>
                  <Link href="/alertas-sii" className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    <span>Ver Todas</span>
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-4">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-sm text-green-800 font-medium mb-1">
                  Sin Alertas Pendientes
                </p>
                <p className="text-xs text-green-600">
                  Tu situación tributaria está al día
                </p>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/sii" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Servicios SII</span>
                  </Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
