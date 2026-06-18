// frontend/src/features/deudas/components/DeudasTable.tsx
import { useState } from 'react'
import type { Deuda } from '../types'
import { useMoraConfig } from '../../../hooks/useMoraConfig'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'  // ← AGREGAR
import { calcularMora } from '../../../lib/calcularMora'
import { MontoCell } from '../../../components/shared/MontoCell'
import '../../../styles/table.css'

const AVATAR_COLORS = ['#1D9E75', '#378ADD', '#EF9F27', '#E24B4A', '#8b5cf6', '#ec4899']

const estadoRowClass: Record<string, string> = {
  pendiente: 'row-estado-pendiente',
  parcial:   'row-estado-parcial',
  vencida:   'row-estado-vencida',
  pagada:    'row-estado-pagada',
}

const estadoBadgeClass: Record<string, string> = {
  pendiente: 'status-badge status-pendiente',
  pagada:    'status-badge status-al-dia',
  vencida:   'status-badge status-vencida',
  parcial:   'status-badge status-parcial',
}

const estadoDotColor: Record<string, string> = {
  pendiente: '#EF9F27',
  parcial:   '#378ADD',
  vencida:   '#E24B4A',
  pagada:    '#1D9E75',
}

const estadoLabel: Record<string, string> = {
  pendiente: 'Pendiente',
  parcial:   'Parcial',
  vencida:   'Vencida',
  pagada:    'Al día',
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    })
  } catch { return dateString }
}

const fmtARS = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`
const fmtUSD = (n: number) =>
  `USD ${Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

type SortColumn    = 'cliente' | 'total' | 'pendiente' | 'fecha' | 'estado'
type SortDirection = 'asc' | 'desc'

interface DeudasTableProps {
  deudas: Deuda[]
  hayFiltrosActivos: boolean
  onLimpiarFiltros: () => void
  cotizacion?: number
}

export function DeudasTable({
  deudas, hayFiltrosActivos, onLimpiarFiltros, cotizacion = 1,
}: DeudasTableProps) {
  const [sortColumn,    setSortColumn]    = useState<SortColumn>('fecha')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const { config: moraConfig } = useMoraConfig()
  const { debeMostrarEquivalencia } = useMonedaConfig()  // ← AGREGAR
  const mostrarEquivalencia = debeMostrarEquivalencia('deudas')  // ← AGREGAR

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortColumn(column); setSortDirection('asc') }
  }

  const getSortValue = (deuda: Deuda, column: SortColumn): string | number => {
    switch (column) {
      case 'cliente':   return (deuda.clientes?.nombre ?? '').toLowerCase()
      case 'total':     return deuda.monto_total
      case 'pendiente': return deuda.saldo_pendiente
      case 'fecha':     return new Date(deuda.fecha_vencimiento).getTime()
      case 'estado':    return deuda.estado.toLowerCase()
      default:          return ''
    }
  }

  const getSortIcon = (column: SortColumn) =>
    sortColumn !== column ? ' ↕' : sortDirection === 'asc' ? ' ↑' : ' ↓'

  const sortedDeudas = [...deudas].sort((a, b) => {
    const aVal = getSortValue(a, sortColumn)
    const bVal = getSortValue(b, sortColumn)
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1  : -1
    return 0
  })

  if (deudas.length === 0) {
    if (hayFiltrosActivos) {
      return (
        <div className="table-empty-state">
          <p className="empty-icon">🔍</p>
          <p className="empty-title">Sin resultados</p>
          <p className="empty-description">Ninguna deuda coincide con los filtros.</p>
          <button className="empty-action" onClick={onLimpiarFiltros}>Limpiar filtros</button>
        </div>
      )
    }
    return (
      <div className="table-empty-state">
        <p className="empty-icon">📄</p>
        <p className="empty-title">Sin deudas registradas</p>
        <p className="empty-description">Creá la primera deuda para comenzar.</p>
      </div>
    )
  }

  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="dark-table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('cliente')}>
                CLIENTE{getSortIcon('cliente')}
              </th>
              <th>DESCRIPCIÓN</th>
              <th style={{ textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('total')}>
                TOTAL{getSortIcon('total')}
              </th>
              <th style={{ textAlign: 'right' }}>PAGADO</th>
              <th style={{ textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('pendiente')}>
                PENDIENTE{getSortIcon('pendiente')}
              </th>
              {moraConfig?.mora_activa && (
                <th className="col-mora" style={{ textAlign: 'right' }}>MORA</th>
              )}
              <th style={{ textAlign: 'center' }}>MONEDA</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('fecha')}>
                VENCIMIENTO{getSortIcon('fecha')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('estado')}>
                ESTADO{getSortIcon('estado')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDeudas.map((d, index) => {
              const moneda          = d.moneda as 'ARS' | 'USD'
              const cotizacionDeuda = Number(d.cotizacion) || cotizacion || 1

              const totalARS     = Number(d.monto_total)
              const totalUSD     = moneda === 'USD' ? Number(d.monto_original) : totalARS / cotizacion
              const pagadoARS    = Number(d.monto_pagado)
              const pagadoUSD    = moneda === 'USD' ? pagadoARS / cotizacionDeuda : pagadoARS / cotizacion
              const pendienteARS = Number(d.saldo_pendiente)
              const pendienteUSD = moneda === 'USD' ? pendienteARS / cotizacionDeuda : pendienteARS / cotizacion

              const mora                 = calcularMora(pendienteARS, d.fecha_vencimiento, d.estado, moraConfig)
              const moraOriginal         = moneda === 'USD' ? mora.montoMora / cotizacionDeuda : mora.montoMora
              const totalConMoraOriginal = moneda === 'USD' ? mora.totalConMora / cotizacionDeuda : mora.totalConMora

              const nombreCliente = d.clientes?.nombre ?? ''
              const inicial       = nombreCliente[0]?.toUpperCase() ?? '?'
              const avatarColor   = AVATAR_COLORS[index % AVATAR_COLORS.length]

              const rowClass = [
                estadoRowClass[d.estado] ?? '',
                mora.tieneMora && !estadoRowClass[d.estado] ? 'row-mora' : '',
              ].filter(Boolean).join(' ')

              return (
                <tr key={d.id} className={rowClass}>
                  {/* Cliente */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="table-avatar" style={{ backgroundColor: avatarColor }}>
                        {inicial}
                      </div>
                      <p className="table-cell-name">{d.clientes?.nombre ?? '—'}</p>
                    </div>
                  </td>

                  {/* Descripción */}
                  <td>
                    <span className="deuda-descripcion">{d.descripcion}</span>
                    {d.numero_factura && (
                      <span className="factura-numero">#{d.numero_factura}</span>
                    )}
                  </td>

                  {/* Total */}
                  <td style={{ textAlign: 'right' }}>
                    <span className={d.moneda === 'USD' ? 'table-monto-usd' : 'table-monto-ars'}>
                      <MontoCell moneda={moneda} montoARS={totalARS} montoUSD={totalUSD} seccion="deudas" />
                    </span>
                  </td>

                  {/* Pagado */}
                  <td style={{ textAlign: 'right' }}>
                    <span className="monto-pagado">
                      <MontoCell moneda={moneda} montoARS={pagadoARS} montoUSD={pagadoUSD} seccion="deudas" />
                    </span>
                  </td>

                  {/* Pendiente */}
                  <td style={{ textAlign: 'right' }} translate="no">
                    <span className={d.moneda === 'USD' ? 'table-monto-usd' : 'table-monto-ars'}>
                      <MontoCell moneda={moneda} montoARS={pendienteARS} montoUSD={pendienteUSD} seccion="deudas" />
                    </span>
                    {mora.tieneMora && (
                      <p className="mora-label">
                        + mora → {moneda === 'USD' ? fmtUSD(totalConMoraOriginal) : fmtARS(mora.totalConMora)}
                      </p>
                    )}
                  </td>

                  {/* Mora (columna condicional) - CORREGIDO con toggle */}
                  {moraConfig?.mora_activa && (
                    <td style={{ textAlign: 'right' }} translate="no">
                      {mora.tieneMora ? (
                        <div>
                          <p className="mora-label">
                            +{moneda === 'USD' ? fmtUSD(moraOriginal) : fmtARS(mora.montoMora)}
                          </p>
                          {mostrarEquivalencia && (
                            <p className="mora-detalle">
                              {moneda === 'USD' 
                                ? `≈ ${fmtARS(mora.montoMora)}` 
                                : `≈ ${fmtUSD(mora.montoMora / cotizacion)}`
                              }
                            </p>
                          )}
                          <p className="mora-descripcion">{mora.descripcion}</p>
                        </div>
                      ) : (
                        <span className="mora-detalle">—</span>
                      )}
                    </td>
                  )}

                  {/* Moneda */}
                  <td style={{ textAlign: 'center' }}>
                    <span translate="no" className={`moneda-badge ${moneda === 'USD' ? 'usd' : 'ars'}`}>
                      {moneda === 'USD' ? '🇺🇸 USD' : '🇦🇷 ARS'}
                    </span>
                  </td>

                  {/* Vencimiento */}
                  <td>
                    <p className="fecha-pago">{formatDate(d.fecha_vencimiento)}</p>
                    {mora.tieneMora && (
                      <p className="fecha-vencida">{mora.diasVencida}d vencida</p>
                    )}
                  </td>

                  {/* Estado */}
                  <td>
                    <div className={estadoBadgeClass[d.estado] ?? 'status-badge'}>
                      <span style={{
                        width: 6, height: 6,
                        borderRadius: '50%',
                        backgroundColor: estadoDotColor[d.estado] ?? '#94a3b8',
                        flexShrink: 0,
                      }} />
                      {estadoLabel[d.estado] ?? d.estado}
                    </div>
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