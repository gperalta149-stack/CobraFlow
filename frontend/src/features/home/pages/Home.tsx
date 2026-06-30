// frontend/src/features/home/pages/Home.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { PublicNavbar } from '../../../components/layout/PublicNavbar'
import { Footer } from '../../../components/layout/Footer'
import { Hero } from '../components/Hero'
import { SocialProof } from '../components/SocialProof'
import { Features } from '../components/Features'
import { ProductShowcase } from '../components/ProductShowcase'
import { Testimonial } from '../components/Testimonial'
import { HowItWorks } from '../components/HowItWorks'
import { CTA } from '../components/CTA'
import '../../../styles/home.css'

export function Home() {
  const { token, loading } = useAuth()

  if (loading) return null
  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div style={{ backgroundColor: '#0f1117', minHeight: '100vh' }}>
      <PublicNavbar />
      <div style={{ paddingTop: 60 }}>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks /> {/* ← Subido acá para guiar mejor la conversión */}
        <ProductShowcase />
        <Testimonial />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}