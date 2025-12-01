import Estado from "./Estado";

export default class EstadoRechazado extends Estado {
  constructor() {
    super("EventoSismico", "rechazado");
  }

  esAutoDetectado(): boolean {
    return false;
  }

  esPendienteDeRevision(): boolean {
    return false;
  }

  esConfirmado(): boolean {
    return false;
  }

  esRechazado(): boolean {
    return true;
  }

  esDerivadoExperto(): boolean {
    return false;
  }

  esBloqueadoEnRevision(): boolean {
    return false;
  }
}
