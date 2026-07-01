// frontend/src/features/deudas/components/DeudasTable.tsx
import { useState, useMemo } from 'react'
import type { Deuda } from '../types'
import { useMoraConfig } from '../../../hooks/useMoraConfig'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'
import { calcularMora } from '../../../lib/calcularMora'
import { MontoCell } from '../../../components/shared/MontoCell'
import { PaginationBar } from '../../../components/shared/PaginationBar'
import '../../../styles/table.css'

const AVATAR_COLORS = ['#1D9E75', '#378ADD', '#EF9F27', '#E24B4A', '#8b5cf6', '#ec4899']

const estadoRowClass: Record<string, string> = {
  pendiente: 'row-estado-pendiente',
  parcial:   'row-estado-parcial',
  vencida:   'row-estado-vencida',
  pagada:    'row-estado-pagada',
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
  currentPage?: number
  itemsPerPage?: number
  totalItems?: number
  onPageChange?: (page: number) => void
}

export function DeudasTable({
  deudas,
  hayFiltrosActivos,
  onLimpiarFiltros,
  cotizacion = 1,
  currentPage = 1,
  itemsPerPage = 10,
  totalItems,
  onPageChange,
}: DeudasTableProps) {
  const [sortColumn,    setSortColumn]    = useState<SortColumn>('fecha')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const { config: moraConfig } = useMoraConfig()
  const { debeMostrarEquivalencia } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('deudas')

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

  // ── Indicador de cliente con múltiples deudas ──────────────────────────
  const conteoClientes = useMemo(() => {
    const map = new Map<string, number>()
    for (const d of sortedDeudas) {
      const key = d.cliente_id ?? d.clientes?.nombre ?? ''
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return map
  }, [sortedDeudas])

  const idxPrimeraAparicion = useMemo(() => {
    const vistos = new Set<string>()
    const map = new Map<string, boolean>()
    for (const d of sortedDeudas) {
      const key = d.cliente_id ?? d.clientes?.nombre ?? ''
      const esPrimera = !vistos.has(key)
      vistos.add(key)
      map.set(d.id, esPrimera)
    }
    return map
  }, [sortedDeudas])

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
    <div>
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
                <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => handleSort('estado')}>
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

                const mora = calcularMora(
                  pendienteARS, 
                  d.fecha_vencimiento, 
                  d.estado, 
                  d.monto_mora_acumulada,
                  moraConfig
                )
                const moraOriginal         = moneda === 'USD' ? mora.montoMora / cotizacionDeuda : mora.montoMora
                const totalConMoraOriginal = moneda === 'USD' ? mora.totalConMora / cotizacionDeuda : mora.totalConMora

                const nombreCliente = d.clientes?.nombre ?? ''
                const inicial       = nombreCliente[0]?.toUpperCase() ?? '?'

                const clienteKey  = d.cliente_id ?? nombreCliente
                const colorIndex  = Array.from(conteoClientes.keys()).indexOf(clienteKey)
                const avatarColor = AVATAR_COLORS[(colorIndex >= 0 ? colorIndex : index) % AVATAR_COLORS.length]

                const cantidadDeudas = conteoClientes.get(clienteKey) ?? 1
                const tieneMultiples  = cantidadDeudas > 1
                const esPrimeraDelGrupo = idxPrimeraAparicion.get(d.id) ?? true

                const rowClass = [
                  estadoRowClass[d.estado] ?? '',
                  mora.tieneMora && !estadoRowClass[d.estado] ? 'row-mora' : '',
                  tieneMultiples ? 'row-cliente-relacionado' : '',
                ].filter(Boolean).join(' ')

                // Función para obtener la etiqueta del estado
                const getEstadoLabel = (estado: string) => {
                  switch (estado) {
                    case 'pendiente': return 'Pendiente'
                    case 'parcial': return 'Parcial'
                    case 'vencida': return 'Vencida'
                    case 'pagada': return 'Pagada'
                    default: return estado
                  }
                }

                return (
                  <tr key={d.id} className={rowClass}>
                    {/* Cliente */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          className="table-avatar"
                          style={{
                            backgroundColor: avatarColor,
                            opacity: tieneMultiples && !esPrimeraDelGrupo ? 0.45 : 1,
                          }}
                        >
                          {inicial}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: tieneMultiples && !esPrimeraDelGrupo ? 0.6 : 1 }}>
                          <p className="table-cell-name" style={{ margin: 0 }}>{nombreCliente || '—'}</p>
                          {tieneMultiples && esPrimeraDelGrupo && (
                            <span style={{
                              fontSize: 9, fontWeight: 700,
                              color: '#378ADD',
                              background: 'rgba(55,138,221,0.15)',
                              border: '0.5px solid rgba(55,138,221,0.3)',
                              padding: '1px 6px', borderRadius: 8,
                              whiteSpace: 'nowrap',
                            }}>
                              ×{cantidadDeudas}
                            </span>
                          )}
                        </div>
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

                    {/* Mora */}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <p className="fecha-pago" style={{ margin: 0 }}>{formatDate(d.fecha_vencimiento)}</p>
                      </div>
                      {mora.tieneMora ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: 10.5, fontWeight: 600,
                          color: '#E24B4A',
                          background: 'rgba(226,75,74,0.12)',
                          border: '0.5px solid rgba(226,75,74,0.25)',
                          padding: '2px 7px', borderRadius: 8,
                          marginTop: 4,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#E24B4A' }} />
                          {mora.diasVencida}d vencida
                        </span>
                      ) : d.estado !== 'pagada' && (
                        (() => {
                          const dias = Math.ceil((new Date(d.fecha_vencimiento).getTime() - Date.now()) / 86400000)
                          if (dias < 0) return null
                          if (dias <= 7) {
                            return (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                fontSize: 10.5, fontWeight: 600,
                                color: '#EF9F27',
                                background: 'rgba(239,159,39,0.12)',
                                border: '0.5px solid rgba(239,159,39,0.25)',
                                padding: '2px 7px', borderRadius: 8,
                                marginTop: 4,
                              }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#EF9F27' }} />
                                {dias === 0 ? 'Vence hoy' : `en ${dias}d`}
                              </span>
                            )
                          }
                          return null
                        })()
                      )}
                    </td>

                    {/* ✅ ESTADO - Agregado */}
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-badge status-${d.estado}`}>
                        {getEstadoLabel(d.estado)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Paginación ─────────────────────────────────────────── */}
      {onPageChange && totalItems && totalItems > itemsPerPage && (
        <PaginationBar
          totalItems={totalItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          itemLabel="deuda"
        />
      )}
    </div>
  )
}