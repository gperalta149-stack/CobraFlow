import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

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
  descripcion: string
  fecha_vencimiento: string
  saldo_pendiente: number
  clientes: { nombre: string }
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [topClientes, setTopClientes] = useState<TopCliente[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard')
        setKpis(data.kpis)
        setTopClientes(data.topClientes)
        setAlertas(data.alertas)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return (
    <div>
      <Navbar />
      <div className="p-6 text-center text-gray-500">Cargando...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Control</h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Total Clientes</p>
            <p className="text-3xl font-bold text-blue-600">{kpis?.totalClientes}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Monto Pendiente</p>
            <p className="text-3xl font-bold text-red-500">${kpis?.totalMontoPendiente.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Recaudado este mes</p>
            <p className="text-3xl font-bold text-green-500">${kpis?.totalRecaudadoMes.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Deudas Pendientes</p>
            <p className="text-3xl font-bold text-yellow-500">{kpis?.deudasPendientes}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Deudas Vencidas</p>
            <p className="text-3xl font-bold text-red-600">{kpis?.deudasVencidas}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Deudas Pagadas</p>
            <p className="text-3xl font-bold text-green-600">{kpis?.deudasPagadas}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top clientes */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-bold text-gray-700 mb-3">Top clientes con mayor deuda</h2>
            {topClientes.length === 0 ? (
              <p className="text-gray-400 text-sm">Sin datos</p>
            ) : (
              <ul className="space-y-2">
                {topClientes.map((c, i) => (
                  <li key={c.cliente_id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{i + 1}. {c.clientes.nombre}</span>
                    <span className="text-sm font-bold text-red-500">${Number(c.saldo_pendiente).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Alertas */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-bold text-gray-700 mb-3">⚠️ Vencimientos próximos 7 días</h2>
            {alertas.length === 0 ? (
              <p className="text-gray-400 text-sm">Sin vencimientos próximos</p>
            ) : (
              <ul className="space-y-2">
                {alertas.map((a) => (
                  <li key={a.id} className="text-sm">
                    <span className="font-medium">{a.clientes.nombre}</span> - {a.descripcion}
                    <span className="text-red-500 ml-2">${Number(a.saldo_pendiente).toLocaleString()}</span>
                    <span className="text-gray-400 ml-2">Vence: {a.fecha_vencimiento}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}