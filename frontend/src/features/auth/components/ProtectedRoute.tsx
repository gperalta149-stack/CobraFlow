import { Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Sidebar } from '../../../components/layout/Sidebar'
import { Navbar } from '../../../components/layout/Navbar'
import '../../../styles/sidebar.css'

export default function ProtectedRoute() {
  const { token, loading } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', background: '#1a1f2e'
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid #2e3347', borderTopColor: '#1D9E75',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!token) return <Navigate to="/login" replace />

  return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#1a1f2e' }}>
        {/* 1. Sidebar ahora recibe correctamente el estado */}
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(prev => !prev)} />

        {/* 2. El contenedor principal DEBE tener la clase main-content para que el CSS funcione */}
        <div className={`main-content ${collapsed ? 'collapsed' : ''}`} style={{ flex: 1 }}>
          <Navbar collapsed={collapsed} />
          <main style={{ paddingTop: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
            <Outlet />
          </main>
        </div>
      </div>
  )
}