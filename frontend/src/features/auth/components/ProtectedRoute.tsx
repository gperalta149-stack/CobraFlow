import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navbar } from '../../../components/layout/Navbar'

export default function ProtectedRoute() {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando sesión...</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 pt-20">
        <Outlet />
      </main>
    </>
  )
}