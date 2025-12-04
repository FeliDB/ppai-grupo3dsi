import CambioEstado from "./CambioEstado"
import ClasificacionSismo from "./ClasificacionSismo"
import Usuario from "./Usuario" // MODIFICADO: Reemplazamos Empleado con Usuario
import EstacionSismologica from "./EstacionSismologica"
import { Estado } from "./Estado"
import MagnitudRichter from "./MagnitudRichter"
import OrigenDeGeneracion from "./OrigenDeGeneracion"
import SerieTemporal from "./SerieTemporal"
import AlcanceSismo from "./AlcanceSismo"

// IMPORTS DE ESTADOS CONCRETOS
import EstadoAutoDetectado from "./EstadoAutoDetectado"
import EstadoAutoConfirmado from "./EstadoAutoConfirmado"
import EstadoPendienteRevision from "./EstadoPendienteRevision"

export default class EventoSismico {
  private static contador = 1

  private id: string
  private fechaHoraOcurrencia: Date
  private latitudEpicentro: number
  private latitudHipocentro: number
  private longitudEpicentro: number
  private longitudHipocentro: number
  private profundidad: number
  private valorMagnitud: number
  
  private magnitud: MagnitudRichter
  private estadoActual: Estado
  private cambioEstado: CambioEstado[] = []
  // private clasificacionSismo: ClasificacionSismo // Lo tenías comentado
  private origenDeGeneracion: OrigenDeGeneracion
  private serieTemporal: SerieTemporal[]
  private alcanceSismo: AlcanceSismo | null = null

  // Cola de cambios de estado pendientes de persistir en BD
  public cambiosPendientesDeGuardar: CambioEstado[] = []

  constructor(
    fechaHoraOcurrencia: Date,
    latitudEpicentro: number,
    latitudHipocentro: number,
    longitudEpicentro: number,
    longitudHipocentro: number,
    valorMagnitud: number,
    profundidad: number,
    origenDeGeneracion: OrigenDeGeneracion,
    serieTemporal: SerieTemporal[]
  ) {
    const añoActual = new Date().getFullYear()
    this.id = `ES-${EventoSismico.contador.toString().padStart(3, '0')}-${añoActual}`
    EventoSismico.contador++

    this.fechaHoraOcurrencia = fechaHoraOcurrencia
    this.latitudEpicentro = latitudEpicentro
    this.latitudHipocentro = latitudHipocentro
    this.longitudEpicentro = longitudEpicentro
    this.longitudHipocentro = longitudHipocentro
    this.valorMagnitud = valorMagnitud
    this.profundidad = profundidad
    this.origenDeGeneracion = origenDeGeneracion
    this.serieTemporal = serieTemporal

    // 1. Instanciamos Estado Inicial
    let estadoInicialObj: Estado;
    if (valorMagnitud >= 4.0) {
        estadoInicialObj = new EstadoAutoConfirmado();
    } else {
        estadoInicialObj = new EstadoAutoDetectado();
    }

    // 2. Creamos el primer cambio de estado
    // Pasamos 'null' como 4to argumento. CambioEstado debe permitir (Usuario | null)
    const primerCambioEstado = new CambioEstado(
      estadoInicialObj,
      new Date(),
      null,
      null 
    )

    this.cambioEstado = [primerCambioEstado]
    this.estadoActual = estadoInicialObj; 

    this.magnitud = MagnitudRichter.setMagnitudRichter(valorMagnitud)
    // this.clasificacionSismo = ClasificacionSismo.setClasificacionSismo(profundidad)
  }

  // ==========================================
  // GETTERS
  // ==========================================
  
  getId() { return this.id }
  getFechaHoraOcurrencia() { return this.fechaHoraOcurrencia }
  getValorMagnitud() { return this.valorMagnitud }
  getMagnitud(): number { return this.valorMagnitud }
  getProfundidad() { return this.profundidad }
  getOrigenDeGeneracion(): OrigenDeGeneracion { return this.origenDeGeneracion }
  getLatitudEpicentro() { return this.latitudEpicentro }
  getLatitudHipocentro() { return this.latitudHipocentro }
  getLongitudEpicentro() { return this.longitudEpicentro }
  getLongitudHipocentro() { return this.longitudHipocentro }
  
  getDatosPrincipales() {
    return {
      id: this.id,
      fechaHoraOcurrencia: this.fechaHoraOcurrencia,
      latitudEpicentro: this.latitudEpicentro,
      latitudHipocentro: this.latitudHipocentro,
      longitudEpicentro: this.longitudEpicentro,
      longitudHipocentro: this.longitudHipocentro,
      valorMagnitud: this.valorMagnitud,
      estadoActualNombre: this.estadoActual.getNombreEstado(),
      cambioEstado: this.cambioEstado
    }
  }

  // ==========================================
  // MÉTODOS DE SOPORTE AL STATE
  // ==========================================

  public agregarCambioEstado(cambioEstado: CambioEstado): void {
    const estadoActualCambio = this.cambioEstado.find(c => c.esActual())
    
    if (estadoActualCambio) {
      const fechaInicio = cambioEstado.getFechaHoraInicio();
      if (fechaInicio) {
        estadoActualCambio.setFechaHoraFin(fechaInicio);
        // Marcar el anterior como modificado para actualizarlo en BD
        this.cambiosPendientesDeGuardar.push(estadoActualCambio);
      }
    }

    this.cambioEstado.push(cambioEstado)
    // Marcar el nuevo para insertarlo en BD
    this.cambiosPendientesDeGuardar.push(cambioEstado);
  }

  public setEstadoActual(estado: Estado): void {
    this.estadoActual = estado
  }

  public getEstadoActual(): Estado {
    return this.estadoActual
  }

  getHistorialEstados(): CambioEstado[] {
    return this.cambioEstado
  }

  // ==========================================
  // TIMER (Sistema)
  // ==========================================

  actualizarAPendienteRevision(fechaActual: Date) {
    const haceCuanto = fechaActual.getTime() - this.getFechaHoraOcurrencia().getTime()
    const cincoMinutos = 5 * 60 * 1000 

    if (this.getEstadoActual().esAutoDetectado() && haceCuanto >= cincoMinutos) {
      
      const nuevoEstado = new EstadoPendienteRevision();
      // Pasamos null como usuario
      const nuevoCambio = new CambioEstado(nuevoEstado, fechaActual, null, null);

      this.agregarCambioEstado(nuevoCambio);
      this.setEstadoActual(nuevoEstado);
    }
  }

  // ==========================================
  // DELEGACIÓN AL STATE 
  // ==========================================


  public bloquear(fechaHoraActual: Date): void {
    this.estadoActual.bloquear(this, fechaHoraActual);
  }

  public rechazar(fechaHoraActual: Date): void {
    this.estadoActual.rechazar(this, fechaHoraActual);
  }

  public confirmar(fechaHoraActual: Date): void {
    this.estadoActual.confirmar(this, fechaHoraActual);
  }

  public derivarAExperto(fechaHoraActual: Date): void {
    this.estadoActual.derivarAExperto(this, fechaHoraActual);
  }

  // ==========================================
  // CONSULTAS
  // ==========================================

  public esAutodetectado(): boolean { return this.estadoActual.esAutoDetectado(); }
  public esPendienteDeRevision(): boolean { return this.estadoActual.esPendienteDeRevision(); }
  public esBloqueadoEnRevision(): boolean { return this.estadoActual.esBloqueadoEnRevision(); }
  public esConfirmado(): boolean { return this.estadoActual.esConfirmado(); }
  public esRechazado(): boolean { return this.estadoActual.esRechazado(); }
  public esDerivadoExperto(): boolean { return this.estadoActual.esDerivadoExperto(); }

  // ==========================================
  // OTROS
  // ==========================================

  public getSerieTemporal(): SerieTemporal[] { return this.serieTemporal; }
  public getAlcanceSismo(): AlcanceSismo | null { return this.alcanceSismo; }
  public setAlcanceSismo(alcance: AlcanceSismo): void { this.alcanceSismo = alcance; }

  public buscarUltimoCambioEstado(): CambioEstado | undefined {
    if (this.cambioEstado.length === 0) return undefined;
    return this.cambioEstado[this.cambioEstado.length - 1];
  }

  public buscarDatosSismicos(): object {
    return {
      id: this.id,
      identificadorEvento: this.id,
      fechaHoraOcurrencia: this.fechaHoraOcurrencia,
      latitudEpicentro: this.latitudEpicentro,
      latitudHipocentro: this.latitudHipocentro,
      longitudEpicentro: this.longitudEpicentro,
      longitudHipocentro: this.longitudHipocentro,
      valorMagnitud: this.valorMagnitud,
      profundidad: this.profundidad,
      estadoActualNombre: this.estadoActual.getNombreEstado(),
      origenGeneracion: this.origenDeGeneracion?.getNombre() || null,
      alcance: this.alcanceSismo?.getNombre() || null
    };
  }

  public buscarSeriesTemporales(): SerieTemporal[] {
    return this.serieTemporal;
  }

  /**
   * Obtiene el nombre de la clasificación del sismo basándose en la profundidad.
   * Delega a ClasificacionSismo para determinar si es superficial, intermedio o profundo.
   */
  public getClasificacionSismo(): string {
    const clasificacion = ClasificacionSismo.setClasificacionSismo(this.profundidad);
    return clasificacion.getNombre();
  }

  /**
   * Clasifica las series temporales por estación sismológica.
   * Agrupa las series según la estación del sismógrafo que las registró.
   * Llama al caso de uso Generar Sismograma para cada estación.
   * @returns Mapa de series temporales agrupadas por nombre de estación
   */
  public clasificarPorEstacion(): Map<string, SerieTemporal[]> {
    const seriesPorEstacion = new Map<string, SerieTemporal[]>();

    for (const serie of this.serieTemporal) {
      const sismografo = serie.getSismografo();
      const estacion = sismografo.getEstacionSismologica();
      const nombreEstacion = estacion.getNombre();

      if (!seriesPorEstacion.has(nombreEstacion)) {
        seriesPorEstacion.set(nombreEstacion, []);
      }
      seriesPorEstacion.get(nombreEstacion)!.push(serie);
    }

    // Llamar al caso de uso generar sismograma para cada estación
    this.generarSismograma(seriesPorEstacion);

    return seriesPorEstacion;
  }

  /**
   * Llama al caso de uso Generar Sismograma.
   * @param seriesPorEstacion - Series temporales clasificadas por estación
   */
  private generarSismograma(seriesPorEstacion: Map<string, SerieTemporal[]>): void {
    // TODO: Implementar llamada al caso de uso CU Generar Sismograma
    // Por cada estación, se genera el sismograma correspondiente
    seriesPorEstacion.forEach((series, nombreEstacion) => {
      console.log(`Generando sismograma para estación: ${nombreEstacion} con ${series.length} series`);
      // Aquí se llamaría al gestor del caso de uso generar sismograma
    });
  }

  // ==========================================
  // FACTORY: RESTAURAR DESDE BASE DE DATOS
  // ==========================================

  /**
   * Método estático (Factory) para reconstruir un EventoSismico desde la BD
   * No genera ID nuevo ni historial inicial - usa los datos existentes
   * @param id - ID del evento en BD
   * @param datos - Datos crudos de la query
   * @param estadoActual - Instancia del Estado concreto
   * @returns EventoSismico reconstruido
   */
  public static restaurarDesdeBD(
    id: number,
    datos: any,
    estadoActual: Estado
  ): EventoSismico {
    // Creamos el objeto sin usar el constructor normal para no generar ID nuevo ni historial inicial
    const evento = Object.create(EventoSismico.prototype) as EventoSismico;
    
    evento.id = String(id);
    evento.fechaHoraOcurrencia = new Date(datos.fechaHoraOcurrencia);
    evento.latitudEpicentro = datos.latitudEpicentro;
    evento.latitudHipocentro = datos.latitudHipocentro;
    evento.longitudEpicentro = datos.longitudEpicentro;
    evento.longitudHipocentro = datos.longitudHipocentro;
    evento.valorMagnitud = datos.valorMagnitud;
    evento.profundidad = datos.profundidad;
    evento.origenDeGeneracion = null!;
    evento.serieTemporal = [];
    evento.alcanceSismo = null;
    
    evento.estadoActual = estadoActual;
    evento.cambioEstado = [];
    evento.cambiosPendientesDeGuardar = []; // Cola vacía para guardar solo lo nuevo
    evento.magnitud = MagnitudRichter.setMagnitudRichter(datos.valorMagnitud);
    
    return evento;
  }

  /**
   * Limpia la cola de cambios pendientes después de persistir
   */
  public limpiarCambiosPendientes(): void {
    this.cambiosPendientesDeGuardar = [];
  }

  /**
   * Obtiene los cambios pendientes de persistir
   */
  public getCambiosPendientes(): CambioEstado[] {
    return this.cambiosPendientesDeGuardar;
  }
}