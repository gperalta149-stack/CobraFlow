import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'

import { Navbar } from '../../../components/layout/Navbar'
import { Footer }from '../../../components/layout/Footer'

import { Hero } from '../components/Hero'
import { SocialProof } from '../components/SocialProof'
import { HowItWorks } from '../components/HowItWorks'
import { Features } from '../components/Features'
import { Testimonial } from '../components/Testimonial'
import { Stats } from '../components/Stats'
import { CTA } from '../components/CTA'

export function Home() {
  const { token } = useAuth()

  if (token) return <Navigate to="/dashboard" replace />

  return (
    <>
      <Navbar />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <Testimonial />
      <Stats />
      <CTA />
      <Footer />
    </>
  )
}