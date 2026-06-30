// frontend/src/features/auth/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { AppLayout } from '../../../components/layout/layout'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { token, loading } = useAuth()

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
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}