// frontend/src/components/shared/actions/ExportActions.tsx
import { IconFileExport, IconTableExport } from '@tabler/icons-react'
import '../../../styles/actions.css'

interface ExportActionsProps {
  onExcel: () => void
  onPdf: () => void
  disabled?: boolean
  className?: string
}

export function ExportActions({
  onExcel,
  onPdf,
  disabled = false,
  className = '',
}: ExportActionsProps) {
  return (
    <div className={`action-bar ${className}`}>
      <button
        onClick={onExcel}
        disabled={disabled}
        className="btn-export"
      >
        <IconTableExport size={16} /> Excel
      </button>
      <button
        onClick={onPdf}
        disabled={disabled}
        className="btn-export"
      >
        <IconFileExport size={16} /> PDF
      </button>
    </div>
  )
}