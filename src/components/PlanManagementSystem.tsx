'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Users, 
  Crown, 
  Star, 
  Zap,
  Check,
  X,
  Edit,
  Save,
  Plus,
  Trash2,
  Calendar,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  features: {
    maxUsers: number;
    maxInvoices: number;
    maxStorage: number; // GB
    maxApiCalls: number;
    aiEnabled: boolean;
    multiCompanyEnabled: boolean;
    advancedReports: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    ssoEnabled: boolean;
    auditLogs: boolean;
    backupFrequency: string;
  };
  popular: boolean;
  active: boolean;
}

export function PlanManagementSystem() {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'trial',
      name: 'trial',
      displayName: 'Prueba Gratuita',
      description: 'Para evaluar el sistema durante 30 días',
      price: 0,
      currency: 'CLP',
      billingPeriod: 'monthly',
      features: {
        maxUsers: 2,
        maxInvoices: 50,
        maxStorage: 1,
        maxApiCalls: 1000,
        aiEnabled: false,
        multiCompanyEnabled: false,
        advancedReports: false,
        prioritySupport: false,
        customBranding: false,
        apiAccess: false,
        ssoEnabled: false,
        auditLogs: false,
        backupFrequency: 'manual'
      },
      popular: false,
      active: true
    },
    {
      id: 'basic',
      name: 'basico',
      displayName: 'Plan Básico',
      description: 'Ideal para pequeñas empresas y emprendedores',
      price: 29000,
      currency: 'CLP',
      billingPeriod: 'monthly',
      features: {
        maxUsers: 5,
        maxInvoices: 500,
        maxStorage: 10,
        maxApiCalls: 10000,
        aiEnabled: false,
        multiCompanyEnabled: false,
        advancedReports: true,
        prioritySupport: false,
        customBranding: false,
        apiAccess: true,
        ssoEnabled: false,
        auditLogs: true,
        backupFrequency: 'weekly'
      },
      popular: true,
      active: true
    },
    {
      id: 'premium',
      name: 'premium',
      displayName: 'Plan Premium',
      description: 'Para empresas en crecimiento con necesidades avanzadas',
      price: 89000,
      currency: 'CLP',
      billingPeriod: 'monthly',
      features: {
        maxUsers: 25,
        maxInvoices: 5000,
        maxStorage: 100,
        maxApiCalls: 100000,
        aiEnabled: true,
        multiCompanyEnabled: true,
        advancedReports: true,
        prioritySupport: true,
        customBranding: true,
        apiAccess: true,
        ssoEnabled: true,
        auditLogs: true,
        backupFrequency: 'daily'
      },
      popular: false,
      active: true
    },
    {
      id: 'enterprise',
      name: 'enterprise',
      displayName: 'Plan Empresarial',
      description: 'Para grandes organizaciones con máximo control',
      price: 199000,
      currency: 'CLP',
      billingPeriod: 'monthly',
      features: {
        maxUsers: -1, // Ilimitado
        maxInvoices: -1, // Ilimitado
        maxStorage: 1000,
        maxApiCalls: -1, // Ilimitado
        aiEnabled: true,
        multiCompanyEnabled: true,
        advancedReports: true,
        prioritySupport: true,
        customBranding: true,
        apiAccess: true,
        ssoEnabled: true,
        auditLogs: true,
        backupFrequency: 'hourly'
      },
      popular: false,
      active: true
    }
  ]);

  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [planStats, setPlanStats] = useState({
    totalRevenue: 45280000,
    activeSubscriptions: 1247,
    conversionRate: 12.8,
    churnRate: 2.3
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num === -1) return 'Ilimitado';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'trial': return '🆓';
      case 'basic': return '📦';
      case 'premium': return '⭐';
      case 'enterprise': return '👑';
      default: return '📋';
    }
  };

  const handleEditPlan = (planId: string) => {
    setEditingPlan(planId);
  };

  const handleSavePlan = (planId: string) => {
    setEditingPlan(null);
    // Aquí iría la lógica para guardar en la base de datos
    console.log('Plan guardado:', planId);
  };

  const updatePlanField = (planId: string, field: string, value: any) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        const keys = field.split('.');
        const newPlan = { ...plan };
        let current: any = newPlan;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return newPlan;
      }
      return plan;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas del Sistema de Planes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(planStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planStats.activeSubscriptions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8.2% este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planStats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Abandono</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planStats.churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              -0.5% este mes
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Gestión de Planes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="promotions">Promociones</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Planes Disponibles</h3>
                <p className="text-sm text-muted-foreground">
                  Gestiona los planes de suscripción y sus características
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Plan
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Más Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getPlanIcon(plan.id)}</span>
                        <div>
                          <CardTitle className="text-lg">{plan.displayName}</CardTitle>
                          <CardDescription className="text-sm">{plan.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editingPlan === plan.id ? handleSavePlan(plan.id) : handleEditPlan(plan.id)}
                        >
                          {editingPlan === plan.id ? (
                            <Save className="h-4 w-4" />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Precio */}
                    <div className="text-center">
                      {editingPlan === plan.id ? (
                        <div className="space-y-2">
                          <Label htmlFor={`price-${plan.id}`}>Precio Mensual</Label>
                          <Input
                            id={`price-${plan.id}`}
                            type="number"
                            value={plan.price}
                            onChange={(e) => updatePlanField(plan.id, 'price', parseInt(e.target.value))}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold">
                            {plan.price === 0 ? 'Gratis' : formatCurrency(plan.price)}
                          </div>
                          <div className="text-sm text-muted-foreground">por mes</div>
                        </>
                      )}
                    </div>

                    {/* Características principales */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Usuarios máximos</span>
                        {editingPlan === plan.id ? (
                          <Input
                            type="number"
                            value={plan.features.maxUsers === -1 ? '' : plan.features.maxUsers}
                            onChange={(e) => updatePlanField(plan.id, 'features.maxUsers', e.target.value === '' ? -1 : parseInt(e.target.value))}
                            className="w-20 h-6"
                            placeholder="∞"
                          />
                        ) : (
                          <Badge variant="outline">
                            {formatNumber(plan.features.maxUsers)}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Facturas mensuales</span>
                        {editingPlan === plan.id ? (
                          <Input
                            type="number"
                            value={plan.features.maxInvoices === -1 ? '' : plan.features.maxInvoices}
                            onChange={(e) => updatePlanField(plan.id, 'features.maxInvoices', e.target.value === '' ? -1 : parseInt(e.target.value))}
                            className="w-20 h-6"
                            placeholder="∞"
                          />
                        ) : (
                          <Badge variant="outline">
                            {formatNumber(plan.features.maxInvoices)}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Almacenamiento</span>
                        {editingPlan === plan.id ? (
                          <Input
                            type="number"
                            value={plan.features.maxStorage}
                            onChange={(e) => updatePlanField(plan.id, 'features.maxStorage', parseInt(e.target.value))}
                            className="w-20 h-6"
                          />
                        ) : (
                          <Badge variant="outline">
                            {plan.features.maxStorage} GB
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Llamadas API</span>
                        {editingPlan === plan.id ? (
                          <Input
                            type="number"
                            value={plan.features.maxApiCalls === -1 ? '' : plan.features.maxApiCalls}
                            onChange={(e) => updatePlanField(plan.id, 'features.maxApiCalls', e.target.value === '' ? -1 : parseInt(e.target.value))}
                            className="w-20 h-6"
                            placeholder="∞"
                          />
                        ) : (
                          <Badge variant="outline">
                            {formatNumber(plan.features.maxApiCalls)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Características premium */}
                    <div className="space-y-2 pt-4 border-t">
                      <h5 className="text-sm font-medium">Características Incluidas</h5>
                      <div className="space-y-1">
                        {[
                          { key: 'aiEnabled', label: 'Inteligencia Artificial' },
                          { key: 'multiCompanyEnabled', label: 'Multi-empresa' },
                          { key: 'advancedReports', label: 'Reportes Avanzados' },
                          { key: 'prioritySupport', label: 'Soporte Prioritario' },
                          { key: 'customBranding', label: 'Branding Personalizado' },
                          { key: 'ssoEnabled', label: 'SSO' },
                          { key: 'auditLogs', label: 'Logs de Auditoría' }
                        ].map((feature) => (
                          <div key={feature.key} className="flex items-center justify-between text-xs">
                            <span>{feature.label}</span>
                            {(plan.features as any)[feature.key] ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <X className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Respaldos */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span>Respaldos</span>
                        <Badge variant="outline" className="text-xs">
                          {plan.features.backupFrequency === 'manual' ? 'Manual' :
                           plan.features.backupFrequency === 'hourly' ? 'Cada hora' :
                           plan.features.backupFrequency === 'daily' ? 'Diario' :
                           plan.features.backupFrequency === 'weekly' ? 'Semanal' : 'Mensual'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics de Planes</CardTitle>
              <CardDescription>
                Análisis detallado del rendimiento de cada plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Avanzado</h3>
                <p className="text-muted-foreground mb-4">
                  Métricas detalladas, gráficos de conversión y análisis de retención
                </p>
                <Button>Próximamente</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Promociones</CardTitle>
              <CardDescription>
                Crear y gestionar descuentos y ofertas especiales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Promociones y Descuentos</h3>
                <p className="text-muted-foreground mb-4">
                  Códigos promocionales, descuentos por volumen y ofertas limitadas
                </p>
                <Button>Próximamente</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
