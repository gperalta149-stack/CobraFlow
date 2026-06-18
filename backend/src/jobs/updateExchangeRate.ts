import cron from 'node-cron'
import { updateDailyExchangeRate } from '../services/exchangeRateService'

// Programar actualización diaria a las 9:00 AM (cuando abre el mercado)
export const startExchangeRateJob = () => {
  // Actualizar a las 9:00 AM todos los días
  cron.schedule('0 9 * * *', async () => {
    console.log('🔄 Actualizando cotización del dólar...')
    try {
      await updateDailyExchangeRate()
      console.log('✅ Cotización actualizada correctamente')
    } catch (error) {
      console.error('❌ Error actualizando cotización:', error)
    }
  })
  
  // Actualización adicional a las 3:00 PM (cierre del mercado)
  cron.schedule('0 15 * * *', async () => {
    console.log('🔄 Actualizando cotización del dólar (cierre)...')
    try {
      await updateDailyExchangeRate()
      console.log('✅ Cotización actualizada correctamente')
    } catch (error) {
      console.error('❌ Error actualizando cotización:', error)
    }
  })
  
  console.log('📊 Job de cotización de dólar programado (9:00 y 15:00)')
}

// Función para ejecutar una actualización inmediata (para pruebas)
export const runImmediateUpdate = async () => {
  console.log('🔄 Ejecutando actualización inmediata de cotización...')
  return await updateDailyExchangeRate()
}