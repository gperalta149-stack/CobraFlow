import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <span className="font-bold text-xl">CobraFlow</span>
        <Link to="/dashboard" className="hover:text-blue-200">Panel</Link>
        <Link to="/clientes" className="hover:text-blue-200">Clientes</Link>
        <Link to="/deudas" className="hover:text-blue-200">Deudas</Link>
        <Link to="/pagos" className="hover:text-blue-200">Pagos</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/perfil" className="text-sm hover:text-blue-200">
          {usuario?.nombre} ({usuario?.rol})
        </Link>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50 text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}