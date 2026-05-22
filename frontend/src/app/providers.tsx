import { AuthProvider } from '../features/auth/context/AuthContext'
import { ToastProvider } from '../components/providers/ToastProvider'
import { ThemeProvider } from '../context/ThemeContext'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider />
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}