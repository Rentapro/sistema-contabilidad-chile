'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/authService';

export default function ConfiguracionSII() {
  const router = useRouter();
  const [rut, setRut] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    // Cargar configuración existente desde API o localStorage
    const cfg = AuthService.getSIIConfig();
    if (cfg) {
      setRut(cfg.rut || '');
      setToken(cfg.token || '');
    }
  }, []);

  const guardarConfiguracion = async () => {
    setLoading(true);
    setMensaje(null);
    try {
      await AuthService.saveSIIConfig({ rut, token });
      setMensaje('Configuración guardada correctamente');
      setTimeout(() => router.refresh(), 1000);
    } catch (error: any) {
      setMensaje(error.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-6">
      <CardHeader>
        <CardTitle>🔐 Configuración SII</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block mb-1">RUT</label>
          <Input
            value={rut}
            onChange={e => setRut(e.target.value)}
            placeholder="Ej: 12345678-9"
          />
        </div>
        <div>
          <label className="block mb-1">Token API</label>
          <Input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Token de acceso SII"
          />
        </div>
        {mensaje && <p className="text-sm text-gray-600">{mensaje}</p>}
        <Button onClick={guardarConfiguracion} disabled={loading} className="w-full">
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </CardContent>
    </Card>
  );
}
