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
      // Usamos el getter de CambioEstado para obtener la fecha inicio
      const fechaInicio = cambioEstado.getFechaHoraInicio();
      if(fechaInicio) {
          estadoActualCambio.setFechaHoraFin(fechaInicio);
      }
    }

    this.cambioEstado.push(cambioEstado)
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
  // DELEGACIÓN AL STATE (Aquí estaban los errores)
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
      alcance: this.alcanceSismo?.getNombre() || null,
      origenDeGeneracion: this.origenDeGeneracion?.getNombre() || null
    };
  }

  public buscarSeriesTemporales(): SerieTemporal[] {
    return this.serieTemporal;
  }
}