'use client';

import { useState } from 'react';
import { SystemNotification } from '@/hooks/useSystemNotifications';

interface NotificationFiltersProps {
  notifications: SystemNotification[];
  onFilterChange: (filteredNotifications: SystemNotification[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function NotificationFilters({ 
  notifications, 
  onFilterChange, 
  isOpen, 
  onToggle 
}: NotificationFiltersProps) {
  const [filters, setFilters] = useState({
    dateRange: 'all', // 'today', 'week', 'month', 'all'
    priority: 'all', // 'critical', 'high', 'medium', 'low', 'all'
    module: 'all', // specific module or 'all'
    status: 'all', // 'read', 'unread', 'all'
    searchTerm: ''
  });

  const modules = [...new Set(notifications.map(n => n.module))];

  const applyFilters = (newFilters: typeof filters) => {
    let filtered = [...notifications];

    // Filtro por rango de fechas
    if (newFilters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (newFilters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter(n => n.timestamp >= startDate);
    }

    // Filtro por prioridad
    if (newFilters.priority !== 'all') {
      filtered = filtered.filter(n => n.priority === newFilters.priority);
    }

    // Filtro por módulo
    if (newFilters.module !== 'all') {
      filtered = filtered.filter(n => n.module === newFilters.module);
    }

    // Filtro por estado
    if (newFilters.status !== 'all') {
      filtered = filtered.filter(n => 
        newFilters.status === 'read' ? n.isRead : !n.isRead
      );
    }

    // Filtro por término de búsqueda
    if (newFilters.searchTerm) {
      const searchLower = newFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchLower) ||
        n.message.toLowerCase().includes(searchLower) ||
        n.module.toLowerCase().includes(searchLower)
      );
    }

    onFilterChange(filtered);
  };

  const updateFilter = <K extends keyof typeof filters>(
    key: K, 
    value: typeof filters[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      dateRange: 'all',
      priority: 'all',
      module: 'all',
      status: 'all',
      searchTerm: ''
    };
    setFilters(defaultFilters);
    applyFilters(defaultFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== 'all' && value !== ''
  );

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          hasActiveFilters 
            ? 'bg-blue-50 border-blue-200 text-blue-700' 
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        🔍 Filtros
        {hasActiveFilters && (
          <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Filtros Avanzados</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Limpiar filtros
            </button>
          )}
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            placeholder="Buscar en título, mensaje o módulo..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Rango de fechas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rango de Fechas
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => updateFilter('dateRange', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            value={filters.priority}
            onChange={(e) => updateFilter('priority', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>

        {/* Módulo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Módulo
          </label>
          <select
            value={filters.module}
            onChange={(e) => updateFilter('module', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            {modules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            <option value="unread">No leídas</option>
            <option value="read">Leídas</option>
          </select>
        </div>
      </div>
    </div>
  );
}
