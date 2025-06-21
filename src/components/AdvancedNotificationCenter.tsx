'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell, BellRing, AlertTriangle, CheckCircle, Info, X, Settings,
  Clock, DollarSign, FileText, Users, Calendar, Zap, Eye, EyeOff,
  Volume2, VolumeX, Smartphone, Mail, MessageSquare, Filter
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category: 'sistema' | 'tributario' | 'facturacion' | 'clientes' | 'reportes' | 'seguridad';
  priority: 'low' | 'medium' | 'high' | 'critical';
  actions?: Array<{
    label: string;
    action: string;
    primary?: boolean;
  }>;
  metadata?: {
    amount?: number;
    client?: string;
    dueDate?: Date;
    documentId?: string;
  };
}

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  soundEnabled: boolean;  categories: {
    [key: string]: {
      enabled: boolean;
      priority: 'low' | 'medium' | 'high' | 'critical';
      channels: ('push' | 'email' | 'sms')[];
    };
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'instant' | 'hourly' | 'daily';
}

export default function AdvancedNotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    soundEnabled: true,
    categories: {
      tributario: { enabled: true, priority: 'high', channels: ['push', 'email'] },
      facturacion: { enabled: true, priority: 'medium', channels: ['push'] },
      sistema: { enabled: true, priority: 'low', channels: ['push'] },
      clientes: { enabled: false, priority: 'low', channels: ['push'] },
      reportes: { enabled: true, priority: 'medium', channels: ['email'] },
      seguridad: { enabled: true, priority: 'critical', channels: ['push', 'email', 'sms'] }
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'instant'
  });
  const [filter, setFilter] = useState<'all' | 'unread' | 'today' | 'urgent'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [soundPermission, setSoundPermission] = useState<boolean>(false);

  // Generar notificaciones simuladas
  useEffect(() => {
    const generateMockNotifications = () => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'urgent',
          title: '🚨 F29 Vence Mañana',
          message: 'La declaración F29 de Marzo debe ser presentada antes de las 23:59 de mañana.',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          read: false,
          category: 'tributario',
          priority: 'critical',
          actions: [
            { label: 'Generar F29', action: 'generate_f29', primary: true },
            { label: 'Ver Calendario', action: 'view_calendar' }
          ],
          metadata: { dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) }
        },
        {
          id: '2',
          type: 'success',
          title: '✅ Factura Pagada',
          message: 'TechSolutions SPA ha pagado la factura #0001234 por $2.450.000.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          read: false,
          category: 'facturacion',
          priority: 'medium',
          actions: [
            { label: 'Ver Factura', action: 'view_invoice' },
            { label: 'Enviar Recibo', action: 'send_receipt' }
          ],
          metadata: { 
            amount: 2450000, 
            client: 'TechSolutions SPA',
            documentId: 'FAC-0001234'
          }
        },
        {
          id: '3',
          type: 'warning',
          title: '⚠️ Certificado Digital Próximo a Vencer',
          message: 'Su certificado digital vence en 15 días. Renueve ahora para evitar interrupciones.',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          read: true,
          category: 'seguridad',
          priority: 'high',
          actions: [
            { label: 'Renovar Certificado', action: 'renew_certificate', primary: true },
            { label: 'Recordar Más Tarde', action: 'snooze' }
          ],
          metadata: { dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) }
        },
        {
          id: '4',
          type: 'info',
          title: '📊 Reporte Mensual Listo',
          message: 'El reporte financiero de Marzo está disponible para descarga.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          category: 'reportes',
          priority: 'low',
          actions: [
            { label: 'Descargar PDF', action: 'download_report' },
            { label: 'Ver Online', action: 'view_report' }
          ]
        },
        {
          id: '5',
          type: 'error',
          title: '❌ Error en Sincronización SII',
          message: 'No se pudo conectar con el SII. Verificando credenciales automáticamente.',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          read: false,
          category: 'sistema',
          priority: 'high',
          actions: [
            { label: 'Verificar Configuración', action: 'check_sii_config', primary: true },
            { label: 'Reintentar', action: 'retry_sync' }
          ]
        },
        {
          id: '6',
          type: 'info',
          title: '👥 Nuevo Cliente Registrado',
          message: 'ManufacturingCorp LTDA se ha registrado y requiere validación.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          read: true,
          category: 'clientes',
          priority: 'medium',
          actions: [
            { label: 'Validar Cliente', action: 'validate_client' },
            { label: 'Ver Perfil', action: 'view_client' }
          ],
          metadata: { client: 'ManufacturingCorp LTDA' }
        }
      ];

      setNotifications(mockNotifications);
    };

    generateMockNotifications();

    // Simular notificaciones en tiempo real
    const interval = setInterval(() => {
      if (Math.random() > 0.85) { // 15% probabilidad cada 30 segundos
        generateRandomNotification();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);
  const generateRandomNotification = () => {
    const types: Array<'success' | 'warning' | 'error' | 'info'> = ['success', 'warning', 'info'];
    const categories: Array<'sistema' | 'tributario' | 'facturacion' | 'clientes' | 'reportes' | 'seguridad'> = ['sistema', 'facturacion', 'clientes', 'reportes'];
    
    const messages = {
      success: ['Proceso completado exitosamente', 'Tarea finalizada', 'Operación realizada con éxito'],
      warning: ['Revisión requerida', 'Atención necesaria', 'Verificación pendiente'],
      info: ['Nueva actualización disponible', 'Recordatorio programado', 'Información importante'],
      error: ['Error detectado', 'Problema identificado', 'Acción requerida']
    };

    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: randomType,
      title: `${getTypeIcon(randomType)} ${messages[randomType][Math.floor(Math.random() * messages[randomType].length)]}`,
      message: `Notificación generada automáticamente para la categoría ${randomCategory}.`,
      timestamp: new Date(),
      read: false,
      category: randomCategory,
      priority: 'medium'
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Reproducir sonido si está habilitado
    if (settings.soundEnabled && soundPermission) {
      playNotificationSound(randomType);
    }

    // Mostrar notificación del navegador si está habilitado
    if (settings.pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
        tag: newNotification.id
      });
    }
  };

  const playNotificationSound = (type: string) => {
    const audio = new Audio();
    audio.volume = 0.3;
    
    switch (type) {
      case 'success':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeCsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsBJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeAA==';
        break;
      case 'warning':
      case 'urgent':
        audio.src = 'data:audio/wav;base64,UklGRvwGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAAgAZGF0YdgGAACMhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBziR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFBHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCA=';
        break;
      default:
        audio.src = 'data:audio/wav;base64,UklGRzQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAIgGZGF0YQAGAACMHYQFBF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBziR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCD2N0/LNeCA=';
    }
    
    audio.play().catch(e => console.log('No se pudo reproducir el sonido:', e));
  };

  // Solicitar permisos
  useEffect(() => {
    // Permiso para notificaciones del navegador
    if ('Notification' in window && settings.pushEnabled) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    // Verificar permiso para sonido
    setSoundPermission(true); // En un caso real, verificarías permisos de audio
  }, [settings.pushEnabled]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'urgent': return '🚨';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'urgent': return 'text-red-800 bg-red-100 border-red-300 animate-pulse';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tributario': return <Calendar className="w-4 h-4" />;
      case 'facturacion': return <FileText className="w-4 h-4" />;
      case 'sistema': return <Settings className="w-4 h-4" />;
      case 'clientes': return <Users className="w-4 h-4" />;
      case 'reportes': return <FileText className="w-4 h-4" />;
      case 'seguridad': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleAction = (action: string, notificationId: string) => {
    console.log(`Ejecutando acción: ${action} para notificación: ${notificationId}`);
    markAsRead(notificationId);
    
    // Aquí implementarías las acciones reales
    switch (action) {
      case 'generate_f29':
        window.location.href = '/reportes-avanzados';
        break;
      case 'view_invoice':
        window.location.href = '/facturas';
        break;
      case 'renew_certificate':
        window.location.href = '/gestion-certificados';
        break;
      case 'download_report':
        console.log('Descargando reporte...');
        break;
      default:
        console.log('Acción no implementada:', action);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.read) return false;
    if (filter === 'today') {
      const today = new Date();
      const notifDate = new Date(notif.timestamp);
      if (notifDate.toDateString() !== today.toDateString()) return false;
    }
    if (filter === 'urgent' && notif.priority !== 'critical') return false;
    if (selectedCategory !== 'all' && notif.category !== selectedCategory) return false;
    
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'critical' && !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <BellRing className="w-8 h-8 text-blue-600" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Centro de Notificaciones</h1>
            <p className="text-gray-600">
              {unreadCount} notificaciones sin leer
              {urgentCount > 0 && (
                <span className="ml-2 text-red-600 font-semibold">
                  • {urgentCount} urgentes
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Marcar todas como leídas
          </Button>
          
          <Button variant={settings.soundEnabled ? "default" : "outline"} size="sm">
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              
              <div className="flex gap-2">
                {['all', 'unread', 'today', 'urgent'].map((filterType) => (
                  <Button
                    key={filterType}
                    variant={filter === filterType ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(filterType as any)}
                  >
                    {filterType === 'all' && 'Todas'}
                    {filterType === 'unread' && 'Sin leer'}
                    {filterType === 'today' && 'Hoy'}
                    {filterType === 'urgent' && 'Urgentes'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Categoría:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">Todas</option>
                <option value="tributario">Tributario</option>
                <option value="facturacion">Facturación</option>
                <option value="sistema">Sistema</option>
                <option value="clientes">Clientes</option>
                <option value="reportes">Reportes</option>
                <option value="seguridad">Seguridad</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones ({filteredNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Lista de Notificaciones */}
        <TabsContent value="notifications">
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay notificaciones
                  </h3>
                  <p className="text-gray-500">
                    {filter === 'all' 
                      ? 'No tienes notificaciones en este momento.' 
                      : `No hay notificaciones que coincidan con el filtro "${filter}".`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all ${
                    !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                  } ${notification.priority === 'critical' ? 'ring-2 ring-red-200' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Icono de categoría */}
                        <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                          {getCategoryIcon(notification.category)}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {notification.category}
                            </Badge>
                            {notification.priority === 'critical' && (
                              <Badge className="bg-red-500 text-white text-xs">
                                URGENTE
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          
                          {/* Metadata */}
                          {notification.metadata && (
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              {notification.metadata.amount && (
                                <span className="font-medium text-green-600">
                                  {formatCurrency(notification.metadata.amount)}
                                </span>
                              )}
                              {notification.metadata.client && (
                                <span>{notification.metadata.client}</span>
                              )}
                              {notification.metadata.dueDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Vence: {notification.metadata.dueDate.toLocaleDateString('es-CL')}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Acciones */}
                          {notification.actions && (
                            <div className="flex items-center gap-2">
                              {notification.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  variant={action.primary ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleAction(action.action, notification.id)}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Controles */}
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-gray-500">
                          {notification.timestamp.toLocaleString('es-CL', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Configuración de Notificaciones */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuración General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Notificaciones Push</div>
                      <div className="text-sm text-gray-500">Mostrar en el navegador</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushEnabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, pushEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Notificaciones por Email</div>
                      <div className="text-sm text-gray-500">Enviar a tu correo</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, emailEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Notificaciones SMS</div>
                      <div className="text-sm text-gray-500">Mensajes de texto</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.smsEnabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, smsEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Sonidos</div>
                      <div className="text-sm text-gray-500">Reproducir alertas sonoras</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, soundEnabled: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuración por Categorías */}
            <Card>
              <CardHeader>
                <CardTitle>Configuración por Categoría</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.categories).map(([category, config]) => (
                  <div key={category} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span className="font-medium capitalize">{category}</span>
                      </div>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            categories: {
                              ...prev.categories,
                              [category]: { ...config, enabled: checked }
                            }
                          }))
                        }
                      />
                    </div>
                    
                    {config.enabled && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span>Prioridad:</span>
                          <select
                            value={config.priority}
                            onChange={(e) => 
                              setSettings(prev => ({
                                ...prev,
                                categories: {
                                  ...prev.categories,
                                  [category]: { 
                                    ...config, 
                                    priority: e.target.value as 'low' | 'medium' | 'high'
                                  }
                                }
                              }))
                            }
                            className="border rounded px-2 py-1"
                          >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <span>Canales:</span>
                          <div className="flex gap-1">
                            {['push', 'email', 'sms'].map((channel) => (
                              <Badge
                                key={channel}
                                variant={config.channels.includes(channel as any) ? "default" : "outline"}
                                className="cursor-pointer text-xs"
                                onClick={() => {
                                  const newChannels = config.channels.includes(channel as any)
                                    ? config.channels.filter(c => c !== channel)
                                    : [...config.channels, channel as any];
                                  
                                  setSettings(prev => ({
                                    ...prev,
                                    categories: {
                                      ...prev.categories,
                                      [category]: { ...config, channels: newChannels }
                                    }
                                  }));
                                }}
                              >
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
