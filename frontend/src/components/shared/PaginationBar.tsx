import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface PaginationBarProps {
  totalItems: number
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  itemLabel?: string  // ej: "pago", "deuda", "cliente" — default "elemento"
}

export function PaginationBar({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  itemLabel = 'elemento',
}: PaginationBarProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const desde = (currentPage - 1) * itemsPerPage + 1
  const hasta = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalItems === 0) return null

  const labelPlural = `${itemLabel}${totalItems !== 1 ? 's' : ''}`

  return (
    <div className="pagination-bar">
      <span className="pagination-info">
        <strong>{totalItems}</strong> {labelPlural} · mostrando {desde}–{hasta}
      </span>
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <IconChevronLeft size={14} /> Anterior
        </button>
        <span className="pagination-page">{currentPage}</span>
        <button
          className="pagination-btn"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Siguiente <IconChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}