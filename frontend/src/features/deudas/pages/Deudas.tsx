// frontend/src/features/deudas/pages/Deudas.tsx
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconHistory, IconPlus, IconWallet, IconAlertCircle } from '@tabler/icons-react'
import { SlidePanel } from '../../../components/shared/SlidePanel'
import { SearchInput } from '../../../components/ui/SearchInput'
import { DeudaMetricCard } from '../components/DeudaMetricCard'
import { DeudaMoraCard } from '../components/DeudaMoraCard'
import { DeudaFilters } from '../components/DeudaFilters'
import { DeudaForm } from '../components/DeudaForm'
import { PaginationBar } from '../../../components/shared/PaginationBar'
import { DeudaQuickFilters } from '../components/DeudaQuickFilters'
import { DeudasTable } from '../components/DeudasTable'
import { DeudaProximoVencimientoCard } from '../components/DeudaProximoVencimientoCard'
import { useDeudaForm } from '../hooks/useDeudaForm'
import { useDeudas } from '../hooks/useDeudas'
import '../../../styles/theme.css'

const ITEMS_PER_PAGE = 10

export default function Deudas() {
  const navigate = useNavigate()
  const location = useLocation()
  const [quickFilter, setQuickFilter] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const {
    deudas, clientes, loading, error,
    filtroEstados, setFiltroEstados,
    filtroDesde, setFiltroDesde,
    filtroHasta, setFiltroHasta,
    filtroMontoMin, setFiltroMontoMin,
    filtroMontoMax, setFiltroMontoMax,
    filtroMonedaMonto, setFiltroMonedaMonto,
    hayFiltrosActivos, limpiarFiltros,
    refetchDeudas, loadData,
    pendienteARS, pendienteUSD,
    vencidasARS, vencidasUSD,
    moraARS, moraUSD,
    deudasVencidasCount,
    proximoVencimiento,
    cotizacionActual,
    counts,
  } = useDeudas()

  const {
    showForm, form, error: formError,
    isSubmitting, cotizacionActual: cotizForm, cargandoCotizacion,
    descripcionInputRef,
    handleChange, handleMonedaChange,
    handleSubmit, handleCancel, openForm,
  } = useDeudaForm({ onSuccess: refetchDeudas })

  useEffect(() => { if (showForm) handleCancel() }, [location.state?.reset])

  useEffect(() => { setCurrentPage(1) }, [quickFilter, searchTerm, filtroEstados, filtroDesde, filtroHasta, filtroMontoMin, filtroMontoMax, filtroMonedaMonto])

  const filteredDeudas = useMemo(() => {
    let result = [...deudas]
    if (quickFilter === 'activas') result = result.filter(d => d.estado === 'pendiente' || d.estado === 'parcial')
    if (quickFilter === 'vencidas') result = result.filter(d => d.estado === 'vencida')
    if (quickFilter === 'parciales') result = result.filter(d => d.estado === 'parcial')
    if (searchTerm) {
      const t = searchTerm.toLowerCase()
      result = result.filter(d =>
        d.clientes?.nombre?.toLowerCase().includes(t) ||
        d.descripcion?.toLowerCase().includes(t) ||
        d.numero_factura?.toLowerCase().includes(t)
      )
    }
    return result
  }, [deudas, quickFilter, searchTerm])

  const deudasPaginadas = useMemo(() => {
    return filteredDeudas.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    )
  }, [filteredDeudas, currentPage])

  if (loading && deudas.length === 0) {
    return (
      <div className="dark-container">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-[#242938] rounded-xl" />)}
          </div>
          <div className="h-10 bg-[#242938] rounded-lg" />
          <div className="h-96 bg-[#242938] rounded-xl" />
        </div>
      </div>
    )
  }

  if (error && deudas.length === 0) {
    return (
      <div className="dark-container">
        <div className="bg-red-900/30 border border-red-500 rounded-xl p-8 text-center">
          <p className="font-semibold text-red-400 text-lg mb-2">Error al cargar los datos</p>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button onClick={loadData} className="bg-red-600 text-white px-4 py-2 rounded-lg">Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="dark-container">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 24 }}>
        <button onClick={() => navigate('/deudas/historial')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 8, color: '#94a3b8', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <IconHistory size={16} /> Ver historial
        </button>
        <button onClick={openForm}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', backgroundColor: '#1D9E75', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <IconPlus size={16} /> Nueva deuda
        </button>
      </div>

      {/* 4 Métricas con DeudaMetricCard (sin equivalencias) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>

        <DeudaMetricCard
          label="Total pendiente"
          ars={pendienteARS}
          usd={pendienteUSD}
          icon={<IconWallet size={15} />}
          iconColor="#60a5fa"
          subtitle={`en ${deudas.length} deuda${deudas.length !== 1 ? 's' : ''}`}
          emptyLabel="Sin deudas"
        />

        <DeudaMetricCard
          label="Vencidas"
          ars={vencidasARS}
          usd={vencidasUSD}
          icon={<IconAlertCircle size={15} />}
          iconColor="#E24B4A"
          valueColor="#E24B4A"
          subtitle={`${deudasVencidasCount} vencida${deudasVencidasCount !== 1 ? 's' : ''}`}
          emptyLabel="Sin vencidas"
          emptyIcon="✅"
        />

        <DeudaMoraCard
          moraCount={deudasVencidasCount}
          moraTotalARS={moraARS}
          moraTotalUSD={moraUSD}
        />

        <DeudaProximoVencimientoCard
          proximoVencimiento={proximoVencimiento}
          cotizacionActual={cotizacionActual}
        />

      </div>

      {/* Buscador */}
      <div style={{ marginBottom: 12 }}>
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar deuda o cliente..." disabled={loading} />
      </div>

      {/* Quick filters */}
      <DeudaQuickFilters
        activeFilter={quickFilter}
        onFilterChange={setQuickFilter}
        counts={counts}
      />

      {/* Filtros avanzados */}
      <DeudaFilters
        filtroEstados={filtroEstados} setFiltroEstados={setFiltroEstados}
        filtroDesde={filtroDesde} setFiltroDesde={setFiltroDesde}
        filtroHasta={filtroHasta} setFiltroHasta={setFiltroHasta}
        filtroMontoMin={filtroMontoMin} setFiltroMontoMin={setFiltroMontoMin}
        filtroMontoMax={filtroMontoMax} setFiltroMontoMax={setFiltroMontoMax}
        filtroMonedaMonto={filtroMonedaMonto} setFiltroMonedaMonto={setFiltroMonedaMonto}
        onLimpiar={limpiarFiltros} disabled={loading}
      />

      {/* Tabla con datos paginados */}
      <DeudasTable
        deudas={deudasPaginadas}
        hayFiltrosActivos={hayFiltrosActivos || quickFilter !== 'todos' || searchTerm !== ''}
        onLimpiarFiltros={() => { limpiarFiltros(); setQuickFilter('todos'); setSearchTerm('') }}
        cotizacion={cotizacionActual}
      />

      {/* Paginación */}
      {filteredDeudas.length > 0 && (
        <PaginationBar
          totalItems={filteredDeudas.length}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemLabel="deuda"
        />
      )}

      <SlidePanel isOpen={showForm} onClose={handleCancel} title="Nueva deuda">
        <DeudaForm
          form={form} clientes={clientes} error={formError}
          isSubmitting={isSubmitting} cotizacionActual={cotizForm}
          cargandoCotizacion={cargandoCotizacion}
          descripcionInputRef={descripcionInputRef}
          onChange={handleChange} onMonedaChange={handleMonedaChange}
          onSubmit={handleSubmit} onCancel={handleCancel}
        />
      </SlidePanel>
    </div>
  )
}