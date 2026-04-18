import type { KPIs } from '../types'

interface StatsCardsProps {
  kpis: KPIs | null
  collectionRate: number
  pendingPercentage: number
}

export function StatsCards({ kpis, collectionRate, pendingPercentage }: StatsCardsProps) {
  return (
    <>
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="md:col-span-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-red-600 font-medium uppercase tracking-wide">Total Pendiente</p>
          <p className="text-4xl md:text-5xl font-bold text-red-600 mt-2">
            ${kpis?.totalMontoPendiente?.toLocaleString() ?? '0'}
          </p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-red-400">Deudas por cobrar</p>
            {kpis && (
              <p className="text-xs text-gray-500">{pendingPercentage.toFixed(1)}% del total</p>
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
            <p className="text-xs font-medium text-green-500">+{collectionRate.toFixed(0)}% del total</p>
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
    </>
  )
}