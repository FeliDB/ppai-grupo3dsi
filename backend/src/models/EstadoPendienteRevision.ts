import { Estado, EventoSismicoType } from "./Estado";
import EstadoBloqueadoRevision from "./EstadoBloqueadoRevision";
import CambioEstado from "./CambioEstado";

export default class EstadoPendienteDeRevision extends Estado {

  constructor() {
    super("EventoSismico", "pendiente_de_revision");
  }

  public override esPendienteDeRevision(): boolean {
    return true;
  }

  // Implementación para cumplir con tu diagrama de secuencia
  public override crearEstadoSiguiente(): Estado {
    return new EstadoBloqueadoRevision();
  }

  public override bloquear(contexto: EventoSismicoType, fechaHoraActual: Date): void {
    // 1. Definimos el siguiente estado
    const nuevoEstado = this.crearEstadoSiguiente();

    // 2. Ejecutamos la transición centralizada
    this.hacerTransicion(contexto, nuevoEstado, fechaHoraActual);
  }

  /**
   * Crea una nueva instancia de CambioEstado con este estado.
   */
  public crearCambioEstado(fechaHoraInicio: Date): CambioEstado {
    return new CambioEstado(this, fechaHoraInicio, null);
  }
}