'use client';

import DashboardCompleto from '@/components/DashboardCompleto';

export default function Home() {
  return <DashboardCompleto />;
}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center mt-2">
          <span className={`text-sm font-semibold flex items-center ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {trend === 'up' && '↗️'}
            {trend === 'down' && '↘️'}
            {trend === 'neutral' && '➡️'}
            <span className="ml-1">{change}</span>
          </span>
          <span className="text-xs text-gray-500 ml-2">vs mes anterior</span>
        </div>
      </div>
      <div className={`text-3xl ${color} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
  </div>
);

// Componente para las acciones rápidas
const QuickActionCard = ({ 
  title, 
  description, 
  href, 
  icon, 
  color,
  badge,
  stats 
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  badge?: string;
  stats?: string;
}) => (
  <Link href={href}>
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`text-3xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {badge && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      {stats && (
        <p className="text-xs text-gray-500 mb-3 font-medium">{stats}</p>
      )}
      <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 group-hover:translate-x-1 transition-all">
        Acceder <span className="ml-1">→</span>
      </div>
    </div>
  </Link>
);

// Componente para actividad reciente
const ActivityItem = ({ 
  icon, 
  title, 
  description, 
  time, 
  amount 
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
  amount?: string;
}) => (
  <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="text-2xl">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
      <p className="text-sm text-gray-500 truncate">{description}</p>
    </div>
    <div className="text-right">
      {amount && <p className="text-sm font-medium text-gray-900">{amount}</p>}
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Actualizar la hora cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  const loadData = async () => {
    setLoading(true);
    try {
      // Intentar usar servicios reales primero
      const [facturasData, clientesData, gastosData, proveedoresData] = await Promise.all([
        facturacionService.obtenerFacturas(),
        clienteService.obtenerClientes(),
        gastoService.obtenerGastos(),
        proveedorService.obtenerProveedores()
      ]);
      
      setFacturas(facturasData.map(adaptarFacturaDB));
      setClientes(clientesData.map(adaptarClienteDB));
      setGastos(gastosData.map(adaptarGastoDB));
      setProveedores(proveedoresData.map(adaptarProveedorDB));
    } catch (error) {
      console.error('Error al cargar datos, usando API local:', error);
      // Fallback a API local si falla la conexión a la BD
      setFacturas(api.getFacturas());
      setClientes(api.getClientes());
      setGastos(api.getGastos());
      setProveedores(api.getProveedores());
    } finally {
      setLoading(false);
    }
  };
  // Calcular métricas con useMemo para optimizar rendimiento
  const metrics = useMemo(() => {
    if (loading) {
      return {
        totalIngresos: 0,
        totalGastos: 0,
        utilidadNeta: 0,
        facturasPendientes: 0,
        facturasVencidas: 0,
        cambioIngresos: '+0%',
        cambioGastos: '+0%',
        cambioUtilidad: '+0%'
      };
    }

    const totalIngresos = facturas
      .filter(f => f.estado === 'pagada')
      .reduce((sum, f) => sum + f.total, 0);
    
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
    const utilidadNeta = totalIngresos - totalGastos;
    const facturasPendientes = facturas.filter(f => f.estado === 'pendiente').length;
    const facturasVencidas = facturas.filter(f => f.estado === 'vencida').length;
    
    // Simulamos el cambio vs mes anterior
    const cambioIngresos = '+12.5%';
    const cambioGastos = '+8.3%';
    const cambioUtilidad = utilidadNeta > 0 ? '+15.2%' : '-3.1%';
    
    return {
      totalIngresos,
      totalGastos,
      utilidadNeta,
      facturasPendientes,
      facturasVencidas,
      cambioIngresos,
      cambioGastos,
      cambioUtilidad
    };
  }, [facturas, gastos, loading]);

  // Datos de actividad reciente
  const recentActivity = [
    {
      icon: '💰',
      title: 'Pago recibido',
      description: 'Factura #FAC-001 - Cliente ABC',
      time: 'Hace 2 horas',
      amount: formatCurrency(25000)
    },
    {
      icon: '📄',
      title: 'Nueva factura creada',
      description: 'Factura #FAC-002 - Cliente XYZ',
      time: 'Hace 4 horas',
      amount: formatCurrency(18500)
    },
    {
      icon: '📊',
      title: 'Gasto registrado',
      description: 'Compra de suministros de oficina',
      time: 'Hace 6 horas',
      amount: formatCurrency(-1200)
    },
    {
      icon: '👥',
      title: 'Nuevo cliente añadido',
      description: 'Empresa DEF S.A.',
      time: 'Ayer',
    },
    {
      icon: '⚠️',
      title: 'Factura próxima a vencer',
      description: 'Factura #FAC-098 vence en 3 días',
      time: 'Ayer',
      amount: formatCurrency(15000)
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header moderno con gradiente */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                🇨🇱 Sistema Contable Chileno
              </h1>
              <p className="text-gray-600 mt-1 flex items-center">
                <span className="mr-2">🕒</span>
                {currentTime.toLocaleDateString('es-CL', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • {currentTime.toLocaleTimeString('es-CL', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  {loading ? 'Cargando...' : 'Sistema Operativo'}
                </span>
              </div>
              <Link 
                href="/notificaciones"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🔔 Notificaciones
              </Link>
            </div>
          </div>
        </div>
      </header>      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos del sistema...</p>
            </div>
          </div>
        ) : (
          <DashboardPrincipalMejorado />
        )}

        {/* Dashboard Original - Mantener como respaldo */}
        {false && loading === false && (
          <>
            {/* KPIs principales con terminología chilena */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="💰 Ingresos Brutos"
            value={formatCurrency(metrics.totalIngresos)}
            change={metrics.cambioIngresos}
            trend="up"
            icon="📈"
            color="text-green-600"
          />
          <KPICard
            title="📊 Gastos Aceptados"
            value={formatCurrency(metrics.totalGastos)}
            change={metrics.cambioGastos}
            trend="up"
            icon="📉"
            color="text-red-600"
          />
          <KPICard
            title="🎯 Renta Líquida"
            value={formatCurrency(metrics.utilidadNeta)}
            change={metrics.cambioUtilidad}
            trend={metrics.utilidadNeta >= 0 ? "up" : "down"}
            icon="💎"
            color={metrics.utilidadNeta >= 0 ? "text-blue-600" : "text-red-600"}
          />
          <KPICard
            title="📋 Documentos Pendientes SII"
            value={metrics.facturasPendientes.toString()}
            change={metrics.facturasVencidas > 0 ? `${metrics.facturasVencidas} vencidos` : 'Al día'}
            trend={metrics.facturasVencidas > 0 ? "down" : "neutral"}
            icon="⏰"
            color="text-orange-600"
          />        </div>

        {/* Resumen de Alertas del SII y Consejos Diarios */}
        <ResumenDashboard />

        {/* Acciones rápidas mejoradas */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🚀 Acciones Rápidas</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Gestión empresarial
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">            <QuickActionCard
              title="Gestión de Clientes"
              description="Administra tu cartera de clientes con RUT y giro comercial"
              href="/clientes"
              icon="👥"
              color="text-blue-600"
              stats={`${clientes.length} clientes registrados`}
            />
            <QuickActionCard
              title="Facturación Electrónica SII"
              description="Crea boletas y facturas electrónicas timbrradas por el SII"
              href="/facturas"
              icon="📄"
              color="text-green-600"
              badge={metrics.facturasPendientes > 0 ? `${metrics.facturasPendientes} pendientes` : undefined}
              stats={`${facturas.length} documentos tributarios`}
            />
            <QuickActionCard
              title="Control de Gastos Deducibles"
              description="Registra gastos aceptados por el SII para tributación"
              href="/gastos"
              icon="🧾"
              color="text-red-600"
              stats={`${gastos.length} gastos registrados`}
            />
            <QuickActionCard
              title="Proveedores"
              description="Gestiona proveedores con validación de RUT"
              href="/proveedores"
              icon="🏢"
              color="text-purple-600"
              stats={`${proveedores.length} proveedores activos`}
            />
            <QuickActionCard
              title="Reportes SII"
              description="F29, F22, Libros de Compra/Venta y más"
              href="/reportes"
              icon="📊"
              color="text-indigo-600"
              stats="F29 • F22 • LibCV • DDJJ"
            />
            <QuickActionCard
              title="Servicios SII"
              description="Formularios, libros y declaraciones para el SII Chile"
              href="/sii"
              icon="🇨🇱"
              color="text-red-600"
              badge="Nuevo"
              stats="F29 • Libros • Timbres"
            />
            <QuickActionCard
              title="Configuración Tributaria"
              description="Regímenes, calendarios y obligaciones del SII"
              href="/configuracion"
              icon="⚙️"
              color="text-gray-600"
              stats="Regímenes • CAF • DTE"
            />
          </div>
        </div>

        {/* Actividad reciente con diseño moderno */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de actividad reciente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  🔄 <span className="ml-2">Actividad Reciente</span>
                </h3>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                  Últimas 24h
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivity.map((activity, index) => (
                <ActivityItem
                  key={index}
                  icon={activity.icon}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                  amount={activity.amount}
                />
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link 
                href="/actividad" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center"
              >
                Ver todo el historial →
              </Link>
            </div>
          </div>

          {/* Panel de resumen financiero */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                💹 <span className="ml-2">Resumen Financiero</span>
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Gráfico de dona simple con CSS */}
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                  <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {metrics.utilidadNeta >= 0 ? '🟢' : '🔴'}
                      </div>
                      <div className="text-xs text-gray-500">Balance</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-800">Ingresos</div>
                  <div className="text-lg font-bold text-green-900">
                    {formatCurrency(metrics.totalIngresos)}
                  </div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-sm font-medium text-red-800">Gastos</div>
                  <div className="text-lg font-bold text-red-900">
                    {formatCurrency(metrics.totalGastos)}
                  </div>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-1">Renta Líquida</div>
                <div className={`text-xl font-bold ${metrics.utilidadNeta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(metrics.utilidadNeta)}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {metrics.utilidadNeta >= 0 ? '📈 Rentable' : '📉 Pérdida'}
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Footer actualizado */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Sistema Contable Chileno v3.0 • Homologado SII • IA Fiscal Avanzada • DTE Completo</p>
          <p className="mt-1">🇨🇱 Adaptado a la legislación tributaria chilena • IVA 19% • Reportes Automáticos SII</p>
        </div>
            </>
          )}
      </main>
    </div>
  );
}
