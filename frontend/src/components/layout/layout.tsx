import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

const PUBLIC_ROUTES = ['/', '/login', '/register']

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const isPublic = PUBLIC_ROUTES.includes(location.pathname)

  if (isPublic) return <>{children}</>

  return (
    <div className="flex min-h-screen bg-[#1a1f2e]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(prev => !prev)} />
      <div
        className="flex-1 min-h-screen flex flex-col"
        style={{ marginLeft: collapsed ? 64 : 240, transition: 'margin-left 0.2s ease' }}
      >
        <Navbar collapsed={collapsed} />
        <main className="flex-1 overflow-y-auto pt-14">
          {children}
        </main>
      </div>
    </div>
  )
}