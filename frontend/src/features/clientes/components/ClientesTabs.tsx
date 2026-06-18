// frontend/src/features/clientes/components/ClientesTabs.tsx
import { IconUsers, IconArchive } from '@tabler/icons-react'

type TabType = 'activos' | 'archivados'

interface ClientesTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function ClientesTabs({ activeTab, onTabChange }: ClientesTabsProps) {
  return (
    <div className="flex gap-2 bg-[#242938] rounded-xl p-1">
      <button
        onClick={() => onTabChange('activos')}
        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
          activeTab === 'activos' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-400 hover:text-white hover:bg-[#2a3045]'
        }`}
      >
        <IconUsers size={14} /> Activos
      </button>
      <button
        onClick={() => onTabChange('archivados')}
        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
          activeTab === 'archivados' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-400 hover:text-white hover:bg-[#2a3045]'
        }`}
      >
        <IconArchive size={14} /> Archivados
      </button>
    </div>
  )
}