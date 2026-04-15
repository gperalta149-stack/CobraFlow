import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { handleApiError } from '../utils/handleApiError'

interface KPIs {
  totalClientes: number
  totalDeudas: number
  deudasPendientes: number
  deudasVencidas: number
  deudasPagadas: number
  deudasParciales: number
  totalMontoPendiente: number
  totalMontoDeudas: number
  totalRecaudadoMes: number
}

interface TopCliente {
  cliente_id: string
  saldo_pendiente: number
  clientes: { nombre: string }
}

interface Alerta {
  id: string
  deuda_id?: string
  cliente_id?: string
  descripcion: string
  fecha_vencimiento: string
  saldo_pendiente: number
  clientes: { nombre: string }
}

// 🔹 Mejora 3: Helper para determinar urgencia de alerta
type UrgencyLevel = 'urgent' | 'warning' | 'normal'

const getUrgencyLevel = (dateString: string): UrgencyLevel => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateString)
    dueDate.setHours(0, 0, 0, 0)
    
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 2) return 'urgent'
    if (diffDays <= 7) return 'warning'
    return 'normal'
  } catch {
    return 'normal'
  }
}

const getUrgencyConfig = (level: UrgencyLevel) => {
  switch (level) {
    case 'urgent':
      return {
        bg: 'bg-red-100',
        border: 'border-red-600',
        badge: '🔴 URGENTE',
        badgeClass: 'bg-red-600 text-white'
      }
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-500',
        badge: '🟡 Próximo',
        badgeClass: 'bg-yellow-500 text-white'
      }
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-400',
        badge: '🔵 Normal',
        badgeClass: 'bg-blue-400 text-white'
      }
  }
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return dateString
  }
}

const getCollectionRate = (recaudado: number, totalDeudas: number): number => {
  if (totalDeudas === 0) return 0
  return (recaudado / totalDeudas) * 100
}

const getMaxSaldo = (clientes: TopCliente[]): number => {
  if (clientes.length === 0) return 0
  return Math.max(...clientes.map(c => c.saldo_pendiente))
}

// 🔹 Mejora 2: Helper seguro para calcular porcentajes
const getSafePercentage = (value: number, total: number): number => {
  if (total === 0) return 0
  return (value / total) * 100
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [topClientes, setTopClientes] = useState<TopCliente[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      setFetchError('')
      try {
        const { data } = await api.get('/dashboard')
        setKpis(data.kpis)
        setTopClientes(data.topClientes)
        setAlertas(data.alertas)
      } catch (err) {
        const errorMsg = handleApiError(err, 'Error al cargar el dashboard')
        console.error('Error al cargar dashboard:', errorMsg)
        setFetchError(errorMsg)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // 🔹 Mejora 4: useMemo para evitar recálculos innecesarios
  const maxSaldo = useMemo(() => getMaxSaldo(topClientes), [topClientes])
  const collectionRate = useMemo(() => 
    kpis ? getCollectionRate(kpis.totalRecaudadoMes, kpis.totalMontoDeudas) : 0,
    [kpis]
  )

  // 🔹 Mejora 2: Porcentajes seguros
  const pendingPercentage = useMemo(() => 
    kpis ? getSafePercentage(kpis.totalMontoPendiente, kpis.totalMontoDeudas) : 0,
    [kpis]
  )

  const getBarTooltip = (saldo: number, max: number, clienteNombre: string): string => {
    if (max === 0) return `${clienteNombre}: 0% del total`
    const percentage = ((saldo / max) * 100).toFixed(1)
    return `${clienteNombre}: $${saldo.toLocaleString()} - ${percentage}% del total`
  }

  const handleVerDeuda = (alerta: Alerta) => {
    if (alerta.deuda_id) {
      navigate(`/deudas?deuda=${alerta.deuda_id}`)
    } else if (alerta.cliente_id) {
      navigate(`/deudas?cliente=${alerta.cliente_id}`)
    } else {
      navigate('/deudas')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-600">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold text-lg">Error al cargar el dashboard</p>
              <p className="text-sm mt-2">{fetchError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
          
          {kpis && (
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-xs text-gray-500">Recuperado</span>
              <span className="ml-2 text-lg font-bold text-green-600">
                {collectionRate.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="md:col-span-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-red-600 font-medium uppercase tracking-wide">Total Pendiente</p>
            {/* 🔹 Mejora 1: Safe navigation con fallback */}
            <p className="text-4xl md:text-5xl font-bold text-red-600 mt-2">
              ${kpis?.totalMontoPendiente?.toLocaleString() ?? '0'}
            </p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-red-400">Deudas por cobrar</p>
              {kpis && (
                <p className="text-xs text-gray-500">
                  {pendingPercentage.toFixed(1)}% del total
                </p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-green-600 font-medium uppercase tracking-wide">Recaudado este mes</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ${kpis?.totalRecaudadoMes?.toLocaleString() ?? '0'}
            </p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-green-400">Ingresos del período</p>
              <p className="text-xs font-medium text-green-500">
                +{collectionRate.toFixed(0)}% del total
              </p>
            </div>
          </div>
        </div>

        {/* KPIs secundarios */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-blue-600 font-medium">Total Clientes</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{kpis?.totalClientes ?? 0}</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-yellow-600 font-medium">Deudas Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{kpis?.deudasPendientes ?? 0}</p>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-red-600 font-medium">Deudas Vencidas</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{kpis?.deudasVencidas ?? 0}</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-green-600 font-medium">Deudas Pagadas</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{kpis?.deudasPagadas ?? 0}</p>
          </div>
        </div>

        {/* Sección principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top clientes con barras */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="border-b border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 text-lg">
                📊 Top clientes con mayor deuda
              </h2>
              <p className="text-xs text-gray-400 mt-1">Clientes que más deben</p>
            </div>
            <div className="p-5">
              {topClientes.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-sm">No hay datos de clientes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topClientes.map((c, i) => {
                    const porcentaje = maxSaldo ? (c.saldo_pendiente / maxSaldo) * 100 : 0
                    const tooltip = getBarTooltip(c.saldo_pendiente, maxSaldo, c.clientes.nombre)
                    const isHovered = hoveredBar === c.cliente_id
                    
                    return (
                      <div 
                        key={c.cliente_id} 
                        className="group"
                        onMouseEnter={() => setHoveredBar(c.cliente_id)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {i + 1}. {c.clientes.nombre}
                          </span>
                          <span className={`text-sm font-bold transition-colors ${isHovered ? 'text-red-700' : 'text-red-500'}`}>
                            ${Number(c.saldo_pendiente).toLocaleString()}
                          </span>
                        </div>
                        {/* 🔹 Mejora 5: Tooltip mejorado con div flotante */}
                        <div className="relative">
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-red-400 to-red-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                          {isHovered && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 animate-pulse">
                              {tooltip}
                              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Alertas con badges de urgencia */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="border-b border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 text-lg">
                ⚠️ Vencimientos próximos
              </h2>
              <p className="text-xs text-gray-400 mt-1">Próximos 7 días</p>
            </div>
            <div className="p-5">
              {alertas.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">No hay vencimientos próximos</p>
                  <p className="text-xs mt-1">Todas las deudas están al día</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alertas.map((a) => {
                    const urgencyLevel = getUrgencyLevel(a.fecha_vencimiento)
                    const urgencyConfig = getUrgencyConfig(urgencyLevel)
                    
                    return (
                      <div 
                        key={a.id} 
                        className={`${urgencyConfig.bg} border-l-4 ${urgencyConfig.border} rounded-r-lg p-4 hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-gray-800 text-sm">
                                {a.clientes.nombre}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {a.descripcion}
                              </span>
                              {/* 🔹 Mejora 3: Badge de urgencia */}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${urgencyConfig.badgeClass}`}>
                                {urgencyConfig.badge}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                              <span className="text-sm font-bold text-red-600">
                                ${Number(a.saldo_pendiente).toLocaleString()}
                              </span>
                              <span className="text-xs text-red-500">
                                📅 Vence: {formatDate(a.fecha_vencimiento)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleVerDeuda(a)}
                              className="text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              Ver deuda
                            </button>
                            <div className="text-red-500 text-xl">⚠️</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Datos actualizados en tiempo real
        </div>
      </div>
    </div>
  )
}