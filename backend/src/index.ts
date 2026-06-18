import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/authRoutes'
import clientesRoutes from './routes/clientesRoutes'
import dashboardRoutes from './routes/dashboardRoutes'
import deudasRoutes from './routes/deudasRoutes'
import exchangeRateRoutes from './routes/exchangeRateRoutes'
import pagosRoutes from './routes/pagosRoutes'
import { startExchangeRateJob } from './jobs/updateExchangeRate'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors({
  origin: '*',
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

app.get('/', (req, res) => {
  res.json({ mensaje: 'CobraFlow API funcionando' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

// Iniciar job de cotización de dólar
startExchangeRateJob()