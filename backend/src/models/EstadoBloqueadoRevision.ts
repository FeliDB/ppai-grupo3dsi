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
    // Validación simplificada: solo verificar magnitud (los demás datos están en BD)
    if (contexto.getValorMagnitud() === null || contexto.getValorMagnitud() === undefined) {
      throw new Error("No se puede rechazar: falta la magnitud.");
    }

    const nuevoEstado = new EstadoRechazado();
    this.hacerTransicion(contexto, nuevoEstado, fechaHoraActual);
  }

  // -------------------------------------------------------
  // TRANSICIÓN 2: Confirmar
  // -------------------------------------------------------
  public override confirmar(contexto: EventoSismicoType, fechaHoraActual: Date): void {
    // Validación simplificada: solo verificar magnitud (los demás datos están en BD)
    if (contexto.getValorMagnitud() === null || contexto.getValorMagnitud() === undefined) {
      throw new Error("No se puede confirmar: falta la magnitud.");
    }

    const nuevoEstado = new EstadoConfirmado();
    this.hacerTransicion(contexto, nuevoEstado, fechaHoraActual);
  }

  // -------------------------------------------------------
  // TRANSICIÓN 3: Derivar
  // -------------------------------------------------------
  public override derivarAExperto(contexto: EventoSismicoType, fechaHoraActual: Date): void {
    // Validación simplificada: solo verificar magnitud (los demás datos están en BD)
    if (contexto.getValorMagnitud() === null || contexto.getValorMagnitud() === undefined) {
      throw new Error("No se puede derivar: falta la magnitud.");
    }

    const nuevoEstado = new EstadoDerivadoExperto();
    this.hacerTransicion(contexto, nuevoEstado, fechaHoraActual);
  }
}
