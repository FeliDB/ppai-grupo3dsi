import CambioEstado from "./CambioEstado";
import Empleado from "./Empleado";
import Estado from "./Estado";
import { ESTADOS } from "../data/estados";

// Forward declaration para evitar dependencia circular
type EventoSismicoType = {
  setCambioEstado(cambio: CambioEstado): void;
  setEstadoActual(estado: Estado): void;
  getValorMagnitud(): number;
  getOrigenDeGeneracion(): any;
  getClasificacionSismo(): any;
}

/**
 * Estado concreto: BloqueadoEnRevision
 * 
 * COMPORTAMIENTO:
 * - Estado al que transiciona un evento cuando el AS lo selecciona para revisión
 * - Permite las acciones finales del caso de uso: rechazar, confirmar, derivar
 * - Valida que los datos estén completos antes de permitir la transición (paso 12 del CU)
 * 
 * TRANSICIONES VÁLIDAS:
 * - BloqueadoEnRevision -> Rechazado
 * - BloqueadoEnRevision -> Confirmado
 * - BloqueadoEnRevision -> DerivadoExperto
 */
export default class EstadoBloqueadoRevision extends Estado {
  constructor() {
    super("EventoSismico", "bloqueado_en_revision");
  }

  // ==========================================
  // MÉTODOS POLIMÓRFICOS SOBRESCRITOS
  // ==========================================

  /**
   * Rechazar evento (paso 11-13 del CU - flujo con rechazo)
   * Valida datos completos, actualiza estado a rechazado y registra fecha/responsable
   * @param contexto - EventoSismico que contiene este estado
   * @param fechaHoraActual - Fecha y hora actual (fecha de revisión)
   * @param empleado - Empleado logueado (responsable de la revisión)
   */
  public rechazar(contexto: EventoSismicoType, fechaHoraActual: Date, empleado: Empleado): void {
    // Paso 12: Validar que exista magnitud, alcance y origen de generación
    if (!this.validarDatosCompletos(contexto)) {
      throw new Error("No se puede rechazar: faltan datos obligatorios (magnitud, alcance u origen de generación)");
    }

    // Paso 13: Actualizar estado a rechazado con fecha y responsable
    const nuevoEstado = ESTADOS.rechazado;
    const nuevoCambio = new CambioEstado(nuevoEstado, fechaHoraActual, null, empleado);
    
    contexto.setCambioEstado(nuevoCambio);
    contexto.setEstadoActual(nuevoEstado);
  }

  /**
   * Confirmar evento (flujo alternativo - confirmar)
   * Valida datos completos, actualiza estado a confirmado y registra fecha/responsable
   * @param contexto - EventoSismico que contiene este estado
   * @param fechaHoraActual - Fecha y hora actual (fecha de revisión)
   * @param empleado - Empleado logueado (responsable de la revisión)
   */
  public confirmar(contexto: EventoSismicoType, fechaHoraActual: Date, empleado: Empleado): void {
    // Validar que exista magnitud, alcance y origen de generación
    if (!this.validarDatosCompletos(contexto)) {
      throw new Error("No se puede confirmar: faltan datos obligatorios (magnitud, alcance u origen de generación)");
    }

    const nuevoEstado = ESTADOS.confirmado;
    const nuevoCambio = new CambioEstado(nuevoEstado, fechaHoraActual, null, empleado);
    
    contexto.setCambioEstado(nuevoCambio);
    contexto.setEstadoActual(nuevoEstado);
  }

  /**
   * Derivar a experto (flujo alternativo - solicitar revisión a experto)
   * Valida datos completos, actualiza estado a derivado_experto y registra fecha/responsable
   * @param contexto - EventoSismico que contiene este estado
   * @param fechaHoraActual - Fecha y hora actual (fecha de revisión)
   * @param empleado - Empleado logueado (responsable de la revisión)
   */
  public derivarAExperto(contexto: EventoSismicoType, fechaHoraActual: Date, empleado: Empleado): void {
    // Validar que exista magnitud, alcance y origen de generación
    if (!this.validarDatosCompletos(contexto)) {
      throw new Error("No se puede derivar: faltan datos obligatorios (magnitud, alcance u origen de generación)");
    }

    const nuevoEstado = ESTADOS.derivado_experto;
    const nuevoCambio = new CambioEstado(nuevoEstado, fechaHoraActual, null, empleado);
    
    contexto.setCambioEstado(nuevoCambio);
    contexto.setEstadoActual(nuevoEstado);
  }

  // ==========================================
  // MÉTODOS DE CONSULTA DE ESTADO
  // ==========================================

  public esAutoDetectado(): boolean {
    return false;
  }

  public esPendienteDeRevision(): boolean {
    return false;
  }

  public esConfirmado(): boolean {
    return false;
  }

  public esRechazado(): boolean {
    return false;
  }

  public esDerivadoExperto(): boolean {
    return false;
  }

  public esBloqueadoEnRevision(): boolean {
    return true;
  }
}
