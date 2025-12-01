/**
 * GestorRegResEventoSismico - Controlador GRASP
 * 
 * Caso de Uso: Registrar Resultado de Revisión Manual
 * Patrón: Controller (GRASP), Singleton
 * 
 * Responsabilidad: Coordina el caso de uso completo.
 * Interacción: PantRegResEventoSismico → GestorRegResEventoSismico → Base de Datos
 * 
 * Métodos principales (según diagrama de secuencia):
 * - opcRegResultadoRevisionManual() → Paso 3: Inicia el CU
 * - buscarEventosSismicosAutoDetectados() → Paso 4: Buscar eventos
 * - ordenarEventosSismicos() → Paso 16: Ordenar eventos
 * - tomarSeleccionEventoSismico() → Paso 19: Seleccionar evento
 * - tomarFechaHoraActual() → Paso 23: Obtener fecha/hora actual
 * - buscarEmpleadoLogueado() → Paso 24: Obtener empleado logueado
 * - bloquearEventoSismico() → Paso 27: Bloquear evento
 * - buscarDatosSismicos() → Paso 37: Buscar datos sísmicos
 * - buscarSeriesTemporales() → Paso 45: Buscar series temporales
 * - ordenarSeriesTemporales() → Paso 55: Ordenar series
 * - rechazarEventoSismico() → Paso 60: Rechazar evento
 * - finCU() → Paso 73: Finalizar caso de uso
 * 
 * Base de datos: MySQL (Docker container: mi_mysql_container)
 */

import mysql, { Pool, RowDataPacket } from 'mysql2/promise'

export default class GestorRegResEventoSismico {
  private static instance: GestorRegResEventoSismico
  private pool: Pool
  private fechaHoraActual: Date | null = null
  private usuarioLogueado: any = null
  private eventoSeleccionado: any = null

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
  public static getInstance(): GestorRegResEventoSismico {
    if (!GestorRegResEventoSismico.instance) {
      GestorRegResEventoSismico.instance = new GestorRegResEventoSismico()
    }
    return GestorRegResEventoSismico.instance
  }

  // ==========================================
  // PASO 3: INICIAR CASO DE USO
  // ==========================================

  /**
   * Paso 3 del CU: Inicia el caso de uso de registro de resultado de revisión manual
   * @returns Lista de eventos sísmicos autodetectados ordenados
   */
  async opcRegResultadoRevisionManual(): Promise<any[]> {
    const eventos = await this.buscarEventosSismicosAutoDetectados()
    return this.ordenarEventosSismicos(eventos)
  }

  // ==========================================
  // PASO 4: BUSCAR EVENTOS AUTODETECTADOS
  // ==========================================

  /**
   * Paso 4 del CU: Buscar eventos sísmicos autodetectados no revisados
   * Filtra eventos que son autodetectados y pendientes de revisión
   * @returns Lista de eventos con estado auto_detectado o pendiente_de_revision
   */
  async buscarEventosSismicosAutoDetectados(): Promise<any[]> {
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

  /**
   * Paso 16 del CU: Ordenar eventos sísmicos por fecha/hora de ocurrencia
   * @param eventos - Lista de eventos a ordenar
   * @returns Lista de eventos ordenados
   */
  ordenarEventosSismicos(eventos: any[]): any[] {
    return eventos.sort((a, b) => 
      new Date(a.fechaHoraOcurrencia).getTime() - new Date(b.fechaHoraOcurrencia).getTime()
    )
  }

  /**
   * Paso 19 del CU: Tomar selección del evento sísmico
   * @param eventoId - ID del evento seleccionado
   * @returns Objeto con el evento seleccionado
   */
  async tomarSeleccionEventoSismico(eventoId: number): Promise<any> {
    this.eventoSeleccionado = eventoId
    return { eventoId }
  }

  /**
   * Paso 23 del CU: Obtener fecha/hora actual del sistema
   */
  tomarFechaHoraActual(): void {
    this.fechaHoraActual = new Date()
  }

  /**
   * Paso 24 del CU: Buscar empleado logueado en el sistema
   * Utiliza la sesión para obtener el usuario logueado
   */
  async buscarEmpleadoLogueado(): Promise<void> {
    const sesion = this.obtenerSesionActual();
    const usuario = sesion.obtenerUsuarioLogueado();
    this.usuarioLogueado = usuario.getEmpleado();
  }

  /**
   * Obtiene los datos completos del usuario logueado
   */
  async obtenerUsuarioLogueado(): Promise<any> {
    const [rows] = await this.pool.query<RowDataPacket[]>(`
      SELECT 
        u.id,
        u.nombre_usuario,
        e.nombre,
        e.apellido,
        e.mail,
        e.telefono
      FROM Sesion s
      JOIN Usuario u ON s.usuario_id = u.id
      JOIN Empleado e ON u.empleado_id = e.id
      WHERE s.id = 1
    `);
    
    if (rows.length > 0) {
      const row = rows[0];
      return {
        id: row.id,
        nombre_usuario: row.nombre_usuario,
        empleado: {
          nombre: row.nombre,
          apellido: row.apellido,
          mail: row.mail,
          telefono: row.telefono
        }
      };
    }
    return null;
  }

  /**
   * Obtiene la sesión actual del sistema
   */
  private obtenerSesionActual(): any {
    // Simula obtener la sesión actual
    return {
      obtenerUsuarioLogueado: () => ({
        getEmpleado: () => ({ id: 1, nombreUsuario: 'admin' })
      })
    };
  }

  // ==========================================
  // PASO 27: BLOQUEAR EVENTO SISMICO
  // ==========================================

  /**
   * Paso 27 del CU: Bloquear evento sísmico seleccionado
   * Cambia el estado a bloqueado_en_revision
   * @param eventoId - ID numérico o identificador del evento
   */
  async bloquearEventoSismico(eventoId: number | string): Promise<void> {
    const identificador = String(eventoId)
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
  // PASO 37: BUSCAR DATOS SISMICOS
  // ==========================================

  /**
   * Paso 37 del CU: Buscar datos sísmicos del evento
   * Incluye: alcance, clasificación, origen de generación
   * @param eventoId - ID del evento
   */
  async buscarDatosSismicos(eventoId: number | string): Promise<any> {
    const identificador = String(eventoId)
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
      clasificacion: { nombre: evento.profundidad > 70 ? 'Profundo' : 'Superficial' },
      origenDeGeneracion: { nombre: evento.origenGeneracion },
      seriesTemporales: series
    }
  }

  // ==========================================
  // PASO 45: BUSCAR SERIES TEMPORALES
  // ==========================================

  /**
   * Paso 45 del CU: Buscar series temporales del evento
   * @param eventoId - ID del evento
   * @returns Lista de series temporales
   */
  async buscarSeriesTemporales(eventoId: number | string): Promise<any[]> {
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
    `, [eventoId])
    return series
  }

  /**
   * Paso 55 del CU: Ordenar series temporales por fecha/hora de registro
   * @param series - Lista de series temporales
   * @returns Lista ordenada
   */
  ordenarSeriesTemporales(series: any[]): any[] {
    return series.sort((a, b) => 
      new Date(a.fechaHoraInicioRegistro).getTime() - new Date(b.fechaHoraInicioRegistro).getTime()
    )
  }

  // ==========================================
  // PASO 60: RECHAZAR EVENTO SISMICO
  // ==========================================

  /**
   * Paso 60 del CU: Rechazar evento sísmico
   * Cambia el estado a rechazado
   * @param eventoId - ID del evento
   */
  async rechazarEventoSismico(eventoId: number | string): Promise<void> {
    const identificador = String(eventoId)
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
  // FLUJO ALTERNATIVO: CONFIRMAR EVENTO SISMICO
  // ==========================================

  /**
   * Flujo alternativo: Confirmar evento sísmico
   * Cambia el estado a confirmado
   * @param eventoId - ID del evento
   */
  async confirmarEventoSismico(eventoId: number | string): Promise<void> {
    const identificador = String(eventoId)
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
   * Flujo alternativo: Derivar evento sísmico a experto
   * Cambia el estado a derivado_experto
   * @param eventoId - ID del evento
   */
  async derivarEventoSismico(eventoId: number | string): Promise<void> {
    const identificador = String(eventoId)
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

  // ==========================================
  // PASO 73: FIN DEL CASO DE USO
  // ==========================================

  /**
   * Paso 73 del CU: Finalizar caso de uso
   * Limpia el estado del gestor
   */
  finCU(): void {
    this.eventoSeleccionado = null
    this.fechaHoraActual = null
  }
}
