// frontend/src/features/analisis/components/ClientesMoraTable.tsx
import { H2, TextSmall } from '../../../components/ui/Typography'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'
import type { ClienteConMora } from '../types'

interface ClientesMoraTableProps {
  clientes: ClienteConMora[]
  subtitle?: string
}

const fmtMontoSimple = (monto: number, moneda: 'ARS' | 'USD'): string => {
  if (moneda === 'USD') {
    return `USD ${monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `$${Math.round(monto).toLocaleString('es-AR')}`
}

export function ClientesMoraTable({ clientes, subtitle }: ClientesMoraTableProps) {
  const { debeMostrarEquivalencia, cotizacion } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('analisis')

  if (!clientes.length) return null

  return (
    <div style={{ backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 12, overflow: 'hidden', flex: 1 }}>
      <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #2e3347', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconAlertTriangle size={18} style={{ color: '#fb923c' }} />
          <div>
            <H2 style={{ fontSize: 13 }}>Clientes con mayor mora activa</H2>
            {subtitle && (
              <p style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Cliente', 'Deuda base', 'Mora calc.', 'Total a pagar'].map((col, i) => (
                <th key={col} style={{
                  padding: '10px 16px', textAlign: i > 0 ? 'right' : 'left',
                  borderBottom: '0.5px solid #2e3347',
                }}>
                  <TextSmall style={{ textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    {col}
                  </TextSmall>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} style={{ borderBottom: '0.5px solid #1e2130' }}>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5' }}>{c.nombre}</span>
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                  <div>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>
                      {fmtMontoSimple(c.deuda_original, c.moneda)}
                    </span>
                    {mostrarEquivalencia && (
                      <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
                        {c.moneda === 'ARS'
                          ? fmtMontoSimple(c.deuda_original / cotizacion, 'USD')
                          : fmtMontoSimple(c.deuda_original * cotizacion, 'ARS')
                        }
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fb923c' }}>
                      {fmtMontoSimple(c.mora_acumulada, c.moneda)}
                    </span>
                    {mostrarEquivalencia && c.mora_acumulada > 0 && (
                      <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
                        {c.moneda === 'ARS'
                          ? fmtMontoSimple(c.mora_acumulada / cotizacion, 'USD')
                          : fmtMontoSimple(c.mora_acumulada * cotizacion, 'ARS')
                        }
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#34d399' }}>
                      {fmtMontoSimple(c.total, c.moneda)}
                    </span>
                    {mostrarEquivalencia && (
                      <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
                        {c.moneda === 'ARS'
                          ? fmtMontoSimple(c.total / cotizacion, 'USD')
                          : fmtMontoSimple(c.total * cotizacion, 'ARS')
                        }
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}