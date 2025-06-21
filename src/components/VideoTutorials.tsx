'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Clock, 
  User, 
  Star, 
  Monitor, 
  Smartphone, 
  PlayCircle,
  CheckCircle,
  BookOpen,
  Video,
  BarChart3,
  Settings
} from 'lucide-react';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'principiante' | 'intermedio' | 'avanzado';
  category: 'dashboard' | 'facturas' | 'reportes' | 'configuracion';
  thumbnail: string;
  videoUrl: string;
  instructor: string;
  rating: number;
  views: number;
  topics: string[];
}

const videoTutorials: VideoTutorial[] = [
  {
    id: 'dashboard-intro',
    title: 'Introducción al Dashboard de Conta-IA',
    description: 'Aprende a navegar y utilizar el dashboard principal para monitorear tu negocio en tiempo real',
    duration: '8:45',
    level: 'principiante',
    category: 'dashboard',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    instructor: 'María González',
    rating: 4.8,
    views: 1250,
    topics: ['Navegación básica', 'KPIs', 'Gráficos', 'Filtros']
  },
  {
    id: 'crear-primera-factura',
    title: 'Cómo crear tu primera factura',
    description: 'Guía completa paso a paso para generar facturas profesionales con cálculo automático de impuestos',
    duration: '12:30',
    level: 'principiante',
    category: 'facturas',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructor: 'Carlos Mendoza',
    rating: 4.9,
    views: 2100,
    topics: ['Formulario de factura', 'Cálculo IVA', 'Plantillas', 'PDF']
  },
  {
    id: 'reportes-avanzados',
    title: 'Generación de Reportes Financieros',
    description: 'Aprende a crear reportes profesionales: Balance General, Estado de Resultados y análisis financiero',
    duration: '15:20',
    level: 'intermedio',
    category: 'reportes',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructor: 'Ana Rodríguez',
    rating: 4.7,
    views: 980,
    topics: ['Balance General', 'Estado de Resultados', 'Ratios financieros', 'Exportación']
  },
  {
    id: 'configuracion-empresa',
    title: 'Configuración inicial de tu empresa',
    description: 'Configura correctamente los datos de tu empresa, usuarios y permisos para un uso óptimo del sistema',
    duration: '10:15',
    level: 'principiante',
    category: 'configuracion',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructor: 'Roberto Silva',
    rating: 4.6,
    views: 1450,
    topics: ['Datos empresa', 'Usuarios', 'Permisos', 'Integraciónes']
  },
  {
    id: 'integracion-sii',
    title: 'Integración con el SII - Facturación Electrónica',
    description: 'Configura la conexión con el SII para facturación electrónica y cumplimiento fiscal automático',
    duration: '18:40',
    level: 'avanzado',
    category: 'configuracion',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructor: 'Patricia Lagos',
    rating: 4.9,
    views: 750,
    topics: ['Certificados digitales', 'DTE', 'Timbrado', 'Validaciones SII']
  }
];

const levelColors = {
  principiante: 'bg-green-100 text-green-800',
  intermedio: 'bg-yellow-100 text-yellow-800',
  avanzado: 'bg-red-100 text-red-800'
};

const categoryIcons = {
  dashboard: <Monitor className="w-4 h-4" />,
  facturas: <BookOpen className="w-4 h-4" />,
  reportes: <BarChart3 className="w-4 h-4" />,
  configuracion: <Settings className="w-4 h-4" />
};

export default function VideoTutorials() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const filteredVideos = videoTutorials.filter(video => {
    const categoryMatch = filterCategory === 'all' || video.category === filterCategory;
    const levelMatch = filterLevel === 'all' || video.level === filterLevel;
    return categoryMatch && levelMatch;
  });

  const markAsCompleted = (videoId: string) => {
    setCompletedVideos(prev => 
      prev.includes(videoId) ? prev : [...prev, videoId]
    );
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: <Video className="w-4 h-4" /> },
    { id: 'dashboard', name: 'Dashboard', icon: <Monitor className="w-4 h-4" /> },
    { id: 'facturas', name: 'Facturas', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'reportes', name: 'Reportes', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'configuracion', name: 'Configuración', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Video Tutoriales
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Aprende a usar Conta-IA con nuestros video tutoriales paso a paso. 
          Desde conceptos básicos hasta características avanzadas.
        </p>
      </div>

      {!selectedVideo ? (
        <>
          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Filtro por categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Filtrar por categoría
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setFilterCategory(category.id)}
                      className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
                        filterCategory === category.id
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {category.icon}
                      <span className="ml-2 text-sm font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro por nivel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Filtrar por nivel
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', name: 'Todos los niveles' },
                    { id: 'principiante', name: 'Principiante' },
                    { id: 'intermedio', name: 'Intermedio' },
                    { id: 'avanzado', name: 'Avanzado' }
                  ].map(level => (
                    <button
                      key={level.id}
                      onClick={() => setFilterLevel(level.id)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        filterLevel === level.id
                          ? 'bg-purple-500 text-white border-purple-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid de videos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-80" />
                  </div>
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>

                  {/* Completed badge */}
                  {completedVideos.includes(video.id) && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}

                  {/* Level badge */}
                  <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${levelColors[video.level]}`}>
                    {video.level.charAt(0).toUpperCase() + video.level.slice(1)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    {categoryIcons[video.category]}
                    <span className="ml-1 capitalize">{video.category}</span>
                    <span className="mx-2">•</span>
                    <User className="w-3 h-3" />
                    <span className="ml-1">{video.instructor}</span>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                  </p>

                  {/* Rating and stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span>{video.rating}</span>
                      <span className="mx-2">•</span>
                      <span>{video.views.toLocaleString()} vistas</span>
                    </div>
                    <Play className="w-4 h-4 text-blue-500" />
                  </div>

                  {/* Topics */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {video.topics.slice(0, 2).map((topic, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                    {video.topics.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{video.topics.length - 2} más
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{videoTutorials.length}</div>
                <div className="text-sm text-gray-600">Videos disponibles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{completedVideos.length}</div>
                <div className="text-sm text-gray-600">Videos completados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((completedVideos.length / videoTutorials.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Progreso total</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Reproductor de video */
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Video header */}
          <div className="bg-gradient-to-r from-red-500 to-purple-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-2">{selectedVideo.title}</h2>
                <p className="text-red-100 mb-4">{selectedVideo.description}</p>
                <div className="flex items-center space-x-4 text-sm text-red-100">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedVideo.duration}
                  </span>
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {selectedVideo.instructor}
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {selectedVideo.rating}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Video player */}
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <PlayCircle className="w-24 h-24 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Reproductor de video</p>
              <p className="text-sm opacity-75">En una implementación real, aquí iría el reproductor</p>
            </div>
          </div>

          {/* Video info */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <span className={`text-xs px-3 py-1 rounded-full ${levelColors[selectedVideo.level]}`}>
                  {selectedVideo.level.charAt(0).toUpperCase() + selectedVideo.level.slice(1)}
                </span>
                <span className="text-sm text-gray-600">
                  {selectedVideo.views.toLocaleString()} vistas
                </span>
              </div>
              <button
                onClick={() => markAsCompleted(selectedVideo.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  completedVideos.includes(selectedVideo.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {completedVideos.includes(selectedVideo.id) ? (
                  <>
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Completado
                  </>
                ) : (
                  'Marcar como visto'
                )}
              </button>
            </div>

            {/* Topics */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Temas cubiertos en este video:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedVideo.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
