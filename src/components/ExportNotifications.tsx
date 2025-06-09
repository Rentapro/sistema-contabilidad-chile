'use client';

import { useState } from 'react';
import { SystemNotification } from '@/hooks/useSystemNotifications';

interface ExportNotificationsProps {
  notifications: SystemNotification[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportNotifications({ notifications, isOpen, onClose }: ExportNotificationsProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [exportRange, setExportRange] = useState<'all' | 'unread' | 'last30'>('all');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const getFilteredNotifications = () => {
    let filtered = [...notifications];

    switch (exportRange) {
      case 'unread':
        filtered = filtered.filter(n => !n.isRead);
        break;
      case 'last30':
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(n => n.timestamp >= thirtyDaysAgo);
        break;
      default:
        // 'all' - no filter needed
        break;
    }

    return filtered;
  };

  const exportToCSV = (data: SystemNotification[]) => {
    const headers = ['ID', 'Tipo', 'Título', 'Mensaje', 'Módulo', 'Prioridad', 'Estado', 'Fecha'];
    const rows = data.map(n => [
      n.id,
      n.type,
      n.title,
      n.message.replace(/,/g, ';'), // Escapar comas
      n.module,
      n.priority,
      n.isRead ? 'Leída' : 'No leída',
      n.timestamp.toISOString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `notificaciones_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToJSON = (data: SystemNotification[]) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalNotifications: data.length,
      filters: { range: exportRange },
      notifications: data.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        module: n.module,
        priority: n.priority,
        isRead: n.isRead,
        timestamp: n.timestamp.toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `notificaciones_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const exportToPDF = async (data: SystemNotification[]) => {
    // Para una implementación completa de PDF, necesitarías una librería como jsPDF
    // Por ahora, crearemos un HTML que se puede imprimir/guardar como PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Notificaciones</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .notification { border: 1px solid #ddd; padding: 10px; margin: 10px 0; }
          .priority-critical { border-left: 4px solid #dc3545; }
          .priority-high { border-left: 4px solid #fd7e14; }
          .priority-medium { border-left: 4px solid #ffc107; }
          .priority-low { border-left: 4px solid #28a745; }
          .meta { font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reporte de Notificaciones</h1>
          <p>Generado el: ${new Date().toLocaleDateString('es-ES')}</p>
          <p>Total de notificaciones: ${data.length}</p>
        </div>
        
        ${data.map(n => `
          <div class="notification priority-${n.priority}">
            <h3>${n.title}</h3>
            <p>${n.message}</p>
            <div class="meta">
              <strong>Módulo:</strong> ${n.module} | 
              <strong>Tipo:</strong> ${n.type} | 
              <strong>Prioridad:</strong> ${n.priority} | 
              <strong>Estado:</strong> ${n.isRead ? 'Leída' : 'No leída'} | 
              <strong>Fecha:</strong> ${n.timestamp.toLocaleString('es-ES')}
            </div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `notificaciones_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filteredData = getFilteredNotifications();
      
      switch (exportFormat) {
        case 'csv':
          exportToCSV(filteredData);
          break;
        case 'json':
          exportToJSON(filteredData);
          break;
        case 'pdf':
          await exportToPDF(filteredData);
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Error al exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredCount = getFilteredNotifications().length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Exportar Notificaciones</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Formato de exportación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato de Exportación
              </label>
              <div className="space-y-2">
                {[
                  { value: 'csv', label: 'CSV (Excel)', desc: 'Compatible con Excel y hojas de cálculo' },
                  { value: 'json', label: 'JSON', desc: 'Formato estructurado para desarrolladores' },
                  { value: 'pdf', label: 'HTML/PDF', desc: 'Documento legible para impresión' }
                ].map(format => (
                  <label key={format.value} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value={format.value}
                      checked={exportFormat === format.value}
                      onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json' | 'pdf')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{format.label}</div>
                      <div className="text-sm text-gray-500">{format.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Rango de exportación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Datos
              </label>
              <select
                value={exportRange}
                onChange={(e) => setExportRange(e.target.value as 'all' | 'unread' | 'last30')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las notificaciones ({notifications.length})</option>
                <option value="unread">Solo no leídas ({notifications.filter(n => !n.isRead).length})</option>
                <option value="last30">Últimos 30 días ({notifications.filter(n => n.timestamp >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length})</option>
              </select>
            </div>

            {/* Preview del export */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>Vista previa:</strong>
              </div>
              <div className="text-sm">
                Se exportarán <strong>{filteredCount}</strong> notificaciones en formato <strong>{exportFormat.toUpperCase()}</strong>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || filteredCount === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isExporting ? 'Exportando...' : 'Exportar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
