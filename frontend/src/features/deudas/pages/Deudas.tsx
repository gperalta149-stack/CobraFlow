// frontend/src/features/deudas/pages/Deudas.tsx
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  IconPlus, 
  IconWallet, 
  IconAlertCircle, 
  IconAdjustmentsHorizontal,
  IconFileExport,
  IconTableExport,
  IconX
} from '@tabler/icons-react'
import { DollarSign } from 'lucide-react'
import { SlidePanel } from '../../../components/shared/SlidePanel'
import { SearchInput } from '../../../components/ui/SearchInput'
import { EmptyState } from '../../../components/shared/EmptyState'
import { Button } from '../../../components/ui/Button'
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
import { useExportDeudas } from '../hooks/useExportDeudas'
import '../../../styles/theme.css'
import '../../../styles/filter.css'

const ITEMS_PER_PAGE = 5

export default function Deudas() {
  const location = useLocation()
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

  const { exportToCSV, exportToPDF } = useExportDeudas()

  useEffect(() => { if (showForm) handleCancel() }, [location.state?.reset])
  useEffect(() => { setCurrentPage(1) }, [searchTerm, filtroEstados, filtroDesde, filtroHasta, filtroMontoMin, filtroMontoMax, filtroMonedaMonto])

  const filteredDeudas = useMemo(() => {
    let result = [...deudas]
    if (searchTerm) {
      const t = searchTerm.toLowerCase()
      result = result.filter(d =>
        d.clientes?.nombre?.toLowerCase().includes(t) ||
        d.descripcion?.toLowerCase().includes(t) ||
        d.numero_factura?.toLowerCase().includes(t)
      )
    }
    return result
  }, [deudas, searchTerm])

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

  const hayFiltros = hayFiltrosActivos || searchTerm !== ''

  return (
    <div className="dark-container">

      {/* Header con botones de exportación */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 24 }}>
        <button 
          onClick={() => exportToCSV(deudas, 'deudas')}
          className="btn-export"
        >
          <IconTableExport size={16} /> Excel
        </button>
        <button 
          onClick={() => exportToPDF(deudas, 'deudas')}
          className="btn-export"
        >
          <IconFileExport size={16} /> PDF
        </button>
        <button onClick={openForm} className="btn-primary">
          <IconPlus size={16} /> Nueva deuda
        </button>
      </div>

      {/* 4 Métricas con DeudaMetricCard */}
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

      {/* === FILTROS CON PANEL (mismo estilo que Pagos) === */}
      <div className="filter-panel">
        <div className="filter-icon">
          <IconAdjustmentsHorizontal size={16} />
        </div>

        {/* Vista rápida */}
        <div className="filter-group">
          <span className="filter-group-label">Vista</span>
          <DeudaQuickFilters
            filtroEstados={filtroEstados}
            setFiltroEstados={setFiltroEstados}
            counts={counts}
          />
        </div>

        <div className="filter-divider" />

        {/* Filtros avanzados */}
        <div className="filter-group">
          <span className="filter-group-label">Filtrar</span>
          <DeudaFilters
            filtroDesde={filtroDesde} setFiltroDesde={setFiltroDesde}
            filtroHasta={filtroHasta} setFiltroHasta={setFiltroHasta}
            filtroMontoMin={filtroMontoMin} setFiltroMontoMin={setFiltroMontoMin}
            filtroMontoMax={filtroMontoMax} setFiltroMontoMax={setFiltroMontoMax}
            filtroMonedaMonto={filtroMonedaMonto} setFiltroMonedaMonto={setFiltroMonedaMonto}
            onLimpiar={limpiarFiltros} disabled={loading}
          />
        </div>

        {/* Buscador */}
        <div className="filter-search">
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar deuda o cliente..." disabled={loading} />
        </div>
      </div>

      {/* Tabla con datos paginados o EmptyState */}
      {filteredDeudas.length === 0 && !loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <EmptyState
            variant="minimal"
            title={hayFiltros ? "Sin resultados" : "No hay deudas"}
            description={
              hayFiltros 
                ? "Ninguna deuda coincide con los filtros aplicados" 
                : "Creá tu primera deuda para comenzar"
            }
            icon={<DollarSign size={40} />}
            action={
              hayFiltros ? (
                <Button 
                  variant="dark" 
                  onClick={() => { limpiarFiltros(); setSearchTerm('') }}
                >
                  <IconX size={16} /> Limpiar filtros
                </Button>
              ) : (
                <Button variant="dark-primary" onClick={openForm}>
                  <IconPlus size={16} /> Crear primera deuda
                </Button>
              )
            }
          />
        </div>
      ) : (
        <>
          <DeudasTable
            deudas={deudasPaginadas}
            hayFiltrosActivos={hayFiltros}
            onLimpiarFiltros={() => { limpiarFiltros(); setSearchTerm('') }}
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
        </>
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