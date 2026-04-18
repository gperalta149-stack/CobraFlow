import { useState } from 'react'
import api from '../../../services/api'
import { handleApiError } from '../../../utils/handleApiError'
import { useAuth } from '../../auth/context/AuthContext'
import Navbar from '../components/Navbar'

export default function Perfil() {
  const { usuario, login, token } = useAuth()
  const [tab, setTab] = useState<'perfil' | 'password'>('perfil')

  const [formPerfil, setFormPerfil] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || ''
  })

  const [formPassword, setFormPassword] = useState({
    passwordActual: '',
    passwordNuevo: '',
    confirmar: ''
  })

  const [exitoPerfil, setExitoPerfil] = useState('')
  const [errorPerfil, setErrorPerfil] = useState('')
  const [exitoPassword, setExitoPassword] = useState('')
  const [errorPassword, setErrorPassword] = useState('')

  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorPerfil('')
    setExitoPerfil('')
    try {
      await api.put('/auth/perfil', formPerfil)
      
      if (token && usuario) {
        login(token, { ...usuario, ...formPerfil })
      }
      setExitoPerfil('Perfil actualizado correctamente')
    } catch (err) {
      setErrorPerfil(handleApiError(err, 'Error al actualizar perfil'))
    }
  }

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorPassword('')
    setExitoPassword('')

    if (formPassword.passwordNuevo !== formPassword.confirmar) {
      return setErrorPassword('Las contraseñas no coinciden')
    }

    if (formPassword.passwordNuevo.length < 6) {
      return setErrorPassword('La contraseña debe tener al menos 6 caracteres')
    }

    try {
      await api.put('/auth/cambiar-password', {
        passwordActual: formPassword.passwordActual,
        passwordNuevo: formPassword.passwordNuevo
      })
      setFormPassword({ passwordActual: '', passwordNuevo: '', confirmar: '' })
      setExitoPassword('Contraseña cambiada correctamente')
    } catch (err) {
      setErrorPassword(handleApiError(err, 'Error al cambiar contraseña'))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('perfil')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === 'perfil' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Datos personales
          </button>
          <button
            onClick={() => setTab('password')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === 'password' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Cambiar contraseña
          </button>
        </div>

        {/* Tab Perfil */}
        {tab === 'perfil' && (
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="font-bold text-gray-700 mb-4">Datos personales</h2>
            {errorPerfil && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                {errorPerfil}
              </div>
            )}
            {exitoPerfil && (
              <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
                {exitoPerfil}
              </div>
            )}
            <form onSubmit={handleGuardarPerfil} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  value={formPerfil.nombre}
                  onChange={(e) => setFormPerfil({ ...formPerfil, nombre: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formPerfil.email}
                  onChange={(e) => setFormPerfil({ ...formPerfil, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500">
                Rol: <span className="font-medium text-gray-700">{usuario?.rol}</span>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar cambios
              </button>
            </form>
          </div>
        )}

        {/* Tab Password */}
        {tab === 'password' && (
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="font-bold text-gray-700 mb-4">Cambiar contraseña</h2>
            {errorPassword && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                {errorPassword}
              </div>
            )}
            {exitoPassword && (
              <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
                {exitoPassword}
              </div>
            )}
            <form onSubmit={handleCambiarPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  value={formPassword.passwordActual}
                  onChange={(e) => setFormPassword({ ...formPassword, passwordActual: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={formPassword.passwordNuevo}
                  onChange={(e) => setFormPassword({ ...formPassword, passwordNuevo: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  value={formPassword.confirmar}
                  onChange={(e) => setFormPassword({ ...formPassword, confirmar: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cambiar contraseña
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}