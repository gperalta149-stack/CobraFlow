import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/authRoutes'
import clientesRoutes from './routes/clientesRoutes'
import dashboardRoutes from './routes/dashboardRoutes'
import deudasRoutes from './routes/deudasRoutes'
import exchangeRateRoutes from './routes/exchangeRateRoutes'
import jobsRoutes from './routes/jobsRoutes'
import pagosRoutes from './routes/pagosRoutes'
import { startExchangeRateJob } from './jobs/updateExchangeRate'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(cors({
  origin: allowedOrigins,
  credentials: false
}))
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/clientes', clientesRoutes)
app.use('/api/deudas', deudasRoutes)
app.use('/api/pagos', pagosRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/exchange-rate', exchangeRateRoutes)
app.use('/api/jobs', jobsRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'CobraFlow API funcionando' })
})

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

// 404 — ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Error handler global — siempre al final, con 4 parámetros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error no manejado:', err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

// Iniciar job de cotización de dólar
startExchangeRateJob()