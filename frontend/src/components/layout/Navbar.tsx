import { useAuth } from '../../features/auth/context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

export function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 dark:bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md fixed top-0 w-full z-50">
      <div className="flex items-center gap-6">
        <span className="font-bold text-xl">CobraFlow</span>
        <Link to="/dashboard" className="hover:text-blue-200 dark:hover:text-gray-300 transition">Panel</Link>
        <Link to="/clientes" className="hover:text-blue-200 dark:hover:text-gray-300 transition">Clientes</Link>
        <Link to="/deudas" className="hover:text-blue-200 dark:hover:text-gray-300 transition">Deudas</Link>
        <Link to="/pagos" className="hover:text-blue-200 dark:hover:text-gray-300 transition">Pagos</Link>
      </div>
      <div className="flex items-center gap-4">
        {/* Botón modo oscuro */}
        <button
          onClick={toggleTheme}
          className="bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30 transition text-sm"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <Link to="/perfil" className="text-sm hover:text-blue-200 dark:hover:text-gray-300">
          {usuario?.nombre} ({usuario?.rol})
        </Link>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 dark:bg-gray-200 dark:text-gray-800 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-gray-300 transition text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}