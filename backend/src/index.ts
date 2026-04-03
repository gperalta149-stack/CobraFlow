import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import clientesRoutes from './routes/clientesRoutes'
import deudasRoutes from './routes/deudasRoutes'
import pagosRoutes from './routes/pagosRoutes'
import dashboardRoutes from './routes/dashboardRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/clientes', clientesRoutes)
app.use('/api/deudas', deudasRoutes)
app.use('/api/pagos', pagosRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'CobraFlow API funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})