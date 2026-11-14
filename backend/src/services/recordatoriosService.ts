import nodemailer, { Transporter } from 'nodemailer'
import { supabase } from '../config/supabase'
import { actualizarMoraAcumulada } from '../controllers/deudasController'

type TipoAviso = 'previo_3d' | 'vencimiento' | 'vencida_7d'
type Moneda = 'ARS' | 'USD'

interface ClienteEmbebido {
  nombre: string
  apellido: string | null
  email: string | null
}

interface DeudaParaAviso {
  id: string
  usuario_id: string
  descripcion: string
  moneda: Moneda
  saldo_pendiente: number
  monto_mora_acumulada: number | null
  fecha_vencimiento: string
  clientes: ClienteEmbebido | null
}

export interface ResultadoRecordatorios {
  usuariosConMoraActualizada: number
  avisosEnviados: number
  avisosOmitidos: number
  avisosFallidos: number
}

const ZONA_HORARIA = 'America/Argentina/Cordoba'
const MS_POR_DIA = 86_400_000

// Fecha de hoy en Argentina, formato YYYY-MM-DD
const hoyArgentina = (): string =>
  new Date().toLocaleDateString('en-CA', { timeZone: ZONA_HORARIA })

const aUtc = (fecha: string): number => {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-').map(Number)
  return Date.UTC(anio, mes - 1, dia)
}

// Positivo: faltan N días. 0: vence hoy. Negativo: lleva N días vencida.
const diasHastaVencimiento = (fechaVencimiento: string, hoy: string): number =>
  Math.round((aUtc(fechaVencimiento) - aUtc(hoy)) / MS_POR_DIA)

// Cada deuda recibe, como máximo, un aviso por tipo. Si el job se saltea un día,
// el aviso se envía en la próxima corrida (no depende de coincidir con el día exacto).
const tipoDeAviso = (dias: number): TipoAviso | null => {
  if (dias >= 1 && dias <= 3) return 'previo_3d'
  if (dias <= 0 && dias > -7) return 'vencimiento'
  if (dias <= -7) return 'vencida_7d'
  return null
}

const escapeHtml = (texto: string): string =>
  texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const formatearMonto = (monto: number, moneda: Moneda): string =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(monto)

interface MensajeEmail {
  from: string
  to: string
  subject: string
  html: string
}

type Enviador = (mensaje: MensajeEmail) => Promise<void>

// Envío por SMTP (Gmail). Sirve en tu PC, pero Render gratis bloquea los puertos SMTP.
const crearTransporteSmtp = (): Transporter => {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    throw new Error('Falta configurar el email: definí RESEND_API_KEY, o SMTP_USER y SMTP_PASS')
  }
  const port = Number(process.env.SMTP_PORT) || 465
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

// Si existe RESEND_API_KEY se envía por la API HTTPS de Resend (funciona en Render gratis).
// Si no, se usa SMTP.
const crearEnviador = (): Enviador => {
  const resendKey = process.env.RESEND_API_KEY

  if (resendKey) {
    return async (mensaje: MensajeEmail): Promise<void> => {
      const respuesta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: mensaje.from,
          to: [mensaje.to],
          subject: mensaje.subject,
          html: mensaje.html,
        }),
        signal: AbortSignal.timeout(15_000),
      })
      if (!respuesta.ok) {
        const detalle = await respuesta.text()
        throw new Error(`Resend respondió ${respuesta.status}: ${detalle}`)
      }
    }
  }

  const transporte = crearTransporteSmtp()
  return async (mensaje: MensajeEmail): Promise<void> => {
    await transporte.sendMail(mensaje)
  }
}

const armarMensaje = (
  deuda: DeudaParaAviso,
  tipo: TipoAviso,
  dias: number
): { asunto: string; html: string } => {
  const nombre = escapeHtml(
    [deuda.clientes?.nombre, deuda.clientes?.apellido].filter(Boolean).join(' ')
  )
  const descripcion = escapeHtml(deuda.descripcion)
  const saldo = formatearMonto(Number(deuda.saldo_pendiente), deuda.moneda)
  const mora = Number(deuda.monto_mora_acumulada ?? 0)

  let asunto: string
  let situacion: string

  if (tipo === 'previo_3d') {
    asunto = `Tu pago vence en ${dias} ${dias === 1 ? 'día' : 'días'}`
    situacion = `vence en ${dias} ${dias === 1 ? 'día' : 'días'}`
  } else if (tipo === 'vencimiento') {
    asunto = dias === 0 ? 'Tu pago vence hoy' : `Tu pago está vencido hace ${-dias} días`
    situacion = dias === 0 ? 'vence hoy' : `venció hace ${-dias} días`
  } else {
    asunto = `Pago vencido hace ${-dias} días`
    situacion = `lleva ${-dias} días vencida`
  }

  const lineaMora =
    mora > 0
      ? `<p>Mora acumulada: <strong>${formatearMonto(mora, deuda.moneda)}</strong></p>`
      : ''

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px;">
      <p>Hola ${nombre},</p>
      <p>Te recordamos que la deuda "<strong>${descripcion}</strong>" ${situacion}.</p>
      <p>Saldo pendiente: <strong>${saldo}</strong></p>
      ${lineaMora}
      <p>Si ya realizaste el pago, ignorá este mensaje.</p>
      <p style="color:#666;font-size:12px;">Enviado por CobraFlow</p>
    </div>`

  return { asunto, html }
}

export const ejecutarRecordatorios = async (): Promise<ResultadoRecordatorios> => {
  const resultado: ResultadoRecordatorios = {
    usuariosConMoraActualizada: 0,
    avisosEnviados: 0,
    avisosOmitidos: 0,
    avisosFallidos: 0,
  }

  // 1) Mantener al día estados y mora. Hoy esto solo ocurre cuando alguien abre /deudas.
  const { error: errorVencidas } = await supabase.rpc('actualizar_deudas_vencidas')
  if (errorVencidas) {
    throw new Error(`actualizar_deudas_vencidas falló: ${errorVencidas.message}`)
  }

  const { data: usuariosConMora, error: errorUsuarios } = await supabase
    .from('usuarios')
    .select('id')
    .eq('mora_activa', true)
    .returns<{ id: string }[]>()
  if (errorUsuarios) {
    throw new Error(`No se pudieron leer los usuarios: ${errorUsuarios.message}`)
  }

  for (const usuario of usuariosConMora ?? []) {
    await actualizarMoraAcumulada(usuario.id)
    resultado.usuariosConMoraActualizada++
  }

  // 2) Avisos por email
  const enviar = crearEnviador()
  const remitente = process.env.MAIL_FROM || process.env.SMTP_USER
  if (!remitente) {
    throw new Error('Falta la variable MAIL_FROM')
  }
  // Modo demo: si está definida, TODOS los mails van a esta casilla y no a los clientes.
  const destinoDemo = process.env.RECORDATORIOS_DESTINO_OVERRIDE?.trim()
  const hoy = hoyArgentina()

  const { data: deudas, error: errorDeudas } = await supabase
    .from('deudas')
    .select(
      'id, usuario_id, descripcion, moneda, saldo_pendiente, monto_mora_acumulada, fecha_vencimiento, clientes(nombre, apellido, email)'
    )
    .eq('activo', true)
    .in('estado', ['pendiente', 'parcial', 'vencida'])
    .gt('saldo_pendiente', 0)
    .returns<DeudaParaAviso[]>()
  if (errorDeudas) {
    throw new Error(`No se pudieron leer las deudas: ${errorDeudas.message}`)
  }

  for (const deuda of deudas ?? []) {
    const dias = diasHastaVencimiento(deuda.fecha_vencimiento, hoy)
    const tipo = tipoDeAviso(dias)
    const emailCliente = deuda.clientes?.email

    if (!tipo || !emailCliente) {
      resultado.avisosOmitidos++
      continue
    }

    const destinatario = destinoDemo || emailCliente

    // Reservar el aviso: si ya existe (deuda_id, tipo), no devuelve filas y se omite.
    const { data: reservado, error: errorReserva } = await supabase
      .from('notificaciones')
      .upsert(
        { deuda_id: deuda.id, usuario_id: deuda.usuario_id, tipo, canal: 'email', destinatario },
        { onConflict: 'deuda_id,tipo', ignoreDuplicates: true }
      )
      .select('id')
      .returns<{ id: string }[]>()

    if (errorReserva) {
      console.error(`❌ No se pudo reservar el aviso de la deuda ${deuda.id}:`, errorReserva.message)
      resultado.avisosFallidos++
      continue
    }
    if (!reservado || reservado.length === 0) {
      resultado.avisosOmitidos++
      continue
    }

    const { asunto, html } = armarMensaje(deuda, tipo, dias)

    try {
      await enviar({ from: remitente, to: destinatario, subject: asunto, html })
      resultado.avisosEnviados++
    } catch (error: unknown) {
      // Liberar la reserva para que se reintente en la próxima corrida
      await supabase.from('notificaciones').delete().eq('id', reservado[0].id)
      console.error(
        `❌ Falló el envío de la deuda ${deuda.id}:`,
        error instanceof Error ? error.message : error
      )
      resultado.avisosFallidos++
    }
  }

  console.log('📨 Recordatorios:', resultado)
  return resultado
}