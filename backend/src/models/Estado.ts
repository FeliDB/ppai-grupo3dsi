import CambioEstado from "./CambioEstado"
import Empleado from "./Empleado"

// Forward declaration para evitar dependencia circular
type EventoSismicoType = {
  setCambioEstado(cambio: CambioEstado): void;
  setEstadoActual(estado: Estado): void;
  getValorMagnitud(): number;
  getOrigenDeGeneracion(): any;
  getClasificacionSismo(): any;
}

/**
 * Clase abstracta Estado - Patrón State (GoF)
 * 
 * PROBLEMA QUE RESUELVE:
 * Permite que un objeto (EventoSismico) altere su comportamiento cuando su estado interno cambia.
 * El objeto parecerá cambiar de clase, delegando el comportamiento específico a los estados concretos.
 * 
 * JUSTIFICACIÓN:
 * - Un evento sísmico tiene múltiples estados con comportamientos diferentes
 * - Las transiciones entre estados tienen reglas específicas (ej: solo se puede bloquear desde auto_detectado o pendiente_de_revision)
 * - El patrón State encapsula estas reglas en cada estado concreto, evitando condicionales complejos
 */
export default abstract class Estado {
  private ambito: string
  private nombreEstado: string

  constructor(
    ambito: string,
    nombreEstado: string
  ) {
    this.ambito = ambito
    this.nombreEstado = nombreEstado
  }

  // ==========================================
  // GETTERS - Visibilidad: public
  // ==========================================
  
  public getAmbito(): string {
    return this.ambito
  }

  public getNombreEstado(): string {
    return this.nombreEstado
  }

  // ==========================================
  // MÉTODOS DE CONSULTA DE ESTADO - Visibilidad: public
  // Retorno: boolean
  // ==========================================
  
  public esAutoDetectado(): boolean {
    return this.nombreEstado === "auto_detectado"
  }

  public esPendienteDeRevision(): boolean {
    return this.nombreEstado === "pendiente_de_revision"
  }

  public esConfirmado(): boolean {
    return this.nombreEstado === "confirmado"
  }
  
  public esRechazado(): boolean {
    return this.nombreEstado === "rechazado"
  }

  public esDerivadoExperto(): boolean {
    return this.nombreEstado === "derivado_experto"
  }

  public esBloqueadoEnRevision(): boolean {
    return this.nombreEstado === "bloqueado_en_revision"
  }

  public esAmbito(ambito: string): boolean {
    return this.ambito === ambito
  }

  public esAmbitoEventoSismico(): boolean {
    return this.ambito === "EventoSismico"
  }

  // ==========================================
  // MÉTODOS POLIMÓRFICOS DEL PATRÓN STATE
  // Definen el comportamiento de transición de cada estado
  // Visibilidad: public
  // Parámetros: contexto (EventoSismico), fechaHoraActual (Date), empleado (Empleado)
  // Retorno: void (mutan el estado del contexto) o lanzan Error si transición inválida
  // ==========================================

  /**
   * Método polimórfico: bloquear
   * Permite la transición al estado "bloqueado_en_revision"
   * Por defecto lanza error - solo estados válidos sobrescriben
   */
  public bloquear(contexto: EventoSismicoType, fechaHoraActual: Date, empleado: Empleado): void {
    throw new Error(`No se puede bloquear un evento en estado ${this.nombreEstado}`)
  }

  /**
   * Método polimórfico: rechazar
   * Permite la transición al estado "rechazado"
   * Solo válido desde estado "bloqueado_en_revision"
   */
  public rechazar(contexto: EventoSismicoType, fechaHoraActual: Date, empleado: Empleado): void {
    throw new Error(`No se puede rechazar un evento en estado ${this.nombreEstado}`)
  }

  /**
   * Método polimórfico: confirmar
   * Permite la transición al estado "confirmado"
   * Solo válido desde estado "bloqueado_en_revision"
   */
  public confirmar(contexto: EventoSismicoType, fechaHoraActual: Date, empleado: Empleado): void {
    throw new Error(`No se puede confirmar un evento en estado ${this.nombreEstado}`)
  }

  /**
   * Método polimórfico: derivarAExperto
   * Permite la transición al estado "derivado_experto"
   * Solo válido desde estado "bloqueado_en_revision"
   */
  public derivarAExperto(contexto: EventoSismicoType, fechaHoraActual: Date, empleado: Empleado): void {
    throw new Error(`No se puede derivar a experto un evento en estado ${this.nombreEstado}`)
  }

  /**
   * Método polimórfico: validarDatosCompletos
   * Valida que el evento tenga magnitud, alcance y origen de generación
   * Usado antes de confirmar/rechazar/derivar (paso 12 del CU)
   */
  public validarDatosCompletos(contexto: EventoSismicoType): boolean {
    const magnitud = contexto.getValorMagnitud()
    const origen = contexto.getOrigenDeGeneracion()
    const clasificacion = contexto.getClasificacionSismo()
    
    return magnitud !== null && magnitud !== undefined &&
           origen !== null && origen !== undefined &&
           clasificacion !== null && clasificacion !== undefined
  }
}

export { Estado }
