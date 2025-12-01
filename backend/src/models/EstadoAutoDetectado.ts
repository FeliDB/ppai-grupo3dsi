import { Estado, EventoSismicoType } from "./Estado";
import EstadoBloqueadoRevision from "./EstadoBloqueadoRevision";

export default class EstadoAutoDetectado extends Estado {
  constructor() {
    super("EventoSismico", "auto_detectado");
  }

  public override esAutoDetectado(): boolean {
    return true;
  }

  // También va a Bloqueado, así que reutilizamos la lógica
  public override crearEstadoSiguiente(): Estado {
    return new EstadoBloqueadoRevision();
  }

  public override bloquear(contexto: EventoSismicoType, fechaHoraActual: Date): void {
    const nuevoEstado = this.crearEstadoSiguiente();
    this.hacerTransicion(contexto, nuevoEstado, fechaHoraActual);
  }
}