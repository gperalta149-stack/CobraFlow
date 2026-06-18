// frontend/src/features/pagos/pages/Pagos.tsx
import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { usePagos } from '../hooks/usePagos'
import { usePagoForm } from '../hooks/usePagoForm'
import { usePagosMetrics } from '../hooks/usePagosMetrics'
import { PagoForm } from '../components/PagoForm'
import { PagosTable } from '../components/PagosTable'
import { PagosHeader } from '../components/PagosHeader'
import { PagosMetrics } from '../components/PagosMetrics'
import { ClienteSearch } from '../components/ClienteSearch'
import { SlidePanel } from '../../../components/shared/SlidePanel'
import { PaginationBar } from '../../../components/shared/PaginationBar'
import { EmptyState } from '../../../components/shared/EmptyState'
import { Button } from '../../../components/ui/Button'
import { generarReportePagos } from '../../../utils/pdfGenerator'
import { clientesApi } from '../../clientes/services/clientesApi'
import { metodosLabel, metodosEmoji } from '../constants/metodos'
import type { Cliente } from '../../clientes/types'
import { IconCash, IconX } from '@tabler/icons-react'
import { DollarSign } from 'lucide-react'

const ITEMS_PER_PAGE = 5
type FiltroPeriodo = 'todos' | 'hoy' | '7dias' | 'mes'
type FiltroMoneda  = 'todos' | 'ARS' | 'USD'
type FiltroMetodo  = 'todos' | 'efectivo' | 'transferencia' | 'tarjeta_credito' | 'tarjeta_debito' | 'cheque' | 'mercado_pago' | 'otro'

function PagosPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`pagos-pill${active ? ' is-active' : ''}`}>{children}</button>
}

export default function Pagos() {
  const location = useLocation()
  const { pagos, deudas, loading, error, refetchData, loadData } = usePagos()
  const { showForm, form, error: formError, isSubmitting, deudaSeleccionada, cotizacionActual, cargandoCotizacion, handleChange, handleMonedaPagoChange, handleSubmit, handleCancel, openForm } = usePagoForm({ deudas, onSuccess: refetchData })

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [buscarCliente, setBuscar] = useState('')
  const [clienteSelected, setClienteSel] = useState('')
  const [mostrarSug, setMostrarSug] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filtroPeriodo, setPeriodo] = useState<FiltroPeriodo>('todos')
  const [filtroMoneda, setMoneda] = useState<FiltroMoneda>('todos')
  const [filtroMetodo, setMetodo] = useState<FiltroMetodo>('todos')

  useEffect(() => { if (showForm) handleCancel() }, [location.state?.reset])
  useEffect(() => { clientesApi.getAll().then(({ data }) => setClientes(data)).catch(console.error) }, [])
  useEffect(() => { setCurrentPage(1) }, [filtroPeriodo, filtroMoneda, filtroMetodo, clienteSelected])

  const pagosFiltrados = useMemo(() => {
    const ahora = new Date()
    const hoy   = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
    const hace7 = new Date(hoy); hace7.setDate(hace7.getDate() - 7)
    const mes   = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    return [...pagos].filter(p => {
      if (clienteSelected) { const c = clientes.find(c => c.id === clienteSelected); if (p.clientes?.nombre !== `${c?.nombre} ${c?.apellido}`.trim()) return false }
      const f = new Date(p.fecha_pago)
      if (filtroPeriodo === 'hoy'   && f < hoy)   return false
      if (filtroPeriodo === '7dias' && f < hace7)  return false
      if (filtroPeriodo === 'mes'   && f < mes)    return false
      if (filtroMoneda !== 'todos'  && p.moneda !== filtroMoneda) return false
      if (filtroMetodo !== 'todos'  && p.metodo_pago !== filtroMetodo) return false
      return true
    }).sort((a, b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())
  }, [pagos, clienteSelected, clientes, filtroPeriodo, filtroMoneda, filtroMetodo])

  const clientesFiltrados = useMemo(() => {
    if (!buscarCliente.trim()) return []
    const q = buscarCliente.toLowerCase()
    return clientes.filter(c => `${c.nombre} ${c.apellido}`.toLowerCase().includes(q) || c.dni?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.empresa?.toLowerCase().includes(q)).slice(0, 6)
  }, [buscarCliente, clientes])

  const metrics = usePagosMetrics(pagos, pagosFiltrados)
  const metodosDisp = useMemo(() => Array.from(new Set(pagos.map(p => p.metodo_pago).filter(Boolean))) as FiltroMetodo[], [pagos])
  const hayFiltros = filtroPeriodo !== 'todos' || filtroMoneda !== 'todos' || filtroMetodo !== 'todos' || !!clienteSelected
  const pagosPaginados = useMemo(() => pagosFiltrados.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [pagosFiltrados, currentPage])

  const limpiarCliente = () => { setClienteSel(''); setBuscar(''); setMostrarSug(false) }
  const limpiarTodo    = () => { limpiarCliente(); setPeriodo('todos'); setMoneda('todos'); setMetodo('todos') }

  const exportCSV = () => {
    if (!pagosFiltrados.length) return
    const h = ['Fecha','Cliente','Deuda','Monto','Moneda','Monto ARS','Método','Observaciones']
    const r = pagosFiltrados.map(p => [new Date(p.fecha_pago).toLocaleDateString('es-AR'), p.clientes?.nombre ?? '', p.deudas?.descripcion ?? '', p.monto_original ?? p.monto, p.moneda, p.monto, p.metodo_pago ? (metodosLabel[p.metodo_pago] ?? p.metodo_pago) : '', p.observaciones ?? ''])
    const csv = [h, ...r].map(row => row.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `pagos_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }

  const exportPDF = async () => {
    if (!pagosFiltrados.length) return
    try { await generarReportePagos(pagosFiltrados) } catch { alert('Error al generar el reporte') }
  }

  if (loading && !pagos.length) return (
    <div className="dark-container animate-pulse space-y-4">
      <div className="flex justify-end gap-3 mb-6">{[1,2,3].map(i => <div key={i} className="h-9 w-28 bg-[#242938] rounded-lg" />)}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{[1,2,3,4].map(i => <div key={i} className="h-28 bg-[#242938] rounded-xl" />)}</div>
      <div className="h-12 bg-[#242938] rounded-xl" /><div className="h-96 bg-[#242938] rounded-xl" />
    </div>
  )

  if (error && !pagos.length) return (
    <div className="dark-container">
      <div className="bg-red-900/30 border border-red-500 rounded-xl p-8 text-center">
        <p className="font-semibold text-red-400 text-lg mb-2">Error al cargar los datos</p>
        <p className="text-sm text-gray-400 mb-4">{error}</p>
        <button onClick={loadData} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">Reintentar</button>
      </div>
    </div>
  )

  return (
    <div className="dark-container">
      <PagosHeader disabled={!pagosFiltrados.length} onExportCSV={exportCSV} onExportPDF={exportPDF} onNuevoPago={openForm} />

      <PagosMetrics
        totalARS={metrics.totalARS} totalUSD={metrics.totalUSD} totalFiltrados={pagosFiltrados.length}
        mesARS={metrics.mesARS} mesUSD={metrics.mesUSD}
        variacionARS={metrics.variacionARS} mesAnteriorNombre={metrics.mesAnteriorNombre}
        ultimoPago={metrics.ultimoPago} ultimoPagoARS={metrics.ultimoPagoARS} ultimoPagoUSD={metrics.ultimoPagoUSD}
      />

      <div className="pagos-filter-panel">
        <ClienteSearch
          value={buscarCliente} selected={clienteSelected} sugerencias={clientesFiltrados} mostrar={mostrarSug}
          onChange={v => { setBuscar(v); setMostrarSug(true); if (!v) setClienteSel('') }}
          onSelect={c => { setClienteSel(c.id); setBuscar(`${c.nombre} ${c.apellido}`); setMostrarSug(false) }}
          onClear={limpiarCliente} onFocus={() => setMostrarSug(true)} onBlur={() => setTimeout(() => setMostrarSug(false), 150)}
        />
        <div className="pagos-filter-divider" />
        <div className="pagos-filter-group">
          <span className="pagos-filter-group-label">Período</span>
          <div className="pagos-filter-pills">
            {(['todos','hoy','7dias','mes'] as FiltroPeriodo[]).map(v => (
              <PagosPill key={v} active={filtroPeriodo === v} onClick={() => setPeriodo(v)}>{{ todos:'Todos', hoy:'Hoy', '7dias':'7 días', mes:'Este mes' }[v]}</PagosPill>
            ))}
          </div>
        </div>
        <div className="pagos-filter-group">
          <span className="pagos-filter-group-label">Moneda</span>
          <div className="pagos-filter-pills">
            {(['todos','ARS','USD'] as FiltroMoneda[]).map(v => (
              <PagosPill key={v} active={filtroMoneda === v} onClick={() => setMoneda(v)}>{{ todos:'Todas', ARS:'🇦🇷 ARS', USD:'🇺🇸 USD' }[v]}</PagosPill>
            ))}
          </div>
        </div>
        {metodosDisp.length > 0 && (
          <div className="pagos-filter-group">
            <span className="pagos-filter-group-label">Método</span>
            <div className="pagos-filter-pills">
              <PagosPill active={filtroMetodo === 'todos'} onClick={() => setMetodo('todos')}>Todos</PagosPill>
              {metodosDisp.map(m => <PagosPill key={m} active={filtroMetodo === m} onClick={() => setMetodo(m)}>{metodosEmoji[m]} {metodosLabel[m] ?? m}</PagosPill>)}
            </div>
          </div>
        )}
        {hayFiltros && (
          <div className="pagos-filter-footer">
            <span className="pagos-filter-results"><strong>{pagosFiltrados.length}</strong> resultado{pagosFiltrados.length !== 1 ? 's' : ''}</span>
            <button className="pagos-filter-clear" onClick={limpiarTodo}><IconX size={12} /> Limpiar filtros</button>
          </div>
        )}
      </div>

      {!pagosFiltrados.length && !loading ? (
        <EmptyState
          title="Sin resultados"
          description={hayFiltros ? 'Ningún pago coincide con los filtros' : 'Registrá tu primer pago para comenzar'}
          icon={<DollarSign />}
          action={!hayFiltros
            ? <Button variant="dark-primary" onClick={openForm}><IconCash size={16} /> Registrar pago</Button>
            : <Button variant="dark" onClick={limpiarTodo}><IconX size={16} /> Limpiar filtros</Button>
          }
        />
      ) : (
        <>
          <PagosTable pagos={pagosPaginados} />
          {pagosFiltrados.length > ITEMS_PER_PAGE && (
            <PaginationBar totalItems={pagosFiltrados.length} currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} itemLabel="pago" />
          )}
        </>
      )}

      <SlidePanel isOpen={showForm} onClose={handleCancel} title="Registrar pago">
        <PagoForm form={form} deudas={deudas} deudaSeleccionada={deudaSeleccionada} cotizacionActual={cotizacionActual} cargandoCotizacion={cargandoCotizacion} error={formError} isSubmitting={isSubmitting} onChange={handleChange} onMonedaPagoChange={handleMonedaPagoChange} onSubmit={handleSubmit} onCancel={handleCancel} />
      </SlidePanel>
    </div>
  )
}