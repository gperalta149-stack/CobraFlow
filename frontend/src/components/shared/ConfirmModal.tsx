// frontend/src/components/shared/ConfirmModal.tsx
interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info' | 'archive' | 'restore'
}

const variantColors = {
  danger: 'bg-red-600 hover:bg-red-700',
  warning: 'bg-yellow-600 hover:bg-yellow-700',
  info: 'bg-blue-600 hover:bg-blue-700',
  archive: 'bg-orange-600 hover:bg-orange-700',
  restore: 'bg-emerald-600 hover:bg-emerald-700',
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#242938] rounded-2xl p-6 w-full max-w-sm border border-[#2e3347] shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-300 mb-6 whitespace-pre-line">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 text-white font-semibold py-2.5 rounded-xl transition-all ${variantColors[variant]} hover:-translate-y-0.5`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-[#2e3347] hover:bg-[#3a4159] text-gray-300 font-semibold py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}