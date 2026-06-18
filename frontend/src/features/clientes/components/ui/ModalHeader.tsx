// frontend/src/components/ui/ModalHeader.tsx
import type { ReactNode } from 'react'
import { IconX } from '@tabler/icons-react'

interface ModalHeaderProps {
  avatar: string
  nombre: string
  apellido: string
  empresa?: string | null
  activo: boolean
  onClose: () => void
  children?: ReactNode
}

export function ModalHeader({ avatar, nombre, apellido, empresa, activo, onClose, children }: ModalHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-[#2e3347] bg-gradient-to-r from-[#1e2334] to-[#242938]">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {avatar}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{nombre} {apellido}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {empresa && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  {empresa}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full ${activo ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-[#2e3347]"
        >
          <IconX size={20} />
        </button>
      </div>
      {children}
    </div>
  )
}