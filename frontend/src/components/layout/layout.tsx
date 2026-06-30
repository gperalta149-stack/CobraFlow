// frontend/src/components/layout/layout.tsx
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import './../../styles/sidebar.css'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1a1f2e' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(prev => !prev)} />

      <div className={`main-content ${collapsed ? 'collapsed' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar collapsed={collapsed} />
        <main style={{ flex: 1, paddingTop: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}