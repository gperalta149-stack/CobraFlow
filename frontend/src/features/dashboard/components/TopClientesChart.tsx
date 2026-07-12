// frontend/src/features/dashboard/components/TopClientesChart.tsx
import { IconUsers } from '@tabler/icons-react'
import type { TopCliente } from '../types'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'

interface TopClientesChartProps {
  clientes: TopCliente[]
  maxSaldo: number
}

const BAR_COLORS = ['#E24B4A', '#D85A30', '#EF9F27', '#1D9E75', '#378ADD']

const formatFechaCorta = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
  } catch { return iso }
}

export function TopClientesChart({ clientes, maxSaldo }: TopClientesChartProps) {
  const { formatearMonto, debeMostrarEquivalencia } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('dashboard')
  
  const clientesMostrar = clientes

  if (clientesMostrar.length === 0) {
    return (
      <div className="metric-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Sin datos de clientes</p>
      </div>
    )
  }

  return (
    <div className="metric-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="metric-card-header-spaced">
        <div className="metric-card-header" style={{ marginBottom: 0 }}>
          <div className="metric-card-icon" style={{ background: '#E24B4A20', color: '#E24B4A' }}>
            <IconUsers size={16} />
          </div>
          <div>
            <p className="metric-card-title">Top clientes</p>
            <p className="metric-card-subtitle">Mayor saldo pendiente</p>
          </div>
        </div>
      </div>

      <div>
        <ul style={{ listStyle: 'none', margin: 0, padding: '8px 20px' }}>
          {clientesMostrar.map((c, index) => {
            const totalUsd = c.saldo_pendiente_usd + (c.mora_acumulada_usd ?? 0)
            const pct = maxSaldo > 0 ? (totalUsd / maxSaldo) * 100 : 0
            const color = BAR_COLORS[index % BAR_COLORS.length]
            const moneda = c.moneda as 'ARS' | 'USD'
            const { principal, secundario } = formatearMonto(
              c.saldo_pendiente + (c.mora_acumulada ?? 0),
              totalUsd,
              moneda,
              'dashboard'
            )

            const tieneVencidas = c.max_dias_vencido > 0
            let badgeTexto: string
            let badgeColor: string
            if (tieneVencidas) {
              badgeTexto = `${c.max_dias_vencido}d vencido`
              badgeColor = '#E24B4A'
            } else if (c.proximo_vencimiento) {
              badgeTexto = `Vence ${formatFechaCorta(c.proximo_vencimiento)}`
              badgeColor = '#6b7280'
            } else {
              badgeTexto = 'Al día'
              badgeColor = '#34d399'
            }

            return (
              <li
                key={c.cliente_id}
                style={{
                  padding: '14px 0',
                  borderBottom: index < clientesMostrar.length - 1 ? '0.5px solid #1e2130' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#4a5568', width: 20 }}>
                      {index + 1}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5' }}>
                      {c.clientes.nombre}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      background: `${badgeColor}20`, color: badgeColor,
                      padding: '2px 8px', borderRadius: 10,
                    }}>
                      {badgeTexto}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24' }}>{principal}</div>
                    {mostrarEquivalencia && secundario && (
                      <div style={{ fontSize: 10, color: '#6b7280' }}>{secundario}</div>
                    )}
                  </div>
                </div>
                <div style={{ marginLeft: 30, background: '#1a1d2e', borderRadius: 4, height: 6 }}>
                  <div style={{
                    width: `${pct}%`,
                    height: 6,
                    borderRadius: 4,
                    backgroundColor: color,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}