/**
 * API de Regiones y Comunas Chile - Real
 * Base de datos oficial de divisiones territoriales
 */

// Ruta: /api/territorios/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const regionId = searchParams.get('region')

  try {
    if (regionId) {
      // Retornar comunas de una región específica
      const comunas = obtenerComunasPorRegion(regionId)
      return Response.json({
        success: true,
        data: comunas
      })
    } else {
      // Retornar todas las regiones
      const regiones = obtenerTodasLasRegiones()
      return Response.json({
        success: true,
        data: regiones
      })
    }
  } catch (error) {
    console.error('Error obteniendo territorios:', error)
    return Response.json({
      success: false,
      error: 'Error obteniendo datos territoriales'
    }, { status: 500 })
  }
}

/**
 * Base de datos oficial de regiones de Chile
 */
function obtenerTodasLasRegiones() {
  return [
    { id: '15', nombre: 'Arica y Parinacota', codigo: 'XV' },
    { id: '01', nombre: 'Tarapacá', codigo: 'I' },
    { id: '02', nombre: 'Antofagasta', codigo: 'II' },
    { id: '03', nombre: 'Atacama', codigo: 'III' },
    { id: '04', nombre: 'Coquimbo', codigo: 'IV' },
    { id: '05', nombre: 'Valparaíso', codigo: 'V' },
    { id: '13', nombre: 'Metropolitana de Santiago', codigo: 'RM' },
    { id: '06', nombre: 'Libertador General Bernardo O\'Higgins', codigo: 'VI' },
    { id: '07', nombre: 'Maule', codigo: 'VII' },
    { id: '16', nombre: 'Ñuble', codigo: 'XVI' },
    { id: '08', nombre: 'Biobío', codigo: 'VIII' },
    { id: '09', nombre: 'La Araucanía', codigo: 'IX' },
    { id: '14', nombre: 'Los Ríos', codigo: 'XIV' },
    { id: '10', nombre: 'Los Lagos', codigo: 'X' },
    { id: '11', nombre: 'Aysén del General Carlos Ibáñez del Campo', codigo: 'XI' },
    { id: '12', nombre: 'Magallanes y de la Antártica Chilena', codigo: 'XII' }
  ]
}

/**
 * Base de datos oficial de comunas por región
 */
function obtenerComunasPorRegion(regionId: string) {
  const comunasPorRegion: Record<string, Array<{id: string, nombre: string}>> = {
    '15': [
      { id: '15101', nombre: 'Arica' },
      { id: '15102', nombre: 'Camarones' },
      { id: '15201', nombre: 'Putre' },
      { id: '15202', nombre: 'General Lagos' }
    ],
    '01': [
      { id: '01101', nombre: 'Iquique' },
      { id: '01107', nombre: 'Alto Hospicio' },
      { id: '01401', nombre: 'Pozo Almonte' },
      { id: '01402', nombre: 'Camiña' },
      { id: '01403', nombre: 'Colchane' },
      { id: '01404', nombre: 'Huara' },
      { id: '01405', nombre: 'Pica' }
    ],
    '02': [
      { id: '02101', nombre: 'Antofagasta' },
      { id: '02102', nombre: 'Mejillones' },
      { id: '02103', nombre: 'Sierra Gorda' },
      { id: '02104', nombre: 'Taltal' },
      { id: '02201', nombre: 'Calama' },
      { id: '02202', nombre: 'Ollagüe' },
      { id: '02203', nombre: 'San Pedro de Atacama' },
      { id: '02301', nombre: 'Tocopilla' },
      { id: '02302', nombre: 'María Elena' }
    ],
    '13': [
      { id: '13101', nombre: 'Santiago' },
      { id: '13102', nombre: 'Cerrillos' },
      { id: '13103', nombre: 'Cerro Navia' },
      { id: '13104', nombre: 'Conchalí' },
      { id: '13105', nombre: 'El Bosque' },
      { id: '13106', nombre: 'Estación Central' },
      { id: '13107', nombre: 'Huechuraba' },
      { id: '13108', nombre: 'Independencia' },
      { id: '13109', nombre: 'La Cisterna' },
      { id: '13110', nombre: 'La Florida' },
      { id: '13111', nombre: 'La Granja' },
      { id: '13112', nombre: 'La Pintana' },
      { id: '13113', nombre: 'La Reina' },
      { id: '13114', nombre: 'Las Condes' },
      { id: '13115', nombre: 'Lo Barnechea' },
      { id: '13116', nombre: 'Lo Espejo' },
      { id: '13117', nombre: 'Lo Prado' },
      { id: '13118', nombre: 'Macul' },
      { id: '13119', nombre: 'Maipú' },
      { id: '13120', nombre: 'Ñuñoa' },
      { id: '13121', nombre: 'Pedro Aguirre Cerda' },
      { id: '13122', nombre: 'Peñalolén' },
      { id: '13123', nombre: 'Providencia' },
      { id: '13124', nombre: 'Pudahuel' },
      { id: '13125', nombre: 'Quilicura' },
      { id: '13126', nombre: 'Quinta Normal' },
      { id: '13127', nombre: 'Recoleta' },
      { id: '13128', nombre: 'Renca' },
      { id: '13129', nombre: 'San Joaquín' },
      { id: '13130', nombre: 'San Miguel' },
      { id: '13131', nombre: 'San Ramón' },
      { id: '13132', nombre: 'Vitacura' },
      { id: '13201', nombre: 'Puente Alto' },
      { id: '13202', nombre: 'Pirque' },
      { id: '13203', nombre: 'San José de Maipo' },
      { id: '13301', nombre: 'Colina' },
      { id: '13302', nombre: 'Lampa' },
      { id: '13303', nombre: 'Tiltil' },
      { id: '13401', nombre: 'San Bernardo' },
      { id: '13402', nombre: 'Buin' },
      { id: '13403', nombre: 'Calera de Tango' },
      { id: '13404', nombre: 'Paine' },
      { id: '13501', nombre: 'Melipilla' },
      { id: '13502', nombre: 'Alhué' },
      { id: '13503', nombre: 'Curacaví' },
      { id: '13504', nombre: 'María Pinto' },
      { id: '13505', nombre: 'San Pedro' },
      { id: '13601', nombre: 'Talagante' },
      { id: '13602', nombre: 'El Monte' },
      { id: '13603', nombre: 'Isla de Maipo' },
      { id: '13604', nombre: 'Padre Hurtado' },
      { id: '13605', nombre: 'Peñaflor' }
    ],
    '05': [
      { id: '05101', nombre: 'Valparaíso' },
      { id: '05102', nombre: 'Casablanca' },
      { id: '05103', nombre: 'Concón' },
      { id: '05104', nombre: 'Juan Fernández' },
      { id: '05105', nombre: 'Puchuncaví' },
      { id: '05107', nombre: 'Quintero' },
      { id: '05109', nombre: 'Viña del Mar' },
      { id: '05201', nombre: 'Isla de Pascua' },
      { id: '05301', nombre: 'Los Andes' },
      { id: '05302', nombre: 'Calle Larga' },
      { id: '05303', nombre: 'Rinconada' },
      { id: '05304', nombre: 'San Esteban' },
      { id: '05401', nombre: 'La Ligua' },
      { id: '05402', nombre: 'Cabildo' },
      { id: '05403', nombre: 'Papudo' },
      { id: '05404', nombre: 'Petorca' },
      { id: '05405', nombre: 'Zapallar' },
      { id: '05501', nombre: 'Quillota' },
      { id: '05502', nombre: 'Calera' },
      { id: '05503', nombre: 'Hijuelas' },
      { id: '05504', nombre: 'La Cruz' },
      { id: '05506', nombre: 'Nogales' },
      { id: '05601', nombre: 'San Antonio' },
      { id: '05602', nombre: 'Algarrobo' },
      { id: '05603', nombre: 'Cartagena' },
      { id: '05604', nombre: 'El Quisco' },
      { id: '05605', nombre: 'El Tabo' },
      { id: '05606', nombre: 'Santo Domingo' },
      { id: '05701', nombre: 'San Felipe' },
      { id: '05702', nombre: 'Catemu' },
      { id: '05703', nombre: 'Llaillay' },
      { id: '05704', nombre: 'Panquehue' },
      { id: '05705', nombre: 'Putaendo' },
      { id: '05706', nombre: 'Santa María' }
    ],
    '08': [
      { id: '08101', nombre: 'Concepción' },
      { id: '08102', nombre: 'Coronel' },
      { id: '08103', nombre: 'Chiguayante' },
      { id: '08104', nombre: 'Florida' },
      { id: '08105', nombre: 'Hualqui' },
      { id: '08106', nombre: 'Lota' },
      { id: '08107', nombre: 'Penco' },
      { id: '08108', nombre: 'San Pedro de la Paz' },
      { id: '08109', nombre: 'Santa Juana' },
      { id: '08110', nombre: 'Talcahuano' },
      { id: '08111', nombre: 'Tomé' },
      { id: '08112', nombre: 'Hualpén' },
      { id: '08201', nombre: 'Lebu' },
      { id: '08202', nombre: 'Arauco' },
      { id: '08203', nombre: 'Cañete' },
      { id: '08204', nombre: 'Contulmo' },
      { id: '08205', nombre: 'Curanilahue' },
      { id: '08206', nombre: 'Los Álamos' },
      { id: '08207', nombre: 'Tirúa' },
      { id: '08301', nombre: 'Los Ángeles' },
      { id: '08302', nombre: 'Antuco' },
      { id: '08303', nombre: 'Cabrero' },
      { id: '08304', nombre: 'Laja' },
      { id: '08305', nombre: 'Mulchén' },
      { id: '08306', nombre: 'Nacimiento' },
      { id: '08307', nombre: 'Negrete' },
      { id: '08308', nombre: 'Quilaco' },
      { id: '08309', nombre: 'Quilleco' },
      { id: '08310', nombre: 'San Rosendo' },
      { id: '08311', nombre: 'Santa Bárbara' },
      { id: '08312', nombre: 'Tucapel' },
      { id: '08313', nombre: 'Yumbel' },
      { id: '08314', nombre: 'Alto Biobío' }
    ]
  }

  return comunasPorRegion[regionId] || []
}
