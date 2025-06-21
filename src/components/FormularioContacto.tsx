'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, Building, MessageSquare, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface FormularioContactoProps {
  tipo?: 'contacto' | 'demo' | 'soporte' | 'comercial' | 'consulta_contable';
  titulo?: string;
  descripcion?: string;
}

export default function FormularioContacto({ 
  tipo = 'contacto', 
  titulo = 'Contáctanos',
  descripcion = 'Nos encantaría conocer más sobre tu empresa y cómo podemos ayudarte'
}: FormularioContactoProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    telefono: '',
    mensaje: '',
    tipo: tipo
  });

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{
    tipo: 'success' | 'error' | null;
    mensaje: string;
  }>({ tipo: null, mensaje: '' });
  const tipoOptions = {
    contacto: 'Contacto General',
    demo: 'Solicitar Demo',
    soporte: 'Soporte Técnico',
    comercial: 'Consulta Comercial',
    consulta_contable: 'Consulta Contable'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultado({ tipo: null, mensaje: '' });

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResultado({
          tipo: 'success',
          mensaje: data.message || 'Mensaje enviado correctamente. Te contactaremos pronto.'
        });
        
        // Limpiar formulario después del éxito
        setFormData({
          nombre: '',
          email: '',
          empresa: '',
          telefono: '',
          mensaje: '',
          tipo: tipo
        });
      } else {
        setResultado({
          tipo: 'error',
          mensaje: data.error || 'Error al enviar el mensaje. Inténtalo nuevamente.'
        });
      }
    } catch (error) {
      setResultado({
        tipo: 'error',
        mensaje: 'Error de conexión. Verifica tu internet e inténtalo nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          {titulo}
        </CardTitle>
        <CardDescription className="text-base">
          {descripcion}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {resultado.tipo && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            resultado.tipo === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {resultado.tipo === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <p className={`text-sm ${
              resultado.tipo === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {resultado.mensaje}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de consulta */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tipo de consulta
            </label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value) => handleChange('tipo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de consulta" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(tipoOptions).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nombre completo *
            </label>
            <Input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Tu nombre completo"
              required
              className="w-full"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full"
            />
          </div>

          {/* Empresa */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Empresa
            </label>
            <Input
              type="text"
              value={formData.empresa}
              onChange={(e) => handleChange('empresa', e.target.value)}
              placeholder="Nombre de tu empresa"
              className="w-full"
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Teléfono
            </label>
            <Input
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder="+56 9 1234 5678"
              className="w-full"
            />
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Mensaje *
            </label>
            <Textarea
              value={formData.mensaje}
              onChange={(e) => handleChange('mensaje', e.target.value)}
              placeholder={
                formData.tipo === 'demo' 
                  ? 'Cuéntanos sobre tu empresa y qué te gustaría ver en la demo...'
                  : formData.tipo === 'soporte'
                  ? 'Describe el problema que estás experimentando...'
                  : formData.tipo === 'comercial'
                  ? 'Cuéntanos sobre tus necesidades comerciales...'
                  : 'Escribe tu mensaje aquí...'
              }
              required
              rows={4}
              className="w-full resize-none"
            />
          </div>

          {/* Botón de envío */}
          <Button
            type="submit"
            disabled={loading || !formData.nombre || !formData.email || !formData.mensaje}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Enviando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Enviar {tipoOptions[formData.tipo as keyof typeof tipoOptions]}
              </div>
            )}
          </Button>

          {/* Nota de privacidad */}
          <p className="text-xs text-gray-500 text-center">
            Al enviar este formulario, aceptas que procesemos tus datos para contactarte. 
            No compartimos tu información con terceros.
          </p>
        </form>

        {/* Información de contacto alternativa */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            También puedes contactarnos directamente:
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>contacto@sistemacontabilidad.cl</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+56 9 7373 2599</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
