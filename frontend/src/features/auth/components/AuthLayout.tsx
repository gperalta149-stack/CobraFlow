import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export default function AuthLayout({ 
  children, 
  title = "CobraFlow", 
  subtitle = "Sistema de Gestión de Cobranza" 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT */}
      <div className="hidden md:flex bg-gradient-to-br from-indigo-700 to-blue-600 text-white flex-col justify-center px-16">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-blue-100">{subtitle}</p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          {children}
        </div>
      </div>
    </div>
  )
}