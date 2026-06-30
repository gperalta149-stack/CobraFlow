// frontend/src/features/deudas/pages/HistorialDeudas.tsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconDownload, IconReceipt } from '@tabler/icons-react'
import { SearchInput } from '../../../components/ui/SearchInput'
import { PaginationBar } from '../../../components/shared/PaginationBar'
import { deudasApi } from '../services/deudasApi'
import type { Deuda } from '../types'

const ITEMS_PER_PAGE = 15

const fmtARS = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`
const fmtUSD = (n: number) => `USD ${Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    })
  } catch { return dateString }
}

export default function HistorialDeudas() {
  const navigate = useNavigate()
  const [deudas, setDeudas] = useState<Deuda[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchHistorial = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await deudasApi.getHistorial()
        setDeudas(data)
      } catch {
        setError('Error al cargar el historial')
      } finally {
        setLoading(false)
      }
    }
    fetchHistorial()
  }, [])

  const filtrado = useMemo(() => {
    if (!searchTerm) return deudas
    const t = searchTerm.toLowerCase()
    return deudas.filter(d =>
      d.clientes?.nombre?.toLowerCase().includes(t) ||
      d.descripcion?.toLowerCase().includes(t) ||
      d.numero_factura?.toLowerCase().includes(t)
    )
  }, [deudas, searchTerm])

  const paginado = useMemo(() =>
    filtrado.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filtrado, currentPage]
  )

  const totalARS = useMemo(() =>
    deudas.filter(d => d.moneda === 'ARS').reduce((s, d) => s + Number(d.monto_total), 0),
    [deudas]
  )
  const totalUSD = useMemo(() =>
    deudas.filter(d => d.moneda === 'USD').reduce((s, d) => s + Number(d.monto_original ?? 0), 0),
    [deudas]
  )

  const exportarCSV = () => {
    const h = ['Fecha pago', 'Cliente', 'Descripción', 'Factura', 'Monto', 'Moneda']
    const rows = filtrado.map(d => [
      formatDate(d.updated_at ?? d.fecha_vencimiento),
      d.clientes?.nombre ?? '',
      d.descripcion,
      d.numero_factura ?? '',
      d.moneda === 'USD' ? d.monto_original ?? d.monto_total : d.monto_total,
      d.moneda,
    ])
    const csv = [h, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `historial_deudas_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="dark-container">
        <div className="animate-pulse space-y-4">
          <div className="h-9 w-40 bg-[#242938] rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map(i => <div key={i} className="h-24 bg-[#242938] rounded-xl" />)}
          </div>
          <div className="h-96 bg-[#242938] rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dark-container">
        <div className="bg-red-900/30 border border-red-500 rounded-xl p-8 text-center">
          <p className="font-semibold text-red-400 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dark-container">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button
          onClick={() => navigate('/deudas')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', backgroundColor: '#242938',
            border: '0.5px solid #2e3347', borderRadius: 8,
            color: '#94a3b8', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <IconArrowLeft size={16} /> Volver a Deudas
        </button>
        <button
          onClick={exportarCSV}
          disabled={!filtrado.length}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', backgroundColor: '#1a1d2e',
            border: '0.5px solid #2e3347', borderRadius: 8,
            color: '#94a3b8', fontSize: 13, fontWeight: 500,
            cursor: filtrado.length ? 'pointer' : 'not-allowed',
            opacity: filtrado.length ? 1 : 0.5,
          }}
        >
          <IconDownload size={16} /> Exportar CSV
        </button>
      </div>

      {/* Título */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Historial de cobranzas</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          Registro completo de deudas saldadas — uso contable y de auditoría
        </p>
      </div>

      {/* Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div style={{ backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 12, padding: '16px 20px' }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Total histórico cobrado
          </p>
          <p style={{ fontSize: 20, fontWeight: 600, color: '#34d399' }}>
            {totalARS > 0 && fmtARS(totalARS)}
            {totalARS > 0 && totalUSD > 0 && <span style={{ color: '#6b7280', margin: '0 8px' }}>·</span>}
            {totalUSD > 0 && fmtUSD(totalUSD)}
          </p>
        </div>
        <div style={{ backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 12, padding: '16px 20px' }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Deudas saldadas
          </p>
          <p style={{ fontSize: 20, fontWeight: 600, color: '#f0f2f5' }}>{deudas.length}</p>
        </div>
      </div>

      {/* Buscador */}
      <div style={{ marginBottom: 16 }}>
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por cliente, descripción o factura..." />
      </div>

      {/* Tabla */}
      {paginado.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <IconReceipt size={32} style={{ color: '#4a5568', marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: '#94a3b8' }}>
            {searchTerm ? 'Sin resultados para esa búsqueda' : 'Todavía no hay deudas saldadas'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Cliente</th>
                  <th style={thStyle}>Descripción</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Monto</th>
                  <th style={thStyle}>Fecha de pago</th>
                </tr>
              </thead>
              <tbody>
                {paginado.map((d, i) => (
                  <tr
                    key={d.id}
                    style={{ borderBottom: i < paginado.length - 1 ? '0.5px solid #1e2334' : 'none' }}
                  >
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 600, color: '#f0f2f5' }}>{d.clientes?.nombre ?? '—'}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#94a3b8' }}>{d.descripcion}</span>
                      {d.numero_factura && (
                        <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 8 }}>#{d.numero_factura}</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <span style={{ fontWeight: 600, color: '#34d399' }}>
                        {d.moneda === 'USD' ? fmtUSD(d.monto_original ?? d.monto_total) : fmtARS(d.monto_total)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#94a3b8' }}>{formatDate(d.updated_at ?? d.fecha_vencimiento)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtrado.length > ITEMS_PER_PAGE && (
            <PaginationBar
              totalItems={filtrado.length}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
              itemLabel="deuda"
            />
          )}
        </>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px', fontSize: 10, fontWeight: 600,
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em',
  textAlign: 'left', borderBottom: '0.5px solid #2e3347',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 16px', fontSize: 13,
}