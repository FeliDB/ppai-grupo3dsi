import { Estado, EventoSismicoType } from "./Estado";
import EstadoRechazado from "./EstadoRechazado";
import EstadoConfirmado from "./EstadoConfirmado";
import EstadoDerivadoExperto from "./EstadoDerivadoExperto";

export default class EstadoBloqueadoRevision extends Estado {
  constructor() {
    super("EventoSismico", "bloqueado_en_revision");
  }

  public override esBloqueadoEnRevision(): boolean {
    return true;
  }

  // -------------------------------------------------------
  // TRANSICIÓN 1: Rechazar
  // -------------------------------------------------------
  public override rechazar(contexto: EventoSismicoType, fechaHoraActual: Date): void {
    if (!this.validarDatosCompletos(contexto)) {
      throw new Error("No se puede rechazar: faltan datos obligatorios.");
    }

    // Instanciamos directamente el destino
    const nuevoEstado = new EstadoRechazado();
    
    // Delegamos la "carpintería" al padre
    this.hacerTransicion(contexto, nuevoEstado, fechaHoraActual);
  }

  // -------------------------------------------------------
  // TRANSICIÓN 2: Confirmar
  // -------------------------------------------------------
  public override confirmar(contexto: EventoSismicoType, fechaHoraActual: Date): void {
    if (!this.validarDatosCompletos(contexto)) {
      throw new Error("No se puede confirmar: faltan datos obligatorios.");
    }

    const nuevoEstado = new EstadoConfirmado();
    this.hacerTransicion(contexto, nuevoEstado, fechaHoraActual);
  }

  // -------------------------------------------------------
  // TRANSICIÓN 3: Derivar
  // -------------------------------------------------------
  public override derivarAExperto(contexto: EventoSismicoType, fechaHoraActual: Date): void {
    if (!this.validarDatosCompletos(contexto)) {
      throw new Error("No se puede derivar: faltan datos obligatorios.");
    }

    const nuevoEstado = new EstadoDerivadoExperto();
    this.hacerTransicion(contexto, nuevoEstado, fechaHoraActual);
  }
}
