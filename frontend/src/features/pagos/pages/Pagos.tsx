import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { usePagos } from '../hooks/usePagos'
import { usePagoForm } from '../hooks/usePagoForm'
import { usePagosMetrics } from '../hooks/usePagosMetrics'
import { useExportPagos } from '../hooks/useExportPagos'
import { PagoForm } from '../components/PagoForm'
import { PagosTable } from '../components/PagosTable'
import { PagosMetrics } from '../components/PagosMetrics'
import { PagosFilters } from '../components/PagosFilters'
import { SlidePanel } from '../../../components/shared/SlidePanel'
import { PaginationBar } from '../../../components/shared/PaginationBar'
import { EmptyState } from '../../../components/shared/EmptyState'
import { Button } from '../../../components/ui/Button'
import { IconCash, IconX, IconFileExport, IconTableExport, IconPlus } from '@tabler/icons-react'
import { DollarSign } from 'lucide-react'
import { metodosLabel } from '../constants/metodos'
import '../../../styles/theme.css'
import '../../../styles/filter.css'
import '../../../styles/actions.css'

const ITEMS_PER_PAGE = 5
type FiltroPeriodo = 'todos' | 'hoy' | '7dias' | 'mes'
type FiltroMoneda  = 'todos' | 'ARS' | 'USD'
type FiltroMetodo  = 'todos' | 'efectivo' | 'transferencia' | 'tarjeta_credito' | 'tarjeta_debito' | 'cheque' | 'mercado_pago' | 'otro'

export default function Pagos() {
  const location = useLocation()
  const { pagos, deudas, loading, error, refetchData, loadData } = usePagos()
  const { showForm, form, error: formError, isSubmitting, deudaSeleccionada, cotizacionActual, cargandoCotizacion, handleChange, handleMonedaPagoChange, handleSubmit, handleCancel, openForm } = usePagoForm({ deudas, onSuccess: refetchData })
  const { exportToCSV, exportToPDF } = useExportPagos()

  // Estados de filtros
  const [buscarCliente, setBuscar] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filtroPeriodo, setPeriodo] = useState<FiltroPeriodo>('todos')
  const [filtroMoneda, setMoneda] = useState<FiltroMoneda>('todos')
  const [filtroMetodo, setMetodo] = useState<FiltroMetodo>('todos')

  useEffect(() => { if (showForm) handleCancel() }, [location.state?.reset])
  useEffect(() => { setCurrentPage(1) }, [filtroPeriodo, filtroMoneda, filtroMetodo, buscarCliente])

  // Filtrar pagos - incluyendo búsqueda adaptativa por texto y montos
  const pagosFiltrados = useMemo(() => {
    const ahora = new Date()
    const hoy   = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
    const hace7 = new Date(hoy); hace7.setDate(hace7.getDate() - 7)
    const mes   = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    
    return [...pagos].filter(p => {
      // Filtro por período
      const f = new Date(p.fecha_pago)
      if (filtroPeriodo === 'hoy'   && f < hoy)   return false
      if (filtroPeriodo === '7dias' && f < hace7)  return false
      if (filtroPeriodo === 'mes'   && f < mes)    return false
      
      // Filtro por moneda
      if (filtroMoneda !== 'todos'  && p.moneda !== filtroMoneda) return false
      
      // Filtro por método
      if (filtroMetodo !== 'todos'  && p.metodo_pago !== filtroMetodo) return false
      
      // Búsqueda por texto (Cliente, Método, Monto y Divisa unificada)
      if (buscarCliente.trim()) {
        const texto = buscarCliente.toLowerCase().trim()
        
        // 1. Coincidencia por Cliente
        const nombreCliente = (p.clientes?.nombre || '').toLowerCase()
        const coincideCliente = nombreCliente.includes(texto)
        
        // 2. Coincidencia por Método de pago
        const metodoLabelText = p.metodo_pago ? metodosLabel[p.metodo_pago] ?? '' : ''
        const coincideMetodo = metodoLabelText.toLowerCase().includes(texto)
        
        // 3. Coincidencia por Monto y Divisa (Normalizado estricto a minúsculas)
        const montoNum = p.monto || 0
        const monedaPlana = (p.moneda || '').toLowerCase() // Convertimos USD/ARS a usd/ars directamente
        
        // Formas combinadas para que busque "500 usd" o "usd 500" sin problemas
        const montoTextoPlano = `${montoNum} ${monedaPlana}`
        const monedaMontoTextoPlano = `${monedaPlana} ${montoNum}`
        
        // Formato visual local con puntos y comas (ej: "1.500")
        const montoFormateadoLocal = montoNum.toLocaleString('es-AR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).toLowerCase()

        // Formas combinadas localizadas (ej: "1.500 usd" o "usd 1.500")
        const combinadoLocal1 = `${montoFormateadoLocal} ${monedaPlana}`
        const combinadoLocal2 = `${monedaPlana} ${montoFormateadoLocal}`

        const coincideMonto = 
          montoTextoPlano.includes(texto) ||          
          monedaMontoTextoPlano.includes(texto) ||    
          montoFormateadoLocal.includes(texto) ||     
          combinadoLocal1.includes(texto) ||          
          combinadoLocal2.includes(texto) ||
          texto.replace(/[^0-9]/g, '') === String(Math.floor(montoNum))

        // Si no cumple ninguna de las 3 condiciones principales, no pasa el filtro
        if (!coincideCliente && !coincideMetodo && !coincideMonto) {
          return false
        }
      }
      
      return true
    }).sort((a, b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())
  }, [pagos, buscarCliente, filtroPeriodo, filtroMoneda, filtroMetodo])

  const metrics = usePagosMetrics(pagos, pagosFiltrados)
  const metodosDisp = useMemo(() => Array.from(new Set(pagos.map(p => p.metodo_pago).filter(Boolean))) as FiltroMetodo[], [pagos])
  const hayFiltros = filtroPeriodo !== 'todos' || filtroMoneda !== 'todos' || filtroMetodo !== 'todos' || !!buscarCliente
  const pagosPaginados = useMemo(() => pagosFiltrados.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [pagosFiltrados, currentPage])

  const limpiarTodo = () => { 
    setBuscar('')
    setPeriodo('todos')
    setMoneda('todos')
    setMetodo('todos')
  }

  const handleExportCSV = () => exportToCSV(pagosFiltrados, 'pagos')
  const handleExportPDF = () => exportToPDF(pagosFiltrados)

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
      {/* Header con botones de exportación */}
      <div className="action-bar">
        <button onClick={handleExportCSV} className="btn-export" disabled={!pagosFiltrados.length}>
          <IconTableExport size={16} /> Excel
        </button>
        <button onClick={handleExportPDF} className="btn-export" disabled={!pagosFiltrados.length}>
          <IconFileExport size={16} /> PDF
        </button>
        <button onClick={openForm} className="btn-primary">
          <IconPlus size={16} /> Registrar pago
        </button>
      </div>

      <PagosMetrics
        totalARS={metrics.totalARS} totalUSD={metrics.totalUSD} totalFiltrados={pagosFiltrados.length}
        mesARS={metrics.mesARS} mesUSD={metrics.mesUSD}
        variacionARS={metrics.variacionARS} mesAnteriorNombre={metrics.mesAnteriorNombre}
        ultimoPago={metrics.ultimoPago} ultimoPagoARS={metrics.ultimoPagoARS} ultimoPagoUSD={metrics.ultimoPagoUSD}
      />

      {/* Filtros simplificados */}
      <PagosFilters
        buscarCliente={buscarCliente}
        filtroPeriodo={filtroPeriodo}
        filtroMoneda={filtroMoneda}
        filtroMetodo={filtroMetodo}
        metodosDisponibles={metodosDisp}
        onBuscar={setBuscar}
        onPeriodo={setPeriodo}
        onMoneda={setMoneda}
        onMetodo={setMetodo}
      />

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