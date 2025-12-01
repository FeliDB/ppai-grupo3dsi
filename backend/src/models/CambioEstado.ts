import { Estado } from "./Estado"; 
import Usuario from "./Usuario";

export default class CambioEstado {
  private fechaHoraInicio: Date;
  private fechaHoraFin: Date | null;
  private estado: Estado;
  private empleadoResponsable: Usuario | null;

  constructor(
    estado: Estado,
    fechaHoraInicio: Date,
    fechaHoraFin: Date | null,
    empleadoResponsable: Usuario | null = null
  ) {
    this.estado = estado;
    this.fechaHoraInicio = fechaHoraInicio;
    this.fechaHoraFin = fechaHoraFin; 
    this.empleadoResponsable = empleadoResponsable;
  }

  // ==========================================
  // MÉTODOS DEL DIAGRAMA DE SECUENCIA
  // ==========================================

  public getFechaHoraFin(): Date | null {
    return this.fechaHoraFin;
  }

  public getEstado(): Estado {
    return this.estado;
  }

   public getFechaHoraInicio(): Date | null {
    return this.fechaHoraInicio;
  }

  /**
   * Paso 103 del diagrama: Verifica si es el estado actual.
   * Si no tiene fecha de fin, significa que sigue activo.
   */
  public esActual(): boolean {
    return this.fechaHoraFin === null;
  }

  /**
   * Se llama cuando el evento cambia de estado nuevamente,
   * para cerrar este registro histórico.
   */
  public setFechaHoraFin(horaFin: Date): void {
    this.fechaHoraFin = horaFin;
  }
}