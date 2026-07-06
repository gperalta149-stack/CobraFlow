// frontend/src/features/clientes/pages/Clientes.tsx
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IconPlus, IconUserCheck, IconUserX, IconUsers } from '@tabler/icons-react'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/shared/EmptyState'
import { SlidePanel } from '../../../components/shared/SlidePanel'
import { PaginationBar } from '../../../components/shared/PaginationBar'
import { SearchInput } from '../../../components/ui/SearchInput'
import { FilterPill } from '../../../components/shared/filters/FilterPill'
import { ConfirmModal } from '../../../components/shared/ConfirmModal'
import { ClienteForm } from '../components/ClienteForm'
import { ClientesTable } from '../components/ClientesTable'
import { ClientesActions } from '../components/ClientesActions'
import { ClientesMetrics } from '../components/ClientesMetrics'
import { ClienteHistorialPagos } from '../components/modals/ClienteHistorialPagosModal'
import { ClienteImportModal } from '../components/modals/ClienteImportModal'
import { ClienteModal } from '../components/modals/ClienteModal'
import { useClienteArchive } from '../hooks/useClienteArchive'
import { useClienteForm } from '../hooks/useClienteForm'
import { useClientes, type ClienteConEstado } from '../hooks/useClientes'
import { clientesApi } from '../services/clientesApi'
import '../../../styles/theme.css'
import '../../../styles/filter.css'

type TabType = 'activos' | 'archivados'

export default function Clientes() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<TabType>('activos')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const activos = useClientes({ tipo: 'activos' })
  const archivados = useClientes({ tipo: 'archivados' })

  const { showForm, editando, form, error: formError, isSubmitting, nombreInputRef, handleChange, handleSubmit, handleEditar, handleNuevoCliente, handleCancel } = useClienteForm({
    onSuccess: () => {
      activos.refetchClientes()
      archivados.refetchClientes()
    }
  })

  const { archivingId, confirmState, handleArchivar, handleRestaurar, confirmAccion, cancelAccion } = useClienteArchive({
    onSuccess: () => {
      activos.refetchClientes()
      archivados.refetchClientes()
    }
  })

  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteConEstado | null>(null)
  const [clienteHistorialPagos, setClienteHistorialPagos] = useState<ClienteConEstado | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)

  useEffect(() => {
    if (showForm) handleCancel()
  }, [location.state?.reset])

  const handleExport = async () => {
    try {
      const response = await clientesApi.exportToExcel(activos.buscar)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Error al exportar clientes')
    }
  }

  const isLoading = activeTab === 'activos' ? activos.loading : archivados.loading
  const currentClientes = activeTab === 'activos' ? activos.clientes : archivados.clientes
  const currentBuscar = activeTab === 'activos' ? activos.buscar : archivados.buscar
  const setCurrentBuscar = activeTab === 'activos' ? activos.setBuscar : archivados.setBuscar
  const currentError = activeTab === 'activos' ? activos.error : archivados.error
  const loadCurrentData = activeTab === 'activos' ? activos.loadData : archivados.loadData

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, currentBuscar])

  const totalItems = currentClientes.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const clientesPaginados = currentClientes.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const clientesMorosos = activos.clientes.filter(c => c.estadoDeuda === 'vencida').length

  if (isLoading && currentClientes.length === 0) {
    return (
      <div className="dark-container">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-end gap-3 mb-6">
            <div className="h-9 w-28 bg-[#242938] rounded-lg" />
            <div className="h-9 w-28 bg-[#242938] rounded-lg" />
            <div className="h-9 w-32 bg-[#242938] rounded-lg" />
          </div>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-[#242938] rounded-xl" />)}
          </div>
          <div className="h-10 bg-[#242938] rounded-lg" />
          <div className="h-96 bg-[#242938] rounded-xl" />
        </div>
      </div>
    )
  }

  if (currentError && currentClientes.length === 0) {
    return (
      <div className="dark-container">
        <div className="bg-red-900/30 border border-red-500 rounded-xl p-8 text-center">
          <p className="font-semibold text-red-400 text-lg mb-2">Error al cargar los datos</p>
          <p className="text-sm text-gray-400 mb-4">{currentError}</p>
          <button onClick={loadCurrentData} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="dark-container">
      <ClientesActions
        onImport={() => setShowImportModal(true)}
        onExport={handleExport}
        onNuevo={handleNuevoCliente}
      />

      <ClientesMetrics
        totalClientes={activos.totalClientes}
        clientesConDeuda={activos.clientesConDeuda}
        clientesMorosos={clientesMorosos}
        clientesAlDia={activos.clientesAlDia}
        totalArchivados={archivados.totalClientes}
      />

      {/* ── Filtros con FilterPill ── */}
      <div className="filter-panel">
        <div className="filter-icon">
          <IconUsers size={16} />
        </div>

        <div className="filter-group">
          <span className="filter-group-label">Estado</span>
          <div className="filter-pills-group">
            <FilterPill
              icon={<IconUserCheck size={14} />}
              label="Activos"
              isActive={activeTab === 'activos'}
              onClick={() => setActiveTab('activos')}
            />
            <FilterPill
              icon={<IconUserX size={14} />}
              label="Archivados"
              isActive={activeTab === 'archivados'}
              onClick={() => setActiveTab('archivados')}
            />
          </div>
        </div>

        <div className="filter-divider" />

        <div className="filter-search">
          <SearchInput
            value={currentBuscar}
            onChange={setCurrentBuscar}
            placeholder="Buscar por nombre, DNI o email..."
            disabled={isLoading}
          />
        </div>
      </div>

      {clientesPaginados.length === 0 && !isLoading ? (
    <EmptyState
      variant="minimal"
      title={activeTab === 'activos' ? "No hay clientes" : "No hay clientes archivados"}
      description={activeTab === 'activos' ? "Creá tu primer cliente para comenzar" : "Los clientes que archives aparecerán aquí"}
      icon={<IconUsers size={40} />}
      action={activeTab === 'activos' ? (
        <Button variant="dark-primary" onClick={handleNuevoCliente}>
          <IconPlus size={16} /> Crear primer cliente
        </Button>
      ) : undefined}
    />
) : (
  <>
    <ClientesTable
      clientes={clientesPaginados}
      onVer={setClienteSeleccionado}
      onEditar={handleEditar}
      onArchivar={handleArchivar}
      onRestaurar={handleRestaurar}
      archivingId={archivingId}
      esArchivados={activeTab === 'archivados'}
    />
    <PaginationBar
      totalItems={totalItems}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={goToPage}
      itemLabel="cliente"
    />
  </>
)}

      {/* SlidePanel */}
      <SlidePanel isOpen={showForm} onClose={handleCancel} title={editando ? 'Editar cliente' : 'Nuevo cliente'}>
        <ClienteForm form={form} editando={editando} error={formError} isSubmitting={isSubmitting} nombreInputRef={nombreInputRef} onChange={handleChange} onSubmit={handleSubmit} onCancel={handleCancel} />
      </SlidePanel>

      <ConfirmModal
        isOpen={confirmState !== null}
        title={confirmState?.accion === 'archivar' ? '¿Archivar cliente?' : '¿Restaurar cliente?'}
        message={`${confirmState?.clienteNombre}\n\n${
          confirmState?.accion === 'archivar'
            ? 'El cliente se archivará y no aparecerá en la lista principal. Podés restaurarlo desde la sección "Archivados" en cualquier momento.'
            : 'El cliente volverá a aparecer en la lista principal con todos sus datos y su historial.'
        }`}
        confirmText={confirmState?.accion === 'archivar' ? 'Sí, archivar' : 'Sí, restaurar'}
        cancelText="Cancelar"
        onConfirm={confirmAccion}
        onCancel={cancelAccion}
        variant={confirmState?.accion === 'archivar' ? 'archive' : 'restore'}
      />

      {clienteSeleccionado && (
        <ClienteModal clienteId={clienteSeleccionado.id} onClose={() => setClienteSeleccionado(null)} />
      )}

      {clienteHistorialPagos && (
        <ClienteHistorialPagos
          clienteId={clienteHistorialPagos.id}
          clienteNombre={clienteHistorialPagos.nombre}
          onClose={() => setClienteHistorialPagos(null)}
        />
      )}

      {showImportModal && (
        <ClienteImportModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            activos.refetchClientes()
            archivados.refetchClientes()
          }}
        />
      )}
    </div>
  )
}