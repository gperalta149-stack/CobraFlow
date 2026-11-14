import { timingSafeEqual } from 'crypto'
import { NextFunction, Request, Response, Router } from 'express'
import { updateDailyExchangeRate } from '../services/exchangeRateService'
import { ejecutarRecordatorios } from '../services/recordatoriosService'

const router = Router()

// Protege los endpoints de jobs: solo quien conozca CRON_SECRET puede dispararlos.
const verificarCronSecret = (req: Request, res: Response, next: NextFunction): void => {
  const esperado = process.env.CRON_SECRET
  if (!esperado) {
    res.status(503).json({ error: 'CRON_SECRET no está configurado en el servidor' })
    return
  }

  const recibido = req.header('x-cron-secret') ?? ''
  const a = Buffer.from(recibido)
  const b = Buffer.from(esperado)

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }
  next()
}

router.post('/recordatorios', verificarCronSecret, async (_req: Request, res: Response) => {
  try {
    const resultado = await ejecutarRecordatorios()
    res.json({ ok: true, ...resultado })
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    console.error('❌ Error en job de recordatorios:', mensaje)
    res.status(500).json({ ok: false, error: mensaje })
  }
})

router.post('/cotizacion', verificarCronSecret, async (_req: Request, res: Response) => {
  try {
    await updateDailyExchangeRate()
    res.json({ ok: true })
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    console.error('❌ Error en job de cotización:', mensaje)
    res.status(500).json({ ok: false, error: mensaje })
  }
})

export default router
