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
 * Estado concreto: AutoDetectado
 * 
 * COMPORTAMIENTO:
 * - Puede transicionar a BloqueadoEnRevision cuando el AS selecciona un evento
 * - No puede rechazar, confirmar ni derivar directamente
 * 
 * TRANSICIONES VÁLIDAS: AutoDetectado -> BloqueadoEnRevision
 */
export default class EstadoAutoDetectado extends Estado {
  constructor() {
    super("EventoSismico", "auto_detectado");
  }

  // ==========================================
  // MÉTODOS POLIMÓRFICOS SOBRESCRITOS
  // ==========================================

  /**
   * Permite bloquear el evento para revisión (paso 4 del CU)
   * @param contexto - EventoSismico que contiene este estado
   * @param fechaHoraActual - Fecha y hora actual del sistema
   * @param empleado - Empleado logueado que realiza la acción
   */
  public bloquear(contexto: EventoSismicoType, fechaHoraActual: Date, empleado: Empleado): void {
    // Crear nuevo CambioEstado con estado BloqueadoEnRevision
    const nuevoEstado = ESTADOS.bloqueado_en_revision;
    const nuevoCambio = new CambioEstado(nuevoEstado, fechaHoraActual, null, empleado);
    
    // Actualizar el contexto
    contexto.setCambioEstado(nuevoCambio);
    contexto.setEstadoActual(nuevoEstado);
  }

  // ==========================================
  // MÉTODOS DE CONSULTA DE ESTADO
  // ==========================================

  public esAutoDetectado(): boolean {
    return true;
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
    return false;
  }
}
