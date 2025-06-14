'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { obtenerConsejoDiario, obtenerConsejosPorCategoria, ConsejoDiario } from "@/data/consejos-diarios";
import { Lightbulb, Clock, TrendingUp, AlertCircle, Bookmark } from "lucide-react";

export default function ConsejosDiarios() {
  const [consejoDiario, setConsejoDiario] = useState<ConsejoDiario | null>(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todos');

  useEffect(() => {
    // Obtener el consejo del día
    const consejo = obtenerConsejoDiario();
    setConsejoDiario(consejo);
  }, []);

  const categorias = [
    { value: 'todos', label: 'Todos', icon: '📚' },
    { value: 'ahorro', label: 'Ahorro', icon: '💰' },
    { value: 'renta', label: 'Renta Anual', icon: '📊' },
    { value: 'iva', label: 'IVA', icon: '🧾' },
    { value: 'ppm', label: 'PPM', icon: '📈' },
    { value: 'creditos', label: 'Créditos', icon: '🔄' },
    { value: 'sii', label: 'SII', icon: '🏛️' },
    { value: 'general', label: 'General', icon: '⚡' }
  ];

  const obtenerColorPorImportancia = (importancia: ConsejoDiario['importancia']) => {
    switch (importancia) {
      case 'critica': return 'border-red-500 bg-red-50';
      case 'alta': return 'border-orange-500 bg-orange-50';
      case 'media': return 'border-yellow-500 bg-yellow-50';
      case 'baja': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const obtenerIconoPorImportancia = (importancia: ConsejoDiario['importancia']) => {
    switch (importancia) {
      case 'critica': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'alta': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'media': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'baja': return <Lightbulb className="h-4 w-4 text-blue-600" />;
      default: return <Lightbulb className="h-4 w-4 text-gray-600" />;
    }
  };

  const obtenerFechaHoy = () => {
    const hoy = new Date();
    return hoy.toLocaleDateString('es-CL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!consejoDiario) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Consejo del Día Principal */}
      <Card className={`border-l-4 ${obtenerColorPorImportancia(consejoDiario.importancia)} shadow-lg`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="text-2xl">{consejoDiario.icono}</div>
              <div>
                <div className="text-lg font-bold">💡 Consejo Tributario del Día</div>
                <div className="text-sm text-gray-600 font-normal">
                  {obtenerFechaHoy()}
                </div>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              {obtenerIconoPorImportancia(consejoDiario.importancia)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                consejoDiario.importancia === 'critica' ? 'bg-red-100 text-red-800' :
                consejoDiario.importancia === 'alta' ? 'bg-orange-100 text-orange-800' :
                consejoDiario.importancia === 'media' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {consejoDiario.importancia.toUpperCase()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {consejoDiario.titulo}
            </h3>
            
            <p className="text-gray-700 leading-relaxed">
              {consejoDiario.contenido}
            </p>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  consejoDiario.categoria === 'ahorro' ? 'bg-green-100 text-green-800' :
                  consejoDiario.categoria === 'renta' ? 'bg-purple-100 text-purple-800' :
                  consejoDiario.categoria === 'iva' ? 'bg-blue-100 text-blue-800' :
                  consejoDiario.categoria === 'ppm' ? 'bg-indigo-100 text-indigo-800' :
                  consejoDiario.categoria === 'creditos' ? 'bg-teal-100 text-teal-800' :
                  consejoDiario.categoria === 'sii' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {consejoDiario.categoria.toUpperCase()}
                </span>
                
                <span className="text-sm text-gray-500">
                  Aplica a: {consejoDiario.aplicaA.map(tipo => 
                    tipo === 'persona' ? '👤 Personas' : 
                    tipo === 'empresa' ? '🏢 Empresas' : 
                    '👥 Ambos'
                  ).join(', ')}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setMostrarHistorial(!mostrarHistorial)}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                {mostrarHistorial ? 'Ocultar' : 'Ver Más'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historial y Filtros */}
      {mostrarHistorial && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Biblioteca de Consejos Tributarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filtros por Categoría */}
              <div className="flex flex-wrap gap-2">
                {categorias.map((categoria) => (
                  <Button
                    key={categoria.value}
                    variant={categoriaSeleccionada === categoria.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoriaSeleccionada(categoria.value)}
                  >
                    <span className="mr-1">{categoria.icon}</span>
                    {categoria.label}
                  </Button>
                ))}
              </div>

              {/* Lista de Consejos */}
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {(categoriaSeleccionada === 'todos' 
                  ? obtenerConsejosPorCategoria('ahorro').slice(0, 10)
                  : obtenerConsejosPorCategoria(categoriaSeleccionada as ConsejoDiario['categoria'])
                ).map((consejo) => (
                  <div
                    key={consejo.id}
                    className={`p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer ${
                      consejo.id === consejoDiario?.id ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                    onClick={() => setConsejoDiario(consejo)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xl">{consejo.icono}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {consejo.titulo}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {consejo.contenido}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {obtenerIconoPorImportancia(consejo.importancia)}
                          <span className="text-xs text-gray-500">
                            {consejo.importancia} • {consejo.categoria}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recordatorio de Acción */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">
                💡 Recordatorio Inteligente
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Los consejos cambian automáticamente cada día. Vuelve mañana para descubrir nuevas estrategias de optimización tributaria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
