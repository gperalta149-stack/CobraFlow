// frontend/src/features/pagos/components/PagosHeader.tsx
import { Button } from '../../../components/ui/Button'
import { IconCash, IconTableExport, IconFileExport } from '@tabler/icons-react'

interface PagosHeaderProps {
  disabled: boolean
  onExportCSV: () => void
  onExportPDF: () => void
  onNuevoPago: () => void
}

export function PagosHeader({ disabled, onExportCSV, onExportPDF, onNuevoPago }: PagosHeaderProps) {
  return (
    <div className="flex justify-end gap-3 mb-6">
      <Button variant="dark" onClick={onExportCSV} disabled={disabled}>
        <IconTableExport size={16} /> Excel
      </Button>
      <Button variant="dark" onClick={onExportPDF} disabled={disabled}>
        <IconFileExport size={16} /> PDF
      </Button>
      <Button variant="dark-primary" onClick={onNuevoPago}>
        <IconCash size={16} /> Registrar pago
      </Button>
    </div>
  )
}