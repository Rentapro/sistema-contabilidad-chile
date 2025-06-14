/**
 * API de Indicadores Económicos Chile - Real
 * Integración con servicios oficiales chilenos
 */

// Ruta: /api/indicadores/route.ts
export async function GET() {
  try {
    // Obtener indicadores desde mindicador.cl (API oficial)
    const response = await fetch('https://mindicador.cl/api', {
      headers: {
        'User-Agent': 'SistemaContabilidadChile/2.0'
      }
    })

    if (!response.ok) {
      throw new Error('Error obteniendo indicadores')
    }

    const data = await response.json()
    
    // Formatear datos para nuestro sistema
    const indicadores = {
      uf: {
        valor: data.uf?.valor || 0,
        fecha: data.uf?.fecha || new Date().toISOString(),
        unidad: 'Pesos'
      },
      utm: {
        valor: data.utm?.valor || 0,
        fecha: data.utm?.fecha || new Date().toISOString(),
        unidad: 'Pesos'
      },
      dolar: {
        valor: data.dolar?.valor || 0,
        fecha: data.dolar?.fecha || new Date().toISOString(),
        unidad: 'Pesos'
      },
      euro: {
        valor: data.euro?.valor || 0,
        fecha: data.euro?.fecha || new Date().toISOString(),
        unidad: 'Pesos'
      },
      ipc: {
        valor: data.ipc?.valor || 0,
        fecha: data.ipc?.fecha || new Date().toISOString(),
        unidad: 'Porcentaje'
      },
      tasa_desempleo: {
        valor: data.tasa_desempleo?.valor || 0,
        fecha: data.tasa_desempleo?.fecha || new Date().toISOString(),
        unidad: 'Porcentaje'
      }
    }

    return Response.json({
      success: true,
      data: indicadores,
      fuente: 'Banco Central de Chile vía mindicador.cl',
      actualizacion: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error obteniendo indicadores:', error)
    
    // Devolver valores por defecto en caso de error
    return Response.json({
      success: false,
      error: 'Error obteniendo indicadores',
      data: {
        uf: { valor: 36000, fecha: new Date().toISOString(), unidad: 'Pesos' },
        utm: { valor: 65000, fecha: new Date().toISOString(), unidad: 'Pesos' },
        dolar: { valor: 900, fecha: new Date().toISOString(), unidad: 'Pesos' },
        euro: { valor: 950, fecha: new Date().toISOString(), unidad: 'Pesos' },
        ipc: { valor: 3.5, fecha: new Date().toISOString(), unidad: 'Porcentaje' },
        tasa_desempleo: { valor: 7.8, fecha: new Date().toISOString(), unidad: 'Porcentaje' }
      }
    }, { status: 500 })
  }
}
