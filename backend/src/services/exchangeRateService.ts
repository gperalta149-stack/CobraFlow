import { supabase } from '../config/supabase'

// Consulta DolarAPI. Si la API falla o devuelve algo inválido, lanza un error:
// nunca se inventa una cotización (antes se devolvía un 1400/1450 fijo que luego se guardaba como real).
const consultarDolarApi = async (tipo: 'oficial' | 'blue') => {
  const response = await fetch(`https://dolarapi.com/v1/dolares/${tipo}`)
  if (!response.ok) {
    throw new Error(`DolarAPI (${tipo}) respondió ${response.status}`)
  }

  const data = await response.json()
  const compra = Number(data.compra)
  const venta = Number(data.venta)
  if (!(compra > 0) || !(venta > 0)) {
    throw new Error(`DolarAPI (${tipo}) devolvió una cotización inválida`)
  }

  return { compra, venta, fecha: new Date().toISOString(), fuente: tipo }
}

// Obtener cotización oficial desde API externa
export const fetchOfficialExchangeRate = async () => consultarDolarApi('oficial')

// Obtener cotización blue desde API externa
export const fetchBlueExchangeRate = async () => consultarDolarApi('blue')

// ============================================
// GUARDAR COTIZACIÓN (USANDO RPC CON UPSERT)
// ============================================
export const saveExchangeRate = async (compra: number, venta: number, fuente: string) => {
  // Asegurar orden correcto: compra MENOR, venta MAYOR
  const compraFinal = Math.min(compra, venta)
  const ventaFinal = Math.max(compra, venta)
  
  // ✅ Usar la RPC guardar_cotizacion que ya existe en la BD
  // Esta función hace ON CONFLICT (fecha) DO UPDATE
  const { data, error } = await supabase
    .rpc('guardar_cotizacion', {
      p_compra: compraFinal,
      p_venta: ventaFinal,
      p_fuente: fuente
    })
    .single()
  
  if (error) {
    console.error('Error guardando cotización con RPC:', error)
    throw error
  }
  
  return data
}

// ============================================
// OBTENER COTIZACIÓN ACTUAL (USANDO RPC)
// ============================================
export const getCurrentExchangeRate = async () => {
  try {
    // ✅ Usar la RPC obtener_cotizacion_vigente() para consistencia
    const { data, error } = await supabase
      .rpc('obtener_cotizacion_vigente')
      .single()
    
    if (error) {
      console.error('Error getting current exchange rate:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error inesperado en getCurrentExchangeRate:', error)
    return null
  }
}

// ============================================
// ACTUALIZAR COTIZACIÓN DIARIA
// ============================================
export const updateDailyExchangeRate = async () => {
  try {
    // Intentar obtener cotización oficial
    const officialRate = await fetchOfficialExchangeRate()
    
    const saved = await saveExchangeRate(
      officialRate.compra,
      officialRate.venta,
      'oficial_daily'
    )
    
    console.log('✅ Cotización diaria actualizada:', saved)
    return saved
  } catch (error) {
    console.error('❌ Error updating daily exchange rate:', error)
    throw error
  }
}

// ============================================
// ACTUALIZAR COTIZACIÓN BLUE (MANUAL)
// ============================================
export const updateBlueExchangeRate = async () => {
  try {
    const blueRate = await fetchBlueExchangeRate()
    
    const saved = await saveExchangeRate(
      blueRate.compra,
      blueRate.venta,
      'blue_manual'
    )
    
    console.log('✅ Cotización blue actualizada:', saved)
    return saved
  } catch (error) {
    console.error('❌ Error updating blue exchange rate:', error)
    throw error
  }
}

// ============================================
// COTIZACIÓN SIEMPRE AL DÍA
// ============================================
export interface CotizacionGuardada {
  fecha: string
  compra: number
  venta: number
  fuente: string
  es_hoy: boolean
}

const ESPERA_ENTRE_INTENTOS_MS = 10 * 60 * 1000
let ultimoIntentoFallido = 0

// Devuelve la cotización guardada. Si no es de hoy, intenta actualizarla desde la API
// en el momento (no depende de que el cron haya corrido). Si la API falla, devuelve la
// última guardada marcada con es_hoy = false, para que la pantalla pueda avisar.
export const getCotizacionActualizada = async (): Promise<CotizacionGuardada | null> => {
  const guardada = (await getCurrentExchangeRate()) as CotizacionGuardada | null
  if (guardada?.es_hoy) return guardada

  // Si la API falló hace poco, no insistimos en cada request
  if (Date.now() - ultimoIntentoFallido < ESPERA_ENTRE_INTENTOS_MS) return guardada

  try {
    await updateDailyExchangeRate()
    const nueva = (await getCurrentExchangeRate()) as CotizacionGuardada | null
    return nueva ?? guardada
  } catch (error) {
    ultimoIntentoFallido = Date.now()
    console.error('No se pudo refrescar la cotización, se usa la última guardada:', error)
    return guardada
  }
}
