// frontend/src/features/dashboard/pages/Dashboard.tsx
import { useDashboard } from '../hooks/useDashboard'
import { StatsCards } from '../components/StatsCards'
import { AlertasList } from '../components/AlertasList'
import { UltimosPagos } from '../components/UltimosPagos'
import { TopClientesChart } from '../components/TopClientesChart'
import { ClienteMayorRiesgoCard } from '../components/ActionCards'

export default function Dashboard() {
  const {
    kpis,
    alertas,
    deudasVencidas,
    ultimosPagos,
    topClientes,
    clienteMayorRiesgo,
    loading,
    error,
  } = useDashboard()

  const maxSaldo = topClientes.length > 0
    ? Math.max(...topClientes.map(c => c.saldo_pendiente_usd))
    : 0

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: '#242938', borderRadius: 12, height: 110, opacity: 0.5 }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: '#242938', borderRadius: 12, height: 400, opacity: 0.5 }} />
          <div style={{ background: '#242938', borderRadius: 12, height: 400, opacity: 0.5 }} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ background: '#242938', border: '0.5px solid #E24B4A40', borderRadius: 12, padding: 32, textAlign: 'center', maxWidth: 360 }}>
          <p style={{ fontWeight: 600, color: '#E24B4A', marginBottom: 8 }}>Error al cargar el panel</p>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#E24B4A', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', padding: '24px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Fila 1: 4 cards métricas */}
        <StatsCards kpis={kpis} />

        {/* Fila 2: Últimos pagos (2/3) + Mayor riesgo (1/3) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 12,
          marginBottom: 12,
          alignItems: 'stretch',
        }}>
          <UltimosPagos pagos={ultimosPagos} />
          <ClienteMayorRiesgoCard cliente={clienteMayorRiesgo} />
        </div>

        {/* Fila 3: Top clientes + Atención inmediata */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' }}>
          <TopClientesChart clientes={topClientes} maxSaldo={maxSaldo} />
          <AlertasList alertas={alertas} deudasVencidas={deudasVencidas} />
        </div>

      </div>
    </div>
  )
}