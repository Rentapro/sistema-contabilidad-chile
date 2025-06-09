'use client';

import { useState } from 'react';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  criticalOnly: boolean;
  autoMarkAsRead: boolean;
  notificationFrequency: 'immediate' | 'hourly' | 'daily';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

export default function NotificationSettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onSave 
}: NotificationSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const updateSetting = <K extends keyof NotificationSettings>(
    key: K, 
    value: NotificationSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateQuietHours = <K extends keyof NotificationSettings['quietHours']>(
    key: K,
    value: NotificationSettings['quietHours'][K]
  ) => {
    setLocalSettings(prev => ({
      ...prev,
      quietHours: { ...prev.quietHours, [key]: value }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Configuración de Notificaciones</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900">Notificaciones por Email</label>
                <p className="text-sm text-gray-500">Recibir notificaciones en tu correo electrónico</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.emailNotifications}
                onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900">Notificaciones Push</label>
                <p className="text-sm text-gray-500">Notificaciones del navegador en tiempo real</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.pushNotifications}
                onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
            </div>

            {/* Critical Only */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900">Solo Críticas</label>
                <p className="text-sm text-gray-500">Recibir únicamente notificaciones críticas</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.criticalOnly}
                onChange={(e) => updateSetting('criticalOnly', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
            </div>

            {/* Auto Mark as Read */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900">Marcar como Leídas Automáticamente</label>
                <p className="text-sm text-gray-500">Marcar notificaciones como leídas después de 30 segundos</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.autoMarkAsRead}
                onChange={(e) => updateSetting('autoMarkAsRead', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
            </div>

            {/* Notification Frequency */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">Frecuencia de Notificaciones</label>
              <select
                value={localSettings.notificationFrequency}
                onChange={(e) => updateSetting('notificationFrequency', e.target.value as 'immediate' | 'hourly' | 'daily')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="immediate">Inmediata</option>
                <option value="hourly">Cada hora</option>
                <option value="daily">Diaria</option>
              </select>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-900">Horas Silenciosas</label>
                <input
                  type="checkbox"
                  checked={localSettings.quietHours.enabled}
                  onChange={(e) => updateQuietHours('enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
              </div>
              
              {localSettings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Desde</label>
                    <input
                      type="time"
                      value={localSettings.quietHours.start}
                      onChange={(e) => updateQuietHours('start', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Hasta</label>
                    <input
                      type="time"
                      value={localSettings.quietHours.end}
                      onChange={(e) => updateQuietHours('end', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
