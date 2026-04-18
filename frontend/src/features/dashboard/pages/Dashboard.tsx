import { useDashboard } from '../hooks/useDashboard'
import { StatsCards } from '../components/StatsCards'
import { TopClientesChart } from '../components/TopClientesChart'
import { AlertasList } from '../components/AlertasList'

export default function Dashboard() {
  const { kpis, topClientes, alertas, loading, error, maxSaldo, collectionRate, pendingPercentage } = useDashboard()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse"><div className="h-4 w-24 bg-gray-200 rounded mb-2"></div><div className="h-8 w-32 bg-gray-200 rounded"></div></div>
            <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse"><div className="h-4 w-24 bg-gray-200 rounded mb-2"></div><div className="h-8 w-32 bg-gray-200 rounded"></div></div>
            <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse"><div className="h-4 w-24 bg-gray-200 rounded mb-2"></div><div className="h-8 w-32 bg-gray-200 rounded"></div></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="font-semibold text-lg text-red-600">Error al cargar el dashboard</p>
          <p className="text-sm text-red-500 mt-2">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
          {kpis && (
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-xs text-gray-500">Recuperado</span>
              <span className="ml-2 text-lg font-bold text-green-600">{collectionRate.toFixed(1)}%</span>
            </div>
          )}
        </div>

        <StatsCards kpis={kpis} collectionRate={collectionRate} pendingPercentage={pendingPercentage} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopClientesChart clientes={topClientes} maxSaldo={maxSaldo} />
          <AlertasList alertas={alertas} />
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">Datos actualizados en tiempo real</div>
      </div>
    </div>
  )
}