// backend/src/controllers/monedaController.ts
import { Response } from 'express'
import { AuthRequest } from '../middleware/authMiddleware'
import { supabase } from '../config/supabase'

const DEFAULT_MONEDA_CONFIG = {
  mostrarEquivalencias: true,
  mostrarUsdEnArs: true,
  mostrarArsEnUsd: true,
  secciones: {
    dashboard: true,
    deudas: true,
    pagos: true,
    analisis: true,
  }
}

export const getConfiguracionMoneda = async (req: AuthRequest, res: Response) => {
  try {
    const usuario_id = req.usuario?.id
    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    // Verificar que el usuario existe y está activo
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('id, activo')
      .eq('id', usuario_id)
      .single()

    if (userError || !usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Usuario inválido o inactivo' })
    }

    const { data, error } = await supabase
      .from('configuracion_moneda')
      .select('*')
      .eq('usuario_id', usuario_id)
      .maybeSingle()

    if (error) {
      console.error('Error obteniendo configuración:', error)
      return res.status(500).json({ error: 'Error al obtener configuración' })
    }

    if (!data) {
      return res.json(DEFAULT_MONEDA_CONFIG)
    }

    res.json({
      mostrarEquivalencias: data.mostrar_equivalencias ?? DEFAULT_MONEDA_CONFIG.mostrarEquivalencias,
      mostrarUsdEnArs: data.mostrar_usd_en_ars ?? DEFAULT_MONEDA_CONFIG.mostrarUsdEnArs,
      mostrarArsEnUsd: data.mostrar_ars_en_usd ?? DEFAULT_MONEDA_CONFIG.mostrarArsEnUsd,
      secciones: {
        dashboard: data.seccion_dashboard ?? DEFAULT_MONEDA_CONFIG.secciones.dashboard,
        deudas: data.seccion_deudas ?? DEFAULT_MONEDA_CONFIG.secciones.deudas,
        pagos: data.seccion_pagos ?? DEFAULT_MONEDA_CONFIG.secciones.pagos,
        analisis: data.seccion_analisis ?? DEFAULT_MONEDA_CONFIG.secciones.analisis,
      }
    })
  } catch (error) {
    console.error('Error en getConfiguracionMoneda:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const updateConfiguracionMoneda = async (req: AuthRequest, res: Response) => {
  try {
    const usuario_id = req.usuario?.id
    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    // Verificar que el usuario existe y está activo
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('id, activo')
      .eq('id', usuario_id)
      .single()

    if (userError || !usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Usuario inválido o inactivo' })
    }

    const { mostrarEquivalencias, mostrarUsdEnArs, mostrarArsEnUsd, secciones } = req.body

    // Validar datos
    if (typeof mostrarEquivalencias !== 'boolean' || 
        typeof mostrarUsdEnArs !== 'boolean' || 
        typeof mostrarArsEnUsd !== 'boolean') {
      return res.status(400).json({ error: 'Datos inválidos' })
    }

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('configuracion_moneda')
      .select('id')
      .eq('usuario_id', usuario_id)
      .maybeSingle()

    let result

    if (existing) {
      result = await supabase
        .from('configuracion_moneda')
        .update({
          mostrar_equivalencias: mostrarEquivalencias,
          mostrar_usd_en_ars: mostrarUsdEnArs,
          mostrar_ars_en_usd: mostrarArsEnUsd,
          seccion_dashboard: secciones?.dashboard,
          seccion_deudas: secciones?.deudas,
          seccion_pagos: secciones?.pagos,
          seccion_analisis: secciones?.analisis,
          updated_at: new Date().toISOString()
        })
        .eq('usuario_id', usuario_id)
    } else {
      result = await supabase
        .from('configuracion_moneda')
        .insert({
          usuario_id,
          mostrar_equivalencias: mostrarEquivalencias,
          mostrar_usd_en_ars: mostrarUsdEnArs,
          mostrar_ars_en_usd: mostrarArsEnUsd,
          seccion_dashboard: secciones?.dashboard,
          seccion_deudas: secciones?.deudas,
          seccion_pagos: secciones?.pagos,
          seccion_analisis: secciones?.analisis
        })
    }

    if (result.error) {
      console.error('Error guardando configuración:', result.error)
      return res.status(500).json({ error: 'Error al guardar configuración' })
    }

    res.json({ message: 'Configuración guardada correctamente' })
  } catch (error) {
    console.error('Error en updateConfiguracionMoneda:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}