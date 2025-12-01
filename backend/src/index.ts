/**
 * index.ts - Punto de Entrada del Backend
 * 
 * Sistema: Centro de Registro Sísmico (CCRS)
 * Caso de Uso: Registrar Resultado de Revisión Manual
 * 
 * Este archivo configura el servidor Express y define los endpoints REST
 * para el caso de uso de revisión manual de eventos sísmicos.
 * 
 * Tecnologías:
 * - Express.js (servidor HTTP)
 * - MySQL (persistencia via DatabaseService)
 * - Docker (contenedor de base de datos)
 * 
 * @author Grupo 3 - Diseño de Sistemas
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import GestorRevisionSismos from './controllers/GestorRevisionSismos'
import PantRegResRevManual from '../../pantalla/PanRegResRevManual'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Gestor del caso de uso (Singleton)
const gestor = GestorRevisionSismos.getInstance()
const pantalla = new PantRegResRevManual() 

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================

app.get('/', (_req, res) => {
  const html = pantalla.render()
  res.setHeader('Content-Type', 'text/html')
  res.send(html)
})

// ==========================================
// API REST - CASO DE USO CON PERSISTENCIA
// ==========================================

/**
 * Paso 2 del CU: Obtener eventos autodetectados
 * Usa persistencia MySQL
 */
app.get('/api/eventos/autodetectados', async (_req, res) => {
  try {
    const eventos = await gestor.obtenerEventosSismicosAutodetectados()
    res.json(eventos)
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message ?? 'Error al obtener eventos' })
  }
})

/**
 * Paso 5 del CU: Obtener datos sísmicos del evento
 */
app.get('/api/eventos/:id/datos', async (req, res) => {
  const identificador = req.params.id
  try {
    const datos = await gestor.buscarDatosSismicos(identificador)
    res.json(datos)
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message ?? 'Error al obtener datos del evento' })
  }
})

/**
 * Paso 4 del CU: Bloquear evento
 * Persiste el cambio en MySQL
 */
app.post('/api/eventos/:id/bloquear', async (req, res) => {
  const identificador = req.params.id
  console.log('Bloquear evento:', identificador)
  try {
    await gestor.bloquearEvento(identificador)
    console.log('OK - Evento bloqueado y persistido')
    res.status(200).json({ message: 'Evento bloqueado exitosamente' })
  } catch (error: any) {
    console.error('ERROR:', error)
    res.status(500).json({ error: error.message ?? 'Error al bloquear evento' })
  }
})

/**
 * Paso 11-13 del CU: Rechazar evento
 */
app.post('/api/eventos/:id/rechazar', async (req, res) => {
  const identificador = req.params.id
  console.log('Rechazar evento:', identificador)
  try {
    await gestor.rechazarEvento(identificador)
    console.log('OK - Evento rechazado y persistido')
    res.status(200).json({ message: 'Evento rechazado exitosamente' })
  } catch (error: any) {
    console.error('ERROR:', error)
    res.status(500).json({ error: error.message ?? 'Error al rechazar evento' })
  }
})

/**
 * Flujo alternativo: Confirmar evento
 */
app.post('/api/eventos/:id/confirmar', async (req, res) => {
  const identificador = req.params.id
  console.log('Confirmar evento:', identificador)
  try {
    await gestor.confirmarEvento(identificador)
    console.log('OK - Evento confirmado y persistido')
    res.status(200).json({ message: 'Evento confirmado exitosamente' })
  } catch (error: any) {
    console.error('ERROR:', error)
    res.status(500).json({ error: error.message ?? 'Error al confirmar evento' })
  }
})

/**
 * Flujo alternativo: Derivar evento a experto
 */
app.post('/api/eventos/:id/derivar', async (req, res) => {
  const identificador = req.params.id
  console.log('Derivar evento:', identificador)
  try {
    await gestor.derivarEvento(identificador)
    console.log('OK - Evento derivado y persistido')
    res.status(200).json({ message: 'Evento derivado a experto exitosamente' })
  } catch (error: any) {
    console.error('ERROR:', error)
    res.status(500).json({ error: error.message ?? 'Error al derivar evento' })
  }
})

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
  console.log(`Base de datos: MySQL (Docker)`)
  console.log(`Persistencia: Activa`)
})