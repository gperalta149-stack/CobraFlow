import { useState } from 'react'
import { useAuth } from '../../auth/context/AuthContext'
import { usePerfil } from '../hooks/usePerfil'
import { usePassword } from '../hooks/usePassword'
import { PerfilTabs } from '../components/PerfilTabs'
import { PerfilForm } from '../components/PerfilForm'
import { PasswordForm } from '../components/PasswordForm'

export default function Perfil() {
  const { usuario } = useAuth()
  const [tab, setTab] = useState<'perfil' | 'password'>('perfil')
  
  const perfil = usePerfil()
  const password = usePassword()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

        <PerfilTabs activeTab={tab} onTabChange={setTab} />

        {tab === 'perfil' && (
          <PerfilForm
            form={perfil.formPerfil}
            error={perfil.error}
            exito={perfil.exito}
            isSubmitting={perfil.isSubmitting}
            rol={usuario?.rol || ''}
            onChange={perfil.handleChange}
            onSubmit={perfil.handleSubmit}
          />
        )}

        {tab === 'password' && (
          <PasswordForm
            form={password.formPassword}
            error={password.error}
            exito={password.exito}
            isSubmitting={password.isSubmitting}
            onChange={password.handleChange}
            onSubmit={password.handleSubmit}
          />
        )}
      </div>
    </div>
  )
}