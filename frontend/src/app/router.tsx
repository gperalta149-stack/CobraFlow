// frontend/src/app/router.tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'

import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import { Home } from '../features/home/pages/Home'
import Dashboard from '../features/dashboard/pages/Dashboard'
import Analisis from '../features/analisis/pages/Analisis'
import Clientes from '../features/clientes/pages/Clientes'
import Deudas from '../features/deudas/pages/Deudas'
import Pagos from '../features/pagos/pages/Pagos'
import Perfil from '../features/perfil/pages/Perfil'
import Configuracion from '../features/perfil/pages/Configuracion'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analisis" element={<Analisis />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/deudas" element={<Deudas />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/configuracion/mora" element={<Configuracion />} />
          <Route path="/configuracion/moneda" element={<Configuracion />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}