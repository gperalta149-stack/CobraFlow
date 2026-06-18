// frontend/src/features/clientes/components/ClientesActions.tsx
import { Button } from '../../../components/ui/Button'
import { IconUpload, IconDownload, IconPlus } from '@tabler/icons-react'

interface ClientesActionsProps {
  onImport: () => void
  onExport: () => void
  onNuevo: () => void
}

export function ClientesActions({ onImport, onExport, onNuevo }: ClientesActionsProps) {
  return (
    <div className="flex justify-end gap-3 mb-6">
      <Button variant="dark" onClick={onImport}>
        <IconUpload size={16} /> Importar
      </Button>
      <Button variant="dark" onClick={onExport}>
        <IconDownload size={16} /> Exportar
      </Button>
      <Button variant="dark-primary" onClick={onNuevo}>
        <IconPlus size={16} /> Nuevo cliente
      </Button>
    </div>
  )
}