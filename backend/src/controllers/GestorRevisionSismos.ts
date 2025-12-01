/**
 * GestorRevisionSismos - Controlador GRASP
 * 
 * Caso de Uso: Registrar Resultado de Revisión Manual
 * Patrón: Controller (GRASP), Singleton
 * 
 * Responsabilidad: Coordina el caso de uso completo.
 * Interacción: Pantalla → GestorRevisionSismos → Base de Datos
 * 
 * Métodos principales (según diagrama de secuencia):
 * - obtenerEventosSismicosAutodetectados() → Paso 2 del CU
 * - bloquearEvento() → Paso 4 del CU
 * - buscarDatosSismicos() → Paso 5 del CU
 * - rechazarEvento() → Pasos 11-13 del CU
 * - confirmarEvento() → Flujo alternativo
 * - derivarEvento() → Flujo alternativo
 * 
 * Base de datos: MySQL (Docker container: mi_mysql_container)
 */

import mysql, { Pool, RowDataPacket } from 'mysql2/promise'

export default class GestorRevisionSismos {
  private static instance: GestorRevisionSismos
  private pool: Pool

  private constructor() {
    this.pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '12345',
      database: 'sismografo',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }

  /** Singleton - Obtener instancia única del gestor */
  public static getInstance(): GestorRevisionSismos {
    if (!GestorRevisionSismos.instance) {
      GestorRevisionSismos.instance = new GestorRevisionSismos()
    }
    return GestorRevisionSismos.instance
  }

  // ==========================================
  // PASO 2: OBTENER EVENTOS AUTODETECTADOS
  // ==========================================

  /**
   * Paso 2 del CU: Buscar eventos sísmicos autodetectados no revisados
   * Ordenados por fecha/hora de ocurrencia
   * @returns Lista de eventos con estado auto_detectado o pendiente_de_revision
   */
  async obtenerEventosSismicosAutodetectados(): Promise<any[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>(`
      SELECT 
        e.id,
        e.identificador_evento as identificadorEvento,
        e.fecha_hora_ocurrencia as fechaHoraOcurrencia,
        e.latitud_epicentro as latitudEpicentro,
        e.latitud_hipocentro as latitudHipocentro,
        e.longitud_epicentro as longitudEpicentro,
        e.longitud_hipocentro as longitudHipocentro,
        e.valor_magnitud as valorMagnitud,
        e.profundidad,
        est.nombre as estadoActualNombre,
        est.id as estadoActualId,
        og.nombre as origenGeneracion
      FROM EventoSismico e
      JOIN Estado est ON e.estado_actual_id = est.id
      LEFT JOIN OrigenDeGeneracion og ON e.origen_id = og.id
      WHERE est.nombre IN ('auto_detectado', 'pendiente_de_revision')
      ORDER BY e.fecha_hora_ocurrencia ASC
    `)
    return rows
  }

  // ==========================================
  // PASO 4: BLOQUEAR EVENTO
  // ==========================================

  /**
   * Paso 4 del CU: Bloquear evento seleccionado
   * Cambia el estado a bloqueado_en_revision
   * @param identificador - ID numérico o identificador del evento
   */
  async bloquearEvento(identificador: string): Promise<void> {
    const connection = await this.pool.getConnection()
    try {
      await connection.beginTransaction()

      // Buscar evento
      const [eventoRows] = await connection.query<RowDataPacket[]>(
        'SELECT id, estado_actual_id FROM EventoSismico WHERE id = ? OR identificador_evento = ?',
        [identificador, identificador]
      )
      if (eventoRows.length === 0) throw new Error('Evento no encontrado')
      
      const eventoId = eventoRows[0].id

      // Buscar estado bloqueado_en_revision
      const [estadoRows] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM Estado WHERE nombre = 'bloqueado_en_revision'"
      )
      const estadoBloqueadoId = estadoRows[0].id

      // Cerrar cambio de estado anterior (setFechaHoraFin)
      await connection.query(
        'UPDATE CambioEstado SET fecha_hora_fin = NOW() WHERE evento_sismico_id = ? AND fecha_hora_fin IS NULL',
        [eventoId]
      )

      // Crear nuevo CambioEstado
      await connection.query(
        'INSERT INTO CambioEstado (fecha_hora_inicio, fecha_hora_fin, estado_id, evento_sismico_id, empleado_id) VALUES (NOW(), NULL, ?, ?, ?)',
        [estadoBloqueadoId, eventoId, 1] // empleado_id = 1 por defecto
      )

      // Actualizar estado actual del evento
      await connection.query(
        'UPDATE EventoSismico SET estado_actual_id = ? WHERE id = ?',
        [estadoBloqueadoId, eventoId]
      )

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  // ==========================================
  // PASO 5: BUSCAR DATOS SÍSMICOS
  // ==========================================

  /**
   * Paso 5 del CU: Obtener datos sísmicos del evento
   * Incluye: evento, origen de generación, series temporales por estación
   * @param identificador - ID del evento
   */
  async buscarDatosSismicos(identificador: string): Promise<any> {
    // Buscar evento
    const [eventoRows] = await this.pool.query<RowDataPacket[]>(`
      SELECT 
        e.id,
        e.identificador_evento as identificadorEvento,
        e.fecha_hora_ocurrencia as fechaHoraOcurrencia,
        e.latitud_epicentro as latitudEpicentro,
        e.latitud_hipocentro as latitudHipocentro,
        e.longitud_epicentro as longitudEpicentro,
        e.longitud_hipocentro as longitudHipocentro,
        e.valor_magnitud as valorMagnitud,
        e.profundidad,
        est.nombre as estadoActualNombre,
        og.nombre as origenGeneracion
      FROM EventoSismico e
      JOIN Estado est ON e.estado_actual_id = est.id
      LEFT JOIN OrigenDeGeneracion og ON e.origen_id = og.id
      WHERE e.id = ? OR e.identificador_evento = ?
    `, [identificador, identificador])
    
    if (eventoRows.length === 0) throw new Error('Evento no encontrado')
    const evento = eventoRows[0]

    // Buscar series temporales con estación
    const [series] = await this.pool.query<RowDataPacket[]>(`
      SELECT 
        st.id,
        st.fecha_hora_inicio_registro as fechaHoraInicioRegistro,
        st.fecha_hora_registro as fechaHoraRegistro,
        st.frecuencia_muestreo as frecuenciaMuestreo,
        st.condicion_alarma as condicionAlarma,
        s.identificador as sismografoId,
        es.codigo_estacion as codigoEstacion,
        es.nombre as nombreEstacion
      FROM SerieTemporal st
      JOIN Sismografo s ON st.sismografo_id = s.id
      JOIN EstacionSismologica es ON s.estacion_id = es.id
      WHERE st.evento_sismico_id = ?
    `, [evento.id])

    return {
      evento,
      origenGeneracion: evento.origenGeneracion,
      seriesTemporales: series
    }
  }

  // ==========================================
  // PASOS 11-13: RECHAZAR EVENTO
  // ==========================================

  /**
   * Pasos 11-13 del CU: Rechazar evento
   * Cambia el estado a rechazado
   * @param identificador - ID del evento
   */
  async rechazarEvento(identificador: string): Promise<void> {
    const connection = await this.pool.getConnection()
    try {
      await connection.beginTransaction()

      const [eventoRows] = await connection.query<RowDataPacket[]>(
        'SELECT id FROM EventoSismico WHERE id = ? OR identificador_evento = ?',
        [identificador, identificador]
      )
      if (eventoRows.length === 0) throw new Error('Evento no encontrado')
      
      const eventoId = eventoRows[0].id

      const [estadoRows] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM Estado WHERE nombre = 'rechazado'"
      )
      const estadoRechazadoId = estadoRows[0].id

      await connection.query(
        'UPDATE CambioEstado SET fecha_hora_fin = NOW() WHERE evento_sismico_id = ? AND fecha_hora_fin IS NULL',
        [eventoId]
      )

      await connection.query(
        'INSERT INTO CambioEstado (fecha_hora_inicio, fecha_hora_fin, estado_id, evento_sismico_id, empleado_id) VALUES (NOW(), NULL, ?, ?, ?)',
        [estadoRechazadoId, eventoId, 1]
      )

      await connection.query(
        'UPDATE EventoSismico SET estado_actual_id = ? WHERE id = ?',
        [estadoRechazadoId, eventoId]
      )

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  // ==========================================
  // FLUJO ALTERNATIVO: CONFIRMAR EVENTO
  // ==========================================

  /**
   * Flujo alternativo: Confirmar evento
   * Cambia el estado a confirmado
   * @param identificador - ID del evento
   */
  async confirmarEvento(identificador: string): Promise<void> {
    const connection = await this.pool.getConnection()
    try {
      await connection.beginTransaction()

      const [eventoRows] = await connection.query<RowDataPacket[]>(
        'SELECT id FROM EventoSismico WHERE id = ? OR identificador_evento = ?',
        [identificador, identificador]
      )
      if (eventoRows.length === 0) throw new Error('Evento no encontrado')
      
      const eventoId = eventoRows[0].id

      const [estadoRows] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM Estado WHERE nombre = 'confirmado'"
      )
      const estadoConfirmadoId = estadoRows[0].id

      await connection.query(
        'UPDATE CambioEstado SET fecha_hora_fin = NOW() WHERE evento_sismico_id = ? AND fecha_hora_fin IS NULL',
        [eventoId]
      )

      await connection.query(
        'INSERT INTO CambioEstado (fecha_hora_inicio, fecha_hora_fin, estado_id, evento_sismico_id, empleado_id) VALUES (NOW(), NULL, ?, ?, ?)',
        [estadoConfirmadoId, eventoId, 1]
      )

      await connection.query(
        'UPDATE EventoSismico SET estado_actual_id = ? WHERE id = ?',
        [estadoConfirmadoId, eventoId]
      )

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  // ==========================================
  // FLUJO ALTERNATIVO: DERIVAR A EXPERTO
  // ==========================================

  /**
   * Flujo alternativo: Derivar evento a experto
   * Cambia el estado a derivado_experto
   * @param identificador - ID del evento
   */
  async derivarEvento(identificador: string): Promise<void> {
    const connection = await this.pool.getConnection()
    try {
      await connection.beginTransaction()

      const [eventoRows] = await connection.query<RowDataPacket[]>(
        'SELECT id FROM EventoSismico WHERE id = ? OR identificador_evento = ?',
        [identificador, identificador]
      )
      if (eventoRows.length === 0) throw new Error('Evento no encontrado')
      
      const eventoId = eventoRows[0].id

      const [estadoRows] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM Estado WHERE nombre = 'derivado_experto'"
      )
      const estadoDerivadoId = estadoRows[0].id

      await connection.query(
        'UPDATE CambioEstado SET fecha_hora_fin = NOW() WHERE evento_sismico_id = ? AND fecha_hora_fin IS NULL',
        [eventoId]
      )

      await connection.query(
        'INSERT INTO CambioEstado (fecha_hora_inicio, fecha_hora_fin, estado_id, evento_sismico_id, empleado_id) VALUES (NOW(), NULL, ?, ?, ?)',
        [estadoDerivadoId, eventoId, 1]
      )

      await connection.query(
        'UPDATE EventoSismico SET estado_actual_id = ? WHERE id = ?',
        [estadoDerivadoId, eventoId]
      )

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }
}
