interface PerfilTabsProps {
  activeTab: 'perfil' | 'password'
  onTabChange: (tab: 'perfil' | 'password') => void
}

export function PerfilTabs({ activeTab, onTabChange }: PerfilTabsProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onTabChange('perfil')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeTab === 'perfil' 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Datos personales
      </button>
      <button
        onClick={() => onTabChange('password')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeTab === 'password' 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Cambiar contraseña
      </button>
    </div>
  )
}