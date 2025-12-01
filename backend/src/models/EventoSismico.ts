import { ESTADOS } from "../data/estados"
import CambioEstado from "./CambioEstado"
import ClasificacionSismo from "./ClasificacionSismo"
import Empleado from "./Empleado"
import EstacionSismologica from "./EstacionSismologica"
import Estado from "./Estado"
import MagnitudRichter from "./MagnitudRichter"
import OrigenDeGeneracion from "./OrigenDeGeneracion"
import SerieTemporal from "./SerieTemporal"
import AlcanceSismo from "./AlcanceSismo"

type SeriesPorEstacion = {
  estacion: EstacionSismologica;
  seriesTemporales: SerieTemporal[];
};

type DatosPrincipales = {
  id: string;
  fechaHoraOcurrencia: Date;
  latitudEpicentro: number;
  longitudEpicentro: number;
  latitudHipocentro: number;
  longitudHipocentro: number;
  valorMagnitud: number;
};

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
  private clasificacionSismo: ClasificacionSismo
  private origenDeGeneracion: OrigenDeGeneracion
  private serieTemporal: SerieTemporal[]
  private alcanceSismo: AlcanceSismo | null = null


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

    // Generar id (formato: ES-001-{añoActual})
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

    // RN: Si luego del procesamiento con machine learning de los datos sísmicos se estima una
    // magnitud mayor o igual a 4.0 en la escala Richter, el sistema debe registrar
    // automáticamente el evento sísmico como auto confirmado, de lo contrario debe
    // registrarlo como auto detectado.
    const estado = valorMagnitud >= 4.0 ? ESTADOS.auto_confirmado : ESTADOS.auto_detectado

    const estadoInicial = new CambioEstado(
      estado,
      new Date(),
      null,
      null
    )

    this.cambioEstado = [estadoInicial]
    this.estadoActual = estadoInicial.getEstado()

    this.magnitud = MagnitudRichter.setMagnitudRichter(valorMagnitud)
    this.clasificacionSismo = ClasificacionSismo.setClasificacionSismo(profundidad)
  }

  getId() {
    return this.id
  }

  getFechaHoraOcurrencia() {
    return this.fechaHoraOcurrencia
  }

  getValorMagnitud() {
    return this.valorMagnitud
  }

  getMagnitud() {
    return this.magnitud
  }

  getProfundidad() {
    return this.profundidad
  }

  getClasificacionSismo(): ClasificacionSismo {
    return this.clasificacionSismo
  }

  getOrigenDeGeneracion(): OrigenDeGeneracion {
    return this.origenDeGeneracion
  }

  getLatitudEpicentro() {
    return this.latitudEpicentro
  }

  getLatitudHipocentro() {
    return this.latitudHipocentro
  }

  getLongitudEpicentro() {
    return this.longitudEpicentro
  }

  getLongitudHipocentro() {
    return this.longitudHipocentro
  }

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

  // getAlcances() {
  //   return this.alcances
  // }

  // ==========================================
  // MÉTODOS SETTERS PARA PATRÓN STATE
  // Permiten que los estados concretos modifiquen el contexto
  // ==========================================

  /**
   * Agrega un nuevo cambio de estado al historial
   * Finaliza el estado actual antes de agregar el nuevo
   * @param cambio - Nuevo CambioEstado a agregar
   */
  public setCambioEstado(cambio: CambioEstado): void {
    // Finalizar el estado actual
    const estadoActualCambio = this.cambioEstado.find(c => c.esEstadoActual())
    if (estadoActualCambio) {
      estadoActualCambio.setFechaHoraFin(cambio.getFechaHoraInicio())
    }
    // Agregar el nuevo cambio
    this.cambioEstado.push(cambio)
  }

  /**
   * Actualiza el puntero al estado actual
   * @param estado - Nuevo estado actual
   */
  public setEstadoActual(estado: Estado): void {
    this.estadoActual = estado
  }

  public getEstadoActual(): Estado {
    return this.estadoActual
  }

  getHistorialEstados(): CambioEstado[] {
    return this.cambioEstado
  }

  getSerieTemporal(): SerieTemporal[] {
    return this.serieTemporal
  }

  cambiarEstadoA(nuevoEstado: Estado, empleado: Empleado | null = null) {
    const fechaHoraActual = new Date() // fecha actual

    // Si es estado actual lo finaliza (setea la fecha hora actual como fecha hora fin)
    const estadoActual = this.cambioEstado.find((estado) => estado.esEstadoActual())
    if (estadoActual) {
      estadoActual.setFechaHoraFin(fechaHoraActual)
    }

    // Genera una nueva instancia de CambioEstado y agrega el nuevo estado a la lista
    const cambioEstado = new CambioEstado(nuevoEstado, fechaHoraActual, null, empleado)
    this.cambioEstado.push(cambioEstado)
    this.setEstadoActual(nuevoEstado)
  }

  // ==========================================
  // MÉTODOS DE DELEGACIÓN AL PATRÓN STATE
  // El contexto (EventoSismico) delega las transiciones al estado actual
  // Esto implementa el polimorfismo del patrón State
  // ==========================================

  /**
   * Bloquear evento para revisión (paso 4 del CU)
   * DELEGA al estado actual - solo AutoDetectado y PendienteRevision permiten esta transición
   * @param fechaHoraActual - Fecha y hora del bloqueo
   * @param empleado - Empleado responsable
   */
  public bloquear(fechaHoraActual: Date, empleado: Empleado): void {
    // Delegación polimórfica al estado actual
    this.estadoActual.bloquear(this, fechaHoraActual, empleado)
  }

  /**
   * Rechazar evento (paso 11-13 del CU)
   * DELEGA al estado actual - solo BloqueadoEnRevision permite esta transición
   * @param fechaHoraActual - Fecha y hora del rechazo (fecha de revisión)
   * @param empleado - Empleado responsable de la revisión
   */
  public rechazar(fechaHoraActual: Date, empleado: Empleado): void {
    // Delegación polimórfica al estado actual
    this.estadoActual.rechazar(this, fechaHoraActual, empleado)
  }

  /**
   * Confirmar evento (flujo alternativo)
   * DELEGA al estado actual - solo BloqueadoEnRevision permite esta transición
   * @param fechaHoraActual - Fecha y hora de confirmación
   * @param empleado - Empleado responsable
   */
  public confirmar(fechaHoraActual: Date, empleado: Empleado): void {
    // Delegación polimórfica al estado actual
    this.estadoActual.confirmar(this, fechaHoraActual, empleado)
  }

  /**
   * Derivar a experto (flujo alternativo)
   * DELEGA al estado actual - solo BloqueadoEnRevision permite esta transición
   * @param fechaHoraActual - Fecha y hora de derivación
   * @param empleado - Empleado responsable
   */
  public derivarAExperto(fechaHoraActual: Date, empleado: Empleado): void {
    // Delegación polimórfica al estado actual
    this.estadoActual.derivarAExperto(this, fechaHoraActual, empleado)
  }

  // ==========================================
  // MÉTODOS AUXILIARES PRIVADOS
  // ==========================================

  private buscarUltimoCambioEstado(): CambioEstado | undefined {
    if (this.cambioEstado.length === 0) {
      return undefined;
    }
    return this.cambioEstado[this.cambioEstado.length - 1];
  }

  

  actualizarAPendienteRevision(fechaActual: Date) {
    const haceCuanto = fechaActual.getTime() - this.getFechaHoraOcurrencia().getTime() // Obtiene el tiempo que paso entre que se creo el evento y la fechaActual
    const cincoMinutos = 5 * 60 * 1000 // Conversion 5min

    // Si pasan 5min cambia el estado a "pendiente_de_revision"
    if (this.getEstadoActual().esAutoDetectado() && haceCuanto >= cincoMinutos) {
      // Al empleado le pasamos null porque lo hace el sistema automaticamente
      this.cambiarEstadoA(ESTADOS.pendiente_de_revision, null)
    }
  }

  // FIX: REVISAR 
  // NOTE: esta ok
  // WARN: esto trae el sismografo tambien y no hace falta
  // NOTE: en realidad esta bien que traiga el sismografo porque es un atributo de la serieTemporal
  // y no se especifica que datos se traen

  clasificarPorEstacion(series: SerieTemporal[]) {
    const seriesPorEstacion: SeriesPorEstacion[] = [];

    for (const serie of series) {
      // Ordenar muestras sismicas por fechaHoraMuestra
      serie.getDatos().muestrasSismicas.sort((a, b) =>
        a.getDatos().fechaHoraMuestra.getTime() - b.getDatos().fechaHoraMuestra.getTime()
      );

      const estacion = serie.getSismografo().getEstacionSismologica();
      const existente = seriesPorEstacion.find(
        e => e.estacion.getCodigoEstacion() === estacion.getCodigoEstacion()
      );

      if (existente) {
        existente.seriesTemporales.push(serie);
      } else {
        seriesPorEstacion.push({
          estacion,
          seriesTemporales: [serie]
        });
      }
    }

    // Ordenar las series temporales por fechaHoraInicioRegistroMuestras
    for (const grupo of seriesPorEstacion) {
      grupo.seriesTemporales.sort((a, b) =>
        a.getFechaHoraInicioRegistroMuestras().getTime() -
        b.getFechaHoraInicioRegistroMuestras().getTime()
      );
    }

    return seriesPorEstacion;
  }

  // ==========================================
  // MÉTODOS DE CONSULTA DE ESTADO (delegación)
  // ==========================================

  /** Paso 5 – Consulta directa desde Gestor */
  public esAutodetectado(): boolean {
    // Paso 6 – Delegación a Estado
    return this.estadoActual.esAutoDetectado();
  }

  /** Paso 7 – Consulta directa desde Gestor */
  public esPendienteDeRevision(): boolean {
    // Paso 8 – Delegación a Estado
    return this.estadoActual.esPendienteDeRevision();
  }

  public esBloqueadoEnRevision(): boolean {
    return this.estadoActual.esBloqueadoEnRevision();
  }

  public esConfirmado(): boolean {
    return this.estadoActual.esConfirmado();
  }

  public esRechazado(): boolean {
    return this.estadoActual.esRechazado();
  }

  public esDerivadoExperto(): boolean {
    return this.estadoActual.esDerivadoExperto();
  }

  // ==========================================
  // GETTERS PARA ALCANCE
  // ==========================================

  public getAlcanceSismo(): AlcanceSismo | null {
    return this.alcanceSismo;
  }

  public setAlcanceSismo(alcance: AlcanceSismo): void {
    this.alcanceSismo = alcance;
  }

/** Paso 9 – DTO con los campos principales */
  getDatosPrincipaless(): DatosPrincipales {
    return {
      id: this.id,
      fechaHoraOcurrencia: this.getFechaHoraOcurrenciaa(),
      latitudEpicentro: this.getLatitudEpicentroo(),
      longitudEpicentro: this.getLongitudEpicentroo(),
      latitudHipocentro: this.getLatitudHipocentroo(),
      longitudHipocentro: this.getLongitudHipocentroo(),
      valorMagnitud: this.getValorMagnitudd(),
    };
  }
  
// Métodos de acceso individuales (pasos 10–15)
  public getFechaHoraOcurrenciaa(): Date {
    return this.fechaHoraOcurrencia;
  }
  public getLatitudEpicentroo(): number {
    return this.latitudEpicentro;
  }
  public getLongitudEpicentroo(): number {
    return this.longitudEpicentro;
  }
  public getLatitudHipocentroo(): number {
    return this.latitudHipocentro;
  }
  public getLongitudHipocentroo(): number {
    return this.longitudHipocentro;
  }
  public getValorMagnitudd(): number {
    return this.valorMagnitud;
  }



}
