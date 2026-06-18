import { AuthProvider } from '../features/auth/context/AuthContext'
import { ToastProvider } from '../components/providers/ToastProvider'
import { ThemeProvider } from '../context/ThemeContext'
import { MonedaConfigProvider } from '../context/MonedaConfigContext'
import { useAuth } from '../features/auth/context/AuthContext'

// MonedaConfig solo se monta si hay usuario autenticado
// Evita que haga fetch a la API antes de tener token → loop infinito
function AuthenticatedProviders({ children }: { children: React.ReactNode }) {
  const { usuario, loading } = useAuth()

  // Mientras carga auth, no montar MonedaConfigProvider
  if (loading) return <>{children}</>

  // Sin usuario (no logueado), tampoco
  if (!usuario) return <>{children}</>

  return (
    <MonedaConfigProvider>
      {children}
    </MonedaConfigProvider>
  )
}

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider />
        <AuthenticatedProviders>
          {children}
        </AuthenticatedProviders>
      </AuthProvider>
    </ThemeProvider>
  )
}