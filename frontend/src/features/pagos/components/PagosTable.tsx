// frontend/src/features/pagos/components/PagosTable.tsx
import type { Pago } from '../types'
import { generarComprobantePago } from '../../../utils/pdfGenerator'
import { IconFileText } from '@tabler/icons-react'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'
import '../../../styles/table.css'

const AVATAR_COLORS = ['#1D9E75', '#378ADD', '#EF9F27', '#E24B4A', '#8b5cf6', '#ec4899']

const metodosLabel: Record<string, string> = {
  efectivo:       'Efectivo',
  transferencia:  'Transferencia',
  tarjeta_credito:'T. Crédito',
  tarjeta_debito: 'T. Débito',
  cheque:         'Cheque',
  mercado_pago:   'Mercado Pago',
  paypal:         'PayPal',
  cripto:         'Cripto',
  otro:           'Otro',
}

const metodosEmoji: Record<string, string> = {
  efectivo:       '💵',
  transferencia:  '🏦',
  tarjeta_credito:'💳',
  tarjeta_debito: '💳',
  cheque:         '📄',
  mercado_pago:   '💙',
  paypal:         '🅿️',
  cripto:         '₿',
  otro:           '📦',
}

const formatDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  } catch { return d }
}

interface PagosTableProps { pagos: Pago[] }

export function PagosTable({ pagos }: PagosTableProps) {
  const { formatearMonto, debeMostrarEquivalencia } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('pagos')

  const handleComprobante = async (pago: Pago) => {
    try { await generarComprobantePago(pago, pago.deudas, pago.clientes) }
    catch { alert('Error al generar el comprobante') }
  }

  if (!pagos.length) return (
    <div className="table-empty-state">
      <p className="empty-icon">💳</p>
      <p className="empty-title">Sin pagos registrados</p>
      <p className="empty-description">Los pagos aparecerán aquí una vez registrados.</p>
    </div>
  )

  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="dark-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Deuda</th>
              <th style={{ textAlign: 'right' }}>Monto</th>
              <th style={{ textAlign: 'center' }}>Moneda</th>
              <th>Método</th>
              <th>Fecha</th>
              <th style={{ textAlign: 'center', width: 120 }}>Comprobante</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p, index) => {
              const esUSD       = p.moneda === 'USD'
              const montoOrig   = p.monto_original ?? p.monto
              const cotizacion  = p.cotizacion ?? 1
              const inicial     = p.clientes?.nombre?.[0]?.toUpperCase() ?? '?'
              const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length]

              const montoEnUSD = esUSD ? montoOrig : montoOrig / cotizacion
              const montoEnARS = esUSD ? montoOrig * cotizacion : montoOrig
              const { principal, secundario } = formatearMonto(montoEnARS, montoEnUSD, p.moneda, 'pagos')

              return (
                <tr key={p.id}>
                  {/* Cliente */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="table-avatar" style={{ backgroundColor: avatarColor }}>
                        {inicial}
                      </span>
                      <span className="table-cell-name">{p.clientes?.nombre ?? '—'}</span>
                    </div>
                  </td>

                  {/* Deuda */}
                  <td>
                    <span className="deuda-descripcion">{p.deudas?.descripcion ?? '—'}</span>
                    {p.deudas?.numero_factura && (
                      <span className="factura-numero">#{p.deudas.numero_factura}</span>
                    )}
                  </td>

                  {/* Monto */}
                  <td style={{ textAlign: 'right' }} translate="no">
                    <p className={esUSD ? 'table-monto-usd' : 'table-monto-ars'}>{principal}</p>
                    {secundario && mostrarEquivalencia && (
                      <p className="monto-equivalencia">{secundario}</p>
                    )}
                  </td>

                  {/* Moneda */}
                  <td style={{ textAlign: 'center' }}>
                    <span translate="no" className={`moneda-badge ${esUSD ? 'usd' : 'ars'}`}>
                      {esUSD ? '🇺🇸 USD' : '🇦🇷 ARS'}
                    </span>
                  </td>

                  {/* Método */}
                  <td>
                    {p.metodo_pago ? (
                      <span className="metodo-badge">
                        {metodosEmoji[p.metodo_pago]}
                        {metodosLabel[p.metodo_pago] ?? p.metodo_pago}
                      </span>
                    ) : (
                      <span className="table-cell-empty">—</span>
                    )}
                  </td>

                  {/* Fecha */}
                  <td>
                    <p className="fecha-pago">{formatDate(p.fecha_pago)}</p>
                    {p.observaciones && (
                      <p className="pago-observacion">{p.observaciones}</p>
                    )}
                  </td>

                  {/* Comprobante */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn-comprobante"
                      onClick={() => handleComprobante(p)}
                    >
                      <IconFileText size={13} />
                      Comprobante
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}